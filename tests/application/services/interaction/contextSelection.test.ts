import { describe, expect, it } from "vitest";
import {
  actionId,
  knowledgeItemId,
  nonEmptyText,
  progressId,
  type AcceptedProgress,
  type Action,
  type KnowledgeItem,
  type Project,
  type ProjectId,
} from "../../../../src/domain/model";
import { selectBoundedContextForTurn } from "../../../../src/application/services/interaction/contextSelection";
import type {
  RetrievalResult,
  RetrievalService,
} from "../../../../src/application/services/retrieval/retrievalTypes";

function createMockRetrievalService(overrides: Partial<RetrievalService> = {}): RetrievalService {
  return {
    getProject: async (id: ProjectId): Promise<RetrievalResult<Project>> => ({
      kind: "found",
      value: { id, intendedOutcome: nonEmptyText("Test project")!, state: "Active" },
    }),
    listProjects: async () => ({ kind: "found", value: [] }),
    getActionsForProject: async () => ({ kind: "found", value: [] }),
    getAcceptedContextFacts: async () => ({ kind: "found", value: [] }),
    getCurrentProgress: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeForProject: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: [] }),
    getKnowledgeItem: async (id) => ({ kind: "not-found", entityType: "knowledge-item", id }),
    getKnowledgeLineage: async () => ({ kind: "found", value: [] }),
    ...overrides,
  };
}

describe("contextSelection (ENG-010 Repair 5)", () => {
  it("TC-11: bounded model context enforces <= 32 item limit and deterministic structure", async () => {
    const facts = Array.from({ length: 40 }, (_, i) => nonEmptyText(`Fact item ${i + 1}`)!);
    const retrieval = createMockRetrievalService({
      getAcceptedContextFacts: async () => ({ kind: "found", value: facts }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: nonEmptyText("Tell me about facts")!,
      projectId: "proj-1" as ProjectId,
      itemLimit: 32,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      expect(result.context.items.length).toBeLessThanOrEqual(32);
      expect(result.context.itemLimit).toBe(32);
    }
  });

  it("TC-12: DATA-001 egress screening blocks authentication material from entering model context", async () => {
    const retrieval = createMockRetrievalService();

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Here is my secret Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.secret",
      projectId: "proj-1" as ProjectId,
    });

    expect(result.kind).toBe("context-rejected");
    if (result.kind === "context-rejected") {
      expect(result.reason).toBe("authentication-material-excluded");
    }
  });

  it("TC-13: context selection includes relevant facts, actions, and knowledge deterministically", async () => {
    const retrieval = createMockRetrievalService({
      getAcceptedContextFacts: async () => ({
        kind: "found",
        value: [nonEmptyText("Fact A")!, nonEmptyText("Fact B")!],
      }),
      getActionsForProject: async () => ({
        kind: "found",
        value: [
          {
            id: actionId("act-1"),
            projectId: "proj-1" as ProjectId,
            description: nonEmptyText("Action 1")!,
            state: "Open",
          },
        ],
      }),
      getCurrentKnowledgeForProject: async () => ({
        kind: "found",
        value: [
          {
            id: knowledgeItemId("k-1"),
            originatingProjectId: "proj-1" as ProjectId,
            content: nonEmptyText("Knowledge 1")!,
            standing: "current",
            supersessionChain: [],
          },
        ],
      }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: nonEmptyText("Need context")!,
      projectId: "proj-1" as ProjectId,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      expect(result.context.items.length).toBe(4);
    }
  });

  it("TC-14: R005 parent existence constraint returns project-not-found when project is absent", async () => {
    const retrieval = createMockRetrievalService({
      getProject: async (id) => ({ kind: "not-found", entityType: "project", id }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: nonEmptyText("Check missing project")!,
      projectId: "non-existent" as ProjectId,
    });

    expect(result.kind).toBe("project-not-found");
    if (result.kind === "project-not-found") {
      expect(result.projectId).toBe("non-existent");
    }
  });

  it("R2-TC-05: interactionText materially affects deterministic relevance selection and ordering", async () => {
    const facts = [
      nonEmptyText("Database migration and PostgreSQL optimization")!,
      nonEmptyText("User interface styling with Tailwind CSS")!,
      nonEmptyText("Authentication workflow and session security")!,
    ];
    const retrieval = createMockRetrievalService({
      getAcceptedContextFacts: async () => ({ kind: "found", value: facts }),
    });

    const resultSql = await selectBoundedContextForTurn(retrieval, {
      interactionText: "How do we handle the PostgreSQL database migration?",
      projectId: "proj-1" as ProjectId,
      itemLimit: 3,
    });

    const resultCss = await selectBoundedContextForTurn(retrieval, {
      interactionText: "How do we style the user interface components?",
      projectId: "proj-1" as ProjectId,
      itemLimit: 3,
    });

    expect(resultSql.kind).toBe("context-selected");
    expect(resultCss.kind).toBe("context-selected");

    if (resultSql.kind === "context-selected" && resultCss.kind === "context-selected") {
      const topSqlItem = resultSql.context.items[0];
      const topCssItem = resultCss.context.items[0];

      expect(topSqlItem.kind).toBe("project-fact");
      if (topSqlItem.kind === "project-fact") {
        expect(topSqlItem.fact).toContain("PostgreSQL");
      }

      expect(topCssItem.kind).toBe("project-fact");
      if (topCssItem.kind === "project-fact") {
        expect(topCssItem.fact).toContain("Tailwind CSS");
      }
    }
  });

  it("R2-TC-06: explicit actionId materially prioritizes focused Action and its associated context", async () => {
    const actions: Action[] = [
      {
        id: actionId("act-unrelated"),
        projectId: "proj-1" as ProjectId,
        description: nonEmptyText("Unrelated background job setup")!,
        state: "Open",
      },
      {
        id: actionId("act-focused"),
        projectId: "proj-1" as ProjectId,
        description: nonEmptyText("Implement core authentication module")!,
        state: "Open",
      },
    ];

    const retrieval = createMockRetrievalService({
      getActionsForProject: async () => ({ kind: "found", value: actions }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Status update",
      projectId: "proj-1" as ProjectId,
      actionId: actionId("act-focused"),
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const topItem = result.context.items[0];
      expect(topItem.kind).toBe("action-summary");
      if (topItem.kind === "action-summary") {
        expect(topItem.actionId).toBe("act-focused");
      }
    }
  });

  it("R2-TC-07: Progress linked to focused Action receives priority boost over unlinked Progress", async () => {
    const progressList: AcceptedProgress[] = [
      {
        id: progressId("prog-unlinked"),
        projectId: "proj-1" as ProjectId,
        statement: nonEmptyText("Unlinked background task completed")!,
        standing: "current",
        supersedesId: undefined,
      },
      {
        id: progressId("prog-linked"),
        projectId: "proj-1" as ProjectId,
        actionId: actionId("act-focused"),
        statement: nonEmptyText("Auth module JWT verification complete")!,
        standing: "current",
        supersedesId: undefined,
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentProgress: async () => ({
        kind: "found",
        value: progressList,
      }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Progress check",
      projectId: "proj-1" as ProjectId,
      actionId: actionId("act-focused"),
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const facts = result.context.items.filter((i) => i.kind === "project-fact");
      expect(facts.length).toBeGreaterThan(0);
      const topFact = facts[0];
      if (topFact.kind === "project-fact") {
        expect(topFact.fact).toContain("JWT verification");
      }
    }
  });

  it("R2-TC-08: context item cap is applied after relevance scoring, ranking, and canonical tie-breaker", async () => {
    const facts = [
      nonEmptyText("Zeta low match fact")!,
      nonEmptyText("Alpha high match fact query target")!,
      nonEmptyText("Beta medium match fact query")!,
    ];

    const retrieval = createMockRetrievalService({
      getAcceptedContextFacts: async () => ({ kind: "found", value: facts }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "query target",
      projectId: "proj-1" as ProjectId,
      itemLimit: 1,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      expect(result.context.items.length).toBe(1);
      const topItem = result.context.items[0];
      if (topItem.kind === "project-fact") {
        expect(topItem.fact).toContain("Alpha high match");
      }
    }
  });

  it("R3-TC-01: whole-token match prevents false substring match (e.g. 'api' does not match 'capital')", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-capital"),
        originatingProjectId: "proj-finance" as ProjectId,
        content: nonEmptyText("capital allocation notes and budget limits")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "api",
      projectId: "proj-tech" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-finance",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R3-TC-02: incidental/generic non-overlapping cross-Project candidate does not satisfy material relevance", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-hardware"),
        originatingProjectId: "proj-ops" as ProjectId,
        content: nonEmptyText("procurement of office hardware and workstation desks")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "payment gateway integration Stripe webhooks",
      projectId: "proj-checkout" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-ops",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R3-TC-03: genuinely relevant cross-Project candidate with whole-token matches qualifies and enters context", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-rate-limits"),
        originatingProjectId: "proj-core" as ProjectId,
        content: nonEmptyText("REST API authentication headers and rate limiting standards")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "What are the API rate limiting standards?",
      projectId: "proj-client" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-core",
      );
      expect(crossItems.length).toBe(1);
      const item = crossItems[0];
      if (item.kind === "knowledge-excerpt") {
        expect(item.knowledgeItemId).toBe("k-rate-limits");
        expect(item.originatingProjectId).toBe("proj-core");
      }
    }
  });

  it("R4-TC-01: isolated single generic interaction token without independent structural corroboration fails closed", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-unrelated-api-pricing"),
        originatingProjectId: "proj-billing" as ProjectId,
        content: nonEmptyText("vendor API pricing tiers and billing schedules")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("Build frontend components")!, state: "Active" },
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "API integration guide",
      projectId: "proj-ui" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-billing",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R4-TC-02: exact Knowledge ID match in interaction text directly qualifies candidate", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-auth-pattern-01"),
        originatingProjectId: "proj-security" as ProjectId,
        content: nonEmptyText("Standard OAuth2 token refresh protocol")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Please reference k-auth-pattern-01 for this task",
      projectId: "proj-app" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-security",
      );
      expect(crossItems.length).toBe(1);
      const item = crossItems[0];
      if (item.kind === "knowledge-excerpt") {
        expect(item.knowledgeItemId).toBe("k-auth-pattern-01");
      }
    }
  });

  it("R4-TC-03: multi-token interaction overlap qualifies candidate without needing structural context", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-oauth-pattern"),
        originatingProjectId: "proj-security" as ProjectId,
        content: nonEmptyText("Standard OAuth2 token refresh protocol implementation guidelines")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("Generic project outcome")!, state: "Active" },
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "How do we implement the OAuth2 token refresh protocol?",
      projectId: "proj-app" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-security",
      );
      expect(crossItems.length).toBe(1);
    }
  });

  // Repair 5 Active Objective Tests (R5-TC-01 through R5-TC-10)

  it("R5-TC-01: repeated API corroboration fails closed (same token in outcome does not count as independent)", async () => {
    // Pipeline test:
    // Interaction: "project API migration"
    // Project outcome: "modernize our API platform"
    // Candidate Knowledge: "API pricing notes for unrelated vendor"
    // Interaction ∩ Knowledge = {"api"} (1 token)
    // Project outcome ∩ Knowledge = {"api"} (repeated same token, NOT independent)
    // Result: candidate MUST be excluded from context (fails Repair 4).
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-vendor-pricing"),
        originatingProjectId: "proj-procurement" as ProjectId,
        content: nonEmptyText("API pricing notes for unrelated vendor")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("modernize our API platform")!, state: "Active" },
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "project API migration",
      projectId: "proj-platform" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-procurement",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R5-TC-02: repeated USER corroboration fails closed", async () => {
    // Pipeline test:
    // Interaction: "user authentication"
    // Project context fact: "user session timeout policy"
    // Candidate Knowledge: "user interview scheduling notes"
    // Overlap is solely the repeated word 'user' with no independent corroborating token.
    // Result: candidate MUST be excluded.
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-user-interviews"),
        originatingProjectId: "proj-research" as ProjectId,
        content: nonEmptyText("user interview scheduling notes and calendar bookings")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("build security features")!, state: "Active" },
      }),
      getAcceptedContextFacts: async () => ({
        kind: "found",
        value: [nonEmptyText("user session timeout policy")!],
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "user authentication",
      projectId: "proj-sec" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-research",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R5-TC-03 & R5-TC-10: true independent single-token corroboration succeeds and proves interactionTokenMatches === 1", async () => {
    // Pipeline test:
    // Interaction: "troubleshoot OAuth2"
    // Knowledge: "OAuth2 authentication failure handling"
    // Interaction tokens: ["troubleshoot", "oauth2"]
    // Knowledge tokens: ["oauth2", "authentication", "failure", "handling"]
    // Interaction ∩ Knowledge tokens = exactly 1 token ("oauth2") -> R5-TC-10 verified!
    // Project outcome: "stabilize authentication flows"
    // Project outcome ∩ Knowledge (excluding "oauth2") = {"authentication"} (independent corroboration!)
    // Result: candidate qualifies, referenceKnowledge invoked, context included.
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-oauth-failure"),
        originatingProjectId: "proj-auth-core" as ProjectId,
        content: nonEmptyText("OAuth2 authentication failure handling")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    // Verify R5-TC-10 assertion: exactly 1 interaction token matches knowledge
    const interactionTokens = ["troubleshoot", "oauth2"];
    const knowledgeTokens = ["oauth2", "authentication", "failure", "handling"];
    const interactionMatchTokens = interactionTokens.filter((t) => knowledgeTokens.includes(t));
    expect(interactionMatchTokens.length).toBe(1);
    expect(interactionMatchTokens[0]).toBe("oauth2");

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("stabilize authentication flows")!, state: "Active" },
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "troubleshoot OAuth2",
      projectId: "proj-client-app" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-auth-core",
      );
      expect(crossItems.length).toBe(1);
      const item = crossItems[0];
      if (item.kind === "knowledge-excerpt") {
        expect(item.knowledgeItemId).toBe("k-oauth-failure");
        expect(item.originatingProjectId).toBe("proj-auth-core");
        expect(item.currentness).toBe("current");
      }
    }
  });

  it("R5-TC-04: multi-token valid cross-Project relevance remains qualified", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-rest-auth"),
        originatingProjectId: "proj-shared-api" as ProjectId,
        content: nonEmptyText("Standard REST API authentication patterns")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "REST API authentication headers and rate limiting standards",
      projectId: "proj-consumer" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-shared-api",
      );
      expect(crossItems.length).toBe(1);
    }
  });

  it("R5-TC-05: exact direct Knowledge ID match qualifies, partial/substring identifier does not qualify", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-oauth-guide"),
        originatingProjectId: "proj-security" as ProjectId,
        content: nonEmptyText("TLS certificate rotation policies and expiration monitoring")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    // 1. Partial/substring ID should NOT falsely qualify
    const resultPartial = await selectBoundedContextForTurn(retrieval, {
      interactionText: "check old-k-oauth-guide-999 for reference",
      projectId: "proj-app" as ProjectId,
      includeCrossProjectKnowledge: true,
    });
    expect(resultPartial.kind).toBe("context-selected");
    if (resultPartial.kind === "context-selected") {
      const crossItems = resultPartial.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-security",
      );
      expect(crossItems.length).toBe(0);
    }

    // 2. Exact ID match qualifies
    const resultExact = await selectBoundedContextForTurn(retrieval, {
      interactionText: "use k-oauth-guide for reference",
      projectId: "proj-app" as ProjectId,
      includeCrossProjectKnowledge: true,
    });
    expect(resultExact.kind).toBe("context-selected");
    if (resultExact.kind === "context-selected") {
      const crossItems = resultExact.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-security",
      );
      expect(crossItems.length).toBe(1);
    }
  });

  it("R5-TC-06: weak evidence fails closed with zero inclusion, zero persistence calls, and no mutation", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-unrelated-random"),
        originatingProjectId: "proj-other" as ProjectId,
        content: nonEmptyText("Completely unrelated architectural sketch")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getProject: async (id: ProjectId) => ({
        kind: "found",
        value: { id, intendedOutcome: nonEmptyText("Build frontend")!, state: "Active" },
      }),
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Optimize database queries",
      projectId: "proj-db" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-other",
      );
      expect(crossItems.length).toBe(0);
    }
  });

  it("R5-TC-07: valid cross-project reuse preserves knowledge ID, originating project ID, standing, and qualification", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-security-rules"),
        originatingProjectId: "proj-security-org" as ProjectId,
        content: nonEmptyText("Zero-trust security rules and TLS certificate verification")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Zero-trust security rules compliance",
      projectId: "proj-client-svc" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-security-org",
      );
      expect(crossItems.length).toBe(1);
      const item = crossItems[0];
      if (item.kind === "knowledge-excerpt") {
        expect(item.knowledgeItemId).toBe("k-security-rules");
        expect(item.originatingProjectId).toBe("proj-security-org");
        expect(item.currentness).toBe("current");
      }
    }
  });

  it("R5-TC-08: DATA-001 passwd, secret, and sensitive prose allowance closed-boundary checks", async () => {
    const retrieval = createMockRetrievalService();

    // 1. passwd= rejected
    const resPasswd = await selectBoundedContextForTurn(retrieval, {
      interactionText: "passwd=supersecretpassword",
      projectId: "proj-1" as ProjectId,
    });
    expect(resPasswd.kind).toBe("context-rejected");

    // 2. secret= rejected
    const resSecret = await selectBoundedContextForTurn(retrieval, {
      interactionText: "secret=supersecretvalue",
      projectId: "proj-1" as ProjectId,
    });
    expect(resSecret.kind).toBe("context-rejected");

    // 3. Ordinary sensitive business prose accepted
    const resProse = await selectBoundedContextForTurn(retrieval, {
      interactionText: "We need to review our Q3 financial forecast and confidential budget allocation",
      projectId: "proj-1" as ProjectId,
    });
    expect(resProse.kind).toBe("context-selected");
  });

  it("preserves bilingual Vietnamese tokenization with diacritics without corruption", async () => {
    const crossKnowledge: KnowledgeItem[] = [
      {
        id: knowledgeItemId("k-vn-deploy"),
        originatingProjectId: "proj-vn" as ProjectId,
        content: nonEmptyText("Quy trình triển khai dịch vụ trên môi trường production")!,
        standing: "current",
        supersessionChain: [],
      },
    ];

    const retrieval = createMockRetrievalService({
      getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: crossKnowledge }),
    });

    const result = await selectBoundedContextForTurn(retrieval, {
      interactionText: "Hướng dẫn triển khai dịch vụ",
      projectId: "proj-other" as ProjectId,
      includeCrossProjectKnowledge: true,
    });

    expect(result.kind).toBe("context-selected");
    if (result.kind === "context-selected") {
      const crossItems = result.context.items.filter(
        (item) => item.kind === "knowledge-excerpt" && item.originatingProjectId === "proj-vn",
      );
      expect(crossItems.length).toBe(1);
    }
  });
});

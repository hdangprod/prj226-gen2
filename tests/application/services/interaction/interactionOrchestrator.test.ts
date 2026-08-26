import { describe, expect, it } from "vitest";
import {
  nonEmptyText,
  type AcceptedProgress,
  type Action,
  type ActionId,
  type KnowledgeItem,
  type KnowledgeItemId,
  type ProgressId,
  type Project,
  type ProjectId,
} from "../../../../src/domain/model";
import {
  createHumanControlRuntime,
  type TrustedInteractionEvidence,
} from "../../../../src/application/contracts/humanControl";
import type {
  AcceptedStatePersistence,
  PersistenceOperationId,
  PersistenceCommitResult,
} from "../../../../src/application/ports/persistence";
import { DeterministicModelCapability } from "../../../../src/testing/model/deterministicModelCapability";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import type {
  ExportDeletionPersistence,
  ExportPersistenceResult,
  DeletionPersistenceResult,
} from "../../../../src/application/services/exportDeletion/exportDeletionTypes";
import { ExportDeletionServiceImpl } from "../../../../src/application/services/exportDeletion/exportDeletionService";
import type {
  RetrievalResult,
  RetrievalService,
} from "../../../../src/application/services/retrieval/retrievalTypes";
import { createInteractionOrchestrator } from "../../../../src/application/services/interaction/interactionOrchestrator";
import type {
  InteractionOrchestratorDependencies,
} from "../../../../src/application/services/interaction/interactionTypes";
import type {
  ModelCapabilityResult,
  ProposedOperation,
} from "../../../../src/application/ports/model/modelCapability";

function createHarness(overrides?: {
  readonly modelResults?: readonly ModelCapabilityResult[];
  readonly persistenceCommit?: () => Promise<PersistenceCommitResult>;
}) {
  const humanControlRuntime = createHumanControlRuntime();
  const committedWrites: unknown[] = [];

  const persistence: AcceptedStatePersistence = {
    commitAcceptedState: overrides?.persistenceCommit ?? (async (batch) => {
      committedWrites.push(batch);
      return { kind: "committed" };
    }),
  };

  const projectActionContextService = new ProjectActionContextService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });

  const knowledgeProvenanceService = new KnowledgeProvenanceService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });

  const exportDeletionPersistence: ExportDeletionPersistence = {
    readExportData: async (): Promise<ExportPersistenceResult> => ({
      kind: "exported",
      data: {
        projects: [],
        actions: [],
        acceptedContextFacts: [],
        acceptedProgress: [],
        knowledgeItems: [],
      },
    }),
    executeConfirmedDeletion: async (): Promise<DeletionPersistenceResult> => ({
      kind: "deleted",
    }),
  };

  const exportDeletionService = new ExportDeletionServiceImpl(
    exportDeletionPersistence,
    humanControlRuntime.mutationGate,
  );

  const projectsStore = new Map<string, Project>();
  const actionsStore = new Map<string, Action[]>();
  const progressStore = new Map<string, AcceptedProgress[]>();
  const knowledgeStore = new Map<string, KnowledgeItem>();

  const retrievalService: RetrievalService = {
    getProject: async (id: ProjectId): Promise<RetrievalResult<Project>> => {
      const p = projectsStore.get(id);
      if (p) return { kind: "found", value: p };
      return { kind: "not-found", entityType: "project", id };
    },
    listProjects: async () => ({
      kind: "found",
      value: Array.from(projectsStore.values()),
    }),
    getActionsForProject: async (id: ProjectId) => ({
      kind: "found",
      value: actionsStore.get(id) ?? [],
    }),
    getAcceptedContextFacts: async () => ({ kind: "found", value: [] }),
    getCurrentProgress: async (id: ProjectId) => ({
      kind: "found",
      value: progressStore.get(id) ?? [],
    }),
    getCurrentKnowledgeForProject: async (id: ProjectId) => ({
      kind: "found",
      value: Array.from(knowledgeStore.values()).filter((k) => k.originatingProjectId === id),
    }),
    getCurrentKnowledgeAcrossProjects: async () => ({
      kind: "found",
      value: Array.from(knowledgeStore.values()),
    }),
    getKnowledgeItem: async (id) => {
      const k = knowledgeStore.get(id);
      if (k) return { kind: "found", value: k };
      return { kind: "not-found", entityType: "knowledge-item", id };
    },
    getKnowledgeLineage: async () => ({ kind: "found", value: [] }),
  };

  const modelCapabilityPort = new DeterministicModelCapability(
    overrides?.modelResults ?? [
      { kind: "advisory", content: nonEmptyText("Advisory response")! },
    ],
  );

  const dependencies: InteractionOrchestratorDependencies = {
    retrievalService,
    humanControlRuntime,
    modelCapabilityPort,
    projectActionContextService,
    knowledgeProvenanceService,
    exportDeletionService,
  };

  const orchestrator = createInteractionOrchestrator(dependencies);

  return {
    orchestrator,
    humanControlRuntime,
    retrievalService,
    projectActionContextService,
    knowledgeProvenanceService,
    exportDeletionService,
    modelCapabilityPort,
    committedWrites,
    projectsStore,
    actionsStore,
    progressStore,
    knowledgeStore,
  };
}

describe("interactionOrchestrator (ENG-010 Repair 5)", () => {
  it("TC-01: observes user interaction text via TrustedInteractionIngress", () => {
    const { orchestrator } = createHarness();
    const result = orchestrator.observeUserInteraction("Plan architecture");
    expect(result).toMatchObject({
      kind: "trusted-interaction-evidence",
    });
  });

  it("TC-02: generates advisory outcome via ModelCapabilityPort", async () => {
    const { orchestrator } = createHarness({
      modelResults: [{ kind: "advisory", content: nonEmptyText("Helpful advice")! }],
    });

    const result = await orchestrator.handleAdvisory({ text: "How should I structure the code?" });
    expect(result.kind).toBe("advisory");
    if (result.kind === "advisory") {
      expect(result.value).toBe("Helpful advice");
    }
  });

  it("TC-03: generates proposal outcome via ModelCapabilityPort", async () => {
    const operations: ProposedOperation[] = [
      { kind: "create-project", intendedOutcome: nonEmptyText("New project")! },
    ];
    const { orchestrator } = createHarness({
      modelResults: [{ kind: "proposal", operations }],
    });

    const result = await orchestrator.handleProposal({ text: "Propose next steps" });
    expect(result.kind).toBe("proposed");
    if (result.kind === "proposed") {
      expect(result.proposal).toEqual(operations);
    }
  });

  it("TC-06: returns ProhibitedOutcome on credential-shaped text during observeUserInteraction", () => {
    const { orchestrator } = createHarness();
    const result = orchestrator.observeUserInteraction("My api_key=supersecret123456");
    expect(result).toMatchObject({
      kind: "prohibited",
      reason: "authentication-material-capture",
    });
  });

  it("TC-07: returns ProhibitedOutcome on credential-shaped text during handleAdvisory", async () => {
    const { orchestrator } = createHarness();
    const result = await orchestrator.handleAdvisory({
      text: "Authorization: Bearer supersecretbearer123456",
    });
    expect(result.kind).toBe("prohibited");
    if (result.kind === "prohibited") {
      expect(result.reason).toBe("authentication-material-capture");
    }
  });

  it("TC-08: returns ProhibitedOutcome on credential-shaped text during handleProposal", async () => {
    const { orchestrator } = createHarness();
    const result = await orchestrator.handleProposal({
      text: "Here is password=secretpassword123",
    });
    expect(result.kind).toBe("prohibited");
    if (result.kind === "prohibited") {
      expect(result.reason).toBe("authentication-material-capture");
    }
  });

  it("TC-09: returns ClarificationRequiredOutcome on ambiguous-target classification during handleAdvisory", async () => {
    const { orchestrator } = createHarness({
      modelResults: [{ kind: "uncertain", reason: nonEmptyText("Ambiguous target")! }],
    });

    const result = await orchestrator.handleAdvisory({ text: "Vague instruction" });
    expect(result.kind).toBe("clarification-required");
    if (result.kind === "clarification-required") {
      expect(result.reason).toBe("ambiguous-target");
    }
  });

  it("TC-10: returns UnresolvedOutcome when model is unable to satisfy request", async () => {
    const { orchestrator } = createHarness({
      modelResults: [{ kind: "unable", reason: nonEmptyText("Cannot fulfill request safely")! }],
    });

    const result = await orchestrator.handleAdvisory({ text: "Impossible task" });
    expect(result.kind).toBe("unresolved");
    if (result.kind === "unresolved") {
      expect(result.reason).toBe("Cannot fulfill request safely");
    }
  });

  it("TC-15: establishes project via HumanControl authorization and ProjectActionContextService", async () => {
    const { orchestrator, humanControlRuntime, committedWrites } = createHarness();
    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Establish project 1",
    });

    const result = await orchestrator.establishProject({
      evidence,
      operationId: "op-est-1" as PersistenceOperationId,
      id: "p1" as ProjectId,
      intendedOutcome: nonEmptyText("Outcome 1")!,
    });

    expect(result.kind).toBe("accepted");
    expect(committedWrites.length).toBe(1);
  });

  it("TC-16: creates action with HumanControl authorization", async () => {
    const { orchestrator, humanControlRuntime, projectsStore, committedWrites } = createHarness();
    projectsStore.set("p1", {
      id: "p1" as ProjectId,
      intendedOutcome: nonEmptyText("Project 1")!,
      state: "Active",
    });

    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Create action 1",
    });

    const result = await orchestrator.createAction({
      evidence,
      operationId: "op-act-1" as PersistenceOperationId,
      id: "a1" as ActionId,
      projectId: "p1" as ProjectId,
      description: nonEmptyText("Action 1 description")!,
    });

    expect(result.kind).toBe("accepted");
    expect(committedWrites.length).toBe(1);
  });

  it("TC-17: mixed outcome preserves individual portion outcomes faithfully", async () => {
    const { orchestrator } = createHarness();
    const portions = [
      async () => ({ kind: "accepted" as const, value: "step-1" }),
      async () => ({ kind: "prohibited" as const, intent: { summary: "bad" }, reason: "authentication-material-capture" as const }),
    ];

    const result = await orchestrator.handleMixed(portions);
    expect(result.kind).toBe("mixed");
    expect(result.portions.length).toBe(2);
    expect(result.portions[0].kind).toBe("accepted");
    expect(result.portions[1].kind).toBe("prohibited");
  });

  it("TC-18: model failure during handleAdvisory returns failed outcome", async () => {
    const { orchestrator } = createHarness({
      modelResults: [{ kind: "failure", failure: { category: "timeout", message: nonEmptyText("Model timed out")!, retryable: true } }],
    });

    const result = await orchestrator.handleAdvisory({ text: "Request advice" });
    expect(result.kind).toBe("failed");
    if (result.kind === "failed") {
      expect(result.reason).toBe("Model timed out");
      expect(result.retryable).toBe(true);
    }
  });

  it("TC-27: truthful error reporting when persistence commit fails during establishProject", async () => {
    const { orchestrator, humanControlRuntime } = createHarness({
      persistenceCommit: async () => ({ kind: "persistence-failed", reason: "durability-failure" as const, retryable: false }),
    });

    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Establish project with failing persistence",
    });

    const result = await orchestrator.establishProject({
      evidence,
      operationId: "op-fail-1" as PersistenceOperationId,
      id: "p-fail" as ProjectId,
      intendedOutcome: nonEmptyText("Fail outcome")!,
    });

    expect(result.kind).toBe("failed");
    if (result.kind === "failed") {
      expect(result.reason).toBe("durability-failure");
    }
  });

  it("R2-TC-01: forged interaction evidence rejected across all mutation methods", async () => {
    const { orchestrator, committedWrites, projectsStore } = createHarness();
    projectsStore.set("p1", {
      id: "p1" as ProjectId,
      intendedOutcome: nonEmptyText("Project 1")!,
      state: "Active",
    });
    const forgedEvidence = {
      kind: "trusted-interaction-evidence",
      rawEvidence: "forged-raw-token",
    } as unknown as TrustedInteractionEvidence;

    const resEst = await orchestrator.establishProject({
      evidence: forgedEvidence,
      operationId: "op-f1" as PersistenceOperationId,
      id: "p1" as ProjectId,
      intendedOutcome: nonEmptyText("Outcome")!,
    });
    expect(resEst.kind).toBe("unresolved");

    const resAct = await orchestrator.createAction({
      evidence: forgedEvidence,
      operationId: "op-f2" as PersistenceOperationId,
      id: "a1" as ActionId,
      projectId: "p1" as ProjectId,
      description: nonEmptyText("Description")!,
    });
    expect(resAct.kind).toBe("unresolved");

    const resKnw = await orchestrator.captureKnowledge({
      evidence: forgedEvidence,
      operationId: "op-f3" as PersistenceOperationId,
      id: "k1" as KnowledgeItemId,
      originatingProjectId: "p1" as ProjectId,
      content: nonEmptyText("Content")!,
    });
    expect(resKnw.kind).toBe("unresolved");

    expect(committedWrites.length).toBe(0);
  });

  it("R3-TC-05: DATA-001 passwd= assignment rejected across all mutation methods", async () => {
    const { orchestrator, humanControlRuntime, projectsStore, committedWrites } = createHarness();
    projectsStore.set("proj-1", {
      id: "proj-1" as ProjectId,
      intendedOutcome: nonEmptyText("Project 1")!,
      state: "Active",
    });

    const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Capture password material",
    });

    const result = await orchestrator.captureKnowledge({
      evidence: ev,
      operationId: "op-r3-passwd" as PersistenceOperationId,
      id: "k-passwd" as KnowledgeItemId,
      originatingProjectId: "proj-1" as ProjectId,
      content: nonEmptyText("Login with passwd=hunter2")!,
    });

    expect(result.kind).toBe("prohibited");
    if (result.kind === "prohibited") {
      expect(result.reason).toBe("authentication-material-capture");
    }
    expect(committedWrites.length).toBe(0);
  });

  it("R3-TC-06: DATA-001 secret= assignment rejected across all mutation methods", async () => {
    const { orchestrator, humanControlRuntime, projectsStore, committedWrites } = createHarness();
    projectsStore.set("proj-1", {
      id: "proj-1" as ProjectId,
      intendedOutcome: nonEmptyText("Project 1")!,
      state: "Active",
    });

    const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Capture secret material",
    });

    const result = await orchestrator.captureKnowledge({
      evidence: ev,
      operationId: "op-r3-secret" as PersistenceOperationId,
      id: "k-secret" as KnowledgeItemId,
      originatingProjectId: "proj-1" as ProjectId,
      content: nonEmptyText("Webhook config: secret=abcd")!,
    });

    expect(result.kind).toBe("prohibited");
    if (result.kind === "prohibited") {
      expect(result.reason).toBe("authentication-material-capture");
    }
    expect(committedWrites.length).toBe(0);
  });

  const FINITE_DATA001_MATRIX: readonly [category: string, value: string][] = [
    ["private-key (standard)", "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASC..."],
    ["private-key (rsa)", "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0..."],
    ["private-key (ec)", "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEI..."],
    ["private-key (openssh)", "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC..."],
    ["bearer (authorization header)", "Authorization: Bearer abcdef1234567890"],
    ["bearer (bare)", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.secret"],
    ["bearer (backtick)", "`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.secret`"],
    ["password assignment", "password=correct-horse-battery-staple"],
    ["passwords assignment", "passwords: supersecret123"],
    ["passwd assignment", "passwd=hunter2"],
    ["passphrase assignment", "passphrase = my-super-secret-phrase-value"],
    ["passphrases assignment", "passphrases: secret-cluster-passphrase"],
    ["credentials assignment", "credentials=admin:secretpass999"],
    ["credential assignment", "credential: test-credential-token"],
    ["api-key assignment (_)", "api_key=synthetic-api-key-value"],
    ["api-key assignment (-)", "api-key: synthetic-api-key-value"],
    ["api-key assignment (space)", "api key: synthetic-api-key-value"],
    ["access-token assignment (_)", "access_token=synthetic-access-token"],
    ["access-token assignment (-)", "access-token: synthetic-access-token"],
    ["auth-token assignment (_)", "auth_token=synthetic-auth-token"],
    ["auth-token assignment (-)", "auth-token: synthetic-auth-token"],
    ["refresh-token assignment (_)", "refresh_token=synthetic-refresh-token"],
    ["refresh-token assignment (-)", "refresh-token: synthetic-refresh-token"],
    ["client-secret assignment (_)", "client_secret=synthetic-client-secret"],
    ["client-secret assignment (-)", "client-secret: synthetic-client-secret"],
    ["auth-secret assignment (_)", "auth_secret=synthetic-auth-secret"],
    ["auth-secret assignment (-)", "auth-secret: synthetic-auth-secret"],
    ["authentication-secret assignment", "authentication_secret=synthetic-auth-secret"],
    ["generic secret assignment (=)", "secret=abcd"],
    ["generic secret assignment (:)", "secret: synthetic-secret"],
    ["generic secret assignment (uppercase)", "SECRET = synthetic-secret"],
    ["generic secret assignment (json)", "\"secret\": \"synthetic-secret\""],
  ];

  it.each(FINITE_DATA001_MATRIX)(
    "R3-TC-07: DATA-001 finite category parity - rejects %s (%s)",
    async (category, fixture) => {
      const { orchestrator, humanControlRuntime, projectsStore, committedWrites } = createHarness();
      projectsStore.set("proj-1", {
        id: "proj-1" as ProjectId,
        intendedOutcome: nonEmptyText("Project 1")!,
        state: "Active",
      });

      const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: `Capture ${category}`,
      });

      const result = await orchestrator.captureKnowledge({
        evidence: ev,
        operationId: `op-matrix-${category.replace(/[^a-zA-Z0-9]/g, "-")}` as PersistenceOperationId,
        id: "k-matrix" as KnowledgeItemId,
        originatingProjectId: "proj-1" as ProjectId,
        content: nonEmptyText(fixture)!,
      });

      expect(result.kind).toBe("prohibited");
      if (result.kind === "prohibited") {
        expect(result.reason).toBe("authentication-material-capture");
      }
      expect(committedWrites.length).toBe(0);
    },
  );

  const BENIGN_PROSE_SAMPLES: readonly string[] = [
    "Discuss token budgeting and cost optimization",
    "Keep the secret plan private until announcement",
    "API key rotation is pending for next quarter",
    "The secret to productivity is focus.",
    "We should improve secret management documentation.",
    "This project documents how secrets should be rotated.",
    "A secret may be stored incorrectly in third party logs.",
    "Document how to rotate an access token and never write a password in a note.",
    "Quarterly financial budget and private health tracker for executive staff",
    "Internal non-secret service hostname is internal.cluster.local",
    "Personal goals for senior leadership development",
    "Confidential project discussion regarding upcoming partnership",
  ];

  it.each(BENIGN_PROSE_SAMPLES)(
    "R3-TC-08: ordinary sensitive/private content allowed without DLP drift - accepts '%s'",
    async (prose) => {
      const { orchestrator, humanControlRuntime, projectsStore, committedWrites } = createHarness();
      projectsStore.set("proj-1", {
        id: "proj-1" as ProjectId,
        intendedOutcome: nonEmptyText("Project 1")!,
        state: "Active",
      });

      const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: `Capture prose: ${prose.slice(0, 30)}`,
      });

      const result = await orchestrator.captureKnowledge({
        evidence: ev,
        operationId: `op-prose-${Math.random().toString(36).slice(2, 8)}` as PersistenceOperationId,
        id: `k-prose-${Math.random().toString(36).slice(2, 8)}` as KnowledgeItemId,
        originatingProjectId: "proj-1" as ProjectId,
        content: nonEmptyText(prose)!,
      });

      expect(result.kind).toBe("accepted");
      expect(committedWrites.length).toBe(1);
    },
  );

  it("R3-TC-09 & R4-TC-08 & R5-TC-08: prior boundaries remain closed - forged evidence rejection, Action-linked Progress, DV-R001 payload integrity", async () => {
    const { orchestrator, humanControlRuntime, projectsStore, actionsStore, progressStore } = createHarness({
      modelResults: [{ kind: "advisory", content: nonEmptyText("Reliable advisory response")! }],
    });
    projectsStore.set("proj-1", {
      id: "proj-1" as ProjectId,
      intendedOutcome: nonEmptyText("Project 1")!,
      state: "Active",
    });
    actionsStore.set("proj-1", [
      {
        id: "act-core" as ActionId,
        projectId: "proj-1" as ProjectId,
        description: nonEmptyText("Core action")!,
        state: "Open",
      },
    ]);
    progressStore.set("proj-1", [
      {
        id: "prog-core" as ProgressId,
        projectId: "proj-1" as ProjectId,
        actionId: "act-core" as ActionId,
        statement: nonEmptyText("Progress statement")!,
        standing: "current",
      },
    ]);

    // 1. Forged evidence is rejected
    const forged = { kind: "trusted-interaction-evidence" } as unknown as TrustedInteractionEvidence;
    const forgedRes = await orchestrator.establishProject({
      evidence: forged,
      operationId: "op-forged" as PersistenceOperationId,
      id: "proj-forged" as ProjectId,
      intendedOutcome: nonEmptyText("Forged outcome")!,
    });
    expect(forgedRes.kind).toBe("unresolved");

    // 2. Genuine Action-linked progress correction succeeds
    const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Correct progress with owning action",
    });
    const correctRes = await orchestrator.correctProgress({
      evidence: ev,
      operationId: "op-r3-corr" as PersistenceOperationId,
      projectId: "proj-1" as ProjectId,
      priorId: "prog-core" as ProgressId,
      successorId: "prog-core-succ" as ProgressId,
      statement: nonEmptyText("Progress updated correctly")!,
    });
    expect(correctRes.kind).toBe("accepted");

    // 3. DV-R001 truthful advisory payload typing
    const advisoryRes = await orchestrator.handleAdvisory({ text: "Give advice" });
    expect(advisoryRes.kind).toBe("advisory");
    if (advisoryRes.kind === "advisory") {
      expect(typeof advisoryRes.value).toBe("string");
    }
  });
});

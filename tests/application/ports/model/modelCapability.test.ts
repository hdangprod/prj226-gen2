import { describe, expect, it } from "vitest";
import type {
  ModelCapabilityResult,
} from "../../../../src/application/ports/model/modelCapability";
import {
  createBoundedModelContext,
  createModelCapabilityRequest,
} from "../../../../src/application/ports/model/modelCapability";
import {
  actionId,
  knowledgeItemId,
  nonEmptyText,
  projectId,
} from "../../../../src/domain/model";

function text(value: string) {
  const result = nonEmptyText(value);
  if (result === undefined) throw new Error("fixture text must be non-empty");
  return result;
}

describe("provider-neutral Model Capability contract", () => {
  it("carries only explicitly selected, relevance-qualified context", () => {
    const context = createBoundedModelContext({
      itemLimit: 3,
      selectionReason: text("Only deadline and review lead time answer this interaction"),
      items: [
        {
          kind: "action-summary",
          projectId: projectId("p-1"),
          actionId: actionId("a-1"),
          summary: text("Prepare the release notes"),
          relevance: text("The action is a candidate next step"),
        },
        {
          kind: "project-fact",
          projectId: projectId("p-1"),
          fact: text("Release target is Friday"),
          relevance: text("The question asks about next steps"),
        },
        {
          kind: "knowledge-excerpt",
          knowledgeItemId: knowledgeItemId("k-1"),
          originatingProjectId: projectId("p-1"),
          excerpt: text("Reviews require one working day"),
          relevance: text("Lead time constrains the next step"),
          currentness: "current",
        },
      ],
    });
    if (context.kind !== "bounded-context") throw new Error("expected bounded fixture");
    const request = createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: text("What should I do next?"),
      context: context.value,
      constraints: [text("Prefer a reversible next step")],
    });
    if (request.kind !== "model-request") throw new Error("expected valid request fixture");

    expect(request.value.context.items).toHaveLength(3);
    expect(request.value.context.itemLimit).toBe(3);
    expect(request.value.constraints).toEqual(["Prefer a reversible next step"]);
  });

  const rejected = { kind: "invalid-context", reason: "authentication-material-excluded" };

  it.each([
    ["selection rationale", "password=correct-horse-battery-staple"],
    ["fact", "api_key=synthetic-api-key-value"],
    ["summary", "Authorization: Bearer abcdef1234567890"],
    ["excerpt", "access_token=synthetic-access-token"],
    ["relevance", "refresh_token=synthetic-refresh-token"],
    ["qualification", "-----BEGIN PRIVATE KEY-----"],
  ])("rejects authentication material in %s", (field, fixture) => {
    const safe = text("Relevant benign text");
    const value = text(fixture);
    const items = field === "fact"
      ? [{ kind: "project-fact" as const, projectId: projectId("p-1"), fact: value, relevance: safe }]
      : field === "summary"
        ? [{ kind: "action-summary" as const, projectId: projectId("p-1"), actionId: actionId("a-1"), summary: value, relevance: safe }]
        : [{
            kind: "knowledge-excerpt" as const,
            knowledgeItemId: knowledgeItemId("k-1"),
            originatingProjectId: projectId("p-1"),
            excerpt: field === "excerpt" ? value : safe,
            relevance: field === "relevance" ? value : safe,
            currentness: "qualified-prior" as const,
            qualification: field === "qualification" ? value : safe,
          }];

    expect(createBoundedModelContext({
      items,
      itemLimit: 1,
      selectionReason: field === "selection rationale" ? value : safe,
    })).toEqual(rejected);
  });

  it.each([
    ["selection rationale", "secret: synthetic-secret"],
    ["fact", "secret=synthetic-secret"],
    ["summary", "SECRET = synthetic-secret"],
    ["excerpt", "\"secret\": \"synthetic-secret\""],
    ["relevance", "secret : synthetic-secret"],
    ["qualification", "secret: synthetic-secret"],
  ])("rejects generic secret assignment in %s", (field, fixture) => {
    const safe = text("Relevant benign text");
    const value = text(fixture);
    const items = field === "fact"
      ? [{ kind: "project-fact" as const, projectId: projectId("p-1"), fact: value, relevance: safe }]
      : field === "summary"
        ? [{ kind: "action-summary" as const, projectId: projectId("p-1"), actionId: actionId("a-1"), summary: value, relevance: safe }]
        : [{
            kind: "knowledge-excerpt" as const,
            knowledgeItemId: knowledgeItemId("k-1"),
            originatingProjectId: projectId("p-1"),
            excerpt: field === "excerpt" ? value : safe,
            relevance: field === "relevance" ? value : safe,
            currentness: "qualified-prior" as const,
            qualification: field === "qualification" ? value : safe,
          }];

    expect(createBoundedModelContext({
      items,
      itemLimit: 1,
      selectionReason: field === "selection rationale" ? value : safe,
    })).toEqual(rejected);
  });

  it.each([
    ["interaction", "Authorization: Bearer abcdef1234567890"],
    ["constraint", "client_secret=synthetic-client-secret"],
  ])("rejects authentication material in request %s", (field, fixture) => {
    const context = createBoundedModelContext({
      items: [],
      itemLimit: 0,
      selectionReason: text("No context required"),
    });
    if (context.kind !== "bounded-context") throw new Error("expected bounded fixture");
    expect(createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: text(field === "interaction" ? fixture : "Benign interaction"),
      constraints: [text(field === "constraint" ? fixture : "Benign constraint")],
      context: context.value,
    })).toEqual({ kind: "invalid-request", reason: "authentication-material-excluded" });
  });

  it.each([
    ["interaction", "secret: synthetic-secret"],
    ["constraint", "\"secret\": \"synthetic-secret\""],
  ])("rejects generic secret assignment in request %s", (field, fixture) => {
    const context = createBoundedModelContext({
      items: [],
      itemLimit: 0,
      selectionReason: text("No context required"),
    });
    if (context.kind !== "bounded-context") throw new Error("expected bounded fixture");
    expect(createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: text(field === "interaction" ? fixture : "Benign interaction"),
      constraints: [text(field === "constraint" ? fixture : "Benign constraint")],
      context: context.value,
    })).toEqual({ kind: "invalid-request", reason: "authentication-material-excluded" });
  });

  it.each([
    "Discuss token budgeting",
    "Keep the secret plan private",
    "API key rotation is pending",
    "The secret to productivity is focus.",
    "We should improve secret management documentation.",
    "This project documents how secrets should be rotated.",
    "A secret may be stored incorrectly.",
  ])(
    "accepts benign security-related prose: %s",
    (fixture) => {
      const context = createBoundedModelContext({
        items: [],
        itemLimit: 0,
        selectionReason: text(fixture),
      });
      expect(context.kind).toBe("bounded-context");
    },
  );

  it("rejects context beyond the declared bound", () => {
    const item = {
      kind: "project-fact" as const,
      projectId: projectId("p-1"),
      fact: text("Relevant fact"),
      relevance: text("Needed for the interaction"),
    };
    expect(createBoundedModelContext({
      items: [item, item],
      itemLimit: 1,
      selectionReason: text("One item maximum"),
    })).toEqual({ kind: "invalid-context", reason: "item-limit-exceeded" });
  });

  it("represents candidate operations as proposals rather than accepted state", () => {
    const action = {
      id: actionId("a-1"),
      projectId: projectId("p-1"),
      description: text("Prepare release"),
      state: "Open" as const,
    };
    const result: ModelCapabilityResult = {
      kind: "proposal",
      operations: [{ kind: "complete-action", projectId: action.projectId, actionId: action.id }],
    };

    expect(result.kind).toBe("proposal");
    expect(action.state).toBe("Open");
    expect(result).not.toHaveProperty("authorization");
    expect(result).not.toHaveProperty("accepted");
  });

  it.each<ModelCapabilityResult>([
    { kind: "uncertain", reason: text("Competing current signals") },
    { kind: "unable", reason: text("Required context was not supplied") },
    {
      kind: "failure",
      failure: { category: "timeout", retryable: true, message: text("Model capability timed out") },
    },
    {
      kind: "failure",
      failure: { category: "malformed-result", retryable: false, message: text("Result did not match the contract") },
    },
  ])("keeps uncertainty, inability, and normalized failure explicit: $kind", (result) => {
    expect(["uncertain", "unable", "failure"]).toContain(result.kind);
    expect(result).not.toHaveProperty("providerError");
  });
});

import { describe, expect, it } from "vitest";
import {
  createBoundedModelContext,
  createModelCapabilityRequest,
  type BoundedModelContext,
  type ModelContextItem,
} from "../../../../src/application/ports/model/modelCapability";
import {
  actionId,
  knowledgeItemId,
  nonEmptyText,
  projectId,
  type NonEmptyText,
} from "../../../../src/domain/model";

function text(value: string): NonEmptyText {
  const result = nonEmptyText(value);
  if (result === undefined) throw new Error("fixture text must be non-empty");
  return result;
}

function genuineContext(): BoundedModelContext {
  const result = createBoundedModelContext({
    items: [],
    itemLimit: 0,
    selectionReason: text("No context required"),
  });
  if (result.kind !== "bounded-context") throw new Error("expected genuine context");
  return result.value;
}

function requestWith(context: BoundedModelContext) {
  return createModelCapabilityRequest({
    capability: "generate-advice",
    interaction: text("Give bounded advice"),
    context,
  });
}

function forgedContext(value: unknown): BoundedModelContext {
  return value as BoundedModelContext;
}

const benignFact = {
  kind: "project-fact" as const,
  projectId: projectId("p-1"),
  fact: text("Release target is Friday"),
  relevance: text("The deadline affects the advice"),
};

describe("Model Capability runtime provenance", () => {
  it("accepts a genuine factory context", () => {
    expect(requestWith(genuineContext()).kind).toBe("model-request");
  });

  it.each([
    ["benign plain object", { items: [], itemLimit: 0, selectionReason: text("Benign") }],
    ["invalid item limit", { items: [], itemLimit: -1, selectionReason: text("Benign") }],
    ["over limit", { items: [benignFact], itemLimit: 0, selectionReason: text("Benign") }],
    ["nested generic secret", {
      items: [{ ...benignFact, fact: text("secret: synthetic-secret") }],
      itemLimit: 1,
      selectionReason: text("Benign"),
    }],
    ["nested API key", {
      items: [{ ...benignFact, fact: text("api_key=synthetic-api-key") }],
      itemLimit: 1,
      selectionReason: text("Benign"),
    }],
    ["private key marker", {
      items: [{ ...benignFact, fact: text("-----BEGIN PRIVATE KEY-----") }],
      itemLimit: 1,
      selectionReason: text("Benign"),
    }],
  ])("rejects forged context: %s", (_name, value) => {
    expect(requestWith(forgedContext(value))).toEqual({
      kind: "invalid-request",
      reason: "invalid-bounded-context",
    });
  });
});

describe("Model Capability immutable owned snapshots", () => {
  it("does not retain caller-owned context item references", () => {
    const rawFact = { ...benignFact };
    const rawSummary = {
      kind: "action-summary" as const,
      projectId: projectId("p-1"),
      actionId: actionId("a-1"),
      summary: text("Prepare release notes"),
      relevance: text("This is the next action"),
    };
    const rawExcerpt = {
      kind: "knowledge-excerpt" as const,
      knowledgeItemId: knowledgeItemId("k-1"),
      originatingProjectId: projectId("p-1"),
      excerpt: text("Reviews take one day"),
      relevance: text("Lead time affects the plan"),
      currentness: "current" as const,
    };
    const result = createBoundedModelContext({
      items: [rawFact, rawSummary, rawExcerpt],
      itemLimit: 3,
      selectionReason: text("These three projections are necessary"),
    });
    if (result.kind !== "bounded-context") throw new Error("expected bounded context");

    rawFact.fact = text("secret: synthetic-secret");
    rawSummary.summary = text("api_key=synthetic-api-key");
    rawExcerpt.excerpt = text("-----BEGIN PRIVATE KEY-----");

    expect(result.value.items.map((item) => {
      if (item.kind === "project-fact") return item.fact;
      if (item.kind === "action-summary") return item.summary;
      return item.excerpt;
    })).toEqual([
      "Release target is Friday",
      "Prepare release notes",
      "Reviews take one day",
    ]);
    expect(result.value.items.every(Object.isFrozen)).toBe(true);
  });

  it("freezes the returned context graph", () => {
    const result = createBoundedModelContext({
      items: [benignFact],
      itemLimit: 1,
      selectionReason: text("The fact is required"),
    });
    if (result.kind !== "bounded-context") throw new Error("expected bounded context");
    const context = result.value;
    const mutable = context as unknown as {
      items: ModelContextItem[];
      itemLimit: number;
      selectionReason: NonEmptyText;
    };
    const mutableItem = context.items[0] as unknown as { fact: NonEmptyText };

    expect(() => mutable.items.push(benignFact)).toThrow();
    expect(() => { mutableItem.fact = text("secret: synthetic-secret"); }).toThrow();
    expect(() => { mutable.itemLimit = 32; }).toThrow();
    expect(() => { mutable.selectionReason = text("secret: synthetic-secret"); }).toThrow();
    expect(context.items).toHaveLength(1);
    expect(context.items[0]).toMatchObject({ fact: "Release target is Friday" });
    expect(context.itemLimit).toBe(1);
    expect(Object.isFrozen(context)).toBe(true);
    expect(Object.isFrozen(context.items)).toBe(true);
  });

  it("clones constraints and freezes the returned request", () => {
    const constraints = [text("Prefer reversible steps")];
    const result = createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: text("Give bounded advice"),
      context: genuineContext(),
      constraints,
    });
    if (result.kind !== "model-request") throw new Error("expected model request");
    constraints[0] = text("secret: synthetic-secret");
    constraints.push(text("api_key=synthetic-api-key"));
    const request = result.value;
    const mutable = request as unknown as {
      interaction: NonEmptyText;
      context: BoundedModelContext;
      constraints: NonEmptyText[];
    };

    expect(request.constraints).toEqual(["Prefer reversible steps"]);
    expect(() => mutable.constraints.push(text("secret: synthetic-secret"))).toThrow();
    expect(() => { mutable.constraints[0] = text("secret: synthetic-secret"); }).toThrow();
    expect(() => { mutable.interaction = text("secret: synthetic-secret"); }).toThrow();
    expect(() => { mutable.context = forgedContext({}); }).toThrow();
    expect(request.interaction).toBe("Give bounded advice");
    expect(request.context).toBe(result.value.context);
    expect(Object.isFrozen(request)).toBe(true);
    expect(Object.isFrozen(request.constraints)).toBe(true);
  });

  it("rejects malformed runtime factory inputs without throwing", () => {
    expect(createBoundedModelContext(null as never)).toEqual({
      kind: "invalid-context",
      reason: "invalid-item-limit",
    });
    expect(createModelCapabilityRequest({ context: {} } as never)).toEqual({
      kind: "invalid-request",
      reason: "invalid-bounded-context",
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  createBoundedModelContext,
  createModelCapabilityRequest,
  type BoundedModelContext,
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
  if (result.kind !== "bounded-context") throw new Error("expected bounded context");
  return result.value;
}

function changingGetter<Value>(
  target: Record<string, unknown>,
  field: string,
  first: Value,
  second: Value,
): () => number {
  let reads = 0;
  Object.defineProperty(target, field, {
    enumerable: true,
    get: () => {
      reads += 1;
      return reads === 1 ? first : second;
    },
  });
  return () => reads;
}

describe("Model Capability single-read construction snapshots", () => {
  it("reads a changing fact once and never admits the later secret", () => {
    const raw = {
      kind: "project-fact",
      projectId: projectId("p-1"),
      relevance: text("Relevant to the request"),
    } as Record<string, unknown>;
    const reads = changingGetter(raw, "fact", text("First benign fact"), text("secret: synthetic-secret"));
    const result = createBoundedModelContext({
      items: [raw] as never,
      itemLimit: 1,
      selectionReason: text("One fact is necessary"),
    });

    expect(reads()).toBe(1);
    expect(result).toMatchObject({
      kind: "bounded-context",
      value: { items: [{ fact: "First benign fact" }] },
    });
  });

  it.each([
    ["summary", {
      kind: "action-summary",
      projectId: projectId("p-1"),
      actionId: actionId("a-1"),
      relevance: text("Relevant"),
    }, "First benign summary", "Second benign summary"],
    ["excerpt", {
      kind: "knowledge-excerpt",
      knowledgeItemId: knowledgeItemId("k-1"),
      originatingProjectId: projectId("p-1"),
      relevance: text("Relevant"),
      currentness: "current",
    }, "First benign excerpt", "Second benign excerpt"],
    ["relevance", {
      kind: "project-fact",
      projectId: projectId("p-1"),
      fact: text("Benign fact"),
    }, "First benign relevance", "Second benign relevance"],
    ["qualification", {
      kind: "knowledge-excerpt",
      knowledgeItemId: knowledgeItemId("k-1"),
      originatingProjectId: projectId("p-1"),
      excerpt: text("Benign excerpt"),
      relevance: text("Relevant"),
      currentness: "qualified-prior",
    }, "First benign qualification", "Second benign qualification"],
  ])("reads changing %s once and constructs from its first snapshot", (
    field,
    base,
    first,
    second,
  ) => {
    const raw = base as Record<string, unknown>;
    const reads = changingGetter(raw, field, text(first), text(second));
    const result = createBoundedModelContext({
      items: [raw] as never,
      itemLimit: 1,
      selectionReason: text("One projection is necessary"),
    });

    expect(reads()).toBe(1);
    expect(result).toMatchObject({ kind: "bounded-context" });
    if (result.kind !== "bounded-context") return;
    const item = result.value.items[0];
    expect(
      field === "summary" ? item.kind === "action-summary" && item.summary
        : field === "excerpt" ? item.kind === "knowledge-excerpt" && item.excerpt
          : field === "relevance" ? item.relevance
            : item.kind === "knowledge-excerpt" && item.qualification,
    ).toBe(first);
  });

  it("uses stable snapshots for selection rationale and item limit", () => {
    const input = { items: [], itemLimit: 1 } as Record<string, unknown>;
    const reasonReads = changingGetter(
      input,
      "selectionReason",
      text("First benign rationale"),
      text("secret: synthetic-secret"),
    );
    const limitReads = changingGetter(input, "itemLimit", 1, 0);
    const result = createBoundedModelContext(input as never);

    expect(reasonReads()).toBe(1);
    expect(limitReads()).toBe(1);
    expect(result).toMatchObject({
      kind: "bounded-context",
      value: { itemLimit: 1, selectionReason: "First benign rationale" },
    });
  });

  it("snapshots a proxy collection before validation and construction", () => {
    const benign = {
      kind: "project-fact" as const,
      projectId: projectId("p-1"),
      fact: text("First benign fact"),
      relevance: text("Relevant"),
    };
    const secret = { ...benign, fact: text("secret: synthetic-secret") };
    let reads = 0;
    const items = new Proxy([benign], {
      get(target, property, receiver) {
        if (property === "0") {
          reads += 1;
          return reads === 1 ? benign : secret;
        }
        return Reflect.get(target, property, receiver);
      },
    });
    const result = createBoundedModelContext({
      items,
      itemLimit: 1,
      selectionReason: text("One fact is necessary"),
    });

    expect(reads).toBe(1);
    expect(result).toMatchObject({
      kind: "bounded-context",
      value: { items: [{ fact: "First benign fact" }] },
    });
  });

  it("snapshots request interaction and constraints before validation", () => {
    const input = {
      capability: "generate-advice",
      context: genuineContext(),
    } as Record<string, unknown>;
    const interactionReads = changingGetter(
      input,
      "interaction",
      text("First benign interaction"),
      text("secret: synthetic-secret"),
    );
    const benignConstraint = text("First benign constraint");
    const secretConstraint = text("secret: synthetic-secret");
    let constraintReads = 0;
    const constraints = new Proxy([benignConstraint], {
      get(target, property, receiver) {
        if (property === "0") {
          constraintReads += 1;
          return constraintReads === 1 ? benignConstraint : secretConstraint;
        }
        return Reflect.get(target, property, receiver);
      },
    });
    Object.defineProperty(input, "constraints", { enumerable: true, value: constraints });
    const result = createModelCapabilityRequest(input as never);

    expect(interactionReads()).toBe(1);
    expect(constraintReads).toBe(1);
    expect(result).toMatchObject({
      kind: "model-request",
      value: {
        interaction: "First benign interaction",
        constraints: ["First benign constraint"],
      },
    });
  });
});

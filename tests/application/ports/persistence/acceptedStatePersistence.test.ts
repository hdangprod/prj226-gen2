import { describe, expect, expectTypeOf, it } from "vitest";
import { persistenceOperationId, type AcceptedStateWrite, type PersistenceCommitResult } from "../../../../src/application/ports/persistence";
import type { AcceptedProgress, KnowledgeItem } from "../../../../src/domain/model";

describe("provider-neutral persistence contract", () => {
  it("keeps durable success and failure distinguishable", () => {
    const outcomes: readonly PersistenceCommitResult[] = [
      { kind: "committed" },
      { kind: "already-committed" },
      { kind: "persistence-failed", reason: "durability-failure", retryable: true },
    ];
    expect(outcomes.map(({ kind }) => kind)).toEqual(["committed", "already-committed", "persistence-failed"]);
    expect(persistenceOperationId("operation-1")).toBe("operation-1");
  });

  it("defines corrections solely by their persisted successor", () => {
    type CorrectionWrites = Extract<AcceptedStateWrite, { readonly kind: "correct-progress" | "correct-knowledge" }>;
    expectTypeOf<Extract<CorrectionWrites, { readonly kind: "correct-progress" }>>().toEqualTypeOf<{
      readonly kind: "correct-progress";
      readonly successor: AcceptedProgress;
    }>();
    expectTypeOf<Extract<CorrectionWrites, { readonly kind: "correct-knowledge" }>>().toEqualTypeOf<{
      readonly kind: "correct-knowledge";
      readonly successor: KnowledgeItem;
    }>();

    // @ts-expect-error Corrections name their authoritative predecessor only through successor.supersedesId.
    const obsoleteProgressSnapshot: AcceptedStateWrite = { kind: "correct-progress", prior: {} as AcceptedProgress, successor: {} as AcceptedProgress };
    // @ts-expect-error Knowledge corrections also name their predecessor only through successor.supersedesId.
    const obsoleteKnowledgeSnapshot: AcceptedStateWrite = { kind: "correct-knowledge", prior: {} as KnowledgeItem, successor: {} as KnowledgeItem };
    expect(obsoleteProgressSnapshot).toBeDefined();
    expect(obsoleteKnowledgeSnapshot).toBeDefined();
  });
});

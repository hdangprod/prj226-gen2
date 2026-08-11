import { describe, expect, it } from "vitest";
import { persistenceOperationId, type PersistenceCommitResult } from "../../../../src/application/ports/persistence";

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
});

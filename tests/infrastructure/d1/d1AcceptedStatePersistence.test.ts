import { describe, expect, it } from "vitest";
import { persistenceOperationId, type AcceptedStateCommit } from "../../../src/application/ports/persistence";
import { nonEmptyText, progressId, projectId } from "../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../src/infrastructure/d1";
import { FakeD1 } from "./fakeD1";

function commit(operation = "operation-1", outcome = "Ship safely"): AcceptedStateCommit {
  return {
    operationId: persistenceOperationId(operation),
    writes: [{ kind: "put-project", project: { id: projectId("project-1"), intendedOutcome: nonEmptyText(outcome)!, state: "Active" } }],
  };
}

describe("D1 accepted-state adapter", () => {
  it("reports committed only after every atomic batch result succeeds", async () => {
    const database = new FakeD1();
    const result = await new D1AcceptedStatePersistence(database).commitAcceptedState(commit());
    expect(result).toEqual({ kind: "committed" });
    expect(database.batches[0]).toHaveLength(2);
    expect(database.batches[0].at(-1)?.query).toContain("persistence_operations");
  });

  it("does not report success for an injected batch or partial failure", async () => {
    const failed = new FakeD1();
    failed.failBatch = new Error("commit unavailable");
    await expect(new D1AcceptedStatePersistence(failed).commitAcceptedState(commit())).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    const partial = new FakeD1();
    partial.partialResult = true;
    await expect(new D1AcceptedStatePersistence(partial).commitAcceptedState(commit())).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
  });

  it("makes identical retries safe and rejects operation-id collisions", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState(commit())).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState(commit())).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState(commit("operation-1", "Different"))).resolves.toEqual({ kind: "persistence-failed", reason: "operation-id-conflict", retryable: false });
  });

  it("keeps a correction and its receipt in one atomic batch", async () => {
    const database = new FakeD1();
    const result = await new D1AcceptedStatePersistence(database).commitAcceptedState({
      operationId: persistenceOperationId("progress-correction"),
      writes: [{
        kind: "correct-progress",
        prior: { id: progressId("progress-1"), projectId: projectId("project-1"), statement: nonEmptyText("Old")!, standing: "superseded" },
        successor: { id: progressId("progress-2"), projectId: projectId("project-1"), statement: nonEmptyText("New")!, standing: "current", supersedesId: progressId("progress-1") },
      }],
    });
    expect(result.kind).toBe("committed");
    expect(database.batches[0]).toHaveLength(2);
    expect(database.batches[0][0].query).toContain("accepted_progress");
  });
});

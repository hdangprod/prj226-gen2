import { describe, expect, it } from "vitest";
import { persistenceOperationId, type AcceptedStateCommit, type AcceptedStateWrite } from "../../../src/application/ports/persistence";
import { actionId, knowledgeItemId, nonEmptyText, progressId, projectId } from "../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../src/infrastructure/d1";
import type { D1DatabaseLike } from "../../../src/infrastructure/d1/d1Types";
import { FakeD1 } from "./fakeD1";

function commit(operation = "operation-1", outcome = "Ship safely"): AcceptedStateCommit {
  return {
    operationId: persistenceOperationId(operation),
    writes: [{ kind: "create-project", project: { id: projectId("project-1"), intendedOutcome: nonEmptyText(outcome)!, state: "Active" } }],
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

  it("rolls back an explicit partial failure and retries normally", async () => {
    const failed = new FakeD1();
    failed.failBatch = new Error("commit unavailable");
    await expect(new D1AcceptedStatePersistence(failed).commitAcceptedState(commit())).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    const partial = new FakeD1();
    partial.partialResult = true;
    const partialAdapter = new D1AcceptedStatePersistence(partial);
    await expect(partialAdapter.commitAcceptedState(commit())).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(partial.projects.size).toBe(0);
    expect(partial.receipts.size).toBe(0);
    partial.partialResult = false;
    await expect(partialAdapter.commitAcceptedState(commit())).resolves.toEqual({ kind: "committed" });
  });

  it("rejects a Project identity conflict without applying its lifecycle state", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState(commit("project-create", "Original"))).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({
      operationId: persistenceOperationId("project-conflict"),
      writes: [{ kind: "create-project", project: { id: projectId("project-1"), intendedOutcome: nonEmptyText("Different")!, state: "Active" } }],
    })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(database.projects.get("project-1")).toEqual({ intendedOutcome: "Original", state: "Active" });
    expect(database.receipts.has("project-conflict")).toBe(false);
  });

  it("allows Project lifecycle change when immutable identity matches", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await adapter.commitAcceptedState(commit("project-create", "Original"));
    await expect(adapter.commitAcceptedState({
      operationId: persistenceOperationId("project-complete"),
      writes: [{ kind: "transition-project", projectId: projectId("project-1"), expectedState: "Active", nextState: "Completed" }],
    })).resolves.toEqual({ kind: "committed" });
    expect(database.projects.get("project-1")?.state).toBe("Completed");
  });

  it("rejects Action ownership/content conflicts and permits lifecycle change", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await adapter.commitAcceptedState(commit("project-create"));
    const original = { id: actionId("action-1"), projectId: projectId("project-1"), description: nonEmptyText("Original action")!, state: "Open" as const };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("action-create"), writes: [{ kind: "create-action", action: original }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({
      operationId: persistenceOperationId("action-conflict"),
      writes: [{ kind: "create-action", action: { ...original, description: nonEmptyText("Different action")!, state: "Open" } }],
    })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(database.actions.get("action-1")).toEqual({ projectId: "project-1", description: "Original action", state: "Open" });
    expect(database.receipts.has("action-conflict")).toBe(false);
    await expect(adapter.commitAcceptedState({
      operationId: persistenceOperationId("action-complete"),
      writes: [{ kind: "transition-action", actionId: original.id, projectId: original.projectId, expectedState: "Open", nextState: "Completed" }],
    })).resolves.toEqual({ kind: "committed" });
    expect(database.actions.get("action-1")?.state).toBe("Completed");
  });

  it("uses authoritative existence, ownership, and expected state for lifecycle transitions", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const failed = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const project = { id: projectId("authoritative-project"), intendedOutcome: nonEmptyText("Authoritative outcome")!, state: "Active" as const };
    const action = { id: actionId("authoritative-action"), projectId: project.id, description: nonEmptyText("Authoritative action")!, state: "Open" as const };

    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("completed-project-create"), writes: [{ kind: "create-project", project: { ...project, state: "Completed" } }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("completed-action-create"), writes: [{ kind: "create-action", action: { ...action, state: "Completed" } }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("missing-project-transition"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("missing-action-transition"), writes: [{ kind: "transition-action", actionId: action.id, projectId: project.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
    expect(database.projects).toHaveLength(0);
    expect(database.actions).toHaveLength(0);
    expect(database.receipts).toHaveLength(0);

    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("project-create-authoritative"), writes: [{ kind: "create-project", project }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("project-create-authoritative"), writes: [{ kind: "create-project", project }] })).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("missing-owner-action-create"), writes: [{ kind: "create-action", action: { ...action, id: actionId("missing-owner-action"), projectId: projectId("missing-owner") } }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("action-create-authoritative"), writes: [{ kind: "create-action", action }] })).resolves.toEqual({ kind: "committed" });

    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("wrong-project-state"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Completed", nextState: "Active" }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("project-complete-authoritative"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("project-complete-authoritative"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("stale-project-state"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);

    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("wrong-action-owner"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectId("other-project"), expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("action-complete-authoritative"), writes: [{ kind: "transition-action", actionId: action.id, projectId: project.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("action-complete-authoritative"), writes: [{ kind: "transition-action", actionId: action.id, projectId: project.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual({ kind: "already-committed" });
    expect(database.actions.get(action.id)?.state).toBe("Completed");
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("action-reopen-authoritative"), writes: [{ kind: "transition-action", actionId: action.id, projectId: project.id, expectedState: "Completed", nextState: "Open" }] })).resolves.toEqual({ kind: "committed" });
    expect(database.projects.get(project.id)?.state).toBe("Completed");
    expect(database.actions.get(action.id)?.state).toBe("Open");
    for (const operation of ["completed-project-create", "completed-action-create", "missing-project-transition", "missing-action-transition", "missing-owner-action-create", "wrong-project-state", "stale-project-state", "wrong-action-owner"]) {
      expect(database.receipts.has(operation)).toBe(false);
    }
  });

  it("uses only the D1 database and prepared-statement methods available in production", async () => {
    const database = new FakeD1();
    const productionSurface: D1DatabaseLike = {
      prepare: database.prepare.bind(database),
      batch: database.batch.bind(database),
    };
    const adapter = new D1AcceptedStatePersistence(productionSurface);
    const failed = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const project = { id: projectId("surface-project"), intendedOutcome: nonEmptyText("Surface")!, state: "Active" as const };
    const action = { id: actionId("surface-action"), projectId: project.id, description: nonEmptyText("Surface action")!, state: "Open" as const };

    expect("first" in productionSurface).toBe(false);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-create-project"), writes: [{ kind: "create-project", project }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-transition-project"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-transition-project"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-transition-project"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Completed", nextState: "Active" }] })).resolves.toEqual({ kind: "persistence-failed", reason: "operation-id-conflict", retryable: false });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-stale-project"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-missing-project"), writes: [{ kind: "transition-project", projectId: projectId("missing-project"), expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-create-action"), writes: [{ kind: "create-action", action }] })).resolves.toEqual({ kind: "committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("surface-wrong-owner"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectId("other-project"), expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
    expect(database.projects.get(project.id)?.state).toBe("Completed");
    expect(database.actions.get(action.id)?.state).toBe("Open");
    expect(database.receipts.has("surface-stale-project")).toBe(false);
    expect(database.receipts.has("surface-missing-project")).toBe(false);
    expect(database.receipts.has("surface-wrong-owner")).toBe(false);
  });

  it("treats malformed receipt-query results as retryable durability failures", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const project = { id: projectId("malformed-receipt-project"), intendedOutcome: nonEmptyText("Malformed receipt")!, state: "Active" as const };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("malformed-receipt-create"), writes: [{ kind: "create-project", project }] });
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("malformed-receipt-complete"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] });
    database.receiptLookupOverride = { enabled: true, value: undefined };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("malformed-receipt-stale"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.projects.get(project.id)?.state).toBe("Completed");
    expect(database.receipts.has("malformed-receipt-stale")).toBe(false);
  });

  it("maps a receipt-query failure to a retryable durability failure", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const project = { id: projectId("receipt-query-project"), intendedOutcome: nonEmptyText("Receipt query")!, state: "Active" as const };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("receipt-query-create"), writes: [{ kind: "create-project", project }] });
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("receipt-query-complete"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] });
    database.failReceiptLookup = new Error("D1 unavailable");
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("receipt-query-stale"), writes: [{ kind: "transition-project", projectId: project.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.projects.get(project.id)?.state).toBe("Completed");
    expect(database.receipts.has("receipt-query-stale")).toBe(false);
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
    const adapter = new D1AcceptedStatePersistence(database);
    await adapter.commitAcceptedState({
      operationId: persistenceOperationId("progress-create"),
      writes: [{ kind: "put-progress", progress: { id: progressId("progress-1"), projectId: projectId("project-1"), statement: nonEmptyText("Old")!, standing: "current" } }],
    });
    const result = await adapter.commitAcceptedState({
      operationId: persistenceOperationId("progress-correction"),
      writes: [{
        kind: "correct-progress",
        successor: { id: progressId("progress-2"), projectId: projectId("project-1"), statement: nonEmptyText("New")!, standing: "current", supersedesId: progressId("progress-1") },
      }],
    });
    expect(result.kind).toBe("committed");
    expect(database.batches[1]).toHaveLength(2);
    expect(database.batches[1][0].query).toContain("accepted_progress");
  });

  it("rolls back Progress correction and receipt after staged work, then retries", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const prior = { id: progressId("progress-1"), projectId: projectId("project-1"), statement: nonEmptyText("Old")!, standing: "current" as const };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("progress-create"), writes: [{ kind: "put-progress", progress: prior }] });
    const correction: AcceptedStateCommit = {
      operationId: persistenceOperationId("progress-correct"),
      writes: [{ kind: "correct-progress", successor: { id: progressId("progress-2"), projectId: projectId("project-1"), statement: nonEmptyText("New")!, standing: "current", supersedesId: prior.id } }],
    };
    database.partialResult = true;
    await expect(adapter.commitAcceptedState(correction)).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.progress.get("progress-1")?.standing).toBe("current");
    expect(database.progress.has("progress-2")).toBe(false);
    expect(database.receipts.has("progress-correct")).toBe(false);
    database.partialResult = false;
    await expect(adapter.commitAcceptedState(correction)).resolves.toEqual({ kind: "committed" });
    expect(database.progress.get("progress-1")?.standing).toBe("superseded");
    expect(database.progress.get("progress-2")?.standing).toBe("current");
    await expect(adapter.commitAcceptedState(correction)).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState({
      ...correction,
      writes: [{ kind: "correct-progress", successor: { id: progressId("progress-3"), projectId: projectId("project-1"), statement: nonEmptyText("Different")!, standing: "current", supersedesId: prior.id } }],
    })).resolves.toEqual({ kind: "persistence-failed", reason: "operation-id-conflict", retryable: false });
  });

  it("rolls back Knowledge correction and receipt after staged work, then retries", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const prior = { id: knowledgeItemId("knowledge-1"), originatingProjectId: projectId("project-1"), content: nonEmptyText("Old")!, standing: "current" as const, supersessionChain: [] };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("knowledge-create"), writes: [{ kind: "put-knowledge", item: prior }] });
    const correction: AcceptedStateCommit = {
      operationId: persistenceOperationId("knowledge-correct"),
      writes: [{ kind: "correct-knowledge", successor: { id: knowledgeItemId("knowledge-2"), originatingProjectId: projectId("project-1"), content: nonEmptyText("New")!, standing: "current", supersedesId: prior.id, supersessionChain: [prior.id] } }],
    };
    database.partialResult = true;
    await expect(adapter.commitAcceptedState(correction)).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.knowledge.get("knowledge-1")?.standing).toBe("current");
    expect(database.knowledge.has("knowledge-2")).toBe(false);
    expect(database.receipts.has("knowledge-correct")).toBe(false);
    database.partialResult = false;
    await expect(adapter.commitAcceptedState(correction)).resolves.toEqual({ kind: "committed" });
    expect(database.knowledge.get("knowledge-1")?.standing).toBe("superseded");
    expect(database.knowledge.get("knowledge-2")?.standing).toBe("current");
  });

  it("rolls back accepted context facts and receipt after staged work", async () => {
    const database = new FakeD1();
    database.partialResult = true;
    const result = await new D1AcceptedStatePersistence(database).commitAcceptedState({
      operationId: persistenceOperationId("context-append"),
      writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts: [nonEmptyText("Accepted fact")!] }],
    });
    expect(result).toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.contextFacts.size).toBe(0);
    expect(database.receipts.has("context-append")).toBe(false);
  });

  it("rejects a structurally wider Progress correction before fingerprint or D1", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const prior = { id: progressId("wide-progress-1"), projectId: projectId("project-1"), statement: nonEmptyText("Old")!, standing: "current" as const };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("wide-progress-create"), writes: [{ kind: "put-progress", progress: prior }] });
    const successor = { id: progressId("wide-progress-2"), projectId: projectId("project-1"), statement: nonEmptyText("New")!, standing: "current" as const, supersedesId: prior.id };
    const wider = { kind: "correct-progress" as const, successor, prior: { ...prior, standing: "superseded" as const } };
    const structurallyAccepted: AcceptedStateWrite = wider;
    const batchesBefore = database.batches.length;
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("wide-progress-correct"), writes: [structurallyAccepted] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(database.batches).toHaveLength(batchesBefore);
    expect(database.progress.get("wide-progress-1")?.standing).toBe("current");
    expect(database.progress.has("wide-progress-2")).toBe(false);
    expect(database.receipts.has("wide-progress-correct")).toBe(false);
  });

  it("rejects wider Knowledge correction and unknown-field retry before receipt lookup", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const prior = { id: knowledgeItemId("wide-knowledge-1"), originatingProjectId: projectId("project-1"), content: nonEmptyText("Old")!, standing: "current" as const, supersessionChain: [] };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("wide-knowledge-create"), writes: [{ kind: "put-knowledge", item: prior }] });
    const successor = { id: knowledgeItemId("wide-knowledge-2"), originatingProjectId: projectId("project-1"), content: nonEmptyText("New")!, standing: "current" as const, supersedesId: prior.id, supersessionChain: [prior.id] };
    const wider = { kind: "correct-knowledge" as const, successor, prior: { ...prior, standing: "superseded" as const } };
    const structurallyAccepted: AcceptedStateWrite = wider;
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("wide-knowledge-correct"), writes: [structurallyAccepted] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(database.knowledge.get("wide-knowledge-1")?.standing).toBe("current");
    expect(database.knowledge.has("wide-knowledge-2")).toBe(false);
    expect(database.receipts.has("wide-knowledge-correct")).toBe(false);

    const valid: AcceptedStateCommit = { operationId: persistenceOperationId("wide-knowledge-correct"), writes: [{ kind: "correct-knowledge", successor }] };
    await expect(adapter.commitAcceptedState(valid)).resolves.toEqual({ kind: "committed" });
    expect(database.receipts.get("wide-knowledge-correct")).not.toContain("prior");
    await expect(adapter.commitAcceptedState({ operationId: valid.operationId, writes: [structurallyAccepted] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    await expect(adapter.commitAcceptedState(valid)).resolves.toEqual({ kind: "already-committed" });
  });

  it("rejects arbitrary extras, unknown kinds, null-like input, and commit extras", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const invalidResult = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const extraProject = { ...commit("extra-project"), writes: [{ ...commit().writes[0], unexpected: true }] } as unknown as AcceptedStateCommit;
    await expect(adapter.commitAcceptedState(extraProject)).resolves.toEqual(invalidResult);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("extra-progress"), writes: [{ kind: "correct-progress", successor: {}, unexpected: true }] } as unknown as AcceptedStateCommit)).resolves.toEqual(invalidResult);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("extra-knowledge"), writes: [{ kind: "correct-knowledge", successor: {}, unexpected: true }] } as unknown as AcceptedStateCommit)).resolves.toEqual(invalidResult);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("unknown"), writes: [{ kind: "unknown-write" }] } as unknown as AcceptedStateCommit)).resolves.toEqual(invalidResult);
    await expect(adapter.commitAcceptedState(null as unknown as AcceptedStateCommit)).resolves.toEqual(invalidResult);
    await expect(adapter.commitAcceptedState({ ...commit("commit-extra"), unexpected: true } as unknown as AcceptedStateCommit)).resolves.toEqual(invalidResult);
    expect(database.batches).toHaveLength(0);
    expect(database.receipts.size).toBe(0);
  });

  it("rejects wider nested payloads for every entity write", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const invalid = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const project = { id: projectId("nested-project"), intendedOutcome: nonEmptyText("Outcome")!, state: "Active" as const, unexpected: "ignored" };
    const action = { id: actionId("nested-action"), projectId: projectId("nested-project"), description: nonEmptyText("Action")!, state: "Open" as const, unexpected: "ignored" };
    const progress = { id: progressId("nested-progress"), projectId: projectId("nested-project"), statement: nonEmptyText("Progress")!, standing: "current" as const, unexpected: "ignored" };
    const knowledge = { id: knowledgeItemId("nested-knowledge"), originatingProjectId: projectId("nested-project"), content: nonEmptyText("Knowledge")!, standing: "current" as const, supersessionChain: [], unexpected: "ignored" };
    const writes: AcceptedStateWrite[] = [
      { kind: "create-project", project },
      { kind: "create-action", action },
      { kind: "put-progress", progress },
      { kind: "correct-progress", successor: progress },
      { kind: "put-knowledge", item: knowledge },
      { kind: "correct-knowledge", successor: knowledge },
    ];
    for (const [index, write] of writes.entries()) {
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId(`nested-${index}`), writes: [write] })).resolves.toEqual(invalid);
    }
    expect(database.batches).toHaveLength(0);
    expect(database.receipts.size).toBe(0);
  });

  it("rejects malformed nested objects, array extras, Symbols, and non-enumerable keys", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const invalid = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const validProgress = { id: progressId("shape-progress"), projectId: projectId("project-1"), statement: nonEmptyText("Progress")!, standing: "current" as const };
    const symbolProgress = { ...validProgress } as Record<PropertyKey, unknown>;
    symbolProgress[Symbol("extra")] = true;
    const nonEnumerableKnowledge = { id: knowledgeItemId("shape-knowledge"), originatingProjectId: projectId("project-1"), content: nonEmptyText("Knowledge")!, standing: "current" as const, supersessionChain: [] } as Record<PropertyKey, unknown>;
    Object.defineProperty(nonEnumerableKnowledge, "hidden", { value: true, enumerable: false });
    const symbolProject = { id: projectId("shape-project"), intendedOutcome: nonEmptyText("Outcome")!, state: "Active" as const } as Record<PropertyKey, unknown>;
    symbolProject[Symbol("extra")] = true;
    const facts = [nonEmptyText("Fact")!] as Array<ReturnType<typeof nonEmptyText>> & { unexpected?: string };
    facts.unexpected = "ignored";
    const malformed: AcceptedStateCommit[] = [
      { operationId: persistenceOperationId("symbol-progress"), writes: [{ kind: "correct-progress", successor: symbolProgress } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("hidden-knowledge"), writes: [{ kind: "correct-knowledge", successor: nonEnumerableKnowledge } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("symbol-project"), writes: [{ kind: "create-project", project: symbolProject } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("array-extra"), writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("null-progress"), writes: [{ kind: "correct-progress", successor: null } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("primitive-knowledge"), writes: [{ kind: "put-knowledge", item: "bad" } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("missing-project"), writes: [{ kind: "create-project", project: { id: projectId("missing"), state: "Active" } } as unknown as AcceptedStateWrite] },
      { operationId: persistenceOperationId("object-fact"), writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts: [{ unexpected: true }] } as unknown as AcceptedStateWrite] },
    ];
    for (const commit of malformed) await expect(adapter.commitAcceptedState(commit)).resolves.toEqual(invalid);
    expect(database.batches).toHaveLength(0);
  });

  it("rebuilds lineage arrays and ignores inherited extras", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const inherited = Object.assign(Object.create({ unexpected: "inherited" }) as Record<string, unknown>, {
      id: knowledgeItemId("owned-knowledge"),
      originatingProjectId: projectId("project-1"),
      content: nonEmptyText("Knowledge")!,
      standing: "current" as const,
      supersessionChain: [] as ReturnType<typeof knowledgeItemId>[],
    });
    const write: AcceptedStateWrite = { kind: "put-knowledge", item: inherited as never };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("owned-knowledge"), writes: [write] })).resolves.toEqual({ kind: "committed" });
    const fingerprint = database.receipts.get("owned-knowledge")!;
    expect(fingerprint).not.toContain("unexpected");
    expect(fingerprint).toContain("supersessionChain");
    inherited.supersessionChain.push(knowledgeItemId("mutated"));
    expect(database.knowledge.get("owned-knowledge")?.supersessionChain).toBe("[]");
  });

  it("reads a caller-owned semantic field once and uses the owned snapshot thereafter", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    let intendedOutcomeReads = 0;
    const project = {
      id: projectId("mutation-project"),
      get intendedOutcome() {
        intendedOutcomeReads += 1;
        return nonEmptyText(intendedOutcomeReads === 1 ? "Original" : "Mutated")!;
      },
      state: "Active" as const,
    };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("mutation-project"), writes: [{ kind: "create-project", project }] })).resolves.toEqual({ kind: "committed" });
    expect(intendedOutcomeReads).toBe(1);
    expect(database.projects.get("mutation-project")?.intendedOutcome).toBe("Original");
    expect(database.receipts.get("mutation-project")).toContain("Original");
    expect(database.receipts.get("mutation-project")).not.toContain("Mutated");
  });

  it("treats inherited optional Progress fields as absent without invoking getters", async () => {
    let actionGetterReads = 0;
    let predecessorGetterReads = 0;
    const prototype = Object.defineProperties({}, {
      actionId: { get: () => { actionGetterReads += 1; return actionId("inherited-action"); } },
      supersedesId: { get: () => { predecessorGetterReads += 1; return progressId("inherited-prior"); } },
    });
    const progress = Object.assign(Object.create(prototype) as Record<string, unknown>, {
      id: progressId("prototype-progress"),
      projectId: projectId("project-1"),
      statement: nonEmptyText("Progress")!,
      standing: "current" as const,
    });
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("prototype-progress-put"), writes: [{ kind: "put-progress", progress: progress as never }] })).resolves.toEqual({ kind: "committed" });
    expect(actionGetterReads).toBe(0);
    expect(predecessorGetterReads).toBe(0);
    expect(database.progress.get("prototype-progress")?.actionId).toBeNull();
    expect(database.progress.get("prototype-progress")?.supersedesId).toBeNull();
    expect(database.receipts.get("prototype-progress-put")).not.toContain("actionId");
    expect(database.receipts.get("prototype-progress-put")).not.toContain("supersedesId");
    const batchesBefore = database.batches.length;
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("prototype-progress-correct"), writes: [{ kind: "correct-progress", successor: progress as never }] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("undefined-progress-correct"), writes: [{ kind: "correct-progress", successor: { ...progress, supersedesId: undefined } as never }] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(database.batches).toHaveLength(batchesBefore);
    expect(predecessorGetterReads).toBe(0);
  });

  it("treats inherited Knowledge predecessor as absent without invoking its getter", async () => {
    let getterReads = 0;
    const prototype = Object.defineProperty({}, "supersedesId", { get: () => { getterReads += 1; return knowledgeItemId("inherited-prior"); } });
    const item = Object.assign(Object.create(prototype) as Record<string, unknown>, {
      id: knowledgeItemId("prototype-knowledge"),
      originatingProjectId: projectId("project-1"),
      content: nonEmptyText("Knowledge")!,
      standing: "current" as const,
      supersessionChain: [] as ReturnType<typeof knowledgeItemId>[],
    });
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("prototype-knowledge-put"), writes: [{ kind: "put-knowledge", item: item as never }] })).resolves.toEqual({ kind: "committed" });
    expect(getterReads).toBe(0);
    expect(database.knowledge.get("prototype-knowledge")?.supersedesId).toBeNull();
    expect(database.receipts.get("prototype-knowledge-put")).not.toContain("supersedesId");
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("prototype-knowledge-correct"), writes: [{ kind: "correct-knowledge", successor: item as never }] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    const ownUndefined = { ...item, id: knowledgeItemId("undefined-knowledge"), supersedesId: undefined };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("undefined-knowledge-put"), writes: [{ kind: "put-knowledge", item: ownUndefined as never }] })).resolves.toEqual({ kind: "committed" });
    expect(database.receipts.get("undefined-knowledge-put")).not.toContain("supersedesId");
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("undefined-knowledge-correct"), writes: [{ kind: "correct-knowledge", successor: ownUndefined as never }] })).resolves.toEqual({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    expect(getterReads).toBe(0);
  });

  it("retains own optional values and normalizes own undefined to absence", async () => {
    let ownGetterReads = 0;
    const withOwnAction = {
      id: progressId("own-action-progress"),
      projectId: projectId("project-1"),
      statement: nonEmptyText("Progress")!,
      standing: "current" as const,
      get actionId() { ownGetterReads += 1; return actionId("own-action"); },
    };
    const ownDatabase = new FakeD1();
    await expect(new D1AcceptedStatePersistence(ownDatabase).commitAcceptedState({ operationId: persistenceOperationId("own-action-progress"), writes: [{ kind: "put-progress", progress: withOwnAction }] })).resolves.toEqual({ kind: "committed" });
    expect(ownGetterReads).toBe(1);
    expect(ownDatabase.progress.get("own-action-progress")?.actionId).toBe("own-action");

    const absentDatabase = new FakeD1();
    const undefinedDatabase = new FakeD1();
    const base = { id: progressId("absence-progress"), projectId: projectId("project-1"), statement: nonEmptyText("Progress")!, standing: "current" as const };
    await new D1AcceptedStatePersistence(absentDatabase).commitAcceptedState({ operationId: persistenceOperationId("absence"), writes: [{ kind: "put-progress", progress: base }] });
    await new D1AcceptedStatePersistence(undefinedDatabase).commitAcceptedState({ operationId: persistenceOperationId("absence"), writes: [{ kind: "put-progress", progress: { ...base, actionId: undefined, supersedesId: undefined } }] });
    expect(undefinedDatabase.receipts.get("absence")).toBe(absentDatabase.receipts.get("absence"));
  });

  it("rejects inherited canonical-looking required fields", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const invalid = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const project = Object.assign(Object.create({ id: projectId("inherited-id") }) as Record<string, unknown>, { intendedOutcome: nonEmptyText("Outcome")!, state: "Active" as const });
    const progress = Object.assign(Object.create({ projectId: projectId("inherited-project") }) as Record<string, unknown>, { id: progressId("required-progress"), statement: nonEmptyText("Progress")!, standing: "current" as const });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("required-project"), writes: [{ kind: "create-project", project: project as never }] })).resolves.toEqual(invalid);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("required-progress"), writes: [{ kind: "put-progress", progress: progress as never }] })).resolves.toEqual(invalid);
    expect(database.batches).toHaveLength(0);
  });

  it("canonicalizes facts from own indices without invoking an inherited iterator", async () => {
    let iteratorReads = 0;
    const facts: Array<NonNullable<ReturnType<typeof nonEmptyText>>> = [nonEmptyText("own-indexed-fact")!];
    Object.setPrototypeOf(facts, {
      [Symbol.iterator]: function* () {
        iteratorReads += 1;
        yield "prototype-injected-fact";
      },
    });
    const database = new FakeD1();
    await expect(new D1AcceptedStatePersistence(database).commitAcceptedState({
      operationId: persistenceOperationId("facts-own-indices"),
      writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts }],
    })).resolves.toEqual({ kind: "committed" });
    expect(iteratorReads).toBe(0);
    expect(database.contextFacts.get("project-1")).toEqual(["own-indexed-fact"]);
    expect(database.receipts.get("facts-own-indices")).toContain("own-indexed-fact");
    expect(database.receipts.get("facts-own-indices")).not.toContain("prototype-injected-fact");
  });

  it("canonicalizes Knowledge lineage from own indices without invoking an inherited iterator", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const prior = { id: knowledgeItemId("iterator-knowledge-1"), originatingProjectId: projectId("project-1"), content: nonEmptyText("Old")!, standing: "current" as const, supersessionChain: [] };
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("iterator-knowledge-create"), writes: [{ kind: "put-knowledge", item: prior }] });
    let iteratorReads = 0;
    const lineage = [prior.id] as ReturnType<typeof knowledgeItemId>[];
    Object.setPrototypeOf(lineage, {
      [Symbol.iterator]: function* () {
        iteratorReads += 1;
        yield knowledgeItemId("prototype-injected-id");
      },
    });
    const successor = { id: knowledgeItemId("iterator-knowledge-2"), originatingProjectId: projectId("project-1"), content: nonEmptyText("New")!, standing: "current" as const, supersedesId: prior.id, supersessionChain: lineage };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("iterator-knowledge-correct"), writes: [{ kind: "correct-knowledge", successor }] })).resolves.toEqual({ kind: "committed" });
    expect(iteratorReads).toBe(0);
    expect(database.knowledge.get("iterator-knowledge-2")?.supersessionChain).toBe("[\"iterator-knowledge-1\"]");
    expect(database.receipts.get("iterator-knowledge-correct")).toContain("iterator-knowledge-1");
    expect(database.receipts.get("iterator-knowledge-correct")).not.toContain("prototype-injected-id");
  });

  it("rejects sparse, inherited-index, accessor, and extra-property semantic arrays without invoking getters", async () => {
    const invalid = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    let inheritedIndexReads = 0;
    const inheritedIndex = new Array<string>(1);
    Object.setPrototypeOf(inheritedIndex, Object.defineProperty({}, "0", { get: () => { inheritedIndexReads += 1; return "inherited"; } }));
    let accessorReads = 0;
    const accessor = new Array<string>(1);
    Object.defineProperty(accessor, "0", { get: () => { accessorReads += 1; return "own-accessor"; }, enumerable: true });
    const symbolExtra = ["fact"] as string[];
    (symbolExtra as unknown as Record<PropertyKey, unknown>)[Symbol("extra")] = true;
    const nonEnumerable = ["fact"] as string[];
    Object.defineProperty(nonEnumerable, "hidden", { value: true, enumerable: false });
    const arrays = [inheritedIndex, accessor, symbolExtra, nonEnumerable];
    for (const [index, facts] of arrays.entries()) {
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId(`bad-array-${index}`), writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts: facts as never }] })).resolves.toEqual(invalid);
    }
    expect(inheritedIndexReads).toBe(0);
    expect(accessorReads).toBe(0);
    expect(database.batches).toHaveLength(0);
  });

  it("does not retain caller facts or lineage arrays after canonicalization", async () => {
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    const facts: Array<NonNullable<ReturnType<typeof nonEmptyText>>> = [nonEmptyText("original-fact")!];
    await adapter.commitAcceptedState({ operationId: persistenceOperationId("owned-facts"), writes: [{ kind: "append-context-facts", projectId: projectId("project-1"), facts }] });
    facts[0] = nonEmptyText("mutated-fact")!;
    expect(database.contextFacts.get("project-1")).toEqual(["original-fact"]);
    expect(database.receipts.get("owned-facts")).toContain("original-fact");
    expect(database.receipts.get("owned-facts")).not.toContain("mutated-fact");
  });

  it("canonicalizes commit writes from own indices without invoking inherited iterators", async () => {
    const writeA: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-a"), intendedOutcome: nonEmptyText("A")!, state: "Active" } };
    const writeB: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-b"), intendedOutcome: nonEmptyText("B")!, state: "Active" } };
    const writeC: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-c"), intendedOutcome: nonEmptyText("C")!, state: "Active" } };
    let iteratorReads = 0;
    const writes: AcceptedStateWrite[] = [writeA, writeB];
    Object.setPrototypeOf(writes, {
      [Symbol.iterator]: function* () {
        iteratorReads += 1;
        yield writeC;
      },
    });
    const database = new FakeD1();
    await expect(new D1AcceptedStatePersistence(database).commitAcceptedState({ operationId: persistenceOperationId("writes-own-indices"), writes })).resolves.toEqual({ kind: "committed" });
    expect(iteratorReads).toBe(0);
    expect([...database.projects.keys()]).toEqual(["write-a", "write-b"]);
    expect(database.receipts.get("writes-own-indices")).toContain("write-a");
    expect(database.receipts.get("writes-own-indices")).toContain("write-b");
    expect(database.receipts.get("writes-own-indices")).not.toContain("write-c");
    expect(database.batches[0]).toHaveLength(3);
  });

  it("rejects malformed commit write arrays before receipt lookup without invoking getters or iterators", async () => {
    const invalid = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
    const write: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-shape"), intendedOutcome: nonEmptyText("Shape")!, state: "Active" } };
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-existing"), writes: [write] })).resolves.toEqual({ kind: "committed" });
    let inheritedGetterReads = 0;
    let accessorReads = 0;
    let ownIteratorReads = 0;
    const inheritedData = new Array<AcceptedStateWrite>(1);
    Object.setPrototypeOf(inheritedData, { 0: write });
    const inheritedIndex = new Array<AcceptedStateWrite>(1);
    Object.setPrototypeOf(inheritedIndex, Object.defineProperty({}, "0", { get: () => { inheritedGetterReads += 1; return write; } }));
    const ownAccessor = new Array<AcceptedStateWrite>(1);
    Object.defineProperty(ownAccessor, "0", { get: () => { accessorReads += 1; return write; }, enumerable: true });
    const ownIterator = [write] as AcceptedStateWrite[];
    (ownIterator as unknown as Record<PropertyKey, unknown>)[Symbol.iterator] = function* () { ownIteratorReads += 1; yield write; };
    const sparse = new Array<AcceptedStateWrite>(1);
    const stringMetadata = [write] as AcceptedStateWrite[] & { unexpected?: boolean };
    stringMetadata.unexpected = true;
    const symbolMetadata = [write] as AcceptedStateWrite[];
    (symbolMetadata as unknown as Record<PropertyKey, unknown>)[Symbol("unexpected")] = true;
    const nonEnumerableMetadata = [write] as AcceptedStateWrite[];
    Object.defineProperty(nonEnumerableMetadata, "hidden", { value: true, enumerable: false });
    for (const writes of [inheritedData, inheritedIndex, ownAccessor, ownIterator, sparse, stringMetadata, symbolMetadata, nonEnumerableMetadata]) {
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-existing"), writes })).resolves.toEqual(invalid);
    }
    expect(inheritedGetterReads).toBe(0);
    expect(accessorReads).toBe(0);
    expect(ownIteratorReads).toBe(0);
    expect(database.batches).toHaveLength(1);
    expect(database.receipts).toHaveLength(1);
  });

  it("preserves write order and isolates raw writes and their iterator after canonicalization", async () => {
    const first: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-first"), intendedOutcome: nonEmptyText("First")!, state: "Active" } };
    const second: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-second"), intendedOutcome: nonEmptyText("Second")!, state: "Active" } };
    const replacement: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-replacement"), intendedOutcome: nonEmptyText("Replacement")!, state: "Active" } };
    const writes: AcceptedStateWrite[] = [first, second];
    const database = new FakeD1();
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-owned"), writes })).resolves.toEqual({ kind: "committed" });
    writes[0] = replacement;
    (first.project as unknown as { intendedOutcome: NonNullable<ReturnType<typeof nonEmptyText>> }).intendedOutcome = nonEmptyText("Mutated")!;
    Object.setPrototypeOf(writes, { [Symbol.iterator]: function* () { yield replacement; } });
    expect([...database.projects.keys()]).toEqual(["write-first", "write-second"]);
    expect(database.projects.get("write-first")?.intendedOutcome).toBe("First");
    expect(database.receipts.get("writes-owned")).toContain("write-first");
    expect(database.receipts.get("writes-owned")).toContain("write-second");
    expect(database.receipts.get("writes-owned")).not.toContain("write-replacement");
    const retryFirst: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-first"), intendedOutcome: nonEmptyText("First")!, state: "Active" } };
    const retrySecond: AcceptedStateWrite = { kind: "create-project", project: { id: projectId("write-second"), intendedOutcome: nonEmptyText("Second")!, state: "Active" } };
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-owned"), writes: [retryFirst, retrySecond] })).resolves.toEqual({ kind: "already-committed" });
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-owned"), writes: [retrySecond, retryFirst] })).resolves.toEqual({ kind: "persistence-failed", reason: "operation-id-conflict", retryable: false });
  });

  it("keeps multiple canonical writes and the receipt atomic on partial failure", async () => {
    const writes: AcceptedStateWrite[] = [
      { kind: "create-project", project: { id: projectId("atomic-a"), intendedOutcome: nonEmptyText("A")!, state: "Active" } },
      { kind: "create-project", project: { id: projectId("atomic-b"), intendedOutcome: nonEmptyText("B")!, state: "Active" } },
    ];
    const database = new FakeD1();
    database.partialResult = true;
    const adapter = new D1AcceptedStatePersistence(database);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-atomic"), writes })).resolves.toEqual({ kind: "persistence-failed", reason: "durability-failure", retryable: true });
    expect(database.projects.size).toBe(0);
    expect(database.receipts.size).toBe(0);
    database.partialResult = false;
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-atomic"), writes })).resolves.toEqual({ kind: "committed" });
    expect([...database.projects.keys()]).toEqual(["atomic-a", "atomic-b"]);
    await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("writes-atomic"), writes })).resolves.toEqual({ kind: "already-committed" });
  });
});

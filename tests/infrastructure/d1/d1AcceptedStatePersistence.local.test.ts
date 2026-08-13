import { describe, expect, it } from "vitest";
import { persistenceOperationId, type AcceptedStateCommit } from "../../../src/application/ports/persistence";
import { actionId, nonEmptyText, projectId } from "../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../src/infrastructure/d1";
import { createFreshLocalD1 } from "./localD1";

describe("D1 accepted-state adapter against a fresh migration-backed local D1 database", () => {
  it("keeps every lifecycle edge, failure receipt, and competing expected state authoritative", async () => {
    const local = await createFreshLocalD1();
    try {
      const adapter = new D1AcceptedStatePersistence(local.database);
      const failed = { kind: "persistence-failed", reason: "constraint-conflict", retryable: false } as const;
      const projectA = { id: projectId("local-project-a"), intendedOutcome: nonEmptyText("Local Project A")!, state: "Active" as const };
      const projectB = { id: projectId("local-project-b"), intendedOutcome: nonEmptyText("Local Project B")!, state: "Active" as const };
      const projectC = { id: projectId("local-project-c"), intendedOutcome: nonEmptyText("Local Project C")!, state: "Active" as const };
      const action = { id: actionId("local-action-a"), projectId: projectA.id, description: nonEmptyText("Local Action A")!, state: "Open" as const };

      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-create-a"), writes: [{ kind: "create-project", project: projectA }] })).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-create-b"), writes: [{ kind: "create-project", project: projectB }] })).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-create-c"), writes: [{ kind: "create-project", project: projectC }] })).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-action-create"), writes: [{ kind: "create-action", action }] })).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-action-missing"), writes: [{ kind: "transition-action", actionId: actionId("local-missing-action"), projectId: projectA.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
      expect(await local.read("SELECT id FROM actions WHERE id = ?", "local-missing-action")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "local-action-missing")).toEqual([]);

      const projectTransition: AcceptedStateCommit = { operationId: persistenceOperationId("local-project-complete"), writes: [{ kind: "transition-project", projectId: projectA.id, expectedState: "Active", nextState: "Completed" }] };
      await expect(adapter.commitAcceptedState(projectTransition)).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState(projectTransition)).resolves.toEqual({ kind: "already-committed" });
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "local-project-complete")).toEqual([{ count: 1 }]);
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-project-stale"), writes: [{ kind: "transition-project", projectId: projectA.id, expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-project-missing"), writes: [{ kind: "transition-project", projectId: projectId("local-missing"), expectedState: "Active", nextState: "Completed" }] })).resolves.toEqual(failed);
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-project-reopen"), writes: [{ kind: "transition-project", projectId: projectA.id, expectedState: "Completed", nextState: "Active" }] })).resolves.toEqual({ kind: "committed" });
      expect(await local.read<{ intended_outcome: string; state: string }>("SELECT intended_outcome, state FROM projects WHERE id = ?", projectA.id)).toEqual([{ intended_outcome: "Local Project A", state: "Active" }]);
      expect(await local.read<{ project_id: string; description: string; state: string }>("SELECT project_id, description, state FROM actions WHERE id = ?", action.id)).toEqual([{ project_id: projectA.id, description: "Local Action A", state: "Open" }]);
      expect(await local.read<{ state: string }>("SELECT state FROM projects WHERE id = ?", projectB.id)).toEqual([{ state: "Active" }]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id IN (?, ?, ?) ORDER BY operation_id", "local-project-reopen", "local-project-stale", "local-project-missing")).toEqual([{ operation_id: "local-project-reopen" }]);

      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-action-owner"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectB.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
      const actionTransition: AcceptedStateCommit = { operationId: persistenceOperationId("local-action-complete"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectA.id, expectedState: "Open", nextState: "Completed" }] };
      await expect(adapter.commitAcceptedState(actionTransition)).resolves.toEqual({ kind: "committed" });
      await expect(adapter.commitAcceptedState(actionTransition)).resolves.toEqual({ kind: "already-committed" });
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "local-action-complete")).toEqual([{ count: 1 }]);
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-action-stale"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectA.id, expectedState: "Open", nextState: "Completed" }] })).resolves.toEqual(failed);
      await expect(adapter.commitAcceptedState({ operationId: persistenceOperationId("local-action-reopen"), writes: [{ kind: "transition-action", actionId: action.id, projectId: projectA.id, expectedState: "Completed", nextState: "Open" }] })).resolves.toEqual({ kind: "committed" });
      expect(await local.read<{ project_id: string; description: string; state: string }>("SELECT project_id, description, state FROM actions WHERE id = ?", action.id)).toEqual([{ project_id: projectA.id, description: "Local Action A", state: "Open" }]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id IN (?, ?, ?, ?) ORDER BY operation_id", "local-action-owner", "local-action-stale", "local-action-reopen", "local-action-missing")).toEqual([{ operation_id: "local-action-reopen" }]);

      const competingOne: AcceptedStateCommit = { operationId: persistenceOperationId("local-competing-one"), writes: [{ kind: "transition-project", projectId: projectC.id, expectedState: "Active", nextState: "Completed" }] };
      const competingTwo: AcceptedStateCommit = { operationId: persistenceOperationId("local-competing-two"), writes: [{ kind: "transition-project", projectId: projectC.id, expectedState: "Active", nextState: "Completed" }] };
      const competingResults = await Promise.all([
        adapter.commitAcceptedState(competingOne),
        adapter.commitAcceptedState(competingTwo),
      ]);
      expect(competingResults).toContainEqual({ kind: "committed" });
      expect(competingResults).toContainEqual(failed);
      expect(await local.read<{ state: string }>("SELECT state FROM projects WHERE id = ?", projectC.id)).toEqual([{ state: "Completed" }]);
      const competingReceipts = await local.read<{ operation_id: string }>("SELECT operation_id FROM persistence_operations WHERE operation_id IN (?, ?) ORDER BY operation_id", "local-competing-one", "local-competing-two");
      expect(competingReceipts).toHaveLength(1);
      expect(["local-competing-one", "local-competing-two"]).toContain(competingReceipts[0]?.operation_id);

    } finally {
      await local.dispose();
    }
  }, 15_000);
});

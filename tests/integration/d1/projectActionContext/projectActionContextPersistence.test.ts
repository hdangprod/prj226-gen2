import { describe, expect, it } from "vitest";
import { createHumanControlRuntime } from "../../../../src/application/contracts/humanControl";
import { persistenceOperationId } from "../../../../src/application/ports/persistence";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { actionId, nonEmptyText, progressId, projectId, type AcceptedProjectContext } from "../../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../../src/infrastructure/d1/d1AcceptedStatePersistence";
import { FakeD1 } from "../../../infrastructure/d1/fakeD1";
import { createFreshLocalD1 } from "./localD1";

const text = (value: string) => nonEmptyText(value)!;
const intent = { summary: "accepted local D1 mutation" };

function authorize(runtime: ReturnType<typeof createHumanControlRuntime>, scope: Parameters<ReturnType<typeof createHumanControlRuntime>["humanControl"]["classifyOrdinaryDirection"]>[1]) {
  const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
  const direction = runtime.humanControl.classifyOrdinaryDirection(evidence, scope, { target: "clear", effect: "clear" });
  if (direction.kind !== "classified-ordinary-direction") throw new Error("test setup failed");
  const authorization = runtime.humanControl.authorizeOrdinaryChange(direction, scope);
  if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("test setup failed");
  return authorization;
}

describe("Project/Action/context against the accepted D1 adapter contract (FakeD1)", () => {
  it("commits project, action, facts, and correction atomically through the D1 boundary", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("project"), authorization: authorize(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" }), id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toMatchObject({ kind: "accepted" });
    const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
    await expect(service.createAction({ intent, operationId: persistenceOperationId("action"), authorization: authorize(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toMatchObject({ kind: "accepted" });
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
    const accepted = await service.acceptProgress({ intent, operationId: persistenceOperationId("progress-1"), authorization: authorize(runtime, { operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a1", statement: "Drafted" }), context, id: progressId("g1"), projectId: projectId("p1"), actionId: actionId("a1"), statement: text("Drafted"), action });
    if (accepted.kind !== "accepted") throw new Error("expected progress acceptance");
    await expect(service.correctProgress({ intent, operationId: persistenceOperationId("progress-2"), authorization: authorize(runtime, { operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" }), context: accepted.value, priorId: progressId("g1"), successorId: progressId("g2"), statement: text("Corrected"), action })).resolves.toMatchObject({ kind: "accepted" });
    expect(database.progress.get("g1")?.standing).toBe("superseded");
    expect(database.progress.get("g2")).toMatchObject({ standing: "current", supersedesId: "g1" });
  });
});

describe("Project/Action/context against a fresh migration-backed local D1 database", () => {
  it("persists lifecycle, ownership, no-cascade, context, and progress correction state", async () => {
    const local = await createFreshLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(local.database) });
      const project = { id: projectId("p1"), intendedOutcome: text("Ship"), state: "Active" as const };
      await expect(service.establishProject({ intent, operationId: persistenceOperationId("project-create"), authorization: authorize(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" }), ...project })).resolves.toMatchObject({ kind: "accepted" });
      expect(await local.read<{ id: string; intended_outcome: string; state: string }>("SELECT id, intended_outcome, state FROM projects WHERE id = ?", "p1")).toEqual([{ id: "p1", intended_outcome: "Ship", state: "Active" }]);

      const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
      await expect(service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: authorize(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.completeAction({ intent, operationId: persistenceOperationId("action-complete"), authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      await expect(service.reopenAction({ intent, operationId: persistenceOperationId("action-reopen"), authorization: authorize(runtime, { operation: "reopen-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Open" } });

      await expect(service.completeProject({ intent, operationId: persistenceOperationId("project-complete"), authorization: authorize(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      expect(await local.read<{ state: string }>("SELECT state FROM projects WHERE id = ?", "p1")).toEqual([{ state: "Completed" }]);
      expect(await local.read<{ project_id: string; state: string }>("SELECT project_id, state FROM actions WHERE id = ?", "a1")).toEqual([{ project_id: "p1", state: "Open" }]);
      await expect(service.reopenProject({ intent, operationId: persistenceOperationId("project-reopen"), authorization: authorize(runtime, { operation: "reopen-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Active" } });

      const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
      await expect(service.acceptContextFacts({ intent, operationId: persistenceOperationId("facts"), authorization: authorize(runtime, { operation: "accept-context-facts", projectId: "p1", facts: ["Blocked"] }), context, facts: [text("Blocked")] })).resolves.toMatchObject({ kind: "accepted" });
      const initial = await service.acceptProgress({ intent, operationId: persistenceOperationId("progress-create"), authorization: authorize(runtime, { operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a1", statement: "Drafted" }), context, id: progressId("g1"), projectId: projectId("p1"), actionId: actionId("a1"), statement: text("Drafted"), action });
      if (initial.kind !== "accepted") throw new Error("expected initial progress");
      await expect(service.correctProgress({ intent, operationId: persistenceOperationId("progress-correct"), authorization: authorize(runtime, { operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" }), context: initial.value, priorId: progressId("g1"), successorId: progressId("g2"), statement: text("Corrected"), action })).resolves.toMatchObject({ kind: "accepted" });
      expect(await local.read<{ fact: string }>("SELECT fact FROM accepted_context_facts WHERE project_id = ? ORDER BY ordinal", "p1")).toEqual([{ fact: "Blocked" }]);
      expect(await local.read<{ id: string; project_id: string; action_id: string; standing: string; supersedes_id: string | null }>("SELECT id, project_id, action_id, standing, supersedes_id FROM accepted_progress ORDER BY id")).toEqual([
        { id: "g1", project_id: "p1", action_id: "a1", standing: "superseded", supersedes_id: null },
        { id: "g2", project_id: "p1", action_id: "a1", standing: "current", supersedes_id: "g1" },
      ]);
      await expect(service.establishProject({ intent, operationId: persistenceOperationId("project-p2"), authorization: authorize(runtime, { operation: "create-project", projectId: "p2", intendedOutcome: "Second" }), id: projectId("p2"), intendedOutcome: text("Second") })).resolves.toMatchObject({ kind: "accepted" });
      const result = await service.acceptProgress({ intent, operationId: persistenceOperationId("mismatch"), authorization: authorize(runtime, { operation: "accept-progress", progressId: "bad", projectId: "p2", actionId: "a1", statement: "Wrong owner" }), context: { projectId: projectId("p2"), facts: [], progress: [] }, id: progressId("bad"), projectId: projectId("p2"), actionId: actionId("a1"), statement: text("Wrong owner"), action });
      expect(result).toMatchObject({ kind: "failed", reason: "action-project-mismatch" });
      expect(await local.read("SELECT id FROM accepted_progress WHERE id = ?", "bad")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "mismatch")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });

  it("rejects fabricated, stale, and wrong-owner lifecycle snapshots while preserving authoritative state and receipts", async () => {
    const local = await createFreshLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(local.database) });
      await expect(service.completeProject({ intent, operationId: persistenceOperationId("fabricated-project"), authorization: authorize(runtime, { operation: "complete-project", projectId: "missing-project" }), projectId: projectId("missing-project") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      expect(await local.read("SELECT id FROM projects WHERE id = ?", "missing-project")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "fabricated-project")).toEqual([]);

      const project = { id: projectId("p1"), intendedOutcome: text("Ship"), state: "Active" as const };
      await expect(service.establishProject({ intent, operationId: persistenceOperationId("project-create"), authorization: authorize(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" }), ...project })).resolves.toMatchObject({ kind: "accepted" });
      const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
      await expect(service.createAction({ intent, operationId: persistenceOperationId("project-create"), authorization: authorize(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toEqual({ kind: "failed", intent, reason: "operation-id-conflict", retryable: false });
      expect(await local.read("SELECT id FROM actions WHERE id = ?", "a1")).toEqual([]);
      await expect(service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: authorize(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.completeAction({ intent, operationId: persistenceOperationId("fabricated-action"), authorization: authorize(runtime, { operation: "complete-action", actionId: "missing-action", projectId: "p1" }), actionId: actionId("missing-action"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      expect(await local.read("SELECT id FROM actions WHERE id = ?", "missing-action")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "fabricated-action")).toEqual([]);

      const completeProject = { intent, operationId: persistenceOperationId("project-complete"), authorization: authorize(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") };
      await expect(service.completeProject(completeProject)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      await expect(service.completeProject(completeProject)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      expect(await local.read<{ state: string; intended_outcome: string }>("SELECT state, intended_outcome FROM projects WHERE id = ?", "p1")).toEqual([{ state: "Completed", intended_outcome: "Ship" }]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "project-complete")).toEqual([{ count: 1 }]);
      await expect(service.completeProject({ intent, operationId: persistenceOperationId("stale-project"), authorization: authorize(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "stale-project")).toEqual([]);

      await expect(service.reopenProject({ intent, operationId: persistenceOperationId("project-reopen"), authorization: authorize(runtime, { operation: "reopen-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Active" } });
      await expect(service.completeAction({ intent, operationId: persistenceOperationId("wrong-owner"), authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p2" }), actionId: actionId("a1"), projectId: projectId("p2") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      expect(await local.read<{ project_id: string; description: string; state: string }>("SELECT project_id, description, state FROM actions WHERE id = ?", "a1")).toEqual([{ project_id: "p1", description: "Draft", state: "Open" }]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "wrong-owner")).toEqual([]);

      const completeAction = { intent, operationId: persistenceOperationId("action-complete"), authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") };
      await expect(service.completeAction(completeAction)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      await expect(service.completeAction(completeAction)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "action-complete")).toEqual([{ count: 1 }]);
      await expect(service.completeAction({ intent, operationId: persistenceOperationId("stale-action"), authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      expect(await local.read<{ project_id: string; description: string; state: string }>("SELECT project_id, description, state FROM actions WHERE id = ?", "a1")).toEqual([{ project_id: "p1", description: "Draft", state: "Completed" }]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "stale-action")).toEqual([]);

      await expect(service.reopenAction({ intent, operationId: persistenceOperationId("action-reopen"), authorization: authorize(runtime, { operation: "reopen-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Open" } });
      expect(await local.read<{ state: string }>("SELECT state FROM actions WHERE id = ?", "a1")).toEqual([{ state: "Open" }]);
    } finally {
      await local.dispose();
    }
  });

  it("treats legacy lifecycle snapshots as non-authoritative and reports only committed lifecycle truth", async () => {
    const local = await createFreshLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(local.database) });
      await service.establishProject({ intent, operationId: persistenceOperationId("project-create"), authorization: authorize(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Canonical" }), id: projectId("p1"), intendedOutcome: text("Canonical") });
      const completeProject = {
        intent,
        operationId: persistenceOperationId("project-complete"),
        authorization: authorize(runtime, { operation: "complete-project", projectId: "p1" }),
        projectId: projectId("p1"),
        project: { id: projectId("p1"), intendedOutcome: text("Fabricated"), state: "Completed" as const },
      };
      await expect(service.completeProject(completeProject)).resolves.toEqual({ kind: "accepted", value: { id: projectId("p1"), state: "Completed" }, disposition: "committed" });
      await expect(service.completeProject(completeProject)).resolves.toEqual({ kind: "accepted", value: { id: projectId("p1"), state: "Completed" }, disposition: "already-committed" });
      expect(await local.read<{ intended_outcome: string; state: string }>("SELECT intended_outcome, state FROM projects WHERE id = ?", "p1")).toEqual([{ intended_outcome: "Canonical", state: "Completed" }]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "project-complete")).toEqual([{ count: 1 }]);
      await expect(service.reopenProject({ intent, operationId: persistenceOperationId("project-complete"), authorization: authorize(runtime, { operation: "reopen-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "operation-id-conflict", retryable: false });
      await expect(service.completeProject({ intent, operationId: persistenceOperationId("persisted-project-stale"), authorization: authorize(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      const reopenProject = {
        intent,
        operationId: persistenceOperationId("project-reopen"),
        authorization: authorize(runtime, { operation: "reopen-project", projectId: "p1" }),
        projectId: projectId("p1"),
        project: { id: projectId("p1"), intendedOutcome: text("Fabricated"), state: "Active" as const },
      };
      await expect(service.reopenProject(reopenProject)).resolves.toEqual({ kind: "accepted", value: { id: projectId("p1"), state: "Active" }, disposition: "committed" });

      await service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: authorize(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Canonical" }), id: actionId("a1"), projectId: projectId("p1"), description: text("Canonical") });
      const completeAction = {
        intent,
        operationId: persistenceOperationId("action-complete"),
        authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }),
        actionId: actionId("a1"),
        projectId: projectId("p1"),
        action: { id: actionId("a1"), projectId: projectId("p1"), description: text("Fabricated"), state: "Completed" as const },
      };
      await expect(service.completeAction(completeAction)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Completed" }, disposition: "committed" });
      await expect(service.completeAction(completeAction)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Completed" }, disposition: "already-committed" });
      expect(await local.read<{ project_id: string; description: string; state: string }>("SELECT project_id, description, state FROM actions WHERE id = ?", "a1")).toEqual([{ project_id: "p1", description: "Canonical", state: "Completed" }]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "action-complete")).toEqual([{ count: 1 }]);
      await expect(service.reopenAction({ intent, operationId: persistenceOperationId("action-complete"), authorization: authorize(runtime, { operation: "reopen-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "operation-id-conflict", retryable: false });
      await expect(service.completeAction({ intent, operationId: persistenceOperationId("persisted-action-stale"), authorization: authorize(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
      const reopenAction = {
        intent,
        operationId: persistenceOperationId("action-reopen"),
        authorization: authorize(runtime, { operation: "reopen-action", actionId: "a1", projectId: "p1" }),
        actionId: actionId("a1"),
        projectId: projectId("p1"),
        action: { id: actionId("a1"), projectId: projectId("p1"), description: text("Fabricated"), state: "Open" as const },
      };
      await expect(service.reopenAction(reopenAction)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Open" }, disposition: "committed" });
      expect(await local.read<{ description: string; state: string }>("SELECT description, state FROM actions WHERE id = ?", "a1")).toEqual([{ description: "Canonical", state: "Open" }]);
    } finally {
      await local.dispose();
    }
  });
});

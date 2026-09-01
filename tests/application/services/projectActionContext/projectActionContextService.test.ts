import { describe, expect, it } from "vitest";
import { createHumanControlRuntime, type OrdinaryMutationScope } from "../../../../src/application/contracts/humanControl";
import { persistenceOperationId, type AcceptedStateCommit, type AcceptedStatePersistence, type PersistenceCommitResult } from "../../../../src/application/ports/persistence";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { actionId, nonEmptyText, progressId, projectId, type AcceptedProjectContext } from "../../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../../src/infrastructure/d1/d1AcceptedStatePersistence";
import { FakeD1 } from "../../../infrastructure/d1/fakeD1";

const text = (value: string) => nonEmptyText(value)!;
const intent = { summary: "ordinary accepted mutation" };

function authorized(scope: OrdinaryMutationScope) {
  const runtime = createHumanControlRuntime();
  return { runtime, authorization: authorizeWith(runtime, scope) };
}

function authorizeWith(runtime: ReturnType<typeof createHumanControlRuntime>, scope: OrdinaryMutationScope) {
  const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
  const classified = runtime.humanControl.classifyOrdinaryDirection(evidence, scope, { target: "clear", effect: "clear" });
  if (classified.kind !== "classified-ordinary-direction") throw new Error("test setup failed");
  const authorization = runtime.humanControl.authorizeOrdinaryChange(classified, scope);
  if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("test setup failed");
  return authorization;
}

class RecordingPersistence implements AcceptedStatePersistence {
  readonly commits: AcceptedStateCommit[] = [];
  constructor(private readonly result: PersistenceCommitResult = { kind: "committed" }) {}
  async commitAcceptedState(commit: AcceptedStateCommit): Promise<PersistenceCommitResult> { this.commits.push(commit); return this.result; }
}

function serviceFor(scope: OrdinaryMutationScope, persistence = new RecordingPersistence()) {
  const { runtime, authorization } = authorized(scope);
  return { authorization, persistence, service: new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence }) };
}

describe("ProjectActionContextService", () => {
  it("commits establish, lifecycle, and Action changes before accepted success", async () => {
    const projectScope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
    const established = serviceFor(projectScope);
    const projectResult = await established.service.establishProject({ intent, operationId: persistenceOperationId("project-create"), authorization: established.authorization, id: projectId("p1"), intendedOutcome: text("Ship") });
    expect(projectResult).toEqual({ kind: "accepted", value: { id: "p1", intendedOutcome: "Ship", state: "Active" }, disposition: "committed" });
    expect(established.persistence.commits[0]?.writes[0]).toMatchObject({ kind: "create-project", project: { state: "Active" } });

    const actionScope = { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" } as const;
    const action = serviceFor(actionScope);
    const actionResult = await action.service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: action.authorization, id: actionId("a1"), projectId: projectId("p1"), description: text("Draft") });
    expect(actionResult).toMatchObject({ kind: "accepted", value: { state: "Open", projectId: "p1" } });
    expect(action.persistence.commits[0]?.writes[0]).toMatchObject({ kind: "create-action", action: { state: "Open", projectId: "p1" } });
  });

  it("does not cascade Project completion to its Action or accepted context", async () => {
    const scope = { operation: "complete-project", projectId: "p1" } as const;
    const setup = serviceFor(scope);
    const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [text("Keep")], progress: [] };
    const result = await setup.service.completeProject({ intent, operationId: persistenceOperationId("project-complete"), authorization: setup.authorization, projectId: projectId("p1") });
    expect(result).toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    expect(setup.persistence.commits[0]?.writes[0]).toEqual({ kind: "transition-project", projectId: projectId("p1"), expectedState: "Active", nextState: "Completed" });
    expect(action.state).toBe("Open");
    expect(context).toMatchObject({ facts: ["Keep"], progress: [] });
  });

  it("supports explicit Project and Action reopening through separate durable operations", async () => {
    const projectScope = { operation: "reopen-project", projectId: "p1" } as const;
    const project = serviceFor(projectScope);
    await expect(project.service.reopenProject({ intent, operationId: persistenceOperationId("project-reopen"), authorization: project.authorization, projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Active" } });
    expect(project.persistence.commits[0]?.writes[0]).toEqual({ kind: "transition-project", projectId: projectId("p1"), expectedState: "Completed", nextState: "Active" });
    const actionScope = { operation: "reopen-action", actionId: "a1", projectId: "p1" } as const;
    const action = serviceFor(actionScope);
    await expect(action.service.reopenAction({ intent, operationId: persistenceOperationId("action-reopen"), authorization: action.authorization, actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Open" } });
    expect(action.persistence.commits[0]?.writes[0]).toEqual({ kind: "transition-action", actionId: actionId("a1"), projectId: projectId("p1"), expectedState: "Completed", nextState: "Open" });
  });

  it("uses authoritative lifecycle transitions for fabricated, stale, wrong-owner, and retry cases", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    await expect(service.completeProject({ intent, operationId: persistenceOperationId("fabricated-project"), authorization: authorizeWith(runtime, { operation: "complete-project", projectId: "missing-project" }), projectId: projectId("missing-project") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.projects.has("missing-project")).toBe(false);
    expect(database.receipts.has("fabricated-project")).toBe(false);

    const project = { id: projectId("p1"), intendedOutcome: text("Ship"), state: "Active" as const };
    await service.establishProject({ intent, operationId: persistenceOperationId("project-create"), authorization: authorizeWith(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" }), ...project });
    const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
    await expect(service.createAction({ intent, operationId: persistenceOperationId("project-create"), authorization: authorizeWith(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toEqual({ kind: "failed", intent, reason: "operation-id-conflict", retryable: false });
    expect(database.actions.has("a1")).toBe(false);
    await service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: authorizeWith(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action });
    await expect(service.completeAction({ intent, operationId: persistenceOperationId("fabricated-action"), authorization: authorizeWith(runtime, { operation: "complete-action", actionId: "missing-action", projectId: "p1" }), actionId: actionId("missing-action"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.actions.has("missing-action")).toBe(false);
    expect(database.receipts.has("fabricated-action")).toBe(false);

    const complete = { intent, operationId: persistenceOperationId("project-complete"), authorization: authorizeWith(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") };
    await expect(service.completeProject(complete)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    await expect(service.completeProject(complete)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    expect(database.projects.get("p1")?.state).toBe("Completed");
    expect(database.receipts.has("project-complete")).toBe(true);
    await expect(service.completeProject({ intent, operationId: persistenceOperationId("stale-project"), authorization: authorizeWith(runtime, { operation: "complete-project", projectId: "p1" }), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.receipts.has("stale-project")).toBe(false);

    await expect(service.completeAction({ intent, operationId: persistenceOperationId("wrong-owner"), authorization: authorizeWith(runtime, { operation: "complete-action", actionId: "a1", projectId: "p2" }), actionId: actionId("a1"), projectId: projectId("p2") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.actions.get("a1")).toMatchObject({ projectId: "p1", state: "Open", description: "Draft" });
    expect(database.receipts.has("wrong-owner")).toBe(false);

    const completeAction = { intent, operationId: persistenceOperationId("action-complete"), authorization: authorizeWith(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") };
    await expect(service.completeAction(completeAction)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    await expect(service.completeAction(completeAction)).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    await expect(service.completeAction({ intent, operationId: persistenceOperationId("stale-action"), authorization: authorizeWith(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.actions.get("a1")).toMatchObject({ projectId: "p1", state: "Completed", description: "Draft" });
    expect(database.receipts.has("stale-action")).toBe(false);
  });

  it("executes the complete Action lifecycle through the persistence boundary", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("project"), authorization: authorizeWith(runtime, { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" }), id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toMatchObject({ kind: "accepted" });
    const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
    await expect(service.createAction({ intent, operationId: persistenceOperationId("action-create"), authorization: authorizeWith(runtime, { operation: "create-action", actionId: "a1", projectId: "p1", description: "Draft" }), ...action })).resolves.toMatchObject({ kind: "accepted", value: { state: "Open" } });
    await expect(service.completeAction({ intent, operationId: persistenceOperationId("action-complete"), authorization: authorizeWith(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Completed" } });
    await expect(service.reopenAction({ intent, operationId: persistenceOperationId("action-reopen"), authorization: authorizeWith(runtime, { operation: "reopen-action", actionId: "a1", projectId: "p1" }), actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toMatchObject({ kind: "accepted", value: { state: "Open" } });
    expect(database.actions.get("a1")?.state).toBe("Open");
  });

  it("uses identity-only lifecycle commands and never reports legacy caller snapshots as accepted state", async () => {
    const projectComplete = serviceFor({ operation: "complete-project", projectId: "p1" });
    const projectCompleteCommand = {
      intent,
      operationId: persistenceOperationId("project-complete"),
      authorization: projectComplete.authorization,
      projectId: projectId("p1"),
      project: { id: projectId("p1"), intendedOutcome: text("Fabricated"), state: "Completed" as const },
    };
    await expect(projectComplete.service.completeProject(projectCompleteCommand)).resolves.toEqual({ kind: "accepted", value: { id: projectId("p1"), state: "Completed" }, disposition: "committed" });
    expect(projectComplete.persistence.commits[0]?.writes).toEqual([{ kind: "transition-project", projectId: projectId("p1"), expectedState: "Active", nextState: "Completed" }]);

    const projectReopen = serviceFor({ operation: "reopen-project", projectId: "p1" });
    const projectReopenCommand = { intent, operationId: persistenceOperationId("project-reopen"), authorization: projectReopen.authorization, projectId: projectId("p1"), project: { id: projectId("p1"), intendedOutcome: text("Fabricated"), state: "Active" as const } };
    await expect(projectReopen.service.reopenProject(projectReopenCommand)).resolves.toEqual({ kind: "accepted", value: { id: projectId("p1"), state: "Active" }, disposition: "committed" });

    const actionComplete = serviceFor({ operation: "complete-action", actionId: "a1", projectId: "p1" });
    const actionCompleteCommand = { intent, operationId: persistenceOperationId("action-complete"), authorization: actionComplete.authorization, actionId: actionId("a1"), projectId: projectId("p1"), action: { id: actionId("a1"), projectId: projectId("p1"), description: text("Fabricated"), state: "Completed" as const } };
    await expect(actionComplete.service.completeAction(actionCompleteCommand)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Completed" }, disposition: "committed" });
    expect(actionComplete.persistence.commits[0]?.writes).toEqual([{ kind: "transition-action", actionId: actionId("a1"), projectId: projectId("p1"), expectedState: "Open", nextState: "Completed" }]);

    const actionReopen = serviceFor({ operation: "reopen-action", actionId: "a1", projectId: "p1" });
    const actionReopenCommand = { intent, operationId: persistenceOperationId("action-reopen"), authorization: actionReopen.authorization, actionId: actionId("a1"), projectId: projectId("p1"), action: { id: actionId("a1"), projectId: projectId("p1"), description: text("Fabricated"), state: "Open" as const } };
    await expect(actionReopen.service.reopenAction(actionReopenCommand)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Open" }, disposition: "committed" });
  });

  it("keeps lifecycle Human Control bound to the operation and authoritative target", async () => {
    const runtime = createHumanControlRuntime();
    const persistence = new RecordingPersistence({ kind: "already-committed" });
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence });
    const projectAuthorization = authorizeWith(runtime, { operation: "complete-project", projectId: "p1" });
    await expect(service.completeProject({ intent, operationId: persistenceOperationId("wrong-project"), authorization: projectAuthorization, projectId: projectId("p2") })).resolves.toEqual({ kind: "failed", intent, reason: "missing-malformed-or-mismatched-authorization", retryable: false });
    const actionAuthorization = authorizeWith(runtime, { operation: "complete-action", actionId: "a1", projectId: "p1" });
    await expect(service.reopenAction({ intent, operationId: persistenceOperationId("wrong-operation"), authorization: actionAuthorization, actionId: actionId("a1"), projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "missing-malformed-or-mismatched-authorization", retryable: false });
    const retryCommand = { intent, operationId: persistenceOperationId("retry"), authorization: actionAuthorization, actionId: actionId("a1"), projectId: projectId("p1"), action: { id: actionId("a1"), projectId: projectId("p1"), description: text("Fabricated"), state: "Completed" as const } };
    await expect(service.completeAction(retryCommand)).resolves.toEqual({ kind: "accepted", value: { id: actionId("a1"), state: "Completed" }, disposition: "already-committed" });
    expect(persistence.commits).toHaveLength(1);
  });

  it("does not report lifecycle acceptance when authoritative durability fails", async () => {
    const failed = serviceFor(
      { operation: "complete-project", projectId: "p1" },
      new RecordingPersistence({ kind: "persistence-failed", reason: "durability-failure", retryable: true }),
    );
    await expect(failed.service.completeProject({ intent, operationId: persistenceOperationId("project-complete"), authorization: failed.authorization, projectId: projectId("p1") })).resolves.toEqual({ kind: "failed", intent, reason: "durability-failure", retryable: true });
  });

  it("persists accepted facts and progress without implying Action completion", async () => {
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
    const factScope = { operation: "accept-context-facts", projectId: "p1", facts: ["Blocked"] } as const;
    const facts = serviceFor(factScope);
    expect(await facts.service.acceptContextFacts({ intent, operationId: persistenceOperationId("facts"), authorization: facts.authorization, context, facts: [text("Blocked")] })).toMatchObject({ kind: "accepted", value: { facts: ["Blocked"] } });
    expect(facts.persistence.commits[0]?.writes[0]).toMatchObject({ kind: "append-context-facts", projectId: "p1" });

    const progressScope = { operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a1", statement: "Drafted" } as const;
    const progress = serviceFor(progressScope);
    const action = { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" as const };
    const result = await progress.service.acceptProgress({ intent, operationId: persistenceOperationId("progress"), authorization: progress.authorization, context, id: progressId("g1"), projectId: projectId("p1"), actionId: actionId("a1"), statement: text("Drafted"), action });
    expect(result).toMatchObject({ kind: "accepted", value: { progress: [{ standing: "current" }] } });
    expect(action.state).toBe("Open");
  });

  it("persists only the successor for a valid progress correction", async () => {
    const scope = { operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" } as const;
    const setup = serviceFor(scope);
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [{ id: progressId("g1"), projectId: projectId("p1"), statement: text("Original"), standing: "current" }] };
    const result = await setup.service.correctProgress({ intent, operationId: persistenceOperationId("progress-correct"), authorization: setup.authorization, context, priorId: progressId("g1"), successorId: progressId("g2"), statement: text("Corrected") });
    expect(result).toMatchObject({ kind: "accepted", value: { progress: [{ standing: "superseded" }, { supersedesId: "g1", standing: "current" }] } });
    expect(setup.persistence.commits[0]?.writes[0]).toMatchObject({ kind: "correct-progress", successor: { id: "g2", supersedesId: "g1" } });
  });

  it("returns clarification without a write for an ambiguous progress target", async () => {
    const scope = { operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" } as const;
    const setup = serviceFor(scope);
    const current = { id: progressId("g1"), projectId: projectId("p1"), statement: text("Original"), standing: "current" as const };
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [current, current] };
    await expect(setup.service.correctProgress({ intent, operationId: persistenceOperationId("ambiguous"), authorization: setup.authorization, context, priorId: progressId("g1"), successorId: progressId("g2"), statement: text("Corrected") })).resolves.toEqual({ kind: "clarification-required", intent, reason: "ambiguous-target" });
    expect(setup.persistence.commits).toEqual([]);
  });

  it("does not infer among multiple active Projects; only an explicit target selection changes provisional context", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    for (const id of ["p1", "p2"]) {
      await service.establishProject({ intent, operationId: persistenceOperationId(`active-${id}`), authorization: authorizeWith(runtime, { operation: "create-project", projectId: id, intendedOutcome: id }), id: projectId(id), intendedOutcome: text(id) });
    }
    expect([...database.projects.values()].map(({ state }) => state)).toEqual(["Active", "Active"]);
    const selection = service.selectExplicitCurrentContext({ basis: "ambiguous", candidateProjectIds: [projectId("p1"), projectId("p2")] }, { projectId: projectId("p1"), actionId: actionId("a1") }, authorizeWith(runtime, { operation: "select-current-context", projectId: "p1", actionId: "a1" }), { id: actionId("a1"), projectId: projectId("p1"), description: text("Draft"), state: "Open" });
    expect(selection).toMatchObject({ kind: "valid-context-selection", value: { basis: "explicit-user-selection", projectId: "p1" } });
    expect(database.batches).toHaveLength(2);
  });

  it("returns truthful persistence failure and preserves retry/idempotency result", async () => {
    const scope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
    const failed = serviceFor(scope, new RecordingPersistence({ kind: "persistence-failed", reason: "durability-failure", retryable: true }));
    await expect(failed.service.establishProject({ intent, operationId: persistenceOperationId("retry"), authorization: failed.authorization, id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toEqual({ kind: "failed", intent, reason: "durability-failure", retryable: true });
    const replay = serviceFor(scope, new RecordingPersistence({ kind: "already-committed" }));
    await expect(replay.service.establishProject({ intent, operationId: persistenceOperationId("retry"), authorization: replay.authorization, id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toMatchObject({ kind: "accepted" });
  });

  it("propagates a conflicting duplicate truthfully without changing the original Project", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    const first = { operation: "create-project", projectId: "p1", intendedOutcome: "Original" } as const;
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("original"), authorization: authorizeWith(runtime, first), id: projectId("p1"), intendedOutcome: text("Original") })).resolves.toMatchObject({ kind: "accepted" });
    const conflict = { operation: "create-project", projectId: "p1", intendedOutcome: "Conflicting" } as const;
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("conflict"), authorization: authorizeWith(runtime, conflict), id: projectId("p1"), intendedOutcome: text("Conflicting") })).resolves.toEqual({ kind: "failed", intent, reason: "constraint-conflict", retryable: false });
    expect(database.projects.get("p1")).toMatchObject({ intendedOutcome: "Original", state: "Active" });
    expect(database.receipts.has("conflict")).toBe(false);
  });

  it("rejects a malformed retry before its existing receipt can produce already-committed", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    const scope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("retry"), authorization: authorizeWith(runtime, scope), id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.establishProject({ intent, operationId: persistenceOperationId("retry"), authorization: {} as never, id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toEqual({ kind: "failed", intent, reason: "missing-malformed-or-mismatched-authorization", retryable: false });
    expect(database.batches).toHaveLength(1);
  });

  it("does not publish partial context facts or a receipt when FakeD1 injects a partial batch failure", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    const service = new ProjectActionContextService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    const projectScope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
    await service.establishProject({ intent, operationId: persistenceOperationId("project"), authorization: authorizeWith(runtime, projectScope), id: projectId("p1"), intendedOutcome: text("Ship") });
    const facts = [text("First"), text("Second")];
    const scope = { operation: "accept-context-facts", projectId: "p1", facts: ["First", "Second"] } as const;
    database.partialResult = true;
    await expect(service.acceptContextFacts({ intent, operationId: persistenceOperationId("facts"), authorization: authorizeWith(runtime, scope), context: { projectId: projectId("p1"), facts: [], progress: [] }, facts })).resolves.toEqual({ kind: "failed", intent, reason: "durability-failure", retryable: true });
    expect(database.contextFacts.get("p1")).toBeUndefined();
    expect(database.receipts.has("facts")).toBe(false);
    database.partialResult = false;
    await expect(service.acceptContextFacts({ intent, operationId: persistenceOperationId("facts"), authorization: authorizeWith(runtime, scope), context: { projectId: projectId("p1"), facts: [], progress: [] }, facts })).resolves.toMatchObject({ kind: "accepted" });
    expect(database.contextFacts.get("p1")).toEqual(["First", "Second"]);
  });

  it("rejects untrusted authorization before attempting persistence", async () => {
    const scope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
    const setup = serviceFor(scope);
    await expect(setup.service.establishProject({ intent, operationId: persistenceOperationId("unauthorized"), authorization: {} as never, id: projectId("p1"), intendedOutcome: text("Ship") })).resolves.toEqual({ kind: "failed", intent, reason: "missing-malformed-or-mismatched-authorization", retryable: false });
    expect(setup.persistence.commits).toEqual([]);
  });
});

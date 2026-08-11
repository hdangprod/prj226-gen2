import { describe, expect, it } from "vitest";
import { actionId, nonEmptyText, progressId, projectId, type AcceptedProjectContext } from "../../src/domain/model";
import { acceptProgress as acceptProgressWithGate, completeAction as completeActionWithGate, completeProject as completeProjectWithGate, createAction as createActionWithGate, createProject as createProjectWithGate, reopenAction as reopenActionWithGate, reopenProject as reopenProjectWithGate } from "../../src/domain/transitions";
import { mutationGate, ordinaryAuthorization } from "./authorization";
import { requireResult } from "./assertions";
const text = (value: string) => nonEmptyText(value)!;
const createProject = (id: Parameters<typeof createProjectWithGate>[0], outcome: Parameters<typeof createProjectWithGate>[1], authorization: Parameters<typeof createProjectWithGate>[3]) => createProjectWithGate(id, outcome, mutationGate, authorization);
const createAction = (id: Parameters<typeof createActionWithGate>[0], project: Parameters<typeof createActionWithGate>[1], description: Parameters<typeof createActionWithGate>[2], authorization: Parameters<typeof createActionWithGate>[4]) => createActionWithGate(id, project, description, mutationGate, authorization);
const completeProject = (value: Parameters<typeof completeProjectWithGate>[0], authorization: Parameters<typeof completeProjectWithGate>[2]) => completeProjectWithGate(value, mutationGate, authorization);
const reopenProject = (value: Parameters<typeof reopenProjectWithGate>[0], authorization: Parameters<typeof reopenProjectWithGate>[2]) => reopenProjectWithGate(value, mutationGate, authorization);
const completeAction = (value: Parameters<typeof completeActionWithGate>[0], authorization: Parameters<typeof completeActionWithGate>[2]) => completeActionWithGate(value, mutationGate, authorization);
const reopenAction = (value: Parameters<typeof reopenActionWithGate>[0], authorization: Parameters<typeof reopenActionWithGate>[2]) => reopenActionWithGate(value, mutationGate, authorization);
const acceptProgress = (context: Parameters<typeof acceptProgressWithGate>[0], progress: Parameters<typeof acceptProgressWithGate>[1], authorization: Parameters<typeof acceptProgressWithGate>[3], action?: Parameters<typeof acceptProgressWithGate>[4]) => acceptProgressWithGate(context, progress, mutationGate, authorization, action);

describe("Project and Action lifecycles", () => {
  it("creates minimal Active Projects and Open non-recursive Actions", () => {
    const project = requireResult(createProject(projectId("p1"), text("Ship"), ordinaryAuthorization({ operation: "create-project", projectId: "p1", intendedOutcome: "Ship" })), "valid-transition");
    const action = requireResult(createAction(actionId("a1"), project.id, text("Test"), ordinaryAuthorization({ operation: "create-action", actionId: "a1", projectId: "p1", description: "Test" })), "valid-transition");
    expect(project).toEqual({ id: "p1", intendedOutcome: "Ship", state: "Active" });
    expect(action).toEqual({ id: "a1", projectId: "p1", description: "Test", state: "Open" });
    expect(Object.keys(project)).not.toContain("actions");
    expect(Object.keys(action)).not.toContain("children");
  });

  it("supports explicit Project completion and reopening", () => {
    const active = requireResult(createProject(projectId("p1"), text("Ship"), ordinaryAuthorization({ operation: "create-project", projectId: "p1", intendedOutcome: "Ship" })), "valid-transition");
    const completed = requireResult(completeProject(active, ordinaryAuthorization({ operation: "complete-project", projectId: "p1" })), "valid-transition");
    expect(requireResult(reopenProject(completed, ordinaryAuthorization({ operation: "reopen-project", projectId: "p1" })), "valid-transition").state).toBe("Active");
    expect(completeProject(completed, ordinaryAuthorization({ operation: "complete-project", projectId: "p1" }))).toEqual({ kind: "invalid-transition", reason: "project-already-completed", unchanged: completed });
  });

  it("supports explicit Action completion and reopening", () => {
    const open = requireResult(createAction(actionId("a1"), projectId("p1"), text("Test"), ordinaryAuthorization({ operation: "create-action", actionId: "a1", projectId: "p1", description: "Test" })), "valid-transition");
    const completed = requireResult(completeAction(open, ordinaryAuthorization({ operation: "complete-action", actionId: "a1", projectId: "p1" })), "valid-transition");
    expect(requireResult(reopenAction(completed, ordinaryAuthorization({ operation: "reopen-action", actionId: "a1", projectId: "p1" })), "valid-transition").state).toBe("Open");
    expect(completeAction(completed, ordinaryAuthorization({ operation: "complete-action", actionId: "a1", projectId: "p1" }))).toMatchObject({ kind: "invalid-transition", reason: "action-already-completed" });
  });

  it("records progress without changing Action lifecycle", () => {
    const action = requireResult(createAction(actionId("a1"), projectId("p1"), text("Test"), ordinaryAuthorization({ operation: "create-action", actionId: "a1", projectId: "p1", description: "Test" })), "valid-transition");
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
    const result = acceptProgress(context, { id: progressId("g1"), projectId: context.projectId, actionId: action.id, statement: text("Drafted") }, ordinaryAuthorization({ operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a1", statement: "Drafted" }), action);
    expect(result).toMatchObject({ kind: "valid-transition", value: { progress: [{ standing: "current" }] } });
    expect(action.state).toBe("Open");
  });

  it("rejects progress attached to an Action from another Project", () => {
    const action = requireResult(createAction(actionId("a2"), projectId("p2"), text("Other"), ordinaryAuthorization({ operation: "create-action", actionId: "a2", projectId: "p2", description: "Other" })), "valid-transition");
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
    const result = acceptProgress(context, { id: progressId("g1"), projectId: context.projectId, actionId: action.id, statement: text("Claim") }, ordinaryAuthorization({ operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a2", statement: "Claim" }), action);
    expect(result).toEqual({ kind: "invalid-transition", reason: "action-project-mismatch", unchanged: context });
  });
});

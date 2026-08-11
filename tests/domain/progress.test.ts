import { describe, expect, it } from "vitest";
import { actionId, nonEmptyText, progressId, projectId, type AcceptedProjectContext } from "../../src/domain/model";
import { acceptProgress as acceptProgressWithGate, correctProgress as correctProgressWithGate, createAction as createActionWithGate } from "../../src/domain/transitions";
import { mutationGate, ordinaryAuthorization } from "./authorization";
import { requireResult } from "./assertions";
const text = (value: string) => nonEmptyText(value)!;
const createAction = (id: Parameters<typeof createActionWithGate>[0], project: Parameters<typeof createActionWithGate>[1], description: Parameters<typeof createActionWithGate>[2], authorization: Parameters<typeof createActionWithGate>[4]) => createActionWithGate(id, project, description, mutationGate, authorization);
const acceptProgress = (context: Parameters<typeof acceptProgressWithGate>[0], progress: Parameters<typeof acceptProgressWithGate>[1], authorization: Parameters<typeof acceptProgressWithGate>[3], action?: Parameters<typeof acceptProgressWithGate>[4]) => acceptProgressWithGate(context, progress, mutationGate, authorization, action);
const correctProgress = (context: Parameters<typeof correctProgressWithGate>[0], prior: Parameters<typeof correctProgressWithGate>[1], correction: Parameters<typeof correctProgressWithGate>[2], authorization: Parameters<typeof correctProgressWithGate>[4], action?: Parameters<typeof correctProgressWithGate>[5]) => correctProgressWithGate(context, prior, correction, mutationGate, authorization, action);
const empty = (): AcceptedProjectContext => ({ projectId: projectId("p1"), facts: [], progress: [] });
const accept = (context = empty()) => requireResult(acceptProgress(context, { id: progressId("g1"), projectId: projectId("p1"), statement: text("Original") }, ordinaryAuthorization({ operation: "accept-progress", progressId: "g1", projectId: "p1", statement: "Original" })), "valid-transition");

describe("Accepted Progress identity and correction", () => {
  it("corrects Project-level progress with reconstructible history", () => {
    const accepted = accept();
    const result = correctProgress(accepted, progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, ordinaryAuthorization({ operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" }));
    expect(result).toMatchObject({ kind: "valid-transition", value: { progress: [{ id: "g1", standing: "superseded" }, { id: "g2", standing: "current", supersedesId: "g1" }] } });
  });

  it("preserves Action ownership during correction", () => {
    const action = requireResult(createAction(actionId("a1"), projectId("p1"), text("Test"), ordinaryAuthorization({ operation: "create-action", actionId: "a1", projectId: "p1", description: "Test" })), "valid-transition");
    const accepted = requireResult(acceptProgress(empty(), { id: progressId("g1"), projectId: projectId("p1"), actionId: action.id, statement: text("Original") }, ordinaryAuthorization({ operation: "accept-progress", progressId: "g1", projectId: "p1", actionId: "a1", statement: "Original" }), action), "valid-transition");
    const result = correctProgress(accepted, progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, ordinaryAuthorization({ operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" }), action);
    expect(result).toMatchObject({ kind: "valid-transition", value: { progress: [{ standing: "superseded" }, { actionId: "a1", standing: "current" }] } });
    expect(action.state).toBe("Open");
  });

  it("rejects duplicate acceptance without changing aggregate state", () => {
    const accepted = accept();
    const result = acceptProgress(accepted, { id: progressId("g1"), projectId: projectId("p1"), statement: text("Duplicate") }, ordinaryAuthorization({ operation: "accept-progress", progressId: "g1", projectId: "p1", statement: "Duplicate" }));
    expect(result).toEqual({ kind: "invalid-transition", reason: "progress-id-conflict", unchanged: accepted });
  });

  it("rejects missing, ambiguous, superseded, and colliding correction targets", () => {
    const accepted = accept();
    const auth = ordinaryAuthorization({ operation: "correct-progress", projectId: "p1", priorProgressId: "g1", successorProgressId: "g2", statement: "Corrected" });
    expect(correctProgress(empty(), progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, auth)).toMatchObject({ kind: "invalid-transition", reason: "progress-not-current" });
    const ambiguous = { ...accepted, progress: [...accepted.progress, accepted.progress[0]] };
    expect(correctProgress(ambiguous, progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, auth)).toMatchObject({ kind: "invalid-transition", reason: "progress-target-ambiguous", unchanged: ambiguous });
    const superseded = { ...accepted, progress: [{ ...accepted.progress[0], standing: "superseded" as const }] };
    expect(correctProgress(superseded, progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, auth)).toMatchObject({ kind: "invalid-transition", reason: "progress-not-current" });
    const collision = { ...accepted, progress: [...accepted.progress, { ...accepted.progress[0], id: progressId("g2") }] };
    expect(correctProgress(collision, progressId("g1"), { id: progressId("g2"), statement: text("Corrected") }, auth)).toMatchObject({ kind: "invalid-transition", reason: "progress-id-conflict", unchanged: collision });
  });
});

import { describe, expect, it } from "vitest";
import { applyExplicitContextSelection as applyExplicitContextSelectionWithGate } from "../../src/domain/context";
import { actionId, nonEmptyText, projectId, type AcceptedProjectContext, type CurrentContext } from "../../src/domain/model";
import { acceptContextFacts as acceptContextFactsWithGate, createAction as createActionWithGate } from "../../src/domain/transitions";
import { mutationGate, ordinaryAuthorization } from "./authorization";
import { requireResult } from "./assertions";
const text = (value: string) => nonEmptyText(value)!;
const createAction = (id: Parameters<typeof createActionWithGate>[0], project: Parameters<typeof createActionWithGate>[1], description: Parameters<typeof createActionWithGate>[2], authorization: Parameters<typeof createActionWithGate>[4]) => createActionWithGate(id, project, description, mutationGate, authorization);
const acceptContextFacts = (context: Parameters<typeof acceptContextFactsWithGate>[0], facts: Parameters<typeof acceptContextFactsWithGate>[1], authorization: Parameters<typeof acceptContextFactsWithGate>[3]) => acceptContextFactsWithGate(context, facts, mutationGate, authorization);
const applyExplicitContextSelection = (current: Parameters<typeof applyExplicitContextSelectionWithGate>[0], selection: Parameters<typeof applyExplicitContextSelectionWithGate>[1], authorization: Parameters<typeof applyExplicitContextSelectionWithGate>[3], action?: Parameters<typeof applyExplicitContextSelectionWithGate>[4]) => applyExplicitContextSelectionWithGate(current, selection, mutationGate, authorization, action);

describe("accepted and provisional context", () => {
  it("adds explicitly accepted facts", () => {
    const context: AcceptedProjectContext = { projectId: projectId("p1"), facts: [], progress: [] };
    const result = acceptContextFacts(context, [text("Blocked")], ordinaryAuthorization({ operation: "accept-context-facts", projectId: "p1", facts: ["Blocked"] }));
    expect(requireResult(result, "valid-transition").facts).toEqual(["Blocked"]);
  });

  it("keeps inference qualified and ambiguity targetless", () => {
    const inferred: CurrentContext = { basis: "qualified-inference", projectId: projectId("p1"), qualification: text("Likely") };
    const ambiguous: CurrentContext = { basis: "ambiguous", candidateProjectIds: [projectId("p1"), projectId("p2")] };
    expect(Object.keys(inferred)).not.toContain("facts");
    expect(Object.keys(ambiguous)).not.toContain("projectId");
  });

  it("lets explicit selection replace provisional context", () => {
    const current: CurrentContext = { basis: "ambiguous", candidateProjectIds: [projectId("p1"), projectId("p2")] };
    const action = requireResult(createAction(actionId("a2"), projectId("p2"), text("Work"), ordinaryAuthorization({ operation: "create-action", actionId: "a2", projectId: "p2", description: "Work" })), "valid-transition");
    const result = applyExplicitContextSelection(current, { projectId: projectId("p2"), actionId: action.id }, ordinaryAuthorization({ operation: "select-current-context", projectId: "p2", actionId: "a2" }), action);
    expect(result).toMatchObject({ kind: "valid-context-selection", value: { basis: "explicit-user-selection", projectId: "p2", actionId: "a2" } });
  });

  it("rejects selection whose Action belongs to another Project", () => {
    const current: CurrentContext = { basis: "explicit-user-selection", projectId: projectId("p1") };
    const action = requireResult(createAction(actionId("a2"), projectId("p2"), text("Other"), ordinaryAuthorization({ operation: "create-action", actionId: "a2", projectId: "p2", description: "Other" })), "valid-transition");
    const result = applyExplicitContextSelection(current, { projectId: projectId("p1"), actionId: action.id }, ordinaryAuthorization({ operation: "select-current-context", projectId: "p1", actionId: "a2" }), action);
    expect(result).toEqual({ kind: "invalid-context-selection", reason: "action-project-mismatch", unchanged: current });
  });

  it("accepts explicit Project-only selection", () => {
    const current: CurrentContext = { basis: "ambiguous", candidateProjectIds: [projectId("p1")] };
    expect(applyExplicitContextSelection(current, { projectId: projectId("p1") }, ordinaryAuthorization({ operation: "select-current-context", projectId: "p1" }))).toMatchObject({ kind: "valid-context-selection", value: { projectId: "p1" } });
  });
});

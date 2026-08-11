import { describe, expect, it } from "vitest";
import { knowledgeItemId, nonEmptyText, projectId } from "../../src/domain/model";
import { captureKnowledge as captureKnowledgeWithGate, correctKnowledge as correctKnowledgeWithGate, referenceKnowledge, type KnowledgeState } from "../../src/domain/knowledge";
import { mutationGate, ordinaryAuthorization } from "./authorization";
import { requireResult } from "./assertions";
const text = (value: string) => nonEmptyText(value)!;
const captureKnowledge = (state: Parameters<typeof captureKnowledgeWithGate>[0], input: Parameters<typeof captureKnowledgeWithGate>[1], authorization: Parameters<typeof captureKnowledgeWithGate>[3]) => captureKnowledgeWithGate(state, input, mutationGate, authorization);
const correctKnowledge = (state: Parameters<typeof correctKnowledgeWithGate>[0], prior: Parameters<typeof correctKnowledgeWithGate>[1], correction: Parameters<typeof correctKnowledgeWithGate>[2], authorization: Parameters<typeof correctKnowledgeWithGate>[4]) => correctKnowledgeWithGate(state, prior, correction, mutationGate, authorization);
const empty: KnowledgeState = { items: [] };
const capture = () => requireResult(captureKnowledge(empty, { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("First"), intentional: true }, ordinaryAuthorization({ operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "First" })), "valid-knowledge-change");
const correctionAuth = (prior: string, next: string, content: string) => ordinaryAuthorization({ operation: "correct-knowledge", priorKnowledgeItemId: prior, successorKnowledgeItemId: next, originatingProjectId: "p1", content });

describe("Knowledge provenance and standing", () => {
  it("requires intentional capture and rejects duplicate identity", () => {
    const first = capture();
    expect(first.item).toMatchObject({ id: "k1", originatingProjectId: "p1", standing: "current", supersessionChain: [] });
    expect(captureKnowledge(empty, { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("First"), intentional: false }, ordinaryAuthorization({ operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "First" }))).toMatchObject({ kind: "invalid-knowledge-change", reason: "capture-not-intentional", unchanged: empty });
    expect(captureKnowledge(first.state, { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Other"), intentional: true }, ordinaryAuthorization({ operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "Other" }))).toMatchObject({ kind: "invalid-knowledge-change", reason: "knowledge-id-conflict", unchanged: first.state });
  });

  it("builds K1 to K2 to K3 with one current item and reconstructible lineage", () => {
    const first = capture();
    const second = requireResult(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") }, correctionAuth("k1", "k2", "Second")), "valid-knowledge-change");
    const third = requireResult(correctKnowledge(second.state, knowledgeItemId("k2"), { id: knowledgeItemId("k3"), originatingProjectId: projectId("p1"), content: text("Third") }, correctionAuth("k2", "k3", "Third")), "valid-knowledge-change");
    expect(third.correction).toMatchObject({ id: "k3", supersedesId: "k2", supersessionChain: ["k1", "k2"], standing: "current" });
    expect(third.state.items.filter(({ standing }) => standing === "current")).toHaveLength(1);
    expect(third.state.items.map(({ standing }) => standing)).toEqual(["superseded", "superseded", "current"]);
  });

  it("rejects branching from an already superseded predecessor", () => {
    const first = capture();
    const second = requireResult(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") }, correctionAuth("k1", "k2", "Second")), "valid-knowledge-change");
    const branch = correctKnowledge(second.state, knowledgeItemId("k1"), { id: knowledgeItemId("k3"), originatingProjectId: projectId("p1"), content: text("Branch") }, correctionAuth("k1", "k3", "Branch"));
    expect(branch).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-target-not-current", unchanged: second.state });
    const competing = correctKnowledge(second.state, knowledgeItemId("k1"), { id: knowledgeItemId("k4"), originatingProjectId: projectId("p1"), content: text("Competing") }, correctionAuth("k1", "k4", "Competing"));
    expect(competing).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-target-not-current", unchanged: second.state });
  });

  it("rejects reuse of an ancestor identity", () => {
    const first = capture();
    const second = requireResult(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") }, correctionAuth("k1", "k2", "Second")), "valid-knowledge-change");
    const cycle = correctKnowledge(second.state, knowledgeItemId("k2"), { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Cycle") }, correctionAuth("k2", "k1", "Cycle"));
    expect(cycle).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-identity-cycle", unchanged: second.state });
  });

  it("rejects ambiguous target, unrelated successor collision, cycles, and origin changes", () => {
    const first = capture();
    const duplicate: KnowledgeState = { items: [...first.state.items, first.item] };
    expect(correctKnowledge(duplicate, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") }, correctionAuth("k1", "k2", "Second"))).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-target-ambiguous" });
    const unrelated: KnowledgeState = { items: [...first.state.items, { ...first.item, id: knowledgeItemId("k9") }] };
    expect(correctKnowledge(unrelated, knowledgeItemId("k1"), { id: knowledgeItemId("k9"), originatingProjectId: projectId("p1"), content: text("Collision") }, correctionAuth("k1", "k9", "Collision"))).toMatchObject({ kind: "invalid-knowledge-change", reason: "knowledge-id-conflict" });
    expect(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Cycle") }, correctionAuth("k1", "k1", "Cycle"))).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-identity-cycle" });
    expect(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p2"), content: text("Move") }, ordinaryAuthorization({ operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p2", content: "Move" }))).toMatchObject({ kind: "invalid-knowledge-change", reason: "correction-origin-mismatch" });
  });

  it("preserves qualified cross-Project references and rejects unqualified superseded reuse", () => {
    const first = capture();
    const second = requireResult(correctKnowledge(first.state, knowledgeItemId("k1"), { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") }, correctionAuth("k1", "k2", "Second")), "valid-knowledge-change");
    expect(referenceKnowledge(second.prior, projectId("p2"), { materiallyRelevant: true })).toEqual({ kind: "invalid-knowledge-reference", reason: "reuse-not-current" });
    expect(referenceKnowledge(second.prior, projectId("p2"), { materiallyRelevant: true, qualification: text("Historical") })).toMatchObject({ kind: "valid-knowledge-reference", value: { originatingProjectId: "p1", assistingProjectId: "p2", standing: "superseded" } });
  });
});

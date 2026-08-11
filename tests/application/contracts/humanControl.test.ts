import { describe, expect, it } from "vitest";
import { createHumanControlRuntime, type ClassifiedDeletionConfirmation, type ClassifiedDeletionDirection, type DeletionScope, type OrdinaryMutationAuthorization, type TrustedInteractionEvidence } from "../../../src/application/contracts/humanControl";
import { failedOutcome, mixedOutcome, type PortionOutcome } from "../../../src/application/contracts/operations";

const intent = { summary: "Delete Knowledge" };
const ordinaryScope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
const deletionScope: DeletionScope = { targetKind: "knowledge-item", targetId: "k1", effect: "remove-retained-user-data" };
const clear = { target: "clear", effect: "clear" } as const;

function requireDirection(value: ReturnType<ReturnType<typeof createHumanControlRuntime>["humanControl"]["classifyDeletionDirection"]>): ClassifiedDeletionDirection {
  if (value.kind !== "classified-deletion-direction") throw new Error(`Expected deletion direction, received ${value.kind}`);
  return value;
}
function requireConfirmation(value: ReturnType<ReturnType<typeof createHumanControlRuntime>["humanControl"]["classifyDeletionConfirmation"]>): ClassifiedDeletionConfirmation {
  if (value.kind !== "classified-deletion-confirmation") throw new Error(`Expected deletion confirmation, received ${value.kind}`);
  return value;
}

describe("HumanControlRuntime interaction identity", () => {
  it("authorizes ordinary mutation through one observed interaction", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction({ summary: "Create Project" });
    const classification = runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, clear);
    if (classification.kind !== "classified-ordinary-direction") throw new Error("Trusted classification failed");
    const authorization = runtime.humanControl.authorizeOrdinaryChange(classification, ordinaryScope);
    expect(runtime.mutationGate.validateOrdinary(authorization, ordinaryScope)).toBe(true);
    expect(runtime.mutationGate.validateOrdinary(authorization, { ...ordinaryScope, projectId: "p2" })).toBe(false);
  });

  it("rejects one interaction classified into both deletion roles", () => {
    const runtime = createHumanControlRuntime();
    const interaction = runtime.trustedInteractionIngress.observeInteraction(intent);
    const direction = requireDirection(runtime.humanControl.classifyDeletionDirection(interaction, deletionScope, clear));
    const confirmation = requireConfirmation(runtime.humanControl.classifyDeletionConfirmation(interaction, deletionScope, clear));
    expect(direction).not.toBe(confirmation);
    expect(runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, deletionScope)).toMatchObject({ kind: "unresolved", reason: "invalid-mismatched-or-same-interaction-deletion-evidence" });
  });

  it("authorizes two distinct interactions with matching deletion scope", () => {
    const runtime = createHumanControlRuntime();
    const directionEvidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    const confirmationEvidence = runtime.trustedInteractionIngress.observeInteraction({ summary: "Confirm deletion" });
    const direction = requireDirection(runtime.humanControl.classifyDeletionDirection(directionEvidence, deletionScope, clear));
    const confirmation = requireConfirmation(runtime.humanControl.classifyDeletionConfirmation(confirmationEvidence, deletionScope, clear));
    const authorization = runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, deletionScope);
    expect(runtime.mutationGate.validateDeletion(authorization, deletionScope)).toBe(true);
    expect(runtime.mutationGate.validateDeletion(authorization, { ...deletionScope, targetId: "k2" })).toBe(false);
  });

  it("rejects distinct interactions classified for mismatched scopes", () => {
    const runtime = createHumanControlRuntime();
    const other = { ...deletionScope, targetId: "k2" };
    const direction = requireDirection(runtime.humanControl.classifyDeletionDirection(runtime.trustedInteractionIngress.observeInteraction(intent), deletionScope, clear));
    const confirmation = requireConfirmation(runtime.humanControl.classifyDeletionConfirmation(runtime.trustedInteractionIngress.observeInteraction(intent), other, clear));
    expect(runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, deletionScope)).toMatchObject({ kind: "unresolved" });
  });

  it("rejects deletion classifications from another runtime", () => {
    const application = createHumanControlRuntime();
    const foreign = createHumanControlRuntime();
    const direction = requireDirection(application.humanControl.classifyDeletionDirection(application.trustedInteractionIngress.observeInteraction(intent), deletionScope, clear));
    const foreignConfirmation = requireConfirmation(foreign.humanControl.classifyDeletionConfirmation(foreign.trustedInteractionIngress.observeInteraction(intent), deletionScope, clear));
    expect(application.humanControl.authorizeConfirmedDeletion(direction, foreignConfirmation, deletionScope)).toMatchObject({ kind: "unresolved" });
  });

  it("rejects fabricated evidence and raw confirmation claims", () => {
    const runtime = createHumanControlRuntime();
    const fake = { kind: "trusted-interaction-evidence", interactionId: 42, deletionConfirmation: "separately-confirmed" } as unknown as TrustedInteractionEvidence;
    expect(runtime.humanControl.classifyDeletionConfirmation(fake, deletionScope, clear)).toMatchObject({ kind: "unresolved", reason: "invalid-trusted-interaction-evidence" });
    expect(runtime.humanControl.classifyProposal({ deletionConfirmation: "separately-confirmed" })).toMatchObject({ kind: "proposed" });
  });

  it("does not accept ordinary authorization as deletion authority", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction({ summary: "Create Project" });
    const classification = runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, clear);
    if (classification.kind !== "classified-ordinary-direction") throw new Error("Trusted classification failed");
    const authorization = runtime.humanControl.authorizeOrdinaryChange(classification, ordinaryScope);
    expect(runtime.mutationGate.validateDeletion(authorization as OrdinaryMutationAuthorization, deletionScope)).toBe(false);
  });

  it("preserves clarification, prohibition, proposal, and mixed outcomes", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    expect(runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, { target: "ambiguous", effect: "clear" })).toMatchObject({ kind: "clarification-required" });
    expect(runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, { ...clear, prohibition: "authentication-material-capture" })).toMatchObject({ kind: "prohibited" });
    const advisory: PortionOutcome = { kind: "advisory", value: "suggestion" };
    const portions: readonly PortionOutcome[] = [advisory, { kind: "unresolved", intent, reason: "unclear" }];
    expect(runtime.humanControl.classifyProposal({ basis: "explicit-user-direction" })).toMatchObject({ kind: "proposed" });
    expect(mixedOutcome(portions)).toEqual({ kind: "mixed", portions });
    expect(failedOutcome(intent, "unavailable", true)).toMatchObject({ kind: "failed", retryable: true });
  });
});

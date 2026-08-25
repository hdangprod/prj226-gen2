import { describe, expect, it } from "vitest";
import {
  createHumanControlRuntime,
  type ClassifiedDeletionConfirmation,
  type ClassifiedDeletionDirection,
  type DeletionScope,
  type OrdinaryMutationAuthorization,
  type OrdinaryMutationScope,
  type TrustedInteractionEvidence,
} from "../../../src/application/contracts/humanControl";
import {
  failedOutcome,
  mixedOutcome,
  type PortionOutcome,
} from "../../../src/application/contracts/operations";

const intent = { summary: "Authorized user intent" };
const ordinaryScope: OrdinaryMutationScope = {
  operation: "create-project",
  projectId: "p1",
  intendedOutcome: "Launch",
};
const deletionScope: DeletionScope = {
  targetKind: "project",
  targetId: "p1",
  effect: "remove-retained-user-data",
};
const clear = { target: "clear", effect: "clear" } as const;

function requireDirection(outcome: unknown): ClassifiedDeletionDirection {
  if (
    typeof outcome === "object" &&
    outcome !== null &&
    "kind" in outcome &&
    outcome.kind === "classified-deletion-direction"
  ) {
    return outcome as ClassifiedDeletionDirection;
  }
  throw new Error("Expected direction");
}

function requireConfirmation(outcome: unknown): ClassifiedDeletionConfirmation {
  if (
    typeof outcome === "object" &&
    outcome !== null &&
    "kind" in outcome &&
    outcome.kind === "classified-deletion-confirmation"
  ) {
    return outcome as ClassifiedDeletionConfirmation;
  }
  throw new Error("Expected confirmation");
}

describe("human control runtime contract", () => {
  it("authorizes ordinary mutation from one trusted interaction classification", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    const classification = runtime.humanControl.classifyOrdinaryDirection(
      evidence,
      ordinaryScope,
      clear,
    );
    if (classification.kind !== "classified-ordinary-direction") {
      throw new Error("Classification failed");
    }
    const authorization = runtime.humanControl.authorizeOrdinaryChange(
      classification,
      ordinaryScope,
    );
    expect(authorization).toMatchObject({
      kind: "ordinary-mutation-authorization",
      operation: "create-project",
    });
    expect(runtime.mutationGate.validateOrdinary(authorization, ordinaryScope)).toBe(true);
    expect(
      runtime.mutationGate.validateOrdinary(authorization, {
        ...ordinaryScope,
        projectId: "p2",
      }),
    ).toBe(false);
  });

  it("authorizes confirmed deletion only from two distinct trusted interactions", () => {
    const runtime = createHumanControlRuntime();
    const directionEvidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    const confirmationEvidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    const direction = requireDirection(
      runtime.humanControl.classifyDeletionDirection(directionEvidence, deletionScope, clear),
    );
    const confirmation = requireConfirmation(
      runtime.humanControl.classifyDeletionConfirmation(
        confirmationEvidence,
        deletionScope,
        clear,
      ),
    );
    const authorization = runtime.humanControl.authorizeConfirmedDeletion(
      direction,
      confirmation,
      deletionScope,
    );
    expect(authorization).toMatchObject({
      kind: "confirmed-deletion-authorization",
      operation: "destructive-deletion",
      additionalConfirmation: true,
    });
    expect(runtime.mutationGate.validateDeletion(authorization, deletionScope)).toBe(true);
    expect(
      runtime.mutationGate.validateDeletion(authorization, {
        ...deletionScope,
        targetId: "p2",
      }),
    ).toBe(false);
  });

  it("rejects one interaction classified into both roles", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    const direction = requireDirection(
      runtime.humanControl.classifyDeletionDirection(evidence, deletionScope, clear),
    );
    const confirmation = requireConfirmation(
      runtime.humanControl.classifyDeletionConfirmation(evidence, deletionScope, clear),
    );
    expect(
      runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, deletionScope),
    ).toMatchObject({
      kind: "unresolved",
      reason: "invalid-mismatched-or-same-interaction-deletion-evidence",
    });
  });

  it("rejects mismatched scopes between direction, confirmation, and issuance", () => {
    const runtime = createHumanControlRuntime();
    const other: DeletionScope = { ...deletionScope, targetId: "p2" };
    const direction = requireDirection(
      runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        deletionScope,
        clear,
      ),
    );
    const confirmation = requireConfirmation(
      runtime.humanControl.classifyDeletionConfirmation(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        other,
        clear,
      ),
    );
    expect(
      runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, deletionScope),
    ).toMatchObject({ kind: "unresolved" });
  });

  it("rejects deletion classifications from another runtime", () => {
    const application = createHumanControlRuntime();
    const foreign = createHumanControlRuntime();
    const direction = requireDirection(
      application.humanControl.classifyDeletionDirection(
        application.trustedInteractionIngress.observeInteraction(intent),
        deletionScope,
        clear,
      ),
    );
    const foreignConfirmation = requireConfirmation(
      foreign.humanControl.classifyDeletionConfirmation(
        foreign.trustedInteractionIngress.observeInteraction(intent),
        deletionScope,
        clear,
      ),
    );
    expect(
      application.humanControl.authorizeConfirmedDeletion(
        direction,
        foreignConfirmation,
        deletionScope,
      ),
    ).toMatchObject({ kind: "unresolved" });
  });

  it("rejects fabricated evidence and raw confirmation claims", () => {
    const runtime = createHumanControlRuntime();
    const fake = {
      kind: "trusted-interaction-evidence",
      interactionId: 42,
      deletionConfirmation: "separately-confirmed",
    } as unknown as TrustedInteractionEvidence;
    expect(
      runtime.humanControl.classifyDeletionConfirmation(fake, deletionScope, clear),
    ).toMatchObject({
      kind: "unresolved",
      reason: "invalid-trusted-interaction-evidence",
    });
    expect(
      runtime.humanControl.classifyProposal({ deletionConfirmation: "separately-confirmed" }),
    ).toMatchObject({ kind: "proposed" });
  });

  it("does not accept ordinary authorization as deletion authority", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction({
      summary: "Create Project",
    });
    const classification = runtime.humanControl.classifyOrdinaryDirection(
      evidence,
      ordinaryScope,
      clear,
    );
    if (classification.kind !== "classified-ordinary-direction") {
      throw new Error("Trusted classification failed");
    }
    const authorization = runtime.humanControl.authorizeOrdinaryChange(
      classification,
      ordinaryScope,
    );
    expect(
      runtime.mutationGate.validateDeletion(
        authorization as OrdinaryMutationAuthorization,
        deletionScope,
      ),
    ).toBe(false);
  });

  it("preserves clarification, prohibition, proposal, and mixed outcomes", () => {
    const runtime = createHumanControlRuntime();
    const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
    expect(
      runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, {
        target: "ambiguous",
        effect: "clear",
      }),
    ).toMatchObject({ kind: "clarification-required" });
    expect(
      runtime.humanControl.classifyOrdinaryDirection(evidence, ordinaryScope, {
        ...clear,
        prohibition: "authentication-material-capture",
      }),
    ).toMatchObject({ kind: "prohibited" });
    const advisory: PortionOutcome = { kind: "advisory", value: "suggestion" };
    const portions: readonly PortionOutcome[] = [
      advisory,
      { kind: "unresolved", intent, reason: "unclear" },
    ];
    expect(
      runtime.humanControl.classifyProposal({ basis: "explicit-user-direction" }),
    ).toMatchObject({ kind: "proposed" });
    expect(mixedOutcome(portions)).toEqual({ kind: "mixed", portions });
    expect(failedOutcome(intent, "unavailable", true)).toMatchObject({
      kind: "failed",
      retryable: true,
    });
  });

  describe("knowledge-lineage deletion scope extension and binding (DV-R001 / HC-BIND)", () => {
    const lineageScope: DeletionScope = {
      targetKind: "knowledge-lineage",
      targetId: "k1",
      effect: "remove-retained-user-data",
      lineageMembers: ["k1", "k2", "k3"],
    };

    it("authorizes two distinct interactions with matching knowledge-lineage scope", () => {
      const runtime = createHumanControlRuntime();
      const directionEvidence = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Delete lineage",
      });
      const confirmationEvidence = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Confirm lineage deletion",
      });
      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(directionEvidence, lineageScope, clear),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          confirmationEvidence,
          lineageScope,
          clear,
        ),
      );
      const authorization = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        lineageScope,
      );
      expect(runtime.mutationGate.validateDeletion(authorization, lineageScope)).toBe(true);
      expect(
        runtime.mutationGate.validateDeletion(authorization, {
          ...lineageScope,
          targetId: "k2",
        }),
      ).toBe(false);
    });

    it("HC-BIND-01: rejects authorization when direction and confirmation lineage scopes differ", () => {
      const runtime = createHumanControlRuntime();
      const directionScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", "k2", "k3"],
      };
      const confirmationScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", "k2", "k3", "k4"],
      };
      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          directionScope,
          clear,
        ),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          confirmationScope,
          clear,
        ),
      );
      const outcome = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        directionScope,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-mismatched-or-same-interaction-deletion-evidence",
      });
    });

    it("HC-BIND-02: rejects MutationGate validation when authorization is attempted with expanded lineage scope", () => {
      const runtime = createHumanControlRuntime();
      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          lineageScope,
          clear,
        ),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          lineageScope,
          clear,
        ),
      );
      const authorization = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        lineageScope,
      );

      const expandedScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", "k2", "k3", "k4"],
      };

      expect(runtime.mutationGate.validateDeletion(authorization, expandedScope)).toBe(false);
      expect(runtime.mutationGate.validateDeletion(authorization, lineageScope)).toBe(true);
    });

    it("HC-BIND-05: produces identical value-based scope identity across independent array instances", () => {
      const runtime = createHumanControlRuntime();
      const a = ["k1", "k2", "k3"];
      const b = ["k1", "k2", "k3"];

      const scopeA: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: a,
      };
      const scopeB: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: b,
      };

      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          scopeA,
          clear,
        ),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          scopeB,
          clear,
        ),
      );

      const authorization = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        scopeA,
      );
      expect(authorization.kind).toBe("confirmed-deletion-authorization");
      expect(runtime.mutationGate.validateDeletion(authorization, scopeB)).toBe(true);
    });

    it("HC-BIND-06: snapshots scope identity by value so post-evidence caller array mutation cannot widen scope", () => {
      const runtime = createHumanControlRuntime();
      const members = ["k1", "k2", "k3"];
      const mutableScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: members,
      };

      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          mutableScope,
          clear,
        ),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          mutableScope,
          clear,
        ),
      );
      const authorization = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        mutableScope,
      );

      // Caller mutates array post-creation
      members.push("k4");

      // Mutated scope (now has 4 items) MUST NOT validate against the minted authorization
      expect(runtime.mutationGate.validateDeletion(authorization, mutableScope)).toBe(false);

      // Original scope snapshot MUST validate
      const originalScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", "k2", "k3"],
      };
      expect(runtime.mutationGate.validateDeletion(authorization, originalScope)).toBe(true);
    });

    it("rejects one interaction classified into both roles for knowledge-lineage", () => {
      const runtime = createHumanControlRuntime();
      const interaction = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Delete lineage",
      });
      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(interaction, lineageScope, clear),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(interaction, lineageScope, clear),
      );
      expect(
        runtime.humanControl.authorizeConfirmedDeletion(direction, confirmation, lineageScope),
      ).toMatchObject({
        kind: "unresolved",
        reason: "invalid-mismatched-or-same-interaction-deletion-evidence",
      });
    });

    it("treats knowledge-item and knowledge-lineage with identical targetId as distinct scopes", () => {
      const runtime = createHumanControlRuntime();
      const itemScope: DeletionScope = {
        targetKind: "knowledge-item",
        targetId: "k1",
        effect: "remove-retained-user-data",
      };

      const directionEvidence = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Delete",
      });
      const confirmationEvidence = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Confirm",
      });
      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(directionEvidence, itemScope, clear),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(confirmationEvidence, itemScope, clear),
      );
      const itemAuth = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        itemScope,
      );

      expect(runtime.mutationGate.validateDeletion(itemAuth, itemScope)).toBe(true);
      expect(runtime.mutationGate.validateDeletion(itemAuth, lineageScope)).toBe(false);
    });

    it("rejects knowledge-lineage deletion authorization from a foreign runtime", () => {
      const appRuntime = createHumanControlRuntime();
      const foreignRuntime = createHumanControlRuntime();
      const direction = requireDirection(
        appRuntime.humanControl.classifyDeletionDirection(
          appRuntime.trustedInteractionIngress.observeInteraction(intent),
          lineageScope,
          clear,
        ),
      );
      const foreignConfirm = requireConfirmation(
        foreignRuntime.humanControl.classifyDeletionConfirmation(
          foreignRuntime.trustedInteractionIngress.observeInteraction(intent),
          lineageScope,
          clear,
        ),
      );
      expect(
        appRuntime.humanControl.authorizeConfirmedDeletion(
          direction,
          foreignConfirm,
          lineageScope,
        ),
      ).toMatchObject({ kind: "unresolved" });
    });

    it("does not accept ordinary authorization as knowledge-lineage deletion authority", () => {
      const runtime = createHumanControlRuntime();
      const evidence = runtime.trustedInteractionIngress.observeInteraction({
        summary: "Create Project",
      });
      const classification = runtime.humanControl.classifyOrdinaryDirection(
        evidence,
        ordinaryScope,
        clear,
      );
      if (classification.kind !== "classified-ordinary-direction") {
        throw new Error("Trusted classification failed");
      }
      const authorization = runtime.humanControl.authorizeOrdinaryChange(
        classification,
        ordinaryScope,
      );
      expect(
        runtime.mutationGate.validateDeletion(
          authorization as OrdinaryMutationAuthorization,
          lineageScope,
        ),
      ).toBe(false);
    });
  });

  describe("Human Control Malformed Identity & Scope Safety (ENG-007-SR-R002-R1)", () => {
    it("HC-R5-01: rejects targetId object with toJSON() and calls hook 0 times", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const malformedScope = {
        targetKind: "project",
        targetId: {
          toJSON() {
            hookCalls++;
            return "p1";
          },
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const directionOutcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(directionOutcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });

      const confirmationOutcome = runtime.humanControl.classifyDeletionConfirmation(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(confirmationOutcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });

      expect(hookCalls).toBe(0);
    });

    it("HC-R5-02: rejects lineage member object with toJSON() and calls hook 0 times", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const malformedScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: [
          "K1",
          {
            toJSON() {
              hookCalls++;
              return "K2";
            },
          },
        ],
      } as unknown as DeletionScope;

      const directionOutcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(directionOutcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
      expect(hookCalls).toBe(0);
    });

    it("HC-R5-03: caller-owned lineage array with own toJSON() does not invoke hook for authority", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const members = ["K1", "K2"];
      Object.defineProperty(members, "toJSON", {
        value: () => {
          hookCalls++;
          return ["K1", "K999"];
        },
      });

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: members,
      };

      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          scope,
          clear,
        ),
      );
      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          scope,
          clear,
        ),
      );
      const authorization = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        scope,
      );

      expect(authorization.kind).toBe("confirmed-deletion-authorization");
      expect(hookCalls).toBe(0);

      // Authority identity is ["K1", "K2"], NOT ["K1", "K999"]
      expect(runtime.mutationGate.validateDeletion(authorization, scope)).toBe(true);
      const hostileScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: ["K1", "K999"],
      };
      expect(runtime.mutationGate.validateDeletion(authorization, hostileScope)).toBe(false);
    });

    it("HC-R5-04: rejects targetKind object with toJSON() and calls hook 0 times", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const malformedScope = {
        targetKind: {
          toJSON() {
            hookCalls++;
            return "project";
          },
        },
        targetId: "p1",
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
      expect(hookCalls).toBe(0);
    });

    it("HC-R5-05: rejects effect object with toJSON() and calls hook 0 times", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const malformedScope = {
        targetKind: "project",
        targetId: "p1",
        effect: {
          toJSON() {
            hookCalls++;
            return "remove-retained-user-data";
          },
        },
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
      expect(hookCalls).toBe(0);
    });

    it("HC-R5-06: rejects targetId object with toString() and calls hook 0 times", () => {
      const runtime = createHumanControlRuntime();
      let hookCalls = 0;
      const malformedScope = {
        targetKind: "project",
        targetId: {
          toString() {
            hookCalls++;
            return "p1";
          },
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
      expect(hookCalls).toBe(0);
    });

    it("HC-R5-07: rejects targetId object with Symbol.toPrimitive / valueOf and calls hooks 0 times", () => {
      const runtime = createHumanControlRuntime();
      let primitiveCalls = 0;
      let valueOfCalls = 0;
      const malformedScope = {
        targetKind: "project",
        targetId: {
          [Symbol.toPrimitive]() {
            primitiveCalls++;
            return "p1";
          },
          valueOf() {
            valueOfCalls++;
            return "p1";
          },
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
      expect(primitiveCalls).toBe(0);
      expect(valueOfCalls).toBe(0);
    });

    it("HC-R5-08: reads authority-defining properties exactly once when capturing scope", () => {
      const runtime = createHumanControlRuntime();
      let readCount = 0;
      const unstableScope = {
        targetKind: "project" as const,
        get targetId() {
          readCount++;
          return readCount === 1 ? "p1" : "p2";
        },
        effect: "remove-retained-user-data" as const,
      } as unknown as DeletionScope;

      const direction = requireDirection(
        runtime.humanControl.classifyDeletionDirection(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          unstableScope,
          clear,
        ),
      );
      expect(readCount).toBe(1);

      const confirmation = requireConfirmation(
        runtime.humanControl.classifyDeletionConfirmation(
          runtime.trustedInteractionIngress.observeInteraction(intent),
          unstableScope,
          clear,
        ),
      );
      expect(readCount).toBe(2);

      const auth = runtime.humanControl.authorizeConfirmedDeletion(
        direction,
        confirmation,
        { targetKind: "project", targetId: "p1", effect: "remove-retained-user-data" },
      );
      expect(auth).toMatchObject({
        kind: "unresolved",
        reason: "invalid-mismatched-or-same-interaction-deletion-evidence",
      });
    });

    it("HC-R5-09: safely catches throwing targetId getter and returns controlled rejection", () => {
      const runtime = createHumanControlRuntime();
      const throwingScope = {
        targetKind: "project",
        get targetId() {
          throw new Error("hostile getter");
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        throwingScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
    });

    it("HC-R5-10: safely catches throwing lineage member getter and returns controlled rejection", () => {
      const runtime = createHumanControlRuntime();
      const members = ["K1", "K2"];
      Object.defineProperty(members, 1, {
        get() {
          throw new Error("hostile element getter");
        },
      });

      const throwingScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: members,
      } as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        throwingScope,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
    });

    it("HC-R5-11: safely handles hostile Proxy without throwing raw exceptions", () => {
      const runtime = createHumanControlRuntime();
      const hostileProxy = new Proxy(
        {},
        {
          get() {
            throw new Error("hostile proxy trap");
          },
          has() {
            throw new Error("hostile proxy has");
          },
        },
      ) as unknown as DeletionScope;

      const outcome = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        hostileProxy,
        clear,
      );
      expect(outcome).toMatchObject({
        kind: "unresolved",
        reason: "invalid-deletion-scope",
      });
    });

    it("HC-R5-12: valid primitive-only scope works across all six scopes", () => {
      const runtime = createHumanControlRuntime();
      const validScopes: DeletionScope[] = [
        { targetKind: "project", targetId: "p1", effect: "remove-retained-user-data" },
        { targetKind: "action", targetId: "a1", effect: "remove-retained-user-data" },
        { targetKind: "accepted-project-context", targetId: "p1", effect: "remove-retained-user-data" },
        { targetKind: "accepted-progress", targetId: "pr1", effect: "remove-retained-user-data" },
        { targetKind: "knowledge-item", targetId: "k1", effect: "remove-retained-user-data" },
        { targetKind: "knowledge-lineage", targetId: "k1", effect: "remove-retained-user-data", lineageMembers: ["k1", "k2"] },
      ];

      for (const sc of validScopes) {
        const dirEv = runtime.trustedInteractionIngress.observeInteraction(intent);
        const confEv = runtime.trustedInteractionIngress.observeInteraction(intent);
        const dir = requireDirection(runtime.humanControl.classifyDeletionDirection(dirEv, sc, clear));
        const conf = requireConfirmation(runtime.humanControl.classifyDeletionConfirmation(confEv, sc, clear));
        const auth = runtime.humanControl.authorizeConfirmedDeletion(dir, conf, sc);
        expect(auth.kind).toBe("confirmed-deletion-authorization");
        expect(runtime.mutationGate.validateDeletion(auth, sc)).toBe(true);
      }
    });

    it("HC-R5-13: malformed targetId cannot mint authority that later validates primitive substitution", () => {
      const runtime = createHumanControlRuntime();
      let serializationCalls = 0;
      const malformedScope = {
        targetKind: "project",
        targetId: {
          toJSON() {
            serializationCalls++;
            return "p1";
          },
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const dirRes = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      const confRes = runtime.humanControl.classifyDeletionConfirmation(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      const authRes = runtime.humanControl.authorizeConfirmedDeletion(
        dirRes as never,
        confRes as never,
        malformedScope,
      );

      expect(authRes.kind).toBe("unresolved");
      expect(serializationCalls).toBe(0);

      const primitiveScope: DeletionScope = {
        targetKind: "project",
        targetId: "p1",
        effect: "remove-retained-user-data",
      };
      expect(runtime.mutationGate.validateDeletion(authRes, primitiveScope)).toBe(false);
    });

    it("HC-R5-14: malformed lineage member cannot mint authority that later validates primitive substitution", () => {
      const runtime = createHumanControlRuntime();
      let serializationCalls = 0;
      const malformedScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: [
          "K1",
          {
            toJSON() {
              serializationCalls++;
              return "K2";
            },
          },
        ],
      } as unknown as DeletionScope;

      const dirRes = runtime.humanControl.classifyDeletionDirection(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      const confRes = runtime.humanControl.classifyDeletionConfirmation(
        runtime.trustedInteractionIngress.observeInteraction(intent),
        malformedScope,
        clear,
      );
      const authRes = runtime.humanControl.authorizeConfirmedDeletion(
        dirRes as never,
        confRes as never,
        malformedScope,
      );

      expect(authRes.kind).toBe("unresolved");
      expect(serializationCalls).toBe(0);

      const primitiveScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: ["K1", "K2"],
      };
      expect(runtime.mutationGate.validateDeletion(authRes, primitiveScope)).toBe(false);
    });
  });

  describe("Hostile lineage Proxy boundary (ENG-007-SR-R002-R2)", () => {
    const hostileLineageScopes: readonly {
      readonly name: string;
      readonly makeScope: () => DeletionScope;
    }[] = [
      {
        name: "revoked Proxy lineageMembers",
        makeScope: () => {
          const revocable = Proxy.revocable<string[]>([], {});
          revocable.revoke();
          return {
            targetKind: "knowledge-lineage",
            targetId: "K1",
            effect: "remove-retained-user-data",
            lineageMembers: revocable.proxy,
          };
        },
      },
      {
        name: "Array Proxy throwing from length",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1"], {
            get(target, property, receiver) {
              if (property === "length") throw new Error("hostile length");
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
      {
        name: "Array Proxy throwing from indexed member access",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1", "K2"], {
            get(target, property, receiver) {
              if (property === "0") throw new Error("hostile member");
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
      {
        name: "Proxy-backed duplicate member validation",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1", "K2"], {
            get(target, property, receiver) {
              if (property === "1") return "K1";
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
    ];

    it.each(hostileLineageScopes)(
      "bounds $name for direction, confirmation, and MutationGate",
      ({ makeScope }) => {
        const runtime = createHumanControlRuntime();
        const directionScope = makeScope();
        const confirmationScope = makeScope();
        let directionOutcome: unknown;
        let confirmationOutcome: unknown;
        let gateOutcome: boolean | undefined;

        expect(() => {
          directionOutcome = runtime.humanControl.classifyDeletionDirection(
            runtime.trustedInteractionIngress.observeInteraction(intent),
            directionScope,
            clear,
          );
        }).not.toThrow();
        expect(directionOutcome).toMatchObject({
          kind: "unresolved",
          reason: "invalid-deletion-scope",
        });

        expect(() => {
          confirmationOutcome = runtime.humanControl.classifyDeletionConfirmation(
            runtime.trustedInteractionIngress.observeInteraction(intent),
            confirmationScope,
            clear,
          );
        }).not.toThrow();
        expect(confirmationOutcome).toMatchObject({
          kind: "unresolved",
          reason: "invalid-deletion-scope",
        });

        expect(() => {
          gateOutcome = runtime.mutationGate.validateDeletion({}, makeScope());
        }).not.toThrow();
        expect(gateOutcome).toBe(false);
      },
    );
  });
});

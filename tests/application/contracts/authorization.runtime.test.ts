import { describe, expect, it } from "vitest";
import {
  createHumanControlRuntime,
  type DeletionScope,
  type TrustedInteractionEvidence,
} from "../../../src/application/contracts/humanControl";
import { nonEmptyText, projectId } from "../../../src/domain/model";
import { captureKnowledge } from "../../../src/domain/knowledge";
import { createProject } from "../../../src/domain/transitions";
const text = (value: string) => nonEmptyText(value)!;
const scope = { operation: "create-project", projectId: "p1", intendedOutcome: "Ship" } as const;
const clear = { target: "clear", effect: "clear" } as const;

describe("runtime authorization enforcement", () => {
  it.each([undefined, {}, { kind: "ordinary-mutation-authorization" }])(
    "rejects missing or fabricated authorization %#",
    (authorization) => {
      const application = createHumanControlRuntime();
      expect(
        createProject(projectId("p1"), text("Ship"), application.mutationGate, authorization as never),
      ).toMatchObject({ kind: "authorization-rejected" });
    },
  );

  it("exercises the trusted production happy path", () => {
    const application = createHumanControlRuntime();
    const evidence = application.trustedInteractionIngress.observeInteraction({
      summary: "Create Project",
    });
    const classification = application.humanControl.classifyOrdinaryDirection(evidence, scope, clear);
    if (classification.kind !== "classified-ordinary-direction") throw new Error("Trusted classification failed");
    const authorization = application.humanControl.authorizeOrdinaryChange(classification, scope);
    if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("Trusted issuance failed");
    expect(createProject(projectId("p1"), text("Ship"), application.mutationGate, authorization)).toMatchObject({
      kind: "valid-transition",
      value: { id: "p1" },
    });
  });

  it("rejects raw self-declaration, proposal, and fabricated evidence", () => {
    const application = createHumanControlRuntime();
    const raw = { basis: "explicit-user-direction", deletionConfirmation: "separately-confirmed" };
    const proposal = application.humanControl.classifyProposal(raw);
    const fakeEvidence = { kind: "trusted-interaction-evidence", ...raw } as unknown as TrustedInteractionEvidence;
    const attempted = application.humanControl.classifyOrdinaryDirection(fakeEvidence, scope, clear);
    expect(proposal.kind).toBe("proposed");
    expect(attempted).toMatchObject({ kind: "unresolved" });
    expect(
      createProject(projectId("p1"), text("Ship"), application.mutationGate, proposal as never),
    ).toMatchObject({ kind: "authorization-rejected" });
  });

  it("rejects foreign-runtime capabilities at the application mutation gate", () => {
    const application = createHumanControlRuntime();
    const attacker = createHumanControlRuntime();
    const evidence = attacker.trustedInteractionIngress.observeInteraction({
      summary: "Create Project",
    });
    const classification = attacker.humanControl.classifyOrdinaryDirection(evidence, scope, clear);
    if (classification.kind !== "classified-ordinary-direction") throw new Error("Trusted classification failed");
    const authorization = attacker.humanControl.authorizeOrdinaryChange(classification, scope);
    expect(
      createProject(projectId("p1"), text("Ship"), application.mutationGate, authorization as never),
    ).toMatchObject({ kind: "authorization-rejected" });
  });

  it("rejects reuse across target, operation, content, and Knowledge", () => {
    const application = createHumanControlRuntime();
    const evidence = application.trustedInteractionIngress.observeInteraction({
      summary: "Create Project",
    });
    const classification = application.humanControl.classifyOrdinaryDirection(evidence, scope, clear);
    if (classification.kind !== "classified-ordinary-direction") throw new Error("Trusted classification failed");
    const authorization = application.humanControl.authorizeOrdinaryChange(classification, scope);
    if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("Trusted issuance failed");
    expect(
      createProject(projectId("p2"), text("Ship"), application.mutationGate, authorization),
    ).toMatchObject({ kind: "authorization-rejected" });
    expect(
      createProject(projectId("p1"), text("Different"), application.mutationGate, authorization),
    ).toMatchObject({ kind: "authorization-rejected" });
    expect(
      captureKnowledge(
        { items: [] },
        { id: "k1" as never, originatingProjectId: projectId("p1"), content: text("Ship"), intentional: true },
        application.mutationGate,
        authorization,
      ),
    ).toMatchObject({ kind: "authorization-rejected" });
  });

  describe("confirmed deletion runtime authorization", () => {
    const lineageScope: DeletionScope = {
      targetKind: "knowledge-lineage",
      targetId: "k1",
      effect: "remove-retained-user-data",
      lineageMembers: ["k1", "k2"],
    };

    it("rejects missing or fabricated deletion authorization", () => {
      const application = createHumanControlRuntime();
      expect(application.mutationGate.validateDeletion(undefined, lineageScope)).toBe(false);
      expect(application.mutationGate.validateDeletion({}, lineageScope)).toBe(false);
      expect(
        application.mutationGate.validateDeletion(
          { kind: "confirmed-deletion-authorization", operation: "destructive-deletion" },
          lineageScope,
        ),
      ).toBe(false);
    });

    it("validates trusted confirmed deletion authorization for knowledge-lineage", () => {
      const application = createHumanControlRuntime();
      const directionEvidence = application.trustedInteractionIngress.observeInteraction({
        summary: "Delete lineage",
      });
      const confirmEvidence = application.trustedInteractionIngress.observeInteraction({
        summary: "Confirm deletion",
      });
      const direction = application.humanControl.classifyDeletionDirection(directionEvidence, lineageScope, clear);
      const confirm = application.humanControl.classifyDeletionConfirmation(confirmEvidence, lineageScope, clear);
      if (
        direction.kind !== "classified-deletion-direction" ||
        confirm.kind !== "classified-deletion-confirmation"
      ) {
        throw new Error("Classification failed");
      }
      const authorization = application.humanControl.authorizeConfirmedDeletion(direction, confirm, lineageScope);
      expect(authorization.kind).toBe("confirmed-deletion-authorization");
      expect(application.mutationGate.validateDeletion(authorization, lineageScope)).toBe(true);
      expect(
        application.mutationGate.validateDeletion(authorization, {
          ...lineageScope,
          targetId: "k2",
        }),
      ).toBe(false);
    });

    it("rejects foreign-runtime confirmed deletion authorization", () => {
      const application = createHumanControlRuntime();
      const foreign = createHumanControlRuntime();
      const directionEvidence = foreign.trustedInteractionIngress.observeInteraction({ summary: "Delete" });
      const confirmEvidence = foreign.trustedInteractionIngress.observeInteraction({ summary: "Confirm" });
      const direction = foreign.humanControl.classifyDeletionDirection(directionEvidence, lineageScope, clear);
      const confirm = foreign.humanControl.classifyDeletionConfirmation(confirmEvidence, lineageScope, clear);
      if (
        direction.kind !== "classified-deletion-direction" ||
        confirm.kind !== "classified-deletion-confirmation"
      ) {
        throw new Error("Classification failed");
      }
      const foreignAuth = foreign.humanControl.authorizeConfirmedDeletion(direction, confirm, lineageScope);
      expect(application.mutationGate.validateDeletion(foreignAuth, lineageScope)).toBe(false);
    });
  });
});

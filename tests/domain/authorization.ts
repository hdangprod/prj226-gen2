import {
  createHumanControlRuntime,
  type OrdinaryMutationScope,
} from "../../src/application/contracts/humanControl";

export const applicationHumanControlRuntime = createHumanControlRuntime();
export const mutationGate = applicationHumanControlRuntime.mutationGate;

export function ordinaryAuthorization(scope: OrdinaryMutationScope) {
  const evidence = applicationHumanControlRuntime.trustedInteractionIngress.observeInteraction(
    { summary: `Authorize ${scope.operation}` },
  );
  const classification = applicationHumanControlRuntime.humanControl.classifyOrdinaryDirection(
    evidence,
    scope,
    { target: "clear", effect: "clear" },
  );
  if (classification.kind !== "classified-ordinary-direction") {
    throw new Error("Expected trusted ordinary direction classification");
  }
  const authorization = applicationHumanControlRuntime.humanControl.authorizeOrdinaryChange(classification, scope);
  if (authorization.kind !== "ordinary-mutation-authorization") {
    throw new Error("Expected trusted ordinary mutation authorization");
  }
  return authorization;
}

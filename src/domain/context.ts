import type {
  Action,
  ActionId,
  CurrentContext,
  ProjectId,
} from "./model";
import {
  type MutationGate,
  type OrdinaryMutationAuthorization,
  type OrdinaryMutationScope,
} from "../application/contracts/humanControl";

export type ContextSelectionResult =
  | { readonly kind: "valid-context-selection"; readonly value: CurrentContext }
  | {
      readonly kind: "invalid-context-selection";
      readonly reason: "action-project-mismatch";
      readonly unchanged: CurrentContext;
    }
  | {
      readonly kind: "authorization-rejected";
      readonly reason: "missing-malformed-or-mismatched-authorization";
      readonly unchanged: CurrentContext;
    };

export function applyExplicitContextSelection(
  current: CurrentContext,
  selection: {
    readonly projectId: ProjectId;
    readonly actionId?: ActionId;
  },
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
  action?: Action,
): ContextSelectionResult {
  const scope: OrdinaryMutationScope = {
    operation: "select-current-context",
    projectId: selection.projectId,
    actionId: selection.actionId,
  };
  if (!gate.validateOrdinary(authorization, scope)) {
    return {
      kind: "authorization-rejected",
      reason: "missing-malformed-or-mismatched-authorization",
      unchanged: current,
    };
  }
  if (
    selection.actionId !== undefined &&
    (action?.id !== selection.actionId || action.projectId !== selection.projectId)
  ) {
    return {
      kind: "invalid-context-selection",
      reason: "action-project-mismatch",
      unchanged: current,
    };
  }

  return {
    kind: "valid-context-selection",
    value: {
      basis: "explicit-user-selection",
      projectId: selection.projectId,
      actionId: selection.actionId,
    },
  };
}

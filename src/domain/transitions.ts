import {
  type MutationGate,
  type OrdinaryMutationAuthorization,
  type OrdinaryMutationScope,
} from "../application/contracts/humanControl";
import type {
  AcceptedProgress,
  AcceptedProjectContext,
  Action,
  ActionId,
  NonEmptyText,
  ProgressId,
  Project,
  ProjectId,
} from "./model";

export type TransitionFailureReason =
  | "project-already-active"
  | "project-already-completed"
  | "action-already-open"
  | "action-already-completed"
  | "action-project-mismatch"
  | "progress-not-current"
  | "progress-target-ambiguous"
  | "progress-id-conflict";

export interface AuthorizationRejected<Value = never> {
  readonly kind: "authorization-rejected";
  readonly reason: "missing-malformed-or-mismatched-authorization";
  readonly unchanged?: Value;
}

export type MutationResult<Value> =
  | { readonly kind: "valid-transition"; readonly value: Value }
  | AuthorizationRejected;

export type TransitionResult<Value> =
  | { readonly kind: "valid-transition"; readonly value: Value }
  | {
      readonly kind: "invalid-transition";
      readonly reason: TransitionFailureReason;
      readonly unchanged: Value;
    }
  | AuthorizationRejected<Value>;

function authorizationRejected<Value>(unchanged?: Value): AuthorizationRejected<Value> {
  return {
    kind: "authorization-rejected",
    reason: "missing-malformed-or-mismatched-authorization",
    unchanged,
  };
}

function isAuthorized(
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
  scope: OrdinaryMutationScope,
): boolean {
  return gate.validateOrdinary(authorization, scope);
}

export function createProject(
  id: ProjectId,
  intendedOutcome: NonEmptyText,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): MutationResult<Project> {
  const scope: OrdinaryMutationScope = {
    operation: "create-project",
    projectId: id,
    intendedOutcome,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected();
  return {
    kind: "valid-transition",
    value: { id, intendedOutcome, state: "Active" },
  };
}

export function completeProject(
  project: Project,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): TransitionResult<Project> {
  const scope: OrdinaryMutationScope = {
    operation: "complete-project",
    projectId: project.id,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(project);
  if (project.state === "Completed") {
    return {
      kind: "invalid-transition",
      reason: "project-already-completed",
      unchanged: project,
    };
  }
  return {
    kind: "valid-transition",
    value: { ...project, state: "Completed" },
  };
}

export function reopenProject(
  project: Project,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): TransitionResult<Project> {
  const scope: OrdinaryMutationScope = {
    operation: "reopen-project",
    projectId: project.id,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(project);
  if (project.state === "Active") {
    return {
      kind: "invalid-transition",
      reason: "project-already-active",
      unchanged: project,
    };
  }
  return {
    kind: "valid-transition",
    value: { ...project, state: "Active" },
  };
}

export function createAction(
  id: ActionId,
  projectId: ProjectId,
  description: NonEmptyText,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): MutationResult<Action> {
  const scope: OrdinaryMutationScope = {
    operation: "create-action",
    actionId: id,
    projectId,
    description,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected();
  return {
    kind: "valid-transition",
    value: { id, projectId, description, state: "Open" },
  };
}

export function completeAction(
  action: Action,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): TransitionResult<Action> {
  const scope: OrdinaryMutationScope = {
    operation: "complete-action",
    actionId: action.id,
    projectId: action.projectId,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(action);
  if (action.state === "Completed") {
    return {
      kind: "invalid-transition",
      reason: "action-already-completed",
      unchanged: action,
    };
  }
  return {
    kind: "valid-transition",
    value: { ...action, state: "Completed" },
  };
}

export function reopenAction(
  action: Action,
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): TransitionResult<Action> {
  const scope: OrdinaryMutationScope = {
    operation: "reopen-action",
    actionId: action.id,
    projectId: action.projectId,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(action);
  if (action.state === "Open") {
    return {
      kind: "invalid-transition",
      reason: "action-already-open",
      unchanged: action,
    };
  }
  return {
    kind: "valid-transition",
    value: { ...action, state: "Open" },
  };
}

export function acceptProgress(
  context: AcceptedProjectContext,
  progress: {
    readonly id: ProgressId;
    readonly projectId: ProjectId;
    readonly statement: NonEmptyText;
    readonly actionId?: ActionId;
  },
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
  action?: Action,
): TransitionResult<AcceptedProjectContext> {
  const scope: OrdinaryMutationScope = {
    operation: "accept-progress",
    progressId: progress.id,
    projectId: progress.projectId,
    actionId: progress.actionId,
    statement: progress.statement,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(context);
  if (context.progress.some(({ id }) => id === progress.id)) {
    return {
      kind: "invalid-transition",
      reason: "progress-id-conflict",
      unchanged: context,
    };
  }
  if (
    context.projectId !== progress.projectId ||
    (progress.actionId !== undefined &&
      (action?.id !== progress.actionId || action.projectId !== progress.projectId))
  ) {
    return {
      kind: "invalid-transition",
      reason: "action-project-mismatch",
      unchanged: context,
    };
  }
  return {
    kind: "valid-transition",
    value: {
      ...context,
      progress: [...context.progress, { ...progress, standing: "current" }],
    },
  };
}

export function correctProgress(
  context: AcceptedProjectContext,
  priorId: ProgressId,
  correction: {
    readonly id: ProgressId;
    readonly statement: NonEmptyText;
  },
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
  action?: Action,
): TransitionResult<AcceptedProjectContext> {
  const scope: OrdinaryMutationScope = {
    operation: "correct-progress",
    projectId: context.projectId,
    priorProgressId: priorId,
    successorProgressId: correction.id,
    statement: correction.statement,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(context);
  const identityMatches = context.progress.filter(({ id }) => id === priorId);
  if (identityMatches.length === 0) {
    return {
      kind: "invalid-transition",
      reason: "progress-not-current",
      unchanged: context,
    };
  }
  if (identityMatches.length !== 1) {
    return {
      kind: "invalid-transition",
      reason: "progress-target-ambiguous",
      unchanged: context,
    };
  }
  if (identityMatches[0].standing !== "current") {
    return {
      kind: "invalid-transition",
      reason: "progress-not-current",
      unchanged: context,
    };
  }
  if (context.progress.some(({ id }) => id === correction.id)) {
    return {
      kind: "invalid-transition",
      reason: "progress-id-conflict",
      unchanged: context,
    };
  }
  const prior = identityMatches[0];
  if (
    prior.projectId !== context.projectId ||
    (prior.actionId !== undefined &&
      (action?.id !== prior.actionId || action.projectId !== prior.projectId))
  ) {
    return {
      kind: "invalid-transition",
      reason: "action-project-mismatch",
      unchanged: context,
    };
  }
  const corrected: AcceptedProgress = {
    id: correction.id,
    projectId: prior.projectId,
    actionId: prior.actionId,
    statement: correction.statement,
    standing: "current",
    supersedesId: prior.id,
  };
  return {
    kind: "valid-transition",
    value: {
      ...context,
      progress: [
        ...context.progress.map((progress) =>
          progress === prior
            ? { ...progress, standing: "superseded" as const }
            : progress,
        ),
        corrected,
      ],
    },
  };
}

export function acceptContextFacts(
  context: AcceptedProjectContext,
  facts: readonly NonEmptyText[],
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): TransitionResult<AcceptedProjectContext> {
  const scope: OrdinaryMutationScope = {
    operation: "accept-context-facts",
    projectId: context.projectId,
    facts,
  };
  if (!isAuthorized(gate, authorization, scope)) return authorizationRejected(context);
  return {
    kind: "valid-transition",
    value: { ...context, facts: [...context.facts, ...facts] },
  };
}

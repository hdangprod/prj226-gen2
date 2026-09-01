import type {
  OrdinaryMutationAuthorization,
  MutationGate,
  OrdinaryMutationScope,
} from "../../contracts/humanControl";
import {
  failedOutcome,
  type AcceptedOutcome,
  type ClarificationRequiredOutcome,
  type FailedOutcome,
  type NormalizedIntent,
} from "../../contracts/operations";
import type {
  AcceptedStatePersistence,
  PersistenceOperationId,
} from "../../ports/persistence";
import {
  applyExplicitContextSelection,
  type ContextSelectionResult,
} from "../../../domain/context";
import type {
  AcceptedProjectContext,
  Action,
  ActionId,
  ActionState,
  CurrentContext,
  NonEmptyText,
  ProgressId,
  Project,
  ProjectId,
  ProjectState,
} from "../../../domain/model";
import {
  acceptContextFacts,
  acceptProgress,
  correctProgress,
  createAction,
  createProject,
  type MutationResult,
  type TransitionResult,
} from "../../../domain/transitions";

export type ProjectActionMutationOutcome<Value> =
  | AcceptedOutcome<Value>
  | FailedOutcome
  | ClarificationRequiredOutcome;

export interface ProjectActionContextServiceDependencies {
  readonly mutationGate: MutationGate;
  readonly persistence: AcceptedStatePersistence;
}

export interface AcceptedProjectLifecycle {
  readonly id: ProjectId;
  readonly state: ProjectState;
}

export interface AcceptedActionLifecycle {
  readonly id: ActionId;
  readonly state: ActionState;
}

interface CommandBase {
  readonly intent: NormalizedIntent;
  readonly operationId: PersistenceOperationId;
  readonly authorization: OrdinaryMutationAuthorization;
}

function failureFromDomain<Value>(
  intent: NormalizedIntent,
  result: Exclude<MutationResult<Value> | TransitionResult<Value>, { readonly kind: "valid-transition" }>,
): FailedOutcome | ClarificationRequiredOutcome {
  if (result.kind === "invalid-transition" && result.reason === "progress-target-ambiguous") {
    return { kind: "clarification-required", intent, reason: "ambiguous-target" };
  }
  return failedOutcome(intent, result.reason, false);
}

export class ProjectActionContextService {
  constructor(private readonly dependencies: ProjectActionContextServiceDependencies) {}

  private async persist<Value>(
    intent: NormalizedIntent,
    operationId: PersistenceOperationId,
    write: Parameters<AcceptedStatePersistence["commitAcceptedState"]>[0]["writes"][number],
    value: Value,
  ): Promise<ProjectActionMutationOutcome<Value>> {
    const result = await this.dependencies.persistence.commitAcceptedState({ operationId, writes: [write] });
    if (result.kind === "committed" || result.kind === "already-committed") {
      return { kind: "accepted", value, disposition: result.kind };
    }
    return failedOutcome(intent, result.reason, result.retryable);
  }

  private authorizeLifecycle(
    intent: NormalizedIntent,
    authorization: OrdinaryMutationAuthorization,
    scope: OrdinaryMutationScope,
  ): FailedOutcome | undefined {
    return this.dependencies.mutationGate.validateOrdinary(authorization, scope)
      ? undefined
      : failedOutcome(intent, "missing-malformed-or-mismatched-authorization", false);
  }

  async establishProject(command: CommandBase & { readonly id: ProjectId; readonly intendedOutcome: NonEmptyText }): Promise<ProjectActionMutationOutcome<Project>> {
    const transition = createProject(command.id, command.intendedOutcome, this.dependencies.mutationGate, command.authorization);
    if (transition.kind !== "valid-transition") return failureFromDomain(command.intent, transition);
    return this.persist(command.intent, command.operationId, { kind: "create-project", project: transition.value }, transition.value);
  }

  async completeProject(command: CommandBase & { readonly projectId: ProjectId }): Promise<ProjectActionMutationOutcome<AcceptedProjectLifecycle>> {
    const authorizationFailure = this.authorizeLifecycle(command.intent, command.authorization, {
      operation: "complete-project",
      projectId: command.projectId,
    });
    if (authorizationFailure !== undefined) return authorizationFailure;
    return this.persist(command.intent, command.operationId, {
      kind: "transition-project",
      projectId: command.projectId,
      expectedState: "Active",
      nextState: "Completed",
    }, { id: command.projectId, state: "Completed" });
  }

  async reopenProject(command: CommandBase & { readonly projectId: ProjectId }): Promise<ProjectActionMutationOutcome<AcceptedProjectLifecycle>> {
    const authorizationFailure = this.authorizeLifecycle(command.intent, command.authorization, {
      operation: "reopen-project",
      projectId: command.projectId,
    });
    if (authorizationFailure !== undefined) return authorizationFailure;
    return this.persist(command.intent, command.operationId, {
      kind: "transition-project",
      projectId: command.projectId,
      expectedState: "Completed",
      nextState: "Active",
    }, { id: command.projectId, state: "Active" });
  }

  async createAction(command: CommandBase & { readonly id: ActionId; readonly projectId: ProjectId; readonly description: NonEmptyText }): Promise<ProjectActionMutationOutcome<Action>> {
    const transition = createAction(command.id, command.projectId, command.description, this.dependencies.mutationGate, command.authorization);
    if (transition.kind !== "valid-transition") return failureFromDomain(command.intent, transition);
    return this.persist(command.intent, command.operationId, { kind: "create-action", action: transition.value }, transition.value);
  }

  async completeAction(command: CommandBase & { readonly actionId: ActionId; readonly projectId: ProjectId }): Promise<ProjectActionMutationOutcome<AcceptedActionLifecycle>> {
    const authorizationFailure = this.authorizeLifecycle(command.intent, command.authorization, {
      operation: "complete-action",
      actionId: command.actionId,
      projectId: command.projectId,
    });
    if (authorizationFailure !== undefined) return authorizationFailure;
    return this.persist(command.intent, command.operationId, {
      kind: "transition-action",
      actionId: command.actionId,
      projectId: command.projectId,
      expectedState: "Open",
      nextState: "Completed",
    }, { id: command.actionId, state: "Completed" });
  }

  async reopenAction(command: CommandBase & { readonly actionId: ActionId; readonly projectId: ProjectId }): Promise<ProjectActionMutationOutcome<AcceptedActionLifecycle>> {
    const authorizationFailure = this.authorizeLifecycle(command.intent, command.authorization, {
      operation: "reopen-action",
      actionId: command.actionId,
      projectId: command.projectId,
    });
    if (authorizationFailure !== undefined) return authorizationFailure;
    return this.persist(command.intent, command.operationId, {
      kind: "transition-action",
      actionId: command.actionId,
      projectId: command.projectId,
      expectedState: "Completed",
      nextState: "Open",
    }, { id: command.actionId, state: "Open" });
  }

  async acceptContextFacts(command: CommandBase & { readonly context: AcceptedProjectContext; readonly facts: readonly NonEmptyText[] }): Promise<ProjectActionMutationOutcome<AcceptedProjectContext>> {
    const transition = acceptContextFacts(command.context, command.facts, this.dependencies.mutationGate, command.authorization);
    if (transition.kind !== "valid-transition") return failureFromDomain(command.intent, transition);
    return this.persist(command.intent, command.operationId, { kind: "append-context-facts", projectId: command.context.projectId, facts: command.facts }, transition.value);
  }

  async acceptProgress(command: CommandBase & { readonly context: AcceptedProjectContext; readonly id: ProgressId; readonly projectId: ProjectId; readonly statement: NonEmptyText; readonly actionId?: ActionId; readonly action?: Action }): Promise<ProjectActionMutationOutcome<AcceptedProjectContext>> {
    const transition = acceptProgress(command.context, { id: command.id, projectId: command.projectId, statement: command.statement, ...(command.actionId === undefined ? {} : { actionId: command.actionId }) }, this.dependencies.mutationGate, command.authorization, command.action);
    if (transition.kind !== "valid-transition") return failureFromDomain(command.intent, transition);
    const progress = transition.value.progress.at(-1);
    if (progress === undefined) return failedOutcome(command.intent, "progress-not-created", false);
    return this.persist(command.intent, command.operationId, { kind: "put-progress", progress }, transition.value);
  }

  async correctProgress(command: CommandBase & { readonly context: AcceptedProjectContext; readonly priorId: ProgressId; readonly successorId: ProgressId; readonly statement: NonEmptyText; readonly action?: Action }): Promise<ProjectActionMutationOutcome<AcceptedProjectContext>> {
    const transition = correctProgress(command.context, command.priorId, { id: command.successorId, statement: command.statement }, this.dependencies.mutationGate, command.authorization, command.action);
    if (transition.kind !== "valid-transition") return failureFromDomain(command.intent, transition);
    const successor = transition.value.progress.at(-1);
    if (successor === undefined || successor.supersedesId === undefined) return failedOutcome(command.intent, "progress-not-corrected", false);
    return this.persist(command.intent, command.operationId, { kind: "correct-progress", successor }, transition.value);
  }

  selectExplicitCurrentContext(
    current: CurrentContext,
    selection: { readonly projectId: ProjectId; readonly actionId?: ActionId },
    authorization: OrdinaryMutationAuthorization,
    action?: Action,
  ): ContextSelectionResult {
    return applyExplicitContextSelection(current, selection, this.dependencies.mutationGate, authorization, action);
  }
}

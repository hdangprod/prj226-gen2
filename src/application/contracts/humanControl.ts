import type {
  ClarificationRequiredOutcome,
  NormalizedIntent,
  ProhibitedOutcome,
  ProhibitionReason,
  ProposedOutcome,
  UnresolvedOutcome,
} from "./operations";

const trustedEvidenceBrand: unique symbol = Symbol("trusted-interaction-evidence");
const ordinaryClassificationBrand: unique symbol = Symbol("ordinary-classification");
const deletionDirectionBrand: unique symbol = Symbol("deletion-direction");
const deletionConfirmationBrand: unique symbol = Symbol("deletion-confirmation");
const ordinaryAuthorizationBrand: unique symbol = Symbol("ordinary-authorization");
const deletionAuthorizationBrand: unique symbol = Symbol("deletion-authorization");

export type OrdinaryMutationScope =
  | { readonly operation: "create-project"; readonly projectId: string; readonly intendedOutcome: string }
  | { readonly operation: "complete-project" | "reopen-project"; readonly projectId: string }
  | { readonly operation: "create-action"; readonly actionId: string; readonly projectId: string; readonly description: string }
  | { readonly operation: "complete-action" | "reopen-action"; readonly actionId: string; readonly projectId: string }
  | { readonly operation: "select-current-context"; readonly projectId: string; readonly actionId?: string }
  | { readonly operation: "accept-context-facts"; readonly projectId: string; readonly facts: readonly string[] }
  | { readonly operation: "accept-progress"; readonly progressId: string; readonly projectId: string; readonly actionId?: string; readonly statement: string }
  | { readonly operation: "correct-progress"; readonly projectId: string; readonly priorProgressId: string; readonly successorProgressId: string; readonly statement: string }
  | { readonly operation: "capture-knowledge"; readonly knowledgeItemId: string; readonly originatingProjectId: string; readonly content: string }
  | { readonly operation: "correct-knowledge"; readonly priorKnowledgeItemId: string; readonly successorKnowledgeItemId: string; readonly originatingProjectId: string; readonly content: string };

export interface DeletionScope {
  readonly targetKind: "project" | "action" | "knowledge-item" | "accepted-project-context" | "accepted-progress";
  readonly targetId: string;
  readonly effect: "remove-retained-user-data";
}

export interface TrustedInteractionEvidence {
  readonly kind: "trusted-interaction-evidence";
  readonly [trustedEvidenceBrand]: true;
}

export interface ClassifiedOrdinaryDirection {
  readonly kind: "classified-ordinary-direction";
  readonly [ordinaryClassificationBrand]: true;
}

export interface ClassifiedDeletionDirection {
  readonly kind: "classified-deletion-direction";
  readonly [deletionDirectionBrand]: true;
}

export interface ClassifiedDeletionConfirmation {
  readonly kind: "classified-deletion-confirmation";
  readonly [deletionConfirmationBrand]: true;
}

export interface OrdinaryMutationAuthorization {
  readonly kind: "ordinary-mutation-authorization";
  readonly operation: OrdinaryMutationScope["operation"];
  readonly [ordinaryAuthorizationBrand]: true;
}

export interface ConfirmedDeletionAuthorization {
  readonly kind: "confirmed-deletion-authorization";
  readonly operation: "destructive-deletion";
  readonly additionalConfirmation: true;
  readonly [deletionAuthorizationBrand]: true;
}

export interface TrustedInteractionIngress {
  readonly observeInteraction: (intent: NormalizedIntent) => TrustedInteractionEvidence;
}

export type ClassificationOptions = {
  readonly target: "clear" | "ambiguous";
  readonly effect: "clear" | "ambiguous";
  readonly prohibition?: ProhibitionReason;
};

export type ClassificationOutcome<Value> = Value | ClarificationRequiredOutcome | ProhibitedOutcome | UnresolvedOutcome;
export type AuthorizationOutcome<Value> = Value | UnresolvedOutcome;

export interface HumanControlSurface {
  readonly classifyOrdinaryDirection: (evidence: TrustedInteractionEvidence, scope: OrdinaryMutationScope, options: ClassificationOptions) => ClassificationOutcome<ClassifiedOrdinaryDirection>;
  readonly authorizeOrdinaryChange: (classification: ClassifiedOrdinaryDirection, scope: OrdinaryMutationScope) => AuthorizationOutcome<OrdinaryMutationAuthorization>;
  readonly classifyDeletionDirection: (evidence: TrustedInteractionEvidence, scope: DeletionScope, options: ClassificationOptions) => ClassificationOutcome<ClassifiedDeletionDirection>;
  readonly classifyDeletionConfirmation: (evidence: TrustedInteractionEvidence, scope: DeletionScope, options: ClassificationOptions) => ClassificationOutcome<ClassifiedDeletionConfirmation>;
  readonly authorizeConfirmedDeletion: (direction: ClassifiedDeletionDirection, confirmation: ClassifiedDeletionConfirmation, scope: DeletionScope) => AuthorizationOutcome<ConfirmedDeletionAuthorization>;
  readonly classifyProposal: <Value>(proposal: Value) => ProposedOutcome<Value>;
}

export interface MutationGate {
  readonly validateOrdinary: (authorization: unknown, scope: OrdinaryMutationScope) => authorization is OrdinaryMutationAuthorization;
  readonly validateDeletion: (authorization: unknown, scope: DeletionScope) => authorization is ConfirmedDeletionAuthorization;
}

export interface HumanControlRuntime {
  readonly trustedInteractionIngress: TrustedInteractionIngress;
  readonly humanControl: HumanControlSurface;
  readonly mutationGate: MutationGate;
}

interface InteractionRecord { readonly intent: NormalizedIntent; readonly identity: object }
interface ClassificationRecord { readonly intent: NormalizedIntent; readonly identity: object; readonly scopeKey: string }

function ordinaryScopeKey(scope: OrdinaryMutationScope): string {
  switch (scope.operation) {
    case "create-project": return JSON.stringify([scope.operation, scope.projectId, scope.intendedOutcome]);
    case "complete-project": case "reopen-project": return JSON.stringify([scope.operation, scope.projectId]);
    case "create-action": return JSON.stringify([scope.operation, scope.actionId, scope.projectId, scope.description]);
    case "complete-action": case "reopen-action": return JSON.stringify([scope.operation, scope.actionId, scope.projectId]);
    case "select-current-context": return JSON.stringify([scope.operation, scope.projectId, scope.actionId ?? null]);
    case "accept-context-facts": return JSON.stringify([scope.operation, scope.projectId, ...scope.facts]);
    case "accept-progress": return JSON.stringify([scope.operation, scope.progressId, scope.projectId, scope.actionId ?? null, scope.statement]);
    case "correct-progress": return JSON.stringify([scope.operation, scope.projectId, scope.priorProgressId, scope.successorProgressId, scope.statement]);
    case "capture-knowledge": return JSON.stringify([scope.operation, scope.knowledgeItemId, scope.originatingProjectId, scope.content]);
    case "correct-knowledge": return JSON.stringify([scope.operation, scope.priorKnowledgeItemId, scope.successorKnowledgeItemId, scope.originatingProjectId, scope.content]);
  }
}

function deletionScopeKey(scope: DeletionScope): string {
  return JSON.stringify([scope.targetKind, scope.targetId, scope.effect]);
}

function rejectByOptions(intent: NormalizedIntent, options: ClassificationOptions): ClarificationRequiredOutcome | ProhibitedOutcome | undefined {
  if (options.prohibition !== undefined) return { kind: "prohibited", intent, reason: options.prohibition };
  if (options.target === "ambiguous") return { kind: "clarification-required", intent, reason: "ambiguous-target" };
  if (options.effect === "ambiguous") return { kind: "clarification-required", intent, reason: "ambiguous-effect" };
  return undefined;
}

export function createHumanControlRuntime(): HumanControlRuntime {
  const interactions = new WeakMap<object, InteractionRecord>();
  const ordinaryClassifications = new WeakMap<object, ClassificationRecord>();
  const deletionDirections = new WeakMap<object, ClassificationRecord>();
  const deletionConfirmations = new WeakMap<object, ClassificationRecord>();
  const ordinaryAuthorizations = new WeakMap<object, string>();
  const deletionAuthorizations = new WeakMap<object, string>();

  const trustedInteractionIngress: TrustedInteractionIngress = {
    observeInteraction: (intent) => {
      const evidence: TrustedInteractionEvidence = { kind: "trusted-interaction-evidence", [trustedEvidenceBrand]: true };
      interactions.set(evidence, { intent, identity: {} });
      return evidence;
    },
  };

  function classify<Value extends object>(
    evidence: TrustedInteractionEvidence,
    scopeKey: string,
    options: ClassificationOptions,
    make: () => Value,
    records: WeakMap<object, ClassificationRecord>,
  ): ClassificationOutcome<Value> {
    const interaction = interactions.get(evidence);
    const intent = interaction?.intent ?? { summary: "Untrusted interaction evidence" };
    const rejected = rejectByOptions(intent, options);
    if (rejected !== undefined) return rejected;
    if (interaction === undefined) return { kind: "unresolved", intent, reason: "invalid-trusted-interaction-evidence" };
    const result = make();
    records.set(result, { intent, identity: interaction.identity, scopeKey });
    return result;
  }

  const humanControl: HumanControlSurface = {
    classifyOrdinaryDirection: (evidence, scope, options) => classify(evidence, ordinaryScopeKey(scope), options, () => ({ kind: "classified-ordinary-direction", [ordinaryClassificationBrand]: true }), ordinaryClassifications),
    authorizeOrdinaryChange: (classification, scope) => {
      const record = ordinaryClassifications.get(classification);
      const key = ordinaryScopeKey(scope);
      if (record === undefined || record.scopeKey !== key) return { kind: "unresolved", intent: record?.intent ?? { summary: "Invalid classification" }, reason: "invalid-or-mismatched-ordinary-classification" };
      const authorization: OrdinaryMutationAuthorization = { kind: "ordinary-mutation-authorization", operation: scope.operation, [ordinaryAuthorizationBrand]: true };
      ordinaryAuthorizations.set(authorization, key);
      return authorization;
    },
    classifyDeletionDirection: (evidence, scope, options) => classify(evidence, deletionScopeKey(scope), options, () => ({ kind: "classified-deletion-direction", [deletionDirectionBrand]: true }), deletionDirections),
    classifyDeletionConfirmation: (evidence, scope, options) => classify(evidence, deletionScopeKey(scope), options, () => ({ kind: "classified-deletion-confirmation", [deletionConfirmationBrand]: true }), deletionConfirmations),
    authorizeConfirmedDeletion: (direction, confirmation, scope) => {
      const directionRecord = deletionDirections.get(direction);
      const confirmationRecord = deletionConfirmations.get(confirmation);
      const intent = directionRecord?.intent ?? { summary: "Invalid deletion classification" };
      const key = deletionScopeKey(scope);
      if (directionRecord === undefined || confirmationRecord === undefined || directionRecord.scopeKey !== key || confirmationRecord.scopeKey !== key || directionRecord.identity === confirmationRecord.identity) {
        return { kind: "unresolved", intent, reason: "invalid-mismatched-or-same-interaction-deletion-evidence" };
      }
      const authorization: ConfirmedDeletionAuthorization = { kind: "confirmed-deletion-authorization", operation: "destructive-deletion", additionalConfirmation: true, [deletionAuthorizationBrand]: true };
      deletionAuthorizations.set(authorization, key);
      return authorization;
    },
    classifyProposal: (proposal) => ({ kind: "proposed", proposal }),
  };

  const mutationGate: MutationGate = {
    validateOrdinary: (authorization, scope): authorization is OrdinaryMutationAuthorization => typeof authorization === "object" && authorization !== null && ordinaryAuthorizations.get(authorization) === ordinaryScopeKey(scope),
    validateDeletion: (authorization, scope): authorization is ConfirmedDeletionAuthorization => typeof authorization === "object" && authorization !== null && deletionAuthorizations.get(authorization) === deletionScopeKey(scope),
  };
  return { trustedInteractionIngress, humanControl, mutationGate };
}

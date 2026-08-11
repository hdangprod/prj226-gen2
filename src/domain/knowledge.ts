import {
  type MutationGate,
  type OrdinaryMutationAuthorization,
  type OrdinaryMutationScope,
} from "../application/contracts/humanControl";
import type {
  KnowledgeItem,
  KnowledgeItemId,
  KnowledgeReference,
  NonEmptyText,
  ProjectId,
} from "./model";

export interface KnowledgeState {
  readonly items: readonly KnowledgeItem[];
}

export type KnowledgeFailureReason =
  | "capture-not-intentional"
  | "knowledge-id-conflict"
  | "correction-target-not-current"
  | "correction-target-ambiguous"
  | "correction-lineage-ambiguous"
  | "correction-identity-cycle"
  | "correction-origin-mismatch"
  | "reuse-not-current"
  | "reuse-not-materially-relevant";

export type KnowledgeTransitionResult<Value> =
  | { readonly kind: "valid-knowledge-change"; readonly value: Value }
  | {
      readonly kind: "invalid-knowledge-change";
      readonly reason: KnowledgeFailureReason;
      readonly unchanged: KnowledgeState;
    }
  | {
      readonly kind: "authorization-rejected";
      readonly reason: "missing-malformed-or-mismatched-authorization";
      readonly unchanged: KnowledgeState;
    };

export type KnowledgeReferenceResult =
  | { readonly kind: "valid-knowledge-reference"; readonly value: KnowledgeReference }
  | {
      readonly kind: "invalid-knowledge-reference";
      readonly reason: "reuse-not-current" | "reuse-not-materially-relevant";
    };

export interface KnowledgeCorrection {
  readonly state: KnowledgeState;
  readonly prior: KnowledgeItem;
  readonly correction: KnowledgeItem;
}

function authorizationRejected(
  unchanged: KnowledgeState,
): KnowledgeTransitionResult<never> {
  return {
    kind: "authorization-rejected",
    reason: "missing-malformed-or-mismatched-authorization",
    unchanged,
  };
}

export function captureKnowledge(
  state: KnowledgeState,
  input: {
    readonly id: KnowledgeItemId;
    readonly originatingProjectId: ProjectId;
    readonly content: NonEmptyText;
    readonly intentional: boolean;
  },
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): KnowledgeTransitionResult<{ readonly state: KnowledgeState; readonly item: KnowledgeItem }> {
  const scope: OrdinaryMutationScope = {
    operation: "capture-knowledge",
    knowledgeItemId: input.id,
    originatingProjectId: input.originatingProjectId,
    content: input.content,
  };
  if (!gate.validateOrdinary(authorization, scope)) {
    return authorizationRejected(state);
  }
  if (!input.intentional) {
    return {
      kind: "invalid-knowledge-change",
      reason: "capture-not-intentional",
      unchanged: state,
    };
  }
  if (state.items.some(({ id }) => id === input.id)) {
    return {
      kind: "invalid-knowledge-change",
      reason: "knowledge-id-conflict",
      unchanged: state,
    };
  }
  const item: KnowledgeItem = {
    id: input.id,
    originatingProjectId: input.originatingProjectId,
    content: input.content,
    standing: "current",
    supersessionChain: [],
  };
  return {
    kind: "valid-knowledge-change",
    value: { state: { items: [...state.items, item] }, item },
  };
}

export function correctKnowledge(
  state: KnowledgeState,
  priorId: KnowledgeItemId,
  correction: {
    readonly id: KnowledgeItemId;
    readonly originatingProjectId: ProjectId;
    readonly content: NonEmptyText;
  },
  gate: MutationGate,
  authorization: OrdinaryMutationAuthorization,
): KnowledgeTransitionResult<KnowledgeCorrection> {
  const scope: OrdinaryMutationScope = {
    operation: "correct-knowledge",
    priorKnowledgeItemId: priorId,
    successorKnowledgeItemId: correction.id,
    originatingProjectId: correction.originatingProjectId,
    content: correction.content,
  };
  if (!gate.validateOrdinary(authorization, scope)) {
    return authorizationRejected(state);
  }
  const identityMatches = state.items.filter(({ id }) => id === priorId);
  if (identityMatches.length === 0) {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-target-not-current",
      unchanged: state,
    };
  }
  if (identityMatches.length !== 1) {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-target-ambiguous",
      unchanged: state,
    };
  }
  const prior = identityMatches[0];
  if (prior.standing !== "current") {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-target-not-current",
      unchanged: state,
    };
  }
  if (prior.originatingProjectId !== correction.originatingProjectId) {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-origin-mismatch",
      unchanged: state,
    };
  }
  if (state.items.some(({ id }) => id === correction.id)) {
    return {
      kind: "invalid-knowledge-change",
      reason:
        correction.id === prior.id || prior.supersessionChain.includes(correction.id)
          ? "correction-identity-cycle"
          : "knowledge-id-conflict",
      unchanged: state,
    };
  }
  const rootId = prior.supersessionChain[0] ?? prior.id;
  const currentLineageItems = state.items.filter(
    (item) =>
      (item.supersessionChain[0] ?? item.id) === rootId &&
      item.standing === "current",
  );
  if (currentLineageItems.length !== 1 || currentLineageItems[0] !== prior) {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-lineage-ambiguous",
      unchanged: state,
    };
  }
  if (correction.id === prior.id || prior.supersessionChain.includes(correction.id)) {
    return {
      kind: "invalid-knowledge-change",
      reason: "correction-identity-cycle",
      unchanged: state,
    };
  }
  const supersededPrior: KnowledgeItem = { ...prior, standing: "superseded" };
  const successor: KnowledgeItem = {
    id: correction.id,
    originatingProjectId: prior.originatingProjectId,
    content: correction.content,
    standing: "current",
    supersedesId: prior.id,
    supersessionChain: [...prior.supersessionChain, prior.id],
  };
  const nextState: KnowledgeState = {
    items: [
      ...state.items.map((item) => (item === prior ? supersededPrior : item)),
      successor,
    ],
  };
  return {
    kind: "valid-knowledge-change",
    value: {
      state: nextState,
      prior: supersededPrior,
      correction: successor,
    },
  };
}

export function referenceKnowledge(
  item: KnowledgeItem,
  assistingProjectId: ProjectId,
  relevance: {
    readonly materiallyRelevant: boolean;
    readonly qualification?: NonEmptyText;
  },
): KnowledgeReferenceResult {
  if (item.standing !== "current" && relevance.qualification === undefined) {
    return { kind: "invalid-knowledge-reference", reason: "reuse-not-current" };
  }
  if (!relevance.materiallyRelevant) {
    return {
      kind: "invalid-knowledge-reference",
      reason: "reuse-not-materially-relevant",
    };
  }
  return {
    kind: "valid-knowledge-reference",
    value: {
      knowledgeItemId: item.id,
      originatingProjectId: item.originatingProjectId,
      assistingProjectId,
      standing: item.standing,
      qualification: relevance.qualification,
    },
  };
}

import type {
  NonEmptyText,
  ProjectId,
  ActionId,
  ProgressId,
  KnowledgeItemId,
} from "../../../domain/model";
import type {
  ClassifiedDeletionDirection,
  ClassificationOptions,
  DeletionScope,
  HumanControlRuntime,
  TrustedInteractionEvidence,
} from "../../contracts/humanControl";
import {
  failedOutcome,
  mixedOutcome,
  type AcceptedOutcome,
  type AdvisoryOutcome,
  type ClarificationRequiredOutcome,
  type FailedOutcome,
  type MixedOutcome,
  type NormalizedIntent,
  type PortionOutcome,
  type ProhibitedOutcome,
  type ProposedOutcome,
  type UnresolvedOutcome,
} from "../../contracts/operations";
import type {
  BoundedModelContext,
  ModelCapabilityPort,
  ProposedOperation,
} from "../../ports/model/modelCapability";
import type { PersistenceOperationId } from "../../ports/persistence";
import type { ExportDeletionService } from "../exportDeletion/exportDeletionTypes";
import type { KnowledgeProvenanceService } from "../knowledgeProvenance/knowledgeProvenanceService";
import type { ProjectActionContextService } from "../projectActionContext/projectActionContextService";
import type { RetrievalService } from "../retrieval/retrievalTypes";

export interface InteractionOrchestratorDependencies {
  readonly retrievalService: RetrievalService;
  readonly humanControlRuntime: HumanControlRuntime;
  readonly modelCapabilityPort: ModelCapabilityPort;
  readonly projectActionContextService: ProjectActionContextService;
  readonly knowledgeProvenanceService: KnowledgeProvenanceService;
  readonly exportDeletionService: ExportDeletionService;
}

export interface ContextSelectionInput {
  readonly interactionText: NonEmptyText | string;
  readonly projectId?: ProjectId;
  readonly actionId?: ActionId;
  readonly itemLimit?: number;
  readonly selectionReason?: NonEmptyText | string;
  readonly includeCrossProjectKnowledge?: boolean;
}

export type ContextSelectionOutcome =
  | { readonly kind: "context-selected"; readonly context: BoundedModelContext }
  | { readonly kind: "project-not-found"; readonly projectId: ProjectId }
  | { readonly kind: "context-rejected"; readonly reason: string }
  | { readonly kind: "retrieval-failed"; readonly reason: string; readonly retryable: boolean };

export interface AdvisoryInteractionInput {
  readonly text: NonEmptyText | string;
  readonly intent?: NormalizedIntent;
  readonly projectId?: ProjectId;
  readonly actionId?: ActionId;
  readonly itemLimit?: number;
  readonly selectionReason?: NonEmptyText | string;
}

export interface ProposalInteractionInput {
  readonly text: NonEmptyText | string;
  readonly intent?: NormalizedIntent;
  readonly projectId?: ProjectId;
  readonly actionId?: ActionId;
  readonly itemLimit?: number;
  readonly selectionReason?: NonEmptyText | string;
}

export type ModelInteractionOutcome =
  | AdvisoryOutcome<NonEmptyText>
  | ProposedOutcome<readonly ProposedOperation[]>
  | ClarificationRequiredOutcome
  | ProhibitedOutcome
  | UnresolvedOutcome
  | FailedOutcome;

export interface EstablishProjectInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly id: ProjectId;
  readonly intendedOutcome: NonEmptyText;
  readonly options?: ClassificationOptions;
}

export interface CompleteProjectInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly projectId: ProjectId;
  readonly options?: ClassificationOptions;
}

export interface ReopenProjectInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly projectId: ProjectId;
  readonly options?: ClassificationOptions;
}

export interface CreateActionInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly id: ActionId;
  readonly projectId: ProjectId;
  readonly description: NonEmptyText;
  readonly options?: ClassificationOptions;
}

export interface CompleteActionInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly actionId: ActionId;
  readonly projectId: ProjectId;
  readonly options?: ClassificationOptions;
}

export interface ReopenActionInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly actionId: ActionId;
  readonly projectId: ProjectId;
  readonly options?: ClassificationOptions;
}

export interface AcceptContextFactsInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly projectId: ProjectId;
  readonly facts: readonly NonEmptyText[];
  readonly options?: ClassificationOptions;
}

export interface AcceptProgressInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly id: ProgressId;
  readonly projectId: ProjectId;
  readonly statement: NonEmptyText;
  readonly actionId?: ActionId;
  readonly options?: ClassificationOptions;
}

export interface CorrectProgressInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly projectId: ProjectId;
  readonly priorId: ProgressId;
  readonly successorId: ProgressId;
  readonly statement: NonEmptyText;
  readonly options?: ClassificationOptions;
}

export interface CaptureKnowledgeInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly id: KnowledgeItemId;
  readonly originatingProjectId: ProjectId;
  readonly content: NonEmptyText;
  readonly intentional?: boolean;
  readonly options?: ClassificationOptions;
}

export interface CorrectKnowledgeInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly priorId: KnowledgeItemId;
  readonly successorId: KnowledgeItemId;
  readonly originatingProjectId: ProjectId;
  readonly content: NonEmptyText;
  readonly options?: ClassificationOptions;
}

export type DeletionDirectionOutcome =
  | {
      readonly kind: "deletion-direction-recorded";
      readonly intent: NormalizedIntent;
      readonly scope: DeletionScope;
      readonly direction: ClassifiedDeletionDirection;
      readonly prompt: NonEmptyText;
    }
  | ClarificationRequiredOutcome
  | ProhibitedOutcome
  | UnresolvedOutcome
  | FailedOutcome;

export interface InitiateDeletionInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly scope: DeletionScope;
  readonly options?: ClassificationOptions;
}

export interface DeletionConfirmationInput {
  readonly evidence: TrustedInteractionEvidence;
  readonly operationId: PersistenceOperationId;
  readonly direction: ClassifiedDeletionDirection;
  readonly scope: DeletionScope;
  readonly options?: ClassificationOptions;
}

export function normalizeUserIntent(text: string): NormalizedIntent {
  const normalized = text.trim();
  return {
    summary: normalized.length > 0 ? normalized : "unspecified-intent",
  };
}

export {
  failedOutcome,
  mixedOutcome,
  type AcceptedOutcome,
  type AdvisoryOutcome,
  type ClarificationRequiredOutcome,
  type FailedOutcome,
  type MixedOutcome,
  type NormalizedIntent,
  type PortionOutcome,
  type ProhibitedOutcome,
  type ProposedOutcome,
  type UnresolvedOutcome,
};

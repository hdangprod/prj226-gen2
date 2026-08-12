import type {
  AcceptedProgress,
  Action,
  KnowledgeItem,
  NonEmptyText,
  Project,
  ProjectId,
} from "../../../domain/model";

export type PersistenceOperationId = string & {
  readonly __brand: "PersistenceOperationId";
};

export type AcceptedStateWrite =
  | { readonly kind: "put-project"; readonly project: Project }
  | { readonly kind: "put-action"; readonly action: Action }
  | {
      readonly kind: "append-context-facts";
      readonly projectId: ProjectId;
      readonly facts: readonly NonEmptyText[];
    }
  | { readonly kind: "put-progress"; readonly progress: AcceptedProgress }
  | {
      readonly kind: "correct-progress";
      readonly successor: AcceptedProgress;
    }
  | { readonly kind: "put-knowledge"; readonly item: KnowledgeItem }
  | {
      readonly kind: "correct-knowledge";
      readonly successor: KnowledgeItem;
    };

export interface AcceptedStateCommit {
  readonly operationId: PersistenceOperationId;
  readonly writes: readonly AcceptedStateWrite[];
}

export type PersistenceFailureReason =
  | "constraint-conflict"
  | "operation-id-conflict"
  | "durability-failure";

export type PersistenceCommitResult =
  | { readonly kind: "committed" }
  | { readonly kind: "already-committed" }
  | {
      readonly kind: "persistence-failed";
      readonly reason: PersistenceFailureReason;
      readonly retryable: boolean;
    };

export interface AcceptedStatePersistence {
  commitAcceptedState(commit: AcceptedStateCommit): Promise<PersistenceCommitResult>;
}

export function persistenceOperationId(value: string): PersistenceOperationId {
  return value as PersistenceOperationId;
}

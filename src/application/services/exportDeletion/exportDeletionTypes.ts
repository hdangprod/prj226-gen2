import type {
  AcceptedProgress,
  Action,
  KnowledgeItem,
  NonEmptyText,
  Project,
  ProjectId,
} from "../../../domain/model";
import type {
  ConfirmedDeletionAuthorization,
  DeletionScope,
} from "../../contracts/humanControl";
import type { PersistenceOperationId } from "../../ports/persistence";

export interface AcceptedStateExportV1 {
  readonly format: "liam-accepted-state-export";
  readonly version: 1;
  readonly projects: readonly Project[];
  readonly actions: readonly Action[];
  readonly acceptedContextFacts: readonly {
    readonly projectId: ProjectId;
    readonly ordinal: number;
    readonly fact: NonEmptyText;
  }[];
  readonly acceptedProgress: readonly AcceptedProgress[];
  readonly knowledgeItems: readonly KnowledgeItem[];
}

export type ExportAcceptedStateResult =
  | {
      readonly kind: "exported";
      readonly format: "liam-accepted-state-export";
      readonly version: 1;
      readonly mediaType: "application/json";
      readonly document: string;
    }
  | {
      readonly kind: "export-failed";
      readonly reason: "authoritative-read-failed";
      readonly retryable: true;
    }
  | {
      readonly kind: "export-failed";
      readonly reason: "malformed-authoritative-state";
      readonly retryable: false;
    };

export interface ConfirmedDeletionCommand {
  readonly operationId: PersistenceOperationId;
  readonly scope: DeletionScope;
  readonly authorization: ConfirmedDeletionAuthorization;
}

export type ConfirmedDeletionResult =
  | {
      readonly kind: "deleted";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
    }
  | {
      readonly kind: "already-deleted";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
    }
  | {
      readonly kind: "deletion-rejected";
      readonly reason: "invalid-or-mismatched-authorization";
      readonly scope: DeletionScope;
    }
  | { readonly kind: "not-found"; readonly scope: DeletionScope }
  | {
      readonly kind: "deletion-failed";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason:
        | "scope-conflict"
        | "operation-id-conflict"
        | "durability-inconsistency";
      readonly retryable: false;
    }
  | {
      readonly kind: "deletion-failed";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason: "authoritative-write-failed";
      readonly retryable: true;
    }
  | {
      readonly kind: "deletion-indeterminate";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason:
        | "persistence-outcome-unavailable"
        | "post-delete-verification-failed";
      readonly retryable: true;
    };

export interface ExportPersistenceData {
  readonly projects: readonly Project[];
  readonly actions: readonly Action[];
  readonly acceptedContextFacts: readonly {
    readonly projectId: ProjectId;
    readonly ordinal: number;
    readonly fact: NonEmptyText;
  }[];
  readonly acceptedProgress: readonly AcceptedProgress[];
  readonly knowledgeItems: readonly KnowledgeItem[];
}

export type ExportPersistenceResult =
  | { readonly kind: "exported"; readonly data: ExportPersistenceData }
  | { readonly kind: "read-failed"; readonly retryable: true }
  | { readonly kind: "malformed-state"; readonly retryable: false };

export interface DeletionExecutionCommand {
  readonly operationId: PersistenceOperationId;
  readonly scope: DeletionScope;
}

export type DeletionPersistenceResult =
  | { readonly kind: "deleted" }
  | { readonly kind: "already-deleted" }
  | { readonly kind: "not-found" }
  | { readonly kind: "scope-conflict" }
  | { readonly kind: "operation-id-conflict" }
  | { readonly kind: "durability-inconsistency" }
  | { readonly kind: "write-failed"; readonly retryable: true }
  | {
      readonly kind: "indeterminate";
      readonly reason:
        | "persistence-outcome-unavailable"
        | "post-delete-verification-failed";
      readonly retryable: true;
    };

export interface ExportDeletionPersistence {
  readExportData(): Promise<ExportPersistenceResult>;
  executeConfirmedDeletion(
    command: DeletionExecutionCommand,
  ): Promise<DeletionPersistenceResult>;
}

export interface ExportDeletionService {
  exportAcceptedState(): Promise<ExportAcceptedStateResult>;
  deleteConfirmed(
    command: ConfirmedDeletionCommand,
  ): Promise<ConfirmedDeletionResult>;
}

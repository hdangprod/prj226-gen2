import type {
  DeletionScope,
  MutationGate,
} from "../../contracts/humanControl";
import { validateAndSnapshotDeletionScope } from "../../contracts/humanControl";
import type { PersistenceOperationId } from "../../ports/persistence";
import type {
  AcceptedStateExportV1,
  ConfirmedDeletionCommand,
  ConfirmedDeletionResult,
  ExportAcceptedStateResult,
  ExportDeletionPersistence,
  ExportDeletionService,
} from "./exportDeletionTypes";

export { validateAndSnapshotDeletionScope };

export class ExportDeletionServiceImpl implements ExportDeletionService {
  constructor(
    private readonly persistence: ExportDeletionPersistence,
    private readonly mutationGate: MutationGate,
  ) {}

  async exportAcceptedState(): Promise<ExportAcceptedStateResult> {
    try {
      const result = await this.persistence.readExportData();
      if (result.kind === "read-failed") {
        return {
          kind: "export-failed",
          reason: "authoritative-read-failed",
          retryable: true,
        };
      }
      if (result.kind === "malformed-state") {
        return {
          kind: "export-failed",
          reason: "malformed-authoritative-state",
          retryable: false,
        };
      }
      const document: AcceptedStateExportV1 = {
        format: "liam-accepted-state-export",
        version: 1,
        projects: result.data.projects,
        actions: result.data.actions,
        acceptedContextFacts: result.data.acceptedContextFacts,
        acceptedProgress: result.data.acceptedProgress,
        knowledgeItems: result.data.knowledgeItems,
      };
      return {
        kind: "exported",
        format: "liam-accepted-state-export",
        version: 1,
        mediaType: "application/json",
        document: JSON.stringify(document),
      };
    } catch {
      return {
        kind: "export-failed",
        reason: "authoritative-read-failed",
        retryable: true,
      };
    }
  }

  async deleteConfirmed(
    command: ConfirmedDeletionCommand,
  ): Promise<ConfirmedDeletionResult> {
    const fallbackScope: DeletionScope = Object.freeze({
      targetKind: "project" as const,
      targetId: "",
      effect: "remove-retained-user-data" as const,
    });

    if (typeof command !== "object" || command === null) {
      return {
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
        scope: fallbackScope,
      };
    }

    let rawOperationId: unknown;
    let rawAuthorization: unknown;
    let rawScope: unknown;

    try {
      rawOperationId = command.operationId;
      rawAuthorization = command.authorization;
      rawScope = command.scope;
    } catch {
      return {
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
        scope: fallbackScope,
      };
    }

    let scopeSnapshot: DeletionScope | undefined;
    try {
      scopeSnapshot = validateAndSnapshotDeletionScope(rawScope);
    } catch {
      scopeSnapshot = undefined;
    }

    if (
      typeof rawOperationId !== "string" ||
      rawOperationId.trim().length === 0 ||
      typeof rawAuthorization !== "object" ||
      rawAuthorization === null ||
      scopeSnapshot === undefined
    ) {
      return {
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
        scope: scopeSnapshot ?? fallbackScope,
      };
    }

    let isValidAuthorization = false;
    try {
      isValidAuthorization = this.mutationGate.validateDeletion(
        rawAuthorization,
        scopeSnapshot,
      );
    } catch {
      isValidAuthorization = false;
    }

    if (!isValidAuthorization) {
      return {
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
        scope: scopeSnapshot,
      };
    }

    const operationId = rawOperationId as PersistenceOperationId;

    try {
      const result = await this.persistence.executeConfirmedDeletion({
        operationId,
        scope: scopeSnapshot,
      });

      switch (result.kind) {
        case "deleted":
          return {
            kind: "deleted",
            operationId,
            scope: scopeSnapshot,
          };
        case "already-deleted":
          return {
            kind: "already-deleted",
            operationId,
            scope: scopeSnapshot,
          };
        case "not-found":
          return {
            kind: "not-found",
            scope: scopeSnapshot,
          };
        case "scope-conflict":
          return {
            kind: "deletion-failed",
            operationId,
            scope: scopeSnapshot,
            reason: "scope-conflict",
            retryable: false,
          };
        case "operation-id-conflict":
          return {
            kind: "deletion-failed",
            operationId,
            scope: scopeSnapshot,
            reason: "operation-id-conflict",
            retryable: false,
          };
        case "durability-inconsistency":
          return {
            kind: "deletion-failed",
            operationId,
            scope: scopeSnapshot,
            reason: "durability-inconsistency",
            retryable: false,
          };
        case "write-failed":
          return {
            kind: "deletion-failed",
            operationId,
            scope: scopeSnapshot,
            reason: "authoritative-write-failed",
            retryable: true,
          };
        case "indeterminate":
          return {
            kind: "deletion-indeterminate",
            operationId,
            scope: scopeSnapshot,
            reason: result.reason,
            retryable: true,
          };
      }
    } catch {
      return {
        kind: "deletion-indeterminate",
        operationId,
        scope: scopeSnapshot,
        reason: "persistence-outcome-unavailable",
        retryable: true,
      };
    }
  }
}

export function createExportDeletionService(
  persistence: ExportDeletionPersistence,
  mutationGate: MutationGate,
): ExportDeletionService {
  return new ExportDeletionServiceImpl(persistence, mutationGate);
}

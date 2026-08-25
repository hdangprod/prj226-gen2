import type {
  AcceptedProgress,
  Action,
  ActionState,
  KnowledgeItem,
  KnowledgeStanding,
  NonEmptyText,
  ProgressStanding,
  Project,
  ProjectState,
} from "../../../domain/model";
import {
  actionId,
  knowledgeItemId,
  nonEmptyText,
  progressId,
  projectId,
} from "../../../domain/model";
import type { DeletionScope } from "../../../application/contracts/humanControl";
import type { PersistenceOperationId } from "../../../application/ports/persistence";
import type {
  DeletionExecutionCommand,
  DeletionPersistenceResult,
  ExportDeletionPersistence,
  ExportPersistenceData,
  ExportPersistenceResult,
} from "../../../application/services/exportDeletion/exportDeletionTypes";
import type {
  D1DatabaseLike,
  D1PreparedStatement,
  D1RunResult,
} from "../d1Types";

const EXPORT_QUERY = `
SELECT 'project' AS kind, id AS col1, intended_outcome AS col2, state AS col3, NULL AS col4, NULL AS col5, NULL AS col6, NULL AS col_ord FROM projects
UNION ALL
SELECT 'action' AS kind, id AS col1, project_id AS col2, description AS col3, state AS col4, NULL AS col5, NULL AS col6, NULL AS col_ord FROM actions
UNION ALL
SELECT 'context_fact' AS kind, project_id AS col1, fact AS col2, NULL AS col3, NULL AS col4, NULL AS col5, NULL AS col6, ordinal AS col_ord FROM accepted_context_facts
UNION ALL
SELECT 'progress' AS kind, id AS col1, project_id AS col2, action_id AS col3, statement AS col4, standing AS col5, supersedes_id AS col6, NULL AS col_ord FROM accepted_progress
UNION ALL
SELECT 'knowledge' AS kind, id AS col1, originating_project_id AS col2, content AS col3, standing AS col4, supersedes_id AS col5, supersession_chain AS col6, NULL AS col_ord FROM knowledge_items
`;

const RECEIPT_QUERY = `
SELECT fingerprint FROM persistence_operations WHERE operation_id = ?
`;

function compareDeterministicText(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function isProjectState(value: unknown): value is ProjectState {
  return value === "Active" || value === "Completed";
}

function isActionState(value: unknown): value is ActionState {
  return value === "Open" || value === "Completed";
}

function computeReceiptFingerprint(scope: DeletionScope): string {
  if (scope.targetKind === "knowledge-lineage") {
    return JSON.stringify([
      scope.targetKind,
      scope.targetId,
      scope.effect,
      [...scope.lineageMembers],
    ]);
  }
  return JSON.stringify([scope.targetKind, scope.targetId, scope.effect]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isConstraintFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /foreign key/i.test(message);
}

interface ExportDbRow {
  readonly kind: string;
  readonly col1: string | null;
  readonly col2: string | null;
  readonly col3: string | null;
  readonly col4: string | null;
  readonly col5: string | null;
  readonly col6: string | null;
  readonly col_ord: number | null;
}

export class D1ExportDeletionPersistence implements ExportDeletionPersistence {
  constructor(private readonly database: D1DatabaseLike) {}

  async readExportData(): Promise<ExportPersistenceResult> {
    try {
      const response = await this.database
        .prepare(EXPORT_QUERY)
        .all<ExportDbRow>();
      const rows = response.results;

      const projects: Project[] = [];
      const actions: Action[] = [];
      const acceptedContextFacts: {
        projectId: ReturnType<typeof projectId>;
        ordinal: number;
        fact: NonEmptyText;
      }[] = [];
      const acceptedProgress: AcceptedProgress[] = [];
      const knowledgeItems: KnowledgeItem[] = [];

      for (const row of rows) {
        if (!row || typeof row !== "object" || typeof row.kind !== "string") {
          return { kind: "malformed-state", retryable: false };
        }

        switch (row.kind) {
          case "project": {
            const { col1, col2, col3 } = row;
            if (
              !isNonEmptyString(col1) ||
              !isNonEmptyString(col2) ||
              !isProjectState(col3)
            ) {
              return { kind: "malformed-state", retryable: false };
            }
            const validatedOutcome = nonEmptyText(col2);
            if (!validatedOutcome) return { kind: "malformed-state", retryable: false };
            projects.push({
              id: projectId(col1),
              intendedOutcome: validatedOutcome,
              state: col3 as ProjectState,
            });
            break;
          }
          case "action": {
            const { col1, col2, col3, col4 } = row;
            if (
              !isNonEmptyString(col1) ||
              !isNonEmptyString(col2) ||
              !isNonEmptyString(col3) ||
              !isActionState(col4)
            ) {
              return { kind: "malformed-state", retryable: false };
            }
            const validatedDesc = nonEmptyText(col3);
            if (!validatedDesc) return { kind: "malformed-state", retryable: false };
            actions.push({
              id: actionId(col1),
              projectId: projectId(col2),
              description: validatedDesc,
              state: col4 as ActionState,
            });
            break;
          }
          case "context_fact": {
            const { col1, col2, col_ord } = row;
            if (
              !isNonEmptyString(col1) ||
              !isNonEmptyString(col2) ||
              typeof col_ord !== "number" ||
              !Number.isSafeInteger(col_ord) ||
              col_ord < 0
            ) {
              return { kind: "malformed-state", retryable: false };
            }
            const validatedFact = nonEmptyText(col2);
            if (!validatedFact) return { kind: "malformed-state", retryable: false };
            acceptedContextFacts.push({
              projectId: projectId(col1),
              ordinal: col_ord,
              fact: validatedFact,
            });
            break;
          }
          case "progress": {
            const { col1, col2, col3, col4, col5, col6 } = row;
            if (
              !isNonEmptyString(col1) ||
              !isNonEmptyString(col2) ||
              !isNonEmptyString(col4) ||
              (col5 !== "current" && col5 !== "superseded") ||
              (col3 !== null && !isNonEmptyString(col3)) ||
              (col6 !== null && !isNonEmptyString(col6))
            ) {
              return { kind: "malformed-state", retryable: false };
            }
            const validatedStatement = nonEmptyText(col4);
            if (!validatedStatement) return { kind: "malformed-state", retryable: false };
            acceptedProgress.push({
              id: progressId(col1),
              projectId: projectId(col2),
              statement: validatedStatement,
              standing: col5 as ProgressStanding,
              ...(col3 ? { actionId: actionId(col3) } : {}),
              ...(col6 ? { supersedesId: progressId(col6) } : {}),
            });
            break;
          }
          case "knowledge": {
            const { col1, col2, col3, col4, col5, col6 } = row;
            if (
              !isNonEmptyString(col1) ||
              !isNonEmptyString(col2) ||
              !isNonEmptyString(col3) ||
              (col4 !== "current" && col4 !== "superseded") ||
              (col5 !== null && !isNonEmptyString(col5)) ||
              typeof col6 !== "string"
            ) {
              return { kind: "malformed-state", retryable: false };
            }
            let chain: unknown;
            try {
              chain = JSON.parse(col6);
            } catch {
              return { kind: "malformed-state", retryable: false };
            }
            if (!Array.isArray(chain) || chain.some((item) => !isNonEmptyString(item))) {
              return { kind: "malformed-state", retryable: false };
            }
            const validatedContent = nonEmptyText(col3);
            if (!validatedContent) return { kind: "malformed-state", retryable: false };
            knowledgeItems.push({
              id: knowledgeItemId(col1),
              originatingProjectId: projectId(col2),
              content: validatedContent,
              standing: col4 as KnowledgeStanding,
              ...(col5 ? { supersedesId: knowledgeItemId(col5) } : {}),
              supersessionChain: chain.map((id) => knowledgeItemId(id)),
            });
            break;
          }
          default:
            return { kind: "malformed-state", retryable: false };
        }
      }

      projects.sort((a, b) => compareDeterministicText(a.id, b.id));
      actions.sort((a, b) => compareDeterministicText(a.id, b.id));
      acceptedContextFacts.sort((a, b) => {
        const cmp = compareDeterministicText(a.projectId, b.projectId);
        return cmp !== 0 ? cmp : a.ordinal - b.ordinal;
      });
      acceptedProgress.sort((a, b) => compareDeterministicText(a.id, b.id));
      knowledgeItems.sort((a, b) => compareDeterministicText(a.id, b.id));

      const data: ExportPersistenceData = {
        projects,
        actions,
        acceptedContextFacts,
        acceptedProgress,
        knowledgeItems,
      };

      return { kind: "exported", data };
    } catch {
      return { kind: "read-failed", retryable: true };
    }
  }

  async executeConfirmedDeletion(
    command: DeletionExecutionCommand,
  ): Promise<DeletionPersistenceResult> {
    const fingerprint = computeReceiptFingerprint(command.scope);

    // 1. Idempotency receipt check
    try {
      const receipt = await this.readReceipt(command.operationId);
      if (receipt !== null) {
        if (receipt.fingerprint !== fingerprint) {
          return { kind: "operation-id-conflict" };
        }
        const present = await this.isTargetPresent(command.scope);
        return present
          ? { kind: "durability-inconsistency" }
          : { kind: "already-deleted" };
      }
    } catch {
      return { kind: "write-failed", retryable: true };
    }

    // 2. Validate target presence and generate deletion statements
    let deleteStatements: D1PreparedStatement[] = [];
    try {
      switch (command.scope.targetKind) {
        case "project": {
          const project = await this.database
            .prepare("SELECT id FROM projects WHERE id = ?")
            .bind(command.scope.targetId)
            .first<{ id: string }>();
          if (project === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          // HR-DELETE-004: Non-cascade check for dependent actions, facts, progress, and knowledge
          const hasActions = await this.database
            .prepare("SELECT 1 FROM actions WHERE project_id = ? LIMIT 1")
            .bind(command.scope.targetId)
            .first();
          if (hasActions !== null) return { kind: "scope-conflict" };

          const hasFacts = await this.database
            .prepare("SELECT 1 FROM accepted_context_facts WHERE project_id = ? LIMIT 1")
            .bind(command.scope.targetId)
            .first();
          if (hasFacts !== null) return { kind: "scope-conflict" };

          const hasProgress = await this.database
            .prepare("SELECT 1 FROM accepted_progress WHERE project_id = ? LIMIT 1")
            .bind(command.scope.targetId)
            .first();
          if (hasProgress !== null) return { kind: "scope-conflict" };

          const hasKnowledge = await this.database
            .prepare("SELECT 1 FROM knowledge_items WHERE originating_project_id = ? LIMIT 1")
            .bind(command.scope.targetId)
            .first();
          if (hasKnowledge !== null) return { kind: "scope-conflict" };

          deleteStatements = [
            this.database
              .prepare("DELETE FROM projects WHERE id = ?")
              .bind(command.scope.targetId),
          ];
          break;
        }
        case "action": {
          const action = await this.database
            .prepare("SELECT id FROM actions WHERE id = ?")
            .bind(command.scope.targetId)
            .first<{ id: string }>();
          if (action === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          const hasProgress = await this.database
            .prepare("SELECT 1 FROM accepted_progress WHERE action_id = ? LIMIT 1")
            .bind(command.scope.targetId)
            .first();
          if (hasProgress !== null) return { kind: "scope-conflict" };

          deleteStatements = [
            this.database
              .prepare("DELETE FROM actions WHERE id = ?")
              .bind(command.scope.targetId),
          ];
          break;
        }
        case "accepted-project-context": {
          const hasFacts = await this.database
            .prepare(
              "SELECT 1 FROM accepted_context_facts WHERE project_id = ? LIMIT 1",
            )
            .bind(command.scope.targetId)
            .first();
          if (hasFacts === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          deleteStatements = [
            this.database
              .prepare("DELETE FROM accepted_context_facts WHERE project_id = ?")
              .bind(command.scope.targetId),
          ];
          break;
        }
        case "accepted-progress": {
          const progress = await this.database
            .prepare("SELECT id FROM accepted_progress WHERE id = ?")
            .bind(command.scope.targetId)
            .first<{ id: string }>();
          if (progress === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          const hasSuccessor = await this.database
            .prepare(
              "SELECT 1 FROM accepted_progress WHERE supersedes_id = ? LIMIT 1",
            )
            .bind(command.scope.targetId)
            .first();
          if (hasSuccessor !== null) return { kind: "scope-conflict" };

          deleteStatements = [
            this.database
              .prepare("DELETE FROM accepted_progress WHERE id = ?")
              .bind(command.scope.targetId),
          ];
          break;
        }
        case "knowledge-item": {
          const item = await this.database
            .prepare("SELECT id, supersedes_id FROM knowledge_items WHERE id = ?")
            .bind(command.scope.targetId)
            .first<{ id: string; supersedes_id: string | null }>();
          if (item === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          if (item.supersedes_id !== null) {
            return { kind: "scope-conflict" };
          }

          const isSupersededBy = await this.database
            .prepare(
              "SELECT 1 FROM knowledge_items WHERE supersedes_id = ? LIMIT 1",
            )
            .bind(command.scope.targetId)
            .first();
          if (isSupersededBy !== null) {
            return { kind: "scope-conflict" };
          }

          deleteStatements = [
            this.database
              .prepare("DELETE FROM knowledge_items WHERE id = ?")
              .bind(command.scope.targetId),
          ];
          break;
        }
        case "knowledge-lineage": {
          const rootItem = await this.database
            .prepare("SELECT id, supersedes_id FROM knowledge_items WHERE id = ?")
            .bind(command.scope.targetId)
            .first<{ id: string; supersedes_id: string | null }>();
          if (rootItem === null) {
            return await this.resolveAfterObservedAbsence(
              command.operationId,
              fingerprint,
              command.scope,
            );
          }

          if (rootItem.supersedes_id !== null) {
            return { kind: "scope-conflict" };
          }

          const actualLineage: string[] = [command.scope.targetId];
          let currentId: string | undefined = command.scope.targetId;
          while (currentId !== undefined) {
            const successor: { readonly id: string } | null = await this.database
              .prepare("SELECT id FROM knowledge_items WHERE supersedes_id = ?")
              .bind(currentId)
              .first<{ readonly id: string }>();
            if (successor === null || typeof successor.id !== "string") {
              currentId = undefined;
            } else {
              actualLineage.push(successor.id);
              currentId = successor.id;
            }
          }

          const confirmed = command.scope.lineageMembers ?? [];
          if (
            actualLineage.length !== confirmed.length ||
            actualLineage.some((id, idx) => id !== confirmed[idx])
          ) {
            const receipt = await this.readReceipt(command.operationId);
            if (receipt !== null) {
              if (receipt.fingerprint !== fingerprint) {
                return { kind: "operation-id-conflict" };
              }
              const present = await this.isTargetPresent(command.scope);
              return present
                ? { kind: "durability-inconsistency" }
                : { kind: "already-deleted" };
            }
            return { kind: "scope-conflict" };
          }

          // FK-safe deletion ordering: newest to oldest (reverse topological order)
          const reversed = [...actualLineage].reverse();
          const countPlaceholders = actualLineage.map(() => "?").join(", ");
          deleteStatements = reversed.map((id, idx) => {
            if (idx === 0) {
              return this.database
                .prepare(
                  `DELETE FROM knowledge_items WHERE id = ? AND (SELECT COUNT(*) FROM knowledge_items WHERE id IN (${countPlaceholders})) = ?`,
                )
                .bind(id, ...actualLineage, actualLineage.length);
            }
            return this.database
              .prepare("DELETE FROM knowledge_items WHERE id = ? AND changes() = 1")
              .bind(id);
          });
          break;
        }
      }
    } catch {
      return { kind: "write-failed", retryable: true };
    }

    const receiptCondition =
      command.scope.targetKind === "accepted-project-context"
        ? "WHERE changes() > 0"
        : "WHERE changes() = 1";

    const receiptStatement = this.database
      .prepare(
        `INSERT INTO persistence_operations (operation_id, fingerprint) SELECT ?, ? ${receiptCondition}`,
      )
      .bind(command.operationId, fingerprint);

    let results: readonly D1RunResult[];
    try {
      results = await this.database.batch([
        ...deleteStatements,
        receiptStatement,
      ]);
      if (
        results.length !== deleteStatements.length + 1 ||
        results.some((r) => !r.success)
      ) {
        return {
          kind: "indeterminate",
          reason: "persistence-outcome-unavailable",
          retryable: true,
        };
      }
    } catch (error) {
      try {
        const receipt = await this.readReceipt(command.operationId);
        if (receipt !== null) {
          if (receipt.fingerprint !== fingerprint) {
            return { kind: "operation-id-conflict" };
          }
          const present = await this.isTargetPresent(command.scope);
          return present
            ? { kind: "durability-inconsistency" }
            : { kind: "already-deleted" };
        }
      } catch {
        return {
          kind: "indeterminate",
          reason: "persistence-outcome-unavailable",
          retryable: true,
        };
      }

      if (isConstraintFailure(error)) {
        return { kind: "scope-conflict" };
      }
      return { kind: "write-failed", retryable: true };
    }

    const receiptResult = results[results.length - 1];
    if ((receiptResult.meta?.changes ?? 0) === 0) {
      try {
        const receipt = await this.readReceipt(command.operationId);
        if (receipt !== null) {
          if (receipt.fingerprint !== fingerprint) {
            return { kind: "operation-id-conflict" };
          }
          const present = await this.isTargetPresent(command.scope);
          return present
            ? { kind: "durability-inconsistency" }
            : { kind: "already-deleted" };
        }
        const present = await this.isTargetPresent(command.scope);
        if (!present) {
          return { kind: "not-found" };
        }
        return { kind: "scope-conflict" };
      } catch {
        return {
          kind: "indeterminate",
          reason: "persistence-outcome-unavailable",
          retryable: true,
        };
      }
    }

    // 3. Post-delete authoritative absence verification
    try {
      const isPresent = await this.isTargetPresent(command.scope);
      if (isPresent) {
        return {
          kind: "indeterminate",
          reason: "post-delete-verification-failed",
          retryable: true,
        };
      }
      return { kind: "deleted" };
    } catch {
      return {
        kind: "indeterminate",
        reason: "post-delete-verification-failed",
        retryable: true,
      };
    }
  }

  private async resolveAfterObservedAbsence(
    operationId: PersistenceOperationId,
    fingerprint: string,
    scope: DeletionScope,
  ): Promise<DeletionPersistenceResult> {
    const receipt = await this.readReceipt(operationId);
    if (receipt !== null) {
      if (receipt.fingerprint !== fingerprint) {
        return { kind: "operation-id-conflict" };
      }
      const present = await this.isTargetPresent(scope);
      return present
        ? { kind: "durability-inconsistency" }
        : { kind: "already-deleted" };
    }
    const present = await this.isTargetPresent(scope);
    if (present) {
      return { kind: "scope-conflict" };
    }
    return { kind: "not-found" };
  }

  private async readReceipt(
    operationId: PersistenceOperationId,
  ): Promise<{ fingerprint: string } | null> {
    const raw = await this.database
      .prepare(RECEIPT_QUERY)
      .bind(operationId)
      .first<{ fingerprint: string }>();
    if (
      raw !== null &&
      isRecord(raw) &&
      typeof raw.fingerprint === "string"
    ) {
      return { fingerprint: raw.fingerprint };
    }
    return null;
  }

  private async isTargetPresent(scope: DeletionScope): Promise<boolean> {
    switch (scope.targetKind) {
      case "project": {
        const row = await this.database
          .prepare("SELECT 1 FROM projects WHERE id = ?")
          .bind(scope.targetId)
          .first();
        return row !== null;
      }
      case "action": {
        const row = await this.database
          .prepare("SELECT 1 FROM actions WHERE id = ?")
          .bind(scope.targetId)
          .first();
        return row !== null;
      }
      case "accepted-project-context": {
        const row = await this.database
          .prepare(
            "SELECT 1 FROM accepted_context_facts WHERE project_id = ? LIMIT 1",
          )
          .bind(scope.targetId)
          .first();
        return row !== null;
      }
      case "accepted-progress": {
        const row = await this.database
          .prepare("SELECT 1 FROM accepted_progress WHERE id = ?")
          .bind(scope.targetId)
          .first();
        return row !== null;
      }
      case "knowledge-item": {
        const row = await this.database
          .prepare("SELECT 1 FROM knowledge_items WHERE id = ?")
          .bind(scope.targetId)
          .first();
        return row !== null;
      }
      case "knowledge-lineage": {
        const members = scope.lineageMembers ?? [scope.targetId];
        for (const id of members) {
          const row = await this.database
            .prepare("SELECT 1 FROM knowledge_items WHERE id = ?")
            .bind(id)
            .first();
          if (row !== null) return true;
        }
        return false;
      }
      default: {
        return false;
      }
    }
  }
}

export function createD1ExportDeletionPersistence(
  database: D1DatabaseLike,
): ExportDeletionPersistence {
  return new D1ExportDeletionPersistence(database);
}

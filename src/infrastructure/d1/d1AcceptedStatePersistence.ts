import type {
  AcceptedStateCommit,
  AcceptedStatePersistence,
  AcceptedStateWrite,
  PersistenceCommitResult,
} from "../../application/ports/persistence";
import type { D1DatabaseLike, D1PreparedStatement } from "./d1Types";

const RECEIPT_QUERY = "SELECT fingerprint FROM persistence_operations WHERE operation_id = ?";

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => `${JSON.stringify(key)}:${stable(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function statement(
  database: D1DatabaseLike,
  query: string,
  ...bindings: readonly unknown[]
): D1PreparedStatement {
  return database.prepare(query).bind(...bindings);
}

function statementsForWrite(
  database: D1DatabaseLike,
  write: AcceptedStateWrite,
): readonly D1PreparedStatement[] {
  switch (write.kind) {
    case "put-project":
      return [statement(database, "INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state", write.project.id, write.project.intendedOutcome, write.project.state)];
    case "put-action":
      return [statement(database, "INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state", write.action.id, write.action.projectId, write.action.description, write.action.state)];
    case "append-context-facts":
      return write.facts.map((fact, index) => statement(database, "INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, (SELECT COALESCE(MAX(ordinal), -1) + 1 + ? FROM accepted_context_facts WHERE project_id = ?), ?)", write.projectId, index, write.projectId, fact));
    case "put-progress":
      return [insertProgress(database, write.progress)];
    case "correct-progress":
      return [insertProgress(database, write.successor)];
    case "put-knowledge":
      return [insertKnowledge(database, write.item)];
    case "correct-knowledge":
      return [insertKnowledge(database, write.successor)];
  }
}

function insertProgress(database: D1DatabaseLike, progress: Extract<AcceptedStateWrite, { kind: "put-progress" }>['progress']): D1PreparedStatement {
  return statement(database, "INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)", progress.id, progress.projectId, progress.actionId ?? null, progress.statement, progress.standing, progress.supersedesId ?? null);
}

function insertKnowledge(database: D1DatabaseLike, item: Extract<AcceptedStateWrite, { kind: "put-knowledge" }>['item']): D1PreparedStatement {
  return statement(database, "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", item.id, item.originatingProjectId, item.content, item.standing, item.supersedesId ?? null, JSON.stringify(item.supersessionChain));
}

function isConstraintFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /constraint|unique|foreign key|check/i.test(message);
}

export class D1AcceptedStatePersistence implements AcceptedStatePersistence {
  constructor(private readonly database: D1DatabaseLike) {}

  async commitAcceptedState(commit: AcceptedStateCommit): Promise<PersistenceCommitResult> {
    const fingerprint = stable(commit.writes);
    try {
      const writes = commit.writes.flatMap((write) => statementsForWrite(this.database, write));
      const receipt = statement(this.database, "INSERT INTO persistence_operations (operation_id, fingerprint) VALUES (?, ?)", commit.operationId, fingerprint);
      const results = await this.database.batch([...writes, receipt]);
      if (results.length !== writes.length + 1 || results.some(({ success }) => !success)) {
        return { kind: "persistence-failed", reason: "durability-failure", retryable: true };
      }
      return { kind: "committed" };
    } catch (error) {
      if (isConstraintFailure(error)) {
        try {
          const existing = await this.database.first<{ fingerprint: string }>(RECEIPT_QUERY, commit.operationId);
          if (existing?.fingerprint === fingerprint) return { kind: "already-committed" };
          if (existing !== null) return { kind: "persistence-failed", reason: "operation-id-conflict", retryable: false };
        } catch {
          return { kind: "persistence-failed", reason: "durability-failure", retryable: true };
        }
        return { kind: "persistence-failed", reason: "constraint-conflict", retryable: false };
      }
      return { kind: "persistence-failed", reason: "durability-failure", retryable: true };
    }
  }
}

import type {
  AcceptedStateCommit,
  AcceptedStatePersistence,
  AcceptedStateWrite,
  PersistenceCommitResult,
  PersistenceOperationId,
} from "../../application/ports/persistence";
import type { D1DatabaseLike, D1PreparedStatement } from "./d1Types";
import type {
  AcceptedProgress,
  Action,
  ActionId,
  KnowledgeItem,
  KnowledgeItemId,
  NonEmptyText,
  ProgressId,
  Project,
  ProjectId,
} from "../../domain/model";

const RECEIPT_QUERY = "SELECT fingerprint FROM persistence_operations WHERE operation_id = ?";

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactOwnKeys(
  value: Record<PropertyKey, unknown>,
  allowed: readonly string[],
): boolean {
  const keys = Reflect.ownKeys(value);
  return keys.length === allowed.length && keys.every(
    (key) => typeof key === "string" && allowed.includes(key),
  );
}

function hasCanonicalOwnKeys(
  value: Record<PropertyKey, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean {
  const keys = Reflect.ownKeys(value);
  return required.every((key) => Object.prototype.hasOwnProperty.call(value, key))
    && keys.every((key) => typeof key === "string" && (required.includes(key) || optional.includes(key)));
}

function readOwnOptional(
  value: Record<PropertyKey, unknown>,
  key: string,
): unknown {
  return Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
}

function canonicalizeProject(raw: unknown): Project | undefined {
  if (!isRecord(raw) || !hasCanonicalOwnKeys(raw, ["id", "intendedOutcome", "state"])) return undefined;
  const id = raw.id;
  const intendedOutcome = raw.intendedOutcome;
  const state = raw.state;
  if (typeof id !== "string" || typeof intendedOutcome !== "string" || (state !== "Active" && state !== "Completed")) return undefined;
  return { id: id as ProjectId, intendedOutcome: intendedOutcome as NonEmptyText, state };
}

function canonicalizeAction(raw: unknown): Action | undefined {
  if (!isRecord(raw) || !hasCanonicalOwnKeys(raw, ["id", "projectId", "description", "state"])) return undefined;
  const id = raw.id;
  const projectId = raw.projectId;
  const description = raw.description;
  const state = raw.state;
  if (typeof id !== "string" || typeof projectId !== "string" || typeof description !== "string" || (state !== "Open" && state !== "Completed")) return undefined;
  return { id: id as ActionId, projectId: projectId as ProjectId, description: description as NonEmptyText, state };
}

function canonicalizeStringArray<Value extends string>(raw: unknown): readonly Value[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const lengthDescriptor = Object.getOwnPropertyDescriptor(raw, "length");
  if (lengthDescriptor === undefined || !("value" in lengthDescriptor)) return undefined;
  const length = lengthDescriptor.value;
  if (!Number.isSafeInteger(length) || length < 0) return undefined;
  const expectedKeys = ["length"];
  for (let index = 0; index < length; index += 1) expectedKeys.push(String(index));
  if (!hasExactOwnKeys(raw as unknown as Record<PropertyKey, unknown>, expectedKeys)) return undefined;
  const values: Value[] = [];
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(raw, String(index));
    if (descriptor === undefined || !("value" in descriptor)) return undefined;
    const value = descriptor.value;
    if (typeof value !== "string") return undefined;
    values.push(value as Value);
  }
  return values;
}

function canonicalizeProgress(raw: unknown): AcceptedProgress | undefined {
  if (!isRecord(raw) || !hasCanonicalOwnKeys(raw, ["id", "projectId", "statement", "standing"], ["actionId", "supersedesId"])) return undefined;
  const id = raw.id;
  const projectId = raw.projectId;
  const statementValue = raw.statement;
  const standing = raw.standing;
  const actionIdValue = readOwnOptional(raw, "actionId");
  const supersedesIdValue = readOwnOptional(raw, "supersedesId");
  if (typeof id !== "string" || typeof projectId !== "string" || typeof statementValue !== "string" || (standing !== "current" && standing !== "superseded")) return undefined;
  if (actionIdValue !== undefined && typeof actionIdValue !== "string") return undefined;
  if (supersedesIdValue !== undefined && typeof supersedesIdValue !== "string") return undefined;
  return {
    id: id as ProgressId,
    projectId: projectId as ProjectId,
    statement: statementValue as NonEmptyText,
    standing,
    ...(actionIdValue === undefined ? {} : { actionId: actionIdValue as ActionId }),
    ...(supersedesIdValue === undefined ? {} : { supersedesId: supersedesIdValue as ProgressId }),
  };
}

function canonicalizeKnowledge(raw: unknown): KnowledgeItem | undefined {
  if (!isRecord(raw) || !hasCanonicalOwnKeys(raw, ["id", "originatingProjectId", "content", "standing", "supersessionChain"], ["supersedesId"])) return undefined;
  const id = raw.id;
  const originatingProjectId = raw.originatingProjectId;
  const content = raw.content;
  const standing = raw.standing;
  const supersedesIdValue = readOwnOptional(raw, "supersedesId");
  const supersessionChain = canonicalizeStringArray<KnowledgeItemId>(raw.supersessionChain);
  if (typeof id !== "string" || typeof originatingProjectId !== "string" || typeof content !== "string" || (standing !== "current" && standing !== "superseded") || supersessionChain === undefined) return undefined;
  if (supersedesIdValue !== undefined && typeof supersedesIdValue !== "string") return undefined;
  return {
    id: id as KnowledgeItemId,
    originatingProjectId: originatingProjectId as ProjectId,
    content: content as NonEmptyText,
    standing,
    ...(supersedesIdValue === undefined ? {} : { supersedesId: supersedesIdValue as KnowledgeItemId }),
    supersessionChain,
  };
}

function canonicalizeWrite(raw: unknown): AcceptedStateWrite | undefined {
  if (!isRecord(raw)) return undefined;
  const kind = raw.kind;
  switch (kind) {
    case "put-project": {
      if (!hasExactOwnKeys(raw, ["kind", "project"])) return undefined;
      const project = canonicalizeProject(raw.project);
      return project === undefined ? undefined : { kind, project };
    }
    case "put-action": {
      if (!hasExactOwnKeys(raw, ["kind", "action"])) return undefined;
      const action = canonicalizeAction(raw.action);
      return action === undefined ? undefined : { kind, action };
    }
    case "append-context-facts": {
      if (!hasExactOwnKeys(raw, ["kind", "projectId", "facts"])) return undefined;
      const projectId = raw.projectId;
      const facts = canonicalizeStringArray<NonEmptyText>(raw.facts);
      return typeof projectId === "string" && facts !== undefined
        ? { kind, projectId: projectId as ProjectId, facts }
        : undefined;
    }
    case "put-progress": {
      if (!hasExactOwnKeys(raw, ["kind", "progress"])) return undefined;
      const progress = canonicalizeProgress(raw.progress);
      return progress === undefined ? undefined : { kind, progress };
    }
    case "correct-progress": {
      if (!hasExactOwnKeys(raw, ["kind", "successor"])) return undefined;
      const successor = canonicalizeProgress(raw.successor);
      return successor?.supersedesId === undefined ? undefined : { kind, successor };
    }
    case "put-knowledge": {
      if (!hasExactOwnKeys(raw, ["kind", "item"])) return undefined;
      const item = canonicalizeKnowledge(raw.item);
      return item === undefined ? undefined : { kind, item };
    }
    case "correct-knowledge": {
      if (!hasExactOwnKeys(raw, ["kind", "successor"])) return undefined;
      const successor = canonicalizeKnowledge(raw.successor);
      return successor?.supersedesId === undefined ? undefined : { kind, successor };
    }
    default:
      return undefined;
  }
}

function canonicalizeWriteArray(raw: unknown): readonly AcceptedStateWrite[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const lengthDescriptor = Object.getOwnPropertyDescriptor(raw, "length");
  if (lengthDescriptor === undefined || !("value" in lengthDescriptor)) return undefined;
  const length = lengthDescriptor.value;
  if (!Number.isSafeInteger(length) || length < 0) return undefined;
  const expectedKeys = ["length"];
  for (let index = 0; index < length; index += 1) expectedKeys.push(String(index));
  if (!hasExactOwnKeys(raw as unknown as Record<PropertyKey, unknown>, expectedKeys)) return undefined;
  const writes: AcceptedStateWrite[] = [];
  for (let index = 0; index < length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(raw, String(index));
    if (descriptor === undefined || !("value" in descriptor)) return undefined;
    const write = canonicalizeWrite(descriptor.value);
    if (write === undefined) return undefined;
    writes.push(write);
  }
  return writes;
}

function canonicalizeCommit(raw: unknown): AcceptedStateCommit | undefined {
  if (!isRecord(raw) || !hasExactOwnKeys(raw, ["operationId", "writes"])) return undefined;
  const operationId = raw.operationId;
  const canonicalWrites = canonicalizeWriteArray(raw.writes);
  if (typeof operationId !== "string" || canonicalWrites === undefined) return undefined;
  return {
    operationId: operationId as PersistenceOperationId,
    writes: canonicalWrites,
  };
}

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
    let canonical: AcceptedStateCommit | undefined;
    try {
      canonical = canonicalizeCommit(commit);
    } catch {
      canonical = undefined;
    }
    if (canonical === undefined) {
      return { kind: "persistence-failed", reason: "constraint-conflict", retryable: false };
    }
    const fingerprint = stable(canonical.writes);
    try {
      const writes = canonical.writes.flatMap((write) => statementsForWrite(this.database, write));
      const receipt = statement(this.database, "INSERT INTO persistence_operations (operation_id, fingerprint) VALUES (?, ?)", canonical.operationId, fingerprint);
      const results = await this.database.batch([...writes, receipt]);
      if (results.length !== writes.length + 1 || results.some(({ success }) => !success)) {
        return { kind: "persistence-failed", reason: "durability-failure", retryable: true };
      }
      return { kind: "committed" };
    } catch (error) {
      if (isConstraintFailure(error)) {
        try {
          const existing = await this.database.first<{ fingerprint: string }>(RECEIPT_QUERY, canonical.operationId);
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

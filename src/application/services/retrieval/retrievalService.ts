import type {
  AcceptedProgress,
  Action,
  ActionId,
  ActionState,
  KnowledgeItem,
  KnowledgeItemId,
  KnowledgeStanding,
  NonEmptyText,
  ProgressId,
  Project,
  ProjectId,
  ProjectState,
} from "../../../domain/model";
import type {
  D1DatabaseLike,
  D1PreparedStatement,
} from "../../../infrastructure/d1/d1Types";
import type {
  RetrievalResult,
  RetrievalService,
} from "./retrievalTypes";

const PROJECT_BY_ID_QUERY =
  "SELECT id, intended_outcome, state FROM projects WHERE id = ?";
const LIST_PROJECTS_QUERY =
  "SELECT id, intended_outcome, state FROM projects ORDER BY id ASC";
const LIST_PROJECTS_BY_STATE_QUERY =
  "SELECT id, intended_outcome, state FROM projects WHERE state = ? ORDER BY id ASC";
const ACTIONS_FOR_PROJECT_QUERY =
  "SELECT id, project_id, description, state FROM actions WHERE project_id = ? ORDER BY id ASC";
const CONTEXT_FACTS_FOR_PROJECT_QUERY =
  "SELECT fact FROM accepted_context_facts WHERE project_id = ? ORDER BY ordinal ASC";
const CURRENT_PROGRESS_FOR_PROJECT_QUERY =
  "SELECT id, project_id, action_id, statement, standing, supersedes_id FROM accepted_progress WHERE project_id = ? AND standing = 'current' ORDER BY id ASC";
const CURRENT_KNOWLEDGE_FOR_PROJECT_QUERY =
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE originating_project_id = ? AND standing = 'current' ORDER BY id ASC";
const CURRENT_KNOWLEDGE_ACROSS_PROJECTS_QUERY =
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' ORDER BY id ASC";
const CURRENT_KNOWLEDGE_ACROSS_PROJECTS_EXCLUDING_QUERY =
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' AND originating_project_id <> ? ORDER BY id ASC";
const KNOWLEDGE_ITEM_BY_ID_QUERY =
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE id = ?";

type RetrievalFailure = Extract<
  RetrievalResult<never>,
  { readonly kind: "retrieval-failed" }
>;

function retrievalFailure(): RetrievalFailure {
  return {
    kind: "retrieval-failed",
    reason: "database-query-error",
    retryable: false,
  };
}

function normalizeRetrievalError(error: unknown): RetrievalFailure {
  const message = error instanceof Error ? error.message : "";
  const retryable =
    /timeout|connection|network|econnrefused|reset|temporar|busy|locked|overloaded|fetch failed/i.test(
      message,
    );
  return {
    kind: "retrieval-failed",
    reason: retryable ? "transient-database-error" : "database-query-error",
    retryable,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyStoredText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function executeAll(
  statement: D1PreparedStatement,
): Promise<readonly unknown[] | undefined> {
  const response: unknown = await statement.all();
  if (!isRecord(response) || !Array.isArray(response.results)) {
    return undefined;
  }
  return response.results;
}

function mapAll<Row>(
  rows: readonly unknown[],
  mapper: (row: unknown) => Row | undefined,
): readonly Row[] | undefined {
  const mapped: Row[] = [];
  for (const row of rows) {
    const item = mapper(row);
    if (item === undefined) return undefined;
    mapped.push(item);
  }
  return mapped;
}

function mapProject(row: unknown): Project | undefined {
  if (!isRecord(row)) return undefined;
  const { id, intended_outcome: intendedOutcome, state } = row;
  if (
    typeof id !== "string" ||
    !isNonEmptyStoredText(intendedOutcome) ||
    (state !== "Active" && state !== "Completed")
  ) {
    return undefined;
  }
  return {
    id: id as ProjectId,
    intendedOutcome: intendedOutcome as NonEmptyText,
    state,
  };
}

function mapAction(row: unknown): Action | undefined {
  if (!isRecord(row)) return undefined;
  const { id, project_id: projectId, description, state } = row;
  if (
    typeof id !== "string" ||
    typeof projectId !== "string" ||
    !isNonEmptyStoredText(description) ||
    (state !== "Open" && state !== "Completed")
  ) {
    return undefined;
  }
  return {
    id: id as ActionId,
    projectId: projectId as ProjectId,
    description: description as NonEmptyText,
    state: state as ActionState,
  };
}

function mapContextFact(row: unknown): NonEmptyText | undefined {
  if (!isRecord(row) || !isNonEmptyStoredText(row.fact)) return undefined;
  return row.fact as NonEmptyText;
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function mapCurrentProgress(row: unknown): AcceptedProgress | undefined {
  if (!isRecord(row)) return undefined;
  const {
    id,
    project_id: projectId,
    action_id: actionId,
    statement,
    standing,
    supersedes_id: supersedesId,
  } = row;
  if (
    typeof id !== "string" ||
    typeof projectId !== "string" ||
    !nullableString(actionId) ||
    !isNonEmptyStoredText(statement) ||
    standing !== "current" ||
    !nullableString(supersedesId)
  ) {
    return undefined;
  }
  return {
    id: id as ProgressId,
    projectId: projectId as ProjectId,
    statement: statement as NonEmptyText,
    standing,
    ...(actionId === null ? {} : { actionId: actionId as ActionId }),
    ...(supersedesId === null
      ? {}
      : { supersedesId: supersedesId as ProgressId }),
  };
}

function parseSupersessionChain(
  value: unknown,
): readonly KnowledgeItemId[] | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
      return undefined;
    }
    return parsed as readonly KnowledgeItemId[];
  } catch {
    return undefined;
  }
}

function mapKnowledge(
  row: unknown,
  requiredStanding?: "current",
): KnowledgeItem | undefined {
  if (!isRecord(row)) return undefined;
  const {
    id,
    originating_project_id: originatingProjectId,
    content,
    standing,
    supersedes_id: supersedesId,
    supersession_chain: storedChain,
  } = row;
  if (
    typeof id !== "string" ||
    typeof originatingProjectId !== "string" ||
    !isNonEmptyStoredText(content) ||
    (standing !== "current" && standing !== "superseded") ||
    (requiredStanding !== undefined && standing !== requiredStanding) ||
    !nullableString(supersedesId)
  ) {
    return undefined;
  }
  const supersessionChain = parseSupersessionChain(storedChain);
  if (supersessionChain === undefined) return undefined;
  return {
    id: id as KnowledgeItemId,
    originatingProjectId: originatingProjectId as ProjectId,
    content: content as NonEmptyText,
    standing: standing as KnowledgeStanding,
    ...(supersedesId === null
      ? {}
      : { supersedesId: supersedesId as KnowledgeItemId }),
    supersessionChain,
  };
}

async function retrieveCollection<Row>(
  statement: D1PreparedStatement,
  mapper: (row: unknown) => Row | undefined,
): Promise<RetrievalResult<readonly Row[]>> {
  const rows = await executeAll(statement);
  if (rows === undefined) return retrievalFailure();
  const value = mapAll(rows, mapper);
  return value === undefined
    ? retrievalFailure()
    : { kind: "found", value };
}

export class DirectSqlRetrievalService implements RetrievalService {
  constructor(private readonly database: D1DatabaseLike) {}

  async getProject(projectId: ProjectId): Promise<RetrievalResult<Project>> {
    try {
      const row: unknown = await this.database
        .prepare(PROJECT_BY_ID_QUERY)
        .bind(projectId)
        .first();
      if (row === null) {
        return { kind: "not-found", entityType: "project", id: projectId };
      }
      const value = mapProject(row);
      return value === undefined
        ? retrievalFailure()
        : { kind: "found", value };
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async listProjects(filter?: {
    readonly state?: ProjectState;
  }): Promise<RetrievalResult<readonly Project[]>> {
    try {
      const statement =
        filter?.state === undefined
          ? this.database.prepare(LIST_PROJECTS_QUERY)
          : this.database
              .prepare(LIST_PROJECTS_BY_STATE_QUERY)
              .bind(filter.state);
      return await retrieveCollection(statement, mapProject);
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getActionsForProject(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly Action[]>> {
    try {
      return await retrieveCollection(
        this.database.prepare(ACTIONS_FOR_PROJECT_QUERY).bind(projectId),
        mapAction,
      );
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getAcceptedContextFacts(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly NonEmptyText[]>> {
    try {
      return await retrieveCollection(
        this.database.prepare(CONTEXT_FACTS_FOR_PROJECT_QUERY).bind(projectId),
        mapContextFact,
      );
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getCurrentProgress(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly AcceptedProgress[]>> {
    try {
      return await retrieveCollection(
        this.database
          .prepare(CURRENT_PROGRESS_FOR_PROJECT_QUERY)
          .bind(projectId),
        mapCurrentProgress,
      );
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getCurrentKnowledgeForProject(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly KnowledgeItem[]>> {
    try {
      return await retrieveCollection(
        this.database
          .prepare(CURRENT_KNOWLEDGE_FOR_PROJECT_QUERY)
          .bind(projectId),
        (row) => mapKnowledge(row, "current"),
      );
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getCurrentKnowledgeAcrossProjects(options?: {
    readonly excludeOriginatingProjectId?: ProjectId;
  }): Promise<RetrievalResult<readonly KnowledgeItem[]>> {
    try {
      const statement =
        options?.excludeOriginatingProjectId === undefined
          ? this.database.prepare(CURRENT_KNOWLEDGE_ACROSS_PROJECTS_QUERY)
          : this.database
              .prepare(CURRENT_KNOWLEDGE_ACROSS_PROJECTS_EXCLUDING_QUERY)
              .bind(options.excludeOriginatingProjectId);
      return await retrieveCollection(statement, (row) =>
        mapKnowledge(row, "current"),
      );
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getKnowledgeItem(
    id: KnowledgeItemId,
  ): Promise<RetrievalResult<KnowledgeItem>> {
    try {
      const row: unknown = await this.database
        .prepare(KNOWLEDGE_ITEM_BY_ID_QUERY)
        .bind(id)
        .first();
      if (row === null) {
        return { kind: "not-found", entityType: "knowledge-item", id };
      }
      const value = mapKnowledge(row);
      return value === undefined
        ? retrievalFailure()
        : { kind: "found", value };
    } catch (error) {
      return normalizeRetrievalError(error);
    }
  }

  async getKnowledgeLineage(
    id: KnowledgeItemId,
  ): Promise<RetrievalResult<readonly KnowledgeItem[]>> {
    const targetResult = await this.getKnowledgeItem(id);
    if (targetResult.kind !== "found") return targetResult;

    const target = targetResult.value;
    const predecessorIds = target.supersessionChain;
    const seen = new Set<string>();
    for (const predecessorId of predecessorIds) {
      if (predecessorId === target.id || seen.has(predecessorId)) {
        return retrievalFailure();
      }
      seen.add(predecessorId);
    }

    const lineage: KnowledgeItem[] = [];
    for (const predecessorId of predecessorIds) {
      const predecessorResult = await this.getKnowledgeItem(predecessorId);
      if (predecessorResult.kind !== "found") {
        return predecessorResult.kind === "retrieval-failed"
          ? predecessorResult
          : retrievalFailure();
      }
      if (
        predecessorResult.value.originatingProjectId !==
        target.originatingProjectId
      ) {
        return retrievalFailure();
      }
      lineage.push(predecessorResult.value);
    }
    lineage.push(target);
    return { kind: "found", value: lineage };
  }
}

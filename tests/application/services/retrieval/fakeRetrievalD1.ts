import type {
  D1DatabaseLike,
  D1PreparedStatement,
  D1ReadAllResult,
  D1RunResult,
} from "../../../../src/infrastructure/d1/d1Types";

export interface ProjectRow {
  readonly id: string;
  readonly intended_outcome: string;
  readonly state: string;
}

export interface ActionRow {
  readonly id: string;
  readonly project_id: string;
  readonly description: string;
  readonly state: string;
}

export interface ContextFactRow {
  readonly project_id: string;
  readonly ordinal: number;
  readonly fact: string;
}

export interface ProgressRow {
  readonly id: string;
  readonly project_id: string;
  readonly action_id: string | null;
  readonly statement: string;
  readonly standing: string;
  readonly supersedes_id: string | null;
}

export interface KnowledgeRow {
  readonly id: string;
  readonly originating_project_id: string;
  readonly content: string;
  readonly standing: string;
  readonly supersedes_id: string | null;
  readonly supersession_chain: string;
}

export interface RecordedQuery {
  readonly query: string;
  readonly bindings: readonly unknown[];
  readonly operation: "first" | "all";
}

class FakeRetrievalStatement implements D1PreparedStatement {
  constructor(
    private readonly database: FakeRetrievalD1,
    private readonly query: string,
    private readonly bindings: readonly unknown[] = [],
  ) {}

  bind(...values: readonly unknown[]): D1PreparedStatement {
    if (this.database.failurePoint === "bind") throw this.database.failure;
    return new FakeRetrievalStatement(this.database, this.query, values);
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    this.database.recordedQueries.push({
      query: this.query,
      bindings: this.bindings,
      operation: "first",
    });
    if (
      this.database.failurePoint === "first" ||
      (this.query.includes("FROM knowledge_items WHERE id = ?") &&
        this.bindings[0] === this.database.failKnowledgeId)
    ) {
      throw this.database.failure;
    }
    if (this.database.firstOverride?.enabled === true) {
      return this.database.firstOverride.value as T | null;
    }
    return (this.database.executeRows(this.query, this.bindings)[0] ?? null) as T | null;
  }

  async all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>> {
    this.database.recordedQueries.push({
      query: this.query,
      bindings: this.bindings,
      operation: "all",
    });
    if (this.database.failurePoint === "all") throw this.database.failure;
    if (this.database.allOverride?.enabled === true) {
      return this.database.allOverride.value as D1ReadAllResult<T>;
    }
    return {
      results: this.database.executeRows(
        this.query,
        this.bindings,
      ) as readonly T[],
    };
  }
}

export class FakeRetrievalD1 implements D1DatabaseLike {
  readonly projects = new Map<string, ProjectRow>();
  readonly actions = new Map<string, ActionRow>();
  readonly contextFacts: ContextFactRow[] = [];
  readonly progress = new Map<string, ProgressRow>();
  readonly knowledge = new Map<string, KnowledgeRow>();
  readonly persistenceOperations = new Map<string, string>();
  readonly recordedQueries: RecordedQuery[] = [];
  allOverride: { readonly enabled: true; readonly value: unknown } | undefined;
  firstOverride: { readonly enabled: true; readonly value: unknown } | undefined;
  failurePoint: "prepare" | "bind" | "first" | "all" | undefined;
  failure: unknown = new Error("database query failed");
  failKnowledgeId: unknown;
  batchCalls = 0;

  prepare(query: string): D1PreparedStatement {
    if (this.failurePoint === "prepare") throw this.failure;
    return new FakeRetrievalStatement(this, query);
  }

  async batch(
    statements: readonly D1PreparedStatement[],
  ): Promise<readonly D1RunResult[]> {
    void statements;
    this.batchCalls += 1;
    throw new Error("retrieval tests prohibit batch writes");
  }

  executeRows(
    query: string,
    bindings: readonly unknown[],
  ): readonly Record<string, unknown>[] {
    if (query === "SELECT id, intended_outcome, state FROM projects WHERE id = ?") {
      const row = this.projects.get(String(bindings[0]));
      return row === undefined ? [] : [{ ...row }];
    }
    if (query === "SELECT id, intended_outcome, state FROM projects ORDER BY id ASC") {
      return [...this.projects.values()].sort(compareById).map((row) => ({ ...row }));
    }
    if (
      query ===
      "SELECT id, intended_outcome, state FROM projects WHERE state = ? ORDER BY id ASC"
    ) {
      return [...this.projects.values()]
        .filter((row) => row.state === bindings[0])
        .sort(compareById)
        .map((row) => ({ ...row }));
    }
    if (
      query ===
      "SELECT id, project_id, description, state FROM actions WHERE project_id = ? ORDER BY id ASC"
    ) {
      return [...this.actions.values()]
        .filter((row) => row.project_id === bindings[0])
        .sort(compareById)
        .map((row) => ({ ...row }));
    }
    if (
      query ===
      "SELECT fact FROM accepted_context_facts WHERE project_id = ? ORDER BY ordinal ASC"
    ) {
      return this.contextFacts
        .filter((row) => row.project_id === bindings[0])
        .sort((left, right) => left.ordinal - right.ordinal)
        .map(({ fact }) => ({ fact }));
    }
    if (
      query ===
      "SELECT id, project_id, action_id, statement, standing, supersedes_id FROM accepted_progress WHERE project_id = ? AND standing = 'current' ORDER BY id ASC"
    ) {
      return [...this.progress.values()]
        .filter(
          (row) =>
            row.project_id === bindings[0] && row.standing === "current",
        )
        .sort(compareById)
        .map((row) => ({ ...row }));
    }
    if (
      query ===
      "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE originating_project_id = ? AND standing = 'current' ORDER BY id ASC"
    ) {
      return this.currentKnowledge(
        (row) => row.originating_project_id === bindings[0],
      );
    }
    if (
      query ===
      "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' ORDER BY id ASC"
    ) {
      return this.currentKnowledge(() => true);
    }
    if (
      query ===
      "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' AND originating_project_id <> ? ORDER BY id ASC"
    ) {
      return this.currentKnowledge(
        (row) => row.originating_project_id !== bindings[0],
      );
    }
    if (
      query ===
      "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE id = ?"
    ) {
      const row = this.knowledge.get(String(bindings[0]));
      return row === undefined ? [] : [{ ...row }];
    }
    throw new Error(`unsupported retrieval query: ${query}`);
  }

  private currentKnowledge(
    predicate: (row: KnowledgeRow) => boolean,
  ): readonly Record<string, unknown>[] {
    return [...this.knowledge.values()]
      .filter((row) => row.standing === "current" && predicate(row))
      .sort(compareById)
      .map((row) => ({ ...row }));
  }
}

function compareById(
  left: Readonly<Record<"id", string>>,
  right: Readonly<Record<"id", string>>,
): number {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

import type {
  D1DatabaseLike,
  D1PreparedStatement as LocalD1PreparedStatement,
  D1ReadAllResult,
  D1RunResult,
} from "../../../src/infrastructure/d1/d1Types";

export type AssertAssignable<Expected, Actual extends Expected> = Actual;
export type ProviderD1DatabaseSatisfiesLocalContract = AssertAssignable<D1DatabaseLike, D1Database>;
export type ProviderD1PreparedStatementSatisfiesLocalContract = AssertAssignable<
  LocalD1PreparedStatement,
  D1PreparedStatement
>;

export interface RecordedStatement {
  readonly query: string;
  readonly bindings: readonly unknown[];
}

class FakeStatement implements LocalD1PreparedStatement {
  constructor(
    private readonly database: FakeD1,
    readonly query: string,
    readonly bindings: readonly unknown[] = [],
  ) {}
  bind(...values: readonly unknown[]): LocalD1PreparedStatement {
    return new FakeStatement(this.database, this.query, values);
  }
  async first<T = Record<string, unknown>>(): Promise<T | null> {
    if (this.database.failReceiptLookup !== undefined) throw this.database.failReceiptLookup;
    if (this.database.receiptLookupOverride?.enabled) return this.database.receiptLookupOverride.value as T | null;
    if (this.query !== "SELECT fingerprint FROM persistence_operations WHERE operation_id = ?") return null;
    const fingerprint = this.database.receipts.get(String(this.bindings[0]));
    return fingerprint === undefined ? null : ({ fingerprint } as T);
  }
  async all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>> {
    const query = this.query
      .replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "")
      .replace(/[ \t\n\r\f]+/g, " ");
    const bindings = this.stringBindingsFor(query);
    let results: readonly Record<string, unknown>[];

    switch (query) {
      case "SELECT id, intended_outcome, state FROM projects ORDER BY id ASC":
        results = [...this.database.projects.entries()]
          .map(([id, project]) => ({ id, intended_outcome: project.intendedOutcome, state: project.state }))
          .sort(compareById);
        break;
      case "SELECT id, intended_outcome, state FROM projects WHERE state = ? ORDER BY id ASC":
        results = [...this.database.projects.entries()]
          .filter(([, project]) => project.state === bindings[0])
          .map(([id, project]) => ({ id, intended_outcome: project.intendedOutcome, state: project.state }))
          .sort(compareById);
        break;
      case "SELECT id, project_id, description, state FROM actions WHERE project_id = ? ORDER BY id ASC":
        results = [...this.database.actions.entries()]
          .filter(([, action]) => action.projectId === bindings[0])
          .map(([id, action]) => ({ id, project_id: action.projectId, description: action.description, state: action.state }))
          .sort(compareById);
        break;
      case "SELECT fact FROM accepted_context_facts WHERE project_id = ? ORDER BY ordinal ASC":
        results = (this.database.contextFacts.get(bindings[0]) ?? []).map((fact) => ({ fact }));
        break;
      case "SELECT id, project_id, action_id, statement, standing, supersedes_id FROM accepted_progress WHERE project_id = ? AND standing = 'current' ORDER BY id ASC":
        results = [...this.database.progress.entries()]
          .filter(([, progress]) => progress.projectId === bindings[0] && progress.standing === "current")
          .map(([id, progress]) => ({ id, project_id: progress.projectId, action_id: progress.actionId, statement: progress.statement, standing: progress.standing, supersedes_id: progress.supersedesId }))
          .sort(compareById);
        break;
      case "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE originating_project_id = ? AND standing = 'current' ORDER BY id ASC":
        results = this.currentKnowledge((knowledge) => knowledge.originatingProjectId === bindings[0]);
        break;
      case "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' ORDER BY id ASC":
        results = this.currentKnowledge(() => true);
        break;
      case "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' AND originating_project_id <> ? ORDER BY id ASC":
        results = this.currentKnowledge((knowledge) => knowledge.originatingProjectId !== bindings[0]);
        break;
      default:
        throw new Error(`unsupported FakeD1 collection query: ${query}`);
    }

    return { results: results as readonly T[] };
  }

  private stringBindingsFor(query: string): readonly string[] {
    const expectedCount = query.includes("?") ? 1 : 0;
    if (this.bindings.length !== expectedCount) {
      throw new Error(`invalid FakeD1 collection query binding count: expected ${expectedCount}, received ${this.bindings.length}`);
    }
    if (this.bindings.some((binding) => typeof binding !== "string")) {
      throw new Error("invalid FakeD1 collection query binding type: expected string");
    }
    return this.bindings as readonly string[];
  }

  private currentKnowledge(
    predicate: (knowledge: { readonly originatingProjectId: string }) => boolean,
  ): readonly Record<string, unknown>[] {
    return [...this.database.knowledge.entries()]
      .filter(([, knowledge]) => knowledge.standing === "current" && predicate(knowledge))
      .map(([id, knowledge]) => ({ id, originating_project_id: knowledge.originatingProjectId, content: knowledge.content, standing: knowledge.standing, supersedes_id: knowledge.supersedesId, supersession_chain: knowledge.supersessionChain }))
      .sort(compareById);
  }
}

function compareById(
  left: Readonly<Record<"id", string>>,
  right: Readonly<Record<"id", string>>,
): number {
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

export class FakeD1 implements D1DatabaseLike {
  readonly batches: RecordedStatement[][] = [];
  readonly receipts = new Map<string, string>();
  readonly projects = new Map<string, { intendedOutcome: string; state: string }>();
  readonly actions = new Map<string, { projectId: string; description: string; state: string }>();
  readonly contextFacts = new Map<string, string[]>();
  readonly progress = new Map<string, { projectId: string; actionId: string | null; statement: string; standing: string; supersedesId: string | null }>();
  readonly knowledge = new Map<string, { originatingProjectId: string; content: string; standing: string; supersedesId: string | null; supersessionChain: string }>();
  failBatch: unknown;
  failReceiptLookup: unknown;
  receiptLookupOverride: { readonly enabled: boolean; readonly value: unknown } | undefined;
  partialResult = false;

  prepare(query: string): LocalD1PreparedStatement {
    return new FakeStatement(this, query);
  }

  async batch(statements: readonly LocalD1PreparedStatement[]): Promise<readonly D1RunResult[]> {
    const recorded = statements as readonly FakeStatement[];
    this.batches.push(recorded.map(({ query, bindings }) => ({ query, bindings })));
    if (this.failBatch !== undefined) throw this.failBatch;
    const nextProjects = new Map(this.projects);
    const nextActions = new Map(this.actions);
    const nextContextFacts = new Map([...this.contextFacts].map(([key, value]) => [key, [...value]]));
    const nextProgress = new Map(this.progress);
    const nextKnowledge = new Map(this.knowledge);
    const nextReceipts = new Map(this.receipts);
    const changes: number[] = [];
    let previousChanges = 0;
    for (const item of recorded) {
      let statementChanges = 0;
      if (item.query.startsWith("INSERT INTO projects")) {
        const [id, intendedOutcome] = item.bindings as [string, string];
        if (nextProjects.has(id)) throw new Error("project identity collision: SQLITE_CONSTRAINT");
        nextProjects.set(id, { intendedOutcome, state: "Active" });
        statementChanges = 1;
      }
      if (item.query.startsWith("UPDATE projects")) {
        const [state, id, expectedState] = item.bindings as [string, string, string];
        const existing = nextProjects.get(id);
        if (existing !== undefined && existing.state === expectedState) {
          nextProjects.set(id, { ...existing, state });
          statementChanges = 1;
        }
      }
      if (item.query.startsWith("INSERT INTO actions")) {
        const [id, projectId, description] = item.bindings as [string, string, string];
        if (!nextProjects.has(projectId)) throw new Error("foreign key constraint: SQLITE_CONSTRAINT");
        if (nextActions.has(id)) throw new Error("action identity collision: SQLITE_CONSTRAINT");
        nextActions.set(id, { projectId, description, state: "Open" });
        statementChanges = 1;
      }
      if (item.query.startsWith("UPDATE actions")) {
        const [state, id, projectId, expectedState] = item.bindings as [string, string, string, string];
        const existing = nextActions.get(id);
        if (existing !== undefined && existing.projectId === projectId && existing.state === expectedState) {
          nextActions.set(id, { ...existing, state });
          statementChanges = 1;
        }
      }
      if (item.query.startsWith("INSERT INTO accepted_context_facts")) {
        const [projectId, , , fact] = item.bindings as [string, number, string, string];
        nextContextFacts.set(projectId, [...(nextContextFacts.get(projectId) ?? []), fact]);
        statementChanges = 1;
      }
      if (item.query.startsWith("INSERT INTO accepted_progress")) {
        const [id, projectId, actionId, statement, standing, supersedesId] = item.bindings as [string, string, string | null, string, string, string | null];
        nextProgress.set(id, { projectId, actionId, statement, standing, supersedesId });
        if (supersedesId !== null) {
          const prior = nextProgress.get(supersedesId);
          if (prior !== undefined) nextProgress.set(supersedesId, { ...prior, standing: "superseded" });
        }
        statementChanges = 1;
      }
      if (item.query.startsWith("INSERT INTO knowledge_items")) {
        const [id, originatingProjectId, content, standing, supersedesId, supersessionChain] = item.bindings as [string, string, string, string, string | null, string];
        nextKnowledge.set(id, { originatingProjectId, content, standing, supersedesId, supersessionChain });
        if (supersedesId !== null) {
          const prior = nextKnowledge.get(supersedesId);
          if (prior !== undefined) nextKnowledge.set(supersedesId, { ...prior, standing: "superseded" });
        }
        statementChanges = 1;
      }
      if (item.query.includes("persistence_operations")) {
        const [operationId, fingerprint] = item.bindings as [string, string];
        if (!item.query.includes("WHERE changes() = 1") || previousChanges === 1) {
          if (nextReceipts.has(operationId)) throw new Error("UNIQUE constraint failed");
          nextReceipts.set(operationId, fingerprint);
          statementChanges = 1;
        }
      }
      changes.push(statementChanges);
      previousChanges = statementChanges;
    }
    const results = recorded.map((_, index) => ({ success: !(this.partialResult && index === recorded.length - 1), meta: { changes: changes[index]! } }));
    if (results.some(({ success }) => !success)) return results;
    this.projects.clear();
    nextProjects.forEach((value, key) => this.projects.set(key, value));
    this.actions.clear();
    nextActions.forEach((value, key) => this.actions.set(key, value));
    this.contextFacts.clear();
    nextContextFacts.forEach((value, key) => this.contextFacts.set(key, value));
    this.progress.clear();
    nextProgress.forEach((value, key) => this.progress.set(key, value));
    this.knowledge.clear();
    nextKnowledge.forEach((value, key) => this.knowledge.set(key, value));
    this.receipts.clear();
    nextReceipts.forEach((value, key) => this.receipts.set(key, value));
    return results;
  }
}

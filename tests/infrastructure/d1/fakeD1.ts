import type { D1DatabaseLike, D1PreparedStatement, D1RunResult } from "../../../src/infrastructure/d1/d1Types";

export interface RecordedStatement {
  readonly query: string;
  readonly bindings: readonly unknown[];
}

class FakeStatement implements D1PreparedStatement {
  constructor(readonly query: string, readonly bindings: readonly unknown[] = []) {}
  bind(...values: readonly unknown[]): D1PreparedStatement {
    return new FakeStatement(this.query, values);
  }
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
  partialResult = false;

  prepare(query: string): D1PreparedStatement {
    return new FakeStatement(query);
  }

  async batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]> {
    const recorded = statements as readonly FakeStatement[];
    this.batches.push(recorded.map(({ query, bindings }) => ({ query, bindings })));
    if (this.failBatch !== undefined) throw this.failBatch;
    const nextProjects = new Map(this.projects);
    const nextActions = new Map(this.actions);
    const nextContextFacts = new Map([...this.contextFacts].map(([key, value]) => [key, [...value]]));
    const nextProgress = new Map(this.progress);
    const nextKnowledge = new Map(this.knowledge);
    const nextReceipts = new Map(this.receipts);
    for (const item of recorded) {
      if (item.query.startsWith("INSERT INTO projects")) {
        const [id, intendedOutcome, state] = item.bindings as [string, string, string];
        const existing = nextProjects.get(id);
        if (existing !== undefined && existing.intendedOutcome !== intendedOutcome) {
          throw new Error("project identity collision: SQLITE_CONSTRAINT");
        }
        nextProjects.set(id, { intendedOutcome, state });
      }
      if (item.query.startsWith("INSERT INTO actions")) {
        const [id, projectId, description, state] = item.bindings as [string, string, string, string];
        const existing = nextActions.get(id);
        if (existing !== undefined && (existing.projectId !== projectId || existing.description !== description)) {
          throw new Error("action identity collision: SQLITE_CONSTRAINT");
        }
        nextActions.set(id, { projectId, description, state });
      }
      if (item.query.startsWith("INSERT INTO accepted_context_facts")) {
        const [projectId, , , fact] = item.bindings as [string, number, string, string];
        nextContextFacts.set(projectId, [...(nextContextFacts.get(projectId) ?? []), fact]);
      }
      if (item.query.startsWith("INSERT INTO accepted_progress")) {
        const [id, projectId, actionId, statement, standing, supersedesId] = item.bindings as [string, string, string | null, string, string, string | null];
        nextProgress.set(id, { projectId, actionId, statement, standing, supersedesId });
        if (supersedesId !== null) {
          const prior = nextProgress.get(supersedesId);
          if (prior !== undefined) nextProgress.set(supersedesId, { ...prior, standing: "superseded" });
        }
      }
      if (item.query.startsWith("INSERT INTO knowledge_items")) {
        const [id, originatingProjectId, content, standing, supersedesId, supersessionChain] = item.bindings as [string, string, string, string, string | null, string];
        nextKnowledge.set(id, { originatingProjectId, content, standing, supersedesId, supersessionChain });
        if (supersedesId !== null) {
          const prior = nextKnowledge.get(supersedesId);
          if (prior !== undefined) nextKnowledge.set(supersedesId, { ...prior, standing: "superseded" });
        }
      }
    }
    const receipt = recorded.at(-1);
    if (receipt?.query.includes("persistence_operations")) {
      const [operationId, fingerprint] = receipt.bindings as [string, string];
      if (nextReceipts.has(operationId)) throw new Error("UNIQUE constraint failed");
      nextReceipts.set(operationId, fingerprint);
    }
    const results = recorded.map((_, index) => ({ success: !(this.partialResult && index === recorded.length - 1) }));
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

  async first<T>(_query: string, ...bindings: readonly unknown[]): Promise<T | null> {
    const fingerprint = this.receipts.get(String(bindings[0]));
    return fingerprint === undefined ? null : ({ fingerprint } as T);
  }
}

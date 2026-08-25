import type {
  D1DatabaseLike,
  D1PreparedStatement,
  D1ReadAllResult,
  D1RunResult,
} from "../../../../src/infrastructure/d1/d1Types";

export interface RecordedStatement {
  readonly query: string;
  readonly bindings: readonly unknown[];
}

export class FakeStatement implements D1PreparedStatement {
  constructor(
    private readonly database: FakeExportDeletionD1,
    readonly query: string,
    readonly bindings: readonly unknown[] = [],
  ) {}

  bind(...values: readonly unknown[]): D1PreparedStatement {
    return new FakeStatement(this.database, this.query, values);
  }

  async run(): Promise<D1RunResult> {
    const results = await this.database.batch([this]);
    return results[0] as D1RunResult;
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    if (this.database.failFirst !== undefined) {
      throw this.database.failFirst;
    }

    const cleanQuery = this.query.replace(/\s+/g, " ").trim();

    if (cleanQuery.startsWith("SELECT fingerprint FROM persistence_operations WHERE operation_id = ?")) {
      const opId = String(this.bindings[0]);
      const fp = this.database.receipts.get(opId);
      return fp ? ({ fingerprint: fp } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT id FROM projects WHERE id = ?")) {
      const id = String(this.bindings[0]);
      const p = this.database.projects.get(id);
      return p ? ({ id } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM projects WHERE id = ?")) {
      if (this.database.failAbsenceCheck !== undefined) {
        throw this.database.failAbsenceCheck;
      }
      const id = String(this.bindings[0]);
      return this.database.projects.has(id) ? ({ "1": 1 } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM actions WHERE project_id = ? LIMIT 1")) {
      const projectId = String(this.bindings[0]);
      for (const [, a] of this.database.actions) {
        if (a.projectId === projectId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM accepted_context_facts WHERE project_id = ? LIMIT 1") || cleanQuery.startsWith("SELECT 1 FROM accepted_context_facts WHERE project_id = ?")) {
      if (cleanQuery.startsWith("SELECT 1 FROM accepted_context_facts WHERE project_id = ?") && !cleanQuery.includes("LIMIT") && this.database.failAbsenceCheck !== undefined) {
        throw this.database.failAbsenceCheck;
      }
      const projectId = String(this.bindings[0]);
      const facts = this.database.contextFacts.get(projectId);
      return facts && facts.length > 0 ? ({ "1": 1 } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM accepted_progress WHERE project_id = ? LIMIT 1")) {
      const projectId = String(this.bindings[0]);
      for (const [, p] of this.database.progress) {
        if (p.projectId === projectId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM knowledge_items WHERE originating_project_id = ? LIMIT 1")) {
      const projectId = String(this.bindings[0]);
      for (const [, k] of this.database.knowledge) {
        if (k.originatingProjectId === projectId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT id FROM actions WHERE id = ?")) {
      const id = String(this.bindings[0]);
      const a = this.database.actions.get(id);
      return a ? ({ id } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM actions WHERE id = ?")) {
      if (this.database.failAbsenceCheck !== undefined) {
        throw this.database.failAbsenceCheck;
      }
      const id = String(this.bindings[0]);
      return this.database.actions.has(id) ? ({ "1": 1 } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM accepted_progress WHERE action_id = ? LIMIT 1")) {
      const actionId = String(this.bindings[0]);
      for (const [, p] of this.database.progress) {
        if (p.actionId === actionId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT id, supersedes_id FROM accepted_progress WHERE id = ?") || cleanQuery.startsWith("SELECT id FROM accepted_progress WHERE id = ?")) {
      const id = String(this.bindings[0]);
      const p = this.database.progress.get(id);
      if (!p) return null;
      return { id, supersedes_id: p.supersedesId } as unknown as T;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM accepted_progress WHERE id = ?")) {
      if (this.database.failAbsenceCheck !== undefined) {
        throw this.database.failAbsenceCheck;
      }
      const id = String(this.bindings[0]);
      return this.database.progress.has(id) ? ({ "1": 1 } as unknown as T) : null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM accepted_progress WHERE supersedes_id = ? LIMIT 1")) {
      const supersedesId = String(this.bindings[0]);
      for (const [, p] of this.database.progress) {
        if (p.supersedesId === supersedesId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT id, supersedes_id FROM knowledge_items WHERE id = ?")) {
      const id = String(this.bindings[0]);
      const k = this.database.knowledge.get(id);
      if (!k) return null;
      return { id, supersedes_id: k.supersedesId } as unknown as T;
    }

    if (cleanQuery.startsWith("SELECT id FROM knowledge_items WHERE supersedes_id = ?")) {
      const supersedesId = String(this.bindings[0]);
      for (const [id, k] of this.database.knowledge) {
        if (k.supersedesId === supersedesId) return { id } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM knowledge_items WHERE supersedes_id = ? LIMIT 1")) {
      const supersedesId = String(this.bindings[0]);
      for (const [, k] of this.database.knowledge) {
        if (k.supersedesId === supersedesId) return { "1": 1 } as unknown as T;
      }
      return null;
    }

    if (cleanQuery.startsWith("SELECT 1 FROM knowledge_items WHERE id = ?")) {
      if (this.database.failAbsenceCheck !== undefined) {
        throw this.database.failAbsenceCheck;
      }
      const id = String(this.bindings[0]);
      return this.database.knowledge.has(id) ? ({ "1": 1 } as unknown as T) : null;
    }

    return null;
  }

  async all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>> {
    if (this.database.failAll !== undefined) {
      throw this.database.failAll;
    }

    if (this.database.rawExportRows !== undefined) {
      return { results: this.database.rawExportRows as readonly T[] };
    }

    const results: Record<string, unknown>[] = [];

    for (const [id, p] of this.database.projects) {
      results.push({
        kind: "project",
        col1: id,
        col2: p.intendedOutcome,
        col3: p.state,
        col4: null,
        col5: null,
        col6: null,
        col_ord: 0,
      });
    }

    for (const [id, a] of this.database.actions) {
      results.push({
        kind: "action",
        col1: id,
        col2: a.projectId,
        col3: a.description,
        col4: a.state,
        col5: null,
        col6: null,
        col_ord: 0,
      });
    }

    for (const [projectId, facts] of this.database.contextFacts) {
      facts.forEach((fact, ordinal) => {
        results.push({
          kind: "context_fact",
          col1: projectId,
          col2: fact,
          col3: null,
          col4: null,
          col5: null,
          col6: null,
          col_ord: ordinal,
        });
      });
    }

    for (const [id, p] of this.database.progress) {
      results.push({
        kind: "progress",
        col1: id,
        col2: p.projectId,
        col3: p.actionId,
        col4: p.statement,
        col5: p.standing,
        col6: p.supersedesId,
        col_ord: 0,
      });
    }

    for (const [id, k] of this.database.knowledge) {
      results.push({
        kind: "knowledge",
        col1: id,
        col2: k.originatingProjectId,
        col3: k.content,
        col4: k.standing,
        col5: k.supersedesId,
        col6: k.supersessionChain,
        col_ord: 0,
      });
    }

    return { results: results as readonly T[] };
  }
}

export class FakeExportDeletionD1 implements D1DatabaseLike {
  readonly batches: RecordedStatement[][] = [];
  readonly receipts = new Map<string, string>();
  readonly projects = new Map<string, { intendedOutcome: string; state: string }>();
  readonly actions = new Map<string, { projectId: string; description: string; state: string }>();
  readonly contextFacts = new Map<string, string[]>();
  readonly progress = new Map<
    string,
    { projectId: string; actionId: string | null; statement: string; standing: string; supersedesId: string | null }
  >();
  readonly knowledge = new Map<
    string,
    { originatingProjectId: string; content: string; standing: string; supersedesId: string | null; supersessionChain: string }
  >();

  failBatch: unknown;
  failFirst: unknown;
  failAll: unknown;
  failAbsenceCheck: unknown;
  partialResult = false;
  rawExportRows?: readonly unknown[];

  prepare(query: string): D1PreparedStatement {
    return new FakeStatement(this, query);
  }

  async batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]> {
    const recorded = statements as readonly FakeStatement[];
    this.batches.push(recorded.map(({ query, bindings }) => ({ query, bindings })));
    if (this.failBatch !== undefined) {
      throw this.failBatch;
    }

    const nextProjects = new Map(this.projects);
    const nextActions = new Map(this.actions);
    const nextContextFacts = new Map([...this.contextFacts].map(([k, v]) => [k, [...v]]));
    const nextProgress = new Map(this.progress);
    const nextKnowledge = new Map(this.knowledge);
    const nextReceipts = new Map(this.receipts);

    const statementResults: D1RunResult[] = [];
    let lastChanges = 0;

    for (let index = 0; index < recorded.length; index++) {
      const item = recorded[index];
      const cleanQuery = item.query.replace(/\s+/g, " ").trim();
      let changes = 0;

      if (cleanQuery.startsWith("DELETE FROM projects WHERE id = ?")) {
        const id = String(item.bindings[0]);
        if (nextProjects.has(id)) {
          nextProjects.delete(id);
          changes = 1;
        }
      } else if (cleanQuery.startsWith("DELETE FROM actions WHERE id = ?")) {
        const id = String(item.bindings[0]);
        if (nextActions.has(id)) {
          nextActions.delete(id);
          changes = 1;
        }
      } else if (cleanQuery.startsWith("DELETE FROM accepted_context_facts WHERE project_id = ?")) {
        const projectId = String(item.bindings[0]);
        const count = nextContextFacts.get(projectId)?.length ?? 0;
        nextContextFacts.delete(projectId);
        changes = count;
      } else if (cleanQuery.startsWith("DELETE FROM accepted_progress WHERE id = ?")) {
        const id = String(item.bindings[0]);
        if (nextProgress.has(id)) {
          nextProgress.delete(id);
          changes = 1;
        }
      } else if (cleanQuery.startsWith("DELETE FROM knowledge_items WHERE id = ?")) {
        const id = String(item.bindings[0]);
        if (cleanQuery.includes("(SELECT COUNT(*) FROM knowledge_items WHERE id IN")) {
          const expectedCount = Number(item.bindings[item.bindings.length - 1]);
          const memberIds = item.bindings.slice(1, item.bindings.length - 1).map(String);
          const actualCount = memberIds.filter((m) => nextKnowledge.has(m)).length;
          if (actualCount === expectedCount && nextKnowledge.has(id)) {
            nextKnowledge.delete(id);
            changes = 1;
          }
        } else if (cleanQuery.includes("AND changes() = 1")) {
          if (lastChanges === 1 && nextKnowledge.has(id)) {
            nextKnowledge.delete(id);
            changes = 1;
          }
        } else {
          if (nextKnowledge.has(id)) {
            nextKnowledge.delete(id);
            changes = 1;
          }
        }
      } else if (cleanQuery.startsWith("INSERT INTO persistence_operations")) {
        const [opId, fp] = item.bindings as [string, string];
        if (cleanQuery.includes("WHERE changes() = 1")) {
          if (lastChanges === 1) {
            if (nextReceipts.has(opId)) {
              throw new Error("UNIQUE constraint failed: persistence_operations.operation_id");
            }
            nextReceipts.set(opId, fp);
            changes = 1;
          }
        } else if (cleanQuery.includes("WHERE changes() > 0")) {
          if (lastChanges > 0) {
            if (nextReceipts.has(opId)) {
              throw new Error("UNIQUE constraint failed: persistence_operations.operation_id");
            }
            nextReceipts.set(opId, fp);
            changes = 1;
          }
        } else {
          if (nextReceipts.has(opId)) {
            throw new Error("UNIQUE constraint failed: persistence_operations.operation_id");
          }
          nextReceipts.set(opId, fp);
          changes = 1;
        }
      }

      lastChanges = changes;
      const success = !(this.partialResult && index === recorded.length - 1);
      statementResults.push({
        success,
        meta: { changes },
      });
    }

    if (statementResults.some((r) => !r.success)) {
      return statementResults;
    }

    this.projects.clear();
    nextProjects.forEach((v, k) => this.projects.set(k, v));
    this.actions.clear();
    nextActions.forEach((v, k) => this.actions.set(k, v));
    this.contextFacts.clear();
    nextContextFacts.forEach((v, k) => this.contextFacts.set(k, v));
    this.progress.clear();
    nextProgress.forEach((v, k) => this.progress.set(k, v));
    this.knowledge.clear();
    nextKnowledge.forEach((v, k) => this.knowledge.set(k, v));
    this.receipts.clear();
    nextReceipts.forEach((v, k) => this.receipts.set(k, v));

    return statementResults;
  }
}

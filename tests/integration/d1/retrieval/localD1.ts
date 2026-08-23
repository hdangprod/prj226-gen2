import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare } from "miniflare";
import { unstable_splitSqlQuery } from "wrangler";
import type {
  D1DatabaseLike,
  D1PreparedStatement as LocalD1PreparedStatement,
  D1ReadAllResult,
  D1RunResult,
} from "../../../../src/infrastructure/d1/d1Types";

const migrationPath = new URL(
  "../../../../migrations/0001_authoritative_state.sql",
  import.meta.url,
);

export interface RecordedRead {
  readonly query: string;
  readonly bindings: readonly unknown[];
  readonly operation: "first" | "all";
}

class RecordingStatement implements LocalD1PreparedStatement {
  constructor(
    private readonly database: RecordingDatabase,
    private readonly providerStatement: D1PreparedStatement,
    private readonly query: string,
    private readonly bindings: readonly unknown[] = [],
  ) {}

  bind(...values: readonly unknown[]): LocalD1PreparedStatement {
    return new RecordingStatement(
      this.database,
      this.providerStatement.bind(...values),
      this.query,
      values,
    );
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    this.database.reads.push({
      query: this.query,
      bindings: this.bindings,
      operation: "first",
    });
    return await this.providerStatement.first<T>();
  }

  async all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>> {
    this.database.reads.push({
      query: this.query,
      bindings: this.bindings,
      operation: "all",
    });
    return await this.providerStatement.all<T>();
  }
}

class RecordingDatabase implements D1DatabaseLike {
  readonly reads: RecordedRead[] = [];
  batchCalls = 0;

  constructor(private readonly provider: D1Database) {}

  prepare(query: string): LocalD1PreparedStatement {
    return new RecordingStatement(this, this.provider.prepare(query), query);
  }

  async batch(
    statements: readonly LocalD1PreparedStatement[],
  ): Promise<readonly D1RunResult[]> {
    void statements;
    this.batchCalls += 1;
    throw new Error("retrieval integration harness prohibits batch writes");
  }
}

export interface LocalRetrievalD1Harness {
  readonly database: D1DatabaseLike;
  readonly reads: readonly RecordedRead[];
  readonly batchCalls: number;
  readonly run: (
    query: string,
    ...bindings: readonly unknown[]
  ) => Promise<void>;
  readonly read: <Row extends Record<string, unknown>>(
    query: string,
    ...bindings: readonly unknown[]
  ) => Promise<readonly Row[]>;
  readonly dispose: () => Promise<void>;
}

export async function createFreshLocalRetrievalD1(): Promise<LocalRetrievalD1Harness> {
  const statePath = await mkdtemp(join(tmpdir(), "prj226-eng006-repair-d1-"));
  const miniflare = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('ok'); } };",
    compatibilityDate: "2026-08-09",
    d1Databases: { LIAM_DB: "eng006-repair-local" },
    d1Persist: statePath,
  });
  let disposed = false;
  const dispose = async () => {
    if (disposed) return;
    disposed = true;
    try {
      await miniflare.dispose();
    } finally {
      await rm(statePath, { recursive: true, force: true });
    }
  };

  try {
    const provider = await miniflare.getD1Database("LIAM_DB");
    for (const statement of unstable_splitSqlQuery(
      await readFile(migrationPath, "utf8"),
    )) {
      await provider.prepare(statement).run();
    }
    const recording = new RecordingDatabase(provider);
    return {
      database: recording,
      get reads() {
        return recording.reads;
      },
      get batchCalls() {
        return recording.batchCalls;
      },
      run: async (query: string, ...bindings: readonly unknown[]) => {
        await provider.prepare(query).bind(...bindings).run();
      },
      read: async <Row extends Record<string, unknown>>(
        query: string,
        ...bindings: readonly unknown[]
      ) => {
        const result = await provider.prepare(query).bind(...bindings).all<Row>();
        return result.results;
      },
      dispose,
    };
  } catch (error) {
    await dispose();
    throw error;
  }
}

import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare } from "miniflare";
import { unstable_splitSqlQuery } from "wrangler";
import type { D1DatabaseLike } from "../../../../src/infrastructure/d1/d1Types";

const migrationPath = new URL(
  "../../../../migrations/0001_authoritative_state.sql",
  import.meta.url,
);

export interface LocalExportDeletionD1Harness {
  readonly database: D1DatabaseLike;
  readonly run: (query: string, ...bindings: readonly unknown[]) => Promise<void>;
  readonly read: <Row extends Record<string, unknown>>(
    query: string,
    ...bindings: readonly unknown[]
  ) => Promise<readonly Row[]>;
  readonly dispose: () => Promise<void>;
}

export async function createFreshLocalExportDeletionD1(): Promise<LocalExportDeletionD1Harness> {
  const statePath = await mkdtemp(join(tmpdir(), "prj226-eng007-local-d1-"));
  const miniflare = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('ok'); } };",
    compatibilityDate: "2026-08-09",
    d1Databases: { LIAM_DB: "eng007-local" },
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
    const migrationSql = await readFile(migrationPath, "utf8");
    for (const stmt of unstable_splitSqlQuery(migrationSql)) {
      await provider.prepare(stmt).run();
    }

    return {
      database: provider as unknown as D1DatabaseLike,
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

import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare } from "miniflare";
import { unstable_splitSqlQuery } from "wrangler";
import type { D1DatabaseLike } from "../../../../src/infrastructure/d1/d1Types";

const migrationPath = new URL("../../../../migrations/0001_authoritative_state.sql", import.meta.url);

export interface WranglerLocalD1Harness {
  readonly database: D1DatabaseLike;
  readonly read: <Row extends Record<string, unknown>>(query: string, ...bindings: readonly unknown[]) => Promise<Row[]>;
  readonly dispose: () => Promise<void>;
}

/* A fresh Miniflare D1 binding with Wrangler's migration parser is the same
 * genuine local D1 execution surface used by the accepted ENG-003/004 suites. */
export async function createFreshWranglerLocalD1(): Promise<WranglerLocalD1Harness> {
  const statePath = await mkdtemp(join(tmpdir(), "prj226-eng005-d1-"));
  const miniflare = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('ok'); } };",
    compatibilityDate: "2026-08-09",
    d1Databases: { LIAM_DB: "eng005-local" },
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
    const database = await miniflare.getD1Database("LIAM_DB");
    for (const statement of unstable_splitSqlQuery(await readFile(migrationPath, "utf8"))) {
      await database.prepare(statement).run();
    }
    return {
      database: database as unknown as D1DatabaseLike,
      read: async <Row extends Record<string, unknown>>(query: string, ...bindings: readonly unknown[]) => {
        const result = await database.prepare(query).bind(...bindings).all<Row>();
        return result.results;
      },
      dispose,
    };
  } catch (error) {
    await dispose();
    throw error;
  }
}

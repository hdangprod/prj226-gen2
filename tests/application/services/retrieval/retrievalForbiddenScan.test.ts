import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function typeScriptFiles(directory: string): readonly string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) files.push(...typeScriptFiles(path));
    else if (entry.endsWith(".ts")) files.push(path);
  }
  return files;
}

describe("EV-020 retrieval architecture and mutation scan", () => {
  it("uses canonical D1 types and contains no parallel provider contract or forbidden capability", () => {
    const sourceRoot = new URL(
      "../../../../src/application/services/retrieval",
      import.meta.url,
    ).pathname;
    const source = typeScriptFiles(sourceRoot)
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(source).toContain("../../../infrastructure/d1/d1Types");
    for (const pattern of [
      /\bRetrievalDatabaseLike\b/,
      /\bRetrievalPreparedStatement\b/,
      /\bRetrievalD1\b/,
      /\b(?:ORM|vector|embedding|cache|queue|FTS)\b/i,
      /\bLIKE\b/i,
      /\b(?:INSERT|UPDATE|DELETE|UPSERT|CREATE|DROP|ALTER)\b/i,
      /\bBoundedModelContext\b/,
      /\breferenceKnowledge\s*\(/,
      /\bcreateBoundedModelContext\b/,
    ]) {
      expect(source.match(pattern), `forbidden production match: ${pattern}`).toBeNull();
    }
  });

  it("keeps retrievalTypes limited to result and nine-method service contracts", () => {
    const content = readFileSync(
      new URL(
        "../../../../src/application/services/retrieval/retrievalTypes.ts",
        import.meta.url,
      ),
      "utf8",
    );
    const methodNames = content.match(/^\s{2}[a-zA-Z]+\(/gm) ?? [];
    expect(methodNames).toHaveLength(9);
    expect(content).not.toMatch(/(?:Database|PreparedStatement|D1|Query)/);
  });
});

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DirectSqlRetrievalService } from "../../../../src/application/services/retrieval/retrievalService";
import {
  knowledgeItemId,
  projectId,
} from "../../../../src/domain/model";
import {
  createFreshLocalRetrievalD1,
  type LocalRetrievalD1Harness,
} from "./localD1";

const EXPECTED_MIGRATION_SHA256 =
  "adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99";

const EXPECTED_QUERIES = [
  "SELECT id, intended_outcome, state FROM projects WHERE id = ?",
  "SELECT id, intended_outcome, state FROM projects ORDER BY id ASC",
  "SELECT id, intended_outcome, state FROM projects WHERE state = ? ORDER BY id ASC",
  "SELECT id, project_id, description, state FROM actions WHERE project_id = ? ORDER BY id ASC",
  "SELECT fact FROM accepted_context_facts WHERE project_id = ? ORDER BY ordinal ASC",
  "SELECT id, project_id, action_id, statement, standing, supersedes_id FROM accepted_progress WHERE project_id = ? AND standing = 'current' ORDER BY id ASC",
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE originating_project_id = ? AND standing = 'current' ORDER BY id ASC",
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' ORDER BY id ASC",
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE standing = 'current' AND originating_project_id <> ? ORDER BY id ASC",
  "SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items WHERE id = ?",
] as const;

async function seedAuthoritativeState(harness: LocalRetrievalD1Harness): Promise<void> {
  for (const values of [
    ["project-a", "  Project A outcome  ", "Active"],
    ["project-b", "Project B outcome", "Active"],
    ["project-c", "Project C outcome", "Completed"],
  ] as const) {
    await harness.run(
      "INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)",
      ...values,
    );
  }
  for (const values of [
    ["action-a1", "project-a", "A first action", "Open"],
    ["action-a2", "project-a", "A second action", "Completed"],
    ["action-b1", "project-b", "B action", "Open"],
  ] as const) {
    await harness.run(
      "INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)",
      ...values,
    );
  }
  for (const values of [
    ["project-a", 2, "fact third"],
    ["project-a", 0, "fact first"],
    ["project-a", 1, "fact second"],
  ] as const) {
    await harness.run(
      "INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)",
      ...values,
    );
  }
  for (const values of [
    ["p1", "project-a", "action-a1", "progress one", "current", null],
    ["p2", "project-a", "action-a1", "progress two", "current", "p1"],
    ["p3", "project-a", "action-a1", "progress three", "current", "p2"],
  ] as const) {
    await harness.run(
      "INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)",
      ...values,
    );
  }
  for (const values of [
    ["k1", "project-a", "knowledge one", "current", null, "[]"],
    ["k2", "project-a", "knowledge two", "current", "k1", '["k1"]'],
    ["k3", "project-a", "knowledge three", "current", "k2", '["k1","k2"]'],
    ["k-other", "project-b", "independent knowledge", "current", null, "[]"],
  ] as const) {
    await harness.run(
      "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
      ...values,
    );
  }
}

describe("ENG-006 repair migration-backed local D1", () => {
  let harness: LocalRetrievalD1Harness;
  let service: DirectSqlRetrievalService;

  beforeEach(async () => {
    harness = await createFreshLocalRetrievalD1();
    service = new DirectSqlRetrievalService(harness.database);
  });

  afterEach(async () => {
    if (harness !== undefined) await harness.dispose();
  });

  it("binds integration evidence to the exact authoritative migration hash", async () => {
    const content = await readFile(
      new URL(
        "../../../../migrations/0001_authoritative_state.sql",
        import.meta.url,
      ),
      "utf8",
    );
    expect(createHash("sha256").update(content).digest("hex")).toBe(
      EXPECTED_MIGRATION_SHA256,
    );
  });

  it("executes Q1-Q10 with exact bindings, projections, emptiness, ordering, currentness, origin, and JSON semantics", async () => {
    await seedAuthoritativeState(harness);

    expect(await service.getProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: {
        id: "project-a",
        intendedOutcome: "  Project A outcome  ",
        state: "Active",
      },
    });
    expect(await service.getProject(projectId("missing-project"))).toEqual({
      kind: "not-found",
      entityType: "project",
      id: "missing-project",
    });

    const allProjects = await service.listProjects();
    expect(allProjects.kind).toBe("found");
    if (allProjects.kind === "found") expect(allProjects.value).toHaveLength(3);
    expect(await service.listProjects({ state: "Completed" })).toEqual({
      kind: "found",
      value: [
        {
          id: "project-c",
          intendedOutcome: "Project C outcome",
          state: "Completed",
        },
      ],
    });

    expect(await service.getActionsForProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "action-a1",
          projectId: "project-a",
          description: "A first action",
          state: "Open",
        },
        {
          id: "action-a2",
          projectId: "project-a",
          description: "A second action",
          state: "Completed",
        },
      ],
    });
    expect(await service.getActionsForProject(projectId("project-c"))).toEqual({
      kind: "found",
      value: [],
    });

    expect(await service.getAcceptedContextFacts(projectId("project-a"))).toEqual({
      kind: "found",
      value: ["fact first", "fact second", "fact third"],
    });
    expect(await service.getAcceptedContextFacts(projectId("project-b"))).toEqual({
      kind: "found",
      value: [],
    });

    expect(await service.getCurrentProgress(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "p3",
          projectId: "project-a",
          actionId: "action-a1",
          statement: "progress three",
          standing: "current",
          supersedesId: "p2",
        },
      ],
    });

    expect(await service.getCurrentKnowledgeForProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "k3",
          originatingProjectId: "project-a",
          content: "knowledge three",
          standing: "current",
          supersedesId: "k2",
          supersessionChain: ["k1", "k2"],
        },
      ],
    });

    const across = await service.getCurrentKnowledgeAcrossProjects();
    expect(across.kind).toBe("found");
    if (across.kind === "found") {
      expect(across.value.map(({ id }) => id)).toEqual(["k-other", "k3"]);
      expect(across.value.map(({ originatingProjectId }) => originatingProjectId)).toEqual([
        "project-b",
        "project-a",
      ]);
    }
    expect(
      await service.getCurrentKnowledgeAcrossProjects({
        excludeOriginatingProjectId: projectId("project-a"),
      }),
    ).toEqual({
      kind: "found",
      value: [
        {
          id: "k-other",
          originatingProjectId: "project-b",
          content: "independent knowledge",
          standing: "current",
          supersessionChain: [],
        },
      ],
    });

    const item = await service.getKnowledgeItem(knowledgeItemId("k2"));
    expect(item.kind).toBe("found");
    if (item.kind === "found") {
      expect(item.value).toMatchObject({
        id: "k2",
        standing: "superseded",
        originatingProjectId: "project-a",
        supersessionChain: ["k1"],
      });
    }
    expect(await service.getKnowledgeItem(knowledgeItemId("missing-knowledge"))).toEqual({
      kind: "not-found",
      entityType: "knowledge-item",
      id: "missing-knowledge",
    });

    const readsBeforeLineage = harness.reads.length;
    const lineage = await service.getKnowledgeLineage(knowledgeItemId("k3"));
    expect(lineage.kind).toBe("found");
    if (lineage.kind === "found") {
      expect(lineage.value.map(({ id }) => id)).toEqual(["k1", "k2", "k3"]);
    }
    expect(
      harness.reads.slice(readsBeforeLineage).map(({ bindings }) => bindings),
    ).toEqual([["k3"], ["k1"], ["k2"]]);

    const rawKnowledge = await harness.read<{
      readonly id: string;
      readonly supersession_chain: string;
    }>(
      "SELECT id, supersession_chain FROM knowledge_items WHERE id = ?",
      "k3",
    );
    expect(rawKnowledge).toEqual([
      { id: "k3", supersession_chain: '["k1","k2"]' },
    ]);

    expect(new Set(harness.reads.map(({ query }) => query))).toEqual(
      new Set(EXPECTED_QUERIES),
    );
    expect(
      harness.reads.some(
        ({ query, bindings }) =>
          query === EXPECTED_QUERIES[2] && bindings[0] === "Completed",
      ),
    ).toBe(true);
    expect(
      harness.reads.some(
        ({ query, bindings }) =>
          query === EXPECTED_QUERIES[8] && bindings[0] === "project-a",
      ),
    ).toBe(true);
  });

  it("causes no writes, receipts, or table-count changes during all retrieval paths", async () => {
    await seedAuthoritativeState(harness);
    const countsBefore = await tableCounts(harness);

    await service.getProject(projectId("project-a"));
    await service.listProjects();
    await service.listProjects({ state: "Active" });
    await service.getActionsForProject(projectId("project-a"));
    await service.getAcceptedContextFacts(projectId("project-a"));
    await service.getCurrentProgress(projectId("project-a"));
    await service.getCurrentKnowledgeForProject(projectId("project-a"));
    await service.getCurrentKnowledgeAcrossProjects();
    await service.getCurrentKnowledgeAcrossProjects({
      excludeOriginatingProjectId: projectId("project-a"),
    });
    await service.getKnowledgeItem(knowledgeItemId("k3"));
    await service.getKnowledgeLineage(knowledgeItemId("k3"));

    expect(await tableCounts(harness)).toEqual(countsBefore);
    expect(harness.batchCalls).toBe(0);
    expect(harness.reads.every(({ query }) => query.startsWith("SELECT"))).toBe(true);
    expect(await harness.read("SELECT * FROM persistence_operations")).toEqual([]);
  });
});

async function tableCounts(
  harness: LocalRetrievalD1Harness,
): Promise<Readonly<Record<string, number>>> {
  const counts: Record<string, number> = {};
  for (const table of [
    "projects",
    "actions",
    "accepted_context_facts",
    "accepted_progress",
    "knowledge_items",
    "persistence_operations",
  ]) {
    const rows = await harness.read<{ readonly count: number }>(
      `SELECT COUNT(*) AS count FROM ${table}`,
    );
    counts[table] = rows[0]?.count ?? -1;
  }
  return counts;
}

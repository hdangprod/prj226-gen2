import { describe, expect, it } from "vitest";
import { DirectSqlRetrievalService } from "../../../../src/application/services/retrieval/retrievalService";
import {
  knowledgeItemId,
  projectId,
} from "../../../../src/domain/model";
import {
  FakeRetrievalD1,
  type KnowledgeRow,
} from "./fakeRetrievalD1";

const FAILED = {
  kind: "retrieval-failed",
  reason: "database-query-error",
  retryable: false,
} as const;

function seedDatabase(): {
  readonly database: FakeRetrievalD1;
  readonly service: DirectSqlRetrievalService;
} {
  const database = new FakeRetrievalD1();
  database.projects.set("project-a", {
    id: "project-a",
    intended_outcome: "  Preserve stored spacing  ",
    state: "Active",
  });
  database.projects.set("project-b", {
    id: "project-b",
    intended_outcome: "Second outcome",
    state: "Completed",
  });
  database.actions.set("action-a", {
    id: "action-a",
    project_id: "project-a",
    description: "First action",
    state: "Open",
  });
  database.contextFacts.push(
    { project_id: "project-a", ordinal: 2, fact: "third" },
    { project_id: "project-a", ordinal: 0, fact: "first" },
    { project_id: "project-a", ordinal: 1, fact: "second" },
  );
  database.progress.set("progress-old", {
    id: "progress-old",
    project_id: "project-a",
    action_id: "action-a",
    statement: "old progress",
    standing: "superseded",
    supersedes_id: null,
  });
  database.progress.set("progress-current", {
    id: "progress-current",
    project_id: "project-a",
    action_id: "action-a",
    statement: "current progress",
    standing: "current",
    supersedes_id: "progress-old",
  });
  database.knowledge.set("knowledge-old", knowledgeRow({
    id: "knowledge-old",
    content: "old knowledge",
    standing: "superseded",
  }));
  database.knowledge.set("knowledge-current", knowledgeRow({
    id: "knowledge-current",
    content: "current knowledge",
    supersedes_id: "knowledge-old",
    supersession_chain: '["knowledge-old"]',
  }));
  database.knowledge.set("knowledge-other", knowledgeRow({
    id: "knowledge-other",
    originating_project_id: "project-b",
    content: "other project knowledge",
  }));
  return { database, service: new DirectSqlRetrievalService(database) };
}

function knowledgeRow(
  overrides: Partial<KnowledgeRow> & Pick<KnowledgeRow, "id">,
): KnowledgeRow {
  return {
    originating_project_id: "project-a",
    content: "knowledge content",
    standing: "current",
    supersedes_id: null,
    supersession_chain: "[]",
    ...overrides,
  };
}

function validRows() {
  return {
    project: {
      id: "project-a",
      intended_outcome: "outcome",
      state: "Active",
    },
    action: {
      id: "action-a",
      project_id: "project-a",
      description: "description",
      state: "Open",
    },
    fact: { fact: "fact" },
    progress: {
      id: "progress-a",
      project_id: "project-a",
      action_id: null,
      statement: "statement",
      standing: "current",
      supersedes_id: null,
    },
    knowledge: {
      id: "knowledge-a",
      originating_project_id: "project-a",
      content: "content",
      standing: "current",
      supersedes_id: null,
      supersession_chain: "[]",
    },
  } as const;
}

describe("DirectSqlRetrievalService functional contract", () => {
  it("EV-001/002 retrieves an exact project or authoritative not-found", async () => {
    const { service } = seedDatabase();
    expect(await service.getProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: {
        id: "project-a",
        intendedOutcome: "  Preserve stored spacing  ",
        state: "Active",
      },
    });
    expect(await service.getProject(projectId("missing"))).toEqual({
      kind: "not-found",
      entityType: "project",
      id: "missing",
    });
  });

  it("EV-003 lists all projects and filters by exact canonical state", async () => {
    const { service } = seedDatabase();
    const all = await service.listProjects();
    expect(all.kind).toBe("found");
    if (all.kind === "found") expect(all.value).toHaveLength(2);
    expect(await service.listProjects({ state: "Completed" })).toEqual({
      kind: "found",
      value: [
        {
          id: "project-b",
          intendedOutcome: "Second outcome",
          state: "Completed",
        },
      ],
    });
  });

  it("EV-004/005 retrieves project actions and preserves authoritative emptiness", async () => {
    const { service } = seedDatabase();
    expect(await service.getActionsForProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "action-a",
          projectId: "project-a",
          description: "First action",
          state: "Open",
        },
      ],
    });
    expect(await service.getActionsForProject(projectId("project-b"))).toEqual({
      kind: "found",
      value: [],
    });
  });

  it("EV-006 returns context facts in provider SQL ordinal order", async () => {
    const { service } = seedDatabase();
    expect(await service.getAcceptedContextFacts(projectId("project-a"))).toEqual({
      kind: "found",
      value: ["first", "second", "third"],
    });
  });

  it("EV-007/008 returns only current progress with exact nullable mapping", async () => {
    const { service } = seedDatabase();
    expect(await service.getCurrentProgress(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "progress-current",
          projectId: "project-a",
          actionId: "action-a",
          statement: "current progress",
          standing: "current",
          supersedesId: "progress-old",
        },
      ],
    });
  });

  it("EV-009..013 preserves currentness and origin for project and cross-project knowledge", async () => {
    const { service } = seedDatabase();
    expect(await service.getCurrentKnowledgeForProject(projectId("project-a"))).toEqual({
      kind: "found",
      value: [
        {
          id: "knowledge-current",
          originatingProjectId: "project-a",
          content: "current knowledge",
          standing: "current",
          supersedesId: "knowledge-old",
          supersessionChain: ["knowledge-old"],
        },
      ],
    });
    const across = await service.getCurrentKnowledgeAcrossProjects();
    expect(across.kind).toBe("found");
    if (across.kind === "found") {
      expect(across.value.map(({ id }) => id)).toEqual([
        "knowledge-current",
        "knowledge-other",
      ]);
      expect(across.value.map(({ originatingProjectId }) => originatingProjectId)).toEqual([
        "project-a",
        "project-b",
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
          id: "knowledge-other",
          originatingProjectId: "project-b",
          content: "other project knowledge",
          standing: "current",
          supersessionChain: [],
        },
      ],
    });
  });

  it("EV-014..016 retrieves current/superseded knowledge or authoritative absence", async () => {
    const { service } = seedDatabase();
    const current = await service.getKnowledgeItem(
      knowledgeItemId("knowledge-current"),
    );
    expect(current.kind).toBe("found");
    if (current.kind === "found") expect(current.value.standing).toBe("current");
    const old = await service.getKnowledgeItem(knowledgeItemId("knowledge-old"));
    expect(old.kind).toBe("found");
    if (old.kind === "found") expect(old.value.standing).toBe("superseded");
    expect(await service.getKnowledgeItem(knowledgeItemId("missing"))).toEqual({
      kind: "not-found",
      entityType: "knowledge-item",
      id: "missing",
    });
  });

  it("EV-018 normalizes transient and structural failures without exposing provider details", async () => {
    const { database, service } = seedDatabase();
    database.failurePoint = "first";
    database.failure = new Error("credential=secret connection timeout stack details");
    expect(await service.getProject(projectId("project-a"))).toEqual({
      kind: "retrieval-failed",
      reason: "transient-database-error",
      retryable: true,
    });
    database.failure = new Error("SQL text and provider diagnostic");
    expect(await service.getProject(projectId("project-a"))).toEqual(FAILED);
  });

  it("EV-019 executes only the ten authorized SELECT paths and never batches", async () => {
    const { database, service } = seedDatabase();
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
    await service.getKnowledgeItem(knowledgeItemId("knowledge-current"));
    expect(new Set(database.recordedQueries.map(({ query }) => query)).size).toBe(10);
    expect(database.recordedQueries.every(({ query }) => query.startsWith("SELECT"))).toBe(true);
    expect(database.batchCalls).toBe(0);
    expect(database.persistenceOperations.size).toBe(0);
  });
});

describe("R001 collection result truthfulness", () => {
  const malformedResults: readonly [string, unknown][] = [
    ["null", null],
    ["undefined", undefined],
    ["array", []],
    ["empty string", ""],
    ["zero", 0],
    ["false", false],
    ["empty object", {}],
    ["wrong member", { foo: [] }],
    ["null results", { results: null }],
    ["undefined results", { results: undefined }],
    ["object results", { results: {} }],
    ["string results", { results: "rows" }],
  ];

  it.each(malformedResults)("rejects malformed all() response: %s", async (_name, value) => {
    const { database, service } = seedDatabase();
    database.allOverride = { enabled: true, value };
    expect(await service.listProjects()).toEqual(FAILED);
  });

  it("accepts only a successful response containing an array, including authoritative zero rows", async () => {
    const { database, service } = seedDatabase();
    database.allOverride = { enabled: true, value: { results: [] } };
    expect(await service.listProjects()).toEqual({ kind: "found", value: [] });
  });

  it.each(["prepare", "bind", "all"] as const)(
    "normalizes a throw/rejection during %s",
    async (failurePoint) => {
      const { database, service } = seedDatabase();
      database.failurePoint = failurePoint;
      const result =
        failurePoint === "bind"
          ? await service.getActionsForProject(projectId("project-a"))
          : await service.listProjects();
      expect(result).toEqual(FAILED);
    },
  );

  it("applies malformed-response failure semantics to every collection method", async () => {
    const { database, service } = seedDatabase();
    database.allOverride = { enabled: true, value: { results: undefined } };
    const results = await Promise.all([
      service.listProjects(),
      service.listProjects({ state: "Active" }),
      service.getActionsForProject(projectId("project-a")),
      service.getAcceptedContextFacts(projectId("project-a")),
      service.getCurrentProgress(projectId("project-a")),
      service.getCurrentKnowledgeForProject(projectId("project-a")),
      service.getCurrentKnowledgeAcrossProjects(),
      service.getCurrentKnowledgeAcrossProjects({
        excludeOriginatingProjectId: projectId("project-a"),
      }),
    ]);
    expect(results).toEqual(Array.from({ length: 8 }, () => FAILED));
  });
});

describe("R002 atomic whole-collection mapping", () => {
  const rows = validRows();
  const mapperCases = [
    {
      name: "project",
      valid: rows.project,
      malformed: { ...rows.project, intended_outcome: "   " },
      invoke: (service: DirectSqlRetrievalService) => service.listProjects(),
    },
    {
      name: "action",
      valid: rows.action,
      malformed: { ...rows.action, state: "Withdrawn" },
      invoke: (service: DirectSqlRetrievalService) =>
        service.getActionsForProject(projectId("project-a")),
    },
    {
      name: "context fact",
      valid: rows.fact,
      malformed: { fact: "\t" },
      invoke: (service: DirectSqlRetrievalService) =>
        service.getAcceptedContextFacts(projectId("project-a")),
    },
    {
      name: "current progress",
      valid: rows.progress,
      malformed: { ...rows.progress, standing: "superseded" },
      invoke: (service: DirectSqlRetrievalService) =>
        service.getCurrentProgress(projectId("project-a")),
    },
    {
      name: "current knowledge",
      valid: rows.knowledge,
      malformed: { ...rows.knowledge, supersession_chain: '["ok",7]' },
      invoke: (service: DirectSqlRetrievalService) =>
        service.getCurrentKnowledgeAcrossProjects(),
    },
  ] as const;

  const positionCases = mapperCases.flatMap((mapperCase) =>
    [0, 1, 2].map((position) => ({ ...mapperCase, position })),
  );

  it.each(positionCases)(
    "fails the entire $name collection for malformed row at position $position",
    async ({ valid, malformed, invoke, position }) => {
      const { database, service } = seedDatabase();
      const source: unknown[] = [{ ...valid }, { ...valid }, { ...valid }];
      source[position] = malformed;
      database.allOverride = { enabled: true, value: { results: source } };
      expect(await invoke(service)).toEqual(FAILED);
    },
  );

  it("rejects missing and incorrectly typed nullable progress fields", async () => {
    const { database, service } = seedDatabase();
    for (const malformed of [
      { ...rows.progress, action_id: undefined },
      { ...rows.progress, supersedes_id: 7 },
    ]) {
      database.allOverride = { enabled: true, value: { results: [malformed] } };
      expect(await service.getCurrentProgress(projectId("project-a"))).toEqual(FAILED);
    }
  });

  it("rejects non-current standing returned by each current-only knowledge query", async () => {
    const { database, service } = seedDatabase();
    database.allOverride = {
      enabled: true,
      value: { results: [{ ...rows.knowledge, standing: "superseded" }] },
    };
    expect(await service.getCurrentKnowledgeForProject(projectId("project-a"))).toEqual(FAILED);
    expect(await service.getCurrentKnowledgeAcrossProjects()).toEqual(FAILED);
  });
});

describe("singular truthfulness", () => {
  it.each([undefined, {}, { id: "project-a", intended_outcome: "", state: "Active" }])(
    "maps malformed non-null project row to retrieval-failed",
    async (value) => {
      const { database, service } = seedDatabase();
      database.firstOverride = { enabled: true, value };
      expect(await service.getProject(projectId("project-a"))).toEqual(FAILED);
    },
  );

  it.each([
    undefined,
    {},
    {
      id: "knowledge-current",
      originating_project_id: "project-a",
      content: "content",
      standing: "current",
      supersedes_id: undefined,
      supersession_chain: "[]",
    },
  ])("maps malformed non-null knowledge row to retrieval-failed", async (value) => {
    const { database, service } = seedDatabase();
    database.firstOverride = { enabled: true, value };
    expect(await service.getKnowledgeItem(knowledgeItemId("knowledge-current"))).toEqual(FAILED);
  });
});

describe("R003 knowledge lineage integrity", () => {
  it("L1 returns a target with no predecessors exactly once", async () => {
    const { service } = seedDatabase();
    const result = await service.getKnowledgeLineage(knowledgeItemId("knowledge-other"));
    expect(result.kind).toBe("found");
    if (result.kind === "found") {
      expect(result.value.map(({ id }) => id)).toEqual(["knowledge-other"]);
    }
  });

  it("L2 preserves a one-predecessor chronology", async () => {
    const { service } = seedDatabase();
    const result = await service.getKnowledgeLineage(knowledgeItemId("knowledge-current"));
    expect(result.kind).toBe("found");
    if (result.kind === "found") {
      expect(result.value.map(({ id }) => id)).toEqual([
        "knowledge-old",
        "knowledge-current",
      ]);
    }
  });

  it("L3/L10/L11/L12 preserves deliberately non-lexical stored order and appends target once last", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("z-oldest", knowledgeRow({
      id: "z-oldest",
      content: "oldest",
      standing: "superseded",
    }));
    database.knowledge.set("a-middle", knowledgeRow({
      id: "a-middle",
      content: "middle",
      standing: "superseded",
      supersedes_id: "z-oldest",
      supersession_chain: '["z-oldest"]',
    }));
    database.knowledge.set("m-target", knowledgeRow({
      id: "m-target",
      content: "target",
      supersedes_id: "a-middle",
      supersession_chain: '["z-oldest","a-middle"]',
    }));
    const result = await service.getKnowledgeLineage(knowledgeItemId("m-target"));
    expect(result.kind).toBe("found");
    if (result.kind === "found") {
      expect(result.value.map(({ id }) => id)).toEqual([
        "z-oldest",
        "a-middle",
        "m-target",
      ]);
      expect(result.value.filter(({ id }) => id === "m-target")).toHaveLength(1);
      expect(result.value.at(-1)?.id).toBe("m-target");
    }
  });

  it("L4 fails when any predecessor is missing", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("target", knowledgeRow({
      id: "target",
      supersession_chain: '["missing"]',
    }));
    expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
  });

  it("L5 rejects duplicate predecessor IDs", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("target", knowledgeRow({
      id: "target",
      supersession_chain: '["knowledge-old","knowledge-old"]',
    }));
    expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
  });

  it("L6 rejects the target ID in its predecessor chain", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("target", knowledgeRow({
      id: "target",
      supersession_chain: '["target"]',
    }));
    expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
  });

  it("L7 fails atomically for a malformed predecessor row", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("bad-predecessor", knowledgeRow({
      id: "bad-predecessor",
      content: "   ",
      standing: "superseded",
    }));
    database.knowledge.set("target", knowledgeRow({
      id: "target",
      supersession_chain: '["bad-predecessor"]',
    }));
    expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
  });

  it("L8 rejects a predecessor from a different originating project", async () => {
    const { database, service } = seedDatabase();
    database.knowledge.set("target", knowledgeRow({
      id: "target",
      supersession_chain: '["knowledge-other"]',
    }));
    expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
  });

  it.each(["not-json", "{}", '["valid",3]'])(
    "L9 rejects malformed target supersession_chain representation: %s",
    async (supersession_chain) => {
      const { database, service } = seedDatabase();
      database.knowledge.set("target", knowledgeRow({
        id: "target",
        supersession_chain,
      }));
      expect(await service.getKnowledgeLineage(knowledgeItemId("target"))).toEqual(FAILED);
    },
  );

  it("preserves target not-found semantics", async () => {
    const { service } = seedDatabase();
    expect(await service.getKnowledgeLineage(knowledgeItemId("missing"))).toEqual({
      kind: "not-found",
      entityType: "knowledge-item",
      id: "missing",
    });
  });

  it("normalizes provider rejection during predecessor retrieval", async () => {
    const { database, service } = seedDatabase();
    database.failKnowledgeId = "knowledge-old";
    expect(
      await service.getKnowledgeLineage(knowledgeItemId("knowledge-current")),
    ).toEqual(FAILED);
  });
});

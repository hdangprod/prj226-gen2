import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DeletionScope } from "../../../../src/application/contracts/humanControl";
import type { PersistenceOperationId } from "../../../../src/application/ports/persistence";
import type { D1DatabaseLike, D1PreparedStatement } from "../../../../src/infrastructure/d1/d1Types";
import { D1ExportDeletionPersistence } from "../../../../src/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence";
import {
  createFreshLocalExportDeletionD1,
  type LocalExportDeletionD1Harness,
} from "./localD1";

function createInterleavingDatabase(
  baseDb: D1DatabaseLike,
  onBeforeBatch?: () => Promise<void>,
): D1DatabaseLike {
  return {
    prepare: (query: string) => baseDb.prepare(query),
    batch: async (statements: readonly D1PreparedStatement[]) => {
      if (onBeforeBatch) {
        await onBeforeBatch();
      }
      return baseDb.batch(statements);
    },
  };
}

function createPreReadInterleavingDatabase(
  baseDb: D1DatabaseLike,
  onBeforeTargetPreRead?: () => Promise<void>,
): D1DatabaseLike {
  let initialReceiptQueryDone = false;
  let intercepted = false;
  return {
    prepare: (query: string) => {
      const stmt = baseDb.prepare(query);
      const wrapStatement = (inner: D1PreparedStatement): D1PreparedStatement => ({
        bind: (...values: readonly unknown[]) => wrapStatement(inner.bind(...values)),
        all: <T = Record<string, unknown>>() => inner.all<T>(),
        first: async <T = Record<string, unknown>>() => {
          if (query.includes("FROM persistence_operations WHERE operation_id = ?")) {
            initialReceiptQueryDone = true;
          } else if (initialReceiptQueryDone && !intercepted && onBeforeTargetPreRead) {
            intercepted = true;
            await onBeforeTargetPreRead();
          }
          return inner.first<T>();
        },
      });
      return wrapStatement(stmt);
    },
    batch: baseDb.batch.bind(baseDb),
  };
}

describe("D1ExportDeletionPersistence Local D1 Integration Tests", () => {
  let harness: LocalExportDeletionD1Harness;
  let persistence: D1ExportDeletionPersistence;

  beforeEach(async () => {
    harness = await createFreshLocalExportDeletionD1();
    persistence = new D1ExportDeletionPersistence(harness.database);
  });

  afterEach(async () => {
    await harness.dispose();
  });

  describe("readExportData with real D1", () => {
    it("E08: reads empty database into empty arrays", async () => {
      const result = await persistence.readExportData();
      expect(result).toEqual({
        kind: "exported",
        data: {
          projects: [],
          actions: [],
          acceptedContextFacts: [],
          acceptedProgress: [],
          knowledgeItems: [],
        },
      });
    });

    it("E01 / E03-E07 / E11 / E13: reads complete populated state from D1 and excludes receipts", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Outcome 1", "Active");
      await harness.run("INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)", "a-1", "p-1", "Action 1", "Open");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-1", 0, "Fact A");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-1", 1, "Fact B");
      await harness.run(
        "INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)",
        "pr-1",
        "p-1",
        "a-1",
        "Initial progress",
        "current",
        null,
      );
      await harness.run(
        "INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)",
        "pr-2",
        "p-1",
        "a-1",
        "Current progress",
        "current",
        "pr-1",
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-1",
        "p-1",
        "Root knowledge",
        "current",
        null,
        "[]",
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-2",
        "p-1",
        "Current knowledge",
        "current",
        "k-1",
        '["k-1"]',
      );
      await harness.run("INSERT INTO persistence_operations (operation_id, fingerprint) VALUES (?, ?)", "op-receipt-1", "test-fingerprint");

      const result = await persistence.readExportData();
      expect(result.kind).toBe("exported");
      if (result.kind === "exported") {
        expect(result.data.projects).toHaveLength(1);
        expect(result.data.actions).toHaveLength(1);
        expect(result.data.acceptedContextFacts).toHaveLength(2);
        expect(result.data.acceptedProgress).toHaveLength(2);
        expect(result.data.knowledgeItems).toHaveLength(2);
        expect(result.data.knowledgeItems[1]?.supersessionChain).toEqual(["k-1"]);
      }
    });

    it("E02: produces byte-identical deterministic JSON across different insertion orders with varied character IDs", async () => {
      const h1 = await createFreshLocalExportDeletionD1();
      const h2 = await createFreshLocalExportDeletionD1();
      const p1 = new D1ExportDeletionPersistence(h1.database);
      const p2 = new D1ExportDeletionPersistence(h2.database);

      try {
        const testIds = ["p-z", "p-a", "p-A", "p-ä", "p-é", "p-_", "p--"];

        for (const id of testIds) {
          await h1.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", id, `Outcome for ${id}`, "Active");
        }

        for (const id of [...testIds].reverse()) {
          await h2.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", id, `Outcome for ${id}`, "Active");
        }

        const res1 = await p1.readExportData();
        const res2 = await p2.readExportData();

        expect(res1.kind).toBe("exported");
        expect(res2.kind).toBe("exported");
        if (res1.kind === "exported" && res2.kind === "exported") {
          const doc1 = JSON.stringify(res1.data);
          const doc2 = JSON.stringify(res2.data);
          expect(doc1).toBe(doc2);
        }
      } finally {
        await h1.dispose();
        await h2.dispose();
      }
    });
  });

  describe("executeConfirmedDeletion with real D1", () => {
    it("D10 / Scope 1: deletes project with no dependents", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-del-1", "Solo", "Active");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-del-1",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-p-1" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const after = await harness.read("SELECT * FROM projects WHERE id = ?", "p-del-1");
      expect(after).toHaveLength(0);
      const receipts = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-p-1");
      expect(receipts).toHaveLength(1);
    });

    it("D10 / Scope 2: deletes action with no dependents", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run("INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)", "a-del-1", "p-1", "Solo action", "Open");

      const scope: DeletionScope = {
        targetKind: "action",
        targetId: "a-del-1",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-a-1" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const after = await harness.read("SELECT * FROM actions WHERE id = ?", "a-del-1");
      expect(after).toHaveLength(0);
    });

    it("D10 / Scope 3 / D25: deletes accepted context facts for project", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "P1", "Active");
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-2", "P2", "Active");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-1", 0, "Fact 1");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-1", 1, "Fact 2");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-2", 0, "Fact P2");

      const scope: DeletionScope = {
        targetKind: "accepted-project-context",
        targetId: "p-1",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-ctx-1" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const p1Facts = await harness.read("SELECT * FROM accepted_context_facts WHERE project_id = ?", "p-1");
      expect(p1Facts).toHaveLength(0);
      const p2Facts = await harness.read("SELECT * FROM accepted_context_facts WHERE project_id = ?", "p-2");
      expect(p2Facts).toHaveLength(1);
    });

    it("D10 / Scope 4: deletes accepted progress when not superseded", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run(
        "INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)",
        "pr-del-1",
        "p-1",
        null,
        "Progress",
        "current",
        null,
      );

      const scope: DeletionScope = {
        targetKind: "accepted-progress",
        targetId: "pr-del-1",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-pr-1" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const after = await harness.read("SELECT * FROM accepted_progress WHERE id = ?", "pr-del-1");
      expect(after).toHaveLength(0);
    });

    it("D10 / Scope 5 / L02 / D24: deletes isolated knowledge item", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-iso-1",
        "p-1",
        "Isolated",
        "current",
        null,
        "[]",
      );

      const scope: DeletionScope = {
        targetKind: "knowledge-item",
        targetId: "k-iso-1",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-k-iso" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const after = await harness.read("SELECT * FROM knowledge_items WHERE id = ?", "k-iso-1");
      expect(after).toHaveLength(0);
    });

    it("D10 / Scope 6 / L03 / L04: deletes complete multi-node knowledge lineage in FK-safe reverse order", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-node-1",
        "p-1",
        "K1",
        "current",
        null,
        "[]",
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-node-2",
        "p-1",
        "K2",
        "current",
        "k-node-1",
        '["k-node-1"]',
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-node-3",
        "p-1",
        "K3",
        "current",
        "k-node-2",
        '["k-node-1","k-node-2"]',
      );

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-node-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-node-1", "k-node-2", "k-node-3"],
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-k-lineage" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "deleted" });
      const after = await harness.read("SELECT id FROM knowledge_items WHERE id IN ('k-node-1', 'k-node-2', 'k-node-3')");
      expect(after).toHaveLength(0);
      const receipts = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-k-lineage");
      expect(receipts).toHaveLength(1);
    });

    it("D12: rolls back multi-statement knowledge lineage delete if receipt insert fails on real D1", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-rb-1",
        "p-1",
        "K1",
        "current",
        null,
        "[]",
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-rb-2",
        "p-1",
        "K2",
        "current",
        "k-rb-1",
        '["k-rb-1"]',
      );
      await harness.run(
        "INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)",
        "k-rb-3",
        "p-1",
        "K3",
        "current",
        "k-rb-2",
        '["k-rb-1","k-rb-2"]',
      );

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-rb-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-rb-1", "k-rb-2", "k-rb-3"],
      };

      await harness.run(
        "CREATE TRIGGER force_eng007_lineage_receipt_failure " +
        "BEFORE INSERT ON persistence_operations " +
        "WHEN NEW.operation_id = 'op-lineage-rollback' " +
        "BEGIN " +
        "  SELECT RAISE(ABORT, 'forced lineage receipt failure'); " +
        "END;",
      );

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-rollback" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "write-failed", retryable: true });

      const itemsAfter = await harness.read("SELECT id FROM knowledge_items WHERE id IN ('k-rb-1', 'k-rb-2', 'k-rb-3')");
      expect(itemsAfter).toHaveLength(3);

      const receiptAfter = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-lineage-rollback");
      expect(receiptAfter).toHaveLength(0);

      await harness.run("DROP TRIGGER force_eng007_lineage_receipt_failure");
    });

    it("D21: rejects project deletion on real D1 when foreign key / dependencies exist", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-dep", "Parent", "Active");
      await harness.run("INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)", "a-dep", "p-dep", "Child action", "Open");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-dep",
        effect: "remove-retained-user-data",
      };

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-p-dep" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      const pAfter = await harness.read("SELECT * FROM projects WHERE id = ?", "p-dep");
      expect(pAfter).toHaveLength(1);
      const aAfter = await harness.read("SELECT * FROM actions WHERE id = ?", "a-dep");
      expect(aAfter).toHaveLength(1);
    });

    it("R01-R04 / R003: executes full R003 retry truth table on real local D1", async () => {
      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-r003",
        effect: "remove-retained-user-data",
      };

      // R04: New operationId + target absent -> not-found, zero receipt
      const notFoundRes = await persistence.executeConfirmedDeletion({
        operationId: "op-not-found" as PersistenceOperationId,
        scope,
      });
      expect(notFoundRes).toEqual({ kind: "not-found" });
      const receiptsNotFound = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-not-found");
      expect(receiptsNotFound).toHaveLength(0);

      // Setup target and delete successfully
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-r003", "Outcome", "Active");
      const delRes = await persistence.executeConfirmedDeletion({
        operationId: "op-r003" as PersistenceOperationId,
        scope,
      });
      expect(delRes).toEqual({ kind: "deleted" });

      // R01: Exact retry with same opId and matching scope when target is absent -> already-deleted
      const retryRes = await persistence.executeConfirmedDeletion({
        operationId: "op-r003" as PersistenceOperationId,
        scope,
      });
      expect(retryRes).toEqual({ kind: "already-deleted" });

      // R03: Same opId with different scope -> operation-id-conflict
      const conflictRes = await persistence.executeConfirmedDeletion({
        operationId: "op-r003" as PersistenceOperationId,
        scope: { targetKind: "action", targetId: "p-r003", effect: "remove-retained-user-data" },
      });
      expect(conflictRes).toEqual({ kind: "operation-id-conflict" });

      // R02: Durability inconsistency: matching receipt exists for opId, but target is still present in D1
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-r003", "Outcome", "Active");
      const inconsistencyRes = await persistence.executeConfirmedDeletion({
        operationId: "op-r003" as PersistenceOperationId,
        scope,
      });
      expect(inconsistencyRes).toEqual({ kind: "durability-inconsistency" });

      // Target must NOT be deleted / auto-repaired
      const targetStillThere = await harness.read("SELECT * FROM projects WHERE id = ?", "p-r003");
      expect(targetStillThere).toHaveLength(1);
    });
  });

  describe("SR-R003: Concurrency, Interleaving, and Deletion Ownership Races on Real D1", () => {
    it("SR3-01: different-op competitor deletes target before candidate batch -> candidate returns not-found, no receipt", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-race-1", "Target for race", "Active");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-race-1",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-comp-1" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-cand-1" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "not-found" });

      const compReceipt = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-comp-1");
      expect(compReceipt).toHaveLength(1);

      const candReceipt = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-cand-1");
      expect(candReceipt).toHaveLength(0);
    });

    it("SR3-02: same-op same-scope competitor commits deletion before candidate batch -> candidate returns already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-race-2", "Target for race 2", "Active");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-race-2",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-same-race" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-same-race" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
      const receipts = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-same-race");
      expect(receipts).toHaveLength(1);
    });

    it("SR3-PROJECT-PREREAD-RACE: same-op same-project competitor deletes project before candidate target pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-preread-race", "Target", "Active");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-preread-race",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-proj-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-proj-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
    });

    it("SR3-ACTION-PREREAD-RACE: same-op same-action competitor commits before candidate action pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-act-race", "P", "Active");
      await harness.run("INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)", "a-act-race", "p-act-race", "Action", "Open");

      const scope: DeletionScope = {
        targetKind: "action",
        targetId: "a-act-race",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-act-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-act-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
    });

    it("SR3-CONTEXT-PREREAD-RACE: same-op same-context competitor commits before candidate context pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-ctx-race", "P", "Active");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-ctx-race", 0, "Fact 1");

      const scope: DeletionScope = {
        targetKind: "accepted-project-context",
        targetId: "p-ctx-race",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-ctx-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-ctx-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
    });

    it("SR3-PROGRESS-PREREAD-RACE: same-op same-progress competitor commits before candidate progress pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-prog-race", "P", "Active");
      await harness.run("INSERT INTO accepted_progress (id, project_id, action_id, statement, standing, supersedes_id) VALUES (?, ?, ?, ?, ?, ?)", "pr-race", "p-prog-race", null, "Progress", "current", null);

      const scope: DeletionScope = {
        targetKind: "accepted-progress",
        targetId: "pr-race",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-prog-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-prog-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
    });

    it("SR3-KNOWLEDGE-ITEM-PREREAD-RACE: same-op isolated knowledge-item competitor commits before candidate item pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-k-race", "P", "Active");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-item-race", "p-k-race", "Content", "current", null, "[]");

      const scope: DeletionScope = {
        targetKind: "knowledge-item",
        targetId: "k-item-race",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-kitem-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-kitem-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
    });

    it("SR3-KNOWLEDGE-LINEAGE-PREREAD-RACE: same-op same-lineage competitor commits before candidate lineage pre-read -> already-deleted", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-klin-race", "P", "Active");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-lin-1", "p-klin-race", "K1", "current", null, "[]");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-lin-2", "p-klin-race", "K2", "current", "k-lin-1", '["k-lin-1"]');
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-lin-3", "p-klin-race", "K3", "current", "k-lin-2", '["k-lin-1","k-lin-2"]');

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-lin-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-lin-1", "k-lin-2", "k-lin-3"],
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-klin-preread" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-klin-preread" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "already-deleted" });
      const receipts = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-klin-preread");
      expect(receipts).toHaveLength(1);
    });

    it("SR3-DIFF-LINEAGE-MEMBERSHIP-RACE: competitor writes receipt for expanded lineage, candidate with shorter scope observes absence -> operation-id-conflict", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-klin-diff", "P", "Active");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-diff-1", "p-klin-diff", "K1", "current", null, "[]");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-diff-2", "p-klin-diff", "K2", "current", "k-diff-1", '["k-diff-1"]');
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-diff-3", "p-klin-diff", "K3", "current", "k-diff-2", '["k-diff-1","k-diff-2"]');
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-diff-4", "p-klin-diff", "K4", "current", "k-diff-3", '["k-diff-1","k-diff-2","k-diff-3"]');

      const competitorScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-diff-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-diff-1", "k-diff-2", "k-diff-3", "k-diff-4"],
      };

      const candidateScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-diff-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-diff-1", "k-diff-2", "k-diff-3"],
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createPreReadInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-diff-lineage" as PersistenceOperationId,
          scope: competitorScope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-diff-lineage" as PersistenceOperationId,
        scope: candidateScope,
      });

      expect(candidateResult).toEqual({ kind: "operation-id-conflict" });
    });

    it("SR3-03: matching receipt exists but target is still present -> durability-inconsistency", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-race-3", "Target for race 3", "Active");

      const scope: DeletionScope = {
        targetKind: "project",
        targetId: "p-race-3",
        effect: "remove-retained-user-data",
      };

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        const fingerprint = JSON.stringify([
          scope.targetKind,
          scope.targetId,
          scope.effect,
        ]);
        await harness.run("INSERT INTO persistence_operations (operation_id, fingerprint) VALUES (?, ?)", "op-inconsistency-race", fingerprint);
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-inconsistency-race" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "durability-inconsistency" });
      const targetStillThere = await harness.read("SELECT * FROM projects WHERE id = ?", "p-race-3");
      expect(targetStillThere).toHaveLength(1);
    });

    it("SR3-04: same-op different-scope receipt appears before candidate batch -> operation-id-conflict", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-race-4", "Target for race 4", "Active");
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-other-4", "Other project", "Active");
      await harness.run("INSERT INTO actions (id, project_id, description, state) VALUES (?, ?, ?, ?)", "a-race-4", "p-other-4", "Action", "Open");

      const projectScope: DeletionScope = {
        targetKind: "project",
        targetId: "p-race-4",
        effect: "remove-retained-user-data",
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-diff-race" as PersistenceOperationId,
          scope: {
            targetKind: "action",
            targetId: "a-race-4",
            effect: "remove-retained-user-data",
          },
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-diff-race" as PersistenceOperationId,
        scope: projectScope,
      });

      expect(candidateResult).toEqual({ kind: "operation-id-conflict" });
      const targetStillThere = await harness.read("SELECT * FROM projects WHERE id = ?", "p-race-4");
      expect(targetStillThere).toHaveLength(1);
    });

    it("SR3-05: zero-change destructive statement cannot produce receipt or deleted result", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-facts-race", "PFacts", "Active");
      await harness.run("INSERT INTO accepted_context_facts (project_id, ordinal, fact) VALUES (?, ?, ?)", "p-facts-race", 0, "Fact 1");

      const scope: DeletionScope = {
        targetKind: "accepted-project-context",
        targetId: "p-facts-race",
        effect: "remove-retained-user-data",
      };

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        await harness.run("DELETE FROM accepted_context_facts WHERE project_id = ?", "p-facts-race");
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const result = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-facts-zero-change" as PersistenceOperationId,
        scope,
      });

      expect(result).toEqual({ kind: "not-found" });
      const receipt = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-facts-zero-change");
      expect(receipt).toHaveLength(0);
    });

    it("SR3-06: Knowledge Lineage different-op race cannot produce duplicate deleted claim", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-r-1", "p-1", "K1", "current", null, "[]");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-r-2", "p-1", "K2", "current", "k-r-1", '["k-r-1"]');
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-r-3", "p-1", "K3", "current", "k-r-2", '["k-r-1","k-r-2"]');

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-r-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-r-1", "k-r-2", "k-r-3"],
      };

      const competitorPersistence = new D1ExportDeletionPersistence(harness.database);

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        const compRes = await competitorPersistence.executeConfirmedDeletion({
          operationId: "op-comp-lineage" as PersistenceOperationId,
          scope,
        });
        expect(compRes).toEqual({ kind: "deleted" });
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-cand-lineage" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "not-found" });
      const candReceipt = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-cand-lineage");
      expect(candReceipt).toHaveLength(0);
    });

    it("SR3-07: Knowledge Lineage partial race cannot produce partial success or receipt", async () => {
      await harness.run("INSERT INTO projects (id, intended_outcome, state) VALUES (?, ?, ?)", "p-1", "Parent", "Active");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-pr-1", "p-1", "K1", "current", null, "[]");
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-pr-2", "p-1", "K2", "current", "k-pr-1", '["k-pr-1"]');
      await harness.run("INSERT INTO knowledge_items (id, originating_project_id, content, standing, supersedes_id, supersession_chain) VALUES (?, ?, ?, ?, ?, ?)", "k-pr-3", "p-1", "K3", "current", "k-pr-2", '["k-pr-1","k-pr-2"]');

      const scope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "k-pr-1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k-pr-1", "k-pr-2", "k-pr-3"],
      };

      const interleavingDb = createInterleavingDatabase(harness.database, async () => {
        await harness.run("DELETE FROM knowledge_items WHERE id = ?", "k-pr-3");
      });

      const candidatePersistence = new D1ExportDeletionPersistence(interleavingDb);

      const candidateResult = await candidatePersistence.executeConfirmedDeletion({
        operationId: "op-cand-partial" as PersistenceOperationId,
        scope,
      });

      expect(candidateResult).toEqual({ kind: "scope-conflict" });
      const candReceipt = await harness.read("SELECT * FROM persistence_operations WHERE operation_id = ?", "op-cand-partial");
      expect(candReceipt).toHaveLength(0);

      const remaining = await harness.read("SELECT id FROM knowledge_items WHERE id IN ('k-pr-1', 'k-pr-2')");
      expect(remaining).toHaveLength(2);
    });
  });
});

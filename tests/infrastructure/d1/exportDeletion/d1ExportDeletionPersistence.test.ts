import { describe, expect, it } from "vitest";
import type { DeletionScope } from "../../../../src/application/contracts/humanControl";
import type { PersistenceOperationId } from "../../../../src/application/ports/persistence";
import { D1ExportDeletionPersistence } from "../../../../src/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence";
import { FakeExportDeletionD1 } from "./fakeD1";

const projectScope: DeletionScope = {
  targetKind: "project",
  targetId: "p1",
  effect: "remove-retained-user-data",
};

const actionScope: DeletionScope = {
  targetKind: "action",
  targetId: "a1",
  effect: "remove-retained-user-data",
};

const contextScope: DeletionScope = {
  targetKind: "accepted-project-context",
  targetId: "p1",
  effect: "remove-retained-user-data",
};

const progressScope: DeletionScope = {
  targetKind: "accepted-progress",
  targetId: "pr1",
  effect: "remove-retained-user-data",
};

const isolatedKnowledgeScope: DeletionScope = {
  targetKind: "knowledge-item",
  targetId: "k-iso",
  effect: "remove-retained-user-data",
};

const lineageScope: DeletionScope = {
  targetKind: "knowledge-lineage",
  targetId: "k1",
  effect: "remove-retained-user-data",
  lineageMembers: ["k1", "k2", "k3"],
};

describe("D1ExportDeletionPersistence Unit Tests", () => {
  describe("readExportData", () => {
    it("E08: reads empty accepted state into empty arrays", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      const persistence = new D1ExportDeletionPersistence(fakeD1);

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

    it("E01 / E03-E07 / E11: reads complete populated state and excludes receipts", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.projects.set("p1", { intendedOutcome: "Launch", state: "Active" });
      fakeD1.actions.set("a1", { projectId: "p1", description: "Design", state: "Open" });
      fakeD1.contextFacts.set("p1", ["Fact 1", "Fact 2"]);
      fakeD1.progress.set("pr1", {
        projectId: "p1",
        actionId: "a1",
        statement: "Started",
        standing: "superseded",
        supersedesId: null,
      });
      fakeD1.progress.set("pr2", {
        projectId: "p1",
        actionId: "a1",
        statement: "Completed",
        standing: "current",
        supersedesId: "pr1",
      });
      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "Initial knowledge",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "Updated knowledge",
        standing: "current",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.receipts.set("op-prior", '{"fingerprint":"test"}');

      const persistence = new D1ExportDeletionPersistence(fakeD1);
      const result = await persistence.readExportData();

      expect(result.kind).toBe("exported");
      if (result.kind === "exported") {
        expect(result.data.projects).toHaveLength(1);
        expect(result.data.actions).toHaveLength(1);
        expect(result.data.acceptedContextFacts).toHaveLength(2);
        expect(result.data.acceptedProgress).toHaveLength(2);
        expect(result.data.knowledgeItems).toHaveLength(2);
        expect(result.data.knowledgeItems[1]?.supersessionChain).toEqual(["k1"]);
      }
    });

    it("E02: sorts exported data with explicit deterministic comparison across different insertion orders", async () => {
      const fake1 = new FakeExportDeletionD1();
      const fake2 = new FakeExportDeletionD1();

      const idsOrder1 = ["p-z", "p-a", "p-A", "p-ä", "p-é", "p-_", "p--"];
      for (const id of idsOrder1) {
        fake1.projects.set(id, { intendedOutcome: `Outcome for ${id}`, state: "Active" });
      }

      for (const id of [...idsOrder1].reverse()) {
        fake2.projects.set(id, { intendedOutcome: `Outcome for ${id}`, state: "Active" });
      }

      const p1 = new D1ExportDeletionPersistence(fake1);
      const p2 = new D1ExportDeletionPersistence(fake2);

      const res1 = await p1.readExportData();
      const res2 = await p2.readExportData();

      expect(res1.kind).toBe("exported");
      expect(res2.kind).toBe("exported");
      if (res1.kind === "exported" && res2.kind === "exported") {
        expect(res1.data.projects.map((p) => p.id)).toEqual(res2.data.projects.map((p) => p.id));
      }
    });

    it("E09: returns read-failed when database read throws", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.failAll = new Error("D1 read error");
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.readExportData();
      expect(result).toEqual({ kind: "read-failed", retryable: true });
    });

    it("E10: returns non-retryable malformed-state on corrupted stored rows", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.rawExportRows = [
        {
          kind: "knowledge",
          col1: "k1",
          col2: "p1",
          col3: "Content",
          col4: "invalid-standing",
          col5: null,
          col6: "[]",
          col_ord: 0,
        },
      ];
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.readExportData();
      expect(result).toEqual({ kind: "malformed-state", retryable: false });
    });
  });

  describe("executeConfirmedDeletion", () => {
    it("conditional receipt statement changes() = 0 when target statement did not delete", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      const deleteStmt = fakeD1.prepare("DELETE FROM projects WHERE id = ?").bind("missing");
      const receiptStmt = fakeD1
        .prepare("INSERT INTO persistence_operations (operation_id, fingerprint) SELECT ?, ? WHERE changes() = 1")
        .bind("op-zero", "fp");

      const batchResult = await fakeD1.batch([
        deleteStmt,
        receiptStmt,
      ]);

      expect(batchResult).toHaveLength(2);
      expect(batchResult[0]?.meta?.changes).toBe(0);
      expect(batchResult[1]?.meta?.changes).toBe(0);
      expect(fakeD1.receipts.has("op-zero")).toBe(false);
    });

    it("D10 / Scope 1: deletes project with no dependents", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.projects.set("p1", { intendedOutcome: "Solo", state: "Active" });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-p1" as PersistenceOperationId,
        scope: projectScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.projects.has("p1")).toBe(false);
      expect(fakeD1.receipts.has("op-p1")).toBe(true);
    });

    it("D21: rejects project deletion with scope-conflict when dependents exist (actions, facts, progress, knowledge)", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.projects.set("p1", { intendedOutcome: "Parent", state: "Active" });
      fakeD1.actions.set("a1", { projectId: "p1", description: "Child", state: "Open" });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: projectScope,
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      expect(fakeD1.projects.has("p1")).toBe(true);
    });

    it("D10 / Scope 2: deletes action with no dependents", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.actions.set("a1", { projectId: "p1", description: "Action", state: "Open" });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: actionScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.actions.has("a1")).toBe(false);
    });

    it("D22: rejects action deletion with scope-conflict when referenced by progress", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.actions.set("a1", { projectId: "p1", description: "Action", state: "Open" });
      fakeD1.progress.set("pr1", {
        projectId: "p1",
        actionId: "a1",
        statement: "Progress",
        standing: "current",
        supersedesId: null,
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: actionScope,
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      expect(fakeD1.actions.has("a1")).toBe(true);
    });

    it("D10 / Scope 3 / D25: deletes accepted context facts for project", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.contextFacts.set("p1", ["Fact 1", "Fact 2"]);
      fakeD1.contextFacts.set("p2", ["P2 Fact"]);
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: contextScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.contextFacts.has("p1")).toBe(false);
      expect(fakeD1.contextFacts.has("p2")).toBe(true);
    });

    it("D10 / Scope 4: deletes accepted progress when not superseded", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.progress.set("pr1", {
        projectId: "p1",
        actionId: null,
        statement: "Progress",
        standing: "current",
        supersedesId: null,
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: progressScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.progress.has("pr1")).toBe(false);
    });

    it("D23: rejects progress deletion with scope-conflict when superseded by successor", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.progress.set("pr1", {
        projectId: "p1",
        actionId: null,
        statement: "Old progress",
        standing: "superseded",
        supersedesId: null,
      });
      fakeD1.progress.set("pr2", {
        projectId: "p1",
        actionId: null,
        statement: "New progress",
        standing: "current",
        supersedesId: "pr1",
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: progressScope,
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      expect(fakeD1.progress.has("pr1")).toBe(true);
      expect(fakeD1.progress.has("pr2")).toBe(true);
    });

    it("D10 / Scope 5 / L02 / D24: deletes isolated knowledge item", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k-iso", {
        originatingProjectId: "p1",
        content: "Isolated",
        standing: "current",
        supersedesId: null,
        supersessionChain: "[]",
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-1" as PersistenceOperationId,
        scope: isolatedKnowledgeScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.knowledge.has("k-iso")).toBe(false);
    });

    it("L01: rejects knowledge-item deletion when participating in a lineage (supersedes or superseded)", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "current",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const res1 = await persistence.executeConfirmedDeletion({
        operationId: "op-k1" as PersistenceOperationId,
        scope: { targetKind: "knowledge-item", targetId: "k1", effect: "remove-retained-user-data" },
      });
      expect(res1).toEqual({ kind: "scope-conflict" });

      const res2 = await persistence.executeConfirmedDeletion({
        operationId: "op-k2" as PersistenceOperationId,
        scope: { targetKind: "knowledge-item", targetId: "k2", effect: "remove-retained-user-data" },
      });
      expect(res2).toEqual({ kind: "scope-conflict" });
    });

    it("D10 / Scope 6 / L03 / L04: deletes complete multi-node knowledge lineage atomically", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "superseded",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.knowledge.set("k3", {
        originatingProjectId: "p1",
        content: "K3",
        standing: "current",
        supersedesId: "k2",
        supersessionChain: '["k1","k2"]',
      });
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage" as PersistenceOperationId,
        scope: lineageScope,
      });

      expect(result).toEqual({ kind: "deleted" });
      expect(fakeD1.knowledge.has("k1")).toBe(false);
      expect(fakeD1.knowledge.has("k2")).toBe(false);
      expect(fakeD1.knowledge.has("k3")).toBe(false);
      expect(fakeD1.receipts.has("op-lineage")).toBe(true);
    });

    it("L08: knowledge lineage exact retry with same opId and matching scope returns already-deleted", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "superseded",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.knowledge.set("k3", {
        originatingProjectId: "p1",
        content: "K3",
        standing: "current",
        supersedesId: "k2",
        supersessionChain: '["k1","k2"]',
      });

      const delResult = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-retry" as PersistenceOperationId,
        scope: lineageScope,
      });
      expect(delResult).toEqual({ kind: "deleted" });

      const retryResult = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-retry" as PersistenceOperationId,
        scope: lineageScope,
      });
      expect(retryResult).toEqual({ kind: "already-deleted" });
    });

    it("L09: knowledge lineage opId reused with different members or root returns operation-id-conflict", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "superseded",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.knowledge.set("k3", {
        originatingProjectId: "p1",
        content: "K3",
        standing: "current",
        supersedesId: "k2",
        supersessionChain: '["k1","k2"]',
      });

      await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-l09" as PersistenceOperationId,
        scope: lineageScope,
      });

      const conflictRes1 = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-l09" as PersistenceOperationId,
        scope: {
          targetKind: "knowledge-lineage",
          targetId: "k1",
          effect: "remove-retained-user-data",
          lineageMembers: ["k1", "k2", "k3", "k4"],
        },
      });
      expect(conflictRes1).toEqual({ kind: "operation-id-conflict" });

      const conflictRes2 = await persistence.executeConfirmedDeletion({
        operationId: "op-lineage-l09" as PersistenceOperationId,
        scope: {
          targetKind: "knowledge-lineage",
          targetId: "k-other",
          effect: "remove-retained-user-data",
          lineageMembers: ["k-other"],
        },
      });
      expect(conflictRes2).toEqual({ kind: "operation-id-conflict" });
    });

    it("L10: knowledge lineage deletion with external dependency returns scope-conflict", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "superseded",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.knowledge.set("k-ext", {
        originatingProjectId: "p1",
        content: "K-Ext",
        standing: "current",
        supersedesId: "k2",
        supersessionChain: '["k1","k2"]',
      });

      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-l10" as PersistenceOperationId,
        scope: {
          targetKind: "knowledge-lineage",
          targetId: "k1",
          effect: "remove-retained-user-data",
          lineageMembers: ["k1", "k2"],
        },
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      expect(fakeD1.knowledge.has("k1")).toBe(true);
      expect(fakeD1.knowledge.has("k2")).toBe(true);
      expect(fakeD1.knowledge.has("k-ext")).toBe(true);
      expect(fakeD1.receipts.has("op-l10")).toBe(false);
    });

    it("D11: pre-batch failure returns retryable write-failed with zero mutations and zero receipts", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.projects.set("p1", { intendedOutcome: "Outcome", state: "Active" });
      fakeD1.failFirst = new Error("Connection reset during precheck");
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-prebatch-fail" as PersistenceOperationId,
        scope: projectScope,
      });

      expect(result).toEqual({ kind: "write-failed", retryable: true });
      expect(fakeD1.projects.has("p1")).toBe(true);
      expect(fakeD1.receipts.has("op-prebatch-fail")).toBe(false);
    });

    it("D26: post-delete verification failure returns indeterminate, and retry resolves from receipt", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k-iso", {
        originatingProjectId: "p1",
        content: "Isolated",
        standing: "current",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.failAbsenceCheck = new Error("Transient read failure during post-delete verification");
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-d26" as PersistenceOperationId,
        scope: isolatedKnowledgeScope,
      });

      expect(result).toEqual({
        kind: "indeterminate",
        reason: "post-delete-verification-failed",
        retryable: true,
      });

      expect(fakeD1.knowledge.has("k-iso")).toBe(false);
      expect(fakeD1.receipts.has("op-d26")).toBe(true);

      fakeD1.failAbsenceCheck = undefined;
      const retryResult = await persistence.executeConfirmedDeletion({
        operationId: "op-d26" as PersistenceOperationId,
        scope: isolatedKnowledgeScope,
      });

      expect(retryResult).toEqual({ kind: "already-deleted" });
    });

    it("HC-BIND-03 / L05 / L06: anti-expansion returns scope-conflict if D1 lineage changed after confirmation", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      fakeD1.knowledge.set("k1", {
        originatingProjectId: "p1",
        content: "K1",
        standing: "superseded",
        supersedesId: null,
        supersessionChain: "[]",
      });
      fakeD1.knowledge.set("k2", {
        originatingProjectId: "p1",
        content: "K2",
        standing: "superseded",
        supersedesId: "k1",
        supersessionChain: '["k1"]',
      });
      fakeD1.knowledge.set("k3", {
        originatingProjectId: "p1",
        content: "K3",
        standing: "superseded",
        supersedesId: "k2",
        supersessionChain: '["k1","k2"]',
      });
      fakeD1.knowledge.set("k4", {
        originatingProjectId: "p1",
        content: "K4",
        standing: "current",
        supersedesId: "k3",
        supersessionChain: '["k1","k2","k3"]',
      });

      const persistence = new D1ExportDeletionPersistence(fakeD1);

      const result = await persistence.executeConfirmedDeletion({
        operationId: "op-stale-lineage" as PersistenceOperationId,
        scope: lineageScope,
      });

      expect(result).toEqual({ kind: "scope-conflict" });
      expect(fakeD1.knowledge.has("k1")).toBe(true);
      expect(fakeD1.knowledge.has("k2")).toBe(true);
      expect(fakeD1.knowledge.has("k3")).toBe(true);
      expect(fakeD1.knowledge.has("k4")).toBe(true);
      expect(fakeD1.receipts.has("op-stale-lineage")).toBe(false);
    });

    it("R01-R04 / R003: handles R003 retry matrix: already-deleted, durability-inconsistency, op-id-conflict, not-found", async () => {
      const fakeD1 = new FakeExportDeletionD1();
      const persistence = new D1ExportDeletionPersistence(fakeD1);

      // R04: Target absent under new opId -> not-found, zero receipt
      const notFoundResult = await persistence.executeConfirmedDeletion({
        operationId: "op-not-found" as PersistenceOperationId,
        scope: projectScope,
      });
      expect(notFoundResult).toEqual({ kind: "not-found" });
      expect(fakeD1.receipts.has("op-not-found")).toBe(false);

      // Perform successful deletion of p1
      fakeD1.projects.set("p1", { intendedOutcome: "Outcome", state: "Active" });
      const delResult = await persistence.executeConfirmedDeletion({
        operationId: "op-p1" as PersistenceOperationId,
        scope: projectScope,
      });
      expect(delResult).toEqual({ kind: "deleted" });

      // R01: Exact retry with same opId and matching scope when target is absent -> already-deleted
      const retryResult = await persistence.executeConfirmedDeletion({
        operationId: "op-p1" as PersistenceOperationId,
        scope: projectScope,
      });
      expect(retryResult).toEqual({ kind: "already-deleted" });

      // R03: Same opId with different scope -> operation-id-conflict
      const diffScopeResult = await persistence.executeConfirmedDeletion({
        operationId: "op-p1" as PersistenceOperationId,
        scope: actionScope,
      });
      expect(diffScopeResult).toEqual({ kind: "operation-id-conflict" });

      // R02: Durability inconsistency: receipt exists for opId and scope, but target is still present
      fakeD1.projects.set("p1", { intendedOutcome: "Outcome", state: "Active" });
      const inconsistencyResult = await persistence.executeConfirmedDeletion({
        operationId: "op-p1" as PersistenceOperationId,
        scope: projectScope,
      });
      expect(inconsistencyResult).toEqual({ kind: "durability-inconsistency" });
    });
  });
});

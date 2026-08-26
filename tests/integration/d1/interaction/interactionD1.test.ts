import { createHash } from "node:crypto";
import { readFile, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Miniflare } from "miniflare";
import { unstable_splitSqlQuery } from "wrangler";
import { describe, expect, it } from "vitest";
import {
  nonEmptyText,
  type ActionId,
  type KnowledgeItemId,
  type ProgressId,
  type ProjectId,
} from "../../../../src/domain/model";
import { createHumanControlRuntime } from "../../../../src/application/contracts/humanControl";
import { D1AcceptedStatePersistence } from "../../../../src/infrastructure/d1/d1AcceptedStatePersistence";
import { DirectSqlRetrievalService } from "../../../../src/application/services/retrieval/retrievalService";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import { D1ExportDeletionPersistence } from "../../../../src/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence";
import { ExportDeletionServiceImpl } from "../../../../src/application/services/exportDeletion/exportDeletionService";
import { DeterministicModelCapability } from "../../../../src/testing/model/deterministicModelCapability";
import { createInteractionOrchestrator } from "../../../../src/application/services/interaction/interactionOrchestrator";
import type { PersistenceOperationId } from "../../../../src/application/ports/persistence";
import type { D1DatabaseLike } from "../../../../src/infrastructure/d1/d1Types";

const EXPECTED_MIGRATION_SHA256 =
  "adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99";

const migrationPath = new URL(
  "../../../../migrations/0001_authoritative_state.sql",
  import.meta.url,
);

async function setupRealD1Database() {
  const statePath = await mkdtemp(join(tmpdir(), "prj226-eng010-r5-d1-"));
  const mf = new Miniflare({
    modules: true,
    script: "export default { fetch() { return new Response('OK'); } }",
    compatibilityDate: "2026-08-09",
    d1Databases: { DB: "eng010-r5-d1" },
    d1Persist: statePath,
  });

  let disposed = false;
  const dispose = async () => {
    if (disposed) return;
    disposed = true;
    try {
      await mf.dispose();
    } finally {
      await rm(statePath, { recursive: true, force: true });
    }
  };

  try {
    const rawDb = await mf.getD1Database("DB");
    const sql = await readFile(migrationPath, "utf8");
    for (const statement of unstable_splitSqlQuery(sql)) {
      await rawDb.prepare(statement).run();
    }

    const d1 = rawDb as unknown as D1DatabaseLike;
    const humanControlRuntime = createHumanControlRuntime();
    const persistence = new D1AcceptedStatePersistence(d1);
    const retrievalService = new DirectSqlRetrievalService(d1);
    const projectActionContextService = new ProjectActionContextService({
      mutationGate: humanControlRuntime.mutationGate,
      persistence,
    });
    const knowledgeProvenanceService = new KnowledgeProvenanceService({
      mutationGate: humanControlRuntime.mutationGate,
      persistence,
    });
    const exportDeletionPersistence = new D1ExportDeletionPersistence(d1);
    const exportDeletionService = new ExportDeletionServiceImpl(
      exportDeletionPersistence,
      humanControlRuntime.mutationGate,
    );
    const modelCapabilityPort = new DeterministicModelCapability([
      { kind: "advisory", content: nonEmptyText("Real D1 advisory answer")! },
    ]);

    const orchestrator = createInteractionOrchestrator({
      retrievalService,
      humanControlRuntime,
      modelCapabilityPort,
      projectActionContextService,
      knowledgeProvenanceService,
      exportDeletionService,
    });

    return {
      dispose,
      d1,
      orchestrator,
      humanControlRuntime,
      retrievalService,
      persistence,
    };
  } catch (error) {
    await dispose();
    throw error;
  }
}

describe("interactionD1 Integration (ENG-010 Repair 5)", () => {
  it("verifies migration file hash matches immutable baseline", async () => {
    const sql = await readFile(migrationPath, "utf8");
    const hash = createHash("sha256").update(sql).digest("hex");
    expect(hash).toBe(EXPECTED_MIGRATION_SHA256);
  });

  it("executes end-to-end orchestration against genuine local D1 database", async () => {
    const { dispose, orchestrator, humanControlRuntime, retrievalService } =
      await setupRealD1Database();

    try {
      // 1. Establish project
      const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project d1-test",
      });
      const establishResult = await orchestrator.establishProject({
        evidence: ev1,
        operationId: "op-d1-1" as PersistenceOperationId,
        id: "proj-d1" as ProjectId,
        intendedOutcome: nonEmptyText("Real D1 integration test project")!,
      });
      expect(establishResult.kind).toBe("accepted");

      // 2. Create action
      const ev2 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Create action in d1-test",
      });
      const actionResult = await orchestrator.createAction({
        evidence: ev2,
        operationId: "op-d1-2" as PersistenceOperationId,
        id: "act-d1-1" as ActionId,
        projectId: "proj-d1" as ProjectId,
        description: nonEmptyText("Initial setup action in D1")!,
      });
      expect(actionResult.kind).toBe("accepted");

      // 3. Accept context facts
      const ev3 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Accept facts in d1-test",
      });
      const factsResult = await orchestrator.acceptContextFacts({
        evidence: ev3,
        operationId: "op-d1-3" as PersistenceOperationId,
        projectId: "proj-d1" as ProjectId,
        facts: [nonEmptyText("Fact 1 persisted in real D1")!],
      });
      expect(factsResult.kind).toBe("accepted");

      // 4. Accept progress
      const ev4 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Accept progress in d1-test",
      });
      const progResult = await orchestrator.acceptProgress({
        evidence: ev4,
        operationId: "op-d1-4" as PersistenceOperationId,
        id: "prog-d1-1" as ProgressId,
        projectId: "proj-d1" as ProjectId,
        statement: nonEmptyText("First progress milestone reached")!,
        actionId: "act-d1-1" as ActionId,
      });
      expect(progResult.kind).toBe("accepted");

      // 5. Correct progress (Action-linked correction on real D1!)
      const ev5 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Correct progress in d1-test",
      });
      const correctProgResult = await orchestrator.correctProgress({
        evidence: ev5,
        operationId: "op-d1-5" as PersistenceOperationId,
        projectId: "proj-d1" as ProjectId,
        priorId: "prog-d1-1" as ProgressId,
        successorId: "prog-d1-2" as ProgressId,
        statement: nonEmptyText("First progress milestone refined")!,
      });
      expect(correctProgResult.kind).toBe("accepted");

      // 6. Capture knowledge
      const ev6 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Capture knowledge in d1-test",
      });
      const knowledgeResult = await orchestrator.captureKnowledge({
        evidence: ev6,
        operationId: "op-d1-6" as PersistenceOperationId,
        id: "k-d1-1" as KnowledgeItemId,
        originatingProjectId: "proj-d1" as ProjectId,
        content: nonEmptyText("D1 handles relational tables efficiently")!,
      });
      expect(knowledgeResult.kind).toBe("accepted");

      // 7. Verify via retrieval
      const projectRetrieved = await retrievalService.getProject("proj-d1" as ProjectId);
      expect(projectRetrieved.kind).toBe("found");
      if (projectRetrieved.kind === "found") {
        expect(projectRetrieved.value.id).toBe("proj-d1");
      }

      // 8. Advisory with context selection against real D1
      const adviceResult = await orchestrator.handleAdvisory({
        text: "Tell me about D1 relational tables efficiency",
        projectId: "proj-d1" as ProjectId,
      });
      expect(adviceResult.kind).toBe("advisory");

      // 9. Export
      const exportResult = await orchestrator.exportAcceptedState();
      expect(exportResult.kind).toBe("accepted");
      if (exportResult.kind === "accepted" && exportResult.value.kind === "exported") {
        const parsed = JSON.parse(exportResult.value.document);
        expect(parsed.projects.length).toBeGreaterThan(0);
        expect(parsed.actions.length).toBeGreaterThan(0);
        expect(parsed.knowledgeItems.length).toBeGreaterThan(0);
      }
    } finally {
      await dispose();
    }
  });

  it("TC-27: persistence failure truthfulness - D1 error reports failure truthfully even if model succeeded", async () => {
    const { dispose, orchestrator, humanControlRuntime } = await setupRealD1Database();

    try {
      const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project with invalid duplicate op",
      });

      // Commit once
      const res1 = await orchestrator.establishProject({
        evidence: ev,
        operationId: "op-dup-1" as PersistenceOperationId,
        id: "proj-dup-1" as ProjectId,
        intendedOutcome: nonEmptyText("Outcome 1")!,
      });
      expect(res1.kind).toBe("accepted");

      // Attempt second commit with SAME op-id but DIFFERENT payload -> D1 rejects with operation-id-conflict
      const ev2 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project with conflicting op",
      });
      const res2 = await orchestrator.establishProject({
        evidence: ev2,
        operationId: "op-dup-1" as PersistenceOperationId,
        id: "proj-dup-2" as ProjectId,
        intendedOutcome: nonEmptyText("Outcome 2")!,
      });

      expect(res2.kind).toBe("failed");
      if (res2.kind === "failed") {
        expect(res2.reason).toBe("operation-id-conflict");
      }
    } finally {
      await dispose();
    }
  });

  it("TC-14: R005 parent existence constraint against real D1 empty tables", async () => {
    const { dispose, orchestrator } = await setupRealD1Database();

    try {
      const result = await orchestrator.handleAdvisory({
        text: "Tell me about non-existent project",
        projectId: "proj-nonexistent-in-d1" as ProjectId,
      });

      expect(result.kind).toBe("clarification-required");
      if (result.kind === "clarification-required") {
        expect(result.reason).toBe("ambiguous-target");
      }
    } finally {
      await dispose();
    }
  });

  it("prohibits credential-shaped inputs from persisting to real D1 database", async () => {
    const { dispose, orchestrator, humanControlRuntime, d1 } = await setupRealD1Database();

    try {
      const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Attempt prohibited persistence in D1",
      });

      const res = await orchestrator.establishProject({
        evidence: ev,
        operationId: "op-d1-prohibited" as PersistenceOperationId,
        id: "proj-prohibited" as ProjectId,
        intendedOutcome: nonEmptyText("Project with passwd=hunter2")!,
      });

      expect(res.kind).toBe("prohibited");

      // Verify directly from D1 that no row was written
      const countResult = await d1.prepare("SELECT COUNT(*) as count FROM projects WHERE id = 'proj-prohibited'").first();
      expect((countResult as { count: number }).count).toBe(0);
    } finally {
      await dispose();
    }
  });
});

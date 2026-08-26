import { describe, expect, it } from "vitest";
import {
  nonEmptyText,
  type Project,
  type ProjectId,
} from "../../../../src/domain/model";
import { createHumanControlRuntime } from "../../../../src/application/contracts/humanControl";
import type {
  PersistenceOperationId,
  AcceptedStatePersistence,
} from "../../../../src/application/ports/persistence";
import { DeterministicModelCapability } from "../../../../src/testing/model/deterministicModelCapability";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import type {
  ExportPersistenceResult,
  DeletionPersistenceResult,
  ExportDeletionPersistence,
} from "../../../../src/application/services/exportDeletion/exportDeletionTypes";
import { ExportDeletionServiceImpl } from "../../../../src/application/services/exportDeletion/exportDeletionService";
import type {
  RetrievalResult,
  RetrievalService,
} from "../../../../src/application/services/retrieval/retrievalTypes";
import { createInteractionOrchestrator } from "../../../../src/application/services/interaction/interactionOrchestrator";
import type { InteractionOrchestratorDependencies } from "../../../../src/application/services/interaction/interactionTypes";

function createHarness() {
  const humanControlRuntime = createHumanControlRuntime();
  const committedWrites: unknown[] = [];

  const persistence: AcceptedStatePersistence = {
    commitAcceptedState: async (batch) => {
      committedWrites.push(batch);
      return { kind: "committed" };
    },
  };

  const projectActionContextService = new ProjectActionContextService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });
  const knowledgeProvenanceService = new KnowledgeProvenanceService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });

  const exportDeletionPersistence: ExportDeletionPersistence = {
    readExportData: async (): Promise<ExportPersistenceResult> => ({
      kind: "exported",
      data: { projects: [], actions: [], acceptedContextFacts: [], acceptedProgress: [], knowledgeItems: [] },
    }),
    executeConfirmedDeletion: async (): Promise<DeletionPersistenceResult> => ({
      kind: "deleted",
    }),
  };

  const exportDeletionService = new ExportDeletionServiceImpl(
    exportDeletionPersistence,
    humanControlRuntime.mutationGate,
  );

  const retrievalService: RetrievalService = {
    getProject: async (id: ProjectId): Promise<RetrievalResult<Project>> => {
      if (id === "proj-exists") {
        return {
          kind: "found",
          value: { id, intendedOutcome: nonEmptyText("Existing project")!, state: "Active" },
        };
      }
      return { kind: "not-found", entityType: "project", id };
    },
    listProjects: async () => ({ kind: "found", value: [] }),
    getActionsForProject: async () => ({ kind: "found", value: [] }),
    getAcceptedContextFacts: async () => ({ kind: "found", value: [] }),
    getCurrentProgress: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeForProject: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: [] }),
    getKnowledgeItem: async (id) => ({ kind: "not-found", entityType: "knowledge-item", id }),
    getKnowledgeLineage: async () => ({ kind: "found", value: [] }),
  };

  const dependencies: InteractionOrchestratorDependencies = {
    retrievalService,
    humanControlRuntime,
    modelCapabilityPort: new DeterministicModelCapability([{ kind: "advisory", content: nonEmptyText("Advice")! }]),
    projectActionContextService,
    knowledgeProvenanceService,
    exportDeletionService,
  };

  const orchestrator = createInteractionOrchestrator(dependencies);

  return { orchestrator, humanControlRuntime, committedWrites };
}

describe("interactionClarification (ENG-010 Repair 5)", () => {
  it("TC-04: mutation requiring clarification when effect is ambiguous returns clarification-required", async () => {
    const { orchestrator, humanControlRuntime, committedWrites } = createHarness();
    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Ambiguous effect mutation",
    });

    const result = await orchestrator.establishProject({
      evidence,
      operationId: "op-clarify" as PersistenceOperationId,
      id: "proj-clarify" as ProjectId,
      intendedOutcome: nonEmptyText("Establish project")!,
      options: { target: "clear", effect: "ambiguous" },
    });

    expect(result.kind).toBe("clarification-required");
    if (result.kind === "clarification-required") {
      expect(result.reason).toBe("ambiguous-effect");
    }
    expect(committedWrites.length).toBe(0);
  });

  it("TC-05: ambiguous target resolution returns clarification-required", async () => {
    const { orchestrator, humanControlRuntime, committedWrites } = createHarness();
    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Ambiguous target mutation",
    });

    const result = await orchestrator.establishProject({
      evidence,
      operationId: "op-clarify-tgt" as PersistenceOperationId,
      id: "proj-clarify-tgt" as ProjectId,
      intendedOutcome: nonEmptyText("Establish project")!,
      options: { target: "ambiguous", effect: "clear" },
    });

    expect(result.kind).toBe("clarification-required");
    if (result.kind === "clarification-required") {
      expect(result.reason).toBe("ambiguous-target");
    }
    expect(committedWrites.length).toBe(0);
  });

  it("returns clarification-required when target project is not found during completeProject", async () => {
    const { orchestrator, humanControlRuntime, committedWrites } = createHarness();
    const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Complete missing project",
    });

    const result = await orchestrator.completeProject({
      evidence,
      operationId: "op-missing" as PersistenceOperationId,
      projectId: "proj-does-not-exist" as ProjectId,
    });

    expect(result.kind).toBe("clarification-required");
    if (result.kind === "clarification-required") {
      expect(result.reason).toBe("ambiguous-target");
    }
    expect(committedWrites.length).toBe(0);
  });
});

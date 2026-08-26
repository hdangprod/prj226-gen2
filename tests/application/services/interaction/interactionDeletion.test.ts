import { describe, expect, it } from "vitest";
import {
  nonEmptyText,
  type Project,
  type ProjectId,
} from "../../../../src/domain/model";
import {
  createHumanControlRuntime,
  type DeletionScope,
  type TrustedInteractionEvidence,
} from "../../../../src/application/contracts/humanControl";
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
  DeletionExecutionCommand,
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
  const committedDeletions: DeletionExecutionCommand[] = [];

  const exportDeletionPersistence: ExportDeletionPersistence = {
    readExportData: async (): Promise<ExportPersistenceResult> => ({
      kind: "exported",
      data: { projects: [], actions: [], acceptedContextFacts: [], acceptedProgress: [], knowledgeItems: [] },
    }),
    executeConfirmedDeletion: async (cmd: DeletionExecutionCommand): Promise<DeletionPersistenceResult> => {
      committedDeletions.push(cmd);
      return { kind: "deleted" };
    },
  };

  const exportDeletionService = new ExportDeletionServiceImpl(
    exportDeletionPersistence,
    humanControlRuntime.mutationGate,
  );

  const persistence: AcceptedStatePersistence = {
    commitAcceptedState: async () => ({ kind: "committed" }),
  };

  const projectActionContextService = new ProjectActionContextService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });
  const knowledgeProvenanceService = new KnowledgeProvenanceService({
    mutationGate: humanControlRuntime.mutationGate,
    persistence,
  });

  const retrievalService: RetrievalService = {
    getProject: async (id: ProjectId): Promise<RetrievalResult<Project>> => ({
      kind: "found",
      value: { id, intendedOutcome: nonEmptyText("Test")!, state: "Active" },
    }),
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

  return { orchestrator, committedDeletions, humanControlRuntime, dependencies };
}

describe("interactionDeletion (ENG-010 Repair 5)", () => {
  const projectScope: DeletionScope = {
    targetKind: "project",
    targetId: "proj-delete-1",
    effect: "remove-retained-user-data",
  };

  it("TC-19: Turn 1 records deletion direction and prompts for separate confirmation with zero persistence writes", async () => {
    const { orchestrator, humanControlRuntime, committedDeletions } = createHarness();
    const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "User requested deletion of project proj-delete-1",
    });

    const turn1Result = await orchestrator.initiateDeletion({
      evidence: ev1,
      scope: projectScope,
    });

    expect(turn1Result.kind).toBe("deletion-direction-recorded");
    if (turn1Result.kind === "deletion-direction-recorded") {
      expect(turn1Result.scope).toEqual(projectScope);
      expect(turn1Result.prompt).toContain("proj-delete-1");
      expect(turn1Result.direction.kind).toBe("classified-deletion-direction");
    }

    expect(committedDeletions.length).toBe(0);
  });

  it("TC-20 & TC-22 & R2-TC-04: Turn 2 with separate genuine interaction evidence completes valid confirmed deletion", async () => {
    const { orchestrator, humanControlRuntime, committedDeletions } = createHarness();
    const opId = "op-del-1" as PersistenceOperationId;

    // Turn 1: Direction
    const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "User requested deletion of project",
    });
    const turn1 = await orchestrator.initiateDeletion({
      evidence: ev1,
      scope: projectScope,
    });
    expect(turn1.kind).toBe("deletion-direction-recorded");
    if (turn1.kind !== "deletion-direction-recorded") return;

    // Turn 2: Separate confirmation interaction
    const ev2 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "User confirmed deletion of project",
    });
    const turn2 = await orchestrator.confirmDeletion({
      evidence: ev2,
      operationId: opId,
      direction: turn1.direction,
      scope: projectScope,
    });

    expect(turn2.kind).toBe("accepted");
    if (turn2.kind === "accepted") {
      expect(turn2.value).toEqual({
        kind: "deleted",
        operationId: opId,
        scope: projectScope,
      });
    }

    expect(committedDeletions.length).toBe(1);
    expect(committedDeletions[0].operationId).toBe(opId);
    expect(committedDeletions[0].scope).toEqual(projectScope);
  });

  it("TC-21: single-turn deletion or same interaction evidence fails authorization with zero persistence calls", async () => {
    const { orchestrator, humanControlRuntime, committedDeletions } = createHarness();
    const opId = "op-del-same" as PersistenceOperationId;

    const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Single interaction trying to do both",
    });

    const turn1 = await orchestrator.initiateDeletion({
      evidence: ev,
      scope: projectScope,
    });
    expect(turn1.kind).toBe("deletion-direction-recorded");
    if (turn1.kind !== "deletion-direction-recorded") return;

    // Try to confirm using the exact SAME interaction evidence instance
    const turn2 = await orchestrator.confirmDeletion({
      evidence: ev,
      operationId: opId,
      direction: turn1.direction,
      scope: projectScope,
    });

    expect(turn2.kind).toBe("unresolved");
    if (turn2.kind === "unresolved") {
      expect(turn2.reason).toBe("invalid-mismatched-or-same-interaction-deletion-evidence");
    }

    expect(committedDeletions.length).toBe(0);
  });

  it("TC-21: mismatched scope between direction and confirmation fails with zero persistence calls", async () => {
    const { orchestrator, humanControlRuntime, committedDeletions } = createHarness();
    const opId = "op-del-mismatch" as PersistenceOperationId;

    const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Delete project A",
    });
    const turn1 = await orchestrator.initiateDeletion({
      evidence: ev1,
      scope: projectScope,
    });
    expect(turn1.kind).toBe("deletion-direction-recorded");
    if (turn1.kind !== "deletion-direction-recorded") return;

    const differentScope: DeletionScope = {
      targetKind: "project",
      targetId: "proj-different",
      effect: "remove-retained-user-data",
    };

    const ev2 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
      summary: "Confirm delete different project",
    });
    const turn2 = await orchestrator.confirmDeletion({
      evidence: ev2,
      operationId: opId,
      direction: turn1.direction,
      scope: differentScope,
    });

    expect(turn2.kind).toBe("unresolved");
    if (turn2.kind === "unresolved") {
      expect(turn2.reason).toBe("invalid-mismatched-or-same-interaction-deletion-evidence");
    }

    expect(committedDeletions.length).toBe(0);
  });

  it("R2-TC-03: deletion initiation without genuine user direction evidence fails closed with zero persistence writes", async () => {
    const { orchestrator, committedDeletions } = createHarness();

    // Call initiateDeletion without valid evidence
    const turn1Result = await orchestrator.initiateDeletion({
      evidence: undefined as unknown as TrustedInteractionEvidence,
      scope: projectScope,
    });

    expect(turn1Result.kind).toBe("unresolved");
    if (turn1Result.kind === "unresolved") {
      expect(turn1Result.reason).toBe("missing-or-invalid-trusted-interaction-evidence");
    }
    expect(committedDeletions.length).toBe(0);
  });
});

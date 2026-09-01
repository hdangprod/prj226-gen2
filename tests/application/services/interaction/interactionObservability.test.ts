import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  nonEmptyText,
  projectId,
  type Project,
  type ProjectId,
} from "../../../../src/domain/model";
import {
  createHumanControlRuntime,
  type DeletionScope,
  type TrustedInteractionEvidence,
} from "../../../../src/application/contracts/humanControl";
import {
  createObservationContext,
  type OperationalEvidenceEvent,
  type OperationalEvidenceSink,
} from "../../../../src/application/ports/observability/operationalEvidence";
import {
  persistenceOperationId,
  type AcceptedStatePersistence,
} from "../../../../src/application/ports/persistence";
import {
  DeterministicModelCapability,
} from "../../../../src/testing/model/deterministicModelCapability";
import type {
  ModelCapabilityResult,
} from "../../../../src/application/ports/model/modelCapability";
import { ProjectActionContextService } from "../../../../src/application/services/projectActionContext/projectActionContextService";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import { ExportDeletionServiceImpl } from "../../../../src/application/services/exportDeletion/exportDeletionService";
import type {
  ExportDeletionPersistence,
} from "../../../../src/application/services/exportDeletion/exportDeletionTypes";
import type {
  RetrievalResult,
  RetrievalService,
} from "../../../../src/application/services/retrieval/retrievalTypes";
import {
  createInteractionOrchestrator,
} from "../../../../src/application/services/interaction/interactionOrchestrator";
import type {
  InteractionOrchestratorDependencies,
} from "../../../../src/application/services/interaction/interactionTypes";

class RecordingEvidenceSink implements OperationalEvidenceSink {
  readonly events: OperationalEvidenceEvent[] = [];

  emit(event: OperationalEvidenceEvent): void {
    this.events.push(event);
  }
}

function createHarness(options?: {
  readonly modelOutputs?: readonly ModelCapabilityResult[];
  readonly persistence?: AcceptedStatePersistence;
  readonly exportDeletionPersistence?: ExportDeletionPersistence;
  readonly retrievalService?: Partial<RetrievalService>;
}) {
  const sink = new RecordingEvidenceSink();
  const humanControlRuntime = createHumanControlRuntime();

  const defaultExportDeletionPersistence: ExportDeletionPersistence = {
    readExportData: async () => ({
      kind: "exported",
      data: { projects: [], actions: [], acceptedContextFacts: [], acceptedProgress: [], knowledgeItems: [] },
    }),
    executeConfirmedDeletion: async () => ({ kind: "deleted" }),
  };

  const exportDeletionPersistence = options?.exportDeletionPersistence ?? defaultExportDeletionPersistence;
  const exportDeletionService = new ExportDeletionServiceImpl(
    exportDeletionPersistence,
    humanControlRuntime.mutationGate,
  );

  const persistence: AcceptedStatePersistence = options?.persistence ?? {
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

  const defaultRetrievalService: RetrievalService = {
    getProject: async (id: ProjectId): Promise<RetrievalResult<Project>> => ({
      kind: "found",
      value: { id, intendedOutcome: nonEmptyText("Test project")!, state: "Active" },
    }),
    listProjects: async () => ({ kind: "found", value: [] }),
    getActionsForProject: async () => ({ kind: "found", value: [] }),
    getAcceptedContextFacts: async () => ({ kind: "found", value: [] }),
    getCurrentProgress: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeForProject: async () => ({ kind: "found", value: [] }),
    getCurrentKnowledgeAcrossProjects: async () => ({ kind: "found", value: [] }),
    getKnowledgeItem: async (id) => ({ kind: "found", value: { id, originatingProjectId: projectId("p1"), content: nonEmptyText("Test note")!, standing: "current", supersessionChain: [] } }),
    getKnowledgeLineage: async () => ({ kind: "found", value: [] }),
  };

  const retrievalService: RetrievalService = {
    ...defaultRetrievalService,
    ...options?.retrievalService,
  };

  const modelOutputs = options?.modelOutputs ?? [
    { kind: "advisory", content: nonEmptyText("Standard advisory response")! },
  ];
  const modelCapabilityPort = new DeterministicModelCapability([...modelOutputs]);

  const dependencies: InteractionOrchestratorDependencies = {
    retrievalService,
    humanControlRuntime,
    modelCapabilityPort,
    projectActionContextService,
    knowledgeProvenanceService,
    exportDeletionService,
    evidenceSink: sink,
  };

  const orchestrator = createInteractionOrchestrator(dependencies);

  return { orchestrator, sink, humanControlRuntime, persistence };
}

describe("Interaction Observability Matrix (TC-01 .. TC-21 & R3)", () => {
  describe("TC-01 / TC-06 / TC-07: Bilingual Pipeline Observability", () => {
    it("emits correlated lifecycle evidence for successful advisory interaction", async () => {
      const { orchestrator, sink } = createHarness({
        modelOutputs: [
          {
            kind: "advisory",
            content: nonEmptyText("Advisory response text")!,
            diagnostics: { durationMilliseconds: 15, inputUnits: 50, outputUnits: 25 },
          },
        ],
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const outcome = await orchestrator.handleAdvisory({
        text: "How should I structure my project?",
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("advisory");
      expect(sink.events).toHaveLength(7);

      expect(sink.events.map((e) => ({ stage: e.stage, status: e.status }))).toEqual([
        { stage: "request", status: "attempted" },
        { stage: "retrieval", status: "attempted" },
        { stage: "retrieval", status: "succeeded" },
        { stage: "provider", status: "attempted" },
        { stage: "provider", status: "succeeded" },
        { stage: "interpretation", status: "advisory" },
        { stage: "user-visible", status: "advisory" },
      ]);

      for (const ev of sink.events) {
        expect(ev.correlationId).toBe("corr-session-1");
        expect(ev.requestId).toBe("req-turn-1");
        expect(ev.operationCategory).toBe("advisory");
      }
    });

    it("emits correlated lifecycle evidence for successful proposal interaction", async () => {
      const { orchestrator, sink } = createHarness({
        modelOutputs: [
          {
            kind: "proposal",
            operations: [{ kind: "create-project", intendedOutcome: nonEmptyText("Ship")! }],
            diagnostics: { durationMilliseconds: 20, inputUnits: 60, outputUnits: 30 },
          },
        ],
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-2",
      });

      const outcome = await orchestrator.handleProposal({
        text: "Please create project p1",
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("proposed");
      expect(sink.events.length).toBeGreaterThanOrEqual(4);
      expect(sink.events[0]).toMatchObject({ stage: "request", status: "attempted", operationCategory: "proposal" });
      expect(sink.events.at(-1)).toMatchObject({ stage: "user-visible", status: "proposed", operationCategory: "proposal" });
    });
  });

  describe("TC-09 / TC-10 / TC-20: Authoritative Mutation Observability & Derived-State", () => {
    it("emits request -> authorization -> persistence -> derived-state(not-applicable) -> user-visible for accepted establishProject", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness();
      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        operationId: "op-project-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project p1",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship project")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("accepted");
      expect(sink.events.map((e) => ({ stage: e.stage, status: e.status }))).toEqual([
        { stage: "request", status: "attempted" },
        { stage: "authorization", status: "attempted" },
        { stage: "authorization", status: "succeeded" },
        { stage: "persistence", status: "attempted" },
        { stage: "persistence", status: "accepted" },
        { stage: "derived-state", status: "not-applicable" },
        { stage: "user-visible", status: "accepted" },
      ]);
    });

    it("emits duplicate on persistence and user-visible accepted for already-committed mutation retry", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        persistence: {
          commitAcceptedState: async () => ({ kind: "already-committed" }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-2",
        operationId: "op-project-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project p1 retry",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship project")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("accepted");
      expect(sink.events.map((e) => ({ stage: e.stage, status: e.status }))).toEqual([
        { stage: "request", status: "attempted" },
        { stage: "authorization", status: "attempted" },
        { stage: "authorization", status: "succeeded" },
        { stage: "persistence", status: "attempted" },
        { stage: "persistence", status: "duplicate" },
        { stage: "derived-state", status: "not-applicable" },
        { stage: "user-visible", status: "accepted" },
      ]);
    });
  });

  describe("TC-08 / R3-TC-07: Exact Non-Accepted Terminal Evidence Mappings", () => {
    it("emits user-visible failed validation non-retryable for invalid trusted evidence", async () => {
      const { orchestrator, sink } = createHarness();
      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const outcome = await orchestrator.establishProject({
        evidence: { invalid: "evidence" } as unknown as TrustedInteractionEvidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("unresolved");
      expect(sink.events).toHaveLength(2);
      expect(sink.events[0]).toMatchObject({ stage: "request", status: "attempted" });
      expect(sink.events[1]).toMatchObject({
        stage: "user-visible",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
    });

    it("emits user-visible denied prohibited-input non-retryable for authentication material in payload", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness();
      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Store secret",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Bearer token123456")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("prohibited");
      expect(sink.events).toHaveLength(2);
      expect(sink.events[1]).toMatchObject({
        stage: "user-visible",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
    });

    it("emits retrieval failed not-found non-retryable followed by user-visible clarification-required for missing project in mutation", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        retrievalService: {
          getProject: async () => ({ kind: "not-found", entityType: "project", id: projectId("missing") }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Complete missing project",
      });

      const outcome = await orchestrator.completeProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        projectId: projectId("missing"),
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("clarification-required");
      expect(sink.events).toHaveLength(4);
      expect(sink.events[0]).toMatchObject({ stage: "request", status: "attempted" });
      expect(sink.events[1]).toMatchObject({ stage: "retrieval", status: "attempted" });
      expect(sink.events[2]).toMatchObject({
        stage: "retrieval",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      expect(sink.events[3]).toMatchObject({
        stage: "user-visible",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
    });

    it("emits retrieval failed retrieval-failed explicit-retry-eligible and matching user-visible for retrieval failure", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        retrievalService: {
          getProject: async () => ({ kind: "retrieval-failed", reason: "D1 read timeout", retryable: true }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Complete project with failing retrieval",
      });

      const outcome = await orchestrator.completeProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        projectId: projectId("p1"),
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("failed");
      expect(sink.events).toHaveLength(4);
      expect(sink.events[0]).toMatchObject({ stage: "request", status: "attempted" });
      expect(sink.events[1]).toMatchObject({ stage: "retrieval", status: "attempted" });
      expect(sink.events[2]).toMatchObject({
        stage: "retrieval",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: "explicit-retry-eligible",
      });
      expect(sink.events[3]).toMatchObject({
        stage: "user-visible",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: "explicit-retry-eligible",
      });
    });

    it("emits persistence failed operation-id-conflict non-retryable and matching user-visible on operation ID collision", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        persistence: {
          commitAcceptedState: async () => ({ kind: "persistence-failed", reason: "operation-id-conflict", retryable: false }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        operationId: "op-project-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Conflicting establish project",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("failed");
      expect(sink.events.at(-2)).toMatchObject({
        stage: "persistence",
        status: "failed",
        failureCategory: "operation-id-conflict",
        retryDisposition: "non-retryable",
      });
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        status: "failed",
        failureCategory: "operation-id-conflict",
        retryDisposition: "non-retryable",
      });
    });

    it("emits persistence failed persistence-durability explicit-retry-eligible and matching user-visible on durability failure", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        persistence: {
          commitAcceptedState: async () => ({ kind: "persistence-failed", reason: "durability-failure", retryable: true }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        operationId: "op-project-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Establish project durability failure",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("failed");
      expect(sink.events.at(-2)).toMatchObject({
        stage: "persistence",
        status: "failed",
        failureCategory: "persistence-durability",
        retryDisposition: "explicit-retry-eligible",
      });
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        status: "failed",
        failureCategory: "persistence-durability",
        retryDisposition: "explicit-retry-eligible",
      });
    });
  });

  describe("Repair 8 Matrix: All 7 Provider Failures Mapped Truthfully", () => {
    const providerFailureCases = [
      { category: "unavailable" as const, expectedCategory: "provider-unavailable" as const, retryable: true, expectedDisposition: "explicit-retry-eligible" as const },
      { category: "timeout" as const, expectedCategory: "provider-timeout" as const, retryable: true, expectedDisposition: "explicit-retry-eligible" as const },
      { category: "rate-limited" as const, expectedCategory: "provider-rate-limited" as const, retryable: true, expectedDisposition: "explicit-retry-eligible" as const },
      { category: "refused" as const, expectedCategory: "provider-refused" as const, retryable: false, expectedDisposition: "non-retryable" as const },
      { category: "malformed-result" as const, expectedCategory: "provider-malformed-result" as const, retryable: false, expectedDisposition: "non-retryable" as const },
      { category: "invalid-request" as const, expectedCategory: "provider-invalid-request" as const, retryable: false, expectedDisposition: "non-retryable" as const },
      { category: "unknown" as const, expectedCategory: "provider-unknown" as const, retryable: true, expectedDisposition: "explicit-retry-eligible" as const },
    ];

    for (const { category, expectedCategory, retryable, expectedDisposition } of providerFailureCases) {
      it(`maps provider failure '${category}' correctly to stage provider and user-visible`, async () => {
        const { orchestrator, sink } = createHarness({
          modelOutputs: [
            {
              kind: "failure",
              failure: { category, message: nonEmptyText(`Simulated ${category}`)!, retryable },
            },
          ],
        });

        const ctx = createObservationContext({
          correlationId: "corr-session-1",
          requestId: "req-turn-1",
        });

        const outcome = await orchestrator.handleAdvisory({
          text: "Trigger provider failure",
          observationContext: ctx,
        });

        expect(outcome.kind).toBe("failed");
        expect(sink.events.at(-2)).toMatchObject({
          stage: "provider",
          status: "failed",
          failureCategory: expectedCategory,
          retryDisposition: expectedDisposition,
        });
        expect(sink.events.at(-1)).toMatchObject({
          stage: "user-visible",
          status: "failed",
          failureCategory: expectedCategory,
          retryDisposition: expectedDisposition,
        });
      });
    }
  });

  describe("TC-13: Two Separate Flows (Flow 1 Advisory Success vs Flow 2 Mutation Durability Failure)", () => {
    it("Flow 1: advisory model success produces provider/user-visible advisory", async () => {
      const { orchestrator, sink } = createHarness({
        modelOutputs: [
          { kind: "advisory", content: nonEmptyText("Pure advisory advice")! },
        ],
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const outcome = await orchestrator.handleAdvisory({
        text: "Please advise on project strategy",
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("advisory");
      expect(sink.events.some((e) => e.stage === "persistence")).toBe(false);
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        status: "advisory",
      });
    });

    it("Flow 2: authoritative mutation durability failure produces persistence and user-visible failure without provider involvement", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness({
        persistence: {
          commitAcceptedState: async () => ({
            kind: "persistence-failed",
            reason: "durability-failure",
            retryable: true,
          }),
        },
      });

      const ctx = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-2",
        operationId: "op-project-1",
      });

      const evidence = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Authoritative mutation durability test",
      });

      const outcome = await orchestrator.establishProject({
        evidence,
        operationId: persistenceOperationId("op-project-1"),
        id: projectId("p1"),
        intendedOutcome: nonEmptyText("Ship")!,
        observationContext: ctx,
      });

      expect(outcome.kind).toBe("failed");
      expect(sink.events.some((e) => e.stage === "provider")).toBe(false);
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        status: "failed",
        failureCategory: "persistence-durability",
        retryDisposition: "explicit-retry-eligible",
      });
    });
  });

  describe("TC-14 / TC-15 / TC-16: Deletion Orchestration Observability", () => {
    const projectScope: DeletionScope = {
      targetKind: "project",
      targetId: "proj-delete-1",
      effect: "remove-retained-user-data",
    };

    it("records deletion direction with proposed status in Turn 1", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness();
      const ctx1 = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Initiate deletion",
      });

      const turn1 = await orchestrator.initiateDeletion({
        evidence: ev1,
        scope: projectScope,
        observationContext: ctx1,
      });

      expect(turn1.kind).toBe("deletion-direction-recorded");
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        operationCategory: "deletion",
        status: "proposed",
      });
    });

    it("executes confirmed deletion across distinct turns with accepted status", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness();
      const ctx1 = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });
      const ctx2 = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-2",
        operationId: "op-del-1",
      });

      const ev1 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Initiate deletion",
      });
      const turn1 = await orchestrator.initiateDeletion({
        evidence: ev1,
        scope: projectScope,
        observationContext: ctx1,
      });
      expect(turn1.kind).toBe("deletion-direction-recorded");
      if (turn1.kind !== "deletion-direction-recorded") return;

      const ev2 = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Confirm deletion",
      });
      const turn2 = await orchestrator.confirmDeletion({
        evidence: ev2,
        operationId: persistenceOperationId("op-del-1"),
        direction: turn1.direction,
        scope: projectScope,
        observationContext: ctx2,
      });

      expect(turn2.kind).toBe("accepted");
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        operationCategory: "deletion",
        status: "accepted",
      });
    });

    it("fails closed with denied authorization-denied when same interaction request ID is reused", async () => {
      const { orchestrator, sink, humanControlRuntime } = createHarness();
      const ctx1 = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      });

      const ev = humanControlRuntime.trustedInteractionIngress.observeInteraction({
        summary: "Reused interaction",
      });
      const turn1 = await orchestrator.initiateDeletion({
        evidence: ev,
        scope: projectScope,
        observationContext: ctx1,
      });
      expect(turn1.kind).toBe("deletion-direction-recorded");
      if (turn1.kind !== "deletion-direction-recorded") return;

      const turn2 = await orchestrator.confirmDeletion({
        evidence: ev,
        operationId: persistenceOperationId("op-del-1"),
        direction: turn1.direction,
        scope: projectScope,
        observationContext: ctx1, // Reusing ctx1 (same request ID)
      });

      expect(turn2.kind).toBe("unresolved");
      expect(sink.events.at(-1)).toMatchObject({
        stage: "user-visible",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
    });
  });

  describe("TC-21 / R3-TC-13: Executable Architecture Guard Across Real Production Files & Prohibited Families", () => {
    const PROHIBITED_CONSTRUCT_PATTERNS = [
      {
        family: "1_external_telemetry_sdk",
        pattern: /@opentelemetry|@sentry|telemetryReporter|new\s+Sentry|DataDog/i,
        positiveControl: `import { trace } from "@opentelemetry/api";`,
      },
      {
        family: "2_queues_and_background_workers",
        pattern: /\bQueue<|\bDurableObject\b|\bscheduled\s*\(|\bcron\s*:|\bwaitUntil\s*\(|\bbackgroundWorker\b|\brecoveryWorker\b/i,
        positiveControl: `ctx.waitUntil(performBackgroundTask());`,
      },
      {
        family: "3_cache_and_persistent_platform_state",
        pattern: /\bcaches\.default\b|\bcaches\.open\b|\bKVNamespace\b|\bR2Bucket\b|\bcache\.put\b|\bcache\.match\b/i,
        positiveControl: `const cache = caches.default;`,
      },
      {
        family: "4_outbound_network_clients",
        pattern: /\bfetch\s*\(|\bWebSocket\s*\(|\bXMLHttpRequest\b|from\s+["']node:http["']|from\s+["']https?["']/i,
        positiveControl: `const res = await fetch("https://example.com/api");`,
      },
      {
        family: "5_automatic_retries_and_fallbacks",
        pattern: /\bautoRetry\b|\bretryLoop\b|\bfallbackProvider\b|\bexecuteWithRetry\b|\bcompensationEngine\b|\brollbackTransaction\b/i,
        positiveControl: `const result = await executeWithRetry(fn);`,
      },
      {
        family: "6_telemetry_persistence_tables",
        pattern: /INSERT\s+INTO\s+telemetry|createTable\s*\(\s*["']telemetry["']|D1Telemetry|KVTelemetry|R2Telemetry/i,
        positiveControl: `await db.exec("INSERT INTO telemetry VALUES (?)", data);`,
      },
      {
        family: "7_evidence_content_secret_arbitrary_bags",
        pattern: /\bError\.message\b|\bError\.stack\b|\berr\.message\b|\berr\.stack\b|JSON\.stringify\s*\(\s*err|\battributes\s*:|\bpayload\s*:/i,
        positiveControl: `const entry = { attributes: { secret: "leak" } };`,
      },
      {
        family: "8_new_deployable_runtime_services",
        pattern: /export\s+default\s+\{\s*(?:async\s+)?fetch\b|export\s+default\s+class\s+\w+\s+extends\s+WorkerEntrypoint\b|ServiceWorker|ServiceBinding/i,
        positiveControl: `export default { async fetch(req) { return new Response("ok"); } };`,
      },
    ];

    const PRODUCTION_PATHS = [
      "src/application/ports/observability/operationalEvidence.ts",
      "src/application/ports/observability/index.ts",
      "src/application/services/interaction/interactionTypes.ts",
      "src/application/services/interaction/interactionOrchestrator.ts",
      "src/application/services/interaction/index.ts",
      "src/infrastructure/observability/cloudflareOperationalEvidence.ts",
      "src/infrastructure/observability/index.ts",
      "src/application/contracts/operations.ts",
      "src/application/services/projectActionContext/projectActionContextService.ts",
      "src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts",
    ];

    function scanSourceBytes(content: string) {
      const violations: { family: string; match: string }[] = [];
      for (const { family, pattern } of PROHIBITED_CONSTRUCT_PATTERNS) {
        const match = content.match(pattern);
        if (match !== null) {
          violations.push({ family, match: match[0] });
        }
      }
      return violations;
    }

    it("verifies all 10 real production source files are 100% clean of prohibited patterns", () => {
      for (const relativePath of PRODUCTION_PATHS) {
        const fileUrl = new URL("../../../../" + relativePath, import.meta.url);
        const content = readFileSync(fileUrl, "utf8");
        const violations = scanSourceBytes(content);

        expect(
          violations,
          `File ${relativePath} contained prohibited architecture constructs: ${JSON.stringify(violations)}`,
        ).toEqual([]);
      }
    });

    it("verifies positive controls trigger detection across all 8 prohibited construct families", () => {
      for (const { family, positiveControl } of PROHIBITED_CONSTRUCT_PATTERNS) {
        const violations = scanSourceBytes(positiveControl);
        expect(
          violations.length,
          `Scanner failed to detect positive control for prohibited family: ${family}`,
        ).toBeGreaterThanOrEqual(1);
        expect(violations.some((v) => v.family === family)).toBe(true);
      }
    });
  });
});

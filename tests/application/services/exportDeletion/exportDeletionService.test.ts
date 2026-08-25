import { describe, expect, it, vi } from "vitest";
import type {
  ConfirmedDeletionAuthorization,
  DeletionScope,
  MutationGate,
  OrdinaryMutationAuthorization,
} from "../../../../src/application/contracts/humanControl";
import type { PersistenceOperationId } from "../../../../src/application/ports/persistence";
import {
  createExportDeletionService,
  ExportDeletionServiceImpl,
} from "../../../../src/application/services/exportDeletion/exportDeletionService";
import type {
  ConfirmedDeletionCommand,
  DeletionExecutionCommand,
  DeletionPersistenceResult,
  ExportDeletionPersistence,
  ExportPersistenceResult,
} from "../../../../src/application/services/exportDeletion/exportDeletionTypes";

function createValidAuth(scope: DeletionScope): ConfirmedDeletionAuthorization {
  return {
    kind: "confirmed-deletion-authorization",
    operation: "destructive-deletion",
    additionalConfirmation: true,
    _scope: scope,
  } as unknown as ConfirmedDeletionAuthorization;
}

function createMockMutationGate(
  validateDeletionOverride?: (auth: unknown, scope: DeletionScope) => boolean,
): MutationGate {
  return {
    validateOrdinary: (
      _authorization: unknown,
    ): _authorization is OrdinaryMutationAuthorization => true,
    validateDeletion: (
      auth: unknown,
      scope: DeletionScope,
    ): auth is ConfirmedDeletionAuthorization => {
      if (validateDeletionOverride !== undefined) {
        return validateDeletionOverride(auth, scope);
      }
      if (!auth || typeof auth !== "object") return false;
      const recorded = (auth as Record<string, unknown>)._scope as DeletionScope;
      if (!recorded) return false;
      if (
        recorded.targetKind !== scope.targetKind ||
        recorded.targetId !== scope.targetId ||
        recorded.effect !== scope.effect
      ) {
        return false;
      }
      if (scope.targetKind === "knowledge-lineage") {
        const recMembers = (recorded as { lineageMembers: readonly string[] }).lineageMembers;
        const scopeMembers = scope.lineageMembers;
        if (!Array.isArray(recMembers) || !Array.isArray(scopeMembers)) return false;
        if (recMembers.length !== scopeMembers.length) return false;
        return recMembers.every((m, i) => m === scopeMembers[i]);
      }
      return true;
    },
  };
}

describe("ExportDeletionService", () => {
  const projectScope: DeletionScope = {
    targetKind: "project",
    targetId: "p1",
    effect: "remove-retained-user-data",
  };

  describe("exportAcceptedState", () => {
    it("E01/E08: exports valid document when persistence succeeds", async () => {
      const persistence: ExportDeletionPersistence = {
        readExportData: async (): Promise<ExportPersistenceResult> => ({
          kind: "exported",
          data: {
            projects: [],
            actions: [],
            acceptedContextFacts: [],
            acceptedProgress: [],
            knowledgeItems: [],
          },
        }),
        executeConfirmedDeletion: vi.fn(),
      };
      const service = createExportDeletionService(persistence, createMockMutationGate());
      const result = await service.exportAcceptedState();
      expect(result).toEqual({
        kind: "exported",
        format: "liam-accepted-state-export",
        version: 1,
        mediaType: "application/json",
        document: JSON.stringify({
          format: "liam-accepted-state-export",
          version: 1,
          projects: [],
          actions: [],
          acceptedContextFacts: [],
          acceptedProgress: [],
          knowledgeItems: [],
        }),
      });
    });

    it("E09: returns retryable export-failed when read fails", async () => {
      const persistence: ExportDeletionPersistence = {
        readExportData: async (): Promise<ExportPersistenceResult> => ({
          kind: "read-failed",
          retryable: true,
        }),
        executeConfirmedDeletion: vi.fn(),
      };
      const service = createExportDeletionService(persistence, createMockMutationGate());
      const result = await service.exportAcceptedState();
      expect(result).toEqual({
        kind: "export-failed",
        reason: "authoritative-read-failed",
        retryable: true,
      });
    });

    it("E10: returns non-retryable export-failed when state is malformed", async () => {
      const persistence: ExportDeletionPersistence = {
        readExportData: async (): Promise<ExportPersistenceResult> => ({
          kind: "malformed-state",
          retryable: false,
        }),
        executeConfirmedDeletion: vi.fn(),
      };
      const service = createExportDeletionService(persistence, createMockMutationGate());
      const result = await service.exportAcceptedState();
      expect(result).toEqual({
        kind: "export-failed",
        reason: "malformed-authoritative-state",
        retryable: false,
      });
    });
  });

  describe("deleteConfirmed - validation and gate enforcement", () => {
    it("rejects command when operationId is missing or empty", async () => {
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: vi.fn() },
        createMockMutationGate(),
      );
      const result = await service.deleteConfirmed({
        operationId: "" as PersistenceOperationId,
        scope: projectScope,
        authorization: createValidAuth(projectScope),
      });
      expect(result).toMatchObject({
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
      });
    });

    it("rejects command when scope effect is invalid", async () => {
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: vi.fn() },
        createMockMutationGate(),
      );
      const result = await service.deleteConfirmed({
        operationId: "op-1" as PersistenceOperationId,
        scope: { ...projectScope, effect: "archive" as never },
        authorization: createValidAuth(projectScope),
      });
      expect(result).toMatchObject({
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
      });
    });

    it("L07: rejects knowledge-lineage when lineageMembers is empty or first element != targetId", async () => {
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: vi.fn() },
        createMockMutationGate(),
      );
      const invalidScope1 = {
        targetKind: "knowledge-lineage" as const,
        targetId: "k1",
        effect: "remove-retained-user-data" as const,
        lineageMembers: [],
      };
      const res1 = await service.deleteConfirmed({
        operationId: "op-1" as PersistenceOperationId,
        scope: invalidScope1,
        authorization: createValidAuth(invalidScope1),
      });
      expect(res1.kind).toBe("deletion-rejected");

      const invalidScope2 = {
        targetKind: "knowledge-lineage" as const,
        targetId: "k1",
        effect: "remove-retained-user-data" as const,
        lineageMembers: ["k2", "k3"],
      };
      const res2 = await service.deleteConfirmed({
        operationId: "op-1" as PersistenceOperationId,
        scope: invalidScope2,
        authorization: createValidAuth(invalidScope2),
      });
      expect(res2.kind).toBe("deletion-rejected");
    });

    it("rejects non-lineage scope when lineageMembers is present", async () => {
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: vi.fn() },
        createMockMutationGate(),
      );
      const invalidScope = {
        targetKind: "project" as const,
        targetId: "p1",
        effect: "remove-retained-user-data" as const,
        lineageMembers: ["p1"],
      } as unknown as DeletionScope;
      const res = await service.deleteConfirmed({
        operationId: "op-1" as PersistenceOperationId,
        scope: invalidScope,
        authorization: createValidAuth(invalidScope),
      });
      expect(res.kind).toBe("deletion-rejected");
    });

    it("rejects when MutationGate.validateDeletion returns false", async () => {
      const gate = createMockMutationGate(() => false);
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: vi.fn() },
        gate,
      );
      const result = await service.deleteConfirmed({
        operationId: "op-1" as PersistenceOperationId,
        scope: projectScope,
        authorization: createValidAuth(projectScope),
      });
      expect(result).toEqual({
        kind: "deletion-rejected",
        reason: "invalid-or-mismatched-authorization",
        scope: projectScope,
      });
    });
  });

  describe("SR-R002: Strict Pre-Snapshot Validation without Coercion and Hostile Values Defense", () => {
    it("SR2-COERCE-01: authorization for targetId '123', runtime targetId numeric 123 -> deletion-rejected, persistence not called", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const auth = createValidAuth({
        targetKind: "project",
        targetId: "123",
        effect: "remove-retained-user-data",
      });

      const malformedScope = {
        targetKind: "project",
        targetId: 123,
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-1" as PersistenceOperationId,
        scope: malformedScope,
        authorization: auth,
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-02: object targetId with toString returning authorized ID -> deletion-rejected", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const auth = createValidAuth({
        targetKind: "project",
        targetId: "p1",
        effect: "remove-retained-user-data",
      });

      const hostileScope = {
        targetKind: "project",
        targetId: {
          toString() {
            return "p1";
          },
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-2" as PersistenceOperationId,
        scope: hostileScope,
        authorization: auth,
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-03: invalid targetKind object/string-like value -> deletion-rejected", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const hostileScope = {
        targetKind: {
          toString() {
            return "project";
          },
        },
        targetId: "p1",
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-3" as PersistenceOperationId,
        scope: hostileScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-04: invalid effect object/string-like value -> deletion-rejected", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const hostileScope = {
        targetKind: "project",
        targetId: "p1",
        effect: {
          toString() {
            return "remove-retained-user-data";
          },
        },
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-4" as PersistenceOperationId,
        scope: hostileScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-05: lineage member numeric value matching string after coercion -> deletion-rejected", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const auth = createValidAuth({
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", "123"],
      });

      const malformedLineageScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        lineageMembers: ["k1", 123],
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-5" as PersistenceOperationId,
        scope: malformedLineageScope,
        authorization: auth,
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-06: throwing targetId getter -> deletion-rejected, no uncaught error, persistence not called", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const hostileScope = {
        targetKind: "project",
        get targetId() {
          throw new Error("Hostile targetId getter detonated");
        },
        effect: "remove-retained-user-data",
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-6" as PersistenceOperationId,
        scope: hostileScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-07: throwing lineageMembers getter -> deletion-rejected, no persistence", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const hostileScope = {
        targetKind: "knowledge-lineage",
        targetId: "k1",
        effect: "remove-retained-user-data",
        get lineageMembers() {
          throw new Error("Hostile lineageMembers getter detonated");
        },
      } as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-7" as PersistenceOperationId,
        scope: hostileScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    it("SR2-COERCE-08: Proxy property access throws -> controlled rejection, no persistence", async () => {
      const executeFn = vi.fn();
      const service = createExportDeletionService(
        { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
        createMockMutationGate(),
      );

      const proxyScope = new Proxy(
        {},
        {
          get(_target, prop) {
            throw new Error(`Hostile Proxy get for ${String(prop)}`);
          },
        },
      ) as unknown as DeletionScope;

      const result = await service.deleteConfirmed({
        operationId: "op-coerce-8" as PersistenceOperationId,
        scope: proxyScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result.kind).toBe("deletion-rejected");
      expect(executeFn).not.toHaveBeenCalled();
    });

    const hostileLineageScopes: readonly {
      readonly name: string;
      readonly makeScope: () => DeletionScope;
    }[] = [
      {
        name: "revoked Proxy lineageMembers",
        makeScope: () => {
          const revocable = Proxy.revocable<string[]>([], {});
          revocable.revoke();
          return {
            targetKind: "knowledge-lineage",
            targetId: "K1",
            effect: "remove-retained-user-data",
            lineageMembers: revocable.proxy,
          };
        },
      },
      {
        name: "Array Proxy throwing from length",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1"], {
            get(target, property, receiver) {
              if (property === "length") throw new Error("hostile length");
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
      {
        name: "Array Proxy throwing from indexed member access",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1", "K2"], {
            get(target, property, receiver) {
              if (property === "0") throw new Error("hostile member");
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
      {
        name: "Proxy-backed duplicate member validation",
        makeScope: () => ({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: new Proxy(["K1", "K2"], {
            get(target, property, receiver) {
              if (property === "1") return "K1";
              return Reflect.get(target, property, receiver);
            },
          }),
        }),
      },
    ];

    it.each(hostileLineageScopes)(
      "SR2-R2: $name is deletion-rejected with zero persistence calls",
      async ({ makeScope }) => {
        const executeFn = vi.fn();
        const service = createExportDeletionService(
          { readExportData: vi.fn(), executeConfirmedDeletion: executeFn },
          createMockMutationGate(),
        );
        const validLineageScope: DeletionScope = {
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: ["K1", "K2"],
        };

        await expect(
          service.deleteConfirmed({
            operationId: "op-hostile-proxy" as PersistenceOperationId,
            scope: makeScope(),
            authorization: createValidAuth(validLineageScope),
          }),
        ).resolves.toMatchObject({
          kind: "deletion-rejected",
          reason: "invalid-or-mismatched-authorization",
        });
        expect(executeFn).not.toHaveBeenCalled();
      },
    );

    it("SR2-01: async lineageMembers mutation after invocation cannot widen execution", async () => {
      let capturedPersistenceCommand: DeletionExecutionCommand | undefined;
      let resumePersistence: () => void;
      const persistencePaused = new Promise<void>((resolve) => {
        resumePersistence = resolve;
      });

      const persistence: ExportDeletionPersistence = {
        readExportData: vi.fn(),
        executeConfirmedDeletion: async (cmd) => {
          capturedPersistenceCommand = cmd;
          await persistencePaused;
          return { kind: "deleted" };
        },
      };

      const gate = createMockMutationGate();
      const service = new ExportDeletionServiceImpl(persistence, gate);

      const mutableMembers = ["K1", "K2", "K3"];
      const commandScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: mutableMembers,
      };
      const auth = createValidAuth(commandScope);

      const promise = service.deleteConfirmed({
        operationId: "op-mutation-proof" as PersistenceOperationId,
        scope: commandScope,
        authorization: auth,
      });

      // Adversarial mutation while persistence is paused
      mutableMembers.push("K4");

      resumePersistence!();
      const result = await promise;

      // Assert persistence executed only with original [K1, K2, K3]
      expect(capturedPersistenceCommand?.scope.targetKind).toBe("knowledge-lineage");
      if (capturedPersistenceCommand?.scope.targetKind === "knowledge-lineage") {
        expect(capturedPersistenceCommand.scope.lineageMembers).toEqual(["K1", "K2", "K3"]);
      }

      // Assert returned result contains immutable [K1, K2, K3]
      expect(result.kind).toBe("deleted");
      if (result.kind === "deleted" && result.scope.targetKind === "knowledge-lineage") {
        expect(result.scope.lineageMembers).toEqual(["K1", "K2", "K3"]);
        expect(result.scope.lineageMembers).not.toContain("K4");
      }
    });

    it("SR2-02: targetId mutation after invocation cannot redirect execution", async () => {
      let capturedPersistenceCommand: DeletionExecutionCommand | undefined;
      let resumePersistence: () => void;
      const persistencePaused = new Promise<void>((resolve) => {
        resumePersistence = resolve;
      });

      const persistence: ExportDeletionPersistence = {
        readExportData: vi.fn(),
        executeConfirmedDeletion: async (cmd) => {
          capturedPersistenceCommand = cmd;
          await persistencePaused;
          return { kind: "deleted" };
        },
      };

      const gate = createMockMutationGate();
      const service = new ExportDeletionServiceImpl(persistence, gate);

      const mutableScope = {
        targetKind: "project" as const,
        targetId: "p-original",
        effect: "remove-retained-user-data" as const,
      };
      const auth = createValidAuth(mutableScope);

      const promise = service.deleteConfirmed({
        operationId: "op-targetid-mutation" as PersistenceOperationId,
        scope: mutableScope,
        authorization: auth,
      });

      (mutableScope as { targetId: string }).targetId = "p-hacked";

      resumePersistence!();
      const result = await promise;

      expect(capturedPersistenceCommand?.scope.targetId).toBe("p-original");
      expect(result.kind).toBe("deleted");
      if (result.kind === "deleted") {
        expect(result.scope.targetId).toBe("p-original");
      }
    });

    it("SR2-03: returned scope is an immutable frozen snapshot value", async () => {
      const persistence: ExportDeletionPersistence = {
        readExportData: vi.fn(),
        executeConfirmedDeletion: async () => ({ kind: "deleted" }),
      };

      const service = new ExportDeletionServiceImpl(persistence, createMockMutationGate());
      const members = ["K1", "K2", "K3"];
      const commandScope: DeletionScope = {
        targetKind: "knowledge-lineage",
        targetId: "K1",
        effect: "remove-retained-user-data",
        lineageMembers: members,
      };

      const result = await service.deleteConfirmed({
        operationId: "op-frozen" as PersistenceOperationId,
        scope: commandScope,
        authorization: createValidAuth(commandScope),
      });

      expect(result.kind).toBe("deleted");
      if (result.kind === "deleted") {
        expect(Object.isFrozen(result.scope)).toBe(true);
        if (result.scope.targetKind === "knowledge-lineage") {
          expect(Object.isFrozen(result.scope.lineageMembers)).toBe(true);
        }
      }
    });

    it("SR2-04: array replacement where possible through unsafe runtime cast after invocation", async () => {
      let capturedPersistenceCommand: DeletionExecutionCommand | undefined;
      const persistence: ExportDeletionPersistence = {
        readExportData: vi.fn(),
        executeConfirmedDeletion: async (cmd) => {
          capturedPersistenceCommand = cmd;
          return { kind: "deleted" };
        },
      };

      const service = new ExportDeletionServiceImpl(persistence, createMockMutationGate());
      const command: ConfirmedDeletionCommand = {
        operationId: "op-cast" as PersistenceOperationId,
        scope: {
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: ["K1", "K2", "K3"],
        },
        authorization: createValidAuth({
          targetKind: "knowledge-lineage",
          targetId: "K1",
          effect: "remove-retained-user-data",
          lineageMembers: ["K1", "K2", "K3"],
        }),
      };

      const promise = service.deleteConfirmed(command);
      (command as unknown as { scope: { lineageMembers: string[] } }).scope.lineageMembers = ["K1", "K4"];
      const result = await promise;

      expect(result.kind).toBe("deleted");
      if (capturedPersistenceCommand?.scope.targetKind === "knowledge-lineage") {
        expect(capturedPersistenceCommand.scope.lineageMembers).toEqual(["K1", "K2", "K3"]);
      }
    });
  });

  describe("deleteConfirmed - persistence mapping", () => {
    const testCases: {
      persistenceResult: DeletionPersistenceResult;
      expectedKind: string;
      expectedReason?: string;
      expectedRetryable?: boolean;
    }[] = [
      { persistenceResult: { kind: "deleted" }, expectedKind: "deleted" },
      { persistenceResult: { kind: "already-deleted" }, expectedKind: "already-deleted" },
      { persistenceResult: { kind: "not-found" }, expectedKind: "not-found" },
      { persistenceResult: { kind: "scope-conflict" }, expectedKind: "deletion-failed", expectedReason: "scope-conflict", expectedRetryable: false },
      { persistenceResult: { kind: "operation-id-conflict" }, expectedKind: "deletion-failed", expectedReason: "operation-id-conflict", expectedRetryable: false },
      { persistenceResult: { kind: "durability-inconsistency" }, expectedKind: "deletion-failed", expectedReason: "durability-inconsistency", expectedRetryable: false },
      { persistenceResult: { kind: "write-failed", retryable: true }, expectedKind: "deletion-failed", expectedReason: "authoritative-write-failed", expectedRetryable: true },
      { persistenceResult: { kind: "indeterminate", reason: "persistence-outcome-unavailable", retryable: true }, expectedKind: "deletion-indeterminate", expectedReason: "persistence-outcome-unavailable", expectedRetryable: true },
      { persistenceResult: { kind: "indeterminate", reason: "post-delete-verification-failed", retryable: true }, expectedKind: "deletion-indeterminate", expectedReason: "post-delete-verification-failed", expectedRetryable: true },
    ];

    for (const tc of testCases) {
      it(`maps persistence ${tc.persistenceResult.kind} to ${tc.expectedKind}`, async () => {
        const persistence: ExportDeletionPersistence = {
          readExportData: vi.fn(),
          executeConfirmedDeletion: async () => tc.persistenceResult,
        };
        const service = createExportDeletionService(persistence, createMockMutationGate());
        const result = await service.deleteConfirmed({
          operationId: "op-map" as PersistenceOperationId,
          scope: projectScope,
          authorization: createValidAuth(projectScope),
        });

        expect(result.kind).toBe(tc.expectedKind);
        if ("reason" in result && tc.expectedReason !== undefined) {
          expect(result.reason).toBe(tc.expectedReason);
        }
        if ("retryable" in result && tc.expectedRetryable !== undefined) {
          expect(result.retryable).toBe(tc.expectedRetryable);
        }
      });
    }

    it("maps thrown unexpected error to indeterminate persistence-outcome-unavailable", async () => {
      const persistence: ExportDeletionPersistence = {
        readExportData: vi.fn(),
        executeConfirmedDeletion: async () => {
          throw new Error("unexpected connection drop");
        },
      };
      const service = createExportDeletionService(persistence, createMockMutationGate());
      const result = await service.deleteConfirmed({
        operationId: "op-err" as PersistenceOperationId,
        scope: projectScope,
        authorization: createValidAuth(projectScope),
      });

      expect(result).toEqual({
        kind: "deletion-indeterminate",
        operationId: "op-err",
        scope: projectScope,
        reason: "persistence-outcome-unavailable",
        retryable: true,
      });
    });
  });
});

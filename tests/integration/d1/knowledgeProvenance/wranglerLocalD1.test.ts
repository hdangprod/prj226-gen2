import { describe, expect, it } from "vitest";
import { createHumanControlRuntime, type OrdinaryMutationScope } from "../../../../src/application/contracts/humanControl";
import { persistenceOperationId } from "../../../../src/application/ports/persistence";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import { knowledgeItemId, nonEmptyText, projectId } from "../../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../../src/infrastructure/d1/d1AcceptedStatePersistence";
import { createFreshWranglerLocalD1 } from "./wranglerLocalD1";

const intent = { summary: "intentional knowledge mutation" };
const text = (value: string) => nonEmptyText(value)!;

function authorize(runtime: ReturnType<typeof createHumanControlRuntime>, scope: OrdinaryMutationScope) {
  const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
  const direction = runtime.humanControl.classifyOrdinaryDirection(evidence, scope, { target: "clear", effect: "clear" });
  if (direction.kind !== "classified-ordinary-direction") throw new Error("test setup failed");
  const authorization = runtime.humanControl.authorizeOrdinaryChange(direction, scope);
  if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("test setup failed");
  return authorization;
}

describe("ENG-005 Wrangler-backed local D1 evidence", () => {
  it("persists one capture and correction lineage with retry-safe receipts and immutable origin", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await expect(persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] })).resolves.toMatchObject({ kind: "committed" });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const captureScope = { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "Original note" } as const;
      const capture = { intent, operationId: persistenceOperationId("capture"), authorization: authorize(runtime, captureScope), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Original note"), intentional: true };
      await expect(service.capture(capture)).resolves.toMatchObject({ kind: "accepted", value: { id: "k1", originatingProjectId: "p1", standing: "current" } });
      await expect(service.capture(capture)).resolves.toMatchObject({ kind: "accepted" });
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ count: 1 }]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "capture")).toEqual([{ count: 1 }]);
      const prior = { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Original note"), standing: "current" as const, supersessionChain: [] };
      const correctionScope = { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p1", content: "Corrected note" } as const;
      const correction = { intent, operationId: persistenceOperationId("correct"), authorization: authorize(runtime, correctionScope), prior, successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Corrected note") };
      await expect(service.correct(correction)).resolves.toMatchObject({ kind: "accepted", value: { id: "k2", supersedesId: "k1", supersessionChain: ["k1"] } });
      await expect(service.correct(correction)).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.correct({
        ...correction,
        operationId: persistenceOperationId("branch-attempt"),
        authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k3", originatingProjectId: "p1", content: "Attempted branch" }),
        successorId: knowledgeItemId("k3"),
        content: text("Attempted branch"),
      })).resolves.toMatchObject({ kind: "failed", reason: "constraint-conflict" });
      expect(await local.read<{ id: string; originating_project_id: string; standing: string; supersedes_id: string | null; supersession_chain: string }>("SELECT id, originating_project_id, standing, supersedes_id, supersession_chain FROM knowledge_items ORDER BY id")).toEqual([
        { id: "k1", originating_project_id: "p1", standing: "superseded", supersedes_id: null, supersession_chain: "[]" },
        { id: "k2", originating_project_id: "p1", standing: "current", supersedes_id: "k1", supersession_chain: "[\"k1\"]" },
      ]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id = ?", "correct")).toEqual([{ count: 1 }]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "branch-attempt")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });

  it("keeps real D1 state and receipts empty for prohibited capture and correction", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const privateKey = "-----BEGIN PRIVATE KEY-----\\nsynthetic fixture marker";
      await expect(service.capture({ intent, operationId: persistenceOperationId("blocked-capture"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "blocked", originatingProjectId: "p1", content: privateKey }), id: knowledgeItemId("blocked"), originatingProjectId: projectId("p1"), content: text(privateKey), intentional: true })).resolves.toMatchObject({ kind: "prohibited" });
      expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", "blocked")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "blocked-capture")).toEqual([]);
      await service.capture({ intent, operationId: persistenceOperationId("capture"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "Eligible note" }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Eligible note"), intentional: true });
      const forbidden = "authentication_secret=synthetic-value";
      await expect(service.correct({ intent, operationId: persistenceOperationId("blocked-correction"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p1", content: forbidden }), prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Eligible note"), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text(forbidden) })).resolves.toMatchObject({ kind: "prohibited" });
      expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
      expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", "k2")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "blocked-correction")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });

  it("IR-F001 keeps real D1 state and receipts empty for bare alphanumeric Bearer capture and correction", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const bareBearer = "Bearer tokenonly123";
      await expect(service.capture({ intent, operationId: persistenceOperationId("bare-bearer-capture"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "bare-bearer", originatingProjectId: "p1", content: bareBearer }), id: knowledgeItemId("bare-bearer"), originatingProjectId: projectId("p1"), content: text(bareBearer), intentional: true })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", "bare-bearer")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "bare-bearer-capture")).toEqual([]);

      await expect(service.capture({ intent, operationId: persistenceOperationId("eligible-predecessor"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "Eligible predecessor" }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Eligible predecessor"), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.correct({ intent, operationId: persistenceOperationId("bare-bearer-correction"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p1", content: bareBearer }), prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Eligible predecessor"), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text(bareBearer) })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
      expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", "k2")).toEqual([]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", "bare-bearer-correction")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });

  it("IR-F002 rejects enveloped and inline Bearer material at the real D1 boundary", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const prohibited = ["Captured configuration:\nBearer tokenonly123", "`Bearer tokenonly123`"];
      for (const [index, content] of prohibited.entries()) {
        const id = `blocked-${index}`;
        const operationId = `blocked-capture-${index}`;
        await expect(service.capture({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }), id: knowledgeItemId(id), originatingProjectId: projectId("p1"), content: text(content), intentional: true })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", id)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const predecessor = "Eligible predecessor";
      await expect(service.capture({ intent, operationId: persistenceOperationId("eligible-predecessor"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: predecessor }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      for (const [index, content] of prohibited.entries()) {
        const successorId = `blocked-successor-${index}`;
        const operationId = `blocked-correction-${index}`;
        await expect(service.correct({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: successorId, originatingProjectId: "p1", content }), prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId(successorId), originatingProjectId: projectId("p1"), content: text(content) })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", successorId)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const benign = "Bearer authentication is documented here without any token material.";
      await expect(service.capture({ intent, operationId: persistenceOperationId("benign-bearer"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "benign", originatingProjectId: "p1", content: benign }), id: knowledgeItemId("benign"), originatingProjectId: projectId("p1"), content: text(benign), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      expect(await local.read<{ content: string }>("SELECT content FROM knowledge_items WHERE id = ?", "benign")).toEqual([{ content: benign }]);
    } finally {
      await local.dispose();
    }
  });

  it("IR-F003 rejects alphabetic opaque Bearer material at the real D1 boundary", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const prohibited = ["Bearer abcdefghijklmnopqrstuvwxyz", "Captured configuration:\nBearer abcdefghijklmnopqrstuvwxyz", "`Bearer abcdefghijklmnopqrstuvwxyz`"];
      for (const [index, content] of prohibited.entries()) {
        const id = `alphabetic-${index}`;
        const operationId = `alphabetic-capture-${index}`;
        await expect(service.capture({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }), id: knowledgeItemId(id), originatingProjectId: projectId("p1"), content: text(content), intentional: true })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", id)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const predecessor = "Eligible predecessor";
      await expect(service.capture({ intent, operationId: persistenceOperationId("alphabetic-predecessor"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: predecessor }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      for (const [index, content] of prohibited.entries()) {
        const successorId = `alphabetic-successor-${index}`;
        const operationId = `alphabetic-correction-${index}`;
        await expect(service.correct({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: successorId, originatingProjectId: "p1", content }), prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId(successorId), originatingProjectId: projectId("p1"), content: text(content) })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", successorId)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const benign = "Bearer authentication is documented here without any token material.";
      await expect(service.capture({ intent, operationId: persistenceOperationId("alphabetic-benign"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "benign", originatingProjectId: "p1", content: benign }), id: knowledgeItemId("benign"), originatingProjectId: projectId("p1"), content: text(benign), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      expect(await local.read<{ content: string }>("SELECT content FROM knowledge_items WHERE id = ?", "benign")).toEqual([{ content: benign }]);
    } finally {
      await local.dispose();
    }
  });

  it("IR-F004 rejects embedded inline-code Bearer material at the real D1 boundary", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const prohibited = ["The credential is `Bearer abcdefghijklmnopqrstuvwxyz`.", "Use `Bearer tokenonly123` for this configuration."];
      for (const [index, content] of prohibited.entries()) {
        const id = `embedded-${index}`;
        const operationId = `embedded-capture-${index}`;
        await expect(service.capture({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }), id: knowledgeItemId(id), originatingProjectId: projectId("p1"), content: text(content), intentional: true })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", id)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const predecessor = "Eligible predecessor";
      await expect(service.capture({ intent, operationId: persistenceOperationId("embedded-predecessor"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: predecessor }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
      for (const [index, content] of prohibited.entries()) {
        const successorId = `embedded-successor-${index}`;
        const operationId = `embedded-correction-${index}`;
        await expect(service.correct({ intent, operationId: persistenceOperationId(operationId), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: successorId, originatingProjectId: "p1", content }), prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId(successorId), originatingProjectId: projectId("p1"), content: text(content) })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", successorId)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }
    } finally {
      await local.dispose();
    }
  });

  it("IR-F005 rejects plural credential and token assignment labels at the real D1 boundary", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({
        operationId: persistenceOperationId("project"),
        writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }],
      });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const prohibited = [
        "credentials=synthetic-credential-value",
        "credentials: synthetic-credential-value",
        "access_tokens=synthetic-access-token",
        "access_tokens: synthetic-access-token",
        "auth_tokens=synthetic-auth-token",
        "auth_tokens: synthetic-auth-token",
        "passwords=synthetic-password-value",
        "passphrases=synthetic-passphrase-value",
        "auth_secrets=synthetic-auth-secret",
        "authentication_secrets=synthetic-authentication-secret",
        "client_secrets=synthetic-client-secret",
      ];
      for (const [index, content] of prohibited.entries()) {
        const id = `plural-${index}`;
        const operationId = `plural-capture-${index}`;
        await expect(
          service.capture({
            intent,
            operationId: persistenceOperationId(operationId),
            authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }),
            id: knowledgeItemId(id),
            originatingProjectId: projectId("p1"),
            content: text(content),
            intentional: true,
          }),
        ).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", id)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }

      const benign = [
        "The credentials policy is documented here.",
        "Access tokens are documented in the authentication guide.",
      ];
      for (const [index, content] of benign.entries()) {
        const id = `benign-plural-${index}`;
        const operationId = `benign-plural-capture-${index}`;
        await expect(
          service.capture({
            intent,
            operationId: persistenceOperationId(operationId),
            authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }),
            id: knowledgeItemId(id),
            originatingProjectId: projectId("p1"),
            content: text(content),
            intentional: true,
          }),
        ).resolves.toMatchObject({ kind: "accepted" });
        expect(await local.read<{ content: string }>("SELECT content FROM knowledge_items WHERE id = ?", id)).toEqual([{ content }]);
      }

      const predecessor = "Eligible predecessor";
      await expect(
        service.capture({
          intent,
          operationId: persistenceOperationId("plural-predecessor"),
          authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: predecessor }),
          id: knowledgeItemId("k1"),
          originatingProjectId: projectId("p1"),
          content: text(predecessor),
          intentional: true,
        }),
      ).resolves.toMatchObject({ kind: "accepted" });
      for (const [index, content] of prohibited.entries()) {
        const successorId = `plural-successor-${index}`;
        const operationId = `plural-correction-${index}`;
        await expect(
          service.correct({
            intent,
            operationId: persistenceOperationId(operationId),
            authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: successorId, originatingProjectId: "p1", content }),
            prior: { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text(predecessor), standing: "current", supersessionChain: [] },
            successorId: knowledgeItemId(successorId),
            originatingProjectId: projectId("p1"),
            content: text(content),
          }),
        ).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
        expect(await local.read<{ standing: string }>("SELECT standing FROM knowledge_items WHERE id = ?", "k1")).toEqual([{ standing: "current" }]);
        expect(await local.read("SELECT id FROM knowledge_items WHERE id = ?", successorId)).toEqual([]);
        expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id = ?", operationId)).toEqual([]);
      }
    } finally {
      await local.dispose();
    }
  });

  it("V001 proves real-D1 operation-ID conflict cannot inherit acceptance", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const first = { intent, operationId: persistenceOperationId("same-capture-id"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "first", originatingProjectId: "p1", content: "First accepted" }), id: knowledgeItemId("first"), originatingProjectId: projectId("p1"), content: text("First accepted"), intentional: true };
      await expect(service.capture(first)).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.capture({ ...first, authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "second", originatingProjectId: "p1", content: "Different semantic input" }), id: knowledgeItemId("second"), content: text("Different semantic input") })).resolves.toMatchObject({ kind: "failed", reason: "operation-id-conflict" });
      const k1 = { intent, operationId: persistenceOperationId("capture-k1"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "k1", originatingProjectId: "p1", content: "Original" }), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Original"), intentional: true };
      await service.capture(k1);
      const prior = { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Original"), standing: "current" as const, supersessionChain: [] };
      const correction = { intent, operationId: persistenceOperationId("same-correction-id"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p1", content: "Corrected" }), prior, successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Corrected") };
      await expect(service.correct(correction)).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.correct({ ...correction, authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k2", successorKnowledgeItemId: "k3", originatingProjectId: "p1", content: "Changed semantic write" }), prior: { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Corrected"), standing: "current", supersedesId: knowledgeItemId("k1"), supersessionChain: [knowledgeItemId("k1")] }, successorId: knowledgeItemId("k3"), content: text("Changed semantic write") })).resolves.toMatchObject({ kind: "failed", reason: "operation-id-conflict" });
      expect(await local.read<{ id: string; standing: string }>("SELECT id, standing FROM knowledge_items ORDER BY id")).toEqual([
        { id: "first", standing: "current" },
        { id: "k1", standing: "superseded" },
        { id: "k2", standing: "current" },
      ]);
      expect(await local.read<{ count: number }>("SELECT COUNT(*) AS count FROM persistence_operations WHERE operation_id IN (?, ?)", "same-capture-id", "same-correction-id")).toEqual([{ count: 2 }]);
      expect(await local.read("SELECT id FROM knowledge_items WHERE id IN (?, ?)", "second", "k3")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });

  it("V001 proves real D1 rejects invalid targets and Project origin while preserving a linear unrelated-item-safe chain", async () => {
    const local = await createFreshWranglerLocalD1();
    try {
      const runtime = createHumanControlRuntime();
      const persistence = new D1AcceptedStatePersistence(local.database);
      await persistence.commitAcceptedState({ operationId: persistenceOperationId("project"), writes: [{ kind: "create-project", project: { id: projectId("p1"), intendedOutcome: text("Knowledge project"), state: "Active" } }] });
      const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
      const capture = async (id: string, content: string) => service.capture({ intent, operationId: persistenceOperationId(`capture-${id}`), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content }), id: knowledgeItemId(id), originatingProjectId: projectId("p1"), content: text(content), intentional: true });
      await capture("k1", "Original");
      await capture("unrelated", "Unrelated");
      const k1 = { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Original"), standing: "current" as const, supersessionChain: [] };
      await expect(service.correct({ intent, operationId: persistenceOperationId("correct-k2"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "k2", originatingProjectId: "p1", content: "Second" }), prior: k1, successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second") })).resolves.toMatchObject({ kind: "accepted" });
      const k2 = { id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Second"), standing: "current" as const, supersedesId: knowledgeItemId("k1"), supersessionChain: [knowledgeItemId("k1")] };
      await expect(service.correct({ intent, operationId: persistenceOperationId("correct-k3"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k2", successorKnowledgeItemId: "k3", originatingProjectId: "p1", content: "Third" }), prior: k2, successorId: knowledgeItemId("k3"), originatingProjectId: projectId("p1"), content: text("Third") })).resolves.toMatchObject({ kind: "accepted" });
      await expect(service.correct({ intent, operationId: persistenceOperationId("stale-k1"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k1", successorKnowledgeItemId: "branch", originatingProjectId: "p1", content: "Branch" }), prior: k1, successorId: knowledgeItemId("branch"), originatingProjectId: projectId("p1"), content: text("Branch") })).resolves.toMatchObject({ kind: "failed", reason: "constraint-conflict" });
      await expect(service.correct({ intent, operationId: persistenceOperationId("missing-target"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "missing", successorKnowledgeItemId: "missing-successor", originatingProjectId: "p1", content: "Missing" }), prior: { id: knowledgeItemId("missing"), originatingProjectId: projectId("p1"), content: text("Missing"), standing: "current", supersessionChain: [] }, successorId: knowledgeItemId("missing-successor"), originatingProjectId: projectId("p1"), content: text("Missing") })).resolves.toMatchObject({ kind: "failed", reason: "constraint-conflict" });
      await expect(service.correct({ intent, operationId: persistenceOperationId("cycle"), authorization: authorize(runtime, { operation: "correct-knowledge", priorKnowledgeItemId: "k3", successorKnowledgeItemId: "k1", originatingProjectId: "p1", content: "Cycle" }), prior: { id: knowledgeItemId("k3"), originatingProjectId: projectId("p1"), content: text("Third"), standing: "current", supersedesId: knowledgeItemId("k2"), supersessionChain: [knowledgeItemId("k1"), knowledgeItemId("k2")] }, successorId: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Cycle") })).resolves.toMatchObject({ kind: "failed", reason: "correction-identity-cycle" });
      await expect(service.capture({ intent, operationId: persistenceOperationId("invalid-project"), authorization: authorize(runtime, { operation: "capture-knowledge", knowledgeItemId: "invalid", originatingProjectId: "missing-project", content: "Invalid origin" }), id: knowledgeItemId("invalid"), originatingProjectId: projectId("missing-project"), content: text("Invalid origin"), intentional: true })).resolves.toMatchObject({ kind: "failed", reason: "constraint-conflict" });
      expect(await local.read<{ id: string; originating_project_id: string; content: string; standing: string; supersedes_id: string | null; supersession_chain: string }>("SELECT id, originating_project_id, content, standing, supersedes_id, supersession_chain FROM knowledge_items ORDER BY id")).toEqual([
        { id: "k1", originating_project_id: "p1", content: "Original", standing: "superseded", supersedes_id: null, supersession_chain: "[]" },
        { id: "k2", originating_project_id: "p1", content: "Second", standing: "superseded", supersedes_id: "k1", supersession_chain: "[\"k1\"]" },
        { id: "k3", originating_project_id: "p1", content: "Third", standing: "current", supersedes_id: "k2", supersession_chain: "[\"k1\",\"k2\"]" },
        { id: "unrelated", originating_project_id: "p1", content: "Unrelated", standing: "current", supersedes_id: null, supersession_chain: "[]" },
      ]);
      expect(await local.read("SELECT operation_id FROM persistence_operations WHERE operation_id IN (?, ?, ?, ?)", "stale-k1", "missing-target", "cycle", "invalid-project")).toEqual([]);
    } finally {
      await local.dispose();
    }
  });
});

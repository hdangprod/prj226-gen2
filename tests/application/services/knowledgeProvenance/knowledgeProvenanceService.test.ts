import { describe, expect, it } from "vitest";
import { createHumanControlRuntime, type OrdinaryMutationScope } from "../../../../src/application/contracts/humanControl";
import { persistenceOperationId, type AcceptedStateCommit, type AcceptedStatePersistence, type PersistenceCommitResult } from "../../../../src/application/ports/persistence";
import { KnowledgeProvenanceService } from "../../../../src/application/services/knowledgeProvenance/knowledgeProvenanceService";
import { knowledgeItemId, nonEmptyText, projectId } from "../../../../src/domain/model";
import { D1AcceptedStatePersistence } from "../../../../src/infrastructure/d1/d1AcceptedStatePersistence";
import { FakeD1 } from "../../../infrastructure/d1/fakeD1";

const text = (value: string) => nonEmptyText(value)!;
const intent = { summary: "intentional knowledge mutation" };

function authorize(runtime: ReturnType<typeof createHumanControlRuntime>, scope: OrdinaryMutationScope) {
  const evidence = runtime.trustedInteractionIngress.observeInteraction(intent);
  const direction = runtime.humanControl.classifyOrdinaryDirection(evidence, scope, { target: "clear", effect: "clear" });
  if (direction.kind !== "classified-ordinary-direction") throw new Error("test setup failed");
  const authorization = runtime.humanControl.authorizeOrdinaryChange(direction, scope);
  if (authorization.kind !== "ordinary-mutation-authorization") throw new Error("test setup failed");
  return authorization;
}

function captureScope(id = "k1", content = "Ordinary note") {
  return { operation: "capture-knowledge", knowledgeItemId: id, originatingProjectId: "p1", content } as const;
}

function correctionScope(priorId = "k1", successorId = "k2", content = "Corrected note") {
  return { operation: "correct-knowledge", priorKnowledgeItemId: priorId, successorKnowledgeItemId: successorId, originatingProjectId: "p1", content } as const;
}

function prior() {
  return { id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), standing: "current" as const, supersessionChain: [] };
}

class RecordingPersistence implements AcceptedStatePersistence {
  readonly commits: AcceptedStateCommit[] = [];
  constructor(private readonly result: PersistenceCommitResult = { kind: "committed" }) {}
  async commitAcceptedState(commit: AcceptedStateCommit): Promise<PersistenceCommitResult> { this.commits.push(commit); return this.result; }
}

function seededService() {
  const runtime = createHumanControlRuntime();
  const database = new FakeD1();
  database.projects.set("p1", { intendedOutcome: "Project", state: "Active" });
  return {
    runtime,
    database,
    service: new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) }),
  };
}

function knowledgePrior(
  id: string,
  content: string,
  supersessionChain: readonly string[] = [],
  supersedesId?: string,
) {
  return {
    id: knowledgeItemId(id),
    originatingProjectId: projectId("p1"),
    content: text(content),
    standing: "current" as const,
    ...(supersedesId === undefined ? {} : { supersedesId: knowledgeItemId(supersedesId) }),
    supersessionChain: supersessionChain.map(knowledgeItemId),
  };
}

function captureCommand(
  runtime: ReturnType<typeof createHumanControlRuntime>,
  id: string,
  content: string,
  operationId = `capture-${id}`,
) {
  return {
    intent,
    operationId: persistenceOperationId(operationId),
    authorization: authorize(runtime, captureScope(id, content)),
    id: knowledgeItemId(id),
    originatingProjectId: projectId("p1"),
    content: text(content),
    intentional: true,
  };
}

function correctionCommand(
  runtime: ReturnType<typeof createHumanControlRuntime>,
  priorItem: Omit<ReturnType<typeof knowledgePrior>, "standing"> & { readonly standing: "current" | "superseded" },
  successorId: string,
  content: string,
  operationId = `correct-${successorId}`,
) {
  return {
    intent,
    operationId: persistenceOperationId(operationId),
    authorization: authorize(runtime, correctionScope(priorItem.id, successorId, content)),
    prior: priorItem,
    successorId: knowledgeItemId(successorId),
    originatingProjectId: projectId("p1"),
    content: text(content),
  };
}

describe("KnowledgeProvenanceService", () => {
  it("captures only intentional authorized Knowledge after durable success", async () => {
    const runtime = createHumanControlRuntime();
    const persistence = new RecordingPersistence();
    const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
    await expect(service.capture({ intent, operationId: persistenceOperationId("capture"), authorization: authorize(runtime, captureScope()), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), intentional: true })).resolves.toEqual({ kind: "accepted", value: { id: "k1", originatingProjectId: "p1", content: "Ordinary note", standing: "current", supersessionChain: [] } });
    expect(persistence.commits[0]?.writes).toEqual([{ kind: "put-knowledge", item: { id: "k1", originatingProjectId: "p1", content: "Ordinary note", standing: "current", supersessionChain: [] } }]);
    const casual = await service.capture({ intent, operationId: persistenceOperationId("casual"), authorization: authorize(runtime, captureScope("k2")), id: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), intentional: false });
    expect(casual).toMatchObject({ kind: "failed", reason: "capture-not-intentional" });
    expect(persistence.commits).toHaveLength(1);
  });

  it("rejects authentication material without a write or receipt while allowing ordinary explanatory prose", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    database.projects.set("p1", { intendedOutcome: "Project", state: "Active" });
    const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    const prohibitedContent = "-----BEGIN PRIVATE KEY-----\\nsynthetic fixture marker";
    await expect(service.capture({ intent, operationId: persistenceOperationId("private-key"), authorization: authorize(runtime, captureScope("private", prohibitedContent)), id: knowledgeItemId("private"), originatingProjectId: projectId("p1"), content: text(prohibitedContent), intentional: true })).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    expect(database.knowledge.size).toBe(0);
    expect(database.receipts.has("private-key")).toBe(false);
    const prose = "Document how to rotate an access token and never write a password in a note.";
    await expect(service.capture({ intent, operationId: persistenceOperationId("prose"), authorization: authorize(runtime, captureScope("prose", prose)), id: knowledgeItemId("prose"), originatingProjectId: projectId("p1"), content: text(prose), intentional: true })).resolves.toMatchObject({ kind: "accepted" });
    expect(database.knowledge.get("prose")?.content).toBe(prose);
  });

  it("corrects through one immutable-origin successor and keeps rejected corrections from changing current state", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    database.projects.set("p1", { intendedOutcome: "Project", state: "Active" });
    const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    await service.capture({ intent, operationId: persistenceOperationId("capture"), authorization: authorize(runtime, captureScope()), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), intentional: true });
    await expect(service.correct({ intent, operationId: persistenceOperationId("correct"), authorization: authorize(runtime, correctionScope()), prior: prior(), successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p1"), content: text("Corrected note") })).resolves.toMatchObject({ kind: "accepted", value: { id: "k2", supersedesId: "k1", supersessionChain: ["k1"], originatingProjectId: "p1" } });
    expect(database.knowledge.get("k1")?.standing).toBe("superseded");
    expect(database.knowledge.get("k2")).toMatchObject({ standing: "current", supersedesId: "k1", originatingProjectId: "p1" });
    const prohibited = "access_token=synthetic-value";
    await expect(service.correct({ intent, operationId: persistenceOperationId("blocked-correction"), authorization: authorize(runtime, correctionScope("k2", "k3", prohibited)), prior: { ...prior(), id: knowledgeItemId("k2"), content: text("Corrected note"), supersedesId: knowledgeItemId("k1"), supersessionChain: [knowledgeItemId("k1")] }, successorId: knowledgeItemId("k3"), originatingProjectId: projectId("p1"), content: text(prohibited) })).resolves.toMatchObject({ kind: "prohibited" });
    expect(database.knowledge.has("k3")).toBe(false);
    expect(database.knowledge.get("k2")?.standing).toBe("current");
    expect(database.receipts.has("blocked-correction")).toBe(false);
  });

  it("uses persistence as the authority for retries, collisions, lineage, and durable failure", async () => {
    const runtime = createHumanControlRuntime();
    const database = new FakeD1();
    database.projects.set("p1", { intendedOutcome: "Project", state: "Active" });
    const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence: new D1AcceptedStatePersistence(database) });
    const capture = { intent, operationId: persistenceOperationId("capture"), authorization: authorize(runtime, captureScope()), id: knowledgeItemId("k1"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), intentional: true };
    await expect(service.capture(capture)).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.capture(capture)).resolves.toMatchObject({ kind: "accepted" });
    expect(database.knowledge.size).toBe(1);
    expect(database.receipts.size).toBe(1);
    await expect(service.capture({ ...capture, authorization: authorize(runtime, captureScope("k1", "Changed")), content: text("Changed") })).resolves.toMatchObject({ kind: "failed", reason: "operation-id-conflict" });
    await expect(service.correct({ intent, operationId: persistenceOperationId("bad-origin"), authorization: authorize(runtime, { ...correctionScope("k1", "k2", "Corrected"), originatingProjectId: "p2" }), prior: prior(), successorId: knowledgeItemId("k2"), originatingProjectId: projectId("p2"), content: text("Corrected") })).resolves.toMatchObject({ kind: "failed", reason: "correction-origin-mismatch" });
    const failing = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence: new RecordingPersistence({ kind: "persistence-failed", reason: "durability-failure", retryable: true }) });
    await expect(failing.capture({ intent, operationId: persistenceOperationId("failed"), authorization: authorize(runtime, captureScope("failed")), id: knowledgeItemId("failed"), originatingProjectId: projectId("p1"), content: text("Ordinary note"), intentional: true })).resolves.toMatchObject({ kind: "failed", reason: "durability-failure", retryable: true });
  });

  it("V001 rejects missing and wrong correction authorization without a successor, receipt, or commit", async () => {
    const { runtime, database, service } = seededService();
    await service.capture(captureCommand(runtime, "k1", "Original"));
    const current = knowledgePrior("k1", "Original");
    const missing = { ...correctionCommand(runtime, current, "k2", "Second", "missing-correction-auth"), authorization: undefined as never };
    await expect(service.correct(missing)).resolves.toMatchObject({ kind: "failed", reason: "missing-malformed-or-mismatched-authorization" });
    const captureAuthorization = authorize(runtime, captureScope("k1", "Original"));
    await expect(service.correct({ ...correctionCommand(runtime, current, "k3", "Third", "capture-auth-as-correction"), authorization: captureAuthorization })).resolves.toMatchObject({ kind: "failed", reason: "missing-malformed-or-mismatched-authorization" });
    await expect(service.correct({ ...correctionCommand(runtime, current, "k4", "Fourth", "wrong-target-auth"), authorization: authorize(runtime, correctionScope("k1", "other", "Fourth")) })).resolves.toMatchObject({ kind: "failed", reason: "missing-malformed-or-mismatched-authorization" });
    expect(database.knowledge.get("k1")?.standing).toBe("current");
    expect([...database.knowledge.keys()]).toEqual(["k1"]);
    expect(database.receipts.has("missing-correction-auth")).toBe(false);
    expect(database.receipts.has("capture-auth-as-correction")).toBe(false);
    expect(database.receipts.has("wrong-target-auth")).toBe(false);
  });

  it("V001 rejects malformed exact-target and cyclic correction inputs without persistence", async () => {
    const { runtime, database, service } = seededService();
    await service.capture(captureCommand(runtime, "k1", "Original"));
    await expect(service.correct({
      ...correctionCommand(runtime, knowledgePrior("k1", "Original"), "k2", "Second", "malformed-target"),
      prior: [knowledgePrior("k1", "Original"), knowledgePrior("k1", "Original")],
    })).resolves.toMatchObject({ kind: "failed", reason: "correction-prior-malformed" });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k1", "Cycle", "cycle"))).resolves.toMatchObject({ kind: "failed", reason: "correction-identity-cycle" });
    expect(database.knowledge.get("k1")).toMatchObject({ standing: "current", supersedesId: null, supersessionChain: "[]" });
    expect(database.knowledge.has("k2")).toBe(false);
    expect(database.receipts.has("malformed-target")).toBe(false);
    expect(database.receipts.has("cycle")).toBe(false);
  });

  it("V001 reports missing and non-current correction targets as non-accepted without false success", async () => {
    const runtime = createHumanControlRuntime();
    const persistence = new RecordingPersistence({ kind: "persistence-failed", reason: "constraint-conflict", retryable: false });
    const service = new KnowledgeProvenanceService({ mutationGate: runtime.mutationGate, persistence });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("missing", "Never persisted"), "k2", "Second", "missing-target"))).resolves.toMatchObject({ kind: "failed", reason: "constraint-conflict" });
    expect(persistence.commits).toHaveLength(1);
    const stale = { ...knowledgePrior("k1", "Original"), standing: "superseded" as const };
    await expect(service.correct(correctionCommand(runtime, stale, "k2", "Second", "non-current"))).resolves.toMatchObject({ kind: "failed", reason: "correction-target-not-current" });
    expect(persistence.commits).toHaveLength(1);
  });

  it("V001 preserves origin, linear standing, and unrelated Knowledge across K1 to K2 to K3", async () => {
    const { runtime, database, service } = seededService();
    await service.capture(captureCommand(runtime, "k1", "Original"));
    await service.capture(captureCommand(runtime, "other", "Unrelated"));
    const unrelated = database.knowledge.get("other");
    const unrelatedReceipt = database.receipts.get("capture-other");
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k2", "Second"))).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k2", "Second", ["k1"], "k1"), "k3", "Third"))).resolves.toMatchObject({ kind: "accepted", value: { supersedesId: "k2", supersessionChain: ["k1", "k2"] } });
    expect(database.knowledge).toEqual(new Map([
      ["k1", { originatingProjectId: "p1", content: "Original", standing: "superseded", supersedesId: null, supersessionChain: "[]" }],
      ["other", unrelated],
      ["k2", { originatingProjectId: "p1", content: "Second", standing: "superseded", supersedesId: "k1", supersessionChain: "[\"k1\"]" }],
      ["k3", { originatingProjectId: "p1", content: "Third", standing: "current", supersedesId: "k2", supersessionChain: "[\"k1\",\"k2\"]" }],
    ]));
    expect(database.receipts.get("capture-other")).toBe(unrelatedReceipt);
  });

  it("V001 rolls back correction durability failure without a successor, partial supersession, or receipt", async () => {
    const { runtime, database, service } = seededService();
    await service.capture(captureCommand(runtime, "k1", "Original"));
    database.failBatch = new Error("injected correction durability failure");
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k2", "Second", "failed-correction"))).resolves.toMatchObject({ kind: "failed", reason: "durability-failure", retryable: true });
    expect(database.knowledge.get("k1")).toMatchObject({ standing: "current", supersedesId: null, supersessionChain: "[]" });
    expect(database.knowledge.has("k2")).toBe(false);
    expect(database.receipts.has("failed-correction")).toBe(false);
  });

  it("V001 rejects actual Bearer, credential, password, and auth-secret material while allowing explanatory prose", async () => {
    const { runtime, database, service } = seededService();
    const bearer = "Authorization: Bearer tokenonly123";
    await expect(service.capture(captureCommand(runtime, "bearer", bearer, "bearer-capture"))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    await expect(service.capture(captureCommand(runtime, "punctuated-bearer", "Authorization: Bearer synthetic-token.value", "punctuated-bearer-capture"))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    await expect(service.capture(captureCommand(runtime, "bare-bearer", "Bearer eyJsynthetic.token.value", "bare-bearer-capture"))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    const bearerProse = "Bearer authentication is documented here without any token material.";
    await expect(service.capture(captureCommand(runtime, "bearer-prose", bearerProse))).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.capture(captureCommand(runtime, "password", "password=synthetic-password"))).resolves.toMatchObject({ kind: "prohibited" });
    await expect(service.capture(captureCommand(runtime, "password-prose", "The password policy requires periodic rotation."))).resolves.toMatchObject({ kind: "accepted" });
    await service.capture(captureCommand(runtime, "k1", "Original"));
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "bearer-successor", "Authorization: Bearer tokenonly123", "bearer-correction"))).resolves.toMatchObject({ kind: "prohibited" });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k2", "credential=synthetic-credential", "credential-correction"))).resolves.toMatchObject({ kind: "prohibited" });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k3", "auth_secret=synthetic-secret", "secret-correction"))).resolves.toMatchObject({ kind: "prohibited" });
    expect(database.knowledge.get("k1")?.standing).toBe("current");
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Original"), "k4", "The documentation explains how a Bearer scheme works.", "bearer-prose-correction"))).resolves.toMatchObject({ kind: "accepted" });
    expect(database.knowledge.get("k1")?.standing).toBe("superseded");
    expect(database.knowledge.has("bearer-successor")).toBe(false);
    expect(database.knowledge.has("k2")).toBe(false);
    expect(database.knowledge.has("k3")).toBe(false);
    expect(database.receipts.has("bearer-capture")).toBe(false);
    expect(database.receipts.has("punctuated-bearer-capture")).toBe(false);
    expect(database.receipts.has("bare-bearer-capture")).toBe(false);
    expect(database.receipts.has("bearer-correction")).toBe(false);
    expect(database.receipts.has("credential-correction")).toBe(false);
    expect(database.receipts.has("secret-correction")).toBe(false);
  });

  it("IR-F001 rejects bare alphanumeric Bearer material without capture or correction state", async () => {
    const { runtime, database, service } = seededService();
    const bareBearer = "Bearer tokenonly123";
    await expect(service.capture(captureCommand(runtime, "bare-alphanumeric", bareBearer, "bare-alphanumeric-capture"))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    expect(database.knowledge.has("bare-alphanumeric")).toBe(false);
    expect(database.receipts.has("bare-alphanumeric-capture")).toBe(false);

    await expect(service.capture(captureCommand(runtime, "k1", "Eligible predecessor"))).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Eligible predecessor"), "bare-alphanumeric-successor", bareBearer, "bare-alphanumeric-correction"))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
    expect(database.knowledge.get("k1")?.standing).toBe("current");
    expect(database.knowledge.has("bare-alphanumeric-successor")).toBe(false);
    expect(database.receipts.has("bare-alphanumeric-correction")).toBe(false);
  });

  it("IR-F002 rejects standalone and simply wrapped Bearer material without persistence", async () => {
    const { runtime, database, service } = seededService();
    const prohibited = [
      "Authorization: Bearer tokenonly123",
      "Bearer synthetic-token.value",
      "Captured configuration:\nBearer tokenonly123",
      "`Bearer tokenonly123`",
    ];
    for (const [index, content] of prohibited.entries()) {
      const id = `blocked-capture-${index}`;
      const operationId = `blocked-capture-op-${index}`;
      await expect(service.capture(captureCommand(runtime, id, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.has(id)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }

    const benign = [
      "Bearer authentication is documented here without any token material.",
      "The password policy requires periodic rotation.",
      "This note explains how an access token is rotated.",
    ];
    for (const [index, content] of benign.entries()) {
      await expect(service.capture(captureCommand(runtime, `benign-${index}`, content))).resolves.toMatchObject({ kind: "accepted" });
    }

    await expect(service.capture(captureCommand(runtime, "k1", "Eligible predecessor"))).resolves.toMatchObject({ kind: "accepted" });
    for (const [index, content] of prohibited.entries()) {
      const successorId = `blocked-successor-${index}`;
      const operationId = `blocked-correction-op-${index}`;
      await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Eligible predecessor"), successorId, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.get("k1")?.standing).toBe("current");
      expect(database.knowledge.has(successorId)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }
  });

  it("IR-F003 rejects alphabetic opaque Bearer material without persistence", async () => {
    const { runtime, database, service } = seededService();
    const prohibited = [
      "Bearer abcdefghijklmnopqrstuvwxyz",
      "Captured configuration:\nBearer abcdefghijklmnopqrstuvwxyz",
      "`Bearer abcdefghijklmnopqrstuvwxyz`",
    ];
    for (const [index, content] of prohibited.entries()) {
      const id = `alphabetic-capture-${index}`;
      const operationId = `alphabetic-capture-op-${index}`;
      await expect(service.capture(captureCommand(runtime, id, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.has(id)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }

    const benign = "Bearer authentication is documented here without any token material.";
    await expect(service.capture(captureCommand(runtime, "alphabetic-benign", benign))).resolves.toMatchObject({ kind: "accepted" });
    await expect(service.capture(captureCommand(runtime, "k1", "Eligible predecessor"))).resolves.toMatchObject({ kind: "accepted" });
    for (const [index, content] of prohibited.entries()) {
      const successorId = `alphabetic-successor-${index}`;
      const operationId = `alphabetic-correction-op-${index}`;
      await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Eligible predecessor"), successorId, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.get("k1")?.standing).toBe("current");
      expect(database.knowledge.has(successorId)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }
  });

  it("IR-F004 rejects embedded inline-code Bearer material without persistence", async () => {
    const { runtime, database, service } = seededService();
    const prohibited = [
      "The credential is `Bearer abcdefghijklmnopqrstuvwxyz`.",
      "Use `Bearer tokenonly123` for this configuration.",
    ];
    for (const [index, content] of prohibited.entries()) {
      const id = `embedded-capture-${index}`;
      const operationId = `embedded-capture-op-${index}`;
      await expect(service.capture(captureCommand(runtime, id, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.has(id)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }

    await expect(service.capture(captureCommand(runtime, "k1", "Eligible predecessor"))).resolves.toMatchObject({ kind: "accepted" });
    for (const [index, content] of prohibited.entries()) {
      const successorId = `embedded-successor-${index}`;
      const operationId = `embedded-correction-op-${index}`;
      await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Eligible predecessor"), successorId, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.get("k1")?.standing).toBe("current");
      expect(database.knowledge.has(successorId)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }
  });

  it("IR-F005 rejects plural credential and token assignment labels without persistence", async () => {
    const { runtime, database, service } = seededService();
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
      const id = `plural-capture-${index}`;
      const operationId = `plural-capture-op-${index}`;
      await expect(service.capture(captureCommand(runtime, id, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.has(id)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }

    const benign = [
      "The credentials policy is documented here.",
      "Access tokens are documented in the authentication guide.",
      "This note explains how access tokens are rotated.",
      "Passwords must be at least 16 characters in policy prose.",
    ];
    for (const [index, content] of benign.entries()) {
      await expect(service.capture(captureCommand(runtime, `benign-plural-${index}`, content))).resolves.toMatchObject({ kind: "accepted" });
    }

    await expect(service.capture(captureCommand(runtime, "k1", "Eligible predecessor"))).resolves.toMatchObject({ kind: "accepted" });
    for (const [index, content] of prohibited.entries()) {
      const successorId = `plural-successor-${index}`;
      const operationId = `plural-correction-op-${index}`;
      await expect(service.correct(correctionCommand(runtime, knowledgePrior("k1", "Eligible predecessor"), successorId, content, operationId))).resolves.toMatchObject({ kind: "prohibited", reason: "authentication-material-capture" });
      expect(database.knowledge.get("k1")?.standing).toBe("current");
      expect(database.knowledge.has(successorId)).toBe(false);
      expect(database.receipts.has(operationId)).toBe(false);
    }
  });
});

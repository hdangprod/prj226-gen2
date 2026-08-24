import { describe, expect, it } from "vitest";
import {
  createBoundedModelContext,
  createModelCapabilityRequest,
} from "../../../../src/application/ports/model/modelCapability";
import { nonEmptyText } from "../../../../src/domain/model";
import { WorkersAiModelAdapter } from "../../../../src/infrastructure/adapters/model/workersAiModelAdapter";
import {
  DEFAULT_WORKERS_AI_MODEL,
  RESULT_SCHEMA,
  WORKERS_AI_SYSTEM_MESSAGE,
} from "../../../../src/infrastructure/adapters/model/workersAiTypes";
import { FakeWorkersAiBinding } from "./fakeWorkersAiBinding";

function text(value: string) {
  const result = nonEmptyText(value);
  if (result === undefined) throw new Error("fixture text must be non-empty");
  return result;
}

function request(constraints?: readonly string[]) {
  const context = createBoundedModelContext({
    items: [{
      kind: "knowledge-excerpt",
      knowledgeItemId: "k-1" as never,
      originatingProjectId: "p-1" as never,
      excerpt: text("Tiếng Việt \uD83D\uDE80"),
      relevance: text("needed"),
      currentness: "qualified-prior",
      qualification: text("older but applicable"),
    }],
    itemLimit: 1,
    selectionReason: text("Selected by the application"),
  });
  if (context.kind !== "bounded-context") throw new Error("expected context");
  const result = createModelCapabilityRequest({
    capability: "propose-operations",
    interaction: text("Lập kế hoạch\u0301 \uD83D\uDE80"),
    context: context.value,
    constraints: constraints?.map(text),
  });
  if (result.kind !== "model-request") throw new Error("expected request");
  return result.value;
}

function toolResponse(argumentsValue: unknown) {
  return { tool_calls: [{ name: "liam_model_result", arguments: argumentsValue }] };
}

const malformed = {
  kind: "failure",
  failure: {
    category: "malformed-result",
    retryable: false,
    message: "The model capability returned a malformed result.",
  },
};

describe("WorkersAiModelAdapter", () => {
  it("constructs the exact deterministic request and invokes the binding once", async () => {
    const binding = new FakeWorkersAiBinding(toolResponse({ kind: "advisory", content: "Dùng bước nhỏ" }));
    const adapter = new WorkersAiModelAdapter(binding);

    await expect(adapter.execute(request(["Keep it reversible"]))).resolves.toMatchObject({
      kind: "advisory",
      content: "Dùng bước nhỏ",
    });

    expect(binding.invocations).toHaveLength(1);
    const invocation = binding.invocations[0];
    expect(invocation.model).toBe(DEFAULT_WORKERS_AI_MODEL);
    expect(Object.keys(invocation.input)).toEqual(["messages", "tools"]);
    expect(invocation.input.messages).toEqual([
      { role: "system", content: WORKERS_AI_SYSTEM_MESSAGE },
      { role: "user", content: expect.any(String) },
    ]);
    expect(Object.keys(invocation.input.messages[0])).toEqual(["role", "content"]);
    expect(Object.keys(invocation.input.messages[1])).toEqual(["role", "content"]);
    expect(JSON.parse(invocation.input.messages[1].content)).toEqual({
      capability: "propose-operations",
      interaction: "Lập kế hoạch\u0301 \uD83D\uDE80",
      context: {
        items: [{
          kind: "knowledge-excerpt",
          knowledgeItemId: "k-1",
          originatingProjectId: "p-1",
          excerpt: "Tiếng Việt \uD83D\uDE80",
          relevance: "needed",
          currentness: "qualified-prior",
          qualification: "older but applicable",
        }],
        itemLimit: 1,
        selectionReason: "Selected by the application",
      },
      constraints: ["Keep it reversible"],
    });
    expect(invocation.input.messages[1].content.startsWith("{\"capability\":\"propose-operations\",\"interaction\":")).toBe(true);
    expect(invocation.input.tools).toEqual([{
      type: "function",
      function: {
        name: "liam_model_result",
        description: "Return one provider-local Liam model result.",
        parameters: RESULT_SCHEMA,
      },
    }]);
  });

  it("omits undefined constraints, accepts a configured model, and preserves Unicode", async () => {
    const binding = new FakeWorkersAiBinding(toolResponse(JSON.stringify({ kind: "advisory", content: "Xin chào \uD83D\uDE80" })));
    const result = await new WorkersAiModelAdapter(binding, "chosen-model").execute(request());
    expect(binding.invocations[0].model).toBe("chosen-model");
    expect(JSON.parse(binding.invocations[0].input.messages[1].content)).not.toHaveProperty("constraints");
    expect(result).toEqual({ kind: "advisory", content: "Xin chào \uD83D\uDE80" });
    expect(Object.isFrozen(result)).toBe(true);
  });

  it.each([
    ["create-project", [{ kind: "create-project", intendedOutcome: "Outcome" }]],
    ["create-action", [{ kind: "create-action", projectId: "p", description: "Action" }]],
    ["complete-action", [{ kind: "complete-action", projectId: "p", actionId: "a" }]],
    ["reopen-action", [{ kind: "reopen-action", projectId: "p", actionId: "a" }]],
    ["complete-project", [{ kind: "complete-project", projectId: "p" }]],
    ["reopen-project", [{ kind: "reopen-project", projectId: "p" }]],
    ["record-progress without action", [{ kind: "record-progress", projectId: "p", statement: "Progress" }]],
    ["record-progress with action", [{ kind: "record-progress", projectId: "p", actionId: "a", statement: "Progress" }]],
    ["capture-knowledge", [{ kind: "capture-knowledge", originatingProjectId: "p", content: "Knowledge" }]],
    ["delete", [{ kind: "delete", target: "knowledge-item", targetId: "k" }]],
  ])("reconstructs inert proposed operation %s from a fresh frozen snapshot", async (_name, operations) => {
    const raw = { kind: "proposal", summary: "Candidate", operations, providerSecret: "nope" };
    const result = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse(raw))).execute(request());
    expect(result).toMatchObject({ kind: "proposal", summary: "Candidate", operations });
    expect(result).not.toBe(raw);
    expect(result).not.toHaveProperty("providerSecret");
    if (result.kind === "proposal") {
      expect(Object.isFrozen(result.operations)).toBe(true);
      expect(Object.isFrozen(result.operations[0])).toBe(true);
      expect(result.operations[0]).not.toBe(operations[0]);
    }
  });

  it("reconstructs uncertain and unable branches with optional fields absent", async () => {
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "uncertain", reason: "Ambiguous" }))).execute(request()))
      .resolves.toEqual({ kind: "uncertain", reason: "Ambiguous" });
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "unable", reason: "No context" }))).execute(request()))
      .resolves.toEqual({ kind: "unable", reason: "No context" });
  });

  it.each([
    [{}, "missing tool calls"],
    [{ tool_calls: [] }, "zero calls"],
    [{ tool_calls: [{ name: "liam_model_result", arguments: {} }, { name: "liam_model_result", arguments: {} }] }, "multiple calls"],
    [toolResponse({ kind: "failure" }), "provider failure result"],
    [toolResponse({ kind: "advisory", content: "   " }), "whitespace text"],
    [toolResponse({ kind: "proposal", operations: [{ kind: "delete", target: "wrong", targetId: "id" }] }), "invalid operation"],
    [{ choices: [{ tool_calls: [{ name: "liam_model_result", arguments: { kind: "advisory", content: "no" } }] }] }, "alternate wrapper"],
    [toolResponse("```json {not json}"), "prose arguments"],
  ])("normalizes malformed provider structures: %s", async (response, label) => {
    expect(typeof label).toBe("string");
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(response)).execute(request())).resolves.toEqual(malformed);
  });

  it("rejects inherited required fields and null optionals without copying provider metadata", async () => {
    const inherited = Object.create({ tool_calls: [{ name: "liam_model_result", arguments: { kind: "advisory", content: "no" } }] });
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(inherited)).execute(request())).resolves.toEqual(malformed);
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "uncertain", reason: "why", content: null }))).execute(request())).resolves.toEqual(malformed);
  });

  it("ENG-009-DV-R001 rejects an array-shaped outer response even with own valid tool_calls", async () => {
    const outer = [] as unknown as unknown[] & Record<string, unknown>;
    outer.tool_calls = [{ name: "liam_model_result", arguments: { kind: "advisory", content: "must not rescue" } }];

    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(outer)).execute(request()))
      .resolves.toEqual(malformed);
  });

  it("ENG-009-DV-R001 rejects an array-shaped sole tool call even with own valid fields", async () => {
    const call = [] as unknown as unknown[] & Record<string, unknown>;
    call.name = "liam_model_result";
    call.arguments = { kind: "advisory", content: "must not rescue" };

    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding({ tool_calls: [call] })).execute(request()))
      .resolves.toEqual(malformed);
  });

  it("ENG-009-SR-R001 rejects an inherited tool-call array entry", async () => {
    const toolCalls = new Array(1) as unknown[];
    Object.setPrototypeOf(toolCalls, { 0: { name: "liam_model_result", arguments: { kind: "advisory", content: "inherited" } } });

    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding({ tool_calls: toolCalls })).execute(request()))
      .resolves.toEqual(malformed);
  });

  it("ENG-009-SR-R001 rejects inherited proposal operations and sparse required holes", async () => {
    const inheritedOperations = new Array(1) as unknown[];
    Object.setPrototypeOf(inheritedOperations, { 0: { kind: "create-project", intendedOutcome: "inherited" } });
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "proposal", operations: inheritedOperations }))).execute(request()))
      .resolves.toEqual(malformed);

    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "proposal", operations: new Array(1) }))).execute(request()))
      .resolves.toEqual(malformed);
  });

  it.each([
    [429, "rate-limited", true], [408, "timeout", true], [504, "timeout", true],
    [500, "unavailable", true], [502, "unavailable", true], [503, "unavailable", true],
    [400, "invalid-request", false], [401, "invalid-request", false], [404, "invalid-request", false], [422, "invalid-request", false],
    [403, "refused", false], [418, "unknown", false],
  ])("normalizes numeric status %s", async (status, category, retryable) => {
    const result = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject({ status }))).execute(request());
    expect(result).toMatchObject({ kind: "failure", failure: { category, retryable } });
  });

  it("honors status precedence, equal signals, AbortError, and sanitizes arbitrary thrown values", async () => {
    const equal = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject({ status: 429, statusCode: 429 }))).execute(request());
    expect(equal).toMatchObject({ kind: "failure", failure: { category: "rate-limited", retryable: true } });
    let nameReads = 0;
    const conflicting = { status: 400, statusCode: 500 } as Record<string, unknown>;
    Object.defineProperty(conflicting, "name", { get: () => { nameReads += 1; return "TimeoutError"; } });
    const conflict = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject(conflicting))).execute(request());
    expect(conflict).toMatchObject({ kind: "failure", failure: { category: "unknown", retryable: false } });
    expect(nameReads).toBe(0);
    const abort = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject({ name: "AbortError" }))).execute(request());
    expect(abort).toMatchObject({ kind: "failure", failure: { category: "timeout", retryable: true } });
    const arbitrary = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject("secret diagnostic"))).execute(request());
    expect(arbitrary).toEqual({ kind: "failure", failure: { category: "unknown", retryable: false, message: "The model capability failed." } });
  });

  it("fails invalid local configuration before provider invocation", async () => {
    const binding = new FakeWorkersAiBinding(toolResponse({ kind: "advisory", content: "never" }));
    const result = await new WorkersAiModelAdapter(binding, " ").execute(request());
    expect(result).toEqual({ kind: "failure", failure: { category: "invalid-request", retryable: false, message: "The model request or adapter configuration is invalid." } });
    expect(binding.invocations).toHaveLength(0);
  });

  it("contains throwing getters and consumes changing provider fields once", async () => {
    const throwing = {} as Record<string, unknown>;
    Object.defineProperty(throwing, "tool_calls", { enumerable: true, get: () => { throw new Error("secret"); } });
    await expect(new WorkersAiModelAdapter(new FakeWorkersAiBinding(throwing)).execute(request())).resolves.toEqual(malformed);

    let contentReads = 0;
    const argumentsValue = { kind: "advisory" } as Record<string, unknown>;
    Object.defineProperty(argumentsValue, "content", {
      enumerable: true,
      get: () => { contentReads += 1; return contentReads === 1 ? "first" : "secret second"; },
    });
    const result = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse(argumentsValue))).execute(request());
    expect(result).toEqual({ kind: "advisory", content: "first" });
    expect(contentReads).toBe(1);
  });

  it("reads each contractually consumed Proxy property once and retains no provider identity", async () => {
    const reads = new Map<string, number>();
    const count = (property: PropertyKey) => {
      const key = String(property);
      reads.set(key, (reads.get(key) ?? 0) + 1);
    };
    const argumentsValue = new Proxy({ kind: "advisory", content: "Snapshot" }, {
      get(target, property, receiver) { count(property); return Reflect.get(target, property, receiver); },
    });
    const call = new Proxy({ name: "liam_model_result", arguments: argumentsValue }, {
      get(target, property, receiver) { count(`call.${String(property)}`); return Reflect.get(target, property, receiver); },
    });
    const response = new Proxy({ tool_calls: [call] }, {
      get(target, property, receiver) { count(`response.${String(property)}`); return Reflect.get(target, property, receiver); },
    });
    const result = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(response)).execute(request());
    expect(result).toEqual({ kind: "advisory", content: "Snapshot" });
    expect(reads.get("response.tool_calls")).toBe(1);
    expect(reads.get("call.name")).toBe(1);
    expect(reads.get("call.arguments")).toBe(1);
    expect(reads.get("kind")).toBe(1);
    expect(reads.get("content")).toBe(1);
    expect(result).not.toBe(argumentsValue);
  });

  it("uses the first nested operation and failure status snapshots exactly once", async () => {
    let statementReads = 0;
    const operation = { kind: "record-progress", projectId: "p" } as Record<string, unknown>;
    Object.defineProperty(operation, "statement", { enumerable: true, get: () => { statementReads += 1; return statementReads === 1 ? "first" : "second"; } });
    const proposal = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(toolResponse({ kind: "proposal", operations: [operation] }))).execute(request());
    expect(proposal).toMatchObject({ kind: "proposal", operations: [{ statement: "first" }] });
    expect(statementReads).toBe(1);

    let statusReads = 0;
    const error = {} as Record<string, unknown>;
    Object.defineProperty(error, "status", { enumerable: true, get: () => { statusReads += 1; return statusReads === 1 ? 429 : 500; } });
    const result = await new WorkersAiModelAdapter(new FakeWorkersAiBinding(() => Promise.reject(error))).execute(request());
    expect(result).toMatchObject({ kind: "failure", failure: { category: "rate-limited", retryable: true } });
    expect(statusReads).toBe(1);
  });
});

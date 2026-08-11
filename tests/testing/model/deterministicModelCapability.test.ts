import { describe, expect, it } from "vitest";
import { DeterministicModelCapability } from "../../../src/testing/model/deterministicModelCapability";
import {
  createBoundedModelContext,
  createModelCapabilityRequest,
} from "../../../src/application/ports/model/modelCapability";
import { nonEmptyText } from "../../../src/domain/model";

function text(value: string) {
  const result = nonEmptyText(value);
  if (result === undefined) throw new Error("fixture text must be non-empty");
  return result;
}

const emptyContext = createBoundedModelContext({
  items: [],
  itemLimit: 0,
  selectionReason: text("No accepted context is required"),
});
if (emptyContext.kind !== "bounded-context") throw new Error("expected bounded fixture");

const requestResult = createModelCapabilityRequest({
  capability: "interpret-interaction",
  interaction: text("Summarize the options"),
  context: emptyContext.value,
});
if (requestResult.kind !== "model-request") throw new Error("expected valid request fixture");
const request = requestResult.value;

describe("DeterministicModelCapability", () => {
  it("returns configured advisory and proposal results in repeatable order", async () => {
    const advisory = { kind: "advisory", content: text("Option A is lower risk") } as const;
    const proposal = { kind: "proposal", operations: [] } as const;
    const model = new DeterministicModelCapability([advisory, proposal]);

    await expect(model.execute(request)).resolves.toBe(advisory);
    await expect(model.execute(request)).resolves.toBe(proposal);
    await expect(model.execute(request)).resolves.toBe(proposal);
    expect(model.invocations).toEqual([{ request }, { request }, { request }]);
  });

  it("simulates normalized failure without throwing or performing side effects", async () => {
    const failure = {
      kind: "failure",
      failure: { category: "unavailable", retryable: true, message: text("Temporarily unavailable") },
    } as const;
    const model = new DeterministicModelCapability([failure]);

    await expect(model.execute(request)).resolves.toBe(failure);
    expect(model.invocations).toEqual([{ request }]);
  });

  it("rejects an unconfigured double", () => {
    expect(() => new DeterministicModelCapability([])).toThrow(/at least one result/);
  });
});

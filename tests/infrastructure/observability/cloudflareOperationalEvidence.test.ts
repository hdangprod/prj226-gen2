import { describe, expect, it } from "vitest";
import {
  createOperationalEvidenceEvent,
  type OperationalEvidenceEvent,
} from "../../../src/application/ports/observability/operationalEvidence";
import {
  CloudflareOperationalEvidence,
  type CloudflareStructuredLogWriter,
} from "../../../src/infrastructure/observability/cloudflareOperationalEvidence";

describe("Cloudflare Operational Evidence Infrastructure", () => {
  it("projects only valid closed schema fields to the structured log writer", async () => {
    const written: Record<string, unknown>[] = [];
    const writer: CloudflareStructuredLogWriter = {
      log: (entry) => written.push(entry),
    };

    const emitter = new CloudflareOperationalEvidence(writer);

    const event = createOperationalEvidenceEvent({
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      operationId: "op-project-1",
      stage: "persistence",
      operationCategory: "project-mutation",
      status: "accepted",
      retryDisposition: "not-applicable",
      entityType: "project",
      durationMilliseconds: 25.5,
      inputUnits: 120,
      outputUnits: 60,
    })!;

    await emitter.emit(event);

    expect(written).toHaveLength(1);
    expect(written[0]).toEqual({
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      operationId: "op-project-1",
      stage: "persistence",
      operationCategory: "project-mutation",
      status: "accepted",
      retryDisposition: "not-applicable",
      entityType: "project",
      durationMilliseconds: 25.5,
      inputUnits: 120,
      outputUnits: 60,
    });
  });

  it("omits optional undefined fields from the projected structured entry", async () => {
    const written: Record<string, unknown>[] = [];
    const writer: CloudflareStructuredLogWriter = {
      log: (entry) => written.push(entry),
    };

    const emitter = new CloudflareOperationalEvidence(writer);

    const event = createOperationalEvidenceEvent({
      schemaVersion: 1,
      correlationId: "corr-session-2",
      requestId: "req-turn-2",
      stage: "request",
      operationCategory: "interaction",
      status: "attempted",
      retryDisposition: "not-applicable",
    })!;

    await emitter.emit(event);

    expect(written).toHaveLength(1);
    expect(written[0]).toEqual({
      schemaVersion: 1,
      correlationId: "corr-session-2",
      requestId: "req-turn-2",
      stage: "request",
      operationCategory: "interaction",
      status: "attempted",
      retryDisposition: "not-applicable",
    });
    expect(Object.prototype.hasOwnProperty.call(written[0], "operationId")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(written[0], "failureCategory")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(written[0], "entityType")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(written[0], "durationMilliseconds")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(written[0], "inputUnits")).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(written[0], "outputUnits")).toBe(false);
  });

  it("rejects forged or modified event clones at admission boundary", async () => {
    const written: Record<string, unknown>[] = [];
    const writer: CloudflareStructuredLogWriter = {
      log: (entry) => written.push(entry),
    };

    const emitter = new CloudflareOperationalEvidence(writer);

    const validEvent = createOperationalEvidenceEvent({
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      stage: "request",
      operationCategory: "interaction",
      status: "attempted",
      retryDisposition: "not-applicable",
    })!;

    // Forged clone via spread
    const forgedClone = { ...validEvent, stage: "provider" as const };
    await emitter.emit(forgedClone as unknown as OperationalEvidenceEvent);

    // Literal match without constructor registration
    const fabricatedLiteral = {
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      stage: "request",
      operationCategory: "interaction",
      status: "attempted",
      retryDisposition: "not-applicable",
    };
    await emitter.emit(fabricatedLiteral as unknown as OperationalEvidenceEvent);

    expect(written).toHaveLength(0);
  });

  it("contains synchronous writer throws without disrupting caller (fail-open)", async () => {
    const throwingWriter: CloudflareStructuredLogWriter = {
      log: () => {
        throw new Error("Simulated Cloudflare stdout pipe write error");
      },
    };

    const emitter = new CloudflareOperationalEvidence(throwingWriter);

    const validEvent = createOperationalEvidenceEvent({
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      stage: "request",
      operationCategory: "interaction",
      status: "attempted",
      retryDisposition: "not-applicable",
    })!;

    await expect(emitter.emit(validEvent)).resolves.toBeUndefined();
  });
});

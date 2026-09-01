import { describe, expect, it } from "vitest";
import {
  createObservationContext,
  createOperationalEvidenceEvent,
  isConstructorIssuedEvent,
  isProvenanceObservationContext,
  isValidOpaqueId,
  validateOpaqueId,
} from "../../../../src/application/ports/observability/operationalEvidence";

describe("Operational Evidence Port Contract & Invariants", () => {
  describe("TC-04 / TC-05: 5-Family Opaque Identifier Grammar", () => {
    it("accepts valid identifiers across all five bounded grammar families", () => {
      const validIds = [
        // 1. Canonical UUID (RFC-4122)
        "123e4567-e89b-12d3-a456-426614174000",
        "c0a80101-0000-4000-8000-000000000001",
        "A987FBC9-4BED-4278-9B0A-A968C21D840F",

        // 2. Compact machine identifiers
        "p1",
        "p100",
        "a42",
        "g7",
        "k99",
        "corr12345",
        "req9876",
        "op555",
        "id1",

        // 3. Structured correlation identifiers
        "corr-session-123",
        "corr:session:456",
        "corr_interaction_789",
        "corr.999",

        // 4. Structured request identifiers
        "req-turn-1",
        "req:request:42",
        "req_turn_100",
        "req.5",

        // 5. Structured operation identifiers
        "op-project-1",
        "op:action:2",
        "op_context_3",
        "op-progress-4",
        "op:knowledge:5",
        "op-export-6",
        "op:deletion:7",
        "op_interaction_8",
        "op-advisory-9",
        "op:proposal:10",
        "op-retrieval-11",
        "op:mixed:12",
        "op-p-1",
        "op:a:2",
        "op_ctx_3",
        "op-pr-4",
        "op:k:5",
        "op-klin-6",
      ];

      for (const id of validIds) {
        expect(isValidOpaqueId(id), `Expected valid ID: ${id}`).toBe(true);
        expect(validateOpaqueId(id)).toBe(id);
      }
    });

    it("rejects invalid, credential-shaped, non-whitelisted, and out-of-bounds identifiers", () => {
      const invalidIds = [
        "",
        "   ",
        null,
        undefined,
        123,
        {},
        [],
        // Too long (>128 chars)
        "p" + "1".repeat(129),
        // Invalid starting characters
        "-invalid-start",
        "_invalid-start",
        ":invalid-start",
        // Prohibited characters
        "id with spaces",
        "id<with>brackets",
        "id@with@symbols",
        "id$with$dollars",
        "id#with#hash",
        // Credential material
        "Bearer synthetic-token-value-12345",
        "password=secret-password",
        "api_key=1234567890abcdef",
        "-----BEGIN PRIVATE KEY-----",
        // Unapproved arbitrary free-text prefixes
        "custom-prefix-123",
        "unknown_entity_456",
        "some-random-text",
      ];

      for (const id of invalidIds) {
        expect(isValidOpaqueId(id), `Expected invalid ID: ${String(id)}`).toBe(false);
        expect(validateOpaqueId(id)).toBeUndefined();
      }
    });
  });

  describe("TC-01 / TC-02 / R3-TC-01: Exact-Object Provenance & Immutable Branding", () => {
    it("issues frozen ObservationContext registered in WeakSet provenance", () => {
      const context = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        operationId: "op-project-1",
      });

      expect(context).toBeDefined();
      expect(isProvenanceObservationContext(context)).toBe(true);
      expect(Object.isFrozen(context)).toBe(true);
      expect(context?.correlationId).toBe("corr-session-1");
      expect(context?.requestId).toBe("req-turn-1");
      expect(context?.operationId).toBe("op-project-1");
    });

    it("rejects forged or cloned ObservationContext objects", () => {
      const validContext = createObservationContext({
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      })!;

      // Cloned via spread
      const spreadClone = { ...validContext };
      expect(isProvenanceObservationContext(spreadClone)).toBe(false);

      // Cloned via Object.assign
      const assignClone = Object.assign({}, validContext);
      expect(isProvenanceObservationContext(assignClone)).toBe(false);

      // Fabricated literal matching interface
      const fabricated = {
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
      };
      expect(isProvenanceObservationContext(fabricated)).toBe(false);
      expect(isProvenanceObservationContext(null)).toBe(false);
      expect(isProvenanceObservationContext(undefined)).toBe(false);
      expect(isProvenanceObservationContext("string")).toBe(false);
    });

    it("rejects unknown properties on ObservationContext input", () => {
      const withExtra = {
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        extraProperty: "unauthorized-bag",
      };
      expect(createObservationContext(withExtra as unknown as Parameters<typeof createObservationContext>[0])).toBeUndefined();
    });

    it("issues frozen OperationalEvidenceEvent registered in WeakSet provenance", () => {
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
        durationMilliseconds: 15.5,
        inputUnits: 100,
        outputUnits: 50,
      });

      expect(event).toBeDefined();
      expect(isConstructorIssuedEvent(event)).toBe(true);
      expect(Object.isFrozen(event)).toBe(true);
      expect(event?.schemaVersion).toBe(1);
    });

    it("rejects forged or cloned OperationalEvidenceEvent objects", () => {
      const validEvent = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "request",
        operationCategory: "interaction",
        status: "attempted",
        retryDisposition: "not-applicable",
      })!;

      // Cloned via spread
      const spreadClone = { ...validEvent };
      expect(isConstructorIssuedEvent(spreadClone)).toBe(false);

      // Cloned via Object.assign
      const assignClone = Object.assign({}, validEvent);
      expect(isConstructorIssuedEvent(assignClone)).toBe(false);

      // Fabricated literal matching interface
      const fabricated = {
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "request",
        operationCategory: "interaction",
        status: "attempted",
        retryDisposition: "not-applicable",
      };
      expect(isConstructorIssuedEvent(fabricated)).toBe(false);
      expect(isConstructorIssuedEvent(null)).toBe(false);
      expect(isConstructorIssuedEvent(undefined)).toBe(false);
    });
  });

  describe("TC-01 / TC-19: Closed Enums and Property Strictness", () => {
    const baseValid = {
      schemaVersion: 1,
      correlationId: "corr-session-1",
      requestId: "req-turn-1",
      stage: "user-visible" as const,
      operationCategory: "interaction" as const,
      status: "succeeded" as const,
      retryDisposition: "not-applicable" as const,
    };

    it("rejects unknown properties / arbitrary metadata bags", () => {
      const eventWithBag = {
        ...baseValid,
        attributes: { arbitrary: "data" },
      };
      expect(createOperationalEvidenceEvent(eventWithBag)).toBeUndefined();

      const eventWithMetadata = {
        ...baseValid,
        metadata: { userId: "user-123" },
      };
      expect(createOperationalEvidenceEvent(eventWithMetadata)).toBeUndefined();

      const eventWithPayload = {
        ...baseValid,
        payload: "sensitive secret",
      };
      expect(createOperationalEvidenceEvent(eventWithPayload)).toBeUndefined();
    });

    it("rejects invalid schema version", () => {
      expect(createOperationalEvidenceEvent({ ...baseValid, schemaVersion: 2 })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, schemaVersion: 0 })).toBeUndefined();
    });

    it("rejects unknown enum values", () => {
      expect(createOperationalEvidenceEvent({ ...baseValid, stage: "unknown-stage" })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, operationCategory: "unknown-cat" })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, status: "unknown-status" })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, retryDisposition: "unknown-disposition" })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, entityType: "unknown-entity" })).toBeUndefined();
      expect(
        createOperationalEvidenceEvent({
          ...baseValid,
          status: "failed",
          failureCategory: "unknown-failure",
          retryDisposition: "non-retryable",
        }),
      ).toBeUndefined();
    });

    it("validates diagnostic numeric metrics strictly (non-negative finite numbers)", () => {
      expect(createOperationalEvidenceEvent({ ...baseValid, durationMilliseconds: -1 })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, durationMilliseconds: Infinity })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, durationMilliseconds: NaN })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, inputUnits: -5 })).toBeUndefined();
      expect(createOperationalEvidenceEvent({ ...baseValid, outputUnits: -10 })).toBeUndefined();

      const validMetrics = createOperationalEvidenceEvent({
        ...baseValid,
        durationMilliseconds: 0,
        inputUnits: 10,
        outputUnits: 20,
      });
      expect(validMetrics).toBeDefined();
    });
  });

  describe("TC-01 / R3-TC-02: Cross-Field Semantic Invariants", () => {
    it("enforces failureCategory is undefined for non-failed statuses", () => {
      const nonFailedStatuses = [
        "attempted",
        "succeeded",
        "advisory",
        "proposed",
        "accepted",
        "duplicate",
        "not-applicable",
      ] as const;

      for (const status of nonFailedStatuses) {
        // Valid without failureCategory
        const valid = createOperationalEvidenceEvent({
          schemaVersion: 1,
          correlationId: "corr-session-1",
          requestId: "req-turn-1",
          stage: "user-visible",
          operationCategory: "interaction",
          status,
          retryDisposition: "not-applicable",
        });
        expect(valid, `Expected status ${status} to be valid`).toBeDefined();

        // Invalid with failureCategory
        const invalid = createOperationalEvidenceEvent({
          schemaVersion: 1,
          correlationId: "corr-session-1",
          requestId: "req-turn-1",
          stage: "user-visible",
          operationCategory: "interaction",
          status,
          failureCategory: "validation",
          retryDisposition: "not-applicable",
        });
        expect(invalid, `Expected status ${status} with failureCategory to be invalid`).toBeUndefined();
      }
    });

    it("enforces partial status invariants (mixed-outcome and non-retryable)", () => {
      const valid = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "partial",
        failureCategory: "mixed-outcome",
        retryDisposition: "non-retryable",
      });
      expect(valid).toBeDefined();

      const invalidCategory = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "partial",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      expect(invalidCategory).toBeUndefined();

      const invalidRetry = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "partial",
        failureCategory: "mixed-outcome",
        retryDisposition: "explicit-retry-eligible",
      });
      expect(invalidRetry).toBeUndefined();
    });

    it("enforces denied status invariants (authorization-denied or prohibited-input, non-retryable)", () => {
      const validAuthDenied = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "authorization",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      expect(validAuthDenied).toBeDefined();

      const validProhibited = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "user-visible",
        operationCategory: "interaction",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      expect(validProhibited).toBeDefined();

      const invalidFailureCat = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "user-visible",
        operationCategory: "interaction",
        status: "denied",
        failureCategory: "constraint-conflict",
        retryDisposition: "non-retryable",
      });
      expect(invalidFailureCat).toBeUndefined();
    });

    it("enforces indeterminate status invariants (persistence-indeterminate, indeterminate-manual-check)", () => {
      const valid = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "persistence",
        operationCategory: "deletion",
        status: "indeterminate",
        failureCategory: "persistence-indeterminate",
        retryDisposition: "indeterminate-manual-check",
      });
      expect(valid).toBeDefined();

      const invalidDisposition = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "persistence",
        operationCategory: "deletion",
        status: "indeterminate",
        failureCategory: "persistence-indeterminate",
        retryDisposition: "non-retryable",
      });
      expect(invalidDisposition).toBeUndefined();
    });

    it("enforces stage vs failureCategory legality", () => {
      // request stage cannot have failureCategory
      expect(
        createOperationalEvidenceEvent({
          schemaVersion: 1,
          correlationId: "corr-session-1",
          requestId: "req-turn-1",
          stage: "request",
          operationCategory: "interaction",
          status: "failed",
          failureCategory: "validation",
          retryDisposition: "non-retryable",
        }),
      ).toBeUndefined();

      // derived-state stage cannot have failureCategory
      expect(
        createOperationalEvidenceEvent({
          schemaVersion: 1,
          correlationId: "corr-session-1",
          requestId: "req-turn-1",
          stage: "derived-state",
          operationCategory: "project-mutation",
          status: "failed",
          failureCategory: "validation",
          retryDisposition: "non-retryable",
        }),
      ).toBeUndefined();

      // provider stage only allows provider failure categories
      const validProvider = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "provider",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "provider-timeout",
        retryDisposition: "explicit-retry-eligible",
      });
      expect(validProvider).toBeDefined();

      const invalidProvider = createOperationalEvidenceEvent({
        schemaVersion: 1,
        correlationId: "corr-session-1",
        requestId: "req-turn-1",
        stage: "provider",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "constraint-conflict",
        retryDisposition: "non-retryable",
      });
      expect(invalidProvider).toBeUndefined();
    });
  });
});

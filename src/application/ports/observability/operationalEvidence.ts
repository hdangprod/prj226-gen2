export type OperationalEvidenceSchemaVersion = 1;

export type OperationalEvidenceStage =
  | "request"
  | "interpretation"
  | "authorization"
  | "retrieval"
  | "persistence"
  | "derived-state"
  | "provider"
  | "user-visible";

export type OperationalEvidenceOperationCategory =
  | "interaction"
  | "advisory"
  | "proposal"
  | "project-mutation"
  | "action-mutation"
  | "context-mutation"
  | "progress-mutation"
  | "knowledge-mutation"
  | "retrieval"
  | "export"
  | "deletion"
  | "mixed-request";

export type OperationalEvidenceStatus =
  | "attempted"
  | "succeeded"
  | "advisory"
  | "proposed"
  | "accepted"
  | "duplicate"
  | "partial"
  | "denied"
  | "failed"
  | "indeterminate"
  | "clarification-required"
  | "unresolved"
  | "not-applicable";

export type OperationalEvidenceFailureCategory =
  | "validation"
  | "authorization-denied"
  | "prohibited-input"
  | "clarification-required"
  | "unresolved"
  | "not-found"
  | "constraint-conflict"
  | "operation-id-conflict"
  | "mixed-outcome"
  | "persistence-durability"
  | "persistence-indeterminate"
  | "retrieval-failed"
  | "export-read-failed"
  | "deletion-write-failed"
  | "provider-unavailable"
  | "provider-timeout"
  | "provider-rate-limited"
  | "provider-refused"
  | "provider-malformed-result"
  | "provider-invalid-request"
  | "provider-unknown"
  | "unclassified-failure";

export type OperationalEvidenceRetryDisposition =
  | "not-applicable"
  | "explicit-retry-eligible"
  | "non-retryable"
  | "indeterminate-manual-check";

export type OperationalEvidenceEntityType =
  | "project"
  | "action"
  | "accepted-context"
  | "accepted-progress"
  | "knowledge-item"
  | "knowledge-lineage";

export interface OperationalEvidenceEvent {
  readonly schemaVersion: OperationalEvidenceSchemaVersion;
  readonly correlationId: string;
  readonly requestId: string;
  readonly operationId?: string;
  readonly stage: OperationalEvidenceStage;
  readonly operationCategory: OperationalEvidenceOperationCategory;
  readonly status: OperationalEvidenceStatus;
  readonly failureCategory?: OperationalEvidenceFailureCategory;
  readonly retryDisposition: OperationalEvidenceRetryDisposition;
  readonly entityType?: OperationalEvidenceEntityType;
  readonly durationMilliseconds?: number;
  readonly inputUnits?: number;
  readonly outputUnits?: number;
}

export interface ObservationContext {
  readonly correlationId: string;
  readonly requestId: string;
  readonly operationId?: string;
}

export interface OperationalEvidenceSink {
  emit(event: OperationalEvidenceEvent): Promise<void> | void;
}

const VALID_STAGES = new Set<OperationalEvidenceStage>([
  "request",
  "interpretation",
  "authorization",
  "retrieval",
  "persistence",
  "derived-state",
  "provider",
  "user-visible",
]);

const VALID_OPERATION_CATEGORIES = new Set<OperationalEvidenceOperationCategory>([
  "interaction",
  "advisory",
  "proposal",
  "project-mutation",
  "action-mutation",
  "context-mutation",
  "progress-mutation",
  "knowledge-mutation",
  "retrieval",
  "export",
  "deletion",
  "mixed-request",
]);

const VALID_STATUSES = new Set<OperationalEvidenceStatus>([
  "attempted",
  "succeeded",
  "advisory",
  "proposed",
  "accepted",
  "duplicate",
  "partial",
  "denied",
  "failed",
  "indeterminate",
  "clarification-required",
  "unresolved",
  "not-applicable",
]);

const VALID_FAILURE_CATEGORIES = new Set<OperationalEvidenceFailureCategory>([
  "validation",
  "authorization-denied",
  "prohibited-input",
  "clarification-required",
  "unresolved",
  "not-found",
  "constraint-conflict",
  "operation-id-conflict",
  "mixed-outcome",
  "persistence-durability",
  "persistence-indeterminate",
  "retrieval-failed",
  "export-read-failed",
  "deletion-write-failed",
  "provider-unavailable",
  "provider-timeout",
  "provider-rate-limited",
  "provider-refused",
  "provider-malformed-result",
  "provider-invalid-request",
  "provider-unknown",
  "unclassified-failure",
]);

const VALID_RETRY_DISPOSITIONS = new Set<OperationalEvidenceRetryDisposition>([
  "not-applicable",
  "explicit-retry-eligible",
  "non-retryable",
  "indeterminate-manual-check",
]);

const VALID_ENTITY_TYPES = new Set<OperationalEvidenceEntityType>([
  "project",
  "action",
  "accepted-context",
  "accepted-progress",
  "knowledge-item",
  "knowledge-lineage",
]);

const ALLOWED_EVENT_KEYS = new Set<string>([
  "schemaVersion",
  "correlationId",
  "requestId",
  "operationId",
  "stage",
  "operationCategory",
  "status",
  "failureCategory",
  "retryDisposition",
  "entityType",
  "durationMilliseconds",
  "inputUnits",
  "outputUnits",
]);

const ALLOWED_CONTEXT_KEYS = new Set<string>([
  "correlationId",
  "requestId",
  "operationId",
]);

const AUTHENTICATION_MATERIAL_PATTERNS: readonly RegExp[] = [
  /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/i,
  /\b(?:authorization\s*:\s*)?bearer\s+[A-Za-z0-9._~+/=-]{6,}/i,
  /^\s*(?:>\s*|["'`]\s*)?Bearer\s+[A-Za-z0-9._~+/=-]+[\s"'`]*$/im,
  /(?:^|[^`])`Bearer\s+[A-Za-z0-9._~+/=-]+`(?!`)/i,
  /["']?\b(?:passwords?|passwd|passphrases?|credentials?|api[ _-]?keys?|access[ _-]?tokens?|auth[ _-]?tokens?|refresh[ _-]?tokens?|client[ _-]?secrets?|auth(?:entication)?[ _-]?secrets?|secrets?)\b["']?\s*[:=]\s*["']?\S+/i,
];

function containsAuthenticationMaterial(value: string): boolean {
  return AUTHENTICATION_MATERIAL_PATTERNS.some((pattern) => pattern.test(value));
}

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const COMPACT_MACHINE_ID_REGEX = /^(?:id|p|a|g|k|corr|req|op)\d{1,20}$/i;
const STRUCTURED_CORRELATION_ID_REGEX = /^corr[-._:](?:(?:session|interaction)[-._:])?\d{1,20}$/i;
const STRUCTURED_REQUEST_ID_REGEX = /^req[-._:](?:(?:turn|request)[-._:])?\d{1,20}$/i;
const STRUCTURED_OPERATION_ID_REGEX = /^op[-._:](?:p|a|ctx|pr|k|klin|project|action|context|progress|knowledge|export|deletion|interaction|advisory|proposal|retrieval|mixed)[-._:]\d{1,20}$/i;
const GENERAL_OPAQUE_SYNTAX = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function validateOpaqueId(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > 128) return undefined;
  if (!GENERAL_OPAQUE_SYNTAX.test(trimmed)) return undefined;
  if (containsAuthenticationMaterial(trimmed)) return undefined;

  if (
    UUID_REGEX.test(trimmed) ||
    COMPACT_MACHINE_ID_REGEX.test(trimmed) ||
    STRUCTURED_CORRELATION_ID_REGEX.test(trimmed) ||
    STRUCTURED_REQUEST_ID_REGEX.test(trimmed) ||
    STRUCTURED_OPERATION_ID_REGEX.test(trimmed)
  ) {
    return trimmed;
  }

  return undefined;
}

export function isValidOpaqueId(raw: unknown): boolean {
  return validateOpaqueId(raw) !== undefined;
}

const SANCTIONED_CONTEXTS = new WeakSet<object>();
const SANCTIONED_EVENTS = new WeakSet<object>();

export function createObservationContext(input: {
  readonly correlationId: string;
  readonly requestId: string;
  readonly operationId?: string;
}): ObservationContext | undefined {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return undefined;
  }

  const keys = Reflect.ownKeys(input);
  for (const key of keys) {
    if (typeof key !== "string" || !ALLOWED_CONTEXT_KEYS.has(key)) {
      return undefined;
    }
  }

  const correlationId = validateOpaqueId(input.correlationId);
  if (correlationId === undefined) return undefined;

  const requestId = validateOpaqueId(input.requestId);
  if (requestId === undefined) return undefined;

  let validOpId: string | undefined = undefined;
  if (input.operationId !== undefined) {
    validOpId = validateOpaqueId(input.operationId);
  }

  const context: ObservationContext = Object.freeze({
    correlationId,
    requestId,
    ...(validOpId !== undefined ? { operationId: validOpId } : {}),
  });

  SANCTIONED_CONTEXTS.add(context);
  return context;
}

export function isProvenanceObservationContext(
  context: unknown,
): context is ObservationContext {
  return typeof context === "object" && context !== null && SANCTIONED_CONTEXTS.has(context);
}

function validateStageFailureCategoryLegality(
  stage: OperationalEvidenceStage,
  failureCategory: OperationalEvidenceFailureCategory | undefined,
): boolean {
  if (failureCategory === undefined) {
    return true;
  }

  switch (stage) {
    case "request":
    case "derived-state":
      return false;
    case "interpretation":
      return (
        failureCategory === "validation" ||
        failureCategory === "prohibited-input" ||
        failureCategory === "clarification-required" ||
        failureCategory === "unresolved" ||
        failureCategory === "unclassified-failure"
      );
    case "authorization":
      return (
        failureCategory === "authorization-denied" ||
        failureCategory === "unclassified-failure"
      );
    case "retrieval":
      return (
        failureCategory === "not-found" ||
        failureCategory === "retrieval-failed" ||
        failureCategory === "export-read-failed" ||
        failureCategory === "unclassified-failure"
      );
    case "persistence":
      return (
        failureCategory === "not-found" ||
        failureCategory === "constraint-conflict" ||
        failureCategory === "operation-id-conflict" ||
        failureCategory === "persistence-durability" ||
        failureCategory === "persistence-indeterminate" ||
        failureCategory === "deletion-write-failed" ||
        failureCategory === "unclassified-failure"
      );
    case "provider":
      return (
        failureCategory === "provider-unavailable" ||
        failureCategory === "provider-timeout" ||
        failureCategory === "provider-rate-limited" ||
        failureCategory === "provider-refused" ||
        failureCategory === "provider-malformed-result" ||
        failureCategory === "provider-invalid-request" ||
        failureCategory === "provider-unknown"
      );
    case "user-visible":
      return VALID_FAILURE_CATEGORIES.has(failureCategory);
  }
}

function validateCrossFieldInvariants(event: {
  readonly stage: OperationalEvidenceStage;
  readonly status: OperationalEvidenceStatus;
  readonly failureCategory?: OperationalEvidenceFailureCategory;
  readonly retryDisposition: OperationalEvidenceRetryDisposition;
}): boolean {
  const { stage, status, failureCategory, retryDisposition } = event;

  if (!validateStageFailureCategoryLegality(stage, failureCategory)) {
    return false;
  }

  switch (status) {
    case "attempted":
    case "succeeded":
    case "advisory":
    case "proposed":
    case "accepted":
    case "duplicate":
    case "not-applicable":
      if (failureCategory !== undefined) return false;
      if (retryDisposition !== "not-applicable") return false;
      return true;

    case "partial":
      if (failureCategory !== "mixed-outcome") return false;
      if (retryDisposition !== "non-retryable") return false;
      return true;

    case "denied":
      if (
        failureCategory !== "authorization-denied" &&
        failureCategory !== "prohibited-input"
      ) {
        return false;
      }
      if (retryDisposition !== "non-retryable") return false;
      return true;

    case "clarification-required":
      if (
        failureCategory !== "clarification-required" &&
        failureCategory !== "validation" &&
        failureCategory !== "not-found"
      ) {
        return false;
      }
      if (retryDisposition !== "non-retryable") return false;
      return true;

    case "unresolved":
      if (failureCategory !== "unresolved") return false;
      if (retryDisposition !== "non-retryable") return false;
      return true;

    case "indeterminate":
      if (failureCategory !== "persistence-indeterminate") return false;
      if (retryDisposition !== "indeterminate-manual-check") return false;
      return true;

    case "failed": {
      if (failureCategory === undefined) return false;

      const nonRetryableOnly =
        failureCategory === "validation" ||
        failureCategory === "authorization-denied" ||
        failureCategory === "prohibited-input" ||
        failureCategory === "clarification-required" ||
        failureCategory === "unresolved" ||
        failureCategory === "not-found" ||
        failureCategory === "constraint-conflict" ||
        failureCategory === "operation-id-conflict" ||
        failureCategory === "provider-refused" ||
        failureCategory === "provider-malformed-result" ||
        failureCategory === "provider-invalid-request";

      if (nonRetryableOnly) {
        return retryDisposition === "non-retryable";
      }

      const conditionallyRetryable =
        failureCategory === "persistence-durability" ||
        failureCategory === "retrieval-failed" ||
        failureCategory === "export-read-failed" ||
        failureCategory === "deletion-write-failed" ||
        failureCategory === "provider-unavailable" ||
        failureCategory === "provider-timeout" ||
        failureCategory === "provider-rate-limited" ||
        failureCategory === "provider-unknown" ||
        failureCategory === "unclassified-failure";

      if (conditionallyRetryable) {
        return (
          retryDisposition === "explicit-retry-eligible" ||
          retryDisposition === "non-retryable"
        );
      }

      return false;
    }
  }
}

export function createOperationalEvidenceEvent(
  input: unknown,
): OperationalEvidenceEvent | undefined {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return undefined;
  }

  const raw = input as Record<string, unknown>;
  const keys = Reflect.ownKeys(raw);
  for (const key of keys) {
    if (typeof key !== "string" || !ALLOWED_EVENT_KEYS.has(key)) {
      return undefined;
    }
  }

  if (raw.schemaVersion !== 1) return undefined;

  const correlationId = validateOpaqueId(raw.correlationId);
  if (correlationId === undefined) return undefined;

  const requestId = validateOpaqueId(raw.requestId);
  if (requestId === undefined) return undefined;

  let operationId: string | undefined = undefined;
  if (raw.operationId !== undefined) {
    operationId = validateOpaqueId(raw.operationId);
    if (operationId === undefined) {
      return undefined;
    }
  }

  const stage = raw.stage as OperationalEvidenceStage;
  if (!VALID_STAGES.has(stage)) return undefined;

  const operationCategory = raw.operationCategory as OperationalEvidenceOperationCategory;
  if (!VALID_OPERATION_CATEGORIES.has(operationCategory)) return undefined;

  const status = raw.status as OperationalEvidenceStatus;
  if (!VALID_STATUSES.has(status)) return undefined;

  let failureCategory: OperationalEvidenceFailureCategory | undefined = undefined;
  if (raw.failureCategory !== undefined) {
    failureCategory = raw.failureCategory as OperationalEvidenceFailureCategory;
    if (!VALID_FAILURE_CATEGORIES.has(failureCategory)) return undefined;
  }

  const retryDisposition = raw.retryDisposition as OperationalEvidenceRetryDisposition;
  if (!VALID_RETRY_DISPOSITIONS.has(retryDisposition)) return undefined;

  let entityType: OperationalEvidenceEntityType | undefined = undefined;
  if (raw.entityType !== undefined) {
    entityType = raw.entityType as OperationalEvidenceEntityType;
    if (!VALID_ENTITY_TYPES.has(entityType)) return undefined;
  }

  let durationMilliseconds: number | undefined = undefined;
  if (raw.durationMilliseconds !== undefined) {
    if (
      typeof raw.durationMilliseconds !== "number" ||
      !Number.isFinite(raw.durationMilliseconds) ||
      raw.durationMilliseconds < 0
    ) {
      return undefined;
    }
    durationMilliseconds = raw.durationMilliseconds;
  }

  let inputUnits: number | undefined = undefined;
  if (raw.inputUnits !== undefined) {
    if (
      typeof raw.inputUnits !== "number" ||
      !Number.isFinite(raw.inputUnits) ||
      raw.inputUnits < 0
    ) {
      return undefined;
    }
    inputUnits = raw.inputUnits;
  }

  let outputUnits: number | undefined = undefined;
  if (raw.outputUnits !== undefined) {
    if (
      typeof raw.outputUnits !== "number" ||
      !Number.isFinite(raw.outputUnits) ||
      raw.outputUnits < 0
    ) {
      return undefined;
    }
    outputUnits = raw.outputUnits;
  }

  if (
    !validateCrossFieldInvariants({
      stage,
      status,
      failureCategory,
      retryDisposition,
    })
  ) {
    return undefined;
  }

  const event: OperationalEvidenceEvent = Object.freeze({
    schemaVersion: 1,
    correlationId,
    requestId,
    ...(operationId !== undefined ? { operationId } : {}),
    stage,
    operationCategory,
    status,
    ...(failureCategory !== undefined ? { failureCategory } : {}),
    retryDisposition,
    ...(entityType !== undefined ? { entityType } : {}),
    ...(durationMilliseconds !== undefined ? { durationMilliseconds } : {}),
    ...(inputUnits !== undefined ? { inputUnits } : {}),
    ...(outputUnits !== undefined ? { outputUnits } : {}),
  });

  SANCTIONED_EVENTS.add(event);
  return event;
}

export function isConstructorIssuedEvent(
  event: unknown,
): event is OperationalEvidenceEvent {
  return typeof event === "object" && event !== null && SANCTIONED_EVENTS.has(event);
}

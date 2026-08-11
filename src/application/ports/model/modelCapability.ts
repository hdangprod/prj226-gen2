import type {
  ActionId,
  KnowledgeItemId,
  NonEmptyText,
  ProjectId,
} from "../../../domain/model";

export type ModelCapability =
  | "generate-advice"
  | "interpret-interaction"
  | "propose-operations";

export type ModelContextItem =
  | {
      readonly kind: "project-fact";
      readonly projectId: ProjectId;
      readonly fact: NonEmptyText;
      readonly relevance: NonEmptyText;
    }
  | {
      readonly kind: "action-summary";
      readonly projectId: ProjectId;
      readonly actionId: ActionId;
      readonly summary: NonEmptyText;
      readonly relevance: NonEmptyText;
    }
  | {
      readonly kind: "knowledge-excerpt";
      readonly knowledgeItemId: KnowledgeItemId;
      readonly originatingProjectId: ProjectId;
      readonly excerpt: NonEmptyText;
      readonly relevance: NonEmptyText;
      readonly currentness: "current" | "qualified-prior";
      readonly qualification?: NonEmptyText;
    };

const boundedContext: unique symbol = Symbol("bounded-model-context");
const modelRequest: unique symbol = Symbol("model-capability-request");
const validBoundedContexts = new WeakSet<object>();

const AUTHENTICATION_MATERIAL_PATTERNS: readonly RegExp[] = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:authorization\s*:\s*)?bearer\s+[A-Za-z0-9._~+/=-]{6,}/i,
  /["']?\b(?:password|passwd|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|auth(?:entication)?[_ -]?secret|secret)\b["']?\s*[:=]\s*["']?\S{4,}/i,
];

function containsAuthenticationMaterial(value: NonEmptyText): boolean {
  return AUTHENTICATION_MATERIAL_PATTERNS.some((pattern) => pattern.test(value));
}

function isNonEmptyRuntimeText(value: unknown): value is NonEmptyText {
  return typeof value === "string" && value.trim().length > 0;
}

function isRuntimeIdentifier(value: unknown): value is string {
  return typeof value === "string";
}

function contextItemText(item: ModelContextItem): readonly NonEmptyText[] {
  switch (item.kind) {
    case "project-fact":
      return [item.fact, item.relevance];
    case "action-summary":
      return [item.summary, item.relevance];
    case "knowledge-excerpt":
      return item.qualification === undefined
        ? [item.excerpt, item.relevance]
        : [item.excerpt, item.relevance, item.qualification];
  }
}

function snapshotContextItem(value: unknown): ModelContextItem | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const item = value as Record<string, unknown>;
  try {
    const kind = item.kind;
    if (kind === "project-fact") {
      const projectId = item.projectId;
      const fact = item.fact;
      const relevance = item.relevance;
      if (
        !isRuntimeIdentifier(projectId) ||
        !isNonEmptyRuntimeText(fact) ||
        !isNonEmptyRuntimeText(relevance)
      ) return undefined;
      return Object.freeze({
        kind,
        projectId: projectId as ProjectId,
        fact,
        relevance,
      });
    }
    if (kind === "action-summary") {
      const projectId = item.projectId;
      const actionId = item.actionId;
      const summary = item.summary;
      const relevance = item.relevance;
      if (
        !isRuntimeIdentifier(projectId) ||
        !isRuntimeIdentifier(actionId) ||
        !isNonEmptyRuntimeText(summary) ||
        !isNonEmptyRuntimeText(relevance)
      ) return undefined;
      return Object.freeze({
        kind,
        projectId: projectId as ProjectId,
        actionId: actionId as ActionId,
        summary,
        relevance,
      });
    }
    if (kind === "knowledge-excerpt") {
      const knowledgeItemId = item.knowledgeItemId;
      const originatingProjectId = item.originatingProjectId;
      const excerpt = item.excerpt;
      const relevance = item.relevance;
      const currentness = item.currentness;
      const qualification = item.qualification;
      if (
        !isRuntimeIdentifier(knowledgeItemId) ||
        !isRuntimeIdentifier(originatingProjectId) ||
        !isNonEmptyRuntimeText(excerpt) ||
        !isNonEmptyRuntimeText(relevance) ||
        (currentness !== "current" && currentness !== "qualified-prior") ||
        (qualification !== undefined && !isNonEmptyRuntimeText(qualification))
      ) return undefined;
      return Object.freeze({
        kind,
        knowledgeItemId: knowledgeItemId as KnowledgeItemId,
        originatingProjectId: originatingProjectId as ProjectId,
        excerpt,
        relevance,
        currentness,
        qualification,
      });
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function contextSnapshotRemainsValid(context: BoundedModelContext): boolean {
  return (
    Number.isSafeInteger(context.itemLimit) &&
    context.itemLimit >= 0 &&
    context.itemLimit <= 32 &&
    context.items.length <= context.itemLimit &&
    isNonEmptyRuntimeText(context.selectionReason) &&
    !containsAuthenticationMaterial(context.selectionReason) &&
    context.items.every((item) => contextItemText(item).every(
      (value) => !containsAuthenticationMaterial(value),
    ))
  );
}

export interface BoundedModelContext {
  readonly items: readonly ModelContextItem[];
  readonly itemLimit: number;
  readonly selectionReason: NonEmptyText;
  readonly [boundedContext]: true;
}

export type ModelContextCreationResult =
  | { readonly kind: "bounded-context"; readonly value: BoundedModelContext }
  | {
      readonly kind: "invalid-context";
      readonly reason:
        | "invalid-item-limit"
        | "item-limit-exceeded"
        | "authentication-material-excluded";
    };

export function createBoundedModelContext(input: {
  readonly items: readonly ModelContextItem[];
  readonly itemLimit: number;
  readonly selectionReason: NonEmptyText;
}): ModelContextCreationResult {
  if (typeof input !== "object" || input === null) {
    return { kind: "invalid-context", reason: "invalid-item-limit" };
  }
  let rawItems: readonly ModelContextItem[];
  let itemLimit: number;
  let selectionReason: NonEmptyText;
  try {
    const suppliedItems = input.items;
    if (!Array.isArray(suppliedItems)) {
      return { kind: "invalid-context", reason: "invalid-item-limit" };
    }
    rawItems = [...suppliedItems];
    itemLimit = input.itemLimit;
    selectionReason = input.selectionReason;
  } catch {
    return { kind: "invalid-context", reason: "invalid-item-limit" };
  }
  if (!Number.isSafeInteger(itemLimit) || itemLimit < 0 || itemLimit > 32) {
    return { kind: "invalid-context", reason: "invalid-item-limit" };
  }
  if (rawItems.length > itemLimit) {
    return { kind: "invalid-context", reason: "item-limit-exceeded" };
  }
  if (!isNonEmptyRuntimeText(selectionReason)) {
    return { kind: "invalid-context", reason: "authentication-material-excluded" };
  }
  const items = rawItems.map(snapshotContextItem);
  if (items.some((item) => item === undefined)) {
    return { kind: "invalid-context", reason: "authentication-material-excluded" };
  }
  const ownedItems = items as readonly ModelContextItem[];
  if (
    containsAuthenticationMaterial(selectionReason) ||
    ownedItems.some((item) => contextItemText(item).some(containsAuthenticationMaterial))
  ) {
    return { kind: "invalid-context", reason: "authentication-material-excluded" };
  }
  const context: BoundedModelContext = Object.freeze({
    items: Object.freeze(ownedItems),
    itemLimit,
    selectionReason,
    [boundedContext]: true as const,
  });
  validBoundedContexts.add(context);
  return {
    kind: "bounded-context",
    value: context,
  };
}

export interface ModelCapabilityRequest {
  readonly capability: ModelCapability;
  readonly interaction: NonEmptyText;
  /** Application-selected items needed for this interaction, never an implicit history. */
  readonly context: BoundedModelContext;
  readonly constraints?: readonly NonEmptyText[];
  readonly [modelRequest]: true;
}

export type ModelCapabilityRequestCreationResult =
  | { readonly kind: "model-request"; readonly value: ModelCapabilityRequest }
  | {
      readonly kind: "invalid-request";
      readonly reason: "authentication-material-excluded" | "invalid-bounded-context";
    };

export function createModelCapabilityRequest(input: {
  readonly capability: ModelCapability;
  readonly interaction: NonEmptyText;
  readonly context: BoundedModelContext;
  readonly constraints?: readonly NonEmptyText[];
}): ModelCapabilityRequestCreationResult {
  if (typeof input !== "object" || input === null) {
    return { kind: "invalid-request", reason: "invalid-bounded-context" };
  }
  let capability: ModelCapability;
  let interaction: NonEmptyText;
  let context: BoundedModelContext;
  let constraints: readonly NonEmptyText[] | undefined;
  try {
    capability = input.capability;
    interaction = input.interaction;
    context = input.context;
    const suppliedConstraints = input.constraints;
    constraints = suppliedConstraints === undefined ? undefined : [...suppliedConstraints];
  } catch {
    return { kind: "invalid-request", reason: "invalid-bounded-context" };
  }
  if (
    (capability !== "generate-advice" &&
      capability !== "interpret-interaction" &&
      capability !== "propose-operations") ||
    !isNonEmptyRuntimeText(interaction) ||
    typeof context !== "object" ||
    context === null ||
    !validBoundedContexts.has(context) ||
    !contextSnapshotRemainsValid(context) ||
    (constraints !== undefined && !constraints.every(isNonEmptyRuntimeText))
  ) {
    return { kind: "invalid-request", reason: "invalid-bounded-context" };
  }
  if (
    containsAuthenticationMaterial(interaction) ||
    constraints?.some(containsAuthenticationMaterial) === true
  ) {
    return { kind: "invalid-request", reason: "authentication-material-excluded" };
  }
  const request: ModelCapabilityRequest = Object.freeze({
    capability,
    interaction,
    context,
    constraints:
      constraints === undefined ? undefined : Object.freeze(constraints),
    [modelRequest]: true as const,
  });
  return {
    kind: "model-request",
    value: request,
  };
}

export type ProposedOperation =
  | {
      readonly kind: "create-project";
      readonly intendedOutcome: NonEmptyText;
    }
  | {
      readonly kind: "create-action";
      readonly projectId: ProjectId;
      readonly description: NonEmptyText;
    }
  | {
      readonly kind: "complete-action";
      readonly projectId: ProjectId;
      readonly actionId: ActionId;
    }
  | {
      readonly kind: "reopen-action";
      readonly projectId: ProjectId;
      readonly actionId: ActionId;
    }
  | {
      readonly kind: "complete-project";
      readonly projectId: ProjectId;
    }
  | {
      readonly kind: "reopen-project";
      readonly projectId: ProjectId;
    }
  | {
      readonly kind: "record-progress";
      readonly projectId: ProjectId;
      readonly actionId?: ActionId;
      readonly statement: NonEmptyText;
    }
  | {
      readonly kind: "capture-knowledge";
      readonly originatingProjectId: ProjectId;
      readonly content: NonEmptyText;
    }
  | {
      readonly kind: "delete";
      readonly target: "project" | "action" | "knowledge-item";
      readonly targetId: ProjectId | ActionId | KnowledgeItemId;
    };

export interface ModelDiagnostics {
  readonly inputUnits?: number;
  readonly outputUnits?: number;
  readonly durationMilliseconds?: number;
}

interface ModelResultBase {
  /** Operational observations only; never billing or product semantics. */
  readonly diagnostics?: ModelDiagnostics;
}

export type ModelCapabilityResult =
  | (ModelResultBase & {
      readonly kind: "advisory";
      readonly content: NonEmptyText;
    })
  | (ModelResultBase & {
      readonly kind: "proposal";
      readonly summary?: NonEmptyText;
      readonly operations: readonly ProposedOperation[];
    })
  | (ModelResultBase & {
      readonly kind: "uncertain";
      readonly content?: NonEmptyText;
      readonly reason: NonEmptyText;
    })
  | (ModelResultBase & {
      readonly kind: "unable";
      readonly reason: NonEmptyText;
    })
  | {
      readonly kind: "failure";
      readonly failure: ModelCapabilityFailure;
    };

export type ModelFailureCategory =
  | "unavailable"
  | "timeout"
  | "rate-limited"
  | "refused"
  | "malformed-result"
  | "invalid-request"
  | "unknown";

export interface ModelCapabilityFailure {
  readonly category: ModelFailureCategory;
  readonly retryable: boolean;
  readonly message: NonEmptyText;
}

export interface ModelCapabilityPort {
  execute(request: ModelCapabilityRequest): Promise<ModelCapabilityResult>;
}

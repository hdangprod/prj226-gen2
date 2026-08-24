import {
  type ModelCapabilityPort,
  type ModelCapabilityRequest,
  type ModelCapabilityResult,
  type ModelFailureCategory,
  type ProposedOperation,
} from "../../../application/ports/model/modelCapability";
import {
  actionId,
  knowledgeItemId,
  nonEmptyText,
  projectId,
  type NonEmptyText,
} from "../../../domain/model";
import {
  DEFAULT_WORKERS_AI_MODEL,
  RESULT_SCHEMA,
  WORKERS_AI_SYSTEM_MESSAGE,
  type WorkersAiBindingLike,
  type WorkersAiInvocationInput,
} from "./workersAiTypes";

const MESSAGES: Readonly<Record<ModelFailureCategory, NonEmptyText>> = Object.freeze({
  "rate-limited": "The model capability is temporarily rate limited." as NonEmptyText,
  timeout: "The model capability timed out." as NonEmptyText,
  unavailable: "The model capability is temporarily unavailable." as NonEmptyText,
  "invalid-request": "The model request or adapter configuration is invalid." as NonEmptyText,
  refused: "The model capability request was refused." as NonEmptyText,
  "malformed-result": "The model capability returned a malformed result." as NonEmptyText,
  unknown: "The model capability failed." as NonEmptyText,
});

type UnknownRecord = Record<PropertyKey, unknown>;
type OwnSnapshot = { readonly present: boolean; readonly value: unknown };

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads an untrusted own property once, retaining neither the container nor its prototype. */
function ownSnapshot(value: UnknownRecord, property: string): OwnSnapshot {
  const present = Object.prototype.hasOwnProperty.call(value, property);
  return present ? { present: true, value: value[property] } : { present: false, value: undefined };
}

function requiredOwn(value: unknown, property: string): unknown | undefined {
  if (!isRecord(value)) return undefined;
  const snapshot = ownSnapshot(value, property);
  return snapshot.present ? snapshot.value : undefined;
}

function acceptedText(value: unknown): NonEmptyText | undefined {
  return typeof value === "string" ? nonEmptyText(value) : undefined;
}

function acceptedIdentifier(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function snapshotArray(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const length = value.length;
  if (!Number.isSafeInteger(length) || length < 0) return undefined;
  const snapshot: unknown[] = [];
  for (let index = 0; index < length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, String(index))) return undefined;
    snapshot.push(value[index]);
  }
  return snapshot;
}

function freezeResult(result: ModelCapabilityResult): ModelCapabilityResult {
  return Object.freeze(result);
}

function failure(category: ModelFailureCategory): ModelCapabilityResult {
  const retryable = category === "rate-limited" || category === "timeout" || category === "unavailable";
  return freezeResult({ kind: "failure", failure: Object.freeze({ category, retryable, message: MESSAGES[category] }) });
}

function reconstructOperation(raw: unknown): ProposedOperation | undefined {
  if (!isRecord(raw)) return undefined;
  try {
    const kind = requiredOwn(raw, "kind");
    if (typeof kind !== "string") return undefined;
    const field = (name: string) => requiredOwn(raw, name);
    switch (kind) {
      case "create-project": {
        const intendedOutcome = acceptedText(field("intendedOutcome"));
        return intendedOutcome === undefined ? undefined : Object.freeze({ kind, intendedOutcome });
      }
      case "create-action": {
        const project = acceptedIdentifier(field("projectId"));
        const description = acceptedText(field("description"));
        return project === undefined || description === undefined
          ? undefined
          : Object.freeze({ kind, projectId: projectId(project), description });
      }
      case "complete-action":
      case "reopen-action": {
        const project = acceptedIdentifier(field("projectId"));
        const action = acceptedIdentifier(field("actionId"));
        return project === undefined || action === undefined
          ? undefined
          : Object.freeze({ kind, projectId: projectId(project), actionId: actionId(action) });
      }
      case "complete-project":
      case "reopen-project": {
        const project = acceptedIdentifier(field("projectId"));
        return project === undefined ? undefined : Object.freeze({ kind, projectId: projectId(project) });
      }
      case "record-progress": {
        const project = acceptedIdentifier(field("projectId"));
        const statement = acceptedText(field("statement"));
        const action = ownSnapshot(raw, "actionId");
        if (project === undefined || statement === undefined || action.value === null) return undefined;
        if (!action.present || action.value === undefined) {
          return Object.freeze({ kind, projectId: projectId(project), statement });
        }
        const actionValue = acceptedIdentifier(action.value);
        return actionValue === undefined
          ? undefined
          : Object.freeze({ kind, projectId: projectId(project), actionId: actionId(actionValue), statement });
      }
      case "capture-knowledge": {
        const originatingProject = acceptedIdentifier(field("originatingProjectId"));
        const content = acceptedText(field("content"));
        return originatingProject === undefined || content === undefined
          ? undefined
          : Object.freeze({ kind, originatingProjectId: projectId(originatingProject), content });
      }
      case "delete": {
        const target = field("target");
        const targetValue = field("targetId");
        if (
          (target !== "project" && target !== "action" && target !== "knowledge-item") ||
          typeof targetValue !== "string"
        ) return undefined;
        const targetId = target === "project"
          ? projectId(targetValue)
          : target === "action" ? actionId(targetValue) : knowledgeItemId(targetValue);
        return Object.freeze({ kind, target, targetId });
      }
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}

function reconstructResult(raw: unknown): ModelCapabilityResult | undefined {
  if (!isRecord(raw)) return undefined;
  try {
    const kind = requiredOwn(raw, "kind");
    if (typeof kind !== "string") return undefined;
    switch (kind) {
      case "advisory": {
        const content = acceptedText(requiredOwn(raw, "content"));
        return content === undefined ? undefined : freezeResult({ kind, content });
      }
      case "proposal": {
        const operations = snapshotArray(requiredOwn(raw, "operations"));
        const summary = ownSnapshot(raw, "summary");
        if (operations === undefined || summary.value === null) return undefined;
        const reconstructed = operations.map(reconstructOperation);
        if (reconstructed.some((operation) => operation === undefined)) return undefined;
        const frozenOperations = Object.freeze(reconstructed as ProposedOperation[]);
        if (!summary.present || summary.value === undefined) {
          return freezeResult({ kind, operations: frozenOperations });
        }
        const acceptedSummary = acceptedText(summary.value);
        return acceptedSummary === undefined
          ? undefined
          : freezeResult({ kind, summary: acceptedSummary, operations: frozenOperations });
      }
      case "uncertain": {
        const reason = acceptedText(requiredOwn(raw, "reason"));
        const content = ownSnapshot(raw, "content");
        if (reason === undefined || content.value === null) return undefined;
        if (!content.present || content.value === undefined) return freezeResult({ kind, reason });
        const acceptedContent = acceptedText(content.value);
        return acceptedContent === undefined ? undefined : freezeResult({ kind, content: acceptedContent, reason });
      }
      case "unable": {
        const reason = acceptedText(requiredOwn(raw, "reason"));
        return reason === undefined ? undefined : freezeResult({ kind, reason });
      }
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
}

function directToolResult(response: unknown): ModelCapabilityResult | undefined {
  try {
    if (!isRecord(response)) return undefined;
    const toolCalls = snapshotArray(requiredOwn(response, "tool_calls"));
    if (toolCalls === undefined || toolCalls.length !== 1 || !isRecord(toolCalls[0])) return undefined;
    const call = toolCalls[0];
    const name = requiredOwn(call, "name");
    const argumentsSnapshot = requiredOwn(call, "arguments");
    if (name !== "liam_model_result") return undefined;
    const rawArguments = typeof argumentsSnapshot === "string"
      ? JSON.parse(argumentsSnapshot) as unknown
      : argumentsSnapshot;
    if (!isRecord(rawArguments) || Array.isArray(rawArguments)) return undefined;
    return reconstructResult(rawArguments);
  } catch {
    return undefined;
  }
}

function normaliseThrown(value: unknown): ModelCapabilityResult {
  if (!isRecord(value)) return failure("unknown");
  try {
    const status = ownSnapshot(value, "status");
    const statusCode = ownSnapshot(value, "statusCode");
    if (status.present || statusCode.present) {
      const valid = (candidate: unknown) => typeof candidate === "number" && Number.isFinite(candidate) && Number.isInteger(candidate);
      if ((status.present && !valid(status.value)) || (statusCode.present && !valid(statusCode.value))) return failure("unknown");
      if (status.present && statusCode.present && status.value !== statusCode.value) return failure("unknown");
      const code = (status.present ? status.value : statusCode.value) as number;
      if (code === 429) return failure("rate-limited");
      if (code === 408 || code === 504) return failure("timeout");
      if (code === 500 || code === 502 || code === 503) return failure("unavailable");
      if (code === 400 || code === 401 || code === 404 || code === 422) return failure("invalid-request");
      if (code === 403) return failure("refused");
      return failure("unknown");
    }
    const name = ownSnapshot(value, "name");
    return name.value === "AbortError" || name.value === "TimeoutError" ? failure("timeout") : failure("unknown");
  } catch {
    return failure("unknown");
  }
}

function serializeRequest(request: ModelCapabilityRequest): WorkersAiInvocationInput | undefined {
  try {
    if (!isRecord(request)) return undefined;
    const capability = requiredOwn(request, "capability");
    const interaction = requiredOwn(request, "interaction");
    const context = requiredOwn(request, "context");
    const constraints = ownSnapshot(request, "constraints");
    if (
      (capability !== "generate-advice" && capability !== "interpret-interaction" && capability !== "propose-operations") ||
      typeof interaction !== "string" ||
      !isRecord(context) ||
      constraints.value === null
    ) return undefined;
    const items = snapshotArray(requiredOwn(context, "items"));
    const itemLimit = requiredOwn(context, "itemLimit");
    const selectionReason = requiredOwn(context, "selectionReason");
    if (items === undefined || typeof itemLimit !== "number" || typeof selectionReason !== "string") return undefined;
    const payloadItems = items.map((item) => serializeContextItem(item));
    if (payloadItems.some((item) => item === undefined)) return undefined;
    let payloadConstraints: unknown[] | undefined;
    if (constraints.present && constraints.value !== undefined) {
      payloadConstraints = snapshotArray(constraints.value);
      if (payloadConstraints === undefined || payloadConstraints.some((value) => typeof value !== "string" || value === null)) return undefined;
    }
    const payload: Record<string, unknown> = {
      capability,
      interaction,
      context: { items: payloadItems, itemLimit, selectionReason },
    };
    if (payloadConstraints !== undefined) payload.constraints = payloadConstraints;
    return {
      messages: [
        { role: "system", content: WORKERS_AI_SYSTEM_MESSAGE },
        { role: "user", content: JSON.stringify(payload) },
      ],
      tools: [{
        type: "function",
        function: {
          name: "liam_model_result",
          description: "Return one provider-local Liam model result.",
          parameters: RESULT_SCHEMA,
        },
      }],
    };
  } catch {
    return undefined;
  }
}

function serializeContextItem(item: unknown): Record<string, unknown> | undefined {
  if (!isRecord(item)) return undefined;
  const kind = requiredOwn(item, "kind");
  try {
    if (kind === "project-fact") {
      const project = requiredOwn(item, "projectId");
      const fact = requiredOwn(item, "fact");
      const relevance = requiredOwn(item, "relevance");
      return typeof project === "string" && typeof fact === "string" && typeof relevance === "string"
        ? { kind, projectId: project, fact, relevance }
        : undefined;
    }
    if (kind === "action-summary") {
      const project = requiredOwn(item, "projectId");
      const action = requiredOwn(item, "actionId");
      const summary = requiredOwn(item, "summary");
      const relevance = requiredOwn(item, "relevance");
      return typeof project === "string" && typeof action === "string" && typeof summary === "string" && typeof relevance === "string"
        ? { kind, projectId: project, actionId: action, summary, relevance }
        : undefined;
    }
    if (kind === "knowledge-excerpt") {
      const knowledge = requiredOwn(item, "knowledgeItemId");
      const project = requiredOwn(item, "originatingProjectId");
      const excerpt = requiredOwn(item, "excerpt");
      const relevance = requiredOwn(item, "relevance");
      const currentness = requiredOwn(item, "currentness");
      const qualification = ownSnapshot(item, "qualification");
      if (
        typeof knowledge !== "string" || typeof project !== "string" || typeof excerpt !== "string" ||
        typeof relevance !== "string" || (currentness !== "current" && currentness !== "qualified-prior") ||
        qualification.value === null || (qualification.present && qualification.value !== undefined && typeof qualification.value !== "string")
      ) return undefined;
      const result: Record<string, unknown> = {
        kind,
        knowledgeItemId: knowledge,
        originatingProjectId: project,
        excerpt,
        relevance,
        currentness,
      };
      if (qualification.present && qualification.value !== undefined) result.qualification = qualification.value;
      return result;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export class WorkersAiModelAdapter implements ModelCapabilityPort {
  constructor(
    private readonly binding: WorkersAiBindingLike | undefined,
    private readonly model: string = DEFAULT_WORKERS_AI_MODEL,
  ) {}

  async execute(request: ModelCapabilityRequest): Promise<ModelCapabilityResult> {
    let run: WorkersAiBindingLike["run"];
    let input: WorkersAiInvocationInput | undefined;
    try {
      if (!this.binding || typeof this.model !== "string" || this.model.trim().length === 0) return failure("invalid-request");
      run = this.binding.run;
      if (typeof run !== "function") return failure("invalid-request");
      input = serializeRequest(request);
      if (input === undefined) return failure("invalid-request");
    } catch {
      return failure("invalid-request");
    }
    try {
      const response = await run.call(this.binding, this.model, input);
      return directToolResult(response) ?? failure("malformed-result");
    } catch (error) {
      return normaliseThrown(error);
    }
  }
}

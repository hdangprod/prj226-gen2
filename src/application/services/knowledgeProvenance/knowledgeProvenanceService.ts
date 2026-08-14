import type {
  MutationGate,
  OrdinaryMutationAuthorization,
} from "../../contracts/humanControl";
import {
  failedOutcome,
  type AcceptedOutcome,
  type FailedOutcome,
  type NormalizedIntent,
  type ProhibitedOutcome,
} from "../../contracts/operations";
import type {
  AcceptedStatePersistence,
  PersistenceOperationId,
} from "../../ports/persistence";
import {
  captureKnowledge,
  correctKnowledge,
  type KnowledgeTransitionResult,
} from "../../../domain/knowledge";
import type {
  KnowledgeItem,
  KnowledgeItemId,
  NonEmptyText,
  ProjectId,
} from "../../../domain/model";

export type KnowledgeProvenanceOutcome<Value> =
  | AcceptedOutcome<Value>
  | FailedOutcome
  | ProhibitedOutcome;

export interface KnowledgeProvenanceServiceDependencies {
  readonly mutationGate: MutationGate;
  readonly persistence: AcceptedStatePersistence;
}

interface CommandBase {
  readonly intent: NormalizedIntent;
  readonly operationId: PersistenceOperationId;
  readonly authorization: OrdinaryMutationAuthorization;
}

type KnowledgeSeed = {
  readonly id: KnowledgeItemId;
  readonly originatingProjectId: ProjectId;
  readonly content: NonEmptyText;
};

/* This finite boundary recognizes only credential-shaped material.  It is
 * deliberately not an entropy, vendor-token, or keyword scanner. */
const AUTHENTICATION_MATERIAL_PATTERNS: readonly RegExp[] = [
  /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/i,
  /\b(?:passwords?|passphrases?)\s*[:=]\s*[^\s]+/i,
  /\b(?:credentials?|authentication[ _-]?secrets?|auth[ _-]?secrets?|client[ _-]?secrets?)\s*[:=]\s*[^\s]+/i,
  /\b(?:access[ _-]?tokens?|auth[ _-]?tokens?)\s*[:=]\s*[^\s]+/i,
  /\bAuthorization\s*:\s*Bearer\s+[A-Za-z0-9._~+/-]+=*/i,
  /^\s*(?:>\s*|["'`]\s*)?Bearer\s+[A-Za-z0-9._~+/-]+=*\s*(?:["'`])?\s*$/im,
  /(?:^|[^`])`Bearer\s+[A-Za-z0-9._~+/-]+=*`(?!`)/i,
];

function isAuthenticationMaterial(content: string): boolean {
  return AUTHENTICATION_MATERIAL_PATTERNS.some((pattern) => pattern.test(content));
}

function failureFromDomain<Value>(
  intent: NormalizedIntent,
  result: Exclude<KnowledgeTransitionResult<Value>, { readonly kind: "valid-knowledge-change" }>,
): FailedOutcome {
  return failedOutcome(intent, result.reason, false);
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function ownValue(record: Record<PropertyKey, unknown>, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(record, key);
  return descriptor !== undefined && "value" in descriptor ? descriptor.value : undefined;
}

function canonicalizeLineage(value: unknown): readonly KnowledgeItemId[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const keys = Reflect.ownKeys(value);
  if (keys.length !== value.length + 1 || !keys.every((key) => key === "length" || (typeof key === "string" && /^(0|[1-9]\d*)$/.test(key)))) return undefined;
  const lineage: KnowledgeItemId[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const item = ownValue(value as unknown as Record<PropertyKey, unknown>, String(index));
    if (typeof item !== "string") return undefined;
    lineage.push(item as KnowledgeItemId);
  }
  return lineage;
}

/* Correction needs the predecessor's lineage to build a successor.  This
 * accepts a closed, owned snapshot only; D1 remains the authority that proves
 * the predecessor exists, is current, has that lineage, and has that origin. */
function canonicalizePrior(value: unknown): KnowledgeItem | undefined {
  if (!isRecord(value)) return undefined;
  const allowed = ["id", "originatingProjectId", "content", "standing", "supersedesId", "supersessionChain"];
  const keys = Reflect.ownKeys(value);
  if (!keys.every((key) => typeof key === "string" && allowed.includes(key))
    || !["id", "originatingProjectId", "content", "standing", "supersessionChain"].every((key) => Object.prototype.hasOwnProperty.call(value, key))) return undefined;
  const id = ownValue(value, "id");
  const originatingProjectId = ownValue(value, "originatingProjectId");
  const content = ownValue(value, "content");
  const standing = ownValue(value, "standing");
  const supersedesId = ownValue(value, "supersedesId");
  const lineage = canonicalizeLineage(ownValue(value, "supersessionChain"));
  if (typeof id !== "string" || typeof originatingProjectId !== "string" || typeof content !== "string" || (standing !== "current" && standing !== "superseded") || lineage === undefined || (supersedesId !== undefined && typeof supersedesId !== "string")) return undefined;
  return {
    id: id as KnowledgeItemId,
    originatingProjectId: originatingProjectId as ProjectId,
    content: content as NonEmptyText,
    standing,
    ...(supersedesId === undefined ? {} : { supersedesId: supersedesId as KnowledgeItemId }),
    supersessionChain: lineage,
  };
}

export class KnowledgeProvenanceService {
  constructor(private readonly dependencies: KnowledgeProvenanceServiceDependencies) {}

  private async persist<Value>(
    intent: NormalizedIntent,
    operationId: PersistenceOperationId,
    write: Parameters<AcceptedStatePersistence["commitAcceptedState"]>[0]["writes"][number],
    value: Value,
  ): Promise<KnowledgeProvenanceOutcome<Value>> {
    const result = await this.dependencies.persistence.commitAcceptedState({ operationId, writes: [write] });
    if (result.kind === "committed" || result.kind === "already-committed") return { kind: "accepted", value };
    return failedOutcome(intent, result.reason, result.retryable);
  }

  async capture(command: CommandBase & KnowledgeSeed & { readonly intentional: boolean }): Promise<KnowledgeProvenanceOutcome<KnowledgeItem>> {
    if (isAuthenticationMaterial(command.content)) return { kind: "prohibited", intent: command.intent, reason: "authentication-material-capture" };
    const transition = captureKnowledge({ items: [] }, {
      id: command.id,
      originatingProjectId: command.originatingProjectId,
      content: command.content,
      intentional: command.intentional,
    }, this.dependencies.mutationGate, command.authorization);
    if (transition.kind !== "valid-knowledge-change") return failureFromDomain(command.intent, transition);
    const item: KnowledgeItem = {
      id: transition.value.item.id,
      originatingProjectId: transition.value.item.originatingProjectId,
      content: transition.value.item.content,
      standing: "current",
      supersessionChain: [],
    };
    return this.persist(command.intent, command.operationId, { kind: "put-knowledge", item }, item);
  }

  async correct(command: CommandBase & {
    readonly prior: unknown;
    readonly successorId: KnowledgeItemId;
    readonly originatingProjectId: ProjectId;
    readonly content: NonEmptyText;
  }): Promise<KnowledgeProvenanceOutcome<KnowledgeItem>> {
    if (isAuthenticationMaterial(command.content)) return { kind: "prohibited", intent: command.intent, reason: "authentication-material-capture" };
    const prior = canonicalizePrior(command.prior);
    if (prior === undefined) return failedOutcome(command.intent, "correction-prior-malformed", false);
    const transition = correctKnowledge({ items: [prior] }, prior.id, {
      id: command.successorId,
      originatingProjectId: command.originatingProjectId,
      content: command.content,
    }, this.dependencies.mutationGate, command.authorization);
    if (transition.kind !== "valid-knowledge-change") return failureFromDomain(command.intent, transition);
    const successor: KnowledgeItem = {
      id: transition.value.correction.id,
      originatingProjectId: transition.value.correction.originatingProjectId,
      content: transition.value.correction.content,
      standing: "current",
      supersedesId: transition.value.correction.supersedesId,
      supersessionChain: [...transition.value.correction.supersessionChain],
    };
    return this.persist(command.intent, command.operationId, { kind: "correct-knowledge", successor }, successor);
  }
}

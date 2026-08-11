export interface NormalizedIntent {
  readonly summary: string;
}

export interface AdvisoryOutcome<Value> {
  readonly kind: "advisory";
  readonly value: Value;
}

export interface ProposedOutcome<Value> {
  readonly kind: "proposed";
  readonly proposal: Value;
}

export interface ClarificationRequiredOutcome {
  readonly kind: "clarification-required";
  readonly intent: NormalizedIntent;
  readonly reason: "ambiguous-target" | "ambiguous-effect";
}

export interface AcceptedOutcome<Value> {
  readonly kind: "accepted";
  readonly value: Value;
}

export interface FailedOutcome {
  readonly kind: "failed";
  readonly intent: NormalizedIntent;
  readonly reason: string;
  readonly retryable: boolean;
}

export interface ProhibitedOutcome {
  readonly kind: "prohibited";
  readonly intent: NormalizedIntent;
  readonly reason: ProhibitionReason;
}

export interface UnresolvedOutcome {
  readonly kind: "unresolved";
  readonly intent: NormalizedIntent;
  readonly reason: string;
}

export type ProhibitionReason =
  | "authentication-material-capture"
  | "medical-authority-claim"
  | "legal-authority-claim"
  | "financial-authority-claim"
  | "outside-product-boundary";

export type PortionOutcome<Value = unknown> =
  | AdvisoryOutcome<Value>
  | ProposedOutcome<Value>
  | ClarificationRequiredOutcome
  | AcceptedOutcome<Value>
  | FailedOutcome
  | ProhibitedOutcome
  | UnresolvedOutcome;

export interface MixedOutcome {
  readonly kind: "mixed";
  readonly portions: readonly PortionOutcome[];
}

export function failedOutcome(
  intent: NormalizedIntent,
  reason: string,
  retryable: boolean,
): FailedOutcome {
  return { kind: "failed", intent, reason, retryable };
}

export function mixedOutcome(
  portions: readonly PortionOutcome[],
): MixedOutcome {
  return { kind: "mixed", portions };
}

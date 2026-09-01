import {
  nonEmptyText,
  type AcceptedProjectContext,
  type Action,
  type KnowledgeItem,
  type NonEmptyText,
  type Project,
} from "../../../domain/model";
import {
  validateAndSnapshotDeletionScope,
  type OrdinaryMutationScope,
} from "../../contracts/humanControl";
import {
  failedOutcome,
  mixedOutcome,
  type MixedOutcome,
  type PortionOutcome,
  type ProhibitedOutcome,
  type UnresolvedOutcome,
} from "../../contracts/operations";
import {
  createModelCapabilityRequest,
  type ModelFailureCategory,
} from "../../ports/model/modelCapability";
import {
  createOperationalEvidenceEvent,
  isProvenanceObservationContext,
  type ObservationContext,
  type OperationalEvidenceEntityType,
  type OperationalEvidenceFailureCategory,
  type OperationalEvidenceOperationCategory,
  type OperationalEvidenceRetryDisposition,
  type OperationalEvidenceStage,
  type OperationalEvidenceStatus,
} from "../../ports/observability/operationalEvidence";
import type {
  AcceptedActionLifecycle,
  AcceptedProjectLifecycle,
} from "../projectActionContext/projectActionContextService";
import type {
  ConfirmedDeletionResult,
  ExportAcceptedStateResult,
} from "../exportDeletion/exportDeletionTypes";
import { selectBoundedContextForTurn } from "./contextSelection";
import {
  normalizeUserIntent,
  type AcceptContextFactsInput,
  type AcceptProgressInput,
  type AdvisoryInteractionInput,
  type CaptureKnowledgeInput,
  type CompleteActionInput,
  type CompleteProjectInput,
  type CorrectKnowledgeInput,
  type CorrectProgressInput,
  type CreateActionInput,
  type DeletionConfirmationInput,
  type DeletionDirectionOutcome,
  type EstablishProjectInput,
  type InitiateDeletionInput,
  type InteractionOrchestratorDependencies,
  type ModelInteractionOutcome,
  type ProposalInteractionInput,
  type ReopenActionInput,
  type ReopenProjectInput,
} from "./interactionTypes";
import type { TrustedInteractionEvidence } from "../../contracts/humanControl";

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

function invalidEvidenceOutcome(summary: string): UnresolvedOutcome {
  return {
    kind: "unresolved",
    intent: { summary },
    reason: "missing-or-invalid-trusted-interaction-evidence",
  };
}

function isValidEvidence(evidence: unknown): evidence is TrustedInteractionEvidence {
  return (
    typeof evidence === "object" &&
    evidence !== null &&
    (evidence as { readonly kind?: string }).kind === "trusted-interaction-evidence"
  );
}

function mapModelFailureCategory(category: ModelFailureCategory): OperationalEvidenceFailureCategory {
  switch (category) {
    case "unavailable":
      return "provider-unavailable";
    case "timeout":
      return "provider-timeout";
    case "rate-limited":
      return "provider-rate-limited";
    case "refused":
      return "provider-refused";
    case "malformed-result":
      return "provider-malformed-result";
    case "invalid-request":
      return "provider-invalid-request";
    case "unknown":
      return "provider-unknown";
  }
}

function mapModelRetryDisposition(
  category: ModelFailureCategory,
  retryable: boolean,
): OperationalEvidenceRetryDisposition {
  switch (category) {
    case "refused":
    case "malformed-result":
    case "invalid-request":
      return "non-retryable";
    case "unavailable":
    case "timeout":
    case "rate-limited":
    case "unknown":
      return retryable ? "explicit-retry-eligible" : "non-retryable";
  }
}

const DELETION_INITIAL_REQUEST_IDS = new WeakMap<object, string>();

export class InteractionOrchestrator {
  constructor(private readonly dependencies: InteractionOrchestratorDependencies) {}

  private emit(
    context: ObservationContext | undefined,
    eventInit: {
      readonly stage: OperationalEvidenceStage;
      readonly operationCategory: OperationalEvidenceOperationCategory;
      readonly status: OperationalEvidenceStatus;
      readonly failureCategory?: OperationalEvidenceFailureCategory;
      readonly retryDisposition: OperationalEvidenceRetryDisposition;
      readonly entityType?: OperationalEvidenceEntityType;
      readonly durationMilliseconds?: number;
      readonly inputUnits?: number;
      readonly outputUnits?: number;
    },
  ): void {
    if (this.dependencies.evidenceSink === undefined || context === undefined) {
      return;
    }
    if (!isProvenanceObservationContext(context)) {
      return;
    }

    const event = createOperationalEvidenceEvent({
      schemaVersion: 1,
      correlationId: context.correlationId,
      requestId: context.requestId,
      ...(context.operationId !== undefined ? { operationId: context.operationId } : {}),
      ...eventInit,
    });

    if (event !== undefined) {
      try {
        const result = this.dependencies.evidenceSink.emit(event);
        if (result !== undefined && typeof (result as Promise<void>).catch === "function") {
          (result as Promise<void>).catch(() => {
            // Fail-open containment: sink errors never disrupt execution.
          });
        }
      } catch {
        // Fail-open containment: synchronous throws never disrupt execution.
      }
    }
  }

  observeUserInteraction(
    text: NonEmptyText | string,
  ): TrustedInteractionEvidence | ProhibitedOutcome | UnresolvedOutcome {
    const raw = text.toString().trim();
    if (raw.length === 0) {
      return {
        kind: "unresolved",
        intent: { summary: "unspecified-intent" },
        reason: "empty-interaction-text",
      };
    }
    if (containsAuthenticationMaterial(raw)) {
      return {
        kind: "prohibited",
        intent: normalizeUserIntent(raw),
        reason: "authentication-material-capture",
      };
    }
    const intent = normalizeUserIntent(raw);
    return this.dependencies.humanControlRuntime.trustedInteractionIngress.observeInteraction(
      intent,
    );
  }

  async handleAdvisory(
    input: AdvisoryInteractionInput,
  ): Promise<ModelInteractionOutcome> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "advisory",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const rawText = input.text.toString().trim();
    const intent = input.intent ?? normalizeUserIntent(rawText);

    if (rawText.length === 0) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    if (containsAuthenticationMaterial(rawText)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const validatedText = nonEmptyText(rawText);
    if (validatedText === undefined) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "advisory",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const contextResult = await selectBoundedContextForTurn(
      this.dependencies.retrievalService,
      {
        interactionText: validatedText,
        projectId: input.projectId,
        actionId: input.actionId,
        itemLimit: input.itemLimit,
        selectionReason: input.selectionReason,
        includeCrossProjectKnowledge: true,
      },
    );

    if (contextResult.kind === "project-not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "clarification-required",
        intent,
        reason: "ambiguous-target",
      };
    }

    if (contextResult.kind === "context-rejected") {
      if (contextResult.reason === "authentication-material-excluded") {
        this.emit(ctx, {
          stage: "retrieval",
          operationCategory: "advisory",
          status: "failed",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, contextResult.reason, false);
    }

    if (contextResult.kind === "retrieval-failed") {
      const retryDisp = contextResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, contextResult.reason, contextResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "advisory",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const requestResult = createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: validatedText,
      context: contextResult.context,
    });

    if (requestResult.kind === "invalid-request") {
      if (requestResult.reason === "authentication-material-excluded") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "advisory",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, requestResult.reason, false);
    }

    this.emit(ctx, {
      stage: "provider",
      operationCategory: "advisory",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const modelResult = await this.dependencies.modelCapabilityPort.execute(
      requestResult.value,
    );

    switch (modelResult.kind) {
      case "advisory":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "advisory",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "advisory",
          status: "advisory",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "advisory",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "advisory",
          value: modelResult.content,
        };
      case "proposal":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "advisory",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "advisory",
          status: "proposed",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "proposed",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "proposed",
          proposal: modelResult.operations,
        };
      case "uncertain":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "advisory",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "advisory",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "clarification-required",
          intent,
          reason: "ambiguous-target",
        };
      case "unable":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "advisory",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "advisory",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "unresolved",
          intent,
          reason: modelResult.reason,
        };
      case "failure": {
        const failureCategory = mapModelFailureCategory(modelResult.failure.category);
        const retryDisposition = mapModelRetryDisposition(
          modelResult.failure.category,
          modelResult.failure.retryable,
        );
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "advisory",
          status: "failed",
          failureCategory,
          retryDisposition,
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "advisory",
          status: "failed",
          failureCategory,
          retryDisposition,
        });
        return failedOutcome(
          intent,
          modelResult.failure.message,
          modelResult.failure.retryable,
        );
      }
    }
  }

  async handleProposal(
    input: ProposalInteractionInput,
  ): Promise<ModelInteractionOutcome> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "proposal",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const rawText = input.text.toString().trim();
    const intent = input.intent ?? normalizeUserIntent(rawText);

    if (rawText.length === 0) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    if (containsAuthenticationMaterial(rawText)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const validatedText = nonEmptyText(rawText);
    if (validatedText === undefined) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "proposal",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const contextResult = await selectBoundedContextForTurn(
      this.dependencies.retrievalService,
      {
        interactionText: validatedText,
        projectId: input.projectId,
        actionId: input.actionId,
        itemLimit: input.itemLimit,
        selectionReason: input.selectionReason,
        includeCrossProjectKnowledge: true,
      },
    );

    if (contextResult.kind === "project-not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "clarification-required",
        intent,
        reason: "ambiguous-target",
      };
    }

    if (contextResult.kind === "context-rejected") {
      if (contextResult.reason === "authentication-material-excluded") {
        this.emit(ctx, {
          stage: "retrieval",
          operationCategory: "proposal",
          status: "failed",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, contextResult.reason, false);
    }

    if (contextResult.kind === "retrieval-failed") {
      const retryDisp = contextResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, contextResult.reason, contextResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "proposal",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const requestResult = createModelCapabilityRequest({
      capability: "propose-operations",
      interaction: validatedText,
      context: contextResult.context,
    });

    if (requestResult.kind === "invalid-request") {
      if (requestResult.reason === "authentication-material-excluded") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "proposal",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, requestResult.reason, false);
    }

    this.emit(ctx, {
      stage: "provider",
      operationCategory: "proposal",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const modelResult = await this.dependencies.modelCapabilityPort.execute(
      requestResult.value,
    );

    switch (modelResult.kind) {
      case "proposal":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "proposal",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "proposal",
          status: "proposed",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "proposed",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "proposed",
          proposal: modelResult.operations,
        };
      case "advisory":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "proposal",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "proposal",
          status: "advisory",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "advisory",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "advisory",
          value: modelResult.content,
        };
      case "uncertain":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "proposal",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "proposal",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "clarification-required",
          intent,
          reason: "ambiguous-target",
        };
      case "unable":
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "proposal",
          status: "succeeded",
          retryDisposition: "not-applicable",
          ...(modelResult.diagnostics?.durationMilliseconds !== undefined
            ? { durationMilliseconds: modelResult.diagnostics.durationMilliseconds }
            : {}),
          ...(modelResult.diagnostics?.inputUnits !== undefined
            ? { inputUnits: modelResult.diagnostics.inputUnits }
            : {}),
          ...(modelResult.diagnostics?.outputUnits !== undefined
            ? { outputUnits: modelResult.diagnostics.outputUnits }
            : {}),
        });
        this.emit(ctx, {
          stage: "interpretation",
          operationCategory: "proposal",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
        return {
          kind: "unresolved",
          intent,
          reason: modelResult.reason,
        };
      case "failure": {
        const failureCategory = mapModelFailureCategory(modelResult.failure.category);
        const retryDisposition = mapModelRetryDisposition(
          modelResult.failure.category,
          modelResult.failure.retryable,
        );
        this.emit(ctx, {
          stage: "provider",
          operationCategory: "proposal",
          status: "failed",
          failureCategory,
          retryDisposition,
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "proposal",
          status: "failed",
          failureCategory,
          retryDisposition,
        });
        return failedOutcome(
          intent,
          modelResult.failure.message,
          modelResult.failure.retryable,
        );
      }
    }
  }

  private handlePersistenceOutcome<T>(
    ctx: ObservationContext | undefined,
    operationCategory: OperationalEvidenceOperationCategory,
    entityType: OperationalEvidenceEntityType,
    result: PortionOutcome<T>,
  ): PortionOutcome<T> {
    if (result.kind === "accepted") {
      const status = result.disposition === "already-committed" ? "duplicate" : "accepted";
      this.emit(ctx, {
        stage: "persistence",
        operationCategory,
        status,
        retryDisposition: "not-applicable",
        entityType,
      });
      this.emit(ctx, {
        stage: "derived-state",
        operationCategory,
        status: "not-applicable",
        retryDisposition: "not-applicable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory,
        status: "accepted",
        retryDisposition: "not-applicable",
        entityType,
      });
      return result;
    }

    if (result.kind === "failed") {
      let failureCategory: OperationalEvidenceFailureCategory = "unclassified-failure";
      let retryDisposition: OperationalEvidenceRetryDisposition = result.retryable
        ? "explicit-retry-eligible"
        : "non-retryable";

      if (result.reason === "operation-id-conflict") {
        failureCategory = "operation-id-conflict";
        retryDisposition = "non-retryable";
      } else if (result.reason === "constraint-conflict") {
        failureCategory = "constraint-conflict";
        retryDisposition = "non-retryable";
      } else if (result.reason === "durability-failure" || result.reason === "persistence-failed") {
        failureCategory = "persistence-durability";
        retryDisposition = result.retryable ? "explicit-retry-eligible" : "non-retryable";
      } else if (result.reason === "missing-malformed-or-mismatched-authorization") {
        failureCategory = "authorization-denied";
        retryDisposition = "non-retryable";
      } else if (result.reason === "not-found") {
        failureCategory = "not-found";
        retryDisposition = "non-retryable";
      }

      this.emit(ctx, {
        stage: "persistence",
        operationCategory,
        status: "failed",
        failureCategory,
        retryDisposition,
        entityType,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory,
        status: "failed",
        failureCategory,
        retryDisposition,
        entityType,
      });
      return result;
    }

    if (result.kind === "prohibited") {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory,
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return result;
    }

    if (result.kind === "clarification-required") {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory,
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return result;
    }

    if (result.kind === "unresolved") {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory,
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return result;
    }

    return result;
  }

  async establishProject(
    input: EstablishProjectInput,
  ): Promise<PortionOutcome<Project>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Establish project ${input.id}`);
    }

    const intent = { summary: `Establish project ${input.id}` };

    if (containsAuthenticationMaterial(input.intendedOutcome)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const scope: OrdinaryMutationScope = {
      operation: "create-project",
      projectId: input.id,
      intendedOutcome: input.intendedOutcome,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "project",
    });

    const result = await this.dependencies.projectActionContextService.establishProject({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      intendedOutcome: input.intendedOutcome,
    });

    return this.handlePersistenceOutcome(ctx, "project-mutation", "project", result);
  }

  async completeProject(
    input: CompleteProjectInput,
  ): Promise<PortionOutcome<AcceptedProjectLifecycle>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Complete project ${input.projectId}`);
    }

    const intent = { summary: `Complete project ${input.projectId}` };

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "project-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "complete-project",
      projectId: input.projectId,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "project",
    });

    const result = await this.dependencies.projectActionContextService.completeProject({
      intent,
      operationId: input.operationId,
      authorization,
      projectId: input.projectId,
    });

    return this.handlePersistenceOutcome(ctx, "project-mutation", "project", result);
  }

  async reopenProject(
    input: ReopenProjectInput,
  ): Promise<PortionOutcome<AcceptedProjectLifecycle>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Reopen project ${input.projectId}`);
    }

    const intent = { summary: `Reopen project ${input.projectId}` };

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "project-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "reopen-project",
      projectId: input.projectId,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "project-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "project-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "project-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "project-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "project",
    });

    const result = await this.dependencies.projectActionContextService.reopenProject({
      intent,
      operationId: input.operationId,
      authorization,
      projectId: input.projectId,
    });

    return this.handlePersistenceOutcome(ctx, "project-mutation", "project", result);
  }

  async createAction(input: CreateActionInput): Promise<PortionOutcome<Action>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Create action ${input.id} in project ${input.projectId}`,
      );
    }

    const intent = { summary: `Create action ${input.id} in project ${input.projectId}` };

    if (containsAuthenticationMaterial(input.description)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "create-action",
      actionId: input.id,
      projectId: input.projectId,
      description: input.description,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "action",
    });

    const result = await this.dependencies.projectActionContextService.createAction({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      projectId: input.projectId,
      description: input.description,
    });

    return this.handlePersistenceOutcome(ctx, "action-mutation", "action", result);
  }

  async completeAction(
    input: CompleteActionInput,
  ): Promise<PortionOutcome<AcceptedActionLifecycle>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Complete action ${input.actionId}`);
    }

    const intent = { summary: `Complete action ${input.actionId}` };

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "complete-action",
      actionId: input.actionId,
      projectId: input.projectId,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "action",
    });

    const result = await this.dependencies.projectActionContextService.completeAction({
      intent,
      operationId: input.operationId,
      authorization,
      actionId: input.actionId,
      projectId: input.projectId,
    });

    return this.handlePersistenceOutcome(ctx, "action-mutation", "action", result);
  }

  async reopenAction(
    input: ReopenActionInput,
  ): Promise<PortionOutcome<AcceptedActionLifecycle>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Reopen action ${input.actionId}`);
    }

    const intent = { summary: `Reopen action ${input.actionId}` };

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "reopen-action",
      actionId: input.actionId,
      projectId: input.projectId,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "action-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "action-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "action-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "action-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "action",
    });

    const result = await this.dependencies.projectActionContextService.reopenAction({
      intent,
      operationId: input.operationId,
      authorization,
      actionId: input.actionId,
      projectId: input.projectId,
    });

    return this.handlePersistenceOutcome(ctx, "action-mutation", "action", result);
  }

  async acceptContextFacts(
    input: AcceptContextFactsInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "context-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Accept context facts for ${input.projectId}`,
      );
    }

    const intent = { summary: `Accept context facts for ${input.projectId}` };

    if (input.facts.some((f) => containsAuthenticationMaterial(f))) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "context-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    const factsResult = await this.dependencies.retrievalService.getAcceptedContextFacts(
      input.projectId,
    );
    if (factsResult.kind === "retrieval-failed") {
      const retryDisp = factsResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      const retryDisp = progressResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "context-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const currentContext: AcceptedProjectContext = {
      projectId: input.projectId,
      facts: factsResult.kind === "found" ? factsResult.value : [],
      progress: progressResult.kind === "found" ? progressResult.value : [],
    };

    const scope: OrdinaryMutationScope = {
      operation: "accept-context-facts",
      projectId: input.projectId,
      facts: input.facts,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "context-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "context-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "context-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "context-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "context-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "context-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "context-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "context-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "accepted-context",
    });

    const result = await this.dependencies.projectActionContextService.acceptContextFacts({
      intent,
      operationId: input.operationId,
      authorization,
      context: currentContext,
      facts: input.facts,
    });

    return this.handlePersistenceOutcome(ctx, "context-mutation", "accepted-context", result);
  }

  async acceptProgress(
    input: AcceptProgressInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Accept progress ${input.id} in project ${input.projectId}`,
      );
    }

    const intent = { summary: `Accept progress ${input.id} in project ${input.projectId}` };

    if (containsAuthenticationMaterial(input.statement)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    let action: Action | undefined;
    if (input.actionId !== undefined) {
      const actionsResult = await this.dependencies.retrievalService.getActionsForProject(
        input.projectId,
      );
      if (actionsResult.kind === "retrieval-failed") {
        const retryDisp = actionsResult.retryable ? "explicit-retry-eligible" : "non-retryable";
        this.emit(ctx, {
          stage: "retrieval",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "retrieval-failed",
          retryDisposition: retryDisp,
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "retrieval-failed",
          retryDisposition: retryDisp,
        });
        return failedOutcome(intent, actionsResult.reason, actionsResult.retryable);
      }
      if (actionsResult.kind === "found") {
        action = actionsResult.value.find((a) => a.id === input.actionId);
      }
    }

    const factsResult = await this.dependencies.retrievalService.getAcceptedContextFacts(
      input.projectId,
    );
    if (factsResult.kind === "retrieval-failed") {
      const retryDisp = factsResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      const retryDisp = progressResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "progress-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const currentContext: AcceptedProjectContext = {
      projectId: input.projectId,
      facts: factsResult.kind === "found" ? factsResult.value : [],
      progress: progressResult.kind === "found" ? progressResult.value : [],
    };

    const scope: OrdinaryMutationScope = {
      operation: "accept-progress",
      progressId: input.id,
      projectId: input.projectId,
      actionId: input.actionId,
      statement: input.statement,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "progress-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "accepted-progress",
    });

    const result = await this.dependencies.projectActionContextService.acceptProgress({
      intent,
      operationId: input.operationId,
      authorization,
      context: currentContext,
      id: input.id,
      projectId: input.projectId,
      statement: input.statement,
      actionId: input.actionId,
      action,
    });

    return this.handlePersistenceOutcome(ctx, "progress-mutation", "accepted-progress", result);
  }

  async correctProgress(
    input: CorrectProgressInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Correct progress ${input.priorId} with ${input.successorId}`,
      );
    }

    const intent = {
      summary: `Correct progress ${input.priorId} with ${input.successorId}`,
    };

    if (containsAuthenticationMaterial(input.statement)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    const factsResult = await this.dependencies.retrievalService.getAcceptedContextFacts(
      input.projectId,
    );
    if (factsResult.kind === "retrieval-failed") {
      const retryDisp = factsResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      const retryDisp = progressResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

    const progressList = progressResult.kind === "found" ? progressResult.value : [];
    const priorProgress = progressList.find((p) => p.id === input.priorId);
    if (priorProgress === undefined) {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, "progress-not-current", false);
    }

    let action: Action | undefined;
    if (priorProgress.actionId !== undefined) {
      const actionsResult = await this.dependencies.retrievalService.getActionsForProject(
        input.projectId,
      );
      if (actionsResult.kind === "retrieval-failed") {
        const retryDisp = actionsResult.retryable ? "explicit-retry-eligible" : "non-retryable";
        this.emit(ctx, {
          stage: "retrieval",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "retrieval-failed",
          retryDisposition: retryDisp,
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "retrieval-failed",
          retryDisposition: retryDisp,
        });
        return failedOutcome(intent, actionsResult.reason, actionsResult.retryable);
      }
      const actionsList = actionsResult.kind === "found" ? actionsResult.value : [];
      action = actionsList.find((a) => a.id === priorProgress.actionId);
      if (action === undefined) {
        this.emit(ctx, {
          stage: "retrieval",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "not-found",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "failed",
          failureCategory: "not-found",
          retryDisposition: "non-retryable",
        });
        return failedOutcome(intent, "action-project-mismatch", false);
      }
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "progress-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const currentContext: AcceptedProjectContext = {
      projectId: input.projectId,
      facts: factsResult.kind === "found" ? factsResult.value : [],
      progress: progressList,
    };

    const scope: OrdinaryMutationScope = {
      operation: "correct-progress",
      projectId: input.projectId,
      priorProgressId: input.priorId,
      successorProgressId: input.successorId,
      statement: input.statement,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "progress-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "progress-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "progress-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "progress-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "accepted-progress",
    });

    const result = await this.dependencies.projectActionContextService.correctProgress({
      intent,
      operationId: input.operationId,
      authorization,
      context: currentContext,
      priorId: input.priorId,
      successorId: input.successorId,
      statement: input.statement,
      action,
    });

    return this.handlePersistenceOutcome(ctx, "progress-mutation", "accepted-progress", result);
  }

  async captureKnowledge(
    input: CaptureKnowledgeInput,
  ): Promise<PortionOutcome<KnowledgeItem>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Capture knowledge ${input.id}`);
    }

    const intent = { summary: `Capture knowledge ${input.id}` };

    if (containsAuthenticationMaterial(input.content)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.originatingProjectId,
    );
    if (projectResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "clarification-required",
        failureCategory: "clarification-required",
        retryDisposition: "non-retryable",
      });
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      const retryDisp = projectResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "knowledge-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "capture-knowledge",
      knowledgeItemId: input.id,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "knowledge-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "knowledge-item",
    });

    const result = await this.dependencies.knowledgeProvenanceService.capture({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
      intentional: input.intentional ?? true,
    });

    return this.handlePersistenceOutcome(ctx, "knowledge-mutation", "knowledge-item", result);
  }

  async correctKnowledge(
    input: CorrectKnowledgeInput,
  ): Promise<PortionOutcome<KnowledgeItem>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(`Correct knowledge ${input.priorId}`);
    }

    const intent = { summary: `Correct knowledge ${input.priorId}` };

    if (containsAuthenticationMaterial(input.content)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "prohibited-input",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const priorResult = await this.dependencies.retrievalService.getKnowledgeItem(
      input.priorId,
    );
    if (priorResult.kind === "not-found") {
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "not-found",
        retryDisposition: "non-retryable",
      });
      return failedOutcome(intent, "correction-prior-not-found", false);
    }
    if (priorResult.kind === "retrieval-failed") {
      const retryDisp = priorResult.retryable ? "explicit-retry-eligible" : "non-retryable";
      this.emit(ctx, {
        stage: "retrieval",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "failed",
        failureCategory: "retrieval-failed",
        retryDisposition: retryDisp,
      });
      return failedOutcome(intent, priorResult.reason, priorResult.retryable);
    }

    this.emit(ctx, {
      stage: "retrieval",
      operationCategory: "knowledge-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    const scope: OrdinaryMutationScope = {
      operation: "correct-knowledge",
      priorKnowledgeItemId: input.priorId,
      successorKnowledgeItemId: input.successorId,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
    };

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyOrdinaryDirection(
      input.evidence,
      scope,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-ordinary-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "knowledge-mutation",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "knowledge-mutation",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "knowledge-mutation",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "knowledge-mutation",
      status: "attempted",
      retryDisposition: "not-applicable",
      entityType: "knowledge-item",
    });

    const result = await this.dependencies.knowledgeProvenanceService.correct({
      intent,
      operationId: input.operationId,
      authorization,
      prior: priorResult.value,
      successorId: input.successorId,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
    });

    return this.handlePersistenceOutcome(ctx, "knowledge-mutation", "knowledge-item", result);
  }

  async initiateDeletion(
    input: InitiateDeletionInput,
  ): Promise<DeletionDirectionOutcome> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "deletion",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Initiate deletion for ${input.scope?.targetId ?? "unknown"}`,
      );
    }

    const intent = {
      summary: `Initiate deletion for ${input.scope?.targetId ?? "unknown"}`,
    };
    const snapshot = validateAndSnapshotDeletionScope(input.scope);
    if (snapshot === undefined) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "invalid-deletion-scope",
      };
    }

    const classification = this.dependencies.humanControlRuntime.humanControl.classifyDeletionDirection(
      input.evidence,
      snapshot,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (classification.kind !== "classified-deletion-direction") {
      if (classification.kind === "clarification-required") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "clarification-required",
          failureCategory: "clarification-required",
          retryDisposition: "non-retryable",
        });
      } else if (classification.kind === "prohibited") {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "denied",
          failureCategory: "prohibited-input",
          retryDisposition: "non-retryable",
        });
      } else {
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "unresolved",
          failureCategory: "unresolved",
          retryDisposition: "non-retryable",
        });
      }
      return classification;
    }

    const prompt = nonEmptyText(
      `Please confirm deletion of ${snapshot.targetKind} '${snapshot.targetId}'.`,
    )!;

    if (ctx?.requestId !== undefined) {
      DELETION_INITIAL_REQUEST_IDS.set(classification, ctx.requestId);
    }

    const augmentedDirection = Object.assign(classification, {
      ...(ctx?.requestId !== undefined ? { initialRequestId: ctx.requestId } : {}),
    });

    this.emit(ctx, {
      stage: "user-visible",
      operationCategory: "deletion",
      status: "proposed",
      retryDisposition: "not-applicable",
    });

    return {
      kind: "deletion-direction-recorded",
      intent,
      scope: snapshot,
      direction: augmentedDirection,
      prompt,
    };
  }

  async confirmDeletion(
    input: DeletionConfirmationInput,
  ): Promise<PortionOutcome<ConfirmedDeletionResult>> {
    const ctx = input.observationContext;
    this.emit(ctx, {
      stage: "request",
      operationCategory: "deletion",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    if (!isValidEvidence(input.evidence)) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "failed",
        failureCategory: "validation",
        retryDisposition: "non-retryable",
      });
      return invalidEvidenceOutcome(
        `Confirm deletion for ${input.scope?.targetId ?? "unknown"}`,
      );
    }

    const intent = {
      summary: `Confirm deletion for ${input.scope?.targetId ?? "unknown"}`,
    };
    const snapshot = validateAndSnapshotDeletionScope(input.scope);
    if (snapshot === undefined) {
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "unresolved",
        failureCategory: "unresolved",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "invalid-deletion-scope",
      };
    }

    const turn1RequestId =
      input.direction?.initialRequestId ??
      (input.direction ? DELETION_INITIAL_REQUEST_IDS.get(input.direction) : undefined);
    const turn2RequestId = ctx?.requestId;

    if (
      turn1RequestId === undefined ||
      turn2RequestId === undefined ||
      turn1RequestId === turn2RequestId
    ) {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return {
        kind: "unresolved",
        intent,
        reason: "invalid-mismatched-or-same-interaction-deletion-evidence",
      };
    }

    const confirmation = this.dependencies.humanControlRuntime.humanControl.classifyDeletionConfirmation(
      input.evidence,
      snapshot,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (confirmation.kind !== "classified-deletion-confirmation") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return confirmation;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "deletion",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeConfirmedDeletion(
      input.direction,
      confirmation,
      snapshot,
    );

    if (authorization.kind !== "confirmed-deletion-authorization") {
      this.emit(ctx, {
        stage: "authorization",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      this.emit(ctx, {
        stage: "user-visible",
        operationCategory: "deletion",
        status: "denied",
        failureCategory: "authorization-denied",
        retryDisposition: "non-retryable",
      });
      return authorization;
    }

    this.emit(ctx, {
      stage: "authorization",
      operationCategory: "deletion",
      status: "succeeded",
      retryDisposition: "not-applicable",
    });

    this.emit(ctx, {
      stage: "persistence",
      operationCategory: "deletion",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const deleteResult = await this.dependencies.exportDeletionService.deleteConfirmed({
      operationId: input.operationId,
      scope: snapshot,
      authorization,
    });

    switch (deleteResult.kind) {
      case "deleted":
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "accepted",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "derived-state",
          operationCategory: "deletion",
          status: "not-applicable",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "accepted",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "accepted",
          value: deleteResult,
        };
      case "already-deleted":
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "duplicate",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "derived-state",
          operationCategory: "deletion",
          status: "not-applicable",
          retryDisposition: "not-applicable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "accepted",
          retryDisposition: "not-applicable",
        });
        return {
          kind: "accepted",
          value: deleteResult,
        };
      case "deletion-rejected":
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "authorization-denied",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "authorization-denied",
          retryDisposition: "non-retryable",
        });
        return failedOutcome(intent, deleteResult.reason, false);
      case "not-found":
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "not-found",
          retryDisposition: "non-retryable",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "not-found",
          retryDisposition: "non-retryable",
        });
        return failedOutcome(intent, "target-not-found", false);
      case "deletion-failed": {
        const retryDisp = deleteResult.retryable ? "explicit-retry-eligible" : "non-retryable";
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "deletion-write-failed",
          retryDisposition: retryDisp,
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "failed",
          failureCategory: "deletion-write-failed",
          retryDisposition: retryDisp,
        });
        return failedOutcome(intent, deleteResult.reason, deleteResult.retryable);
      }
      case "deletion-indeterminate":
        this.emit(ctx, {
          stage: "persistence",
          operationCategory: "deletion",
          status: "indeterminate",
          failureCategory: "persistence-indeterminate",
          retryDisposition: "indeterminate-manual-check",
        });
        this.emit(ctx, {
          stage: "user-visible",
          operationCategory: "deletion",
          status: "indeterminate",
          failureCategory: "persistence-indeterminate",
          retryDisposition: "indeterminate-manual-check",
        });
        return failedOutcome(intent, deleteResult.reason, deleteResult.retryable);
    }
  }

  async exportAcceptedState(
    observationContext?: ObservationContext,
  ): Promise<PortionOutcome<ExportAcceptedStateResult>> {
    this.emit(observationContext, {
      stage: "request",
      operationCategory: "export",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    this.emit(observationContext, {
      stage: "retrieval",
      operationCategory: "export",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const result = await this.dependencies.exportDeletionService.exportAcceptedState();
    if (result.kind === "exported") {
      this.emit(observationContext, {
        stage: "retrieval",
        operationCategory: "export",
        status: "succeeded",
        retryDisposition: "not-applicable",
      });
      this.emit(observationContext, {
        stage: "user-visible",
        operationCategory: "export",
        status: "accepted",
        retryDisposition: "not-applicable",
      });
      return {
        kind: "accepted",
        value: result,
      };
    }

    const retryDisp = result.retryable ? "explicit-retry-eligible" : "non-retryable";
    this.emit(observationContext, {
      stage: "retrieval",
      operationCategory: "export",
      status: "failed",
      failureCategory: "export-read-failed",
      retryDisposition: retryDisp,
    });
    this.emit(observationContext, {
      stage: "user-visible",
      operationCategory: "export",
      status: "failed",
      failureCategory: "export-read-failed",
      retryDisposition: retryDisp,
    });
    return failedOutcome(
      { summary: "export-accepted-state" },
      result.reason,
      result.retryable,
    );
  }

  async handleMixed(
    portions: readonly (() => Promise<PortionOutcome>)[],
    observationContext?: ObservationContext,
  ): Promise<MixedOutcome> {
    this.emit(observationContext, {
      stage: "request",
      operationCategory: "mixed-request",
      status: "attempted",
      retryDisposition: "not-applicable",
    });

    const executedPortions: PortionOutcome[] = [];
    for (const executePortion of portions) {
      const portion = await executePortion();
      executedPortions.push(portion);
    }

    const acceptedCount = executedPortions.filter((p) => p.kind === "accepted").length;
    const nonAcceptedCount = executedPortions.length - acceptedCount;

    if (acceptedCount === executedPortions.length && executedPortions.length > 0) {
      this.emit(observationContext, {
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "accepted",
        retryDisposition: "not-applicable",
      });
    } else if (acceptedCount > 0 && nonAcceptedCount > 0) {
      this.emit(observationContext, {
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "partial",
        failureCategory: "mixed-outcome",
        retryDisposition: "non-retryable",
      });
    } else {
      this.emit(observationContext, {
        stage: "user-visible",
        operationCategory: "mixed-request",
        status: "failed",
        failureCategory: "unclassified-failure",
        retryDisposition: "non-retryable",
      });
    }

    return mixedOutcome(executedPortions);
  }
}

export function createInteractionOrchestrator(
  dependencies: InteractionOrchestratorDependencies,
): InteractionOrchestrator {
  return new InteractionOrchestrator(dependencies);
}

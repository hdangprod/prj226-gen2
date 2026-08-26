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
} from "../../ports/model/modelCapability";
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

export class InteractionOrchestrator {
  constructor(private readonly dependencies: InteractionOrchestratorDependencies) {}

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
    const rawText = input.text.toString().trim();
    const intent = input.intent ?? normalizeUserIntent(rawText);

    if (rawText.length === 0) {
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    if (containsAuthenticationMaterial(rawText)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const validatedText = nonEmptyText(rawText);
    if (validatedText === undefined) {
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

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
      return {
        kind: "clarification-required",
        intent,
        reason: "ambiguous-target",
      };
    }

    if (contextResult.kind === "context-rejected") {
      if (contextResult.reason === "authentication-material-excluded") {
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      return failedOutcome(intent, contextResult.reason, false);
    }

    if (contextResult.kind === "retrieval-failed") {
      return failedOutcome(intent, contextResult.reason, contextResult.retryable);
    }

    const requestResult = createModelCapabilityRequest({
      capability: "generate-advice",
      interaction: validatedText,
      context: contextResult.context,
    });

    if (requestResult.kind === "invalid-request") {
      if (requestResult.reason === "authentication-material-excluded") {
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      return failedOutcome(intent, requestResult.reason, false);
    }

    const modelResult = await this.dependencies.modelCapabilityPort.execute(
      requestResult.value,
    );

    switch (modelResult.kind) {
      case "advisory":
        return {
          kind: "advisory",
          value: modelResult.content,
        };
      case "proposal":
        return {
          kind: "proposed",
          proposal: modelResult.operations,
        };
      case "uncertain":
        return {
          kind: "clarification-required",
          intent,
          reason: "ambiguous-target",
        };
      case "unable":
        return {
          kind: "unresolved",
          intent,
          reason: modelResult.reason,
        };
      case "failure":
        return failedOutcome(
          intent,
          modelResult.failure.message,
          modelResult.failure.retryable,
        );
    }
  }

  async handleProposal(
    input: ProposalInteractionInput,
  ): Promise<ModelInteractionOutcome> {
    const rawText = input.text.toString().trim();
    const intent = input.intent ?? normalizeUserIntent(rawText);

    if (rawText.length === 0) {
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

    if (containsAuthenticationMaterial(rawText)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const validatedText = nonEmptyText(rawText);
    if (validatedText === undefined) {
      return {
        kind: "unresolved",
        intent,
        reason: "empty-interaction-text",
      };
    }

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
      return {
        kind: "clarification-required",
        intent,
        reason: "ambiguous-target",
      };
    }

    if (contextResult.kind === "context-rejected") {
      if (contextResult.reason === "authentication-material-excluded") {
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      return failedOutcome(intent, contextResult.reason, false);
    }

    if (contextResult.kind === "retrieval-failed") {
      return failedOutcome(intent, contextResult.reason, contextResult.retryable);
    }

    const requestResult = createModelCapabilityRequest({
      capability: "propose-operations",
      interaction: validatedText,
      context: contextResult.context,
    });

    if (requestResult.kind === "invalid-request") {
      if (requestResult.reason === "authentication-material-excluded") {
        return {
          kind: "prohibited",
          intent,
          reason: "authentication-material-capture",
        };
      }
      return failedOutcome(intent, requestResult.reason, false);
    }

    const modelResult = await this.dependencies.modelCapabilityPort.execute(
      requestResult.value,
    );

    switch (modelResult.kind) {
      case "proposal":
        return {
          kind: "proposed",
          proposal: modelResult.operations,
        };
      case "advisory":
        return {
          kind: "advisory",
          value: modelResult.content,
        };
      case "uncertain":
        return {
          kind: "clarification-required",
          intent,
          reason: "ambiguous-target",
        };
      case "unable":
        return {
          kind: "unresolved",
          intent,
          reason: modelResult.reason,
        };
      case "failure":
        return failedOutcome(
          intent,
          modelResult.failure.message,
          modelResult.failure.retryable,
        );
    }
  }

  async establishProject(
    input: EstablishProjectInput,
  ): Promise<PortionOutcome<Project>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Establish project ${input.id}`);
    }

    const intent = { summary: `Establish project ${input.id}` };

    if (containsAuthenticationMaterial(input.intendedOutcome)) {
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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.establishProject({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      intendedOutcome: input.intendedOutcome,
    });
  }

  async completeProject(
    input: CompleteProjectInput,
  ): Promise<PortionOutcome<AcceptedProjectLifecycle>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Complete project ${input.projectId}`);
    }

    const intent = { summary: `Complete project ${input.projectId}` };
    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.completeProject({
      intent,
      operationId: input.operationId,
      authorization,
      projectId: input.projectId,
    });
  }

  async reopenProject(
    input: ReopenProjectInput,
  ): Promise<PortionOutcome<AcceptedProjectLifecycle>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Reopen project ${input.projectId}`);
    }

    const intent = { summary: `Reopen project ${input.projectId}` };
    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.reopenProject({
      intent,
      operationId: input.operationId,
      authorization,
      projectId: input.projectId,
    });
  }

  async createAction(input: CreateActionInput): Promise<PortionOutcome<Action>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Create action ${input.id} in project ${input.projectId}`,
      );
    }

    const intent = { summary: `Create action ${input.id} in project ${input.projectId}` };

    if (containsAuthenticationMaterial(input.description)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.createAction({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      projectId: input.projectId,
      description: input.description,
    });
  }

  async completeAction(
    input: CompleteActionInput,
  ): Promise<PortionOutcome<AcceptedActionLifecycle>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Complete action ${input.actionId}`);
    }

    const intent = { summary: `Complete action ${input.actionId}` };
    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.completeAction({
      intent,
      operationId: input.operationId,
      authorization,
      actionId: input.actionId,
      projectId: input.projectId,
    });
  }

  async reopenAction(
    input: ReopenActionInput,
  ): Promise<PortionOutcome<AcceptedActionLifecycle>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Reopen action ${input.actionId}`);
    }

    const intent = { summary: `Reopen action ${input.actionId}` };
    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.reopenAction({
      intent,
      operationId: input.operationId,
      authorization,
      actionId: input.actionId,
      projectId: input.projectId,
    });
  }

  async acceptContextFacts(
    input: AcceptContextFactsInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Accept context facts for ${input.projectId}`,
      );
    }

    const intent = { summary: `Accept context facts for ${input.projectId}` };

    if (input.facts.some((f) => containsAuthenticationMaterial(f))) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    const factsResult = await this.dependencies.retrievalService.getAcceptedContextFacts(
      input.projectId,
    );
    if (factsResult.kind === "retrieval-failed") {
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.acceptContextFacts({
      intent,
      operationId: input.operationId,
      authorization,
      context: currentContext,
      facts: input.facts,
    });
  }

  async acceptProgress(
    input: AcceptProgressInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Accept progress ${input.id} in project ${input.projectId}`,
      );
    }

    const intent = { summary: `Accept progress ${input.id} in project ${input.projectId}` };

    if (containsAuthenticationMaterial(input.statement)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    let action: Action | undefined;
    if (input.actionId !== undefined) {
      const actionsResult = await this.dependencies.retrievalService.getActionsForProject(
        input.projectId,
      );
      if (actionsResult.kind === "retrieval-failed") {
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
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.acceptProgress({
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
  }

  async correctProgress(
    input: CorrectProgressInput,
  ): Promise<PortionOutcome<AcceptedProjectContext>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Correct progress ${input.priorId} with ${input.successorId}`,
      );
    }

    const intent = {
      summary: `Correct progress ${input.priorId} with ${input.successorId}`,
    };

    if (containsAuthenticationMaterial(input.statement)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.projectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

    const factsResult = await this.dependencies.retrievalService.getAcceptedContextFacts(
      input.projectId,
    );
    if (factsResult.kind === "retrieval-failed") {
      return failedOutcome(intent, factsResult.reason, factsResult.retryable);
    }

    const progressResult = await this.dependencies.retrievalService.getCurrentProgress(
      input.projectId,
    );
    if (progressResult.kind === "retrieval-failed") {
      return failedOutcome(intent, progressResult.reason, progressResult.retryable);
    }

    const progressList = progressResult.kind === "found" ? progressResult.value : [];
    const priorProgress = progressList.find((p) => p.id === input.priorId);
    if (priorProgress === undefined) {
      return failedOutcome(intent, "progress-not-current", false);
    }

    let action: Action | undefined;
    if (priorProgress.actionId !== undefined) {
      const actionsResult = await this.dependencies.retrievalService.getActionsForProject(
        input.projectId,
      );
      if (actionsResult.kind === "retrieval-failed") {
        return failedOutcome(intent, actionsResult.reason, actionsResult.retryable);
      }
      const actionsList = actionsResult.kind === "found" ? actionsResult.value : [];
      action = actionsList.find((a) => a.id === priorProgress.actionId);
      if (action === undefined) {
        return failedOutcome(intent, "action-project-mismatch", false);
      }
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.projectActionContextService.correctProgress({
      intent,
      operationId: input.operationId,
      authorization,
      context: currentContext,
      priorId: input.priorId,
      successorId: input.successorId,
      statement: input.statement,
      action,
    });
  }

  async captureKnowledge(
    input: CaptureKnowledgeInput,
  ): Promise<PortionOutcome<KnowledgeItem>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Capture knowledge ${input.id}`);
    }

    const intent = { summary: `Capture knowledge ${input.id}` };

    if (containsAuthenticationMaterial(input.content)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const projectResult = await this.dependencies.retrievalService.getProject(
      input.originatingProjectId,
    );
    if (projectResult.kind === "not-found") {
      return { kind: "clarification-required", intent, reason: "ambiguous-target" };
    }
    if (projectResult.kind === "retrieval-failed") {
      return failedOutcome(intent, projectResult.reason, projectResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.knowledgeProvenanceService.capture({
      intent,
      operationId: input.operationId,
      authorization,
      id: input.id,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
      intentional: input.intentional ?? true,
    });
  }

  async correctKnowledge(
    input: CorrectKnowledgeInput,
  ): Promise<PortionOutcome<KnowledgeItem>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(`Correct knowledge ${input.priorId}`);
    }

    const intent = { summary: `Correct knowledge ${input.priorId}` };

    if (containsAuthenticationMaterial(input.content)) {
      return {
        kind: "prohibited",
        intent,
        reason: "authentication-material-capture",
      };
    }

    const priorResult = await this.dependencies.retrievalService.getKnowledgeItem(
      input.priorId,
    );
    if (priorResult.kind === "not-found") {
      return failedOutcome(intent, "correction-prior-not-found", false);
    }
    if (priorResult.kind === "retrieval-failed") {
      return failedOutcome(intent, priorResult.reason, priorResult.retryable);
    }

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
      return classification;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeOrdinaryChange(
      classification,
      scope,
    );

    if (authorization.kind !== "ordinary-mutation-authorization") {
      return authorization;
    }

    return await this.dependencies.knowledgeProvenanceService.correct({
      intent,
      operationId: input.operationId,
      authorization,
      prior: priorResult.value,
      successorId: input.successorId,
      originatingProjectId: input.originatingProjectId,
      content: input.content,
    });
  }

  async initiateDeletion(
    input: InitiateDeletionInput,
  ): Promise<DeletionDirectionOutcome> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Initiate deletion for ${input.scope?.targetId ?? "unknown"}`,
      );
    }

    const intent = {
      summary: `Initiate deletion for ${input.scope.targetId}`,
    };
    const snapshot = validateAndSnapshotDeletionScope(input.scope);
    if (snapshot === undefined) {
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
      return classification;
    }

    const prompt = nonEmptyText(
      `Please confirm deletion of ${snapshot.targetKind} '${snapshot.targetId}'.`,
    )!;

    return {
      kind: "deletion-direction-recorded",
      intent,
      scope: snapshot,
      direction: classification,
      prompt,
    };
  }

  async confirmDeletion(
    input: DeletionConfirmationInput,
  ): Promise<PortionOutcome<ConfirmedDeletionResult>> {
    if (!isValidEvidence(input.evidence)) {
      return invalidEvidenceOutcome(
        `Confirm deletion for ${input.scope?.targetId ?? "unknown"}`,
      );
    }

    const intent = {
      summary: `Confirm deletion for ${input.scope.targetId}`,
    };
    const snapshot = validateAndSnapshotDeletionScope(input.scope);
    if (snapshot === undefined) {
      return {
        kind: "unresolved",
        intent,
        reason: "invalid-deletion-scope",
      };
    }

    const confirmation = this.dependencies.humanControlRuntime.humanControl.classifyDeletionConfirmation(
      input.evidence,
      snapshot,
      input.options ?? { target: "clear", effect: "clear" },
    );

    if (confirmation.kind !== "classified-deletion-confirmation") {
      return confirmation;
    }

    const authorization = this.dependencies.humanControlRuntime.humanControl.authorizeConfirmedDeletion(
      input.direction,
      confirmation,
      snapshot,
    );

    if (authorization.kind !== "confirmed-deletion-authorization") {
      return authorization;
    }

    const deleteResult = await this.dependencies.exportDeletionService.deleteConfirmed({
      operationId: input.operationId,
      scope: snapshot,
      authorization,
    });

    switch (deleteResult.kind) {
      case "deleted":
      case "already-deleted":
        return {
          kind: "accepted",
          value: deleteResult,
        };
      case "deletion-rejected":
        return failedOutcome(intent, deleteResult.reason, false);
      case "not-found":
        return failedOutcome(intent, "target-not-found", false);
      case "deletion-failed":
        return failedOutcome(intent, deleteResult.reason, deleteResult.retryable);
      case "deletion-indeterminate":
        return failedOutcome(intent, deleteResult.reason, deleteResult.retryable);
    }
  }

  async exportAcceptedState(): Promise<PortionOutcome<ExportAcceptedStateResult>> {
    const result = await this.dependencies.exportDeletionService.exportAcceptedState();
    if (result.kind === "exported") {
      return {
        kind: "accepted",
        value: result,
      };
    }
    return failedOutcome(
      { summary: "export-accepted-state" },
      result.reason,
      result.retryable,
    );
  }

  async handleMixed(
    portions: readonly (() => Promise<PortionOutcome>)[],
  ): Promise<MixedOutcome> {
    const executedPortions: PortionOutcome[] = [];
    for (const executePortion of portions) {
      const portion = await executePortion();
      executedPortions.push(portion);
    }
    return mixedOutcome(executedPortions);
  }
}

export function createInteractionOrchestrator(
  dependencies: InteractionOrchestratorDependencies,
): InteractionOrchestrator {
  return new InteractionOrchestrator(dependencies);
}

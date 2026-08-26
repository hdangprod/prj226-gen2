import {
  nonEmptyText,
  type Action,
  type KnowledgeItem,
} from "../../../domain/model";
import { referenceKnowledge } from "../../../domain/knowledge";
import {
  createBoundedModelContext,
  type ModelContextItem,
} from "../../ports/model/modelCapability";
import type { RetrievalService } from "../retrieval/retrievalTypes";
import type {
  ContextSelectionInput,
  ContextSelectionOutcome,
} from "./interactionTypes";

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

interface ScoredCandidate {
  readonly item: ModelContextItem;
  readonly score: number;
  readonly categoryRank: number;
  readonly canonicalId: string;
}

function extractInteractionTokens(text: string): readonly string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  return matches !== null ? Array.from(new Set(matches)) : [];
}

function extractTokens(text: string): Set<string> {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
  return new Set(matches ?? []);
}

function extractIdentifierTokens(text: string): readonly string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}_-]+/gu);
  return matches !== null ? Array.from(new Set(matches)) : [];
}

function computeTokenMatches(searchableText: string, interactionTokens: readonly string[]): number {
  if (interactionTokens.length === 0) return 0;
  const targetTokens = extractTokens(searchableText);
  let matches = 0;
  for (const token of interactionTokens) {
    if (targetTokens.has(token)) {
      matches += 1;
    }
  }
  return matches;
}

interface MaterialRelevanceAssessment {
  readonly isMateriallyRelevant: boolean;
  readonly matchCount: number;
}

/**
 * Assesses cross-Project Knowledge material relevance for an active Project turn.
 *
 * Bounded deterministic qualification rules:
 * 1. Exact unique identifier reference in the current interaction explicitly targets the knowledge item.
 * 2. Multi-token interaction overlap (>= 2 distinct matching tokens) demonstrates direct material relevance.
 * 3. Single-token interaction overlap (= 1 matching token) requires independent structural corroboration
 *    from active Project context (e.g. focused Action description, Project intended outcome, or accepted facts)
 *    to prevent generic/coincidental one-token false positives (e.g. 'api' or 'user' alone).
 *    Crucially, the sole interaction token is EXCLUDED from structural corroboration to ensure true independent evidence.
 * 4. Zero token matches or uncorroborated single generic tokens fail closed (isMateriallyRelevant: false).
 */
function assessCrossProjectMaterialRelevance(
  item: KnowledgeItem,
  interactionTokens: readonly string[],
  interactionTextRaw: string,
  projectContext?: {
    readonly intendedOutcome?: string;
    readonly focusedActionDescription?: string;
    readonly contextFacts?: readonly string[];
  },
): MaterialRelevanceAssessment {
  const knowledgeTokens = extractTokens(item.content);

  // 1. Direct interaction token overlap
  const interactionMatches = interactionTokens.filter((token) => knowledgeTokens.has(token));
  const interactionMatchCount = interactionMatches.length;

  // Exact bounded ID match in interaction text is an unambiguous specific reference
  const exactIdMatch = extractIdentifierTokens(interactionTextRaw).some(
    (token) => token === item.id.toLowerCase(),
  );
  if (exactIdMatch) {
    return { isMateriallyRelevant: true, matchCount: Math.max(interactionMatchCount, 2) };
  }

  // Multi-token interaction overlap indicates material applicability
  if (interactionMatchCount >= 2) {
    return { isMateriallyRelevant: true, matchCount: interactionMatchCount };
  }

  // If there is exactly 1 interaction token match, check for INDEPENDENT corroborating structural context from the active Project
  if (interactionMatchCount === 1 && projectContext !== undefined) {
    const soleInteractionToken = interactionMatches[0];
    let independentStructuralMatches = 0;

    const structuralTokens = new Set<string>();

    // Check focused Action description if active, excluding the sole interaction token
    if (projectContext.focusedActionDescription !== undefined) {
      for (const t of extractTokens(projectContext.focusedActionDescription)) {
        if (t !== soleInteractionToken) {
          structuralTokens.add(t);
        }
      }
    }

    // Check Project intended outcome, excluding the sole interaction token
    if (projectContext.intendedOutcome !== undefined) {
      for (const t of extractTokens(projectContext.intendedOutcome)) {
        if (t !== soleInteractionToken) {
          structuralTokens.add(t);
        }
      }
    }

    // Check accepted context facts, excluding the sole interaction token
    if (projectContext.contextFacts !== undefined && projectContext.contextFacts.length > 0) {
      for (const fact of projectContext.contextFacts) {
        for (const t of extractTokens(fact)) {
          if (t !== soleInteractionToken) {
            structuralTokens.add(t);
          }
        }
      }
    }

    for (const t of structuralTokens) {
      if (knowledgeTokens.has(t)) {
        independentStructuralMatches += 1;
      }
    }

    // If independent structural context corroborates applicability, qualify as materially relevant
    if (independentStructuralMatches >= 1) {
      return {
        isMateriallyRelevant: true,
        matchCount: interactionMatchCount + independentStructuralMatches,
      };
    }
  }

  // Single generic token or zero tokens without independent structural corroboration fails closed
  return { isMateriallyRelevant: false, matchCount: interactionMatchCount };
}

export async function selectBoundedContextForTurn(
  retrievalService: RetrievalService,
  input: ContextSelectionInput,
): Promise<ContextSelectionOutcome> {
  const rawItemLimit = input.itemLimit ?? 32;
  const itemLimit = Math.max(0, Math.min(32, Math.floor(rawItemLimit)));

  const defaultReason = input.projectId !== undefined
    ? `active-project-context-${input.projectId}`
    : "general-advisory-context";
  const selectionReasonString = (input.selectionReason ?? defaultReason).toString().trim();
  const selectionReason = nonEmptyText(
    selectionReasonString.length > 0 ? selectionReasonString : defaultReason,
  );

  if (selectionReason === undefined) {
    return {
      kind: "context-rejected",
      reason: "invalid-selection-reason",
    };
  }

  const interactionTextStr = input.interactionText.toString();
  if (
    containsAuthenticationMaterial(interactionTextStr) ||
    containsAuthenticationMaterial(selectionReason)
  ) {
    return {
      kind: "context-rejected",
      reason: "authentication-material-excluded",
    };
  }

  const interactionTokens = extractInteractionTokens(interactionTextStr);
  const scoredCandidates: ScoredCandidate[] = [];

  if (input.projectId !== undefined) {
    const projectResult = await retrievalService.getProject(input.projectId);
    if (projectResult.kind === "not-found") {
      return {
        kind: "project-not-found",
        projectId: input.projectId,
      };
    }
    if (projectResult.kind === "retrieval-failed") {
      return {
        kind: "retrieval-failed",
        reason: projectResult.reason,
        retryable: projectResult.retryable,
      };
    }

    // 1. Facts
    const factsResult = await retrievalService.getAcceptedContextFacts(input.projectId);
    if (factsResult.kind === "retrieval-failed") {
      return {
        kind: "retrieval-failed",
        reason: factsResult.reason,
        retryable: factsResult.retryable,
      };
    }
    if (factsResult.kind === "found") {
      const factRelevance = nonEmptyText("accepted-project-fact")!;
      for (let i = 0; i < factsResult.value.length; i++) {
        const fact = factsResult.value[i];
        const tokenMatches = computeTokenMatches(fact, interactionTokens);
        const score = tokenMatches * 10 + 10;
        scoredCandidates.push({
          item: {
            kind: "project-fact",
            projectId: input.projectId,
            fact,
            relevance: factRelevance,
          },
          score,
          categoryRank: 1,
          canonicalId: `fact-${String(i).padStart(4, "0")}`,
        });
      }
    }

    // 2. Actions
    let focusedAction: Action | undefined;
    const actionsResult = await retrievalService.getActionsForProject(input.projectId);
    if (actionsResult.kind === "retrieval-failed") {
      return {
        kind: "retrieval-failed",
        reason: actionsResult.reason,
        retryable: actionsResult.retryable,
      };
    }
    if (actionsResult.kind === "found") {
      for (const action of actionsResult.value) {
        const isFocusedAction = input.actionId !== undefined && action.id === input.actionId;
        if (isFocusedAction) {
          focusedAction = action;
        }
        const tokenMatches = computeTokenMatches(
          `${action.id} ${action.description}`,
          interactionTokens,
        );
        const actionBoost = isFocusedAction ? 1000 : 0;
        const score = actionBoost + tokenMatches * 10 + (action.state === "Open" ? 8 : 4);
        const relevance = nonEmptyText(
          action.state === "Open" ? "open-action" : "completed-action",
        )!;
        scoredCandidates.push({
          item: {
            kind: "action-summary",
            projectId: input.projectId,
            actionId: action.id,
            summary: action.description,
            relevance,
          },
          score,
          categoryRank: 2,
          canonicalId: action.id,
        });
      }
    }

    // 3. Progress
    const progressResult = await retrievalService.getCurrentProgress(input.projectId);
    if (progressResult.kind === "retrieval-failed") {
      return {
        kind: "retrieval-failed",
        reason: progressResult.reason,
        retryable: progressResult.retryable,
      };
    }
    if (progressResult.kind === "found") {
      const progressRelevance = nonEmptyText("current-progress")!;
      for (const progress of progressResult.value) {
        const isLinkedToFocusedAction =
          input.actionId !== undefined &&
          progress.actionId !== undefined &&
          progress.actionId === input.actionId;
        const tokenMatches = computeTokenMatches(progress.statement, interactionTokens);
        const progressBoost = isLinkedToFocusedAction ? 500 : 0;
        const score = progressBoost + tokenMatches * 10 + 6;
        scoredCandidates.push({
          item: {
            kind: "project-fact",
            projectId: input.projectId,
            fact: progress.statement,
            relevance: progressRelevance,
          },
          score,
          categoryRank: 3,
          canonicalId: progress.id,
        });
      }
    }

    // 4. Project Knowledge
    const knowledgeResult = await retrievalService.getCurrentKnowledgeForProject(input.projectId);
    if (knowledgeResult.kind === "retrieval-failed") {
      return {
        kind: "retrieval-failed",
        reason: knowledgeResult.reason,
        retryable: knowledgeResult.retryable,
      };
    }
    if (knowledgeResult.kind === "found") {
      const knowledgeRelevance = nonEmptyText("project-knowledge")!;
      for (const item of knowledgeResult.value) {
        const tokenMatches = computeTokenMatches(
          `${item.id} ${item.content}`,
          interactionTokens,
        );
        const score = tokenMatches * 10 + 2;
        scoredCandidates.push({
          item: {
            kind: "knowledge-excerpt",
            knowledgeItemId: item.id,
            originatingProjectId: item.originatingProjectId,
            excerpt: item.content,
            relevance: knowledgeRelevance,
            currentness: item.standing === "current" ? "current" : "qualified-prior",
          },
          score,
          categoryRank: 4,
          canonicalId: item.id,
        });
      }
    }

    // 5. Cross-Project Knowledge (Candidates filtered by material relevance & referenceKnowledge)
    if (input.includeCrossProjectKnowledge === true) {
      const crossResult = await retrievalService.getCurrentKnowledgeAcrossProjects({
        excludeOriginatingProjectId: input.projectId,
      });
      if (crossResult.kind === "retrieval-failed") {
        return {
          kind: "retrieval-failed",
          reason: crossResult.reason,
          retryable: crossResult.retryable,
        };
      }
      if (crossResult.kind === "found") {
        const crossRelevance = nonEmptyText("cross-project-knowledge")!;
        const projectContext = {
          intendedOutcome: projectResult.kind === "found" ? projectResult.value.intendedOutcome : undefined,
          focusedActionDescription: focusedAction?.description,
          contextFacts: factsResult.kind === "found" ? factsResult.value : undefined,
        };

        for (const item of crossResult.value) {
          const assessment = assessCrossProjectMaterialRelevance(
            item,
            interactionTokens,
            interactionTextStr,
            projectContext,
          );
          if (assessment.isMateriallyRelevant) {
            const refResult = referenceKnowledge(item, input.projectId, {
              materiallyRelevant: true,
            });
            if (refResult.kind === "valid-knowledge-reference") {
              const score = assessment.matchCount * 10;
              scoredCandidates.push({
                item: {
                  kind: "knowledge-excerpt",
                  knowledgeItemId: refResult.value.knowledgeItemId,
                  originatingProjectId: refResult.value.originatingProjectId,
                  excerpt: item.content,
                  relevance: crossRelevance,
                  currentness:
                    refResult.value.standing === "current" ? "current" : "qualified-prior",
                  qualification: refResult.value.qualification,
                },
                score,
                categoryRank: 5,
                canonicalId: item.id,
              });
            }
          }
        }
      }
    }
  } else {
    // Project-less advisory context
    if (input.includeCrossProjectKnowledge === true) {
      const crossResult = await retrievalService.getCurrentKnowledgeAcrossProjects();
      if (crossResult.kind === "retrieval-failed") {
        return {
          kind: "retrieval-failed",
          reason: crossResult.reason,
          retryable: crossResult.retryable,
        };
      }
      if (crossResult.kind === "found") {
        const crossRelevance = nonEmptyText("cross-project-knowledge")!;
        for (const item of crossResult.value) {
          const tokenMatches = computeTokenMatches(
            `${item.id} ${item.content}`,
            interactionTokens,
          );
          const isMateriallyRelevant = tokenMatches > 0;
          if (isMateriallyRelevant) {
            const score = tokenMatches * 10;
            scoredCandidates.push({
              item: {
                kind: "knowledge-excerpt",
                knowledgeItemId: item.id,
                originatingProjectId: item.originatingProjectId,
                excerpt: item.content,
                relevance: crossRelevance,
                currentness: item.standing === "current" ? "current" : "qualified-prior",
              },
              score,
              categoryRank: 5,
              canonicalId: item.id,
            });
          }
        }
      }
    }
  }

  // Deterministic relevance sorting:
  // 1. Highest score first
  // 2. Category priority (rank ASC)
  // 3. Stable canonical ID tie-breaker
  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.categoryRank !== b.categoryRank) {
      return a.categoryRank - b.categoryRank;
    }
    return a.canonicalId.localeCompare(b.canonicalId);
  });

  const orderedItems = scoredCandidates.map((c) => c.item);
  const truncatedItems = orderedItems.slice(0, itemLimit);

  const boundedContextResult = createBoundedModelContext({
    items: truncatedItems,
    itemLimit,
    selectionReason,
  });

  if (boundedContextResult.kind === "invalid-context") {
    return {
      kind: "context-rejected",
      reason: boundedContextResult.reason,
    };
  }

  return {
    kind: "context-selected",
    context: boundedContextResult.value,
  };
}

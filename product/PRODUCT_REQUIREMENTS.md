# Liam v1 Product Intent

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Approval decision:** `GOV-005` (APPROVED; G2 human disposition recorded)

**Authorization:** `GOV-004`

**Normative dependencies:** `PRD-001` revision 1; `PRD-002` revision 1; `PRD-003` revision 1; `PRD-004` revision 1; `BEH-003` revision 1; `DATA-001` revision 1; `QLT-001` revision 1.

**Reference sources:** [Foundation Program](../docs/foundation/FOUNDATION_PROGRAM.md) and [Foundation Decision Register](../docs/foundation/DECISIONS.md).

## Purpose and authority

This document is the approved C2 product-intent baseline for Liam v1. It defines the approved v1 user boundary, product outcome, minimum capabilities, usefulness outcomes, interaction needs, data-control expectations, quality constraints, and non-goals.

It is normative for its assigned product-intent topic following human approval of G2. The decision register owns the state and approval evidence for every decision traced below. This document does not authorize C3 or later work.

## Initial user and product boundary

- **PI-USER-001:** V1 is designed and validated for one real user first: the founder.
- **PI-USER-002:** V1 has one user only. Collaboration, shared ownership, multi-user permissions, and coordination semantics are excluded.
- **PI-USER-003:** Product semantics use a general single-user concept where sufficient and do not intentionally hard-code the founder's personal identity.
- **PI-USER-004:** Generalization for a broader single-user market is not a v1 requirement and may be evaluated later from evidence.
- **PI-SCOPE-001:** Liam v1 is a narrow project-and-knowledge assistant.
- **PI-SCOPE-002:** V1 helps the user move active projects forward, preserve enough project and work context to resume without mentally reconstructing it, capture and retrieve useful knowledge generated during project execution, and determine a concrete useful next action.
- **PI-SCOPE-003:** The broader Personal Life Operating System remains a long-term direction outside the v1 boundary.

## Minimum observable capabilities

- **PI-CAP-001:** Establish an active project and its intended outcome.
- **PI-CAP-002:** Preserve progress and enough working context for the user to resume later without manually reconstructing important context.
- **PI-CAP-003:** Refine immediate work into concrete actions and help identify a useful next action.
- **PI-CAP-004:** Capture useful project knowledge with low friction.
- **PI-CAP-005:** Retrieve relevant captured knowledge during later project work.

These are observable product capabilities only. They do not define hierarchy, entity lifecycles, context-selection semantics, recommendation policy, or confirmation rules.

## Usefulness outcomes

Primary v1 usefulness is demonstrated by whether the user can:

- **PI-OUT-001:** Resume active work without manually reconstructing important context.
- **PI-OUT-002:** Determine a concrete next useful action.
- **PI-OUT-003:** Capture relevant project knowledge with low friction.
- **PI-OUT-004:** Retrieve that knowledge later when it becomes relevant.

Usage measures may support this evidence, but usage alone is not proof of usefulness.

## Language and interaction boundary

- **PI-INT-001:** V1 supports Vietnamese and English as user languages.
- **PI-INT-002:** V1 interaction is text-based and conversational.
- **PI-INT-003:** One coherent interaction experience is sufficient for v1.
- **PI-INT-004:** Multiple interaction surfaces are outside the current v1 boundary unless later evidence requires them.
- **PI-INT-005:** No channel, application, provider, protocol, or technology is selected by this product-intent baseline.

## Product-level data control

- **PI-DATA-001:** The user decides what information to intentionally capture.
- **PI-DATA-002:** Accepted captured data is retained predictably until the user deletes it or otherwise directs its removal.
- **PI-DATA-003:** User-controlled deletion and export are required product capabilities.
- **PI-DATA-004:** User data must not be silently repurposed outside Liam's approved product function.
- **PI-DATA-005:** Credentials, authentication secrets, private keys, access tokens, and equivalent authentication material are outside the intended v1 capture boundary.
- **PI-DATA-006:** Liam must not represent itself as a medical, legal, or financial authority.
- **PI-DATA-007:** Ordinary project information is not automatically prohibited merely because a project concerns health, fitness, personal finance, or another potentially sensitive domain.
- **PI-DATA-008:** These expectations select no storage, encryption, retention implementation, authentication mechanism, provider, schema, or technical control.

## Technology-neutral quality constraints

- **PI-QLT-001:** V1 is optimized for one user's accumulated project and knowledge history; it has no multi-user or market-scale requirement.
- **PI-QLT-002:** Any capture or state change that Liam represents as accepted must not be silently lost or falsely reported as successful.
- **PI-QLT-003:** Failures must be visible and preserve enough of the user's intent or input to allow safe recovery or retry where applicable.
- **PI-QLT-004:** Uncertain retrieval or recommendation results must expose meaningful uncertainty and remain correctable by the user.
- **PI-QLT-005:** Routine text interaction should remain conversationally usable, but this baseline invents no latency service-level objective before evidence exists.
- **PI-QLT-006:** Every required v1 capability must eventually have observable pass/fail acceptance evidence.
- **PI-QLT-007:** When responsiveness conflicts with preservation, correctness, or recoverability, preservation, correctness, and recoverability take precedence.
- **PI-QLT-008:** These constraints select no implementation, testing, or observability mechanism.

## Explicit non-goals and unresolved boundaries

The following are not part of the approved v1 product-intent baseline:

- broader Personal Life Operating System scope;
- broader-market or multi-user generalization requirements;
- collaboration, shared ownership, permissions, or coordination semantics;
- multiple interaction surfaces;
- capture of authentication material;
- representing Liam as a medical, legal, or financial authority;
- scenario-corpus or semantic-acceptance definition;
- domain vocabulary, hierarchy, relationships, or lifecycle semantics;
- runtime architecture, technology or provider selection, schemas, APIs, implementation planning, source code, or deployment.

The following decisions remain explicitly OPEN and are not resolved or implied by this document:

| Decision | Unresolved question preserved |
| --- | --- |
| `BEH-001` | How current project or task context is selected, corrected, and resumed. |
| `BEH-002` | Which inputs, precedence, explanations, and overrides govern next-action recommendations. |
| `BEH-004` | Which actions are advisory, state-changing, confirmable, reversible, or prohibited. |

`MOD-001` through `MOD-004` remain open for later domain work. `VAL-001` remains open for separately authorized C3 scenario and acceptance-evidence work. This C2 baseline introduces no answers to those decisions.

## Decision traceability

| Product-intent content | Governing approved decision |
| --- | --- |
| Initial user and collaboration boundary | `PRD-001`, revision 1 |
| V1 outcome, scope, and Life OS non-goal | `PRD-002`, revision 1 |
| Usefulness outcomes and supporting-use evidence | `PRD-003`, revision 1 |
| Languages and interaction boundary | `PRD-004`, revision 1 |
| Minimum observable capability map | `BEH-003`, revision 1 |
| Product-level data-control policy | `DATA-001`, revision 1 |
| Technology-neutral quality constraints | `QLT-001`, revision 1 |

## G2 review boundary

This revision was the G2 review candidate approved through an independent human disposition recorded in `GOV-005`. G2 approval approves this product-intent baseline only; it does not authorize C3, scenario work, domain modeling, architecture, technology or provider selection, implementation, or deployment.

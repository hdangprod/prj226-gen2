# Liam v1 Product Foundation Baseline

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-010`

**Approval decision:** `GOV-011` (APPROVED; G5 human disposition recorded)

**Normative dependencies:** `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `product/DOMAIN_MODEL.md` revision 1; `PRD-001` through `PRD-004` revision 1; `BEH-001` through `BEH-004` revision 1; `MOD-001` through `MOD-004` revision 1; `DATA-001` revision 1; `VAL-001` revision 1; `QLT-001` revision 1.

**Reference sources:** [Foundation Program](../docs/foundation/FOUNDATION_PROGRAM.md) and [Foundation Decision Register](../docs/foundation/DECISIONS.md). `FOUNDATION_SEED.md` is historical provenance only and supplies no authority to this baseline.

## Purpose and authority

This document is the approved C5 reconciliation baseline for Liam v1. It answers what the approved product foundation establishes when Product Intent, Scenario Corpus, Domain Model, data-control, validation, and quality authority are read together.

It does not replace the detailed topic authority of its approved dependencies. This revision is normative for its assigned product-foundation topic through human G5 disposition recorded in `GOV-011`.

This baseline defines product facts and constraints only. It defines no runtime architecture, persistence design, database or schema, API, provider, technology, algorithm, delivery process, implementation plan, engineering task, source code, or deployment design.

## Reconciled product foundation

- **PF-BND-001 — User and product boundary:** Liam v1 is designed and validated for the founder as one user while using a general single-user concept where sufficient. Collaboration, shared ownership, multi-user permissions, coordination semantics, broader-market requirements, and the broader Personal Life Operating System are outside v1. V1 remains a narrow project-and-knowledge assistant.
- **PF-INT-001 — Interaction boundary:** V1 supports Vietnamese and English through one coherent text-based conversational experience. No channel, application, provider, protocol, technology, or additional interaction surface is selected or required.
- **PF-USE-001 — Outcome-led usefulness:** Primary usefulness is whether the user can resume active work without reconstructing important context, determine a concrete next useful action, capture relevant project knowledge with low friction, and retrieve that knowledge later when relevant. Usage may support this evidence but does not replace it.
- **PF-CAP-001 — Minimum capability boundary:** V1 establishes an active Project and intended outcome; preserves accepted progress and enough context for resumption; refines immediate work into concrete actions and helps identify a useful next action; intentionally captures useful project knowledge with low friction; and retrieves relevant captured knowledge during later Project work. No additional capability is implied.
- **PF-MOD-001 — Minimum vocabulary and relationships:** `Project`, `Action`, and `Knowledge Item` are the minimum canonical v1 domain concepts. A Project is a bounded effort with an intended outcome and may have zero or more Actions. An Action is concrete accepted work, belongs to exactly one Project, and is not recursively nested. Every Knowledge Item originates in exactly one Project. Accepted Project Context, Accepted Progress, and Current Context are approved behavioral or context concepts, not additional work or knowledge taxonomies.
- **PF-LIFE-001 — Lifecycle semantics:** An accepted Project is `Active` or `Completed`; an accepted Action is `Open` or `Completed`. Completion and reopening are explicit and user-authoritative. Interruption, inactivity, lack of focus, unresolved matters, dependencies, blockers, or recommendation status do not change lifecycle state. Project completion does not cascade to Actions, accepted context, or Knowledge Items.
- **PF-CTX-001 — Context authority:** Lifecycle state, accepted domain state, and provisional conversational focus remain distinct. Explicit current user intent or correction is authoritative. Inference may support provisional context and non-state-changing help when sufficiently grounded, but remains qualified and never becomes accepted state by inference alone. An ambiguous state-changing target is clarified before acceptance.
- **PF-REC-001 — Recommendation semantics:** Recommendations are context-sensitive, advisory, explainable through their material basis, qualified where conflict or uncertainty matters, and user-overridable. Explicit current user intent and constraints prevail over contradictory inference. No universal scoring or permanent signal-precedence policy is defined. Rejection or inaction changes no state, and a proposed Action is not accepted merely because Liam recommends it.
- **PF-KNW-001 — Knowledge semantics:** Knowledge capture is intentional, accepted, taxonomy-free, and preserves relevant provenance. An accepted persisted correction supersedes affected prior knowledge without silently rewriting it; current standing and correction provenance remain reconstructible at the product-semantic level. A Knowledge Item may assist another Project only when materially relevant, with origin, context, and material uncertainty preserved where needed. Supersession remains distinct from deletion.
- **PF-CTL-001 — Human control:** Retrieval, explanation, summarization, recommendation, and proposal are non-state-changing. Clear explicit direction is sufficient for ordinary reversible or additive changes when target and effect are unambiguous. Ambiguity requires clarification. Destructive deletion requires clear scope and an additional explicit confirmation and has no guaranteed product-semantic undo. Mixed requests receive separate outcomes for acceptable, prohibited, failed, or unresolved portions.
- **PF-DATA-001 — User data control:** Product-level privacy and data control rest on user-directed intentional capture, predictable retention, deletion, export, and non-repurposing. Accepted captured data remains until the user deletes it or otherwise directs removal, and user data is not silently repurposed outside Liam's approved function. Authentication material is outside intended capture. Ordinary project data is not excluded solely because its domain may be sensitive, but Liam does not represent itself as medical, legal, or financial authority.
- **PF-QLT-001 — Reliability-weighted quality:** V1 is optimized for one user's accumulated Project and Knowledge Item history, not multi-user or market scale. Accepted changes are not silently lost or falsely reported as successful. Failures are visible and preserve enough intent or input for safe recovery or retry where applicable. Retrieval and recommendations expose meaningful uncertainty and remain correctable. Routine interaction remains conversationally usable without an invented latency target. Preservation, correctness, and recoverability take precedence over responsiveness, and every required capability has semantic pass/fail evidence.

## Foundation reconciliation matrix

The class records the issue found before or during C5 reconciliation. `B` items are resolved by the corresponding integrated baseline statement; `C` and `D` items remain explicitly unresolved or deferred. No `A` contradiction was found.

| Dimension | Reconciliation result | C5 statement | Classification |
| --- | --- | --- | --- |
| Product boundary | Founder-first validation and general single-user semantics are compatible; all sources preserve the narrow project-and-knowledge boundary and keep the Life OS, collaboration, broader-market requirements, and multiple surfaces outside v1. | `PF-BND-001`, `PF-INT-001` | **B — Missing C5 reconciliation, resolved here.** |
| Product usefulness | Product Intent outcomes, scenario evidence, domain semantics, and quality constraints preserve the same four outcome-led tests; none substitutes usage for usefulness. | `PF-USE-001` | **B — Missing C5 reconciliation, resolved here.** |
| Capability boundary | The five approved capabilities are represented by the 12-scenario corpus and explained by the minimum domain model without adding capabilities. | `PF-CAP-001` | **B — Missing C5 reconciliation, resolved here.** |
| Domain vocabulary | Project, Action, and Knowledge Item remain canonical; context and progress concepts explain behavior without reintroducing historical hierarchies or taxonomies as required types. | `PF-MOD-001` | **B — Missing C5 reconciliation, resolved here.** |
| Lifecycle semantics | Project and Action lifecycles explain activation, progress, interruption, completion, reopening, and simultaneous active work without treating focus or blockers as lifecycle state. | `PF-LIFE-001` | **B — Missing C5 reconciliation, resolved here.** |
| Context authority | Product, scenario, behavior-decision, and domain evidence consistently distinguish accepted state, explicit user authority, provisional context, and inference. | `PF-CTX-001` | **B — Missing C5 reconciliation, resolved here.** |
| Recommendation semantics | Approved evidence consistently requires concrete useful help, material-basis visibility, uncertainty where relevant, user override, and no state change through recommendation alone. | `PF-REC-001` | **B — Missing C5 reconciliation, resolved here.** |
| Knowledge semantics | Intentional capture, project origin, controlled reuse, correction by supersession, deletion distinction, and reconstructible provenance are mutually compatible. | `PF-KNW-001` | **B — Missing C5 reconciliation, resolved here.** |
| Human control | Advisory behavior, explicit ordinary changes, clarification for ambiguity, confirmed destructive deletion, and separate mixed-request outcomes form one risk-proportionate boundary. | `PF-CTL-001` | **B — Missing C5 reconciliation, resolved here.** |
| Data control | Intentional capture, predictable retention, export, confirmed deletion, sensitive-domain eligibility, authentication-material exclusion, authority limits, and non-repurposing are consistent. | `PF-DATA-001` | **B — Missing C5 reconciliation, resolved here.** |
| Quality | Reliability-weighted, technology-neutral constraints align with accepted-state truthfulness, failure recovery, uncertain retrieval and recommendation, conversational usability, and semantic acceptance evidence. | `PF-QLT-001` | **B — Missing C5 reconciliation, resolved here.** |
| Predecessor-stage status wording | Product Intent and Scenario Corpus preserve decisions as open or deferred at their respective C2/C3 boundaries. The decision register expressly owns current decision state and later records the C4 decisions as approved; the predecessor wording neither overrides that state nor changes its stage-local meaning. | Current state is supplied by the decision register and reconciled above. | **E — Non-issue.** |

## Semantic traceability

| Foundation statement | Approved decisions | Product Intent | Scenario evidence | Domain Model |
| --- | --- | --- | --- | --- |
| `PF-BND-001` | `PRD-001`, `PRD-002` | `PI-USER-001`–`PI-USER-004`, `PI-SCOPE-001`–`PI-SCOPE-003` | `INV-001`, `INV-002`; `SCN-001`, `SCN-006`, `SCN-012` | Minimum vocabulary; invariants 1, 16 |
| `PF-INT-001` | `PRD-004` | `PI-INT-001`–`PI-INT-005` | `INV-003`; `SCN-001`, `SCN-002`, `SCN-007`, `SCN-012` | Traceability: interaction, acceptance-evidence, and scope boundaries; invariant 16 |
| `PF-USE-001` | `PRD-003`, `QLT-001` | `PI-OUT-001`–`PI-OUT-004` | `SCN-002`–`SCN-005`, `SCN-007`, `SCN-009` | Accepted context, progress, and resumption; knowledge lifecycle; recommendation semantics |
| `PF-CAP-001` | `BEH-003`, `VAL-001` | `PI-CAP-001`–`PI-CAP-005` | `SCN-001`–`SCN-010`; Product Intent traceability matrix | Relationships and cardinality; traceability matrix |
| `PF-MOD-001` | `MOD-001`, `MOD-003`, `MOD-004` | `PI-CAP-001`, `PI-CAP-003`–`PI-CAP-005` | `SCN-001`, `SCN-002`, `SCN-005`, `SCN-008`, `SCN-009` | Minimum vocabulary; relationships; invariants 2–4, 8, 11 |
| `PF-LIFE-001` | `MOD-002` | `PI-CAP-002`, `PI-OUT-001` | `SCN-003`, `SCN-004`, `SCN-006` | Project and Action lifecycles; invariants 5–8 |
| `PF-CTX-001` | `BEH-001`, `QLT-001` | `PI-CAP-002`, `PI-QLT-002`–`PI-QLT-004`, `PI-QLT-007` | `INV-008`, `INV-009`; `SCN-003`, `SCN-004`, `SCN-006` | Accepted context; current-context authority; invariants 5, 9, 10 |
| `PF-REC-001` | `BEH-002` | `PI-CAP-003`, `PI-OUT-002`, `PI-QLT-004`, `PI-QLT-005` | `SCN-002`, `SCN-003`, `SCN-007`, `SCN-008` | Recommendation semantics; invariant 13 |
| `PF-KNW-001` | `MOD-003`, `MOD-004`, `DATA-001` | `PI-CAP-004`, `PI-CAP-005`, `PI-OUT-003`, `PI-OUT-004`, `PI-DATA-001`–`PI-DATA-003` | `INV-004`, `INV-005`; `SCN-005`, `SCN-008`–`SCN-010` | Knowledge lifecycle, provenance, and reuse; invariants 11, 12, 15 |
| `PF-CTL-001` | `BEH-001`, `BEH-002`, `BEH-004` | `PI-DATA-001`, `PI-QLT-002`–`PI-QLT-004`, `PI-QLT-007` | `INV-004`, `INV-008`, `INV-009`; `SCN-001`, `SCN-004`, `SCN-006`, `SCN-008`, `SCN-010`, `SCN-011` | Human-control semantics; invariants 9, 10, 13, 14 |
| `PF-DATA-001` | `DATA-001`, `BEH-004` | `PI-DATA-001`–`PI-DATA-008` | `INV-004`–`INV-008`, `INV-011`; `SCN-005`, `SCN-010`, `SCN-011` | Knowledge lifecycle and deletion; human-control prohibitions; invariants 10–12, 14–16 |
| `PF-QLT-001` | `QLT-001`, `VAL-001` | `PI-QLT-001`–`PI-QLT-008` | `INV-004`, `INV-008`–`INV-011`; semantic expected and prohibited outcomes across `SCN-001`–`SCN-012` | Accepted context and failure semantics; recommendation semantics; invariants 9, 10, 13, 16 |

## Unresolved and deferred boundaries

There are no `OPEN` decisions in the decision register. Every PRD, BEH, MOD, DATA, VAL, and QLT decision required by this baseline is `APPROVED` at revision 1.

The following product-semantic choices are intentionally unmodeled. They are not required to satisfy C5 and are not silently decided here.

| Unmodeled choice | C5 disposition | Classification |
| --- | --- | --- |
| Intentional Project abandonment or Action withdrawal | Preserve as unmodeled pending approved evidence and a later product-semantic decision. | **C — Legitimate unresolved decision.** |
| Area, Milestone, Phase, Task, Step, recursive work decomposition, or other planning hierarchy | Preserve the approved absence of these canonical types; any addition requires approved evidence and revision. | **C — Legitimate unresolved decision.** |
| Non-project knowledge or broader Life OS semantics | Preserve outside the v1 boundary. | **C — Legitimate unresolved decision.** |
| Knowledge taxonomy or promotion stages | Preserve taxonomy-free capture and leave additional type semantics unmodeled. | **C — Legitimate unresolved decision.** |
| Persistent recommendation preferences or permanent signal precedence | Preserve context-sensitive recommendations without inventing a persistent policy. | **C — Legitimate unresolved decision.** |
| Product-semantic undo after confirmed deletion | Preserve the approved absence of a guaranteed undo. | **C — Legitimate unresolved decision.** |

All decision-register records that remain `DEFERRED` are genuine later-stage questions and remain unresolved:

| Decision | Does C5 require resolution? | Assigned boundary | Classification |
| --- | --- | --- | --- |
| `PLAN-001` — roadmap and release sequencing | No. | Later separately authorized product or release planning. | **D — Later-stage question.** |
| `DLV-001` — provider-neutral AI governance | No. | C6, after human G5 approval and separate C6 authorization. | **D — Later-stage question.** |
| `DLV-002` — delivery packet and engineering completion contract | No. | C6, after human G5 approval and separate C6 authorization. | **D — Later-stage question.** |
| `ARC-001` — persistence ownership | No. | Separately authorized architecture work; not C5, C6, or C7. | **D — Later-stage question.** |
| `ARC-002` — runtime architecture boundaries | No. | Separately authorized architecture work; not C5, C6, or C7. | **D — Later-stage question.** |
| `ARC-003` — integration strategy and provider choices | No. | Separately authorized architecture work; not C5, C6, or C7. | **D — Later-stage question.** |
| `ARC-004` — technical testing and observability strategy | No. | Separately authorized architecture work; not C5, C6, or C7. | **D — Later-stage question.** |
| `ARC-005` — runtime project-memory architecture | No. | Separately authorized architecture work; not C5, C6, or C7. | **D — Later-stage question.** |
| `ARC-006` — technology selection | No. | Separately authorized architecture work after approved architecture inputs; not C5, C6, or C7. | **D — Later-stage question.** |

No deferred record is closed, accelerated, or treated as implicitly approved by this baseline.

## C5 verification evidence

- **Authorization:** `GOV-010` records explicit human C5 authorization after human G4 approval through `GOV-009`.
- **Approved inputs:** Product Intent revision 1, Scenario Corpus revision 1, Domain Model revision 1, `VAL-001` revision 1, and every listed PRD, BEH, MOD, DATA, and QLT dependency are approved.
- **Internal reconciliation:** All required product boundary, usefulness, capability, vocabulary, lifecycle, context, recommendation, knowledge, human-control, data-control, and quality dimensions reconcile without an actual contradiction.
- **Traceability:** Every `PF-*` statement traces semantically to approved decisions and applicable Product Intent, scenario, and Domain Model evidence.
- **Unresolved decisions:** No decision record is `OPEN`; all nine `DEFERRED` records and all intentionally unmodeled product-semantic choices are explicit and unnecessary for C5.
- **Excluded work:** This baseline introduces no architecture, persistence, database, schema, API, provider, technology, delivery-governance, implementation-plan, engineering-task, runtime-source, or deployment artifact.
- **Review boundary:** Independent review recorded `G5 REVIEW: PASS`, and the human owner approved G5 and this exact revision through `GOV-011`.

## G5 review boundary

C5 and G5 are complete through the human disposition recorded in `GOV-011`. G5 approval approves this product-foundation baseline only; C6, C7, architecture, engineering, and runtime work remain unauthorized.

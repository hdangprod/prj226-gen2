# Liam v1 Domain and Lifecycle Semantics

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-008`

**Approval decision:** `GOV-009` (APPROVED; G4 human disposition recorded)

**Normative dependencies:** `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `MOD-001` revision 1; `MOD-002` revision 1; `MOD-003` revision 1; `MOD-004` revision 1; `BEH-001` revision 1; `BEH-002` revision 1; `BEH-004` revision 1; `DATA-001` revision 1; `QLT-001` revision 1.

**Reference sources:** [Foundation Program](../docs/foundation/FOUNDATION_PROGRAM.md) and [Foundation Decision Register](../docs/foundation/DECISIONS.md). `FOUNDATION_SEED.md` is non-normative provenance only.

## Purpose and authority

This document is the approved C4 domain and lifecycle baseline for Liam v1. It defines the minimum vocabulary, product-level relationships, lifecycles, context authority, knowledge provenance, recommendation semantics, human-control boundaries, and invariants needed to interpret the approved Product Intent and Scenario Corpus.

This revision is approved authority for its assigned C4 topic through human G4 disposition recorded in `GOV-009`. The decision register owns decision state and approval evidence. This document defines no persistence model, schema, API, runtime architecture, provider, algorithm, or implementation object.

## Minimum domain vocabulary

| Concept | Product-semantic meaning | Boundary |
| --- | --- | --- |
| User | The one person whose Projects, Actions, accepted context, and Knowledge Items comprise the v1 experience. | A general single-user concept; not the founder's hard-coded identity and not a collaborator or permission-bearing actor. |
| Project | A bounded effort with an intended outcome. | Not an Area, Milestone, Phase, portfolio, life domain, or container hierarchy. |
| Action | Concrete accepted work that is sufficiently clear to begin and has a recognizable stopping or completion point. | Not a distinct Task or Step type and not recursively nested in another Action. A recommendation does not create an Action without acceptance. |
| Accepted Project Context | User-accepted facts needed to understand and resume a Project, including accepted progress, unresolved matters, known dependencies or constraints, and relevant immediate-work context. | A product-semantic body of accepted context, not a document, record, memory store, event log, or persistence boundary. |
| Accepted Progress | An accepted statement about work or change that has occurred within a Project. | Context rather than another work type. It may exist without an Action and does not itself complete an Action. |
| Knowledge Item | Intentionally captured project knowledge with accepted content and relevant provenance. | No required taxonomy and no canonical Resource, Working Note, Finding, Decision, Reflection, or Artifact subtype. |
| Current Context | Provisional conversational focus used to interpret an interaction when a target is needed. | Distinct from accepted Project or Action state; inference does not turn it into accepted domain fact. |

Recommendation is an advisory result, not an accepted domain object. It may describe an existing `Open` Action or propose work that could become an Action only through explicit user acceptance.

## Relationships and product-level cardinality

| Relationship | Cardinality and semantics | Authority |
| --- | --- | --- |
| User to Project | The one v1 User may have zero or more Projects. Every Project belongs to that User's experience. | `PRD-001`; `MOD-001`; `SCN-001`, `SCN-006` |
| Project to intended outcome | Every accepted Project has an intended outcome, supplied or clarified from user-provided information. | `PI-CAP-001`; `MOD-001`; `SCN-001` |
| Project to Action | A Project may have zero or more Actions. Every Action belongs to exactly one Project. | `MOD-001`; `SCN-001`, `SCN-002`, `SCN-007` |
| Project to Accepted Progress | A Project may have zero or more accepted progress facts. Each accepted progress fact applies to exactly one Project and may, but need not, concern one of that Project's Actions. | `MOD-002`; `BEH-001`; `SCN-003`, `SCN-004` |
| Project to Knowledge Item | Within the approved v1 capture boundary, every Knowledge Item has exactly one originating Project whose work produced its capture context. | `MOD-003`; `MOD-004`; `SCN-005`, `SCN-009` |
| Knowledge Item reuse | A Knowledge Item may assist zero or more Projects other than its origin when materially relevant. Reuse does not change its origin or make it universal truth. | `MOD-004`; `SCN-009` |
| Knowledge supersession | An accepted persisted correction identifies and supersedes the affected prior Knowledge Item. The correction retains reconstructible semantic provenance. | `MOD-003`; `SCN-008` |
| Current target | Conversation may discuss several Projects. When a state-changing operation requires a target, it has exactly one target Project and may have one target Action that belongs to that Project. | `BEH-001`; `SCN-006` |

These cardinalities are product semantics only. They do not imply tables, keys, records, identifiers, joins, aggregates, or storage ownership.

## Project and Action lifecycles

Only accepted Projects and Actions enter these lifecycles. A proposal or failed acceptance attempt is not a lifecycle state.

### Project

| State | Meaning | Allowed transition |
| --- | --- | --- |
| `Active` | The accepted Project remains an effort whose intended outcome has not been accepted as achieved. | A newly accepted Project enters `Active`. Explicit user-authoritative completion moves it to `Completed`. |
| `Completed` | The user authoritatively accepts that the Project's intended outcome has been achieved. | Explicit user reopening moves it to `Active`. |

### Action

| State | Meaning | Allowed transition |
| --- | --- | --- |
| `Open` | The accepted Action's recognizable stopping or completion point has not been accepted as satisfied. | A newly accepted Action enters `Open`. Explicit user-authoritative completion moves it to `Completed`. |
| `Completed` | The user authoritatively accepts that the Action's recognizable stopping or completion point has been satisfied. | Explicit user reopening or correction moves it to `Open`. |

Interruption, inactivity, lack of conversational focus, unresolved matters, dependencies, or blockers do not change either lifecycle. `Active` does not mean current conversational focus, and `Open` does not mean currently recommended. Project completion does not delete, archive, invalidate, or change the lifecycle of its Actions, accepted context, or related Knowledge Items.

V1 defines no canonical `Paused`, `Blocked`, `Abandoned`, `Cancelled`, `Withdrawn`, `Archived`, or equivalent state. Intentional abandonment remains unmodeled rather than being treated as completion.

## Accepted context, progress, and resumption

- Accepted Project Context contains accepted facts; uncertain interpretation remains distinguishable from those facts.
- Accepted Progress may describe meaningful completed work without creating or completing an Action.
- Recording accepted progress changes Project Context only to the extent explicitly accepted; it does not silently change Project or Action lifecycle.
- Known unresolved matters and dependencies remain available for resumption and recommendation but are not lifecycle states.
- Prior accepted context may support resumption, but the user's explicit current intent or correction takes precedence.
- A failed acceptance attempt changes no accepted domain state. The failure is visible, and enough user intent or input remains available for safe recovery or retry where applicable.

## Current-context authority

- Multiple Projects may simultaneously be `Active`.
- Project lifecycle and Current Context are distinct.
- Explicit current user selection, statement, or correction is authoritative.
- Liam may infer provisional Current Context when evidence is sufficiently unambiguous.
- Inferred context remains qualified inference; it is not accepted domain fact merely because it was inferred.
- If ambiguity would affect an accepted state-changing operation, Liam clarifies the target before reporting acceptance.
- Inference may support retrieval, explanation, or recommendation when material uncertainty is exposed.

This section defines no recency rule, context window, ranking method, retrieval mechanism, or persistence strategy.

## Knowledge lifecycle, provenance, and reuse

### Capture and standing

- Conversation becomes a Knowledge Item only through intentional user-directed and accepted capture.
- Capture requires no taxonomy choice.
- An accepted Knowledge Item has current semantic standing unless it is superseded or deleted.
- Descriptive terms such as note, resource, finding, decision, reflection, or artifact may be used naturally without creating domain types or promotion stages.

### Correction and supersession

- An accepted persisted correction becomes current knowledge and supersedes the affected prior Knowledge Item.
- Superseded knowledge is retained only as permitted by the user's data-control choices and is not presented as current unqualified knowledge.
- The correction relationship and relevant origin remain reconstructible at the product-semantic level.
- A later correction may supersede the current correction; the prior supersession semantics remain intact.
- Supersession is not deletion and cannot prevent later user-directed deletion.

### Cross-Project reuse

- A Knowledge Item preserves its originating Project.
- It may assist another Project only when materially relevant.
- Reuse preserves relevant origin or context and exposes material uncertainty where needed for correct interpretation.
- The user may reject or correct inappropriate reuse.
- Reuse does not make project-specific knowledge universally true and does not change its originating Project.

Confirmed deletion removes the affected item from retained user data and later retrieval as retained knowledge. `Deleted` is not defined as a retained lifecycle state, and no product-semantic undo is promised. This defines no technical history, versioning, identifier, deletion mechanism, or storage behavior.

## Recommendation semantics

A recommendation may consider:

- explicit current user intent and constraints;
- accepted Project Context;
- relevant `Open` Actions;
- accepted progress and unresolved matters;
- relevant Knowledge Items with appropriate provenance; and
- dependencies or constraints known from accepted context.

Explicit current user intent and constraints prevail over contradictory inference. No universal scoring function or permanent precedence hierarchy governs the remaining signals. Material conflict or uncertainty is exposed. Liam may offer one leading candidate when evidence supports one or a short set when ambiguity is material.

Recommendations remain advisory and user-overridable. Rejecting, ignoring, or choosing differently changes no domain state. A proposed Action becomes an accepted `Open` Action only through a separately accepted state change.

## Human-control semantics

| Interaction class | Examples | Product-semantic effect and control |
| --- | --- | --- |
| Advisory or non-state-changing | Retrieval, explanation, summarization, recommendation, proposal | Does not alter accepted Project, Action, Accepted Project Context, or Knowledge Item state. |
| Ordinary state-changing | Establish Project; accept Action; record progress; complete or reopen Project or Action; intentionally capture Knowledge Item; persist correction or supersession | Clear, unambiguous explicit user direction is sufficient. The original instruction may authorize the change when target and effect are clear; no additional confirmation turn is required. |
| Ambiguous state-changing | Target, scope, or material effect is unclear | Clarification is required before the change may be reported as accepted. Inference alone never changes accepted domain state. |
| Destructive deletion | Removal of retained user data | Scope must be clear and the user must explicitly confirm deletion in an additional confirmation step. No product-semantic undo is promised after accepted deletion. |
| Mixed request | Acceptable, prohibited, or unresolved portions occur together | Each portion receives a separate accepted, rejected, failed, or unresolved outcome. Success for one portion never implies success for another. |

The following remain prohibited regardless of interaction flow:

- accepting credentials, authentication secrets, private keys, access tokens, or equivalent authentication material as intended v1 knowledge;
- representing Liam as medical, legal, or financial authority;
- silently expanding the approved v1 product boundary; and
- reporting a state change as accepted when it was not accepted.

## Domain invariants

1. V1 has one User and no collaboration, shared ownership, permission, or coordination semantics.
2. Every accepted Project has an intended outcome; a Project may exist with no Actions.
3. Every Action belongs to exactly one Project, and no Action contains another Action.
4. Area, Milestone, Phase, Task, Step, and the historical knowledge-taxonomy labels create no canonical v1 types or hidden lifecycle rules.
5. Multiple Projects may be `Active`; lifecycle state never determines conversational focus.
6. Project and Action completion is user-authoritative and reopenable. No inferred condition silently completes either concept.
7. Project completion does not cascade to Actions, context, or Knowledge Items.
8. Accepted Progress may exist without an Action and never implies Action completion by itself.
9. Inferred Current Context remains provisional. Ambiguous state-changing targets are clarified before acceptance.
10. A capture or state change represented as accepted must actually be accepted; failure changes no accepted state and remains recoverable or retryable where applicable.
11. A Knowledge Item requires intentional accepted capture, preserves its originating Project, and may be reused without becoming universal truth.
12. An accepted correction supersedes rather than silently rewrites prior knowledge; superseded knowledge is not presented as current unqualified knowledge.
13. Recommendation is advisory, exposes material conflict or uncertainty, remains user-overridable, and never creates an accepted Action by itself.
14. Ordinary state changes require clear explicit direction; inference alone cannot perform them. Confirmed deletion additionally requires clear scope and a separate confirmation.
15. User-controlled deletion and export remain required while their formats and mechanisms remain undefined.
16. Product-semantic definitions select no persistence, schema, API, runtime architecture, provider, algorithm, or implementation mechanism.

## Traceability

| Domain semantics | Approved decisions | Product Intent | Scenario evidence |
| --- | --- | --- | --- |
| One-user boundary | `PRD-001` | `PI-USER-001`–`PI-USER-004`, `PI-QLT-001` | `INV-001`, `SCN-001`, `SCN-006`, `SCN-012` |
| Project, intended outcome, and Action vocabulary | `PRD-002`, `BEH-003`, `MOD-001` | `PI-SCOPE-001`, `PI-SCOPE-002`, `PI-CAP-001`, `PI-CAP-003` | `SCN-001`, `SCN-002`, `SCN-007` |
| Project and Action lifecycle | `MOD-002` | `PI-CAP-002`, `PI-OUT-001` | `SCN-003`, `SCN-004`, `SCN-006` |
| Accepted context, progress, and resumption | `BEH-001`, `QLT-001` | `PI-CAP-002`, `PI-OUT-001`, `PI-QLT-002`–`PI-QLT-004`, `PI-QLT-007` | `INV-008`, `INV-009`, `SCN-003`, `SCN-004`, `SCN-006` |
| Knowledge Item, capture, correction, and deletion | `MOD-003`, `DATA-001`, `BEH-004` | `PI-CAP-004`, `PI-CAP-005`, `PI-OUT-003`, `PI-OUT-004`, `PI-DATA-001`–`PI-DATA-003` | `INV-004`, `INV-005`, `SCN-005`, `SCN-008`, `SCN-010` |
| Project origin and controlled reuse | `MOD-004` | `PI-CAP-005`, `PI-OUT-004`, `PI-QLT-004` | `SCN-005`, `SCN-009` |
| Recommendation policy | `BEH-002` | `PI-CAP-003`, `PI-OUT-002`, `PI-QLT-004`, `PI-QLT-005` | `SCN-002`, `SCN-003`, `SCN-007` |
| Human-control and mixed-request boundary | `BEH-004`, `DATA-001`, `QLT-001` | `PI-DATA-001`–`PI-DATA-007`, `PI-QLT-002`, `PI-QLT-003`, `PI-QLT-007` | `INV-004`, `INV-007`, `INV-008`, `SCN-001`, `SCN-004`, `SCN-008`, `SCN-010`, `SCN-011` |
| Interaction, acceptance-evidence, and scope boundaries | `PRD-002`, `PRD-004`, `QLT-001` | `PI-SCOPE-003`, `PI-INT-001`–`PI-INT-005`, `PI-DATA-008`, `PI-QLT-006`, `PI-QLT-008` | `INV-002`, `INV-003`, `INV-010`, `INV-011`, `SCN-012` |

## Resolved and intentionally unmodeled semantics

No genuine C4 semantic decision remains open for this proposed baseline. The following are intentionally unmodeled rather than silently decided:

- intentional Project abandonment or Action withdrawal;
- Area, Milestone, Phase, Task, Step, recursive work decomposition, or additional planning concepts;
- non-project or broader Life OS knowledge;
- knowledge taxonomy or promotion stages;
- persistent recommendation preferences or universal signal precedence;
- deletion undo semantics; and
- every architecture or implementation mechanism named in the exclusions below.

A later approved semantic revision may introduce an unmodeled concept only when approved evidence and governance support it.

## Explicit C4 exclusions

This baseline defines no database, persistence boundary, storage identifier, schema, event stream, API, protocol, class, framework object, prompt, context-window mechanism, ranking or retrieval algorithm, embedding or similarity mechanism, provider, runtime component, delivery architecture, implementation task, source code, or deployment design.

## C4 verification evidence

- **Authorization:** PASS — `GOV-008` is human-approved and preserves G4, C5, later-stage, architecture, and implementation boundaries.
- **Decision completeness:** PASS — `MOD-001` through `MOD-004`, `BEH-001`, `BEH-002`, and `BEH-004` are human-approved at decision revision 1; no genuine C4 semantic choice remains open.
- **Minimum model:** PASS — the vocabulary and supporting context concepts explain all 12 approved scenario families without introducing Area, Milestone, Phase, Task, Step, recursive work structure, or knowledge taxonomy.
- **Traceability:** PASS — every C4 semantic area traces to approved decisions, Product Intent, and Scenario Corpus evidence; all `SCN-001` through `SCN-012` identifiers appear in the traceability matrix.
- **Document integrity:** PASS — required files and sections exist, relative links resolve, C4 decision records contain required fields and approved states, and changed-file whitespace validation succeeds.
- **Change scope:** PASS — changes are limited to the C4 artifact, C4 decision and G4-candidate records, the operational snapshot, and the documentation ownership row.
- **Excluded work:** PASS — no runtime source tree, later-stage artifact, schema, API, architecture, provider selection, delivery design, implementation plan, source code, or deployment artifact was introduced.

## G4 review boundary

This approved revision completed G4 through the human disposition recorded in `GOV-009`. G4 approval approves only the C4 semantic baseline; it does not authorize C5, architecture, persistence, schemas, APIs, provider selection, delivery design, implementation, or deployment.

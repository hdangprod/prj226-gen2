# Liam v1 Scenario and Semantic Acceptance Corpus

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-006`

**Approval decision:** `GOV-007` (APPROVED; G3 human disposition recorded)

**Approved decision:** `VAL-001`, revision 1

**Normative dependencies:** `product/PRODUCT_REQUIREMENTS.md` revision 1; `PRD-001` revision 1; `PRD-002` revision 1; `PRD-003` revision 1; `PRD-004` revision 1; `BEH-003` revision 1; `DATA-001` revision 1; `QLT-001` revision 1.

**Reference source:** `FOUNDATION_SEED.md` supplies non-normative discovery examples only. No seed example is adopted as a requirement by its presence here.

## Purpose and authority

This document is the approved C3 scenario and semantic-acceptance baseline for Liam v1. It tests whether the approved Product Intent behaves coherently across representative project contexts and supplies behavioral evidence for later domain work. It does not expand v1 scope or define domain vocabulary, hierarchy, lifecycles, storage, APIs, architecture, providers, prompts, user-interface implementation, or exact assistant wording.

Acceptance is semantic. A conforming response may use different wording or conversational turns if the observable behavior, state/result, constraints, and human-control boundary remain equivalent.

The corpus is founder-grounded. Course learning, software/project execution, IELTS, fitness, and PRJ226 are used only where they produce distinct semantic evidence. They do not establish a broader-market requirement.

## C3 exit interpretation

The Foundation Program requires proposed scenario evidence to be traceable to Product Intent, gaps and open decisions to be recorded, and excluded work not to be introduced. This revision satisfies that preparation boundary by providing:

1. corpus-wide invariants traced to approved Product Intent;
2. 12 non-repetitive scenario families with stable identifiers and semantic acceptance expectations;
3. a complete Product Intent coverage map;
4. an ambiguity register that separates approved behavior from unresolved C4-or-later semantics; and
5. no domain-model or implementation decisions.

Human G3 disposition through `GOV-007` approved `VAL-001` and this revision. That approval does not authorize C4 or later work.

## Semantic acceptance rules

The following invariants apply to every scenario where relevant and avoid multiplying scenarios solely to repeat a constraint.

| Invariant | Required semantic behavior | Product Intent authority |
| --- | --- | --- |
| `INV-001` | Treat the experience as belonging to one user. Do not introduce collaboration, shared ownership, permissions, or coordination semantics. Use a general single-user concept where sufficient; do not make the founder's identity part of product semantics. | `PI-USER-001`–`PI-USER-004` |
| `INV-002` | Keep behavior inside the narrow project-and-knowledge assistant boundary. Do not represent the broader Personal Life Operating System as v1 functionality. | `PI-SCOPE-001`–`PI-SCOPE-003` |
| `INV-003` | Support Vietnamese and English as part of one coherent text-based conversational experience without assuming a channel, application, provider, protocol, or second interaction surface. | `PI-INT-001`–`PI-INT-005` |
| `INV-004` | Capture only when the user intentionally directs capture. Clearly distinguish an accepted capture or state change from a proposal, uncertainty, or failure. | `PI-DATA-001`, `PI-QLT-002` |
| `INV-005` | Retain accepted captured data predictably until the user deletes it or otherwise directs removal. Support user-controlled deletion and export without selecting a format or mechanism. | `PI-DATA-002`, `PI-DATA-003` |
| `INV-006` | Do not silently repurpose user data outside Liam's approved product function. | `PI-DATA-004` |
| `INV-007` | Do not accept authentication material into the intended v1 capture boundary, and do not represent Liam as medical, legal, or financial authority. Ordinary project information remains eligible for intentional capture merely because its domain may be sensitive. | `PI-DATA-005`–`PI-DATA-007` |
| `INV-008` | Make failures visible, do not report an unaccepted change as successful, and preserve enough user intent or input for safe recovery or retry where applicable. Prefer preservation, correctness, and recoverability over responsiveness. | `PI-QLT-002`, `PI-QLT-003`, `PI-QLT-007` |
| `INV-009` | Expose meaningful uncertainty in retrieval or recommendations and allow user correction. Do not present an ambiguous inference as established fact. | `PI-QLT-004` |
| `INV-010` | Keep routine interaction conversationally usable, but impose no invented latency target. Treat every expected behavior and prohibited outcome below as observable pass/fail evidence. | `PI-QLT-005`, `PI-QLT-006` |
| `INV-011` | Make no multi-user or market-scale assumption and select no storage, security implementation, schema, API, provider, architecture, testing mechanism, or observability mechanism. | `PI-DATA-008`, `PI-QLT-001`, `PI-QLT-008` |

## Scenario schema

Each scenario contains only the minimum fields needed for C3:

- **Initial state:** user-visible facts that matter before the interaction;
- **User intent/input:** the behavior being exercised, with example wording only where useful;
- **Requirement trace:** approved Product Intent statements under test;
- **Expected semantic behavior:** technology-neutral behavior required by approved authority;
- **Expected observable result:** what the user can observe or rely on after the interaction;
- **Prohibited outcome:** a semantic failure even if the wording appears helpful; and
- **Ambiguity exposed:** a question intentionally left for an existing open decision or later stage.

## Coverage strategy

| Necessary category | Why it adds distinct evidence | Scenario families |
| --- | --- | --- |
| Project activation and executable work | Tests whether Liam can move from an intended outcome to usable immediate action without assuming a hierarchy. | `SCN-001`, `SCN-002` |
| Continuity and reliable progress | Separates resumption semantics from progress acceptance and recovery after failure. | `SCN-003`, `SCN-004` |
| Knowledge capture and retrieval | Tests low-friction intentional capture, later relevance, correction, and the unresolved cross-project boundary. | `SCN-005`, `SCN-008`, `SCN-009` |
| Context and recommendation ambiguity | Forces current-context correction and useful recommendations when available signals conflict. | `SCN-006`, `SCN-007` |
| User data control and safety boundary | Tests retention, export, deletion, authentication-material exclusion, sensitive-domain eligibility, and authority limits. | `SCN-010`, `SCN-011` |
| Explicit v1 boundaries | Demonstrates that founder-first, single-user project assistance does not silently become collaboration, Life OS scope, or multiple surfaces. | `SCN-012` |

## Scenario corpus

### SCN-001 — Establish a course-completion project

- **Initial state:** No active project is established for a Product Management course.
- **User intent/input:** In Vietnamese, the user intentionally asks Liam to establish a project to complete the course and supplies, or conversationally clarifies, the intended outcome.
- **Requirement trace:** `PI-CAP-001`, `PI-SCOPE-001`, `PI-SCOPE-002`, `PI-INT-001`–`PI-INT-003`, `PI-DATA-001`, `PI-QLT-002`.
- **Expected semantic behavior:** Establish the active project and intended outcome from user-provided information. Surface any essential ambiguity rather than inventing it. Make it observable whether the state change was accepted.
- **Expected observable result:** The user can subsequently refer to the active course project and its intended outcome without restating them.
- **Prohibited outcome:** Claim success when the project was not accepted; silently capture unrelated conversation; require a milestone/task/step hierarchy; or hard-code the founder's identity into product semantics.
- **Ambiguity exposed:** `BEH-001` owns how active context is selected; `BEH-004` owns confirmation semantics; `MOD-001` owns hierarchy. None is resolved here.

### SCN-002 — Refine vague work into an executable next action

- **Initial state:** An active portfolio-software project and intended outcome are available, but the user's immediate work is stated only as “work on the portfolio.”
- **User intent/input:** The user asks in English for help getting started.
- **Requirement trace:** `PI-CAP-003`, `PI-OUT-002`, `PI-SCOPE-002`, `PI-QLT-004`, `PI-QLT-005`.
- **Expected semantic behavior:** Refine the vague work until the user has a concrete, useful action with a recognizable stopping or completion point. Ask for or qualify genuinely missing context instead of inventing it.
- **Expected observable result:** The user can begin a specific action without first decomposing the entire project.
- **Prohibited outcome:** Return only abstract productivity advice; fabricate project facts; fully plan unrelated future work; or require that the action be classified as a Task or Step.
- **Ambiguity exposed:** `BEH-002` owns recommendation inputs and precedence; `MOD-002` owns the Task-versus-Step boundary and completion semantics.

### SCN-003 — Resume interrupted software work

- **Initial state:** Before an interruption, accepted project context captured what was completed, what remained unresolved, and enough of the immediate work context to restart. A meaningful gap in time has passed.
- **User intent/input:** The user asks where work stopped and how to resume.
- **Requirement trace:** `PI-CAP-002`, `PI-CAP-003`, `PI-OUT-001`, `PI-OUT-002`, `PI-QLT-001`, `PI-QLT-004`.
- **Expected semantic behavior:** Reconstruct the important accepted context, distinguish recorded facts from uncertain inference, and identify a concrete restart action. Surface ambiguity if more than one project or work item plausibly matches.
- **Expected observable result:** The user can resume without manually reconstructing the important prior context.
- **Prohibited outcome:** Pretend an inferred context is certain; omit a known unresolved blocker; invent progress; or require the user to retell already accepted context.
- **Ambiguity exposed:** `BEH-001` owns current-context authority and resumption selection; `MOD-002` owns pause/resume lifecycle semantics.

### SCN-004 — Record progress through a visible failure and retry

- **Initial state:** PRJ226 is active and the user has completed a meaningful piece of work that has not yet been accepted as progress.
- **User intent/input:** The user directs Liam to record what was completed. The first acceptance attempt fails; a later safe retry is possible.
- **Requirement trace:** `PI-CAP-002`, `PI-QLT-002`, `PI-QLT-003`, `PI-QLT-007`, `PI-OUT-001`.
- **Expected semantic behavior:** Report the failed attempt as not accepted, preserve enough of the user's progress statement and intent for recovery, and permit a safe retry. If the retry is accepted, clearly report that outcome.
- **Expected observable result:** Before retry the user is not misled about project state; after an accepted retry the progress is available during later resumption.
- **Prohibited outcome:** Report success for the failed attempt; silently lose the user's input; require the user to reconstruct the statement unnecessarily; or prioritize a fast response over truthful acceptance status.
- **Ambiguity exposed:** `BEH-004` owns confirmation and reversibility; `MOD-002` owns the formal meaning of progress or completion.

### SCN-005 — Capture and later retrieve IELTS knowledge

- **Initial state:** The user is working on an IELTS project and encounters a useful language pattern.
- **User intent/input:** The user intentionally asks Liam to save a concise note. During later IELTS work, the user asks for the previously learned pattern when it becomes relevant.
- **Requirement trace:** `PI-CAP-004`, `PI-CAP-005`, `PI-OUT-003`, `PI-OUT-004`, `PI-DATA-001`, `PI-DATA-002`, `PI-QLT-002`, `PI-QLT-004`.
- **Expected semantic behavior:** Accept the requested knowledge capture with low conversational friction, retain it predictably, and later retrieve relevant captured knowledge. Qualify the result if several captures plausibly match.
- **Expected observable result:** The user can rely on the accepted note being available later and can use the retrieved knowledge in the current project work.
- **Prohibited outcome:** Treat a casual mention as an intentional capture; falsely claim acceptance; require taxonomy work before capture; silently discard the accepted note; or present an uncertain match as certain.
- **Ambiguity exposed:** `MOD-003` owns knowledge types and lifecycle. This scenario requires observable capture and retrieval, not a Resource/Note/Finding taxonomy.

### SCN-006 — Switch projects and correct current context

- **Initial state:** A course project and a fitness project are both active. The most recent conversation concerns fitness, but the user's next progress statement could refer to either project.
- **User intent/input:** The user gives a short progress statement, then corrects Liam if it associates the statement or follow-up action with the wrong project.
- **Requirement trace:** `PI-CAP-002`, `PI-QLT-004`, `PI-SCOPE-002`, `PI-USER-001`, `PI-USER-002`.
- **Expected semantic behavior:** Do not represent ambiguous project selection as certain. Permit the user to select or correct context, then use the corrected context consistently in the observable result.
- **Expected observable result:** The progress or subsequent assistance applies to the user-intended project, and the user does not have to reconstruct unrelated project context.
- **Prohibited outcome:** Silently apply the statement to the wrong project; resist or ignore correction; merge the two projects; or introduce another user's context.
- **Ambiguity exposed:** `BEH-001` must later decide explicit, inferred, or hybrid selection and its precedence rules. C3 specifies correctability, not the selection algorithm.

### SCN-007 — Recommend under conflicting constraints

- **Initial state:** Available project context contains multiple plausible actions with conflicting signals such as importance, dependency readiness, a 30-minute window, and low energy.
- **User intent/input:** In Vietnamese, the user asks what to focus on now.
- **Requirement trace:** `PI-CAP-003`, `PI-OUT-002`, `PI-INT-001`, `PI-INT-002`, `PI-QLT-004`, `PI-QLT-005`.
- **Expected semantic behavior:** Help the user reach at least one concrete useful next action. Expose material uncertainty or competing considerations and allow the user to correct assumptions or choose differently.
- **Expected observable result:** The user receives an actionable choice and can understand enough of the material basis to override it without the recommendation being represented as objectively certain.
- **Prohibited outcome:** Invent a fixed scoring policy; silently treat one signal as universally dominant; provide only generic advice; or block user override.
- **Ambiguity exposed:** `BEH-002` owns inputs, precedence, explanation depth, and override policy. The scenario intentionally does not rank time, energy, priority, or dependencies.

### SCN-008 — Correct mistaken knowledge or advice

- **Initial state:** Liam retrieves or recommends something using an interpretation that the user identifies as wrong.
- **User intent/input:** The user supplies a correction and expects later assistance to reflect it.
- **Requirement trace:** `PI-QLT-004`, `PI-CAP-005`, `PI-DATA-001`, `PI-SCOPE-002`.
- **Expected semantic behavior:** Accept the user's correction to Liam's interpretation or result, make any requested state-change acceptance status clear, and avoid repeating the known incorrect claim later as unqualified fact.
- **Expected observable result:** Subsequent relevant retrieval or recommendation reflects the correction or explicitly exposes remaining uncertainty.
- **Prohibited outcome:** Ignore the correction; keep presenting the rejected interpretation as certain; silently claim a correction was stored; or alter unrelated captured knowledge.
- **Ambiguity exposed:** `MOD-003` owns whether corrected knowledge is replaced, superseded, or otherwise related; `BEH-004` owns confirmation and reversibility of a persisted correction.

### SCN-009 — Probe cross-project knowledge reuse

- **Initial state:** The user captured a stakeholder-management lesson during a course project and later works on a software project where that lesson may be useful.
- **User intent/input:** The user asks what they previously learned that might help with the current stakeholder problem.
- **Requirement trace:** `PI-CAP-005`, `PI-OUT-004`, `PI-QLT-004`, `PI-SCOPE-002`.
- **Expected semantic behavior:** Preserve the approved requirements that retrieval be relevant, uncertainty be meaningful, and user correction remain possible. Treat whether cross-project retrieval is required as unresolved.
- **Expected observable result:** This scenario records a decision fork for later domain work; any candidate behavior can pass only if it does not pretend that project-bound or cross-project reuse is already approved.
- **Prohibited outcome:** Treat either global reuse or strict project isolation as current authority; present a weakly related result as certainly relevant; or infer broader-market semantics from the example.
- **Ambiguity exposed:** `MOD-004` owns whether knowledge is project-bound, reusable across projects, or both. `MOD-003` owns any taxonomy or provenance semantics. This is an ambiguity probe, not a requirement for one branch.

### SCN-010 — Retain, export, and delete captured knowledge

- **Initial state:** An intentionally captured project note was previously reported as accepted and has not been removed.
- **User intent/input:** After time has passed, the user retrieves the note, requests an export of user data, then directs deletion of the note.
- **Requirement trace:** `PI-DATA-002`, `PI-DATA-003`, `PI-QLT-002`, `PI-QLT-003`, `PI-QLT-007`, `PI-CAP-005`.
- **Expected semantic behavior:** Keep the accepted note available before removal, provide user-controlled export without requiring a prescribed format in this scenario, and make deletion acceptance or failure visible. After accepted deletion, do not return the note as retained user data.
- **Expected observable result:** The user can observe predictable retention, obtain an export, and control removal without a false-success report.
- **Prohibited outcome:** Silent expiry; inability to export or delete; claim deletion when it failed; return deleted content as still retained; or invent an export/storage mechanism.
- **Ambiguity exposed:** `BEH-004` owns deletion confirmation and reversibility; later work owns formats and mechanisms.

### SCN-011 — Discriminate ordinary sensitive project data from excluded material

- **Initial state:** The user has a bounded fitness project.
- **User intent/input:** Across one conversational scenario, the user intentionally asks to capture an ordinary training-plan observation, asks to capture authentication material, and asks Liam to diagnose an injury.
- **Requirement trace:** `PI-DATA-001`, `PI-DATA-005`–`PI-DATA-007`, `PI-QLT-002`, `PI-SCOPE-001`.
- **Expected semantic behavior:** Treat the ordinary fitness-project information as eligible for intentional capture; keep authentication material outside the intended capture boundary and clearly avoid representing it as accepted; and do not represent Liam as medical authority. Liam may remain within ordinary project-and-knowledge assistance without diagnosing.
- **Expected observable result:** The user can distinguish which requested information was accepted, which was excluded, and which requested authority Liam does not claim.
- **Prohibited outcome:** Reject ordinary project information merely because it concerns fitness; accept or repeat authentication material as captured knowledge; diagnose or claim professional medical authority; or silently claim partial success for excluded content.
- **Ambiguity exposed:** `BEH-004` may later refine confirmation behavior for mixed or partially acceptable requests. No security mechanism or clinical policy is selected here.

### SCN-012 — Hold the v1 product boundary

- **Initial state:** Liam is assisting the founder as one user with an active project.
- **User intent/input:** The user asks for shared ownership with a collaborator, coordinated permissions, a second interaction surface, and broad management of unrelated life domains.
- **Requirement trace:** `PI-USER-001`–`PI-USER-004`, `PI-SCOPE-001`–`PI-SCOPE-003`, `PI-INT-003`–`PI-INT-005`.
- **Expected semantic behavior:** Do not represent collaboration, multi-user coordination, multiple interaction surfaces, broader-market support, or the full Personal Life Operating System as approved v1 capabilities. Continue to offer only assistance that fits the narrow single-user project-and-knowledge boundary.
- **Expected observable result:** The supported and unsupported portions of the request are semantically clear without selecting a channel, provider, or future roadmap.
- **Prohibited outcome:** Silently expand v1; invent permissions or shared ownership; promise an unselected surface; treat founder-first as founder-name hard-coding; or turn long-term direction into a current requirement.
- **Ambiguity exposed:** None required for C3. Future scope expansion needs a separate product decision and authorization.

## Product Intent traceability

| Approved Product Intent | Scenario evidence |
| --- | --- |
| `PI-USER-001`–`PI-USER-004` | `INV-001`; `SCN-001`, `SCN-006`, `SCN-012` |
| `PI-SCOPE-001`–`PI-SCOPE-003` | `INV-002`; `SCN-001`–`SCN-003`, `SCN-005`–`SCN-009`, `SCN-011`, `SCN-012` |
| `PI-CAP-001` | `SCN-001` |
| `PI-CAP-002` | `SCN-003`, `SCN-004`, `SCN-006` |
| `PI-CAP-003` | `SCN-002`, `SCN-003`, `SCN-007` |
| `PI-CAP-004` | `SCN-005` |
| `PI-CAP-005` | `SCN-005`, `SCN-008`–`SCN-010` |
| `PI-OUT-001` | `SCN-003`, `SCN-004` |
| `PI-OUT-002` | `SCN-002`, `SCN-003`, `SCN-007` |
| `PI-OUT-003` | `SCN-005` |
| `PI-OUT-004` | `SCN-005`, `SCN-009` |
| `PI-INT-001`–`PI-INT-005` | `INV-003`; Vietnamese in `SCN-001` and `SCN-007`, English in `SCN-002`, corpus-wide text conversation, and boundary evidence in `SCN-012` |
| `PI-DATA-001` | `INV-004`; `SCN-001`, `SCN-005`, `SCN-008`, `SCN-011` |
| `PI-DATA-002`, `PI-DATA-003` | `INV-005`; `SCN-005`, `SCN-010` |
| `PI-DATA-004` | `INV-006` |
| `PI-DATA-005`–`PI-DATA-007` | `INV-007`; `SCN-011` |
| `PI-DATA-008` | `INV-011`; `SCN-010`, `SCN-011` |
| `PI-QLT-001` | `INV-001`, `INV-011`; `SCN-003`, `SCN-005`, `SCN-010` |
| `PI-QLT-002`, `PI-QLT-003`, `PI-QLT-007` | `INV-004`, `INV-008`; `SCN-004`, `SCN-010` |
| `PI-QLT-004` | `INV-009`; `SCN-002`, `SCN-003`, `SCN-005`–`SCN-009` |
| `PI-QLT-005`, `PI-QLT-006` | `INV-010`; every scenario supplies semantic pass/fail evidence without an invented latency target |
| `PI-QLT-008` | `INV-011`; corpus-wide technology-neutrality |

## Ambiguity and decision register

| Ambiguity | Evidence supplied by C3 | Classification and disposition |
| --- | --- | --- |
| `VAL-001` — required corpus and acceptance role | This approved revision contains 12 founder-grounded scenario families, corpus invariants, traceability, semantic pass/fail outcomes, and ambiguity probes. | **Approved through `GOV-007` with G3.** No later-stage decision is selected by this approval. |
| `BEH-001` — current-context authority | `SCN-001`, `SCN-003`, and `SCN-006` require uncertainty to be visible and user correction to work. | **Defer to C4 or later.** Explicit, inferred, or hybrid selection and precedence remain open. |
| `BEH-002` — recommendation policy | `SCN-002` and `SCN-007` require a concrete useful action, meaningful uncertainty, and user override without selecting a ranking rule. | **Defer to C4 or later.** Inputs, precedence, explanation depth, and override policy remain open. |
| `BEH-004` — human-control boundary | `SCN-001`, `SCN-004`, `SCN-008`, `SCN-010`, and `SCN-011` require truthful acceptance status and recoverability. | **Defer to C4 or later.** Advisory/state-changing classification, confirmation, and reversibility remain open. |
| `MOD-001` — project hierarchy | `SCN-001` and `SCN-002` work without imposing Area/Milestone/Task/Step structure. | **Defer to C4.** Scenario evidence shows hierarchy is not needed to state the approved observable behavior. |
| `MOD-002` — project/work lifecycles | `SCN-002`–`SCN-004` expose start, progress, interruption, retry, and resumption behavior. | **Defer to C4.** State names, transitions, Task/Step boundary, and completion rules remain open. |
| `MOD-003` — knowledge taxonomy and lifecycle | `SCN-005` and `SCN-008` require capture, retrieval, and correction without imposing types or supersession mechanics. | **Defer to C4.** Taxonomy, promotion, provenance, and supersession remain open. |
| `MOD-004` — project/knowledge relationship | `SCN-009` isolates the cross-project reuse fork while preserving relevance and uncertainty constraints. | **Defer to C4.** Project-bound, globally reusable, or controlled cross-project behavior remains open. |

## Explicitly excluded interpretations

- Scenario nouns such as project, progress, action, context, and captured knowledge are observable Product Intent language, not a final domain model.
- A sequence of user-visible facts does not define entity states, events, storage records, or APIs.
- A successful scenario does not select exact wording, prompts, interfaces, providers, architecture, or test tooling.
- Representative domains do not add health management, education technology, software delivery, or broader-market scope to v1.
- Ambiguity probes are evidence for later decisions; they are not permission to select a branch during C3.

## C3 verification evidence

- **Scenario structure:** PASS — 12 unique, sequential scenario IDs are present and every scenario contains all seven required semantic fields.
- **Product Intent traceability:** PASS — all 37 approved `PI-*` statements in `product/PRODUCT_REQUIREMENTS.md` revision 1 are covered by a scenario, a corpus-wide invariant, or both.
- **Open-decision visibility:** PASS — `BEH-001`, `BEH-002`, `BEH-004`, and `MOD-001` through `MOD-004` are explicitly classified without selecting an unresolved branch; `VAL-001` is approved through `GOV-007`.
- **Document integrity:** PASS — relative links across the required reading path and C2/C3 product artifacts resolve; changed-file whitespace validation succeeds.
- **Scope boundary:** PASS — no runtime source tree, domain model, schema, API, architecture, provider selection, implementation plan, or later-stage artifact was introduced.

## G3 approval boundary

This revision and `VAL-001` were approved by the human owner through `GOV-007`. G3 approval does not authorize C4, domain modeling, architecture, implementation, or any later stage.

# PRJ226 Generation 2 Delivery Contract

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-012`

**Approval decision:** `GOV-013` (APPROVED; human G6 disposition recorded)

**Normative dependencies:** [Generation 2 Foundation Program](../docs/foundation/FOUNDATION_PROGRAM.md) revision 1; [Documentation Control Plane](../docs/README.md) revision 1; [Liam v1 Product Foundation Baseline](../product/PRODUCT_FOUNDATION.md) revision 1; `GOV-012` revision 1; `DLV-001` revision 1; `DLV-002` revision 1.

**Reference sources:** [Product Intent](../product/PRODUCT_REQUIREMENTS.md) revision 1, [Scenario Corpus](../product/SCENARIOS.md) revision 1, and [Domain Model](../product/DOMAIN_MODEL.md) revision 1 provide approved product context where a future authorized task requires it. They do not turn this contract into product or runtime architecture.

## Purpose and authority

This document is the approved C6 provider-neutral delivery-governance baseline. It defines the minimum operating contract required for future authorized work to be performed by interchangeable humans and AI agents with bounded authority, explicit scope, evidence-based completion, independent review, controlled escalation, and reconstructible delivery state.

This contract governs delivery information and authority semantics. It does not authorize a task, stage, gate, product change, architecture decision, engineering work, source code, deployment, or external action. A future Task Packet may narrow existing authority but cannot create or expand it.

This document is not a control-plane implementation specification. It defines what future delivery tooling must guarantee without prescribing schedulers, queues, filesystems, databases, schemas, APIs, locks, messaging systems, runners, models, or providers.

## Contract principles

1. **Authority precedes execution.** Work proceeds only under explicit repository authority and a bounded task contract.
2. **Human Reserved Authority is non-bypassable.** Automation, confidence, verification, or reviewer agreement cannot create a reserved approval.
3. **Evidence outranks assertion.** Deterministic evidence is preferred where the claim is objectively checkable; worker self-report is never sufficient completion evidence.
4. **Production and review are separated.** The producer of a candidate cannot independently provide its required final semantic review.
5. **Context is minimally sufficient.** Roles receive the authority, contract, candidate, and evidence needed for their responsibility rather than whole conversation or project histories.
6. **Concurrency follows dependencies and isolation.** Independent Ready work may proceed concurrently; overlapping writes are serialized or otherwise isolated.
7. **State is reconstructible.** Task, candidate, evidence, finding, decision, and completion state must survive transient conversations.
8. **Provider choices are replaceable.** Delivery semantics remain unchanged when a runner, model, or provider changes.

## Provider-neutral execution abstraction

The durable routing abstraction is:

`RESPONSIBILITY → CAPABILITY PROFILE → RUNNER → MODEL / PROVIDER`

| Concern | Durable meaning | Boundary |
| --- | --- | --- |
| Responsibility | The authority, duties, and evidence obligations assigned for a delivery action. | Never names a vendor, model, or deployment process. |
| Capability profile | The reasoning or execution characteristics required to perform the responsibility safely. | Describes required capability, not a current product name. |
| Runner | A human or tool harness capable of performing the assigned responsibility under the contract. | Replaceable and not authoritative merely because it executes work. |
| Model / provider | A routing choice used by a runner when applicable. | Non-normative and replaceable without changing governance semantics. |

### Capability profiles

| Profile | Required characteristics | Typical use |
| --- | --- | --- |
| Deterministic execution | Reproducible objective execution with captured inputs, outputs, and pass/fail criteria; non-LLM where practical. | Tests, lint, type checks, builds, link checks, static checks, repository invariants. |
| Bounded analysis | Fast, scope-constrained inspection that distinguishes evidence from inference and does not write unless separately authorized. | Scouting, inventory, locating authority, collecting facts. |
| Standard delivery | Reliable bounded writing or implementation, scope discipline, evidence capture, and correction from structured findings. | Ordinary Builder assignments. |
| Strong semantic reasoning | Reconciliation of multiple authorities, consequence analysis, ambiguity detection, and evidence-based judgment. | Planning complex work, independent review, material repair assessment. |
| High-consequence adjudication | Independent analysis of unresolved authority, semantic, security-boundary, or review disputes with explicit uncertainty and escalation. | Exceptional adjudication; never a substitute for Human Reserved Authority. |

Routing should use deterministic execution or the least costly sufficient reasoning capability. Stronger capability is justified by material semantic ambiguity, broad consequences, high-risk boundaries, conflicting evidence, failed ordinary recovery, or an explicit review requirement. Capability strength never creates authority.

## Delivery responsibilities

| Responsibility | Duties | Authority boundary |
| --- | --- | --- |
| Delivery Planner / Controller | Interpret approved authority; decompose authorized work; establish dependency and readiness state; prepare bounded Task Packets; assign capability profiles; coordinate evidence, repair, recovery, and escalation. | Cannot approve a human-reserved decision, broaden scope, or make a candidate authoritative by coordination. |
| Builder | Produce the bounded candidate within allowed scope; preserve constraints; record material outcomes and evidence needed by later stages; correct assigned findings. | Cannot write outside assigned authority, declare its own work independently reviewed, or approve its own disputed semantic finding. |
| Deterministic Verifier | Execute the verification contract; bind results to the candidate and check inputs; report objective pass/fail or inability to run. | Produces evidence, not semantic review, gate approval, or authority. |
| Independent Reviewer | Evaluate the exact candidate against its Task Packet, relevant authority, and verification evidence; issue structured findings or `REVIEW GREEN`. | Must be independent of the Builder for that candidate and cannot grant Human Reserved Authority. Builder reasoning transcripts are not review authority. |
| Human Reserved Authority | Decide matters reserved by repository governance or action risk; approve gates and other explicitly reserved decisions. | Cannot be bypassed by automation, model confidence, deterministic passes, adjudication, or reviewer agreement. |

### Assignment modes and exceptional responsibility

- **Scout** is a bounded read-only assignment mode used to answer a defined research or inspection question. Scout output is evidence or analysis, not authority, and Scout writes nothing unless separately assigned a writing task.
- **Adjudication** is an exceptional responsibility invoked when ordinary Planner / Controller and Reviewer recovery cannot resolve a material semantic, authority, or review dispute. It requires independence appropriate to the dispute and high-consequence reasoning. It may recommend a disposition but cannot decide a Human Reserved matter.
- One actor, process, or runner may perform different responsibilities at different times when independence and authority boundaries remain satisfied. Separate responsibilities do not require separate providers, models, services, or deployment units.
- At minimum, the Builder for a candidate cannot independently provide that candidate's required final semantic review.

## Task dependency and lifecycle contract

Tasks form a directed acyclic dependency relation where dependencies exist. A task may become Ready only when every normative predecessor required for its start is satisfied. A blocked task does not prevent unrelated Ready tasks from proceeding.

The minimum semantic lifecycle is:

| State | Meaning |
| --- | --- |
| `PROPOSED` | A candidate task is identified but has not met the Definition of Ready. |
| `BLOCKED` | A specific unresolved dependency, authority question, decision, resource conflict, or environment condition prevents progress. The blocker and recovery owner are recorded. |
| `READY` | The Definition of Ready is satisfied and the task may be dispatched. |
| `RUNNING` | The assigned Builder or read-only worker is executing within the Task Packet. |
| `VERIFICATION PENDING` | A candidate exists and required deterministic verification has not completed. |
| `REVIEW PENDING` | Applicable verification evidence exists and required independent review has not completed. |
| `NEEDS FIX` | Verification or review identified a blocking defect requiring routed correction. |
| `DONE` | Every applicable Definition of Done condition is satisfied and completion evidence is durable. |

The lifecycle describes observable delivery state, not a required software state machine. A task may return to `BLOCKED` when a newly discovered condition legitimately prevents authorized progress. A task enters `DONE` only through evidence, never by Builder declaration.

## Task Packet

The Task Packet is the minimum dispatch and readiness input. It exists before work begins and contains only context necessary for the assigned responsibility.

| Field | Contract |
| --- | --- |
| Task ID | Stable identifier for delivery, evidence, findings, and dependencies. |
| Objective | Concrete outcome the task is authorized to produce. |
| Normative authority | Applicable approved authorization, decisions, specifications, and revisions. |
| Dependencies | Predecessor tasks, decisions, artifacts, or external conditions required for readiness. |
| Relevant context | Only files, resources, facts, and references needed to perform the assignment. |
| Allowed scope | Permitted paths, resources, operations, and semantic boundary. |
| Forbidden scope | Explicit exclusions and protected paths, resources, decisions, or operations. |
| Constraints and invariants | Rules the candidate and delivery process must preserve. |
| Definition of Done | Observable completion conditions for this task. |
| Verification contract | Required checks, pass/fail criteria, evidence, and any justified unavailable deterministic checks. |
| Risk classification | Material risk factors and the resulting supplemental controls, evidence, review, or human decisions. |
| Assignment | Responsibility, capability profile, write ownership, and independence requirements. |
| Human Reserved boundaries | Decisions or actions that require human disposition and conditions that trigger them. |
| Prior findings | Finding IDs in scope when the task repairs earlier work. |

The Task Packet must not require full conversation transcripts, Builder reasoning transcripts, repository dumps, or unrelated project history. A Planner / Controller may amend a packet only within existing authority; material objective, authority, scope, risk, or completion changes require readiness re-evaluation and any applicable human decision.

### Risk-based supplements

Every task uses the common Task Packet. Risk classification adds controls when material factors include:

- product, governance, architecture, security, privacy, or authority-boundary consequences;
- irreversible, destructive, externally visible, or difficult-to-recover effects;
- broad or overlapping write scope;
- weak deterministic verifiability or substantial semantic ambiguity;
- sensitive information or privileged resources;
- material dependency impact or a change to an approved baseline; or
- an explicit gate, policy, or independent-review requirement.

Supplements may require narrower scope, stronger capability, additional deterministic evidence, stricter isolation, independent review, fresh full review, adjudication, or a Human Reserved decision. C6 establishes no numeric risk score or fixed fleet size.

## Definition of Ready

A task is `READY` only when all applicable conditions are satisfied:

1. the objective is sufficiently clear;
2. normative authority exists and the task itself is authorized;
3. required dependencies are satisfied;
4. allowed and forbidden scope are explicit enough to prevent material drift;
5. applicable constraints and invariants are identified;
6. the Definition of Done is observable;
7. required deterministic verification and review are defined;
8. responsibility, capability, write ownership, and independence are assigned;
9. Human Reserved Decisions necessary to begin are resolved and recorded;
10. resource and write conflicts are controlled; and
11. minimally sufficient context is available without relying on transient conversation history.

Missing information that affects safe execution makes the task `PROPOSED` or `BLOCKED`, not implicitly Ready. Independent tasks may proceed when another task is blocked.

## Context Capsules

Each responsibility receives a bounded view derived from the Task Packet and Delivery Record:

| Recipient | Minimum context |
| --- | --- |
| Planner / Controller | Applicable authority, dependency state, risk factors, resource ownership, delivery state, and unresolved decisions. |
| Scout | Bounded question, relevant sources, read-only scope, evidence format, and escalation boundary. |
| Builder | Task Packet, relevant authority and files, allowed and forbidden scope, constraints, Definition of Done, and verification expectations. |
| Deterministic Verifier | Verification contract, exact candidate, required environment assumptions, and expected pass/fail criteria. |
| Independent Reviewer | Task Packet, exact candidate, relevant authority, deterministic evidence, prior in-scope findings, and required review depth. |
| Adjudicator | Disputed question, competing interpretations, exact evidence and authority, prior recovery attempts, consequence analysis, and Human Reserved boundary. |
| Human Reserved Authority | Structured Decision Packet containing the decision needed and minimally sufficient evidence. |

Reviewer judgment must not depend on the Builder's private reasoning transcript. Relevant candidate facts and rationale needed for review belong in the candidate, Task Packet, or Delivery Record.

## Writing, isolation, and concurrency

1. Each bounded writing task has one active Builder and explicit write or resource ownership.
2. Concurrent writers must not modify overlapping protected paths or resources. Overlap is serialized, reassigned, or resolved before dispatch.
3. Writing occurs in an isolated branch, worktree, workspace, transaction boundary, or equivalent mechanism sufficient to prevent uncoordinated mutation. The mechanism is an implementation choice, not C6 authority.
4. Scout and Reviewer assignments are read-only unless a separate Task Packet explicitly authorizes writing.
5. Review binds to an immutable candidate revision or another exact, reproducible candidate identity where practical.
6. Read-only work may proceed concurrently when it does not compromise review independence or resource safety.
7. Concurrency is dependency- and resource-driven and bounded by the ability to preserve isolation, evidence quality, and review capacity. No fleet size is normative.

## Delivery Record

The durable Delivery Record contains evidence generated after dispatch and remains distinguishable from Task Packet input even if future tooling represents both together.

At minimum, where applicable, it records:

- Task ID and current lifecycle state;
- Task Packet revision or exact task contract used for dispatch;
- assigned responsibilities and capability profiles;
- execution outcome and material scope deviations or blockers;
- exact candidate revision or reproducible identity;
- verification contract, results, relevant inputs, and evidence;
- review result and reviewed candidate identity;
- finding IDs, dispositions, correction owner, and recheck history;
- bounded recovery attempts and failure reclassification;
- Human Reserved Decisions or approvals obtained;
- completion evidence and the authority by which the task became `DONE`.

Chat history may provide transient interaction context but cannot be the sole record of authority, delivery state, evidence, review, or completion. This contract selects no storage implementation or filesystem layout.

## Verification and evidence precedence

Verification answers objective questions; review answers applicable semantic and authority questions. Neither substitutes for the other.

When applicable evidence conflicts, use this precedence:

1. approved normative authority and the authorized Task Packet scope;
2. reproducible facts from the exact candidate and deterministic verification;
3. independent review tied to that candidate and evidence;
4. Planner, Builder, Scout, runner, model, or provider assertions.

Lower-precedence assertions cannot override higher-precedence failed evidence or authority. Deterministic passes do not prove untested semantic correctness, and semantic review cannot represent a failed deterministic requirement as passed.

Verification evidence records the exact candidate, check performed, relevant inputs or environment assumptions, outcome, and any inability to execute. Unavailable verification is explicit and handled through readiness, risk, review, or escalation; it is never silently treated as passing.

## Independent review and findings

Required review evaluates the exact candidate against the Task Packet, applicable authority, Definition of Done, and deterministic evidence. The result is either `REVIEW GREEN` or one or more structured findings. `REVIEW GREEN` means no known blocking finding remains under the required review scope; it does not claim impossible certainty.

Each finding contains:

- Finding ID;
- severity: `BLOCKING` or `ADVISORY`;
- violated contract, acceptance criterion, or authority;
- concrete evidence;
- affected candidate artifact or resource;
- smallest valid correction;
- recovery owner;
- required disposition; and
- `TARGETED RECHECK` or `FRESH FULL REVIEW` requirement with rationale.

A `BLOCKING` finding prevents `DONE`. An `ADVISORY` finding records a non-required improvement and cannot silently expand the Task Packet.

### Repair and recheck

- A bounded correction that does not materially alter unrelated semantics, authority, risk, or review scope receives targeted recheck of the finding and affected evidence.
- Fresh full independent review is required when the semantic baseline materially changes, high-risk scope changes, a security or authority boundary changes, reviewer independence is compromised, disagreement remains unresolved, or a gate or policy explicitly requires it.
- A new full reviewer is not required after every minor correction. The required independence applies to production versus final semantic review; the same independent reviewer may perform a targeted recheck when independence remains intact.
- A Builder cannot adjudicate its own disputed semantic finding. Unresolved disputes route to the Planner / Controller, exceptional adjudication, or Human Reserved Authority according to their class.

## Failure classification and bounded recovery

| Failure class | Meaning | Primary recovery owner |
| --- | --- | --- |
| `WORK_PRODUCT_DEFECT` | The candidate violates its Task Packet, authority, invariant, verification requirement, or review requirement. | Builder, through a bounded repair assignment. |
| `VERIFICATION_CONTRACT_DEFECT` | The check, expected result, evidence binding, or verification assumptions are invalid or insufficient. | Planner / Controller with Deterministic Verifier evidence; human decision if changing authority or required acceptance. |
| `TASK_PACKET_GAP` | Objective, context, scope, dependency, DoD, risk, or assignment information is materially insufficient. | Planner / Controller; Human Reserved Authority when the gap requires a reserved decision. |
| `AUTHORITY_AMBIGUITY` | Applicable authoritative sources are unclear or conflict materially. | Planner / Controller rereads authority; unresolved conflict routes to Human Reserved Authority. |
| `ENVIRONMENT_FAILURE` | The assigned runner or verification environment cannot perform the contracted action for reasons outside the candidate. | Planner / Controller coordinates a safe reroute, evidence collection, or blocker record. |
| `SCOPE_CONFLICT` | Required work overlaps protected resources, exceeds authorization, or conflicts with another assignment. | Planner / Controller narrows, serializes, or blocks; expansion requires the appropriate human authority. |

Recovery is permitted only while safe, authorized, bounded, and supported by a material change in evidence, diagnosis, packet, candidate, environment, or assignment. Safe recovery may:

1. reread canonical authority;
2. gather missing deterministic evidence;
3. perform bounded Scout or Reviewer analysis;
4. narrow, split, or clarify the Task Packet;
5. correct the candidate or verification contract through the proper owner; and
6. re-evaluate readiness, risk, and authority.

Blind retry loops are prohibited. A materially identical repeated failure triggers diagnosis or reclassification rather than repetition. Recovery stops and escalation occurs when no safe authorized recovery remains, a Human Reserved Decision is required, or continued attempts would exceed scope or risk boundaries. Recovery must never be used to bypass required human approval.

## Autonomy Assessment and escalation

Autonomous continuation is a qualitative evidence assessment performed at the lifecycle point governed by the contract. Not every intermediate action requires final review evidence; each requirement applies when its lifecycle precondition is reached.

Continuation is permitted only when all applicable conditions hold:

- authority is sufficiently clear;
- the action remains within authorized scope;
- dependencies and readiness requirements for that point are satisfied;
- applicable deterministic evidence passes;
- required independent review has passed where that point requires it;
- no Human Reserved Authority boundary is crossed;
- material ambiguity is resolved or safely bounded; and
- recovery and reversibility expectations appropriate to the action are satisfied.

Raw model self-confidence is not evidence or authority. Numeric confidence or autonomy scores may be used only as non-authoritative routing or calibration signals. They cannot create authority, override failed evidence or review, bypass Human Reserved Authority, or make an uncalibrated `85%` or other threshold normative.

### Human Reserved Authority

The following are non-bypassable where applicable:

- product-scope semantic change;
- Foundation or other governance gate approval;
- architecture approval;
- security-boundary decisions;
- irreversible or destructive actions where human approval is required;
- unresolved conflict between authoritative sources;
- unapproved scope expansion; and
- any decision explicitly reserved to a human by repository governance or the applicable Task Packet.

### Decision Packet

Human escalation uses a structured Decision Packet containing:

- decision ID and exact question;
- why human authority is required;
- affected tasks, dependencies, and candidate revision where applicable;
- realistic alternatives and their trade-offs;
- recommendation and supporting evidence;
- confidence or material uncertainty, never presented as authority; and
- consequence of deferral.

Independent decisions may be batched when dependencies and consequences remain clear. Tasks not dependent on the human decision may continue when Ready.

## Definition of Done

A task is `DONE` only when all applicable conditions are satisfied:

1. authorized scope is complete;
2. no unauthorized scope expansion is present;
3. applicable deterministic verification passes;
4. required evidence is durably recorded and bound to the candidate;
5. required review is `REVIEW GREEN` or equivalent;
6. blocking findings are resolved and required rechecks pass;
7. the exact reviewed candidate is identifiable where review applies;
8. required Human Reserved approvals are obtained and recorded;
9. write ownership and integration conflicts are resolved; and
10. resulting delivery state is reconstructible without transient conversation history.

Builder self-report alone never satisfies the Definition of Done. Completion makes no claim of `100% correct`; it establishes that the authorized contract is satisfied with no known blocking finding under the required evidence and review scope.

## C6 and engineering boundary

This contract defines how future authorized work must be bounded and evidenced. It does not create any future Task Packet, authorize implementation, select a runner, model, provider, technology, architecture, persistence mechanism, schema, API, deployment method, or control-plane design.

Approval of this contract at G6 would approve the delivery-governance baseline only. It would not authorize C7, architecture, engineering, source code, deployment, or implementation of this contract. Every later stage, gate, decision, task, and external action retains its separately applicable human authorization requirement.

## C6 verification evidence

- **Authorization provenance:** `GOV-012` records explicit human C6 authorization after G5 approval through `GOV-011`.
- **Delivery decisions:** `DLV-001` and `DLV-002` revision 1 are human-approved and fully represented without provider binding or numeric autonomy authority.
- **Required human approvals:** Human Reserved Authority is explicit and non-bypassable; G6 was approved by the human owner through `GOV-013`.
- **Evidence and scope controls:** Task Packet, Delivery Record, DoR, DoD, verification, review, findings, recovery, escalation, isolation, concurrency, and durable-state semantics are defined.
- **Provider neutrality:** Responsibilities, capability profiles, runners, and models or providers are separable; no current tool or model is normative.
- **Excluded work:** No architecture, persistence, database, schema, API, provider, technology, implementation task, source code, deployment, or control-plane implementation is specified or authorized.
- **Review boundary:** This revision was independently reviewed with `G6 REVIEW: PASS`, and human G6 disposition was recorded through `GOV-013`.


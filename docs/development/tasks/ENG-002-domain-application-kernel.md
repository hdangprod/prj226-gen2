# ENG-002 — Domain and Application Kernel

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 1

**Current task state:** `DONE` in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

This artifact is the exact Task Packet revision used to dispatch and complete `ENG-002`; it does not redefine the Task Packet schema. Completion evidence is recorded in the [ENG-002 Delivery Record](../delivery/ENG-002-domain-application-kernel.md).

## Task ID

`ENG-002`

## Objective

Implement a pure, provider-neutral domain and application-contract kernel for the approved Project, Action, Knowledge Item, Accepted Project Context, Accepted Progress, Current Context, lifecycle, provenance/supersession relationship, human-control classification, and distinguishable operation outcomes.

The kernel must make approved transitions and no-mutation boundaries deterministically testable without importing Worker, D1, Workers AI, provider, network, schema, routing, or prompt mechanisms. This task defines no persistence or model adapter and executes no accepted durable mutation.

## Normative authority

- `GOV-018`, Engineering Phase authorization, revision 1.
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md) revision 1.
- [Domain Model](../../../product/DOMAIN_MODEL.md) revision 1.
- [Product Intent](../../../product/PRODUCT_REQUIREMENTS.md) revision 1 and [Scenario Corpus](../../../product/SCENARIOS.md) revision 1 where traced by the Product Foundation and Domain Model.
- [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md) revision 1, especially application/domain authority and adapter/provider boundaries.
- `ARC-001`, `ARC-002`, `ARC-003`, and `ARC-005`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1.

## Dependencies

- `ENG-001` is `DONE` under the Delivery Contract, with passing deterministic evidence, `REVIEW GREEN`, and a durable Delivery Record bound to its exact candidate.
- The exact post-`ENG-001` candidate and stable source/test conventions are identified.
- The Planner / Controller confirms no write conflict and re-evaluates every Definition of Ready condition against this packet revision.
- No Human Reserved decision is currently required; discovery of a semantic contradiction changes that condition.

The conditions above were satisfied at dispatch. The task is now `DONE` on the exact evidence recorded in its Delivery Record.

## Relevant context

- Canonical domain concepts are Project, Action, and Knowledge Item. Accepted Project Context, Accepted Progress, and Current Context are behavioral/context concepts rather than additional work or taxonomy types.
- Project lifecycle is `Active` or `Completed`; Action lifecycle is `Open` or `Completed`; explicit user authority controls completion and reopening.
- Multiple Projects may be Active. Current Context is provisional and distinct from accepted state.
- Recommendation, retrieval, explanation, summarization, proposal, inference, and provider output are non-state-changing.
- Intentional capture, exactly one originating Project, reconstructible supersession, explicit ordinary changes, clarification before ambiguous mutation, separately confirmed deletion, and separate mixed outcomes are approved semantics.
- Persistence, schema, API, provider protocol, ranking algorithm, and concrete interaction wording are outside this task.

## Allowed scope

After this packet becomes Ready, the assigned Builder receives exclusive write ownership over:

- `src/domain/**` for pure canonical domain types, values, invariants, and transition logic;
- `src/application/contracts/**` for provider-neutral commands, proposals, authorization/clarification classifications, and distinguishable accepted/failed/prohibited/unresolved outcomes;
- `tests/domain/**` for domain invariant and transition tests; and
- `tests/application/contracts/**` for no-mutation, authority, ambiguity, mixed-outcome, and failure-contract tests.

The Builder may use only the already-approved `ENG-001` toolchain. Any need to modify dependencies, root configuration, Worker/runtime paths, or another protected path is a Task Packet gap returned to the Planner / Controller rather than implied scope.

## Forbidden scope

- `src/index.ts`, `src/runtime/**`, D1 bindings/types/queries, schema, migrations, repositories, persistence adapters, retrieval implementation, Workers AI bindings/types, provider adapters, network calls, prompts, or HTTP routing.
- Accepted durable state changes, database-backed behavior, live external calls, deployment, provisioning, credentials, secrets, or real sensitive user data.
- Additional canonical concepts such as Area, Milestone, Phase, Task, Step, nested Action, taxonomy/promotion types, non-project Knowledge, or a retained `Deleted` state.
- Project or Action states beyond the approved pairs; inferred completion; Project-completion cascade; progress-implies-completion; recommendation-implies-Action; permanent recommendation scoring/precedence; abandonment/withdrawal; or deletion undo.
- Provider-specific response, tool-call, conversation/thread, error, hosted-memory, D1, SQLite, Cloudflare binding, or framework types in domain/application contracts.
- Product, architecture, governance, production, paid-service, or development-control-plane changes.

## Constraints and invariants

- Preserve every applicable invariant in Product Foundation revision 1, Domain Model revision 1, and Runtime Architecture revision 1 without translating infrastructure convenience into product truth.
- Every accepted Project has an intended outcome; a Project may have zero Actions; every Action belongs to exactly one Project and cannot contain another Action.
- Interruption, inactivity, focus, blockers, dependencies, recommendation, and unresolved matters do not change Project or Action lifecycle.
- Project completion does not cascade. Accepted Progress can exist without an Action and never completes one by itself.
- Explicit current user selection or correction outranks inference. Ambiguous state-changing target or effect yields a clarification-required, non-accepted result.
- Advisory/proposed/retrieved/generated results do not mutate accepted state. A failed acceptance attempt changes nothing and retains enough normalized intent for later safe recovery where applicable.
- Knowledge capture is intentional and taxonomy-free. Origin is preserved. A correction is represented as supersession rather than silent rewrite; supersession remains distinct from deletion.
- Ordinary unambiguous change authorization, separate deletion confirmation, prohibited authentication-material capture, authority disclaimers, and per-portion mixed outcomes must be representable without implementing their I/O flow.
- All types and functions remain provider-neutral and side-effect-free in this task.

## Definition of Done

1. The pure kernel compiles and represents exactly the approved canonical concepts, supporting context concepts, relationships, and lifecycle states without an unauthorized type or state.
2. Explicit transition functions or equivalent application contracts enforce Project and Action creation, completion, reopening, accepted progress/context, target clarity, and no-cascade rules.
3. Knowledge contracts represent intentional capture, exactly one origin, current standing, reconstructible supersession, and the distinction between supersession and deletion without selecting persistence mechanics.
4. Operation contracts distinguish advisory/proposed, clarification-required, accepted, failed, prohibited, and unresolved/mixed portions sufficiently to prevent false accepted-state success. Exact implementation names are Engineering-owned.
5. Human-control contracts make ordinary explicit changes, ambiguous changes, separately confirmed destructive deletion, and non-state-changing assistance distinguishable without adding confirmation requirements beyond approved semantics.
6. Deterministic tests cover every applicable Domain Model invariant, transition, invalid transition, and no-mutation boundary, including multiple Active Projects and user-authoritative correction.
7. Static dependency evidence proves no Worker, D1, Workers AI, provider, framework, network, schema, route, or prompt representation enters the kernel.
8. Verification is durably bound to the exact candidate and all contracted checks pass.
9. An Independent Reviewer returns `REVIEW GREEN` for product-semantic and architecture-boundary scope, or all blocking findings are repaired and required rechecks pass.

## Verification contract

The Deterministic Verifier must bind the packet revision, exact candidate commit/tree or reproducible file-hash manifest, dependency lockfile, commands, tool versions, and environment assumptions.

Required checks and pass criteria:

1. clean install and the repository-defined typecheck, lint, unit, and build commands pass without changing the lockfile;
2. a traceable transition matrix proves the only Project states are `Active` and `Completed`, the only Action states are `Open` and `Completed`, and only approved explicit transitions succeed;
3. relationship tests prove intended-outcome presence, zero-or-more Actions, exact Action ownership, non-recursion, one Knowledge origin, and multiple simultaneously Active Projects;
4. no-cascade and no-inference tests prove interruption/focus/blockers do not change lifecycle, Project completion does not change related items, progress does not complete an Action, and a proposal/recommendation/inference does not create accepted state;
5. ambiguity, correction, failure, and mixed-outcome tests prove unclear mutation is not accepted, explicit correction prevails, failed attempts change nothing, and success for one portion does not imply another;
6. Knowledge tests prove intentional capture contracts, origin preservation, supersession relationship and chain semantics, and no silent rewrite or invented taxonomy;
7. a deterministic source/import scan finds no Cloudflare Worker, D1, SQLite, Workers AI, provider, network, schema, routing, prompt, framework, or hosted-memory representation in allowed kernel paths;
8. a forbidden-concept scan plus reviewer inspection finds no extra lifecycle state, hierarchy/taxonomy type, abandonment/withdrawal, permanent recommendation precedence, `Deleted` retained state, or deletion undo; and
9. `git diff --check` succeeds.

Unavailable evidence is recorded as inability rather than PASS and returns to the Planner / Controller for classification. Semantic review is required because deterministic type/test passes cannot prove faithful interpretation of Product Foundation and Domain Model authority.

## Risk classification

**HIGH — canonical product-semantic, human-control, and downstream contract impact.**

Supplemental controls:

- pure side-effect-free scope and disjoint write ownership;
- comprehensive invariant and forbidden-concept evidence;
- no dependency or runtime/configuration changes;
- exact-candidate Strong Semantic Reasoning review by an actor independent of the Builder;
- targeted recheck only for bounded corrections that do not alter unrelated semantic or risk scope; and
- fresh full review for any material contract, authority, human-control, security-boundary, or scope change.

## Assignment

- **Delivery Planner / Controller:** owns predecessor validation, readiness re-evaluation, exact-base selection, write-conflict control, Delivery Record creation, findings routing, and state changes.
- **Builder:** one Standard Delivery worker with strong domain-model implementation capability; exclusive writer for the allowed paths; cannot provide final semantic review.
- **Deterministic Verifier:** Deterministic Execution profile; read-only; runs and records the contracted matrix, tests, and scans against the exact candidate.
- **Independent Reviewer:** a different actor from the Builder with Strong Semantic Reasoning; reviews Product Foundation, Domain Model, Runtime Architecture boundary, this packet, exact candidate, and evidence.
- **Write isolation:** no concurrent task may edit `src/domain/**`, `src/application/contracts/**`, `tests/domain/**`, or `tests/application/contracts/**`.

## Human Reserved boundaries

Stop and prepare a Decision Packet for any apparent contradiction, missing product semantic, proposed canonical concept/state, change to human-control or deletion/data policy, change to an `ARC-*` boundary, security-boundary decision, unapproved scope expansion, or other repository-reserved matter. Ordinary TypeScript naming, file organization inside the allowed paths, identifier representation, pure function structure, and test parametrization do not require human approval when they preserve approved semantics.

## Prior findings

None.

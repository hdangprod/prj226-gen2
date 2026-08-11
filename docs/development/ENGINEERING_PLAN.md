# PRJ226 Generation 2 Engineering Plan

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Plan revision:** 1

**Last updated:** 2026-08-12

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-018` (APPROVED; human Engineering Phase authorization recorded)

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../development/DELIVERY_CONTRACT.md) revision 1

**Canonical sources:** [Liam v1 Product Foundation Baseline](../../product/PRODUCT_FOUNDATION.md) revision 1; [Liam v1 Runtime Architecture Baseline](../architecture/RUNTIME_ARCHITECTURE.md) revision 1; [Foundation Decision Register](../foundation/DECISIONS.md), including `ARC-001` through `ARC-006` revision 1 and `GOV-018` revision 1.

**Deeper approved evidence:** [Product Intent](../../product/PRODUCT_REQUIREMENTS.md) revision 1; [Scenario Corpus](../../product/SCENARIOS.md) revision 1; [Domain Model](../../product/DOMAIN_MODEL.md) revision 1.

## Purpose and authority

This is the minimum durable execution plan for the authorized PRJ226 Generation 2 Engineering Phase. It records the current implementation objective, Engineering Definition of Ready, implementation obligations, dependency DAG, task states, verification strategy, first execution wave, concurrency controls, and Human Reserved boundaries.

This operational plan reflects and narrows approved authority. It does not modify Product Foundation or Runtime Architecture semantics, approve a task candidate, establish completion, authorize production release or paid use, or replace a Task Packet or Delivery Record. The Foundation Program remains complete rather than becoming an Engineering roadmap, and deferred `PLAN-001` release sequencing remains unresolved.

## Implementation objective

Implement the approved Liam v1 product as one TypeScript Cloudflare Workers deployable with:

- application/domain authority over every accepted state transition;
- authoritative accepted memory in Cloudflare D1 through a provider-neutral persistence port and D1 adapter;
- the simplest sufficient direct-SQL retrieval with currentness, provenance, supersession, deletion, and uncertainty controls;
- a Liam-owned Model Capability Port with an adapter-local Cloudflare Workers AI integration and `@cf/zai-org/glm-4.7-flash` as the initial free-profile validation candidate;
- one coherent Vietnamese/English text interaction flow that enforces advisory, state-changing, ambiguity, mixed-outcome, confirmation, correction, and user-authority semantics;
- data-minimized Cloudflare-native operational evidence and explicit, recoverable failure behavior; and
- deterministic and semantic evidence for all approved scenario families and architecture invariants.

Production deployment, production provisioning or credentials, paid-service activation, and development control-plane implementation remain outside this objective.

## Reconstructed authority and Engineering Definition of Ready

| Prerequisite | Durable evidence | Result |
| --- | --- | --- |
| Product Foundation approved | Product Foundation revision 1; `GOV-011` | PASS |
| Delivery Contract approved | Delivery Contract revision 1; `GOV-013` | PASS |
| Runtime Architecture approved | Runtime Architecture revision 1; `ARC-001` through `ARC-006`; `GOV-017` | PASS |
| Engineering explicitly authorized | `GOV-018`, approved by `github:hdangprod` on 2026-08-09 | PASS |
| Product decisions needed for implementation resolved | Required `PRD-*`, `BEH-*`, `MOD-*`, `DATA-001`, `VAL-001`, and `QLT-001` records are approved; intentionally unmodeled concepts remain excluded | PASS |
| Architecture decisions needed for implementation resolved | `ARC-001` through `ARC-006` revision 1 are approved; no architecture-review finding remains | PASS |
| Technology baseline exists | TypeScript, one Cloudflare Workers deployable, D1, direct SQL, Cloudflare-native observability, Workers AI adapter boundary, and the initial model candidate are approved | PASS |
| Human Reserved boundaries known | Delivery Contract Human Reserved Authority and the explicit exclusions in `GOV-018` | PASS |
| Initial task scope, evidence, assignment, and write ownership are bounded | [`ENG-001` Task Packet revision 1](tasks/ENG-001-runtime-foundation.md) | PASS |

**Engineering DoR result:** `PASS`. No genuine product, architecture, authority, or security decision blocks the bounded Engineering Phase or `ENG-001`. `PLAN-001` concerns product/release sequencing and does not block dependency-driven implementation ordering. Live model qualification has later environment and provider-policy prerequisites, recorded on `ENG-013`, but those do not block local deterministic work.

## Derived implementation obligations

| Obligation | Required implementation consequence | Primary authority | Delivery nodes |
| --- | --- | --- | --- |
| Domain and application authority | Represent only the approved Project, Action, Knowledge Item, accepted progress/context, Current Context, lifecycle, recommendation, and operation-outcome semantics. Inference, advice, retrieval, and provider output cannot mutate accepted state. | Product Foundation; Domain Model; `ARC-001` | `ENG-002`, `ENG-004`, `ENG-005`, `ENG-010` |
| Truthful authoritative persistence | Persist every required accepted change before success; enforce practical invariants; make failed, duplicate, retried, and partial operations explicit and safe; keep D1 types adapter-local. | `PF-QLT-001`; `ARC-001`, `ARC-006`; Runtime Architecture invariants 1–4 and 7 | `ENG-003`, `ENG-004`, `ENG-005`, `ENG-007`, `ENG-011` |
| Continuity and accepted memory | Preserve accepted Project/Action state, progress, unresolved matters, constraints, and enough accepted context to resume after transient conversation loss. | `PF-CAP-001`, `PF-CTX-001`; `ARC-005` | `ENG-003`, `ENG-004`, `ENG-006` |
| Knowledge, provenance, and retrieval | Support intentional taxonomy-free capture, immutable origin, reconstructible supersession, current/superseded distinction, qualified cross-Project reuse, and direct authoritative SQL retrieval without vector/search/cache infrastructure. | `PF-KNW-001`; Domain invariants 11–12; `ARC-005`, `ARC-006` | `ENG-005`, `ENG-006` |
| User data control | Provide predictable retention, authoritative export, scoped separately confirmed deletion, deletion failure visibility, and later retrieval exclusion without inventing a `Deleted` lifecycle or guaranteed undo. | `PF-DATA-001`, `PF-CTL-001`; Domain invariants 14–15; Runtime Architecture invariant 6 | `ENG-007`, `ENG-010`, `ENG-011` |
| Provider-portable model integration | Keep the Liam-owned capability contract provider-neutral; expose only minimum necessary accepted context; exclude authentication material; normalize provider failure; keep provider state non-authoritative. | `ARC-003`, `ARC-006`; Runtime Architecture, Liam-owned Model Capability Contract | `ENG-008`, `ENG-009`, `ENG-010` |
| Human-controlled interaction | Support Vietnamese and English text, explicit ordinary acceptance, clarification before ambiguous mutation, separate deletion confirmation, advisory recommendation, qualified uncertainty, correction, and separate mixed outcomes. | `PF-INT-001`, `PF-CTX-001`, `PF-REC-001`, `PF-CTL-001`; Domain Model | `ENG-010`, `ENG-012`, `ENG-013` |
| Verification and operational evidence | Distinguish interpretation, authorization, persistence, derived, provider, and user-visible outcomes; minimize logged content; cover domain, persistence, failure, adapter, scenario, export/deletion, and recovery behavior. | `PF-QLT-001`; `ARC-004`; Runtime Architecture invariants 7–8 | `ENG-001`, `ENG-011`, `ENG-012`, `ENG-013` |
| Cost and production boundary | Remain inside the approved free-profile design, treat quota exhaustion as visible failure, use synthetic/non-sensitive model evidence, and require human disposition for paid use or production action. | `ARC-006`; `GOV-018` | All nodes; specifically `ENG-009`, `ENG-011`, `ENG-013` |

## Engineering design defaults

The following are reversible Engineering-owned defaults selected to keep the implementation minimal. They are not architecture or product decisions:

- use the native Worker `fetch` entry boundary unless `ENG-001` evidence justifies a small framework;
- use ordered SQL migrations and prepared D1 SQL through the adapter, with no ORM initially;
- expose repository-owned commands for clean install, typecheck, lint, unit tests, build, local integration, migrations, and semantic acceptance;
- use a simple machine-readable JSON export unless approved behavior requires another format; and
- use deterministic model doubles for contract and semantic acceptance before live model evaluation.

Exact package and tool versions are selected and lockfile-bound by `ENG-001`. A later task may change a reversible default only within its Task Packet and approved authority, with readiness re-evaluation and evidence.

## Dependency-aware Task DAG

```text
ENG-001 Runtime/tooling foundation
  -> ENG-002 Domain/application kernel
       -> ENG-003 D1 authority foundation
            -> ENG-004 Project/Action/context slice ----+
            -> ENG-005 Knowledge/provenance slice ------+-> ENG-006 Direct-SQL retrieval/resumption
                                                            -> ENG-007 Export/confirmed deletion
       -> ENG-008 Model Capability Port and deterministic double
            -> ENG-009 Workers AI adapter

ENG-004 + ENG-005 + ENG-006 + ENG-007 + ENG-008 + ENG-009
  -> ENG-010 Text interaction and human-control orchestration
       -> ENG-011 Observability and failure/recovery hardening
            -> ENG-012 Deterministic integrated semantic acceptance
                 -> ENG-013 Live model-candidate qualification
```

The arrows express implementation dependencies, not product roadmap or release priority.

## Task state and evidence matrix

No task is `RUNNING`. `ENG-001`, `ENG-002`, `ENG-003`, and `ENG-008` are `DONE`. `ENG-004` and `ENG-005` now have their listed implementation predecessor complete but remain `PROPOSED`: neither has a Task Packet or task-level Definition of Ready re-evaluation. `ENG-009` likewise remains `PROPOSED` because it has no Task Packet or task-level Definition of Ready re-evaluation. All other nodes remain `PROPOSED` pending their listed predecessors and a complete Ready Task Packet.

| Task | Objective and dependencies | State | Risk and required review | Primary deterministic evidence |
| --- | --- | --- | --- | --- |
| `ENG-001` | Establish the locked TypeScript/Workers toolchain, one deployable shell, local/test configuration, and repository verification interface. Depends on `GOV-018` and this plan. | `DONE` | MODERATE; independent architecture/configuration review required | Clean install; typecheck; lint; unit and smoke tests; build; configuration, forbidden-dependency/service, secret, and whitespace checks; [Delivery Record](delivery/ENG-001-runtime-foundation.md) |
| `ENG-002` | Implement the pure domain/application kernel and operation-result contracts. Depends on `ENG-001 DONE`. | `DONE` — exact candidate manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`; verification PASS; review GREEN | HIGH product-semantic risk; strong independent semantic review complete | Transition and invariant matrices; no-mutation proposal/inference/failure tests; no extra state, hierarchy, taxonomy, provider, or infrastructure types; [Delivery Record](delivery/ENG-002-domain-application-kernel.md) |
| `ENG-003` | Create the minimal D1 schema/migrations, persistence port and adapter, constraints, atomic accepted writes, retry/idempotency, and false-success defenses. Depends on `ENG-002`. | `DONE` — exact candidate manifest `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`; verification PASS; targeted review GREEN | HIGH persistence/migration/data risk; independent persistence review complete | Fresh migration; constraint and adapter-contract tests; commit failure injection; duplicate/retry and partial-failure tests; adapter-boundary scan; [Delivery Record](delivery/ENG-003-d1-authority-foundation.md) |
| `ENG-004` | Deliver Project, Action, accepted progress/context, lifecycle, target, and resumption mutation behavior. Depends on `ENG-002`, `ENG-003`. | `PROPOSED` | HIGH lifecycle/human-control risk; independent product-semantic review required | Domain plus local-D1 tests for establish/complete/reopen, no cascade, progress not completion, ambiguity no-write, truthful failure/retry |
| `ENG-005` | Deliver intentional Knowledge capture, origin provenance, correction, supersession chains, and current standing. Depends on `ENG-002`, `ENG-003`. | `PROPOSED` | HIGH data-semantic risk; independent semantic/data review required | Origin immutability, atomic correction, chain/currentness, unrelated-item isolation, no casual capture, failure/duplicate tests |
| `ENG-006` | Deliver simplest-sufficient direct-SQL retrieval and accepted-context resumption with provenance, currentness, bounded cross-Project reuse, and uncertainty. Depends on `ENG-003`, `ENG-004`, `ENG-005`. | `PROPOSED` | MODERATE-HIGH retrieval/architecture risk; independent semantic/architecture review required | Query fixtures; superseded/deleted exclusion; qualified historical result; origin preservation; transient-session-loss recovery; no vector/search/cache dependency scan |
| `ENG-007` | Deliver authoritative export and clear-scope, separately confirmed deletion with visible partial-failure/retry behavior. Depends on `ENG-003` through `ENG-006` as applicable. | `PROPOSED` | HIGH destructive/data-control risk; fresh independent review required | Export-authority equality; no delete before confirmation; injected failure no-change/no-false-success; post-delete retrieval; duplicate/retry and provenance-chain tests |
| `ENG-008` | Define the Liam-owned provider-neutral Model Capability Port and deterministic model double with bounded context, uncertainty, proposal, and normalized failure outcomes. Depends on `ENG-002`. | `DONE` — exact candidate manifest `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696`; verification PASS; review GREEN | HIGH architecture/data-boundary risk; independent boundary/security review complete | Port contract tests; context-minimization and secret-exclusion fixtures; proposal-no-write checks; provider-free import/API scan; [Delivery Record](delivery/ENG-008-model-capability-port.md) |
| `ENG-009` | Implement the adapter-local Workers AI integration for configured `@cf/zai-org/glm-4.7-flash`, without live qualification. Depends on `ENG-001`, `ENG-008`. | `PROPOSED` — implementation predecessors are DONE, but no Task Packet or task-level DoR re-evaluation exists | HIGH provider/data risk; independent integration/data review required | Mocked binding contracts; Worker build; timeout/refusal/malformed/quota/unavailable matrix; adapter-local type/import and secret/log scans |
| `ENG-010` | Integrate one bilingual text flow with advisory/state-changing separation, ambiguity clarification, recommendations, mixed outcomes, correction, and deletion confirmation. Depends on `ENG-004` through `ENG-009` as applicable. | `PROPOSED` | HIGH product, architecture, and human-control risk; fresh independent review required | Local end-to-end tests with D1 and deterministic model double; provider output no-write; ambiguity no-write; mixed results; bilingual behavior; provider success distinct from persistence success |
| `ENG-011` | Complete data-minimized correlated observability and cross-layer failure/recovery hardening. Depends on `ENG-003` through `ENG-010`. | `PROPOSED` | HIGH security/operability and broad-write risk; serialize one writer and require independent security/operability review | Signal assertions; redaction fixtures; provider, persistence, quota, partial, and duplicate failure injection; outcome-separation checks |
| `ENG-012` | Execute deterministic integrated acceptance for `SCN-001` through `SCN-012` and `INV-001` through `INV-011` using local D1 and model doubles. Depends on `ENG-010`, `ENG-011`. | `PROPOSED` | HIGH cross-system semantic risk; fresh full independent review required | Clean-database scenario/invariant matrix, complete command results, migrations, forbidden-scope/dependency scans, exact candidate manifest |
| `ENG-013` | Qualify the live initial model candidate with synthetic/non-sensitive bilingual and structured-behavior cases. Depends on `ENG-009`, `ENG-010`, `ENG-012`, free non-production access, and current provider policy/license evidence. | `PROPOSED` | HIGH external, nondeterministic, provider-data risk; independent semantic/data review required | Bound model/config/corpus revisions; dated sanitized runs; Vietnamese/English, proposal/tool-intent, recommendation, uncertainty, and failure cases; current policy/license source record |

## Delivery Records

Delivery Records are maintained under [`docs/development/delivery/`](delivery/) and remain distinct from their pre-dispatch Task Packets.

| Task | State | Delivery Record |
| --- | --- | --- |
| `ENG-001` | `DONE` | [ENG-001 Runtime Foundation Delivery Record](delivery/ENG-001-runtime-foundation.md) |
| `ENG-002` | `DONE` | [ENG-002 Domain and Application Kernel Delivery Record](delivery/ENG-002-domain-application-kernel.md) |
| `ENG-003` | `DONE` | [ENG-003 D1 Authority Foundation Delivery Record](delivery/ENG-003-d1-authority-foundation.md) |
| `ENG-008` | `DONE` | [ENG-008 Model Capability Port and Deterministic Double Delivery Record](delivery/ENG-008-model-capability-port.md) |

## Task Packet index and first execution wave

| Task Packet | Revision | Current state | Dispatch condition |
| --- | --- | --- | --- |
| [`ENG-001 — Runtime and Tooling Foundation`](tasks/ENG-001-runtime-foundation.md) | 1 | `DONE` | Verification PASS, independent review GREEN, and durable Delivery Record are complete. |
| [`ENG-002 — Domain and Application Kernel`](tasks/ENG-002-domain-application-kernel.md) | 1 | `DONE` | Exact candidate recorded; verification PASS; independent review GREEN; durable Delivery Record complete. |
| [`ENG-003 — D1 Authority Foundation`](tasks/ENG-003-d1-authority-foundation.md) | 1 | `DONE` | Exact final candidate recorded; deterministic verification PASS; independent persistence/data-boundary review GREEN; complete repair/recheck history and durable Delivery Record present. |
| [`ENG-008 — Model Capability Port and Deterministic Double`](tasks/ENG-008-model-capability-port.md) | 1 | `DONE` | Exact final candidate recorded; deterministic verification PASS; independent boundary/security review GREEN; durable Delivery Record complete. |

The first execution wave is deliberately serial:

1. `ENG-001` was dispatched as the sole first-wave task. It established the toolchain, one-deployable seam, stable verification commands, and source/test conventions while owning the root configuration and runtime-entry paths.
2. Its verification and independent review were bound to the exact candidate, the historical manifest-ordering mismatch was resolved as provenance recovery, and its Delivery Record was closed before `DONE`.
3. `ENG-002` established the semantic contract fork point used by persistence and model work; its exact candidate passed deterministic verification and independent semantic review, and its Delivery Record is closed.
4. `ENG-008` subsequently completed with exact-candidate deterministic PASS and independent boundary/security review GREEN. Its completion satisfies `ENG-009`'s listed implementation predecessors, but `ENG-009` has no Task Packet and remains `PROPOSED`.
5. `ENG-003` subsequently completed on exact candidate manifest `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` after final deterministic PASS, targeted review GREEN, and closure of `ENG-003-F001` and `ENG-003-F001-R1`. Its completion satisfies the listed implementation predecessors of `ENG-004` and `ENG-005`, but neither has a Task Packet or task-level DoR; both remain `PROPOSED`. This controller update dispatches no Builder.

The initial `ENG-001` and `ENG-002` wave was deliberately serial while the implementation and test conventions were being established. After `ENG-002 DONE`, `ENG-003` and `ENG-008` were the first safe parallel pair. With both now `DONE`, no task is currently `READY`: `ENG-004`, `ENG-005`, and `ENG-009` each require its own bounded Task Packet and task-level DoR before dispatch can be evaluated.

## Concurrency and writer isolation

- Every writing task receives one active Builder and exclusive ownership of the exact paths in its Task Packet.
- `ENG-003` persistence work and `ENG-008` model-port work were concurrency-safe after `ENG-002` because their adapter, port, and test paths were disjoint; both are now `DONE`.
- `ENG-004` Project/Action/context and `ENG-005` Knowledge/provenance work may proceed concurrently after `ENG-003` only after each has an explicit Task Packet and task-level DoR that confirms their declared application-module and test locks remain disjoint.
- `ENG-006` waits for both vertical slices so retrieval cannot invent incomplete state contracts. `ENG-007` waits for retrieval and persistence so deletion/export evidence covers actual authority paths.
- `ENG-010` is the integration convergence point and is serialized against its predecessors. `ENG-011` has intentionally broad runtime instrumentation scope and receives a single exclusive writer.
- Read-only verification and review may run concurrently only when independence, exact-candidate binding, and evidence integrity remain intact.
- Any actual path overlap is serialized or resolved by a packet amendment and readiness re-evaluation; task status alone never grants write ownership.

## Validation and exact-candidate strategy

Every dispatched task must create a Delivery Record after dispatch. The record binds Task Packet revision, exact candidate commit/tree or reproducible file-hash manifest, dependency lockfile, relevant migration/config/model identifiers, command and environment inputs, outputs, reviewer identity, reviewed candidate, findings, repairs, and rechecks.

Verification proceeds in this order where applicable:

1. clean dependency installation and static configuration checks;
2. typecheck, lint, unit tests, and build;
3. migration, local D1, adapter-contract, and failure-injection tests;
4. local integration tests with deterministic model doubles;
5. scenario/invariant acceptance against semantic outcomes rather than exact wording;
6. independent review of the exact candidate and deterministic evidence; and
7. only after deterministic acceptance, live model-candidate qualification with synthetic/non-sensitive data and current provider-policy evidence.

Scenario coverage is staged as follows:

| Evidence cluster | Primary nodes |
| --- | --- |
| Project establishment, Action refinement, interruption/resumption, progress failure/retry, and multiple active Project ambiguity (`SCN-001`–`SCN-004`, `SCN-006`) | `ENG-004`, `ENG-006`, `ENG-010`, `ENG-012` |
| Knowledge capture/retrieval, correction/supersession, and cross-Project reuse (`SCN-005`, `SCN-008`, `SCN-009`) | `ENG-005`, `ENG-006`, `ENG-010`, `ENG-012` |
| Recommendations under competing signals (`SCN-002`, `SCN-003`, `SCN-007`) | `ENG-008`–`ENG-010`, `ENG-012`, `ENG-013` |
| Retention, export, confirmed deletion, mixed sensitive/prohibited requests, and scope boundaries (`SCN-010`–`SCN-012`) | `ENG-007`, `ENG-010`–`ENG-012` |
| Vietnamese/English and live model capability | `ENG-010`, `ENG-012`, `ENG-013` |

A live model failure creates a model-capability finding and provider/model reevaluation. It does not weaken Product Foundation behavior or redesign domain/persistence boundaries. Paid replacement evaluation cannot become paid use without human authorization.

## Human Reserved boundaries

Engineering must stop the affected task and prepare the Delivery Contract Decision Packet when any of these is required:

- a semantic change to Product Foundation, Project, Action, Knowledge Item, lifecycle, context, recommendation, deletion, export, or data-control authority;
- a change to `ARC-001` through `ARC-006`, a new architecture boundary or deployable, or another runtime service;
- vector, embedding, separate search, cache, queue, provider-hosted canonical memory, or another currently excluded infrastructure choice;
- a material security-boundary decision or unresolved conflict between authoritative sources;
- a paid provider, paid usage, billing change, or cost-incurring resource;
- production provisioning, production credential creation/rotation, deployment, or destructive production action;
- unapproved scope expansion or an irreversible external action; or
- development control-plane, scheduler, agent-runner, automatic-router, orchestration-database, or `.dev-control` implementation.

Ordinary source layout, TypeScript types, table and index design, ordered migration details, repository functions, test framework details, native Worker routing, internal interfaces, and a minimal export representation remain Engineering-owned when they preserve approved semantics and architecture.

## Blockers, findings, and planning outcome

- **Current blocking Human Decision Packets:** None.
- **Current task state:** No task is `READY` or `RUNNING`. `ENG-003` is `DONE` with durable exact-candidate verification/review/recheck evidence. `ENG-004` and `ENG-005` have their implementation predecessor satisfied but remain `PROPOSED` until each has a bounded Task Packet and task-level DoR re-evaluation. `ENG-009` has `ENG-001` and `ENG-008` DONE but likewise remains `PROPOSED` until its Task Packet and DoR exist. Later tasks await their listed Engineering predecessors; these are ordinary DAG dependencies, not Human Reserved blockers.
- **Intentionally absent semantics:** Project abandonment or Action withdrawal, extra planning hierarchy, non-project knowledge, knowledge taxonomy/promotion, permanent recommendation precedence, and deletion undo remain unmodeled and must not be invented.
- **Current external condition:** `ENG-013` later requires free non-production Workers AI access plus current data-use, retention, caching/storage, hosted-state, training/improvement, and license/terms evidence. This does not block `ENG-001` through deterministic acceptance.
- **Delivery boundary confirmation:** The initial planning session created only planning/governance artifacts. The later `ENG-001` candidate is limited to its approved runtime-foundation scope and has no schema, migration, provider call, remote resource, credential, deployment, paid-service, or control-plane implementation. This state update starts no Builder work.

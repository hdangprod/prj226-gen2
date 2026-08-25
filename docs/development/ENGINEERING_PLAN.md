# PRJ226 Generation 2 Engineering Plan

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Plan revision:** 1

**Last updated:** 2026-08-25

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
       -> ENG-003 D1 authority foundation (Revision 3 accepted; DONE)
            -> ENG-004 Project/Action/context slice (DONE) ------------------------+
            -> ENG-005 Knowledge/provenance slice (DONE) ---------------------------+-> ENG-006 Direct-SQL retrieval/resumption (DONE / ACCEPTED)
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

No task is `RUNNING`. The canonical `foundation/product-foundation` baseline before the ENG-009 READY governance segment is `2bdad043dce96d906a331f2ab7ae42d1ea590068`, tree `6db40000c9990a2dac5e6a2f2b7a899c93cde226`. `ENG-001`, `ENG-002`, `ENG-003`, `ENG-004`, `ENG-005`, `ENG-006`, and `ENG-008` are `DONE`. `ENG-003` revision 3 is `ACCEPTED` on commit `5276481824e43d23345799c39efaa72e51235877`, tree `0ea10d0400a5439af60c72ce943b7504e4173674`, and aggregate `a5bb90a62af050b2cc7bcf1beecac072b3927b45d91178e65564935d7420c156`; prior ENG-003 revisions remain historical accepted evidence. `ENG-003-R3-R001`, `ENG-003-R3-R002`, and `ENG-003-R3-S2-R001` are `CLOSED`; `GCV-001` is `CLOSED BY GOVERNANCE SUCCESSOR REPAIR`. `ENG-006` Repair Rev1 is `ACCEPTED` on commit `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, and aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda`; governance closure `2bdad043dce96d906a331f2ab7ae42d1ea590068` directly follows the accepted implementation, so ENG-006 is governance-closed, canonicalized, and post-integration verified. `ENG-006-R001`, `ENG-006-R002`, and `ENG-006-R003` are `CLOSED`; `ENG-006-R004` is `CLOSED AT UPSTREAM ENG-003 LEVEL`; and `ENG-006-R005` is `DEFERRED TO ENG-010`. Historical failed candidate `7b7db0d98660f6562f8e9738445be725fc65988c` remains `FROZEN / UNACCEPTED`. ENG-006 execution authority is consumed and non-operative; current Builder is `NONE`. Planning Revision 1 for ENG-009 remains `FROZEN / UNACCEPTED / FAILED FORMAL DoR / HISTORICAL`; Planning Revision 2 is `DoR-QUALIFIED / ACCEPTED FOR READY AUTHORITY`; independent Formal DoR Revision 2 is `PASS`; `ENG-009-DOR-R001` through `R008` are closed by that independent Formal DoR. Independent post-integration verification reported `PASS` for immutable READY execution base `b4e8b34ecd66372f07e02e9f4a2c61b4cbf310f3`, tree `f9902fef47104c5891dcc8fcad310f0d69ac7eed`. ENG-009 is `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED`; Builder is `NONE`; Builder dispatch is `NOT PERFORMED`; implementation is `NOT STARTED`; Human Reserved is `NOT REQUIRED`. A later governance-record commit does not replace this Builder execution base. All other nodes retain their existing states and dependencies.

| Task | Objective and dependencies | State | Risk and required review | Primary deterministic evidence |
| --- | --- | --- | --- | --- |
| `ENG-001` | Establish the locked TypeScript/Workers toolchain, one deployable shell, local/test configuration, and repository verification interface. Depends on `GOV-018` and this plan. | `DONE` | MODERATE; independent architecture/configuration review required | Clean install; typecheck; lint; unit and smoke tests; build; configuration, forbidden-dependency/service, secret, and whitespace checks; [Delivery Record](delivery/ENG-001-runtime-foundation.md) |
| `ENG-002` | Implement the pure domain/application kernel and operation-result contracts. Depends on `ENG-001 DONE`. | `DONE` — exact candidate manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`; verification PASS; review GREEN | HIGH product-semantic risk; strong independent semantic review complete | Transition and invariant matrices; no-mutation proposal/inference/failure tests; no extra state, hierarchy, taxonomy, provider, or infrastructure types; [Delivery Record](delivery/ENG-002-domain-application-kernel.md) |
| `ENG-003` | Create and maintain the minimal D1 persistence port/adapter, constraints, atomic accepted writes and authoritative expected-state lifecycle transitions, retry/idempotency, and false-success defenses. Expose collection-read capability in revision 3. Depends on `ENG-002`. | `DONE` — Revision 3 accepted on commit `5276481824e43d23345799c39efaa72e51235877`, tree `0ea10d0400a5439af60c72ce943b7504e4173674`, aggregate `a5bb90a62af050b2cc7bcf1beecac072b3927b45d91178e65564935d7420c156`; prior revisions preserved as history | HIGH persistence/lifecycle/data risk; fresh full independent persistence review GREEN for rev 2; Revision-3 Controller closure approved | Insert-only initial state; authoritative existence/ownership/expected-state transitions; concurrent/stale conflict; receipt atomicity; `37/37` local-D1 persistence evidence; [Delivery Record](delivery/ENG-003-d1-authority-foundation.md) |
| `ENG-004` | Deliver Project, Action, accepted progress/context, lifecycle, target, and resumption mutation behavior. Depends on `ENG-002` and repaired `ENG-003 DONE`. | `DONE` — final aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` path-scoped manifested; F001/F002/F003/F003-R1 CLOSED | HIGH lifecycle/human-control/persistence-authority risk; deterministic PASS and full review GREEN complete | Existing matrix plus fabricated-snapshot, missing-entity, expected-state/concurrency, ownership, receipt, and real-D1 regressions; [Delivery Record](delivery/ENG-004-project-action-context-slice.md) |
| `ENG-005` | Deliver intentional Knowledge capture, origin provenance, correction, supersession chains, and current standing. Depends on `ENG-002`, accepted repaired `ENG-003`. | `DONE` — final aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` path-scoped manifested; all findings CLOSED | HIGH data-semantic risk; fresh independent semantic/data review GREEN | Origin immutability, atomic correction, chain/currentness, unrelated-item isolation, no casual capture, malformed/missing exact-target no-write, authentication-material exclusion, failure/duplicate tests; [Delivery Record](delivery/ENG-005-knowledge-provenance-slice.md) |
| `ENG-006` | Deliver simplest-sufficient direct-SQL retrieval and accepted-context resumption with provenance, currentness, bounded cross-Project reuse, and uncertainty. Depends on `ENG-003`, `ENG-004`, `ENG-005`. | `DONE / ACCEPTED` — Repair Rev1 accepted on commit `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda`; R001–R003 closed, R004 closed upstream through ENG-003, R005 deferred to ENG-010; no active Builder | MODERATE-HIGH retrieval/architecture risk; deterministic verification PASS and independent semantic review GREEN complete | Query fixtures; superseded exclusion; qualified historical result; origin preservation; accepted-context retrieval; no vector/search/cache dependency scan; [Delivery Record](delivery/ENG-006-direct-sql-retrieval.md) |
| `ENG-007` | Deliver authoritative export and clear-scope, separately confirmed deletion with visible partial-failure/retry behavior. Depends on `ENG-003` through `ENG-006` as applicable. | `READY / DISPATCHED TO BUILDER REPAIR 6` — Revision 3 remains `ACCEPTED / READY AUTHORITY`; Formal DoR `PASS`; failed candidates through Repair 5 are frozen historical evidence; Repair 5 `d6596fc587fab55f4e9b49d4c9a40e041455440d` (tree `96629f4f114725f1ee0f0345259ef7320ceedd60`) is `FROZEN / UNACCEPTED / FAILED FINAL SEMANTIC RE-REVIEW / HISTORICAL ONLY`; `ENG-007-SR-R001`, `ENG-007-SR-R002-R1`, and `ENG-007-SR-R003` are `CLOSED`; `ENG-007-SR-R002-R2` is `ACCEPTED / BLOCKING / ASSIGNED TO BUILDER REPAIR 6`; `READY: YES`; Builder `ENG-007 BUILDER REPAIR 6`; dispatch `AUTHORIZED / DURABLY RECORDED`; implementation `NOT YET STARTED`; Human Reserved `NOT REQUIRED` | HIGH destructive/data-control risk; fresh independent review required | Export-authority equality; no delete before confirmation; injected failure no-change/no-false-success; post-delete retrieval; duplicate/retry and provenance-chain tests |
| `ENG-008` | Define the Liam-owned provider-neutral Model Capability Port and deterministic model double with bounded context, uncertainty, proposal, and normalized failure outcomes. Depends on `ENG-002`. | `DONE` — exact candidate manifest `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696`; verification PASS; review GREEN | HIGH architecture/data-boundary risk; independent boundary/security review complete | Port contract tests; context-minimization and secret-exclusion fixtures; proposal-no-write checks; provider-free import/API scan; [Delivery Record](delivery/ENG-008-model-capability-port.md) |
| `ENG-009` | Implement the adapter-local Workers AI integration for the replaceable canonical candidate through an exact offline adapter contract, without live qualification. Depends on `ENG-001`, `ENG-008`. | `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED` — predecessors DONE; Revision 1 `FROZEN / UNACCEPTED / FAILED FORMAL DoR / HISTORICAL`; [Planning Revision 2](tasks/ENG-009-workers-ai-adapter.md) is `DoR-QUALIFIED / ACCEPTED FOR READY AUTHORITY`; independent [Formal DoR Revision 2](analysis/ENG-009_FORMAL_DoR_REV2_2026-08-24.md) `PASS`; independently reported [post-integration verification](analysis/ENG-009_POST_INTEGRATION_READY_CANONICAL_VERIFICATION_2026-08-24.md) `PASS`; immutable READY execution base `b4e8b34ecd66372f07e02e9f4a2c61b4cbf310f3`; Builder `NONE`; implementation `NOT STARTED` | HIGH provider/data/untrusted-output risk; Builder-independent deterministic verification and Builder-independent semantic review required | Exact mocked binding contract and schema; single-read/TOCTOU evidence; failure matrix; task-local adapter suite; complete current regression matrix; adapter-local type/import/credential/diagnostic scans |
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
| `ENG-003` | `DONE` — accepted revision-2 baseline | [ENG-003 D1 Authority Foundation Delivery Record](delivery/ENG-003-d1-authority-foundation.md) |
| `ENG-004` | `DONE` | [ENG-004 Project/Action/context slice Delivery Record](delivery/ENG-004-project-action-context-slice.md) |
| `ENG-005` | `DONE` | [ENG-005 Knowledge/provenance slice Delivery Record](delivery/ENG-005-knowledge-provenance-slice.md) |
| `ENG-006` | `DONE / ACCEPTED` | [ENG-006 Direct-SQL Retrieval and Accepted-Context Resumption Delivery Record](delivery/ENG-006-direct-sql-retrieval.md) |
| `ENG-008` | `DONE` | [ENG-008 Model Capability Port and Deterministic Double Delivery Record](delivery/ENG-008-model-capability-port.md) |

## Task Packet index and first execution wave

| Task Packet | Revision | Current state | Dispatch condition |
| --- | --- | --- | --- |
| [`ENG-001 — Runtime and Tooling Foundation`](tasks/ENG-001-runtime-foundation.md) | 1 | `DONE` | Verification PASS, independent review GREEN, and durable Delivery Record are complete. |
| [`ENG-002 — Domain and Application Kernel`](tasks/ENG-002-domain-application-kernel.md) | 1 | `DONE` | Exact candidate recorded; verification PASS; independent review GREEN; durable Delivery Record complete. |
| [`ENG-003 — D1 Authority Foundation`](tasks/ENG-003-d1-authority-foundation.md) | 3 | `DONE / ACCEPTED` | Revision 3 accepted; its execution authority is consumed and non-operative. |
| [`ENG-004 — Project/Action/context slice`](tasks/ENG-004-project-action-context-slice.md) | 2 | `DONE` | Accepted F003-R1 candidate is path-scoped manifested exactly; deterministic evidence, full review GREEN, and Controller closure are durable. |
| [`ENG-005 — Knowledge/provenance slice`](tasks/ENG-005-knowledge-provenance-slice.md) | 2 | `DONE` | Manifested on aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`; deterministic verification PASS; independent review GREEN; Delivery Record complete. |
| [`ENG-006 — Direct-SQL Retrieval and Accepted-Context Resumption`](tasks/ENG-006-direct-sql-retrieval.md) | 1 / Repair Rev1 | `DONE / ACCEPTED` | Repair Rev1 accepted; deterministic verification PASS, semantic review GREEN, Controller Final Closure APPROVE, and durable Delivery Record complete. Execution authority is consumed and non-operative. |
| [`ENG-008 — Model Capability Port and Deterministic Double`](tasks/ENG-008-model-capability-port.md) | 1 | `DONE` | Exact final candidate recorded; deterministic verification PASS; independent boundary/security review GREEN; durable Delivery Record complete. |
| [`ENG-009 — Workers AI Adapter`](tasks/ENG-009-workers-ai-adapter.md) | 2 | `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED` | Revision 1 is `FROZEN / UNACCEPTED / FAILED FORMAL DoR / HISTORICAL`. Revision 2 is `DoR-QUALIFIED / ACCEPTED FOR READY AUTHORITY`; independent [Formal DoR Revision 2](analysis/ENG-009_FORMAL_DoR_REV2_2026-08-24.md) is `PASS`, closing `ENG-009-DOR-R001` through `R008`; independently reported [post-integration verification](analysis/ENG-009_POST_INTEGRATION_READY_CANONICAL_VERIFICATION_2026-08-24.md) is `PASS`. `READY: YES`; immutable READY execution base `b4e8b34ecd66372f07e02e9f4a2c61b4cbf310f3`; Builder `NONE`; dispatch `NOT PERFORMED`; implementation `NOT STARTED`. |

The first execution wave is deliberately serial:

1. `ENG-001` was dispatched as the sole first-wave task. It established the toolchain, one-deployable seam, stable verification commands, and source/test conventions while owning the root configuration and runtime-entry paths.
2. Its verification and independent review were bound to the exact candidate, the historical manifest-ordering mismatch was resolved as provenance recovery, and its Delivery Record was closed before `DONE`.
3. `ENG-002` established the semantic contract fork point used by persistence and model work; its exact candidate passed deterministic verification and independent semantic review, and its Delivery Record is closed.
4. `ENG-008` subsequently completed with exact-candidate deterministic PASS and independent boundary/security review GREEN. Its completion satisfies `ENG-009`'s listed implementation predecessors. ENG-009 Planning Revision 1 later failed Formal DoR and remains frozen historical evidence. Planning Revision 2 independently passed Formal DoR. Its pre-integration candidate wording is historical; independent post-integration verification reported `PASS` for READY commit `b4e8b34ecd66372f07e02e9f4a2c61b4cbf310f3`. ENG-009 is now `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED`, with no Builder, no dispatch, and no implementation.
5. `ENG-003` completed revision 1 on exact candidate manifest `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` after final deterministic PASS, targeted review GREEN, and closure of `ENG-003-F001` and `ENG-003-F001-R1`. That candidate and history remain exact historical accepted evidence.
6. ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` later passed deterministic verification, closing `ENG-004-F001` and `ENG-004-F002`, but independent review raised blocking `ENG-004-F003`: lifecycle methods trusted caller snapshots and used persistence put/upsert rather than authoritative existing-state transitions.
7. F003 was resolved in ENG-003 revision 2 (aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`). ENG-004 was then manifested on aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` (F001–F003-R1 closed). ENG-005 completed on accepted aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` (findings closed).
8. The initial `ENG-006` candidate (`7b7db0d98660f6562f8e9738445be725fc65988c`) failed semantic review. Finding `ENG-006-R004` identified an upstream D1 collection-read capability gap. `ENG-003` Revision 3 accepted the targeted two-file capability repair. `ENG-006-R004` closed at upstream ENG-003 level; the failed candidate remains frozen and unaccepted.
9. Fresh `ENG-006` Repair Rev1 candidate `a94d2cd2714849e7be59fd464f85330f98d127b4` then passed independent deterministic verification and independent semantic review. Controller Final Closure approved that exact candidate; `ENG-006-R001` through `ENG-006-R003` are closed, `ENG-006-R004` remains closed upstream, `ENG-006-R005` remains deferred to `ENG-010`, and `ENG-006` is `DONE / ACCEPTED` with no active Builder authority.

The initial `ENG-001` and `ENG-002` wave was deliberately serial while implementation and test conventions were established. `ENG-004`, `ENG-005`, and `ENG-006` are complete. `ENG-003` revision 3 is `ACCEPTED` and `ENG-003` is `DONE`; its Builder authority is consumed and non-operative. `ENG-006` Repair Rev1 is `ACCEPTED`, governance-closed, canonicalized, post-integration verified, and `DONE`; its Builder and repair authority is consumed and non-operative. `ENG-009` is `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED` after Formal DoR Revision 2 `PASS` and independent post-integration verification `PASS`; it creates no Builder authority until explicit Controller dispatch.

## ENG-003 repair and downstream lock disposition

| Task | Exclusive source lock | Exclusive test locks |
| --- | --- | --- |
| `ENG-003` revision 2 (Historical) | `src/application/ports/persistence/**`; `src/infrastructure/d1/**` | `tests/application/ports/persistence/**`; `tests/infrastructure/d1/**` |
| `ENG-003` revision 3 (Historical Executed Contract) | `src/infrastructure/d1/d1Types.ts` | `tests/infrastructure/d1/fakeD1.ts` |
| `ENG-004` downstream repair (Historical) | `src/application/services/projectActionContext/**` | `tests/application/services/projectActionContext/**`; `tests/integration/d1/projectActionContext/**` |

The historical ENG-003 Rev3 writer was strictly bounded to two files. That write authority was consumed by accepted execution; all other paths remained protected.

The earlier ENG-004/ENG-005 prospective locks remain:

The packets assign disjoint prospective Builder ownership:

| Task | Exclusive source lock | Exclusive test locks |
| --- | --- | --- |
| `ENG-004` | `src/application/services/projectActionContext/**` | `tests/application/services/projectActionContext/**`; `tests/integration/d1/projectActionContext/**` |
| `ENG-005` | `src/application/services/knowledgeProvenance/**` | `tests/application/services/knowledgeProvenance/**`; `tests/integration/d1/knowledgeProvenance/**` |

Both tasks consume `src/domain/**`, `src/application/contracts/**`, the accepted ENG-003 persistence repair, `migrations/0001_authoritative_state.sql`, existing regression tests/helpers, root configuration, dependency files, and `src/index.ts` as read-only accepted upstream state. Their source locks remain disjoint; `ENG-004`, `ENG-005`, and `ENG-006` are complete; `ENG-003` revision 3 and `ENG-006` Repair Rev1 are `ACCEPTED`. Current Builder is `ENG-007 BUILDER REPAIR 6` under ENG-007's exact 15-path write lock; no `ENG-009` or later Builder dispatch is authorized without its own approved Ready Task Packet and Controller dispatch.

| Collision-prone surface | Classification | Reason |
| --- | --- | --- |
| Shared `index.ts` / barrel exports | `AVOIDABLE` | Task services are imported directly by task tests; shared barrels and `src/index.ts` are protected. Later `ENG-010` owns composition. |
| Common application ports | `READ_ONLY_SHARED` | Both consume the accepted ENG-003 persistence port without changing it. |
| Common application services | `AVOIDABLE` | Each slice owns a distinct new service root; no common service is required. |
| Shared domain types and Human Control contracts | `READ_ONLY_SHARED` | ENG-002 is complete authority and must remain unchanged. |
| Worker entrypoint/composition root | `DEFER_INTEGRATION` | `ENG-010` is the existing DAG convergence/integration owner; neither vertical slice modifies `src/index.ts`. |
| Package scripts, `package.json`, lockfile, and root test configuration | `AVOIDABLE` | Existing binaries/commands and task-local Vitest configuration suffice; root files are protected. |
| Test helpers and fixtures | `AVOIDABLE` | Existing upstream helpers are read-only; new fixtures/harnesses stay task-local. |
| Infrastructure composition and local emulator state | `READ_ONLY_SHARED` | Accepted D1 configuration/adapter/migration are immutable inputs; separate worktrees and local D1 state prevent resource collision. |
| Persistence integration paths | `READ_ONLY_SHARED` | Both use the same accepted port/adapter/schema but own no persistence-foundation write. |
| Model capability integration paths | `READ_ONLY_SHARED` | Neither task needs model paths; they are prohibited from changing them. |

The current binding disposition is:

`ENG-003 REVISION 2: ACCEPTED HISTORICAL BASELINE`

`ENG-003 REVISION 3: ACCEPTED`

`ENG-004: DONE — F001/F002/F003/F003-R1 CLOSED`

`ENG-005: DONE — F001/V001/F002/IR-F001..IR-F005 CLOSED`

`ENG-006 REPAIR REV1: ACCEPTED`

`ENG-006: DONE (HISTORICAL FAILED CANDIDATE 7b7db0d9... REMAINS FROZEN / UNACCEPTED)`

## Concurrency and writer isolation

- Every writing task receives one active Builder and exclusive ownership of the exact paths in its Task Packet.
- ENG-003 revision-1 persistence work and ENG-008 model-port work were concurrency-safe after ENG-002 because their adapter, port, and test paths were disjoint; both reached `DONE` before the later ENG-003 reopening.
- ENG-003 revision-2 persistence writing, ENG-004 closure, and ENG-005 closure are complete. ENG-005 completed on accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`, tree `833a11f345dedd240c892d473dd99e701d34cf3e`, aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`, with fresh deterministic PASS and independent review GREEN closing findings `F001` through `IR-F005`. Ambiguous-target clarification remains an upstream `ENG-010` responsibility.
- `ENG-006` Repair Rev1 is accepted and `ENG-006` is `DONE`; no ENG-006 Builder authority remains active. ENG-007 failed candidates through Repair 5 remain `FROZEN / UNACCEPTED / HISTORICAL ONLY`; Repair 5 `d6596fc587fab55f4e9b49d4c9a40e041455440d` additionally carries `FAILED FINAL SEMANTIC RE-REVIEW`. [Planning Revision 3 Task Packet](tasks/ENG-007-export-confirmed-deletion.md) remains `READY / DURABLY RECORDED` after independent Formal DoR recheck `PASS`; [ENG-007 Delivery Record](delivery/ENG-007-export-confirmed-deletion.md) is `ACTIVE`; `ENG-007-SR-R001`, `ENG-007-SR-R002-R1`, and `ENG-007-SR-R003` are `CLOSED`; `ENG-007-SR-R002-R2` is `ACCEPTED / BLOCKING / ASSIGNED TO BUILDER REPAIR 6`; Builder is `ENG-007 BUILDER REPAIR 6`; dispatch is `AUTHORIZED / DURABLY RECORDED`; implementation is `NOT YET STARTED`; Human Reserved is `NOT REQUIRED`.
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
- **Current task state:** no task is `RUNNING`; accepted completion identities for `ENG-003` through `ENG-006` remain unchanged, and `ENG-009` remains `READY / CANONICALIZED / POST-INTEGRATION VERIFIED / NOT DISPATCHED` from immutable READY base `b4e8b34ecd66372f07e02e9f4a2c61b4cbf310f3`. ENG-007 Planning Revision 3 remains `READY / DURABLY RECORDED` with Formal DoR `PASS`; Human Reserved decisions remain `RESOLVED / NOT REQUIRED`. Failed candidates through Repair 5 remain frozen and unaccepted; Repair 5 `d6596fc587fab55f4e9b49d4c9a40e041455440d`, tree `96629f4f114725f1ee0f0345259ef7320ceedd60`, is `FAILED FINAL SEMANTIC RE-REVIEW / HISTORICAL ONLY`. `ENG-007-SR-R001`, `ENG-007-SR-R002-R1`, and `ENG-007-SR-R003` are `CLOSED`; `ENG-007-SR-R002-R2` is `ACCEPTED / BLOCKING / ASSIGNED TO BUILDER REPAIR 6`; `READY: YES`; Current Builder `ENG-007 BUILDER REPAIR 6`; dispatch `AUTHORIZED / DURABLY RECORDED`; implementation `NOT YET STARTED`. Later tasks retain their declared dependencies.
- **Manifestation recovery:** The Controller recovered the already accepted thirteen-file ENG-003 candidate into the intended dispatch base, reproduced its component and aggregate hashes, and reran the contracted integrated verification. This was ordinary delivery recovery and path/integration control; it changed no Product or Runtime Architecture authority and required no Human Reserved decision.
- **Intentionally absent semantics:** Project abandonment or Action withdrawal, extra planning hierarchy, non-project knowledge, knowledge taxonomy/promotion, permanent recommendation precedence, and deletion undo remain unmodeled and must not be invented.
- **Current external condition:** `ENG-013` later requires free non-production Workers AI access plus current data-use, retention, caching/storage, hosted-state, training/improvement, and license/terms evidence. This does not block `ENG-001` through deterministic acceptance.
- **Delivery boundary confirmation:** The initial planning session created only planning/governance artifacts. The later `ENG-001` candidate is limited to its approved runtime-foundation scope and has no schema, migration, provider call, remote resource, credential, deployment, paid-service, or control-plane implementation. This state update starts no Builder work.

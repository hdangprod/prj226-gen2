# PRJ226 Generation 2 Engineering Plan

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Plan revision:** 1

**Last updated:** 2026-08-26

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
                                                            -> ENG-007 Export/confirmed deletion (Repair 6 accepted; DONE)
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

No task is `RUNNING`. `ENG-001` through `ENG-009` retain their accepted `DONE` identities and closure evidence. `ENG-010` is `REPAIR 3 DISPATCHED / NOT YET IMPLEMENTED` under [Task Packet Revision 1](tasks/ENG-010-text-interaction-human-control-orchestration.md), which remains operative after Formal DoR Revision 1 `PASS`. Candidate 1 `100f730556af7cea0f0a623809627aa3cf49d5a9`, Repair 1 `495f142fa28bebd3be47518fdd7a3b919ea0fcc1`, and Repair 2 `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` are `FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY`. Repair 2 tree is `35ec48efd2d9df93680f1efa4c3bdac0f63b98a3`, aggregate `284dab14730acdc2ca4456041d5c69e7451f41bd915d65f24df2f6f7450c6604`, deterministic verification `PASS`, and semantic review `FINDINGS` with accepted blocking `ENG-010-R2-SR-R001` and `ENG-010-R2-SR-R002`. Repair 3 is `AUTHORIZED / DURABLY DISPATCHED` with objectives `R3-O1` and `R3-O2`, regression contract `R3-TC-01` through `R3-TC-09`, the unchanged exact 11-path lock, and Human Reserved `NOT REQUIRED` ([Semantic Finding Disposition](analysis/ENG-010_R2_SEMANTIC_FINDING_DISPOSITION_2026-08-26.md)). Builder is `ENG-010 REPAIR 3 BUILDER`; branch `eng-010-builder-repair-3`; worktree `/private/tmp/prj226-eng010-builder-repair-3`; implementation `NOT YET STARTED`. All other nodes retain their existing states and dependencies.

| Task | Objective and dependencies | State | Risk and required review | Primary deterministic evidence |
| --- | --- | --- | --- | --- | --- |
| `ENG-001` | Establish the locked TypeScript/Workers toolchain, one deployable shell, local/test configuration, and repository verification interface. Depends on `GOV-018` and this plan. | `DONE` | MODERATE; independent architecture/configuration review required | Clean install; typecheck; lint; unit and smoke tests; build; configuration, forbidden-dependency/service, secret, and whitespace checks; [Delivery Record](delivery/ENG-001-runtime-foundation.md) |
| `ENG-002` | Implement the pure domain/application kernel and operation-result contracts. Depends on `ENG-001 DONE`. | `DONE` — exact candidate manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`; verification PASS; review GREEN | HIGH product-semantic risk; strong independent semantic review complete | Transition and invariant matrices; no-mutation proposal/inference/failure tests; no extra state, hierarchy, taxonomy, provider, or infrastructure types; [Delivery Record](delivery/ENG-002-domain-application-kernel.md) |
| `ENG-003` | Create and maintain the minimal D1 persistence port/adapter, constraints, atomic accepted writes and authoritative expected-state lifecycle transitions, retry/idempotency, and false-success defenses. Expose collection-read capability in revision 3. Depends on `ENG-002`. | `DONE` — Revision 3 accepted on commit `5276481824e43d23345799c39efaa72e51235877`, tree `0ea10d0400a5439af60c72ce943b7504e4173674`, aggregate `a5bb90a62af050b2cc7bcf1beecac072b3927b45d91178e65564935d7420c156`; prior revisions preserved as history | HIGH persistence/lifecycle/data risk; fresh full independent persistence review GREEN for rev 2; Revision-3 Controller closure approved | Insert-only initial state; authoritative existence/ownership/expected-state transitions; concurrent/stale conflict; receipt atomicity; `37/37` local-D1 persistence evidence; [Delivery Record](delivery/ENG-003-d1-authority-foundation.md) |
| `ENG-004` | Deliver Project, Action, accepted progress/context, lifecycle, target, and resumption mutation behavior. Depends on `ENG-002` and repaired `ENG-003 DONE`. | `DONE` — final aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` path-scoped manifested; F001/F002/F003/F003-R1 CLOSED | HIGH lifecycle/human-control/persistence-authority risk; deterministic PASS and full review GREEN complete | Existing matrix plus fabricated-snapshot, missing-entity, expected-state/concurrency, ownership, receipt, and real-D1 regressions; [Delivery Record](delivery/ENG-004-project-action-context-slice.md) |
| `ENG-005` | Deliver intentional Knowledge capture, origin provenance, correction, supersession chains, and current standing. Depends on `ENG-002`, accepted repaired `ENG-003`. | `DONE` — final aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` path-scoped manifested; all findings CLOSED | HIGH data-semantic risk; fresh independent semantic/data review GREEN | Origin immutability, atomic correction, chain/currentness, unrelated-item isolation, no casual capture, malformed/missing exact-target no-write, authentication-material exclusion, failure/duplicate tests; [Delivery Record](delivery/ENG-005-knowledge-provenance-slice.md) |
| `ENG-006` | Deliver simplest-sufficient direct-SQL retrieval and accepted-context resumption with provenance, currentness, bounded cross-Project reuse, and uncertainty. Depends on `ENG-003`, `ENG-004`, `ENG-005`. | `DONE / ACCEPTED` — Repair Rev1 accepted on commit `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda`; R001–R003 closed, R004 closed upstream through ENG-003, R005 deferred to ENG-010; no active Builder | MODERATE-HIGH retrieval/architecture risk; deterministic verification PASS and independent semantic review GREEN complete | Query fixtures; superseded exclusion; qualified historical result; origin preservation; accepted-context retrieval; no vector/search/cache dependency scan; [Delivery Record](delivery/ENG-006-direct-sql-retrieval.md) |
| `ENG-007` | Deliver authoritative export and clear-scope, separately confirmed deletion with visible partial-failure/retry behavior. Depends on `ENG-003` through `ENG-006` as applicable. | `DONE / ACCEPTED` — Repair 6 accepted on commit `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195`; SR-R001, SR-R002-R1, SR-R002-R2, SR-R003 CLOSED; Controller closure approved; Builder NONE | HIGH destructive/data-control risk; fresh independent review complete (GREEN) | Export-authority equality; no delete before confirmation; injected failure no-change/no-false-success; post-delete retrieval; duplicate/retry and provenance-chain tests; [Delivery Record](delivery/ENG-007-export-confirmed-deletion.md) |
| `ENG-008` | Define the Liam-owned provider-neutral Model Capability Port and deterministic model double with bounded context, uncertainty, proposal, and normalized failure outcomes. Depends on `ENG-002`. | `DONE` — exact candidate manifest `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696`; verification PASS; review GREEN | HIGH architecture/data-boundary risk; independent boundary/security review complete | Port contract tests; context-minimization and secret-exclusion fixtures; proposal-no-write checks; provider-free import/API scan; [Delivery Record](delivery/ENG-008-model-capability-port.md) |
| `ENG-009` | Implement the adapter-local Workers AI integration for the replaceable canonical candidate through an exact offline adapter contract, without live qualification. Depends on `ENG-001`, `ENG-008`. | `DONE / ACCEPTED / CANONICALIZED` — candidate `b8c5b15173efcee723a4cd543e92ec47e542d688` merged at `07fa67ccdb44972c18b858ab50f78f93ac6f9ca6` ([Delivery Record](delivery/ENG-009-workers-ai-adapter.md)); 43/43 tests PASS; Builder NONE | HIGH provider/data/untrusted-output risk; single-read TOCTOU defense, exact static messages, structured function calling | Exact mocked binding contract and schema; single-read/TOCTOU evidence; failure matrix; task-local adapter suite; complete current regression matrix; adapter-local type/import/credential/diagnostic scans; [Delivery Record](delivery/ENG-009-workers-ai-adapter.md) |
| `ENG-010` | Integrate one bilingual text flow with advisory/state-changing separation, ambiguity clarification, recommendations, mixed outcomes, correction, and deletion confirmation. Depends on `ENG-004` through `ENG-009` as applicable. | `REPAIR 3 DISPATCHED / NOT YET IMPLEMENTED` — Repair 2 deterministic PASS / semantic FINDINGS; two accepted blocking findings; Repair 2 frozen and unaccepted; Task Packet Revision 1 remains operative; Repair 3 objectives `R3-O1` and `R3-O2`; unchanged 11-path lock; Builder `ENG-010 REPAIR 3 BUILDER` on `eng-010-builder-repair-3` (`/private/tmp/prj226-eng010-builder-repair-3`); [Semantic Finding Disposition](analysis/ENG-010_R2_SEMANTIC_FINDING_DISPOSITION_2026-08-26.md) | HIGH product, architecture, security/data, and Human Control risk; fresh deterministic verification then fresh independent semantic review required | Original evidence matrix plus `R2-TC-01` through `R2-TC-18` and `R3-TC-01` through `R3-TC-09`; local D1; full regressions; exact ancestry and migration checks |
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
| `ENG-007` | `DONE / ACCEPTED` | [ENG-007 Export and Confirmed Deletion Delivery Record](delivery/ENG-007-export-confirmed-deletion.md) |
| `ENG-008` | `DONE` | [ENG-008 Model Capability Port and Deterministic Double Delivery Record](delivery/ENG-008-model-capability-port.md) |
| `ENG-009` | `DONE / ACCEPTED / CANONICALIZED` | [ENG-009 Workers AI Adapter Delivery Record](delivery/ENG-009-workers-ai-adapter.md) |
| `ENG-010` | `REPAIR 3 DISPATCHED / NOT YET IMPLEMENTED` | [ENG-010 Text Interaction and Human-Control Orchestration Delivery Record](delivery/ENG-010-text-interaction-human-control-orchestration.md) |

## Task Packet index and first execution wave

| Task Packet | Revision | Current state | Dispatch condition |
| --- | --- | --- | --- |
| [`ENG-001 — Runtime and Tooling Foundation`](tasks/ENG-001-runtime-foundation.md) | 1 | `DONE` | Verification PASS, independent review GREEN, and durable Delivery Record are complete. |
| [`ENG-002 — Domain and Application Kernel`](tasks/ENG-002-domain-application-kernel.md) | 1 | `DONE` | Exact candidate recorded; verification PASS; independent review GREEN; durable Delivery Record complete. |
| [`ENG-003 — D1 Authority Foundation`](tasks/ENG-003-d1-authority-foundation.md) | 3 | `DONE / ACCEPTED` | Revision 3 accepted; its execution authority is consumed and non-operative. |
| [`ENG-004 — Project/Action/context slice`](tasks/ENG-004-project-action-context-slice.md) | 2 | `DONE` | Accepted F003-R1 candidate is path-scoped manifested exactly; deterministic evidence, full review GREEN, and Controller closure are durable. |
| [`ENG-005 — Knowledge/provenance slice`](tasks/ENG-005-knowledge-provenance-slice.md) | 2 | `DONE` | Manifested on aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`; deterministic verification PASS; independent review GREEN; Delivery Record complete. |
| [`ENG-006 — Direct-SQL Retrieval and Accepted-Context Resumption`](tasks/ENG-006-direct-sql-retrieval.md) | 1 / Repair Rev1 | `DONE / ACCEPTED` | Repair Rev1 accepted; deterministic verification PASS, semantic review GREEN, Controller Final Closure APPROVE, and durable Delivery Record complete. Execution authority is consumed and non-operative. |
| [`ENG-007 — Export and Confirmed Deletion`](tasks/ENG-007-export-confirmed-deletion.md) | 3 / Repair 6 | `DONE / ACCEPTED` | Repair 6 accepted; deterministic verification PASS, semantic review GREEN, Controller Final Closure APPROVE, and durable Delivery Record complete. Execution authority is consumed and non-operative. |
| [`ENG-008 — Model Capability Port and Deterministic Double`](tasks/ENG-008-model-capability-port.md) | 1 | `DONE` | Exact final candidate recorded; deterministic verification PASS; independent boundary/security review GREEN; durable Delivery Record complete. |
| [`ENG-009 — Workers AI Adapter`](tasks/ENG-009-workers-ai-adapter.md) | 2 | `DONE / ACCEPTED / CANONICALIZED` | Candidate `b8c5b15173efcee723a4cd543e92ec47e542d688` merged at `07fa67ccdb44972c18b858ab50f78f93ac6f9ca6` ([Delivery Record](delivery/ENG-009-workers-ai-adapter.md)); 43/43 tests PASS; Builder NONE; execution authority consumed. |
| [`ENG-010 — Text Interaction and Human-Control Orchestration`](tasks/ENG-010-text-interaction-human-control-orchestration.md) | 1 | `REPAIR 3 DISPATCHED / NOT YET IMPLEMENTED` | Revision 1 remains operative. Repair 2 `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` deterministic PASS / semantic FINDINGS / frozen and unaccepted; `ENG-010-R2-SR-R001` and `R002` accepted and blocking; Repair 3 authorized under unchanged 11-path lock on `eng-010-builder-repair-3` (`/private/tmp/prj226-eng010-builder-repair-3`); [Semantic Finding Disposition](analysis/ENG-010_R2_SEMANTIC_FINDING_DISPOSITION_2026-08-26.md). |

The first execution wave is deliberately serial:

1. `ENG-001` was dispatched as the sole first-wave task. It established the toolchain, one-deployable seam, stable verification commands, and source/test conventions while owning the root configuration and runtime-entry paths.
2. Its verification and independent review were bound to the exact candidate, the historical manifest-ordering mismatch was resolved as provenance recovery, and its Delivery Record was closed before `DONE`.
3. `ENG-002` established the semantic contract fork point used by persistence and model work; its exact candidate passed deterministic verification and independent semantic review, and its Delivery Record is closed.
4. `ENG-008` subsequently completed with exact-candidate deterministic PASS and independent boundary/security review GREEN. Its completion satisfied `ENG-009`'s implementation predecessors. `ENG-009` completed implementation candidate `b8c5b15173efcee723a4cd543e92ec47e542d688`, which was merged into `foundation/product-foundation` at commit `07fa67ccdb44972c18b858ab50f78f93ac6f9ca6` with 43/43 adapter tests passing. ENG-009 is `DONE / ACCEPTED / CANONICALIZED`.
5. `ENG-003` completed revision 1 on exact candidate manifest `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` after final deterministic PASS, targeted review GREEN, and closure of `ENG-003-F001` and `ENG-003-F001-R1`. That candidate and history remain exact historical accepted evidence.
6. ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` later passed deterministic verification, closing `ENG-004-F001` and `ENG-004-F002`, but independent review raised blocking `ENG-004-F003`: lifecycle methods trusted caller snapshots and used persistence put/upsert rather than authoritative existing-state transitions.
7. F003 was resolved in ENG-003 revision 2 (aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`). ENG-004 was then manifested on aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` (F001–F003-R1 closed). ENG-005 completed on accepted aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` (findings closed).
8. The initial `ENG-006` candidate (`7b7db0d98660f6562f8e9738445be725fc65988c`) failed semantic review. Finding `ENG-006-R004` identified an upstream D1 collection-read capability gap. `ENG-003` Revision 3 accepted the targeted two-file capability repair. `ENG-006-R004` closed at upstream ENG-003 level; the failed candidate remains frozen and unaccepted.
9. Fresh `ENG-006` Repair Rev1 candidate `a94d2cd2714849e7be59fd464f85330f98d127b4` then passed independent deterministic verification and independent semantic review. Controller Final Closure approved that exact candidate; `ENG-006-R001` through `ENG-006-R003` are closed, `ENG-006-R004` remains closed upstream, `ENG-006-R005` remains deferred to `ENG-010`, and `ENG-006` is `DONE / ACCEPTED` with no active Builder authority.
10. `ENG-007` Repair 6 candidate `e6b5f271d308fbac7e48667943005758efaf6d8b` passed deterministic verification and independent semantic review. `ENG-007` is `DONE / ACCEPTED`.
11. `ENG-010` passed Formal Definition of Ready Revision 1 (`PASS`). Candidate 1 and Repair 1 remain frozen, unaccepted historical provenance. Repair 2 candidate `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` passed deterministic verification but received semantic FINDINGS; both Repair 2 findings are accepted and blocking, so Repair 2 is frozen and unaccepted. Repair 3 is authorized under unchanged Task Packet Revision 1 and exact 11-path lock on `eng-010-builder-repair-3` (`/private/tmp/prj226-eng010-builder-repair-3`). Current Builder is `ENG-010 REPAIR 3 BUILDER`; implementation is `NOT YET STARTED`.

The initial `ENG-001` and `ENG-002` wave was deliberately serial while implementation and test conventions were established. `ENG-004`, `ENG-005`, `ENG-006`, `ENG-007`, `ENG-008`, and `ENG-009` are complete. `ENG-010` Repair 2 passed deterministic verification but failed semantic review; Repair 3 is `AUTHORIZED / DURABLY DISPATCHED` after two accepted blocking findings. Builder authority remains bounded to the exact 11-path lock.

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

Both tasks consume `src/domain/**`, `src/application/contracts/**`, the accepted ENG-003 persistence repair, `migrations/0001_authoritative_state.sql`, existing regression tests/helpers, root configuration, dependency files, and `src/index.ts` as read-only accepted upstream state. Their source locks remain disjoint; `ENG-004`, `ENG-005`, `ENG-006`, and `ENG-007` are complete; `ENG-003` revision 3, `ENG-006` Repair Rev1, and `ENG-007` Repair 6 are `ACCEPTED`. Current Builder is `NONE`; no `ENG-009` or later Builder dispatch is authorized without its own approved Ready Task Packet and Controller dispatch.

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

`ENG-007 REPAIR 6: ACCEPTED`

`ENG-007: DONE (HISTORICAL FAILED CANDIDATES 1–6 REMAIN FROZEN / UNACCEPTED)`

## Concurrency and writer isolation

- Every writing task receives one active Builder and exclusive ownership of the exact paths in its Task Packet.
- ENG-003 revision-1 persistence work and ENG-008 model-port work were concurrency-safe after ENG-002 because their adapter, port, and test paths were disjoint; both reached `DONE` before the later ENG-003 reopening.
- ENG-003 revision-2 persistence writing, ENG-004 closure, and ENG-005 closure are complete. ENG-005 completed on accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`, tree `833a11f345dedd240c892d473dd99e701d34cf3e`, aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`, with fresh deterministic PASS and independent review GREEN closing findings `F001` through `IR-F005`. Ambiguous-target clarification remains an upstream `ENG-010` responsibility.
- `ENG-006` Repair Rev1 is accepted and `ENG-006` is `DONE`; no ENG-006 Builder authority remains active.
- `ENG-007` Repair 6 candidate `e6b5f271d308fbac7e48667943005758efaf6d8b` is accepted and `ENG-007` is `DONE`; no ENG-007 Builder authority remains active; historical failed candidates 1 through 6 remain `FROZEN / UNACCEPTED / HISTORICAL ONLY`. `ENG-007-SR-R001`, `ENG-007-SR-R002-R1`, `ENG-007-SR-R002-R2`, and `ENG-007-SR-R003` are `CLOSED`; Builder is `NONE`; execution authority is `CONSUMED / NON-OPERATIVE`; Human Reserved is `NOT REQUIRED`.
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
- **Current task state:** no task is `RUNNING`; `ENG-001` through `ENG-009` are `DONE`. `ENG-010` is `REPAIR 3 DISPATCHED / NOT YET IMPLEMENTED`; Repair 2 deterministic verification is `PASS`, semantic review is `FINDINGS`, and candidate `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` is frozen and unaccepted after two accepted blocking findings. Current Builder is `ENG-010 REPAIR 3 BUILDER`; implementation authority is `ACTIVE / BOUNDED TO EXACT 11-PATH LOCK`; branch `eng-010-builder-repair-3`; worktree `/private/tmp/prj226-eng010-builder-repair-3`; Human Reserved remains `NOT REQUIRED` ([Semantic Finding Disposition](analysis/ENG-010_R2_SEMANTIC_FINDING_DISPOSITION_2026-08-26.md)). Later tasks retain their declared dependencies.
- **Manifestation recovery:** The Controller recovered the already accepted thirteen-file ENG-003 candidate into the intended dispatch base, reproduced its component and aggregate hashes, and reran the contracted integrated verification. This was ordinary delivery recovery and path/integration control; it changed no Product or Runtime Architecture authority and required no Human Reserved decision.
- **Intentionally absent semantics:** Project abandonment or Action withdrawal, extra planning hierarchy, non-project knowledge, knowledge taxonomy/promotion, permanent recommendation precedence, and deletion undo remain unmodeled and must not be invented.
- **Current external condition:** `ENG-013` later requires free non-production Workers AI access plus current data-use, retention, caching/storage, hosted-state, training/improvement, and license/terms evidence. This does not block `ENG-001` through deterministic acceptance.
- **Delivery boundary confirmation:** The initial planning session created only planning/governance artifacts. The later `ENG-001` candidate is limited to its approved runtime-foundation scope and has no schema, migration, provider call, remote resource, credential, deployment, paid-service, or control-plane implementation. This state update starts no Builder work.

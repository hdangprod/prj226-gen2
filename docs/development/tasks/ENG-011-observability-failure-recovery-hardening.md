# ENG-011 — Observability and Failure/Recovery Hardening

**Artifact class:** OPERATIONAL / TASK PACKET

**Lifecycle status:** ACTIVE

**Task Packet revision:** 2

**Controller planning revision:** 2

**Current task state:** `READY FOR CONTROLLER DISPATCH / REPAIR 3 NOT YET DISPATCHED`

**Formal DoR:** [Revision 2](../analysis/ENG-011_FORMAL_DoR_REV2_2026-08-28.md) `PASS`; revision 1 `PASS` remains historical for the superseded twelve-path execution scope

**READY:** `YES — PENDING CONTROLLER DISPATCH ONLY`

**Current Builder:** `NONE`

**Builder authority:** `NONE / REPAIR 3 NOT YET DISPATCHED`

**Implementation:** `REPAIR-2 CANDIDATE FROZEN / REPAIR 3 NOT STARTED`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

**Next required role:** `ENG-011 CONTROLLER — REPAIR 3 BUILDER DISPATCH`

**Builder branch:** `NONE`

**Builder worktree:** `NONE`

**Durable dispatch:** `NONE`; prior execution authorities are consumed or revoked and Repair 3 is not dispatched

**Formal DoR evidence:** [ENG-011 Formal Definition of Ready — Revision 2](../analysis/ENG-011_FORMAL_DoR_REV2_2026-08-28.md)

**Repair-2 finding disposition:** [Controller S/O/S Finding Disposition](../analysis/ENG-011_REPAIR2_SOR_FINDING_DISPOSITION_2026-08-28.md)

**Authorization:** `GOV-018`

**Planning authority base commit:** `3c19fe5b949c1a2aafd73e514543480781cb861a`

**Planning authority base tree:** `f34715ee545fc1210caa54ed2f6681c067e2013a`

**Governing contract:** [Delivery Contract revision 1](../../../development/DELIVERY_CONTRACT.md)

## Revision-2 repair scope and readiness boundary

Repair-2 candidate `49990f306ee67b62ae017f0d63fa556bde06d23a`, tree `b08c1f9d8ffa579a6cda3ed695293658a3697a81`, passed deterministic verification but received nine accepted blocking security/operability/semantic findings, `ENG-011-R2-SOR-R001` through `R009`. It is frozen, unaccepted, historical evidence only, and non-canonical.

Revision 2 makes the smallest planning change needed for a future Repair 3: it binds those nine repair obligations and expands the proposed write lock from twelve to nineteen exact paths because the accepted Project/Action/context/progress and Knowledge services currently erase persistence `committed` versus `already-committed` before the result reaches interaction orchestration. No truthful orchestrator-only reconstruction exists. The persistence port and D1 adapter already retain the distinction and remain protected.

This revision changed execution scope and invalidated revision-1 DoR as future-repair authority. Formal DoR revision 2 independently verified the revised scope, tests, isolation, and provenance and returned `PASS`. This packet is operative and Ready, but does not dispatch a Builder.

The revision changes no Product, Domain, Human Control, Runtime Architecture, provider, deployment, recovery, retry, or persistence-schema semantics. Human Reserved remains `NOT REQUIRED`; migration remains `NO MIGRATION`.

## Historical Builder dispatch

The Controller previously authorized one Standard Delivery Builder execution restart (`ENG-011 BUILDER RESTART 1`) from the governance commit containing this section. The original Builder on branch `eng-011-builder` in worktree `/private/tmp/prj226-eng011-builder` aborted prior to implementation due to pre-start worktree contamination (`ENG-011-BSE-R001 CLOSED BY EXECUTION RESTART`; candidate `NONE`; uncommitted worktree preserved unchanged as forensic evidence). Restart 1, Repair 1, and Repair 2 are now historical, consumed, or revoked execution authorities and cannot authorize further writing.

Revision-1 execution consumed Formal DoR revision 1 `PASS`; findings `ENG-011-DOR-R001` through `R006` remain historically closed for that scope. Recovery remains classification and evidence only. Retry remains an explicit caller/user action; automatic authoritative mutation retry, rollback, compensation, fallback, queues, and recovery orchestration are prohibited. DATA-001 prohibits user content, Knowledge content, model output, raw errors, stacks, SQL, headers, credentials, and provider-private data in operational evidence. The implementation remains provider-neutral and Cloudflare-native inside the existing deployable; no Sentry, OpenTelemetry, external telemetry service, new service, Worker, queue, schema, persistence, SLO, deployment, or paid/production action is authorized.

Migration remains `NO MIGRATION`; `migrations/0001_authoritative_state.sql` is locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. Worktree provisioning and a clean startup audit do not start implementation.

## Task ID and objective

`ENG-011`

Complete the smallest data-minimized, Cloudflare-native operational-evidence seam that correlates the accepted interaction path and truthfully distinguishes request, interpretation/proposal, authorization, retrieval, authoritative persistence, derived-state, provider, and user-visible outcomes where applicable.

Harden failure and recovery evidence without changing any accepted product outcome: classify existing normalized failures, distinguish attempts from outcomes, expose existing retry eligibility, and prove that observations cannot create accepted-state success, authorize mutation, alter retryability, or change a user-visible result.

This is a bounded combination of correlated observability, failure classification, diagnostic evidence, and recovery/retry safety. It does not own new product recovery behavior, automatic retry orchestration, rollback, compensation, persistent recovery state, or provider fallback.

## Canonical problem

Accepted upstream slices already return truthful normalized outcomes, but the runtime has no common data-minimized evidence contract that correlates those outcomes across the interaction path. Operators therefore cannot consistently distinguish a provider success from persistence success, a retry attempt from recovery success, a mixed result from total success, or a failed/indeterminate deletion from an accepted deletion without inspecting content or component-specific results.

ENG-011 solves that diagnosability gap. Observability must describe reality and remain subordinate to product state.

## Normative authority

- `GOV-018`, `ARC-001`, and `ARC-003` through `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation revision 1](../../../product/PRODUCT_FOUNDATION.md), especially `PF-CTL-001`, `PF-DATA-001`, and `PF-QLT-001`.
- [Product Intent revision 1](../../../product/PRODUCT_REQUIREMENTS.md), especially the approved reliability, failure-visibility, recovery, data-control, and testability constraints.
- [Domain Model revision 1](../../../product/DOMAIN_MODEL.md), especially failed acceptance, Human Control, and invariants 9, 10, 14, and 16.
- [Scenario Corpus revision 1](../../../product/SCENARIOS.md), especially `INV-004`, `INV-008`, `INV-011`, `SCN-004`, `SCN-010`, and `SCN-011`.
- [Runtime Architecture revision 1](../../architecture/RUNTIME_ARCHITECTURE.md), especially invariants 1–8 and the Verification and Observability Architecture.
- [Delivery Contract revision 1](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan revision 1](../ENGINEERING_PLAN.md).

These sources authorize Cloudflare-native structured, data-minimized logs and traces, correlated identifiers, status, transition category, timing, error classification, and retry/recovery safety. They do not authorize a telemetry vendor, SLO, persistence schema, queue, new deployable, or automatic mutation retry.

## Dependency contract

| Dependency | Accepted authority / identity | Contract consumed by ENG-011 | May ENG-011 modify it? | Regression obligation |
| --- | --- | --- | --- | --- |
| `ENG-003` | Revision 3 accepted: commit `5276481824e43d23345799c39efaa72e51235877`, tree `0ea10d0400a5439af60c72ce943b7504e4173674`, aggregate `a5bb90a62af050b2cc7bcf1beecac072b3927b45d91178e65564935d7420c156` | `committed`, `already-committed`, constraint conflict, operation-ID conflict, and durability failure with retryability | No; persistence port, D1 adapter, schema, and receipts are read-only | Preserve atomicity, idempotency, expected-state authority, and false-success defenses |
| `ENG-004` | DONE: aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` | Project, Action, context, and progress accepted/failed outcomes | Revision 2 permits only propagation of existing persistence commit disposition through the exact service/result paths in the revised lock; all lifecycle and mutation semantics remain read-only | Preserve lifecycle, ownership, concurrency, accepted-state truthfulness, and fresh-versus-duplicate disposition |
| `ENG-005` | DONE: commit `81b023deb2b1a61630a2c8cb3aaee22050182bb8`, tree `833a11f345dedd240c892d473dd99e701d34cf3e`, aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` | Intentional Knowledge capture/correction outcomes and authentication-material exclusion | Revision 2 permits only propagation of existing persistence commit disposition through the exact service/result paths in the revised lock; Knowledge semantics and guards otherwise remain read-only | Preserve origin, supersession, currentness, capture-time DATA-001 defense, and fresh-versus-duplicate disposition |
| `ENG-006` | Repair Rev1 accepted: commit `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda` | `found`, `not-found`, and normalized `retrieval-failed` outcomes | No; direct-SQL retrieval contract is read-only | Preserve currentness, provenance, parent-existence handling, and no vector/search/cache scope |
| `ENG-007` | Repair 6 accepted: commit `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195` | Export failures; confirmed deletion success, rejection, not-found, failure, duplicate, and indeterminate outcomes | No; deletion/export semantics, D1 implementation, and Human Reserved decisions are read-only | Preserve separate confirmation, exact scope, no false deletion success, and post-delete truthfulness |
| `ENG-008` | DONE: accepted manifest `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696` | Provider-neutral result/failure categories and bounded optional diagnostics | No; Model Capability Port is read-only | Preserve bounded context, provider neutrality, no-write proposals, and authentication-material exclusion |
| `ENG-009` | DONE / ACCEPTED / CANONICALIZED: implementation `b8c5b15173efcee723a4cd543e92ec47e542d688`, integration `07fa67ccdb44972c18b858ab50f78f93ac6f9ca6` | Adapter-normalized provider failure and retryability; provider representations remain private | No; adapter and provider-local types are read-only | Preserve single-read/TOCTOU defense, static safe failures, offline boundary, and no provider leakage |
| `ENG-010` | DONE / ACCEPTED / CANONICALIZED / POST-INTEGRATION VERIFIED / GOVERNANCE-CLOSED: commit `1650008aa01f152f6aff4bacd9c6d19ab4531545`, tree `1ee87d345ee9ceed3bc301dbc9f42b3034655758`, aggregate `1430879aba612de7787351a81bdc23c54e0215e848bb654bb65d0d005f0e678f` | One orchestration boundary and truthful advisory, proposed, clarification, prohibited, unresolved, accepted, failed, and mixed outcomes | Only the three exact interaction files in the write lock may change, solely to attach observations; all semantics remain immutable | Preserve bilingual flow, Human Control, context bounds, mixed outcomes, deletion confirmation, and final-result truthfulness |

All dependencies are `DONE`; their execution authority is consumed and non-operative.

## In scope

1. A Liam-owned, provider-neutral operational-evidence contract with closed event and failure categories.
2. Validated correlation and request identifiers, plus an optional safe operation identifier when present and safe to expose.
3. Correlated observations at the accepted orchestration boundary for applicable request, interpretation/proposal, authorization, retrieval, persistence/application result, provider, and user-visible stages.
4. A Cloudflare-native structured-log emitter behind the application-owned evidence contract.
5. Data minimization by construction: a closed schema with no arbitrary content/message/error/metadata field.
6. Fail-open diagnostics: evidence-sink failure cannot alter, reject, duplicate, authorize, or falsely succeed the product operation.
7. Classification of existing upstream outcomes and retry eligibility without modifying them.
8. Deterministic failure-injection, correlation, truthfulness, redaction, and regression evidence.
9. Narrow propagation of the already-existing persistence `committed` versus `already-committed` disposition through accepted Project/Action/context/progress and Knowledge service results solely so evidence can distinguish fresh acceptance from duplicate replay.

`derived-state` remains a valid closed stage with `not-applicable` for the current direct-SQL design. ENG-011 must not invent a derived write or emit a false derived success merely to populate the stage.

## Explicitly out of scope

- Any product or domain semantic change, new user-visible failure wording, new recovery promise, or guaranteed undo.
- Automatic retry, backoff, replay scheduler, retry loop, provider fallback/routing, compensation, rollback, or resume workflow.
- Mutation retry with a new operation ID; duplicate mutation; automatic retry of deletion or any authoritative write.
- Persistent recovery state, telemetry tables, diagnostic snapshots, D1 schema changes, or migrations.
- Queue, cron, background worker, Durable Object, cache, analytics pipeline, additional Worker/service/deployable, or control plane.
- Sentry, OpenTelemetry, an external telemetry/SaaS vendor, external analytics backend, or distributed-tracing architecture.
- New Cloudflare resource provisioning, production Workers Analytics configuration, production log retention/export policy, production deployment, paid usage, or credentials.
- SLOs, latency/availability/retention/volume targets, alerting policy, dashboards, health endpoints, readiness/liveness API, or generalized DLP.
- Raw provider IDs/codes/objects, HTTP headers, stack traces, SQL, D1 bindings, prompts, model outputs, conversation text, Knowledge content, export documents, deletion lineage members, or arbitrary exception messages in evidence.
- Live Workers AI qualification, current provider-policy acceptance, or model sufficiency claims; those remain `ENG-013`.

## Failure taxonomy and mapping

The evidence contract uses the smallest closed taxonomy needed to preserve existing distinctions. It does not replace any upstream result union.

| Class | Closed observation categories | Meaning / boundary |
| --- | --- | --- |
| Domain/application outcome | `validation`, `authorization-denied`, `prohibited-input`, `clarification-required`, `unresolved`, `not-found`, `constraint-conflict`, `operation-id-conflict`, `mixed-outcome` | Expected bounded outcomes. They are not infrastructure exceptions and cannot be generalized into accepted success. |
| Persistence/retrieval/export/deletion failure | `persistence-durability`, `persistence-indeterminate`, `retrieval-failed`, `export-read-failed`, `deletion-write-failed` | Normalized infrastructure-affecting outcomes. Raw database detail is excluded. |
| Provider outcome | `provider-unavailable`, `provider-timeout`, `provider-rate-limited`, `provider-refused`, `provider-malformed-result`, `provider-invalid-request`, `provider-unknown` | Exact mapping from accepted `ModelFailureCategory`; provider-private fields remain hidden. |
| Diagnostic-only fallback | `unclassified-failure` | Used only when an existing bounded failed result has no more precise approved mapping. It carries no raw reason and triggers semantic review if used unexpectedly. |

`advisory`, `proposed`, `accepted`, `duplicate`, `partial`, `denied`, `failed`, `indeterminate`, `clarification-required`, `unresolved`, and `not-applicable` are observation statuses, not new product outcomes.

## Operational evidence contract

The Builder must implement a closed immutable event shape with these fields only:

| Field | Contract |
| --- | --- |
| `schemaVersion` | Literal `1`. |
| `correlationId` | Required validated opaque identifier; never derived from user text. Safe syntax is ASCII `^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$` and values matching the existing authentication-material patterns are rejected. |
| `requestId` | Required validated opaque identifier under the same syntax for one interaction attempt; distinct interactions use distinct request IDs. |
| `operationId` | Optional only when an existing operation ID passes the same safe opaque-ID validation; unsafe values are omitted, never logged raw. |
| `stage` | Closed union: `request`, `interpretation`, `authorization`, `retrieval`, `persistence`, `derived-state`, `provider`, `user-visible`. |
| `operationCategory` | Closed union: `interaction`, `advisory`, `proposal`, `project-mutation`, `action-mutation`, `context-mutation`, `progress-mutation`, `knowledge-mutation`, `retrieval`, `export`, `deletion`, `mixed-request`. |
| `status` | Closed union: `attempted`, `succeeded`, `advisory`, `proposed`, `accepted`, `duplicate`, `partial`, `denied`, `failed`, `indeterminate`, `clarification-required`, `unresolved`, `not-applicable`; it must be truthful for the observed stage. |
| `failureCategory` | Optional closed taxonomy value, present only for applicable non-success outcomes. |
| `retryDisposition` | `not-applicable`, `explicit-retry-eligible`, `non-retryable`, or `indeterminate-manual-check`. |
| `entityType` | Optional closed union: `project`, `action`, `accepted-context`, `accepted-progress`, `knowledge-item`, `knowledge-lineage`; no entity identifier or content is emitted. |
| `durationMilliseconds` | Optional finite non-negative duration. No SLO follows from it. |
| `inputUnits` / `outputUnits` | Optional finite non-negative provider diagnostics already normalized by ENG-008; never billing/product truth. |

There is no free-form `message`, `reason`, `error`, `metadata`, `payload`, or content field. The contract constructor validates and snapshots inputs, rejects unknown keys, and prevents later caller mutation from changing emitted evidence.

The evidence sink has one responsibility: accept a validated event. The orchestrator must contain sink throws/rejections and preserve the exact product result. Observation failure may itself be reported only through a bounded platform-safe fallback that contains no event content or product data; it cannot recurse.

## Accepted-state truthfulness invariants

1. Provider success is only provider success; it is never authorization, persistence, or accepted-state success.
2. Human Control authorization is only permission to attempt the exact change; it is never persistence success.
3. `committed` or valid `already-committed` may support accepted success; persistence failure may not.
4. A mixed result is `partial`/`mixed-outcome`; one successful portion never becomes total success.
5. A retry attempt is an `attempt`; retry eligibility or scheduling is never recovery success.
6. A duplicate/idempotent outcome remains distinguishable from a newly committed outcome while preserving the upstream accepted result.
7. Deletion `indeterminate` is not deletion success and uses `indeterminate-manual-check`.
8. A log-emission failure does not change accepted state or the user-visible outcome.

## Recovery and retry contract

- ENG-011 observes and classifies recovery possibilities; it performs no recovery orchestration.
- `retryable: true` maps to `explicit-retry-eligible`. It means a caller/user may make a later explicit safe attempt under the existing contract; it is not permission for automatic execution.
- Authoritative mutation replay uses the existing operation ID and accepted idempotency contract. ENG-011 does not mint a replacement ID for a retry.
- Validation, authorization denial, prohibited input, ambiguity, refusal, invalid request, not-found, constraint conflict, and operation-ID conflict are `non-retryable` for a materially identical request. A changed request, clarified target, or fresh valid authorization is a new governed action, not a blind retry.
- Provider timeout, rate limit, or unavailability may remain explicitly retry-eligible exactly as normalized by ENG-009, but no adapter or orchestration retry/fallback is added.
- Deletion indeterminate requires later explicit reconciliation/manual-check behavior under the accepted ENG-007 contract. ENG-011 does not re-execute deletion automatically.
- No persistent recovery record or new recovery hook is authorized. Existing service/result boundaries remain the recovery hooks.

## DATA-001 and security boundary

Operational evidence must never contain:

- user interaction text, normalized-intent summaries, Project outcomes, Action descriptions, progress statements, context facts, Knowledge content/excerpts, export documents, deletion lineage members, model prompts/outputs, or constraints;
- credentials, authentication secrets, access/refresh tokens, private keys, provider bindings, authorization headers, cookies, or environment values;
- raw errors, exception messages, stack traces, SQL, D1 arguments, HTTP bodies/headers, provider IDs/codes, or arbitrary metadata.

Credential-like strings injected into every prohibited input surface must be absent from serialized evidence. ENG-011 centralizes only diagnostic-event validation; it does not replace ENG-005 capture screening or ENG-008/ENG-010 model-context screening and does not create generalized DLP.

## Human Control and provider boundaries

- Evidence is non-authoritative. It cannot create trusted interaction evidence, Human Control classifications, ordinary authorization, confirmed-deletion authorization, mutation-gate tokens, or accepted state.
- Authorization denial, ambiguity, prohibition, and unresolved outcomes remain separately observable without capturing the underlying text.
- Provider outcome observations consume only ENG-008/ENG-009 normalized categories and safe numeric diagnostics.
- Provider-specific response IDs, error codes, tool objects, hosted state, raw messages, and binding types remain adapter-private.
- ENG-011 introduces no provider routing or fallback. Live provider qualification and provider-policy evidence remain `ENG-013`.

## Deployment and persistence boundary

- One existing TypeScript Cloudflare Workers deployable only.
- Cloudflare-native structured logs/traces are the operational target; no external vendor or resource is added.
- `src/index.ts`, `wrangler.toml`, package/dependency files, and production provisioning remain protected.
- Observability is ephemeral/platform-native. It is not accepted memory and not a secondary Knowledge store.
- **NO MIGRATION.** `migrations/0001_authoritative_state.sql` must remain Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## Proposed Repair-3 exact write lock

A future Repair-3 Builder may receive exclusive ownership of exactly these nineteen paths only after revised Formal DoR `PASS`, READY `YES`, and a separate durable Controller dispatch. This section does not itself authorize writing. No wildcard is authorized.

### Production paths

1. `src/application/ports/observability/operationalEvidence.ts` — new closed application-owned event, identifier, validator, and sink contract.
2. `src/application/ports/observability/index.ts` — new observability-port export only.
3. `src/application/services/interaction/interactionTypes.ts` — add the validated observation context required by orchestrated inputs; no product-result change.
4. `src/application/services/interaction/interactionOrchestrator.ts` — emit correlated stage observations while preserving exact accepted behavior.
5. `src/application/services/interaction/index.ts` — export only the accepted observability-aware interaction surface.
6. `src/infrastructure/observability/cloudflareOperationalEvidence.ts` — new Cloudflare-native structured emitter using an injected console-compatible writer; no provider SDK or external network.
7. `src/infrastructure/observability/index.ts` — new infrastructure export only.
8. `src/application/contracts/operations.ts` — add only the closed accepted persistence-disposition contract needed to preserve `committed` versus `already-committed`; no Product outcome-kind change.
9. `src/application/services/projectActionContext/projectActionContextService.ts` — propagate existing persistence commit disposition without changing mutation, lifecycle, authorization, or persistence behavior.
10. `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` — propagate existing persistence commit disposition without changing Knowledge eligibility, origin, supersession, authorization, or persistence behavior.

### Test/config paths

11. `tests/application/ports/observability/operationalEvidence.test.ts`
12. `tests/application/ports/observability/vitest.config.ts`
13. `tests/application/services/interaction/interactionObservability.test.ts`
14. `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
15. `tests/infrastructure/observability/vitest.config.ts`
16. `tests/application/services/projectActionContext/projectActionContextService.test.ts`
17. `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts`
18. `tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts`
19. `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts`

### Protected/read-only paths

Every path not listed above is protected, including `src/domain/**`, every other `src/application/contracts/**` path, model/persistence ports, retrieval/export-deletion services, all D1 and model adapters, `src/index.ts`, every other existing test, package files, root configs, `wrangler.toml`, migrations, and governance files. If implementation proves an additional write is necessary, stop for Controller packet amendment and Formal DoR re-evaluation; do not discover scope by editing.

## Deliverables

| Deliverable | Purpose and exact contract | Read/write effect | Dependencies / prohibitions | Required evidence |
| --- | --- | --- | --- | --- |
| D1. Operational-evidence port | Closed immutable event/sink contract and safe opaque-ID constructors | New application port only; no domain write | May import type-only application/domain identifiers where necessary; no provider/D1/Cloudflare type | `TC-01`–`TC-05` |
| D2. Correlated orchestration observations | Emit applicable stage results for each accepted interaction path and preserve fresh-versus-duplicate commit disposition | Observations only; exact Product outcome kind/value and authoritative writes unchanged | Consume ENG-010 and upstream result unions; the narrow result-contract propagation authorized by revision 2 carries no content or new authority | `TC-06`–`TC-16`; `R3-TC-03`–`R3-TC-12` |
| D3. Cloudflare-native emitter | Write one validated structured object to injected console-compatible writer | Ephemeral operational output only | No network, vendor SDK, external service, persistence, or config | `TC-17`–`TC-19` |
| D4. Security/fail-open hardening | Exclude prohibited material and contain diagnostic failures | No product-semantic side effect | No generalized DLP and no swallowed product failure | `TC-04`, `TC-05`, `TC-18`–`TC-21` |
| D5. Regression and evidence package | Exact candidate, full upstream regression, migration/path scans, independent review | Delivery Record after dispatch only | No implementation in governance commit | Verification and review contracts below |

## Numbered ENG-011 test contract

| Test | Required behavior |
| --- | --- |
| `ENG-011-TC-01` | Valid safe correlation/request/optional operation identifiers construct an immutable observation context; malformed, empty, oversized, content-like, or throwing inputs fail closed without emission. |
| `ENG-011-TC-02` | Event constructor accepts only the closed schema and exact enum values, rejects unknown keys/invalid numbers, and snapshots caller-controlled values against later mutation/TOCTOU. |
| `ENG-011-TC-03` | Correlation ID remains stable across applicable stages; request ID identifies one attempt; a second deletion-confirmation interaction uses a distinct request ID. |
| `ENG-011-TC-04` | Credential/authentication fixtures, private-key material, bearer tokens, user text, Knowledge content, model output, raw errors, stacks, SQL, and headers are absent from serialized evidence. |
| `ENG-011-TC-05` | Unsafe operation/entity identifiers are omitted or rejected and are never emitted raw. |
| `ENG-011-TC-06` | Successful advisory path emits truthful request, interpretation/provider, and user-visible observations and emits no authorization/persistence success. |
| `ENG-011-TC-07` | Model `advisory`, `proposal`, `uncertain`, `unable`, and all seven normalized failure categories map distinctly without provider-private data or accepted-state success. |
| `ENG-011-TC-08` | Validation failure, authentication-material prohibition, ambiguity/clarification, authorization denial, unresolved, and not-found outcomes remain distinct and non-accepted. |
| `ENG-011-TC-09` | Project/Action/context/progress success emits persistence/accepted observation only after the accepted service result; persistence failure emits failed with exact retry disposition. |
| `ENG-011-TC-10` | Knowledge capture/correction success, prohibition, conflict, and persistence failure preserve origin/supersession behavior and emit no content. |
| `ENG-011-TC-11` | Retrieval found/not-found/failure paths remain distinct; retryability is preserved; no query result or Knowledge excerpt is emitted. |
| `ENG-011-TC-12` | Export success/failure and deletion direction/confirmation/rejection/not-found/failure/indeterminate/duplicate outcomes are truthful; deletion confirmation is not weakened. |
| `ENG-011-TC-13` | Model success followed by failed authoritative mutation never emits or returns accepted-state success. |
| `ENG-011-TC-14` | Mixed outcomes emit `partial`/`mixed-outcome`; one accepted portion never becomes total success and failed/prohibited/unresolved portions remain distinct. |
| `ENG-011-TC-15` | Operation-ID conflict is non-retryable; valid duplicate/idempotent replay is distinguishable from a new commit without changing the accepted upstream result. |
| `ENG-011-TC-16` | Retry-eligible failure and later explicit retry emit separate attempts; attempt/scheduling/eligibility never emits recovery success; no automatic invocation occurs. |
| `ENG-011-TC-17` | Cloudflare emitter writes one structured event through an injected console-compatible writer with no external call, SDK, or persistence dependency. |
| `ENG-011-TC-18` | Synchronous throw or asynchronous rejection by the evidence sink is contained and the exact user-visible/product result remains byte-for-byte/deep-equal unchanged. |
| `ENG-011-TC-19` | Numeric duration/input/output diagnostics accept only finite non-negative values and remain operational, non-billing, and non-semantic. |
| `ENG-011-TC-20` | Direct-SQL/no-derived-write path records derived state as absent/not-applicable and never fabricates derived success or staleness. |
| `ENG-011-TC-21` | Static scans prove no prohibited vendor, OpenTelemetry, Sentry, queue, cache, analytics, network, telemetry persistence, secret/content field, or new runtime service enters the write lock. |

Exact user-facing Vietnamese/English wording is not asserted by ENG-011. Existing bilingual semantic regressions must remain green; operational categories are language-neutral.

## Repair-3 test obligations

These obligations bind a future Repair-3 candidate in addition to, not instead of, `ENG-011-TC-01` through `TC-21`:

| Test | Required behavior |
| --- | --- |
| `R3-TC-01` | Only runtime-issued/provenance-valid observation contexts emit evidence; arbitrary structural forgeries fail closed. |
| `R3-TC-02` | Content-like valid-syntax identifiers cannot become evidence; finite credential fixtures remain excluded without generalized DLP. |
| `R3-TC-03` | Evidence operation identity equals the authoritative mutation operation ID; mismatch cannot misattribute an operation. |
| `R3-TC-04` | Deletion direction and confirmation retain correlation but prove distinct request-attempt identities. |
| `R3-TC-05` | Provider attempt/success/failure and safe diagnostics follow the normalized model result without private data. |
| `R3-TC-06` | Retrieval found/not-found/failure are distinct across advisory/proposal and mutation families. |
| `R3-TC-07` | Every upstream terminal result maps to its actual stage; pre-persistence rejection is never persistence failure and retry disposition remains exact. |
| `R3-TC-08` | First-turn deletion direction emits no authorization success; confirmed second-turn authorization is distinct. |
| `R3-TC-09` | Project/Action/context/progress fresh commit versus `already-committed` emit accepted versus duplicate with unchanged Product outcome value. |
| `R3-TC-10` | Knowledge capture/correction fresh commit versus `already-committed` preserve disposition, origin, lineage, and no-content evidence. |
| `R3-TC-11` | Mixed all-success, true-partial, all-failure, and heterogeneous non-success aggregates are truthful while portion outcomes remain unchanged. |
| `R3-TC-12` | Trusted ingress user-visible success follows successful ingress return. |
| `R3-TC-13` | TC-21 scanning is path-complete and robust for prohibited vendor/network/persistence/service/content/architecture tokens. |
| `R3-TC-14` | Original `ENG-011-TC-01` through `TC-21` remain substantive and pass. |
| `R3-TC-15` | No automatic provider/mutation/deletion retry, fallback, compensation, recovery engine, or persistent recovery state exists. |
| `R3-TC-16` | Full toolchain, dynamic Vitest matrix, local D1, migration identity, exact lock, dependency/provider scans, and whitespace pass. |
| `R3-TC-17` | Candidate 1, Repair 1, and Repair 2 are present but not ancestors of Repair 3. |
| `R3-TC-18` | Repair 3 is independently produced from clean canonical governance authority without failed-candidate byte reuse. |

## Regression matrix

| Upstream slice | Protected behavior | Required regression evidence |
| --- | --- | --- |
| `ENG-004` | Project/Action/progress/context lifecycle, ownership, expected-state conflict, idempotency | Existing application and real-D1 Project/Action/context suites; TC-09 |
| `ENG-005` | Intentional Knowledge capture, origin, correction/supersession, DATA-001 capture rejection | Existing Knowledge application/integration suites; TC-04, TC-10 |
| `ENG-006` | Direct-SQL retrieval, currentness/provenance, cross-Project qualification, parent-existence constraint | Existing retrieval application/integration/forbidden-scan suites; TC-11 |
| `ENG-007` | Authoritative export, separate exact-scope confirmed deletion, failure/indeterminate truthfulness | Existing export/deletion application/infrastructure/integration suites; TC-12 |
| `ENG-008` | Bounded provider-neutral model context/results, diagnostics, no-write proposals, secret exclusion | Existing model port/double/security/TOCTOU suites; TC-04, TC-07, TC-19 |
| `ENG-009` | Adapter isolation, single-read protection, static normalized failures, no live calls | Existing Workers AI adapter suite and provider-import scans; TC-07, TC-21 |
| `ENG-010` | Bilingual orchestration, Human Control, ambiguity, mixed outcomes, correction, deletion confirmation, accepted-state truthfulness | Existing interaction unit/integration suites; TC-03, TC-06–TC-16, TC-18 |

## Deterministic verification contract

Verification binds the Task Packet revision, dispatch base, exact candidate commit/tree, lockfile, migration identity, commands, environment assumptions, and outputs. Run in an isolated candidate worktree with no production credentials or live calls.

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run smoke
npm run test:persistence
npm run migrate:local
for config in $(git ls-files '*vitest.config.ts' | sort); do npx vitest run --config "$config"; done
git diff --check <dispatch-base>...<candidate>
git diff --name-only <dispatch-base>...<candidate>
git status --porcelain=v1 --untracked-files=all
git rev-parse <candidate>^{tree}
git hash-object migrations/0001_authoritative_state.sql
shasum -a 256 migrations/0001_authoritative_state.sql
npm ls --all
```

The verifier must:

1. count test executions by summing the reported Vitest test counts across every sorted tracked `*vitest.config.ts`; do not hard-code a future total;
2. prove changed paths are exactly a subset of the revision-2 nineteen-path lock;
3. prove no migration/config/package/lockfile/Worker-entry change;
4. prove migration blob/SHA-256 identity above;
5. scan production imports and dependency output for Sentry, OpenTelemetry, external telemetry/analytics, queues, caches, extra services, and network clients;
6. scan the operational event schema and emitted fixtures for forbidden free-form/content/secret/provider/D1 fields;
7. prove tests do not use live network/provider credentials; and
8. record any unavailable check as unavailable, never PASS.

The governance-only planning commit is not an implementation candidate and requires only documentation/path/integrity verification.

## Independent semantic review contract

After deterministic `PASS`, a reviewer independent of the Builder performs a fresh full security/operability/semantic review of the exact candidate and evidence. Review must answer:

1. Do observations truthfully distinguish provider, authorization, persistence, derived, and user-visible outcomes?
2. Can any event or sink failure create authority, mutation, retry, or false accepted success?
3. Are partial, duplicate, retry-attempt, and indeterminate outcomes represented without semantic inflation?
4. Does the recovery contract preserve explicit user/caller control and prohibit automatic authoritative mutation retry?
5. Is DATA-001 enforced by closed schema and fixtures without creating an unauthorized secondary Knowledge store or generalized DLP?
6. Do provider-specific types/codes/state remain adapter-private and does `ENG-013` retain live qualification?
7. Are Human Control, deletion confirmation, persistence truthfulness, and all accepted upstream behaviors unchanged?
8. Has any vendor, SLO, schema, service, deployment, security policy, or product behavior been silently selected?

Result is `REVIEW GREEN` or structured findings. Any security/authority boundary change, new automatic recovery behavior, schema, vendor, or broader write scope requires fresh Controller readiness evaluation and applicable Human Reserved disposition.

## Assignment and risk

- **Risk:** HIGH — security/data minimization, operability semantics, truthfulness, and broad cross-layer observation.
- **Planner / Controller:** owns authority, readiness, exact lock, finding routing, and candidate state.
- **Builder:** `NONE`. A future Standard Delivery Repair-3 writer may be dispatched only after revised Formal DoR `PASS` and READY `YES`, with exclusive ownership of the nineteen paths above.
- **Deterministic Verifier:** read-only and exact-candidate bound.
- **Independent Reviewer:** independent of Builder; Strong Semantic Reasoning for security, operability, Human Control, provider isolation, and accepted-state truthfulness.
- **Concurrency:** one writer; no overlapping source/test writer. Read-only verification/review only under evidence and independence controls.

## Human Reserved triggers

Human Reserved is `NOT REQUIRED` for this packet because it implements already-approved `ARC-004` and `ARC-006` obligations with Engineering-owned closed TypeScript contracts and Cloudflare-native output inside one deployable.

Stop and request exact human disposition if implementation would choose or require a new product/recovery behavior, domain semantic, architecture boundary, security policy, telemetry vendor, persistent schema, service/deployable, queue/background retry, automatic authoritative mutation retry, rollback/compensation, provider fallback, paid use, production action, credential operation, or scope expansion.

## Definition of Done

ENG-011 becomes `DONE` only when:

1. all five deliverables satisfy the exact contracts above;
2. the candidate changes only the nineteen revision-2 locked paths and contains no unauthorized scope;
3. all `ENG-011-TC-01` through `TC-21`, `R3-TC-01` through `R3-TC-18`, and the full upstream regression matrix pass;
4. toolchain, build, smoke, local D1 migration, failure-injection, static security/provider/architecture scans, migration identity, and whitespace checks pass;
5. evidence is bound durably to the exact candidate and records the dynamic test-execution count;
6. fresh full independent security/operability/semantic review is `GREEN`;
7. all blocking findings and required rechecks are closed;
8. a Delivery Record records execution, evidence, review, candidate identity, and completion;
9. Controller final closure accepts the candidate; and
10. current Builder returns to `NONE` and execution authority is consumed.

Task Packet revision 2 is operative and Ready but dispatches no Builder. A separate durable Controller dispatch remains required before Repair-3 implementation may start.

## Prior planning findings

`ENG-011-DOR-R001` through `ENG-011-DOR-R006` remain closed historical findings for revision 1. Revision 2 binds accepted findings `ENG-011-R2-SOR-R001` through `R009`; [Formal DoR revision 2](../analysis/ENG-011_FORMAL_DoR_REV2_2026-08-28.md) is `PASS`. The findings remain open for Repair-3 implementation and independent recheck; readiness does not close them or dispatch a Builder.

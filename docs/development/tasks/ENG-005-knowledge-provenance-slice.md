# ENG-005 — Knowledge/provenance slice

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 2

**Current task state:** `DONE` — accepted final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`, tree `833a11f345dedd240c892d473dd99e701d34cf3e`, canonical aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` is manifested; all findings are `CLOSED`.

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

> [!NOTE]
> **Operational note:** this packet is closed (`ENG-005: DONE`). All Builder, repair, and reconstruction instructions in this artifact represent historical packet specifications and consumed authority only; no current Builder, repair, reconstruction, or implementation authority remains executable.

This artifact populates the canonical Task Packet for `ENG-005`; it does not redefine the Task Packet schema or dispatch Builder work. Post-dispatch execution, evidence, findings, and completion state belong in the distinct [ENG-005 Delivery Record](../delivery/ENG-005-knowledge-provenance-slice.md).

## Task ID

`ENG-005`

## Objective

Deliver the application vertical slice for intentional accepted Knowledge capture, immutable originating-Project provenance, accepted correction, linear supersession chains, and current-versus-superseded standing. The slice must compose the completed ENG-002 Knowledge and Human Control contracts with the completed ENG-003 authoritative-persistence port so that current standing changes atomically and accepted success is reported only after the exact authorized capture or correction is durably committed.

This task does not implement retrieval or cross-Project relevance selection, deletion/export, recommendation, interaction wording or transport, model/provider behavior, observability hardening, Project/Action/context mutation, or the Worker composition root.

## Normative authority

- `GOV-018`, Engineering Phase authorization, revision 1.
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md) revision 1, especially `PF-KNW-001`, `PF-CTL-001`, `PF-DATA-001`, and `PF-QLT-001`.
- [Domain Model](../../../product/DOMAIN_MODEL.md) revision 1, especially Knowledge capture/standing, correction/supersession, origin/reuse boundaries, Human Control, and invariants 10–12 and 14–15.
- [Scenario Corpus](../../../product/SCENARIOS.md) revision 1, specifically the capture and correction portions of `SCN-005` and `SCN-008`; retrieval and cross-Project reuse behavior in `SCN-005` and `SCN-009` remains downstream on `ENG-006`.
- [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md) revision 1, especially architecture invariants 1–5 and 7, accepted memory, and the state-changing interaction flow.
- `MOD-003`, `MOD-004`, `BEH-004`, `DATA-001`, `QLT-001`, `ARC-001`, `ARC-002`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- Completed [`ENG-002`](../delivery/ENG-002-domain-application-kernel.md) and [`ENG-003`](../delivery/ENG-003-d1-authority-foundation.md) Delivery Records and their Task Packet revision 1 contracts.

## Dependencies and accepted upstream evidence

Canonical implementation predecessors, and no others, are:

1. `ENG-002` — `DONE`; exact accepted sixteen-file manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
2. `ENG-003` — `DONE`; revision-1 aggregate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` remains historical accepted evidence, and accepted revision-2 aggregate is `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`; migration SHA-256 remains `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

The exact ENG-003 revision-1 manifestation above remains historical accepted evidence. ENG-003 revision 2 is accepted and path-scoped manifested after the persistence-owned authoritative lifecycle-transition repair. The historical ENG-005 eight-file candidate, aggregate `60855c6e6220d691ffd46d43a0ec12eb259209a616d2877625517e84e9fe40e3`, is **lost / unmanifested historical work product**: Controller recovery compared every recorded file SHA-256 with all local Git objects (including packed and unreachable blobs) and bounded PRJ226/ENG-005 recovery surfaces, and recovered none of the eight exact bytes. The aggregate can be reproduced from the recorded path-sorted hash listing, but hashes do not reconstruct source.

Historical rebuild authorization: `GOV-018` authorized the bounded application code, tests, D1-backed evidence, and engineering documentation required for the rebuild within the unchanged packet lock without a Human Reserved decision. That authorization was fully consumed by the accepted rebuild lineage ending in candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8` (aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`); no further rebuild or Builder dispatch authority remains.

No Human Reserved decision or external resource is otherwise required.

## Relevant context

- ENG-002 already owns intentional capture, exactly one originating Project, current/superseded standing, linear correction/supersession, origin preservation, correction rejection, Human Control evidence, and distinguishable operation outcomes. This task composes them; it must not redefine them.
- ENG-003 already owns the accepted-state persistence port and D1 enforcement for initial current Knowledge, immutable origin/content/lineage, atomic successor insertion plus predecessor supersession, operation receipts, retry/idempotency, and false-success defenses. This task consumes them read-only.
- Conversation or casual mention is not Knowledge. Capture must be intentionally and explicitly directed, accepted, taxonomy-free, and Project-originated.
- Correction creates a new current Knowledge Item and supersedes the affected current predecessor without rewriting it. Supersession is not deletion.
- Later `ENG-006` owns relevance/currentness-aware retrieval and controlled cross-Project reuse. Later `ENG-007` owns deletion/export. Later `ENG-010` owns conversational orchestration.

## Allowed scope and exclusive write ownership (historical packet lock)

During active Builder execution, the assigned Builder received exclusive write ownership only over the following three roots, which were consumed to produce the accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`:

- `src/application/services/knowledgeProvenance/**` — application services that compose existing ENG-002 Knowledge transitions, Human Control evidence, operation outcomes, and the ENG-003 persistence port;
- `tests/application/services/knowledgeProvenance/**` — task-scoped capture, correction, failure, duplicate/retry, isolation, and no-write tests; and
- `tests/integration/d1/knowledgeProvenance/**` — task-scoped local-D1 fixtures, harness/configuration, and Knowledge integration evidence.

All needed test configuration and fixtures remained inside those task-owned directories. The Builder used only the existing locked toolchain and dependencies. No barrel export or root script was required: task tests were executed through the existing Vitest binary and a task-local configuration. With task completion, this write lock is closed and no active write authority exists.

## Read-only dependencies

- `src/domain/**` and `src/application/contracts/**`.
- `src/application/ports/persistence/**`, `src/infrastructure/d1/**`, and `migrations/0001_authoritative_state.sql`, but only after their accepted ENG-003 identities are reconciled.
- `tests/domain/**`, `tests/application/contracts/**`, `tests/application/ports/persistence/**`, `tests/infrastructure/d1/**`, and `tests/foundation/**` as upstream regression evidence; an existing helper may be imported but not modified.
- `package.json`, `package-lock.json`, `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`, `wrangler.toml`, and `src/index.ts`.
- The authority, Task Packets, Delivery Records, and review artifacts linked above.

## Forbidden scope

- Any path outside the three exclusive-write roots above, including every ENG-004 lock.
- Changes to ENG-002 domain/application contracts or tests; new Knowledge type/taxonomy, promotion stage, origin rule, standing, correction model, Human Control rule, or operation-result category.
- Changes to the persistence port, D1 adapter/types, migration, schema, common D1 tests/helpers, root configuration, dependency files, package scripts, test configuration, barrel/index exports, Worker entrypoint, or composition root.
- Retrieval, relevance ranking, cross-Project reuse selection, Project/Action/context mutation, recommendation, export/deletion, model/provider integration, interaction transport/wording, or observability hardening.
- Casual/inferred capture; silent rewrite; branching/cyclic supersession; origin change; presenting superseded Knowledge as current; treating supersession as deletion; retained `Deleted` state; or false accepted-state success.
- Capturing credentials, authentication secrets, private keys, access tokens, or equivalent authentication material in fixtures or product Knowledge.
- Provider-hosted memory, vector/search/cache/queue infrastructure, another deployable/service, production or paid action, credential/secret operation, or development control-plane implementation.
- Changes to approved governance, Product Foundation, Domain Model, Scenario Corpus, Runtime Architecture, completed Task Packets, or completed Delivery Records.

## Constraints and implementation invariants

1. Application/domain validation and valid ENG-002 Human Control evidence precede every persistence attempt.
2. Only intentional, explicit, taxonomy-free capture is eligible for acceptance. Casual mention, inference, advice, retrieval, and proposal issue no Knowledge write.
3. Every captured Knowledge Item preserves exactly one originating Project. Correction preserves that origin and unrelated items remain byte/semantically unchanged.
4. Initial accepted Knowledge is current with empty lineage. Correction targets exactly one current item, creates one new current successor, atomically marks the predecessor superseded, and preserves a reconstructible linear chain.
5. Correction never silently rewrites the prior item, changes its origin, branches or cycles a lineage, changes unrelated Knowledge, deletes data, or introduces a taxonomy/promotion state.
6. Accepted success is returned only for `committed` or the same-operation/same-write-set `already-committed` result. Failure, missing or malformed exact target, authorization rejection, and conflicting duplicates remain non-accepted and truthful.
7. Operation identities and write sets are stable across a safe retry; reusing an operation identity with a different write set is not accepted.
8. Current/superseded standing and origin are authoritative accepted state. Retrieval, relevance, reuse, model output, and provider state remain non-authoritative and outside this slice.
9. D1/SQL and Worker types remain outside the application service contract. The service depends on the provider-neutral persistence port.
10. Tests and evidence use synthetic data and exclude authentication material and real sensitive user data.
11. A finite service-local eligibility guard rejects repository-defined authentication material on both capture and correction: credentials, authentication secrets, private keys, access tokens, and equivalent material. Its Bearer discriminator must reject canonical `Authorization: Bearer <opaque-token>` and bare `Bearer <opaque-token>` material, including an alphanumeric opaque token without punctuation such as `Bearer tokenonly123`, while allowing ordinary explanatory Bearer prose where otherwise valid. It must use a narrow structural rule, not punctuation as the bare-Bearer criterion, an arbitrary English-word allowlist, generalized secret scanning, or user self-classification.
12. `correct` receives one already-resolved, exact prior Knowledge snapshot; it has no candidate-search, target-selection, context-inference, or clarification-result surface. A missing or malformed exact prior is rejected with no write. The approved ambiguous-state-changing-target invariant remains mandatory at the upstream interaction/application target-resolution boundary before this service is invoked; unresolved ambiguity must not produce an accepted write.

## Expected artifacts

The completed task produced:

- Task-owned Knowledge/provenance application service implementation within the exclusive source root.
- Task-owned deterministic service and local-D1 integration tests/configuration/fixtures within the exclusive test roots.
- A distinct `docs/development/delivery/ENG-005-knowledge-provenance-slice.md` Delivery Record maintaining completion authority.
- The exact candidate identity consisting of per-file SHA-256 values for every changed task-owned file and canonical aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` for accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`.

## Definition of Done

These conditions were satisfied by the accepted final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`:

1. Intentional capture and accepted correction are composed through existing ENG-002 contracts without changing them.
2. Every accepted capture/correction is committed through the ENG-003 port before accepted success; failed, invalid, unauthorized, casual/inferred, conflicting duplicate, and durability-failure paths never report accepted success.
3. Tests prove immutable origin, initial current standing, atomic predecessor/successor correction, reconstructible linear chains, currentness, unrelated-item isolation, and rejection of missing or malformed exact targets, non-current/cyclic/branched/origin-mismatched correction. They do not represent malformed input as proof of ambiguous-target clarification.
4. Failure and retry tests prove stable same-operation retry behavior, visible failure, no duplicate semantic effect, and no false success.
5. Genuine Wrangler-backed local-D1 evidence proves capture and multi-step correction chains against the accepted migration/adapter, including atomic standing changes and constraint rejection. FakeD1 may support deterministic failure/rollback paths but cannot substitute for this evidence.
6. All upstream domain, Human Control, persistence, foundation, typecheck, lint, build, and smoke regressions pass without modifying protected files.
7. Changed paths equal the packet's exclusive locks; dependency, migration, root configuration, shared helper, barrel, Worker entry, and sibling-task paths are unchanged.
8. Per-file and aggregate manifests are stable before and after deterministic verification.
9. An Independent Reviewer, independent of the Builder, returned a fresh full `REVIEW GREEN` for the candidate’s Knowledge semantics, data/provenance integrity, Human Control, accepted-success, authentication-material boundary, and persistence-boundary fidelity.
10. The Delivery Record binds packet revision, reconciled upstream manifests, isolated base, exact candidate, commands/evidence, review, findings, and final completion authority.

## Verification contract

The Deterministic Verifier was read-only and ran in an isolated worktree distinct from the Builder worktree. It bound this packet revision, reconciled base identity, ENG-002 and ENG-003 accepted manifests, lockfile, exact task manifest, commands, tool versions, and environment assumptions, and verified final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8` with outcome `ENG-005 REV2 IR-F005 VERIFICATION: PASS`.

Required checks and pass criteria:

1. Preserve the historical ENG-003 revision-1 aggregate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` as provenance, and reproduce the nine accepted ENG-003 revision-2 component hashes and aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685` before testing; any revision-2 mismatch is inability/FAIL, never PASS.
2. `npm ci --ignore-scripts`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run smoke` pass without changing `package-lock.json`.
3. `npx vitest run --config tests/domain/vitest.config.ts` and `npm run test:persistence` pass as upstream regressions.
4. The task-owned application-service and genuine Wrangler-backed local-D1 suites pass through their task-local Vitest configurations; `npm run migrate:local` succeeds against a fresh isolated local database and repeated application reports no pending migration. FakeD1-only local-D1 evidence is an explicit failure.
5. A traceable matrix covers intentional initial capture, casual/inferred no-capture, origin preservation, accepted correction, multi-step linear chain/currentness, non-current/missing/malformed exact target, identity collision, branch/cycle, origin mismatch, unrelated-item isolation, invalid/unauthorized input, persistence failure, same-operation retry, and conflicting duplicate. Ambiguous-target clarification is not applicable as runtime evidence at this exact-target service boundary.
6. Failure injection proves accepted success only after durable commit, atomic predecessor/successor standing, no unrelated change, and no write for rejected authorization, missing or malformed exact target, casual capture, advice, retrieval, or inference.
7. Static import/API and forbidden-concept scans prove no D1/SQL/Worker/provider type leaks into the task-owned service and no taxonomy, promotion, retrieval/ranking, cross-Project selection, deletion/export, model/provider, network, or extra-service implementation appears.
8. Authentication-material fixtures prove the finite service-local eligibility guard rejects the defined categories on both capture and correction, including `Authorization: Bearer tokenonly123`, bare `Bearer tokenonly123`, and an existing punctuated synthetic bare-Bearer token. The bare alphanumeric form must be prohibited with no accepted receipt or Knowledge write; correction must leave its eligible predecessor current with no successor. Ordinary prose with isolated category words, including `Bearer authentication is documented here without any token material.`, remains eligible where otherwise valid. The complete finite eligibility matrix covers private-key material, credential assignment, password/auth-secret material, access/auth-token material, both Bearer forms, benign password/access-token/Bearer prose, capture/correction parity, and caller self-classification resistance; scans prove excluded material is never accepted as Knowledge or retained in task evidence.
9. A changed-path scan proves only the three exclusive roots changed; protected-hash checks prove every read-only upstream file is byte-identical to the reconciled base.
10. Generate a repository-relative, path-sorted SHA-256 listing for every changed file and its aggregate SHA-256; reproduce both before and after all checks.
11. `git diff --check` passes and the isolated worktree is free of unrelated or sibling-task changes.
12. An array or other non-snapshot supplied as `prior` is recorded only as malformed-exact-target rejection evidence. It must not be labeled or accepted as evidence that the service handled an ambiguous correction target. Ambiguous-target clarification evidence belongs to the upstream state-changing interaction/application boundary, planned as part of `ENG-010`, before an exact target reaches this service.

An unavailable command, base mismatch, lock violation, or unstable manifest was explicit failure/inability and returned to the Planner / Controller for classification.

## Independent review

**Required result:** fresh full semantic/data and persistence-boundary review by an actor independent of the Builder, with Strong Semantic Reasoning. This was satisfied on candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8` with outcome `ENG-005 REVIEW: GREEN`.

Review focused on intentional capture, taxonomy exclusion, immutable origin, linear currentness/supersession, correction atomicity, unrelated-item isolation, Human Control evidence, no-write boundaries, accepted-success truthfulness, retry/idempotency, authentication-material exclusion, adapter neutrality, downstream retrieval/deletion exclusion, and exact-candidate/evidence binding.

## Risk classification

**HIGH — accepted Knowledge, provenance/currentness, data integrity, Human Control, and authoritative-persistence composition risk.**

Controls were the narrow task roots, immutable upstream manifests, isolated Builder/verifier worktrees, failure injection, local-D1 evidence, secret and prohibited-scope scans, exact manifests, and independent full semantic/data review.

## Assignment and isolation (historical task assignment)

During task execution, roles were assigned as follows (now completed):

- **Planner / Controller:** obtained accepted ENG-003 revision-2 evidence, selected and recorded the reconciled clean base, re-evaluated DoR, dispatched, and owned locks, state, findings, and Delivery Record.
- **Builder:** one Standard Delivery worker with strong domain/application, provenance, and transactional composition capability; exclusive writer only within the three allowed roots; did not review its own candidate.
- **Deterministic Verifier:** Deterministic Execution profile; independent read-only isolated worktree; wrote only ephemeral ignored outputs.
- **Independent Reviewer:** different actor from the Builder; Strong Semantic Reasoning; read-only exact-candidate review.
- **Resource isolation:** a disposable task-specific Builder worktree and a distinct verifier/reviewer checkout; task-local `.wrangler` state and local D1 database; no shared writable dependency or emulator state with ENG-004.
- **Manifest rule:** per-file SHA-256 plus one aggregate SHA-256 over the repository-relative path-sorted listing; no absolute worktree path in durable evidence.

## Retry and escalation rules

- Retry only a failure classified retryable by the persistence result and only with the same operation identity and canonical write set.
- A repeated materially identical failure requires diagnosis/reclassification, not another blind retry.
- Route candidate defects to the Builder; verification-contract defects and Task Packet gaps to the Planner / Controller; environment failures to an isolated rerun or durable blocker; path overlap to serialization or packet amendment and DoR re-evaluation.
- Stop on an authority contradiction, required protected-path change, or unresolved semantic/security boundary. Do not work around it through local types, schema changes, inferred behavior, or integration edits.

## Human Reserved boundaries

Stop and prepare a Decision Packet for a Product Foundation or Runtime Architecture change, a new Knowledge taxonomy/state/origin/correction/Human Control rule, a security-authority decision, new service/infrastructure, paid usage or billing, production provisioning/deployment/credential/destructive action, unresolved authoritative conflict, unapproved scope expansion, or development control-plane implementation. Reconciling the accepted ENG-003 revision-2 manifestation without changing Knowledge semantics or this packet's lock was ordinary delivery recovery, not a new Human Reserved decision.

## Definition of Ready evaluation

| Delivery Contract condition | Result |
| --- | --- |
| Objective, authority, invariants, DoD, verification, review, assignments, and bounded context are explicit | PASS — the exact-target boundary and the ambiguity-evidence applicability are explicit |
| Canonical predecessors are `DONE` | PASS — ENG-003 revision 2 is `DONE` on aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685` |
| Accepted predecessor manifestation is present in the intended dispatch base | PASS — the accepted ENG-003 revision-2 persistence manifest and accepted ENG-004 state are present |
| Historical ENG-005 candidate is recoverable for reconciliation | FAIL / reclassified — none of the eight exact SHA-256 payloads was recovered; revised packet explicitly authorized rebuild instead (completed on candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`) |
| Exclusive/read-only/forbidden paths and resource locks are explicit and disjoint from ENG-004 | PASS |
| Reconstruction remains inside approved engineering authority and packet lock | PASS — `GOV-018` authorized it; no Product, Domain, Runtime Architecture, security-authority, or scope change was introduced (consumed by candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`) |
| Ambiguous correction-target runtime evidence is executable at this service boundary | NOT APPLICABLE — `correct` accepts exactly one prior snapshot; `ENG-010` owns the planned upstream text-interaction and human-control orchestration boundary that must clarify an ambiguous state-changing target before this service can be invoked |
| Human Reserved decision required to begin | PASS — none |

**Task-level DoR:** `PASS` — the rebuild and repair lineage reached completion on final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`, tree `833a11f345dedd240c892d473dd99e701d34cf3e`, canonical aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`. Historical intermediate candidate `239535a075b7b10626fc1f1adf9687daf08b0088` (aggregate `939cdae244aa44252ed6d12031874d406e3b5009955e3fc9e34f339140eed15a`) and its repair lineage remain preserved as historical evidence only. The final candidate passed fresh full deterministic verification and independent semantic/persistence review `GREEN`; `ENG-005` is `DONE`.

## Prior findings

- `ENG-005-F001` — historically `CLOSED` provenance for the lost candidate: authentication material could be accepted and purported local-D1 evidence used FakeD1. Its bounded repair added the finite service-local eligibility guard for capture and correction plus genuine Wrangler-backed local-D1 evidence; no generalized DLP/secret-scanning system or user self-classification bypass was authorized. It does not establish a current candidate finding, but its protections are mandatory and preserved in the final accepted candidate.

- `ENG-005-REV2-V001` — historically `CLOSED — VERIFICATION_CONTRACT_RECONCILIATION` for candidate `1d58b114ceaeed370e5f2fb8084660f7bd106385`. Its array-as-`prior` case proves only `correction-prior-malformed` and no write; it is not ambiguous-target evidence. This packet preserves the canonical requirement to clarify an ambiguous state-changing target before acceptance, assigns that runtime evidence to the planned upstream `ENG-010` interaction/application boundary, and requires no Human Reserved decision because no Product, Domain, Runtime Architecture, API, or service-boundary semantics changed.

- `ENG-005-REV2-F002` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `676bd5c5e2fd8daf245602b43e2d72e5230f5c3b`. The existing Bearer pattern treated `Bearer authentication` as if `authentication` were credential material, rejecting benign explanatory text `Bearer authentication is documented here without any token material.`. This violated invariant 11, `DATA-001`, and `PI-DATA-005`. `CLOSED` by candidate `1d58b114ceaeed370e5f2fb8084660f7bd106385`, which recognized actual Bearer-material structure while preserving benign `Bearer`, `password`, and `access token` prose controls.

- `ENG-005-REV2-IR-F001` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `239535a075b7b10626fc1f1adf9687daf08b0088`. Its finite guard rejected `Authorization: Bearer tokenonly123` but accepted bare `Bearer tokenonly123` because that branch required punctuation in the token. `CLOSED` by candidate `180bd7a17569f33a797a0eb95bfce8e02f2efc82`, which rejected bare opaque Bearer material on capture and correction without persistence.

- `ENG-005-REV2-IR-F002` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `180bd7a17569f33a797a0eb95bfce8e02f2efc82`. Textual and code-wrapped Bearer envelopes bypassed the guard. `CLOSED` by candidate `91c15266c5ca8c26825aa74dd1ffc3ad58cb3c90`.

- `ENG-005-REV2-IR-F003` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `91c15266c5ca8c26825aa74dd1ffc3ad58cb3c90`. Alphabetic opaque Bearer tokens bypassed the guard. `CLOSED` by candidate `1a4629095b17ceb81a8e32694ba8eca537ef7b58`.

- `ENG-005-REV2-IR-F004` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `1a4629095b17ceb81a8e32694ba8eca537ef7b58`. Embedded inline-code Bearer spans bypassed the guard. `CLOSED` by candidate `3f8a3d743f5b71023cb6609ebd32f33e00aa69f0`.

- `ENG-005-REV2-IR-F005` — historically `OPEN — BLOCKING — WORK_PRODUCT_DEFECT` at discovery for candidate `3f8a3d743f5b71023cb6609ebd32f33e00aa69f0`. The finite guard rejected singular protected assignment labels but accepted ordinary plural assignment labels (`credentials=`, `access_tokens=`, `auth_tokens=`, `passwords=`, `passphrases=`, `auth_secrets=`, `authentication_secrets=`, `client_secrets=`). `CLOSED` by final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8` on capture and correction without persistence or receipts, while preserving benign plural prose controls.

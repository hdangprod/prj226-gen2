# ENG-004 — Project/Action/context slice

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 2

**Current task state:** `NEEDS FIX` in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

This artifact populates the canonical Task Packet for `ENG-004`; it does not redefine the Task Packet schema or dispatch Builder work. Revision 2 records the upstream dependency and downstream repair constraints raised by `ENG-004-F003` without widening the task's existing write lock. Post-dispatch execution, evidence, findings, and completion state belong in the distinct [Delivery Record](../delivery/ENG-004-project-action-context-slice.md).

## Task ID

`ENG-004`

## Objective

Deliver the application vertical slice for accepted Project, Action, accepted progress and Project context, lifecycle transition, explicit target selection/correction, and mutation behavior needed for later resumption. The slice must compose the completed ENG-002 domain/Human Control contracts with the completed ENG-003 authoritative-persistence port so that an accepted result is reported only after its exact authorized state change is durably committed.

This task does not implement retrieval or recommendation, interaction wording or transport, export/deletion, Knowledge behavior, model/provider behavior, observability hardening, or the Worker composition root.

## Normative authority

- `GOV-018`, Engineering Phase authorization, revision 1.
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md) revision 1, especially `PF-CAP-001`, `PF-LIFE-001`, `PF-CTX-001`, `PF-CTL-001`, and `PF-QLT-001`.
- [Domain Model](../../../product/DOMAIN_MODEL.md) revision 1, especially Project/Action lifecycles, accepted context/progress, Current Context authority, Human Control, and invariants 2–10 and 14.
- [Scenario Corpus](../../../product/SCENARIOS.md) revision 1, specifically `SCN-001` through `SCN-004` and `SCN-006`; resumption retrieval and recommendation portions remain downstream.
- [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md) revision 1, especially architecture invariants 1–4 and 7, accepted memory, and the state-changing interaction flow.
- `MOD-001`, `MOD-002`, `BEH-001`, `BEH-004`, `QLT-001`, `ARC-001`, `ARC-002`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- Completed [`ENG-002`](../delivery/ENG-002-domain-application-kernel.md) and [`ENG-003`](../delivery/ENG-003-d1-authority-foundation.md) Delivery Records and their Task Packet revision 1 contracts.

## Dependencies and accepted upstream evidence

Canonical implementation predecessors are:

1. `ENG-002` — `DONE`; exact accepted sixteen-file manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
2. `ENG-003` — `DONE`; exact accepted thirteen-file manifest `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`, lockfile SHA-256 `445fd78c4279e62c210b8005aa4406070a832c740bfa5c905deede3b6d230ab6`, and migration SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

The exact ENG-003 revision-1 candidate above remains the historical baseline against which reviewed ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` was built. `ENG-004-F003` subsequently exposed a missing authoritative expected-state lifecycle-transition capability at that persistence boundary. ENG-003 is reopened under Task Packet revision 2 and must return to `DONE` on an accepted repair candidate before ENG-004 repair may be dispatched.

No Human Reserved decision or external resource is otherwise required.

## Relevant context

- ENG-002 already owns and defines the Project, Action, Accepted Progress, Accepted Project Context, Current Context, ordinary-mutation authorization, ambiguity, and operation-outcome semantics. This task composes them; it must not redefine them.
- ENG-003 owns the provider-neutral accepted-state persistence port, D1 adapter, ordered schema, atomic commit receipt, retry/idempotency, authoritative lifecycle-transition, and false-success boundary. This task consumes the accepted repaired boundary read-only; it must not repair or extend it.
- A caller-supplied Project or Action snapshot is not authoritative proof that the entity exists or has the supplied prior lifecycle. Creation and transition are distinct persistence intents.
- Multiple Projects may be `Active`. Current Context is provisional and distinct from lifecycle. Explicit user selection/correction is authoritative; ambiguous mutation has no write.
- Accepted progress may exist without an Action and never completes an Action by itself. Project completion never cascades.
- Later `ENG-006` consumes this slice for direct-SQL retrieval and resumption. Later `ENG-010` consumes it for bilingual interaction and Human Control orchestration.

## Allowed scope and exclusive write ownership

After the blocker is resolved and this exact packet is re-evaluated as Ready, one Builder receives exclusive write ownership only over:

- `src/application/services/projectActionContext/**` — application services that compose existing ENG-002 transitions, Human Control evidence, operation outcomes, and the ENG-003 persistence port;
- `tests/application/services/projectActionContext/**` — task-scoped service, failure, duplicate/retry, target, and no-write tests; and
- `tests/integration/d1/projectActionContext/**` — task-scoped local-D1 fixtures, harness/configuration, and mutation integration evidence.

All needed test configuration and fixtures must remain inside those task-owned directories. The Builder may use only the existing locked toolchain and dependencies. No barrel export or root script is required: task tests must be executable through the existing Vitest binary and a task-local configuration.

## Read-only dependencies

- `src/domain/**` and `src/application/contracts/**`.
- `src/application/ports/persistence/**`, `src/infrastructure/d1/**`, and `migrations/0001_authoritative_state.sql`, but only after their accepted ENG-003 identities are reconciled.
- `tests/domain/**`, `tests/application/contracts/**`, `tests/application/ports/persistence/**`, `tests/infrastructure/d1/**`, and `tests/foundation/**` as upstream regression evidence; an existing helper may be imported but not modified.
- `package.json`, `package-lock.json`, `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`, `wrangler.toml`, and `src/index.ts`.
- The authority, Task Packets, Delivery Records, and review artifacts linked above.

## Forbidden scope

- Any path outside the three exclusive-write roots above, including every ENG-005 lock.
- Changes to ENG-002 domain/application contracts or tests; new canonical concepts, states, hierarchy, target semantics, confirmation semantics, or operation-result categories.
- Changes to the persistence port, D1 adapter/types, migration, schema, common D1 tests/helpers, root configuration, dependency files, package scripts, test configuration, barrel/index exports, Worker entrypoint, or composition root.
- Knowledge capture/correction/supersession, retrieval/resumption queries or ranking, recommendation, export/deletion, model/provider integration, interaction transport/wording, or observability hardening.
- Project abandonment or Action withdrawal; `Paused`, `Blocked`, `Archived`, or other unapproved lifecycle states; Project-completion cascade; progress-implies-completion; inferred mutation; or false accepted-state success.
- Provider-hosted memory, vector/search/cache/queue infrastructure, another deployable/service, production or paid action, credential/secret operation, or development control-plane implementation.
- Changes to approved governance, Product Foundation, Domain Model, Scenario Corpus, Runtime Architecture, completed Task Packets, or completed Delivery Records.

## Constraints and implementation invariants

1. Application/domain validation and valid ENG-002 Human Control evidence precede every persistence attempt.
2. Ambiguous, unauthorized, invalid, advisory, proposed, or failed operations issue no persistence write and cannot return accepted success.
3. A valid transition returns accepted success only for `committed` or the same-operation/same-transition `already-committed` result from authoritative persistence. Missing authoritative state, expected-state mismatch, ownership mismatch, conflict, or persistence failure remains distinguishable and cannot be accepted success.
4. Operation identities and write sets are stable across a safe retry; reusing an operation identity with a different write set is not accepted.
5. Project creation requires an intended outcome and uses the accepted insert-only capability that starts `Active`; Project completion/reopening requests an authoritative `Active -> Completed` / `Completed -> Active` transition by identity. Action creation uses the accepted insert-only capability that starts `Open` under exactly one existing Project; Action completion/reopening requests an authoritative `Open -> Completed` / `Completed -> Open` transition without reassigning ownership.
6. Project completion changes only that Project. It does not change Action lifecycle, accepted context/progress, or Knowledge.
7. Accepted progress and context facts preserve Project ownership. Optional Action ownership must match the same Project. Progress does not complete an Action.
8. Explicit Current Context selection/correction prevails over inference. Ambiguity affecting a mutation produces clarification-required/no-write behavior.
9. Failure retains normalized intent/input sufficient for the existing operation contract and safe retry without inventing an interaction transcript or new durable product concept.
10. D1/SQL and Worker types remain outside the application service contract. The service depends on the provider-neutral persistence port.

## Expected artifacts

- Task-owned Project/Action/context application service implementation within the exclusive source root.
- Task-owned deterministic service and local-D1 integration tests/configuration/fixtures within the exclusive test roots.
- After dispatch, a distinct `docs/development/delivery/ENG-004-project-action-context-slice.md` Delivery Record maintained by the Planner / Controller, not by an implementation Builder unless separately assigned.
- An exact candidate identity consisting of per-file SHA-256 values for every changed task-owned file and the SHA-256 of their newline-delimited repository-path-sorted manifest.

## Definition of Done

1. Project establishment, Action acceptance, Project/Action completion and reopening, accepted context facts, accepted progress, progress correction, and explicit target selection/correction are composed through existing ENG-002 contracts and the accepted ENG-003 revision-2 persistence contract without changing domain semantics.
2. Every accepted mutation is committed through the ENG-003 port before accepted success; failed, invalid, unauthorized, ambiguous, conflicting duplicate, and partial/durability-failure paths never report accepted success.
3. Tests prove no Project-completion cascade, no progress-implies-completion, exact Project/Action ownership, multiple Active Projects, explicit-correction precedence, and ambiguity no-write behavior.
4. Failure and retry tests prove stable same-operation retry behavior, visible failure, no duplicate semantic effect, and no false success.
5. Task-scoped local-D1 evidence proves the slice against the accepted migration/adapter and preserves the ENG-003 atomicity and constraint boundary.
6. All upstream domain, Human Control, persistence, foundation, typecheck, lint, build, and smoke regressions pass without modifying protected files.
7. Changed paths equal the packet's exclusive locks; dependency, migration, root configuration, shared helper, barrel, Worker entry, and sibling-task paths are unchanged.
8. Per-file and aggregate manifests are stable before and after deterministic verification.
9. A fresh full Independent Reviewer returns `REVIEW GREEN` for product lifecycle, Human Control, accepted-success, and persistence-boundary fidelity after the F003 repair, or every blocking finding is repaired and required rechecks pass.
10. The Delivery Record binds packet revision, reconciled upstream manifests, isolated base, exact candidate, commands/evidence, review, findings, and final completion authority.

## Verification contract

The Deterministic Verifier is read-only and must run in an isolated worktree distinct from the Builder worktree. It binds this packet revision, reconciled base identity, ENG-002 and ENG-003 accepted manifests, lockfile, exact task manifest, commands, tool versions, and environment assumptions.

Required checks and pass criteria:

1. Reproduce all thirteen ENG-003 component hashes and aggregate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` before testing; any mismatch is inability/FAIL, never PASS.
2. `npm ci --ignore-scripts`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run smoke` pass without changing `package-lock.json`.
3. `npx vitest run --config tests/domain/vitest.config.ts` and `npm run test:persistence` pass as upstream regressions.
4. The task-owned application-service and local-D1 suites pass through their task-local Vitest configurations; `npm run migrate:local` succeeds against a fresh isolated local database and repeated application reports no pending migration.
5. A traceable matrix covers establish/complete/reopen Project and Action, missing entity, fabricated caller snapshot, stale/concurrent expected state, context facts, progress and correction, optional Action ownership, ownership mismatch/reassignment, multiple Active Projects, explicit target correction, ambiguous target, invalid/unauthorized input, persistence failure, same-operation retry, conflicting duplicate, receipt alignment, and no-cascade/no-implied-completion behavior.
6. Failure injection proves the service reports accepted success only after durable commit and issues no write for ambiguity, invalid transition, failed authorization, advice, proposal, or inference.
7. Static import/API scans prove no D1/SQL/Worker/provider type leaks into the task-owned application service and no model, retrieval, Knowledge, export/deletion, provider, network, or extra-service implementation appears.
8. A changed-path scan proves only the three exclusive roots changed; protected-hash checks prove every read-only upstream file is byte-identical to the reconciled base.
9. Generate a repository-relative, path-sorted SHA-256 listing for every changed file and its aggregate SHA-256; reproduce both before and after all checks.
10. `git diff --check` passes and the isolated worktree is free of unrelated or sibling-task changes.

An unavailable command, base mismatch, lock violation, or unstable manifest is explicit failure/inability and returns to the Planner / Controller for classification.

## Independent review

**Required result:** fresh full product-semantic and persistence-boundary review by an actor independent of the Builder, with Strong Semantic Reasoning. The accepted upstream repair changes the persistence authority composition, so a targeted F003-only recheck is insufficient.

Review focuses on lifecycle fidelity, Project/Action ownership, context/progress semantics, ambiguity and explicit-correction authority, Human Control evidence, no-write boundaries, accepted-success truthfulness, retry/idempotency, adapter neutrality, downstream-scope exclusion, and exact-candidate/evidence binding. Security review is targeted to authority-evidence misuse and unintended data or secret handling. A material semantic, Human Control, persistence, security-boundary, or scope change requires fresh full review; a bounded repair may receive targeted recheck only under the Delivery Contract.

## Risk classification

**HIGH — lifecycle, Human Control, accepted-state truthfulness, and authoritative-persistence composition risk.**

Controls are the narrow task roots, immutable upstream manifests, isolated Builder/verifier worktrees, failure injection, local-D1 evidence, prohibited-scope scans, exact manifests, and independent full semantic review.

## Assignment and isolation

- **Planner / Controller:** obtains accepted ENG-003 revision-2 evidence, selects and records the reconciled clean base, re-evaluates DoR, dispatches, and owns locks, state, findings, and Delivery Record.
- **Builder:** one Standard Delivery worker with strong domain/application and transactional composition capability; exclusive writer only within the three allowed roots; cannot review its own candidate.
- **Deterministic Verifier:** Deterministic Execution profile; independent read-only isolated worktree; writes only ephemeral ignored outputs.
- **Independent Reviewer:** different actor from the Builder; Strong Semantic Reasoning; read-only exact-candidate review.
- **Resource isolation:** a disposable task-specific Builder worktree and a distinct verifier/reviewer checkout; task-local `.wrangler` state and local D1 database; no shared writable dependency or emulator state with ENG-005.
- **Manifest rule:** per-file SHA-256 plus one aggregate SHA-256 over the repository-relative path-sorted listing; no absolute worktree path in durable evidence.

## Retry and escalation rules

- Retry only a failure classified retryable by the persistence result and only with the same operation identity and canonical write set.
- A repeated materially identical failure requires diagnosis/reclassification, not another blind retry.
- Route candidate defects to the Builder; verification-contract defects and Task Packet gaps to the Planner / Controller; environment failures to an isolated rerun or durable blocker; path overlap to serialization or packet amendment and DoR re-evaluation.
- Stop on an authority contradiction, required protected-path change, or unresolved semantic/security boundary. Do not work around it through local types, schema changes, inferred behavior, or integration edits.

## Human Reserved boundaries

Stop and prepare a Decision Packet for a Product Foundation or Runtime Architecture change, a new canonical concept/state or Human Control rule, a security-authority decision, new service/infrastructure, paid usage or billing, production provisioning/deployment/credential/destructive action, unresolved authoritative conflict, unapproved scope expansion, or development control-plane implementation. Consuming the accepted ENG-003 revision-2 contract within the unchanged ENG-004 lock is ordinary authorized Engineering work, not a new Human Reserved decision.

## Definition of Ready evaluation

| Delivery Contract condition | Result |
| --- | --- |
| Objective, authority, invariants, DoD, verification, review, assignments, and bounded context are explicit | PASS |
| Canonical predecessors are `DONE` | FAIL — ENG-003 is reopened and its revision-2 repair is not accepted |
| Accepted predecessor manifestation is present in the intended dispatch base | FAIL — only the historical revision-1 ENG-003 aggregate is present; the repaired aggregate does not yet exist |
| Exclusive/read-only/forbidden paths and resource locks are explicit and disjoint from ENG-005 | PASS |
| Human Reserved decision required to begin | PASS — none |

**Task-level DoR:** `BLOCKED / NEEDS FIX`. The exact reviewed candidate exists and its deterministic evidence passed, but blocking `ENG-004-F003` requires an accepted ENG-003 revision-2 predecessor and then a bounded ENG-004 repair. This state does not dispatch a Builder.

## Prior findings

- `ENG-004-F001` — historically `CLOSED` for exact reviewed aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431`; genuine local-D1 evidence/harness repair history is retained in the Delivery Record.
- `ENG-004-F002` — historically `CLOSED` for the same exact aggregate; lifecycle/target/failure matrix repair history is retained in the Delivery Record.
- `ENG-004-F003` — `OPEN — BLOCKING`; caller-supplied Project/Action state was treated as proof of authoritative prior lifecycle before put/upsert persistence. Upstream repair is routed to ENG-003 revision 2; downstream ENG-004 repair remains inside the unchanged three-root lock.

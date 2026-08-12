# ENG-003 — D1 Authority Foundation

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 2

**Current task state:** `READY` for the bounded `ENG-004-F003` upstream repair in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

## Task ID

`ENG-003`

## Objective

Create and maintain the minimal authoritative-persistence foundation: an application-owned persistence port and D1 adapter that durably and atomically store accepted ENG-002 state while preventing false success, unsafe duplicate/retry behavior, partial accepted writes, and lifecycle transitions based only on caller-supplied snapshots. Persistence enforces approved semantics but creates no new product meaning.

Revision 2 reopens this task only for the persistence-owned portion of blocking finding `ENG-004-F003`. The accepted revision-1 candidate and its closed `ENG-003-F001` / `ENG-003-F001-R1` history remain intact as historical evidence.

## Normative authority

- `GOV-018` and `ARC-001`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md), [Domain Model](../../../product/DOMAIN_MODEL.md), and [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md), revision 1.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- The exact completed [`ENG-002` Delivery Record](../delivery/ENG-002-domain-application-kernel.md) and its Task Packet revision 1.

## Dependencies and readiness

- `ENG-001` and `ENG-002` are `DONE`; `ENG-002` verification is PASS and independent review is GREEN on manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
- Approved domain/application contracts and locked toolchain exist.
- No prerequisite Human Reserved decision or external resource is required. The repair preserves the approved Product Foundation and Runtime Architecture and introduces no service, infrastructure, or product state.
- The revision-2 ownership below is disjoint from ENG-004's application-service lock and every ENG-005 write lock. It must be integrated before either downstream task can bind final evidence to the repaired persistence baseline.

All Delivery Contract Definition of Ready conditions for this bounded repair are satisfied. The defect, required semantics, exact locks, deterministic evidence, review depth, assignment, and Human Reserved boundary are explicit. This packet is `READY`; this planning update does not dispatch a Builder.

## Relevant context

Authoritative persistence must succeed before accepted-state success is reported. D1 and SQL representations are adapter-local. Accepted Project, Action, context, progress, Knowledge, provenance, lifecycle, and supersession state are authoritative; provider and derived state are not. A caller-provided Project or Action is not proof that the entity already exists in authoritative state or has the claimed current lifecycle. Creation and transition are distinct persistence intents. Retrieval, complete vertical-slice behavior, export, and deletion behavior remain downstream.

## Allowed scope

One revision-2 Builder receives exclusive ownership only of:

- `src/application/ports/persistence/**`;
- `src/infrastructure/d1/**`;
- `tests/application/ports/persistence/**`; and
- `tests/infrastructure/d1/**`.

`migrations/**`, root configuration, dependencies, and every application/domain service are protected read-only paths. The existing schema and locked toolchain are sufficient for conditional D1 transitions; discovering otherwise is a packet blocker requiring Controller re-evaluation, not implied permission to widen the lock.

## Forbidden scope

- Changes to `src/domain/**`, `src/application/contracts/**`, `migrations/**`, root configuration/dependency files, or their tests; redefining lifecycle, Human Control, deletion confirmation, Progress, Knowledge, or result semantics.
- Changes to `src/application/services/projectActionContext/**` or any ENG-004/ENG-005 task-owned test or source path.
- Project/Action/Knowledge vertical slices, retrieval, export/deletion orchestration, model capability/provider code, interaction flow, observability hardening, production deployment/provisioning, credentials/secrets, paid resources, or control-plane work.
- ORM adoption, vector/search/cache/queue infrastructure, another database/service, or D1/SQL types in domain contracts.

## Constraints and invariants

- Application/domain and valid Human Control evidence express transition intent; persistence alone owns proof of the authoritative entity's existence, current lifecycle, and immutable identity/ownership at commit time.
- Project creation accepts only a new Project whose initial lifecycle is `Active`; Action creation accepts only a new Action whose initial lifecycle is `Open` and whose owning Project exists. Creation never acts as lifecycle update or upsert.
- Project lifecycle transition requires an existing authoritative Project and the exact expected old lifecycle: `Active -> Completed` or `Completed -> Active`.
- Action lifecycle transition requires an existing authoritative Action, its unchanged owning Project, and the exact expected old lifecycle: `Open -> Completed` or `Completed -> Open`. A transition cannot create an Action, change ownership, or apply under another Project.
- The provider-neutral command/result contract carries transition intent and identifiers, not a caller snapshot as accepted-state proof. It reports enough authoritative outcome to support truthful downstream success without reconstructing prior state from caller input.
- A reported accepted success requires committed authoritative persistence. Commit failure and partial failure produce no false accepted result.
- Existence/ownership/expected-state checks, state change, and operation receipt are one atomic D1 authority operation. A missing entity, ownership mismatch, or stale/unexpected lifecycle produces no state change, no success receipt, and no false accepted result.
- The same operation identity and canonical transition may return `already-committed`; a different command under the same operation identity conflicts. Concurrent or stale transitions cannot overwrite an intervening authoritative state change.
- Constraints, transactions, identifiers, retry/idempotency behavior, and migration ordering preserve ENG-002 identity, ownership, lifecycle, currentness, provenance, and linear supersession semantics without inventing product states.
- Fresh migration and repeated application are deterministic and safe for local/test databases.
- No authentication material or real sensitive user data enters fixtures or evidence.

## Definition of Done

1. The provider-neutral port distinguishes Project/Action creation from lifecycle transition and does not use a caller-supplied entity snapshot as proof of authoritative prior state.
2. The D1 adapter atomically checks existence, immutable identity/Action ownership, and expected old lifecycle; applies only the approved state edge; and publishes the aligned operation receipt only on accepted transition.
3. Missing, wrong-owner, stale, concurrent, invalid-edge, conflicting-operation, constraint, and durability-failure cases cannot create an entity, mutate lifecycle, publish a success receipt, or report accepted success.
4. Project creation is insert-only and `Active`; Action creation is insert-only and `Open` under an existing owning Project. Existing identity conflicts remain rejected.
5. Same-operation retry, conflicting duplicate, partial failure, and a later opposite transition are explicit, deterministic, and safe without receipt/state divergence.
6. Port, FakeD1/adapter, and genuine migration-backed local-D1 evidence cover every creation and lifecycle edge plus the fabricated-snapshot regressions from `ENG-004-F003`.
7. All revision-1 ENG-003 regressions remain GREEN and the accepted migration is unchanged.
8. Exact-candidate deterministic evidence and a fresh full independent persistence/data-boundary review are durable and GREEN, with `ENG-004-F003`'s upstream prerequisite accepted before ENG-004 rework begins.

## Verification contract

Bind packet revision 2, the accepted revision-1 ENG-003 manifest, ENG-002 manifest, exact repair candidate, lockfile, unchanged migration identity, commands, tool versions, and environment assumptions. Run clean install; typecheck; lint; unit/foundation/build/smoke; all revision-1 persistence regressions; fresh and repeated local-D1 migration; port/adapter contract suites; transaction and receipt failure injection; duplicate/retry/concurrency tests; adapter-boundary and forbidden-infrastructure scans; dependency listing; protected-path hashes; and `git diff --check`.

The deterministic matrix must prove, with both adapter-level evidence and genuine migration-backed local D1 where authoritative behavior matters:

- missing Project plus completion/reopening is rejected and does not create;
- Project creation is `Active` only; `Active -> Completed`; `Completed -> Active`; stale or concurrent expected-state mismatch is rejected;
- missing Action plus completion/reopening is rejected and does not create;
- Action creation is `Open` only under an existing Project; `Open -> Completed`; `Completed -> Open`;
- wrong Project ownership, missing owning Project, and attempted ownership reassignment are rejected;
- fabricated caller `Active` Project and fabricated caller `Open` Action cannot establish authoritative prior state;
- exact retry, conflicting duplicate, partial failure/rollback, receipt alignment, and transition-plus-receipt atomicity hold; and
- no-cascade and unchanged unrelated accepted state remain true.

Any unavailable check, migration change, protected-path change, or unstable exact manifest is explicit failure/inability and returns to the Controller.

## Risk classification

**HIGH — authoritative persistence, lifecycle, concurrency, idempotency, and accepted-success risk.** Require the narrow exclusive port/adapter/test lock, genuine local-D1 evidence, failure/concurrency injection, exact-candidate evidence, and a fresh full Independent Reviewer with strong persistence/data-boundary reasoning. The repair changes the persistence authority boundary within the approved architecture, so targeted recheck alone is insufficient.

## Assignment

- **Planner / Controller:** dependency/readiness, base/candidate identity, locks, findings, and state.
- **Builder:** one Standard Delivery writer with D1/transaction capability.
- **Verifier:** Deterministic Execution, read-only.
- **Reviewer:** independent of Builder, Strong Semantic Reasoning for persistence/data boundaries.
- **Locks:** exactly the four allowed roots above. No migration, root, ENG-002, ENG-004, ENG-005, or ENG-008 ownership.

## Human Reserved boundaries

Stop for product/architecture/security-boundary change, new service/infrastructure, paid or production resource/action, credential/secret operation, destructive external action, unresolved authority conflict, or scope expansion. Table/index/constraint/transaction details are Engineering-owned when they preserve approved semantics.

## Prior findings

`ENG-004-F003` — `BLOCKING`, upstream persistence prerequisite. `ENG-004-F001` and `ENG-004-F002` remain closed for reviewed ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` and are not reopened by this packet.

## Definition of Ready evaluation — revision 2

| Delivery Contract condition | Result |
| --- | --- |
| Objective, authority, lifecycle invariants, DoD, verification, fresh review, assignments, and context are explicit | PASS |
| Existing owner and prior accepted baseline are identifiable | PASS — ENG-003 revision-1 candidate remains historical accepted evidence |
| Exact write ownership is sufficient and collision-controlled | PASS — four persistence-owned roots; downstream writers are serialized from integration |
| Human Reserved decision required to begin | PASS — none; approved semantics and architecture are preserved |

**Task-level DoR:** `READY`. This status authorizes only dispatch under the revision-2 packet; this Controller update starts no Builder.

# ENG-003 — D1 Authority Foundation

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 1

**Current task state:** `DONE` in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

## Task ID

`ENG-003`

## Objective

Create the minimal authoritative-persistence foundation: an application-owned persistence port, ordered D1 schema/migrations, and a D1 adapter that can durably and atomically store the accepted ENG-002 state while preventing false success, unsafe duplicate/retry behavior, and partial accepted writes. Persistence enforces approved semantics but creates no new product meaning.

## Normative authority

- `GOV-018` and `ARC-001`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md), [Domain Model](../../../product/DOMAIN_MODEL.md), and [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md), revision 1.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- The exact completed [`ENG-002` Delivery Record](../delivery/ENG-002-domain-application-kernel.md) and its Task Packet revision 1.

## Dependencies and readiness

- `ENG-001` and `ENG-002` are `DONE`; `ENG-002` verification is PASS and independent review is GREEN on manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
- Approved domain/application contracts and locked toolchain exist.
- No prerequisite Human Reserved decision or external resource is required.
- The ownership below is disjoint from `ENG-008`; no task is `RUNNING`.

All Delivery Contract Definition of Ready conditions were satisfied before dispatch. Final deterministic verification is PASS, final independent persistence/data-boundary review is GREEN, and the complete repair/recheck history and completion evidence are recorded in the [ENG-003 Delivery Record](../delivery/ENG-003-d1-authority-foundation.md). This packet is closed as `DONE`; it does not dispatch downstream work.

## Relevant context

Authoritative persistence must succeed before accepted-state success is reported. D1 and SQL representations are adapter-local. Accepted Project, Action, context, progress, Knowledge, provenance, lifecycle, and supersession state are authoritative; provider and derived state are not. Retrieval, complete vertical-slice behavior, export, and deletion behavior remain downstream.

## Allowed scope

One Builder receives exclusive ownership of:

- `src/application/ports/persistence/**`;
- `src/infrastructure/d1/**`;
- `migrations/**`;
- `tests/application/ports/persistence/**` and `tests/infrastructure/d1/**`; and
- the smallest necessary local/test D1 binding and test-command changes in `wrangler.toml`, `package.json`, and `package-lock.json`, only if the existing locked toolchain cannot exercise this packet otherwise.

Root-file changes are exclusive resource locks for the duration of this task and require exact before/after evidence. Prefer existing dependencies and commands.

## Forbidden scope

- Changes to `src/domain/**`, `src/application/contracts/**`, or their ENG-002 tests; redefining lifecycle, Human Control, deletion confirmation, Progress, Knowledge, or result semantics.
- Project/Action/Knowledge vertical slices, retrieval, export/deletion orchestration, model capability/provider code, interaction flow, observability hardening, production deployment/provisioning, credentials/secrets, paid resources, or control-plane work.
- ORM adoption, vector/search/cache/queue infrastructure, another database/service, or D1/SQL types in domain contracts.

## Constraints and invariants

- Application/domain authority decides valid transitions; the adapter persists supplied accepted state and cannot authorize it.
- A reported accepted success requires committed authoritative persistence. Commit failure and partial failure produce no false accepted result.
- Constraints, transactions, identifiers, retry/idempotency behavior, and migration ordering preserve ENG-002 identity, ownership, currentness, provenance, and linear supersession semantics without inventing product states.
- Fresh migration and repeated application are deterministic and safe for local/test databases.
- No authentication material or real sensitive user data enters fixtures or evidence.

## Definition of Done

1. A provider-neutral persistence port and D1 adapter compile without leaking D1/SQL types into domain/application contracts.
2. Ordered migrations create the minimum schema and constraints required for ENG-002 accepted-state shapes and relationships.
3. Atomic write behavior prevents false success and partial accepted state under injected commit failure.
4. Duplicate and retry behavior is explicit, deterministic, and safe.
5. Fresh and repeated migration, constraint, adapter-contract, failure-injection, and boundary tests pass.
6. Exact-candidate deterministic evidence and an independent persistence/data-boundary review are durable and GREEN, with all blocking findings resolved.

## Verification contract

Bind packet revision, ENG-002 manifest, candidate manifest/commit, lockfile, migration identities, commands, tool versions, and environment assumptions. Run clean install; typecheck; lint; unit/foundation/build/smoke; fresh and repeated local-D1 migration; schema/constraint and adapter-contract suites; transaction commit-failure, duplicate/retry, and partial-failure injection; adapter-boundary and forbidden-infrastructure scans; dependency listing; and `git diff --check`. Any unavailable check is explicit and is not PASS.

## Risk classification

**HIGH — authoritative persistence, migration, atomicity, and accepted-success risk.** Require exclusive migration/D1 ownership, failure injection, exact-candidate evidence, and an Independent Reviewer with strong persistence/data-boundary reasoning. Material schema/authority/security scope change requires fresh full review.

## Assignment

- **Planner / Controller:** dependency/readiness, base/candidate identity, locks, findings, and state.
- **Builder:** one Standard Delivery writer with D1/transaction capability.
- **Verifier:** Deterministic Execution, read-only.
- **Reviewer:** independent of Builder, Strong Semantic Reasoning for persistence/data boundaries.
- **Locks:** allowed paths above; root configuration only when necessary and serialized. No ownership of ENG-002 or ENG-008 paths.

## Human Reserved boundaries

Stop for product/architecture/security-boundary change, new service/infrastructure, paid or production resource/action, credential/secret operation, destructive external action, unresolved authority conflict, or scope expansion. Table/index/constraint/transaction details are Engineering-owned when they preserve approved semantics.

## Prior findings

None.

# ENG-011 Formal Definition of Ready Evaluation — Revision 2

**Artifact class:** OPERATIONAL / ANALYSIS

**Lifecycle status:** ACTIVE

**Date:** 2026-08-28

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Task Packet:** [Revision 2](../tasks/ENG-011-observability-failure-recovery-hardening.md)

**Evaluator:** `ENG-011 FORMAL DoR — REVISED REPAIR-3 SCOPE`

**Evaluation result:** `PASS — READY FOR CONTROLLER DISPATCH`

**Human Reserved:** `NOT REQUIRED`

**Builder dispatch:** `NOT PERFORMED`

**Implementation:** `NOT STARTED`

## 1. Planning-governance identity

| Property | Verified value |
| --- | --- |
| Canonical startup branch | `foundation/product-foundation` |
| Canonical startup HEAD | `5f09e87beaf70e669ba6e8fdd383c8c8ef66b2b7` |
| Canonical startup tree | `38063ba0dcea5b6d5c01cb4ace9b9d65a5982777` |
| Revision-2 planning commit | `5f09e87beaf70e669ba6e8fdd383c8c8ef66b2b7` |
| Planning tree | `38063ba0dcea5b6d5c01cb4ace9b9d65a5982777` |
| Sole parent | `3ac5a39ffa6d891d252dff1ddd47bd0e380cad8b` |
| Parent count / distance | `1` / `1` |
| Planning range whitespace check | `PASS` |
| Remote divergence | remote-only `0`; local-only `16` |
| Tracked/index state | clean |
| Preserved untracked state | exactly eleven ENG-009 exploratory artifacts, untracked and unstaged |

The planning commit changes only these six governance paths:

1. `docs/development/CURRENT.md`
2. `docs/development/ENGINEERING_PLAN.md`
3. `docs/development/analysis/ENG-011_REPAIR2_SOR_FINDING_DISPOSITION_2026-08-28.md`
4. `docs/development/analysis/STRONG_MODEL_REVIEW_REGISTER.md`
5. `docs/development/delivery/ENG-011-observability-failure-recovery-hardening.md`
6. `docs/development/tasks/ENG-011-observability-failure-recovery-hardening.md`

No runtime source, test, configuration, package, deployment, or migration path changed.

## 2. Revision identity and exact write authority

Task Packet revision 2 supersedes revision 1 only for future Repair-3 execution. It preserves Candidate 1, Repair 1, and Repair 2 as frozen, unaccepted, historical, non-canonical evidence. Revision-1 DoR PASS is historical for its former twelve-path scope and supplies no Repair-3 authority.

The lock has nineteen unique literal paths, no duplicates, wildcards, directory authority, optional paths, or placeholders.

### A. Original twelve paths, preserved in order

1. `src/application/ports/observability/operationalEvidence.ts`
2. `src/application/ports/observability/index.ts`
3. `src/application/services/interaction/interactionTypes.ts`
4. `src/application/services/interaction/interactionOrchestrator.ts`
5. `src/application/services/interaction/index.ts`
6. `src/infrastructure/observability/cloudflareOperationalEvidence.ts`
7. `src/infrastructure/observability/index.ts`
8. `tests/application/ports/observability/operationalEvidence.test.ts`
9. `tests/application/ports/observability/vitest.config.ts`
10. `tests/application/services/interaction/interactionObservability.test.ts`
11. `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
12. `tests/infrastructure/observability/vitest.config.ts`

### B. Seven necessary additions, preserved in order

| Path | Why required / finding served | Smallest authorized change and regression responsibility |
| --- | --- | --- |
| `src/application/contracts/operations.ts` | R006; the shared accepted result currently has no persistence disposition. | Add a closed accepted disposition while retaining `kind: "accepted"` and the Product value. |
| `src/application/services/projectActionContext/projectActionContextService.ts` | R006; `persist()` collapses `committed` and `already-committed`. | Propagate existing persistence truth only; no lifecycle, authorization, or write change. |
| `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` | R006; its `persist()` makes the same collapse. | Propagate existing persistence truth only; no Knowledge eligibility, origin, or supersession change. |
| `tests/application/services/projectActionContext/projectActionContextService.test.ts` | R006/R009 service-boundary proof. | Prove fresh commit differs from valid replay while Product value remains unchanged. |
| `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts` | R006/R009 service-boundary proof. | Prove capture/correction fresh commit differs from replay without content or semantic change. |
| `tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts` | R006/R009 real-persistence proof. | Prove migration-backed first commit, replay disposition, and no duplicate authoritative mutation. |
| `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts` | R006/R009 real-persistence proof. | Prove the same for Knowledge capture/correction, including origin and lineage preservation. |

The first three added paths contain or propagate the information previously lost; the final four prove the propagation at unit and real-D1 boundaries. A twelve-path-only repair cannot truthfully reconstruct this disposition without guessing from an operation ID or adding a new, racy persistence read, both forbidden by the packet.

## 3. R006 information-flow proof

`AcceptedStatePersistence.commitAcceptedState()` already exposes `{ kind: "committed" }` and `{ kind: "already-committed" }` in `src/application/ports/persistence/acceptedStatePersistence.ts`.

The accepted canonical services erase it: `ProjectActionContextService.persist()` and `KnowledgeProvenanceService.persist()` both convert either result to `{ kind: "accepted", value }`. Revision 2 authorizes `operations.ts` to preserve a closed disposition on that accepted result, both service implementations to propagate it, and the already-locked `interactionOrchestrator.ts` to consume it as accepted-versus-duplicate evidence. The two service tests and two local-D1 tests prove ordinary first commit versus same-operation replay.

Therefore Repair 3 can preserve authoritative disposition without operation-ID inference, new reads, changed idempotency semantics, new side effects, or a migration: **YES**.

## 4. Finding readiness and executable evidence matrix

| Finding | Executable requirement | Test IDs | Exact test path(s) | Production path(s) | Expected proof |
| --- | --- | --- | --- | --- | --- |
| R001 | Runtime-issued/provenance-valid context and no content-like identifier evidence. | R3-TC-01, R3-TC-02; TC-01–05 | `tests/application/ports/observability/operationalEvidence.test.ts`; `tests/application/services/interaction/interactionObservability.test.ts` | observability contract; interaction types/orchestrator | Structural forgery and safe-syntax content-like identifiers fail closed without generalized DLP. |
| R002 | Authoritative mutation ID wins; deletion turns have distinct proven request attempts. | R3-TC-03, R3-TC-04; TC-03 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction types/orchestrator | No misattributed operation evidence; correlation retained across distinct attempts. |
| R003 | Emit provider and retrieval attempt/result truth after normalized results. | R3-TC-05, R3-TC-06; TC-06, 07, 11 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction orchestrator | Provider success/failure and retrieval found/not-found/failure are distinct and no private data enters evidence. |
| R004 | Direction is not confirmed-deletion authorization. | R3-TC-08; TC-12 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction orchestrator | First turn has no authorization success; matched confirmation can produce it. |
| R005 | Exhaustive upstream stage/failure mapping preserves retry truth. | R3-TC-07; TC-08–16 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction orchestrator | Pre-persistence rejection is never `persistence-durability`; normalized retry disposition remains exact. |
| R006 | Preserve fresh versus duplicate commit disposition. | R3-TC-09, R3-TC-10; TC-09, 10, 15 | four added service/D1 test paths | operations contract; both services; interaction orchestrator | Fresh commit emits accepted, valid replay emits duplicate, Product value unchanged and no duplicate write. |
| R007 | Use the defined aggregate truth table. | R3-TC-11; TC-14 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction orchestrator | All-success is succeeded; actual success/non-success is partial; all-failure is not partial success; Product portions unchanged. |
| R008 | Establish ingress before user-visible success evidence. | R3-TC-12 | `tests/application/services/interaction/interactionObservability.test.ts` | interaction orchestrator | No user-visible succeeded event precedes successful trusted ingress. |
| R009 | Keep the original contract substantive and add path-complete boundary/provenance coverage. | R3-TC-13–18; TC-01–21 | all seven locked test/config paths | all applicable locked production paths | Prohibited-boundary, no-content, retry, toolchain, ancestry, and byte-isolation evidence are durable. |

R3-TC-14 expressly preserves original `ENG-011-TC-01` through `TC-21`; revision 2 strengthens rather than weakens them. The packet’s mixed truth table is executable: success-family-only is `succeeded`; an actual success/non-success mix is `partial`/`mixed-outcome`; no-success results retain a homogeneous terminal status where available, otherwise `failed`/`mixed-outcome`.

## 5. Verification feasibility and boundaries

The existing package scripts and all sixteen tracked Vitest configurations are available without a new dependency or framework. Baseline execution passed: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke`, `npm run test:persistence`, and `npm run migrate:local`. The local-D1 commands require loopback permission in this environment; when run with that permission they passed, confirming the packet’s migration-backed verification route is feasible.

- **Migration:** `NO MIGRATION`; `migrations/0001_authoritative_state.sql` remains blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.
- **Architecture:** unchanged; no telemetry persistence, queue, Worker, cron, Durable Object, KV/R2/cache/vector/FTS system, recovery engine, or external telemetry service.
- **Retry / recovery:** explicit caller/user retry only; automatic authoritative mutation retry, fallback, compensation, rollback, replay, and persistent recovery state are prohibited. Recovery is classification/evidence only.
- **DATA-001:** closed/no-content evidence schema; no user/Knowledge/model/provider/error/SQL/header/credential/free-form metadata fields. Identifier hardening is bounded provenance, not generalized DLP.
- **Human Control / provider:** unchanged and non-authoritative; provider types and private payloads remain adapter-local; ENG-013 retains live qualification.
- **Human Reserved:** `NOT REQUIRED`; all changes preserve already-authoritative outcome truth and have stop conditions for any new Product, Domain, Architecture, security-policy, paid, production, credential, or scope decision.

## 6. Provenance and contradiction audit

Candidate 1 `8baa7808fa3dcd6e0475d9176e124973959d52d7`, Repair 1 `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`, and Repair 2 `49990f306ee67b62ae017f0d63fa556bde06d23a` are present but not ancestors of the planning head. Their implementation blobs, diffs, worktrees, patches, and copied bytes are prohibited Repair-3 inputs. Clean canonical governance, Task Packet revision 2, this DoR, finding dispositions, accepted upstream canonical implementation, and abstract findings are permitted.

No contradiction remains: revision 1 is historical only for the former scope; revision 2 is operative after this result; Repair 3 is ready for Controller dispatch but not authorized or dispatched; Repair 2 is frozen/unaccepted/non-canonical; the proposed nineteen-path lock replaces the historical twelve-path future authority; migration remains absent; Human Reserved remains not required; and automatic recovery/retry remains prohibited.

## 7. Final disposition

All Definition-of-Ready conditions in Delivery Contract revision 1 are satisfied. The revised packet is complete, coherent, minimal, testable, executable, security-safe, and provenance-safe without material Builder guessing.

- **Formal DoR revision 2:** `PASS`
- **READY:** `YES`
- **Repair 3:** `READY FOR CONTROLLER DISPATCH / NOT YET DISPATCHED`
- **Implementation:** `NOT STARTED`
- **Push:** `NOT PERFORMED`
- **Next required role:** `ENG-011 CONTROLLER — REPAIR 3 BUILDER DISPATCH`

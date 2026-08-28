# ENG-011 Repair 2 Security / Operability / Semantic Finding Disposition

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-28

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-2 S/O/S FINDING DISPOSITION / REPAIR-3 READINESS

**Repair-2 dispatch:** `3ac5a39ffa6d891d252dff1ddd47bd0e380cad8b`

**Repair-2 candidate:** `49990f306ee67b62ae017f0d63fa556bde06d23a`

**Repair-2 tree:** `b08c1f9d8ffa579a6cda3ed695293658a3697a81`

**Canonical aggregate:** `6452eec02ebdd5e32c8274da852e501d2d0c1826c485d558354c4ac07b2867f0`

**Deterministic verification:** `PASS` — exact candidate/tree; 18/18 dynamic Vitest configs, 559 tests, full toolchain, local D1, migration identity, path lock, and provenance checks passed

**Independent review:** `FINDINGS` — `ENG-011-R2-SOR-R001` through `R009`, all reported BLOCKING

**Controller outcome:** `REVISED REPAIR-3 SCOPE REQUIRED`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

## 1. Canonical and candidate binding

The canonical branch was verified at commit `3ac5a39ffa6d891d252dff1ddd47bd0e380cad8b`, tree `8caf9feb2ae77486f616ad6c8c42bf6d6a71bed5`, with no tracked or staged changes and exactly the eleven known ENG-009 exploratory files untracked. The local branch is fifteen commits ahead of `origin/foundation/product-foundation` and has no remote-only commit.

Candidate `49990f306ee67b62ae017f0d63fa556bde06d23a` has exactly one parent, the Repair-2 dispatch, and distance one. Its exact twelve-path range and aggregate reproduce the dispatched identity. Candidate 1 `8baa7808fa3dcd6e0475d9176e124973959d52d7` and Repair-1 `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2` are not ancestors.

The deterministic `PASS` remains a candidate-scoped historical fact. It cannot override independently established semantic, security, or operability defects.

## 2. Finding adjudication

### ENG-011-R2-SOR-R001 — ACCEPTED

- **Invariant:** operational identifiers are opaque, runtime-valid, non-content-bearing, and never derived from user text.
- **Actual:** `ObservationContext` is structurally constructible; its identifiers reach orchestration without runtime provenance. The syntax accepts arbitrary alphanumeric/camel-cased text up to 128 characters, including content-like or safely encoded secret material not matched by the finite credential patterns.
- **Evidence:** `operationalEvidence.ts` identifier validator/context constructor; `interactionTypes.ts` public structural context; direct orchestrator consumption.
- **Repair boundary:** runtime-issued/provenance-checked observation context, bounded non-content identifier construction, and fail-closed handling without generalized DLP.
- **Paths:** current observability port, interaction types/orchestrator, and their locked tests.
- **Product/Domain/Architecture:** unchanged.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R002 — ACCEPTED

- **Invariant:** emitted operation identity equals the authoritative operation actually executed; request IDs identify distinct attempts, including the two deletion turns.
- **Actual:** the candidate emits `observationContext.operationId` without comparing it with mutation `input.operationId`; deletion direction and confirmation accept unrelated contexts without enforcing distinct request IDs.
- **Evidence:** mutation and deletion input types and emissions in `interactionOrchestrator.ts`.
- **Repair boundary:** bind/derive emitted operation ID from the authoritative command; reject or omit mismatch; retain correlation while proving a distinct confirmation request through bounded runtime provenance.
- **Paths:** current observability port, interaction types/orchestrator, and tests.
- **Product/Domain/Architecture:** unchanged.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R003 — ACCEPTED

- **Invariant:** applicable provider and retrieval attempt/success/not-found/failure stages are emitted after the actual result and without provider-private or content data.
- **Actual:** successful advisory/proposal model results omit provider success; successful retrieval is generally silent; several retrieval failures/not-found returns in mutation paths are also silent.
- **Evidence:** advisory/proposal result switches and Project/Action/context/progress/Knowledge retrieval branches in `interactionOrchestrator.ts`.
- **Repair boundary:** complete the stage matrix using existing normalized results and optional safe diagnostics only.
- **Paths:** interaction orchestrator and its existing locked tests.
- **Product/Domain/Architecture:** unchanged; provider routing remains outside scope.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R004 — ACCEPTED

- **Invariant:** deletion direction is not confirmed-deletion authorization.
- **Actual:** `initiateDeletion()` emits authorization `succeeded` immediately after first-turn direction classification, before separate confirmation and `ConfirmedDeletionAuthorization` exist.
- **Evidence:** `initiateDeletion()` and `confirmDeletion()` in `interactionOrchestrator.ts`; accepted Human Control and ENG-007 deletion contracts.
- **Repair boundary:** first turn emits direction/proposal/confirmation-required only; authorization success is reserved for successful second-turn confirmed authorization.
- **Paths:** interaction orchestrator and existing locked interaction tests.
- **Product/Domain/Architecture:** unchanged; Human Control remains authoritative.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R005 — ACCEPTED

- **Invariant:** a failure is assigned to persistence only when persistence was attempted and failed; upstream distinctions remain observable.
- **Actual:** ordinary mutation wrappers treat almost every service `failed` result other than operation-ID/constraint conflict as `persistence-durability`, even though services can reject authorization, validation, lifecycle, progress, or Knowledge changes before calling persistence. Clarification and prohibition results can receive no terminal observation.
- **Evidence:** generic result mapping in `interactionOrchestrator.ts`; complete result unions and pre-persistence returns in Project/Action/context/progress and Knowledge services.
- **Repair boundary:** exhaustive closed mapping of visible upstream kinds/reasons; no raw reason emission.
- **Paths:** interaction orchestrator/tests. The existing reason unions are sufficient for failure-stage mapping; R006 separately governs the erased accepted-disposition information.
- **Product/Domain/Architecture:** unchanged.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths except for the R006 result-contract expansion also consumed by the repaired mapping.

| Upstream result class | Actual stage | Safe category/status | Retry disposition | Candidate defect | Required mapping |
| --- | --- | --- | --- | --- | --- |
| input/schema/eligibility rejection | request/interpretation | `validation` or `prohibited-input` | non-retryable | incomplete/inconsistent | preserve exact normalized class |
| Human Control classification/authorization rejection | authorization | `authorization-denied`, clarification, or unresolved | non-retryable | sometimes silent or persistence-like | authorization-stage terminal event |
| retrieval found | retrieval | succeeded | not-applicable | often silent | emit after found result |
| retrieval not-found | retrieval | failed / `not-found` | non-retryable | inconsistent | emit not-found distinctly |
| retrieval-failed | retrieval | failed / `retrieval-failed` | preserve upstream | inconsistent | emit exact retry disposition |
| domain/lifecycle/progress/Knowledge rejection before write | interpretation/application, never persistence | `validation`, `constraint-conflict`, clarification, or prohibition | non-retryable | often `persistence-durability` | map finite reason set without raw reason |
| persistence `constraint-conflict` | persistence | failed / `constraint-conflict` | non-retryable | partly correct | retain |
| persistence `operation-id-conflict` | persistence | failed / `operation-id-conflict` | non-retryable | correct | retain |
| persistence durability failure | persistence | failed / `persistence-durability` | preserve upstream | correct in narrow case | retain only for actual write failure |
| committed / already committed | persistence | accepted / duplicate | not-applicable | distinction erased | preserve service disposition per R006 |
| normalized provider failure | provider | provider category | preserve upstream | present for failures | retain; add success paths |
| export/deletion normalized unions | retrieval/authorization/persistence | existing closed mappings, including indeterminate | preserve upstream/manual-check | mostly present | complete missing branches without inflation |

### ENG-011-R2-SOR-R006 — ACCEPTED

- **Invariant:** `already-committed` remains distinguishable from a fresh `committed` result at the observation boundary without changing accepted Product outcome.
- **A — distinction at orchestrator:** no.
- **B — erasure point:** `ProjectActionContextService.persist()` and `KnowledgeProvenanceService.persist()` map both persistence kinds to identical `{ kind: "accepted", value }`.
- **C — truthful orchestrator reconstruction:** impossible.
- **D — guessing/read workaround:** prohibited; operation-ID inference is not authoritative and a new persistence read is unnecessary, racy, and outside the contract.
- **E — smallest upstream boundary:** preserve a closed commit disposition in the shared accepted-result contract and both service results, then consume it in the orchestrator.
- **Production paths required:**
  1. `src/application/contracts/operations.ts` — define the smallest accepted persistence-disposition contract without changing `kind: "accepted"` or Product value.
  2. `src/application/services/projectActionContext/projectActionContextService.ts` — propagate `committed` versus `already-committed` from the existing persistence result.
  3. `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` — propagate the same distinction.
- **Regression test paths required:**
  1. `tests/application/services/projectActionContext/projectActionContextService.test.ts`
  2. `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts`
  3. `tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts`
  4. `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts`
- **Persistence port/adapter:** unchanged; they already expose the required truth.
- **Product/Domain/Architecture:** unchanged; this is diagnostic preservation of an existing accepted idempotency result.
- **Human Reserved:** not required.
- **Lock:** requires expansion by the exact seven paths above. The original twelve-path lock is insufficient.

### ENG-011-R2-SOR-R007 — ACCEPTED

- **Invariant:** `partial` applies only to an actual success/non-success mixture.
- **Actual:** `handleMixed()` emits `partial`/`mixed-outcome` for every portion array, including all-success and all-failure inputs.
- **Repair boundary:** derive operational aggregate only: all success-family portions -> `succeeded`; actual success/non-success mixture -> `partial`/`mixed-outcome`; no success portions -> retain a homogeneous terminal status where possible, otherwise `failed`/`mixed-outcome`. Portion results and Product `MixedOutcome` remain unchanged.
- **Paths:** interaction orchestrator and existing locked tests.
- **Product/Domain/Architecture:** unchanged; this is diagnostic aggregation only.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R008 — ACCEPTED

- **Invariant:** success evidence follows the operation that establishes success.
- **Actual:** `observeUserInteraction()` schedules user-visible `succeeded` before calling `TrustedInteractionIngress.observeInteraction()`.
- **Evidence:** ordering in `interactionOrchestrator.ts`. Other authoritative mutations emit accepted status after their awaited service result; no broader ordering finding is established beyond the accepted mapping defects above.
- **Repair boundary:** call trusted ingress first; emit terminal success only after it returns successfully.
- **Paths:** interaction orchestrator and existing locked tests.
- **Product/Domain/Architecture:** unchanged.
- **Human Reserved:** not required.
- **Lock:** within the original twelve paths.

### ENG-011-R2-SOR-R009 — ACCEPTED

- **Invariant:** the numbered tests substantively prove the dangerous boundaries rather than only execute.
- **Actual:** the Repair-2 suite omits content-like valid-syntax IDs, trusted context provenance, operation mismatch, distinct deletion attempts, provider success, retrieval found/failure, complete service mappings, Knowledge correction/failure cases, deletion direction authorization timing, valid ordinary duplicate replay, mixed aggregate truth tables, ingress ordering, and a robust prohibited-boundary scan.
- **Repair boundary:** add dedicated R3 tests for every accepted R001-R008 obligation and retain all original TC-01 through TC-21 obligations.
- **Paths:** existing ENG-011 tests plus the four added upstream regression paths identified under R006.
- **Product/Domain/Architecture:** unchanged.
- **Human Reserved:** not required.
- **Lock:** requires the R006 expansion.

## 3. Candidate disposition

Repair-2 candidate `49990f306ee67b62ae017f0d63fa556bde06d23a` is:

`FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`.

It must not be amended, merged, cherry-picked, canonicalized, or used as implementation authority. Its deterministic PASS remains historical evidence; its independent S/O/S result remains `FINDINGS`.

## 4. Write-lock, Task Packet, and readiness disposition

- **Original lock:** exact twelve paths; insufficient because commit disposition is erased upstream.
- **Revised proposed lock:** nineteen exact paths — the original twelve plus the seven R006 paths above.
- **Task Packet:** revision 2 required. Revision 1 remains historical authority for prior executions but cannot authorize the expanded scope.
- **Formal DoR:** revision 1 PASS remains historical for its exact scope; revised Formal DoR is required.
- **READY:** `NO — PENDING REVISED DoR`.
- **Repair 3:** not yet authorized; no Builder, branch, or worktree may be provisioned.
- **Human Reserved:** `NOT REQUIRED`.
- **Migration:** `NO MIGRATION`; `migrations/0001_authoritative_state.sql` remains blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## 5. Repair-3 verification obligations for revised DoR

| Test | Required evidence |
| --- | --- |
| `R3-TC-01` | Runtime-issued observation context provenance; arbitrary structural forgeries fail closed. |
| `R3-TC-02` | Content-like valid-syntax identifiers cannot enter evidence; finite credential fixtures remain excluded without generalized DLP. |
| `R3-TC-03` | Emitted mutation operation ID is the authoritative input operation ID; mismatch cannot misattribute evidence. |
| `R3-TC-04` | Deletion confirmation retains correlation but uses a distinct proven request attempt. |
| `R3-TC-05` | Provider attempt/success/failure are emitted after normalized model results without private data. |
| `R3-TC-06` | Retrieval found/not-found/failure are distinct across advisory/proposal and mutation families. |
| `R3-TC-07` | Complete upstream failure mapping proves pre-persistence rejection is never persistence failure and preserves retry disposition. |
| `R3-TC-08` | First-turn deletion direction emits no authorization success; second-turn confirmed authorization may do so. |
| `R3-TC-09` | Project/Action/context/progress fresh commit versus `already-committed` produce accepted versus duplicate evidence with unchanged Product value. |
| `R3-TC-10` | Knowledge capture/correction fresh commit versus `already-committed` preserve disposition, origin, lineage, and no-content evidence. |
| `R3-TC-11` | Mixed all-success, true-partial, all-failure, and heterogeneous non-success aggregates are truthful while portion results remain unchanged. |
| `R3-TC-12` | Trusted ingress user-visible success is emitted only after successful ingress return. |
| `R3-TC-13` | TC-21 scan is path-complete and robust for prohibited vendors, network, persistence, services, content fields, and architecture hooks. |
| `R3-TC-14` | Original ENG-011 TC-01 through TC-21 remain substantive and pass. |
| `R3-TC-15` | No automatic provider/mutation/deletion retry, fallback, compensation, recovery engine, or persistent recovery state. |
| `R3-TC-16` | Full toolchain, dynamically discovered Vitest configs, local D1, migration identity, path lock, dependency/provider scans, and whitespace pass. |
| `R3-TC-17` | Candidate 1, Repair 1, and Repair 2 are present but not ancestors of Repair 3. |
| `R3-TC-18` | Repair-3 implementation was independently produced from clean canonical governance authority without failed-candidate byte reuse. |

## 6. Repair-3 provenance and next role

A future Repair-3 dispatch must descend from clean canonical governance authority and keep `8baa7808fa3dcd6e0475d9176e124973959d52d7`, `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`, and `49990f306ee67b62ae017f0d63fa556bde06d23a` as `PRESENT_NOT_ANCESTOR`. Failed-candidate implementation blobs, diffs, worktrees, patches, or copied bytes are prohibited implementation inputs. Abstract findings and this disposition are authorized planning inputs.

The next required role is:

`ENG-011 FORMAL DoR — REVISED REPAIR-3 SCOPE`.

No Repair-3 Builder is dispatched, no worktree is provisioned, no implementation is performed, and no push is authorized or performed by this disposition.

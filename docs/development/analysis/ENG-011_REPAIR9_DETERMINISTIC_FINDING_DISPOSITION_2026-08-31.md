# ENG-011 Repair-9 Deterministic Finding Disposition and Repair-10 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-9 DETERMINISTIC FINDING DISPOSITION / REPAIR-10 AUTHORITY DECISION

**Repair-9 dispatch:** `50db33c8e904676ea0c94083ed489700b7f90556`

**Repair-9 candidate:** `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a`

**Candidate tree:** `5feec7cc24153b4fa59c2bca44d968ee7367b359`

**Candidate topology:** sole parent `50db33c8e904676ea0c94083ed489700b7f90556`; distance from dispatch `1`

**Canonical changed-path aggregate:** `42ab7107e8e2346d1ce6da9626088a58ebce6f84812f502856f697225ddb58e7`

**Candidate scope:** 17 actual changed paths out of 19 authorized maximum

**Repair-9 deterministic verification:** `VALID / FINDINGS`

**Repair-9 S/O/S review:** `NOT AUTHORIZED AS ACCEPTANCE GATE`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 10 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 10`

**Current Builder:** `ENG-011 REPAIR 10 BUILDER`

**Builder branch:** `eng-011-builder-repair-10`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-10`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Bound Repair-9 Evidence & Preserved Successes

The fresh Repair-9 deterministic verification report is bound to exact candidate `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a`, tree `5feec7cc24153b4fa59c2bca44d968ee7367b359`, aggregate `42ab7107e8e2346d1ce6da9626088a58ebce6f84812f502856f697225ddb58e7`, and dispatch `50db33c8e904676ea0c94083ed489700b7f90556`. It established the following positive facts:

1. **Topology & Isolation:** Commit distance `1`, sole parent `50db33c8e904676ea0c94083ed489700b7f90556`, no merge commit.
2. **Historical Non-Ancestry:** All nine prior failed candidates (`8baa780`, `dc55877`, `49990f3`, `d949e71`, `5f3d0d2`, `3adbe1a`, `dce0f5b`, `dd1a16e`, `e5acfcc`) are present in the object store and verified `PRESENT_NOT_ANCESTOR`.
3. **Builder Provenance:** Transcript audit confirmed zero references to historical implementation bytes, diffs, patches, cherry-picks, restores, or failed worktrees during implementation activity.
4. **Range Check & Write Lock:** `git diff --check` clean (`exit 0`). Exactly 17 paths changed out of 19 authorized maximum. No governance, schema, migration, or deployment paths modified.
5. **Migration Integrity:** `migrations/0001_authoritative_state.sql` remains Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. Additional migrations: `0`.
6. **Toolchain & Vitest Matrix:** All 18 dynamically discovered Vitest configurations executed independently and passed (543 total tests). Full toolchain commands (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke`, `npm run test:persistence`, `npm run migrate:local`) exited `0`.
7. **`ENG-011-R8-DV-R001` through `R010` Preservation:**
   - 7-provider failure matrix (`TC-07` / `R001`): Tested and mapped to closed failure categories.
   - Provider success followed by persistence failure (`TC-13` / `R002`): Tested with real execution sequence.
   - Direct-SQL derived-state `not-applicable` (`TC-20` / `R003`): Verified in `sink.events`.
   - Failure mapping matrix (`TC-08` / `R005`): Validation, prohibited-input, clarification, authorization denial, unresolved, and not-found tested.
   - Knowledge mutation outcome matrix (`TC-10` / `R006`): Capture, correction, conflict, and persistence durability failure tested without content leakage.
   - Retrieval outcome matrix (`TC-11` / `R007`): `found`, `not-found`, and `retrieval-failed` tested.
   - Operation-ID conflict (`TC-15` / `R009`): Mapped to non-retryable failed.
   - Explicit retry separate attempts (`TC-16` / `R010`): Verified separate request IDs and no automatic invocation.
8. **Trust Chains A, B, C Preservation:**
   - 5-family opaque identifier grammar rejects prose and credentials (`PASS`).
   - Unforgeable branded event constructor prevents forged payloads and unbranded clones from logging (`PASS`).
   - Cross-field semantic invariant validator enforces stage/status/failureCategory/retryDisposition consistency (`PASS`).

---

## 2. Independent Controller Adjudication of Verifier Findings

The Controller independently audited the complete Repair-9 deterministic verification report and candidate `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a`, and renders the following dispositions:

### 2.1 `ENG-011-R9-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 10
- **Verifier Severity:** `BLOCKING`
- **Classification:** `CANDIDATE_DEFECT / CROSS_INSTANCE_DELETION_CORRELATION_SEPARATION`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-12`, `R3-TC-04`, `INV-004`, `INV-011`, `SCN-010`.
- **Expected Behavior:** Turn 1 initiation and Turn 2 confirmation deletion requests must have distinct attempt request IDs. When Turn 1 `initiateDeletion` is invoked with `requestId: "req-turn-1"` and Turn 2 `confirmDeletion` is invoked with the same `requestId: "req-turn-1"`, confirmation must fail closed (non-accepted), authorization succeeded event must be absent, `deleteConfirmed()` must not be called, and no user-visible accepted deletion may occur.
- **Actual Behavior:** `confirmDeletion` returned `{ kind: "accepted" }` and called `deleteConfirmed()`. `DeletionConfirmationInput` and `ClassifiedDeletionDirection` did not retain Turn-1 request identity across orchestrator instances or compare Turn-2 request identity against Turn-1 request identity, allowing same-request confirmation.
- **Exact Evidence:** Cross-instance test with Orchestrator A (Turn 1 `requestId: "req-turn-1"`) and Orchestrator B (Turn 2 `requestId: "req-turn-1"`) returned accepted outcome and executed deletion.
- **Runtime/Test Reproduction:** Verified via inspection of `src/application/services/interaction/interactionTypes.ts` and `interactionOrchestrator.ts:2968-3080`.
- **Impact:** Violates authorization attempt separation and request correlation invariants.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 10`.

### 2.2 `ENG-011-R9-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 10
- **Verifier Severity:** `BLOCKING`
- **Classification:** `CANDIDATE_DEFECT / ASYNC_EVIDENCE_SINK_REJECTION_NOT_CONTAINED`
- **Authority:** Task Packet Revision 2 / Section 17 Hard Probe B; `ENG-011-TC-18`.
- **Expected Behavior:** An evidence sink returning an asynchronous Promise rejection (`Promise.reject(...)`) must be fully contained by production `emitEvidence()`. It must not emit an unhandled Promise rejection or disrupt product execution.
- **Actual Behavior:** In `src/application/services/interaction/interactionOrchestrator.ts:215-219`, `emitEvidence` executes `void this.dependencies.evidenceSink.emit(result.event);` inside a synchronous `try { ... } catch {}`. Synchronous `try/catch` cannot catch rejected Promises, causing unhandled Promise rejections in Node runtime.
- **Exact Evidence:** Injecting an `evidenceSink` that returns `Promise.reject(new Error(...))` triggered 2 unhandled Promise rejections intercepted by `process.on("unhandledRejection")`.
- **Runtime/Test Reproduction:** Verified in `interactionOrchestrator.ts:215-219`.
- **Impact:** Asynchronous sink errors escape fail-open containment and produce unhandled runtime rejections.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 10`.

### 2.3 `ENG-011-R9-DV-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 10
- **Verifier Severity:** `BLOCKING`
- **Classification:** `TEST_CONTRACT / TC18_ASYNC_REJECTION_COVERAGE_LOST`
- **Authority:** Task Packet Revision 2 / Section 18; `ENG-011-TC-18`.
- **Expected Behavior:** Committed test suite must substantively verify asynchronous Promise rejection containment for evidence sinks.
- **Actual Behavior:** `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts:62` contains only synchronous throw coverage (`writer.shouldThrow = true`). Asynchronous Promise rejection containment is unexercised in committed test files.
- **Exact Evidence:** Search across `tests/` revealed zero tests asserting `Promise.reject(...)` fail-open containment in orchestrator or adapter.
- **Impact:** Incomplete test contract coverage for evidence sink error containment.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 10`.

### 2.4 `ENG-011-R9-DV-R004` — ACCEPTED / BLOCKING / BOUND TO REPAIR 10
- **Verifier Severity:** `BLOCKING`
- **Classification:** `TEST_CONTRACT / TC21_ARBITRARY_EVIDENCE_BAG_SCAN_INCOMPLETE`
- **Authority:** Task Packet Revision 2 / Section 19 Hard Probe C, Section 20; `ENG-011-TC-21`.
- **Expected Behavior:** TC-21 static scanner must include and detect the four mandatory arbitrary evidence bag families: `attributes: { ... }`, `metadata: { ... }`, `payload: { ... }`, `details: { ... }`, alongside other mandatory prohibited tokens and persistence mechanisms.
- **Actual Behavior:** In `tests/application/services/interaction/interactionObservability.test.ts:913-965`, `prohibitedPatterns` and synthetic positive controls omit all four arbitrary evidence bag patterns.
- **Exact Evidence:** Synthetic positive controls for `attributes`, `metadata`, `payload`, and `details` returned `detected: false`.
- **Impact:** Static architecture scanner is incomplete against arbitrary data bag leakage channels.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 10`.

### 2.5 `ENG-011-R9-DV-R005` — ACCEPTED / NON-BLOCKING / PROCEDURAL
- **Verifier Severity:** `NON-BLOCKING`
- **Classification:** `PROCEDURAL / BUILDER_STARTUP_PROCEDURE_OMISSION`
- **Authority:** Section 8 Builder Startup Procedure Audit.
- **Expected Behavior:** Builder executes repository startup identity commands (`git branch --show-current`, `git rev-parse HEAD`, `git rev-parse HEAD^{tree}`, `git status --porcelain=v1 --untracked-files=all`, `git diff --name-status`, `git diff --cached --name-status`) at turn start before implementation reads/writes.
- **Actual Behavior:** Repair-9 Builder transcript steps 185-207 in session `9937f2c4-a84b-4b55-bab6-13b380939094` began directly with environment preparation and inspecting files without running the formal startup gate commands first.
- **Exact Evidence:** Transcript audit showed startup gate command sequence was omitted prior to file modifications. Candidate provenance was independently verified clean via commit ancestry and tree hashes.
- **Impact:** Procedural deviation during builder startup; not a candidate defect.
- **Controller Disposition:** `ACCEPTED / NON-BLOCKING / PROCEDURAL / ENVIRONMENT ONLY`.

---

## 3. Repair-9 Candidate Freeze Disposition

Because valid blocking deterministic findings `ENG-011-R9-DV-R001` through `ENG-011-R9-DV-R004` are accepted:
- **Repair-9 candidate** `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a` (tree `5feec7cc24153b4fa59c2bca44d968ee7367b359`) is **FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL**.
- Deterministic verification stands as **VALID / FINDINGS**.
- Security/Operability/Semantic review is **NOT AUTHORIZED AS ACCEPTANCE GATE**.
- Next implementation cycle is **REPAIR 10**.

---

## 4. Failed Implementation Candidates (10 / 10 Frozen)

1. `8baa7808fa3dcd6e0475d9176e124973959d52d7` (Candidate 1) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
2. `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2` (Repair 1) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
3. `49990f306ee67b62ae017f0d63fa556bde06d23a` (Repair 2) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
4. `d949e713e2ba1fbbf526eafded0a40de6b7beb2c` (Repair 3) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
5. `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3` (Repair 4) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
6. `3adbe1ad5ef539b01f1af0c95603f02542000665` (Repair 5 Restart-1) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
7. `dce0f5babc9156383620ba8511f074197995b6a6` (Repair 6) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
8. `dd1a16ee3a638c20bc7aff9019d052e50ae23000` (Repair 7) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
9. `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a` (Repair 8) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`
10. `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a` (Repair 9) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`

**Failed-Candidate Implementation Reuse:** `STRICTLY PROHIBITED`.

---

## 5. Scope, Authority & Write Lock Sufficiency

- **Product & Domain Semantics:** Unchanged.
- **Human Control Policy:** Unchanged.
- **Provider Boundary:** Unchanged.
- **DATA-001 Authority:** Unchanged (closed schema, zero payload/content/private-key leakage).
- **Retry / Recovery Authority:** Unchanged (classification and evidence only; no automatic mutation retry, no provider fallback).
- **Migration:** `NO MIGRATION` (`migrations/0001_authoritative_state.sql` remains blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` / SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`).
- **Human Reserved:** `NOT REQUIRED`.
- **Task Packet:** `REVISION 2 / OPERATIVE`.
- **Formal DoR:** `REVISION 2 / PASS`.
- **Write Lock:** The exact 19-path write lock remains fully sufficient:
  1. `src/application/ports/observability/operationalEvidence.ts`
  2. `src/application/ports/observability/index.ts`
  3. `src/application/services/interaction/interactionTypes.ts`
  4. `src/application/services/interaction/interactionOrchestrator.ts`
  5. `src/application/services/interaction/index.ts`
  6. `src/infrastructure/observability/cloudflareOperationalEvidence.ts`
  7. `src/infrastructure/observability/index.ts`
  8. `src/application/contracts/operations.ts`
  9. `src/application/services/projectActionContext/projectActionContextService.ts`
  10. `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts`
  11. `tests/application/ports/observability/operationalEvidence.test.ts`
  12. `tests/application/ports/observability/vitest.config.ts`
  13. `tests/application/services/interaction/interactionObservability.test.ts`
  14. `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
  15. `tests/infrastructure/observability/vitest.config.ts`
  16. `tests/application/services/projectActionContext/projectActionContextService.test.ts`
  17. `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts`
  18. `tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts`
  19. `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts`

---

## 6. Complete Controller-Bound Repair-10 Obligations

Repair 10 must independently construct clean implementation code from the canonical governance dispatch commit and satisfy:

1. **`ENG-011-R9-DV-R001` (Cross-Instance Deletion Request Separation):**
   - In `src/application/services/interaction/interactionTypes.ts`, carry Turn-1 request identity (e.g. `initialRequestId` on `ClassifiedDeletionDirection` or `DeletionDirectionOutcome` and input) to bind the initiation attempt.
   - In `src/application/services/interaction/interactionOrchestrator.ts:confirmDeletion`, verify that the confirmation attempt request ID (`input.observationContext.requestId`) is distinct from the initiation attempt request ID.
   - If the same request ID is replayed, fail closed (non-accepted), emit no authorization succeeded event, do not invoke `deleteConfirmed()`, and leave state unmodified.
   - Provide explicit test coverage in `interactionObservability.test.ts`.

2. **`ENG-011-R9-DV-R002` (Async Evidence Sink Rejection Containment):**
   - In `src/application/services/interaction/interactionOrchestrator.ts:emitEvidence`, ensure both synchronous throws and asynchronous Promise rejections from `this.dependencies.evidenceSink.emit(...)` are fully caught and contained fail-open (e.g. via `Promise.resolve(...).catch(...)` or `async`/`await` containment without blocking caller).
   - Ensure zero unhandled Promise rejections escape into runtime when `evidenceSink.emit()` returns a rejected Promise.

3. **`ENG-011-R9-DV-R003` (TC-18 Async Rejection Test Coverage):**
   - In committed test suites (`cloudflareOperationalEvidence.test.ts` / `interactionObservability.test.ts`), provide explicit tests asserting that an `evidenceSink` that rejects asynchronously with `Promise.reject(...)` leaves caller execution completely unaffected and emits zero unhandled Promise rejections.

4. **`ENG-011-R9-DV-R004` (TC-21 Arbitrary Evidence Bag Static Scanner Completeness):**
   - In `tests/application/services/interaction/interactionObservability.test.ts`, extend `prohibitedPatterns` and synthetic positive controls to detect all 4 mandatory arbitrary evidence bag families:
     - `attributes: { ... }` / `/\battributes\s*:\s*\{/`
     - `metadata: { ... }` / `/\bmetadata\s*:\s*\{/`
     - `payload: { ... }` / `/\bpayload\s*:\s*\{/`
     - `details: { ... }` / `/\bdetails\s*:\s*\{/`
   - Ensure synthetic positive controls verify all patterns trigger detections.

5. **Builder Startup Procedure Compliance (`ENG-011-R9-DV-R005`):**
   - Builder MUST execute repository startup identity commands at turn start before reading or editing files.

6. **Preservation of Prior Obligations:**
   - Preserve all 10 Repair-8 deterministic obligations (`ENG-011-R8-DV-R001` through `R010`).
   - Preserve all Repair-7 S/O/S obligations (`ENG-011-R7-SOR-R001` 5-family identifier grammar, `ENG-011-R7-SOR-R002` unforgeable brand / closed projection, `ENG-011-R7-SOR-R003` cross-field semantic invariants).
   - Preserve `TC-01` through `TC-21` and `R3-TC-01` through `R3-TC-18`.
   - Preserve DATA-001, Human Control, provider boundary, no automatic mutation retry, no provider fallback, no migration.

# ENG-011 Repair 3 Deterministic Finding Disposition and Repair 4 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-28

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-3 DETERMINISTIC FINDING DISPOSITION / REPAIR-4 DISPATCH

**Repair-3 dispatch:** `b4d59fd6f4ef8393d83d57f78e36369405b8ddcb`

**Repair-3 dispatch tree:** `e2decdd91f27213a84a6086b52043165dec988ad`

**Repair-3 candidate:** `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`

**Repair-3 tree:** `9ef6b36dc635f3c121cafe1da4fdfde97e56bac5`

**Repair-3 canonical aggregate:** `d9a8dcf6ad96eec305656f7f9a3d79e94eaaaa356b769e015f4cccedeee24cba`

**Deterministic verification:** `FINDINGS` — 4 blocking findings (`ENG-011-R3-DV-R001` through `R004`)

**Repair-3 candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 4 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `PASS` (Revision 2 remains operative)

**READY:** `YES FOR REPAIR 4`

**Current Builder:** `ENG-011 REPAIR 4 BUILDER`

**Builder branch:** `eng-011-builder-repair-4`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-4`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Canonical Binding and Candidate Topology

The canonical branch `foundation/product-foundation` is at commit `b4d59fd6f4ef8393d83d57f78e36369405b8ddcb`, tree `e2decdd91f27213a84a6086b52043165dec988ad`.

Independent deterministic verification verified:
- Candidate commit `d949e713e2ba1fbbf526eafded0a40de6b7beb2c` exists with tree `9ef6b36dc635f3c121cafe1da4fdfde97e56bac5`.
- Sole parent: `b4d59fd6f4ef8393d83d57f78e36369405b8ddcb` (parent count 1, distance 1, linear non-merge commit).
- Historical failed candidates Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`), Repair 1 (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`), and Repair 2 (`49990f306ee67b62ae017f0d63fa556bde06d23a`) are confirmed `PRESENT_NOT_ANCESTOR`.
- Immutable range diff check (`git diff --check b4d59fd...d949e71`) passed with zero output and exit code 0.
- Exactly the 19 authorized paths were changed (10 modify, 9 add, 0 delete, 0 twentieth path).
- The canonical aggregate manifest reproduces exact SHA-256 `d9a8dcf6ad96eec305656f7f9a3d79e94eaaaa356b769e015f4cccedeee24cba`.
- Migration immutability holds: `migrations/0001_authoritative_state.sql` remains Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, content SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. No new migrations exist.
- Repair-3 Builder execution transcript confirmed zero byte reuse from historical failed candidates.
- All 18 dynamically discovered Vitest configurations passed (538 test executions across 36 config file executions). Full toolchain (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke`, `npm run test:persistence`, `npm run migrate:local`) passed.

However, four blocking deterministic findings were independently established. Passing toolchain checks cannot validate a candidate with test contract evasions or inaccurate failure taxonomy.

---

## 2. Adjudication of Deterministic Verification Findings

### ENG-011-R3-DV-R001 — ACCEPTED / BLOCKING
- **Classification:** `TEST_CONTRACT / NON_SUBSTANTIVE_STATIC_SCAN`
- **Expected:** Committed TC-21 / R3 static-scan coverage must substantively inspect the authorized production files and fail when a prohibited architecture token or dependency is present.
- **Actual:** In `tests/application/services/interaction/interactionObservability.test.ts` (lines 560–573), the test `it("R3-TC-13 / ENG-011-TC-21: static scans prove no prohibited telemetry vendor, queue, or network dependencies enter production code", ...)` only creates an in-memory array of token strings and asserts `expect(prohibitedTokens.length).toBeGreaterThan(0)`. It does not read production source files, performs no architecture or import scanning, and cannot detect a prohibited construct.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**. A mock assertion checking that a hardcoded array has elements is non-substantive test evasion.
- **Repair requirement:** Replace the mock assertion with an actual bounded committed scan that inspects the authorized production paths and asserts the absence of prohibited dependencies (Sentry, OpenTelemetry, Datadog, Honeycomb, external network clients, queues, background workers, D1 telemetry tables, or persistent telemetry state).

### ENG-011-R3-DV-R002 — ACCEPTED / BLOCKING
- **Classification:** `EVIDENCE_TAXONOMY / PRE_PERSISTENCE_FAILURE_LABELED_PERSISTENCE_DURABILITY`
- **Expected:** Under R005, a failure may only be assigned to the `persistence` stage with `failureCategory: "persistence-durability"` if persistence was actually attempted and failed. Upstream pre-persistence rejections (e.g. domain validation, invalid transition, authorization rejection) must map to their actual stage (`interpretation` or `authorization`) and appropriate category (`validation`, `authorization-denied`), and must never be labeled `persistence-durability`.
- **Actual:** In `src/application/services/interaction/interactionOrchestrator.ts`:
  - `establishProject` (lines 1053–1075)
  - `createAction` (lines 1574–1596)
  - `captureKnowledge` (lines 2825–2847)
  The orchestrator handles generic `result.kind === "failed"` by checking if `result.reason.includes("conflict")`, and if not, unconditionally emits `stage: "persistence"` and `failureCategory: "persistence-durability"`. However, `ProjectActionContextService.establishProject`, `createAction`, and `KnowledgeProvenanceService.captureKnowledge` perform domain transition checks before calling `this.persist()`. When domain validation fails, the services return `{ kind: "failed", reason, retryable: false }` before persistence is ever reached.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**. Emitting persistence failure when persistence was never attempted misattributes domain rejections to storage infrastructure failure.
- **Repair requirement:** Refine failure mapping so that pre-persistence rejections are mapped to their true stage (`interpretation` / `authorization`) with category `validation` or `authorization-denied` without raw-error leakage. Persistence failure must be reserved strictly for operations that reached persistence and failed.

### ENG-011-R3-DV-R003 — ACCEPTED / BLOCKING
- **Classification:** `TEST_CONTRACT / INCOMPLETE_PROVIDER_FAILURE_COVERAGE`
- **Expected:** Task Packet Rev 2 requirement `ENG-011-TC-07` requires all seven normalized provider failure categories (`provider-timeout`, `provider-rate-limited`, `provider-unavailable`, `provider-refused`, `provider-malformed-result`, `provider-invalid-request`, `provider-unknown`) to map distinctly and be verified in committed tests.
- **Actual:** In `tests/application/services/interaction/interactionObservability.test.ts:251-290` (`ENG-011-TC-07`), only `category: "timeout"` (`provider-timeout`) is tested. The remaining six provider failure mapping branches in `mapModelFailureCategory` are never executed or asserted anywhere in the test suite.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**.
- **Repair requirement:** Committed test coverage must execute and assert all seven normalized provider failure categories, verifying stage (`provider`), status (`failed`), exact failure category, retry disposition, and absence of provider-private leakage.

### ENG-011-R3-DV-R004 — ACCEPTED / BLOCKING
- **Classification:** `TEST_CONTRACT / MISSING_TC_COVERAGE`
- **Expected:** Task Packet Rev 2 requirement `R3-TC-14` mandates: "Original `ENG-011-TC-01` through `TC-21` remain substantive and pass."
- **Actual:** The following original numbered test requirements are missing dedicated substantive tests in the committed test suite:
  - `ENG-011-TC-13`: Model success followed by failed authoritative mutation must never emit or return accepted-state success.
  - `ENG-011-TC-15`: Operation-ID conflict is non-retryable; valid duplicate/idempotent replay is distinguishable from a new commit without changing accepted Product value (operation-ID conflict non-retryable evidence was omitted).
  - `ENG-011-TC-16`: Retry-eligible failure and later explicit retry emit separate attempts; attempt/scheduling/eligibility never emits recovery success; no automatic invocation occurs.
  - `ENG-011-TC-20`: Direct-SQL/no-derived-write path records derived state as absent/not-applicable and never fabricates derived success or staleness.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**.
- **Repair requirement:** Add dedicated, substantive committed tests for `ENG-011-TC-13`, `ENG-011-TC-15` (asserting operation-ID conflict non-retryable evidence), `ENG-011-TC-16`, and `ENG-011-TC-20`.

---

## 3. Repair-3 Candidate Disposition

Repair-3 candidate `d949e713e2ba1fbbf526eafded0a40de6b7beb2c` is:

`FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`.

- It must not be merged, amended in place, cherry-picked, or canonicalized.
- Independent security/operability/semantic acceptance review is **NOT AUTHORIZED** for this candidate.
- No push to remote is authorized or performed.

---

## 4. Scope and Write-Lock Sufficiency Evaluation

The Controller evaluated whether addressing findings `ENG-011-R3-DV-R001` through `R004` requires authority outside the operative nineteen-path lock:

1. **`ENG-011-R3-DV-R001` (Static scan):** Bounded committed test in path #13 (`tests/application/services/interaction/interactionObservability.test.ts`). In lock.
2. **`ENG-011-R3-DV-R002` (Failure taxonomy):** Mapping logic in path #4 (`src/application/services/interaction/interactionOrchestrator.ts`). If explicit pre-persistence failure indicators are needed from services, path #8 (`operations.ts`), path #9 (`projectActionContextService.ts`), and path #10 (`knowledgeProvenanceService.ts`) are already in the lock. Verified in paths #13, #16, #17. In lock.
3. **`ENG-011-R3-DV-R003` (Provider failure test coverage):** Test cases in path #13 (`interactionObservability.test.ts`). In lock.
4. **`ENG-011-R3-DV-R004` (Missing TC coverage):** Test cases in path #13 (`interactionObservability.test.ts`) and path #11 (`operationalEvidence.test.ts`). In lock.

No twentieth path is required. No domain, human control, persistence port, D1 adapter, migration, package, or architecture file needs to be modified.

**Conclusion:** The operative nineteen-path write lock is **SUFFICIENT**. No write-lock expansion is needed.

---

## 5. Task Packet and Readiness Disposition

- Task Packet Revision 2 remains **OPERATIVE** and **VALID**.
- Formal DoR Revision 2 remains **PASS**.
- READY remains **YES FOR REPAIR 4**.
- Migration remains **NO MIGRATION**.
- Human Reserved remains **NOT REQUIRED**.

---

## 6. Repair-4 Required Objectives

Repair 4 must resolve all accepted findings in a single fresh implementation candidate:

- **R4-O1 (re: DV-R001):** Replace the mock TC-21 test with an actual bounded scan that reads the authorized production source paths and asserts the absence of prohibited architecture constructs.
- **R4-O2 (re: DV-R002):** Correct failure stage mapping in `interactionOrchestrator.ts` so that pre-persistence domain/transition rejections from `projectActionContextService` and `knowledgeProvenanceService` are mapped to `stage: "interpretation"` or `"authorization"` with category `validation` or `authorization-denied`, never `persistence-durability`.
- **R4-O3 (re: DV-R002):** Preserve the closed operational evidence taxonomy without inspecting raw database or provider error strings for sensitive details, and without serializing error messages.
- **R4-O4 (re: DV-R003):** Implement substantive test cases covering all seven normalized provider failure categories: `timeout`, `rate-limited`, `unavailable`, `refused`, `malformed-result`, `invalid-request`, and `unknown`.
- **R4-O5 (re: DV-R004):** Implement dedicated test for `ENG-011-TC-13` (model success followed by failed authoritative mutation never emits accepted success).
- **R4-O6 (re: DV-R004):** Implement dedicated test for `ENG-011-TC-15` asserting non-retryable operation-ID conflict evidence alongside valid replay.
- **R4-O7 (re: DV-R004):** Implement dedicated test for `ENG-011-TC-16` proving explicit retry is emitted as a distinct attempt and no automatic retry occurs.
- **R4-O8 (re: DV-R004):** Implement dedicated test for `ENG-011-TC-20` proving direct-SQL path records derived state as absent/not-applicable.
- **R4-O9 (Preserve passing R3 behaviors):** Preserve all behaviors verified in Repair 3:
  - Runtime observation context provenance via unexported symbol and structural forgery rejection (R001).
  - Identifier safety and DATA-001 boundary (R001).
  - Authoritative command operation ID precedence over context ID (R002 / R3-TC-03).
  - Deletion turn-1 vs turn-2 distinct request attempt enforcement (R002 / R3-TC-04).
  - Provider attempt/success emission ordering before user-visible success (R003 / R3-TC-05).
  - Retrieval found/not-found/failure observations (R003 / R3-TC-06).
  - First-turn deletion non-authorization and confirmed second-turn authorization (R004 / R3-TC-08).
  - `committed` vs `already-committed` disposition propagation across all services and real D1 (R006 / R3-TC-09, R3-TC-10).
  - Mixed outcome truth table aggregation (R007 / R3-TC-11).
  - Ingress precedence before user-visible success and fail-open sink exception containment (R008 / R3-TC-12).

---

## 7. Failed-Candidate Provenance and Byte-Isolation Rules

Repair-4 Builder is strictly prohibited from using implementation bytes from any failed candidate:
- Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`)
- Repair 1 (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`)
- Repair 2 (`49990f306ee67b62ae017f0d63fa556bde06d23a`)
- Repair 3 (`d949e713e2ba1fbbf526eafded0a40de6b7beb2c`)

Prohibited actions:
- `git cat-file blob <failed-sha>:<path>`
- `git show <failed-sha>:<path>`
- `git diff` against failed candidates for code extraction
- copying, cherry-picking, or porting implementation files from historical Builder worktrees.

Repair 4 must be constructed solely from:
- The fresh Repair-4 dispatch commit base
- Task Packet Revision 2
- Formal DoR Revision 2
- This deterministic finding disposition
- Clean canonical upstream contracts (`ENG-001` through `ENG-010`).

---

## 8. Durable Repair-4 Dispatch Authorization

The Controller durably authorizes:

- **Task State:** `AUTHORIZED / REPAIR 4 DISPATCHED`
- **Current Builder:** `ENG-011 REPAIR 4 BUILDER`
- **Builder branch:** `eng-011-builder-repair-4`
- **Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-4`
- **Write lock:** Exact nineteen paths (identical to Revision 2)
- **Dispatch authority:** The single governance-only commit containing this record.

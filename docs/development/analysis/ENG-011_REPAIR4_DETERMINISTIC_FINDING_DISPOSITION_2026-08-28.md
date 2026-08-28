# ENG-011 Repair 4 Deterministic Finding Disposition and Repair 5 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-28

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-4 DETERMINISTIC FINDING DISPOSITION / REPAIR-5 DISPATCH

**Repair-4 dispatch:** `73277e4e1f0355d322398fec133c83bc24550f3d`

**Repair-4 dispatch tree:** `0f1dbb52832d6432d7c32e2a7bd30d29b67742d4`

**Repair-4 candidate:** `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`

**Repair-4 tree:** `6f2ec94731167460582a1f8c0d3c773364bf6726`

**Repair-4 canonical aggregate:** `ec56f47ddf158860ab06daff494552f08b8facfd643a06b97e9f82da6252c7b5`

**Repair-4 formal verifier gate:** `INVALID / VERIFIER STOP CONDITION VIOLATED`

**Controller candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 5 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `PASS` (Revision 2 remains operative)

**READY:** `YES FOR REPAIR 5`

**Current Builder:** `ENG-011 REPAIR 5 BUILDER RESTART-1`

**Builder branch:** `eng-011-builder-repair-5-restart-1`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-5-restart-1`

**Original Repair-5 Builder:** `SUPERSEDED / UNUSED / NO IMPLEMENTATION / NON-OPERATIVE` (`eng-011-builder-repair-5`, `/private/tmp/prj226-eng011-builder-repair-5` preserved clean)

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Procedural Adjudication of Repair-4 Verifier Run

The attempted Repair-4 deterministic verifier observed:
- `/private/tmp/prj226-eng011-repair4-dv` pre-existed on the filesystem and was registered in `git worktree list`.
- The verifier mandate explicitly required:
  ```
  If path exists:
  STOP.
  Report:
  VERIFIER_ISOLATION_COLLISION
  Do not reuse or delete an unexplained verifier worktree.
  ```
- The executing agent detected the collision and did not reuse or delete the existing worktree, but exceeded its mandate by continuing to execute candidate audit checks via immutable Git-object reads in the canonical repository.

### Controller Adjudication
1. **Formal Gate Invalidation:** The formal verifier execution is ruled **INVALID / STOP CONDITION VIOLATED**. It does not constitute a valid formal deterministic gate pass or failure record.
2. **Procedural Finding `ENG-011-R4-DV-F001` (`ENVIRONMENT / VERIFIER_ISOLATION_COLLISION`):** Confirmed as a procedural environment finding. It is **NOT** an implementation defect of Repair 4 and is **NOT** bound to Repair-5 Builder implementation scope.
3. **Stale Verifier Worktree Inspection and Factual Disposition:**
   - Controller inspected the pre-existing `/private/tmp/prj226-eng011-repair4-dv` worktree.
   - It was bound to Repair-4 candidate `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3` (tree `6f2ec94731167460582a1f8c0d3c773364bf6726`).
   - Its Git tracked and index state was completely clean.
   - Remaining untracked files were temporary verifier execution artifacts (`dist`, `.wrangler`, `node_modules` symlink).
   - During initial Repair-5 dispatch processing, the Controller attempted to clean up those temporary artifacts and remove the worktree registration via `rm` and `git worktree remove`.
   - That removal attempt failed in the execution environment due to sandbox filesystem permission constraints (`Operation not permitted` on temporary files) and presence of untracked files (`fatal: ... contains modified or untracked files, use --force to delete it`).
   - Consequently, `/private/tmp/prj226-eng011-repair4-dv` was not successfully removed; it remains present on the filesystem and registered in `git worktree list` at candidate `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`.
   - The Controller neither succeeded in deleting it nor intentionally preserved it "untouched without action". Without explicit repository authorization to force-delete external worktrees, and to avoid inventing prior success, the exact observed state is durably recorded:
     `STALE / REGISTERED AT 5f3d0d2 / UNCLEANED DUE TO PRIOR SANDBOX PERMISSION FAILURE / PRESERVED AS NON-OPERATIVE`.
   - This uncleaned stale verifier worktree did not mutate candidate Git objects, does not constitute implementation, and has no effect on Repair 5, which operates in separate dedicated worktrees.
   - The original Repair-4 formal verifier run remains **INVALID** because the verifier itself failed to stop upon encountering the pre-existing worktree collision.
4. **Candidate Defect Evidence:** Controller independently inspected candidate commit `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3` from immutable repository Git objects and dispositioned all findings below.

---

## 2. Independent Controller Disposition of Candidate Findings

### R4-CONTROLLER-R001 (re: ENG-011-R4-DV-R001) — ACCEPTED / BLOCKING
- **Classification:** `TEST_CONTRACT / TC13_NON_SUBSTANTIVE_DOWNSTREAM_FAILURE`
- **Authority:** Task Packet Rev 2 line 277 (`ENG-011-TC-13`)
- **Expected:** `ENG-011-TC-13` requires proof that when model/provider execution succeeds and downstream authoritative mutation/persistence fails, no accepted-state success is emitted or returned.
- **Actual:** In `tests/application/services/interaction/interactionObservability.test.ts:479-508`, the test named `"ENG-011-TC-13: preserves provider diagnostics when downstream persistence fails"` configures a proposal model result with `operations: []`, calls only `orchestrator.handleProposal(...)`, and asserts `outcome.kind === "proposed"`. It never performs an authoritative mutation, never configures persistence failure, and never verifies that downstream persistence failure prevents accepted state.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**. A test name cannot substitute for execution.
- **Repair requirement:** Repair 5 must implement a real behavioral sequence: provider success → authoritative mutation attempted → persistence fails → verify provider succeeded event emitted, persistence failed event emitted, persistence accepted event absent, user-visible accepted mutation event absent, and returned Product outcome is truthful failure/non-accepted.

### R4-CONTROLLER-R002 (re: ENG-011-R4-DV-R002) — ACCEPTED / BLOCKING
- **Classification:** `OPERABILITY / DERIVED_STATE_STAGE_NOT_EMITTED` and `TEST_CONTRACT / DERIVED_STATE_OBSERVABILITY_NOT_PROVEN`
- **Authority:** Task Packet Rev 2 line 120, line 284 (`ENG-011-TC-20`)
- **Expected:** Task Packet Rev 2 §In scope mandates: "`derived-state` remains a valid closed stage with `not-applicable` for the current direct-SQL design. ENG-011 must not invent a derived write or emit a false derived success merely to populate the stage." `ENG-011-TC-20` mandates: "Direct-SQL/no-derived-write path records derived state as absent/not-applicable and never fabricates derived success or staleness." Operational evidence must record derived state as absent/not-applicable, and the committed test must assert this operational evidence event.
- **Actual:**
  1. In `src/application/services/interaction/interactionOrchestrator.ts`, there are zero emissions of `stage: "derived-state"`.
  2. In `tests/application/services/interaction/interactionObservability.test.ts:624-651`, `ENG-011-TC-20` only inspects `persistence.commits[0]!.writes[0]` fields passed to the persistence port mock. It never inspects `sink.events` and never asserts any operational evidence event for derived state.
- **Adjudication:** The finding is **ACCEPTED** as **BLOCKING**.
- **Repair requirement:** Emit a bounded operational evidence event: `stage: "derived-state"`, `status: "not-applicable"`, `retryDisposition: "not-applicable"`. Committed TC-20 test must inspect evidence sink events, not merely persistence write shape.

### R4-CONTROLLER-R003 (re: ENG-011-R4-DV-R003) — ACCEPTED / BLOCKING
- **Classification:** `APPLICATION_CONTRACT / OPEN_FAILURE_CATEGORY_ESCAPE_HATCH / OBSERVABILITY_SUPPRESSION`
- **Authority:** Task Packet Rev 2 lines 135–145; Delivery Contract §Boundary
- **Expected:** Failure taxonomy across application boundaries must be a closed, type-safe contract to ensure all failure categories conform to the closed observation taxonomy and are not silently dropped at runtime.
- **Actual:** In `src/application/contracts/operations.ts:37`, `FailedOutcome` defines `readonly failureCategory?: string;`. In `interactionOrchestrator.ts:840`, it performs an unsafe cast `(result.failureCategory as OperationalFailureCategory)`. In `operationalEvidence.ts:347-349`, `createOperationalEvidenceEvent` strictly validates `ALLOWED_FAILURE_CATEGORIES.has(...)` and throws on unapproved strings, which is caught and silently swallowed by `emitEvent`s fail-open handler (`interactionOrchestrator.ts:182-184`), silently dropping required operational evidence without compile-time error.
- **Adjudication:** Reclassified from verifier non-blocking to **ACCEPTED / BLOCKING**. An open string contract permits silent operational evidence suppression.
- **Repair requirement:** Type `FailedOutcome.failureCategory` using a closed compile-time contract (either `OperationalFailureCategory` directly or a closed application-level mirror) rather than `string`. Remove cast-based type bypasses.

### R4-CONTROLLER-R004 (re: ENG-011-R4-DV-R004) — ACCEPTED / BLOCKING
- **Classification:** `TEST_CONTRACT / INCOMPLETE_STATIC_SCAN`
- **Authority:** Task Packet Rev 2 line 285 (`ENG-011-TC-21`), line 307 (`R3-TC-13`)
- **Expected:** The committed static scan `TC-21` must substantively inspect production byte sources for all prohibited constructs, including external telemetry SDKs, queues, background/timer tasks, retry loops, provider fallback/routing, persistent telemetry, new telemetry DB/storage, raw error serialization, Error.message/stack classification, and arbitrary metadata/payload/context-bag escape hatches.
- **Actual:** In `tests/application/services/interaction/interactionObservability.test.ts:257-271`, `PROHIBITED_CONSTRUCTS` scans only 13 tokens. It omits provider fallback/routing, telemetry database persistence queries, `error.message` classification, and arbitrary metadata escape hatches.
- **Adjudication:** Reclassified from verifier non-blocking to **ACCEPTED / BLOCKING**.
- **Repair requirement:** Expand `PROHIBITED_CONSTRUCTS` in `TC-21` to comprehensively cover all applicable Task Packet Rev 2 boundaries while keeping the scan bounded to authorized production files and preserving positive synthetic detection.

### R4-CONTROLLER-R005 (re: ENG-011-R4-DV-R005) — NON-BLOCKING / REPORT-ONLY
- **Classification:** `EVIDENCE / BUILDER_AGGREGATE_FORMAT_MISMATCH`
- **Authority:** Delivery Contract; Task Packet Rev 2
- **Expected:** Canonical manifest format `<SHA256><two ASCII spaces><repo-relative path><LF>` sorted under `LC_ALL=C`.
- **Actual:** Builder reported `fb4155711068a829a87f815b7a7307e187bc20588cbc15d18aaf2366006519a4` using noncanonical `<path>:<sha256>`. Independent recomputation of the 19 changed blob SHA-256 values confirmed canonical aggregate:
  `ec56f47ddf158860ab06daff494552f08b8facfd643a06b97e9f82da6252c7b5`.
- **Adjudication:** **NON-BLOCKING / REPORT-ONLY**. Candidate implementation Git blobs are intact.

---

## 3. Repair-4 Candidate Disposition

Repair-4 candidate `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3` is:

`FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`.

- It must not be merged, amended in place, cherry-picked, or canonicalized.
- Independent security/operability/semantic acceptance review is **NOT AUTHORIZED**.
- No push to remote is authorized or performed.

---

## 4. Scope and Write-Lock Sufficiency Evaluation

All four accepted blocking findings fall strictly within the operative nineteen-path write lock:
1. **R4-CONTROLLER-R001 (TC-13):** Path #13 (`tests/application/services/interaction/interactionObservability.test.ts`). In lock.
2. **R4-CONTROLLER-R002 (TC-20):** Path #4 (`src/application/services/interaction/interactionOrchestrator.ts`) and Path #13 (`interactionObservability.test.ts`). In lock.
3. **R4-CONTROLLER-R003 (Failure category contract):** Path #8 (`src/application/contracts/operations.ts`), Path #4 (`interactionOrchestrator.ts`), Path #9 (`projectActionContextService.ts`), Path #10 (`knowledgeProvenanceService.ts`), and associated tests. In lock.
4. **R4-CONTROLLER-R004 (Static scan):** Path #13 (`interactionObservability.test.ts`). In lock.

No twentieth path is required. No domain, human control, persistence port, D1 adapter, migration, package, or architecture file needs to be modified.

**Conclusion:** The operative nineteen-path write lock is **SUFFICIENT**. No write-lock expansion or Task Packet revision 3 is required.

---

## 5. Task Packet and Readiness Disposition

- Task Packet Revision 2 remains **OPERATIVE** and **VALID**.
- Formal DoR Revision 2 remains **PASS**.
- READY remains **YES FOR REPAIR 5**.
- Migration remains **NO MIGRATION**.
- Human Reserved remains **NOT REQUIRED**.

---

## 6. Repair-5 Required Objectives

Repair 5 must resolve all four accepted blocking findings in a single fresh implementation candidate:

- **R5-O1 (re: R4-CONTROLLER-R001):** Implement substantive test execution for `ENG-011-TC-13` where provider succeeds, downstream authoritative mutation/persistence fails, and assertions prove provider success was recorded, persistence failure was recorded, accepted state was omitted, and non-acceptance was returned.
- **R5-O2 (re: R4-CONTROLLER-R002):** Emit bounded `derived-state` operational evidence (`stage: "derived-state"`, `status: "not-applicable"`, `retryDisposition: "not-applicable"`) in `interactionOrchestrator.ts`. Implement substantive assertion in `ENG-011-TC-20` inspecting `sink.events`.
- **R5-O3 (re: R4-CONTROLLER-R003):** Close the `failureCategory` contract in `operations.ts` to prevent unvalidated strings from bypassing compile-time safety and being silently dropped by runtime validation. Remove unsafe casts in `interactionOrchestrator.ts`.
- **R5-O4 (re: R4-CONTROLLER-R004):** Expand `PROHIBITED_CONSTRUCTS` in `TC-21` to cover provider fallback, persistent telemetry storage queries, raw error message classification, and arbitrary metadata escape hatches.
- **R5-O5 (Preserve all verified passing behaviors):** Preserve all passing behaviors verified in Repair 3 and Repair 4 (observation context provenance, identifier safety, command operation ID precedence, two-turn deletion distinct request attempts, 7 provider failure mappings, pre-persistence vs persistence failure taxonomy, disposition propagation, mixed outcome truth table, Cloudflare console emitter, and fail-open sink containment).

---

## 7. Failed-Candidate Provenance and Byte-Isolation Rules

Repair-5 Builder is strictly prohibited from using implementation bytes from any historical failed candidate:
- Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`)
- Repair 1 (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`)
- Repair 2 (`49990f306ee67b62ae017f0d63fa556bde06d23a`)
- Repair 3 (`d949e713e2ba1fbbf526eafded0a40de6b7beb2c`)
- Repair 4 (`5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`)

Prohibited actions:
- `git cat-file blob <failed-sha>:<path>`
- `git show <failed-sha>:<path>`
- `git diff` against failed candidates for code extraction
- Copying, cherry-picking, or porting implementation files from historical Builder worktrees.

Repair 5 must be constructed solely from:
- The fresh Repair-5 dispatch commit base
- Task Packet Revision 2
- Formal DoR Revision 2
- This deterministic finding disposition
- Clean canonical upstream contracts (`ENG-001` through `ENG-010`).

---

## 8. Durable Repair-5 Dispatch Authorization and Restart-1

The Controller durably records and authorizes:
- **Original Repair-5 Dispatch:** `0af56e186b44396f524183125e5d053ea41e876e`
- **Original Builder Provisioning:** `SUPERSEDED / UNUSED / NO IMPLEMENTATION / NON-OPERATIVE` (`eng-011-builder-repair-5` at `/private/tmp/prj226-eng011-builder-repair-5` preserved clean)
- **Repair-5 Restart-1:** `AUTHORIZED / DURABLY DISPATCHED`
- **Task State:** `AUTHORIZED / REPAIR 5 DISPATCHED (RESTART-1)`
- **Current Builder:** `ENG-011 REPAIR 5 BUILDER RESTART-1`
- **Builder branch:** `eng-011-builder-repair-5-restart-1`
- **Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-5-restart-1`
- **Write lock:** Exact nineteen paths (unchanged from Revision 2)
- **Dispatch authority:** The single governance-only correction commit containing this record.

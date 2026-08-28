# ENG-011 Candidate 1 Typecheck Finding Disposition and Repair 1 Authorization

**Artifact class:** ANALYSIS / GOVERNANCE

**Lifecycle status:** APPROVED

**Task ID:** `ENG-011`

**Candidate 1 commit:** `8baa7808fa3dcd6e0475d9176e124973959d52d7`

**Candidate 1 tree:** `c31614ff730ae95e20f684c24e9567541bd1ddca`

**Candidate 1 sole parent:** `685c2e836db8464261fe3a2c2c0b14990eda3871`

**Candidate 1 parent count:** `1`

**Candidate 1 distance:** `1`

**Canonical candidate aggregate:** `dd99fcdd6c70f9f60e7718afaef6a7d88968aee526639903330f61fa05324381`

**Task Packet:** [ENG-011 — Observability and Failure/Recovery Hardening](../tasks/ENG-011-observability-failure-recovery-hardening.md) (Revision 1)

**Formal DoR:** [Revision 1](ENG-011_FORMAL_DoR_REV1_2026-08-27.md) — `PASS`

**Date:** `2026-08-28`

---

## 1. Candidate 1 Identity & Aggregate Reconciliation

Candidate 1 was produced under branch `eng-011-builder-restart-1` at commit `8baa7808fa3dcd6e0475d9176e124973959d52d7` with tree `c31614ff730ae95e20f684c24e9567541bd1ddca`, having sole parent `685c2e836db8464261fe3a2c2c0b14990eda3871` (parent count: 1, distance: 1).

The candidate commit changed exactly the 12 authorized paths (9 added, 3 modified, 0 unexpected).

The canonical aggregate manifest was independently recomputed from candidate blob content bytes sorted with `LC_ALL=C`:
- `0d3bddf9f362c968e0b99e02cd4d57497aba8a2b90630c75e9f333cac933a469  src/application/ports/observability/index.ts`
- `472e9ba7ab7c5070e191a494933ed9f128517ec9193eb841385cce3f44d925ed  src/application/ports/observability/operationalEvidence.ts`
- `98184a6d2b5951f4da89e11dbc58443ca720f307e08d86c9c151a38210abbeb0  src/application/services/interaction/index.ts`
- `896b33f0d8f2c0e517d51eb2896a823a02bab4f5d403adf590d52237d93e3f74  src/application/services/interaction/interactionOrchestrator.ts`
- `8d13a5a8bad1c9251c5c361657278bbcba5cc3d25fd4cafeee1c09735dcb52e0  src/application/services/interaction/interactionTypes.ts`
- `40768549f8c6b55bc251c1be8a0c161e16d96ab184549d6220c87f6bdf0ead11  src/infrastructure/observability/cloudflareOperationalEvidence.ts`
- `aa51909d343b6cd0e85f93af9e09023220b1cac1814f2240dcd8fa93d7fca611  src/infrastructure/observability/index.ts`
- `7d67cc03644cdc135867c94564146d950fa45459683f47a85461150cfbd46ce1  tests/application/ports/observability/operationalEvidence.test.ts`
- `4bdb0211023985e0f6dd906b2da80de703a92d76c2eeba5ab834f0d3a421681a  tests/application/ports/observability/vitest.config.ts`
- `773582c31c24803952f1c739b190ca3c4bd1d24fc34df3c576ec4e0b96f55e0c  tests/application/services/interaction/interactionObservability.test.ts`
- `bf1e1aa601b1a8a0b7b3a6f6a46941073939ca7302ff67b137fd5ce379619498  tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
- `ba31cb094819cc387e9dff1cd17f339ab44fb59032c1931ca9fd33c5795c2b3b  tests/infrastructure/observability/vitest.config.ts`

**Canonical Aggregate SHA-256:** `dd99fcdd6c70f9f60e7718afaef6a7d88968aee526639903330f61fa05324381`

The previously reported Builder aggregate (`3c044859ab770b8534ce07a115e33ea29b3bfd7dd937517842d4fd8e0c99634b`) resulted from non-canonical `<path>:<digest>` serialization rather than `<SHA256>  <path>\n`. The underlying blob content SHA-256 values are confirmed identical.
**Disposition:** `BUILDER_REPORT_EVIDENCE_MISMATCH_ONLY / NON-BLOCKING / CLOSED`.

---

## 2. Independent Reproduction of Finding ENG-011-C1-DV-R001

A fresh, isolated, detached candidate worktree (`/private/tmp/prj226-eng011-candidate1-controller-check`) was provisioned at `8baa7808fa3dcd6e0475d9176e124973959d52d7`.

Executing `npm run typecheck` (`tsc --noEmit`) reproduced the failure with exit code 2:
```text
tests/application/ports/observability/operationalEvidence.test.ts(150,48): error TS2304: Cannot find name 'OperationalStage'.
tests/application/ports/observability/operationalEvidence.test.ts(157,63): error TS2304: Cannot find name 'OperationCategory'.
tests/application/ports/observability/operationalEvidence.test.ts(164,50): error TS2304: Cannot find name 'OperationalStatus'.
tests/application/ports/observability/operationalEvidence.test.ts(171,65): error TS2304: Cannot find name 'RetryDisposition'.
```

The check worktree was subsequently deprovisioned and removed without mutation of candidate objects.

---

## 3. Finding Classification & Root Cause

- **Finding ID:** `ENG-011-C1-DV-R001`
- **Severity:** `BLOCKING`
- **Classification:** `TOOLCHAIN / TYPECHECK / TEST_COMPILE_CONTRACT`
- **Invariant:** All mandatory toolchain checks must PASS for an implementation candidate.
- **Expected:** `npm run typecheck` exits 0.
- **Actual:** `npm run typecheck` exits 2.
- **Root Cause Analysis:**
  In candidate commit `8baa7808fa3dcd6e0475d9176e124973959d52d7`, `src/application/ports/observability/operationalEvidence.ts` defines and exports:
  - `export type OperationalStage = ...`
  - `export type OperationCategory = ...`
  - `export type OperationalStatus = ...`
  - `export type RetryDisposition = ...`
  In `tests/application/ports/observability/operationalEvidence.test.ts`, lines 150, 157, 164, and 171 cast invalid test inputs to these types (`as unknown as OperationalStage`, etc.) to test runtime schema rejection. However, the top-level import statement at lines 2-7 omitted importing these four type names.
- **Smallest Correct Repair:**
  Import the four type names (`type OperationalStage, type OperationCategory, type OperationalStatus, type RetryDisposition`) in `tests/application/ports/observability/operationalEvidence.test.ts` so that `tsc --noEmit` compiles cleanly while preserving the substantive invalid-enum tests.

---

## 4. Candidate 1 Disposition

- Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`) is **FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL**.
- Candidate 1 failed a mandatory toolchain gate (`npm run typecheck`).
- Candidate 1 must **NEVER** enter the ancestry of accepted Repair 1.
- No amendment, rebase, cherry-pick, or merge of Candidate 1 is permitted.

---

## 5. Task Packet Rev1 and Formal DoR Validity

- **Task Packet Rev1:** Remains completely valid. The defect is an omitted type import in a test file and does not require product, domain, architectural, or recovery scope changes.
- **Formal DoR:** `PASS`. `ENG-011-DOR-R001` through `R006` remain closed.
- **READY:** `YES`.
- **Human Reserved:** `NOT REQUIRED`.
- **12-Path Write Lock:** Remains sufficient and unchanged.
- **Migration:** `NO MIGRATION`. Migration `migrations/0001_authoritative_state.sql` remains locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

---

## 6. Repair 1 Authorization & Objectives

Repair 1 is hereby **AUTHORIZED**.

### Repair-1 Objectives
- **R1-O1:** All observability test source compiles under repository typecheck (`tsc --noEmit`).
- **R1-O2:** `OperationalStage` reference is imported and typed correctly in tests.
- **R1-O3:** `OperationCategory` reference is imported and typed correctly in tests.
- **R1-O4:** `OperationalStatus` reference is imported and typed correctly in tests.
- **R1-O5:** `RetryDisposition` reference is imported and typed correctly in tests.
- **R1-O6:** The intended invalid-enum runtime validation tests remain substantive and are not deleted or weakened.
- **R1-O7:** All Candidate 1 passing behaviors (18 Vitest configs, 576 tests, lint, build, smoke, local D1) are preserved.

### Repair-1 Test Contract
- **R1-TC-01:** `npm run typecheck` exits 0.
- **R1-TC-02:** `operationalEvidence.test.ts` still tests invalid `OperationalStage` handling.
- **R1-TC-03:** `operationalEvidence.test.ts` still tests invalid `OperationCategory` handling.
- **R1-TC-04:** `operationalEvidence.test.ts` still tests invalid `OperationalStatus` handling.
- **R1-TC-05:** `operationalEvidence.test.ts` still tests invalid `RetryDisposition` handling.
- **R1-TC-06:** `ENG-011-TC-01` through `TC-21` remain substantive and PASS.
- **R1-TC-07:** All dynamically discovered Vitest configs PASS.
- **R1-TC-08:** `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke` all PASS.
- **R1-TC-09:** Exact immutable `Repair-1 dispatch...candidate` diff-check passes with exit code 0 and empty output.
- **R1-TC-10:** Candidate 1 is NOT in the ancestry of the Repair-1 candidate commit.

---

## 7. Lineage Invariant & Worktree Protection

- **Repair-1 Dispatch Parent:** Direct child of clean canonical governance authority (`685c2e836db8464261fe3a2c2c0b14990eda3871`).
- **Candidate 1 Non-Ancestry:** Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`) is present in repository object storage but is NOT an ancestor of Repair 1 dispatch or candidate.
- **Original Contaminated Worktree:** `/private/tmp/prj226-eng011-builder` remains untouched as inert forensic evidence (`ABORTED / STARTUP CONTAMINATED / NO CANDIDATE / NON-OPERATIVE`).
- **Restart-1 Builder Worktree:** `/private/tmp/prj226-eng011-builder-restart-1` remains preserved as historical candidate evidence.
- **ENG-009 Exploratory Files:** All 11 exploratory files in the main worktree remain untracked, unstaged, and byte-identical.

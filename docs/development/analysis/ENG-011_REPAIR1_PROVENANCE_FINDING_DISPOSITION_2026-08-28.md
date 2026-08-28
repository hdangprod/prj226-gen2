# ENG-011 Repair 1 Provenance Finding Disposition and Repair 2 Authorization

**Artifact class:** ANALYSIS / GOVERNANCE

**Lifecycle status:** APPROVED

**Task ID:** `ENG-011`

**Repair-1 candidate commit:** `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`

**Repair-1 candidate tree:** `a7d99a9bee493c7c279f7ca4e137a96bba0da6bc`

**Repair-1 candidate sole parent:** `616fc2c1f9282ef5e1f620ef6156adf28453e4c4`

**Repair-1 candidate parent count:** `1`

**Repair-1 candidate distance:** `1`

**Repair-1 canonical candidate aggregate:** `0a9cd25fa8c2a2830c4095b1fbf1a67bc6f93bbf1358052d284e151a77d4a179`

**Failed Candidate 1 commit:** `8baa7808fa3dcd6e0475d9176e124973959d52d7`

**Failed Candidate 1 tree:** `c31614ff730ae95e20f684c24e9567541bd1ddca`

**Task Packet:** [ENG-011 — Observability and Failure/Recovery Hardening](../tasks/ENG-011-observability-failure-recovery-hardening.md) (Revision 1)

**Formal DoR:** [Revision 1](ENG-011_FORMAL_DoR_REV1_2026-08-27.md) — `PASS`

**Date:** `2026-08-28`

---

## 1. Repair-1 Candidate Identity & Technical Evidence Summary

Repair 1 candidate was produced under branch `eng-011-builder-repair-1` at commit `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2` with tree `a7d99a9bee493c7c279f7ca4e137a96bba0da6bc`, having sole parent `616fc2c1f9282ef5e1f620ef6156adf28453e4c4` (parent count: 1, distance: 1).

The candidate commit changed exactly the 12 authorized paths (9 added, 3 modified, 0 unexpected).

The canonical aggregate manifest was independently computed from candidate blob content bytes sorted with `LC_ALL=C`:
- `8e3c0dbea146a2e62c08c6886d4d7239cfeebe80  src/application/ports/observability/index.ts`
- `726bc30c02a71c0c2f253a1f2170a77cac353edc  src/application/ports/observability/operationalEvidence.ts`
- `8ac0e512f18e94eff22b0dd23b87f2410b924acf  src/application/services/interaction/index.ts`
- `f235493ead0086abbc69537b2a4423c5035b9372  src/application/services/interaction/interactionOrchestrator.ts`
- `70c756a3331b99f02dda20bc7880f91fb6604395  src/application/services/interaction/interactionTypes.ts`
- `056533d9a686811f943d1a59517e81826d52b9c6  src/infrastructure/observability/cloudflareOperationalEvidence.ts`
- `b1b28798da6b8a33425164aa0806d155ae09d800  src/infrastructure/observability/index.ts`
- `7db55b0c6ab4084346c219eaa823964009733f41  tests/application/ports/observability/operationalEvidence.test.ts`
- `1ee580b80d02ebde3fe05d1afb73c1fd699b3908  tests/application/ports/observability/vitest.config.ts`
- `e8c9471c0fda916b41920ea9e8c2f26253bf45fe  tests/application/services/interaction/interactionObservability.test.ts`
- `b60b56dfb50606157ae90c8e89db6298d3206519  tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
- `1b74f81ad19f45d3c040a39ff5cbc1f646564f39  tests/infrastructure/observability/vitest.config.ts`

**Repair-1 Canonical Aggregate SHA-256:** `0a9cd25fa8c2a2830c4095b1fbf1a67bc6f93bbf1358052d284e151a77d4a179`

### Technical Verification Summary
- exact 12-path lock: PASS
- immutable range diff-check: PASS
- canonical aggregate: `0a9cd25fa8c2a2830c4095b1fbf1a67bc6f93bbf1358052d284e151a77d4a179`
- typecheck (`tsc --noEmit`): PASS
- all 18 Vitest configs: PASS
- 576 test executions: PASS
- npm test: PASS
- lint: PASS
- build: PASS
- smoke: PASS
- migration: UNCHANGED (`5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` / `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`)
- Candidate-1 Git ancestry: EXCLUDED (`616fc2c1f9282ef5e1f620ef6156adf28453e4c4` sole parent)

These technical results do NOT override provenance authority. Candidate acceptance integrity requires clean execution provenance; passing tests cannot validate a candidate constructed from unauthorized source material.

---

## 2. Reproduction of Provenance Violation from Execution Evidence

A byte-provenance audit was conducted across the execution evidence of Repair-1 Builder.

### Commanded Execution Pattern
The Repair-1 Builder executed commands materially equivalent to:
```sh
git show 8baa7808fa3dcd6e0475d9176e124973959d52d7:src/application/ports/observability/operationalEvidence.ts
git cat-file blob 8baa7808fa3dcd6e0475d9176e124973959d52d7:src/application/ports/observability/operationalEvidence.ts
```
and directly wrote those implementation bytes into the Repair-1 worktree (`/private/tmp/prj226-eng011-builder-repair-1`).

### Direct Candidate-1 Blob Match Audit
Comparison of Git blob object identifiers between Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`) and Repair 1 (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`) establishes that 8 of the 12 locked paths are 100% byte-for-byte identical:

| Path | Candidate 1 Blob | Repair 1 Blob | Byte-for-Byte Identical |
| --- | --- | --- | --- |
| `src/application/ports/observability/index.ts` | `8e3c0dbea146a2e62c08c6886d4d7239cfeebe80` | `8e3c0dbea146a2e62c08c6886d4d7239cfeebe80` | **YES** |
| `src/application/services/interaction/interactionTypes.ts` | `70c756a3331b99f02dda20bc7880f91fb6604395` | `70c756a3331b99f02dda20bc7880f91fb6604395` | **YES** |
| `src/application/services/interaction/interactionOrchestrator.ts` | `f235493ead0086abbc69537b2a4423c5035b9372` | `f235493ead0086abbc69537b2a4423c5035b9372` | **YES** |
| `src/application/services/interaction/index.ts` | `8ac0e512f18e94eff22b0dd23b87f2410b924acf` | `8ac0e512f18e94eff22b0dd23b87f2410b924acf` | **YES** |
| `src/infrastructure/observability/cloudflareOperationalEvidence.ts` | `056533d9a686811f943d1a59517e81826d52b9c6` | `056533d9a686811f943d1a59517e81826d52b9c6` | **YES** |
| `src/infrastructure/observability/index.ts` | `b1b28798da6b8a33425164aa0806d155ae09d800` | `b1b28798da6b8a33425164aa0806d155ae09d800` | **YES** |
| `tests/application/services/interaction/interactionObservability.test.ts` | `e8c9471c0fda916b41920ea9e8c2f26253bf45fe` | `e8c9471c0fda916b41920ea9e8c2f26253bf45fe` | **YES** |
| `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts` | `b60b56dfb50606157ae90c8e89db6298d3206519` | `b60b56dfb50606157ae90c8e89db6298d3206519` | **YES** |

The remaining 4 paths had only trivial delta edits applied directly over Candidate-1 bytes:
- `src/application/ports/observability/operationalEvidence.ts`: 1 character change (`value.length < 1` -> `value.length === 0`).
- `tests/application/ports/observability/operationalEvidence.test.ts`: 4 lines added importing the types needed for `tsc --noEmit`.
- `tests/application/ports/observability/vitest.config.ts`: 1 line removed (`environment: "node"`).
- `tests/infrastructure/observability/vitest.config.ts`: 1 line removed (`environment: "node"`).

This audit conclusively proves that Candidate-1 implementation bytes were copied wholesale into Repair 1 rather than reconstructed from clean governance authority.

---

## 3. Prior Repair-1 Authority Confirmation

The Repair-1 dispatch authority ([ENG-011 Candidate 1 Typecheck Finding Disposition and Repair 1 Authorization](ENG-011_CANDIDATE1_TYPECHECK_FINDING_DISPOSITION_2026-08-28.md)) explicitly established:
- Candidate 1 must not enter accepted ancestry;
- Repair 1 must be produced from clean governance authority (`616fc2c1f9282ef5e1f620ef6156adf28453e4c4`);
- Candidate-1 implementation bytes must not be treated as canonical source;
- No wholesale Candidate-1 patch/file reconstruction;
- Fresh complete implementation under Task Packet Rev1.

The boundary distinction is vital:
- READ-ONLY inspection to understand a finding is permitted;
- COPYING Candidate-1 implementation bytes to construct the new candidate violates repair execution provenance.

---

## 4. Finding Classification & Disposition

- **Finding ID:** `ENG-011-R1-DV-R001`
- **Severity:** `BLOCKING`
- **Classification:** `EXECUTION_PROVENANCE / FAILED_CANDIDATE_BYTE_REUSE / REPAIR_LINEAGE_INTEGRITY`
- **Invariant:** A failed immutable candidate may not be reused as implementation authority for a fresh repair candidate when the repair dispatch explicitly requires reconstruction from clean governance authority.
- **Expected:** Repair-1 implementation independently constructed from `616fc2c1f9282ef5e1f620ef6156adf28453e4c4` plus durable Task Packet and upstream canonical authority.
- **Actual:** Repair-1 Builder read Candidate-1 implementation blobs and wrote those bytes into the Repair-1 worktree, then patched the failing test imports.
- **Impact:** Git ancestry topology is formally clean, but implementation provenance is compromised by direct reuse of unaccepted implementation bytes. Candidate acceptance integrity cannot be established.
- **Implementation semantic defect:** `NOT ESTABLISHED`
- **Execution provenance defect:** `ESTABLISHED`
- **Human Reserved:** `NOT REQUIRED`

---

## 5. Candidate Dispositions

### Repair-1 Candidate Disposition
- Repair-1 candidate (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`) is **FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL**.
- Do NOT send it to deterministic verifier.
- Do NOT send it to semantic/security/operability review.
- Do NOT amend it.
- Do NOT cherry-pick it.

### Candidate-1 Typecheck Finding Disposition
- Finding `ENG-011-C1-DV-R001` was technically addressed in Repair 1, but is **NOT independently closable for acceptance** because the Repair-1 candidate itself is invalidated by the provenance violation.
- Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`) remains **FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL**.

---

## 6. Task Packet Rev1 and Formal DoR Validity

- **Task Packet Rev1:** Remains completely valid. No Product, Domain, Architecture, or Recovery scope defect is established. Task Packet Revision 2 is `NOT REQUIRED`.
- **Formal DoR:** `PASS`. `ENG-011-DOR-R001` through `R006` remain closed.
- **READY:** `YES`.
- **Human Reserved:** `NOT REQUIRED`.
- **12-Path Write Lock:** Remains sufficient and unchanged.
- **Migration:** `NO MIGRATION`. Migration `migrations/0001_authoritative_state.sql` remains locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

---

## 7. Repair 2 Objectives & Clean Authority

Repair 2 is hereby **AUTHORIZED**.

Repair 2 must produce a completely fresh implementation candidate from clean governance authority satisfying:
1. Task Packet Rev1;
2. Candidate-1 typecheck repair requirements (`ENG-011-C1-DV-R001`);
3. Strict implementation provenance isolation from BOTH historical failed candidates (`8baa7808fa3dcd6e0475d9176e124973959d52d7` and `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`).

### Clean Base Authority
- Parent commit: `616fc2c1f9282ef5e1f620ef6156adf28453e4c4` (sole parent of Repair 2 dispatch).
- Both failed candidates (`8baa7808...` and `dc558777...`) must remain `PRESENT_NOT_ANCESTOR`.

---

## 8. Strict Repair-2 Provenance Rule

The Repair-2 Builder MUST NOT access implementation blobs or diffs from either failed candidate.

### Specifically Prohibited Actions / Sources
- `git show 8baa7808...:<path>`
- `git show dc558777...:<path>`
- `git cat-file blob 8baa7808...:<path>`
- `git cat-file blob dc558777...:<path>`
- `git diff ...8baa7808...` for implementation reconstruction
- `git diff ...dc558777...` for implementation reconstruction
- checkout from either candidate
- cherry-pick
- format-patch / git apply
- cp / rsync from prior worktrees
- copy/paste from failed candidate worktrees.

### Authorized Read Sources
The Repair-2 Builder may read only:
1. Canonical clean base (`foundation/product-foundation`);
2. Task Packet / DoR / finding-disposition governance artifacts;
3. Accepted upstream canonical implementations (`ENG-001` through `ENG-010`);
4. Abstract finding descriptions in governance documents.

For understanding the typecheck defect, use the governance finding artifact description:
- Missing imports in `tests/application/ports/observability/operationalEvidence.test.ts`:
  - `OperationalStage`
  - `OperationCategory`
  - `OperationalStatus`
  - `RetryDisposition`
Do NOT inspect the failed test blob itself.

---

## 9. Exact 12-Path Write Lock

The 12-path write lock is unchanged and strictly enforced:

### Production Paths
1. `src/application/ports/observability/operationalEvidence.ts`
2. `src/application/ports/observability/index.ts`
3. `src/application/services/interaction/interactionTypes.ts`
4. `src/application/services/interaction/interactionOrchestrator.ts`
5. `src/application/services/interaction/index.ts`
6. `src/infrastructure/observability/cloudflareOperationalEvidence.ts`
7. `src/infrastructure/observability/index.ts`

### Test/Config Paths
8. `tests/application/ports/observability/operationalEvidence.test.ts`
9. `tests/application/ports/observability/vitest.config.ts`
10. `tests/application/services/interaction/interactionObservability.test.ts`
11. `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`
12. `tests/infrastructure/observability/vitest.config.ts`

No path expansion is authorized.

---

## 10. Repair-2 Test Obligations

### Retained Requirements
- All Task Packet test cases `ENG-011-TC-01` through `TC-21` must be satisfied.
- Substantive runtime validation for invalid enum inputs must be preserved:
  - `OperationalStage` invalid runtime value rejected;
  - `OperationCategory` invalid runtime value rejected;
  - `OperationalStatus` invalid runtime value rejected;
  - `RetryDisposition` invalid runtime value rejected;
  - `npm run typecheck` PASS;
  - all tests substantive.

### Repair-2 Provenance Obligations
- **R2-TC-01:** Candidate 1 (`8baa7808fa3dcd6e0475d9176e124973959d52d7`) is NOT an ancestor of Repair 2.
- **R2-TC-02:** Repair-1 candidate (`dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`) is NOT an ancestor of Repair 2.
- **R2-TC-03:** No failed-candidate implementation blob accessed or reused.
- **R2-TC-04:** Exact 12-path candidate (no more, no fewer).
- **R2-TC-05:** `npm run typecheck` PASS.
- **R2-TC-06:** All discovered Vitest configs PASS.
- **R2-TC-07:** Full npm toolchain PASS (`npm test`, `npm run lint`, `npm run build`, `npm run smoke`).
- **R2-TC-08:** Exact `dispatch...candidate` diff-check PASS.
- **R2-TC-09:** Migration unchanged.
- **R2-TC-10:** Invalid-enum runtime rejection tests remain substantive.

---

## 11. Worktree & Artifact Preservations

- `/private/tmp/prj226-eng011-builder` preserved as inert forensic evidence.
- `/private/tmp/prj226-eng011-builder-restart-1` preserved as historical candidate evidence.
- `/private/tmp/prj226-eng011-builder-repair-1` preserved as historical candidate evidence.
- All 11 known `ENG-009` exploratory files remain untracked, unstaged, and byte-identical.
- Push is NOT authorized and NOT performed.

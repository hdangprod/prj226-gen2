# ENG-011 — Observability and Failure/Recovery Hardening Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE / REPAIR 6 DISPATCHED

**Task ID:** `ENG-011`

**Task Packet:** [ENG-011 — Observability and Failure/Recovery Hardening](../tasks/ENG-011-observability-failure-recovery-hardening.md) (Revision 2)

**Formal DoR:** [Revision 2](../analysis/ENG-011_FORMAL_DoR_REV2_2026-08-28.md) `PASS`; revision 1 remains historical for its exact prior scope

**Current lifecycle state:** `AUTHORIZED / REPAIR 6 DISPATCHED`

**Builder dispatch:** `AUTHORIZED / REPAIR 6 DURABLY DISPATCHED`

**Current Builder:** `ENG-011 REPAIR 6 BUILDER`

**Builder branch:** `eng-011-builder-repair-6`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-6`

**Original Repair-5 Builder:** `SUPERSEDED / UNUSED / NO IMPLEMENTATION / NON-OPERATIVE` (`eng-011-builder-repair-5`, `/private/tmp/prj226-eng011-builder-repair-5` preserved clean)

**Builder authority:** `ACTIVE / EXCLUSIVE WRITE AUTHORITY OVER THE EXACT 19-PATH WRITE LOCK`

**Implementation state:** `REPAIR-5 RESTART-1 CANDIDATE FROZEN / REPAIR 6 NOT STARTED`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Recorded:** 2026-08-29

## Dispatch identity and topology

| Property | Value |
| --- | --- |
| Canonical READY commit | `9c721aebbf87ee7cabac43c7501d2ea8d13b1a0b` |
| Canonical READY tree | `6acb04e545dfbb5ff24dc70a555d2a2a01a5ac96` |
| Original dispatch commit | `f1d7d308128b7dd2d2a25cf726cdc75a0743c39a` |
| Original Builder status | `ABORTED / STARTUP CONTAMINATED / NO CANDIDATE / NON-OPERATIVE` (`eng-011-builder`, `/private/tmp/prj226-eng011-builder` preserved) |
| Startup finding | `ENG-011-BSE-R001 CLOSED BY EXECUTION RESTART` ([Controller Disposition](../analysis/ENG-011_BUILDER_STARTUP_CONTAMINATION_DISPOSITION_2026-08-28.md)) |
| Restart 1 dispatch commit | `685c2e836db8464261fe3a2c2c0b14990eda3871` |
| Candidate 1 commit | `8baa7808fa3dcd6e0475d9176e124973959d52d7` (tree `c31614ff730ae95e20f684c24e9567541bd1ddca`) |
| Candidate 1 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` |
| Candidate 1 typecheck finding | `ENG-011-C1-DV-R001` (`ACCEPTED / BLOCKING / OPEN FOR REPAIR 2; TECHNICALLY ADDRESSED IN R1 BUT UNACCEPTED`) ([Finding Disposition](../analysis/ENG-011_CANDIDATE1_TYPECHECK_FINDING_DISPOSITION_2026-08-28.md)) |
| Prior aggregate mismatch | `BUILDER_REPORT_EVIDENCE_MISMATCH_ONLY / CLOSED` (canonical aggregate: `dd99fcdd6c70f9f60e7718afaef6a7d88968aee526639903330f61fa05324381`) |
| Repair 1 dispatch commit | `616fc2c1f9282ef5e1f620ef6156adf28453e4c4` |
| Repair 1 candidate commit | `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2` (tree `a7d99a9bee493c7c279f7ca4e137a96bba0da6bc`) |
| Repair 1 candidate disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` |
| Repair 1 provenance finding | `ENG-011-R1-DV-R001` (`ACCEPTED / BLOCKING / OPEN FOR REPAIR 2`) ([Finding Disposition](../analysis/ENG-011_REPAIR1_PROVENANCE_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 2 dispatch authority | Commit `3ac5a39ffa6d891d252dff1ddd47bd0e380cad8b` |
| Repair 2 candidate | `49990f306ee67b62ae017f0d63fa556bde06d23a` (tree `b08c1f9d8ffa579a6cda3ed695293658a3697a81`; aggregate `6452eec02ebdd5e32c8274da852e501d2d0c1826c485d558354c4ac07b2867f0`) |
| Repair 2 deterministic verification | `PASS` — historical exact-candidate fact |
| Repair 2 independent S/O/S review | `FINDINGS` — nine blocking findings `ENG-011-R2-SOR-R001` through `R009` |
| Repair 2 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` ([Controller Disposition](../analysis/ENG-011_REPAIR2_SOR_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 3 dispatch authority | Commit `b4d59fd6f4ef8393d83d57f78e36369405b8ddcb` |
| Repair 3 candidate | `d949e713e2ba1fbbf526eafded0a40de6b7beb2c` (tree `9ef6b36dc635f3c121cafe1da4fdfde97e56bac5`; aggregate `d9a8dcf6ad96eec305656f7f9a3d79e94eaaaa356b769e015f4cccedeee24cba`) |
| Repair 3 deterministic verification | `FINDINGS` — four blocking findings `ENG-011-R3-DV-R001` through `R004` |
| Repair 3 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` ([Controller Disposition](../analysis/ENG-011_REPAIR3_DETERMINISTIC_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 4 dispatch authority | Commit `73277e4e1f0355d322398fec133c83bc24550f3d` |
| Repair 4 candidate | `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3` (tree `6f2ec94731167460582a1f8c0d3c773364bf6726`; aggregate `ec56f47ddf158860ab06daff494552f08b8facfd643a06b97e9f82da6252c7b5`) |
| Repair 4 formal verifier gate | `INVALID / VERIFIER STOP CONDITION VIOLATED` ([Finding Disposition](../analysis/ENG-011_REPAIR4_DETERMINISTIC_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 4 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` ([Controller Disposition](../analysis/ENG-011_REPAIR4_DETERMINISTIC_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 5 original dispatch commit | `0af56e186b44396f524183125e5d053ea41e876e` |
| Original Repair-5 Builder status | `SUPERSEDED / UNUSED / NO IMPLEMENTATION / NON-OPERATIVE` (`eng-011-builder-repair-5`, `/private/tmp/prj226-eng011-builder-repair-5` preserved clean) |
| Repair 5 Restart-1 dispatch authority | The single governance-only correction commit containing this Delivery Record |
| Fresh Builder branch | `eng-011-builder-repair-5-restart-1` |
| Fresh Builder worktree | `/private/tmp/prj226-eng011-builder-repair-5-restart-1` |
| Repair 5 Restart-1 | `AUTHORIZED / DURABLY DISPATCHED` |
| Repair 5 Restart-1 candidate | `3adbe1ad5ef539b01f1af0c95603f02542000665` (tree `dd6cabe65a78a515340f0a1b8f42facc828c489e`; canonical 17-changed-path aggregate `32c693b1a42b1c149eb6b4c7286821f93fb79157f8ee468c97f71db24906ed00`) |
| Repair 5 Restart-1 deterministic verification | `VALID / FINDINGS` — `ENG-011-R5R1-DV-R001` through `R003` accepted as blocking ([Controller Disposition](../analysis/ENG-011_REPAIR5_RESTART1_DETERMINISTIC_FINDING_DISPOSITION_2026-08-29.md)) |
| Repair 5 Restart-1 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` |
| Repair 6 dispatch authority | The single governance-only commit containing this Delivery Record |
| Repair 6 Builder branch | `eng-011-builder-repair-6` |
| Repair 6 Builder worktree | `/private/tmp/prj226-eng011-builder-repair-6` |
| Repair 6 | `AUTHORIZED / DURABLY DISPATCHED` |
| Stale Repair-4 verifier worktree | `STALE / REGISTERED AT 5f3d0d2 / UNCLEANED DUE TO PRIOR SANDBOX PERMISSION FAILURE / PRESERVED AS NON-OPERATIVE` (`/private/tmp/prj226-eng011-repair4-dv`) |
| Push | Not authorized / not performed |

## Historical Repair-2 write lock

The Repair-2 Builder was authorized to write exactly these 12 paths and no others:

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

Every other path was read-only under that historical dispatch. The additional required writes stopped Repair-2 execution and require Controller packet amendment plus Formal DoR re-evaluation.

## Operative revision-2 write lock

The Controller accepted `ENG-011-R2-SOR-R001` through `R009`. R006 proves that `committed` versus `already-committed` survives in the persistence port but is erased by both accepted mutation services before reaching interaction orchestration. The original twelve-path lock is therefore insufficient.

The Repair-6 Builder is authorized to write exactly these 19 paths and no others:

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

Every other path is read-only under this durable Controller dispatch. The persistence port, D1 adapter, schema, migrations, Product/Domain semantics, Human Control, provider boundary, and architecture remain unchanged.

## Bounded implementation authority

- Implement data-minimized, correlated, structured operational evidence across applicable provider, authorization, retrieval, persistence, derived-state, and user-visible stages without changing accepted outcomes.
- Recovery authority is classification and evidence only. Explicit caller/user retry may be represented as a new attempt; automatic authoritative mutation retry, scheduling, rollback, compensation, fallback, queueing, and recovery orchestration are prohibited.
- DATA-001 prohibits user content, Knowledge content, model output, raw errors, stacks, SQL, headers, credentials, authentication material, and provider-private data from serialized evidence.
- The seam remains provider-neutral and Cloudflare-native within the existing deployable. No Sentry, OpenTelemetry, external telemetry/analytics service, new service, Worker, queue, cache, persistence, schema, SLO, deployment, live call, or paid/production action is authorized.
- Migration is `NO MIGRATION`. `migrations/0001_authoritative_state.sql` remains locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## Readiness and dispatch disposition

Current Builder is `ENG-011 REPAIR 6 BUILDER`. Repair 6 is `AUTHORIZED / DURABLY DISPATCHED`; fresh worktree `/private/tmp/prj226-eng011-builder-repair-6` on branch `eng-011-builder-repair-6` is provisioned from the governance-only Repair-6 dispatch. Repair-5 Restart-1 candidate `3adbe1ad5ef539b01f1af0c95603f02542000665` is frozen, unaccepted, historical, and non-canonical after valid deterministic verification returned three accepted blocking findings. Formal DoR revision 2 remains passed for the exact nineteen-path lock; the three findings are bound to Repair 6 under unchanged scope. Implementation has NOT yet started.

## Future Repair-6 candidate evidence

Repair-6 candidate commit/tree, exact changed-path manifest, deterministic results for `ENG-011-TC-01` through `TC-21`, `R3-TC-01` through `R3-TC-18`, and `ENG-011-R5R1-DV-R001` through `R003`, upstream regression results, migration re-verification, independent security/operability review, findings, repairs, and Controller closure remain intentionally empty until produced by the authorized Repair-6 delivery sequence.

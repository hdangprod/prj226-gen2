# ENG-011 — Observability and Failure/Recovery Hardening Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE / REVISED SCOPE PENDING DoR

**Task ID:** `ENG-011`

**Task Packet:** [ENG-011 — Observability and Failure/Recovery Hardening](../tasks/ENG-011-observability-failure-recovery-hardening.md) (Revision 2)

**Formal DoR:** `RE-RUN REQUIRED FOR REVISION 2`; [Revision 1](../analysis/ENG-011_FORMAL_DoR_REV1_2026-08-27.md) `PASS` remains historical for its exact prior scope

**Current lifecycle state:** `PROPOSED / REVISED REPAIR-3 SCOPE / FORMAL DoR REQUIRED`

**Builder dispatch:** `NONE / REPAIR 3 NOT YET AUTHORIZED`

**Current Builder:** `NONE`

**Builder branch:** `NONE`

**Builder worktree:** `NONE`

**Builder authority:** `NONE`

**Implementation state:** `REPAIR-2 CANDIDATE FROZEN / REPAIR 3 NOT YET AUTHORIZED`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Recorded:** 2026-08-28

## Dispatch identity and topology

| Property | Value |
| --- | --- |
| Canonical READY commit | `f03f2cddcc34c69188d6656c497e76f0920ebe77` |
| Canonical READY tree | `6f6135299c851337057f1d129598f4d5175d15b9` |
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
| Repair 2 dispatch authority | The single governance-only commit containing this Delivery Record |
| Fresh Builder branch | `eng-011-builder-repair-2` |
| Fresh Builder worktree | `/private/tmp/prj226-eng011-builder-repair-2` |
| Repair 2 candidate | `49990f306ee67b62ae017f0d63fa556bde06d23a` (tree `b08c1f9d8ffa579a6cda3ed695293658a3697a81`; aggregate `6452eec02ebdd5e32c8274da852e501d2d0c1826c485d558354c4ac07b2867f0`) |
| Repair 2 deterministic verification | `PASS` — historical exact-candidate fact |
| Repair 2 independent S/O/S review | `FINDINGS` — nine blocking findings `ENG-011-R2-SOR-R001` through `R009` |
| Repair 2 disposition | `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL` ([Controller Disposition](../analysis/ENG-011_REPAIR2_SOR_FINDING_DISPOSITION_2026-08-28.md)) |
| Repair 3 | `NOT YET AUTHORIZED / REVISED DoR REQUIRED` |
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

## Proposed Repair-3 scope

The Controller accepted `ENG-011-R2-SOR-R001` through `R009`. R006 proves that `committed` versus `already-committed` survives in the persistence port but is erased by both accepted mutation services before reaching interaction orchestration. The original twelve-path lock is therefore insufficient.

Task Packet revision 2 proposes the original twelve paths plus exactly seven upstream/result-regression paths:

1. `src/application/contracts/operations.ts`
2. `src/application/services/projectActionContext/projectActionContextService.ts`
3. `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts`
4. `tests/application/services/projectActionContext/projectActionContextService.test.ts`
5. `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts`
6. `tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts`
7. `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts`

This is a proposed nineteen-path lock, not active Builder authority. Revised Formal DoR must pass before READY or dispatch. The persistence port, D1 adapter, schema, migrations, Product/Domain semantics, Human Control, provider boundary, and architecture remain unchanged.

## Bounded implementation authority

- Implement data-minimized, correlated, structured operational evidence across applicable provider, authorization, retrieval, persistence, derived-state, and user-visible stages without changing accepted outcomes.
- Recovery authority is classification and evidence only. Explicit caller/user retry may be represented as a new attempt; automatic authoritative mutation retry, scheduling, rollback, compensation, fallback, queueing, and recovery orchestration are prohibited.
- DATA-001 prohibits user content, Knowledge content, model output, raw errors, stacks, SQL, headers, credentials, authentication material, and provider-private data from serialized evidence.
- The seam remains provider-neutral and Cloudflare-native within the existing deployable. No Sentry, OpenTelemetry, external telemetry/analytics service, new service, Worker, queue, cache, persistence, schema, SLO, deployment, live call, or paid/production action is authorized.
- Migration is `NO MIGRATION`. `migrations/0001_authoritative_state.sql` remains locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## Readiness disposition

Current Builder is `NONE`. Repair 3 is `NOT YET AUTHORIZED`; no Repair-3 branch or worktree is provisioned. Formal DoR must evaluate Task Packet revision 2, the exact nineteen-path proposal, R001-R009 obligations, upstream regression scope, and strict failed-candidate non-ancestry/byte-isolation rules.

## Future Repair-3 candidate evidence

Repair-3 candidate commit/tree, exact changed-path manifest, deterministic results for `ENG-011-TC-01` through `TC-21` and `R3-TC-01` through `R3-TC-18`, upstream regression results, migration re-verification, independent security/operability review, findings, repairs, and Controller closure remain intentionally empty until produced by a future authorized delivery sequence.

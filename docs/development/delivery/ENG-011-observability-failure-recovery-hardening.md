# ENG-011 — Observability and Failure/Recovery Hardening Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE / DISPATCHED

**Task ID:** `ENG-011`

**Task Packet:** [ENG-011 — Observability and Failure/Recovery Hardening](../tasks/ENG-011-observability-failure-recovery-hardening.md) (Revision 1)

**Formal DoR:** [Revision 1](../analysis/ENG-011_FORMAL_DoR_REV1_2026-08-27.md) — `PASS`; `ENG-011-DOR-R001` through `R006 CLOSED`

**Current lifecycle state:** `READY / REPAIR 1 DISPATCHED / NOT YET IMPLEMENTED`

**Builder dispatch:** `AUTHORIZED / REPAIR 1`; the governance commit containing this record is the sole dispatch authority

**Current Builder:** `ENG-011 REPAIR 1 BUILDER`

**Builder branch:** `eng-011-builder-repair-1`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-1`

**Builder authority:** `ACTIVE / BOUNDED TO THE EXACT 12-PATH WRITE LOCK`

**Implementation state:** `NOT YET STARTED IN FRESH REPAIR 1 WORKTREE`

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
| Candidate 1 typecheck finding | `ENG-011-C1-DV-R001` (`ACCEPTED / BLOCKING / OPEN FOR REPAIR 1`) ([Finding Disposition](../analysis/ENG-011_CANDIDATE1_TYPECHECK_FINDING_DISPOSITION_2026-08-28.md)) |
| Prior aggregate mismatch | `BUILDER_REPORT_EVIDENCE_MISMATCH_ONLY / CLOSED` (canonical aggregate: `dd99fcdd6c70f9f60e7718afaef6a7d88968aee526639903330f61fa05324381`) |
| Repair 1 dispatch authority | The single governance-only commit containing this Delivery Record |
| Fresh Builder branch | `eng-011-builder-repair-1` |
| Fresh Builder worktree | `/private/tmp/prj226-eng011-builder-repair-1` |
| Candidate identity | NONE (Candidate 1 unaccepted; Repair 1 candidate not yet created) |
| Push | Not authorized / not performed |

## Authorized write lock

The Builder may write exactly these 12 paths and no others:

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

Every other path is read-only. Any additional required write stops the Builder for Controller packet amendment and Formal DoR re-evaluation.

## Bounded implementation authority

- Implement data-minimized, correlated, structured operational evidence across applicable provider, authorization, retrieval, persistence, derived-state, and user-visible stages without changing accepted outcomes.
- Recovery authority is classification and evidence only. Explicit caller/user retry may be represented as a new attempt; automatic authoritative mutation retry, scheduling, rollback, compensation, fallback, queueing, and recovery orchestration are prohibited.
- DATA-001 prohibits user content, Knowledge content, model output, raw errors, stacks, SQL, headers, credentials, authentication material, and provider-private data from serialized evidence.
- The seam remains provider-neutral and Cloudflare-native within the existing deployable. No Sentry, OpenTelemetry, external telemetry/analytics service, new service, Worker, queue, cache, persistence, schema, SLO, deployment, live call, or paid/production action is authorized.
- Migration is `NO MIGRATION`. `migrations/0001_authoritative_state.sql` remains locked to Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## Startup disposition

The fresh Builder branch and worktree are provisioned directly from the durable governance dispatch commit. Provisioning and the Controller startup audit create no implementation candidate and perform no implementation, tests, migrations, network calls, deployment, or push. The Builder must first verify a clean worktree, the exact dispatch identity, the 12-path existence baseline, and the locked migration identity before writing.

## Future candidate evidence

Candidate commit/tree, exact changed-path manifest, deterministic results for `ENG-011-TC-01` through `TC-21`, upstream regression results, migration re-verification, independent security/operability review, findings, repairs, and Controller closure remain intentionally empty until produced by the authorized delivery sequence.

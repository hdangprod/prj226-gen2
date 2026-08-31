# ENG-011 Repair-11 Restart-1 Deterministic Finding Disposition and Repair-12 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-11 RESTART-1 DETERMINISTIC FINDING DISPOSITION / REPAIR-12 AUTHORITY DECISION

**Repair-11 Restart-1 dispatch:** `296abd022c3c084538e99e9978c114dc83bc3cbb`

**Repair-11 Restart-1 candidate:** `ae3cb305d3635263aee52143b3903d140576e5dd`

**Candidate tree:** `8487b3e27975ae4a6d488e3c046383a92644508c`

**Canonical changed-path aggregate:** `94802e56a5f252311cd4fa2116eb05d454e2ce49add2d3a427de87022c5958a4`

**Candidate topology:** sole parent `296abd022c3c084538e99e9978c114dc83bc3cbb`; distance from dispatch `1`

**Candidate scope:** 11 actual changed paths out of 20 authorized paths

**Deterministic verification:** `VALID / FINDINGS`

**S/O/S review:** `NOT AUTHORIZED AS ACCEPTANCE GATE`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`

**Controller outcome:** `REPAIR 12 AUTHORIZED UNDER UNCHANGED 20-PATH WRITE LOCK`

**Task Packet:** `REVISION 3 / OPERATIVE`

**Formal DoR:** `REVISION 3 / PASS`

**READY:** `YES FOR REPAIR 12`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Bound deterministic evidence

The supplied deterministic report identity was independently bound to candidate `ae3cb305d3635263aee52143b3903d140576e5dd`, tree `8487b3e27975ae4a6d488e3c046383a92644508c`, dispatch `296abd022c3c084538e99e9978c114dc83bc3cbb`, and the canonical 11-path aggregate above. The candidate has one parent, that exact dispatch, at distance one. The aggregate was independently reproduced using the repository-standard sorted manifest of changed blob SHA-256 values.

The candidate correctly reconstructs several Repair-11 requirements: authoritative direction-carried Turn-1 deletion request identity; no caller override; same-request and missing-ID fail-closed behavior; distinct request attempts under valid Human Control; exact-object event and ObservationContext provenance; and synchronous/asynchronous fail-open containment for its deletion evidence path. Those facts do not offset the blocking omissions below and are not accepted implementation bytes. Repair 12 must independently reconstruct them.

## 2. Independent Controller adjudication

### `ENG-011-R11R1-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 12

**Classification:** `OBSERVABILITY_CONTRACT / REQUIRED_STAGE_COVERAGE_REGRESSION`

**Authority:** Task Packet revision 3, including `ENG-011-TC-01` through `TC-21`, `R3-TC-01` through `R3-TC-18`, DATA-001, and the Repair-7, Repair-8, Repair-9, and Repair-10 binding dispositions.

**Expected behavior:** Actual accepted interaction execution must emit data-minimized correlated evidence at every applicable stage: request, interpretation, retrieval, provider, authorization, persistence, derived-state, and user-visible terminal outcome. Not every operation uses every stage; emission must reflect actual execution truth, must not synthesize an all-stages loop, and must not fabricate success. `tests/application/services/interaction/interactionObservability.test.ts` must substantively exercise production flows and inspect emitted evidence.

**Actual behavior:** Candidate production emission exists only in `InteractionOrchestrator.emitDeletion()`. Every call is from `confirmDeletion()` and creates only `stage: "authorization"` deletion events. There is no actual production emission for request, interpretation/classification, retrieval, provider, persistence, derived-state, or user-visible outcomes; the required `interactionObservability.test.ts` path is absent from the candidate.

**Impact:** The clean-room reconstruction restored only the newest deletion/provenance work and did not restore the complete previously bound ENG-011 observability system. This is incomplete candidate implementation, not write-lock insufficiency: `interactionObservability.test.ts` and all necessary implementation paths are already within Revision 3's exact lock.

**Controller disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 12`.

### `ENG-011-R11R1-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 12

**Classification:** `OBSERVABILITY_CONTRACT / CLOSED_ENUM_RUNTIME_VALIDATION_MISSING`

**Authority:** Task Packet revision 3; DATA-001; Repair-7 `ENG-011-R7-SOR-R002` and `R003`.

**Expected behavior:** `createOperationalEvidenceEvent(...)` must reject runtime-invalid `stage`, `operationCategory`, `status`, `retryDisposition`, and present `failureCategory` values. No structural TypeScript cast may create a sanctioned event or cause an adapter write. Every legitimate production enum member and legitimate cross-field tuple must remain admissible.

**Actual behavior:** Candidate `validEvent()` checks opaque identifiers and selected relationships, but not membership in the closed runtime sets. A structurally cast input with, for example, `stage: "totally-invalid-stage"` is accepted, frozen, registered in the constructor WeakSet, accepted by `isConstructorIssuedEvent()`, and admitted by `CloudflareOperationalEvidence.emit()`.

**Impact:** Exact-object provenance proves issuance identity, not schema validity. Trust requires both an object issued by the sanctioned constructor and runtime-valid values from the closed event schema. Candidate code has the former but not the latter.

**Controller disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 12`.

## 3. Candidate freeze and failed-candidate state

Because both valid blocking findings are accepted, candidate `ae3cb305d3635263aee52143b3903d140576e5dd` is **FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL**. It must not be repaired in place, amended, merged, cherry-picked, canonicalized, or pushed. S/O/S review remains unauthorized.

The failed implementation-candidate count is now **12**. The original Repair-11 dispatch `e66846a662cdd2513c8863b34c5b7de3ee270170` is governance-only stopped execution, not an implementation candidate.

## 4. Scope and readiness determination

Task Packet revision 3 remains operative and Formal DoR revision 3 remains `PASS`. The exact 20-path lock is sufficient: it already includes `interactionOrchestrator.ts`, `operationalEvidence.ts`, `cloudflareOperationalEvidence.ts`, `interactionObservability.test.ts`, deletion regression coverage, and the associated application/infrastructure service tests. No mandatory twenty-first path is established. No product, architecture, Human Control, provider, recovery, migration, package, configuration, deployment, or schema change is authorized or required.

The Repair-11 Restart-1 candidate is a concrete failed implementation candidate. The next cycle is therefore **Repair 12**, not Repair-11 Restart-2.

## 5. Complete clean-room Repair-12 obligations

Repair 12 must descend from canonical governance lineage and independently reconstruct the complete Revision-3 ENG-011 behavior. It must not inspect, reuse, diff, extract, copy, restore, cherry-pick, archive, or read implementation bytes or worktrees from any of the twelve failed candidates. Failed SHAs may be used only for ancestry verification.

The Builder must reconstruct and test:

1. Actual, correlated, content-free applicable-stage evidence for request, bounded interpretation, retrieval (`found` / `not-found` / `failed`), all seven normalized provider failures, authorization result only, persistence (`committed`, duplicate, operation-ID conflict, durability failure), derived-state `not-applicable` for direct-SQL/no-derived-write paths, and truthful user-visible terminal outcome. Provider success must not imply persistence success; a non-accepted product result must not emit accepted user-visible evidence.
2. Substantive production-flow coverage in `tests/application/services/interaction/interactionObservability.test.ts`, including the full `TC-01` through `TC-21` and `R3-TC-01` through `R3-TC-18` contracts.
3. Closed runtime enum validation for every required field. Direct constructor/admission negative tests for invalid stage, operation category, status, retry disposition, and failure category must establish `REJECT / NO SANCTIONED EVENT / NO WRITE`; positive tests must retain every legitimate production enum member and valid tuple.
4. All four distinct admission layers: exact-object event provenance; exact-object ObservationContext provenance; closed unknown-key adapter admission; closed runtime field/key schema; and cross-field event invariants. Spread, `Object.assign`, modified, and adapter-forged clones must fail with no write.
5. Opaque identifier grammar; authoritative distinct deletion attempt identities; missing Turn-1 and Turn-2 IDs fail closed; caller request-ID override prohibited; and historical valid deletion flows migrated to genuine distinct identities.
6. Sync and async fail-open containment with zero unhandled rejection and no Product outcome change; TC-21 real-byte architecture scan covering telemetry SDKs, OpenTelemetry, Sentry, queues, scheduled execution, `ctx.waitUntil`, automatic mutation/deletion retry, provider fallback, D1/KV/R2 telemetry persistence, raw error fields/serialization, and arbitrary `attributes`, `metadata`, `payload`, and `details` bags.
7. All ten Repair-8 obligations (`ENG-011-R8-DV-R001` through `R010`), all Repair-7 S/O/S obligations, DATA-001 closed/no-content evidence, Human Control, no automatic retry, no provider fallback, recovery as classification/evidence only, and no migration.

## 6. Repair-12 dispatch and Builder authority

The governance-only commit containing this record is the sole Repair-12 dispatch authority. Repair 12 has one fresh Builder with exclusive ownership of the unchanged 20 paths:

- **Branch:** `eng-011-builder-repair-12`
- **Worktree:** `/private/tmp/prj226-eng011-builder-repair-12`
- **Startup requirement:** exact dispatch and tree, correct branch, tracked/index clean, untracked empty, and no name-status differences before source access.

No implementation is authorized by this Controller record beyond that bounded fresh Builder assignment. Environmental approval required for runtime edits, if any, remains an external execution gate and does not alter Task Packet sufficiency.

## 7. Required Repair-12 dispatch verification

The dispatch must have the current canonical governance HEAD as sole parent, parent count one, distance one, clean `git diff --check`, and governance-only changed paths. Each of these twelve failed candidates must be present and `PRESENT_NOT_ANCESTOR` of the dispatch:

`8baa7808fa3dcd6e0475d9176e124973959d52d7`, `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`, `49990f306ee67b62ae017f0d63fa556bde06d23a`, `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`, `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`, `3adbe1ad5ef539b01f1af0c95603f02542000665`, `dce0f5babc9156383620ba8511f074197995b6a6`, `dd1a16ee3a638c20bc7aff9019d052e50ae23000`, `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a`, `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a`, `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39`, and `ae3cb305d3635263aee52143b3903d140576e5dd`.

**Push:** `NOT PERFORMED`.

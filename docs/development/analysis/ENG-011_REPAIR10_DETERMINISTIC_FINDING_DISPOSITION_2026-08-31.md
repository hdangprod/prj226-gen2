# ENG-011 Repair-10 Deterministic Finding Disposition and Repair-11 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-10 DETERMINISTIC FINDING DISPOSITION / REPAIR-11 AUTHORITY DECISION

**Repair-10 dispatch:** `07a28df49e914f7e514f6491b85b0d435953543c`

**Repair-10 candidate:** `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39`

**Candidate tree:** `a45631654d10eacc8b60e7ed365f3dc3fb19e615`

**Candidate topology:** sole parent `07a28df49e914f7e514f6491b85b0d435953543c`; distance from dispatch `1`

**Canonical changed-path aggregate:** `c4d92fcd25b985f227650935372233c3afe60dd8e754996f70934275f3dfb98f`

**Candidate scope:** 18 actual changed paths out of 19 authorized maximum

**Repair-10 deterministic verification:** `VALID / FINDINGS`

**Repair-10 S/O/S review:** `NOT AUTHORIZED AS ACCEPTANCE GATE`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 11 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 11`

**Current Builder:** `ENG-011 REPAIR 11 BUILDER`

**Builder branch:** `eng-011-builder-repair-11`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-11`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Bound Repair-10 Evidence & Preserved Successes

The fresh Repair-10 deterministic verification report is bound to exact candidate `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39`, tree `a45631654d10eacc8b60e7ed365f3dc3fb19e615`, aggregate `c4d92fcd25b985f227650935372233c3afe60dd8e754996f70934275f3dfb98f`, and dispatch `07a28df49e914f7e514f6491b85b0d435953543c`. It established the following positive facts:

1. **Topology & Isolation:** Commit distance `1`, sole parent `07a28df49e914f7e514f6491b85b0d435953543c`, no merge commit.
2. **Historical Non-Ancestry:** All ten prior failed candidates (`8baa780`, `dc55877`, `49990f3`, `d949e71`, `5f3d0d2`, `3adbe1a`, `dce0f5b`, `dd1a16e`, `e5acfcc`, `8f06d28`) are present in the object store and verified `PRESENT_NOT_ANCESTOR`.
3. **Builder Provenance:** Transcript audit confirmed zero references to historical implementation bytes, diffs, patches, cherry-picks, restores, or failed worktrees during implementation activity.
4. **Range Check & Write Lock:** `git diff --check` clean (`exit 0`). Exactly 18 paths changed out of 19 authorized maximum. No governance, schema, migration, or deployment paths modified.
5. **Migration Integrity:** `migrations/0001_authoritative_state.sql` remains Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. Additional migrations: `0`.
6. **Toolchain & Vitest Matrix:** All 18 dynamically discovered Vitest configurations executed independently and passed (573 total tests). Full toolchain commands (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke`, `npm run test:persistence`, `npm run migrate:local`) exited `0`.
7. **`ENG-011-R9-DV-R002` through `R004` Repairs Verified:**
   - Async evidence sink rejection containment (`ENG-011-R9-DV-R002`): Verified contained with zero unhandled rejections.
   - Committed async rejection test (`ENG-011-R9-DV-R003`): Verified present in committed test files.
   - TC-21 four arbitrary bag families (`ENG-011-R9-DV-R004`): `attributes`, `metadata`, `payload`, `details` detected by static scanner across all 10 production paths.
8. **Preservation of Prior Obligations:**
   - 7-provider failure matrix (`TC-07` / `R8-DV-R001`): Tested and mapped to closed failure categories.
   - Provider success followed by persistence failure (`TC-13` / `R8-DV-R002`): Tested with real execution sequence.
   - Direct-SQL derived-state `not-applicable` (`TC-20` / `R8-DV-R003`): Verified in `sink.events`.
   - Failure mapping matrix (`TC-08` / `R8-DV-R005`): Tested across validation, prohibited-input, clarification, authorization denial, unresolved, and not-found.
   - Knowledge mutation outcome matrix (`TC-10` / `R8-DV-R006`): Capture and correction tested without content leakage.
   - Retrieval outcome matrix (`TC-11` / `R8-DV-R007`): Tested found, not-found, and retrieval-failed.
   - Operation-ID conflict (`TC-15` / `R8-DV-R009`): Mapped to non-retryable failed.
   - Explicit retry separate attempts (`TC-16` / `R8-DV-R010`): Verified separate request IDs and no automatic invocation.
   - 5-family opaque identifier grammar rejects prose and credentials (`ENG-011-R7-SOR-R001`).
   - Cross-field semantic invariant validator enforces stage/status/failureCategory/retryDisposition consistency (`ENG-011-R7-SOR-R003`).

---

## 2. Independent Controller Adjudication of Verifier Findings

The Controller independently audited the complete Repair-10 deterministic verification report and candidate `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39`, and renders the following dispositions:

### 2.1 `ENG-011-R10-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 11
- **Verifier Severity:** `BLOCKING`
- **Classification:** `AUTHORIZATION_CONTRACT / CALLER_CONTROLLED_DELETION_REQUEST_ID_OVERRIDE`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-12`, `R3-TC-04`, `INV-004`, `INV-011`, `SCN-010`.
- **Expected Behavior:** Turn 1 initiation request identity is authoritative and carried immutably by the classified Turn-1 deletion direction. Caller-provided confirmation input cannot supply an overriding `initialRequestId` to bypass same-request replay prevention. When Turn 1 `initiateDeletion` produces a classified direction with `initialRequestId: "req-turn-1"`, and Turn 2 `confirmDeletion` is attempted with `observationContext.requestId: "req-turn-1"`, confirmation must fail closed (non-accepted), no authorization succeeded evidence may be emitted, `deleteConfirmed()` must not be invoked, and state must remain unmodified, regardless of any conflicting caller input.
- **Actual Behavior:** In `src/application/services/interaction/interactionOrchestrator.ts:2808-2810`, `turn1RequestId` evaluates `input.initialRequestId` ahead of `direction.initialRequestId`. When caller provides `input.initialRequestId = "req-turn-2"` during a same-request confirmation attempt where `direction.initialRequestId = "req-turn-1"` and `observationContext.requestId = "req-turn-1"`, the equality check `turn1RequestId === turn2RequestId` evaluates to `false` (`"req-turn-2" === "req-turn-1"`), bypassing the replay guard, granting authorization, calling `deleteConfirmed()`, and returning `{ kind: "accepted" }`.
- **Exact Evidence:** Deterministic probe confirmed same-request replay attack succeeded under caller override (`confirmOutcome.kind = "accepted"`, `deleteCalls.length = 1`).
- **Runtime/Test Reproduction:** Verified via inspection and direct probe of `interactionOrchestrator.ts:2808-2843`.
- **Impact:** Violates deletion attempt separation and allows multi-turn request replay attacks.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 11`.

### 2.2 `ENG-011-R10-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 11
- **Verifier Severity:** `BLOCKING`
- **Classification:** `DATA-001 / SECURITY / COPYABLE_RUNTIME_PROVENANCE_BRAND`
- **Authority:** Task Packet Revision 2 / `DATA-001`, `R7-SOR-R002`, `ENG-011-TC-02`, `ENG-011-TC-04`, `ENG-011-TC-17`.
- **Expected Behavior:** Runtime event provenance must be strictly constructor-issued and unforgeable. Objects created by spread-cloning a valid event with injected fields (`{ ...validEvent, message: "USER SECRET" }` or arbitrary extra properties) must fail admission at `isConstructorIssuedEvent` and must never be admitted or written by `CloudflareOperationalEvidence.emit()` (`writer.log` call count `0`).
- **Actual Behavior:** In `src/application/ports/observability/operationalEvidence.ts:80, 556, 562-601`, event provenance is marked via an enumerable own symbol property `[EVENT_BRAND]: true`. Object spread copies all enumerable symbol properties, preserving `[EVENT_BRAND]`. Furthermore, `isConstructorIssuedEvent` does not validate that only allowed keys exist on the object. Consequently, `isConstructorIssuedEvent(forgedEvent)` returns `true`, and `CloudflareOperationalEvidence.emit(forgedEvent)` accepts the forged event and invokes `writer.log(projected)` (`writerRecords.length = 1`).
- **Exact Evidence:** Deterministic probe confirmed `isConstructorIssuedEvent(forged)` returned `true` and `writer.records.length` was `1`.
- **Precise Impact:** The deterministic evidence establishes that a forged spread-clone is incorrectly recognized as constructor-issued and reaches writer admission. While the adapter's closed projection may strip unapproved fields before final serialization, the closed trust boundary is breached because forged event admission fails to fail closed.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 11`.

### 2.3 `ENG-011-R10-DV-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 11
- **Verifier Severity:** `BLOCKING`
- **Classification:** `OBSERVABILITY_CONTRACT / COPYABLE_OBSERVATION_CONTEXT_PROVENANCE`
- **Authority:** Task Packet Revision 2 / `DATA-001`, `R7-SOR-R001`, `ENG-011-TC-01`.
- **Expected Behavior:** ObservationContext provenance must be constructor-issued and unforgeable. Modifying or spread-cloning a context (`{ ...validContext, requestId: "req-turn-999" }`) must fail closed in `isProvenanceObservationContext`.
- **Actual Behavior:** In `src/application/ports/observability/operationalEvidence.ts:81, 201, 206-219`, `ObservationContext` uses an enumerable own symbol property `[CONTEXT_BRAND]: true`. Spread clones retain the brand. `isProvenanceObservationContext(modifiedContext)` returns `true` for modified contexts with forged `requestId`.
- **Exact Evidence:** Deterministic probe confirmed `isProvenanceObservationContext(modifiedContext)` returned `true`.
- **Impact:** Allows forged observation contexts to masquerade as constructor-issued contexts.
- **Controller Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 11`.

### 2.4 `ENG-011-R10-DV-RP001` — ACCEPTED / NON-BLOCKING / PROCEDURAL
- **Verifier Severity:** `NON-BLOCKING`
- **Classification:** `PROCEDURAL / BUILDER_EXPLICIT_STAGING_CONTRACT_VIOLATION`
- **Authority:** Task Packet Revision 2 / Section 8 Builder Mandate.
- **Expected Behavior:** Builder stages exclusively explicit authorized file paths.
- **Actual Behavior:** Builder executed `git add .` at transcript step 370.
- **Exact Evidence:** Transcript audit step 370. Candidate commit scope was independently verified exact (18 authorized modified paths, zero foreign paths).
- **Impact:** Procedural staging deviation; non-blocking because candidate scope is independently proven exact.
- **Controller Disposition:** `ACCEPTED / NON-BLOCKING / PROCEDURAL / ENVIRONMENT ONLY`.

---

## 3. Repair-10 Candidate Freeze Disposition

Because valid blocking deterministic findings `ENG-011-R10-DV-R001`, `ENG-011-R10-DV-R002`, and `ENG-011-R10-DV-R003` are accepted:
- **Repair-10 candidate** `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39` (tree `a45631654d10eacc8b60e7ed365f3dc3fb19e615`) is **FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL**.
- Deterministic verification stands as **VALID / FINDINGS**.
- Security/Operability/Semantic review is **NOT AUTHORIZED AS ACCEPTANCE GATE**.
- Next implementation cycle is **REPAIR 11**.

---

## 4. Failed Implementation Candidates (11 / 11 Frozen)

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
11. `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39` (Repair 10) -> `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`

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

## 6. Complete Controller-Bound Repair-11 Obligations

Repair 11 must independently construct clean implementation code from the canonical governance dispatch commit and satisfy:

1. **`ENG-011-R10-DV-R001` (Authoritative Turn-1 Deletion Request ID & No Caller Override):**
   - In `src/application/services/interaction/interactionTypes.ts`, carry Turn-1 request identity on the classified deletion direction structure (e.g. `initialRequestId` on `ClassifiedDeletionDirection` or bounded direction contract). Remove any caller-controlled parallel override property from `DeletionConfirmationInput` that could supersede the direction's identity.
   - In `src/application/services/interaction/interactionOrchestrator.ts:confirmDeletion`, verify that the confirmation attempt request ID (`input.observationContext.requestId`) is distinct from the Turn-1 initiation attempt request ID carried by `input.direction`.
   - If the same request ID is replayed, fail closed (non-accepted), emit no authorization succeeded event, do not invoke `deleteConfirmed()`, and leave state unmodified.
   - **Missing Request-ID Semantics Decision:** Under Task Packet Revision 2 / `INV-004`, `INV-011`, and `ENG-011-TC-12`, every deletion confirmation attempt must be an identifiable distinct attempt. If the Turn-1 direction lacks an initial request ID or the confirmation attempt lacks an observation context request ID, confirmation must fail closed.

2. **`ENG-011-R10-DV-R002` (Uncopyable Exact-Constructor-Issued Event Runtime Provenance):**
   - In `src/application/ports/observability/operationalEvidence.ts`, implement runtime provenance for `OperationalEvidenceEvent` that cannot be copied by JavaScript object spread (`{ ...validEvent }`), `Object.assign`, or plain structural cloning.
   - Use an uncopyable mechanism (e.g., identity registration in a private module `WeakSet`, non-enumerable private state, or closed key validation coupled with uncopyable tokens) such that `isConstructorIssuedEvent(event)` returns `true` ONLY for the exact object reference returned by `createOperationalEvidenceEvent`.
   - Ensure spread-clones with injected fields (`{ ...validEvent, message: "USER SECRET" }` or arbitrary extra properties) evaluate `isConstructorIssuedEvent === false` and are rejected at the adapter boundary without calling `writer.log()`.

3. **`ENG-011-R10-DV-R003` (Uncopyable Exact-Constructor-Issued ObservationContext Provenance):**
   - In `src/application/ports/observability/operationalEvidence.ts`, implement uncopyable runtime provenance for `ObservationContext` (e.g., private `WeakSet` registration) such that `isProvenanceObservationContext(context)` returns `true` ONLY for the exact object reference returned by `createObservationContext`.
   - Spread clones and modified copies (`{ ...validContext, requestId: "req-turn-999" }`) must evaluate `isProvenanceObservationContext === false`.

4. **Preservation of Repair-9 Obligations:**
   - **`ENG-011-R9-DV-R002` / `R003` (Async Evidence Sink Failure Containment):** Ensure both synchronous throws and asynchronous Promise rejections from `evidenceSink.emit(...)` and `writer.log(...)` are fully caught and contained fail-open without unhandled rejections or caller disruption, with substantive test coverage.
   - **`ENG-011-R9-DV-R004` (TC-21 Static Scanner Completeness):** Preserve detection of all four arbitrary bag families (`attributes`, `metadata`, `payload`, `details`) in `interactionObservability.test.ts`.

5. **Preservation of Prior Obligations:**
   - Preserve all 10 Repair-8 deterministic obligations (`ENG-011-R8-DV-R001` through `R010`).
   - Preserve all Repair-7 S/O/S obligations (`ENG-011-R7-SOR-R001` 5-family identifier grammar, `ENG-011-R7-SOR-R002` unforgeable brand / closed projection, `ENG-011-R7-SOR-R003` cross-field semantic invariants).
   - Preserve `TC-01` through `TC-21` and `R3-TC-01` through `R3-TC-18`.
   - Preserve DATA-001, Human Control, provider boundary, no automatic mutation retry, no provider fallback, no migration.

6. **Builder Staging Mandate (`ENG-011-R10-DV-RP001` Compliance):**
   - Builder MUST explicitly stage only authorized file paths. `git add .` and `git add -A` are strictly prohibited.

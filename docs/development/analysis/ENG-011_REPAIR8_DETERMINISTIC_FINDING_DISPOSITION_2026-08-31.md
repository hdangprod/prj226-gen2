# ENG-011 Repair-8 Deterministic Finding Disposition and Repair-9 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-8 DETERMINISTIC FINDING DISPOSITION / COMPLETE TEST-CONTRACT ADJUDICATION / REPAIR-9 DISPATCH

**Repair-8 dispatch:** `25d662cec38c7267281d82d659f6bb738f503bc5`

**Repair-8 candidate:** `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a`

**Candidate tree:** `4d1ce02a9c3c238c0a09e06852baabb5f32217d7`

**Candidate topology:** sole parent `25d662cec38c7267281d82d659f6bb738f503bc5`; distance from dispatch `1`

**Canonical changed-path aggregate:** `a0e7d535fa481d87fbc81dc6ba82254116eabad2ddb6288ee275304ff178b090`

**Candidate scope:** 17 actual changed paths out of 19 authorized maximum

**Repair-8 deterministic verification:** `VALID / FINDINGS`

**Repair-8 S/O/S review:** `NOT AUTHORIZED AS ACCEPTANCE GATE`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 9 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 9`

**Current Builder:** `ENG-011 REPAIR 9 BUILDER`

**Builder branch:** `eng-011-builder-repair-9`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-9`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

---

## 1. Bound Repair-8 Evidence & Preserved Successes

The fresh Repair-8 deterministic verification is valid evidence. It independently verified and established the following positive facts:

1. **Topology & Isolation:** Detached startup gate `PASS`, commit distance `1`, sole parent `25d662cec38c7267281d82d659f6bb738f503bc5`, no merge commit.
2. **Historical Non-Ancestry:** All eight prior failed candidates are present in the object store and verified `PRESENT_NOT_ANCESTOR`.
3. **Builder Provenance:** Transcript audit confirmed no failed-candidate implementation bytes or worktrees were used.
4. **Range Check & Write Lock:** `git diff --check` clean (`exit 0`). Exactly 17 paths changed out of 19 authorized maximum. No governance, schema, migration, or deployment paths modified.
5. **Migration Integrity:** `migrations/0001_authoritative_state.sql` remains Git blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` and SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. Additional migrations: `0`.
6. **Toolchain & Vitest Matrix:** All 18 dynamically discovered Vitest configurations executed independently and passed (572 total tests). Full toolchain commands (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run smoke`, `npm run test:persistence`, `npm run migrate:local`) exited `0`.
7. **`ENG-011-R7-SOR-R001` (5-Family Opaque Identifier Grammar):** Deterministically repaired and verified. Structural grammar across RFC-4122 UUID, Compact Machine ID, Structured Correlation ID, Structured Request ID, and Structured Operation ID rejects content channels (`req-attackatdawn`, `req-privatehealth`, `corr-bankbalance`, `secretmessage1`, credentials, SQL, prose) without generalized DLP.
8. **`ENG-011-R7-SOR-R002` (Platform-Write Trust Boundary):** Deterministically repaired and verified. Constructor provenance via unforgeable brand (`isConstructorIssuedEvent`) and closed projection ensures plain structural clones, forged payloads, and direct adapter calls with injected `message`/`payload` fail closed with zero writes.
9. **`ENG-011-R7-SOR-R003` (Cross-Field Semantic Invariants):** Deterministically repaired and verified. Centralized invariant validation enforces status, stage, failureCategory, and retryDisposition consistency upon event creation and emission.
10. **Identifier Compatibility:** Legitimate canonical IDs remain correlatable while unsafe or non-grammar operation IDs are safely omitted from evidence without altering authoritative persistence behavior.

These passing deterministic facts stand and are binding on Repair 9. They must be preserved and not regressed.

---

## 2. Independent Controller Adjudication of Blocking Findings

The Controller independently audited candidate `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a` and confirmed the four verifier-reported findings plus six additional under-reported test-contract gaps:

### 2.1 `ENG-011-R8-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / PROVIDER_FAILURE_MATRIX_COVERAGE_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-07` and Section 29.
- **Requirement:** Committed tests must execute all seven normalized provider failure categories (`provider-timeout`, `provider-rate-limited`, `provider-unavailable`, `provider-refused`, `provider-malformed-result`, `provider-invalid-request`, `provider-unknown`) through actual orchestrator evidence flow, asserting provider stage, exact failureCategory, retryDisposition, and terminal evidence without raw error leakage.
- **Finding:** Repair-8 test labelled `TC-07: Proposal Flow Evidence` tested only happy-path proposal flow. The seven provider failure categories were unexercised in orchestrator evidence tests.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.2 `ENG-011-R8-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC13_SUBSTANTIVE_PRESERVATION_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-13` and Section 16 Hard Gate.
- **Requirement:** Committed test must execute the exact sequence: provider succeeds -> authoritative mutation invoked -> persistence actually attempted -> persistence returns durability failure -> verify evidence asserts provider success, persistence failure, truthful failureCategory/retryDisposition, absence of persistence accepted, absence of user-visible accepted, and non-accepted product outcome.
- **Finding:** Repair-8 repurposed label "TC-13" for context fact acceptance entityType evidence (`it("TC-13: Context fact acceptance emits accepted-context entityType evidence", ...)`). The substantive sequence was absent from candidate tests.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.3 `ENG-011-R8-DV-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC20_SUBSTANTIVE_PRESERVATION_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-20` and Section 17 Hard Gate.
- **Requirement:** Applicable direct-SQL / no-derived-write authoritative flows must produce and have committed tests inspecting actual `sink.events` for `stage: "derived-state"`, `status: "not-applicable"`, `retryDisposition: "not-applicable"`.
- **Finding:** Zero occurrences of `"derived-state"` existed in committed tests.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.4 `ENG-011-R8-DV-R004` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC21_ARCHITECTURE_GUARD_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-21` and Section 18 Hard Gate.
- **Requirement:** Committed test must include a real-byte static source scanner over all ten authorized production paths with synthetic positive controls for prohibited architecture tokens (external telemetry SDKs, OpenTelemetry, Sentry, queues, background execution, cron, automatic retry, provider fallback, D1/KV/R2 telemetry persistence, `error.message`, `err.message`, `error.stack`, `err.stack`, `JSON.stringify(error)`, etc.).
- **Finding:** Repair-8 replaced "TC-21" with tests for upstream retryability propagation. The static source scanner was absent.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.5 `ENG-011-R8-DV-R005` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC08_FAILURE_MAPPING_MATRIX_INCOMPLETE`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-08`.
- **Requirement:** Validation failure, authentication-material prohibition, ambiguity/clarification, authorization denial, unresolved, and not-found outcomes must be distinctly tested in orchestrator evidence flow with truthful non-accepted terminal statuses.
- **Finding:** Candidate only tested prohibited credential interception. Validation, clarification-required, authorization-denied, unresolved, and not-found flows lacked explicit orchestrator evidence assertions.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.6 `ENG-011-R8-DV-R006` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC10_KNOWLEDGE_OUTCOME_MATRIX_INCOMPLETE`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-10`.
- **Requirement:** Knowledge capture/correction success, prohibition, conflict, and persistence failure must preserve origin/supersession behavior and emit no content across all paths.
- **Finding:** Candidate tested only happy-path capture and credential rejection. Knowledge correction success, operation-ID conflict on knowledge mutation, and persistence failure during knowledge mutation lacked evidence tests.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.7 `ENG-011-R8-DV-R007` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC11_RETRIEVAL_MATRIX_INCOMPLETE`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-11`.
- **Requirement:** Retrieval `found`, `not-found`, and `retrieval-failed` paths must be distinct across advisory/proposal and mutation flows with no query or content leakage.
- **Finding:** Candidate tested only retryability propagation on retrieval failure. Retrieval `not-found` vs `found` vs `retrieval-failed` stage/status evidence assertions were incomplete.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.8 `ENG-011-R8-DV-R008` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC12_EXPORT_DELETION_MATRIX_INCOMPLETE`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-12`.
- **Requirement:** Export success/failure and deletion direction/confirmation/rejection (scope mismatch)/not-found/failure/indeterminate/duplicate outcomes must be truthful without weakening confirmation.
- **Finding:** Candidate tested only Turn 1 direction, Turn 2 confirmation, already-deleted, and export success. Deletion scope mismatch rejection, not-found, persistence failure, deletion indeterminate (`indeterminate-manual-check`), and export failure lacked orchestrator evidence assertions.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.9 `ENG-011-R8-DV-R009` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC15_OPERATION_ID_CONFLICT_COVERAGE_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-15`.
- **Requirement:** Operation-ID conflict must emit failed with `operation-id-conflict` and `non-retryable`, and valid duplicate/idempotent replay must emit `duplicate` without altering accepted results.
- **Finding:** Candidate tested duplicate replay on `already-committed`, but omitted explicit orchestrator evidence test for `operation-id-conflict`.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

### 2.10 `ENG-011-R8-DV-R010` — ACCEPTED / BLOCKING / BOUND TO REPAIR 9
- **Classification:** `TEST_CONTRACT / TC16_EXPLICIT_RETRY_SEPARATE_ATTEMPT_COVERAGE_LOST`
- **Authority:** Task Packet Revision 2 / `ENG-011-TC-16`.
- **Requirement:** A retry-eligible failure followed by an explicit new caller/user retry attempt must emit separate attempts with distinct request-attempt IDs, and prove that no automatic mutation invocation occurs.
- **Finding:** Candidate lacked a dedicated test exercising a retry-eligible failure followed by an explicit second attempt with distinct request ID proving no automatic invocation occurred.
- **Disposition:** `ACCEPTED / BLOCKING / BOUND TO REPAIR 9`.

---

## 3. Complete Authority-Based TC-01 through TC-21 Reconciliation Matrix

| TC ID | Task Packet Requirement | Committed Repair-8 Status | Actual Production Path | Key Assertions Present? | Substantive | Controller Disposition |
|---|---|---|---|---|---|---|
| **TC-01** | Valid safe correlation/request/optional operation identifiers construct immutable observation context; malformed/content fail closed. | Present in `operationalEvidence.test.ts` | `src/application/ports/observability/operationalEvidence.ts` | Context frozen, invalid IDs rejected, unsafe opId omitted. | YES | **PASS** |
| **TC-02** | Event constructor accepts closed schema/enums, snapshots against TOCTOU. | Present in `operationalEvidence.test.ts` | `src/application/ports/observability/operationalEvidence.ts` | Unknown keys rejected, frozen event, snapshots input, validates enums. | YES | **PASS** |
| **TC-03** | Correlation ID stable across stages; request ID identifies attempt; 2nd deletion turn distinct request ID. | Present in `interactionObservability.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts` | Stages retain correlationId/requestId; Turn 1/Turn 2 distinct. | YES | **PASS** |
| **TC-04** | Credentials, keys, tokens, user text, knowledge, model output, stacks, SQL absent from serialized evidence. | Present in `interactionObservability.test.ts` & `cloudflareOperationalEvidence.test.ts` | `src/infrastructure/observability/cloudflareOperationalEvidence.ts`, `interactionOrchestrator.ts` | Prohibited credentials denied; platform output closed to approved fields. | YES | **PASS** |
| **TC-05** | Unsafe operation/entity identifiers omitted or rejected and never emitted raw. | Present in `interactionObservability.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts` | Non-grammar opId omitted from evidence while mutation succeeds. | YES | **PASS** |
| **TC-06** | Successful advisory emits truthful request, provider, user-visible; no auth/persistence success. | Present in `interactionObservability.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts` | Emits request, retrieval, provider, interpretation advisory, user-visible; no persistence/auth events. | YES | **PASS** |
| **TC-07** | Model advisory, proposal, uncertain, unable, and all 7 normalized failure categories map distinctly. | **Incomplete** (only proposal flow tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** 7 provider failure categories in orchestrator evidence flow. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R001`) |
| **TC-08** | Validation, prohibition, clarification, auth denial, unresolved, not-found distinct and non-accepted. | **Incomplete** (only credential prohibition tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** validation, clarification, auth denial, unresolved, not-found evidence assertions. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R005`) |
| **TC-09** | Mutation success emits persistence/accepted; failure emits failed with exact retry disposition. | Present in `interactionObservability.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts` | Emits persistence accepted on `committed`, duplicate on `already-committed`. | YES | **PASS** |
| **TC-10** | Knowledge capture/correction success, prohibition, conflict, persistence failure preserve origin/supersession, emit no content. | **Incomplete** (only capture happy-path & prohibition tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** correction, conflict, and persistence failure evidence tests. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R006`) |
| **TC-11** | Retrieval found/not-found/failure distinct; retryability preserved; no query/content emitted. | **Incomplete** (only retryability propagation tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** found vs not-found vs failed evidence mapping. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R007`) |
| **TC-12** | Export and deletion direction/confirmation/rejection/not-found/failure/indeterminate/duplicate truthful. | **Incomplete** (only direction, confirmation, duplicate, export tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** rejection, not-found, failure, indeterminate, export failure evidence. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R008`) |
| **TC-13** | Model success followed by failed authoritative mutation never emits or returns accepted success. | **Absent** (label repurposed for context facts) | N/A | **Missing:** substantive model success + persistence failure sequence. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R002`) |
| **TC-14** | Mixed outcomes emit partial/mixed-outcome; all-failure emits failed/unclassified-failure. | Present in `interactionObservability.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts` | Mixed emits `partial`/`mixed-outcome`/`non-retryable`; all-failure emits `failed`. | YES | **PASS** |
| **TC-15** | Operation-ID conflict non-retryable; duplicate/idempotent replay distinguishable from new commit. | **Incomplete** (only already-committed tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** operation-ID conflict evidence assertions. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R009`) |
| **TC-16** | Retry-eligible failure and explicit retry emit separate attempts; no automatic invocation. | **Incomplete** (only two-turn deletion tested) | `src/application/services/interaction/interactionOrchestrator.ts` | **Missing:** failure followed by explicit caller retry attempt. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R010`) |
| **TC-17** | Cloudflare emitter writes 1 structured event through injected console-compatible writer with no external call/SDK. | Present in `cloudflareOperationalEvidence.test.ts` | `src/infrastructure/observability/cloudflareOperationalEvidence.ts` | Emits exactly 1 structured object to writer.log(). | YES | **PASS** |
| **TC-18** | Synchronous throw or asynchronous rejection by evidence sink contained; product result unchanged. | Present in `interactionObservability.test.ts` & `cloudflareOperationalEvidence.test.ts` | `src/application/services/interaction/interactionOrchestrator.ts`, `cloudflareOperationalEvidence.ts` | Throwing sink does not disrupt product result. | YES | **PASS** |
| **TC-19** | Numeric diagnostics accept only finite non-negative values and remain non-semantic. | Present in `operationalEvidence.test.ts` | `src/application/ports/observability/operationalEvidence.ts` | Schema rejects non-finite / negative diagnostics. | YES | **PASS** |
| **TC-20** | Direct-SQL/no-derived-write records derived-state as absent/not-applicable and never fabricates derived success. | **Absent** | N/A | **Missing:** inspection of `sink.events` for `stage: "derived-state"`, `status: "not-applicable"`. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R003`) |
| **TC-21** | Static scans prove no prohibited vendor, OpenTelemetry, Sentry, queue, cache, telemetry persistence, etc. in 10 production paths. | **Absent** (label repurposed for retryability propagation) | N/A | **Missing:** real-byte static source architecture scanner over 10 production paths with positive controls. | **NO** | **BLOCKING FINDING** (`ENG-011-R8-DV-R004`) |

---

## 4. Complete R3-TC-01 through R3-TC-18 Reconciliation Matrix

| Requirement | Description | Repair-8 Candidate State | Substantive | Controller Disposition |
|---|---|---|---|---|
| **R3-TC-01** | Observation context provenance brand check | Implemented in `operationalEvidence.ts` and tested in `operationalEvidence.test.ts` & `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-02** | Content-like valid-syntax identifiers excluded | Implemented in 5-family grammar and tested in `operationalEvidence.test.ts` | YES | **PASS** |
| **R3-TC-03** | Mutation operation ID authoritative over context ID | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-04** | Deletion direction & confirmation retain correlation with distinct request IDs | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-05** | Provider attempt/success/failure and diagnostics without private data | Happy path tested; provider failure matrix missing (`ENG-011-R8-DV-R001`) | NO | **BLOCKING FINDING** |
| **R3-TC-06** | Retrieval found/not-found/failure distinct | Incomplete retrieval matrix (`ENG-011-R8-DV-R007`) | NO | **BLOCKING FINDING** |
| **R3-TC-07** | Upstream terminal results mapped to actual stage; pre-persistence vs persistence failure | Persistence committed/duplicate tested; pre-persistence rejections missing (`ENG-011-R8-DV-R005`, `R002`) | NO | **BLOCKING FINDING** |
| **R3-TC-08** | Turn-1 deletion emits no auth success; confirmed Turn-2 distinct | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-09** | Project/Action/context/progress committed vs already-committed emit accepted vs duplicate | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-10** | Knowledge capture/correction preserve origin/supersession, lineage, no content | Incomplete knowledge matrix (`ENG-011-R8-DV-R006`) | NO | **BLOCKING FINDING** |
| **R3-TC-11** | Mixed all-success, partial, all-failure truthful | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-12** | Trusted ingress user-visible success follows ingress return | Tested in `interactionObservability.test.ts` | YES | **PASS** |
| **R3-TC-13** | TC-21 static scan path-complete and robust | Scanner absent (`ENG-011-R8-DV-R004`) | NO | **BLOCKING FINDING** |
| **R3-TC-14** | Original TC-01 through TC-21 substantive and pass | Substantive gaps in TC-07, TC-08, TC-10, TC-11, TC-12, TC-13, TC-15, TC-16, TC-20, TC-21 | NO | **BLOCKING FINDING** |
| **R3-TC-15** | No automatic provider/mutation/deletion retry, fallback, or recovery engine | To be enforced by TC-21 static scan and TC-16 test | NO | **BOUND TO REPAIR 9** |
| **R3-TC-16** | Full toolchain, dynamic Vitest, local D1, migration identity, exact lock | Deterministically verified | YES | **PASS** |
| **R3-TC-17** | Historical failed candidates are present and not ancestors | 9 / 9 verified `PRESENT_NOT_ANCESTOR` | YES | **PASS** |
| **R3-TC-18** | Independent production from clean canonical governance without byte reuse | Enforced for Repair 9 | YES | **BOUND TO REPAIR 9** |

---

## 5. Candidate Freeze & Failed-Candidate Registry

Repair-8 candidate `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a`, tree `4d1ce02a9c3c238c0a09e06852baabb5f32217d7`, is **FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL**.

The nine historical failed implementation candidates are:
1. `8baa7808fa3dcd6e0475d9176e124973959d52d7`
2. `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`
3. `49990f306ee67b62ae017f0d63fa556bde06d23a`
4. `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`
5. `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`
6. `3adbe1ad5ef539b01f1af0c95603f02542000665`
7. `dce0f5babc9156383620ba8511f074197995b6a6`
8. `dd1a16ee3a638c20bc7aff9019d052e50ae23000`
9. `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a`

All nine remain frozen, unaccepted, historical, and non-canonical.

---

## 6. Repair-9 Failed-Byte Isolation Boundary

The Repair-9 Builder must be provisioned directly at the clean Repair-9 dispatch commit and implement the obligations from clean canonical governance authority.

**Strictly Forbidden Implementation Inputs:**
- `git show failed:<path>`
- `git cat-file blob failed:<path>`
- failed-candidate diffs, patches, cherry-picks, checkouts, or restores
- archive, format-patch, or patch extraction
- reading, copying, or rsyncing historical failed Builder/verifier worktree implementation files.

Failed SHAs may be referenced exclusively for non-ancestry verification commands.

---

## 7. Authority, DoR, and 19-Path Write-Lock Sufficiency

The confirmed Repair-9 obligations address test-contract completeness and orchestrator stage emission coverage. They introduce no new Product or Domain semantics, no new architecture component, no schema changes, no new dependencies, and no new write paths.

- **Task Packet:** Revision 2 remains **OPERATIVE**.
- **Formal DoR:** Revision 2 remains **PASS**.
- **READY:** **YES FOR REPAIR 9**.
- **Human Reserved:** **NOT REQUIRED**.
- **Migration:** **NO MIGRATION**.
- **Write Lock:** Exactly the 19 authorized paths remain unchanged:
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

## 8. Durable Repair-9 Dispatch

The single governance-only commit containing this record is the sole dispatch authority for Repair 9.

- **Repair 9:** `AUTHORIZED / DURABLY DISPATCHED`.
- **Current Builder:** `ENG-011 REPAIR 9 BUILDER`.
- **Builder Branch:** `eng-011-builder-repair-9`.
- **Builder Worktree:** `/private/tmp/prj226-eng011-builder-repair-9`.
- **Implementation State:** `NOT YET STARTED`.
- **Deterministic Verification for Repair 9:** `NOT YET PERFORMED`.
- **Security / Operability / Semantic Review:** `NOT AUTHORIZED UNTIL FRESH REPAIR-9 DETERMINISTIC PASS`.
- **Push:** `NOT PERFORMED`.

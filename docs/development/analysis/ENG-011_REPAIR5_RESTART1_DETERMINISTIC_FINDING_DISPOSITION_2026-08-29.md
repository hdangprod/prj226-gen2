# ENG-011 Repair-5 Restart-1 Deterministic Finding Disposition and Repair-6 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-29

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-5 RESTART-1 DETERMINISTIC FINDING DISPOSITION / REPAIR-6 DISPATCH

**Repair-5 Restart-1 dispatch:** `e7b572797020535b4ad1011876f9ae9a8cb0faa7`

**Dispatch tree:** `544ebbe9f83b54b13a557248cfa8086be813553e`

**Repair-5 Restart-1 candidate:** `3adbe1ad5ef539b01f1af0c95603f02542000665`

**Candidate tree:** `dd6cabe65a78a515340f0a1b8f42facc828c489e`

**Candidate topology:** sole parent `e7b572797020535b4ad1011876f9ae9a8cb0faa7`; distance from dispatch `1`

**Candidate canonical changed-path aggregate:** `32c693b1a42b1c149eb6b4c7286821f93fb79157f8ee468c97f71db24906ed00`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Deterministic verification:** `VALID / FINDINGS`

**Controller outcome:** `REPAIR 6 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 6`

**Current Builder:** `ENG-011 REPAIR 6 BUILDER`

**Builder branch:** `eng-011-builder-repair-6`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-6`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

## 1. Verifier attempt adjudication

Attempt 1 is `BLOCKED BEFORE VERIFICATION / VERIFIER_ISOLATION_COLLISION`. It established no candidate defect and is not used to invalidate later evidence.

Attempt 2 ran in the fresh detached verifier worktree `/private/tmp/prj226-eng011-repair5-restart1-dv-retry-1`. It is the operative deterministic verification and returned:

`ENG-011 REPAIR 5 RESTART-1 DETERMINISTIC VERIFICATION: FINDINGS`.

The reported passing evidence remains valid for startup identity, candidate topology, failed-candidate non-ancestry, Builder provenance, immutable range diff, authorized write boundary, migration immutability, all eighteen discovered Vitest configurations, repository verification commands, Repair-5 TC-13 and TC-20 repairs, the closed failure-category contract, and final verifier cleanliness. Those passes do not override the blocking findings below.

## 2. Independent Controller adjudication

The Controller independently inspected candidate content through immutable Git objects. No failed-candidate implementation byte is authorized as a Repair-6 Builder input.

### `ENG-011-R5R1-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 6

**Classification:** `AUTHORIZATION_CONTRACT / DELETION_REQUEST_ATTEMPT_SEPARATION_ABSENT`

**Authority:** Task Packet revision 2 requires `requestId` to identify one interaction attempt, distinct interactions to use distinct request IDs, and the deletion-confirmation interaction to use a distinct request ID.

**Independent evidence:**

- `DeletionDirectionOutcome` carries the classified direction, scope, intent, and prompt, but no initial direction request identity.
- `DeletionConfirmationInput` accepts direction, scope, confirmation evidence, operation ID, and an observation context, but no initial direction request identity.
- `initiateDeletion` and `confirmDeletion` therefore have no bounded comparison that can reject `confirmationRequestId === initialRequestId`.
- The committed deletion observability test creates one observation context and passes it to both turns, so its Turn 1 and Turn 2 evidence use the same request ID while confirmation proceeds to accepted deletion evidence.
- The Human Control test separately rejects reuse of the same trusted-interaction evidence object, but that does not enforce request-attempt identity separation when a second evidence object is paired with the same request ID.

**Durable defect wording:** Distinct request-attempt separation is not enforced. The same `requestId` may represent both deletion direction and confirmation, and deletion can proceed despite invalid attempt identity under the Task Packet anti-replay/two-turn contract. This finding does not assert a broader change to the ENG-007 Human Control decision.

**Repair requirement:** Bind the initial direction request identity into the deletion direction/confirmation contract, or implement a bounded equivalent. Turn 2 must reject when the confirmation request ID equals the initial request ID, with no authorization success, no deletion write, and no accepted user-visible deletion outcome. A distinct valid Turn 2 remains allowed after scope validation, confirmation classification, and Human Control authorization.

### `ENG-011-R5R1-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 6

**Classification:** `TEST_CONTRACT / INCOMPLETE_STATIC_SCAN_ERROR_MESSAGE_OMISSION`

**Independent evidence:** The committed TC-21 raw-error rule detects `error.stack`, `err.stack`, `JSON.stringify(error)`, and `JSON.stringify(err)`. It does not detect `error.message` or `err.message`. Its positive controls exercise `error.stack` only and therefore do not prove the omitted member-access patterns.

**Repair requirement:** Extend the bounded production-file scanner to detect actual `error.message` and `err.message` member access used at the prohibited raw-error classification/evidence boundary, with positive synthetic controls for both. The scanner remains limited to authorized production files, is not generalized DLP, and must not ban ordinary static text containing the words “error message.”

### `ENG-011-R5R1-DV-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 6

**Classification:** `OBSERVABILITY_TRUTHFULNESS / REPLAY_USER_VISIBLE_STATUS_INFLATION`

**Independent evidence:** In the shared accepted-mutation evidence helper, an accepted result with `commitDisposition === "already-committed"` emits persistence status `duplicate`, then unconditionally emits user-visible status `accepted`. This loses the required fresh-commit versus authoritative-replay distinction at the user-visible evidence stage.

**Repair requirement:** An already-committed authoritative replay must emit persistence `duplicate` and user-visible `duplicate`, or the exact Task-Packet-defined equivalent preserving duplicate truth. A fresh commit must emit persistence `accepted` and user-visible `accepted`. Product outcome value and authoritative mutation count remain unchanged. Committed tests must prove both stages for both dispositions.

## 3. Aggregate evidence correction

The candidate has seventeen actual changed paths, not nineteen. The candidate manifest convention is actual candidate-changed paths only, ordered by repository-relative path under `LC_ALL=C`, with each exact candidate blob represented as:

`<SHA256><two ASCII spaces><repo-relative path><LF>`

The Controller recomputed the manifest from `git diff-tree --no-commit-id --name-only -r 3adbe1ad5ef539b01f1af0c95603f02542000665` and exact `git cat-file blob` bytes:

```text
911c5b7b497e8bd8efc9255bc8a6e08f6e1e71a7f565faa47b65062db4af6219  src/application/contracts/operations.ts
0d3bddf9f362c968e0b99e02cd4d57497aba8a2b90630c75e9f333cac933a469  src/application/ports/observability/index.ts
e07e29a106c31b472c062708ef8c75ab4f3bce92c97fdbd04ccfa9a669f95da6  src/application/ports/observability/operationalEvidence.ts
ea7c27a7bb7d9623eb7e3e18860470cc6805209ca086f8f009bee894bf8c6882  src/application/services/interaction/interactionOrchestrator.ts
525103b5b25f4c53ac8066b0fbcf088df0bb3193291a12c68e3e157e318316db  src/application/services/interaction/interactionTypes.ts
95d399600e71fd9079ba2e581072577124367167fa7b96b31a618546b168b99d  src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts
8d23610a50085414178e73d07f0821f4529686e58eb765756d759c6f18d06d4b  src/application/services/projectActionContext/projectActionContextService.ts
ce10cbc8be2df920ce9084d08657a3a5d49349a2afc8bdd0dda6818489f3ad96  src/infrastructure/observability/cloudflareOperationalEvidence.ts
aa51909d343b6cd0e85f93af9e09023220b1cac1814f2240dcd8fa93d7fca611  src/infrastructure/observability/index.ts
5bdcd5dc112e73ac2d0dbc9dd5aae7e5bbf7674e800ee47424d277f0b81c0c73  tests/application/ports/observability/operationalEvidence.test.ts
4bdb0211023985e0f6dd906b2da80de703a92d76c2eeba5ab834f0d3a421681a  tests/application/ports/observability/vitest.config.ts
8ec1ae11a315c8e46d371f37f0e5af8ba5d5d86dbc2cef2990afd301d206cd74  tests/application/services/interaction/interactionObservability.test.ts
32dd30c01ac482439baf83037b67d0ca20a890469e9a8e6ade1cddb2ac259773  tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts
df136c0479712ede790b5c90ac15a4b345d658887d54108ba167eed833312f36  tests/application/services/projectActionContext/projectActionContextService.test.ts
62a1c5d1a2747b369233c6be9fd2103af8278bab9b66037ff90bf0014474ed75  tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts
ba31cb094819cc387e9dff1cd17f339ab44fb59032c1931ca9fd33c5795c2b3b  tests/infrastructure/observability/vitest.config.ts
142a930ee7a2635c4af7959950943765a6d3516e60d62d002279c2de91991251  tests/integration/d1/projectActionContext/projectActionContextPersistence.test.ts
```

The exact manifest SHA-256 is:

`32c693b1a42b1c149eb6b4c7286821f93fb79157f8ee468c97f71db24906ed00`.

The verifier-reported `08d90c6d80eee717bb1396f53cda1bab6621fdce34b7302d051c8d40f481528c` includes all nineteen authorized path blobs, including unchanged `src/application/services/interaction/index.ts` and `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts`. It is classified as `AUTHORIZED-19-PATH SNAPSHOT AGGREGATE / NOT CANONICAL CANDIDATE-CHANGED-PATH AGGREGATE`.

**Disposition:** `EVIDENCE / AGGREGATE_SCOPE_MISMATCH / NON-BLOCKING / REPORT-ONLY / CORRECTED`.

## 4. Candidate freeze and review boundary

Repair-5 Restart-1 candidate `3adbe1ad5ef539b01f1af0c95603f02542000665` is:

`FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`.

It must not be amended, repaired in place, merged, cherry-picked, canonicalized, or pushed. Security/operability/semantic review is not authorized for this candidate.

Historical failed implementation candidates are:

1. `8baa7808fa3dcd6e0475d9176e124973959d52d7`
2. `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`
3. `49990f306ee67b62ae017f0d63fa556bde06d23a`
4. `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`
5. `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`
6. `3adbe1ad5ef539b01f1af0c95603f02542000665`

All remain frozen, unaccepted, historical, and non-canonical.

## 5. Scope, authority, and readiness

The accepted findings do not change Product semantics, Domain semantics, Runtime Architecture, Human Control policy, provider strategy, migration, DATA-001 authority, or retry/recovery authority. Recovery remains classification/evidence only. Automatic authoritative mutation retry remains prohibited.

All required Repair-6 writes remain within the exact existing nineteen-path lock:

- R001: `interactionTypes.ts`, `interactionOrchestrator.ts`, and interaction tests.
- R002: `interactionObservability.test.ts`.
- R003: `interactionOrchestrator.ts` and `interactionObservability.test.ts`.

No twentieth path is required. Therefore:

- Task Packet revision 2: `OPERATIVE`.
- Formal DoR revision 2: `PASS`.
- READY: `YES FOR REPAIR 6`.
- Write lock: `19 EXACT PATHS / SUFFICIENT / UNCHANGED`.
- Migration: `NO MIGRATION`.
- Human Reserved: `NOT REQUIRED`.

Repair 6 must preserve the passing Repair-5 repairs and established contracts, including substantive TC-13, derived-state TC-20 evidence, the closed failure-category contract, all seven provider mappings, failure-stage truthfulness, observation-context provenance, identifier/data minimization, Human Control first-turn deletion truthfulness, the mixed-outcome truth table, TrustedInteractionIngress ordering, fail-open sink behavior, and migration immutability.

## 6. Repair-6 provenance isolation

The Repair-6 Builder may use this abstract finding disposition, Task Packet revision 2, Formal DoR revision 2, the clean Repair-6 dispatch base, and accepted canonical upstream source.

It must not use implementation bytes, diffs, patches, or worktree content from any failed candidate. Failed SHAs may be used only for ancestry checks. Checkout/restore, cherry-pick, patch extraction, `git show` or `git cat-file` of failed implementation paths, `cp`, and `rsync` from historical Builder or verifier worktrees are prohibited Repair-6 inputs.

## 7. Durable Repair-6 dispatch

The Controller durably authorizes:

- **Repair 6:** `AUTHORIZED / DURABLY DISPATCHED`.
- **Dispatch authority:** the single governance-only commit containing this record.
- **Current Builder:** `ENG-011 REPAIR 6 BUILDER`.
- **Builder branch:** `eng-011-builder-repair-6`.
- **Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-6`.
- **Write lock:** exact nineteen paths, unchanged from Task Packet revision 2.
- **Implementation:** `NOT YET STARTED`.
- **Deterministic verification for Repair 6:** `NOT YET PERFORMED`.
- **Security/operability/semantic review:** `NOT AUTHORIZED UNTIL A FRESH REPAIR-6 DETERMINISTIC PASS`.
- **Push:** `NOT PERFORMED / NOT AUTHORIZED`.

The Repair-6 dispatch descends solely from the current canonical governance HEAD. It does not descend from the failed Repair-5 Restart-1 candidate.

## 8. Next role

`ENG-011 REPAIR 6 BUILDER`

The Controller stops after provisioning and verifying the fresh Builder worktree. No implementation is performed by this Controller.

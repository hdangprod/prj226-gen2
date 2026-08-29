# ENG-011 Repair-6 Deterministic Finding Disposition and Repair-7 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-29

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-6 DETERMINISTIC FINDING DISPOSITION / REPAIR-7 DISPATCH

**Repair-6 dispatch:** `34d24538d5300f4ea4976f3f79060cf3166ef43c`

**Repair-6 candidate:** `dce0f5babc9156383620ba8511f074197995b6a6`

**Candidate tree:** `6f13a3c8278b62184476c2cae73f7239c2a4ceff`

**Candidate topology:** sole parent `34d24538d5300f4ea4976f3f79060cf3166ef43c`; distance from dispatch `1`

**Canonical changed-path aggregate:** `88c8a46e4860d7646ed9c5a46a8f3ccce60bdbff871cf76ac834bcd85440a5c3`

**Candidate scope:** 18 actual changed paths; `src/application/services/interaction/index.ts` authorized but unchanged

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Deterministic verification:** `VALID / FINDINGS`

**Controller outcome:** `REPAIR 7 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 7`

**Current Builder:** `ENG-011 REPAIR 7 BUILDER`

**Builder branch:** `eng-011-builder-repair-7`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-7`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

## 1. Operative verifier evidence

Attempt 1 is `BLOCKED BEFORE VERIFICATION / STALE GIT WORKTREE REGISTRATION / VERIFIER ISOLATION COLLISION`. It established no candidate defect.

Attempt 2 is `VALID / FRESH / SUBSTANTIVE DETERMINISTIC VERIFICATION` and returned `ENG-011 REPAIR 6 DETERMINISTIC VERIFICATION: FINDINGS`. It is the operative deterministic gate. Its passing identity, topology, scope, aggregate, migration, six-failed-candidate non-ancestry, provenance, whitespace, eighteen-config Vitest, required toolchain, local-D1, and cleanup results remain valid but do not override the findings below.

## 2. Independent Controller reproductions

The Controller inspected the immutable candidate through a fresh detached audit checkout created directly from the candidate, not through a failed Builder or verifier worktree. Temporary audit probes were not committed and are not Repair-7 implementation inputs.

### `ENG-011-R6-DV-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 7

**Classification:** `AUTHORIZATION_CONTRACT / DELETION_REQUEST_ATTEMPT_SEPARATION_ABSENT`

`DeletionDirectionOutcome.initialRequestId` and `DeletionConfirmationInput.initialRequestId` are optional. `initiateDeletion` also stores Turn-1 identity in `InteractionOrchestrator.deletionDirectionRequestIds`, an instance-local `WeakMap`. `confirmDeletion` enforces separation only when either optional caller input or the same orchestrator's `WeakMap` supplies the identity.

Independent execution used orchestrator A for Turn 1 and orchestrator B for Turn 2, the same runtime and classified direction, `requestId = req-turn-1` for both turns, and omitted `initialRequestId`. Result: `accepted`; authorization succeeded once; `deleteConfirmed` ran once; accepted user-visible deletion evidence was emitted once.

The contract must explicitly and deterministically bind Turn-1 request identity so the guarantee survives orchestrator/application instance boundaries. It must not depend on optional caller memory, object identity, `WeakMap`, or other process-local state. No new persistence infrastructure is required or authorized.

### `ENG-011-R6-DV-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 7

**Classification:** `DATA-001 / IDENTIFIER_CONTENT_CHANNEL`

The identifier validator admits the broad syntax `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}` and then requires only one separator. Independent probes produced:

| Probe | Candidate result |
| --- | --- |
| `ordinaryCamelCaseProse` | rejected |
| `ordinary-prose-like-identifier` | accepted |
| 128-character alphabetic content-like value | rejected |
| `credential-api_key-safe-syntax` | rejected |

Delimiter-separated prose therefore remains a caller-content channel through correlation, request, operation, and other evidence identifiers. Repair 7 must use a narrow deterministic identifier contract that preserves valid repository identifier forms without generalized DLP or global user-prose inspection.

### `ENG-011-R6-DV-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 7

**Classification:** `OBSERVABILITY_CONTRACT / REQUIRED_STAGE_AND_TERMINAL_EVIDENCE_ABSENT`

The finite audit below distinguishes actual stage and call history. `R` means retrieval attempted, `A` authorization attempted, and `P` authoritative persistence/service mutation attempted. Every row emits request-attempt evidence first.

| Family / outcome origin | Returned Product result | R/A/P | Required stage / category | Required terminal status | Actual evidence | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Project `completeProject`: project not found | `clarification-required / ambiguous-target` | Y/N/N | retrieval / `not-found` | user-visible clarification-required | request only | DEFECT |
| Project `completeProject`: retrieval failure | `failed`, upstream retryability | Y/N/N | retrieval / `retrieval-failed` | user-visible failed | request only | DEFECT |
| Project `establishProject`: authentication prohibition | `prohibited` | N/N/N | interpretation / `prohibited-input` | user-visible denied | request only | DEFECT |
| Project: classification rejection | clarification/prohibited/unresolved | as applicable/N/N | interpretation / exact closed category | matching terminal non-success | request only | DEFECT |
| Project: authorization denial | upstream non-authorization result | as applicable/Y/N | authorization / `authorization-denied` | matching terminal non-success | request only | DEFECT |
| Action `createAction`: project not found or retrieval failure | clarification or failed | Y/N/N | retrieval / exact `not-found` or `retrieval-failed` | matching terminal non-success | request only | DEFECT |
| Action: content prohibition, classification rejection, authorization denial | upstream non-success | as applicable | interpretation or authorization / exact category | matching terminal non-success | request only | DEFECT |
| Context `acceptContextFacts`: project/facts/progress retrieval failure | clarification or failed | Y/N/N | retrieval / exact category | matching terminal non-success | request only | DEFECT |
| Context: content prohibition, classification rejection, authorization denial | upstream non-success | as applicable | interpretation or authorization / exact category | matching terminal non-success | request only | DEFECT |
| Progress `acceptProgress`/`correctProgress`: project/action/facts/progress retrieval or currentness failure | clarification or failed | Y/N/N | retrieval / exact category | matching terminal non-success | request only | DEFECT |
| Progress: content prohibition, classification rejection, authorization denial | upstream non-success | as applicable | interpretation or authorization / exact category | matching terminal non-success | request only | DEFECT |
| Knowledge `captureKnowledge`: project not found/retrieval failure | clarification or failed | Y/N/N | retrieval / exact category | matching terminal non-success | request only | DEFECT |
| Knowledge `correctKnowledge`: prior not found/retrieval failure | failed | Y/N/N | retrieval / exact `not-found` or `retrieval-failed` | user-visible failed | request only | DEFECT |
| Knowledge: content prohibition, classification rejection, authorization denial | upstream non-success | as applicable | interpretation or authorization / exact category | matching terminal non-success | request only | DEFECT |
| Project/Action/context/progress/Knowledge: constraint conflict after mutation service | `failed / constraint-conflict` | as applicable/Y/Y | persistence / `constraint-conflict` | user-visible failed | persistence failed plus user-visible failed | PASS |
| Same families: operation-ID conflict after mutation service | `failed / operation-id-conflict` | as applicable/Y/Y | persistence / `operation-id-conflict` | user-visible failed | persistence failed plus user-visible failed | PASS |
| Same families: durability failure after mutation service | `failed / durability-failure`, retryable | as applicable/Y/Y | persistence / `persistence-durability` | user-visible failed | persistence failed plus user-visible failed | PASS |
| Deletion: persistence indeterminate | failed, manual-check disposition | N/Y/Y | persistence / `persistence-indeterminate` | user-visible indeterminate/failed truth | authorization success plus persistence indeterminate; no terminal evidence | DEFECT |

The source repeats these early-return shapes across Project, Action, context, progress, and Knowledge methods. The Controller therefore accepts the verifier's broader family statement only to the finite extent shown above. Repair 7 must implement an explicit finite outcome-to-evidence mapping. It must not parse `Error.message`/`Error.stack`, use a generic catch-all string classifier, invent categories, or report persistence failure when persistence was not attempted.

### `ENG-011-R6-DV-R004` — ACCEPTED / BLOCKING / BOUND TO REPAIR 7

**Classification:** `TEST_CONTRACT / ORIGINAL_TC_AND_R001_R009_PRESERVATION_NOT_SUBSTANTIVE`

Candidate ENG-011-specific suites contain 3 operational-port executions, 14 interaction-observability executions, and 1 infrastructure execution. Counts are diagnostic only; the disposition below is based on behavior and assertions. File aliases: `OE` = `tests/application/ports/observability/operationalEvidence.test.ts`; `IO` = `tests/application/services/interaction/interactionObservability.test.ts`; `CF` = `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`; `PAC/KP/D1` = the four authorized service/integration regression files.

| Contract | Committed execution and assertion audit | Substantive disposition |
| --- | --- | --- |
| TC-01 | `OE` brands/freezes a valid context and rejects no-separator prose, one credential form, and throwing input; delimiter prose is untested and accepted | PARTIAL / NOT FULLY SUBSTANTIVE |
| TC-02 | `OE` asserts freeze, one unknown key, and NaN rejection; exact enum, numeric boundary, and caller-mutation matrix is incomplete | PARTIAL |
| TC-03 | `IO` exercises same-instance same-ID rejection and distinct-ID success; cross-instance separation is absent | PARTIAL / BLOCKING |
| TC-04 | `IO` excludes one provider-private string; `CF` checks two absent fields; the required prohibited-surface fixture matrix is absent | PARTIAL |
| TC-05 | `OE` proves one unsafe operation ID is omitted; identifier-channel coverage is incomplete | PARTIAL |
| TC-06 | No successful advisory stage sequence or no-authorization/no-persistence sink assertion | ABSENT |
| TC-07 | `IO` executes all seven provider failure categories and privacy assertion; advisory/proposal/uncertain/unable outcome mapping is not exercised | PARTIAL |
| TC-08 | No behavioral evidence matrix for validation, prohibition, ambiguity, denial, unresolved, and not-found | ABSENT |
| TC-09 | `IO` executes Project fresh/replay success only; no Action/context/progress or persistence-failure evidence | PARTIAL |
| TC-10 | `KP/D1` preserve service results, but no Knowledge observability success/prohibition/conflict/failure sink assertions | ABSENT AS OBSERVABILITY PROOF |
| TC-11 | No retrieval found/not-found/failure evidence matrix | ABSENT |
| TC-12 | `IO` covers two deletion request-ID flows only; export and deletion rejection/not-found/failure/indeterminate/duplicate evidence is absent | PARTIAL |
| TC-13 | No provider-success to attempted mutation to persistence-failure execution/assertion | ABSENT / BLOCKING |
| TC-14 | No mixed-outcome truth-table execution/assertion | ABSENT |
| TC-15 | `IO` proves replay status for one Project; `PAC/D1` preserve operation conflict at service level, not sink evidence | PARTIAL |
| TC-16 | No separate explicit retry-attempt evidence or no-automatic-invocation behavior test | ABSENT |
| TC-17 | `CF` executes sink and asserts one structured snapshot with no message/payload | SUBSTANTIVE |
| TC-18 | `IO` executes synchronous throw and asynchronous rejection and deep-equals advisory Product result | SUBSTANTIVE REPRESENTATIVE PROOF |
| TC-19 | `OE` rejects NaN only; valid, negative, infinite, and all three diagnostic fields are not covered | PARTIAL |
| TC-20 | Production emits derived-state not-applicable after accepted mutation, but no committed test asserts an actual sink event | ABSENT / BLOCKING |
| TC-21 | `IO` scans all ten production lock paths and has raw-Error controls, but misses required architecture families below | PARTIAL / BLOCKING |

| Preservation contract | Committed execution and assertion audit | Substantive disposition |
| --- | --- | --- |
| R3-TC-01 | `OE` rejects an unbranded structural context forgery and hostile proxy | SUBSTANTIVE |
| R3-TC-02 | `OE` omits delimiter-prose probes and permits one | NOT SUBSTANTIVE / BLOCKING |
| R3-TC-03 | `IO` supplies conflicting ambient operation ID and asserts authoritative ID for one Project mutation | SUBSTANTIVE REPRESENTATIVE PROOF |
| R3-TC-04 | Same-instance deletion direction binding only; cross-instance guarantee absent | PARTIAL / BLOCKING |
| R3-TC-05 | Seven provider failure categories execute; provider success/diagnostics matrix incomplete | PARTIAL |
| R3-TC-06 | No advisory/proposal/mutation retrieval evidence matrix | ABSENT |
| R3-TC-07 | Post-service failures map, but pre-persistence outcomes silently return | PARTIAL / BLOCKING |
| R3-TC-08 | `IO` distinct-turn valid flow asserts exactly one Turn-2 authorization success | SUBSTANTIVE FOR VALID FLOW |
| R3-TC-09 | Project fresh/replay evidence only; Action/context/progress absent | PARTIAL |
| R3-TC-10 | Knowledge service/D1 commit disposition is tested, but no Knowledge evidence sink behavior | ABSENT AS OBSERVABILITY PROOF |
| R3-TC-11 | No mixed all-success/partial/all-failure/heterogeneous non-success matrix | ABSENT |
| R3-TC-12 | No TrustedInteractionIngress ordering/failure sink execution | ABSENT |
| R3-TC-13 | Path list is complete, pattern-family controls are not | PARTIAL / BLOCKING |
| R3-TC-14 | TC-01..TC-21 matrix is materially incomplete | NOT SATISFIED |
| R3-TC-15 | Negative source scan exists, but no substantive positive controls for several retry/fallback/background constructs | PARTIAL |
| R3-TC-16 | Operative verifier passed toolchain, dynamic Vitest, local D1, migration, lock, and cleanup; npm anomaly is separately environment-only | SUBSTANTIVE EXTERNAL GATE EVIDENCE |
| R3-TC-17 | Operative verifier proved the six pre-Repair-6 failed candidates present and non-ancestral | SUBSTANTIVE EXTERNAL GATE EVIDENCE |
| R3-TC-18 | Operative verifier passed Builder provenance | SUBSTANTIVE EXTERNAL GATE EVIDENCE |

TC-13 and TC-20 are not substantively committed, and the wider original/preservation matrix is materially absent. Repair 7 must restore behavioral proof rather than test names or historic numeric totals.

### `ENG-011-R6-DV-R005` — ACCEPTED / BLOCKING / BOUND TO REPAIR 7

**Classification:** `TEST_CONTRACT / INCOMPLETE_TC21_STATIC_SCAN`

The committed scan preserves detection of `error.message`, `err.message`, `error.stack`, `err.stack`, and raw `JSON.stringify(error|err)`. Independent positive probes against the exact committed rule array returned `false` for every reported miss:

| Required family probe | Detected? |
| --- | --- |
| `queue.send(message)` | no |
| `scheduled(controller)` | no |
| `ctx.waitUntil(run())` | no |
| `retryAuthoritativeMutation()` | no |
| `routeToFallbackProvider()` | no |
| `env.TELEMETRY.put(key,value)` | no |
| `attributes: { unsafe: value }` | no |
| `UPDATE telemetry SET status = 1` | no |

Repair 7 must retain a bounded source scanner with substantive positive controls for external telemetry SDKs; queue/background and scheduled/background execution; automatic authoritative retry; provider routing/fallback; persistent telemetry including D1/KV/R2-style writes; raw Error access/serialization; and arbitrary metadata/payload/details/attributes bags. Patterns must target code/architecture constructs and avoid generalized DLP or global bans on legitimate business words.

## 3. npm verifier environment anomaly

Independent reproduction with the permitted shared `node_modules` symlink returned `npm ls --all` exit 1 with dependencies classified as extraneous. The same command in the canonical repository root returned exit 0. Candidate package and lock files are unchanged.

**Disposition:** `NON-BLOCKING / ENVIRONMENT / SYMLINKED_DEPENDENCY_ACCOUNTING / NOT A CANDIDATE DEFECT / NOT BOUND TO REPAIR 7`.

## 4. Repair-6 freeze and failed-candidate set

Repair-6 candidate `dce0f5babc9156383620ba8511f074197995b6a6` is frozen, unaccepted, historical evidence only, and non-canonical. It must not be amended, repaired in place, merged, cherry-picked, canonicalized, or pushed. Security/operability/semantic review is not authorized.

The seven frozen failed implementation candidates are:

1. `8baa7808fa3dcd6e0475d9176e124973959d52d7`
2. `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`
3. `49990f306ee67b62ae017f0d63fa556bde06d23a`
4. `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`
5. `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`
6. `3adbe1ad5ef539b01f1af0c95603f02542000665`
7. `dce0f5babc9156383620ba8511f074197995b6a6`

All remain `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`.

## 5. Authority, DoR, and write-lock sufficiency

No accepted finding requires a Product semantic, Domain semantic, Runtime Architecture, Human Control policy, provider strategy, migration, DATA-001 authority, or retry/recovery authority change. Recovery remains classification/evidence only; automatic authoritative mutation retry remains prohibited.

| Repair-7 obligation | Exact authorized paths sufficient for the work |
| --- | --- |
| R001 explicit direction/confirmation request identity | `interactionTypes.ts`, `interactionOrchestrator.ts`, `interactionObservability.test.ts`; `interaction/index.ts` if an export changes |
| R002 narrow identifier contract | `operationalEvidence.ts`, `operationalEvidence.test.ts`, `interactionObservability.test.ts` |
| R003 finite mutation outcome-to-evidence mapping | `interactionOrchestrator.ts`, with the two authorized mutation services only if exact upstream disposition propagation is required; authorized interaction/service/integration tests |
| R004 substantive TC-01..TC-21 and R001-R009/R3 preservation | the five authorized observability test/config paths plus four authorized service/integration regression paths |
| R005 complete bounded TC-21 scanner | `interactionObservability.test.ts` |

The existing application contract and two mutation-service paths already carry the closed persistence disposition needed by the post-persistence mapping; no twentieth path is required. Therefore Task Packet revision 2 remains operative, Formal DoR revision 2 remains `PASS`, READY is `YES FOR REPAIR 7`, the exact nineteen-path lock is sufficient and unchanged, migration remains `NO MIGRATION`, and Human Reserved remains `NOT REQUIRED`.

Repair 7 must preserve the verified Repair-6 successes: same-instance same-request deletion rejection; distinct-request valid deletion with Turn-1 no authorization success; fresh/replay persistence and user-visible status mapping with unchanged Product value; the closed failure-category union; raw Error member/serialization detection; provider boundary; migration boundary; and no automatic mutation retry.

## 6. Repair-7 failed-byte isolation

The Repair-7 Builder may use only the clean Repair-7 dispatch baseline, Task Packet revision 2, Formal DoR revision 2, this abstract disposition, accepted canonical source, and repository conventions.

It must not read or reuse implementation bytes, diffs, patches, blobs, or worktree content from any failed candidate. Failed SHAs may be used only for ancestry checks. Checkout/restore, cherry-pick, patch extraction, `git show`/`git cat-file` of failed implementation paths, `cp`, and `rsync` from historical Builder/verifier worktrees are prohibited inputs.

## 7. Durable Repair-7 dispatch

The single governance-only commit containing this record is the Repair-7 dispatch authority and descends from the current canonical governance lineage, not from a failed implementation candidate.

- **Repair 7:** `AUTHORIZED / DURABLY DISPATCHED`.
- **Task Packet:** `REVISION 2 / OPERATIVE`.
- **Formal DoR:** `PASS`.
- **READY:** `YES`.
- **Write lock:** `19 EXACT PATHS / UNCHANGED`.
- **Current Builder:** `ENG-011 REPAIR 7 BUILDER`.
- **Builder branch:** `eng-011-builder-repair-7`.
- **Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-7`.
- **Migration:** `NO MIGRATION`.
- **Human Reserved:** `NOT REQUIRED`.
- **Failed-candidate byte reuse:** `PROHIBITED`.
- **Implementation:** `NOT YET STARTED`.
- **Deterministic verification for Repair 7:** `NOT YET PERFORMED`.
- **Security/operability/semantic review:** `NOT AUTHORIZED UNTIL FRESH REPAIR-7 DETERMINISTIC PASS`.
- **Push:** `NOT PERFORMED`.

## 8. Next role

`ENG-011 REPAIR 7 BUILDER`

The Controller stops after provisioning and verifying the fresh Builder worktree. No implementation or Builder tests are performed.

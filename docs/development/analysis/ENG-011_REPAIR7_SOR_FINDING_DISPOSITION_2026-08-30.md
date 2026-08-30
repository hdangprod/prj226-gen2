# ENG-011 Repair-7 Security / Operability / Semantic Finding Disposition and Repair-8 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-30

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** REPAIR-7 SECURITY / OPERABILITY / SEMANTIC FINDING DISPOSITION / REPAIR-8 DISPATCH

**Repair-7 dispatch:** `725004759dca238e64cd06aa84e9fa87d35fe5df`

**Repair-7 candidate:** `dd1a16ee3a638c20bc7aff9019d052e50ae23000`

**Candidate tree:** `b71baa5f084df27efc031b2a4891cf4cec8a4889`

**Candidate topology:** sole parent `725004759dca238e64cd06aa84e9fa87d35fe5df`; distance from dispatch `1`

**Canonical changed-path aggregate:** `12f94bff7ffeb72daf41f34190b8cbcc7fe0df7d0b70a299f6c871dd8ab31940`

**Candidate scope:** 18 actual changed paths; `src/application/services/interaction/index.ts` authorized but unchanged

**Repair-7 deterministic verification:** `PASS`

**Repair-7 S/O/S review:** `VALID / FINDINGS`

**Candidate disposition:** `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY / NON-CANONICAL`

**Controller outcome:** `REPAIR 8 AUTHORIZED UNDER UNCHANGED 19-PATH WRITE LOCK`

**Task Packet:** `REVISION 2 / OPERATIVE`

**Formal DoR:** `REVISION 2 / PASS`

**READY:** `YES FOR REPAIR 8`

**Current Builder:** `ENG-011 REPAIR 8 BUILDER`

**Builder branch:** `eng-011-builder-repair-8`

**Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-8`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

## 1. Bound Repair-7 evidence

The fresh Repair-7 deterministic verification is valid historical evidence and remains `PASS`. It established exact identity and topology, clean isolation, seven prior failed candidates present but non-ancestral, Builder provenance, exact write-lock and aggregate identity, unchanged migration, substantive repair of `ENG-011-R6-DV-R001` through `R005`, the complete `TC-01` through `TC-21` and `R3-TC` preservation contracts, full dynamic Vitest and toolchain success, local-D1 success, and final verifier cleanup.

The subsequent fresh independent security / operability / semantic review is also valid and returned `FINDINGS`: `ENG-011-R7-SOR-R001`, `ENG-011-R7-SOR-R002`, and `ENG-011-R7-SOR-R003`, all blocking, with no non-blocking findings. A deterministic pass does not override later semantic/security evidence under Delivery Contract revision 1.

The Controller inspected the immutable Repair-7 candidate through a fresh detached audit checkout created directly from the candidate. Temporary runtime probes were not committed and are not Repair-8 implementation inputs.

## 2. `ENG-011-R7-SOR-R001` — ACCEPTED / BLOCKING / BOUND TO REPAIR 8

**Classification:** `DATA-001 / SECURITY / IDENTIFIER_CONTENT_CHANNEL`

**Authority:** Task Packet revision 2 requires validated opaque correlation/request identifiers never derived from user text, permits an operation identifier only when safe to expose, requires malformed or content-like identifiers to fail closed, and binds `R3-TC-02`. The Repair-6 disposition already required a narrow deterministic identifier contract without generalized DLP.

**Reproduced evidence:** The candidate accepts all four representative probes:

| Probe | Result |
| --- | --- |
| `req-attackatdawn` | accepted |
| `secretmessage1` | accepted |
| `req-privatehealth` | accepted |
| `corr-bankbalance` | accepted |

The defect is structural, not literal-specific: a separator-free string passes when short and digit-bearing, while a recognized broad prefix admits short prose suffixes.

### Binding Repair-8 opaque identifier grammar

Accepted canonical source establishes the following compatibility facts:

1. Canonical pre-ENG-011 source has no `correlationId` or `requestId` runtime contract or generator. They are new caller-supplied observation-context values and acquire authority only through the ENG-011 constructor.
2. `PersistenceOperationId` is a caller-supplied branded string. Its canonical constructor applies no runtime shape validation, and interaction mutation inputs receive it from callers.
3. Evidence `operationId` is optional. An existing persistence operation ID outside the evidence-safe grammar may and must be omitted; authoritative persistence behavior and identity remain unchanged.
4. No canonical source requires arbitrary alphabetic suffixes, user-derived text, or free-form labels in operational identifiers. UUID use is not required, but canonical UUIDs are a bounded machine-generated compatible family.

Repair 8 must implement only these evidence-safe families, all within the Task Packet's ASCII and 128-character ceiling:

| Family | Binding grammar | Examples |
| --- | --- | --- |
| Canonical UUID | RFC-4122 canonical textual form: lowercase or uppercase hexadecimal `8-4-4-4-12`, supported version nibble `1`–`5`, RFC variant nibble `8`, `9`, `a`, or `b` | `123e4567-e89b-12d3-a456-426614174000` |
| Compact machine ID | one approved compact namespace followed immediately by 1–20 decimal digits; namespaces: `id`, `p`, `a`, `g`, `k`, `corr`, `req`, `op` | `id7`, `p1`, `req2` |
| Structured correlation ID | `corr`, one ASCII separator from `-._:`, optional namespace `session` or `interaction` plus another separator, then 1–20 decimal digits | `corr-7`, `corr-session-7` |
| Structured request ID | `req`, one ASCII separator, optional namespace `turn` or `request` plus another separator, then 1–20 decimal digits | `req-1`, `req-turn-1` |
| Structured operation ID | `op`, one ASCII separator, one finite machine namespace, another ASCII separator, then 1–20 decimal digits. Namespaces: `p`, `a`, `ctx`, `pr`, `k`, `klin`, `project`, `action`, `context`, `progress`, `knowledge`, `export`, `deletion`, `interaction`, `advisory`, `proposal`, `retrieval`, `mixed` | `op-p-1`, `op-project:42` |

Separators may differ between boundaries, as in `op-project:42`. Matching is ASCII case-insensitive for the fixed machine namespaces only. No other prefix, arbitrary suffix string, delimiter-separated prose, separator-free alphabetic content plus a digit, transformed user text, or credential-like value is authorized. Credential-pattern rejection remains an additional defense, not the grammar's authority. The Builder must not add dictionaries, entropy checks, language classification, secret scanning, or generalized DLP.

**Repair-8 obligation:** Enforce this grammar in the observation-context/event contract and add positive and adversarial tests for every family, including accepted-prefix prose, sensitive-looking prose, compact digit-bearing content, long content, transformed user text, and credential-like values. Tests must exercise properties of the grammar rather than only the four reproduced literals.

**Scope mapping:** `src/application/ports/observability/operationalEvidence.ts`, `tests/application/ports/observability/operationalEvidence.test.ts`, and the already-authorized interaction caller tests where needed.

## 3. `ENG-011-R7-SOR-R002` — ACCEPTED / BLOCKING / BOUND TO REPAIR 8

**Classification:** `SECURITY / CONTRACT / DATA-001 / PLATFORM_WRITE_TRUST_BOUNDARY`

**Authority:** Task Packet revision 2 requires a closed immutable event with no free-form message, reason, error, metadata, payload, or content field; unknown keys must be rejected; and the Cloudflare-native emitter must write one validated structured object.

**Reproduced evidence:** `OperationalEvidenceEvent` is structurally forgeable at runtime and `CloudflareOperationalEvidence.emit()` forwards its parameter directly. A direct adapter call with a structurally compatible object plus `message: "USER SECRET"` caused the injected writer to receive that field unchanged.

**Repair-8 obligation:** The platform-write boundary must fail closed. Only constructor-sanctioned, exact closed-schema, semantically coherent events may reach `writer.log()`. Repair 8 may use unforgeable constructor provenance, exact runtime validation, exact reconstruction, or a bounded combination. A marker exported to callers is not provenance. A plain clone and forged values containing `message`, `payload`, `metadata`, `details`, or `attributes`, malformed enums, or malformed diagnostics must not be written. A valid constructor-issued event must be written exactly once. Constructor guarantees must not be weakened.

**Scope mapping:** `src/application/ports/observability/operationalEvidence.ts`, `src/infrastructure/observability/cloudflareOperationalEvidence.ts`, `tests/application/ports/observability/operationalEvidence.test.ts`, and `tests/infrastructure/observability/cloudflareOperationalEvidence.test.ts`.

## 4. `ENG-011-R7-SOR-R003` — ACCEPTED / BLOCKING / BOUND TO REPAIR 8

**Classification:** `OPERABILITY / SEMANTIC / CONTRACT / CONTRADICTORY_EVIDENCE`

**Authority:** Task Packet revision 2 requires status truth for the observed stage, permits `failureCategory` only for applicable non-success outcomes, binds retry disposition to upstream retryability/manual-check truth, distinguishes provider from persistence success, and prohibits semantic inflation.

**Reproduced evidence:** The candidate constructor accepted and sanctioned this contradictory event: provider stage, advisory operation, `status = succeeded`, `failureCategory = persistence-durability`, and `retryDisposition = non-retryable`.

### Binding Repair-8 cross-field invariant contract

#### Status, failure category, and retry disposition

| Status family | Failure category | Retry disposition |
| --- | --- | --- |
| `attempted`, `succeeded`, `advisory`, `proposed`, `accepted`, `duplicate`, `not-applicable` | prohibited | `not-applicable` only |
| `partial` | required and exactly `mixed-outcome` | `non-retryable` only; replay of a materially identical mixed authoritative request is not authorized by evidence |
| `denied` | required and one of `authorization-denied`, `prohibited-input` | `non-retryable` only |
| `clarification-required` | required and one of `clarification-required`, `validation`, `not-found` | `non-retryable` only |
| `unresolved` | required and exactly `unresolved` | `non-retryable` only |
| `indeterminate` | required and exactly `persistence-indeterminate` | `indeterminate-manual-check` only |
| `failed` | required and legal for the event stage | `explicit-retry-eligible` or `non-retryable` only, matching the normalized upstream result; never `not-applicable` or `indeterminate-manual-check` |

For `failed`, these categories are always `non-retryable` for a materially identical request: `validation`, `authorization-denied`, `prohibited-input`, `clarification-required`, `unresolved`, `not-found`, `constraint-conflict`, `operation-id-conflict`, `provider-refused`, `provider-malformed-result`, and `provider-invalid-request`. These categories may be `explicit-retry-eligible` only when the consumed normalized upstream result says retryable, otherwise `non-retryable`: `persistence-durability`, `retrieval-failed`, `export-read-failed`, `deletion-write-failed`, `provider-unavailable`, `provider-timeout`, `provider-rate-limited`, `provider-unknown`, and bounded `unclassified-failure`. `persistence-indeterminate` is reserved to `indeterminate / indeterminate-manual-check`; `mixed-outcome` is reserved to `partial / non-retryable`.

#### Stage and failure-category legality

| Stage | Legal failure categories |
| --- | --- |
| `request` | none; request evidence is an attempt, not a terminal failure classifier |
| `interpretation` | `validation`, `prohibited-input`, `clarification-required`, `unresolved`, `unclassified-failure` |
| `authorization` | `authorization-denied`, `unclassified-failure` |
| `retrieval` | `not-found`, `retrieval-failed`, `export-read-failed`, `unclassified-failure` |
| `persistence` | `not-found`, `constraint-conflict`, `operation-id-conflict`, `persistence-durability`, `persistence-indeterminate`, `deletion-write-failed`, `unclassified-failure` |
| `derived-state` | none in the current direct-SQL design; the sanctioned result is `not-applicable` without failure |
| `provider` | `provider-unavailable`, `provider-timeout`, `provider-rate-limited`, `provider-refused`, `provider-malformed-result`, `provider-invalid-request`, `provider-unknown` |
| `user-visible` | the exact category of the truthful originating non-success stage, including `mixed-outcome`; success-like terminal statuses carry no failure category |

`operationCategory` does not relax these invariants. It remains a closed descriptive dimension and cannot make an otherwise illegal stage/status/failure/retry combination legal.

**Repair-8 obligation:** Centralize these finite invariants at event construction and the platform-write trust boundary. Reject contradictions including success plus any failure, provider success plus persistence failure, authorization success plus denial, derived-state not-applicable plus failure, failed plus not-applicable retry, and indeterminate without manual-check. Add positive controls for every legitimate combination actually emitted by production and negative controls required by the Controller packet.

**Scope mapping:** `src/application/ports/observability/operationalEvidence.ts`, `tests/application/ports/observability/operationalEvidence.test.ts`, and already-authorized application/adapter tests needed to preserve legitimate production combinations.

## 5. Cross-finding trust model

Repair 8 must implement one coherent boundary:

1. observation contexts contain only identifiers sanctioned by the binding machine-ID grammar;
2. application events are constructor-issued, closed, immutable, and cross-field coherent;
3. the infrastructure adapter rejects or safely excludes arbitrary structural forgeries before platform output; and
4. the injected writer receives only the exact DATA-001-safe fields.

The repair must preserve fail-open product behavior: evidence failure cannot alter authorization, accepted state, retryability, deletion, provider behavior, or the exact user-visible result.

## 6. Authority, DoR, and write-lock sufficiency

The three accepted findings are bounded work-product defects in the already-authorized ENG-011 evidence trust boundary. They do not alter Product or Domain semantics, Human Control, provider strategy, Runtime Architecture, DATA-001 authority, retry/recovery authority, persistence, deployment, or migration.

| Repair-8 obligation | Existing authorized paths sufficient |
| --- | --- |
| R001 narrow opaque-ID grammar and adversarial matrix | operational-evidence port and tests; interaction caller tests if required |
| R002 closed platform-write trust boundary | operational-evidence port, Cloudflare emitter, and their tests |
| R003 finite semantic invariants and positive/negative matrix | operational-evidence port and tests; authorized interaction tests to preserve all actual emitted combinations |

No twentieth path, new component, dependency, schema, configuration, package, deployment path, or migration is required. Task Packet revision 2 remains operative, Formal DoR revision 2 remains `PASS`, READY is `YES FOR REPAIR 8`, the exact nineteen-path lock remains sufficient and unchanged, Human Reserved remains `NOT REQUIRED`, and migration remains `NO MIGRATION`.

## 7. Repair-7 freeze and failed-candidate set

Repair-7 candidate `dd1a16ee3a638c20bc7aff9019d052e50ae23000`, tree `b71baa5f084df27efc031b2a4891cf4cec8a4889`, is frozen, unaccepted, historical evidence only, and non-canonical. It must not be amended, repaired in place, merged, cherry-picked, canonicalized, or pushed. Its deterministic `PASS` remains valid; its S/O/S result is `VALID / FINDINGS`.

The eight frozen failed implementation candidates are:

1. `8baa7808fa3dcd6e0475d9176e124973959d52d7`
2. `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`
3. `49990f306ee67b62ae017f0d63fa556bde06d23a`
4. `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`
5. `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`
6. `3adbe1ad5ef539b01f1af0c95603f02542000665`
7. `dce0f5babc9156383620ba8511f074197995b6a6`
8. `dd1a16ee3a638c20bc7aff9019d052e50ae23000`

All remain `FROZEN / UNACCEPTED / HISTORICAL / NON-CANONICAL`.

## 8. Repair-8 failed-byte isolation

The Repair-8 Builder may use only the clean Repair-8 dispatch baseline, Task Packet revision 2, Formal DoR revision 2, this abstract durable disposition, accepted canonical source, and repository conventions.

It must not read or reuse implementation bytes, diffs, patches, blobs, or worktree content from any failed candidate, including Repair 7. Failed SHAs may be used only for ancestry checks. Checkout/restore, cherry-pick, patch extraction, `git show`/`git cat-file` of failed implementation paths, `cp`, and `rsync` from historical Builder/verifier/reviewer worktrees are prohibited implementation inputs.

## 9. Repair-8 preservation obligations

Repair 8 must preserve all Repair-7 deterministic successes: cross-instance deletion request separation; distinct-request valid deletion; Turn-1 no authorization success; identifier context provenance; operation-ID precedence; provider seven-category mapping; retrieval found/not-found/failed mapping; finite outcome-to-evidence mapping; fresh accepted versus replay duplicate truth; mixed-outcome truth; trusted-ingress ordering; fail-open sink behavior; TC-13 provider-success to persistence-failure truth; TC-20 derived-state not-applicable; TC-21 bounded architecture guard; substantive `TC-01` through `TC-21`, `R001` through `R009`, and `R3-TC` preservation; closed failure taxonomy; no automatic mutation retry; no provider fallback; and no migration.

## 10. Durable Repair-8 dispatch

The single governance-only commit containing this record is the Repair-8 dispatch authority and descends from the current canonical governance lineage, not from a failed implementation candidate.

- **Repair 8:** `AUTHORIZED / DURABLY DISPATCHED`.
- **Task Packet:** `REVISION 2 / OPERATIVE`.
- **Formal DoR:** `PASS`.
- **READY:** `YES`.
- **Write lock:** `19 EXACT PATHS / UNCHANGED`.
- **Current Builder:** `ENG-011 REPAIR 8 BUILDER`.
- **Builder branch:** `eng-011-builder-repair-8`.
- **Builder worktree:** `/private/tmp/prj226-eng011-builder-repair-8`.
- **Migration:** `NO MIGRATION`.
- **DATA-001:** `CLOSED / NO-CONTENT`.
- **Human Control:** `UNCHANGED`.
- **Automatic mutation retry:** `PROHIBITED`.
- **Recovery:** `CLASSIFICATION / EVIDENCE ONLY`.
- **Human Reserved:** `NOT REQUIRED`.
- **Failed-candidate byte reuse:** `PROHIBITED`.
- **Implementation:** `NOT YET STARTED`.
- **Deterministic verification for Repair 8:** `NOT YET PERFORMED`.
- **Security / operability / semantic review:** `NOT AUTHORIZED UNTIL FRESH REPAIR-8 DETERMINISTIC PASS`.
- **Push:** `NOT PERFORMED`.

## 11. Next role

`ENG-011 REPAIR 8 BUILDER`

The Controller stops after provisioning and verifying the fresh Builder worktree. No implementation or Repair-8 tests are performed.

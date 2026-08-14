# ENG-005 — Knowledge/provenance slice Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-005`

**Task Packet revision:** 2

**Current lifecycle state:** `DONE` — accepted final aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` is path-scoped manifested

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Task Packet:** [ENG-005 — Knowledge/provenance slice](../tasks/ENG-005-knowledge-provenance-slice.md)

**Recorded:** 2026-08-15

## Controller closure — 2026-08-15

The Controller confirmed canonical pre-closure `HEAD` `e6bc1439ade290a7b8ac0f301d534981c5a3a078`; accepted Builder candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8` (tree `833a11f345dedd240c892d473dd99e701d34cf3e`), descending through the authorized lineage:
`e6bc1439ade290a7b8ac0f301d534981c5a3a078` → `2ea1d0a611757efb061dc7d4c7f989d7212582af` → `180bd7a17569f33a797a0eb95bfce8e02f2efc82` → `91c15266c5ca8c26825aa74dd1ffc3ad58cb3c90` → `1a4629095b17ceb81a8e32694ba8eca537ef7b58` → `3f8a3d743f5b71023cb6609ebd32f33e00aa69f0` → `81b023deb2b1a61630a2c8cb3aaee22050182bb8`.

All seven candidate bytes reproduced before and after controlled path-scoped manifestation into the canonical working tree, reproducing full canonical aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` and IR-F005 repair-delta aggregate `8faa44d016e712f28d8af7e0a8226734103b9c8a32a99d94f069b05bfa1215f4`.

| SHA-256 | Final manifested path |
| --- | --- |
| `01e7c1bd4969b6e4b12cba9185bde45f604a514bb94dfa24904582b0f9cf08b1` | `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` |
| `661976e0b4ce2d908c09322eafa1dd836a11f73b377a51bfe00a07ad02cc6595` | `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts` |
| `b993f7599a73a735b4efc85c7bd8a71a8c23401665d4da09bc767b60f0bedbda` | `tests/application/services/knowledgeProvenance/vitest.config.ts` |
| `4edf85ee1aab36faf1a1e93be1fb6fca9aa57f29b494525465d95b5b22e8b598` | `tests/integration/d1/knowledgeProvenance/node-runtime.d.ts` |
| `6168da89c80c8491ae9cc808b2b7d9a98e5a724c70737edd9bf0c599804df59e` | `tests/integration/d1/knowledgeProvenance/vitest.config.ts` |
| `545d3081942f660649936ae41f847093d5f3aa9064a9412ab138cb5270c14274` | `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts` |
| `d44220ce2ebd2e145efa00a43b9c388a0d0032406d4a566ed709490d05496ce2` | `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.ts` |

The manifest is the SHA-256 of this newline-delimited listing in repository-path sort order. The accepted upstream aggregates remain unchanged: ENG-002 manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`, ENG-003 revision-2 aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`, ENG-004 aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2`, and migration `migrations/0001_authoritative_state.sql` at `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

### Finding chain closure

All historical and revision-2 findings for ENG-005 are `CLOSED`:
- `ENG-005-F001`: CLOSED — finite guard for authentication material added; genuine Wrangler-backed local-D1 evidence established.
- `ENG-005-REV2-V001`: CLOSED — verification contract reconciled; malformed target verified as malformed input rather than ambiguous target; target ambiguity assigned upstream to planned `ENG-010`.
- `ENG-005-REV2-F002`: CLOSED — Bearer discriminator false positives repaired; benign explanatory Bearer prose preserved.
- `ENG-005-REV2-IR-F001`: CLOSED — bare alphanumeric Bearer bypass (`Bearer tokenonly123`) rejected on capture and correction without persistence.
- `ENG-005-REV2-IR-F002`: CLOSED — textual and simple code-wrapped Bearer envelopes rejected without persistence.
- `ENG-005-REV2-IR-F003`: CLOSED — alphabetic opaque Bearer tokens rejected without persistence.
- `ENG-005-REV2-IR-F004`: CLOSED — embedded inline-code Bearer spans rejected without persistence.
- `ENG-005-REV2-IR-F005`: CLOSED — plural credential and token assignment labels (`credentials=`, `access_tokens=`, `auth_tokens=`, `passwords=`, `passphrases=`, `auth_secrets=`, `authentication_secrets=`, `client_secrets=`) rejected on capture and correction without persistence or receipts; benign plural prose controls accepted.

### Final gate evidence

1. Deterministic Verification: `ENG-005 REV2 IR-F005 VERIFICATION: PASS`
   - `npm run typecheck`: PASS
   - `npm run lint`: PASS
   - `npm run build`: PASS
   - `npm run smoke`: PASS
   - ENG-002 domain tests: `37/37` PASS
   - ENG-003 persistence tests: `37/37` PASS
   - ENG-004 service + integration tests: `17/17` service PASS, `4/4` integration PASS
   - ENG-005 service unit tests: `15/15` PASS
   - ENG-005 Wrangler-backed local D1 tests: `9/9` PASS across 3 fresh standalone executions
   - Manifest and hash stability: PASS
   - Scope and lock check: PASS (only 3 task-owned files modified).

2. Full Semantic / Data + Persistence Review: `ENG-005 REVIEW: GREEN`
   - Intentional capture, immutable originating Project, linear supersession chains, atomic standing changes, Human Control validation, truthfulness, DATA-001 finite guard coverage, benign prose preservation, exact-target boundary ownership, and persistence atomicity independently verified and approved.

**Controller disposition:** `ENG-005 -> DONE`. No Human Reserved disposition is required: the final repair implements already-approved Product, Domain, Data Control, and Runtime Architecture semantics without changing reserved authority.

## Controller recovery classification — 2026-08-14

Canonical pre-recovery `HEAD` was `3876baef8910637be69588ab3e0cf8987bae7b9e`. The Controller independently attempted exact recovery of the historical repaired candidate. It inspected all local branches, remote-tracking refs, tags, reflogs, stashes, registered worktrees and worktree refs; every local Git object including packed, dangling, and unreachable commits, trees, and blobs from `git fsck --full --no-reflogs --unreachable`; and the configured object-store/alternates surface (none configured). Every Git blob payload was SHA-256 checked; Git object IDs were not treated as file hashes.

The Controller also inspected bounded PRJ226/ENG-005 filesystem recovery surfaces: registered and stale PRJ226 task worktrees under `/private/tmp`, task-named temporary and verifier directories, repository-owned `.agents`/`.codex` surfaces, available local execution/patch-record text, and project-scoped temporary files excluding `.git` and `node_modules`. It found only task/governance references, no ENG-005 source/test payload or exact patch content. No archive recovery surface in that bounded scope was present.

No exact file was recovered. These are the irrecoverable historical path/payload identities:

| SHA-256 | Historical path |
| --- | --- |
| `f3a92daa058f3779a174d888e522631006355ef2fc67007f370e879d6b21e212` | `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` |
| `99c833928f59c9937efd00afea4d0d9c66204581f9996169c8ce239e060a77c9` | `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts` |
| `b993f7599a73a735b4efc85c7bd8a71a8c23401665d4da09bc767b60f0bedbda` | `tests/application/services/knowledgeProvenance/vitest.config.ts` |
| `6e5bd003bfc3c4a426cbeba5d5de3d6c14bdd6e1fcfc1211a6730f17dc2168d4` | `tests/integration/d1/knowledgeProvenance/knowledgeProvenancePersistence.test.ts` |
| `b45e0ce06f3b4736954baebcf41c469f6b889f9a63af07114cb67d137a9ab08d` | `tests/integration/d1/knowledgeProvenance/nodeRuntime.d.ts` |
| `2936df729c08af6bbc57eb130798def346c22792dc3ce6a0854462dbc25a2fe0` | `tests/integration/d1/knowledgeProvenance/vitest.config.ts` |
| `a30a0c53c5b0e75f211e4d6905647475bc1e0b7e0d94d8c20809539a7bce4d6d` | `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.test.ts` |
| `6eed98db6af9c151f21d8aaf011f4422c26d9c9f9b45c0efab808fbf41212199` | `tests/integration/d1/knowledgeProvenance/wranglerLocalD1.ts` |

The repository-relative path-sorted, newline-delimited historical listing still reproduces aggregate `60855c6e6220d691ffd46d43a0ec12eb259209a616d2877625517e84e9fe40e3`. That validates the preserved identity record only; it does not recover bytes. Because every required path/payload is missing, no recovery ref or recovery commit was created and the historical candidate is classified **LOST / UNMANIFESTED HISTORICAL WORK PRODUCT**.

## Historical provenance retained

The initial Builder aggregate was `cbdd59de5090a2ab85638f94cdfd00d64723c662566ae7c53d19b6ab61bf192b`. Historical verifier finding `ENG-005-F001` identified two defects: repository-defined authentication material could be accepted as Knowledge, and the purported local-D1 evidence used FakeD1 rather than genuine local D1.

The bounded historical repair added a finite service-local eligibility guard for credentials, authentication secrets, private keys, access tokens, and equivalent material; it protected both capture and correction, allowed no user self-classification bypass, and did not establish generalized secret scanning. It added genuine Wrangler-backed local-D1 evidence while retaining FakeD1 only for deterministic rollback/failure paths. Historical fresh verification later reported `ENG-005-F001 CLOSED` with service `9/9`, integration `3/3`, ENG-002 `37/37`, ENG-003 revision-1 `31/31`, and real local-D1 evidence. Those facts remain historical provenance, not evidence for regenerated bytes.

No Knowledge/provenance semantic defect is known. The prior disposition was interface/behavior compatible with the later ENG-003 repair, but the missing candidate made baseline reconciliation impossible.

## Historical reconstruction authority and sequence — 2026-08-14 (consumed/completed)

> [!NOTE]
> **Historical record:** This section records historical reconstruction authority and execution sequence established on 2026-08-14 following candidate recovery failure. That authority was fully consumed by the accepted repair lineage ending in candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`. It does not authorize any current Builder, repair, reconstruction, or implementation work.

`GOV-018` explicitly authorized the approved Knowledge Item/provenance/supersession behavior, TypeScript application code, D1-backed integration evidence, local/test configuration, and bounded engineering documentation. Task Packet revision 2 narrowed that authority to the existing ENG-005 write lock:

- `src/application/services/knowledgeProvenance/**`
- `tests/application/services/knowledgeProvenance/**`
- `tests/integration/d1/knowledgeProvenance/**`

The rebuild was required to consume accepted ENG-003 revision 2 aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`, preserve accepted ENG-004 aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2`, and leave migration `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` untouched. It was required to preserve intentional capture, exactly one immutable originating Project, correction by atomic linear supersession rather than overwrite, current/predecessor behavior, accepted-success truthfulness, the F001 eligibility protections, and genuine Wrangler-backed local-D1 evidence. It did not claim that new bytes were recovered or equal to the historical aggregate.

No Human Reserved decision was required: the rebuild changed no Product Foundation, Domain Model, Runtime Architecture, security-authority decision, service/infrastructure boundary, migration, lock, or protected upstream artifact.

The required sequence was: Builder reconstruction from the current canonical base → fresh **full** deterministic verification, including genuine local-D1 evidence and immutable upstream/lock checks → fresh **full** independent semantic/data and persistence-boundary review → Controller closure only if all Delivery Contract Definition of Done conditions were met. This sequence completed successfully on final candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`.

`ENG-006` and every later dependency-bound task remain undispatched; `ENG-009` remains `PROPOSED`.

## Historical ENG-005 revision-2 V001 Controller disposition — 2026-08-14 (superseded)

> [!NOTE]
> **Historical disposition:** This section records historical 2026-08-14 V001/F002 bounded repair authority. It was consumed by subsequent repair candidates and is no longer executable.

**Historical disposition:** `ENG-005 V001 CONTROLLER: BOUNDED_REPAIR_AUTHORIZED (superseded)`

The canonical controller `HEAD` before this disposition was `a13801e126fc58a56f1a076ee7d8efc77017dc3c`. The pre-repair regenerated ENG-005 candidate was commit `676bd5c5e2fd8daf245602b43e2d72e5230f5c3b`, tree `825c739ecf248860c138c67b1f30dbbc74d65610`, aggregate `28b104136e5b47dd267be611aeddd9df0873a0d3791ffc7973bb2cd6ea108d91`, and rebuild base `a13801e126fc58a56f1a076ee7d8efc77017dc3c`.

Fresh V001 deterministic verification previously returned `ENG-005 REV2 VERIFICATION: FAIL` with blocking evidence gap `ENG-005-REV2-V001`. The evidence-only Builder disposition was `ENG-005 REV2 V001 REPAIR: BLOCKED — PRODUCTION_DEFECT_DISCOVERED`: `npm run typecheck` passed, while `npx vitest run --config tests/application/services/knowledgeProvenance/vitest.config.ts` passed 16 of 17 tests. That evidence work changed no production code.

### Finding and authority

`ENG-005-REV2-F002` was historically **BLOCKING — WORK_PRODUCT_DEFECT** at discovery for candidate `676bd5c5e2fd8daf245602b43e2d72e5230f5c3b`. The V001 evidence repair showed that the candidate's finite Bearer pattern treated `Bearer authentication` as actual authentication material. The explicit reproducer, `Bearer authentication is documented here without any token material.`, was prohibited on capture instead of accepted. This was a production semantic defect, not merely an evidence gap, and was subsequently `CLOSED` by candidate `1d58b114ceaeed370e5f2fb8084660f7bd106385`.

The violated authority was Task Packet revision-2 invariant 11 and Verification Contract check 8, together with `DATA-001` and `PI-DATA-005`. Those sources require that credentials, authentication secrets, private keys, access tokens, and equivalent authentication material are outside intended Knowledge capture, while the finite service-local guard must not reject ordinary prose for an isolated word such as `password` or `access token`. `ENG-005-F001` remains historical closed provenance for that same finite-guard boundary.

`GOV-018` authorized the smallest correction entirely inside the existing ENG-005 lock without a Human Reserved disposition.

### Historical bounded repair contract (consumed)

The assigned Builder was authorized to modify only:

- `src/application/services/knowledgeProvenance/**`;
- `tests/application/services/knowledgeProvenance/**`; and
- `tests/integration/d1/knowledgeProvenance/**`.

It was required to make the smallest correction distinguishing actual Bearer authentication material from ordinary explanatory prose, rejecting realistic synthetic Bearer-material forms on both capture and correction without commit, receipt, successor, or standing change, while accepting the explicit benign-Bearer reproducer and retaining required prose controls.

All paths and topics outside that lock remained prohibited. Accepted upstream identities remained immutable: ENG-003 aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`, ENG-004 aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2`, and migration `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

### Historical V001 evidence and required gates

The isolated V001 evidence worktree at `builder/eng-005-rev2-v001-evidence` contained uncommitted task-local test changes. The replacement candidate required fresh **full** deterministic verification under the whole Task Packet Verification Contract followed by fresh **full** independent review.

**Historical F002 next-Builder state:** `READY — BOUNDED_REPAIR_AUTHORIZED (superseded)`; that disposition directed a Builder to start from `676bd5c5e2fd8daf245602b43e2d72e5230f5c3b`, repair only the Bearer-material discriminator and task-scoped evidence inside the three permitted roots, and complete required gates. It is retained as candidate-scoped history and was superseded by the IR-F001 disposition below.

## Historical ENG-005 revision-2 F002/V001 Controller clarification — 2026-08-14 (consumed)

> [!NOTE]
> **Historical reconciliation:** This section records historical 2026-08-14 contract clarification assigning ambiguous-target clarification upstream to planned `ENG-010`.

**Historical disposition:** `ENG-005 REV2 F002/V001 RE-REPAIR: VERIFICATION_CONTRACT_RECONCILED`

The Controller authority for this reconciliation was `90af460c70e6f975e7bb0e32d80e92efd9438616`. The source candidate at that stage was `1d58b114ceaeed370e5f2fb8084660f7bd106385`, tree `ff64dbd7905c48744ffa6cafc970e1e86f4cfcab`; its reported full seven-file aggregate was `f72f98d9431b1fbb0466ef564d7515604c210064086b6afb22846a21bcb799fe` and its reported three-file repair-delta aggregate was `0a4bc5c6d6d57776f6cb9412018f7241f08deaaebf7533324b44c072bc72ca02`.

No new candidate was produced by that Builder step; the prior blocking report was a verification-contract/Task Packet gap, not a new product defect.

### Exact boundary fact

`KnowledgeProvenanceService.correct` accepts one `prior` Knowledge snapshot, validates it as one closed record, and invokes domain correction with that one item. It has no candidate collection, target-search, target-resolution, contextual-inference, selection, or clarification-result input. Consequently, no valid ENG-005 correction request contains two or more plausible targets. Supplying an array as `prior` is rejected as `correction-prior-malformed`; the recorded test proves malformed-input rejection and no write only. It is not, and must not be renamed or accepted as, evidence of canonical ambiguous-target behavior.

### Canonical ownership and unchanged invariant

The approved Domain Model requires clarification before acceptance when an ambiguous state-changing target would affect an accepted change, and states that inference alone cannot change accepted state. The approved Runtime Architecture places `target/authority check` before domain validation and authoritative persistence in the state-changing interaction flow. The Engineering Plan assigns the planned text-interaction and human-control orchestration, including ambiguity clarification, to `ENG-010`.

Accordingly, ambiguity handling is owned at the upstream interaction/application target-resolution boundary before an exact Knowledge target is passed to ENG-005. `ENG-010` is identified as the existing planned task; this reconciliation created no new task ID and dispatched no downstream work. ENG-005's exact-target API structurally requires ambiguity to have been resolved or rejected before invocation. No write may occur on unresolved ambiguity at that owning boundary.

The Product Foundation, Domain Model, Runtime Architecture, Human Control semantics, `DATA-001`, `PI-DATA-005`, `QLT-001`, and `GOV-018` remained unchanged. This was a verification-evidence applicability correction within the existing ENG-005 Task Packet and lock.

### Required next gates

The Task Packet Verification Contract was updated to require malformed or missing exact-target no-write evidence and non-current exact-target and lineage controls, while explicitly marking ambiguous-target runtime evidence as not applicable at this service boundary. The candidate was required to pass fresh full deterministic verification and fresh full independent review before Controller closure.

## Historical ENG-005 revision-2 IR-F001 Controller disposition — 2026-08-14 (superseded)

> [!NOTE]
> **Historical disposition:** This section records historical 2026-08-14 IR-F001 bounded repair authority. It was consumed by subsequent repair candidates (IR-F002 through IR-F005) leading to final accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`.

**Historical disposition:** `ENG-005 IR-F001 CONTROLLER: BOUNDED_REPAIR_AUTHORIZED (superseded)`

The Controller authority before this disposition was `0dc8fd86b4e7e5761c51529ada2ce56e771dc186`. Fresh full deterministic verification returned `ENG-005 REV2 POST-CONTRACT VERIFICATION: PASS` for candidate `239535a075b7b10626fc1f1adf9687daf08b0088`, tree `d669c213f173711b5f064897d016b9189ac0ce7a`, and canonical full seven-file aggregate `939cdae244aa44252ed6d12031874d406e3b5009955e3fc9e34f339140eed15a`. Fresh full independent semantic/data and persistence-boundary review then returned `ENG-005 REVIEW: NEEDS FIX`. The deterministic pass remained exact candidate-scoped evidence; the review rejection made the candidate failed-review provenance only and prohibited Controller closure.

### Finding, classification, and authority

`ENG-005-REV2-IR-F001` was historically **BLOCKING — WORK_PRODUCT_DEFECT** at discovery for candidate `239535a075b7b10626fc1f1adf9687daf08b0088`. In `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts`, the finite guard rejected `Authorization: Bearer tokenonly123` but the bare-Bearer branch accepted `Bearer tokenonly123` because it required punctuation in the token. The reviewed bypass reached normal Knowledge persistence semantics for both capture and correction, so actual authentication material could be durably accepted. This finding was subsequently `CLOSED` by candidate `180bd7a17569f33a797a0eb95bfce8e02f2efc82`.

This violated Task Packet revision-2 invariant 11 and Verification Contract check 8, `DATA-001`, and `PI-DATA-005`. `ENG-005-F001` remains historical closed provenance for the finite-guard boundary. `ENG-005-REV2-F002` remains closed candidate-scoped history for the distinct false-positive boundary.

`GOV-018` authorized the smallest correction wholly within the existing ENG-005 source/test roots without a Human Reserved disposition.

### Historical bounded repair and evidence contract (consumed)

The assigned Builder was authorized to modify only `src/application/services/knowledgeProvenance/**`, `tests/application/services/knowledgeProvenance/**`, and `tests/integration/d1/knowledgeProvenance/**`. The repair was required to make the finite, deterministic, service-local Bearer discriminator reject canonical bare opaque Bearer material such as `Bearer tokenonly123` without treating punctuation as the criterion, while allowing `Bearer authentication is documented here without any token material.` where otherwise valid.

Committed deterministic evidence was required to prove: bare `Bearer tokenonly123` capture is prohibited with no Knowledge and no accepted receipt; the same correction content is prohibited with its eligible predecessor still current, no successor, and no accepted receipt; `Authorization: Bearer tokenonly123` and an existing punctuated synthetic bare-Bearer token remain prohibited; and the benign explanatory Bearer text remains eligible.

The reconciliation remained intact: `correct` receives one exact prior snapshot; malformed prior is malformed target rather than ambiguity; ambiguity belongs upstream to planned `ENG-010`.

ENG-003 accepted aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`, ENG-004 accepted aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2`, and migration `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` remained unchanged.

Because production code changed after a full semantic review finding, the replacement candidate required fresh **full** deterministic verification followed, if it passed, by fresh **full** independent semantic/data and persistence-boundary review. That sequence proceeded through repair candidates `180bd7a17569f33a797a0eb95bfce8e02f2efc82`, `91c15266c5ca8c26825aa74dd1ffc3ad58cb3c90`, `1a4629095b17ceb81a8e32694ba8eca537ef7b58`, `3f8a3d743f5b71023cb6609ebd32f33e00aa69f0`, and reached full closure on final accepted candidate `81b023deb2b1a61630a2c8cb3aaee22050182bb8`. `ENG-005` is `DONE`; `ENG-006` and later stay undispatched.

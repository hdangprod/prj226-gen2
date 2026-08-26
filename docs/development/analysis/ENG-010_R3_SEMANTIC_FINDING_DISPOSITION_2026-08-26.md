# ENG-010 Repair 3 Semantic Finding Disposition and Repair 4 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Record role:** REPAIR 3 SEMANTIC FINDING DISPOSITION AND REPAIR 4 DISPATCH

**Date:** 2026-08-26

**Controller role:** ENG-010 CONTROLLER — REPAIR 3 SEMANTIC FINDING DISPOSITION & REPAIR 4 DISPATCH

**Repair 3 candidate:** `20f6a71cb9f2e6ef3897f01f26c8f14078dcccfb`

**Candidate tree:** `0ac855721c183592af1a0c979408a180623511bc`

**Candidate aggregate:** `197daa4f16eaa3d42942723a730a322fc12191480736f6fc0d218e833327b7c9`

**Candidate direct parent:** `01198892d4a7a8c9f9937660ba92fd2d64cd22d1`

**Candidate canonical ancestry:** NOT AN ANCESTOR OF CANONICAL HEAD

**Deterministic verification:** PASS — historical exact-candidate evidence remains valid

**Semantic review:** FINDINGS — `ENG-010-R3-SR-R001`

**Candidate disposition:** FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY

**Human Reserved:** NOT REQUIRED

## 1. Identity and evidence binding

| Property | Verified value |
|---|---|
| Repair 3 commit | `20f6a71cb9f2e6ef3897f01f26c8f14078dcccfb` |
| Tree | `0ac855721c183592af1a0c979408a180623511bc` |
| Sole parent | `01198892d4a7a8c9f9937660ba92fd2d64cd22d1` |
| Distance from Repair 3 dispatch | 1 |
| Exact changed paths | 11 / PASS |
| Canonical ancestry | PRESENT / UNACCEPTED / NON-CANONICAL |
| Candidate 1 ancestry | `100f730556af7cea0f0a623809627aa3cf49d5a9` is not an ancestor |
| Repair 1 ancestry | `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` is not an ancestor |
| Repair 2 ancestry | `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` is not an ancestor |
| Aggregate | `197daa4f16eaa3d42942723a730a322fc12191480736f6fc0d218e833327b7c9` |

The independent deterministic record remains historical PASS evidence: topology, historical non-ancestry, exact 11-path lock, and migration all pass; `ENG-010-DV-R001` is closed; Repair-2 semantic repairs are deterministically verified; 16 Vitest configurations ran 33 test-file executions and 517/517 tests passed; `npm test`, typecheck, lint, build, and smoke passed. The previously reported 528-test count is an evidence-count mismatch, not an implementation finding. The semantic finding prevents acceptance but does not rewrite deterministic history.

## 2. Authority and independent adjudication

The applicable existing authority is Product Foundation revision 1 `PF-KNW-001`; Domain Model revision 1, Cross-Project reuse and invariant 11; Scenario `SCN-009`; approved `MOD-004`; Runtime Architecture revision 1 retrieval/provenance invariants; the accepted ENG-005 Knowledge-origin contract; accepted ENG-006 Task Packet invariants 2–4 and P0-003; and ENG-010 Task Packet revision 1.

Together those records require that a Knowledge Item retain originating Project, standing/currentness, qualification and material uncertainty as applicable, and may assist another Project only when materially relevant. ENG-006 returns cross-Project candidate pools only: it does not establish material relevance, persist a reference, or invoke `referenceKnowledge()`. ENG-010 owns interaction-specific relevance selection, bounded context assembly, and the application of the accepted `referenceKnowledge()` handoff.

Direct candidate inspection confirms that `extractTokens()` makes comparison whole-token rather than substring based, so Repair 3 closes the `api`/`capital` substring false positive. But in project-scoped cross-Project flow it then sets `isMateriallyRelevant = tokenMatches > 0` and calls `referenceKnowledge(item, input.projectId, { materiallyRelevant: true })`. `referenceKnowledge()` validates the supplied boolean, standing, and optional qualification; it does not independently establish relevance. Thus unrelated `API pricing notes` for interaction `project API migration`, and `user interview scheduling notes` for interaction `user authentication`, can be promoted solely because of one generic whole-token match. Whole-token correctness and material relevance are separate invariants.

### ENG-010-R3-SR-R001 — CROSS_PROJECT_REUSE / MATERIAL_RELEVANCE

**Disposition:** ACCEPTED / BLOCKING / OPEN FOR REPAIR 4

**Violated authority:** Cross-Project Knowledge may assist another Project only when material relevance has been truthfully established. A retrieval candidate and arbitrary/generic one-token coincidence are insufficient by themselves to assert that condition.

**Smallest valid repair:** strengthen only the project-scoped cross-Project material-relevance qualification before `referenceKnowledge()`. Preserve ordinary Project-local bounded lexical ranking, valid materially relevant reuse, strong single-token/structural signals where existing interaction context independently establishes applicability, and origin/currentness/qualification/uncertainty. Weak evidence fails closed: it remains only a retrieval candidate and is not referenced or included as materially relevant context.

**Human Reserved:** NOT REQUIRED. This repairs implementation behavior already required by approved controlled-reuse authority. The task does not create a Product definition of generic terms, permanent scoring precedence, persistent metadata, or a new relevance algorithm.

`ENG-010-R2-SR-R002` is independently confirmed CLOSED. Repair 3's finite authentication-material patterns include `passwd` and generic `secret` assignment forms; its accepted boundary remains closed and is regression-only for Repair 4.

## 3. Finding chain and lifecycle reconciliation

| Finding | Final status |
|---|---|
| `ENG-010-DV-R001` | CLOSED |
| `ENG-010-R1-SR-R001` | CLOSED |
| `ENG-010-R1-SR-R002` | CLOSED |
| `ENG-010-R1-SR-R003` | REPLACED BY `ENG-010-R2-SR-R001` → REPLACED BY `ENG-010-R3-SR-R001` → OPEN FOR REPAIR 4 |
| `ENG-010-R1-SR-R004` | CLOSED |
| `ENG-010-R1-SR-R005` | REPLACED BY `ENG-010-R2-SR-R002` → CLOSED |
| `ENG-010-R2-SR-R001` | REPLACED BY `ENG-010-R3-SR-R001` |
| `ENG-010-R2-SR-R002` | CLOSED |
| `ENG-010-R3-SR-R001` | ACCEPTED / BLOCKING / OPEN FOR REPAIR 4 |

The semantic reviewer reported `READY:NO`. That statement is a non-authoritative report-state mismatch, not a lifecycle disposition. Delivery Contract revision 1 defines `READY` as a satisfied Definition of Ready permitting dispatch; its lifecycle separately permits `NEEDS FIX` after a candidate finding. Formal DoR revision 1 remains PASS, the same Task Packet revision remains sufficient, dependencies remain accepted, write ownership remains controlled, and no Human Reserved decision is needed. Durable Controller state is therefore `READY:YES` for the narrowly bounded Repair 4 dispatch; ENG-010 remains `NOT DONE`.

## 4. Repair 4 authority and objective

**Repair:** REPAIR 4 AUTHORIZED / DURABLY DISPATCHED

**Task Packet disposition:** Revision 1 remains operative. No revision is required because `ENG-010-R3-SR-R001` is an implementation defect against existing authority rather than missing or contradictory Product, Domain, or Architecture authority.

**Write-lock sufficiency:** YES. The existing exact 11-path lock is sufficient; Repair 4 primarily needs the interaction-owned context-selection source and its test, while a fresh complete candidate must recreate all 11 paths from the Repair 4 dispatch. No upstream/domain, infrastructure, migration, root configuration, or new path is authorized.

**R4-O1:** Close `ENG-010-R3-SR-R001`. Implement a bounded deterministic cross-Project material-relevance gate that does not treat arbitrary/generic single whole-token overlap as sufficient; uses only already-authorized lexical/structural current-interaction signals; fails closed on weak evidence; preserves valid materially relevant reuse and independently justified strong single signals; preserves Knowledge origin, currentness/standing, material qualification, and uncertainty; continues using `referenceKnowledge()` correctly; and does not modify accepted Knowledge history.

Repair 4 must not implement a global stopword policy, universal two-token requirement, BM25, stemming, embeddings, semantic models, vector similarity, provider/model inference, new persistent metadata, or new infrastructure. It must preserve, but not redesign, complete finite DATA-001 parity.

## 5. Repair 4 deterministic regression contract

The original `TC-01` through `TC-27`, Repair-1 regressions, `R2-TC-01` through `R2-TC-18`, `R3-TC-01` through `R3-TC-09`, exact-candidate checks, and full regression matrix remain required. Repair 4 additionally requires:

| ID | Required deterministic evidence |
|---|---|
| `R4-TC-01` | Through retrieval candidate → material-relevance decision → `referenceKnowledge()` decision → bounded-context inclusion/exclusion, interaction `project API migration` and unrelated cross-Project `API pricing notes` prove generic `api` overlap alone does not establish material relevance. This fails Repair 3. |
| `R4-TC-02` | The same pipeline proves interaction `user authentication` and unrelated cross-Project `user interview scheduling notes` do not become materially relevant solely through `user`. This fails Repair 3. |
| `R4-TC-03` | A clearly relevant cross-Project case with existing authorized signals strongly aligned establishes material relevance, invokes `referenceKnowledge()`, includes the candidate, and preserves origin/currentness/qualification. |
| `R4-TC-04` | A supported strong single-token or structural-focus case proves the repair does not impose an unauthorized universal two-token rule. If no authority-supported case is available, the candidate documents that absence rather than inventing one. |
| `R4-TC-05` | Weak evidence fails closed: the candidate is excluded, no material reference is invoked, accepted state is unchanged, and provenance is not mutated. |
| `R4-TC-06` | Valid reuse preserves `knowledgeItemId`, `originatingProjectId`, correct `assistingProjectId`, standing/currentness, qualification, and no historical promotion. |
| `R4-TC-07` | Ordinary Project-local relevance remains unchanged: interaction-text ranking, explicit `actionId` focus, Action-linked Progress focus, and cap-after-relevance remain valid. |
| `R4-TC-08` | Representative regressions retain closure of trusted-evidence provenance, forged-evidence rejection, two-interaction deletion, Action-linked Progress correction, complete DATA-001 parity including `passwd`/`secret`, ordinary sensitive-content allowance, and DV-R001 advisory/proposal semantics. |

## 6. Failed-candidate and migration boundaries

Repair 4 must be a fresh complete implementation directly atop the governance-only Repair 4 dispatch commit. No failed/unaccepted implementation candidate may become parent, ancestor, merge, rebase, cherry-pick, or copied implementation ancestry:

- Candidate 1: `100f730556af7cea0f0a623809627aa3cf49d5a9` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 1: `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 2: `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 3: `20f6a71cb9f2e6ef3897f01f26c8f14078dcccfb` — FROZEN / UNACCEPTED / HISTORICAL.

Migration remains immutable:

| Property | Value |
|---|---|
| Path | `migrations/0001_authoritative_state.sql` |
| Git blob | `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` |
| SHA-256 | `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` |
| Repair 4 migration work | NONE |

## 7. Repair 4 Builder dispatch

| Property | Value |
|---|---|
| Repair | REPAIR 4 AUTHORIZED / DURABLY DISPATCHED |
| Implementation base | This governance-only Repair 4 dispatch commit on `foundation/product-foundation` |
| Branch | `eng-010-builder-repair-4` |
| Worktree | `/private/tmp/prj226-eng010-builder-repair-4` |
| Current Builder before provisioning | NONE |
| Assigned Builder | ENG-010 REPAIR 4 BUILDER |
| Write authority | ACTIVE / BOUNDED TO EXACT 11-PATH LOCK |
| Implementation state at dispatch | NOT YET STARTED |
| Required next evidence | Fresh Builder candidate, then fresh independent deterministic verification before semantic review |

Provisioning from the governance dispatch commit starts no implementation. The Builder may inspect failed candidates as read-only historical references but may not copy, cherry-pick, merge, or inherit any of them as ancestry.

## 8. Status after disposition

| Property | Value |
|---|---|
| ENG-010 | NOT DONE |
| Formal DoR | PASS — Revision 1 |
| READY | YES |
| Repair 3 deterministic | PASS |
| Repair 3 semantic review | FINDINGS |
| Repair 3 candidate | FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY |
| `ENG-010-R3-SR-R001` | ACCEPTED / BLOCKING / OPEN FOR REPAIR 4 |
| `ENG-010-R2-SR-R002` | CLOSED |
| Repair | REPAIR 4 AUTHORIZED / DURABLY DISPATCHED |
| Current Builder | ENG-010 REPAIR 4 BUILDER |
| Human Reserved | NOT REQUIRED |
| Implementation | NOT YET STARTED |
| Next required role | ENG-010 REPAIR 4 BUILDER |
| Deterministic verification for Repair 4 | NOT YET PERFORMED |
| Semantic review for Repair 4 | NOT AUTHORIZED UNTIL FRESH DETERMINISTIC PASS |

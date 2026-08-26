# ENG-010 Repair 4 Finding Disposition and Repair 5 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Record role:** REPAIR 4 FINDING DISPOSITION AND REPAIR 5 DISPATCH

**Date:** 2026-08-27

**Repair 4 candidate:** `b2cabaf2f339d797d5504ca418eee8f232fa4bdb`

**Candidate tree:** `800a03f2a15c1b44abbaaa2ce66179c6bf6bd456`

**Builder-reported aggregate:** `f5ada2ec3f94629ad8c163fc2e771254a0555c51a8bd60f9152f816a9e4fa8db`

**Candidate direct parent:** `a744056f9760a12c2fa5b2d0d3398fd8b5f415df`

**Candidate disposition:** FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY

## 1. Identity and deterministic evidence reconciliation

| Property | Verified value |
|---|---|
| Candidate commit/tree | `b2cabaf2f339d797d5504ca418eee8f232fa4bdb` / `800a03f2a15c1b44abbaaa2ce66179c6bf6bd456` |
| Sole parent and distance | `a744056f9760a12c2fa5b2d0d3398fd8b5f415df` / 1 |
| Canonical ancestry | PRESENT / UNACCEPTED / NON-CANONICAL |
| Exact changed paths | 11 |
| Prior deterministic report | PASS |
| Exact mandatory command | `git diff --check a744056f9760a12c2fa5b2d0d3398fd8b5f415df...b2cabaf2f339d797d5504ca418eee8f232fa4bdb` |
| Exact result | exit 2: `src/application/services/interaction/contextSelection.ts:65: trailing whitespace.` |
| Reconciled overall deterministic gate | INVALIDATED / FINDINGS |

Topology, manifest, and prior test/toolchain subchecks remain historical evidence. They do not satisfy the overall deterministic gate because mandatory Task Packet `RG-21` failed on the immutable committed candidate range. This is both an implementation defect and a verification-contract/evidence-integrity defect; the earlier overall PASS cannot remain acceptance evidence.

## 2. Independent finding dispositions

### ENG-010-R4-SR-R001 — CROSS_PROJECT_REUSE / MATERIAL_RELEVANCE

**Disposition:** ACCEPTED / BLOCKING / OPEN FOR REPAIR 5

Existing authority requires material relevance before one Project's Knowledge assists another: Product Foundation `PF-KNW-001`, Domain Model Cross-Project reuse, `SCN-009`, `MOD-004`, and ENG-006's candidate-only retrieval boundary. Candidate source `assessCrossProjectMaterialRelevance()` accepts exactly one interaction/Knowledge token when any focused Action, outcome, or fact token overlaps Knowledge. It does not remove the sole interaction-match token from that structural set. Therefore `api` in interaction, Knowledge, and outcome (`modernize API platform`) becomes two counted signals despite being only repeated lexical evidence. This does not independently establish material applicability, yet then causes `referenceKnowledge(... materiallyRelevant: true)`.

The Repair-4 R4-TC-01 fixture omits `api` from Project metadata, and R4-TC-04 accidentally has two interaction/Knowledge matches (`migration`, `checklist`), so neither tests the faulty single-token corroboration path.

**Smallest repair:** for exactly the single-interaction-token project-scoped cross-Project branch, exclude that sole interaction-match token from structural corroboration. Preserve multi-token and bounded exact-ID paths unless actual evidence requires change. No global stopword policy, universal two-token rule, stemming, embeddings, model inference, new metadata, or local-relevance rewrite is authorized.

**Human Reserved:** NOT REQUIRED. Repair 4 already required independently established corroboration; this is its bounded implementation correction.

### ENG-010-R4-SR-R002 — VERIFICATION_CONTRACT / EVIDENCE_INTEGRITY

**Disposition:** ACCEPTED / BLOCKING / OPEN FOR REPAIR 5

Mandatory `RG-21` and Definition of Done require the exact candidate-range check to pass. The independent reproduction above proves it fails. The Repair-5 candidate must remove the whitespace defect and prove both a clean worktree and exact `git diff --check <repair5-dispatch>...<repair5-candidate>` exit 0 with no output.

**Human Reserved:** NOT REQUIRED. This restores existing deterministic-contract compliance.

## 3. Finding chain, readiness, and boundaries

| Finding | Final status |
|---|---|
| `ENG-010-DV-R001` | CLOSED |
| `ENG-010-R1-SR-R001`, `R002`, `R004` | CLOSED |
| `ENG-010-R1-SR-R003` | REPLACED BY R2-SR-R001 → R3-SR-R001 → R4-SR-R001 → OPEN FOR REPAIR 5 |
| `ENG-010-R1-SR-R005` | REPLACED BY R2-SR-R002 → CLOSED |
| `ENG-010-R2-SR-R001` | REPLACED BY R3-SR-R001 → R4-SR-R001 |
| `ENG-010-R2-SR-R002` | CLOSED |
| `ENG-010-R3-SR-R001` | REPLACED BY R4-SR-R001 |
| `ENG-010-R4-SR-R001`, `R002` | ACCEPTED / BLOCKING / OPEN FOR REPAIR 5 |

Formal DoR remains PASS and durable task READY remains YES. A candidate failure moves the candidate through findings; it does not revoke the already-satisfied Ready Task Packet under the Delivery Contract lifecycle. Task Packet Revision 1 remains operative. The exact existing 11-path lock is sufficient: both findings are limited to `contextSelection.ts` and its authorized test scope; all Product, Domain, Architecture, infrastructure, root configuration, and migration paths remain read-only.

## 4. Repair 5 authority and objectives

**Repair:** REPAIR 5 AUTHORIZED / DURABLY DISPATCHED

1. **R5-O1:** Close R4-SR-R001. Require truly independent structural corroboration for the single interaction-token cross-Project material-relevance path; repeated weak/generic-token evidence fails closed.
2. **R5-O2:** Close R4-SR-R002. Produce a fresh immutable candidate whose exact dispatch-to-candidate range passes `git diff --check` with exit 0 and no output.

All prior boundaries remain preserved, including ordinary local relevance, trusted interaction evidence, two-turn deletion, Action-linked Progress correction, finite DATA-001 parity and ordinary sensitive-content allowance, DV-R001 typing, accepted-state truthfulness, ENG-006 parent existence, bounded context, and provider isolation.

## 5. Repair 5 deterministic regression contract

| ID | Required deterministic evidence |
|---|---|
| `R5-TC-01` | Pipeline test: `project API migration` + outcome `modernize our API platform` + unrelated `API pricing notes`; sole `api` structural repetition fails closed, no reference or inclusion. Fails Repair 4. |
| `R5-TC-02` | Pipeline test: exact singular `user` repetition in interaction, Project fact/context, and unrelated interview Knowledge fails closed. Fails Repair 4. |
| `R5-TC-03` | Actual single-token branch: `oauth2` interaction/Knowledge overlap plus distinct `authentication` Project/Knowledge corroboration qualifies and preserves provenance. |
| `R5-TC-04` | Valid multi-token cross-Project relevance remains qualified. |
| `R5-TC-05` | If bounded exact Knowledge-ID direct reference is supported, exact reference remains valid and partial/substring ID does not qualify; otherwise do not invent it. |
| `R5-TC-06` | Weak evidence creates no KnowledgeReference, inclusion, persistence/origin mutation, or fabricated qualification. |
| `R5-TC-07` | Valid reuse preserves knowledge ID, originating/assisting Project IDs, standing/currentness, qualification, and no improper promotion. |
| `R5-TC-08` | Representative closed-boundary regressions: local relevance/focus/cap, ingress, deletion, Progress, DATA-001 (`passwd`, `secret`), sensitive-content allowance, DV-R001, and truthfulness. |
| `R5-TC-09` | Exact immutable candidate command `git diff --check <repair5-dispatch>...<repair5-candidate>` exits 0 with no output. |
| `R5-TC-10` | Explicitly prove the valid corroborated test enters `interactionTokenMatches === 1` before corroboration; test naming alone is insufficient. |

`R5-TC-01` through `R5-TC-03` must exercise retrieval candidate → relevance decision → `referenceKnowledge()` → bounded inclusion/exclusion, not helper-only tests.

## 6. Candidate, migration, and Builder boundaries

Candidate 1 and Repairs 1–4 are read-only historical references and must not be Repair-5 ancestry, merge, rebase, cherry-pick, or copied implementation ancestry. Migration is immutable: `migrations/0001_authoritative_state.sql`, blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

| Property | Value |
|---|---|
| Implementation base | This governance-only Repair-5 dispatch commit |
| Branch | `eng-010-builder-repair-5` |
| Worktree | `/private/tmp/prj226-eng010-builder-repair-5` |
| Assigned Builder | ENG-010 REPAIR 5 BUILDER |
| Write authority | ACTIVE / BOUNDED TO EXACT 11-PATH LOCK |
| Implementation at dispatch | NOT YET STARTED |
| Next evidence | Fresh candidate, fresh deterministic PASS, then independent semantic review |

# ENG-010 Repair 2 Semantic Finding Disposition and Repair 3 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Record role:** REPAIR 2 SEMANTIC FINDING DISPOSITION AND REPAIR 3 DISPATCH

**Date:** 2026-08-26

**Controller role:** ENG-010 CONTROLLER — REPAIR 2 SEMANTIC FINDING DISPOSITION & REPAIR 3 DISPATCH

**Repair 2 candidate:** `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6`

**Candidate tree:** `35ec48efd2d9df93680f1efa4c3bdac0f63b98a3`

**Candidate aggregate:** `284dab14730acdc2ca4456041d5c69e7451f41bd915d65f24df2f6f7450c6604`

**Candidate direct parent:** `6d6663db8ec26f2274f227d560004136eae85c56`

**Candidate canonical ancestry:** NOT AN ANCESTOR OF CANONICAL HEAD

**Deterministic verification:** PASS — historical exact-candidate evidence remains valid

**Semantic review:** FINDINGS — `ENG-010-R2-SR-R001` and `ENG-010-R2-SR-R002`

**Candidate disposition:** FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY

**Human Reserved:** NOT REQUIRED

## 1. Identity and evidence binding

| Property | Verified value |
|---|---|
| Repair 2 commit | `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` |
| Tree | `35ec48efd2d9df93680f1efa4c3bdac0f63b98a3` |
| Sole parent | `6d6663db8ec26f2274f227d560004136eae85c56` |
| Distance from Repair 2 dispatch | 1 |
| Exact changed paths | 11 / PASS |
| Canonical ancestry before Repair 3 dispatch | PRESENT BUT UNACCEPTED / NON-CANONICAL ANCESTRY |
| Candidate 1 ancestry | `100f730556af7cea0f0a623809627aa3cf49d5a9` is not an ancestor |
| Repair 1 ancestry | `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` is not an ancestor |
| Aggregate | `284dab14730acdc2ca4456041d5c69e7451f41bd915d65f24df2f6f7450c6604` |

The independent deterministic record for this exact candidate remains historical PASS evidence: topology PASS; exact 11 paths PASS; migration PASS; `ENG-010-DV-R001` CLOSED; Repair-1 semantic repairs `R001` through `R005` deterministically verified; `TC-01` through `TC-27` PASS; `R1-TC-01` through `R1-TC-05` PASS; `R2-TC-01` through `R2-TC-18` PASS; 16 Vitest configurations; 470/470 tests PASS; `npm test`, typecheck, lint, build, and smoke PASS. The semantic findings prevent acceptance but do not rewrite that deterministic history.

## 2. Authority used for disposition

The disposition is bounded by Delivery Contract revision 1, Product Foundation revision 1, Product Intent revision 1, Scenario Corpus revision 1, Domain Model revision 1, Runtime Architecture revision 1, Engineering Plan revision 1, ENG-010 Task Packet revision 1, Formal DoR revision 1, the accepted ENG-005 finite capture boundary, the accepted ENG-006 retrieval and cross-Project handoff, the accepted ENG-008 model-capability data boundary, and the immutable Repair 2 candidate source.

The controlling existing semantics are:

- `PF-KNW-001`, the Domain Model cross-Project reuse section, and domain invariant 11 permit a Knowledge Item to assist another Project only when materially relevant, with origin, context, qualification/currentness, and material uncertainty preserved where needed.
- Accepted ENG-006 P0-003 and Task Packet invariants 3–4 return cross-Project candidates only and assign interaction-specific material relevance plus `referenceKnowledge()` invocation to ENG-010.
- `PF-CTX-001` and the ENG-010 Task Packet assign interaction-specific relevance and bounded context assembly to ENG-010 without selecting a universal ranking algorithm.
- `PF-DATA-001`, `PI-DATA-005` through `PI-DATA-007`, `INV-007`, and `SCN-011` exclude authentication material from accepted capture while preserving ordinary sensitive-domain project content.
- Accepted ENG-005 and ENG-008 evidence establishes finite, structural authentication-material behavior rather than generalized DLP or keyword-only blocking.

## 3. Finding dispositions

### ENG-010-R2-SR-R001 — CROSS_PROJECT_REUSE / KNOWLEDGE_PROVENANCE

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** In immutable candidate `d7f4a1ad...`, `computeTokenMatches()` lowercases candidate text and counts `lowerSearchable.includes(token)`. Project-scoped cross-Project candidates then set material relevance when `tokenMatches > 0` and pass `materiallyRelevant: true` into `referenceKnowledge()`. For interaction token `api` and candidate content `capital allocation notes`, `"capital".includes("api")` is true, so incidental substring coincidence is asserted as material relevance.

**Violated authority:** Cross-Project retrieval supplies candidates only. `referenceKnowledge()` consumes the caller's material-relevance decision; it validates currentness and the supplied boolean but does not independently prove the caller's assertion. A weakly related result cannot be presented as materially relevant cross-Project Knowledge.

**Repair 3 requirement:** Strengthen only the cross-Project material-relevance gate so incidental substring coincidence cannot establish material relevance. The rule must remain bounded, deterministic, provider-neutral, and consistent with current authority. It must preserve originating Project, standing/currentness, qualification, uncertainty where required, and accepted `referenceKnowledge()` semantics. It must add no vector search, embeddings, FTS, provider ranking, generalized search infrastructure, cache, or new Product threshold.

The ordinary local-context relevance heuristic and the cross-Project material-relevance gate need not be identical. Local context may retain a broad deterministic lexical ranking heuristic. Cross-Project reuse requires a stricter qualification decision because it permits Knowledge from one Project to assist another. Repair 3 therefore need not reopen `ENG-010-R1-SR-R002` or redesign the whole local relevance algorithm.

**Human Reserved:** NOT REQUIRED. Existing authority assigns interaction-specific material relevance to ENG-010 and leaves the smallest reversible lexical/structural implementation rule to Engineering. This Controller record does not prescribe BM25, stemming, stopwords, edit distance, semantic models, a two-token threshold, or global exact-match-only behavior.

### ENG-010-R2-SR-R002 — DATA_BOUNDARY

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** Repair 2 duplicates a local finite authentication-material guard in `contextSelection.ts` and `interactionOrchestrator.ts`. Its assignment-label categories omit accepted upstream `passwd` and generic `secret`. Consequently `passwd=hunter2` and `secret=abcd` can pass ENG-010 capture-side screening even though the accepted ENG-008 model boundary rejects them.

**Accepted finite source of truth:** Repair 3 must match the complete currently accepted finite authentication-material behavior already established across accepted ENG-005 capture and ENG-008 model-boundary authority. The finite category family comprises:

- private-key material;
- password/passwords, `passwd`, and passphrase/passphrases assignments;
- credential/credentials assignments;
- API-key assignments;
- access-token, auth-token, and refresh-token assignments;
- client-secret, auth-secret, authentication-secret, and generic `secret` assignments; and
- accepted structural Bearer-material forms, including authorization-header and bounded bare/wrapped Bearer forms.

Parity is behavioral and must preserve the accepted benign-prose boundary. Ordinary explanatory mentions of category words, and ordinary sensitive/private project content that is not authentication material, remain eligible. Repair 3 may use a task-local equivalent because the accepted upstream helpers are not exported and remain read-only; the Builder must demonstrate complete finite-policy parity rather than guess from `passwd=` and `secret=` alone.

**Repair 3 requirement:** Apply complete accepted finite DATA-001 screening before authoritative capture/persistence on every ENG-010-owned mutation path already in scope. Do not add categories beyond current accepted authority, create generalized DLP, or block normal sensitive-domain content.

**Human Reserved:** NOT REQUIRED. This restores parity with existing approved finite DATA-001 behavior and selects no new security category or security authority.

## 4. Prior Repair 1 semantic finding status after Repair 2 review

| Finding | Final status |
|---|---|
| `ENG-010-R1-SR-R001` | CLOSED |
| `ENG-010-R1-SR-R002` | CLOSED |
| `ENG-010-R1-SR-R003` | REPLACED BY `ENG-010-R2-SR-R001` |
| `ENG-010-R1-SR-R004` | CLOSED |
| `ENG-010-R1-SR-R005` | REPLACED BY `ENG-010-R2-SR-R002` |

The replacement findings are narrower defects in the Repair 2 implementation. They do not rewrite the deterministically verified closure evidence for the other Repair 1 findings.

## 5. Repair 2 disposition

Because both independent semantic findings are accepted and blocking:

- Repair 2 candidate `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` is `FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY`.
- Repair 2 deterministic verification remains `PASS / RETAINED HISTORICALLY`.
- Repair 2 semantic review is `FINDINGS / FAILED ACCEPTANCE`.
- Canonical integration is `NOT AUTHORIZED`.
- ENG-010 is `NOT DONE`.
- The candidate must not be amended, merged, rebased, cherry-picked, copied, or used as Repair 3 ancestry.

## 6. Repair 3 authority and objectives

**Repair:** REPAIR 3 AUTHORIZED / DURABLY DISPATCHED

**Task Packet disposition:** Revision 1 remains operative. No Task Packet Revision 2 is created because both findings are bounded implementation defects against authority and responsibilities already present in approved Product/Domain authority, accepted predecessor contracts, and the operative Task Packet.

**Human Reserved:** NOT REQUIRED. No new Product meaning, authentication-material category, Runtime Architecture boundary, destructive authority, provider choice, or external resource is selected.

Repair 3 has exactly these bounded objectives:

1. `R3-O1` — Close `ENG-010-R2-SR-R001`: cross-Project Knowledge must pass a stricter bounded deterministic material-relevance gate that cannot be satisfied by incidental substring coincidence.
2. `R3-O2` — Close `ENG-010-R2-SR-R002`: ENG-010 capture-side DATA-001 screening must match the complete current accepted finite authentication-material categories and preserve ordinary sensitive-content eligibility.

Repair 3 must preserve everything already valid from Repair 2, including genuine trusted ingress, two genuine deletion interactions, interaction-text relevance, explicit Action focus, cap-after-relevance, Action-linked Progress correction, truthful model-result payloads, model proposal non-authority, accepted-state truthfulness, bounded context, provider isolation, parent-existence behavior, mixed outcomes, origin/currentness/qualification, and no migration.

## 7. Exact write lock and sufficiency

**Write-lock sufficiency:** YES. Both accepted findings can be repaired in the existing interaction-owned files and tests while all upstream Product, Domain, service, port, infrastructure, migration, dependency, and root-configuration paths remain read-only.

Production paths:

1. `src/application/services/interaction/interactionTypes.ts`
2. `src/application/services/interaction/contextSelection.ts`
3. `src/application/services/interaction/interactionOrchestrator.ts`
4. `src/application/services/interaction/index.ts`

Test and configuration paths:

5. `tests/application/services/interaction/contextSelection.test.ts`
6. `tests/application/services/interaction/interactionOrchestrator.test.ts`
7. `tests/application/services/interaction/interactionClarification.test.ts`
8. `tests/application/services/interaction/interactionDeletion.test.ts`
9. `tests/application/services/interaction/vitest.config.ts`
10. `tests/integration/d1/interaction/interactionD1.test.ts`
11. `tests/integration/d1/interaction/vitest.config.ts`

## 8. Repair 3 deterministic regression contract

The original `TC-01` through `TC-27`, Repair-1 regressions, `R2-TC-01` through `R2-TC-18`, the full regression matrix, and exact-candidate checks remain required. Repair 3 additionally requires:

| ID | Required deterministic evidence |
|---|---|
| `R3-TC-01` | Interaction token `api` does not establish material relevance for cross-Project Knowledge `capital allocation notes`; that candidate is not included merely because `capital` contains `api`. This test must fail Repair 2. |
| `R3-TC-02` | A representative cross-Project candidate sharing only an incidental or generic lexical coincidence does not automatically satisfy material relevance. The case must derive from current authority and must not introduce a global stopword framework. |
| `R3-TC-03` | Clearly materially relevant cross-Project Knowledge still qualifies, preserves origin and qualification/currentness, and passes accepted `referenceKnowledge()` semantics when assisting another Project. |
| `R3-TC-04` | The material-relevance repair does not rewrite `originatingProjectId`, erase qualification, or improperly promote historical/superseded Knowledge. |
| `R3-TC-05` | Credential-shaped mutation content containing `passwd=hunter2` is prohibited before authoritative capture/persistence on at least one path that Repair 2 incorrectly allowed. |
| `R3-TC-06` | Credential-shaped mutation content containing `secret=abcd` is prohibited before authoritative capture/persistence. |
| `R3-TC-07` | Complete finite DATA-001 parity is exercised: every representative prohibited by the currently accepted ENG-005/ENG-008 finite category family is also rejected by ENG-010 capture screening. The set is not inferred only from `R3-TC-05` and `R3-TC-06`. |
| `R3-TC-08` | Ordinary sensitive/private but non-authentication content remains permitted; no generalized DLP drift occurs. |
| `R3-TC-09` | Representative prior-boundary regressions remain closed: forged `TrustedInteractionEvidence` rejection, two genuine deletion interactions, interaction-text relevance, Action-ID relevance, cap after relevance, Action-linked Progress correction, and `ENG-010-DV-R001` payload semantics. |

## 9. Failed-candidate and migration boundaries

Repair 3 must be a fresh complete implementation directly atop the governance-only Repair 3 dispatch commit. No failed/unaccepted implementation candidate may become parent, ancestor, merge, rebase, cherry-pick, or copied implementation ancestry:

- Candidate 1: `100f730556af7cea0f0a623809627aa3cf49d5a9` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 1: `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 2: `d7f4a1ad2c2ad8eb645f49955faaf4e5630c67c6` — FROZEN / UNACCEPTED / HISTORICAL.

Migration remains immutable:

| Property | Value |
|---|---|
| Path | `migrations/0001_authoritative_state.sql` |
| Git blob | `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` |
| SHA-256 | `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` |
| Repair 3 migration work | NONE |

## 10. Repair 3 Builder dispatch

| Property | Value |
|---|---|
| Repair | REPAIR 3 AUTHORIZED / DURABLY DISPATCHED |
| Implementation base | This governance-only Repair 3 dispatch commit on `foundation/product-foundation` |
| Branch | `eng-010-builder-repair-3` |
| Worktree | `/private/tmp/prj226-eng010-builder-repair-3` |
| Current Builder before provisioning | NONE |
| Assigned Builder | ENG-010 REPAIR 3 BUILDER |
| Write authority | ACTIVE / BOUNDED TO EXACT 11-PATH LOCK |
| Implementation state at dispatch | NOT YET STARTED |
| Required next evidence | Fresh Builder candidate, then fresh independent deterministic verification before semantic review |

Provisioning the branch/worktree from the governance dispatch commit starts no implementation. The Builder may inspect failed candidates as read-only historical references but may not copy, cherry-pick, merge, or inherit any of them as ancestry.

## 11. Status after disposition

| Property | Value |
|---|---|
| ENG-010 | NOT DONE |
| Formal DoR | PASS — Revision 1 |
| READY | YES |
| Repair 2 deterministic | PASS |
| Repair 2 semantic review | FINDINGS |
| Accepted semantic findings | `ENG-010-R2-SR-R001`, `ENG-010-R2-SR-R002` |
| Repair 2 candidate | FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY |
| Repair | REPAIR 3 AUTHORIZED / DURABLY DISPATCHED |
| Current Builder | ENG-010 REPAIR 3 BUILDER |
| Human Reserved | NOT REQUIRED |
| Implementation | NOT YET STARTED |
| Next required role | ENG-010 REPAIR 3 BUILDER |
| Semantic review for Repair 3 | NOT AUTHORIZED UNTIL FRESH DETERMINISTIC PASS |

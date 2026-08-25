# ENG-010 Repair 1 Semantic Finding Disposition and Repair 2 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Record role:** REPAIR 1 SEMANTIC FINDING DISPOSITION AND REPAIR 2 DISPATCH

**Date:** 2026-08-26

**Controller role:** ENG-010 CONTROLLER — REPAIR 1 SEMANTIC FINDING DISPOSITION & REPAIR 2 DISPATCH

**Repair 1 candidate:** `495f142fa28bebd3be47518fdd7a3b919ea0fcc1`

**Candidate tree:** `a794c9d77e81c3cca1fd526643cb028e6f55b4ed`

**Candidate aggregate:** `95f4515d745dd83106c9e91b7ffce45bf45a3223e2196413ea8aeba6e28199bd`

**Candidate direct parent:** `9d8f3bc4f0e92f4b2307cf63d6109e6322fbb90c`

**Candidate canonical ancestry:** NOT AN ANCESTOR OF CANONICAL HEAD

**Deterministic verification:** PASS — historical exact-candidate evidence remains valid

**Semantic review:** FINDINGS — `ENG-010-R1-SR-R001` through `ENG-010-R1-SR-R005`

**Candidate disposition:** FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY

**Human Reserved:** NOT REQUIRED

## 1. Identity and evidence binding

| Property | Verified value |
|---|---|
| Repair 1 commit | `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` |
| Tree | `a794c9d77e81c3cca1fd526643cb028e6f55b4ed` |
| Sole parent | `9d8f3bc4f0e92f4b2307cf63d6109e6322fbb90c` |
| Distance from sole parent | 1 |
| Exact changed paths | 11 / PASS |
| Canonical ancestry | PRESENT BUT UNACCEPTED / NON-CANONICAL ANCESTRY |
| Failed Candidate 1 ancestry | `100f730556af7cea0f0a623809627aa3cf49d5a9` is not an ancestor |
| Aggregate algorithm | SHA-256 of path-sorted `<SHA256><two spaces><path><LF>` entries |
| Aggregate | `95f4515d745dd83106c9e91b7ffce45bf45a3223e2196413ea8aeba6e28199bd` |

The independent deterministic record for this exact candidate remains historical PASS evidence: topology PASS; exact 11 paths PASS; migration PASS; `ENG-010-DV-R001` CLOSED; `TC-01` through `TC-27` PASS; `R1-TC-01` through `R1-TC-05` PASS; 460/460 Vitest tests PASS; typecheck PASS; lint PASS; build PASS; smoke PASS. The semantic findings prevent acceptance but do not rewrite that deterministic history.

## 2. Authority used for disposition

The disposition is bounded by Delivery Contract revision 1, Product Foundation revision 1, Product Intent revision 1, Scenario Corpus revision 1, Domain Model revision 1, Runtime Architecture revision 1, Engineering Plan revision 1, ENG-010 Task Packet revision 1, Formal DoR revision 1, the accepted ENG-002 Human Control contract, and the accepted ENG-004 through ENG-009 task contracts and runtime APIs.

The controlling existing semantics are:

- `PF-CTL-001`, Domain Model Human-control semantics, and domain invariant 14 require clear explicit user direction for ordinary changes, inference alone cannot authorize a change, and deletion additionally requires a separate confirmation.
- ENG-010 Task Packet revision 1 binds user text through `TrustedInteractionIngress.observeInteraction` before classification and gives model output no mutation authority.
- `PF-CTX-001`, Domain Model Current-context authority, and ENG-010 Task Packet revision 1 assign interaction-specific relevance and bounded context selection to ENG-010.
- `PF-KNW-001`, Domain Model cross-Project reuse, and the accepted ENG-006 boundary require material relevance, origin preservation, qualification where needed, and ENG-010 use of `referenceKnowledge()` for cross-Project candidates.
- The accepted ENG-004 correction service accepts the owning `Action` for Action-linked Progress and the domain transition fails closed on missing or mismatched ownership.
- `PF-DATA-001`, `PI-DATA-005` through `PI-DATA-007`, `INV-007`, and `SCN-011` exclude finite authentication material from intentional capture while allowing ordinary sensitive-domain project content.

## 3. Finding dispositions

### ENG-010-R1-SR-R001 — HUMAN_CONTROL / TRUSTED_EVIDENCE_PROVENANCE

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** Ordinary mutation methods accept optional caller-created `NormalizedIntent` values, synthesize fallback summaries when absent, pass either form to `TrustedInteractionIngress.observeInteraction`, and then classify and authorize a mutation. `initiateDeletion` likewise synthesizes a deletion summary and can mint direction evidence without an actual supplied user deletion interaction.

**Violated authority:** Clear explicit user direction is the authority for ordinary mutation; inference or an internal summary is not. The Task Packet flow begins with a user text interaction and only then observes trusted interaction evidence. Model output remains non-authoritative.

**Repair 2 requirement:** Bind mutation and deletion classification to evidence derived from a genuine observed user interaction. Internally synthesized fallback mutation intent must not mint trusted authority. Arbitrary caller-created `NormalizedIntent` must not be silently promoted where observed-user provenance is required. Preserve model non-authority and require two genuine separate interactions for deletion direction and confirmation.

**Human Reserved:** NOT REQUIRED — this restores approved Human Control semantics.

### ENG-010-R1-SR-R002 — RELEVANCE_SEMANTICS / CURRENT_CONTEXT

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** `contextSelection.ts` uses `interactionText` only for authentication-material screening, never uses `actionId` for selection, appends candidates in fixed fact/action/progress/knowledge category order with ID sorting, and applies `slice(0, itemLimit)` without interaction-specific relevance ordering.

**Violated authority:** ENG-010 explicitly owns interaction-specific relevance before bounded context assembly. Explicit current user intent and explicit Action focus are authoritative context signals. Applying the cap before material relevance can discard the most relevant authorized items.

**Repair 2 requirement:** Implement a bounded, deterministic, provider-neutral relevance mechanism using current interaction context, including `interactionText`, `projectId`, and `actionId` where present. Explicit Action focus must materially affect selection. Apply the item cap after relevance ordering. Do not add vectors, embeddings, FTS, generalized search infrastructure, provider ranking, or cache.

**Human Reserved:** NOT REQUIRED — the ranking mechanism is a reversible Engineering detail within already-delegated ENG-010 relevance authority.

### ENG-010-R1-SR-R003 — KNOWLEDGE_PROVENANCE / CROSS_PROJECT_REUSE

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** Every returned cross-Project candidate is converted directly into a model-context item with a fixed `cross-project-knowledge` label. The candidate neither establishes material relevance nor calls the accepted `referenceKnowledge()` domain boundary before inclusion.

**Violated authority:** Cross-Project retrieval returns candidates only. A Knowledge Item may assist another Project only when materially relevant; reuse preserves origin and context, exposes material uncertainty where needed, does not rewrite origin, and does not make project-specific knowledge universal truth. Accepted ENG-006 authority assigns interaction-specific qualification and `referenceKnowledge()` to ENG-010.

**Repair 2 requirement:** Treat cross-Project retrieval results as candidates only. Before inclusion, establish interaction-specific material relevance and use `referenceKnowledge()` where the accepted contract requires it. Preserve originating Project identity, provenance, standing/currentness, and qualification or uncertainty. Do not create a new Knowledge model or persistence semantics.

**Human Reserved:** NOT REQUIRED — this implements the approved cross-Project reuse branch and accepted ENG-006/ENG-010 ownership boundary.

### ENG-010-R1-SR-R004 — CURRENT_CONTEXT / ACTION_TARGET

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** `correctProgress` retrieves the current Progress collection but never resolves the prior Progress's `actionId`, never resolves its owning Action, and invokes `ProjectActionContextService.correctProgress` without the optional `action`. The accepted domain transition rejects an Action-linked prior Progress when the matching same-Project Action is absent.

**Violated authority:** Accepted Progress may concern one Action belonging to the same Project, and the accepted ENG-004 correction service/domain transition owns this validation. ENG-010 must supply authoritative current context rather than dropping the Action target.

**Repair 2 requirement:** Resolve the current prior Progress. If it has `actionId`, resolve the matching Action from the same Project and pass it to the accepted ENG-004 correction service. If the prior Progress or required Action is absent, ambiguous, or mismatched, fail or clarify under existing authority and perform no persistence mutation. Do not recreate Progress correction semantics.

**Human Reserved:** NOT REQUIRED — accepted ENG-004 APIs already define the required ownership behavior.

### ENG-010-R1-SR-R005 — DATA_BOUNDARY

**Disposition:** ACCEPTED / BLOCKING

**Candidate evidence:** Authentication-material screening exists on model advisory/proposal ingress and bounded context, while authoritative Project intended outcomes, Action descriptions, Context Facts, Progress statements, and Progress-correction statements reach Human Control authorization and mutation without the finite capture guard. Knowledge capture/correction remains separately protected by accepted ENG-005 behavior.

**Violated authority:** Authentication material is outside intended v1 capture. `INV-007` and `SCN-011` require excluded authentication material not to be represented as accepted, while ordinary sensitive-domain project information remains eligible.

**Repair 2 requirement:** Apply the existing finite DATA-001 authentication-material prohibition before Human Control authorization or persistence for every ENG-010-owned captured text mutation in scope: Project intended outcome, Action description, Context Facts, Progress, and Progress correction. Preserve the accepted ENG-005 Knowledge guard. Do not create generalized DLP, invent credential categories, or reject ordinary sensitive-domain information.

**Human Reserved:** NOT REQUIRED — this makes existing approved DATA-001 semantics consistent across ENG-010 capture paths.

## 4. Repair 1 disposition

Because all five independent semantic findings are accepted and blocking:

- Repair 1 candidate `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` is `FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY`.
- Repair 1 semantic review is `FAILED / FINDINGS`.
- Canonical integration is `NOT AUTHORIZED`.
- ENG-010 is `NOT DONE`.
- The candidate must not be amended, merged, rebased, cherry-picked, or used as Repair 2 ancestry.

## 5. Repair 2 authority and objectives

**Repair:** REPAIR 2 AUTHORIZED / DURABLY DISPATCHED

**Task Packet disposition:** Revision 1 remains operative. No Task Packet Revision 2 is created because the violated semantics and responsibility boundaries are already present in approved authority and the operative packet. This record adds finding, repair, and lifecycle evidence without changing the Task Packet's objective, authority, risk, or scope.

**Human Reserved:** NOT REQUIRED. No new product behavior, cross-Project policy, security policy, architecture, or destructive authority is being selected.

Repair 2 has exactly these bounded objectives:

1. `R2-O1` — Trusted interaction evidence provenance.
2. `R2-O2` — Interaction-specific relevance and explicit Action focus.
3. `R2-O3` — Cross-Project Knowledge material-reference semantics.
4. `R2-O4` — Action-linked Progress correction ownership.
5. `R2-O5` — DATA-001 mutation-path coverage.

Repair 2 must also preserve `ENG-010-DV-R001` as CLOSED, truthful `ModelInteractionOutcome` payloads, proposal non-authority, the bounded context hard cap, ENG-006 parent-existence behavior, ENG-007 deletion scope and lineage behavior, accepted-state truthfulness, immutable Knowledge origin, provider isolation, mixed outcomes, and no migration.

## 6. Exact write lock and sufficiency

**Write-lock sufficiency:** YES. Every accepted finding can be repaired in the existing four interaction production files and seven task-owned test/config files while consuming accepted upstream APIs read-only.

Production paths:

1. `src/application/services/interaction/interactionTypes.ts`
2. `src/application/services/interaction/contextSelection.ts`
3. `src/application/services/interaction/interactionOrchestrator.ts`
4. `src/application/services/interaction/index.ts`

Test and configuration paths:

1. `tests/application/services/interaction/contextSelection.test.ts`
2. `tests/application/services/interaction/interactionOrchestrator.test.ts`
3. `tests/application/services/interaction/interactionClarification.test.ts`
4. `tests/application/services/interaction/interactionDeletion.test.ts`
5. `tests/application/services/interaction/vitest.config.ts`
6. `tests/integration/d1/interaction/interactionD1.test.ts`
7. `tests/integration/d1/interaction/vitest.config.ts`

All other paths, including `src/domain/**`, `src/application/contracts/**`, accepted upstream service and port paths, infrastructure, migrations, dependencies, and root configuration, remain read-only.

## 7. Repair 2 deterministic regression contract

The existing `TC-01` through `TC-27`, Repair-1 regression evidence, and full regression matrix remain required. Repair 2 additionally requires:

| ID | Required deterministic evidence |
|---|---|
| `R2-TC-01` | An authoritative ordinary mutation call without genuine required interaction evidence cannot create mutation authority; the regression fails Repair 1's fallback-synthetic behavior. |
| `R2-TC-02` | A valid actually observed user direction still classifies, authorizes, and executes an ordinary mutation. |
| `R2-TC-03` | Deletion initiation cannot mint destructive direction from an internally generated fallback summary. |
| `R2-TC-04` | Direction and confirmation use two distinct genuine user-interaction evidence instances with exactly matching deletion scope. |
| `R2-TC-05` | Materially different interaction texts over the same candidate pool can produce different deterministic relevance ordering. |
| `R2-TC-06` | An explicit `actionId` materially prioritizes or represents that Action and its authorized relevant context before truncation. |
| `R2-TC-07` | With more than 32 candidates, the most interaction-relevant authorized items survive the cap rather than fixed category order alone. |
| `R2-TC-08` | An unrelated cross-Project Knowledge candidate is excluded even when retrieval returns it. |
| `R2-TC-09` | Materially relevant cross-Project Knowledge enters context only through approved reference/reuse semantics with origin and qualification preserved. |
| `R2-TC-10` | Current Progress linked to Action A under Project P can be corrected when A exists under P. |
| `R2-TC-11` | An absent or wrong-Project Action referenced by prior Progress produces no accepted correction persistence. |
| `R2-TC-12` | Credential-shaped Project intended-outcome text is rejected before persistence. |
| `R2-TC-13` | Credential-shaped Action description is rejected before persistence. |
| `R2-TC-14` | Credential-shaped Context Fact is rejected before persistence. |
| `R2-TC-15` | Credential-shaped Progress statement is rejected before persistence. |
| `R2-TC-16` | Credential-shaped corrected Progress content is rejected before persistence. |
| `R2-TC-17` | Ordinary sensitive-domain content remains eligible; the repair does not become generalized DLP. |
| `R2-TC-18` | `ENG-010-DV-R001` remains closed: advisory/proposal payloads stay truthfully typed with no semantic laundering. |

## 8. Failed-candidate and migration boundaries

Repair 2 must be a fresh complete implementation directly atop this governance-only Repair 2 dispatch commit. Neither Candidate 1 nor Repair 1 may become parent, merge, rebase, cherry-pick, or other accepted ancestry:

- Candidate 1: `100f730556af7cea0f0a623809627aa3cf49d5a9` — FROZEN / UNACCEPTED / HISTORICAL.
- Repair 1: `495f142fa28bebd3be47518fdd7a3b919ea0fcc1` — FROZEN / UNACCEPTED / HISTORICAL.

Migration remains immutable:

| Property | Value |
|---|---|
| Path | `migrations/0001_authoritative_state.sql` |
| Git blob | `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` |
| SHA-256 | `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` |
| Repair 2 migration work | NONE |

## 9. Repair 2 Builder dispatch

| Property | Value |
|---|---|
| Repair | REPAIR 2 AUTHORIZED / DURABLY DISPATCHED |
| Implementation base | This governance-only Repair 2 dispatch commit on `foundation/product-foundation` |
| Branch | `eng-010-builder-repair-2` |
| Worktree | `/private/tmp/prj226-eng010-builder-repair-2` |
| Current Builder before provisioning | NONE |
| Assigned Builder | ENG-010 REPAIR 2 BUILDER |
| Write authority | ACTIVE / BOUNDED TO EXACT 11-PATH LOCK |
| Implementation state at dispatch | NOT YET STARTED |
| Required next evidence | Fresh Builder candidate, then fresh independent deterministic verification before semantic review |

Provisioning this branch/worktree from the governance dispatch commit starts no implementation. The Builder may inspect both failed candidates read-only but may not copy, cherry-pick, merge, or inherit either candidate as ancestry.

## 10. Status after disposition

| Property | Value |
|---|---|
| ENG-010 | NOT DONE |
| Formal DoR | PASS — Revision 1 |
| READY | YES |
| Repair 1 deterministic | PASS |
| Repair 1 semantic review | FINDINGS |
| Accepted semantic findings | `ENG-010-R1-SR-R001` through `ENG-010-R1-SR-R005` |
| Repair 1 candidate | FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY |
| Repair | REPAIR 2 AUTHORIZED / DURABLY DISPATCHED |
| Current Builder | ENG-010 REPAIR 2 BUILDER |
| Human Reserved | NOT REQUIRED |
| Implementation | NOT YET STARTED |
| Next required role | ENG-010 REPAIR 2 BUILDER |
| Semantic review for Repair 2 | NOT AUTHORIZED UNTIL FRESH DETERMINISTIC PASS |

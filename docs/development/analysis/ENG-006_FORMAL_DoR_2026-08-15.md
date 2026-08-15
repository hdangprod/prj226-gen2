# ENG-006 Formal Definition of Ready Evaluation

**Artifact class:** OPERATIONAL / FORMAL DoR EVIDENCE
**Authority:** CONTROLLER READY-GATE EVIDENCE
**Date:** 2026-08-15
**Disposition:** PASS
**Human Reserved:** NOT REQUIRED
**Task packet:** `docs/development/tasks/ENG-006-direct-sql-retrieval.md`
**Builder authorization:** ONE BOUNDED BUILDER AUTHORIZED UPON READY COMMIT
**Current Builder:** NONE
**Implementation:** NOT STARTED

---

> [!IMPORTANT]
> **GOVERNANCE STATUS: FORMAL DoR PASS**
>
> **SAFE TO MARK ENG-006 READY: YES**
> **SAFE TO AUTHORIZE ONE BOUNDED BUILDER: YES**
>
> This artifact records the DoR decision.
> Builder execution becomes operationally dispatchable only after the READY
> governance state is committed to the canonical branch.

---

## Repository State Verification

`git status --short` output (trimmed):
```
 M docs/development/analysis/CONTEXT_HANDOFF.md
 M docs/development/analysis/STRONG_MODEL_REVIEW_REGISTER.md
?? docs/development/analysis/ENG-006_TASK_PACKET_CONTROLLER_REVIEW_2026-08-15.md
?? docs/development/tasks/ENG-006-direct-sql-retrieval.md
```

`git diff --check`: **PASS** — zero whitespace errors
`git diff --name-status`: Only `docs/development/analysis/CONTEXT_HANDOFF.md` and
`docs/development/analysis/STRONG_MODEL_REVIEW_REGISTER.md` are modified (analysis/planning documents).

**Assessment:** The only untracked/modified paths are analysis documents and the new canonical
task packet. No `src/`, `tests/`, `migrations/`, product, domain, or runtime
architecture file is modified or untracked. Repository state is clean for DoR evaluation.

**Migration hash verified:**
```
adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99  migrations/0001_authoritative_state.sql
```
Matches the ENG-003 Delivery Record and Engineering Plan exactly. Migration is intact.

---

## Authority Documents Consulted

In canonical precedence order:

1. `product/PRODUCT_REQUIREMENTS.md` — CANONICAL/APPROVED rev 1 (GOV-005)
2. `product/DOMAIN_MODEL.md` — CANONICAL/APPROVED rev 1 (GOV-009)
3. `docs/architecture/RUNTIME_ARCHITECTURE.md` — CANONICAL/APPROVED rev 1 (GOV-017)
4. `development/DELIVERY_CONTRACT.md` — CANONICAL/APPROVED rev 1 (GOV-013)
5. `docs/development/ENGINEERING_PLAN.md` — OPERATIONAL/ACTIVE rev 1
6. `docs/development/delivery/ENG-003-d1-authority-foundation.md` — OPERATIONAL/ACTIVE
7. `docs/development/delivery/ENG-004-project-action-context-slice.md` — OPERATIONAL/ACTIVE
8. `docs/development/delivery/ENG-005-knowledge-provenance-slice.md` — OPERATIONAL/ACTIVE
9. `docs/development/tasks/ENG-006-direct-sql-retrieval.md` — Task Packet (PROPOSED)

Planning evidence read for provenance only (non-normative):
- `docs/development/analysis/ENG-006_P0_EVIDENCE_2026-08-15.md`
- `docs/development/analysis/ENG-006_P0_ADJUDICATION_2026-08-15.md`
- `docs/development/analysis/ENG-006_TASK_PACKET_CONTROLLER_REVIEW_2026-08-15.md`

---

## Dimension-by-Dimension Evaluation

---

### Dimension 1 — OBJECTIVE

**Evaluation: PASS**

The objective (Task Packet §2) reads:

> Deliver simplest-sufficient direct-SQL retrieval of accepted Project state, Actions, context
> facts, progress, and Knowledge Items from authoritative D1 persistence, with standing-based
> currentness filtering; origin provenance preservation; cross-project candidate retrieval;
> distinguished not-found outcomes; and normalized D1 failure behavior. Persistence and retrieval
> enforce approved semantics but create no new product meaning.

**Precision check:** Each clause maps directly to a measurable outcome. "Simplest-sufficient
direct-SQL retrieval" is grounded in Runtime Architecture §"Accepted memory and retrieval" and
ARC-005. "Standing-based currentness filtering" maps to Domain Invariant 12 and Runtime
Architecture Invariant 5. "Origin provenance preservation" maps to MOD-004. "Cross-project
candidate retrieval" maps to the Domain Model Knowledge reuse semantics. "Distinguished not-found
outcomes" and "normalized D1 failure" are engineering design decisions resolved in P0-002.

**Bounded check:** No ENG-007 (deletion/export), ENG-009 (model adapter), or ENG-010
(orchestration/interaction) responsibility enters the objective. The statement "create no new
product meaning" explicitly blocks Builder from inventing product semantics.

**Independent testability check:** Every clause has at least one dedicated evidence case in the
20-case matrix (EV-001 through EV-020). A fresh Verifier could independently assess each clause.

**Free of vague phrases:** "Simplest-sufficient" is constrained by "direct SQL" and the explicit
Non-Goals list (§11), which names FTS, vectors, ORM, cache, and queue. No phrase allows Builder
reinterpretation of product semantics.

**Conclusion:** Objective is precise, bounded, independently testable, sufficient for one Builder,
and free of hidden downstream responsibilities.

---

### Dimension 2 — DEPENDENCIES

**Evaluation: PASS**

The Task Packet (§4) lists five predecessors with exact identity:

| Predecessor | Required state | Delivery Record identity | Actual state |
|---|---|---|---|
| ENG-001 | DONE | Locked TypeScript/Workers toolchain | DONE — confirmed in ENGINEERING_PLAN.md and CURRENT.md |
| ENG-002 | DONE | 16-file manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f` | DONE — confirmed in Engineering Plan and ENG-003 DR |
| ENG-003 rev 2 | DONE | 9-file aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685` | DONE — ENG-003 DR Controller closure section confirmed, migration SHA verified in-repo |
| ENG-004 | DONE | 7-file aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` | DONE — ENG-004 DR Controller closure confirmed |
| ENG-005 | DONE | 7-file aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` | DONE — ENG-005 DR Controller closure confirmed, all findings closed |

All three Delivery Records record independent review GREEN and deterministic verification PASS.
Durable evidence is present in the repository delivery records.

**ENG-009 / ENG-010 dependency check:** ENG-006 does not list ENG-009 or ENG-010 as
predecessors, and the Task Packet correctly places ENG-006 upstream of both in the DAG. No hidden
dependency on unfinished work exists.

**ENG-003 revision identity check:** The packet cites "ENG-003 (Revision 2)" with the exact
accepted aggregate. The Delivery Record confirms revision-2 Controller closure. The migration
SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` is verified in-repo
and matches all delivery records. Durable.

---

### Dimension 3 — PRODUCT AUTHORITY

**Evaluation: PASS**

Each user-visible/product-semantic behavior in the packet is traced to approved Product authority:

| Behavior | Product authority |
|---|---|
| Resumption (retrieve context facts, progress, project state) | PI-CAP-002, PI-OUT-001, PF-CAP-001, PF-CTX-001; ARC-005 |
| Current Knowledge retrieval | PI-CAP-005, PI-OUT-004; Domain Model §Knowledge lifecycle |
| Cross-project reuse retrieval | MOD-004; Domain Model §Cross-Project reuse |
| Uncertainty / currentness qualification | PI-QLT-004; Domain Invariant 12; Runtime Architecture Invariant 5 |
| Non-state-changing retrieval | Domain Model §Human-control semantics, "Advisory or non-state-changing" row |

**Resumption:** PI-OUT-001 ("Resume active work without manually reconstructing important
context"), PI-CAP-002, and ARC-005 ("preserve accepted Project/Action state, progress, unresolved
matters… to resume after transient conversation loss") all authorize retrieval of accepted
context. The retrieval itself does not accept a state change; it is advisory and read-only.

**Current Knowledge retrieval:** PI-CAP-005 ("Retrieve relevant captured knowledge during later
project work") and PI-OUT-004 are the direct product grants. The Domain Model defines that a
Knowledge Item "has current semantic standing unless it is superseded or deleted."

**Cross-project reuse:** MOD-004 is the governing approved decision. The Domain Model
§Cross-Project reuse states "A Knowledge Item may assist another Project only when materially
relevant." ENG-006 retrieves candidates; material relevance determination is deferred to ENG-010,
consistent with approved authority.

**Uncertainty/currentness:** PI-QLT-004 and Domain Invariant 12 require that superseded
knowledge is not returned as current. Runtime Architecture Invariant 5 confirms this.

**Non-state-changing retrieval:** The Domain Model §Human-control semantics explicitly classifies
"Retrieval, explanation, summarization, recommendation, proposal" as non-state-changing. The Task
Packet §10 Constraint 5 enforces SELECT-only queries.

**No new product behavior:** The packet states "Persistence and retrieval enforce approved
semantics but create no new product meaning." The Non-Goals list (§11) excludes ENG-007/010
responsibilities. No invention of new product behavior is present.

---

### Dimension 4 — DOMAIN AUTHORITY

**Evaluation: PASS**

Checking each required invariant:

| Domain invariant | Task Packet compliance |
|---|---|
| Project semantics (MOD-001) | `getProject`, `listProjects` return `Project` with `id`, `intendedOutcome`, `state`. No new Project concept introduced. |
| Action semantics (MOD-001) | `getActionsForProject` returns `Action[]`. Belongs to exactly one Project. |
| AcceptedProgress current/superseded (MOD-002, Domain Inv 12) | `getCurrentProgress` filters `standing = 'current'`. EV-008 requires superseded exclusion. |
| Knowledge origin immutable (MOD-003, Domain Inv 11) | EV-011 requires `originatingProjectId` preserved. §10 Constraint 3 states "must faithfully return `originating_project_id`". |
| Knowledge supersession unchanged (MOD-003, Domain Inv 12) | `getCurrentKnowledgeForProject` and `getCurrentKnowledgeAcrossProjects` filter `standing = 'current'`. EV-010 tests exclusion. |
| KnowledgeReference computed (MOD-004, P0-003) | KnowledgeReference is NOT persisted; retrieved as in-memory type by ENG-010 only. |
| No new lifecycle state | No new state type added. `Active`, `Completed`, `Open`, `current`, `superseded` are the only states used. |
| No "deleted" standing | No `Deleted` lifecycle introduced. Task Packet §11 confirms deletion is ENG-007. |
| No new domain type | §5 P0-002 states "No new domain type is created." All returned types are from `src/domain/model.ts`. |

**`AcceptedProjectContext` aggregation:** The domain type `AcceptedProjectContext` is defined in
`model.ts` and groups `facts` and `progress`. The Task Packet does NOT require this type to be
returned as a single composite; instead, it exposes granular methods (`getAcceptedContextFacts`,
`getCurrentProgress`) that return constituent parts. This is conservative and correct: it avoids
conflating retrieval granularity with domain semantics. No domain violation.

---

### Dimension 5 — RUNTIME ARCHITECTURE

**Evaluation: PASS**

| Architecture invariant | Task Packet compliance |
|---|---|
| One Liam deployable (ARC-002) | Write scope is `src/application/services/retrieval/**` — application layer only. No new service or deployable created. |
| D1 is authoritative (ARC-001, ARC-005) | All queries target D1 through `D1DatabaseLike`. No alternative persistence. |
| Simplest-sufficient direct SQL (ARC-005) | §10 Constraint 1: "Queries must be prepared SQL statements executed directly against `D1DatabaseLike`." |
| Application-managed SQL shape allowed | P0-002 adjudication confirms application service layer directly owns query definitions. Consistent with ARC-005 and Runtime Architecture §"Accepted memory and retrieval": "simplest sufficient direct SQL querying of authoritative persistence." |
| No vector DB, embeddings, FTS | §11 Non-Goals explicitly excludes all of these. §6 Prohibited Application Surface lists them. EV-020 requires a static scan. |
| No external search, no cache, no queue | §11 Non-Goals and §6 Prohibited Surface. |
| No new service/control plane | No new deployable, service, or control plane introduced. |

Runtime Architecture §"Accepted memory and retrieval" states: "For v1 it uses the simplest
sufficient direct SQL querying of authoritative persistence; no separately materialized index,
vector database, semantic-search system, graph store, cache, or retrieval service is selected."
The Task Packet is fully compliant.

---

### Dimension 6 — WRITE LOCK

**Evaluation: PASS**

The Task Packet assigns exclusive write ownership (§8) to exactly:

```
src/application/services/retrieval/**
tests/application/services/retrieval/**
tests/integration/d1/retrieval/**
```

**Sufficiency check:** The Builder needs to:
1. Create `src/application/services/retrieval/retrievalService.ts` and supporting files — within `src/application/services/retrieval/**`. ✓
2. Create `FakeD1`-based unit tests — within `tests/application/services/retrieval/**`. ✓
3. Create local D1 integration tests — within `tests/integration/d1/retrieval/**`. ✓

**Non-overlap check:** The three paths are new subdirectories under existing parent roots.
`src/application/services/retrieval/` does not exist yet (confirmed: only `knowledgeProvenance/`
and `projectActionContext/` exist). Similarly, `tests/application/services/retrieval/` and
`tests/integration/d1/retrieval/` do not exist. No existing accepted path is in the write scope.

**Protected upstream paths (§9):** `src/domain/**`, `src/application/contracts/**`,
`src/application/ports/persistence/**`, `src/infrastructure/d1/**`,
`migrations/0001_authoritative_state.sql`, all existing test directories, and root config files
are explicitly read-only. No ENG-003/004/005 accepted path is in the write scope.

**Hidden modification risk assessment:**
- Does the Builder need to modify `src/infrastructure/d1/**`? **No.** The Builder consumes `D1DatabaseLike` from the accepted ENG-003 baseline as an interface type; it does not modify the D1 adapter. The application service writes its own SQL directly against the interface — this is the P0-001 resolution.
- Does the Builder need `src/application/ports/persistence/**`? **No.** The retrieval service does not go through the `AcceptedStatePersistence` port (which handles writes). It uses direct SQL against `D1DatabaseLike`.
- Does the Builder need `src/domain/**`? **Read-only** consumption of types, explicitly noted in §9.
- Does the Builder need `migrations/**`? **Read-only** — no new migration authorized (P0-004).
- Does the Builder need `src/index.ts`? **No barrel export authorized** (§8, last sentence).
- Does the Builder need root configuration? **No** — the Task Packet's test configuration stays inside `tests/application/services/retrieval/**` and `tests/integration/d1/retrieval/**`.

**Assessment:** The write lock is sufficient for complete task execution and is non-overlapping
with all accepted upstream paths.

---

### Dimension 7 — QUERY CONTRACT

**Evaluation: PASS**

Auditing all 9 methods in the `RetrievalService` interface (§6):

| Method | Purpose clear | Input clear | Result type clear | Empty vs not-found clear | Currentness clear | No arbitrary text search |
|---|---|---|---|---|---|---|
| `getProject(projectId)` | ✓ Single Project by branded ID | ✓ `ProjectId` | ✓ `RetrievalResult<Project>` | ✓ absent → `not-found` | N/A (Project has no standing) | ✓ |
| `listProjects(filter?)` | ✓ List with optional state filter | ✓ Optional `ProjectState` enum value | ✓ `RetrievalResult<readonly Project[]>` | ✓ empty list → `found: []` | N/A | ✓ |
| `getActionsForProject(projectId)` | ✓ All Actions for Project | ✓ `ProjectId` | ✓ `RetrievalResult<readonly Action[]>` | ✓ zero Actions → `found: []` (EV-005) | N/A (Action has no standing) | ✓ |
| `getAcceptedContextFacts(projectId)` | ✓ Ordered context facts | ✓ `ProjectId` | ✓ `RetrievalResult<readonly NonEmptyText[]>` | ✓ empty → `found: []` | N/A (facts are immutable, not standing-gated) | ✓ |
| `getCurrentProgress(projectId)` | ✓ Current progress facts | ✓ `ProjectId` | ✓ `RetrievalResult<readonly AcceptedProgress[]>` | ✓ zero current → `found: []` | ✓ `standing = 'current'` only | ✓ |
| `getCurrentKnowledgeForProject(projectId)` | ✓ Current Knowledge by origin | ✓ `ProjectId` | ✓ `RetrievalResult<readonly KnowledgeItem[]>` | ✓ zero → `found: []` | ✓ `standing = 'current'` only | ✓ |
| `getCurrentKnowledgeAcrossProjects(options?)` | ✓ Cross-project candidate pool | ✓ Optional `excludeOriginatingProjectId` | ✓ `RetrievalResult<readonly KnowledgeItem[]>` | ✓ zero → `found: []` | ✓ `standing = 'current'` only | ✓ |
| `getKnowledgeItem(id)` | ✓ Single KI by ID regardless of standing | ✓ `KnowledgeItemId` | ✓ `RetrievalResult<KnowledgeItem>` | ✓ absent → `not-found` | ✓ Historical — explicitly qualified ("regardless of current/superseded standing") | ✓ |
| `getKnowledgeLineage(id)` | ✓ Full supersession chain | ✓ `KnowledgeItemId` | ✓ `RetrievalResult<readonly KnowledgeItem[]>` | ✓ chain of 1 → `found: [item]` | ✓ Historical — explicitly qualified lineage reconstruction | ✓ |

**No unnecessary or ambiguous API surface:** The 9 methods map directly to the 10 P0-004 query
requirements established in the adjudication (projects by ID, projects by state, actions by
project, context facts, current progress, current Knowledge by origin, cross-project Knowledge,
superseded qualification, origin preservation, lineage reconstruction). No method requires
interpretation of text content or introduces ranking logic.

**`listProjects` parent-existence question:** For collection methods that take `projectId`,
the contract specifies empty collection → `found: []` (§7 Outcome Rule 2). For `listProjects`
there is no parent; it always returns a collection result. This is correct and unambiguous.

**Assessment:** All 9 methods pass all audit axes.

---

### Dimension 8 — RETURN / FAILURE CONTRACT

**Evaluation: PASS**

The discriminated union (§7):
```typescript
export type RetrievalResult<T> =
  | { readonly kind: "found"; readonly value: T }
  | { readonly kind: "not-found"; readonly entityType: "project" | "knowledge-item"; readonly id: string }
  | { readonly kind: "retrieval-failed"; readonly reason: string; readonly retryable: boolean };
```

**Determinism check — three outcomes:**
- `found`: entity present and returnable
- `not-found`: entity absent from D1 (single-entity lookups only: `getProject`, `getKnowledgeItem`)
- `retrieval-failed`: D1 operational failure

**Raw D1 error leakage:** §7 Outcome Rule 3 states "Raw D1 error objects and database stack
traces are suppressed." EV-018 requires that a simulated D1 error produces `retrieval-failed`
"without unhandled throw." This is adequate to prevent leakage.

**Failure normalization determinism:** Classification is "conservative":
- transient errors (timeout, connection) → `retryable: true`
- structural errors (schema, syntax, type mismatch) → `retryable: false`

**Retryability residual (REG-006-P2-01):** The P2 item notes that "exact retryable
classification for rare D1 network errors can be refined during local integration testing." This
is a bounded implementation detail: the packet gives a deterministic classification policy
(transient vs. structural), and the Builder/Verifier can agree on whether a given error class is
transient or structural based on the D1 surface. A Verifier does not need to interpret
`retryable` behavior from scratch; it checks that the normalization wrapper exists and that the
tested D1 error types map to the declared classification. The residual variation is confined to
rare D1 network errors not covered by EV-018's simulated failure scope. **Classification:
bounded implementation detail, not blocking.**

**Collection-empty vs. missing-parent semantics:** §7 Outcome Rule 2 explicitly distinguishes:
> "Parent exists but has zero items → `{ kind: "found", value: [] }`"
> "(Note: Empty collection is `{ kind: "found", value: [] }`, NOT `"not-found"`)."

This is clear and distinguishable from the `not-found` outcome reserved for single-entity
lookups. EV-005 covers the zero-actions case explicitly. **Correct.**

**Assessment:** Contract is deterministic at the application level. The `retryable` P2 item does
not prevent Builder or Verifier agreement on the core pass/fail contract.

---

### Dimension 9 — CURRENTNESS

**Evaluation: PASS**

| Requirement | Task Packet provision |
|---|---|
| Default Knowledge retrieval returns current only | `getCurrentKnowledgeForProject` and `getCurrentKnowledgeAcrossProjects` both state "standing = 'current'" in their docstrings and §10 Constraint 2. |
| Default AcceptedProgress retrieval returns current only | `getCurrentProgress` states "standing = 'current'" in its docstring and §10 Constraint 2. |
| Superseded cannot appear as unqualified current | §10 Constraint 2: "Superseded items must never be returned as unqualified current state." EV-008 (progress supersession exclusion) and EV-010 (Knowledge supersession exclusion) both verify this. |
| Historical access is explicitly qualified | `getKnowledgeItem` docstring: "returns item regardless of current/superseded standing." `getKnowledgeLineage` explicitly retrieves historical chain. Both are named with "Knowledge" (not "Current"). |
| Standing preserved on historical results | EV-015 requires that `getKnowledgeItem` on a superseded item returns `{ kind: "found", value: KnowledgeItem }` with `standing: 'superseded'` explicitly set. |

The schema in `0001_authoritative_state.sql` confirms that both `accepted_progress.standing` and
`knowledge_items.standing` are persisted columns with `CHECK (standing IN ('current', 'superseded'))`.
Direct SQL filtering on `standing = 'current'` is feasible and deterministic on the existing schema.

---

### Dimension 10 — CROSS-PROJECT REUSE

**Evaluation: PASS**

| Requirement | Task Packet provision |
|---|---|
| Candidate retrieval separated from material relevance | §10 Constraint 4: "Cross-project queries return candidate pools only. Retrieval does NOT decide material relevance…" |
| ENG-006 retrieves candidate KnowledgeItems | `getCurrentKnowledgeAcrossProjects` returns `readonly KnowledgeItem[]` — raw candidates. |
| ENG-006 preserves `originatingProjectId` | §10 Constraint 3: "must faithfully return `originating_project_id` matching the database record." EV-011 and EV-012 verify this. |
| ENG-006 does NOT decide material relevance | No ranking, scoring, or relevance logic in the method contract. §6 Prohibited Application Surface: "NO fuzzy relevance scoring or ranking algorithms." |
| ENG-006 does NOT persist `assistingProjectId` | No persistence write. EV-019 verifies zero writes. |
| ENG-006 does NOT persist `KnowledgeReference` | P0-003: "`KnowledgeReference` is **COMPUTED at runtime**, not persisted." |
| ENG-006 does NOT call `referenceKnowledge()` for interaction-specific orchestration | §6 Prohibited Surface: "NO `referenceKnowledge()` invocation inside retrieval methods." |
| `referenceKnowledge()` invocation is ENG-010 | §10 Constraint 4, §11 Non-Goal: "Interaction-driven relevance determination (owned by ENG-010)." |

`KnowledgeReference` is defined in `src/domain/model.ts` as an interface with `assistingProjectId`
and `qualification` — it is a product concept requiring contextual judgment. P0-003 correctly
assigns runtime computation to ENG-010 via `referenceKnowledge()` in `src/domain/knowledge.ts`.

---

### Dimension 11 — MIGRATION / PERSISTENCE

**Evaluation: PASS**

**No migration required (P0-004):** The Task Packet states `NO SCHEMA MIGRATION` at §5. The
P0-004 adjudication conducted a feasibility audit of all 10 query requirements against the
existing schema and confirmed 100% feasibility. Migration file `0002_*.sql` is explicitly
prohibited.

**Migration is read-only:** §9 Protected Read-Only Dependencies lists
`migrations/0001_authoritative_state.sql`. §8 Allowed Scope does not include `migrations/**`.

**Schema genuinely supports all required queries:** Verified against `0001_authoritative_state.sql`:

| Query requirement | Schema support |
|---|---|
| Project by ID | `projects.id PRIMARY KEY` |
| Projects by state | `projects.state TEXT CHECK (state IN ('Active', 'Completed'))` |
| Actions by project | `actions.project_id TEXT NOT NULL REFERENCES projects(id)` |
| Context facts in ordinal order | `accepted_context_facts(project_id, ordinal) PRIMARY KEY` with `ordinal INTEGER CHECK (ordinal >= 0)` |
| Current progress | `accepted_progress.standing TEXT CHECK (standing IN ('current', 'superseded'))` |
| Current Knowledge by origin | `knowledge_items.originating_project_id TEXT NOT NULL`, `knowledge_items.standing` |
| Cross-project Knowledge candidates | `knowledge_items.originating_project_id` allows filtering by project or excluding one |
| Standing = current filter | `standing` column present in both `accepted_progress` and `knowledge_items` |
| Origin preservation | `knowledge_items.originating_project_id` is immutable (trigger `preserve_knowledge_invariants`) |
| Lineage reconstruction | `knowledge_items.supersession_chain TEXT` stores JSON array of predecessor IDs; `supersedes_id` links directly |

**No hidden index/table/column/trigger requirement:** The P0-004 adjudication correctly notes
that secondary indices on `actions(project_id)` and `knowledge_items(originating_project_id, standing)`
are performance optimizations only — not functionally required for single-user v1 correctness.
No index is missing from a correctness standpoint. No hidden trigger, table, or column is needed.

---

### Dimension 12 — DATA-001

**Evaluation: PASS**

| Requirement | Task Packet provision |
|---|---|
| Does not weaken capture protections | ENG-006 executes only SELECT statements. It does not accept or process user content for capture. Data-001 capture protections remain wholly in ENG-005. |
| Does not weaken model-context protections | ENG-006 does not invoke the model port. ENG-008 remains the model-egress guard. |
| No third independent auth-material regex copy | §10 Constraint 7: "All data in D1 has already passed the ENG-005 capture gate. ENG-006 does NOT introduce a third copy of authentication-material regex scanning." |
| No unsafe data newly admitted because retrieval is read-only | Read-only retrieval does not admit new data. The data was already gated by ENG-005 at capture. |

REG-006-07 (retrieval-time defense-in-depth auth-material scanning) is noted as a P1 optional
future enhancement — not required for DATA-001 compliance, since the primary guard is at capture
(ENG-005) and the secondary guard is at model egress (ENG-008). This is correct per the approved
DATA-001 decision and its architecture.

---

### Dimension 13 — ENG-010 BOUNDARY

**Evaluation: PASS**

| Prohibited element | Task Packet enforcement |
|---|---|
| `BoundedModelContext` | §6 Prohibited Surface: "NO `createBoundedModelContext` calls or `BoundedModelContext` return types." §10 Constraint 6 explicitly states "does NOT assemble `BoundedModelContext`." |
| `selectionReason` | Not present in any interface definition. Absent from `RetrievalResult` type. |
| Context truncation | §10 Constraint 6: "does NOT enforce the ≤32 item limit (ENG-010 boundary)." §11 Non-Goal: "BoundedModelContext construction or context truncation (owned by ENG-010)." |
| Relevance ranking | §6 Prohibited Surface: "NO fuzzy relevance scoring or ranking algorithms." |
| Model invocation | §11 Non-Goal: "Live network calls to external APIs." |
| Session/conversation orchestration | §11 Non-Goal: "Conversational session-loss recovery orchestration (owned by ENG-010)." |
| Interaction interpretation | Not in any method signature. All inputs are typed IDs or filter enums. |

The ENG-010 boundary is clean. ENG-006 stops at returning typed domain entities; ENG-010 is the
sole owner of context assembly, relevance qualification, and model invocation.

---

### Dimension 14 — DETERMINISTIC EVIDENCE CONTRACT

**Evaluation: PASS**

The 20-case evidence matrix (§12) is evaluated against the required coverage list:

| Required coverage | Evidence case(s) |
|---|---|
| Project found / not found | EV-001 (found), EV-002 (not-found) |
| Project-state preservation | EV-001 (exact `id`, `intendedOutcome`, `state`), EV-003 (state filter) |
| Action isolation | EV-004 (Actions for project), EV-005 (zero actions for project) |
| Empty collections | EV-005 (zero actions), implied for other collection methods |
| Ordered facts | EV-006 (ascending `ordinal` order — explicit) |
| Current progress | EV-007 (current progress) |
| Superseded progress exclusion | EV-008 (superseded predecessor excluded) |
| Current Knowledge | EV-009 (current KI for project) |
| Superseded Knowledge exclusion | EV-010 (superseded KI excluded) |
| Immutable origin | EV-011 (origin preserved), EV-012 (cross-project origin preserved) |
| Cross-project candidate retrieval | EV-012 (across projects), EV-013 (exclude option) |
| Candidate ≠ relevance | EV-013 (exclusion option only — no relevance scoring) |
| Knowledge found / not-found | EV-014 (current found), EV-015 (superseded found), EV-016 (not-found) |
| Historical qualification | EV-015 (superseded item with explicit `standing: 'superseded'`) |
| Lineage retrieval | EV-017 (`getKnowledgeLineage` returns full chain) |
| Normalized D1 failures | EV-018 (failure injection → `retrieval-failed`) |
| No mutation from reads | EV-019 (zero writes in `persistence_operations`) |
| No persistence receipt | EV-019 (zero receipts) |
| No schema change | §5 P0-004, §11 Non-Goals |
| Forbidden dependency scan | EV-020 (static analysis) |

**Verifier can decide PASS/FAIL without interpretation:** Each case has an explicit expected
outcome with an enumerated `kind` value. No case requires the Verifier to evaluate product
semantics — it evaluates observable test results.

---

### Dimension 15 — GENUINE LOCAL-D1 CONTRACT

**Evaluation: PASS**

| Requirement | Task Packet provision |
|---|---|
| Real accepted migration applied | §13 Item 1: "Executes strictly against `migrations/0001_authoritative_state.sql` (SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`)." |
| Fresh local state used | §13 preamble: "a fresh, migration-backed local D1 database." |
| Multiple Projects tested | §13 Item 2: "2 Active Projects, 1 Completed Project." |
| Current/superseded rows represented | §13 Item 2: "Multi-step progress correction chain (P₁ → P₂ → P₃)" and "Multi-step Knowledge correction chain (K₁ → K₂ → K₃)." |
| Project isolation tested | §13 Item 2: "Multiple Actions under different Projects"; cross-project seed state. |
| Origin preservation tested | §13 Item 3: "Real multi-project candidate query execution." |

---

### Dimension 16 — REGRESSION CONTRACT

**Evaluation: PASS**

| Requirement | Task Packet provision |
|---|---|
| All accepted existing suites must pass | §14: "All 7 existing Vitest configurations must pass." Lists all 7 by exact path. |
| 189 is a baseline observation, not an exact count requirement | §14: "Baseline Observation: 189 tests passing…. Any test count reduction requires investigation." |
| Exact eternal test count NOT required | The word "requires investigation" not "FAIL" — correct. |
| Unexplained regression-test disappearance is reviewable | "Any test count reduction requires investigation" — the Verifier must flag it, not auto-pass it. |
| Typecheck/lint/build/smoke align with repository scripts | §14 lists: `npx tsc --noEmit`, `npx eslint .`, `npm run build`, `git diff --check`. These are the repository-established verification commands. |

---

### Dimension 17 — CANDIDATE IDENTITY CONTRACT

**Evaluation: PASS**

§16 Verifier Contract states:
1. "Verify against the exact candidate commit SHA and tree SHA."
2. "Verify that the candidate diff touches ONLY the three authorized write paths."
3. "Compute per-file SHA-256 hashes and verify upstream accepted files remain byte-identical."

The packet requires commit SHA, tree SHA, and per-file SHA-256 aggregate manifest. This conforms
to established repository convention.

---

### Dimension 18 — VERIFIER INDEPENDENCE

**Evaluation: PASS**

§16 Verifier Contract:
- "The Deterministic Verifier is an independent, read-only responsibility."
- "The Verifier never repairs code."

The Verifier role is to execute the verification contract, bind results to the candidate, and
report objective pass/fail without performing semantic repair or authoring work.

---

### Dimension 19 — SEMANTIC REVIEWER INDEPENDENCE

**Evaluation: PASS**

§17 Semantic Review Contract defines 8 review dimensions across:
1. Currentness Semantics
2. Provenance Preservation
3. Candidate Boundary (cross-project candidate vs. relevance)
4. Scope Discipline (no LIKE, FTS, vectors, embeddings)
5. ENG-010 Boundary (no `BoundedModelContext`)
6. DATA-001 Boundary (no auth-material regex duplication)
7. Failure Safety (D1 errors normalized)
8. Non-Mutation (exclusively read queries)

The Reviewer returns `REVIEW: GREEN` or `REVIEW: NEEDS FIX` with finding IDs.

---

### Dimension 20 — HUMAN RESERVED

**Evaluation: NOT REQUIRED**

Checking each trigger category against what ENG-006 actually does:

| Trigger category | ENG-006 action | Conclusion |
|---|---|---|
| Product-scope semantic change | No. Retrieval enforces, not creates, product semantics. | NOT REQUIRED |
| Domain semantics | No. All types from existing `src/domain/model.ts`. No new type. | NOT REQUIRED |
| Runtime Architecture | No. Operates within approved direct-SQL retrieval topology. | NOT REQUIRED |
| Security-boundary decisions | No. DATA-001 enforcement unchanged. | NOT REQUIRED |
| Persistence architecture | No. SELECT-only against existing D1 schema. No new store. | NOT REQUIRED |
| Service topology | No. Single Worker deployable unchanged. | NOT REQUIRED |
| Production authority | No. Development only. | NOT REQUIRED |
| Paid-resource/provider authority | No. No paid resource. | NOT REQUIRED |

---

### Dimension 21 — BUILDER EXECUTABILITY

**Evaluation: PASS**

A fresh Builder has:
- ✓ A precise objective (§2)
- ✓ Exact normative authority references (§3)
- ✓ Exact predecessor aggregates and migration SHA (§4)
- ✓ Four resolved P0 design decisions (§5)
- ✓ The complete TypeScript interface for `RetrievalService` and `RetrievalResult` (§6)
- ✓ Exact outcome rules for all three result variants (§7)
- ✓ Exact write ownership paths (§8)
- ✓ Exact read-only dependency list (§9)
- ✓ Eight explicit invariants and constraints (§10)
- ✓ An explicit non-goals list (§11) preventing scope drift
- ✓ A 20-case evidence matrix (§12) defining what tests to write
- ✓ Local D1 seed state specification (§13)
- ✓ Regression and verification commands (§14)
- ✓ Stop rules if capability gaps are discovered (§15)
- ✓ Verifier and Reviewer contracts (§§16–17)
- ✓ An 11-condition Definition of Done (§18)

No unresolved product, domain, architecture, persistence, write-lock, or security decision
remains.

---

### Dimension 22 — NO HIDDEN P0

**Evaluation: PASS — No hidden P0 discovered**

All four pre-existing P0 items (P0-001, P0-002, P0-003, P0-004) are resolved and durably recorded
in `ENG-006_P0_ADJUDICATION_2026-08-15.md`. No new P0 was discovered during this evaluation.

Existing residual items:
- **REG-006-07 (P1):** Retrieval-time defense-in-depth auth-material scanning is an optional future enhancement; DATA-001 primary capture protection is complete in ENG-005. NOT BLOCKING.
- **REG-006-08 (P1):** Lineage ordering helper design is an implementation detail supported by `supersession_chain` JSON array. NOT BLOCKING.
- **REG-006-P2-01 (P2):** Exact retryable classification for rare D1 network errors is a bounded implementation detail within the declared policy. NOT BLOCKING.

---

## Final Formal DoR Decision

```
ENG-006 FORMAL DoR: PASS
```

---

## Full Dimension Report

| # | Dimension | Result |
|---|---|---|
| 1 | Objective | **PASS** |
| 2 | Dependencies | **PASS** |
| 3 | Product authority | **PASS** |
| 4 | Domain authority | **PASS** |
| 5 | Runtime Architecture | **PASS** |
| 6 | Write lock | **PASS** |
| 7 | Query contract | **PASS** |
| 8 | Failure contract | **PASS** |
| 9 | Currentness semantics | **PASS** |
| 10 | Cross-project semantics | **PASS** |
| 11 | Migration/persistence boundary | **PASS** |
| 12 | DATA-001 boundary | **PASS** |
| 13 | ENG-010 boundary | **PASS** |
| 14 | Deterministic evidence contract | **PASS** |
| 15 | Genuine local-D1 contract | **PASS** |
| 16 | Regression contract | **PASS** |
| 17 | Candidate identity contract | **PASS** |
| 18 | Verifier independence | **PASS** |
| 19 | Reviewer independence | **PASS** |
| 20 | Human Reserved | **NOT REQUIRED** |
| 21 | Builder executability | **PASS** |
| 22 | No hidden P0 | **PASS** |

---

## Remaining P1/P2 Items — Non-Blocking Rationale

**REG-006-07 (P1):** Retrieval-time auth-material scanning is an optional defense-in-depth
enhancement. DATA-001 capture protection is owned by ENG-005 (already DONE). ENG-006 is a
pure read path that does not admit new user-supplied content. No Builder execution decision
is required for DATA-001 compliance. Non-blocking for Builder execution and Verifier assessment.

**REG-006-08 (P1):** Lineage ordering helper design is an implementation detail. The schema's
`supersession_chain` JSON array stores predecessor IDs in append-order (enforced by the
`validate_knowledge_correction` trigger). The Builder has sufficient schema information to produce
ordered lineage results. The exact SQL or TypeScript decomposition approach is Engineering-owned.
Non-blocking for Builder execution and Verifier assessment.

**REG-006-P2-01 (P2):** Retryability classification for rare D1 network errors. The declared
policy (transient → `retryable: true`, structural → `retryable: false`) is deterministic for
the known D1 error taxonomy. The "rare network error" edge case may be refined during
integration testing within the authorized write scope. The Verifier's pass/fail criterion
(EV-018) requires that the failure envelope is returned without unhandled throw, not that every
possible D1 error variant is pre-enumerated. Non-blocking.

---

## Confirmation: No Unresolved P0

All four pre-existing P0 items (P0-001, P0-002, P0-003, P0-004) are resolved and durably recorded
in `ENG-006_P0_ADJUDICATION_2026-08-15.md`. No new P0 was discovered during this evaluation.

---

## Final Authority Statements

**ENG-006 FORMAL DoR: PASS**

**SAFE TO MARK ENG-006 READY: YES**

**SAFE TO AUTHORIZE ONE BOUNDED BUILDER: YES**

> [!IMPORTANT]
> This artifact records the DoR decision.
> Builder execution becomes operationally dispatchable only after the READY
> governance state is committed to the canonical branch. No Builder is currently running.
> Implementation has not started.

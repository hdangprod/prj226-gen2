# ENG-006 — Direct-SQL Retrieval and Accepted-Context Resumption

**Artifact class:** OPERATIONAL / TASK PACKET
**Lifecycle status:** READY — NOT DISPATCHED
**Task-level DoR:** PASS
**Builder authorization:** ONE BOUNDED BUILDER AUTHORIZED FOR DISPATCH
**Current Builder:** NONE (NOT YET DISPATCHED)
**Implementation status:** NOT STARTED
**Human Reserved:** NOT REQUIRED
**Formal DoR Evidence:** [`docs/development/analysis/ENG-006_FORMAL_DoR_2026-08-15.md`](../analysis/ENG-006_FORMAL_DoR_2026-08-15.md)
**Authorization:** `GOV-018`
**Governing contract:** `development/DELIVERY_CONTRACT.md` revision 1
**Decision owner:** `github:hdangprod`
**Date:** 2026-08-15

---

> [!NOTE]
> **GOVERNANCE NOTICE: READY — NOT DISPATCHED**
>
> This is a **canonical Task Packet** evaluated and marked `READY` following Controller review ([`ENG-006_TASK_PACKET_CONTROLLER_REVIEW_2026-08-15.md`](../analysis/ENG-006_TASK_PACKET_CONTROLLER_REVIEW_2026-08-15.md)) and formal Definition of Ready evaluation ([`ENG-006_FORMAL_DoR_2026-08-15.md`](../analysis/ENG-006_FORMAL_DoR_2026-08-15.md)).
>
> **Task-level Definition of Ready: PASS.**
> **BUILDER AUTHORIZATION: ONE BOUNDED BUILDER AUTHORIZED FOR DISPATCH.**
> **CURRENT BUILDER: NONE (NOT YET DISPATCHED).**
> **IMPLEMENTATION STATUS: NOT STARTED.**
>
> Builder execution becomes operationally dispatchable only after this READY governance state is committed to the canonical branch.

---

## 1. Task ID

`ENG-006`

---

## 2. Canonical Objective

Deliver simplest-sufficient direct-SQL retrieval of accepted Project state, Actions, context facts, progress, and Knowledge Items from authoritative D1 persistence, with:
- standing-based currentness filtering;
- origin provenance preservation;
- cross-project candidate retrieval;
- distinguished not-found outcomes; and
- normalized D1 failure behavior.

Persistence and retrieval enforce approved semantics but create no new product meaning.

---

## 3. Normative Authority

- `GOV-018` and `ARC-001`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md), [Domain Model](../../../product/DOMAIN_MODEL.md), and [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md), revision 1.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- [ENG-006 P0 Adjudication](../analysis/ENG-006_P0_ADJUDICATION_2026-08-15.md).
- The exact completed Delivery Records of predecessors:
  - [`ENG-003` Delivery Record](../delivery/ENG-003-d1-authority-foundation.md) (revision 2)
  - [`ENG-004` Delivery Record](../delivery/ENG-004-project-action-context-slice.md)
  - [`ENG-005` Delivery Record](../delivery/ENG-005-knowledge-provenance-slice.md)

---

## 4. Dependencies & Accepted Upstream Evidence

Canonical implementation predecessors, and no others, are:

1. **`ENG-001`** — `DONE`; locked TypeScript/Workers toolchain and test framework.
2. **`ENG-002`** — `DONE`; exact accepted sixteen-file manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
3. **`ENG-003` (Revision 2)** — `DONE`; exact accepted nine-file aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`; migration SHA-256 remains `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.
4. **`ENG-004`** — `DONE`; exact accepted seven-file aggregate `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2`.
5. **`ENG-005`** — `DONE`; exact accepted eight-file aggregate `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0`.

All predecessors are in `DONE` status with verified deterministic evidence and independent review `GREEN`.

---

## 5. Binding Controller P0 Decisions

This Task Packet strictly conforms to the Controller design adjudication:

- **P0-001 (Write Ownership):** ENG-006 receives a dedicated, disjoint path allocation (`src/application/services/retrieval/**`). All 9 accepted ENG-003 files remain byte-identical read-only dependencies. No upstream reopen is required.
- **P0-002 (Return Contract):** ENG-006 exposes granular query methods returning accepted domain types (`Project`, `Action`, `AcceptedProgress`, `KnowledgeItem`, `NonEmptyText`) from `src/domain/model.ts`, wrapped in application-layer discriminated result envelopes (`found | not-found | retrieval-failed`). No new domain type is created.
- **P0-003 (KnowledgeReference):** `KnowledgeReference` is **COMPUTED at runtime**, not persisted. ENG-006 retrieves candidate `KnowledgeItem`s across projects. ENG-010 owns interaction-specific material relevance and calls `referenceKnowledge()`.
- **P0-004 (Migration):** **NO SCHEMA MIGRATION.** `migrations/0001_authoritative_state.sql` is read-only and fully sufficient. No migration file `0002_*.sql` is authorized.

---

## 6. Application Surface & Method Contract

The retrieval service resides in `src/application/services/retrieval/retrievalService.ts` and exposes the following granular read methods:

```typescript
export interface RetrievalService {
  /** Retrieves a single Project by its branded ID. */
  getProject(projectId: ProjectId): Promise<RetrievalResult<Project>>;

  /** Lists projects, optionally filtered by canonical lifecycle state (Active | Completed). */
  listProjects(filter?: { readonly state?: ProjectState }): Promise<RetrievalResult<readonly Project[]>>;

  /** Retrieves all Actions belonging to a specific Project. */
  getActionsForProject(projectId: ProjectId): Promise<RetrievalResult<readonly Action[]>>;

  /** Retrieves accepted context facts for a Project in ascending ordinal order. */
  getAcceptedContextFacts(projectId: ProjectId): Promise<RetrievalResult<readonly NonEmptyText[]>>;

  /** Retrieves current accepted progress facts for a Project (standing = 'current'). */
  getCurrentProgress(projectId: ProjectId): Promise<RetrievalResult<readonly AcceptedProgress[]>>;

  /** Retrieves current Knowledge Items originating from a specific Project (standing = 'current'). */
  getCurrentKnowledgeForProject(projectId: ProjectId): Promise<RetrievalResult<readonly KnowledgeItem[]>>;

  /** Retrieves current Knowledge Items across all projects for cross-project candidate consideration. */
  getCurrentKnowledgeAcrossProjects(options?: {
    readonly excludeOriginatingProjectId?: ProjectId;
  }): Promise<RetrievalResult<readonly KnowledgeItem[]>>;

  /** Retrieves a specific Knowledge Item by its ID (returns item regardless of current/superseded standing). */
  getKnowledgeItem(id: KnowledgeItemId): Promise<RetrievalResult<KnowledgeItem>>;

  /** Retrieves the historical supersession lineage for a Knowledge Item. */
  getKnowledgeLineage(id: KnowledgeItemId): Promise<RetrievalResult<readonly KnowledgeItem[]>>;
}
```

### Prohibited Application Surface
- ❌ NO arbitrary text search methods (`searchKnowledge(query: string)`)
- ❌ NO query-term parameters or SQL `LIKE` wildcard filters
- ❌ NO fuzzy relevance scoring or ranking algorithms
- ❌ NO `createBoundedModelContext` calls or `BoundedModelContext` return types
- ❌ NO `referenceKnowledge()` invocation inside retrieval methods

---

## 7. Failure Envelope & Error Normalization Contract

All retrieval methods return an application-layer discriminated union:

```typescript
export type RetrievalResult<T> =
  | { readonly kind: "found"; readonly value: T }
  | { readonly kind: "not-found"; readonly entityType: "project" | "knowledge-item"; readonly id: string }
  | { readonly kind: "retrieval-failed"; readonly reason: string; readonly retryable: boolean };
```

### Outcome Rules:
1. **Single-Entity Lookup (`getProject`, `getKnowledgeItem`):**
   - Entity exists in D1 -> `{ kind: "found", value: entity }`
   - Entity absent from D1 -> `{ kind: "not-found", entityType: "...", id: "..." }`
2. **Collection Queries (`getActionsForProject`, `getCurrentKnowledgeForProject`, etc.):**
   - Matching items exist -> `{ kind: "found", value: [item1, item2, ...] }`
   - Parent exists but has zero items -> `{ kind: "found", value: [] }`
   - (Note: Empty collection is `{ kind: "found", value: [] }`, NOT `"not-found"`).
3. **Operational / D1 Failures:**
   - Any D1 query failure, connection error, or timeout is caught and mapped to `{ kind: "retrieval-failed", reason, retryable }`.
   - Raw D1 error objects and database stack traces are suppressed.
   - Retryability classification is conservative: transient errors (timeout/connection) -> `retryable: true`; structural errors (schema/syntax/type mismatch) -> `retryable: false`.

---

## 8. Allowed Scope & Exclusive Write Ownership

During active Builder execution, the assigned Builder receives exclusive write ownership only over:

- `src/application/services/retrieval/**` — application retrieval service, query execution, and failure normalization;
- `tests/application/services/retrieval/**` — unit tests with `FakeD1` test doubles; and
- `tests/integration/d1/retrieval/**` — local D1 integration tests against migration `0001`.

All needed test configuration and fixtures must remain inside those task-owned directories. No barrel export in `src/index.ts` is authorized.

---

## 9. Protected Read-Only Dependencies

The Builder consumes the following paths strictly as **read-only**:

- `src/domain/**` — domain types, branded IDs, and pure functions.
- `src/application/contracts/**` — Human Control contracts and operation outcomes.
- `src/application/ports/persistence/**` — `AcceptedStatePersistence` interface (ENG-003 accepted byte baseline).
- `src/infrastructure/d1/**` — `d1AcceptedStatePersistence.ts`, `d1Types.ts`, `index.ts` (ENG-003 accepted byte baseline).
- `migrations/0001_authoritative_state.sql` — authoritative D1 schema (read-only).
- `tests/domain/**`, `tests/application/**`, `tests/infrastructure/d1/**`, `tests/integration/d1/projectActionContext/**`, `tests/integration/d1/knowledgeProvenance/**`.
- Root files: `package.json`, `package-lock.json`, `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`, `wrangler.toml`, `src/index.ts`.

---

## 10. Constraints & Invariants

1. **Direct SQL Only:** Queries must be prepared SQL statements executed directly against `D1DatabaseLike` (`ARC-005`). No ORM, query builder, or external retrieval technology.
2. **Currentness Invariant:** Default Knowledge and Progress queries must return only `standing = 'current'` items (Runtime Architecture Invariant 5, Domain Invariant 12). Superseded items must never be returned as unqualified current state.
3. **Origin Provenance Invariant:** Every Knowledge Item query must faithfully return `originating_project_id` matching the database record. Cross-project candidate queries must preserve the origin project ID unchanged (`MOD-004`).
4. **Cross-Project Candidate Boundary:** Cross-project queries return candidate pools only. Retrieval does NOT decide material relevance, does NOT persist `KnowledgeReference`, and does NOT invoke `referenceKnowledge()`.
5. **No State Mutation on Read:** Retrieval methods must execute only `SELECT` queries. Retrieval never executes `INSERT`, `UPDATE`, `DELETE`, or `BEGIN TRANSACTION` writes, and creates no persistence receipt.
6. **No Context Assembly:** Retrieval returns domain entities/DTOs. Retrieval does NOT assemble `BoundedModelContext`, does NOT supply `selectionReason`, and does NOT enforce the ≤32 item limit (ENG-010 boundary).
7. **DATA-001 Boundary:** All data in D1 has already passed the `ENG-005` capture gate. ENG-006 does NOT introduce a third copy of authentication-material regex scanning.
8. **Immutability of Accepted Bytes:** Zero lines of existing accepted upstream code may be modified.

---

## 11. Explicit Non-Goals

- ❌ Arbitrary text search / keyword search / substring matching
- ❌ SQL `LIKE '%...%'` search
- ❌ Full-Text Search (FTS / FTS5)
- ❌ Vector embeddings or vector database queries
- ❌ Materialized caches, in-memory caches, or KV stores
- ❌ Schema migrations (no `0002_*.sql`)
- ❌ Performance-only secondary database indices
- ❌ `KnowledgeReference` database table or persistence
- ❌ `BoundedModelContext` construction or context truncation (owned by `ENG-010`)
- ❌ Interaction-driven relevance determination (owned by `ENG-010`)
- ❌ Conversational session-loss recovery orchestration (owned by `ENG-010`)
- ❌ Deletion or export operations (owned by `ENG-007`)
- ❌ Model capability adapter implementation (owned by `ENG-009`)
- ❌ Live network calls to external APIs

---

## 12. Deterministic Evidence Matrix

The Builder must deliver deterministic test evidence for the following 20 test cases:

| Case ID | Verification Scenario | Expected Outcome |
|---|---|---|
| `EV-001` | Query existing Project by ID | Returns `{ kind: "found", value: Project }` with exact ID, intendedOutcome, state |
| `EV-002` | Query nonexistent Project by ID | Returns `{ kind: "not-found", entityType: "project", id }` |
| `EV-003` | List projects with state filter (`Active` / `Completed`) | Returns `{ kind: "found", value: Project[] }` matching filter |
| `EV-004` | Query Actions for Project with actions | Returns `{ kind: "found", value: Action[] }` matching `project_id` |
| `EV-005` | Query Actions for existing Project with zero actions | Returns `{ kind: "found", value: [] }` (empty array, not not-found) |
| `EV-006` | Query Context Facts for Project | Returns `{ kind: "found", value: NonEmptyText[] }` in strictly ascending `ordinal` order |
| `EV-007` | Query Current Progress for Project with progress | Returns `{ kind: "found", value: AcceptedProgress[] }` with `standing = 'current'` only |
| `EV-008` | Progress supersession exclusion | Corrected predecessor progress (`standing = 'superseded'`) is excluded from `getCurrentProgress` |
| `EV-009` | Query Current Knowledge for originating Project | Returns `{ kind: "found", value: KnowledgeItem[] }` with `standing = 'current'` and matching origin |
| `EV-010` | Knowledge supersession exclusion | Superseded predecessor Knowledge Items are excluded from `getCurrentKnowledgeForProject` |
| `EV-011` | Knowledge origin preservation | Returned Knowledge Items preserve exact `originatingProjectId` from database |
| `EV-012` | Cross-Project Knowledge candidates | `getCurrentKnowledgeAcrossProjects` returns current items from other projects with origin preserved |
| `EV-013` | Cross-Project candidate exclusion option | `excludeOriginatingProjectId` correctly omits items from the specified project |
| `EV-014` | Query Knowledge Item by ID (current) | Returns `{ kind: "found", value: KnowledgeItem }` with `standing: 'current'` |
| `EV-015` | Query Knowledge Item by ID (superseded) | Returns `{ kind: "found", value: KnowledgeItem }` with `standing: 'superseded'` explicitly set |
| `EV-016` | Query nonexistent Knowledge Item by ID | Returns `{ kind: "not-found", entityType: "knowledge-item", id }` |
| `EV-017` | Knowledge lineage retrieval | `getKnowledgeLineage` returns full chain of items in chronological order |
| `EV-018` | D1 operational failure injection | Simulated D1 error produces `{ kind: "retrieval-failed", reason, retryable }` without unhandled throw |
| `EV-019` | Non-mutation verification | Verification that retrieval execution performs zero writes and creates zero receipts in `persistence_operations` |
| `EV-020` | Forbidden infrastructure scan | Static analysis confirms zero imports of vector, cache, search, or ORM dependencies |

---

## 13. Genuine Local-D1 Evidence Requirements

In addition to `FakeD1` unit tests, the Builder must provide integration tests executed against a fresh, migration-backed local D1 database (`tests/integration/d1/retrieval/**`):

1. **Migration Integrity:** Executes strictly against `migrations/0001_authoritative_state.sql` (SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`).
2. **Multi-Project Seed State:** Real D1 database populated with:
   - 2 Active Projects, 1 Completed Project
   - Multiple Actions under different Projects
   - Multiple ordered facts under Projects
   - Multi-step progress correction chain ($P_1 \to P_2 \to P_3$)
   - Multi-step Knowledge correction chain ($K_1 \to K_2 \to K_3$) across multiple projects
3. **Authoritative Verifications:**
   - Real SQL filtering for `standing = 'current'`
   - Real SQL `ORDER BY ordinal ASC` for facts
   - Real multi-project candidate query execution
   - Real lineage query reconstructing $K_1, K_2, K_3$

---

## 14. Regression & Verification Requirements

- **All Upstream Suites Pass:** All 7 existing Vitest configurations must pass:
  1. `tests/domain/vitest.config.ts`
  2. `tests/application/contracts/vitest.config.ts`
  3. `tests/application/ports/persistence/vitest.config.ts`
  4. `tests/application/ports/model/vitest.config.ts`
  5. `tests/infrastructure/d1/vitest.config.ts`
  6. `tests/integration/d1/projectActionContext/vitest.config.ts`
  7. `tests/integration/d1/knowledgeProvenance/vitest.config.ts`
- **Baseline Observation:** 189 tests passing across repository test configurations. Any test count reduction requires investigation.
- **Repository Verification Commands:**
  - `npx tsc --noEmit` -> PASS (zero type errors)
  - `npx eslint .` -> PASS (zero lint errors)
  - `npm run build` -> PASS (Worker build succeeds)
  - `git diff --check` -> PASS (zero whitespace issues)
- **Hash Integrity:** Hash scan proves zero modified bytes across all accepted upstream files.

---

## 15. Upstream Immutability & Stop Rules

If during implementation the Builder discovers:
- an apparent defect in `d1AcceptedStatePersistence.ts`, `model.ts`, or `0001_authoritative_state.sql`;
- an inability to execute required queries on the current schema; or
- a desire to add a new column, index, or migration;

The Builder must **STOP IMMEDIATELY**, perform no workaround, make no edits to upstream files, and record an explicit finding:
- `UPSTREAM_CAPABILITY_GAP`
- `UPSTREAM_WORK_PRODUCT_DEFECT`
- `AUTHORITY_CONTRACT_GAP`
- `ARCHITECTURE_GAP`

---

## 16. Verifier Contract

The Deterministic Verifier is an independent, read-only responsibility. The Verifier must:
1. Verify against the exact candidate commit SHA and tree SHA.
2. Verify that the candidate diff touches ONLY the three authorized write paths.
3. Compute per-file SHA-256 hashes and verify upstream accepted files remain byte-identical.
4. Execute `npm ci`, typecheck, lint, build, all unit suites, all upstream regression suites, and local D1 integration suites.
5. Confirm that `migrations/0001_authoritative_state.sql` hash is identical to `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.
6. Return `VERIFICATION: PASS` or `VERIFICATION: FAIL` with specific finding IDs. The Verifier never repairs code.

---

## 17. Semantic Review Contract

The Independent Reviewer evaluates the candidate against:
1. **Currentness Semantics:** Are superseded items strictly excluded from default queries?
2. **Provenance Preservation:** Is `originatingProjectId` immutably returned on all Knowledge queries?
3. **Candidate Boundary:** Does cross-project retrieval avoid claiming material relevance or creating `KnowledgeReference` persistence?
4. **Scope Discipline:** Is there zero evidence of arbitrary text search, LIKE clauses, FTS, vectors, or embeddings?
5. **ENG-010 Boundary:** Is `BoundedModelContext` completely absent from the retrieval service?
6. **DATA-001 Boundary:** Is authentication-material regex scanning absent from retrieval?
7. **Failure Safety:** Are all D1 errors normalized without leaking raw database exceptions?
8. **Non-Mutation:** Do all retrieval methods execute exclusively read queries with zero state side-effects?

Reviewer returns `REVIEW: GREEN` or `REVIEW: NEEDS FIX` with finding IDs.

---

## 18. Definition of Done

The task is `DONE` only when all of the following conditions are satisfied:

1. `RetrievalService` is implemented in `src/application/services/retrieval/` exposing all 9 specified granular query methods.
2. All methods execute prepared direct-SQL queries against `D1DatabaseLike` without ORM or external search infrastructure.
3. Default Progress and Knowledge queries filter by `standing = 'current'` and strictly exclude superseded records.
4. Knowledge origin provenance (`originatingProjectId`) is preserved across all single-project and cross-project queries.
5. Cross-project candidate retrieval is implemented without persisting `KnowledgeReference` or invoking `referenceKnowledge()`.
6. Missing entities produce distinguished `{ kind: "not-found" }` outcomes; empty collections produce `{ kind: "found", value: [] }`.
7. D1 errors are caught and normalized into application-level `{ kind: "retrieval-failed", reason, retryable }` results.
8. Deterministic unit tests (`FakeD1`) cover all 20 evidence cases.
9. Genuine local D1 integration tests verify all query paths against `0001_authoritative_state.sql`.
10. All upstream regression suites pass (baseline 189 tests), typecheck passes, lint passes, build succeeds, and zero accepted upstream files are modified.
11. Verifier returns `VERIFICATION: PASS` and Independent Reviewer returns `REVIEW: GREEN` on the immutable candidate manifest.

---

## 19. Definition of Ready Evaluation Reference

| Dimension | Evaluation | Evidence & Rationale |
|---|---|---|
| **Objective** | `SUPPORTED` | Defined minimally around direct-SQL retrieval with standing filtering and origin preservation. |
| **Dependencies** | `SUPPORTED` | `ENG-001` through `ENG-005` are all `DONE` with durable closure records. |
| **Product Authority** | `SUPPORTED` | Aligned with `PI-CAP-001`, `PI-CAP-005`, `PI-OUT-001`, `PI-OUT-004`, `SCN-003`, `SCN-005`, `SCN-009`. |
| **Domain Authority** | `SUPPORTED` | Conforms to `DOMAIN_MODEL.md` (MOD-001 through MOD-004, Invariants 7, 11, 12). |
| **Runtime Architecture** | `SUPPORTED` | Conforms to `RUNTIME_ARCHITECTURE.md` (`ARC-001`, `ARC-005`, `ARC-006`, direct-SQL retrieval). |
| **Write Lock** | `SUPPORTED` | Disjoint paths allocated under `src/application/services/retrieval/**` (P0-001 resolved). |
| **Return Contract** | `SUPPORTED` | Granular query methods returning existing domain types with discriminated failure envelopes (P0-002 resolved). |
| **Persistence / Schema** | `SUPPORTED` | Migration 0001 is read-only; no new migration required (P0-004 resolved). |
| **Currentness Semantics** | `SUPPORTED` | `standing = 'current'` default; superseded excluded from unqualified current. |
| **Cross-Project Semantics** | `SUPPORTED` | Candidates retrieved with origin preserved; KnowledgeReference computed at runtime (P0-003 resolved). |
| **Historical Retrieval** | `SUPPORTED` | Reconstructible from `supersession_chain` inline JSON array. |
| **Failure Contract** | `SUPPORTED` | Normalized application-level failure envelopes; raw D1 errors suppressed. |
| **DATA-001 Boundary** | `SUPPORTED` | Primary capture guard (ENG-005) and egress guard (ENG-008) sufficient; no regex duplication. |
| **ENG-010 Boundary** | `SUPPORTED` | BoundedModelContext, relevance scoring, and truncation strictly excluded from ENG-006. |
| **Verification Contract** | `SUPPORTED` | 20-case deterministic evidence matrix + genuine local D1 integration suite. |
| **Semantic Review Contract** | `SUPPORTED` | Independent reviewer criteria defined across 8 dimensions. |
| **Human Reserved Boundary** | `SUPPORTED` | All 8 triggers checked; NOT REQUIRED. |

### Remaining P1/P2 Design Items (Non-Blocking for Ready Assessment)

- **`REG-006-07` (P1):** Retrieval-time defense-in-depth auth-material scanning remains an optional future enhancement.
- **`REG-006-08` (P1):** Detailed lineage ordering helper design is an implementation detail for the Builder.
- **`REG-006-P2-01` (P2):** Exact retryable classification for rare D1 network errors can be refined during local integration testing.

---

## 20. Planning Status

```text
TASK PACKET STATUS: READY — NOT DISPATCHED
TASK-LEVEL DoR: PASS (docs/development/analysis/ENG-006_FORMAL_DoR_2026-08-15.md)
BUILDER AUTHORIZATION: ONE BOUNDED BUILDER AUTHORIZED FOR DISPATCH
CURRENT BUILDER: NONE (NOT YET DISPATCHED)
IMPLEMENTATION STATUS: NOT STARTED
```

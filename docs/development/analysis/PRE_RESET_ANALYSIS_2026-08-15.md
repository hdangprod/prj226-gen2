# PRJ226 Generation 2 Pre-Reset Engineering Analysis

**Artifact class:** OPERATIONAL / ANALYSIS
**Authority:** NON-CANONICAL
**Lifecycle:** COMPLETE
**Builder authorization:** NONE
**Date:** 2026-08-15
**Origin:** Pre-reset analysis campaign across agent sessions

---

> [!WARNING]
> **CRITICAL GOVERNANCE WARNING: NON-CANONICAL PLANNING HYPOTHESIS**
>
> This document is an **operational analysis and planning preparation artifact**. It is **NON-CANONICAL** and possesses **NO AUTHORITY** to modify Product Foundation, Domain Model, or Runtime Architecture baselines.
>
> All proposed design options, query structures, adapter details, interface sketches, and task scopes for `ENG-006` and `ENG-009` are **planning hypotheses subject to Controller adjudication and strong-model review**.
>
> **NO BUILDER EXECUTION IS AUTHORIZED BY THIS DOCUMENT.**
> Neither `ENG-006` nor `ENG-009` is `READY`.

---

## 1. Executive Summary & Purpose

This document persists the comprehensive pre-reset engineering analysis conducted before the Antigravity weekly usage reset. Its purpose is to capture high-value architectural analysis, canonical fact extraction, boundary disambiguation, and planning hypotheses so that future agent context windows can reconstruct the exact technical state of PRJ226 Generation 2 without relying on ephemeral chat transcripts.

### Current Canonical Engineering State

| Task ID | Task Description | Lifecycle Status | Aggregate / Manifest Reference |
|---|---|---|---|
| `ENG-001` | Runtime / Tooling Foundation | `DONE` | [ENG-001 Delivery Record](../delivery/ENG-001-runtime-foundation.md) |
| `ENG-002` | Domain & Application Kernel | `DONE` | `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f` |
| `ENG-003` | D1 Authority Foundation (Revision 2) | `DONE` | `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685` |
| `ENG-004` | Project/Action/Context Slice | `DONE` | `6be8bc2b4d58cd1a0e9be7ea6a3762dafee0aa5a26796bb8e97214e48c1725c2` |
| `ENG-005` | Knowledge / Provenance Slice | `DONE` | `333f27f33f5725751a3cb48bbd0009253faab26282e218883b6393c3d3ae90f0` |
| `ENG-008` | Model Capability Port & Deterministic Double | `DONE` | `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696` |
| `ENG-006` | Direct-SQL Retrieval & Resumption | `PROPOSED` | No Task Packet; dependencies satisfied |
| `ENG-009` | Workers AI Adapter (`@cf/zai-org/glm-4.7-flash`) | `PROPOSED` | No Task Packet; dependencies satisfied |
| `ENG-010` | Text Interaction & Human-Control Orchestration | `PLANNED` | Blocked on upstream predecessors |
| `ENG-011` | Observability & Failure/Recovery Hardening | `PLANNED` | Blocked |
| `ENG-012` | Deterministic Integrated Semantic Acceptance | `PLANNED` | Blocked |
| `ENG-013` | Live Model-Candidate Qualification | `PLANNED` | Blocked |

**ENG-005 Controller Closure Commit:** `c042d3a3c69a695469d9c1a8e0cb2f7e3f98aba0`
**Current Test Suite Baseline:** 189 tests passing across 7 Vitest suites (`tests/domain/**`, `tests/application/**`, `tests/infrastructure/d1/**`, `tests/integration/d1/**`).

---

## 2. PART A — ENG-006 Authority & Capability Audit

### 2.1 Canonical Objective & Dependencies

Per [Engineering Plan](../ENGINEERING_PLAN.md) L115:
- **Objective:** "Deliver simplest-sufficient direct-SQL retrieval and accepted-context resumption with provenance, currentness, bounded cross-Project reuse, and uncertainty."
- **Dependencies:** `ENG-003 DONE`, `ENG-004 DONE`, `ENG-005 DONE`. (All 3 are currently `DONE`).

### 2.2 Capability Classification Matrix

| # | Proposed Capability | Canonical Classification | Justification & Governing Authority |
|---|---|---|---|
| 1 | Project resumption context retrieval | `CANONICAL_REQUIRED` | `PF-CAP-001`, `PF-CTX-001`, `ARC-005`, Eng Plan L63 ("Continuity and accepted memory"). |
| 2 | Active project list query | `CANONICAL_ALLOWED` | Required for `SCN-006` project switching / disambiguation, query naturally belongs to retrieval. |
| 3 | Action retrieval for a project | `CANONICAL_REQUIRED` | Actions are core components of accepted project context (`DOMAIN_MODEL.md` L45, `SCN-001`, `SCN-002`). |
| 4 | Current Knowledge retrieval | `CANONICAL_REQUIRED` | `PI-CAP-005`, `PI-OUT-004`, `PF-KNW-001`, Eng Plan L64. |
| 5 | Superseded Knowledge exclusion | `CANONICAL_REQUIRED` | Runtime Architecture Invariant 5; Domain Invariant 12. Must not return superseded items as unqualified current. |
| 6 | Historical Knowledge lineage retrieval | `DESIGN_OPTION` | Lineage is reconstructible (`DOMAIN_MODEL.md` L110). Querying prior items with qualification is allowed. |
| 7 | Cross-Project Knowledge retrieval | `CANONICAL_REQUIRED` | `MOD-004`, `SCN-009`, Eng Plan L64 ("qualified cross-Project reuse"). |
| 8 | Arbitrary text search / keyword matching | `NOT_AUTHORIZED` | No canonical source specifies arbitrary text search for v1 retrieval. See Section 5. |
| 9 | SQL `LIKE` wildcard search | `NOT_AUTHORIZED` | Speculative implementation mechanism for an unauthorized capability. |
| 10 | Accepted-context reconstruction | `CANONICAL_REQUIRED` | Core v1 usefulness outcome (`PI-OUT-001`, `INV-008`). |
| 11 | `BoundedModelContext` assembly | `BELONGS_TO_OTHER_TASK` | Belongs to `ENG-010` orchestration; consumes `ENG-008` port types. See Section 4. |
| 12 | Model-context selection / truncation | `BELONGS_TO_OTHER_TASK` | Belongs to `ENG-010`. Context selection is interaction-driven, not storage-driven. |
| 13 | DATA-001 filtering at retrieval | `DESIGN_OPTION` | Defense-in-depth only. Primary enforcement is `ENG-005` (capture) and `ENG-008` (context). |
| 14 | Missing entity outcome discrimination | `CANONICAL_REQUIRED` | Failed/missing lookups must be explicit and safe (`PI-QLT-003`, Eng Plan L62). |
| 15 | D1 failure normalization | `CANONICAL_REQUIRED` | `QLT-001` requires explicit, recoverable failures without false success. |
| 16 | Currentness authority | `CANONICAL_REQUIRED` | Database `standing` column ('current' vs 'superseded') is authoritative. |
| 17 | Caller-snapshot avoidance | `CANONICAL_REQUIRED` | Regressions from `ENG-004-F003` establish that caller-supplied snapshots cannot be trusted. |
| 18 | Session-loss recovery orchestration | `BELONGS_TO_OTHER_TASK` | Retrieval provides the query data; `ENG-010` orchestrates the resumption interaction. |

---

## 3. PART B — Architecture Boundary & SQL Ownership (Where Should SQL Live?)

### 3.1 Evaluation of Architectural Forms

The highest-priority planning decision for `ENG-006` is the structural placement of SQL queries:

#### Form A: Application Service Directly Accepts `D1DatabaseLike` and Executes SQL
- **Classification:** `COMPATIBLE BUT OPTIONAL` (Engineering Design Default)
- **Description:** A retrieval service located in `src/application/services/retrieval/` accepts `D1DatabaseLike` (defined in `src/infrastructure/d1/d1Types.ts`) and executes prepared statements directly.
- **Precedent:** Follows the exact pattern of `D1AcceptedStatePersistence` and existing slice services.
- **Pros:** Simplest possible architecture; zero extraneous layers; minimum boilerplate; directly satisfies "simplest sufficient direct SQL querying" (`ARC-005`).
- **Cons:** Direct coupling of application service to D1 database binding interface (though `D1DatabaseLike` is an in-repo interface, not an external Cloudflare import).

#### Form B: Application Service Depends on Provider-Neutral Read Port; D1 Adapter Owns SQL
- **Classification:** `COMPATIBLE BUT OPTIONAL` (Classic Hexagonal Pattern)
- **Description:** A new port `src/application/ports/retrieval/retrievalPort.ts` defines query methods returning domain DTOs. A D1 adapter in `src/infrastructure/d1/d1RetrievalAdapter.ts` implements this port.
- **Precedent:** Parallels `AcceptedStatePersistence` (write port) and `ModelCapabilityPort` (model port).
- **Pros:** Complete provider neutrality; pure separation of concerns.
- **Cons:** Introduces a secondary port not explicitly required by canonical baselines; potential over-abstraction for a single-deployable Workers application.

#### Form C: D1 Infrastructure Query Module with Application Wrapper
- **Classification:** `COMPATIBLE BUT OPTIONAL`
- **Description:** SQL queries reside entirely in `src/infrastructure/d1/retrievalQueries.ts`. An application service coordinates and wraps them into domain semantics.

### 3.2 Architectural Adjudication
- **Finding:** Canonical architecture (`RUNTIME_ARCHITECTURE.md` L118) states: `"Retrieval | Application-managed direct SQL queries; no separate retrieval technology for v1."`
- **Ruling:** The exact placement between Form A, Form B, and Form C is an **Engineering-owned design choice** (per [Engineering Plan](../ENGINEERING_PLAN.md) L250). It does NOT constitute an architecture boundary breach or require a Human Reserved Decision, provided:
  1. No ORM, vector database, external search engine, or cache is introduced (`ARC-005`, `ARC-006`).
  2. Cloudflare-specific vendor SDK types do not leak into `src/domain/**`.

### 3.3 Smallest Plausible Exclusive Write Lock for ENG-006
To prevent write conflicts with the closed `ENG-003` revision 2 lock (`src/application/ports/persistence/**`, `src/infrastructure/d1/**`), `ENG-006` should claim a dedicated sub-path:
- Source lock: `src/application/services/retrieval/**` AND/OR `src/infrastructure/d1/retrieval/**`
- Test lock: `tests/application/services/retrieval/**` AND `tests/integration/d1/retrieval/**`
- Read-only upstream: `src/domain/**`, `src/application/contracts/**`, `src/application/ports/persistence/**`, `migrations/**`.

---

## 4. PART C & D — Resumption, Orchestration & DATA-001 Boundaries

### 4.1 Resumption Boundary Separation (ENG-006 vs ENG-010 vs ENG-008)

A critical error in early planning was assuming that `ENG-006` should take retrieved state and assemble it directly into a `BoundedModelContext`. This conflates three distinct lifecycle stages:

```text
+-----------------------------------------------------------------------------------+
| 1. DATA RETRIEVAL (ENG-006)                                                       |
|    Authoritative D1 SQL -> Domain-level Context / Query DTOs                      |
|    - Project record, Action list, Context Facts, Current Progress, Knowledge Items|
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 2. INTERACTION ORCHESTRATION & CONTEXT SELECTION (ENG-010)                        |
|    - Evaluates user interaction intent & constraints                              |
|    - Selects minimal necessary items (relevance, recency, cross-project needs)   |
|    - Supplies selectionReason                                                     |
|    - Calls createBoundedModelContext() from ENG-008                               |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 3. MODEL INVOCATION (ENG-008 / ENG-009)                                           |
|    - Receives ModelCapabilityRequest with validated BoundedModelContext           |
|    - Executes model capability via Provider Adapter                               |
+-----------------------------------------------------------------------------------+
```

- **ENG-006 Return Type:** Must produce domain entities or structured retrieval DTOs (e.g. `ProjectRetrievalContext { project, actions, facts, progress, knowledge }`), NOT `BoundedModelContext`.
- **Reasoning:** `createBoundedModelContext` requires a runtime `selectionReason: NonEmptyText` and enforces a hard limit of ≤32 items. Selection of items and determination of why they are relevant to the *current user prompt* is an interaction concern owned by `ENG-010`.

### 4.2 DATA-001 Authentication Material Guard Ownership

- **Capture Guard (Primary Boundary):** Owned by `ENG-005` in `knowledgeProvenanceService.ts` (L52-64). Blocks insertion of credentials, private keys, bearer tokens, and passwords into D1.
- **Model Context Guard (Egress Boundary):** Owned by `ENG-008` in `modelCapability.ts` (L41-45). Validates that no authentication material enters `BoundedModelContext` or `ModelCapabilityRequest`.
- **Retrieval Layer (ENG-006):** Since all data in D1 has already passed the `ENG-005` capture gate, re-filtering at retrieval is **optional defense-in-depth** (`DESIGN_OPTION`). It is NOT a required primary enforcement point.
- **Pattern Divergence Note:** `ENG-005` uses 7 regex patterns; `ENG-008` uses 3 regex patterns. Duplicating regexes a third time in `ENG-006` creates maintenance drift. Any unification belongs in shared contracts, not ad-hoc copies.

---

## 5. PART E — Text Search & Query Analysis

### 5.1 Challenge to `LIKE '%...%'` Search Proposals
Early Flash analysis proposed implementing `LIKE '%' || ? || '%'` text search across knowledge content.

**Adjudication: REJECTED FROM MINIMUM SCOPE.**

1. **Canonical Grounding:**
   - `PI-CAP-005`: "Retrieve relevant captured knowledge during later project work."
   - `PI-OUT-004`: "Retrieve that knowledge later when it becomes relevant."
   - `SCN-005`: IELTS knowledge retrieval — retrieved based on project context and explicit recall.
   - `SCN-009`: Cross-project reuse — retrieved based on material relevance to assisting project.
   - None of these specify arbitrary substring text search or unstructured keyword querying.
2. **Architecture Baseline (`ARC-005`):**
   - Authorizes "simplest sufficient direct SQL querying."
   - For v1, relevance is primarily structural:
     - Knowledge belonging to the active/selected project (`originating_project_id = ? AND standing = 'current'`).
     - Knowledge referenced for cross-project assistance.
3. **Decision for Task Packet:**
   - Arbitrary text search is **NOT CANONICALLY REQUIRED** for `ENG-006`.
   - Minimum `ENG-006` scope must focus on **deterministic structural retrieval** (by project ID, action ID, standing, and cross-project origin).
   - If interaction design in `ENG-010` subsequently requires keyword filtering, that can be evaluated as a concrete requirement rather than a premature guess.

---

## 6. PART F — ENG-009 Authority & Boundary Audit

### 6.1 Canonical Objective & Dependencies

Per [Engineering Plan](../ENGINEERING_PLAN.md) L118:
- **Objective:** "Implement the adapter-local Workers AI integration for configured `@cf/zai-org/glm-4.7-flash`, without live qualification."
- **Dependencies:** `ENG-001 DONE`, `ENG-008 DONE`. (Both are currently `DONE`).

### 6.2 Capability & Constraint Audit

| # | Concern | Canonical Status | Rules & Constraints |
|---|---|---|---|
| 1 | Workers AI Adapter implementation | `CANONICAL_REQUIRED` | Must implement `ModelCapabilityPort` (`modelCapability.ts` L395-397). |
| 2 | Initial Model Candidate | `CANONICAL_REQUIRED` | `@cf/zai-org/glm-4.7-flash` is the approved candidate (`ARC-006`). Must be configurable. |
| 3 | Prompt & Message Construction | `PROVIDER_IMPLEMENTATION_DETAIL` | Adapter-local translation of `ModelCapabilityRequest` into Workers AI input schema. |
| 4 | Tool Calling vs JSON Schema | `DESIGN_OPTION` | Adapter may use Workers AI function calling or structured prompt extraction. |
| 5 | Output Parsing | `CANONICAL_REQUIRED` | Adapter must map provider output to `ModelCapabilityResult` discriminated union. |
| 6 | Markdown Parsing | `NOT_AUTHORIZED` | Contract requires `NonEmptyText` fields, not parsed markdown trees. |
| 7 | Error & Failure Normalization | `CANONICAL_REQUIRED` | Must normalize all provider failures to `ModelFailureCategory`: `unavailable`, `timeout`, `rate-limited`, `refused`, `malformed-result`, `invalid-request`, `unknown`. |
| 8 | Retryability Flag Mapping | `CANONICAL_REQUIRED` | Timeouts, 429s, 5xx -> `retryable: true`. Refusals, malformed requests -> `retryable: false`. |
| 9 | Live Network Calls | `ENG-013_CONCERN` | **PROHIBITED in ENG-009.** All ENG-009 tests must use mocked Workers AI bindings (`env.AI`). |
| 10 | Provider SDK & Type Locality | `CANONICAL_REQUIRED` | Workers AI types must stay inside `src/infrastructure/workersAi/**`. Zero provider imports in `src/domain/**` or `src/application/**`. |
| 11 | Model Sufficiency Claims | `ENG-013_CONCERN` | ENG-009 makes no claims about model quality or suitability for Liam. Live qualification is `ENG-013`. |

---

## 7. PART G — Architecture Pressure Points & Risk Assessment

| # | Pressure Point | Classification | Strong-Model Risk Adjudication |
|---|---|---|---|
| 1 | D1 `SQLITE_BUSY` Concurrency | `SPECULATIVE` | Overstated for v1 single-user architecture. D1 handles concurrency internally; single-user write serialization prevents busy contention. |
| 2 | LIKE Search Indexing & Performance | `WRONG` | LIKE search is excluded from minimum scope. Moot. |
| 3 | Future FTS5 Migration | `SPECULATIVE` | Premature infrastructure speculation. Explicitly excluded from v1 baseline (`ARC-005`). |
| 4 | Knowledge Supersession Chain Depth | `OVERSTATED` | `supersession_chain` is stored as a JSON array directly in `knowledge_items` table. Retrieval is O(1) by primary key, not recursive CTE traversal. |
| 5 | Context Limit Pressure (≤32 items) | `SUPPORTED` | Valid operational constraint. Enforced by `BoundedModelContext`. Managed by `ENG-010` selection policy. |
| 6 | Foreign Key Delete Cascades | `NEEDS LATER TASK` | Deletion is exclusively an `ENG-007` concern. |
| 7 | Workers AI Rate Limits / Quotas | `SUPPORTED` | Real operational constraint. Handled via `rate-limited` failure normalization in `ENG-009`. |
| 8 | Superseded Knowledge Leaking into Context | `SUPPORTED` | Critical product risk (`INV-012`). Mitigated by `WHERE standing = 'current'` queries in `ENG-006`. |

---

## 8. PART H — Semantic Fixture Catalog Analysis

| Fixture Description | Semantic Classification | Risk & Handling Rules |
|---|---|---|
| Active Project with 2 Actions and 3 Facts | `SAFE_REUSABLE` | Standard base state for resumption and retrieval tests. |
| Completed Project with Open Actions | `SEMANTICALLY_RISKY` | Valid under Domain Invariant 7 (Project completion does not cascade to Actions), but assertions must NOT assume completion cascades. |
| Linear Knowledge Supersession Chain ($K_1 \to K_2 \to K_3$) | `SAFE_REUSABLE` | Standard fixture for currentness filtering and lineage queries. |
| Cross-Project Knowledge Reference | `TASK_SPECIFIC` | In-memory domain fixture. (Note: no `knowledge_references` table currently exists in D1 schema). |
| "Deleted" Knowledge Item (`standing = 'deleted'`) | `INVALID` | **PROHIBITED.** `Deleted` is NOT a domain lifecycle state (`DOMAIN_MODEL.md` L122). Schema only allows `'current'` and `'superseded'`. Deletion physically removes rows in `ENG-007`. |
| Credential / Authentication Material Snippets | `SAFE_REUSABLE` | Essential for testing negative paths and defense-in-depth guards. |

---

## 9. PART I — Delivery Contract & Agent Workflow Integrity Principles

Review of agent execution practices against [Delivery Contract](../../development/DELIVERY_CONTRACT.md):

1. **Independent Verification Precedence:** Builder self-report is never verification evidence (Principle 3, DoD #10). Reviewer must independently execute test suites against the immutable candidate commit.
2. **Full Repository Regression Requirement:** Every task verification MUST run all existing Vitest suites across the repository (currently 7 suites, 189 tests) to guarantee zero regression on upstream accepted components.
3. **Exact Candidate Identity:** Candidate manifests must record exact Git commit SHAs, tree SHAs, and file-level SHA-256 hashes (as demonstrated in `ENG-003`, `ENG-004`, `ENG-005`, and `ENG-008` Delivery Records).
4. **Human Reserved Stop Triggers:** Agents must immediately halt and produce a Decision Packet if any Human Reserved trigger is reached (e.g. changing domain lifecycles, adding external infrastructure, modifying security boundaries).

---

## 10. PART J — Minimal Canonical-Safe ENG-006 Draft Scope

- **Objective:** Implement direct-SQL retrieval service for Project state, Actions, Accepted Progress, Context Facts, and Knowledge Items with currentness filtering and origin preservation.
- **In Scope:**
  - Query: Get Project by ID
  - Query: List Active Projects
  - Query: Get Actions for Project (all / by state)
  - Query: Get Accepted Context Facts for Project (ordered by ordinal)
  - Query: Get Accepted Progress for Project (current only / with lineage)
  - Query: Get Knowledge Items for Project (`standing = 'current'`)
  - Query: Get Knowledge Items across Projects for cross-project reuse
  - Query: Get specific Knowledge Item lineage (prior superseded items)
  - Distinguishable missing entity outcomes (`ProjectNotFound`, etc.)
  - D1 error normalization to application-level failure types
  - Comprehensive unit and local D1 integration tests
- **Out of Scope:**
  - `BoundedModelContext` creation (owned by `ENG-010`)
  - Interaction-driven context truncation/selection (owned by `ENG-010`)
  - Arbitrary text search / `LIKE` search / FTS
  - Export / Deletion operations (owned by `ENG-007`)
  - Live model calls (owned by `ENG-013`)
- **Proposed Write Locks:**
  - `src/application/services/retrieval/**`
  - `src/infrastructure/d1/retrieval/**` (if Form B/C chosen)
  - `tests/application/services/retrieval/**`
  - `tests/integration/d1/retrieval/**`

---

## 11. PART K — Minimal Canonical-Safe ENG-009 Draft Scope

- **Objective:** Implement adapter-local Workers AI integration for `@cf/zai-org/glm-4.7-flash` conforming to `ModelCapabilityPort`, verified via mocked bindings.
- **In Scope:**
  - `WorkersAIModelAdapter` implementing `ModelCapabilityPort`
  - Adapter-local request translation (system prompt, context items, interaction, constraints)
  - Adapter-local response parsing (`advisory`, `proposal`, `uncertain`, `unable`, `failure`)
  - `ProposedOperation` extraction for `propose-operations` capability
  - Error normalization across all 7 `ModelFailureCategory` enum values
  - Retryability determination
  - Mocked binding contract tests covering all result and failure branches
  - Verification that Worker build succeeds with adapter included
  - Zero leakage of Workers AI types outside adapter boundary
- **Out of Scope:**
  - Real network calls to Cloudflare Workers AI (owned by `ENG-013`)
  - Live model qualification or accuracy benchmarks (owned by `ENG-013`)
  - Multi-turn conversation storage / history (prohibited by `ARC-003`)
  - Markdown syntax tree parsing
- **Proposed Write Locks:**
  - `src/infrastructure/workersAi/**`
  - `tests/infrastructure/workersAi/**`

---

## 12. Conclusion & Planning Disposition

```text
======================================================================
ENG-006 PLANNING STATUS: READY FOR CONTROLLER PLANNING
ENG-009 PLANNING STATUS: READY FOR CONTROLLER PLANNING
BUILDER EXECUTION: NOT AUTHORIZED
======================================================================
```

Both `ENG-006` and `ENG-009` have reached complete pre-reset analytical clarity. All speculative expansions (LIKE search, BoundedModelContext overreach, premature deletion handling) have been pruned.

Prior to task dispatch, the Controller must formally resolve the open P0 items in [STRONG_MODEL_REVIEW_REGISTER.md](STRONG_MODEL_REVIEW_REGISTER.md) and issue formal Task Packets.

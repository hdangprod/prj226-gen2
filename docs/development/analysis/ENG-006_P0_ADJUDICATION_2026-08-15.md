# ENG-006 P0 Controller Adjudication

**Artifact class:** OPERATIONAL / CONTROLLER PLANNING
**Authority:** PLANNING INPUT ONLY
**Lifecycle:** COMPLETE
**Builder authorization:** NONE
**ENG-006 READY:** NO
**Date:** 2026-08-15

---

> [!WARNING]
> **GOVERNANCE NOTICE: CONTROLLER PLANNING INPUT ONLY**
>
> This document records the formal Controller design adjudication for the four P0 questions blocking ENG-006 Definition of Ready.
>
> **BUILDER AUTHORIZATION: NONE.**
> **ENG-006 IS NOT READY.**
> This document authorizes Task Packet drafting only. It does NOT authorize Builder dispatch or code implementation.

---

## Executive Summary of Adjudication Results

| Item ID | Topic | Decision | Authority Classification |
|---|---|---|---|
| **P0-001** | Write Ownership | **RESOLVED — NEW DISJOINT PATH ALLOCATION PERMITTED** | Engineering Design Decision |
| **P0-002** | Retrieval Return Contract | **RESOLVED — GRANULAR DOMAIN-TYPE QUERY METHODS WITH FAILURE ENVELOPE** | Engineering Design Decision |
| **P0-003** | KnowledgeReference Persistence | **RESOLVED — COMPUTED (NOT PERSISTED)** | Canonical Requirement + Engineering Design |
| **P0-004** | Migration Necessity | **RESOLVED — NO MIGRATION REQUIRED** | Engineering Design Decision |
| — | Human Reserved Boundary | **NOT REQUIRED** | Governance Invariant |
| — | Task Packet Drafting | **UNBLOCKED** | Planning Status |

---

## P0-001: RESOLVED — NEW DISJOINT PATH ALLOCATION PERMITTED

### Classification
**ENGINEERING DESIGN DECISION.** Path allocation for new task-specific files is explicitly Engineering-owned per [ENGINEERING_PLAN.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L250.

### Adjudication & Rationale
1. **Temporal Exclusivity:** Delivery Contract L172 establishes that Builder write exclusivity applies to the *active Builder during task execution*. With task completion (`ENG-003 rev 2 DONE`), the active write lock is closed. Task status alone does not permanently reserve a filesystem namespace.
2. **Upstream Immutability:** What remains permanently protected is the exact byte content of accepted upstream candidates (the 9 files listed in the ENG-003 Delivery Record with exact SHA-256 hashes).
3. **Disjoint Subpath Precedent:** Downstream tasks (ENG-004 and ENG-005) previously introduced new subdirectories under shared parent roots (`src/application/services/`, `tests/integration/d1/`) without reopening upstream tasks.
4. **Zero Upstream Modification:** Allocating `src/application/services/retrieval/**`, `tests/application/services/retrieval/**`, and `tests/integration/d1/retrieval/**` introduces only new files and leaves all 9 accepted ENG-003 files 100% byte-identical.
5. **No Reopen Required:** A formal upstream reopen of ENG-003 is NOT required.

---

## P0-002: RESOLVED — GRANULAR DOMAIN-TYPE QUERY METHODS WITH FAILURE ENVELOPE

### Classification
**ENGINEERING DESIGN DECISION.** [Engineering Plan](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L250.

### Adjudication & Rationale
1. **Method Granularity:** ENG-006 exposes individual granular query methods returning existing domain types from `src/domain/model.ts`. `AcceptedProjectContext` alone is structurally insufficient for full resumption because it lacks the `Project` entity (state, intended outcome), `Action[]`, and `KnowledgeItem[]`.
2. **Layer Ownership:** The retrieval service and result wrappers reside in `src/application/services/retrieval/**`. Domain types are consumed read-only; no new domain type is created.
3. **Failure Envelope:** Queries return an application-layer discriminated union (`found | not-found | retrieval-failed`) distinguishing missing entities from D1 operational failures and from existing entities with empty collections.
4. **D1 Error Normalization:** All D1 exceptions are caught and normalized into application-level failure structures with a `retryable: boolean` flag. No raw D1 error objects leak to orchestration.
5. **Composite Resumption DTO:** An application-level composite structure is an optional Engineering convenience, not a domain semantic requirement.

---

## P0-003: RESOLVED — COMPUTED (NOT PERSISTED)

### Classification
**CANONICAL REQUIREMENT (origin preservation) + ENGINEERING DESIGN DECISION (computation mechanism).**

### Adjudication & Rationale
1. **No Storage Requirement:** Domain Model L48/L52 states cardinalities are product semantics only and do not imply tables or storage. Runtime Architecture Invariant 3 (L33) classifies retrieval and derived views as non-authoritative.
2. **Existing In-Memory Function:** The domain function `referenceKnowledge()` in `src/domain/knowledge.ts` is already an accepted pure, in-memory validation function (ENG-002 accepted).
3. **Separation of Responsibilities:**
   - **ENG-006:** Retrieves current `KnowledgeItem` candidates across projects while preserving `originatingProjectId`.
   - **ENG-010:** Determines interaction-specific material relevance and calls `referenceKnowledge()` to construct qualified `KnowledgeReference` values in memory.
4. **MOD-004 Preserved:** Origin is immutable on `knowledge_items.originating_project_id`; runtime computation preserves all MOD-004 requirements without creating a `knowledge_references` table.

---

## P0-004: RESOLVED — NO MIGRATION REQUIRED

### Classification
**ENGINEERING DESIGN DECISION.**

### Adjudication & Rationale
1. **Feasibility Audit:** All 10 query requirements (project by ID, projects by state, actions by project, ordered context facts, current progress, current knowledge by origin, cross-project knowledge candidates, superseded qualification, origin preservation, lineage reconstruction) are 100% implementable on the existing `0001_authoritative_state.sql` schema.
2. **No Performance-Only Migrations:** Secondary indices on `actions(project_id)` or `knowledge_items(originating_project_id, standing)` are performance optimizations only and are not functionally required for single-user v1 correctness.
3. **Ruling:** `0001_authoritative_state.sql` remains byte-identical and read-only. No migration `0002` is authorized for ENG-006.

---

## Human Reserved Boundary Check

| Potential Trigger | Applies? | Reasoning |
|---|---|---|
| Product semantic change | NO | No new product concept or behavior introduced |
| Domain semantic change | NO | All return types use existing domain types |
| Runtime Architecture change | NO | Operating within approved direct-SQL topology |
| Security authority change | NO | DATA-001 primary enforcement unchanged (ENG-005/ENG-008) |
| Persistence architecture change | NO | Standard D1 prepared queries; no new store |
| Service topology change | NO | Single Worker deployable unchanged |
| Production authority | NO | No production deployment |
| Paid resource/provider | NO | Zero paid resources |

**HUMAN RESERVED: NOT REQUIRED.**

---

## Minimum ENG-006 Controller Shape (Summary)

1. **Objective:** Direct-SQL retrieval of Project state, Actions, facts, progress, and Knowledge from D1 with standing filtering and origin preservation.
2. **Application Surface:** `src/application/services/retrieval/retrievalService.ts` exposing granular query methods.
3. **D1 Query Surface:** Prepared SELECT statements against migration 0001 tables.
4. **Write Lock:** `src/application/services/retrieval/**`, `tests/application/services/retrieval/**`, `tests/integration/d1/retrieval/**`.
5. **Read-Only Paths:** `src/domain/**`, `src/application/contracts/**`, `src/application/ports/persistence/**`, `src/infrastructure/d1/**`, `migrations/**`.
6. **Return Contract:** Discriminated result envelopes (`found | not-found | retrieval-failed`) with domain types.
7. **Cross-Project Reuse:** Candidate retrieval only; relevance and qualification owned by ENG-010.
8. **KnowledgeReference:** Computed at runtime via `referenceKnowledge()`. Not persisted.
9. **Migration:** None.
10. **Failure Contract:** Normalized application errors; raw D1 errors suppressed.
11. **Currentness:** `standing = 'current'` default; superseded excluded from unqualified current.
12. **Historical:** Lineage reconstructible via `supersession_chain` JSON array.
13. **Missing Entity:** Distinguished `not-found` outcome.
14. **Local D1 Evidence:** Real migration testing for all query paths.
15. **Unit Evidence:** FakeD1 deterministic unit tests covering all success/failure branches.
16. **Regression:** All 7 Vitest configurations pass with zero regression against 189 baseline tests.
17. **Non-Goals:** Text search, LIKE, FTS, vectors, BoundedModelContext, truncation, session management, deletion (ENG-007), model adapter (ENG-009).
18. **ENG-010 Boundary:** ENG-010 owns interaction context selection, BoundedModelContext creation, and relevance qualification.
19. **DATA-001 Boundary:** Primary capture guard (ENG-005) and model egress guard (ENG-008) remain primary; no duplicated regex in ENG-006.
20. **Human Reserved:** Not required.

---

## Final Status

```text
P0-001: RESOLVED — NEW DISJOINT PATH ALLOCATION PERMITTED
P0-002: RESOLVED — GRANULAR DOMAIN-TYPE QUERY METHODS WITH FAILURE ENVELOPE
P0-003: RESOLVED — COMPUTED (KnowledgeReference is NOT persisted)
P0-004: RESOLVED — NO MIGRATION REQUIRED

HUMAN RESERVED: NOT REQUIRED

ENG-006 TASK-PACKET DRAFTING: UNBLOCKED
ENG-006 READY: NO
BUILDER AUTHORIZATION: NONE
```

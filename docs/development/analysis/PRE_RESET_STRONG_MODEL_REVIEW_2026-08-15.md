# PRJ226 Pre-Reset Strong-Model Review

**Artifact class:** OPERATIONAL / ANALYSIS
**Authority:** NON-CANONICAL
**Reviewer:** Claude Opus 4.6 (Thinking)
**Lifecycle:** COMPLETE
**Builder authorization:** NONE
**Date:** 2026-08-15
**Scope:** Gemini Flash agent pre-reset analysis package for ENG-006 and ENG-009

---

> [!WARNING]
> **GOVERNANCE NOTICE: NON-CANONICAL PLANNING REVIEW**
>
> This document records the independent strong-model adversarial review of the pre-reset analysis package. It is **NON-CANONICAL** and serves as planning preparation only. It has **NO AUTHORITY** to make ENG-006 or ENG-009 `READY`, dispatch any Builder, or modify any canonical artifact.

---

## 1. Flash Claims Accepted as Canonical

The following Flash claims are verified against repository canonical text:

| # | Claim | Canonical Source |
|---|---|---|
| 1 | `AcceptedStatePersistence` is write-only with a single `commitAcceptedState` method | [acceptedStatePersistence.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/application/ports/persistence/acceptedStatePersistence.ts) L68-70 |
| 2 | ENG-006 depends on ENG-003, ENG-004, ENG-005 all DONE | [ENGINEERING_PLAN.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L90, L115 |
| 3 | ENG-009 depends on ENG-001 and ENG-008 both DONE | [ENGINEERING_PLAN.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L93, L118 |
| 4 | `ModelCapabilityPort` has exactly one method: `execute(request: ModelCapabilityRequest): Promise<ModelCapabilityResult>` | [modelCapability.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/application/ports/model/modelCapability.ts) L395-397 |
| 5 | No vector DB, external search engine, cache, or queue is authorized | [RUNTIME_ARCHITECTURE.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/architecture/RUNTIME_ARCHITECTURE.md) L121; `ARC-005` |
| 6 | Retrieval is "simplest sufficient direct SQL querying of authoritative persistence" | [RUNTIME_ARCHITECTURE.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/architecture/RUNTIME_ARCHITECTURE.md) L89 |
| 7 | `@cf/zai-org/glm-4.7-flash` is the initial free-profile validation candidate | [ENGINEERING_PLAN.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L34 |
| 8 | Superseded knowledge is not returned as current unqualified knowledge | Runtime Architecture invariant 5, Domain invariant 12 |
| 9 | `KnowledgeItem` has `standing: "current" \| "superseded"` and `supersessionChain` | [model.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/domain/model.ts) L61-68 |
| 10 | `KnowledgeReference` exists as a domain type for cross-project reuse | [model.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/domain/model.ts) L70-76 |
| 11 | `D1DatabaseLike` is the adapter-local D1 abstraction type | [d1AcceptedStatePersistence.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/infrastructure/d1/d1AcceptedStatePersistence.ts) L8 |
| 12 | Authentication material exclusion exists in two places: `knowledgeProvenanceService.ts` (capture) and `modelCapability.ts` (context construction) | Source verified at both files |
| 13 | `BoundedModelContext` has a hard item limit of ≤32 | [modelCapability.ts](file:///Users/dangnguyen/Desktop/prj226-gen2/src/application/ports/model/modelCapability.ts) L147 |
| 14 | ENG-010 is the integration convergence/orchestration point | [ENGINEERING_PLAN.md](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L95-96, L207 |

---

## 2. Flash Claims Downgraded to Supported Inference

| # | Claim | Why Downgraded |
|---|---|---|
| 1 | ENG-006 needs a new read port interface parallel to `AcceptedStatePersistence` | **Supported design option**, not canonical requirement. The Engineering Plan says "direct-SQL retrieval" and "application-managed direct SQL queries" — whether this goes through a new port interface or directly through infrastructure is an engineering design decision, not a settled architecture choice. |
| 2 | ENG-006's retrieval service should produce `AcceptedProjectContext` | The domain type `AcceptedProjectContext` exists in `model.ts` L38-42, but no canonical authority assigns ENG-006 the responsibility of assembling this specific type vs. producing query DTOs. This is a design option. |
| 3 | ENG-009 should use `env.AI.run()` Workers AI binding pattern | **Plausible provider implementation detail**. No canonical source specifies the Workers AI SDK binding shape. The adapter is explicitly "adapter-local" per ENG-009 description. |
| 4 | `ModelContextItem` discriminated union items map 1:1 to SQL query patterns | Reasonable inference from the ENG-008 types, but the mapping relationship is ENG-006/ENG-010 design, not established fact. |
| 5 | Cross-project Knowledge retrieval requires joining `knowledge_items` and a future knowledge_references table | `KnowledgeReference` exists as a domain type, but **no `knowledge_references` table exists in the schema**. Whether references are persisted (and thus retrievable via SQL) or computed at runtime is an unresolved design question. |

---

## 3. Flash Claims Rejected as Speculative

| # | Claim | Rejection Basis |
|---|---|---|
| 1 | **LIKE '%' \|\| ? \|\| '%' text search** is needed for ENG-006 | REJECTED. No canonical source requires arbitrary text search. ENG-006 is "retrieve relevant captured knowledge" and "accepted-context resumption" — these are identity-based and standing-based queries, not user-query-text searches. See §9 disposition. |
| 2 | **FTS5** should be considered as a future upgrade path | SPECULATIVE. FTS5 is an infrastructure choice explicitly absent from approved architecture. Mentioning it prematurely pollutes the engineering boundary. |
| 3 | **SQLITE_BUSY** will be a material concern for D1 | SPECULATIVE. D1 is a managed service; SQLite busy semantics are abstracted by Cloudflare. No canonical evidence establishes this as a v1 concern for a single-user product. |
| 4 | **Knowledge chain depth** creates a practical retrieval performance problem | SPECULATIVE. No evidence of chain depth > single digits for a v1 single-user product. The supersession chain is stored as a JSON array directly on each `knowledge_items` row, so retrieval is O(1) per item, not recursive. |
| 5 | **Delete ordering** across tables requires careful foreign-key management | PREMATURE. Delete semantics belong to ENG-007, not ENG-006. ENG-006 is retrieval/read-only. |
| 6 | **Workers AI quota details** (specific RPM, TPM limits) are relevant to ENG-009 | OVERSTATED. ENG-009 must normalize quota exhaustion as a `ModelCapabilityFailure` with `category: "rate-limited"`, but the specific quota numbers are external provider facts, not architecture decisions. ENG-013 handles live qualification. |
| 7 | ENG-006 should implement **session-loss recovery** as a first-class retrieval pattern | SPECULATIVE. The Engineering Plan mentions "transient-session-loss recovery" in ENG-006 evidence, but this is about verifying that retrieval can reconstruct enough context after session loss — not about ENG-006 implementing a session management system. Recovery *orchestration* is ENG-010. |

---

## 4. ENG-006 Boundary Corrections

### PART A — ENG-006 Authority Audit

| # | Proposed Capability | Classification | Evidence |
|---|---|---|---|
| 1 | Project resumption context retrieval | **CANONICAL_REQUIRED** | Eng Plan L63: "Continuity and accepted memory" names ENG-006. PI-CAP-002, PI-OUT-001 require resumption. |
| 2 | Active project list | **CANONICAL_ALLOWED** | Required by ENG-010 for multi-project disambiguation (SCN-006), but the query itself naturally falls within ENG-006 retrieval scope. |
| 3 | Action retrieval for a Project | **CANONICAL_REQUIRED** | Actions are part of accepted Project context per Domain Model; retrieval needs them for resumption. |
| 4 | Current Knowledge retrieval | **CANONICAL_REQUIRED** | PI-CAP-005, PI-OUT-004 require knowledge retrieval. ENG-006 description explicitly includes "currentness." |
| 5 | Superseded Knowledge exclusion | **CANONICAL_REQUIRED** | Runtime Architecture invariant 5; Domain invariant 12. Superseded items must not be returned as current unqualified knowledge. |
| 6 | Historical Knowledge lineage retrieval | **DESIGN_OPTION** | The correction relationship must be "reconstructible at the product-semantic level" (Domain Model), but ENG-006 is not explicitly required to expose full lineage queries. Qualified historical retrieval is listed in evidence, so this is canonically *allowed* but the exact form is a design decision. |
| 7 | Cross-Project Knowledge retrieval | **CANONICAL_REQUIRED** | ENG-006 description: "bounded cross-Project reuse." MOD-004, SCN-009 require it. |
| 8 | Text search/query terms | **NOT_AUTHORIZED** | No canonical source requires arbitrary user-text search in ENG-006. See §9. |
| 9 | SQL LIKE search | **NOT_AUTHORIZED** | Implementation mechanism for a capability that is itself not required. |
| 10 | Accepted-context reconstruction | **CANONICAL_REQUIRED** | ENG-006 description: "accepted-context resumption." |
| 11 | Conversion into BoundedModelContext | **BELONGS_TO_OTHER_TASK** | `BoundedModelContext` is an ENG-008 type consumed by `ModelCapabilityPort`. The *assembly* of context items into a `BoundedModelContext` is a model-interaction concern belonging to ENG-010 orchestration. ENG-006 produces retrieval results; ENG-010 selects/assembles them into model context. |
| 12 | Model-context selection/truncation | **BELONGS_TO_OTHER_TASK** | ENG-010 orchestration responsibility. Runtime Architecture L81: "Context assembly remains bounded by interaction need." Selection is interaction-driven, not retrieval-driven. |
| 13 | DATA-001 filtering at retrieval | **DESIGN_OPTION** | Defense-in-depth only. Primary enforcement is capture (ENG-005) and context (ENG-008). |
| 14 | Missing entity outcomes | **CANONICAL_REQUIRED** | Engineering design default: "make failed, duplicate, retried, and partial operations explicit and safe." Retrieval for a nonexistent project ID must produce a distinguishable result, not a silent empty. |
| 15 | D1 failure normalization | **CANONICAL_REQUIRED** | QLT-001 requires visible failure; ENG-006 must normalize D1 errors into application-level retrieval failures. |
| 16 | Currentness authority | **CANONICAL_REQUIRED** | Runtime Architecture invariant 5; `standing` field semantics. |
| 17 | Caller-snapshot avoidance | **CANONICAL_REQUIRED** | ENG-004 F003 established that caller snapshots are unreliable. ENG-006 must query authoritative state, not trust caller-supplied snapshots. |
| 18 | Session-loss recovery | **DESIGN_OPTION** | Listed in ENG-006 evidence as "transient-session-loss recovery," meaning ENG-006 must *support* context reconstruction, not *implement* session management. The orchestration responsibility is ENG-010. |

> [!IMPORTANT]
> Items 11 and 12 are the most consequential boundary corrections. The Flash package assumed ENG-006 extends through BoundedModelContext assembly. This is incorrect — that crosses into ENG-008/ENG-010 territory.

---

## 5. ENG-009 Boundary Corrections

### PART F — ENG-009 Authority Audit

| # | Proposed Capability | Classification | Evidence |
|---|---|---|---|
| 1 | Workers AI adapter implementing `ModelCapabilityPort` | **CANONICAL_REQUIRED** | ENG-009 description: "adapter-local Workers AI integration." |
| 2 | Exact provider/model ID `@cf/zai-org/glm-4.7-flash` | **CANONICAL_REQUIRED** | Engineering Plan L34, L118; Runtime Architecture L62, L142. Must be replaceable configuration per ENG-009 scope. |
| 3 | Prompt construction | **PROVIDER_IMPLEMENTATION_DETAIL** | The adapter must translate `ModelCapabilityRequest` into provider-specific prompt format. How prompting works is adapter-local. |
| 4 | Context serialization | **PROVIDER_IMPLEMENTATION_DETAIL** | Adapter translates `BoundedModelContext` items into provider message format. Entirely adapter-local. |
| 5 | Tool schema/tool calling | **DESIGN_OPTION** | Workers AI documents `@cf/zai-org/glm-4.7-flash` as supporting function calling. Whether ENG-009 uses tool calling for `propose-operations` capability is a design option bounded by adapter locality. |
| 6 | JSON parsing of model output | **CANONICAL_REQUIRED** | Adapter must produce structured `ModelCapabilityResult` from provider output. Parsing is implied. |
| 7 | Markdown parsing | **NOT_AUTHORIZED** | No canonical source requires markdown parsing. Model output structure is adapter-local; the port contract expects `NonEmptyText` content fields, not parsed markdown. |
| 8 | ProposedOperation conversion | **CANONICAL_REQUIRED** | When capability is `propose-operations`, adapter must produce valid `ProposedOperation[]` matching the port contract types. |
| 9 | Timeout mapping | **CANONICAL_REQUIRED** | `ModelFailureCategory` includes `"timeout"`. Adapter must normalize provider timeouts. |
| 10 | 429 mapping | **CANONICAL_REQUIRED** | `ModelFailureCategory` includes `"rate-limited"`. |
| 11 | 500/502/503 mapping | **CANONICAL_REQUIRED** | `ModelFailureCategory` includes `"unavailable"`. |
| 12 | Malformed-result retryability | **CANONICAL_REQUIRED** | `ModelFailureCategory` includes `"malformed-result"`. Retryability flag per `ModelCapabilityFailure.retryable`. |
| 13 | Safety refusal mapping | **CANONICAL_REQUIRED** | `ModelFailureCategory` includes `"refused"`. |
| 14 | Quota mapping | **CANONICAL_REQUIRED** | Maps to `"rate-limited"`. |
| 15 | Live network calls | **ENG-013_CONCERN** | ENG-009 is "without live qualification." All ENG-009 tests use mocked bindings. Live calls are ENG-013. |
| 16 | Mock binding tests | **CANONICAL_REQUIRED** | ENG-009 evidence: "Mocked binding contracts." |
| 17 | Provider SDK/types | **PROVIDER_IMPLEMENTATION_DETAIL** | Adapter may use Workers AI types/SDK but must keep them adapter-local. Engineering Plan: "keep D1 types adapter-local" establishes the pattern. |
| 18 | Configuration/env bindings | **CANONICAL_REQUIRED** | The adapter needs the AI binding from Workers env. How this is configured is Engineering-owned. |
| 19 | ENG-013 qualification boundary | **CANONICAL_REQUIRED** | ENG-009 must NOT claim model sufficiency. ENG-013 owns live qualification with current provider policy evidence. |

---

## 6. DATA-001 Ownership Disposition

### PART C — DATA-001 Enforcement Analysis

**Current canonical state of authentication material filtering:**

| Layer | Implementation | Owner | Patterns |
|---|---|---|---|
| Knowledge capture | `knowledgeProvenanceService.ts` L52-64 | **ENG-005** | 7 regex patterns (PEM key, password, credentials, access tokens, auth tokens, Bearer header, Bearer standalone/backtick) |
| Model context construction | `modelCapability.ts` L41-45 | **ENG-008** | 3 regex patterns (PEM key, Bearer, password/key/token/secret assignment) |
| Model request creation | `createModelCapabilityRequest` L280-285 | **ENG-008** | Reuses same patterns on `interaction` and `constraints` |

**Disposition for ENG-006:**
1. **Must ENG-006 itself implement secret/auth-material filtering?**
   **NO, with qualification.** ENG-006 retrieves *already persisted* data. DATA-001 filtering at capture is ENG-005's responsibility (DONE). Persisted data has already passed the capture guard.
2. **Is defense-in-depth optional?**
   **DESIGN_OPTION, not CANONICAL_REQUIRED.** No canonical source mandates retrieval-time re-scanning.
3. **Would duplicating ENG-005 regex rules create ownership drift?**
   **YES.** The ENG-005 patterns (7 regexes) and ENG-008 patterns (3 regexes) already exist. Adding a third copy in ENG-006 creates ownership drift.
4. **Is model-context filtering solely an ENG-008/ENG-010 concern?**
   **YES.** `createBoundedModelContext` already enforces auth-material exclusion (ENG-008 DONE).
5. **Conclusion:** ENG-006 does NOT own DATA-001 primary enforcement.

---

## 7. SQL/Read-Layer Architecture Disposition

### PART B — WHERE SHOULD SQL LIVE?

**Evaluated forms:**
- **Form A:** Application service directly accepts `D1DatabaseLike` and executes SQL (`COMPATIBLE BUT OPTIONAL` — recommended minimum).
- **Form B:** Application service depends on a provider-neutral read/query port; D1 infrastructure adapter owns SQL (`COMPATIBLE BUT OPTIONAL`).
- **Form C:** D1 infrastructure files own SQL; application service consumes typed query results (`COMPATIBLE BUT OPTIONAL`).

**Ruling:** All three forms are **engineering design decisions**, not architecture decisions per [Engineering Plan](file:///Users/dangnguyen/Desktop/prj226-gen2/docs/development/ENGINEERING_PLAN.md) L250.

---

## 8. ENG-006 vs ENG-010 Boundary Disposition

### PART D — Resumption Boundary

**Correct boundary:**
```
ENG-006: retrieve persisted state -> return typed query results (domain types or DTOs)
ENG-010: select/assemble retrieved results -> create BoundedModelContext -> invoke ModelCapabilityPort
```

---

## 9. Text-Search Disposition

### PART E — Challenge to LIKE Search

**Ruling:** **REMOVE arbitrary text search (LIKE, FTS5, query-term matching) from minimum ENG-006 scope.** It is not canonically required. Relevance selection is an interaction-driven concern belonging to ENG-010.

---

## 10. Architecture-Pressure Corrections

| # | Flash Pressure Point | Classification | Correction |
|---|---|---|---|
| 1 | D1 `SQLITE_BUSY` under concurrent writes | **SPECULATIVE** | Single-user v1 architecture; managed D1 service. |
| 2 | LIKE search performance at scale | **WRONG** | LIKE search excluded from minimum scope. |
| 3 | FTS5 as upgrade path | **SPECULATIVE** | Explicitly absent from v1 baseline (`ARC-005`). |
| 4 | Knowledge chain depth performance | **OVERSTATED** | `supersession_chain` stored as JSON array inline; O(1) retrieval. |
| 5 | Context limit pressure (32-item BoundedModelContext) | **SUPPORTED** | Real constraint; managed by ENG-010 selection policy. |
| 6 | Delete ordering / FK constraints | **NEEDS LATER TASK** | Deletion is ENG-007. |
| 7 | Workers AI quota/rate limits | **SUPPORTED** | Real operational constraint; normalized in ENG-009. |
| 8 | Superseded knowledge visibility | **SUPPORTED** | Correct concern; Runtime Architecture Invariant 5 is binding. |

---

## 11. Fixture-Catalog Corrections

| Proposed Fixture | Classification | Risk |
|---|---|---|
| Active Project with Actions | **SAFE_REUSABLE** | Standard domain state. |
| Completed Project | **SAFE_REUSABLE** | Domain Model authorizes this state. |
| Completed Project with open Actions | **SEMANTICALLY_RISKY** | Valid under Domain Invariant 7 (Project completion does not cascade). Assertions must not assume cascade. |
| Progress supersession chain | **SAFE_REUSABLE** | Established by ENG-004 evidence. |
| Knowledge supersession chain | **SAFE_REUSABLE** | Established by ENG-005 evidence. |
| Cross-project KnowledgeReference | **TASK_SPECIFIC** | In-memory domain fixture. |
| "Deleted" Knowledge Item | **INVALID** | PROHIBITED. `Deleted` is not a retained lifecycle state (`DOMAIN_MODEL.md` L122). |
| Secret/auth-material fixture | **SAFE_REUSABLE** | Negative-path testing. |

---

## 12. Agent-Template Corrections

1. Builder runs all existing test suites (7 configs, 189 baseline tests) as regression verification.
2. Closure verification requires test count ≥ baseline AND all pass.
3. Builder workspace must contain all DONE task artifacts unchanged before writing.
4. Builder must produce reproducible candidate identity (commit SHA, tree SHA, per-file SHA-256 manifest).
5. Builder must stop and escalate on any Human Reserved trigger.
6. Independent Reviewer independently verifies candidate and deterministic evidence.

---

## 13. Remaining P0 Questions (Historical Trace)

These four questions were identified for Controller design adjudication:
1. **P0-001:** ENG-006 exclusive write lock vs ENG-003 ownership boundary.
2. **P0-002:** Retrieval return contract: domain types vs DTOs vs AcceptedProjectContext.
3. **P0-003:** KnowledgeReference persistence vs runtime computation.
4. **P0-004:** Schema migration necessity.

---

## 14. Remaining P1 Questions

1. Should ENG-006 implement defense-in-depth auth-material filtering at retrieval? (Optional design choice).
2. Should retrieval results include an uncertainty qualification for cross-project items? (ENG-010 presentation concern).
3. How does "Completed Project" context retrieval differ from "Active Project" retrieval? (Identical query, ENG-010 filters).
4. Does ENG-006 need to handle unexpected D1 schema? (Defense-in-depth).

---

## 15. Minimal Canonical-Safe ENG-006 Scope

- **Objective:** Direct-SQL retrieval of Project state, Actions, Accepted Progress, Context Facts, and Knowledge Items from D1, with standing filtering and origin preservation.
- **In Scope:** Granular queries (project, actions, facts, progress, knowledge, cross-project candidates, lineage), missing-entity distinction, D1 failure normalization.
- **Out of Scope:** Arbitrary text search, LIKE, FTS, BoundedModelContext assembly, truncation, session management, deletion (ENG-007), live model calls (ENG-013).
- **Write Lock:** `src/application/services/retrieval/**`, `tests/application/services/retrieval/**`, `tests/integration/d1/retrieval/**`.

---

## 16. Minimal Canonical-Safe ENG-009 Scope

- **Objective:** Adapter-local Workers AI integration for `@cf/zai-org/glm-4.7-flash` implementing `ModelCapabilityPort` with mocked bindings.
- **In Scope:** `WorkersAIModelAdapter`, request/response translation, operation parsing, error normalization across 7 categories, retryability flags, mocked binding tests, build verification.
- **Out of Scope:** Live network calls (ENG-013), model sufficiency claims, markdown parsing, conversation history.
- **Write Lock:** `src/infrastructure/workersAi/**`, `tests/infrastructure/workersAi/**`.

---

## 17. Human Reserved Decision Status

**HUMAN RESERVED: NOT REQUIRED.**
Neither ENG-006 nor ENG-009 at minimum scope triggers a Product semantic, Domain semantic, Runtime Architecture, security, persistence architecture, service topology, production, or paid-resource boundary change.

---

## Final Status

```text
ENG-006 STRONG-MODEL REVIEW STATUS: READY FOR CONTROLLER PLANNING
ENG-009 STRONG-MODEL REVIEW STATUS: READY FOR CONTROLLER PLANNING
```

# PRJ226 Generation 2 Strong-Model Review Register

**Artifact class:** OPERATIONAL / REGISTER
**Authority:** NON-CANONICAL
**Lifecycle:** ACTIVE
**Last updated:** 2026-08-28
**Purpose:** Comprehensive register of unresolved, inferred, or disputed engineering design issues requiring stronger-model adjudication before task dispatch.

**ENG-011 Lifecycle Status:**
- Task Packet: [ENG-011 Task Packet Revision 2](../tasks/ENG-011-observability-failure-recovery-hardening.md)
- Formal DoR Result: [Revision 2](ENG-011_FORMAL_DoR_REV2_2026-08-28.md) `PASS`; revision 1 `PASS` remains historical for its prior scope
- Finding Status: `ENG-011-DOR-R001` through `R006 CLOSED` historically; `ENG-011-BSE-R001 CLOSED BY EXECUTION RESTART`; `ENG-011-R2-SOR-R001` through `R009 ACCEPTED / BOUND TO REPAIR 3`; `ENG-011-R3-DV-R001` through `R004 ACCEPTED / BLOCKING / BOUND TO REPAIR 4` ([Controller Disposition](ENG-011_REPAIR3_DETERMINISTIC_FINDING_DISPOSITION_2026-08-28.md))
- Task State: `AUTHORIZED / REPAIR 4 DISPATCHED`
- Original Builder: `ABORTED / STARTUP CONTAMINATED / NO CANDIDATE / NON-OPERATIVE` (`eng-011-builder`, `/private/tmp/prj226-eng011-builder` preserved)
- Dispatch Status: `AUTHORIZED / REPAIR 4 DURABLY DISPATCHED`
- Delivery Record: [ENG-011 Delivery Record](../delivery/ENG-011-observability-failure-recovery-hardening.md)
- Current Builder: `ENG-011 REPAIR 4 BUILDER`
- Builder Authority: `ACTIVE / EXCLUSIVE WRITE AUTHORITY OVER THE EXACT 19-PATH WRITE LOCK`
- Builder Branch: `eng-011-builder-repair-4`
- Builder Worktree: `/private/tmp/prj226-eng011-builder-repair-4`
- Implementation State: `REPAIR-3 CANDIDATE FROZEN / REPAIR 4 NOT STARTED`
- Migration: `NO MIGRATION`
- Human Reserved: `NOT REQUIRED`

**ENG-010 Lifecycle Status:**
- Task Packet: [ENG-010 Task Packet Revision 1](../tasks/ENG-010-text-interaction-human-control-orchestration.md)
- Formal DoR Result: `PASS` ([Formal DoR Revision 1](ENG-010_FORMAL_DoR_REV1_2026-08-26.md))
- Finding Status: `ENG-010-DOR-R001 INVALID / RETRACTED`; `ENG-010-DOR-R002` through `R006 CLOSED`
- Task State: `DONE / ACCEPTED / CANONICALIZED / POST-INTEGRATION VERIFIED / GOVERNANCE-CLOSED`
- Delivery Record: [ENG-010 Delivery Record](../delivery/ENG-010-text-interaction-human-control-orchestration.md)
- Dispatch Status: `CONSUMED / COMPLETE`
- Current Builder: `NONE`
- Builder Authority: `CONSUMED / NON-OPERATIVE`
- Implementation State: `COMPLETE / ACCEPTED`
- Human Reserved: `NOT REQUIRED`

**ENG-009 Lifecycle Status:**
- Implementation Candidate: Commit `b8c5b15173efcee723a4cd543e92ec47e542d688`
- Canonical Integration: Merge commit `07fa67ccdb44972c18b858ab50f78f93ac6f9ca6`
- Deterministic Verification: `PASS` (43 / 43 tests passing)
- Delivery Record: [ENG-009 Delivery Record](../delivery/ENG-009-workers-ai-adapter.md)
- Implementation Status: `DONE / ACCEPTED / CANONICALIZED`
- Builder Dispatch Eligibility: `NO (EXECUTION AUTHORITY CONSUMED / NON-OPERATIVE)`
- Current Builder: `NONE`

**ENG-007 Lifecycle Status:**
- Repair 6 Candidate: Commit `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195`
- Deterministic Verification: `PASS` (420 / 420 test executions across all 14 configs)
- Semantic Review: `GREEN`
- Finding Status: `SR-R001 CLOSED`; `SR-R002-R1 CLOSED`; `SR-R002-R2 CLOSED`; `SR-R003 CLOSED`; `DV-R001 CLOSED`; `DV-R002 CLOSED`
- Controller Final Closure: `APPROVE` ([Controller Closure](ENG-007_REPAIR6_CONTROLLER_CLOSURE_2026-08-25.md))
- Implementation Status: `ENG-007 REPAIR 6 ACCEPTED / ENG-007 DONE / CANONICALIZED`
- Canonical Integration: `CANONICALIZED / FF-ONLY INTEGRATED`
- Historical Failed Candidates: `FROZEN / UNACCEPTED` (Candidates 1–6)
- Builder Dispatch Eligibility: `NO (EXECUTION AUTHORITY CONSUMED / NON-OPERATIVE)`
- Current Builder: `NONE`

**ENG-006 Lifecycle Status:**
- Candidate Evaluation (2026-08-15): Commit `7b7db0d98660f6562f8e9738445be725fc65988c` -> `NEEDS FIX`
- Controller Disposition: [`ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md`](ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md) (R001-R004 ACCEPT, R005 DEFER)
- Root Blocker: `ENG-006-R004` — `CLOSED AT UPSTREAM ENG-003 LEVEL` by accepted `ENG-003` Revision 3 candidate `5276481824e43d23345799c39efaa72e51235877`
- Upstream Action: `ENG-003` Revision 3 `ACCEPTED`; `ENG-003` `DONE` ([Controller Closure](ENG-003_REV3_CONTROLLER_CLOSURE_2026-08-21.md))
- Repair Rev1 Candidate: Commit `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda`
- Repair Rev1 Verification: `PASS`
- Repair Rev1 Semantic Review: `GREEN`
- Controller Final Closure: `APPROVE` ([Controller Closure](ENG-006_REPAIR_REV1_CONTROLLER_CLOSURE_2026-08-23.md))
- Implementation Status: `ENG-006 REPAIR REV1 ACCEPTED / ENG-006 DONE`
- Finding Status: `R001 CLOSED`; `R002 CLOSED`; `R003 CLOSED`; `R004 CLOSED AT UPSTREAM ENG-003 LEVEL`; `R005 DEFERRED TO ENG-010`
- Historical Failed Candidate: `FROZEN / UNACCEPTED (7b7db0d98660f6562f8e9738445be725fc65988c)`
- Builder Dispatch Eligibility: `NO (EXECUTION AUTHORITY CONSUMED / NON-OPERATIVE)`
- Current Builder: `NONE`

---

## Summary Register

| ID | Task | Priority | Category | Topic / Question | Status |
|---|---|---|---|---|---|
| `REG-006-01` | `ENG-006` | **P0** | Architecture / Boundary | SQL Ownership: Application Service vs Read Port + D1 Adapter | `RESOLVED` |
| `REG-006-02` | `ENG-006` | **P0** | Architecture / Ports | Appropriateness of a dedicated Retrieval / Read Port | `RESOLVED` |
| `REG-006-03` | `ENG-006` | **P0** | Task Boundary | Resumption Boundary: ENG-006 vs ENG-010 Context Construction | `RESOLVED` |
| `REG-006-04` | `ENG-006` | **P0** | Contract Ownership | Placement of `BoundedModelContext` Assembly | `RESOLVED` |
| `REG-006-05` | `ENG-006` | **P0** | Scope / Authority | Authority for Arbitrary Text Search in v1 Minimum Scope | `RESOLVED` |
| `REG-006-06` | `ENG-006` | **P1** | Query Mechanism | SQL `LIKE` Wildcard Search: Authorized vs Speculative | `RESOLVED` |
| `REG-006-07` | `ENG-006` | **P1** | Security / DATA-001 | DATA-001 Authentication Material Guard Ownership at Retrieval | `RESOLVED` |
| `REG-006-08` | `ENG-006` | **P1** | Domain Semantics | Historical / Superseded Knowledge Retrieval Semantics | `RESOLVED` |
| `REG-006-09` | `ENG-006` | **P0** | Schema & Persistence | Cross-Project Knowledge Reference Persistence vs Computation | `RESOLVED` |
| `REG-006-10` | `ENG-006` | **P0** | Task Boundary | Context Selection and Truncation (≤32 item limit) Ownership | `RESOLVED` |
| `REG-006-11` | `ENG-006` / `ENG-010` | **P2** | Task Boundary / Downstream | Parent Project Existence on Empty Child Collection (`R005`) | `BOUND IN ENG-010` |
| `REG-009-01` | `ENG-009` | **P1** | Provider Binding | Workers AI Provider/Model Configuration & Binding Assumptions | `RESOLVED` |
| `REG-009-02` | `ENG-009` | **P1** | Provider Adapter | Prompt & System Message Construction Ownership | `RESOLVED` |
| `REG-009-03` | `ENG-009` | **P1** | Model Invocation | Tool Calling vs JSON Structured Output Extraction | `RESOLVED` |
| `REG-009-04` | `ENG-009` | **P1** | Response Parsing | Output Parsing: Structured JSON vs Markdown Syntax Trees | `RESOLVED` |
| `REG-009-05` | `ENG-009` | **P0** | Error Normalization | Mapping Workers AI Errors to `ModelFailureCategory` | `RESOLVED` |
| `REG-009-06` | `ENG-009` | **P1** | Reliability | Provider Failure Retryability Semantics | `RESOLVED` |
| `REG-009-07` | `ENG-009` | **P1** | Architecture / Types | Configuration & Environment Binding Isolation | `RESOLVED` |
| `REG-009-08` | `ENG-009` | **P0** | Governance / Testing | ENG-009 (Mocked) vs ENG-013 (Live Qualification) Boundary | `RESOLVED` |

---

## Detailed Issue Records

### ENG-006: Direct-SQL Retrieval & Resumption

```
======================================================================
ID: REG-006-01
Task: ENG-006
Priority: P0
Category: Architecture / Boundary
======================================================================
Question:
Where should SQL execute for retrieval: directly in an application retrieval service (Form A), or strictly inside a D1 infrastructure adapter implementing a read port (Form B)?

Current Evidence:
- RUNTIME_ARCHITECTURE.md L118: "Retrieval | Application-managed direct SQL queries; no separate retrieval technology for v1."
- RUNTIME_ARCHITECTURE.md L50-58 topology diagram shows: "retrieval projection / direct queries (derived)" branching from PERSISTENCE PORT / D1 ADAPTER.
- ENGINEERING_PLAN.md L76: "use ordered SQL migrations and prepared D1 SQL through the adapter, with no ORM initially".
- ENGINEERING_PLAN.md L250: "Ordinary source layout, TypeScript types, table and index design... internal interfaces... remain Engineering-owned".

Flash Inference:
Proposed that Form A (application service directly accepting `D1DatabaseLike` and executing SQL) is the canonical default.

Why Adjudication Is Required:
Determines whether ENG-006 requires introducing a new port contract in `src/application/ports/` and an adapter in `src/infrastructure/d1/`, or whether it places query methods directly in `src/application/services/retrieval/`. This affects directory layout, interface definitions, and mock boundaries for testing.

Final Disposition:
RESOLVED — Form A (application service with direct D1 queries) is the minimum pattern; new disjoint path allocation permitted without modifying accepted ENG-003 files. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-001).
```

```
======================================================================
ID: REG-006-02
Task: ENG-006
Priority: P0
Category: Architecture / Ports
======================================================================
Question:
Should ENG-006 introduce a formal `RetrievalPort` interface parallel to `AcceptedStatePersistence`, or is direct query consumption sufficient?

Current Evidence:
- `AcceptedStatePersistence` (`src/application/ports/persistence/acceptedStatePersistence.ts`) is write-only (`commitAcceptedState`).
- No corresponding read port currently exists in `src/application/ports/`.
- `ARC-005` specifies direct querying without intervening search/cache infrastructure.

Flash Inference:
Suggested that a dedicated `RetrievalPort` is architecturally cleaner and preserves hexagonal boundary purity.

Why Adjudication Is Required:
Prevents over-abstraction if a port is unnecessary, while ensuring testability with in-memory doubles if a port is deemed mandatory for architectural consistency.

Final Disposition:
RESOLVED — Formal read port is not required; granular query methods in `src/application/services/retrieval/` consuming `D1DatabaseLike` suffice for v1. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-001, P0-002).
```

```
======================================================================
ID: REG-006-03
Task: ENG-006
Priority: P0
Category: Task Boundary
======================================================================
Question:
What is the exact boundary between ENG-006 (retrieval) and ENG-010 (interaction orchestration) regarding project context resumption?

Current Evidence:
- ENGINEERING_PLAN.md L63: "Continuity and accepted memory... Preserve accepted Project/Action state, progress, unresolved matters, constraints, and enough accepted context to resume after transient conversation loss." (Names ENG-003, ENG-004, ENG-006).
- ENGINEERING_PLAN.md L119: ENG-010 integrates "one bilingual text flow with advisory/state-changing separation, ambiguity clarification, recommendations, mixed outcomes, correction..."
- DOMAIN_MODEL.md L76-84: Accepted context contains facts and progress; user intent takes precedence.

Flash Inference:
Assumed ENG-006 should orchestrate the full resumption experience, including evaluating whether context is sufficient and preparing it for the model.

Why Adjudication Is Required:
Clear separation of concerns: ENG-006 must be limited to retrieving durable data from D1; conversational resumption orchestration, user confirmation, and ambiguity handling must be reserved for ENG-010.

Final Disposition:
RESOLVED — ENG-006 retrieves domain data from D1; ENG-010 orchestrates resumption and interaction flow. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-002).
```

```
======================================================================
ID: REG-006-04
Task: ENG-006
Priority: P0
Category: Contract Ownership
======================================================================
Question:
Does `BoundedModelContext` assembly belong inside ENG-006 or ENG-010?

Current Evidence:
- `BoundedModelContext` and `createBoundedModelContext` are defined in `src/application/ports/model/modelCapability.ts` (ENG-008).
- `createBoundedModelContext` requires `selectionReason: NonEmptyText` and enforces `items.length <= itemLimit (<= 32)`.
- RUNTIME_ARCHITECTURE.md L81: "Context assembly remains bounded by interaction need and selects no token-selection algorithm."
- RUNTIME_ARCHITECTURE.md L107: Conceptual flow is `current interaction -> authoritative context selection -> minimal relevant retrieval -> ... -> Model Capability Port`.

Flash Inference:
Initially assumed ENG-006 should take retrieved D1 rows and call `createBoundedModelContext` directly.

Why Adjudication Is Required:
ENG-006 has no knowledge of the current user interaction or why specific items are relevant. Calling `createBoundedModelContext` in ENG-006 would force it to invent synthetic `selectionReason` strings and arbitrary truncation logic, violating `ARC-003`.

Final Disposition:
RESOLVED — BoundedModelContext belongs strictly in ENG-010; ENG-006 returns domain types. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-002).
```

```
======================================================================
ID: REG-006-05
Task: ENG-006
Priority: P0
Category: Scope / Authority
======================================================================
Question:
Is arbitrary user text search (keyword search across Knowledge content) authorized and required for ENG-006 v1 minimum scope?

Current Evidence:
- PRODUCT_REQUIREMENTS.md: `PI-CAP-005` ("Retrieve relevant captured knowledge during later project work"), `PI-OUT-004`.
- DOMAIN_MODEL.md: Knowledge Items belong to an originating Project; reuse is qualified.
- SCENARIOS.md: `SCN-005` (IELTS recall), `SCN-009` (cross-project reuse).
- RUNTIME_ARCHITECTURE.md L89: "simplest sufficient direct SQL querying of authoritative persistence; no separately materialized index, vector database, semantic-search system...".

Flash Inference:
Assumed arbitrary text search is required and proposed SQL `LIKE` wildcard search.

Why Adjudication Is Required:
Adding arbitrary text search prematurely adds query complexity, test surface, and indexing questions. Canonical authority only requires structural retrieval (by project ID, action ID, standing, and origin).

Final Disposition:
RESOLVED — Arbitrary text search is NOT authorized for minimum ENG-006 scope; retrieval is structural (by ID, standing, origin). See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-002, P0-004).
```

```
======================================================================
ID: REG-006-06
Task: ENG-006
Priority: P1
Category: Query Mechanism
======================================================================
Question:
If text search is ever introduced, is SQL `LIKE '%...%'` authorized or merely speculative implementation detail?

Current Evidence:
- No canonical document mentions `LIKE`, `MATCH`, or `FTS5`.
- `ARC-005` specifies direct SQL without external search infrastructure.

Flash Inference:
Proposed `LIKE '%' || ? || '%'` as the default retrieval mechanism.

Why Adjudication Is Required:
Clarifies that `LIKE` is an unapproved implementation guess, preventing premature optimization or unwarranted schema index additions.

Final Disposition:
RESOLVED — LIKE search is unapproved speculation and excluded from minimum scope. See ENG-006_P0_ADJUDICATION_2026-08-15.md.
```

```
======================================================================
ID: REG-006-07
Task: ENG-006
Priority: P1
Category: Security / DATA-001
======================================================================
Question:
Must ENG-006 implement credential/auth-material scanning at retrieval time, or is defense-in-depth optional given existing capture and egress guards?

Current Evidence:
- `knowledgeProvenanceService.ts` (ENG-005 L52-64) enforces capture-time auth material rejection.
- `modelCapability.ts` (ENG-008 L41-45) enforces context-creation auth material rejection.
- No auth material can be persisted to D1 through approved application paths.

Flash Inference:
Suggested that ENG-006 should re-scan all retrieved text with auth-material regexes.

Why Adjudication Is Required:
Avoids triplicating regex pattern lists across the codebase, which causes maintenance divergence and false-positive risk.

Final Disposition:
RESOLVED — Primary enforcement remains ENG-005 (capture) and ENG-008 (context creation); ENG-006 does not duplicate regex patterns. See ENG-006_P0_ADJUDICATION_2026-08-15.md.
```

```
======================================================================
ID: REG-006-08
Task: ENG-006
Priority: P1
Category: Domain Semantics
======================================================================
Question:
What are the exact retrieval semantics for historical / superseded Knowledge Items?

Current Evidence:
- Runtime Architecture Invariant 5: "Superseded knowledge is distinguishable and is not returned as current unqualified knowledge."
- Domain Invariant 12: "An accepted correction supersedes rather than silently rewrites prior knowledge; superseded knowledge is not presented as current unqualified knowledge."
- `knowledge_items` table contains `standing ('current', 'superseded')`, `supersedes_id`, and `supersession_chain` (JSON array of IDs).

Flash Inference:
Assumed historical retrieval requires recursive lineage tree traversal queries.

Why Adjudication Is Required:
Because `supersession_chain` is stored as an array of historical IDs on each row, lineage can be retrieved in a single `WHERE id IN (...)` query without recursive CTEs.

Final Disposition:
RESOLVED — Lineage is stored denormalized in `supersession_chain` (JSON array) and queried directly; superseded items excluded by default. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-004).
```

```
======================================================================
ID: REG-006-09
Task: ENG-006
Priority: P0
Category: Schema & Persistence
======================================================================
Question:
How are cross-project Knowledge references retrieved given that no `knowledge_references` table exists in `migrations/0001_authoritative_state.sql`?

Current Evidence:
- `src/domain/model.ts` L70-76 defines `KnowledgeReference` type.
- `migrations/0001_authoritative_state.sql` contains `projects`, `actions`, `accepted_context_facts`, `accepted_progress`, `knowledge_items`, and `persistence_operations`. There is no `knowledge_references` table.
- `SCN-009` requires cross-project knowledge reuse.

Flash Inference:
Assumed cross-project retrieval queries all `knowledge_items` where `standing = 'current'` across all projects, and qualifies them at runtime.

Why Adjudication Is Required:
Determines whether `ENG-006` requires a new schema migration (`0002_knowledge_references.sql`) or whether cross-project retrieval is purely query-level (`SELECT * FROM knowledge_items WHERE standing = 'current' AND originating_project_id != ?`).

Final Disposition:
RESOLVED — KnowledgeReference is COMPUTED at runtime via `referenceKnowledge()`, not persisted; no migration or table needed. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-003, P0-004).
```

```
======================================================================
ID: REG-006-10
Task: ENG-006
Priority: P0
Category: Task Boundary
======================================================================
Question:
When a project has >32 context items (facts + progress + knowledge), which component owns truncation/selection down to the `BoundedModelContext` limit?

Current Evidence:
- `BoundedModelContext` itemLimit is hard-capped at 32 (`modelCapability.ts` L147).
- `ARC-003` / RUNTIME_ARCHITECTURE.md L81: "Context assembly remains bounded by interaction need and selects no token-selection algorithm."
- `ENG-006` is a data retrieval service; `ENG-010` is interaction orchestration.

Flash Inference:
Suggested ENG-006 could apply a hard SQL `LIMIT 32`.

Why Adjudication Is Required:
Applying `LIMIT 32` in SQL causes arbitrary data omission before the interaction layer can inspect available items. ENG-006 should return all matching items for the query; ENG-010 must perform interaction-aware selection.

Final Disposition:
RESOLVED — ENG-006 returns full query results; ENG-010 owns interaction-aware selection and truncation within the ≤32 limit. See ENG-006_P0_ADJUDICATION_2026-08-15.md (P0-002).
```

```
======================================================================
ID: REG-006-11
Task: ENG-006 / ENG-010
Priority: P2
Category: Task Boundary / Downstream
======================================================================
Question:
When querying child collections (actions, facts, progress, knowledge) for a non-existent ProjectId, should ENG-006 return not-found or found: []?

Current Evidence:
- ENG-006 review finding R005 noted that SQL queries filtered by project_id return 0 rows ({ kind: "found", value: [] }) even when the parent Project does not exist in projects table.
- RUNTIME_ARCHITECTURE.md ARC-005 specifies direct SQL queries without redundant multi-query joins or artificial parent lookups.
- ENG-010 owns conversational interaction and context resumption orchestration.

Adjudication & Deferred Downstream Constraint:
RESOLVED — DEFERRED TO ENG-010.
Returning { kind: "found", value: [] } is the truthful result of the collection query.
ENG-010 must not assume that an empty child collection proves the parent project exists.
When Project existence matters, ENG-010 must explicitly establish parent existence via getProject(projectId) before interpreting child collections.
See ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md (R005).
```

---

### ENG-009: Workers AI Adapter (`@cf/zai-org/glm-4.7-flash`)

```
======================================================================
ID: REG-009-01
Task: ENG-009
Priority: P1
Category: Provider Binding
======================================================================
Question:
How should the Workers AI binding (`env.AI`) be injected and configured in `WorkersAIModelAdapter`?

Current Evidence:
- TypeScript Cloudflare Workers environment bindings are typically provided via `env: { AI: Ai }`.
- `ENGINEERING_PLAN.md` L118: "adapter-local Workers AI integration for configured `@cf/zai-org/glm-4.7-flash`".
- `ARC-006`: Initial candidate is `@cf/zai-org/glm-4.7-flash`, replaceable via configuration.

Flash Inference:
Assumed standard constructor injection of an `Ai` binding interface.

Why Adjudication Is Required:
Ensures the adapter constructor allows flexible injection for both production runtime bindings and mocked test bindings without importing Cloudflare runtime packages into domain/application layers.

Final Disposition:
UNRESOLVED (Pending Controller Task Packet definition)
```

```
======================================================================
ID: REG-009-02
Task: ENG-009
Priority: P1
Category: Provider Adapter
======================================================================
Question:
Where do prompt templates and system instruction strings live?

Current Evidence:
- `ModelCapabilityPort` (`src/application/ports/model/modelCapability.ts`) receives `ModelCapabilityRequest` (capability, interaction, context, constraints).
- RUNTIME_ARCHITECTURE.md L77: "Provider-specific response IDs, conversation/thread IDs, proprietary message structures... remain inside the provider adapter."

Flash Inference:
Prompt construction is an adapter-local implementation detail.

Why Adjudication Is Required:
Confirms that prompt formatting and system messages belong exclusively in `src/infrastructure/workersAi/`, with zero prompt templates in application or domain contracts.

Final Disposition:
UNRESOLVED (Confirmed adapter-local by architecture authority)
```

```
======================================================================
ID: REG-009-03
Task: ENG-009
Priority: P1
Category: Model Invocation
======================================================================
Question:
Should `propose-operations` capability use Workers AI Function Calling / Tools API, or structured JSON output prompting?

Current Evidence:
- RUNTIME_ARCHITECTURE.md L142: Cloudflare documents `@cf/zai-org/glm-4.7-flash` as supporting function calling and multi-turn tool calling.
- `ProposedOperation` (`modelCapability.ts` L300-344) defines 9 distinct operation variants.

Flash Inference:
Proposed that tool calling / function schemas should be used for operation proposals.

Why Adjudication Is Required:
Function calling provides schema validation at provider boundary, whereas prompt-based JSON output requires manual parser fallback. Adapter may support both or start with the simplest reliable mechanism.

Final Disposition:
UNRESOLVED (Engineering design choice for Task Packet)
```

```
======================================================================
ID: REG-009-04
Task: ENG-009
Priority: P1
Category: Response Parsing
======================================================================
Question:
Does ENG-009 require markdown parsing of model responses?

Current Evidence:
- `ModelCapabilityResult` discriminated union uses `NonEmptyText` for `content`, `summary`, and `reason` fields.
- No AST or markdown tokens are defined in domain or port contracts.

Flash Inference:
Flash analysis incorrectly listed "Markdown parsing" as an adapter responsibility.

Why Adjudication Is Required:
Markdown parsing is unauthorized and unnecessary; model output text is passed as raw `NonEmptyText` to application callers.

Final Disposition:
UNRESOLVED (Strong-model review recommends: MARKDOWN PARSING IS REJECTED / NOT AUTHORIZED)
```

```
======================================================================
ID: REG-009-05
Task: ENG-009
Priority: P0
Category: Error Normalization
======================================================================
Question:
What is the complete mapping from Workers AI HTTP/SDK errors to `ModelFailureCategory`?

Current Evidence:
- `ModelFailureCategory` (`modelCapability.ts` L380-388) allows: `"unavailable" | "timeout" | "rate-limited" | "refused" | "malformed-result" | "invalid-request" | "unknown"`.
- Workers AI can return HTTP 429 (rate limit), 400 (bad request), 500/502/503 (service unavailable/timeout), or refusal strings.

Flash Inference:
Proposed standard mapping: 429 -> `rate-limited`, timeout -> `timeout`, 5xx -> `unavailable`, unparseable -> `malformed-result`, safety block -> `refused`.

Why Adjudication Is Required:
Must ensure every possible exception or error structure from Workers AI produces a valid `ModelCapabilityResult` with `kind: "failure"`, and never throws an unhandled exception across the port boundary.

Final Disposition:
UNRESOLVED (Mapping matrix to be finalized in Task Packet)
```

```
======================================================================
ID: REG-009-06
Task: ENG-009
Priority: P1
Category: Reliability
======================================================================
Question:
Which failure categories must be marked `retryable: true` vs `retryable: false`?

Current Evidence:
- `ModelCapabilityFailure` has `retryable: boolean` (`modelCapability.ts` L391).
- Transient infrastructure failures (rate limits, timeouts, service unavailable) are generally retryable.
- Semantic failures (refused, invalid-request) are not retryable without changing the request.

Flash Inference:
`timeout`, `rate-limited`, `unavailable` -> `retryable: true`. All others -> `retryable: false`.

Why Adjudication Is Required:
Ensures consistent retry behavior for downstream callers in ENG-010 and ENG-011.

Final Disposition:
UNRESOLVED (Pending Controller Task Packet definition)
```

```
======================================================================
ID: REG-009-07
Task: ENG-009
Priority: P1
Category: Architecture / Types
======================================================================
Question:
How to enforce that Workers AI provider SDK types do not leak outside the adapter?

Current Evidence:
- RUNTIME_ARCHITECTURE.md L77: Provider-specific representations do not become domain/application contracts.
- `ENG-008` Delivery Record verifies provider-free imports.

Flash Inference:
Typecheck and import scanning tests should verify `src/application/**` and `src/domain/**` contain zero references to `@cloudflare/workers-types` AI namespaces or Workers AI SDKs.

Why Adjudication Is Required:
Standard verification requirement for provider portability.

Final Disposition:
UNRESOLVED (To be included in ENG-009 verification contract)
```

```
======================================================================
ID: REG-009-08
Task: ENG-009
Priority: P0
Category: Governance / Testing
======================================================================
Question:
Are live network calls to Cloudflare Workers AI permitted during ENG-009 implementation and verification?

Current Evidence:
- ENGINEERING_PLAN.md L118: "Implement the adapter-local Workers AI integration for configured `@cf/zai-org/glm-4.7-flash`, without live qualification."
- ENGINEERING_PLAN.md L122: `ENG-013` explicitly owns live model-candidate qualification with current provider-policy evidence.
- DELIVERY_CONTRACT.md Principle 3: Deterministic mock-based verification is required before live nondeterministic evaluation.

Flash Inference:
Confirmed that ENG-009 must rely 100% on mocked `env.AI` bindings for all unit, contract, and integration tests.

Why Adjudication Is Required:
Maintains strict task isolation and prevents non-deterministic network/quota failures from breaking CI or task acceptance.

Final Disposition:
UNRESOLVED (Strong-model review confirms: LIVE CALLS PROHIBITED IN ENG-009; RESERVED FOR ENG-013)
```

---

## ENG-003 Revision-3 governance closure chronology — 2026-08-21

- Prior deterministic verification failures and semantic review findings remain preserved in this register and their exact review records.
- The accepted Revision-3 successor sequence concluded with final deterministic `PASS`, final semantic `GREEN`, and Controller Closure `APPROVE` for implementation commit `5276481824e43d23345799c39efaa72e51235877`.
- Failed governance closure candidate `736bb4f160bdf021d9aabc01acafaeafc8367ee6` then received governance verification finding `GCV-001`: `ACCEPT`, `BLOCKING`, `CURRENT CONTRADICTION — stale executable Builder authority`.
- Controller disposition: `ACCEPT`. The candidate is frozen, rejected for canonical integration, and retained only as historical evidence.
- Fresh governance closure successor: pending independent governance closure verification. It records `GCV-001` as `CLOSED BY GOVERNANCE SUCCESSOR REPAIR` without relabeling any prior reviewer or model provenance.

## ENG-006 Repair Rev1 closure chronology — 2026-08-23

- Initial candidate `7b7db0d98660f6562f8e9738445be725fc65988c` passed its candidate-scoped deterministic verification but received semantic review `NEEDS FIX`; it remains frozen, unaccepted historical evidence.
- `ENG-006-R004` identified the upstream D1 collection-read capability gap. Accepted `ENG-003` Revision 3 closed R004 at the upstream ENG-003 level without altering the downstream findings.
- Fresh Repair Rev1 Builder candidate `a94d2cd2714849e7be59fd464f85330f98d127b4`, tree `6d4a20cb745b811724a8837e495ab3a19c32285b`, and aggregate `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda` was produced on accepted parent `f2ccb1c7c93d74124bba900065f4d08b781e7e8a`.
- Independent deterministic verification returned `ENG-006 REPAIR VERIFICATION: PASS` for the exact candidate.
- Independent semantic review returned `ENG-006 REPAIR REVIEW: GREEN` with zero blocking findings. No reviewer or model provenance is relabeled, and no Opus review is claimed.
- Controller Final Closure returned `APPROVE`; R001–R003 are closed, R004 remains closed upstream, R005 remains deferred to ENG-010, Repair Rev1 is accepted, and ENG-006 is done.
- The docs-only governance closure candidate is pending independent governance closure verification. Canonical integration and push have not been performed.

## ENG-007 Repair 6 closure chronology — 2026-08-25

- Historical failed candidates 1 through 6 (`e73bcd19...`, `b55d29cb...`, `514c68e5...`, `4bb8347b...`, `f1264737...`, `d6596fc5...`) remain frozen historical evidence.
- Repair 6 Builder candidate `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, and aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195` was produced directly from dispatch base commit `3d1fe482e0a8af2a1aa0d12c75fe0fee26c614a6`.
- Independent deterministic verification returned `ENG-007 REPAIR 6 DETERMINISTIC VERIFICATION: PASS` (420 / 420 test executions across all 14 configs).
- Independent semantic review returned `ENG-007 REPAIR 6 SEMANTIC REVIEW: GREEN`, confirming `ENG-007-SR-R002-R2` is semantically repaired.
- Controller Final Closure returned `APPROVE`; `ENG-007-SR-R001`, `ENG-007-SR-R002-R1`, `ENG-007-SR-R002-R2`, and `ENG-007-SR-R003` are closed; Repair 6 candidate is accepted; ENG-007 is `DONE`.
- Canonical branch `foundation/product-foundation` fast-forwarded to accepted candidate `e6b5f271d308fbac7e48667943005758efaf6d8b`.
- Current Builder is `NONE`; implementation authority is consumed and non-operative.

## ENG-010 Repair 5 closure chronology — 2026-08-27

- Historical failed candidates Candidate 1 (`100f7305...`), Repair 1 (`495f142f...`), Repair 2 (`d7f4a1ad...`), Repair 3 (`20f6a71c...`), and Repair 4 (`b2cabaf2...`) remain frozen, unaccepted historical evidence. None enters canonical ancestry.
- Repair 5 Builder candidate `1650008aa01f152f6aff4bacd9c6d19ab4531545`, tree `1ee87d345ee9ceed3bc301dbc9f42b3034655758`, aggregate `1430879aba612de7787351a81bdc23c54e0215e848bb654bb65d0d005f0e678f` was produced directly from dispatch base commit `36eaf2f1d9678d80c282b413f02892765455eec4`.
- Independent deterministic verification returned `ENG-010 REPAIR 5 DETERMINISTIC VERIFICATION: PASS` (517 test executions across all 16 Vitest configs; `git diff --check` exited 0 with empty output; RG-01 through RG-21 passed).
- Independent semantic review returned `ENG-010 REPAIR 5 SEMANTIC REVIEW: GREEN`, confirming `ENG-010-R4-SR-R001` (independent corroboration without token self-corroboration) and `ENG-010-R4-SR-R002` (whitespace defect) are resolved.
- Controller Final Closure returned `APPROVE`; all findings `ENG-010-DV-R001`, `ENG-010-R2-SR-R002`, `ENG-010-R4-SR-R001`, and `ENG-010-R4-SR-R002` are closed; Repair 5 candidate is accepted.
- Canonical branch `foundation/product-foundation` fast-forwarded to accepted candidate `1650008aa01f152f6aff4bacd9c6d19ab4531545`.
- Current Builder is `NONE`; implementation authority is consumed and non-operative.
- Independent post-integration canonical verification returned `ENG-010 POST-INTEGRATION CANONICAL VERIFICATION: PASS` (517 test executions across 16 Vitest configs; range diff checks clean; full toolchain clean).
- Controller Final Closure returned `APPROVE / DONE`; `ENG-010` is `DONE / ACCEPTED / CANONICALIZED / POST-INTEGRATION VERIFIED / GOVERNANCE-CLOSED`. Zero open strong-review requirements remain for ENG-010.

## ENG-011 Repair 2 finding chronology — 2026-08-28

- Candidate 1 `8baa7808...` and Repair 1 `dc558777...` remain frozen, unaccepted, historical, and non-canonical.
- Repair-2 candidate `49990f306ee67b62ae017f0d63fa556bde06d23a`, tree `b08c1f9d8ffa579a6cda3ed695293658a3697a81`, aggregate `6452eec02ebdd5e32c8274da852e501d2d0c1826c485d558354c4ac07b2867f0`, passed exact-candidate deterministic verification.
- Fresh independent security/operability/semantic review returned `FINDINGS` with nine blocking findings, `ENG-011-R2-SOR-R001` through `R009`.
- Controller adjudication accepted all nine findings and froze Repair 2 as unaccepted historical evidence.
- R006 established that the persistence port retains `committed` versus `already-committed`, but both accepted mutation services erase the distinction before orchestration. Truthful duplicate evidence requires the shared accepted-result contract, both service sources, and four focused unit/local-D1 regression paths.
- The original twelve-path lock was insufficient. Task Packet revision 2 has an exact nineteen-path Repair-3 scope; Formal DoR revision 2 is `PASS`; READY is `YES`; Repair 3 is `AUTHORIZED / DURABLY DISPATCHED` to Current Builder `ENG-011 REPAIR 3 BUILDER` on branch `eng-011-builder-repair-3` in worktree `/private/tmp/prj226-eng011-builder-repair-3`.
- Implementation is `NOT YET STARTED`; Human Reserved remains `NOT REQUIRED`; migration remains unchanged; no push was performed.

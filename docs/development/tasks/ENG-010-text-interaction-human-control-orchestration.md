# ENG-010 — Text Interaction and Human-Control Orchestration

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 1

**Controller planning revision:** 1

**Current task state:** `READY / DISPATCHED / NOT YET IMPLEMENTED`

**Formal DoR revision 1:** `PASS`

**READY:** `YES`

**Builder dispatch:** `AUTHORIZED / DURABLY RECORDED`

**Current Builder:** `ENG-010 BUILDER`

**Planned branch:** `eng-010-builder`

**Planned worktree:** `/private/tmp/prj226-eng010-builder`

**Builder authority:** `ACTIVE / BOUNDED TO EXACT 11-PATH LOCK`

**Implementation:** `NOT YET STARTED`

**Human Reserved:** `NOT REQUIRED`

**Formal DoR evidence:** [ENG-010 Formal Definition of Ready Evaluation — Revision 1](../analysis/ENG-010_FORMAL_DoR_REV1_2026-08-26.md)

**Authorization:** `GOV-018`

**Governing contract:** [Delivery Contract revision 1](../../../development/DELIVERY_CONTRACT.md)

## Task ID and objective

`ENG-010`

Integrate one bilingual Vietnamese / English text flow with advisory/state-changing separation, ambiguity clarification, recommendations, mixed outcomes, correction, and deletion confirmation.

The interaction orchestrator coordinates:
1. Ingress of user text in Vietnamese or English;
2. Authoritative state retrieval via Direct-SQL Retrieval Service (`ENG-006`);
3. Interaction-specific relevance selection and bounded context assembly (`itemLimit <= 32`);
4. Non-authoritative model inference / proposal via `ModelCapabilityPort` (`ENG-008` / `ENG-009`);
5. Clarification for ambiguous or insufficient interpretations;
6. Human Control classification and authorization via `HumanControlRuntime` (`ENG-002`);
7. Authoritative state mutation via existing application services (`ProjectActionContextService`, `KnowledgeProvenanceService`, `ExportDeletionService`);
8. Separate two-step conversational confirmation for destructive deletions (`ENG-007`);
9. Truthful final result composition distinguishing accepted changes from proposals, advice, clarifications, failures, and mixed outcomes.

## Normative authority and dependencies

- `GOV-018`, `ARC-001`, `ARC-003`, `ARC-005`, and `ARC-006` in the [Decision Register](../../foundation/DECISIONS.md) authorize implementation of text interaction and human-control orchestration while keeping domain authority paramount and model output advisory.
- [Runtime Architecture revision 1](../../architecture/RUNTIME_ARCHITECTURE.md) requires clear separation between inference and accepted state, bounded context construction, and single-turn direct retrieval without vector/cache layers.
- [Product Foundation revision 1](../../../product/PRODUCT_FOUNDATION.md) requires bilingual text fidelity (Vietnamese/English), unambiguous user authorization before state changes, truthful operation results, and explicit deletion confirmation.
- [Domain Model revision 1](../../../product/DOMAIN_MODEL.md) defines core entities, lifecycles, and Human Control invariants.
- [Delivery Contract revision 1](../../../development/DELIVERY_CONTRACT.md) governs task readiness, candidate binding, and review independence.

### Predecessor dependencies

| Dependency | Required state | Current state | Disposition |
| --- | --- | --- | --- |
| `ENG-001` | `DONE` | `DONE` | Satisfied (Transitive Foundation) |
| `ENG-002` | `DONE` | `DONE` | Satisfied (Transitive Foundation) |
| `ENG-003` | `DONE / ACCEPTED` (Rev 3) | `DONE / ACCEPTED` | Satisfied (Transitive Foundation) |
| `ENG-004` | `DONE` | `DONE` | Satisfied (Direct Predecessor) |
| `ENG-005` | `DONE` | `DONE` | Satisfied (Direct Predecessor) |
| `ENG-006` | `DONE / ACCEPTED` | `DONE / ACCEPTED` | Satisfied (Direct Predecessor) |
| `ENG-007` | `DONE / ACCEPTED` (Repair 6) | `DONE / ACCEPTED` | Satisfied (Direct Predecessor) |
| `ENG-008` | `DONE` | `DONE` | Satisfied (Direct Predecessor) |
| `ENG-009` | `DONE / ACCEPTED / CANONICALIZED` | `DONE / ACCEPTED` | Satisfied (Direct Predecessor) |

All direct and transitive predecessor dependencies are satisfied.

## Downstream constraints from upstream tasks

### ENG-006 Downstream constraint (R005)

Direct-SQL child collection queries (`getActionsForProject`, `getAcceptedContextFacts`, `getCurrentProgress`, `getCurrentKnowledgeForProject`) return `{ kind: "found", value: [] }` when filtered by a `projectId` that does not exist in the `projects` table.

- **Constraint on ENG-010:** ENG-010 must **NOT** interpret `{ kind: "found", value: [] }` from a child collection query as proof that the parent `Project` exists.
- **Implementation requirement:** When parent `Project` existence must be verified (such as during project resumption, establishing context, or before dispatching child-entity operations), ENG-010 must explicitly query `retrievalService.getProject(projectId)`. If `getProject` returns `{ kind: "not-found" }`, ENG-010 must treat the project as non-existent and fail or request clarification rather than proceeding on empty collections.

## Scope of responsibilities

### In-scope responsibilities

1. **Bilingual text interaction:** Support Vietnamese and English user interaction text without language-specific branch forks in business logic.
2. **Authoritative candidate retrieval:** Query `RetrievalService` for candidate entities (projects, actions, context facts, progress, knowledge items).
3. **Interaction relevance & context selection:** Select relevant candidates for the current turn and assemble a valid `BoundedModelContext` using `createBoundedModelContext` (`itemLimit <= 32`, non-empty `selectionReason`, `DATA-001` auth material screening).
4. **Model Capability invocation:** Construct valid `ModelCapabilityRequest` via `createModelCapabilityRequest` and invoke `ModelCapabilityPort.execute()`.
5. **Model outcome handling:**
   - `advisory`: return `AdvisoryOutcome` to the user; no mutation attempted.
   - `proposal`: interpret operations, present proposals, and initiate Human Control gating if user authorization is provided.
   - `uncertain`: return `ClarificationRequiredOutcome` or advisory clarification.
   - `unable`: return `UnresolvedOutcome` / user-visible unable message.
   - `failure`: return normalized failure outcome; never treat as accepted success.
6. **Human Control orchestration:**
   - Use `HumanControlRuntime` (`observeInteraction`, `classifyOrdinaryDirection`, `authorizeOrdinaryChange`, `classifyDeletionDirection`, `classifyDeletionConfirmation`, `authorizeConfirmedDeletion`).
   - Validate authorization tokens through `mutationGate`.
   - Never allow model proposals or inference to self-authorize state changes.
7. **Service execution:** Dispatch authorized mutations to:
   - `ProjectActionContextService` for Project, Action, Context Facts, and Progress mutations;
   - `KnowledgeProvenanceService` for Knowledge capture and correction;
   - `ExportDeletionService` for export and confirmed deletion.
8. **Clarification orchestration:** When intent, target entity, or effect is ambiguous, return `ClarificationRequiredOutcome` (`ambiguous-target` or `ambiguous-effect`) without executing mutations.
9. **Two-step confirmed deletion orchestration:**
   - Turn 1 (Direction): User expresses intent to delete; orchestrator classifies deletion direction and prompts for explicit confirmation.
   - Turn 2 (Confirmation): User confirms deletion in a separate interaction; orchestrator verifies separate interaction identity, classifies deletion confirmation, obtains `ConfirmedDeletionAuthorization`, and executes `deleteConfirmed`.
10. **Mixed outcome composition:** When an interaction encompasses multiple independent requests or operations, execute authorized portions, capture individual outcomes (`PortionOutcome`), and compose them into `MixedOutcome`.
11. **Accepted-state truthfulness:** Guarantee that no response reports accepted creation, update, or deletion unless the underlying service / persistence commit succeeded.

### Explicit non-goals

- No vector databases, embedding generation, or semantic indexing.
- No full-text search (FTS) engines or `LIKE '%...%'` SQL queries.
- No caching layer, queueing systems, or background task runners.
- No external search APIs or web retrieval.
- No provider router, fallback mechanism, or multi-provider coordination.
- No provider-hosted memory or chat history storage in third-party services.
- No second model interface; all model calls go through `ModelCapabilityPort`.
- No direct Workers AI SDK or Cloudflare runtime dependencies in application/domain layers.
- No live model qualification (reserved for `ENG-013`).
- No production deployment or paid-service activation.
- No new database migrations or schema alterations (v1 uses `migrations/0001_authoritative_state.sql`).
- No modifications to approved Product Foundation, Domain Model, or Runtime Architecture.

## Bounded model context contract

ENG-010 owns the assembly of `BoundedModelContext` from retrieved domain data:

1. **Ordering & Determinism:** Retrieved items are filtered by relevance to the current turn and sorted deterministically (e.g., active project facts first, latest progress next, relevant knowledge items).
2. **Item Bound:** Total context items must strictly satisfy `items.length <= itemLimit <= 32`.
3. **Provenance Preservation:**
   - `project-fact`: preserves `projectId`, `fact`, and `relevance`.
   - `action-summary`: preserves `projectId`, `actionId`, `summary`, and `relevance`.
   - `knowledge-excerpt`: preserves `knowledgeItemId`, `originatingProjectId`, `excerpt`, `relevance`, and `currentness` (`current` vs `qualified-prior`).
4. **DATA-001 Screening:** All context items and `selectionReason` strings are screened by `createBoundedModelContext` to reject credential/authentication patterns.
5. **Empty Context Behavior:** Valid context with `items: []` and an explicit `selectionReason` when no previous project context applies.

## Human Control and mutation gating contract

```text
[User Text Interaction]
         │
         ▼
[TrustedInteractionIngress.observeInteraction] ──► [TrustedInteractionEvidence]
         │
         ├── Advisory/Resumption? ───────────────► Return Advisory/Context (No mutation)
         ├── Ambiguous Target/Effect? ───────────► Return ClarificationRequiredOutcome
         ├── Ordinary State Change?
         │         │
         │         ▼
         │   [HumanControlSurface.classifyOrdinaryDirection]
         │         │
         │         ▼
         │   [HumanControlSurface.authorizeOrdinaryChange]
         │         │
         │         ▼
         │   [Service Execution via MutationGate.validateOrdinary]
         │         │
         │         ▼
         │   [Authoritative Persistence Commit]
         │
         └── Destructive Deletion?
                   │
                   ▼ (Turn 1: Direction Interaction)
             [HumanControlSurface.classifyDeletionDirection] ──► Prompt User Confirmation
                   │
                   ▼ (Turn 2: Separate Confirmation Interaction)
             [HumanControlSurface.classifyDeletionConfirmation]
                   │
                   ▼
             [HumanControlSurface.authorizeConfirmedDeletion]
                   │
                   ▼
             [ExportDeletionService.deleteConfirmed via MutationGate.validateDeletion]
```

## Proposed Builder write lock

The authorized write lock for ENG-010 consists of exactly the following 11 paths:

### Production write lock (4 paths)

1. `src/application/services/interaction/interactionTypes.ts`
2. `src/application/services/interaction/contextSelection.ts`
3. `src/application/services/interaction/interactionOrchestrator.ts`
4. `src/application/services/interaction/index.ts`

### Test & configuration write lock (7 paths)

1. `tests/application/services/interaction/contextSelection.test.ts`
2. `tests/application/services/interaction/interactionOrchestrator.test.ts`
3. `tests/application/services/interaction/interactionClarification.test.ts`
4. `tests/application/services/interaction/interactionDeletion.test.ts`
5. `tests/application/services/interaction/vitest.config.ts`
6. `tests/integration/d1/interaction/interactionD1.test.ts`
7. `tests/integration/d1/interaction/vitest.config.ts`

### Protected paths

All paths outside the 11 locked paths are strictly read-only during Builder execution:
- `src/domain/**`
- `src/application/contracts/**`
- `src/application/ports/**`
- `src/application/services/projectActionContext/**`
- `src/application/services/knowledgeProvenance/**`
- `src/application/services/retrieval/**`
- `src/application/services/exportDeletion/**`
- `src/infrastructure/**`
- `migrations/**`
- `package.json`, `package-lock.json`, `tsconfig.json`, root `vitest.config.ts`, `wrangler.toml`

## Deterministic evidence matrix

The following 27 evidence requirements must be covered by deterministic unit/service and integration tests:

| ID | Category | Obligation | Expected evidence |
| --- | --- | --- | --- |
| `TC-01` | Bilingual | Vietnamese advisory interaction | Vietnamese query returns advisory response without translation loss or error |
| `TC-02` | Bilingual | English advisory interaction | English query returns advisory response |
| `TC-03` | Human Control | Ordinary mutation flow | Ordinary user direction is classified, authorized, and committed via service |
| `TC-04` | Human Control | Mutation requiring clarification | Ambiguous effect or intent triggers `ClarificationRequiredOutcome` without mutation |
| `TC-05` | Human Control | Ambiguous target resolution | Ambiguous project/action target triggers clarification; no guessing |
| `TC-06` | Invariant | Proposal cannot self-authorize | Model `proposal` output without explicit user authorization executes zero mutations |
| `TC-07` | Truthfulness | Accepted-state truthfulness | Success is reported only when authoritative persistence succeeds |
| `TC-08` | Model Outcome | Model `uncertain` result | Model `uncertain` result produces user-facing clarification or bounded advice |
| `TC-09` | Model Outcome | Model `unable` result | Model `unable` result produces user-visible inability without side effects |
| `TC-10` | Model Outcome | Model `failure` result | Normalized model failure produces failed outcome; never accepted success |
| `TC-11` | Context | Bounded context limit & ordering | Context assembly strictly enforces `<= 32` items and deterministic ordering |
| `TC-12` | Security | DATA-001 egress screening | Authentication material in interaction or retrieved data is rejected at context creation |
| `TC-13` | Relevance | Interaction relevance selection | Orchestrator selects candidate items relevant to current turn |
| `TC-14` | Constraint | Empty-child collection constraint (R005) | Parent project existence explicitly verified via `getProject` before interpreting empty child collections |
| `TC-15` | Domain | Knowledge capture orchestration | Captured knowledge is saved with immutable origin and current standing |
| `TC-16` | Domain | Knowledge correction orchestration | Knowledge correction creates successor with supersession chain |
| `TC-17` | Domain | Project / Action / Context flow | Project establishment, action creation/completion, context facts append executed |
| `TC-18` | Composition | Mixed outcome flow | Multi-part request with mixed success/failure/clarification returns `MixedOutcome` |
| `TC-19` | Deletion | Deletion direction interaction | Deletion intent classified as deletion direction; prompts for confirmation |
| `TC-20` | Deletion | Separate confirmation interaction | Second interaction provides deletion confirmation with distinct interaction identity |
| `TC-21` | Deletion | Invalid deletion authorization | Single-turn deletion or mismatched scope fails authorization with zero persistence calls |
| `TC-22` | Deletion | Valid confirmed deletion | Two-turn confirmed deletion executes `ExportDeletionService.deleteConfirmed` |
| `TC-23` | Export | Export orchestration | Export request invokes `ExportDeletionService.exportAcceptedState` |
| `TC-24` | Boundary | Provider-native isolation | Zero provider SDK or adapter imports in interaction orchestration |
| `TC-25` | Testing | Deterministic model double | Unit tests execute deterministically with `DeterministicModelCapability` |
| `TC-26` | Invariant | No write from model result alone | Provider success alone never mutates persistence |
| `TC-27` | Truthfulness | Persistence failure truthfulness | D1 persistence error is reported as failure even if model inference succeeded |

## Local-D1 persistence integration contract

- **Unit / Service Tests (`tests/application/services/interaction/`):** Test orchestration logic, Human Control state machine, context selection, model outcome handling, and error branches using deterministic service doubles.
- **Local-D1 Integration Tests (`tests/integration/d1/interaction/`):** Test end-to-end orchestration against real D1 database instances (`miniflare` / local D1 emulator), executing real migrations (`0001_authoritative_state.sql`), real retrieval queries, real persistence writes, and real confirmed deletions.

## Full regression command matrix

| ID | Command | Target |
| --- | --- | --- |
| `RG-01` | `npm test` | Root smoke test |
| `RG-02` | `npx vitest run --config tests/domain/vitest.config.ts` | Domain unit tests |
| `RG-03` | `npx vitest run --config tests/application/ports/model/vitest.config.ts` | Model port tests |
| `RG-04` | `npx vitest run --config tests/application/services/projectActionContext/vitest.config.ts` | Project/Action service tests |
| `RG-05` | `npx vitest run --config tests/application/services/knowledgeProvenance/vitest.config.ts` | Knowledge provenance service tests |
| `RG-06` | `npx vitest run --config tests/infrastructure/d1/vitest.config.ts` | D1 foundation tests |
| `RG-07` | `npx vitest run --config tests/integration/d1/projectActionContext/vitest.config.ts` | Project/Action D1 integration tests |
| `RG-08` | `npx vitest run --config tests/integration/d1/knowledgeProvenance/vitest.config.ts` | Knowledge D1 integration tests |
| `RG-09` | `npx vitest run --config tests/application/services/retrieval/vitest.config.ts` | Retrieval service tests |
| `RG-10` | `npx vitest run --config tests/integration/d1/retrieval/vitest.config.ts` | Retrieval D1 integration tests |
| `RG-11` | `npx vitest run --config tests/application/services/exportDeletion/vitest.config.ts` | Export/Deletion service tests |
| `RG-12` | `npx vitest run --config tests/infrastructure/d1/exportDeletion/vitest.config.ts` | Export/Deletion D1 persistence tests |
| `RG-13` | `npx vitest run --config tests/integration/d1/exportDeletion/vitest.config.ts` | Export/Deletion D1 integration tests |
| `RG-14` | `npx vitest run --config tests/infrastructure/adapters/model/vitest.config.ts` | Workers AI adapter tests |
| `RG-15` | `npx vitest run --config tests/application/services/interaction/vitest.config.ts` | ENG-010 Interaction service tests |
| `RG-16` | `npx vitest run --config tests/integration/d1/interaction/vitest.config.ts` | ENG-010 Interaction D1 integration tests |
| `RG-17` | `npm run typecheck` | TypeScript root typecheck |
| `RG-18` | `npm run lint` | ESLint static analysis |
| `RG-19` | `npm run build` | Wrangler build dry-run |
| `RG-20` | `npm run smoke` | Vitest runtime smoke test |
| `RG-21` | `git diff --check <READY_BASE>...HEAD` | Whitespace & conflict check |

## Definition of Done

ENG-010 reaches `DONE` when all of the following conditions are satisfied:

1. Exactly the 11 locked paths differ from the READY base commit;
2. Bilingual interaction orchestration, bounded context construction, and ModelCapabilityPort invocation are implemented;
3. Human Control classification and authorization strictly gates all state mutations;
4. Two-turn confirmed deletion requires separate interaction evidence and additional confirmation;
5. All 27 traceability test requirements pass deterministically;
6. Local D1 integration tests pass against real database schema;
7. All 21 regression commands pass with zero failures;
8. Candidate is produced from the immutable READY base commit with a single parent;
9. Builder-independent deterministic verification is `PASS`;
10. Builder-independent semantic review is `GREEN`;
11. Delivery Record is durably finalized;
12. Repository remains clean with untracked analysis evidence intact.

## Human Reserved authority disposition

`NOT REQUIRED`. All orchestration and human control behaviors compose existing approved Product Foundation, Domain Model, and Runtime Architecture contracts without altering semantics or introducing new external resources.

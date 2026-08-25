# ENG-007 — Export and Confirmed Deletion

**Artifact class:** OPERATIONAL / TASK PACKET

**Lifecycle status:** DONE / ACCEPTED

**Task Packet revision:** 3

**Controller planning revision:** 3

**Task Packet state:** ACCEPTED / DONE

**Formal DoR:** PASS (INDEPENDENT RECHECK VERIFIED)

**Ready:** YES

**Current Builder:** NONE

**Builder dispatch:** CONSUMED / NON-OPERATIVE

**Implementation:** COMPLETE / ACCEPTED

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

**Planning authority base commit:** `37372d37f69ae9a9f72a180ad48384a83ae3c655`

**Planning authority base tree:** `2b7523b2fc858db3da88e69e3081206fdfd3d928`

**Planning revision 1:** `d7a6c0cf9d824e5f65e1eb5cc30144a063249fe4` — `FROZEN / UNACCEPTED / FAILED FORMAL DoR / HISTORICAL`

**Planning revision 2 (failed candidate):** `2acc99a5e75ba58ea4df53d6705ae5d44fe5bad8` — `FROZEN / UNACCEPTED / FAILED FORMAL DoR REVISION 2 / HISTORICAL`

**Planning revision 3:** `c056ba1f01cf05dfc57800a58bd49bfe3c730403` — `ACCEPTED / READY AUTHORITY / FORMAL DoR PASS`

**Implementation candidate 1 (failed candidate):** `e73bcd19d5ec9b4f2f939abcb8a4c807691198b7` — `FROZEN / UNACCEPTED / FAILED DETERMINISTIC VERIFICATION / HISTORICAL ONLY`

**Implementation candidate 2 (failed repair 1):** `b55d29cb77ae6acd2a8da37406aa47993c0d01e2` — `FROZEN / UNACCEPTED / HISTORICAL ONLY`

**Implementation candidate 3 (failed repair 2):** `514c68e5eaf4f140e1b978a7160c5c7a16343a9d` — `FROZEN / UNACCEPTED / HISTORICAL ONLY`

**Implementation candidate 4 (failed repair 3):** `4bb8347bd92a1533770b4c04de8c2738f7fcd20c` (tree `05cae77cd08d56231f096c243686cdf824f76d84`) — `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY`

**Implementation candidate 5 (failed repair 4):** `f12647374bef083b01b7289f823faa7d8625c733` (tree `907a934e9e5e5fb2727530ce6b07b83d8184a37e`) — `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY`

**Implementation candidate 6 (failed repair 5):** `d6596fc587fab55f4e9b49d4c9a40e041455440d` (tree `96629f4f114725f1ee0f0345259ef7320ceedd60`) — `FROZEN / UNACCEPTED / FAILED FINAL SEMANTIC RE-REVIEW / HISTORICAL ONLY`

**Assigned Builder:** `ENG-007 BUILDER REPAIR 6`

**Planned branch:** `eng-007-builder-repair-6`

**Planned worktree:** `/private/tmp/prj226-eng007-builder-repair-6`

**Human Reserved decision authority:** ENG-007 HUMAN RESERVED — EXPORT / DELETION SEMANTICS DISPOSITION, approved by `github:hdangprod`, decision status APPROVED

**Prepared:** 2026-08-25

> [!IMPORTANT]
> This is the **repaired** Planning Revision 3 Task Packet (`c056ba1f01cf05dfc57800a58bd49bfe3c730403`), promoted to `READY` after independent Formal DoR recheck `PASS` and durably recorded under Delivery Contract revision 1. All prior planning revisions and failed implementation candidates 1 through 6 are frozen historical evidence; none may be used as successor ancestry. Builder Repair 6 is assigned and dispatched under durable authority for implementation repair of `ENG-007-SR-R002-R2`. Implementation is not yet started.

## Task ID

`ENG-007`

## Objective

Deliver authoritative export of all retained accepted product state and exact-scope destructive deletion that executes only under the accepted ENG-002 confirmed-deletion authorization boundary.

Export must be deterministic, complete, versioned, read-only, and truthful. The export population is full retained accepted history as defined by Human Reserved decision `HR-EXPORT-001`.

Deletion must be non-cascading, atomically coupled to its idempotency receipt, visibly distinguish failure or indeterminate outcome from success, and make accepted deletion observable in later authoritative retrieval. Six public deletion scopes are authorized by Human Reserved decision `HR-DELETE-001`, including Knowledge Lineage as a separately confirmed destructive scope per `HR-DELETE-003`.

The task does not own conversational interpretation, target clarification, confirmation dialogue, model proposal execution, composition, or user-facing orchestration. Those remain with later `ENG-010`.

## Normative authority

- `GOV-018`, Engineering Phase authorization, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md) revision 1, especially `PF-KNW-001`, `PF-CTL-001`, `PF-DATA-001`, and `PF-QLT-001`.
- [Product Intent](../../../product/PRODUCT_REQUIREMENTS.md) revision 1, especially `PI-DATA-001` through `PI-DATA-008` and `PI-QLT-002`, `PI-QLT-003`, and `PI-QLT-007`.
- [Domain Model](../../../product/DOMAIN_MODEL.md) revision 1, especially Knowledge deletion, Human Control, and invariants 10 through 16.
- [Scenario Corpus](../../../product/SCENARIOS.md) revision 1, especially `INV-004`, `INV-005`, `INV-008`, `SCN-010`, and `SCN-011`.
- [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md) revision 1, especially architecture invariants 1 through 8, accepted memory, and state-changing interaction flow.
- `BEH-004`, `DATA-001`, `QLT-001`, `ARC-001`, `ARC-004`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- Completed [`ENG-002`](../delivery/ENG-002-domain-application-kernel.md), [`ENG-003`](../delivery/ENG-003-d1-authority-foundation.md), [`ENG-004`](../delivery/ENG-004-project-action-context-slice.md), [`ENG-005`](../delivery/ENG-005-knowledge-provenance-slice.md), and [`ENG-006`](../delivery/ENG-006-direct-sql-retrieval.md) Delivery Records and their accepted implementation contracts.
- ENG-007 HUMAN RESERVED — EXPORT / DELETION SEMANTICS DISPOSITION: `HR-EXPORT-001`, `HR-EXPORT-002`, `HR-DELETE-001`, `HR-DELETE-002`, `HR-DELETE-003`, `HR-DELETE-004`, and `ENG-007-DOR-R003` repair authority, approved by `github:hdangprod`.

## Dependencies and current readiness state

| Dependency | Required capability | State |
| --- | --- | --- |
| `ENG-002` | Trusted interaction ingress, deletion direction and confirmation classification, same-runtime and distinct-interaction enforcement, exact-scope authorization, and `MutationGate.validateDeletion` | `DONE` |
| `ENG-003` | Accepted D1 schema, prepared-statement abstraction, atomic batch/receipt pattern, retry fingerprinting, and collection reads | `DONE / ACCEPTED` |
| `ENG-004` | Accepted Project, Action, context-fact, and Progress persistence behavior | `DONE` |
| `ENG-005` | Accepted Knowledge origin, standing, and supersession behavior | `DONE` |
| `ENG-006` | Current-state and lineage retrieval contracts usable for applicable post-delete checks | `DONE / ACCEPTED` |

Implementation predecessors are satisfied. Formal task-level DoR was independently verified (`PASS`). The task remains `READY` and is dispatched to Builder Repair 6 under durable Delivery Record authority.

## Relevant accepted implementation boundary

ENG-007 must consume, without modifying or reconstructing, these accepted ENG-002 contracts from `src/application/contracts/humanControl.ts`:

- `DeletionScope` (extended with `"knowledge-lineage"` under Human Reserved authorization; see § Controlled upstream extension);
- `ConfirmedDeletionAuthorization`;
- `MutationGate.validateDeletion(authorization, scope)`; and
- an owning `HumanControlRuntime` supplied later by composition.

The accepted runtime alone creates trusted interaction evidence. Direction and confirmation must be classifications of two genuinely distinct trusted interactions from the same owning runtime and the exact same `DeletionScope`. Wrapper objects derived from one interaction remain the same interaction and cannot satisfy both roles. Caller IDs, booleans, strings, serialized claims, model output, proposals, or reconstructed data cannot create deletion authority.

ENG-007 receives an already exact `DeletionScope` and accepted authorization. It does not call `observeInteraction`, classify text, clarify a target, or issue authorization.

## Controlled upstream extension

ENG-007 is explicitly authorized by the Human Reserved decision `HR-DELETE-001` and `HR-DELETE-003` and the `ENG-007-DV-R001` finding disposition to extend the accepted ENG-002 `DeletionScope` contract so that exact Knowledge Lineage membership is structurally part of `DeletionScope` itself.

The repaired `DeletionScope` contract becomes a discriminated union:

```ts
export type DeletionScope =
  | {
      readonly targetKind: "knowledge-lineage";
      readonly targetId: string;
      readonly effect: "remove-retained-user-data";
      readonly lineageMembers: readonly string[];
    }
  | {
      readonly targetKind:
        | "project"
        | "action"
        | "knowledge-item"
        | "accepted-project-context"
        | "accepted-progress";
      readonly targetId: string;
      readonly effect: "remove-retained-user-data";
    };
```

### deletionScopeKey repair

The previous "algorithm unchanged" constraint is superseded ONLY as necessary to implement the already-approved exact-confirmed-membership semantics.

- For non-lineage scopes (`project`, `action`, `knowledge-item`, `accepted-project-context`, `accepted-progress`): preserve existing key behavior: `JSON.stringify([scope.targetKind, scope.targetId, scope.effect])`.
- For `knowledge-lineage`: the key MUST additionally bind the exact ordered lineage membership: `JSON.stringify([scope.targetKind, scope.targetId, scope.effect, scope.lineageMembers])`.

Different membership under the same root MUST produce a different scope key:
`K1 + [K1, K2, K3]` != `K1 + [K1, K2, K3, K4]`.

### Human Control binding invariant

Direction evidence and confirmation evidence must both correspond to the SAME exact `DeletionScope` (including `lineageMembers`).
- Direction scope `K1 + [K1, K2, K3]` with confirmation scope `K1 + [K1, K2, K3, K4]` cannot produce valid authorization (`authorizeConfirmedDeletion` fails).
- Authorization created for `K1 + [K1, K2, K3]` cannot validate mutation using `K1 + [K1, K2, K3, K4]`; `MutationGate.validateDeletion` rejects before persistence.

This does not reopen `ENG-002`. It is an explicitly authorized downstream repair of the accepted shared contract.

## Minimal public application surface

The future application service exposes exactly two public operations:

```ts
export interface ExportDeletionService {
  exportAcceptedState(): Promise<ExportAcceptedStateResult>;
  deleteConfirmed(command: ConfirmedDeletionCommand): Promise<ConfirmedDeletionResult>;
}
```

No search, selection, preview, conversational confirmation, bulk-wipe, cascade, restore, undo, correction, supersession, or composition method belongs in this surface.

### Confirmed deletion command

```ts
export interface ConfirmedDeletionCommand {
  readonly operationId: PersistenceOperationId;
  readonly scope: DeletionScope;
  readonly authorization: ConfirmedDeletionAuthorization;
}
```

The command contains no separate `confirmedLineageMembers` property. Exact lineage membership is structurally bound within `scope.lineageMembers`, providing a **Single Source of Truth** that cannot diverge from Human Control authorization evidence.

The command contains no caller-supplied interaction ID, confirmation flag, confirmation string, model result, arbitrary payload, or ambiguous selector. `operationId` is an idempotency identity, not evidence of human authorization.

For `scope.targetKind === "knowledge-lineage"`, `scope.lineageMembers` contains the deterministic ordered list of Knowledge Item IDs `[root, ..., current]` constituting the exact authoritative lineage at confirmation time. Together with the canonical `targetId` (root Knowledge Item ID), it forms the confirmed Knowledge Lineage deletion scope.

## Authoritative export contract

### HR-EXPORT-001 — Export population

The export population is `HR-EXPORT-001` Decision B: **Full Retained Accepted History**. The export MUST contain the authoritative user data that the system currently retains, including retained superseded accepted records where the product intentionally preserves them.

The export population includes, where present: Projects; Actions; authoritative Project context facts; accepted Progress; retained superseded accepted Progress; accepted Knowledge; retained superseded Knowledge; Knowledge provenance; and Knowledge supersession/lineage information required to represent retained Knowledge faithfully.

The export represents retained authoritative user data, not merely the current materialized snapshot.

Transient/model/session/derived runtime state is not part of this decision and must not be elevated into authoritative export data.

### HR-EXPORT-002 — Persistence receipts

`HR-EXPORT-002` Decision A: **Exclude**. Persistence-operation receipts / idempotency receipts are internal durability metadata. They MUST NOT be included in the user-facing export population. This exclusion does not prohibit their internal retention where required for correct durability/idempotency behavior.

### Selected representation

The Engineering Plan already selects simple machine-readable JSON as the reversible default. Product authority fixes no CSV, archive, filename, transport, or file layout. ENG-007 therefore returns a deterministic JSON document identified by a task-owned format name and integer version. Transport or conversational delivery remains downstream.

A successful document contains exactly:

```ts
export interface AcceptedStateExportV1 {
  readonly format: "liam-accepted-state-export";
  readonly version: 1;
  readonly projects: readonly Project[];
  readonly actions: readonly Action[];
  readonly acceptedContextFacts: readonly {
    readonly projectId: ProjectId;
    readonly ordinal: number;
    readonly fact: NonEmptyText;
  }[];
  readonly acceptedProgress: readonly AcceptedProgress[];
  readonly knowledgeItems: readonly KnowledgeItem[];
}
```

The successful result contains only the deterministic serialized JSON document defined above. A task-internal typed snapshot may be used to validate and serialize it, but is not a second public result representation.

### Content and authority rules

1. Export includes every retained accepted Project and its identity, intended outcome, and lifecycle.
2. Export includes every retained accepted Action and its identity, owning Project, description, and lifecycle.
3. Export includes every retained accepted context fact with its owning Project and ordinal.
4. Export includes current and superseded Accepted Progress with identity, Project, optional Action, content, standing, and `supersedesId` where present.
5. Export includes current and superseded Knowledge Items with identity, `originatingProjectId`, content, standing, `supersedesId`, and full stored `supersessionChain`.
6. Export represents the complete retained accepted historical state, not only ENG-006 current projections. It does not claim to be an event log or include data D1 does not hold.
7. `persistence_operations` receipts are excluded per `HR-EXPORT-002`.
8. Provisional `CurrentContext`, conversation/session history, model/provider state, recommendations, inferred context, retrieval rankings, logs, traces, and other derived or transient material are excluded.
9. No generated timestamp, random identifier, volatile diagnostic, or environment-specific metadata may make equivalent state serialize differently.
10. Stable order is Projects by ID, Actions by ID, context facts by Project ID then ordinal, Progress by ID, and Knowledge by ID. Object property order is fixed by the serializer contract.
11. Export is a pure authoritative read. It creates no receipt, audit row, durable export record, mutation, provider request, model context, or derived cache.
12. The export query must read all five product-state families through one coherent authoritative D1 read boundary. The selected v1 design is one prepared direct-SQL `SELECT` returning tagged, deterministically ordered rows across the accepted tables, so a partial series of successful table reads cannot be returned as a complete export.
13. The export MUST remain deterministic and versioned per `HR-EXPORT-001`.

### DATA-001 boundary

Export is a user data-control operation, not model-context egress or new Knowledge capture. It exports all retained accepted product state, including ordinary sensitive-domain project data. It does not apply ENG-005 capture regexes or ENG-008 model-egress filtering and must not introduce a third secret/DLP scanner. If malformed or historically invalid retained content is encountered, export fails truthfully rather than silently omitting the row. Authentication material remains prohibited from intended capture, but omission from an authoritative export is not an accepted repair mechanism.

### Export result envelope

```ts
export type ExportAcceptedStateResult =
  | {
      readonly kind: "exported";
      readonly format: "liam-accepted-state-export";
      readonly version: 1;
      readonly mediaType: "application/json";
      readonly document: string;
    }
  | {
      readonly kind: "export-failed";
      readonly reason: "authoritative-read-failed";
      readonly retryable: true;
    }
  | {
      readonly kind: "export-failed";
      readonly reason: "malformed-authoritative-state";
      readonly retryable: false;
    };
```

An empty database returns `exported` with all five arrays empty. A read exception or unavailable authoritative read returns retryable `authoritative-read-failed`. A structurally invalid D1 result, malformed row, invalid lifecycle/standing, invalid ordinal, invalid nullable relationship, or malformed Knowledge lineage returns non-retryable `malformed-authoritative-state`. No partial document is returned.

## Exact deletion scopes

Six public deletion scopes are authorized by `HR-DELETE-001`.

| Scope | `targetKind` | Target identity | Exact authoritative effect | Classification |
| --- | --- | --- | --- | --- |
| Project | `project` | `targetId` is the exact Project ID | Delete only the matching `projects` row | `CANONICALLY DELETEABLE` |
| Action | `action` | `targetId` is the exact Action ID | Delete only the matching `actions` row | `CANONICALLY DELETEABLE` |
| Project context-fact collection | `accepted-project-context` | `targetId` is the exact owning Project ID | Delete all `accepted_context_facts` rows for that Project; Accepted Progress is not included | `CANONICALLY DELETEABLE` as the accepted fact collection |
| Accepted Progress | `accepted-progress` | `targetId` is the exact Progress ID | Delete only the matching `accepted_progress` row | `CANONICALLY DELETEABLE` |
| Knowledge Item | `knowledge-item` | `targetId` is the exact Knowledge Item ID | Delete only the matching `knowledge_items` row, if and only if the item is **isolated** (not participating in a retained supersession lineage) | `CONDITIONALLY DELETEABLE` |
| Knowledge Lineage | `knowledge-lineage` | `targetId` is the ID of the **root / oldest** Knowledge Item in the retained linear supersession lineage | Atomically delete all and only the confirmed lineage member Knowledge Items | `CANONICALLY DELETEABLE` as the confirmed lineage |

Additional scope identities NOT authorized:

| Scope | Disposition |
| --- | --- |
| Entire accepted user state / whole-state wipe | `NOT AUTHORIZED` per `HR-DELETE-001` |
| Persistence operation receipts | `OUT OF ENG-007 DELETION SCOPE` |
| Implicit scope expansion | `NOT AUTHORIZED` per `HR-DELETE-001` |

The `effect` must be exactly `remove-retained-user-data`, as fixed by `DeletionScope`. Unknown target kinds, loose identifiers, lists, ranges, text selectors, inferred matches, or wildcard scopes are invalid before SQL construction.

## Non-cascade and referential behavior

Per `HR-DELETE-002` Decision A (**Conservative Non-Cascade**):

1. A deletion request MUST NOT implicitly delete authoritative data outside the exact confirmed scope. If authoritative dependent data prevents safe deletion, return deterministic `scope-conflict` and delete nothing. There is no implicit cascade. A user must separately request and confirm other deletion scopes where needed.
2. Atomic deletion of multiple records that are themselves explicitly defined as one confirmed scope does NOT count as an implicit cascade. Knowledge Lineage is one explicit deletion scope and may contain multiple Knowledge records.
3. No deletion cascades in application code or SQL. The accepted migration uses `ON DELETE RESTRICT` for Project ownership, optional Progress-to-Action ownership, and Progress/Knowledge supersession relationships.
4. Per `HR-DELETE-004`, Project deletion does NOT implicitly delete its dependent authoritative user data. If the Project still owns or requires retained dependent authoritative data — including Actions, Project context facts, accepted/retained Progress, or Knowledge originating from that Project — Project deletion MUST fail with `scope-conflict` and delete nothing. Knowledge provenance integrity must not be silently destroyed merely because Project deletion was requested. No Project cascade is authorized for ENG-007 v1.
5. Action deletion does not delete Progress. Referencing Progress causes visible `scope-conflict`.
6. Context-fact collection deletion removes only the Project's fact collection. It does not delete the Project, Actions, Progress, or Knowledge.
7. Progress and Knowledge deletion remove only the exact row. A referenced predecessor cannot be deleted while a successor remains; the FK causes visible `scope-conflict`.
8. Deleting a current lineage leaf (the only case where isolated Knowledge Item deletion may succeed) may leave retained superseded predecessors elsewhere in retained state. They remain explicitly superseded and are not returned as current by accepted ENG-006 projections.

## Knowledge lineage semantics

Per `HR-DELETE-003` Decision C (**Whole-Lineage Deletion as a Separately Confirmed Scope**):

### Isolated Knowledge Item

A Knowledge Item that has **no predecessor** (`supersedesId` is null) **and** **no successor** (no other Knowledge Item references it via `supersedes_id`) is an **isolated** item. It does not participate in a retained supersession lineage. The `knowledge-item` scope may delete it.

### Knowledge Item participating in a lineage

If a Knowledge Item participates in a retained supersession lineage (it has a predecessor, or a successor, or both), individual `knowledge-item` deletion MUST fail with `scope-conflict` and delete nothing. Direct deletion of an individual Knowledge Item that participates in such a lineage MUST NOT break the lineage.

### Knowledge Lineage canonical identity and exact scope structure

For `targetKind: "knowledge-lineage"`, the canonical `targetId` MUST be the ID of the **root / oldest** Knowledge Item in the retained linear supersession lineage, and `lineageMembers` MUST contain the exact deterministic ordered member IDs `[root, ..., current]`.

If the user or upstream application starts from any other member of the lineage, the application must first resolve the authoritative lineage and canonicalize the scope to its root Knowledge Item ID and exact member list BEFORE Human Control deletion-direction or deletion-confirmation evidence is issued.

Example:

```text
K1 ← K2 ← K3

Regardless of whether selection starts from K1, K2, or K3:
  targetKind     = "knowledge-lineage"
  targetId       = "K1"
  lineageMembers = ["K1", "K2", "K3"]
```

One logical destructive lineage scope must have one stable canonical identity for: exact-scope Human Control; two-interaction confirmation matching; operation-id/scope matching; persistence receipt semantics; and deterministic retry behavior. The current/latest node is NOT used as canonical `targetId` because that identity changes when the lineage receives a successor.

### Confirmed lineage-membership anti-expansion invariant and two defense layers

Canonical root identity alone is insufficient to authorize deleting members that did not belong to the lineage when deletion was confirmed. Exact lineage membership is structurally bound within `DeletionScope.lineageMembers`.

The system enforces **two distinct defense layers**:

#### Layer 1 — Human Authorization Binding (pre-persistence)

Human Control direction evidence, confirmation evidence, and confirmed deletion authorization bind the exact `DeletionScope` including its `lineageMembers`.

- If direction was obtained for `K1 + [K1, K2, K3]` but confirmation is attempted for `K1 + [K1, K2, K3, K4]`, confirmation authorization fails.
- If valid authorization exists for `K1 + [K1, K2, K3]`, attempting `MutationGate.validateDeletion(authorization, attemptedScope)` with `K1 + [K1, K2, K3, K4]` is rejected before any persistence read or delete.
- Reusing an old authorization to substitute an expanded lineage list is impossible because `MutationGate` verifies exact scope equality (including `lineageMembers`).

#### Layer 2 — Execution-Time Anti-Expansion (authoritative D1 state check)

Before destructive execution, the persistence adapter MUST:

1. verify deterministic structural validity of `scope.lineageMembers` (non-empty, `lineageMembers[0] === targetId`, no duplicate IDs, deterministic ordering);
2. resolve the authoritative lineage from the confirmed root in D1;
3. reconstruct its exact ordered member IDs;
4. compare them with `scope.lineageMembers`; and
5. proceed only on exact equality.

If the lineage in D1 changed after confirmation — including a newly-added successor (`K4`) — the service MUST return `scope-conflict` and:

- delete nothing;
- write no deletion receipt;
- not silently expand the confirmed scope;
- not automatically repair; and
- require a new destructive confirmation flow.

Neither layer substitutes for the other.

### Lineage deletion behavior

Knowledge Lineage deletion means:

- identify the exact retained supersession lineage represented by the confirmed scope;
- delete all Knowledge nodes belonging to that exact lineage atomically;
- delete no Knowledge outside that lineage;
- perform no implicit deletion of other authoritative dependent data.

If external authoritative dependencies make deletion of the lineage unsafe, the operation MUST fail with `scope-conflict` and delete nothing. No automatic lineage repair is authorized.

### D1 deletion ordering

The accepted schema uses `ON DELETE RESTRICT` on `knowledge_items.supersedes_id`. A D1 batch is transactional, but its DELETE statements still need to respect the actual foreign-key behavior. The implementation must derive and test the safe deletion order compatible with the accepted schema rather than assuming unordered deletes are valid within a batch.

For a linear `K1 ← K2 ← K3` where successor rows reference predecessors, the expected safe deletion order is **newest → oldest** (`K3`, `K2`, `K1`), but Formal DoR and implementation evidence must verify this against the accepted migration and real local D1 behavior.

No migration change is authorized unless a separate finding proves one is required.

## Deletion persistence and transaction contract

The task adds a task-owned provider-neutral application port and a task-owned D1 adapter. The application service depends on that port and never imports D1/SQL types. The adapter alone maps the six accepted scopes to fixed prepared SQL.

### Single-entity scopes (Project, Action, Accepted Progress, Accepted Project Context, isolated Knowledge Item)

Each deletion uses one D1 `batch` containing:

1. exactly one fixed-scope `DELETE` statement; and
2. one insert into the existing `persistence_operations` table with a task-namespaced canonical fingerprint of the exact `DeletionScope`.

### Knowledge Lineage scope

Each lineage deletion uses one D1 `batch` containing:

1. one ordered `DELETE` statement per confirmed lineage member, in deterministic FK-safe order; and
2. one insert into the existing `persistence_operations` table with a task-namespaced canonical fingerprint that includes `targetKind`, the canonical root `targetId`, `effect`, and `scope.lineageMembers`.

The receipt fingerprint for Knowledge Lineage MUST bind `scope.lineageMembers` so that a retry with the same operation ID but a different lineage state is detected as an `operation-id-conflict` (different fingerprint).

### Atomicity

The D1 batch is the selected atomic boundary. A delete without its receipt, or a receipt without its delete, must not become authoritative. Genuine migration-backed local D1 evidence must prove this atomicity, including an injected receipt/finalization failure. If the actual D1 behavior cannot prove the required boundary, implementation stops with `UPSTREAM_CAPABILITY_GAP` or `WRITE-LOCK EXPANSION REQUIRED`; it does not claim atomicity or widen the lock.

### Migration and schema disposition

| Potential change | Disposition | Reason |
| --- | --- | --- |
| Modify `0001_authoritative_state.sql` | `NOT REQUIRED / NOT AUTHORIZED` | Existing tables, FKs, triggers, and receipt table support the selected behavior. |
| Add a deletion/tombstone table | `NOT REQUIRED` | `Deleted` is not a retained state; existing receipts supply retry evidence. |
| Add export audit rows | `NOT REQUIRED` | Export is a pure read and authority requires no durable export record. |
| Add cascade FKs/triggers | `NOT AUTHORIZED` | Would invent destructive scope and alter accepted behavior. |
| Add deletion/export indices | `OPTIONAL OPTIMIZATION / OUT OF TASK` | No demonstrated need; v1 correctness does not require them. |

## Deletion result and retry contract

```ts
export type ConfirmedDeletionResult =
  | { readonly kind: "deleted"; readonly operationId: PersistenceOperationId; readonly scope: DeletionScope }
  | { readonly kind: "already-deleted"; readonly operationId: PersistenceOperationId; readonly scope: DeletionScope }
  | { readonly kind: "deletion-rejected"; readonly reason: "invalid-or-mismatched-authorization"; readonly scope: DeletionScope }
  | { readonly kind: "not-found"; readonly scope: DeletionScope }
  | {
      readonly kind: "deletion-failed";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason: "scope-conflict" | "operation-id-conflict" | "durability-inconsistency";
      readonly retryable: false;
    }
  | {
      readonly kind: "deletion-failed";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason: "authoritative-write-failed";
      readonly retryable: true;
    }
  | {
      readonly kind: "deletion-indeterminate";
      readonly operationId: PersistenceOperationId;
      readonly scope: DeletionScope;
      readonly reason: "persistence-outcome-unavailable" | "post-delete-verification-failed";
      readonly retryable: true;
    };
```

### Rules

1. The application validates the authorization against the exact scope (`MutationGate.validateDeletion(command.authorization, command.scope)`) before any read, delete, receipt lookup, or batch.
2. For `knowledge-lineage` scopes, `scope.lineageMembers` is structurally validated before persistence: it must be present, non-empty, with `lineageMembers[0] === targetId`, no duplicate IDs, and deterministic order. If invalid, the command is rejected as `deletion-rejected`.
3. A new operation ID with a present target may return `deleted` only after the atomic delete/receipt decision and successful authoritative absence verification.
4. For Knowledge Lineage: before executing, re-resolve the authoritative lineage from the root and compare against `scope.lineageMembers`. If they differ (e.g. lineage modified or expanded), return non-retryable `scope-conflict`.
5. Exact retry with the same operation ID and exact canonical scope (including `lineageMembers`) returns `already-deleted` when the matching durable receipt establishes the prior atomic delete. It performs no second deletion.
6. Reuse of the operation ID for a different scope (including different `lineageMembers`) returns non-retryable `operation-id-conflict` and performs no deletion.
7. A target absent under a new operation ID returns `not-found`, creates no receipt, and is not represented as a newly accepted deletion.
8. An already-deleted target retried under a different operation ID is `not-found`; only the original matching receipt establishes `already-deleted`.
9. FK/trigger/constraint refusal with no matching receipt returns non-retryable `scope-conflict`. No raw SQL or provider error is exposed.
10. A database failure known to occur before the batch, or a batch failure for which genuine D1 evidence establishes atomic rollback, returns retryable `authoritative-write-failed`. It creates no receipt and does not claim an accepted deletion.
11. If the adapter cannot establish whether the atomic operation committed, it returns `deletion-indeterminate`, never `deleted`. The caller retains the exact operation ID and scope for retry.
12. If post-delete absence verification fails, the result is `deletion-indeterminate`. An exact retry resolves from the matching receipt and may return `already-deleted` without repeating the delete.
13. A malformed provider response or missing receipt/result evidence is never coerced into success.
14. For Knowledge Item deletion: if the target participates in a retained supersession lineage (has predecessor or successor), return non-retryable `scope-conflict`.

### R003 repair — Durability-inconsistency semantics

Per the authorized `ENG-007-DOR-R003` repair:

```text
matching operation ID
+
matching exact deletion scope
+
target authoritatively absent
→ already-deleted / idempotent successful retry

matching operation ID
+
matching exact deletion scope
+
target still authoritatively present
→ deterministic non-success durability-inconsistency
→ no second delete
→ no new receipt
→ no false already-deleted result
→ no automatic repair

same operation ID
+
different deletion scope
→ operation-id-conflict

new operation ID
+
target absent
→ not-found
→ no receipt created
```

The `durability-inconsistency` reason is non-retryable. Deterministic evidence MUST cover this case.

## ENG-006 interaction boundary

ENG-006 remains immutable and is not reopened.

- Export does not use ENG-006 because ENG-006 intentionally exposes current projections and granular reads rather than complete retained historical state. ENG-007 uses its own task-owned authoritative export query through the D1 adapter.
- Post-delete verification may use the ENG-006 public surface where it can prove the relevant absence: Project and Knowledge Item lookup and current collection/lineage behavior.
- Action, context-fact collection, and Progress absence require the task-owned D1 adapter's exact authoritative verification because ENG-006 has no single-Action or single-Progress lookup and only current projections.
- No ENG-006 source, tests, result envelope, query, or export behavior changes under this task.

## ENG-010 and model boundary

ENG-007 does not own natural-language interpretation, bilingual wording, "probably delete" detection, conversational clarification, target selection, direction/confirmation collection, model proposal execution, mixed-request orchestration, composition root, routing, or user-dialog flow.

Later `ENG-010` must perform:

```text
understand request
-> identify exact target and effect
-> resolve authoritative lineage and canonicalize Knowledge Lineage scope to root
-> capture exact confirmed lineage membership snapshot
-> obtain trusted deletion direction and separate trusted confirmation
-> obtain ConfirmedDeletionAuthorization from the owning HumanControlRuntime
-> call ENG-007 with the exact scope, authorization, stable operation ID,
   and confirmedLineageMembers where applicable
-> render the normalized result
```

A `ModelCapabilityResult`, model proposal, `ProposedOperation`, provider tool call, advisory output, caller assertion, or intent string cannot be passed as deletion authorization. ENG-007 does not import the Model Capability Port.

## Allowed scope — exact write locks

### Production paths (4 files)

| Path | Content | Status |
| --- | --- | --- |
| `src/application/services/exportDeletion/exportDeletionTypes.ts` | Type definitions, command, result envelope, port | `NEW / TASK-OWNED` |
| `src/application/services/exportDeletion/exportDeletionService.ts` | Application service implementation | `NEW / TASK-OWNED` |
| `src/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence.ts` | D1 adapter implementation | `NEW / TASK-OWNED` |
| `src/application/contracts/humanControl.ts` | Extend `DeletionScope.targetKind` with `"knowledge-lineage"` | `MODIFY / CONTROLLED UPSTREAM EXTENSION` |

### Test paths (11 files)

| Path | Content | Status |
| --- | --- | --- |
| `tests/application/services/exportDeletion/exportDeletionService.test.ts` | Application service unit tests | `NEW / TASK-OWNED` |
| `tests/application/services/exportDeletion/vitest.config.ts` | Application Vitest configuration | `NEW / TASK-OWNED` |
| `tests/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence.test.ts` | D1 adapter unit tests | `NEW / TASK-OWNED` |
| `tests/infrastructure/d1/exportDeletion/fakeD1.ts` | Task-owned failure double | `NEW / TASK-OWNED` |
| `tests/infrastructure/d1/exportDeletion/vitest.config.ts` | Infrastructure Vitest configuration | `NEW / TASK-OWNED` |
| `tests/integration/d1/exportDeletion/exportDeletionD1Integration.test.ts` | Local D1 integration tests | `NEW / TASK-OWNED` |
| `tests/integration/d1/exportDeletion/localD1.ts` | Local D1 helper | `NEW / TASK-OWNED` |
| `tests/integration/d1/exportDeletion/node-runtime.d.ts` | Node runtime type declarations | `NEW / TASK-OWNED` |
| `tests/integration/d1/exportDeletion/vitest.config.ts` | Integration Vitest configuration | `NEW / TASK-OWNED` |
| `tests/application/contracts/humanControl.test.ts` | Extend with `knowledge-lineage` scope evidence | `MODIFY / CONTROLLED UPSTREAM EXTENSION` |
| `tests/application/contracts/authorization.runtime.test.ts` | Extend with `knowledge-lineage` authorization evidence | `MODIFY / CONTROLLED UPSTREAM EXTENSION` |

Total: **15 paths** (4 production + 11 test). No other paths may be created or modified.

## Forbidden scope — protected files

All existing accepted source, test, migration, configuration, delivery, and governance paths outside the exact write lock above are protected and must remain byte-identical. This includes but is not limited to:

- `migrations/0001_authoritative_state.sql`
- `src/domain/model.ts`, `src/domain/transitions.ts`, `src/domain/knowledge.ts`
- `src/application/contracts/operations.ts`
- All `src/application/services/` paths except the task-owned `exportDeletion/` directory
- All `src/application/ports/` paths
- All `src/infrastructure/d1/` paths except the task-owned `exportDeletion/` directory
- All `tests/` paths except the exact three test files in the write lock
- `wrangler.toml`, `tsconfig.json`, `package.json`, `package-lock.json`, `vitest.config.ts`
- `src/index.ts`, `src/worker.ts`
- All `docs/` and governance paths

If any protected production file must change, the Builder stops and reports exactly:

```text
WRITE-LOCK EXPANSION REQUIRED
```

The task cannot be promoted or continued until Controller disposition and renewed DoR establish that authority.

## Constraints and invariants

1. Export and deletion remain within one Liam deployable and the accepted application-to-D1 boundary.
2. Export returns complete retained accepted state or no export document. It never silently skips malformed or failed rows.
3. Export and deletion introduce no provider/model call, external integration, new service, cache, queue, search, vector, ORM, audit store, or hosted memory.
4. All deletion authorization is validated through the accepted owning `MutationGate`; no parallel confirmation system exists.
5. No delete occurs before valid scope-matching authorization.
6. No delete reports success before authoritative persistence and absence evidence establish it.
7. Atomic deletion and receipt behavior, exact retry, conflict, missing-target, constraint, durability-inconsistency, and indeterminate outcomes remain distinguishable.
8. Unrelated rows remain unchanged. No Project, Action, context, Progress, Knowledge, or lineage cascade is inferred.
9. Remaining Knowledge preserves origin, standing, and supersession lineage; remaining Progress preserves ownership, standing, and correction relationship.
10. Correction/supersession remains distinct from deletion, and no existing correction behavior changes.
11. Results and errors expose only normalized scope, operation identity, reason category, and retryability. They do not expose stored content, raw provider errors, SQL, credentials, stack traces, or database internals.
12. Persistence receipts remain out of export and out of deletion but continue to supply retry/conflict truth.
13. Knowledge Item deletion for items participating in a retained supersession lineage fails with `scope-conflict`; only Knowledge Lineage scope may delete them.
14. Knowledge Lineage deletion verifies confirmed membership against the authoritative lineage before execution; membership expansion fails with `scope-conflict`.
15. No automatic lineage repair is authorized.
16. All six deletion scopes require the existing accepted Human Control confirmation requirements per `HR-DELETE-001`.
17. A destructive operation is authorized only for the exact confirmed scope per `HR-DELETE-001`. No implicit expansion of a confirmed scope is authorized.

## Deterministic evidence matrix

### Export

| Case | Required evidence | Pass condition |
| --- | --- | --- |
| `E01` | Known accepted fixture export | Exact expected complete document |
| `E02` | Repeat export and different insertion orders | Byte-identical deterministic JSON ordering |
| `E03` | Projects and Actions | Identities, ownership, content, and lifecycle preserved |
| `E04` | Context facts | Project ownership and ordinal preserved |
| `E05` | Progress history | Current/superseded standing and `supersedesId` preserved |
| `E06` | Knowledge origin | Exact `originatingProjectId` preserved |
| `E07` | Knowledge history | Current/superseded standing, `supersedesId`, and full lineage preserved |
| `E08` | Empty accepted state | Valid exported document with five empty arrays |
| `E09` | Authoritative read failure | `export-failed`; no partial/fabricated document |
| `E10` | Malformed durable row/result/lineage | `malformed-authoritative-state`; no silent omission |
| `E11` | Receipt/model/session/derived fixtures | Excluded from document per HR-EXPORT-002 |
| `E12` | Sensitive-domain accepted content | Included without model-egress or capture-regex filtering |
| `E13` | Export execution inspection | One prepared read boundary, zero batch/write/receipt/provider calls |

### Destructive Human Control and Scope Binding

| Case | Required evidence | Pass condition |
| --- | --- | --- |
| `D01` | No authorization | Rejected; zero persistence access |
| `D02` | Direction only | Cannot produce accepted authorization; zero delete |
| `D03` | Confirmation only | Cannot produce accepted authorization; zero delete |
| `D04` | Same actual trusted interaction for both roles | Rejected |
| `D05` | Two wrappers from the same interaction | Rejected |
| `D06` | Two distinct trusted interactions, same runtime and exact scope | Authorization accepted and service gate validates |
| `D07` | Evidence/authorization from different runtimes | Rejected |
| `D08` | Direction/confirmation/service scope mismatch | Rejected; zero delete |
| `D09` | Fabricated evidence/authorization, boolean, string, serialized claim | Rejected |
| `D19` | Intent text says delete without accepted authorization | Zero delete |
| `D20` | Model/advisory/proposal result presented as authority | Zero delete |
| `HC-BIND-01` | Direction `K1 + [K1,K2,K3]`, Confirmation `K1 + [K1,K2,K3,K4]` | `authorizeConfirmedDeletion` fails; rejected |
| `HC-BIND-02` | Valid authorization `K1 + [K1,K2,K3]`, attempt `MutationGate.validateDeletion` with `K1 + [K1,K2,K3,K4]` | Rejected BEFORE persistence |
| `HC-BIND-03` | Valid authorization `K1 + [K1,K2,K3]`, D1 later becomes `[K1,K2,K3,K4]`, execution uses original authorized scope | `scope-conflict`; zero delete; zero receipt |
| `HC-BIND-04` | Reuse old authorization `K1 + [K1,K2,K3]` but attempt to substitute `[K1,K2,K3,K4]` in command scope | Rejected by Human Control / MutationGate before persistence (DV-R001 regression) |
| `HC-BIND-05` | Same root and same exact member values represented by independent immutable array instances | Same deterministic scope identity and scope key (value-based) |
| `HC-BIND-06` | Membership mutation after evidence creation attempted via JavaScript array aliasing | Authorization snapshot cannot be widened; mutation does not affect validated scope |

### Deletion durability, scope, and retry

| Case | Required evidence | Pass condition |
| --- | --- | --- |
| `D10` | Successful exact deletion for all six scope mappings | Target rows absent; matching receipt present; `deleted` |
| `D11` | Failure known before the batch or proven rolled back | `authoritative-write-failed`; no receipt, mutation, or false success |
| `D12` | Injected receipt/finalization or mid-batch failure | Genuine D1 proves atomic rollback and `authoritative-write-failed`; if outcome cannot be established, `deletion-indeterminate` and never false success |
| `D13` | Post-delete retrieval/authoritative query | Deleted material not returned as retained/current data |
| `D14` | Unrelated Projects, Actions, facts, Progress, and Knowledge | Byte/semantic equality before and after |
| `D15` | Remaining Knowledge/Progress lineages | Origin, standing, ownership, and supersession invariants preserved |
| `D16` | Exact operation ID and scope retry | `already-deleted`; one receipt; no second effect |
| `D17` | Operation ID reused with different scope | Non-retryable `operation-id-conflict`; no deletion |
| `D18` | Missing target and already-deleted target with new operation ID | `not-found`; no new receipt |
| `D21` | Project with any dependent rows | `scope-conflict`; no cascade and no receipt |
| `D22` | Action referenced by Progress | `scope-conflict`; Progress unchanged |
| `D23` | Superseded Progress/Knowledge predecessor with successor | `scope-conflict`; complete chain unchanged |
| `D24` | Current lineage leaf deletion (isolated item) | Only exact leaf removed; predecessors remain superseded |
| `D25` | Project context-fact collection deletion | All facts for exact Project removed; Progress and other families unchanged |
| `D26` | Post-delete verification read failure | `deletion-indeterminate`; exact retry resolves from receipt |
| `D27` | Raw D1/SQL/stack/credential-bearing error fixture | Only normalized reason/retry fields escape |
| `D28` | Receipt table inspection | Receipts excluded from export and never deleted |

### Knowledge Lineage

| Case | Required evidence | Pass condition |
| --- | --- | --- |
| `L01` | Knowledge Item in a retained lineage via `knowledge-item` scope | `scope-conflict`; entire lineage unchanged |
| `L02` | Isolated Knowledge Item via `knowledge-item` scope | `deleted`; no lineage affected |
| `L03` | Knowledge Lineage deletion of complete multi-node lineage | All confirmed members deleted atomically; receipt present; `deleted` |
| `L04` | Knowledge Lineage deletion with D1 FK ordering | Genuine local D1 proves the selected deletion order |
| `L05` | Knowledge Lineage membership changed after confirmation | `scope-conflict`; nothing deleted; no receipt |
| `L06` | Knowledge Lineage with newly-added successor after confirmation | `scope-conflict`; no silent expansion |
| `L07` | Knowledge Lineage `scope.lineageMembers` missing, empty, or structurally invalid | `deletion-rejected` |
| `L08` | Knowledge Lineage exact retry (same op ID, same scope, same members) | `already-deleted`; one receipt; no second deletion |
| `L09` | Knowledge Lineage op ID reused with different members/root | `operation-id-conflict` |
| `L10` | Knowledge Lineage with external dependency preventing deletion | `scope-conflict`; nothing deleted |
| `L11` | Post-lineage-delete retrieval | No deleted Knowledge returned; unrelated Knowledge unchanged |
| `L12` | `knowledge-item` and `knowledge-lineage` with equal `targetId` string | Distinct scopes; authorization for one does not satisfy the other |

### R003 durability-inconsistency

| Case | Required evidence | Pass condition |
| --- | --- | --- |
| `R01` | Matching operation ID, matching scope, target absent | `already-deleted`; idempotent |
| `R02` | Matching operation ID, matching scope, target present | `durability-inconsistency`; non-success; no second delete; no new receipt; no false already-deleted |
| `R03` | Same operation ID, different scope | `operation-id-conflict` |
| `R04` | New operation ID, target absent | `not-found`; no receipt |

## Genuine local D1 evidence

Migration-backed Miniflare/Wrangler local D1 is mandatory for:

- all six actual fixed `DELETE` statement sequences;
- `ON DELETE RESTRICT` behavior for Project ownership, Action-linked Progress, and Progress/Knowledge successor references;
- D1 batch atomicity between deletion and receipt for single-entity scopes;
- D1 batch atomicity for multi-statement Knowledge Lineage deletion and receipt;
- FK-safe deletion ordering within a Knowledge Lineage batch;
- receipt/finalization failure rollback;
- exact retry and conflicting operation-ID behavior;
- durability-inconsistency behavior (matching receipt + target present);
- missing-target/no-receipt behavior;
- post-delete direct queries and applicable ENG-006 retrieval checks;
- context collection deletion with unrelated-row preservation;
- isolated Knowledge Item deletion and lineage-participation rejection;
- Knowledge Lineage deletion with membership verification;
- current Knowledge/Progress leaf deletion and predecessor preservation; and
- migration hash and replay immutability.

A JavaScript fake is never the sole proof for destructive semantics, FK behavior, batch atomicity, or receipts. The accepted ENG-003 `FakeD1` is read-only and must not be modified. Any failure double remains confined to the task-owned test path.

## Regression contract

Root `npm test` is not the complete repository regression surface. Every applicable canonical task-local/config-scoped suite must execute explicitly because root `npm test` covers only the root configuration (`tests/foundation/**/*.test.ts`).

The canonical authority base (`37372d37f69ae9a9f72a180ad48384a83ae3c655`) contains these eleven Vitest configurations:

1. `vitest.config.ts` (root foundation smoke configuration)
2. `tests/domain/vitest.config.ts`
3. `tests/application/ports/model/vitest.config.ts`
4. `tests/application/services/knowledgeProvenance/vitest.config.ts`
5. `tests/application/services/projectActionContext/vitest.config.ts`
6. `tests/application/services/retrieval/vitest.config.ts`
7. `tests/infrastructure/adapters/model/vitest.config.ts` (canonical ENG-009 Workers AI adapter suite)
8. `tests/infrastructure/d1/vitest.config.ts`
9. `tests/integration/d1/knowledgeProvenance/vitest.config.ts`
10. `tests/integration/d1/projectActionContext/vitest.config.ts`
11. `tests/integration/d1/retrieval/vitest.config.ts`

The future ENG-007 implementation adds and must also run these three task-owned configurations:

12. `tests/application/services/exportDeletion/vitest.config.ts`
13. `tests/infrastructure/d1/exportDeletion/vitest.config.ts`
14. `tests/integration/d1/exportDeletion/vitest.config.ts`

Total: **14 explicit Vitest configurations**.

Required clean verification commands are:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npx vitest run -c tests/domain/vitest.config.ts
npx vitest run -c tests/application/ports/model/vitest.config.ts
npx vitest run -c tests/application/services/knowledgeProvenance/vitest.config.ts
npx vitest run -c tests/application/services/projectActionContext/vitest.config.ts
npx vitest run -c tests/application/services/retrieval/vitest.config.ts
npx vitest run -c tests/infrastructure/adapters/model/vitest.config.ts
npx vitest run -c tests/infrastructure/d1/vitest.config.ts
npx vitest run -c tests/integration/d1/knowledgeProvenance/vitest.config.ts
npx vitest run -c tests/integration/d1/projectActionContext/vitest.config.ts
npx vitest run -c tests/integration/d1/retrieval/vitest.config.ts
npx vitest run -c tests/application/services/exportDeletion/vitest.config.ts
npx vitest run -c tests/infrastructure/d1/exportDeletion/vitest.config.ts
npx vitest run -c tests/integration/d1/exportDeletion/vitest.config.ts
npm run smoke
npm run migrate:local
npm run build
git diff --check <AUTHORIZED_BASE>...HEAD
```

Observed historical test counts are evidence only and are not acceptance thresholds. Any missing configuration, command inability, test regression, unexpected count reduction, or uncommitted verification mutation is explicit failure/inability.

## Static and scope evidence

The verifier must prove:

- production application files contain no D1/SQL/Worker/model/provider imports;
- only the task-owned D1 adapter contains `SELECT`, `DELETE`, and receipt SQL;
- no `INSERT`, `UPDATE`, `UPSERT`, `DROP`, `ALTER`, cascade, wildcard delete, dynamic table/column interpolation, transaction string, or migration appears except the fixed receipt insert;
- no auth-material scanner, model context, provider call, interaction parser, composition root, new service/deployable, vector/search/cache/queue/ORM dependency, or generalized export framework appears;
- no accepted upstream, migration, root configuration, ENG-006, ENG-008, ENG-009, or ENG-010 path changed except the three controlled upstream extension paths in the write lock; and
- changed paths equal the exact production/test locks.

## Upstream Human Control evidence requirements

The controlled upstream extension requires the following Human Control evidence in the authorized test paths:

1. `knowledge-lineage` is a valid `DeletionScope` `targetKind` with `lineageMembers: readonly string[]`.
2. Two distinct trusted interactions for the same canonical lineage scope (including `lineageMembers`) produce valid confirmed deletion authorization.
3. A confirmation for one canonical lineage root or member set cannot authorize another root or member set.
4. `knowledge-item` and `knowledge-lineage` are distinct scopes even when their `targetId` strings are equal.
5. Ordinary authorization cannot substitute for confirmed deletion authority.
6. Existing foreign-runtime, fabricated-evidence, and same-interaction protections remain unchanged.

## Definition of Done

1. The exact two-method application surface and exact command/result contracts above are implemented without changing accepted Human Control or operation contracts beyond the authorized `knowledge-lineage` extension.
2. Export returns the complete retained accepted-state document per `HR-EXPORT-001` with stable ordering and full Progress/Knowledge history, or a truthful failure with no partial document.
3. All six accepted deletion scopes map to only their exact rows; no cascade or bulk user-state deletion exists.
4. Knowledge Item deletion of lineage participants fails with `scope-conflict`.
5. Knowledge Lineage deletion verifies confirmed membership against authoritative D1, deletes atomically in FK-safe order, and fails with `scope-conflict` on membership change or external dependency.
6. No persistence access occurs before exact scope-matching `MutationGate.validateDeletion` succeeds.
7. D1 atomically commits the exact deletion and namespaced receipt, and accepted success is returned only after authoritative absence evidence.
8. Exact retry, new-ID missing target, conflicting operation ID, FK scope conflict, durability-inconsistency, persistence failure, receipt failure, and post-verification failure match the contract above.
9. Deleted material is absent from later authoritative queries and applicable ENG-006 retrieval, while unrelated state and remaining provenance/supersession invariants remain intact.
10. Existing migration and every protected file remain byte-identical; no schema/index change exists.
11. Every evidence case and every canonical/future Vitest configuration passes with genuine local D1 destructive evidence.
12. Builder evidence is complete, exact-candidate deterministic verification returns `ENG-007 VERIFICATION: PASS`, and independent semantic review returns `ENG-007 REVIEW: GREEN` on the same immutable candidate.
13. All blocking findings are closed with required rechecks, Controller acceptance is recorded, and a distinct Delivery Record makes completion reconstructible.
14. The controlled upstream Human Control extension evidence passes, including `HC-BIND-01` through `HC-BIND-06`.

## Builder isolation and evidence contract

Builder Repair 6, dispatched after the existing Formal DoR `PASS`, must:

- create a fresh isolated worktree and branch directly from the exact dispatch base;
- prove exact base commit/tree, empty tracked diff, empty index, and empty untracked inventory before editing;
- verify the migration SHA-256 before work and after all checks;
- stop on any unrelated or untracked file inside the Builder worktree;
- stage only explicit authorized paths; never use `git add .`, `git add -A`, or broad wildcard staging;
- never reset, clean, stash, merge, rebase, cherry-pick a candidate, fetch, or push; and
- return a clean committed candidate without modifying the shared canonical worktree.

The Builder Delivery Record input must include:

1. authority base commit and tree;
2. candidate commit and tree;
3. exact candidate parent and direct-ancestry proof;
4. exact changed-path list;
5. per-file SHA-256 manifest;
6. path-sorted aggregate SHA-256 (sorted by repository path using `LC_ALL=C`);
7. migration SHA-256 before and after;
8. startup and final clean status;
9. all deterministic command outputs and genuine local D1 outputs;
10. evidence-case-to-requirement traceability;
11. forbidden-import/SQL and protected-path scans;
12. explicit-path staging proof; and
13. no-push attestation.

## Independent post-Builder gates

### Deterministic Verifier

The Verifier is read-only, independent of the Builder worktree, and cannot repair. It independently verifies commit/tree/parent/direct ancestry, exact write scope, per-file and aggregate hashes (path-sorted), migration immutability, all required suites, local D1 destructive evidence, Human Control cases (including Knowledge Lineage extension evidence and `HC-BIND-01`..`06`), post-delete truthfulness, exact staging, and worktree cleanliness.

Required disposition:

```text
ENG-007 VERIFICATION: PASS
```

or structured findings with exact failed evidence.

### Independent Semantic Reviewer

The Reviewer is independent of the Builder and cannot repair. The review binds to the exact candidate and covers export authority equality and completeness (HR-EXPORT-001 compliance), historical-state preservation, persistence receipt exclusion (HR-EXPORT-002 compliance), destructive confirmation, exact scope, same-interaction rejection, no cascade (HR-DELETE-002 compliance), durability truthfulness, batch atomicity, partial/indeterminate failure, retry/idempotency (R003 compliance), post-delete retrieval, Knowledge/Progress provenance, Knowledge Lineage canonical identity and membership anti-expansion (HR-DELETE-003 compliance), Project-owned data non-cascade (HR-DELETE-004 compliance), correction-versus-deletion separation, `QLT-001`, `DATA-001`, ENG-006/ENG-010 boundaries, upstream Human Control extension scope, and absence of architecture expansion.

Required disposition:

```text
ENG-007 REVIEW: GREEN
```

or structured findings. Controller acceptance occurs only after both independent gates pass and all blocking findings are closed.

## Risk classification

**HIGH — destructive user-data, authoritative export, Human Control, persistence atomicity, Knowledge Lineage integrity, provenance, and recovery risk.**

Required supplements are exact new-file locks plus the controlled upstream extension, no upstream writes beyond the authorized paths, same-runtime trusted authorization, genuine local D1 destructive evidence, task-namespaced receipts, explicit indeterminate and durability-inconsistency outcomes, exact candidate manifests, independent deterministic verification, and fresh full independent semantic/data review.

## Assignment

- **Planner / Controller:** owns the exact dispatch base, collision assessment, lifecycle state, findings, Delivery Record, and any write-lock disposition; the existing Formal DoR remains closed and passing.
- **Builder:** `ENG-007 BUILDER REPAIR 6`, Standard Delivery with strong TypeScript/D1/destructive-data capability and exclusive ownership of only the exact locks above.
- **Deterministic Verifier:** not yet assigned; later read-only Deterministic Execution responsibility independent of the Builder worktree.
- **Independent Reviewer:** not yet assigned; later Strong Semantic Reasoning responsibility, independent of the Builder.
- **Current write ownership:** Builder Repair 6 has exclusive ownership of the exact 15-path write lock for `ENG-007-SR-R002-R2` only.

## Human Reserved analysis

**Planning result:** `HUMAN RESERVED DECISIONS: RESOLVED`.

The following Human Reserved decisions are resolved by the approved disposition and incorporated exactly by this Task Packet:

| Decision | Resolution |
| --- | --- |
| `HR-EXPORT-001` | Decision B — Full Retained Accepted History |
| `HR-EXPORT-002` | Decision A — Exclude persistence receipts |
| `HR-DELETE-001` | 6 approved direct destructive scopes including Knowledge Lineage |
| `HR-DELETE-002` | Decision A — Conservative Non-Cascade |
| `HR-DELETE-003` | Decision C — Whole-Lineage Deletion as a Separately Confirmed Scope |
| `HR-DELETE-004` | Derived from HR-DELETE-002 — Project-owned data non-cascade |
| `ENG-007-DOR-R003` | Authorized for planning repair — durability-inconsistency semantics |

No new Human Reserved product, architecture, security, production, paid-resource, or external decision is required.

Stop and prepare a Human Reserved Decision Packet if implementation would require a new user-visible deletion scope, cascade, retention/backup/undo promise, different data-portability meaning, security-authority change, new schema/persistence strategy, protected upstream modification beyond the authorized `humanControl.ts` extension, new service/topology, paid resource, production deployment/provisioning/credential, destructive production action, or scope beyond `GOV-018`.

## Prior findings and disposition

### ENG-007-DV-R001 — Human Control binding defect / Scope expansion

**Status:** `ACCEPTED / BLOCKING / READY CONTRACT REPAIR APPLIED / CLOSED BY REVISION 3 DoR RECHECK`

The first implementation candidate revealed an internal contract defect in the READY Task Packet: Human Control authorization bound only `targetKind`, `targetId`, and `effect`, while exact lineage membership was supplied separately through `confirmedLineageMembers`. This allowed stale authorization for `K1 <- K2 <- K3` to be reused after the lineage expanded to `K1 <- K2 <- K3 <- K4` if the caller substituted the expanded list. Resolved in Revision 3 by making exact lineage membership structurally part of `DeletionScope.lineageMembers`, repairing `deletionScopeKey` to bind `lineageMembers`, establishing `MutationGate` pre-persistence validation, and enforcing two distinct defense layers. Closed by independent Formal DoR recheck.

### ENG-007-DV-R002 — Builder delivery evidence aggregate defect

**Status:** `ACCEPTED / NON-BLOCKING / DISPOSITIONED`

The first Builder sorted manifest lines by digest rather than repository path, leading to an aggregate digest mismatch. Clarified in Revision 3: aggregate calculation must sort by repository path using `LC_ALL=C`.

### ENG-007-SR-R001 — Authority / Delivery governance

**Status:** `CLOSED`

The durable delivery authority was recorded in repository state on commit `38befee569dcc91b6bd62226d4615336abccb602`. Closed for current lifecycle; must not regress.

### ENG-007-SR-R002 — Malformed scope coercion / identity serialization

**Status:** `CLOSED`

### ENG-007-SR-R002-R1 — Human Control malformed identity key serialization

**Status:** `CLOSED`

- **Severity:** `BLOCKING`
- **Classification:** `WORK_PRODUCT_DEFECT / HUMAN-CONTROL DATA-BOUNDARY / MALFORMED IDENTITY SERIALIZATION`
- **Root cause:** HumanControl deletion identity key generation uses `JSON.stringify` against raw caller-controlled scope values before strict primitive validation. Attacker-controlled `toJSON()` can therefore transform malformed `targetId` object or malformed `lineageMembers` member object into an apparently valid primitive identity during direction / confirmation / authorization key generation. Later replacing the raw object with the corresponding primitive lets the real MutationGate accept the previously minted authorization.
- **Disposition:** Repair 5 closed the malformed-identity serialization / `toJSON` substitution exploit. The closure must not regress.

### ENG-007-SR-R002-R2 — Hostile-Proxy error boundary / malformed lineage scope

**Status:** `CLOSED`

- **Severity:** `BLOCKING`
- **Classification:** `WORK_PRODUCT_DEFECT / HOSTILE-PROXY ERROR BOUNDARY / MALFORMED LINEAGE SCOPE`
- **Root cause:** The shared deletion-scope validator performs runtime inspection of caller-controlled lineage input outside its bounded exception path. In particular, `Array.isArray(rawLineageMembers)` can throw for a revoked Proxy, and reading `rawLineageMembers.length` can throw for an Array Proxy. Because `exportDeletionService` calls the validator outside a defensive catch, raw exceptions can escape through both Human Control classification and `deleteConfirmed` instead of producing bounded invalid-scope / deletion-rejected outcomes.
- **Repair requirement:** Every runtime inspection required to establish lineage-scope validity must occur inside a bounded exception path, including `Array.isArray`, length capture, indexed member access, duplicate/member validation, revoked Proxy behavior, and throwing Array Proxy traps. Human Control must return bounded unresolved / `invalid-deletion-scope`; the service must return `deletion-rejected`; persistence must receive zero calls; and no raw exception may escape.
- **Closure evidence:** Repair 6 candidate `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195`, passed fresh independent deterministic verification (`PASS`, 420 / 420 test executions across all 14 configs) and fresh independent semantic / data-boundary review (`GREEN`). Closed by Controller.

### ENG-007-SR-R003 — Missing receipt re-resolution on late receipt appearance

**Status:** `CLOSED`

Semantic re-review confirmed that receipt re-resolution across all 6 deletion scopes via `resolveAfterObservedAbsence` upon target pre-read absence is verified and without remaining blocker in receipt reconciliation, R003, D1 atomicity, lineage deletion, non-cascade, export, deterministic ordering, error normalization, DATA-001, or ENG-010/013. Closed for current lifecycle; must not regress.

### Implementation Candidate 1 (failed candidate)

**Status:** `FROZEN / UNACCEPTED / FAILED DETERMINISTIC VERIFICATION / HISTORICAL ONLY`

Commit `e73bcd19d5ec9b4f2f939abcb8a4c807691198b7`, tree `dd9c5db94e3899fec5469afad884b9d461150ada`, parent `37372d37f69ae9a9f72a180ad48384a83ae3c655`. Must not be amended, rebased, merged, or cherry-picked.

### Implementation Candidate 2 (failed repair 1)

**Status:** `FROZEN / UNACCEPTED / HISTORICAL ONLY`

Commit `b55d29cb77ae6acd2a8da37406aa47993c0d01e2`. Must not be amended, rebased, merged, or cherry-picked.

### Implementation Candidate 3 (failed repair 2)

**Status:** `FROZEN / UNACCEPTED / HISTORICAL ONLY`

Commit `514c68e5eaf4f140e1b978a7160c5c7a16343a9d`. Must not be amended, rebased, merged, or cherry-picked.

### Implementation Candidate 4 (failed repair 3)

**Status:** `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY`

Commit `4bb8347bd92a1533770b4c04de8c2738f7fcd20c`, tree `05cae77cd08d56231f096c243686cdf824f76d84`. Must not be amended, rebased, merged, or cherry-picked.

### Implementation Candidate 5 (failed repair 4)

**Status:** `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY`

Commit `f12647374bef083b01b7289f823faa7d8625c733`, tree `907a934e9e5e5fb2727530ce6b07b83d8184a37e`, parent `38befee569dcc91b6bd62226d4615336abccb602`. Must not be amended, rebased, merged, or cherry-picked.

### Implementation Candidate 6 (failed repair 5)

**Status:** `FROZEN / UNACCEPTED / FAILED FINAL SEMANTIC RE-REVIEW / HISTORICAL ONLY`

Commit `d6596fc587fab55f4e9b49d4c9a40e041455440d`, tree `96629f4f114725f1ee0f0345259ef7320ceedd60`, parent `c9b06b3e006188ebb7d1fd4ff21f851dc46fe327`. Deterministic verification passed, but final semantic/data-boundary review returned findings. It must not be amended, rebased, merged, cherry-picked, or used as Repair 6 ancestry.

### Implementation Candidate 7 (Repair 6 candidate)

**Status:** `ACCEPTED / CANONICALIZED`

Commit `e6b5f271d308fbac7e48667943005758efaf6d8b`, tree `d8bd1c0c0a920e94ce929b40362d5f042939b101`, parent `3d1fe482e0a8af2a1aa0d12c75fe0fee26c614a6`, aggregate `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195`. Deterministic verification passed with `PASS` (420 / 420 test executions across all 14 configs); semantic review passed with `GREEN`. Accepted and integrated into canonical ancestry.

### ENG-007-DOR-R001 — Export population

**Status:** `RESOLVED BY HUMAN RESERVED AUTHORITY`

The export population was a Human Reserved product decision. Resolved by `HR-EXPORT-001` Decision B. This Task Packet incorporates the decision exactly in § Authoritative export contract.

### ENG-007-DOR-R002 — Persistence receipt inclusion

**Status:** `RESOLVED BY HUMAN RESERVED AUTHORITY`

The persistence receipt export boundary was a Human Reserved product decision. Resolved by `HR-EXPORT-002` Decision A. This Task Packet incorporates the decision exactly.

### ENG-007-DOR-R003 — Retry semantics for durability-inconsistency

**Status:** `PLANNING REPAIR INCORPORATED / PREVIOUSLY PASSED DOR2 REVIEW`

The retry invariant when a matching receipt exists but the target is still authoritatively present was incompletely specified in Revision 1. Resolved by the authorized repair invariant. This Task Packet incorporates the repair exactly in § R003 repair and in evidence case `R02`.

### ENG-007-DOR2-R001 — Regression contract defect

**Status:** `ACCEPTED / NARROW PLANNING REPAIR APPLIED`

The failed Revision 2 candidate omitted `tests/infrastructure/adapters/model/vitest.config.ts` (the canonical ENG-009 suite) from the canonical base config inventory and from the required verification commands, omitted `npm run smoke`, and used `npx wrangler d1 migrations apply liam-db --local` instead of `npm run migrate:local`. Resolved by explicitly enumerating all 11 canonical base configs (plus 3 future task-owned configs for 14 total), adding `npm run smoke`, and using `npm run migrate:local`.

### Planning Revision 1

**Status:** `FROZEN / UNACCEPTED / FAILED FORMAL DoR / HISTORICAL ONLY`

Commit `d7a6c0cf9d824e5f65e1eb5cc30144a063249fe4`. Do not amend it. Do not use it as successor ancestry.

### Planning Revision 2 (failed candidate)

**Status:** `FROZEN / UNACCEPTED / FAILED FORMAL DoR REVISION 2 / HISTORICAL ONLY`

Commit `2acc99a5e75ba58ea4df53d6705ae5d44fe5bad8`. Do not amend it. Do not use it as successor ancestry.

## Stop conditions and unresolved blockers

The Controller disposition found no authority blocker. All findings are closed. Repair 6 implementation candidate is accepted.

## Current disposition

```text
ENG-007:
DONE / ACCEPTED

TASK PACKET:
REVISION 3 — ACCEPTED

REPAIR 6 CANDIDATE:
e6b5f271d308fbac7e48667943005758efaf6d8b — ACCEPTED

FORMAL DoR:
PASS (INDEPENDENT RECHECK VERIFIED)

DETERMINISTIC VERIFICATION:
PASS

SEMANTIC REVIEW:
GREEN

CURRENT BUILDER:
NONE

BUILDER DISPATCH:
CONSUMED / NON-OPERATIVE

HUMAN RESERVED:
NOT REQUIRED
```

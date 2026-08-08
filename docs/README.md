# Documentation Control Plane

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Approval decision:** `GOV-002`

**Approved by:** `github:hdangprod`

**Approved on:** `2026-08-08`

**Normative dependencies:** None.

**Approval provenance:** `GOV-002` in [foundation/DECISIONS.md](foundation/DECISIONS.md)

**Reference sources:** `README.md`, `AGENTS.md`, `FOUNDATION_SEED.md`, and [the Foundation Program](foundation/FOUNDATION_PROGRAM.md). Reference sources inform navigation or provenance; they are not normative approval dependencies.

This document defines how repository context becomes durable project memory. It is the control plane for document authority, not a product specification.

## Required reading order

1. [README.md](../README.md)
2. [AGENTS.md](../AGENTS.md)
3. `docs/README.md`
4. [docs/development/CURRENT.md](development/CURRENT.md)
5. Only the canonical documents linked by the current authorized work.

Do not read a historical or derived artifact as if it were current authority.

## Artifact classes and lifecycle status

Artifact class and lifecycle status are independent.

| Class | Meaning |
| --- | --- |
| `CANONICAL` | The sole normative owner for a defined topic when its lifecycle status is `APPROVED`. |
| `HISTORICAL` | Historical provenance or superseded context. It informs interpretation but cannot define current requirements or authorization. |
| `OPERATIONAL` | A current, concise execution snapshot or entry point. It cannot broaden authority granted by approved canonical artifacts. |
| `DERIVED` | Generated, extracted, or verification evidence that identifies its sources. It never becomes authority by itself. |

| Lifecycle status | Meaning |
| --- | --- |
| `DRAFT` | Incomplete working material; not review-ready or authoritative. |
| `PROPOSED` | Review-ready material; not authoritative until human approval is recorded. |
| `APPROVED` | Human-approved, exact revision recorded, and normative within its assigned topic. |
| `ACTIVE` | A current operational artifact or available historical reference. It records state or provenance but does not itself approve decisions. |
| `SUPERSEDED` | Retained history that points to its successor and no longer owns current authority. |

Valid lifecycle states are class-specific: `CANONICAL` uses `DRAFT`, `PROPOSED`, `APPROVED`, or `SUPERSEDED`; `HISTORICAL` uses `ACTIVE` or `SUPERSEDED`; `OPERATIONAL` uses `ACTIVE` or `SUPERSEDED`; and `DERIVED` uses `DRAFT`, `ACTIVE`, or `SUPERSEDED`. A lifecycle state outside the applicable set is invalid.

## Canonical ownership map

| Artifact | Class / status | Sole authority | Dependency or creation rule |
| --- | --- | --- | --- |
| [`README.md`](../README.md) | OPERATIONAL / ACTIVE | Repository entry point and reading path | Must not define detailed scope, current status, or architecture. |
| [`AGENTS.md`](../AGENTS.md) | CANONICAL / APPROVED, revision 1 | Stable AI execution constraints | Approved through `GOV-003`; contains no live project-state or gate-status content. |
| [`FOUNDATION_SEED.md`](../FOUNDATION_SEED.md) | HISTORICAL / ACTIVE | Founding provenance, discovery input, examples, and Generation 1 lessons | Non-normative provenance; not a current product specification or product-requirement source. |
| `docs/README.md` | CANONICAL / APPROVED, revision 1 | Document governance, ownership, dependencies, and precedence | Approved through `GOV-002`. |
| [`foundation/DECISIONS.md`](foundation/DECISIONS.md) | CANONICAL / APPROVED, revision 1 | Decision state, rationale, approval evidence, and supersession | Approved through `GOV-002`; individual decisions retain their own recorded state. |
| [`foundation/FOUNDATION_PROGRAM.md`](foundation/FOUNDATION_PROGRAM.md) | CANONICAL / APPROVED, revision 1 | Foundation stages, gates, sequencing, eligibility, and gate exit criteria | Approved through `GOV-001`; it defines sequence and eligibility only and does not approve G1 or authorize any stage. |
| [`development/CURRENT.md`](development/CURRENT.md) | OPERATIONAL / ACTIVE | Live operational snapshot | Reflects authorization recorded in governing artifacts; it does not create, extend, or approve authorization. |
| [`product/PRODUCT_REQUIREMENTS.md`](../product/PRODUCT_REQUIREMENTS.md) | CANONICAL / APPROVED, revision 1 | Approved product scope, outcomes, non-goals, capability map, and technology-neutral constraints | Created under human-approved C2 authorization `GOV-004`; approved through human G2 disposition `GOV-005`. |
| [`product/SCENARIOS.md`](../product/SCENARIOS.md) | CANONICAL / APPROVED, revision 1 | Scenario corpus, semantic acceptance evidence, Product Intent traceability, and explicit ambiguity record | Created under human-approved C3 authorization `GOV-006`; approved through human G3 disposition `GOV-007`, which also approves `VAL-001`. |
| [`product/DOMAIN_MODEL.md`](../product/DOMAIN_MODEL.md) | CANONICAL / APPROVED, revision 1 | Approved vocabulary, conceptual relationships, lifecycles, context authority, human-control semantics, and invariants | Created under human-approved C4 authorization `GOV-008`; approved through human G4 disposition `GOV-009`. |
| `development/DELIVERY_CONTRACT.md` | NOT_CREATED | Future delivery governance, Task Packet contract, and engineering DoR/DoD | Reserved for C6; creation requires prior authorization. |

`NOT_CREATED` is a reservation, not a lifecycle status and not authorization to create a document.

## Stage authorization

The Foundation Program defines sequence and eligibility. It does not automatically authorize execution of the next stage. Every reserved C2 artifact, including `product/PRODUCT_REQUIREMENTS.md`, requires both human approval of G1 and separate explicit human authorization to begin C2.

`G1 APPROVED != C2 AUTHORIZED`.

## Authority and precedence

Authority is topic-specific; there is no global file-precedence chain or “latest file wins” rule.

- `foundation/FOUNDATION_PROGRAM.md` owns Foundation stages, gates, eligibility, and exit criteria.
- `foundation/DECISIONS.md` owns human decision state, rationale, approval evidence, and supersession.
- `docs/README.md` owns documentation classes, lifecycle semantics, approval semantics, conflict semantics, dependency semantics, and this topic-authority mapping.
- `AGENTS.md` owns stable AI execution constraints.
- `development/CURRENT.md` owns the live operational snapshot only. It reflects recorded authorization; it does not create authorization.
- Future approved specifications own substantive product or architecture truth for their mapped topics.
- `README.md` is an entry point. Historical and derived artifacts are never current authority.

Human-recorded decision approval controls whether a canonical revision is approved. A future approved Task Packet may narrow work only; it cannot create or expand authorization. If artifacts claim the same topic inconsistently, or an operational snapshot conflicts with the governing approval, stop work and record or request a human decision. Do not resolve the conflict by recency, inference, or chat memory. For the AI execution response to such a conflict, use `AGENTS.md`.

## Approval and change rules

- Only a human owner may change a gate, product decision, or architecture decision to `APPROVED`.
- Approval evidence must record the approved artifact or decision ID, exact revision, approval date, and human approver in the repository.
- An AI may draft, propose, or update an authorized operational snapshot; it may not infer approval from discussion, tests, or absence of objection.
- A semantic change changes meaning, scope, behavior, authority, or a dependency. It returns affected approved material to `PROPOSED` and reopens dependent gates.
- An editorial-only change does not alter meaning. It requires a recorded reviewer attestation and does not reopen dependent gates. If classification is uncertain, treat the change as semantic.
- A chat statement is not durable project authority until recorded in its canonical repository artifact.

## Dependency, provenance, and supersession rules

- A normative dependency is an approved prerequisite that must be satisfied before an artifact or decision can be approved. It can affect approval eligibility.
- A provenance or reference source supplies history, context, navigation, or evidence. It cannot create an approval dependency or grant authority. `FOUNDATION_SEED.md` is provenance only.
- Cross-references are not dependencies unless explicitly labeled as normative dependencies.
- Documents may reference each other, but their approval eligibility must not form a circular normative dependency. The Foundation Program owns stages, gates, and gate exit criteria; this document owns documentation governance; the decision register owns decision state, human approval evidence, rationale, and supersession; `AGENTS.md` owns stable AI execution constraints; `CURRENT.md` owns only the live operational snapshot; and future approved specifications own substantive product or architecture truth for their mapped topics.

- A superseding artifact or decision must name what it supersedes; the superseded artifact or decision must link forward to its successor.
- Do not delete superseded reasoning solely because it is no longer current.
- A canonical document may be `APPROVED` only when every explicitly listed normative dependency is approved or explicitly accepted by the relevant gate.
- A semantic change to a dependency invalidates dependent approvals until human review records a new baseline.
- Derived artifacts must identify their canonical sources and source revisions; they cannot introduce requirements or decisions.

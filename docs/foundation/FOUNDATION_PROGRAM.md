# Generation 2 Foundation Program

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `hdangprod`

**Approved by:** `hdangprod`

**Approved on:** `2026-08-08`

**Approval decision:** `GOV-001`

**Approval provenance:** `GOV-001` in [DECISIONS.md](DECISIONS.md); G1 disposition remains recorded separately in `GOV-002`.
**Normative dependencies:** None.

## Purpose and authority

This is the sole authority for the Generation 2 Foundation Program: its stages, gates, sequencing, eligibility, and gate exit criteria. It does not define product requirements, product decisions, runtime architecture, technology choices, or runtime implementation.

Completion of a gate does not authorize the next stage. Each stage requires explicit human authorization recorded in repository governance before work for that stage begins.

## Program-wide rules

- A stage may begin only when its preceding gate is human-approved and the human has separately recorded authorization for that stage.
- Authorized outputs are limited to the named program artifacts and do not become normative until their required human approval is recorded.
- A gate is eligible for human review only when its listed exit criteria have evidence in the repository. Gate approval remains a human decision.
- A later-stage reference is a sequence or eligibility reference, not present authorization.
- Runtime source code, runtime architecture design, technology selection, deployment, and product decisions are prohibited throughout this program unless a later, separately approved authorization explicitly permits them.

## Stages

### C1 — Documentation Governance

- **Goal:** Establish durable document authority, reading order, lifecycle semantics, decision records, and a live project-state snapshot.
- **Authorized outputs:** Proposed governance artifacts, the Foundation Program, decision-register updates, and G1 verification evidence.
- **Prohibited work:** Product definition, scenario definition, domain modeling, runtime architecture, technology selection, and runtime source code.
- **Dependencies and preconditions:** `GOV-001` working-plan approval and explicit human authorization limited to C1.
- **Human approval requirement:** Human approval of G1 through `GOV-002`; this does not authorize C2.
- **Exit criteria:** G1 criteria in this document are met and independently reviewable from repository artifacts.

### C2 — Product Intent

- **Goal:** Establish proposed product intent and the decision context needed to define an approved v1 boundary.
- **Authorized outputs:** Only product-intent materials and decision-record updates explicitly authorized by the human for C2.
- **Prohibited work:** Treating seed hypotheses as approved requirements; scenario corpus work; domain modeling; runtime architecture; technology selection; and runtime source code.
- **Dependencies and preconditions:** G1 approved and explicit human authorization for C2 recorded.
- **Human approval requirement:** Human approval of G2 after C2 evidence is complete; C3 still requires separate authorization.
- **Exit criteria:** C2 has an independently reviewable proposed product-intent baseline, its unresolved decisions are recorded, and no excluded work has been introduced.

### C3 — Scenario and Acceptance Evidence

- **Goal:** Establish proposed user-scenario and semantic-acceptance evidence for the approved product-intent baseline.
- **Authorized outputs:** Only scenario-corpus and acceptance-evidence materials and decision-record updates explicitly authorized by the human for C3.
- **Prohibited work:** Expanding product scope without a recorded decision; domain-model finalization; runtime architecture; technology selection; and runtime source code.
- **Dependencies and preconditions:** G2 approved and explicit human authorization for C3 recorded.
- **Human approval requirement:** Human approval of G3 after C3 evidence is complete; C4 still requires separate authorization.
- **Exit criteria:** Proposed scenario evidence is traceable to product intent, gaps and open decisions are recorded, and no excluded work has been introduced.

### C4 — Domain and Lifecycle Semantics

- **Goal:** Establish proposed domain vocabulary, conceptual relationships, lifecycles, and invariants needed to interpret approved product intent and scenarios.
- **Authorized outputs:** Only domain-semantics materials and decision-record updates explicitly authorized by the human for C4.
- **Prohibited work:** Runtime data schemas, persistence design, API design, runtime architecture, technology selection, and runtime source code.
- **Dependencies and preconditions:** G3 approved and explicit human authorization for C4 recorded.
- **Human approval requirement:** Human approval of G4 after C4 evidence is complete; C5 still requires separate authorization.
- **Exit criteria:** Proposed semantics are traceable to product intent and scenarios, unresolved choices are recorded, and no excluded work has been introduced.

### C5 — Product Foundation Baseline

- **Goal:** Reconcile the approved product-intent, scenario, domain, data-control, and quality decision evidence into a proposed product-foundation baseline.
- **Authorized outputs:** Only baseline, traceability, and decision-record materials explicitly authorized by the human for C5.
- **Prohibited work:** Runtime architecture design, provider or technology selection, implementation planning, and runtime source code.
- **Dependencies and preconditions:** G4 approved and explicit human authorization for C5 recorded.
- **Human approval requirement:** Human approval of G5 after C5 evidence is complete; C6 still requires separate authorization.
- **Exit criteria:** The proposed baseline is internally traceable, unresolved decisions are explicit, and no excluded work has been introduced.

### C6 — Delivery Governance

- **Goal:** Establish proposed provider-neutral delivery governance and the engineering work-contract process needed before any implementation authorization can be considered.
- **Authorized outputs:** Only delivery-governance and decision-record materials explicitly authorized by the human for C6.
- **Prohibited work:** Runtime architecture design, technology selection, implementation tasks, runtime source code, and deployment.
- **Dependencies and preconditions:** G5 approved and explicit human authorization for C6 recorded.
- **Human approval requirement:** Human approval of G6 after C6 evidence is complete; C7 still requires separate authorization.
- **Exit criteria:** Proposed delivery governance identifies required human approvals, evidence expectations, and scope controls without authorizing engineering work.

### C7 — Engineering-Entry Readiness

- **Goal:** Determine whether the approved foundation and delivery governance provide sufficient evidence for a human to consider a separately scoped engineering authorization.
- **Authorized outputs:** Only readiness evidence, gap records, and decision-register updates explicitly authorized by the human for C7.
- **Prohibited work:** Treating readiness as engineering authorization; runtime architecture design; technology selection; runtime source code; and deployment.
- **Dependencies and preconditions:** G6 approved and explicit human authorization for C7 recorded.
- **Human approval requirement:** Human approval of G7; any architecture or engineering work additionally requires a separate human authorization with its own scope.
- **Exit criteria:** Readiness evidence identifies remaining gaps, confirms authorization boundaries, and makes no claim that runtime work is authorized.

## Gates

| Gate | Purpose | Review preconditions | Human approval requirement | Exit criteria |
| --- | --- | --- | --- | --- |
| G1 — Documentation Governance | Assess C1 governance baseline. | C1 evidence exists; reading path, ownership, statuses, and decision records are reviewable. | A human records the disposition of `GOV-002`. | The C1 exit criteria and G1 verification evidence below are satisfied. |
| G2 — Product Intent | Assess C2 product-intent baseline. | C2 was separately authorized; C2 exit evidence exists. | A human records the G2 decision. | C2 exit criteria are satisfied. |
| G3 — Scenario and Acceptance Evidence | Assess C3 scenario evidence. | C3 was separately authorized; C3 exit evidence exists. | A human records the G3 decision. | C3 exit criteria are satisfied. |
| G4 — Domain and Lifecycle Semantics | Assess C4 semantics. | C4 was separately authorized; C4 exit evidence exists. | A human records the G4 decision. | C4 exit criteria are satisfied. |
| G5 — Product Foundation Baseline | Assess C5 baseline. | C5 was separately authorized; C5 exit evidence exists. | A human records the G5 decision. | C5 exit criteria are satisfied. |
| G6 — Delivery Governance | Assess C6 delivery governance. | C6 was separately authorized; C6 exit evidence exists. | A human records the G6 decision. | C6 exit criteria are satisfied. |
| G7 — Engineering-Entry Readiness | Assess C7 readiness. | C7 was separately authorized; C7 exit evidence exists. | A human records the G7 decision. | C7 exit criteria are satisfied; no runtime work is authorized by this gate alone. |

## G1 exit criteria and required verification evidence

G1 is eligible for human review only when repository evidence demonstrates all of the following:

1. Only C1-authorized paths changed.
2. No runtime or C2 artifacts exist.
3. The required reading path resolves.
4. Topic authority ownership is non-circular.
5. Decision states and required decision-record fields are valid.
6. `GOV-001` is the only approved decision; `GOV-002` remains `PROPOSED`.
7. Product decisions remain `OPEN` or `DEFERRED` as recorded.
8. Semantically changed C1 canonical artifacts, except the separately approved Foundation Program revision 1, remain `PROPOSED` pending G1 human approval. Approval of the Foundation Program does not approve G1.
9. `CURRENT.md` contains runtime prohibitions and does not authorize C2.
10. `FOUNDATION_SEED.md` is non-normative provenance, not an approved product requirement source.
11. This Foundation Program and these G1 criteria are reconstructible from repository artifacts alone.

The verification results and any exception must be recorded in `GOV-002`; recording results does not change its status to `APPROVED`.

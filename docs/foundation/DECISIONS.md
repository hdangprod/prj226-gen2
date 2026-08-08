# Foundation Decision Register

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Approval decision:** `GOV-002`

**Approved by:** `github:hdangprod`

**Approved on:** `2026-08-08`

**Normative dependencies:** None.

**Reference sources:** `FOUNDATION_SEED.md`, [documentation control plane](../README.md), and [Foundation Program](FOUNDATION_PROGRAM.md).
**Approval provenance:** `GOV-002` below

This register is the durable record of decision state, rationale, approval evidence, and supersession. It does not replace the canonical document that owns the current requirement after approval.

## Decision states

| State | Meaning |
| --- | --- |
| `OPEN` | A decision is required and not yet proposed for approval. |
| `PROPOSED` | A review-ready decision awaits human disposition. |
| `APPROVED` | A human owner approved the decision; evidence is recorded below. |
| `REJECTED` | A proposed option was explicitly not adopted. |
| `DEFERRED` | The decision is intentionally postponed and cannot be inferred in the meantime. |
| `SUPERSEDED` | A prior decision is retained for history and replaced by a named successor. |

## Record format

Each record contains: ID, question, status, decision owner, rationale, alternatives, dependencies (labeled `Normative dependencies` when they affect approval eligibility), affected artifacts, approval evidence, supersedes, and superseded by.

## Governance

### GOV-001 — Foundation Program working plan

- **Question:** Adopt the Generation 2 Foundation Program as the working plan while limiting authorization to C1.
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Establish a durable, model-independent documentation program before product or runtime work.
- **Alternatives:** Continue with seed-only governance; create the full documentation program at once; adopt the staged C1–C7 program.
- **Dependencies:** None.
- **Affected artifacts:** `docs/foundation/FOUNDATION_PROGRAM.md`, `docs/README.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `README.md`, `AGENTS.md`, `FOUNDATION_SEED.md`.
- **Approved artifact:** `docs/foundation/FOUNDATION_PROGRAM.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `hdangprod`.
- **Approval evidence:** The human owner explicitly approved Foundation Program revision 1.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-003 — Bootstrap Agent Authority

- **Question:** Approve `AGENTS.md` revision 1 as the binding bootstrap agent-execution authority for the Generation 2 Foundation Program.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** Establish stable, binding AI execution constraints without embedding live project or gate state in `AGENTS.md`.
- **Alternatives:** Leave `AGENTS.md` proposed pending G1; retain dynamic project-state content in `AGENTS.md`; establish a separate bootstrap authority.
- **Dependencies:** None.
- **Affected artifacts:** `AGENTS.md`.
- **Approved artifact:** `AGENTS.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved `AGENTS.md` revision 1 as binding bootstrap agent-execution authority, provided its dynamic project-state content is removed.
- **Does not approve:** G1; C2; runtime architecture; runtime implementation.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-002 — G1 documentation-governance baseline

- **Question:** Approve the C1 documentation-governance baseline for G1.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G1 requires explicit human approval of the C1 documentation-governance baseline before C2 product-definition work can be considered; G1 approval does not itself authorize C2.
- **Alternatives:** Approve the C1 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-001`; C1 verification evidence satisfying the G1 exit criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md#g1-exit-criteria-and-required-verification-evidence).
- **Affected artifacts:** `docs/foundation/FOUNDATION_PROGRAM.md`, `docs/README.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `README.md`, `AGENTS.md`, `FOUNDATION_SEED.md`.
- **Approved artifacts:** `docs/README.md`, revision 1; `docs/foundation/DECISIONS.md`, revision 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved G1 and the C1 documentation-governance baseline, including `docs/README.md` revision 1 and `docs/foundation/DECISIONS.md` revision 1.
- **GOV-003 reconciliation:** The human owner explicitly accepted the already-approved `GOV-003` as a narrow bootstrap exception to the original G1 criterion that expected only `GOV-001` to be approved. The exception applies only to `AGENTS.md` revision 1 as binding bootstrap agent-execution authority.
- **Does not authorize:** C2; product definition; runtime architecture; technology selection; runtime implementation.
- **G1 exit criteria:** Defined solely by [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md#g1-exit-criteria-and-required-verification-evidence).
- **Verification evidence:**
  - Only authorized C1 paths are modified: PASS — repository status and changed-path review, including the authorized repository-local `.gitignore` hygiene addition.
  - No runtime or C2 artifacts exist: PASS — repository file inventory contains no runtime source tree or C2 product artifacts.
  - Repository-local `.DS_Store` hygiene: PASS — `.gitignore` contains `.DS_Store` and `find . -name '.DS_Store' -print` returns no output.
  - Required reading path resolves: PASS — `README.md` → `AGENTS.md` → `docs/README.md` → `docs/development/CURRENT.md`.
  - Authority ownership is non-circular: PASS — ownership and dependency/provenance semantics are defined in `docs/README.md`.
  - Decision states and record fields are valid: PASS — manual record-format and state review; all records contain the required fields and use defined states.
  - `GOV-001` and `GOV-003` are approved: PASS — decision-register review; `GOV-003` approves only `AGENTS.md` revision 1 bootstrap authority.
  - Pre-disposition status: PASS — `GOV-002` remained `PROPOSED` until this human disposition.
  - Product decisions remain open or deferred: PASS — product decision-register review.
  - `AGENTS.md` revision 1 bootstrap authority is approved through `GOV-003`: PASS — it contains stable AI execution constraints only and does not approve G1, C2, runtime architecture, or runtime implementation.
  - G1 exit-criterion reconciliation: RESOLVED — the human owner accepted `GOV-003` as the narrow bootstrap exception recorded above; it does not broaden later-stage authorization.
  - `CURRENT.md` contains runtime prohibitions: PASS — explicit prohibitions recorded.
  - C2 is not authorized: PASS — `CURRENT.md` records `NOT AUTHORIZED` and its two preconditions.
  - `FOUNDATION_SEED.md` is non-normative provenance: PASS — classification and adoption rule recorded in the seed and control plane.
  - Foundation Program and G1 criteria are reconstructible from repository only: PASS — `FOUNDATION_PROGRAM.md` is the sole program authority and this record references its G1 criteria.
  - Human disposition: APPROVED — the human owner approved G1 through this `GOV-002` record; neither `GOV-001` nor `GOV-003` independently approved G1.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-004 — C2 Product Intent authorization

- **Question:** Authorize C2 Product Intent under the approved Generation 2 Foundation Program while preserving all later-stage and runtime prohibitions.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G1 is approved and the human owner has explicitly authorized C2 so that a proposed, independently reviewable product-intent baseline can be prepared for G2 without entering C3 or later work.
- **Alternatives:** Keep C2 unauthorized; authorize C2 within the approved program boundary; authorize a broader stage or runtime scope.
- **Normative dependencies:** `GOV-002`.
- **Affected artifacts:** `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and C2-authorized product-intent materials.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly authorized C2 Product Intent under the scope, constraints, sequencing rules, and prohibitions of the approved Generation 2 Foundation Program and directed that this authorization be recorded before C2 work begins.
- **Authorized scope:** C2 product-intent materials and decision-record updates needed to establish a proposed product-intent baseline and decision context for an approved v1 boundary.
- **Does not authorize:** C3 or any later Foundation stage; scenario-corpus work; domain modeling; runtime architecture; technology or provider selection; implementation planning; runtime source code; deployment; or G2 approval.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-005 — G2 product-intent baseline

- **Question:** Approve `product/PRODUCT_REQUIREMENTS.md` revision 1 as the C2 product-intent baseline for G2.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** C2 requires an independently reviewable proposed product-intent baseline whose approved inputs, unresolved decisions, and excluded work are reconstructible from repository artifacts before a human may dispose G2.
- **Alternatives:** Approve the proposed C2 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-004`; `PRD-001` revision 1; `PRD-002` revision 1; `PRD-003` revision 1; `PRD-004` revision 1; `BEH-003` revision 1; `DATA-001` revision 1; `QLT-001` revision 1; `product/PRODUCT_REQUIREMENTS.md` revision 1; C2 verification evidence satisfying the C2 and G2 criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md).
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and the artifact-status row in `docs/README.md`.
- **Approved artifact:** `product/PRODUCT_REQUIREMENTS.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** Independent review recorded `G2 REVIEW: PASS`. The human owner explicitly approved G2 and `product/PRODUCT_REQUIREMENTS.md` revision 1 on 2026-08-09.
- **C2 verification evidence:**
  - C2 authorization: PASS — `GOV-004` is human-approved and preserves all later-stage and runtime prohibitions.
  - Required C2 decision inputs: PASS — `PRD-001` through `PRD-004`, `BEH-003`, `DATA-001`, and `QLT-001` are human-approved at decision revision 1.
  - Approved product-intent baseline: PASS — `product/PRODUCT_REQUIREMENTS.md` revision 1 is `CANONICAL / APPROVED` and traces every baseline section to an approved decision.
  - Unresolved behavior decisions: PASS — `BEH-001`, `BEH-002`, and `BEH-004` remain `OPEN` and their undecided semantics are explicit in the approved baseline.
  - Excluded later work: PASS — no C3 scenario corpus, domain model, runtime architecture, provider or technology selection, schema, API, implementation plan, runtime source, or deployment artifact was introduced.
  - Documentation structure: PASS — deterministic relative-link validation succeeds and all product-intent statement IDs are unique.
  - Change scope: PASS — changes are limited to C2 decision records, the approved C2 product-intent artifact, the operational snapshot, and the documentation-control artifact-status row required to replace its prior `NOT_CREATED` reservation.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and approved lifecycle status of the previously reserved product-intent artifact. It changes no documentation-control semantics, topic ownership, authorization rule, normative dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Does not authorize:** C3 or later Foundation work; scenario-corpus work; domain modeling; runtime architecture; provider or technology selection; schemas; APIs; implementation planning; runtime source code; or deployment.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-006 — C3 Scenario Corpus authorization

- **Question:** Authorize C3 Scenario and Acceptance Evidence under the approved Generation 2 Foundation Program while preserving G3, C4, and runtime boundaries.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G2 is approved and the human owner has explicitly authorized C3 so that the smallest useful, independently reviewable scenario corpus can test the approved Product Intent without entering domain design or later work.
- **Alternatives:** Keep C3 unauthorized; authorize C3 within the approved program boundary; authorize a broader stage or runtime scope.
- **Normative dependencies:** `GOV-005`.
- **Affected artifacts:** `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `docs/README.md`, and C3-authorized scenario and semantic-acceptance materials.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly authorized “C3 — Scenario Corpus,” directed reconstruction of repository authority, and authorized preparation of the C3 baseline and necessary repository-state updates under the approved Product Intent and Foundation Program boundaries.
- **Authorized scope:** A compact scenario corpus, semantic acceptance evidence, Product Intent traceability, ambiguity and gap records, and decision or operational-state updates necessary to prepare the C3 baseline.
- **Does not authorize:** Approval of `VAL-001`; G3 approval or gate disposition; C4 or any later Foundation stage; domain-model finalization; runtime architecture; technology or provider selection; schemas; APIs; implementation planning; runtime source code; deployment; or later gate review.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and proposed lifecycle status of the previously reserved scenario artifact. It changes no documentation-control semantics, topic ownership, authorization rule, normative dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-007 — G3 scenario and acceptance-evidence baseline

- **Question:** Approve `product/SCENARIOS.md` revision 1 and `VAL-001` as the completed C3 scenario and acceptance-evidence baseline for G3.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** C3 requires independently reviewable, traceable scenario and semantic-acceptance evidence before a human may dispose G3. The proposed baseline has completed independent review without expanding product scope or entering C4 or runtime work.
- **Alternatives:** Approve the proposed C3 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-006`; `PRD-001` revision 1; `PRD-002` revision 1; `PRD-003` revision 1; `PRD-004` revision 1; `BEH-003` revision 1; `DATA-001` revision 1; `QLT-001` revision 1; `product/PRODUCT_REQUIREMENTS.md` revision 1; `VAL-001` revision 1; `product/SCENARIOS.md` revision 1; C3 verification evidence satisfying the C3 and G3 criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md).
- **Affected artifacts:** `product/SCENARIOS.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and the artifact-status row in `docs/README.md`.
- **Approved decision:** `VAL-001`.
- **Approved decision revision:** 1.
- **Approved artifact:** `product/SCENARIOS.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** Independent review recorded `G3 REVIEW: PASS`. The human owner explicitly approved G3, `VAL-001` revision 1, and `product/SCENARIOS.md` revision 1 on 2026-08-09.
- **C3 verification evidence:**
  - C3 authorization: PASS — `GOV-006` is human-approved and preserves G3, C4, later-stage, and runtime prohibitions.
  - Scenario and acceptance baseline: PASS — `product/SCENARIOS.md` revision 1 contains 12 scenario families with complete semantic schemas and 11 corpus-wide invariants derived from approved Product Intent.
  - Product Intent traceability: PASS — all 37 approved Product Intent statements are validly covered by scenario evidence, corpus-wide invariants, or both.
  - Unresolved decisions: PASS — `BEH-001`, `BEH-002`, `BEH-004`, and `MOD-001` through `MOD-004` remain open and are exposed without selecting their unresolved semantics.
  - Excluded later work: PASS — no C4 domain model, architecture, technology or provider selection, schema, API, delivery, implementation, runtime source, or deployment artifact was introduced.
  - Documentation structure: PASS — deterministic scenario-ID, required-field, requirement-reference, relative-link, and changed-file whitespace checks succeed.
  - Change scope: PASS — changes are limited to C3-authorized scenario evidence and necessary decision, operational-state, and ownership-map updates.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the approved lifecycle status of `product/SCENARIOS.md` revision 1. It changes no documentation-control semantics, topic ownership, authorization rule, normative dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Does not authorize:** C4 or any later Foundation stage; domain modeling; runtime architecture; technology or provider selection; persistence; schemas; APIs; delivery or orchestration architecture; implementation planning; runtime source code; or deployment.
- **Supersedes:** None.
- **Superseded by:** None.

## Product definition

### PRD-001 — Initial user and collaboration boundary

- **Question:** Is the initial product for the founder only, a broader single-user audience, or collaborative use?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed uses personal and singular-user language but does not establish the audience boundary.
- **Alternatives:** Founder-only; broader single-user; collaborative.
- **Normative dependencies:** `GOV-002`; `GOV-004`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`; future `product/DOMAIN_MODEL.md`.
- **Decision:** Founder-only single-user is the initial v1 validation boundary. V1 has one user, no collaboration, no shared ownership, and no multi-user permissions or coordination semantics. Product semantics must use a general single-user concept where sufficient rather than hard-coding the founder's personal identity. Broader single-user applicability may be evaluated later from evidence but is not a v1 requirement.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative A with the boundary clarification recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-002 — Exact v1 boundary

- **Question:** What exact v1 outcome, scope, non-goals, and boundary with the Personal Life Operating System vision are approved?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The Stateful Personal Project & Knowledge Assistant is a seed hypothesis, not an approved scope.
- **Alternatives:** Narrow project-and-knowledge assistant; project-management-only product; broader Life OS scope.
- **Normative dependencies:** `GOV-002`; `GOV-004`; `PRD-001`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** Liam v1 is a narrow project-and-knowledge assistant for helping the user move active projects forward, preserve enough project and work context to resume without mentally reconstructing it, capture and retrieve useful knowledge generated during project execution, and determine a concrete useful next action. The broader Personal Life Operating System is a long-term direction and is outside the v1 boundary.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative A and the outcome, scope, and non-goal boundary recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-003 — Product usefulness and success criteria

- **Question:** What outcomes and evidence demonstrate that v1 is useful?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed states an aspiration to reduce mental load but supplies no approval metric.
- **Alternatives:** Behavioral outcomes; usage measures; a combined outcome-and-usage baseline.
- **Normative dependencies:** `GOV-004`; `PRD-001`; `PRD-002`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** V1 uses a combined, outcome-led usefulness baseline. Primary usefulness is demonstrated by whether the user can resume active work without manually reconstructing important context, determine a concrete next useful action, capture relevant project knowledge with low friction, and retrieve that knowledge later when relevant. Usage metrics may support this evidence but usage alone is not proof of usefulness.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative C and the four primary usefulness outcomes recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-004 — Language and interaction needs

- **Question:** Which user languages and interaction needs belong in v1?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed includes Vietnamese requests while repository documents are English and no interaction boundary is approved.
- **Alternatives:** Vietnamese-first; English-first; bilingual; one interaction surface; multiple interaction surfaces.
- **Normative dependencies:** `GOV-004`; `PRD-001`; `PRD-002`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** V1 supports Vietnamese and English through one coherent text-based conversational experience. This decision selects no channel, application, provider, protocol, or technology. Multiple interaction surfaces are outside the current v1 boundary unless later evidence requires them.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative A with the interaction and technology-neutral boundaries recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

## Product model

### MOD-001 — Project hierarchy semantics

- **Question:** Are Area, Project, Milestone/Phase, Task, and Step mandatory or optional, and are Milestone and Phase one concept or two?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed explicitly requires validation of the initial conceptual hierarchy.
- **Alternatives:** Mandatory hierarchy; optional levels; separate Milestone and Phase concepts; one shared Milestone/Phase concept.
- **Dependencies:** PRD-002; VAL-001.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`; `product/PRODUCT_REQUIREMENTS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-002 — Project, Task, and Step lifecycles

- **Question:** What lifecycle states, Task-versus-Step boundary, and user-Task completion criteria apply?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed defines concepts but not create, pause, resume, reopen, abandon, archive, or completion semantics.
- **Alternatives:** Separate entity lifecycles; shared minimal lifecycle; explicit promotion from Step to Task; flexible user-defined boundaries.
- **Dependencies:** PRD-002; MOD-001; VAL-001.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-003 — Knowledge taxonomy and lifecycle

- **Question:** How do Resource, Working Note, Finding, Decision, Reflection, and Artifact relate, promote, preserve provenance, and become superseded?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed taxonomy is explicitly provisional and its type boundaries overlap.
- **Alternatives:** Mutually exclusive types; composable types; staged promotion model.
- **Dependencies:** PRD-002; VAL-001.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-004 — Project and knowledge relationship

- **Question:** Is knowledge project-bound, reusable across projects, or both?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The v1 direction emphasizes project execution while retrieval examples imply reusable historical knowledge.
- **Alternatives:** Project-bound; globally reusable; project-originated with controlled cross-project reuse.
- **Dependencies:** PRD-002; MOD-003; VAL-001.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`; `product/PRODUCT_REQUIREMENTS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

## Product behavior and data

### BEH-001 — State and current-context authority

- **Question:** What does stateful behavior mean, and how is current project/task context selected, corrected, and resumed?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed requires preserved context but does not define its authority or correction semantics.
- **Alternatives:** Explicit user selection; inferred context; hybrid selection with user correction.
- **Dependencies:** PRD-002; MOD-001; MOD-002.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-002 — Next-action recommendation policy

- **Question:** Which inputs, precedence rules, explanations, and user overrides govern next-action recommendations?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed cites time, energy, priority, dependencies, and lateness without a policy for reconciling them.
- **Alternatives:** User-ranked rules; system scoring; advisory shortlist with human selection.
- **Dependencies:** PRD-002; MOD-002; BEH-001; VAL-001.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-003 — Minimum v1 capability map

- **Question:** Which observable user capabilities are required for v1?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed lists potential behaviors but marks exact scope and capability map unresolved.
- **Alternatives:** Planning-first set; knowledge-first set; balanced project-and-knowledge set.
- **Normative dependencies:** `GOV-004`; `PRD-002`; `PRD-003`.
- **Downstream validation dependency:** `VAL-001` must later define acceptance evidence for these capabilities under separately authorized C3 work; it is not a prerequisite to this product-intent decision.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** V1 uses a balanced, outcome-aligned minimum capability map: establish an active project and its intended outcome; preserve progress and enough working context for the user to resume without manually reconstructing important context; refine immediate work into concrete actions and help identify a useful next action; capture useful project knowledge with low friction; and retrieve relevant captured knowledge during later project work.
- **Boundary:** This decision defines observable product capabilities only. It does not decide project hierarchy semantics, entity lifecycles, active or current context selection, recommendation scoring or precedence, or confirmation requirements for state-changing actions. Those remain owned by their later or open decisions.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative C with the capability map and boundary recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-004 — Human-control boundary

- **Question:** Which actions are advisory, state-changing, confirmable, reversible, or prohibited?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed preserves human judgment for important actions without defining the boundary.
- **Alternatives:** Advise-only; draft changes with confirmation; bounded automatic state changes.
- **Dependencies:** PRD-002; BEH-001; BEH-002; DATA-001.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### DATA-001 — Data-control policy

- **Question:** What privacy, retention, deletion, export, and sensitive-domain policy applies to v1?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The long-term vision includes potentially sensitive domains while privacy and retention remain unresolved.
- **Alternatives:** User-directed retention; policy-based retention; hybrid controls with explicit sensitive-domain exclusions.
- **Normative dependencies:** `GOV-004`; `PRD-001`; `PRD-002`; `PRD-004`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** V1 uses a hybrid data-control policy. The user decides what information to intentionally capture. Accepted captured data is retained predictably until the user deletes it or otherwise directs its removal. User-controlled deletion and export are required product capabilities. User data must not be silently repurposed outside Liam's approved product function. Credentials, authentication secrets, private keys, access tokens, and equivalent authentication material are outside the intended v1 capture boundary. Liam must not represent itself as a medical, legal, or financial authority. Ordinary project information is not automatically prohibited merely because a project concerns health, fitness, personal finance, or another potentially sensitive domain.
- **Boundary:** This decision establishes product-level data expectations only. It does not select storage, encryption, retention implementation, authentication mechanisms, providers, schemas, or other technical controls.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative C with the data-control policy and technology-neutral boundary recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

## Validation and quality

### VAL-001 — Scenario corpus and acceptance evidence

- **Question:** What real-user scenario coverage and semantic acceptance evidence are required before product foundation approval?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed calls for a larger Golden Dataset but its scope and acceptance role are unresolved.
- **Alternatives:** Founder scenarios; broader research scenarios; combined corpus with scenario IDs and semantic expected outcomes.
- **Normative dependencies:** `GOV-006`; `PRD-001`; `PRD-002`; `PRD-003`; `PRD-004`; `BEH-003`; `DATA-001`; `QLT-001`; `product/PRODUCT_REQUIREMENTS.md` revision 1.
- **Affected artifacts:** `product/SCENARIOS.md`; `product/PRODUCT_REQUIREMENTS.md`; future `product/DOMAIN_MODEL.md`.
- **Decision:** Use a compact, founder-grounded corpus of 12 scenario families with stable IDs and semantic expected outcomes. The corpus spans representative project contexts only where domain variation tests the approved product model. Each scenario traces to approved Product Intent, defines observable behavior and prohibited outcomes without exact-text matching, and records rather than resolves open behavior or domain semantics. Corpus-wide invariants cover approved constraints that do not require separate scenario multiplication. Representative domains are evidence of semantic coverage, not broader-market validation.
- **Approved decision revision:** 1.
- **Approved artifact:** `product/SCENARIOS.md`, revision 1.
- **Approval decision:** `GOV-007`.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** Independent review recorded `G3 REVIEW: PASS`. The human owner explicitly approved this decision and `product/SCENARIOS.md` revision 1 through `GOV-007` on 2026-08-09.
- **Supersedes:** None.
- **Superseded by:** None.

### QLT-001 — Technology-neutral quality constraints

- **Question:** What user-significant scale, reliability, failure, operability, and testability constraints must inform later architecture?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed identifies testing and observability as unresolved but does not state product-level constraints.
- **Alternatives:** Reliability-first constraints; responsiveness-first constraints; balanced constraints based on approved v1 use.
- **Normative dependencies:** `GOV-004`; `PRD-002`; `PRD-003`; `BEH-003`; `DATA-001`.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Decision:** V1 uses balanced, reliability-weighted quality constraints. It is optimized for one user's accumulated project and knowledge history, with no multi-user or market-scale requirement. An accepted capture or state change must not be silently lost or falsely reported as successful. Failures must be visible and preserve enough of the user's intent or input to allow safe recovery or retry where applicable. Uncertain retrieval or recommendation results must expose meaningful uncertainty and remain correctable by the user. Routine text interaction should remain conversationally usable, but no arbitrary latency service-level objective is set before evidence exists. All required v1 capabilities must eventually have observable pass/fail acceptance evidence. When responsiveness conflicts with preservation, correctness, or recoverability, the latter qualities take precedence.
- **Boundary:** This decision is technology-neutral and does not select implementation or testing mechanisms.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-08.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative C with the quality constraints and technology-neutral boundary recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### PLAN-001 — Roadmap and release sequencing

- **Question:** How should roadmap and release sequencing be defined after the v1 product boundary has been approved?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Roadmap and release sequencing cannot be defined until the v1 product boundary is approved.
- **Alternatives:** No roadmap until v1 approval; milestone roadmap; release roadmap.
- **Dependencies:** PRD-002; PRD-003.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; `docs/development/CURRENT.md`.
- **Approval evidence:** Deferred until `PRD-002` is approved.
- **Supersedes:** None.
- **Superseded by:** None.

## Deferred delivery and architecture

### DLV-001 — Provider-neutral AI governance

- **Question:** What provider-neutral roles and controls govern reasoning, implementation, review, and escalation?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed names Codex and OpenCode examples, but the durable workflow must remain model-independent and is assigned to C6.
- **Alternatives:** Capability-based roles; provider-specific roles; single-model workflow.
- **Dependencies:** G5; C6 authorization.
- **Affected artifacts:** Future `development/DELIVERY_CONTRACT.md`.
- **Approval evidence:** Deferred to C6.
- **Supersedes:** None.
- **Superseded by:** None.

### DLV-002 — Delivery packet and engineering completion contract

- **Question:** What engineering Definition of Ready/Done and Task Packet format will govern implementation work?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** These delivery artifacts are assigned to C6 and no implementation task is authorized now.
- **Alternatives:** One standard packet; lighter ad hoc packet; tiered packet by risk.
- **Dependencies:** G5; C6 authorization.
- **Affected artifacts:** Future `development/DELIVERY_CONTRACT.md`.
- **Approval evidence:** Deferred to C6.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-001 — Persistence ownership

- **Question:** Which runtime boundary owns persistence?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** The seed lists persistence ownership as unresolved; runtime architecture design is prohibited before G5.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; approved product foundation.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-002 — Runtime architecture boundaries

- **Question:** What runtime boundaries are required?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Architecture must be derived from approved product requirements after G5.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; approved product foundation.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-003 — Integration strategy and provider choices

- **Question:** What integrations are needed, and which providers, if any, are selected?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Integration needs must follow approved capabilities; provider selection is prohibited now.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; BEH-003; QLT-001.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-004 — Technical testing and observability strategy

- **Question:** What technical verification and observability strategy is required?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Technology-neutral quality constraints come first; mechanisms are prohibited before G5.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; QLT-001.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-005 — Runtime project-memory architecture

- **Question:** How will runtime project memory be implemented?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Repository-based development continuity is a founding governance principle; runtime implementation is a separate architecture question.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; BEH-001; DATA-001.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

### ARC-006 — Technology selection

- **Question:** Which database, framework, Cloudflare services, MCP providers, LLM providers, persistence technologies, and other runtime technologies are selected?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Technology choices remain explicitly unapproved and must follow architecture design.
- **Alternatives:** Not evaluated; evaluation is prohibited before G5.
- **Dependencies:** G5; approved runtime architecture inputs.
- **Affected artifacts:** Future architecture artifact, not yet authorized.
- **Approval evidence:** Deferred pending G5.
- **Supersedes:** None.
- **Superseded by:** None.

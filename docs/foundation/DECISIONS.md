# Foundation Decision Register

**Artifact class:** CANONICAL  
**Lifecycle status:** PROPOSED — awaiting G1 human approval  
**Decision owner:** `hdangprod`  
**Normative dependencies:** None.  
**Reference sources:** `FOUNDATION_SEED.md`, [documentation control plane](../README.md), and [Foundation Program](FOUNDATION_PROGRAM.md).  
**Approval provenance:** Pending `GOV-002`

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
- **Status:** PROPOSED
- **Decision owner:** `hdangprod`
- **Rationale:** G1 must be explicitly human-approved before C2 product-definition work begins.
- **Alternatives:** Approve the C1 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-001`; C1 verification evidence satisfying the G1 exit criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md#G1-exit-criteria-and-required-verification-evidence).
- **Affected artifacts:** `docs/foundation/FOUNDATION_PROGRAM.md`, `docs/README.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `README.md`, `AGENTS.md`, `FOUNDATION_SEED.md`.
- **Approval evidence:** Pending human G1 review. Codex must not convert this decision to `APPROVED`.
- **G1 exit criteria:** Defined solely by [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md#G1-exit-criteria-and-required-verification-evidence).
- **Verification evidence:**
  - Only authorized C1 paths are modified: PASS — repository status and changed-path review, including the authorized repository-local `.gitignore` hygiene addition.
  - No runtime or C2 artifacts exist: PASS — repository file inventory contains no runtime source tree or C2 product artifacts.
  - Repository-local `.DS_Store` hygiene: PASS — `.gitignore` contains `.DS_Store` and `find . -name '.DS_Store' -print` returns no output.
  - Required reading path resolves: PASS — `README.md` → `AGENTS.md` → `docs/README.md` → `docs/development/CURRENT.md`.
  - Authority ownership is non-circular: PASS — ownership and dependency/provenance semantics are defined in `docs/README.md`.
  - Decision states and record fields are valid: PASS — manual record-format and state review; all records contain the required fields and use defined states.
  - `GOV-001` and `GOV-003` are approved: PASS — decision-register review; `GOV-003` approves only `AGENTS.md` revision 1 bootstrap authority.
  - `GOV-002` remains proposed: PASS — this record remains `PROPOSED`.
  - Product decisions remain open or deferred: PASS — product decision-register review.
  - `AGENTS.md` revision 1 bootstrap authority is approved through `GOV-003`: PASS — it contains stable AI execution constraints only and does not approve G1, C2, runtime architecture, or runtime implementation.
  - G1 exit-criterion reconciliation: BLOCKED — Foundation Program revision 1 says `GOV-001` is the only approved decision and that semantically changed C1 canonical artifacts other than the Foundation Program remain `PROPOSED`; it must be revised or a human exception recorded before G1 can be approved.
  - `CURRENT.md` contains runtime prohibitions: PASS — explicit prohibitions recorded.
  - C2 is not authorized: PASS — `CURRENT.md` records `NOT AUTHORIZED` and its two preconditions.
  - `FOUNDATION_SEED.md` is non-normative provenance: PASS — classification and adoption rule recorded in the seed and control plane.
  - Foundation Program and G1 criteria are reconstructible from repository only: PASS — `FOUNDATION_PROGRAM.md` is the sole program authority and this record references its G1 criteria.
  - Required human action before G1 approval: reconcile the Foundation Program revision 1 G1 criteria with `GOV-003`, then record human disposition of `GOV-002`; neither `GOV-001` nor `GOV-003` approves G1.
- **Supersedes:** None.
- **Superseded by:** None.

## Product definition

### PRD-001 — Initial user and collaboration boundary

- **Question:** Is the initial product for the founder only, a broader single-user audience, or collaborative use?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed uses personal and singular-user language but does not establish the audience boundary.
- **Alternatives:** Founder-only; broader single-user; collaborative.
- **Dependencies:** GOV-002.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`; future `product/DOMAIN_MODEL.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-002 — Exact v1 boundary

- **Question:** What exact v1 outcome, scope, non-goals, and boundary with the Personal Life Operating System vision are approved?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The Stateful Personal Project & Knowledge Assistant is a seed hypothesis, not an approved scope.
- **Alternatives:** Narrow project-and-knowledge assistant; project-management-only product; broader Life OS scope.
- **Dependencies:** GOV-002; PRD-001.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-003 — Product usefulness and success criteria

- **Question:** What outcomes and evidence demonstrate that v1 is useful?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed states an aspiration to reduce mental load but supplies no approval metric.
- **Alternatives:** Behavioral outcomes; usage measures; a combined outcome-and-usage baseline.
- **Dependencies:** PRD-001; PRD-002.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### PRD-004 — Language and interaction needs

- **Question:** Which user languages and interaction needs belong in v1?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed includes Vietnamese requests while repository documents are English and no interaction boundary is approved.
- **Alternatives:** Vietnamese-first; English-first; bilingual; one interaction surface; multiple interaction surfaces.
- **Dependencies:** PRD-001; PRD-002.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
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
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`; future `product/PRODUCT_REQUIREMENTS.md`.
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
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`; future `product/PRODUCT_REQUIREMENTS.md`.
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
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
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
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-003 — Minimum v1 capability map

- **Question:** Which observable user capabilities are required for v1?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed lists potential behaviors but marks exact scope and capability map unresolved.
- **Alternatives:** Planning-first set; knowledge-first set; balanced project-and-knowledge set.
- **Dependencies:** PRD-002; PRD-003; VAL-001.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-004 — Human-control boundary

- **Question:** Which actions are advisory, state-changing, confirmable, reversible, or prohibited?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed preserves human judgment for important actions without defining the boundary.
- **Alternatives:** Advise-only; draft changes with confirmation; bounded automatic state changes.
- **Dependencies:** PRD-002; BEH-001; BEH-002; DATA-001.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### DATA-001 — Data-control policy

- **Question:** What privacy, retention, deletion, export, and sensitive-domain policy applies to v1?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The long-term vision includes potentially sensitive domains while privacy and retention remain unresolved.
- **Alternatives:** User-directed retention; policy-based retention; hybrid controls with explicit sensitive-domain exclusions.
- **Dependencies:** PRD-001; PRD-002; PRD-004.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

## Validation and quality

### VAL-001 — Scenario corpus and acceptance evidence

- **Question:** What real-user scenario coverage and semantic acceptance evidence are required before product foundation approval?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed calls for a larger Golden Dataset but its scope and acceptance role are unresolved.
- **Alternatives:** Founder scenarios; broader research scenarios; combined corpus with scenario IDs and semantic expected outcomes.
- **Dependencies:** PRD-001; PRD-002.
- **Affected artifacts:** Future `product/SCENARIOS.md`; future `product/PRODUCT_REQUIREMENTS.md`; future `product/DOMAIN_MODEL.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### QLT-001 — Technology-neutral quality constraints

- **Question:** What user-significant scale, reliability, failure, operability, and testability constraints must inform later architecture?
- **Status:** OPEN
- **Decision owner:** `hdangprod`
- **Rationale:** The seed identifies testing and observability as unresolved but does not state product-level constraints.
- **Alternatives:** Reliability-first constraints; responsiveness-first constraints; balanced constraints based on approved v1 use.
- **Dependencies:** PRD-002; PRD-003; BEH-003; DATA-001.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Approval evidence:** None — unresolved.
- **Supersedes:** None.
- **Superseded by:** None.

### PLAN-001 — Roadmap and release sequencing

- **Question:** How should roadmap and release sequencing be defined after the v1 product boundary has been approved?
- **Status:** DEFERRED
- **Decision owner:** `hdangprod`
- **Rationale:** Roadmap and release sequencing cannot be defined until the v1 product boundary is approved.
- **Alternatives:** No roadmap until v1 approval; milestone roadmap; release roadmap.
- **Dependencies:** PRD-002; PRD-003.
- **Affected artifacts:** Future `product/PRODUCT_REQUIREMENTS.md`; `docs/development/CURRENT.md`.
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

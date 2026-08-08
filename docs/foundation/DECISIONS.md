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

### GOV-008 — C4 Domain and Lifecycle Semantics authorization

- **Question:** Authorize C4 Domain and Lifecycle Semantics under the approved Generation 2 Foundation Program while preserving G4, C5, later-stage, and runtime boundaries.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G3, `VAL-001` revision 1, and the Scenario Corpus revision 1 are approved, and the human owner has explicitly authorized C4 so that the smallest coherent domain model can be derived from approved Product Intent and scenario evidence without entering architecture or implementation.
- **Alternatives:** Keep C4 unauthorized; authorize C4 within the approved program boundary; authorize a broader stage or runtime scope.
- **Normative dependencies:** `GOV-007`; `product/PRODUCT_REQUIREMENTS.md` revision 1; `VAL-001` revision 1; `product/SCENARIOS.md` revision 1.
- **Affected artifacts:** `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `docs/README.md`, and C4-authorized domain-semantics materials.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human project owner explicitly authorized “C4 — Domain and Lifecycle Semantics” under the scope, dependencies, exit criteria, and prohibitions of the approved Foundation Program; directed that the authorization be recorded durably before C4 work begins; and limited its derivation inputs to Product Intent revision 1, Scenario Corpus revision 1, approved C2 decisions, and approved `VAL-001`.
- **Authorized scope:** Evidence extraction from the 12 approved scenarios; dependency-aware facilitation of `MOD-001` through `MOD-004` and only those behavior decisions required by C4 evidence; preparation of the minimum domain vocabulary, conceptual relationships, product-level optionality and cardinality, lifecycle semantics, invariants, provenance or supersession semantics, traceability, deterministic documentation verification, and a G4 review candidate.
- **Does not authorize:** G4 approval or independent gate disposition; C5 or any later Foundation stage; runtime architecture; persistence or database design; schemas; APIs; technology or provider selection; delivery or orchestration architecture; implementation planning; runtime source code; or deployment.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and proposed lifecycle status of the previously reserved domain-model artifact. It changes no documentation-control semantics, topic ownership, authorization rule, normative dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-009 — G4 domain and lifecycle semantics baseline

- **Question:** Approve `product/DOMAIN_MODEL.md` revision 1 and the C4 domain and behavior decisions as the completed C4 baseline for G4.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** C4 requires an independently reviewable domain vocabulary, conceptual relationships, lifecycles, invariants, traceability, unresolved-choice record, and excluded-work boundary before a human may dispose G4.
- **Alternatives:** Approve the proposed C4 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-008`; `PRD-001` revision 1; `PRD-002` revision 1; `BEH-003` revision 1; `DATA-001` revision 1; `QLT-001` revision 1; `VAL-001` revision 1; `MOD-001` revision 1; `MOD-002` revision 1; `MOD-003` revision 1; `MOD-004` revision 1; `BEH-001` revision 1; `BEH-002` revision 1; `BEH-004` revision 1; `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `product/DOMAIN_MODEL.md` revision 1; C4 verification evidence satisfying the C4 and G4 criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md).
- **Affected artifacts:** `product/DOMAIN_MODEL.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and the artifact-status row in `docs/README.md`.
- **Approved C4 decision inputs:** `MOD-001` revision 1; `MOD-002` revision 1; `MOD-003` revision 1; `MOD-004` revision 1; `BEH-001` revision 1; `BEH-002` revision 1; `BEH-004` revision 1.
- **Approved artifact:** `product/DOMAIN_MODEL.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The original independent review returned `G4 REVIEW: NEEDS FIX` with `G4-F001` and `G4-F002`. Both findings were corrected without material unrelated semantic change, and the same independent reviewer returned `G4 TARGETED RECHECK: PASS`. The human owner then explicitly approved G4 and `product/DOMAIN_MODEL.md` revision 1 on 2026-08-09.
- **C4 verification evidence:**
  - C4 authorization: PASS — `GOV-008` is human-approved and preserves G4, C5, later-stage, architecture, and implementation boundaries.
  - Required C4 decisions: PASS — `MOD-001` through `MOD-004`, `BEH-001`, `BEH-002`, and `BEH-004` are human-approved at decision revision 1.
  - Approved domain baseline: PASS — `product/DOMAIN_MODEL.md` revision 1 is `CANONICAL / APPROVED` and defines the minimum vocabulary, relationships, lifecycles, context authority, knowledge provenance, recommendation semantics, human-control boundary, invariants, exclusions, and traceability.
  - Scenario and Product Intent traceability: PASS — every semantic area traces to approved decisions, Product Intent, and Scenario Corpus evidence; all 12 approved scenario identifiers appear in the domain traceability matrix.
  - Unresolved choices: PASS — no genuine C4 semantic choice remains open; unsupported abandonment, hierarchy, taxonomy, preference, deletion-undo, and implementation semantics are explicitly unmodeled.
  - Documentation structure: PASS — required files and sections exist, relative links resolve, C4 decision records contain required fields and approved states, and changed-file whitespace validation succeeds.
  - Change scope: PASS — changes are limited to the C4 artifact, decision and G4 approval records, operational state, and the documentation ownership row.
  - Excluded later work: PASS — no runtime source tree, C5 artifact, schema, API, architecture, provider selection, delivery design, implementation plan, source code, or deployment artifact was introduced.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and approved lifecycle status of `product/DOMAIN_MODEL.md` revision 1. It changes no documentation-control semantics, topic ownership, authorization rule, normative dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Does not authorize:** C5 or any later Foundation stage; runtime architecture; persistence or database design; schemas; APIs; technology or provider selection; delivery or orchestration architecture; implementation planning; runtime source code; deployment; or any later gate review.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-010 — C5 Product Foundation Baseline authorization

- **Question:** Authorize C5 Product Foundation Baseline under the approved Generation 2 Foundation Program while preserving G5, C6, later-stage, architecture, delivery, and runtime boundaries.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G4 and the Domain Model revision 1 are approved, and the human owner has explicitly authorized C5 so that the approved product-intent, scenario, domain, data-control, quality, and validation evidence can be reconciled into the minimum coherent proposed Product Foundation Baseline without entering solution design or later-stage work.
- **Alternatives:** Keep C5 unauthorized; authorize C5 within the approved program boundary; authorize a broader stage or runtime scope.
- **Normative dependencies:** `GOV-009`; `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `product/DOMAIN_MODEL.md` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `docs/README.md`, and C5-authorized baseline and traceability materials.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human project owner explicitly authorized “C5 — Product Foundation Baseline” under the scope, dependencies, exit criteria, and prohibitions of the approved Generation 2 Foundation Program and directed that this authorization be recorded durably before C5 work begins.
- **Authorized scope:** Reconciliation of approved Product Intent revision 1, Scenario Corpus revision 1, Domain Model revision 1, approved product, behavior, model, data-control, validation, and quality decisions into the minimum coherent proposed Product Foundation Baseline; foundation traceability; contradiction, gap, unresolved-decision, and boundary classification; deterministic documentation verification; and preparation of a proposed G5 disposition and review candidate.
- **Does not authorize:** G5 approval or independent gate disposition; C6 or C7; runtime architecture or architecture decisions; persistence, database, schema, or API design; provider or technology selection; delivery governance; implementation planning or engineering tasks; deployment; runtime source code; or any claim that C5 defines solution architecture.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-011 — G5 Product Foundation Baseline disposition

- **Question:** Approve `product/PRODUCT_FOUNDATION.md` revision 1 as the completed C5 Product Foundation Baseline for G5.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** C5 requires an independently reviewable reconciliation of the approved Product Intent, Scenario Corpus, Domain Model, data-control, validation, and quality evidence before a human may dispose G5.
- **Alternatives:** Approve the proposed C5 baseline; return it for revision; reject it.
- **Normative dependencies:** `GOV-010`; `PRD-001` revision 1; `PRD-002` revision 1; `PRD-003` revision 1; `PRD-004` revision 1; `BEH-001` revision 1; `BEH-002` revision 1; `BEH-003` revision 1; `BEH-004` revision 1; `MOD-001` revision 1; `MOD-002` revision 1; `MOD-003` revision 1; `MOD-004` revision 1; `DATA-001` revision 1; `VAL-001` revision 1; `QLT-001` revision 1; `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `product/DOMAIN_MODEL.md` revision 1; `product/PRODUCT_FOUNDATION.md` revision 1; C5 verification evidence satisfying the C5 and G5 criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md).
- **Affected artifacts:** `product/PRODUCT_FOUNDATION.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and the artifact-status row in `docs/README.md`.
- **Approved decision revision:** 1.
- **Approved artifact:** `product/PRODUCT_FOUNDATION.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** Independent review recorded `G5 REVIEW: PASS`. The human owner explicitly approved G5 and `product/PRODUCT_FOUNDATION.md` revision 1 on 2026-08-09.
- **C5 verification evidence:**
  - C5 authorization: PASS — `GOV-010` is human-approved and preserves G5, C6, later-stage, architecture, delivery, implementation, and runtime boundaries.
  - Approved foundation inputs: PASS — Product Intent revision 1, Scenario Corpus revision 1, Domain Model revision 1, `VAL-001` revision 1, and every required PRD, BEH, MOD, DATA, and QLT decision are human-approved.
  - Internal reconciliation: PASS — all required product-boundary, usefulness, capability, vocabulary, lifecycle, context, recommendation, knowledge, human-control, data-control, and quality dimensions reconcile without an actual contradiction.
  - Traceability: PASS — every `PF-*` foundation statement traces semantically to approved decisions and applicable Product Intent, scenario, and Domain Model evidence.
  - Unresolved decisions: PASS — no decision record is `OPEN`; `PLAN-001`, `DLV-001`, `DLV-002`, and `ARC-001` through `ARC-006` remain explicitly `DEFERRED`, unnecessary for C5, and assigned to later separately authorized work.
  - Documentation integrity: PASS — approved artifact revisions and decision states are valid, required repository-relative links resolve, referenced decision, Product Intent, scenario, invariant, and foundation IDs exist, and changed-file whitespace validation succeeds.
  - Change scope: PASS — changed paths are limited to the C5 baseline, C5 authorization and G5 disposition records, the operational snapshot, and the documentation ownership row.
  - Excluded later work: PASS — no architecture, persistence, database, schema, API, provider, technology, delivery-governance, implementation-plan, engineering-task, runtime-source, or deployment artifact is introduced.
- **Independent G5 review:** PASS — independent review recorded `G5 REVIEW: PASS` with no G5 gate-blocking findings.
- **Human disposition:** APPROVED — the human owner approved G5 and `product/PRODUCT_FOUNDATION.md` revision 1 on 2026-08-09.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and approved lifecycle status of the C5 baseline. It changes no documentation-control semantics, topic-authority rule, authorization rule, dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Does not authorize:** C6 or C7; architecture; persistence, database, schema, or API design; provider or technology selection; delivery governance; implementation planning or engineering tasks; deployment; or runtime source code.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-012 — C6 Delivery Governance authorization

- **Question:** Authorize C6 Delivery Governance under the approved Generation 2 Foundation Program while preserving G6, C7, architecture, engineering, and runtime boundaries.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** G5 and the Product Foundation revision 1 are approved, and the human project owner has explicitly authorized C6 so that the minimum provider-neutral delivery-governance and engineering work-contract baseline can be decided and proposed without entering architecture, implementation, or control-plane construction.
- **Alternatives:** Keep C6 unauthorized; authorize C6 within the approved program boundary; authorize a broader stage, architecture, engineering, or runtime scope.
- **Normative dependencies:** `GOV-011`.
- **Affected artifacts:** `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, `docs/README.md`, and C6-authorized `development/DELIVERY_CONTRACT.md` materials.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human project owner explicitly authorized “C6 — Delivery Governance” under the scope, dependencies, exit criteria, and prohibitions of the approved Generation 2 Foundation Program; authorized resolution of `DLV-001` and `DLV-002`; directed that this authorization be recorded durably before C6 work begins; and limited C6 to defining a provider-neutral delivery governance contract that later tooling may implement.
- **Authorized inputs:** `product/PRODUCT_FOUNDATION.md` revision 1; `product/PRODUCT_REQUIREMENTS.md` revision 1; `product/SCENARIOS.md` revision 1; `product/DOMAIN_MODEL.md` revision 1; approved repository governance; and applicable approved decision records.
- **Authorized scope:** Decision facilitation and resolution for `DLV-001` and `DLV-002`; preparation of the minimum provider-neutral delivery-governance contract, Task Packet and engineering-entry/completion contract, scope and authority controls, role and evidence semantics, verification and independent-review boundaries, bounded recovery and escalation, concurrency and isolation invariants, durable execution-evidence semantics, deterministic documentation verification, and a proposed G6 disposition and review candidate.
- **Does not authorize:** G6 approval or independent gate disposition; C7; runtime product architecture or architecture decisions; persistence, database, schema, or API design; runtime technology or provider selection; implementation planning or engineering tasks; source code; deployment; or implementation of an orchestration or control-plane system.
- **Supersedes:** None.
- **Superseded by:** None.

### GOV-013 — G6 Delivery Governance disposition

- **Question:** Approve `development/DELIVERY_CONTRACT.md` revision 1 and `DLV-001` and `DLV-002` revision 1 as the completed C6 Delivery Governance baseline for G6.
- **Status:** APPROVED
- **Decision owner:** `github:hdangprod`
- **Rationale:** C6 requires an independently reviewable provider-neutral delivery-governance baseline that makes authority, scope, readiness, evidence, review, recovery, escalation, isolation, and completion reconstructible without authorizing engineering work.
- **Alternatives:** Approve the proposed C6 baseline after independent review; return it for revision; reject it.
- **Normative dependencies:** `GOV-012`; `GOV-011`; `DLV-001` revision 1; `DLV-002` revision 1; `product/PRODUCT_FOUNDATION.md` revision 1; `development/DELIVERY_CONTRACT.md` revision 1; C6 verification evidence satisfying the C6 and G6 criteria in [FOUNDATION_PROGRAM.md](FOUNDATION_PROGRAM.md).
- **Affected artifacts:** `development/DELIVERY_CONTRACT.md`, `docs/foundation/DECISIONS.md`, `docs/development/CURRENT.md`, and the artifact-status row in `docs/README.md`.
- **Approved normative inputs:** `DLV-001` revision 1 and `DLV-002` revision 1 are human-approved inputs to this G6 disposition.
- **Approved artifact:** `development/DELIVERY_CONTRACT.md`.
- **Approved revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** Independent review recorded `G6 REVIEW: PASS` against `development/DELIVERY_CONTRACT.md` revision 1, Git blob `0b7bfa2ef21862109e8a45053f7a2106eb00217a`. The human project owner explicitly approved G6 and `development/DELIVERY_CONTRACT.md` revision 1 on 2026-08-09.
- **C6 verification evidence:**
  - C6 authorization: PASS — `GOV-012` is human-approved and preserves G6, C7, architecture, engineering, runtime, and control-plane implementation boundaries.
  - Delivery decisions: PASS — `DLV-001` and `DLV-002` revision 1 record the human-approved responsibility, autonomy, Task Packet, Delivery Record, readiness, completion, review, correction, and provider-neutrality dispositions.
  - Delivery Contract completeness: PASS — revision 1 defines required responsibilities and capability abstraction; task dependency and lifecycle semantics; Task Packet and role-specific context; risk supplements; DoR and DoD; Delivery Record; deterministic verification and evidence precedence; independent review and findings; correction, failure classification, bounded recovery, escalation, concurrency, isolation, and durable evidence.
  - Human approval boundary: PASS — Human Reserved Authority is non-bypassable, G6 remains a human decision, and qualitative autonomy cannot create authority.
  - Provider neutrality: PASS — durable semantics separate responsibility, capability profile, runner, and model or provider; no named runner, model, or provider is normative.
  - Review independence: PASS — the candidate producer cannot independently provide required final semantic review; review binds to an exact candidate and deterministic evidence.
  - Task and evidence traceability: PASS — Task Packet dispatch input is distinguishable from the durable Delivery Record, and candidate, verification, review, finding, repair, decision, and completion state are reconstructible without chat history.
  - Documentation integrity: PASS — required repository-relative links resolve, decision states and revisions are consistent, and changed-file whitespace validation succeeds.
  - Change scope: PASS — changes are limited to the C6 contract, C6 authorization and decisions, G6 disposition, operational state, and documentation ownership row.
  - Excluded work: PASS — no runtime architecture, architecture decision, persistence, database, schema, API, technology or provider selection, engineering task, source code, deployment, or control-plane implementation is introduced or authorized.
- **Independent G6 review:** PASS — independent review recorded `G6 REVIEW: PASS` against the exact Delivery Contract candidate identified above; no G6 gate-blocking findings remain.
- **Human disposition:** APPROVED — the human project owner approved G6 and `development/DELIVERY_CONTRACT.md` revision 1 on 2026-08-09.
- **Editorial-only change attestation:** The `docs/README.md` ownership-map update records the authorized creation and approved lifecycle status of the previously reserved Delivery Contract. It changes no documentation-control semantics, topic-authority rule, authorization rule, dependency rule, or approved C1 meaning and therefore does not reopen G1.
- **Does not authorize:** C7; runtime architecture or architecture decisions; persistence, database, schema, or API design; technology or provider selection; implementation planning or engineering tasks; source code; deployment; control-plane implementation; or runtime work.
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

### MOD-001 — Project and Action vocabulary

- **Question:** Which work concepts are canonical in v1, and must Task and Step be semantically distinct?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The approved scenarios require a bounded Project with an intended outcome and concrete accepted work, while explicitly demonstrating that useful behavior does not require a Milestone/Task/Step hierarchy or Task-versus-Step classification.
- **Alternatives:** Project plus Action; Project plus recursively nested Work Item; optional named Area, Milestone/Phase, Task, and Step hierarchy.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; `product/SCENARIOS.md`; `product/PRODUCT_REQUIREMENTS.md`.
- **Decision:** V1 uses `Project` and `Action` as its minimum canonical work vocabulary. A Project is a bounded effort with an intended outcome. An Action is concrete accepted work that is sufficiently clear to begin and has a recognizable stopping or completion point. A Project may have zero or more Actions, and an Action belongs to exactly one Project in v1. `Area`, `Milestone`, `Phase`, `Task`, and `Step` are not canonical v1 domain concepts. Those terms may be used conversationally where natural but do not create separate domain types or lifecycle semantics.
- **Boundary:** V1 has no recursive Work Item or parent/child Action hierarchy. This decision does not prevent a later approved revision from introducing additional planning or decomposition concepts when approved scenario evidence demonstrates a real need.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative A1 with the vocabulary, cardinality, conversational-language, non-recursion, and later-revision qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-002 — Project and Action lifecycles

- **Question:** What lifecycle states, transitions, and completion criteria apply to Project and Action?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** `MOD-001` establishes Project and Action as the canonical work concepts, but the approved evidence does not yet decide their create, active, pause or interruption, completion, abandonment, reopening, or archival semantics.
- **Alternatives:** D1 — separate evidence-minimal Project and Action lifecycles; D2 — add explicit stopped or withdrawn outcomes; D3 — add richer paused, blocked, abandoned, cancelled, or archived states.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `MOD-001` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
- **Scenario evidence:** `SCN-001` establishes an active Project; `SCN-002` requires an Action with a recognizable stopping or completion point; `SCN-003` proves interruption and resumption but not a Paused lifecycle state; `SCN-004` distinguishes completed work from accepted progress; and `SCN-006` proves that multiple Projects may be active simultaneously.
- **Decision:** Project has canonical states `Active` and `Completed`; a newly accepted Project is `Active`, completion means the user authoritatively accepts that its intended outcome was achieved, and explicit reopening returns it to `Active`. Action has canonical states `Open` and `Completed`; a newly accepted Action is `Open`, completion means the user authoritatively accepts that its recognizable stopping or completion point was satisfied, and explicit reopening or correction returns it to `Open`. Interruption, inactivity, lack of conversational focus, unresolved matters, dependencies, or blockers do not change lifecycle state. Accepted progress need not complete an Action. Project completion does not delete, archive, invalidate, or change the lifecycle of its Actions, context, or related Knowledge Items.
- **Boundary:** `Active` is not conversational focus, and `Open` is not recommendation status. V1 has no canonical `Paused`, `Blocked`, `Abandoned`, `Cancelled`, `Withdrawn`, `Archived`, or equivalent lifecycle states. Intentional abandonment remains unmodeled until approved evidence requires it. This decision defines no implementation status fields, timestamps, persistence representation, or technical transition mechanism.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative D1 with the Project and Action states, user-authoritative completion, reopening, non-transition conditions, non-cascading Project completion, excluded states, and implementation-neutral qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-003 — Knowledge vocabulary and correction lifecycle

- **Question:** What is captured knowledge in v1, and how does an accepted correction affect it?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The approved scenarios require intentional, low-friction capture, later retrieval, correction, provenance, supersession, and deletion without requiring taxonomy selection or distinct type behavior.
- **Alternatives:** One Knowledge Item with no canonical subtypes; one Knowledge Item with composable semantic roles; staged Resource, Working Note, Finding, Decision, Reflection, and Artifact taxonomy.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; `product/SCENARIOS.md`.
- **Decision:** V1 uses one canonical `Knowledge Item` concept. Capture does not require taxonomy selection. A Knowledge Item preserves its accepted content and relevant provenance. `Resource`, `Working Note`, `Finding`, `Decision`, `Reflection`, and `Artifact` are not separate canonical v1 knowledge types; they may be useful descriptive or user-facing language but do not create separate lifecycles or promotion rules. An accepted persisted correction supersedes the affected prior knowledge rather than silently rewriting it. Superseded knowledge must not be presented as current unqualified knowledge, and the correction's provenance must remain reconstructible at the product-semantic level.
- **Boundary:** Deletion is distinct from correction or supersession, and supersession must not prevent later user-directed deletion under `DATA-001`. This decision defines no technical versioning, event sourcing, storage history, identifiers, or persistence mechanism.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative B1 with the taxonomy-free capture, provenance, correction, supersession, deletion, and implementation-neutral qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### MOD-004 — Project and knowledge relationship

- **Question:** Is knowledge project-bound, reusable across projects, or both?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** The approved v1 direction is project-centered, while the approved scenarios establish project-originated knowledge and probe its later usefulness in a different Project.
- **Alternatives:** Project-bound; globally reusable; project-originated with controlled cross-project reuse.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `MOD-003` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** Future `product/DOMAIN_MODEL.md`; `product/SCENARIOS.md`; `product/PRODUCT_REQUIREMENTS.md`.
- **Decision:** V1 knowledge is project-originated with controlled cross-project reuse. When a Knowledge Item is captured during Project work, its originating Project is preserved as provenance. The item may later assist work in another Project when materially relevant. Reuse does not convert project-specific knowledge into universal truth; relevant origin or context and material uncertainty remain available where needed for correct interpretation, and the user can correct or reject inappropriate reuse.
- **Boundary:** The model remains project-centered while permitting useful continuity across Projects. This decision requires no global automatic retrieval, ranking, similarity search, embeddings, or other retrieval or implementation mechanism.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative C1 with the project-origin, controlled-reuse, contextual-uncertainty, user-correction, and implementation-neutral qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

## Product behavior and data

### BEH-001 — State and current-context authority

- **Question:** How is current Project or Action context selected, distinguished from lifecycle state, corrected, and resumed?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Approved evidence requires multiple simultaneously active Projects, useful resumption, visible uncertainty, and authoritative user correction, but does not decide whether current conversational focus must always be explicit or may be inferred.
- **Alternatives:** E1 — hybrid explicit-first context; E2 — explicit selection only; E3 — inference-first context based primarily on recency or prior focus.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `MOD-001` revision 1; `MOD-002` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/DOMAIN_MODEL.md`; future `product/SCENARIOS.md`.
- **Scenario evidence:** `SCN-001` requires an active Project; `SCN-003` requires resumption while distinguishing accepted facts from inference; and `SCN-006` requires ambiguous selection to remain uncertain and user correction to control the result.
- **Decision:** Project lifecycle state and conversational focus are distinct. Multiple Projects may be `Active`; conversation may discuss multiple Projects but may use one provisional current target when an operation requires one. Explicit current user selection, statement, or correction is authoritative. Prior accepted context may support resumption but yields to the user's current explicit intent. Liam may infer provisional conversational context when evidence is sufficiently unambiguous, but inference remains inference and does not become accepted domain fact merely by being inferred. When ambiguity would affect an accepted state-changing operation, its target must be clarified before acceptance. Inference may support non-state-changing retrieval, explanation, or recommendation when uncertainty is exposed. A state-changing operation targets one Project and, where applicable, one Action belonging to that Project.
- **Boundary:** This decision defines no recency algorithm, context window, ranking, retrieval mechanism, or persistence strategy.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative E1 with the lifecycle-versus-focus distinction, explicit-user precedence, provisional-inference, ambiguity-clarification, non-state-changing inference, target-cardinality, and implementation-neutral qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### BEH-002 — Next-action recommendation policy

- **Question:** Which inputs, precedence rules, explanations, and user overrides govern next-action recommendations?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Approved evidence requires a concrete useful recommendation, material-basis visibility, meaningful uncertainty, and user override while prohibiting an invented universal scoring policy.
- **Alternatives:** F1 — context-sensitive advisory recommendation; F2 — persistent user-authored precedence rules; F3 — shortlist-only assistance that never selects one leading candidate.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `MOD-002` revision 1; `BEH-001` revision 1; `VAL-001` revision 1.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Scenario evidence:** `SCN-002` requires refinement to a concrete Action; `SCN-003` requires a concrete restart Action; and `SCN-007` requires an actionable choice under conflicting signals without fixed universal precedence or blocked user override.
- **Decision:** Recommendation is context-sensitive and advisory. It may consider the user's explicit current intent and constraints, accepted Project context, relevant `Open` Actions, accepted progress and unresolved matters, relevant Knowledge Items with appropriate provenance, and dependencies or constraints known from accepted context. Explicit current user intent and constraints prevail over contradictory inference. V1 defines no universal scoring function or permanent precedence hierarchy among remaining signals. Material conflict or uncertainty is exposed. Liam may recommend one leading candidate when evidence supports one or a short set when ambiguity is material. Recommendations are user-overridable; rejection or inaction does not alter domain state, and a proposed Action does not become accepted merely because Liam recommends it.
- **Boundary:** This decision defines no ranking algorithm, numeric scoring, embeddings, similarity function, retrieval implementation, prompt strategy, model choice, or other architecture.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative F1 with the permitted evidence, user-intent precedence, conflict and uncertainty visibility, leading-candidate or shortlist behavior, advisory and override semantics, non-acceptance of recommendations, and architecture-neutral qualifications recorded in this decision.
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
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Approved evidence requires intentional capture, truthful acceptance status, safe correction or retry, user-directed deletion, and clear handling of mixed or prohibited requests without deciding whether every state change needs a second confirmation turn.
- **Alternatives:** G1 — risk-proportionate explicit control; G2 — second confirmation for every state change; G3 — one explicit unambiguous direction is sufficient even for destructive deletion.
- **Normative dependencies:** `GOV-008`; `PRD-002` revision 1; `BEH-001` revision 1; `BEH-002` revision 1; `DATA-001` revision 1; `MOD-002` revision 1; `MOD-003` revision 1.
- **Affected artifacts:** `product/PRODUCT_REQUIREMENTS.md`; future `product/SCENARIOS.md`.
- **Scenario evidence:** `SCN-001`, `SCN-004`, and `SCN-008` require visible accepted or failed state changes and correction; `SCN-010` requires user-directed deletion; and `SCN-011` requires distinguishable handling of acceptable, prohibited, and out-of-authority portions of one request.
- **Decision:** Retrieval, explanation, summarization, recommendations, and proposals are advisory or non-state-changing and do not alter accepted Project, Action, or Knowledge Item state. Clear and unambiguous explicit user direction is sufficient without an additional confirmation turn for establishing a Project, accepting an Action, recording accepted progress, completing or reopening a Project or Action, intentionally capturing a Knowledge Item, or persisting a correction or supersession. The original explicit instruction may authorize such an ordinary change when target and effect are clear. Ambiguous target, scope, or material effect requires clarification before acceptance, and inference alone never changes accepted domain state. Destructive deletion has no guaranteed product-semantic undo: its scope must be clear and the user must explicitly confirm it in an additional confirmation step. Mixed acceptable, prohibited, or unresolved portions receive separate outcomes; success for one does not imply success for another.
- **Boundary:** Completion remains reopenable and knowledge correction uses supersession. No product-semantic reversibility is promised after confirmed deletion. Authentication material remains outside intended capture; Liam does not claim medical, legal, or financial authority; v1 scope cannot expand silently; and an unaccepted state change cannot be reported as accepted. This decision selects no UI pattern, transaction or undo mechanism, authorization system, persistence design, or implementation protocol.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human owner explicitly approved alternative G1 with the advisory and state-changing classifications, ordinary-change authorization, ambiguity clarification, inference prohibition, additional deletion confirmation, mixed-request separation, prohibited outcomes, reversibility limits, and implementation-neutral qualifications recorded in this decision.
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
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Interchangeable humans and AI agents require stable responsibility, capability, evidence, independence, recovery, and human-authority semantics that remain valid when runners, models, and providers change. Safe autonomous continuation must be governed by evidence and explicit authority rather than raw model confidence.
- **Alternatives:** Minimum safe responsibility separation with a qualitative evidence contract; fully granular permanent roles; collapsed delivery responsibilities; a normative numeric autonomy threshold; a hybrid normative threshold; provider-specific roles; a single-model workflow.
- **Normative dependencies:** `GOV-011`; `GOV-012`; `product/PRODUCT_FOUNDATION.md` revision 1.
- **Affected artifacts:** `development/DELIVERY_CONTRACT.md`.
- **Decision:** Use minimum safe, provider-neutral responsibility separation. The durable responsibilities are Delivery Planner / Controller, Builder, Deterministic Verifier, Independent Reviewer, and Human Reserved Authority. Scout is a bounded read-only assignment mode. Adjudication is an exceptional responsibility used only when ordinary planner or reviewer recovery cannot resolve a material semantic, authority, or review dispute. Responsibility separation defines authority and evidence boundaries, not a requirement for a separate process, provider, model, or software service for each responsibility. The producer of a candidate cannot independently provide its required final semantic review. Durable routing separates `RESPONSIBILITY → CAPABILITY PROFILE → RUNNER → MODEL / PROVIDER`; named systems are not delivery authority.
- **Autonomy decision:** Use a qualitative evidence contract and no normative numeric autonomy threshold. Autonomous continuation is permitted only at the lifecycle point where all applicable authority, scope, dependency, readiness, deterministic-evidence, independent-review, ambiguity, recovery, reversibility, and Human Reserved Authority conditions are satisfied. Numeric confidence or autonomy scores may be non-authoritative routing or calibration signals only; they create no authority, override no failed evidence or human boundary, and no `85%` or other threshold is normative without calibrated operating evidence.
- **Human Reserved Authority:** Non-bypassable cases include product-scope semantic changes; Foundation or other governance gate approval; architecture approval; security-boundary decisions; irreversible or destructive actions where human approval is required; unresolved conflicts between authoritative sources; unapproved scope expansion; and any decision repository governance explicitly reserves to a human.
- **Recovery boundary:** Where safe and authorized, bounded recovery may reread canonical authority, gather missing deterministic evidence, use bounded Scout or Reviewer analysis, narrow or split the work contract, and re-evaluate readiness or authority. Blind retry loops are prohibited. Materially identical repeated failure requires diagnosis or reclassification, and recovery must not attempt to bypass Human Reserved Authority.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human project owner explicitly approved minimum safe separation and the qualitative evidence contract with the responsibility, independence, provider-neutrality, autonomy, Human Reserved Authority, bounded-recovery, and no-normative-threshold qualifications recorded in this decision.
- **Supersedes:** None.
- **Superseded by:** None.

### DLV-002 — Delivery packet and engineering completion contract

- **Question:** What engineering Definition of Ready/Done and Task Packet format will govern implementation work?
- **Status:** APPROVED
- **Decision owner:** `hdangprod`
- **Rationale:** Future work needs one reconstructible work-contract model that supplies minimally sufficient dispatch context and separates that input from evidence generated during delivery. Risk may add controls without fragmenting governance into unrelated packet systems.
- **Alternatives:** One standard core with risk-based supplements; unrelated tiered packet formats; a lighter ad hoc packet.
- **Normative dependencies:** `GOV-011`; `GOV-012`; `DLV-001`; `product/PRODUCT_FOUNDATION.md` revision 1.
- **Affected artifacts:** `development/DELIVERY_CONTRACT.md`.
- **Decision:** Use one common delivery-contract model with a standard minimum Task Packet and a distinguishable durable Delivery Record. Higher-risk work adds controls, evidence, or review to the common contract rather than using unrelated packet systems. The Task Packet contains minimally sufficient dispatch and readiness context: Task ID, objective, normative authority, dependencies, relevant context or resources, allowed and forbidden scope, constraints and invariants, Definition of Done, required verification, risk classification, assigned responsibility and capability profile, Human Reserved Authority boundaries, and prior finding IDs for corrective work where applicable. It requires neither whole conversation transcripts nor unrelated repository history. The Delivery Record contains evidence generated after dispatch, including execution status, exact candidate revision, verification evidence, review result, finding IDs, repair and recheck history, obtained human decisions or approvals, and completion evidence. Future tooling may represent both together, but their information semantics and lifecycle remain distinguishable.
- **Readiness decision:** A task is Ready only when its objective, normative authority, task authorization, dependencies, scope boundaries, Definition of Done, verification contract, necessary Human Reserved Decisions, and resource or write-conflict controls are sufficient as applicable. A blocked task does not block independent Ready work.
- **Completion decision:** A task is Done only when applicable authorized scope is complete; no unauthorized expansion is present; deterministic verification passes; required evidence is durable; required review is `REVIEW GREEN` or equivalent; blocking findings are resolved; the reviewed candidate is identifiable; required Human Reserved approvals are recorded; and resulting state is reconstructible without transient conversation history. Builder assertion alone is never completion, and the contract promises `REVIEW GREEN`, not impossible certainty.
- **Review decision:** Independent review binds to the exact candidate. Structured findings route correction. Bounded fixes without material unrelated semantic change receive targeted recheck; fresh full independent review is required only for material semantic or high-risk change, compromised independence, unresolved disagreement, or an explicit gate requirement.
- **Approved decision revision:** 1.
- **Approved on:** 2026-08-09.
- **Approved by:** `github:hdangprod`.
- **Approval evidence:** The human project owner explicitly approved the standard core with risk-based supplements and the Task Packet, Delivery Record, readiness, completion, review, correction, and provider-neutrality qualifications recorded in this decision.
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

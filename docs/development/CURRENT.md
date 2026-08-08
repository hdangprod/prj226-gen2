# Current Project State

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Last updated:** 2026-08-09

**Decision owner:** `hdangprod`

## Snapshot

- **Generation:** 2
- **Current program:** Generation 2 Foundation
- **C1 — Documentation Governance:** COMPLETE
- **G1 — Documentation Governance:** APPROVED BY HUMAN
- **C2 — Product Intent:** COMPLETE
- **G2 — Product Intent:** APPROVED BY HUMAN
- **C3 — Scenario and Acceptance Evidence:** COMPLETE
- **G3 — Scenario and Acceptance Evidence:** APPROVED BY HUMAN
- **Runtime architecture design:** NOT AUTHORIZED (PROHIBITED)
- **Runtime implementation:** NOT AUTHORIZED (PROHIBITED)

## Baseline and review state

- **Approved working plan:** [Generation 2 Foundation Program, revision 1](../foundation/FOUNDATION_PROGRAM.md) (`GOV-001` in [DECISIONS.md](../foundation/DECISIONS.md)); this is not G1 approval or authority for a later stage.
- **Bootstrap agent authority:** [AGENTS.md revision 1](../../AGENTS.md) is approved through `GOV-003`; this does not approve G1, C2, runtime architecture, or runtime implementation.
- **G1 approval:** `GOV-002` is APPROVED by the human owner. It records the C1 baseline approval and the narrow `GOV-003` bootstrap exception; neither authorizes C2 or runtime work.
- **C2 authorization:** `GOV-004` is APPROVED by the human owner. It authorizes only C2 product-intent work within the Foundation Program and does not approve G2 or authorize C3 or later work.
- **C2 approved product decisions:** `PRD-001` through `PRD-004`, `BEH-003`, `DATA-001`, and `QLT-001` are APPROVED at decision revision 1 by the human owner.
- **C2 product-intent artifact:** [Liam v1 Product Intent, revision 1](../../product/PRODUCT_REQUIREMENTS.md) is `CANONICAL / APPROVED` through `GOV-005`.
- **G2 disposition:** `GOV-005` is `APPROVED` by the human owner on 2026-08-09, with independent evidence recorded as `G2 REVIEW: PASS`.
- **C3 authorization:** `GOV-006` is APPROVED by the human owner. It authorized only C3 scenario and semantic-acceptance work and did not itself approve `VAL-001`, G3, C4, or runtime work.
- **C3 approved baseline:** [Liam v1 Scenario and Semantic Acceptance Corpus, revision 1](../../product/SCENARIOS.md) is `CANONICAL / APPROVED`; `VAL-001` is APPROVED through `GOV-007`.
- **G3 disposition:** `GOV-007` is APPROVED by the human owner on 2026-08-09, with independent evidence recorded as `G3 REVIEW: PASS`. It approves G3, `VAL-001` revision 1, and `product/SCENARIOS.md` revision 1 only.
- **C3 verification:** PASS — 12 scenario families have complete semantic schemas; all 37 approved Product Intent statements are traceable; 11 corpus-wide invariants derive from approved authority; open decisions are explicit; required relative links resolve; changed-file whitespace checks pass; and no runtime source or later-stage artifact was introduced.
- **Explicitly unresolved behavior and domain decisions:** `BEH-001`, `BEH-002`, `BEH-004`, and `MOD-001` through `MOD-004` remain `OPEN`; the C3 baseline exposes rather than resolves their semantics.
- **C1 baseline:** [Foundation Program](../foundation/FOUNDATION_PROGRAM.md), [documentation control plane](../README.md), [decision register](../foundation/DECISIONS.md), [AGENTS.md](../../AGENTS.md), [README.md](../../README.md), and [FOUNDATION_SEED.md](../../FOUNDATION_SEED.md).
- **G3 blockers:** None.

## Authorized work

C3 — Scenario and Acceptance Evidence was authorized under `GOV-006` and completed with human G3 approval through `GOV-007`. C4 is the next planned stage but remains separately unauthorized. Further work is limited to governance-state maintenance unless the human records additional authorization.

This snapshot reflects authorization recorded in approved governance artifacts; it does not create, extend, or approve authorization.

**Current stage state:** C3 — Scenario and Acceptance Evidence — COMPLETE / G3 APPROVED

**Next planned stage:** C4 — Domain and Lifecycle Semantics
**Authorization:** NOT AUTHORIZED
**Preconditions:**

- G1 approved through `GOV-002` — satisfied.
- C2 authorization recorded through `GOV-004` — satisfied.
- G2 approved through `GOV-005` — satisfied.
- C3 authorization recorded through `GOV-006` — satisfied.
- C3 evidence approved through `GOV-007` — satisfied.
- Explicit human authorization for C4 — not recorded.

**Corresponding gate:** G4 — Domain and Lifecycle Semantics — not eligible until C4 is separately authorized and its evidence is complete.

**C4–C7:** NOT AUTHORIZED.

## Explicit prohibitions

- Do not create `src/` or runtime code.
- Do not design runtime architecture.
- Do not choose databases, persistence technologies, Cloudflare services, frameworks, MCP providers, or LLM providers.
- Do not create schemas, ADRs, implementation tasks, or speculative placeholder documents.
- Do not resolve product, architecture, technology, or G1-approval decisions without the human owner.
- Do not begin C4 domain-model work or any later Foundation stage.

For document authority and reading order, use [docs/README.md](../README.md). For stages, gates, and eligibility, use the [Foundation Program](../foundation/FOUNDATION_PROGRAM.md). For all open and deferred decisions, use [DECISIONS.md](../foundation/DECISIONS.md).

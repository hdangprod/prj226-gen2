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
- **Explicitly unresolved behavior decisions:** `BEH-001`, `BEH-002`, and `BEH-004` remain `OPEN`; the approved baseline preserves rather than resolves their later semantics.
- **C1 baseline:** [Foundation Program](../foundation/FOUNDATION_PROGRAM.md), [documentation control plane](../README.md), [decision register](../foundation/DECISIONS.md), [AGENTS.md](../../AGENTS.md), [README.md](../../README.md), and [FOUNDATION_SEED.md](../../FOUNDATION_SEED.md).
- **G1 blockers:** None.

## Authorized work

C2 — Product Intent was authorized under `GOV-004` and completed with human G2 approval through `GOV-005`. C3 remains separately unauthorized; further work is limited to authorized review or governance-state maintenance unless the human records additional authorization.

This snapshot reflects authorization recorded in approved governance artifacts; it does not create, extend, or approve authorization.

**Current stage state:** C2 — Product Intent — COMPLETE / G2 APPROVED

**Next planned stage:** C3 — Scenario and Acceptance Evidence
**Authorization:** NOT AUTHORIZED
**Preconditions:**

- G1 approved through `GOV-002` — satisfied.
- C2 authorization recorded through `GOV-004` — satisfied.
- G2 approved through `GOV-005` — satisfied.
- Explicit human authorization for C3 — not recorded.

**Corresponding gate:** G3 — Scenario and Acceptance Evidence — not eligible until C3 is separately authorized and its evidence is complete.

**C3–C7:** NOT AUTHORIZED.

## Explicit prohibitions

- Do not create `src/` or runtime code.
- Do not design runtime architecture.
- Do not choose databases, persistence technologies, Cloudflare services, frameworks, MCP providers, or LLM providers.
- Do not create schemas, ADRs, implementation tasks, or speculative placeholder documents.
- Do not resolve product, architecture, technology, or G1-approval decisions without the human owner.
- Do not begin C3 scenario-corpus work or any later Foundation stage.

For document authority and reading order, use [docs/README.md](../README.md). For stages, gates, and eligibility, use the [Foundation Program](../foundation/FOUNDATION_PROGRAM.md). For all open and deferred decisions, use [DECISIONS.md](../foundation/DECISIONS.md).

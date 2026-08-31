# ENG-011 Repair-12 Write-Lock Insufficiency Disposition and Restart-1 Authorization

**Artifact class:** OPERATIONAL / CONTROLLER RECORD
**Lifecycle status:** ACTIVE
**Date:** 2026-08-31
**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`
**Controller outcome:** `REPAIR-12 STOP BOUND / REQUIREMENT INTERPRETATION CORRECTED / REPAIR-12 RESTART-1 AUTHORIZED`

## Decision

**DISTINCT ACTUAL HUMAN CONTROL DENIAL: NOT AUTHORIZED / PRIOR REPAIR INTERPRETATION EXCEEDED AUTHORITY.**

`ENG-011-TC-08` requires existing authorization rejection/denial evidence to be distinct from unresolved and non-accepted. It does not authorize adding a new Human Control outcome or an additional discretionary denial decision after an otherwise sufficient ordinary direction or deletion confirmation.

The controlling approved sources are `BEH-004`, `PF-CTL-001`, and Domain Model invariant 14. Together they make clear, unambiguous explicit direction sufficient for ordinary changes and clear scope plus separate explicit confirmation sufficient for destructive deletion. They define ambiguity clarification, prohibited outcomes, failed outcomes, and unresolved portions; none defines a separate actual Human Control denial. `GOV-018` authorizes implementation of approved behavior, not creation of a new Product/Domain authorization semantic.

Introducing `DeniedOutcome`, a deny option, or an equivalent Human Control veto path would therefore be an **AUTHORITY / CONTRACT EXPANSION** requiring a human Product/Domain decision. It is not authorized here.

## Bound Repair-12 state

| Item | Disposition |
| --- | --- |
| Revision-3 dispatch | `359fc07a74883268766d282b75a4bfa69f1fafa6` — `SUPERSEDED FOR EXECUTION / PRIOR REQUIREMENT INTERPRETATION EXCEEDED AUTHORITY / NO CANDIDATE / HISTORICAL GOVERNANCE EVIDENCE` |
| Builder worktree | `/private/tmp/prj226-eng011-builder-repair-12` — `STOPPED CORRECTLY / PARTIAL UNCOMMITTED IMPLEMENTATION / NO CANDIDATE / NON-OPERATIVE FOR RESTART` |
| Failed implementation candidates | Exactly 12; unchanged |
| Push | `NOT PERFORMED` |
| Migration | `NO MIGRATION` |

The worktree's partial bytes are not restart authority and must not be copied, staged, committed, exported, or otherwise reused.

## Dependency and write-surface audit

| Consumer/surface | In Revision-3 20-path lock? | Change required by the corrected interpretation? | Result |
| --- | --- | --- | --- |
| `src/application/contracts/humanControl.ts` | No | No. The proposed change would create the unauthorized outcome. | Protected; no change. |
| `src/application/services/interaction/interactionOrchestrator.ts` | Yes | No contract-narrowing change is required. It already returns non-success authorization outcomes without mutation. | Existing controlled implementation surface. |
| `tests/application/services/interaction/interactionObservability.test.ts` | Yes | Yes, as already required by the full ENG-011 reconstruction: prove existing authorization rejection/non-acceptance separately from unresolved, with truthful evidence. | Existing controlled test surface. |
| `tests/application/services/interaction/interactionDeletion.test.ts` | Yes | No additional denial-contract test. Preserve accepted deletion confirmation and existing rejection/unresolved regressions. | Existing controlled test surface. |
| `tests/application/contracts/humanControl.test.ts` | No | No. A direct denied-variant test would substantively verify an unauthorized new contract. Existing success/unresolved coverage remains protected. | Protected; no change. |
| `tests/application/contracts/authorization.runtime.test.ts` | No | No. It validates issued/fabricated capability behavior, not a new denial semantic. | Protected; no change. |
| Domain/application services and D1 integration consumers | Mixed; only the listed existing service/integration paths are locked | No. They consume opaque successful capabilities; authorization rejection is already non-accepted before authoritative mutation. | No change. |

Searches covered `AuthorizationOutcome`, `UnresolvedOutcome`, `HumanControl`, ordinary and confirmed-deletion authorization methods, their production callers, direct contract tests, service tests, D1 integration helpers, and existing narrowing checks. The orchestrator uses positive capability-kind guards, so adding a variant would be source-compatible there, but that fact cannot authorize the variant. No exhaustive switch becomes unsound because no union changes.

## Minimal execution decision

The exact write lock remains **20 paths**, unchanged. No twenty-first path is authorized. Task Packet revision 4 corrects the operative interpretation, Formal DoR revision 4 independently returns `PASS`, and the next execution is **ENG-011 Repair-12 Restart-1**, not Repair 13.

The Restart-1 Builder must preserve every Repair-12 reconstruction obligation: full applicable-stage observability; closed runtime admission; exact-object provenance; retrieval/provider/persistence matrices; `TC-01..TC-21`; `R3-TC-01..R3-TC-18`; DATA-001; Human Control; no automatic retry; no provider fallback; and no migration. For authorization evidence it must prove only the authorized semantic: existing authorization rejection/non-acceptance remains distinct from unresolved, reaches no authoritative mutation, and has a truthful non-accepted terminal result. It must not invent a Human Control denial reason or outcome.

## Restart dispatch conditions

The governance-only commit containing this record is the sole Restart-1 dispatch authority. It must have one parent on the current governance lineage, must not descend from any of the twelve failed candidates, and provisions a fresh `eng-011-builder-repair-12-restart-1` worktree at `/private/tmp/prj226-eng011-builder-repair-12-restart-1`. The Builder must verify exact branch/HEAD/tree, tracked and index cleanliness, and empty untracked state, then stop before implementation.

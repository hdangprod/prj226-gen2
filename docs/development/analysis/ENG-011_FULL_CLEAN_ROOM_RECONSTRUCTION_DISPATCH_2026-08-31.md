# ENG-011 Full Clean-Room Reconstruction Disposition and Repair-14 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** `FULL CLEAN-ROOM RECONSTRUCTION DISPATCH PREPARATION`

**Task Packet / Formal DoR:** `REVISION 5 / OPERATIVE / PASS`

**Controller outcome:** `FULL CLEAN-ROOM ENG-011 RECONSTRUCTION AUTHORIZED`

## 1. Disposition

**ENG-011 CONTROLLER FULL CLEAN-ROOM RECONSTRUCTION: AUTHORIZED**

This is not a TC-21 narrow repair and not an incremental patch over a failed candidate.
Repair-14 must reconstruct the entire operative ENG-011 implementation from durable
Revision-5 authority. The Builder must not credit any requirement, test, or source byte from
a failed candidate. Repair-13 remains immutable incomplete topology evidence only; its bytes
are likewise prohibited reconstruction input.

## 2. Authorized clean base

| Field | Verified value |
| --- | --- |
| **AUTHORIZED BASE** | `0056859b6d1c0fa2b90ec87f7f95c7a46887ae2d` |
| **BASE TREE** | `7adf7735813c9ba7d609f951a2ac180734ce9efa` |
| **BASE PARENTS** | `690b4db4c04efe9417b7e552e038f3788c7269c9` |

This base is authoritative because it is the current canonical governance head, contains the
Repair-13 topology adjudication and all operative Revision-5 Task Packet, Formal DoR, and
prior-repair authority, while remaining `PRESENT_NOT_ANCESTOR` in relation to every member of
the thirteen-commit failed implementation set. It supports the required one-parent,
distance-one candidate topology.

The base tree intentionally contains no `src/application/ports/observability/**`,
`src/infrastructure/observability/**`, or their new dedicated test/config paths. Its existing
interaction, Project/Action/context, Knowledge, contract, deletion, and local-D1 seams are
the pre-ENG-011 canonical architecture to be reconstructed against. It must never be treated
as containing Repair-12 or Repair-13 implementation.

## 3. Exact write lock preflight

**WRITE LOCK: 20 EXACT PATHS / CONFIRMED SUFFICIENT**

The Revision-5 lock remains sufficient for the whole reconstruction: the ten production
paths contain the new evidence port and Cloudflare writer, the orchestration and result
propagation seams, and their only permitted contracts; the ten test/config paths cover schema,
real interaction flows, deletion, service propagation, writer, and local-D1 proof. Every
other path remains read-only. No Product, Domain, Human Control, provider architecture,
migration, deployment, package, configuration, or protected upstream service change is
needed or authorized.

The exact path list, closed event contract, prohibited scope, numbered TC matrix, R3 matrix,
regression matrix, verification commands, migration identity, and Definition of Done are
binding as written in [ENG-011 Task Packet revision 5](../tasks/ENG-011-observability-failure-recovery-hardening.md).

## 4. Full reconstruction contract

The Builder must independently reconstruct all of the following inside the lock:

- the closed operational-evidence schema, closed runtime enums, structural opaque-ID and
  cross-field-invariant validation, exact-object event and ObservationContext provenance, and
  Cloudflare structured-writer admission/projection;
- correlated Project, Action, Context, Progress, Knowledge, retrieval, provider/advisory,
  Human Control, authorization-rejection, persistence, derived-state, deletion, export,
  retry, fail-open, mixed/heterogeneous-outcome, and trusted-ingress evidence;
- DATA-001 minimization for every runtime flow family, including the prohibited content,
  provider, raw-error, persistence, credential, and arbitrary-bag surfaces;
- the complete `ENG-011-TC-01` through `ENG-011-TC-21` matrix and all operative
  `R3-TC-01` through `R3-TC-18` obligations, with every substantive PASS produced by the new
  reconstruction bytes and tests;
- every binding Repair-7 through Repair-12 finding: opaque-ID/runtime trust/cross-field
  hardening; request-attempt separation and Promise containment; caller override and
  copyable-provenance defenses; required-stage and closed-enum coverage; the Revision-4
  actual-Human-Control-denial boundary; and the Revision-5 independent-flow TC-13 correction.

TC-13 has exactly two independently exercised real flows. A real advisory/proposal provider
success produces provider-success and advisory/proposed terminal evidence with zero
authorization, accepted-persistence, or accepted-authoritative success. A real authoritative
mutation durability failure produces failed persistence and a non-accepted terminal result
with zero provider success, accepted persistence, accepted user-visible result, or automatic
retry. A fabricated provider-to-mutation chain is prohibited.

TC-21 is required from the start and must be candidate-resident and executable. Its guard must
read the real bytes of the exact ten Revision-5 production paths, scan every required prohibited
pattern family, route synthetic violations through the same scanner, and prove every positive
control is detected. It is not a manual final scan or prose-only assertion.

## 5. Clean-room and candidate lifecycle

The Builder may inspect historical commit identities only for ancestry/provenance checks. It
must not inspect, copy, diff, cherry-pick, format-patch, apply, restore, rebase, stage from,
or otherwise reuse implementation bytes or diffs from the thirteen failed candidates or the
Repair-13 incomplete candidate. Work proceeds in coherent clusters in one fresh clean
worktree; it stops only for a genuine authority or write-lock blocker.

Before a candidate, all semantic/toolchain rows—including dynamic discovery of every
`vitest.config.ts`, all applicable local-D1 suites, local migration verification, `npm test`,
typecheck, lint, build, smoke, persistence tests, and `git diff --check`—must pass. The locked
migration remains exactly `migrations/0001_authoritative_state.sql`, blob
`5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, SHA-256
`adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`, with zero additional
migrations.

Only after those gates pass may the Builder create exactly one final implementation candidate,
using explicit staging only. `git add .`, `git add -A`, `git add --all`, merge, rebase,
cherry-pick, and amend are forbidden. Candidate-dependent `R3-TC-17` then proves all
thirteen failed candidates `PRESENT_NOT_ANCESTOR`; `R3-TC-18` then proves clean-room
provenance. This sequencing avoids a circular pre-candidate gate.

## 6. Explicit topology and assignment

| Field | Value |
| --- | --- |
| **NEW REPAIR IDENTIFIER** | `REPAIR-14` |
| **DISPATCH** | The governance-only commit containing this record |
| **EXPECTED CANDIDATE SOLE PARENT** | This dispatch commit |
| **EXPECTED PARENT COUNT** | `1` |
| **EXPECTED DISTANCE** | `1` |
| **Builder** | `ENG-011 REPAIR 14 BUILDER` |
| **Branch** | `eng-011-builder-repair-14` |
| **Worktree** | `/private/tmp/prj226-eng011-builder-repair-14` |

The candidate must demonstrate all thirteen failed implementation candidates as
`PRESENT_NOT_ANCESTOR`. Repair-13 (`1d4674d3b8231539b30cabd2d31639c88b828ab5`) is explicitly
not in that failed set unless separately adjudicated.

## 7. Boundaries and next role

Product and Domain semantics: `NO CHANGE`. Human Control: `NO CHANGE`; an actual
Human-Control denial remains not authorized. Provider architecture, deployment model, and
migration: `NO CHANGE`. No queue, background worker, fallback provider, automatic mutation
retry, persistent telemetry, external telemetry vendor, S/O/S review, or push is authorized
at dispatch.

**NEXT REQUIRED ROLE:** `ENG-011 REPAIR 14 BUILDER — FULL CLEAN-ROOM RECONSTRUCTION`

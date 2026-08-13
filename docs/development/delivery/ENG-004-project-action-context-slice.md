# ENG-004 — Project/Action/context slice Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-004`

**Task Packet revision:** 2 (revision 1 governed the reviewed candidate)

**Current lifecycle state:** `READY_FOR_BOUNDED_REPAIR`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Task Packet:** [ENG-004 — Project/Action/context slice](../tasks/ENG-004-project-action-context-slice.md)

**Recorded:** 2026-08-13

## Current disposition

Exact ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` passed deterministic verification, including the repaired genuine local-D1 evidence. Independent semantic/persistence-boundary review then returned:

`ENG-004 REVIEW: NEEDS FIX`

`ENG-004-F003` is `OPEN — BLOCKING`. ENG-004 is not `DONE`, but the accepted ENG-003 revision-2 baseline removes its upstream prerequisite.

## Candidate identity and evidence state

| Identity | Value |
| --- | --- |
| Exact base | `9874ef742adcd9eab0b0b22d61b0854db6265558` |
| Reviewed seven-file aggregate | `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` |
| Production service SHA-256 | `f493d5e0786eaf1b88c764e96f4388f34472b62528db3b564716d26edb3cb0e8` |
| Historical upstream ENG-003 revision-1 aggregate | `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` |
| Accepted upstream ENG-003 revision-2 aggregate | `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685` |
| Deterministic disposition | `ENG-004 VERIFICATION: PASS` |
| Independent review disposition | `ENG-004 REVIEW: NEEDS FIX` |

The verified candidate remained stable through deterministic verification and review. This record does not copy the candidate into the canonical branch, modify it, or accept it.

## Finding history

- `ENG-004-F001`: initially the required genuine local-D1 evidence was absent; a later real-D1 harness timed out; the final bounded harness repair completed repeatably against the accepted migration and authoritative readback. `CLOSED` for the exact reviewed aggregate.
- `ENG-004-F002`: the initial lifecycle/target/failure matrix was incomplete; bounded task-owned tests supplied the missing evidence; the fresh deterministic verifier closed it. `CLOSED` for the exact reviewed aggregate.
- `ENG-004-F003`: the completion/reopening methods at reviewed service lines 92–95 and 110–113 trust caller-supplied Project/Action state and submit put/upsert writes. A fabricated `Active` Project or fabricated `Open` Action can therefore be persisted directly as `Completed` by a caller with otherwise valid ordinary-mutation authority. `OPEN — BLOCKING`.

F003 does not reopen F001 or F002. Their historical closure remains bound to this candidate even though the candidate as a whole is not acceptable.

## Classification and routing

F003 is both a defect in the accepted upstream authoritative-persistence boundary and an omitted persistence capability required by ENG-004. The canonical owner is ENG-003, whose packet owns the provider-neutral persistence port, D1 adapter, atomicity, receipts/idempotency, and false-success boundary. ENG-004 cannot repair that dependency under its application-service-only lock.

The Controller reopened ENG-003 under Task Packet revision 2 rather than inventing a new task ID. ENG-003 revision 2 is now accepted and path-scoped manifested. ENG-004 is `READY_FOR_BOUNDED_REPAIR`; no ENG-004 implementation repair occurs in this Controller step.

## Required downstream repair after ENG-003 acceptance

After the repaired upstream API was exact-candidate verified, independently reviewed GREEN, recorded, and integrated, ENG-004 may receive a bounded repair within its unchanged exclusive roots:

- `src/application/services/projectActionContext/**`;
- `tests/application/services/projectActionContext/**`; and
- `tests/integration/d1/projectActionContext/**`.

Its lifecycle methods must request authoritative expected-state transitions by identity through the accepted persistence contract. They must not treat caller-supplied Project/Action snapshots as proof of existence or current lifecycle. Creation must use the accepted insert-only initial-state capability. The exact service command/result shape is derived from the accepted ENG-003 repair rather than preimplemented here.

Fresh deterministic verification must reproduce all closed F001/F002 evidence and add fabricated-snapshot, missing-entity, stale/concurrent transition, ownership, retry/receipt, and genuine local-D1 regressions. Because the repair changes the high-risk persistence authority composition, ENG-004 requires a fresh full independent semantic/persistence-boundary review, not only a targeted F003 recheck.

## Completion boundary

ENG-004 cannot become `DONE` until ENG-003 revision 2 returns to `DONE`, ENG-004 is repaired within its unchanged lock, exact-candidate deterministic verification passes, fresh full independent review is GREEN, all findings are durably disposed, and Controller closure is recorded.

## Controller re-evaluation after ENG-003 revision-2 closure

The accepted persistence baseline is `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`, with unchanged migration `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`. `ENG-004-F001` and `ENG-004-F002` remain `CLOSED` for their exact reviewed aggregate. `ENG-004-F003` remains `OPEN — BLOCKING` pending only the service-layer repair: replace caller-trusted lifecycle mutation/upsert use with the accepted identity-and-expected-state transition API.

The exclusive write lock is unchanged: `src/application/services/projectActionContext/**`, `tests/application/services/projectActionContext/**`, and `tests/integration/d1/projectActionContext/**`. The required sequence is a bounded repair, fresh deterministic verification reproducing the closed evidence plus F003 regressions, then a **fresh full independent semantic/persistence-boundary review**. Targeted-only review is insufficient because the repair changes high-risk persistence-authority composition.

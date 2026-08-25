# ENG-007 — Export and Confirmed Deletion Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-007`

**Task Packet:** [ENG-007 — Export and Confirmed Deletion](../tasks/ENG-007-export-confirmed-deletion.md) (Revision 3, associated with `c056ba1f01cf05dfc57800a58bd49bfe3c730403`)

**Current lifecycle state:** `READY / DISPATCHED TO BUILDER REPAIR 5`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Recorded:** 2026-08-25

## Controller delivery adjudication & durable authority repair

This Delivery Record establishes the durable repository record of delivery authority for `ENG-007` following semantic review finding `ENG-007-SR-R002-R1` and disposition of Repair 4 candidate `f12647374bef083b01b7289f823faa7d8625c733`.

The Controller adjudicates the findings and lifecycle state as follows:

1. **`ENG-007-SR-R001` (Authority / Delivery Governance):** `CLOSED`. Repaired and durably recorded on commit `38befee569dcc91b6bd62226d4615336abccb602`. Closed for current lifecycle; must not regress.
2. **`ENG-007-SR-R002` (Malformed scope coercion / identity serialization):** `OPEN (SUB-FINDING ENG-007-SR-R002-R1 ASSIGNED TO BUILDER REPAIR 5)`.
3. **`ENG-007-SR-R002-R1` (Human Control malformed identity key serialization):** `ACCEPTED / BLOCKING / ASSIGNED TO BUILDER REPAIR 5`.
   - **Severity:** `BLOCKING`
   - **Classification:** `WORK_PRODUCT_DEFECT / HUMAN-CONTROL DATA-BOUNDARY / MALFORMED IDENTITY SERIALIZATION`
   - **Root cause:** HumanControl deletion identity key generation uses `JSON.stringify` against raw caller-controlled scope values before strict primitive validation. Attacker-controlled `toJSON()` can therefore transform malformed `targetId` object or malformed `lineageMembers` member object into an apparently valid primitive identity during direction / confirmation / authorization key generation. Later replacing the raw object with the corresponding primitive lets the real MutationGate accept the previously minted authorization.
   - **Repair requirement:** Human Control must strictly validate and capture destructive scope identity BEFORE key serialization or evidence creation.
4. **`ENG-007-SR-R003` (Missing receipt re-resolution on late receipt appearance):** `CLOSED`. Semantic re-review confirmed receipt re-resolution across all 6 deletion scopes via `resolveAfterObservedAbsence` upon target pre-read absence is verified and without remaining blocker in receipt reconciliation, R003, D1 atomicity, lineage deletion, non-cascade, export, deterministic ordering, error normalization, DATA-001, or ENG-010/013. Closed for current lifecycle; must not regress.
5. **`ENG-007-DV-R001` (Lineage scope binding defect):** `ACCEPTED / BLOCKING / CLOSED BY REVISION 3 DoR RECHECK`. Resolved in Task Packet Revision 3 by binding `lineageMembers` structurally into `DeletionScope` and `MutationGate`.
6. **`ENG-007-DV-R002` (Manifest digest sort ordering):** `ACCEPTED / NON-BLOCKING / DISPOSITIONED`. Standardized on `LC_ALL=C` path sorting.
7. **`ENG-007-DOR-R001` through `DOR-R003`, `DOR2-R001`:** `RESOLVED / CLOSED`.

## Formal DoR provenance and verification

The Task Packet Revision 3 contract was established at commit `c056ba1f01cf05dfc57800a58bd49bfe3c730403`. It previously underwent independent narrow DoR recheck and passed with disposition `READY CONTRACT REPAIR VERIFIED / ENG-007 eligible for repaired READY promotion`.

| Identity | Value |
| --- | --- |
| Task Packet revision | Revision 3 |
| Base Git commit | `c056ba1f01cf05dfc57800a58bd49bfe3c730403` |
| Base tree | `af6cc15807b77913698732cccafb8d5a74bea614` |
| Base parent | `37372d37f69ae9a9f72a180ad48384a83ae3c655` |
| Governance aggregate SHA-256 | `b3e9a7ccc6b040909d443b3bfb96c35f02359e171c92c72dbee504eb8061d471` |
| Formal DoR disposition | `PASS (INDEPENDENT RECHECK VERIFIED)` |

The independent Formal DoR confirmed that Task Packet Revision 3 satisfies all Delivery Contract Definition of Ready criteria: objective clarity, `GOV-018` authority, satisfied dependencies (`ENG-002` through `ENG-006`), exact 15-path write lock, forbidden scope, observable DoD, deterministic verification contract (14 configs including all 11 canonical base configs + 3 task-owned configs, `npm run smoke`, `npm run migrate:local`), independent review contract, and resolved Human Reserved decisions (`HR-EXPORT-001`, `HR-EXPORT-002`, `HR-DELETE-001` through `HR-DELETE-004`).

## READY transition and Builder dispatch authority

The Controller durably promotes `ENG-007` to `READY` and issues Builder dispatch authority for Builder Repair 5:

- **Current lifecycle state:** `READY / DISPATCHED TO BUILDER REPAIR 5`
- **Assigned Builder:** `ENG-007 BUILDER REPAIR 5`
- **Capability profile:** `Standard Delivery`
- **Planned branch:** `eng-007-builder-repair-5`
- **Planned worktree:** `/private/tmp/prj226-eng007-builder-repair-5`
- **Dispatch state:** `AUTHORIZED / DURABLY RECORDED`
- **Implementation state:** `NOT YET STARTED`
- **Repair purpose:** Resolve blocking finding `ENG-007-SR-R002-R1` only; preserve closures of `SR-R001` and `SR-R003` without regression

Builder Repair 5 must execute strictly within the assigned branch and worktree, bound by the 15-path write lock below, starting directly from the new durable dispatch base commit. Reconstruction from prior frozen candidates must be manual/read-only; no cherry-picking, rebasing, or merging from failed candidates is permitted.

## Authorized write lock (15 paths)

### Production paths (4 files)

1. `src/application/services/exportDeletion/exportDeletionTypes.ts` (`NEW / TASK-OWNED`)
2. `src/application/services/exportDeletion/exportDeletionService.ts` (`NEW / TASK-OWNED`)
3. `src/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence.ts` (`NEW / TASK-OWNED`)
4. `src/application/contracts/humanControl.ts` (`MODIFY / CONTROLLED UPSTREAM EXTENSION`)

### Test paths (11 files)

1. `tests/application/services/exportDeletion/exportDeletionService.test.ts` (`NEW / TASK-OWNED`)
2. `tests/application/services/exportDeletion/vitest.config.ts` (`NEW / TASK-OWNED`)
3. `tests/infrastructure/d1/exportDeletion/d1ExportDeletionPersistence.test.ts` (`NEW / TASK-OWNED`)
4. `tests/infrastructure/d1/exportDeletion/fakeD1.ts` (`NEW / TASK-OWNED`)
5. `tests/infrastructure/d1/exportDeletion/vitest.config.ts` (`NEW / TASK-OWNED`)
6. `tests/integration/d1/exportDeletion/exportDeletionD1Integration.test.ts` (`NEW / TASK-OWNED`)
7. `tests/integration/d1/exportDeletion/localD1.ts` (`NEW / TASK-OWNED`)
8. `tests/integration/d1/exportDeletion/node-runtime.d.ts` (`NEW / TASK-OWNED`)
9. `tests/integration/d1/exportDeletion/vitest.config.ts` (`NEW / TASK-OWNED`)
10. `tests/application/contracts/humanControl.test.ts` (`MODIFY / CONTROLLED UPSTREAM EXTENSION`)
11. `tests/application/contracts/authorization.runtime.test.ts` (`MODIFY / CONTROLLED UPSTREAM EXTENSION`)

All other paths remain protected and forbidden.

## Historical failed candidates

The following prior candidates are frozen historical evidence and must not be used as accepted ancestry, merged, rebased, or cherry-picked:

| Candidate | Commit SHA | Status |
| --- | --- | --- |
| Initial candidate | `e73bcd19d5ec9b4f2f939abcb8a4c807691198b7` | `FROZEN / UNACCEPTED / FAILED DETERMINISTIC VERIFICATION / HISTORICAL ONLY` |
| Repair 1 candidate | `b55d29cb77ae6acd2a8da37406aa47993c0d01e2` | `FROZEN / UNACCEPTED / HISTORICAL ONLY` |
| Repair 2 candidate | `514c68e5eaf4f140e1b978a7160c5c7a16343a9d` | `FROZEN / UNACCEPTED / HISTORICAL ONLY` |
| Repair 3 candidate | `4bb8347bd92a1533770b4c04de8c2738f7fcd20c` (tree `05cae77cd08d56231f096c243686cdf824f76d84`) | `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY` |
| Repair 4 candidate | `f12647374bef083b01b7289f823faa7d8625c733` (tree `907a934e9e5e5fb2727530ce6b07b83d8184a37e`) | `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY` |

## Human Reserved authority disposition

No open Human Reserved decision exists for `ENG-007`. `HR-EXPORT-001`, `HR-EXPORT-002`, `HR-DELETE-001`, `HR-DELETE-002`, `HR-DELETE-003`, `HR-DELETE-004`, and `ENG-007-DOR-R003` repair authority were approved by `github:hdangprod`. No new product semantics, architecture changes, security boundary alterations, production deployments, or paid resources are authorized or required.

## Next required role

- **Next required role:** `ENG-007 BUILDER REPAIR 5`
- **Builder execution:** Assigned in durable record; provisioned in `/private/tmp/prj226-eng007-builder-repair-5` from new durable dispatch base commit; stop before implementation.
- **Push:** NOT AUTHORIZED.

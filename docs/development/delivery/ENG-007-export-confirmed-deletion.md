# ENG-007 — Export and Confirmed Deletion Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** COMPLETE / ACCEPTED

**Task ID:** `ENG-007`

**Task Packet:** [ENG-007 — Export and Confirmed Deletion](../tasks/ENG-007-export-confirmed-deletion.md) (Revision 3, associated with `c056ba1f01cf05dfc57800a58bd49bfe3c730403`)

**Current lifecycle state:** `DONE / ACCEPTED`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Recorded:** 2026-08-25

## Controller delivery adjudication & acceptance

This Delivery Record establishes the durable repository record of delivery authority and final acceptance for `ENG-007` following independent deterministic verification `PASS` and independent semantic review `GREEN` of Repair 6 candidate `e6b5f271d308fbac7e48667943005758efaf6d8b`.

The Controller adjudicates the findings and lifecycle state as follows:

1. **`ENG-007-SR-R001` (Authority / Delivery Governance):** `CLOSED`. Repaired and durably recorded on commit `38befee569dcc91b6bd62226d4615336abccb602`. Closed for current lifecycle; must not regress.
2. **`ENG-007-SR-R002` (Malformed scope coercion / identity serialization):** `CLOSED`.
3. **`ENG-007-SR-R002-R1` (Human Control malformed identity key serialization):** `CLOSED`. Repair 5 closed the original malformed-identity serialization / `toJSON` substitution exploit. Closed for current lifecycle; must not regress.
4. **`ENG-007-SR-R002-R2` (Hostile-Proxy error boundary / malformed lineage scope):** `CLOSED`.
   - **Severity:** `BLOCKING`
   - **Classification:** `WORK_PRODUCT_DEFECT / HOSTILE-PROXY ERROR BOUNDARY / MALFORMED LINEAGE SCOPE`
   - **Closure reason:** Repair 6 candidate `e6b5f271d308fbac7e48667943005758efaf6d8b` bounds all runtime inspections of caller-controlled lineage input (`Array.isArray`, length capture, indexed access, duplicate/root checks, and snapshot construction) inside the bounded failure path. Revoked and throwing Proxy inputs fail closed, Human Control returns bounded unresolved / `invalid-deletion-scope`, the service returns `deletion-rejected`, and zero persistence calls are made. Passed fresh independent deterministic verification (`PASS`, 420 / 420 test executions across all 14 configs) and fresh independent semantic review (`GREEN`). Closed by Controller.
5. **`ENG-007-SR-R003` (Missing receipt re-resolution on late receipt appearance):** `CLOSED`. Semantic re-review confirmed receipt re-resolution across all 6 deletion scopes via `resolveAfterObservedAbsence` upon target pre-read absence is verified and without remaining blocker. Closed for current lifecycle; must not regress.
6. **`ENG-007-DV-R001` (Lineage scope binding defect):** `ACCEPTED / BLOCKING / CLOSED BY REVISION 3 DoR RECHECK`.
7. **`ENG-007-DV-R002` (Manifest digest sort ordering):** `ACCEPTED / NON-BLOCKING / DISPOSITIONED`. Standardized on `LC_ALL=C` path sorting.
8. **`ENG-007-DOR-R001` through `DOR-R003`, `DOR2-R001`:** `RESOLVED / CLOSED`.

## Accepted Repair 6 candidate identity

| Identity | Value |
| --- | --- |
| Accepted candidate commit | `e6b5f271d308fbac7e48667943005758efaf6d8b` |
| Accepted candidate tree | `d8bd1c0c0a920e94ce929b40362d5f042939b101` |
| Direct parent | `3d1fe482e0a8af2a1aa0d12c75fe0fee26c614a6` |
| Candidate distance from dispatch | `1` (direct descendant) |
| Exact 15-path aggregate SHA-256 | `773ac643145308ab285767ee77451f6512bfe26f5415eb7c05370e93a990a195` |
| Migration Git blob | `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0` |
| Migration SHA-256 | `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` |
| Deterministic verification | `PASS` (420 / 420 test executions across all 14 configs) |
| Semantic / data-boundary review | `GREEN` |
| Controller Final Closure | `APPROVE` |
| Disposition | `ACCEPTED / CANONICALIZED` |

## Historical failed candidates

The following prior candidates remain frozen historical evidence and must not be used as accepted ancestry, merged, rebased, or cherry-picked:

| Candidate | Commit SHA | Status |
| --- | --- | --- |
| Initial candidate | `e73bcd19d5ec9b4f2f939abcb8a4c807691198b7` | `FROZEN / UNACCEPTED / FAILED DETERMINISTIC VERIFICATION / HISTORICAL ONLY` |
| Repair 1 candidate | `b55d29cb77ae6acd2a8da37406aa47993c0d01e2` | `FROZEN / UNACCEPTED / HISTORICAL ONLY` |
| Repair 2 candidate | `514c68e5eaf4f140e1b978a7160c5c7a16343a9d` | `FROZEN / UNACCEPTED / HISTORICAL ONLY` |
| Repair 3 candidate | `4bb8347bd92a1533770b4c04de8c2738f7fcd20c` (tree `05cae77cd08d56231f096c243686cdf824f76d84`) | `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY` |
| Repair 4 candidate | `f12647374bef083b01b7289f823faa7d8625c733` (tree `907a934e9e5e5fb2727530ce6b07b83d8184a37e`) | `FROZEN / UNACCEPTED / FAILED SEMANTIC RE-REVIEW / HISTORICAL ONLY` |
| Repair 5 candidate | `d6596fc587fab55f4e9b49d4c9a40e041455440d` (tree `96629f4f114725f1ee0f0345259ef7320ceedd60`) | `FROZEN / UNACCEPTED / FAILED FINAL SEMANTIC RE-REVIEW / HISTORICAL ONLY` |

## Human Reserved authority disposition

No open Human Reserved decision exists for `ENG-007`. `HR-EXPORT-001`, `HR-EXPORT-002`, `HR-DELETE-001`, `HR-DELETE-002`, `HR-DELETE-003`, `HR-DELETE-004`, and `ENG-007-DOR-R003` repair authority were approved by `github:hdangprod`. No new product semantics, architecture changes, security boundary alterations, production deployments, or paid resources are authorized or required.

## Task completion and next required step

- **Task status:** `ENG-007: DONE / ACCEPTED`
- **Current Builder:** `NONE`
- **Builder authority:** `CONSUMED / NON-OPERATIVE`
- **Canonical integration:** `CANONICALIZED / FF-ONLY INTEGRATED` into `foundation/product-foundation`
- **Next project step:** `REASSESS ENG-010 DEPENDENCIES / FORMAL DoR / READY`
- **Push:** `NOT PERFORMED`

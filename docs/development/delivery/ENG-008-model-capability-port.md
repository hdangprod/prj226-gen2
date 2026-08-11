# ENG-008 — Model Capability Port and Deterministic Double Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-008`

**Task Packet revision:** 1

**Current lifecycle state:** `DONE`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Task Packet:** [ENG-008 — Model Capability Port and Deterministic Double](../tasks/ENG-008-model-capability-port.md)

**Recorded:** 2026-08-11

## Delivery outcome

`ENG-008` completed its authorized provider-neutral Model Capability Port and deterministic-double scope after bounded security repairs and rechecks. The final candidate provides bounded, non-authoritative model requests and outcomes while excluding authentication material, provider representations, persistence, trusted Human Control ingress, and accepted-state mutation.

No material scope deviation, blocking finding, unresolved Task Packet blocker, or Human Reserved issue remains. The Controller closure did not modify the candidate or dispatch downstream implementation.

## Assigned responsibilities

- **Delivery Planner / Controller:** validated evidence and candidate identity, preserved repair history, finalized this record, transitioned task state, and re-evaluated the DAG and readiness.
- **Builder:** Standard Delivery profile; completed the bounded candidate and its security repairs.
- **Deterministic Verifier:** Deterministic Execution profile; supplied fresh final verification evidence bound to the exact candidate.
- **Independent Reviewer:** Strong Semantic Reasoning profile, independent of the Builder; supplied the fresh full final boundary/security review.

## Exact completed candidate

| Identity | Value |
| --- | --- |
| Base Git commit / HEAD used by candidate | `7365d60c260956fa1bc16a647db724f3bd1c3440` |
| Completed upstream `ENG-002` manifest | `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f` |
| Exact eight-file `ENG-008` candidate manifest | `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696` |
| Dependency lockfile SHA-256 | `445fd78c4279e62c210b8005aa4406070a832c740bfa5c905deede3b6d230ab6` |
| Candidate integrity | Byte-identical throughout final verification, review, and Controller closure |

The manifest is the SHA-256 of the newline-delimited SHA-256 listing of the following allowed-scope files in repository-path sort order. Controller closure mechanically reproduced the aggregate manifest, all component hashes, and the lockfile identity without modifying them.

| SHA-256 | Candidate path |
| --- | --- |
| `228150ca2d85cb4dd0863912cbe6178e81cb2a9f5c8a7b44bca9739afa8f4287` | `src/application/ports/model/modelCapability.ts` |
| `fdde163289b60ec4046aa08ec5196372944e437dc4d0632d8d4541454a215ecc` | `src/testing/model/deterministicModelCapability.ts` |
| `7dcb1abde2209a4a72d3f56f07505ed11f5981105cb6cce93dcd837e2023fe20` | `tests/application/ports/model/modelCapability.security.test.ts` |
| `62d9038cf5b9e86b67837d5bb5bea4888c57e1c51026f9369528b6a377313667` | `tests/application/ports/model/modelCapability.test.ts` |
| `d1af6bf3ba5e69343004c00ea350a295b2005788151cf6da979b825ffd58b573` | `tests/application/ports/model/modelCapability.toctou.test.ts` |
| `c6f009cd3e7b58c9450553ef66dee59532fac816f39ecb221adef5ee67f89bde` | `tests/application/ports/model/modelCapability.types.test.ts` |
| `b3ee85fc9c740674b80a5b63740c4a3e9a04f0a1a85bfe27b3b16fd59bf2eda6` | `tests/application/ports/model/vitest.config.ts` |
| `01c4e00b6111e86001a63d191aa58dca0ffb7d966cf7657a1f9c9710b80e38cd` | `tests/testing/model/deterministicModelCapability.test.ts` |

## Deterministic verification

Exact disposition: `ENG-008 VERIFICATION: PASS`

Fresh final deterministic verification was supplied for and bound to the final manifest above. It confirmed the contracted provider-neutral port/double behavior, context minimization and authentication-material exclusion, no-write separation for advisory/proposal/provider output, normalized uncertainty/inability/failure behavior, and absence of provider SDK/API, network, persistence, hosted-state, and trusted-ingress leakage in the allowed paths.

## Independent review

Exact disposition: `ENG-008 REVIEW: GREEN`

Fresh full independent semantic/security review was supplied for the same final manifest. It confirmed runtime provenance and validation; owned immutable request/context snapshots; authentication-material filtering; single-read snapshot discipline against TOCTOU behavior; and isolation from provider authority, Human Control, persistence, accepted-state authority, and proposal semantics. No known blocking boundary or security finding remains.

## Repair and recheck history

Completion was not a first-pass success. The durable history retains the material repair progression; earlier candidate identities and individual finding IDs were not supplied, so this record does not invent them.

1. Verification/review first found insufficient authentication-material exclusion; the bounded repair strengthened exclusion.
2. A generic `secret` assignment omission was found and repaired.
3. A runtime forged-context/provenance bypass was found and repaired through runtime provenance and validation.
4. Retained mutable input references were found and repaired with owned immutable snapshots.
5. Mutable returned context/request values were found and repaired.
6. Repeated raw-property reads created TOCTOU exposure and were repaired with single-read snapshot discipline.
7. The final repair set established runtime provenance, runtime validation, owned immutable snapshots, authentication-material filtering, single-read snapshot discipline, and provider/Human Control/persistence isolation.
8. Fresh final deterministic verification and a fresh full independent boundary/security review were then run against the final exact manifest and returned PASS/GREEN.

No repair changed the authorized objective or introduced a Human Reserved product, architecture, security-authority, provider-activation, or scope-expansion decision.

## Non-blocking observations

- Verification used Node `20.5.0`; transitive `undici` declares Node `>=20.18.1`.
- Existing dependency deprecation notices and the available newer Wrangler release remain maintenance observations.

These observations are non-blocking and do not alter the final dispositions.

## Human Reserved disposition

No Human Reserved exception or decision is open for `ENG-008`. No product-semantic or Runtime Architecture change, security-authority change, provider activation/terms disposition, paid use, production action, new service, credential/secret operation, destructive action, or control-plane work was required.

## Completion evidence and authority

All applicable Delivery Contract Definition of Done conditions are satisfied: the authorized scope is complete; the exact candidate and stable upstream identity are bound; deterministic verification passed; the independent full boundary/security review is GREEN; blocking findings and their rechecks are resolved; no unresolved Task Packet blocker or Human Reserved issue remains; and completion is reconstructible from durable repository state.

This record establishes `ENG-008 → DONE` under Delivery Contract revision 1. It does not modify the completed candidate, mark `ENG-003` complete, make a downstream task READY without its own DoR, dispatch a downstream Builder, activate a provider, or authorize any external, paid, production, or control-plane action.

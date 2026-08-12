# ENG-003 — D1 Authority Foundation Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-003`

**Task Packet revision:** 2 (reopened repair); revision 1 remains the completed historical baseline below

**Current lifecycle state:** `READY` — reopened for bounded upstream repair of `ENG-004-F003`

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Task Packet:** [ENG-003 — D1 Authority Foundation](../tasks/ENG-003-d1-authority-foundation.md)

**Recorded:** 2026-08-12

## Reopening disposition — 2026-08-13

Independent review of exact downstream ENG-004 aggregate `a795e4a55ac07b02875fbefff8638ec6c003d56cc32817f414254843fbb97431` identified blocking `ENG-004-F003`: caller-supplied Project/Action snapshots could be transformed and submitted through revision-1 put/upsert writes without authoritative proof that the entity already existed in the expected lifecycle. The missing capability belongs to the persistence port/D1 adapter boundary owned by ENG-003.

This is both a newly discovered defect in the accepted upstream persistence boundary and an omitted capability required by ENG-004. It does not invalidate or erase the exact revision-1 candidate, its then-passing evidence, or closed `ENG-003-F001` / `ENG-003-F001-R1` history. It does invalidate ENG-003's current `DONE` lifecycle claim until the bounded revision-2 repair passes fresh deterministic verification and fresh full independent persistence/data-boundary review.

The revision-2 repair is `READY` and not dispatched. Its exact lock is `src/application/ports/persistence/**`, `src/infrastructure/d1/**`, `tests/application/ports/persistence/**`, and `tests/infrastructure/d1/**`. Migrations, root files, domain/contracts, ENG-004, ENG-005, and every other path are protected. No Human Reserved decision is required because the repair implements already approved lifecycle and authoritative-persistence semantics without changing product or architecture authority.

## Revision-1 delivery outcome (historical accepted baseline)

`ENG-003` completed its bounded D1 authority-foundation scope after a sequence of persistence-boundary repairs and independent rechecks. The accepted result supplies the application-owned persistence port, ordered D1 migration, D1-local adapter and types, atomic accepted-write behavior, safe duplicate/retry behavior, and false-success defenses required by its Task Packet. It creates no downstream vertical slice, retrieval, export/deletion, model/provider, interaction, observability, production, paid-service, credential, or control-plane capability.

No material scope deviation, unresolved blocker, or write/integration conflict remains. The Controller closure did not modify the accepted candidate.

## Assigned responsibilities

- **Delivery Planner / Controller:** validated the exact candidate identity and dependencies, preserved the complete repair history, finalized this Delivery Record, transitioned task state, and re-evaluated the DAG and readiness.
- **Builder:** Standard Delivery profile with D1/transaction capability; produced the bounded candidate and every repair.
- **Deterministic Verifier:** Deterministic Execution profile; supplied final fresh verification evidence bound to the exact candidate.
- **Independent Reviewer:** Strong Semantic Reasoning profile, independent of the Builder; supplied the final targeted persistence/data-boundary review and recheck.

## Exact completed candidate

| Identity | Value |
| --- | --- |
| Base Git commit / HEAD used by candidate | `7365d60c260956fa1bc16a647db724f3bd1c3440` |
| Completed upstream `ENG-002` manifest | `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f` |
| Exact thirteen-file `ENG-003` candidate manifest | `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` |
| Dependency lockfile SHA-256 | `445fd78c4279e62c210b8005aa4406070a832c740bfa5c905deede3b6d230ab6` |
| Migration SHA-256 | `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` |
| Final evidence worktree | `/private/tmp/prj226-eng003-bounded-repair` |
| Candidate integrity | Byte-identical throughout final verification, targeted review, and Controller closure |

The manifest is the SHA-256 of the newline-delimited SHA-256 listing below in repository-path sort order. Controller closure mechanically reproduced the aggregate manifest, all component hashes, the lockfile identity, and the migration identity from the final evidence worktree without modifying candidate files. The shared repository worktree held an earlier unaccepted ENG-003 attempt; it is not asserted to be the accepted candidate and is not bound by this record.

| SHA-256 | Candidate path |
| --- | --- |
| `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99` | `migrations/0001_authoritative_state.sql` |
| `445fd78c4279e62c210b8005aa4406070a832c740bfa5c905deede3b6d230ab6` | `package-lock.json` |
| `ca4eddba24476b3f89fa55e34021cc029c2b0f66d6f532113a8518e458874899` | `package.json` |
| `8b36c8548b93e6fe1baf47466569afc0e6fa21b32bf13342795f66ac5d102e8a` | `src/application/ports/persistence/acceptedStatePersistence.ts` |
| `42c88ab724d2df9ac74215347ac47f229203012c57206482aade4b4f6b627ac3` | `src/application/ports/persistence/index.ts` |
| `e787ec2b621cec414aa871597acbc179ec917b8d95dde1c92f97daa0eda54a6e` | `src/infrastructure/d1/d1AcceptedStatePersistence.ts` |
| `4b7b7af3eeb1ccdc57c68965106c16b33ae7cb6b856b8bfe621717ba789f0a7f` | `src/infrastructure/d1/d1Types.ts` |
| `ddfc301472e7fd2379265babf4e4f1d5e097602f55d7f65680caee3d73caebd0` | `src/infrastructure/d1/index.ts` |
| `7311412956e39f912c0ea3d613d4a0ba8aa7134be2ef67bf6d735aad5bc6a4eb` | `tests/application/ports/persistence/acceptedStatePersistence.test.ts` |
| `b408a3df06cc3f5fe9cc5967623368296e8d99b487e32af2d49c4981c157ed72` | `tests/infrastructure/d1/d1AcceptedStatePersistence.test.ts` |
| `be8ef466a3a1a606923c68a3bc17e621cb942213ea74a79e04c5ebfe4b15b373` | `tests/infrastructure/d1/fakeD1.ts` |
| `dd186f21f891a7490fd7601f96d6d46669bbbfc304809747d723d8c8c9e20c8e` | `tests/infrastructure/d1/vitest.config.ts` |
| `99715b92e828697d54aee9f01da05060fa09c24c31dcd3b21fffcd4235571e0a` | `wrangler.toml` |

## Deterministic verification

Exact disposition: `ENG-003 VERIFICATION: PASS`

| Bound verification input | Value |
| --- | --- |
| Clean-install command | `npm ci --ignore-scripts` |
| Repository commands | `npm run typecheck`; `npm run lint`; root/foundation tests; `npm run test:persistence`; `npm run build`; `npm run smoke`; local D1 migration command; dependency listing; `git diff --check` |
| Node environment | `20.5.0` |
| Lockfile-bound toolchain | TypeScript `5.9.2`; ESLint `8.57.0`; Vitest `3.2.4`; Wrangler `4.32.0`; Workers types `4.20250828.0` |
| Local-D1 conditions | Fresh local-only database, then repeated migration against the same database |

Final fresh deterministic evidence is bound to the manifest above and records:

- exact candidate identity stable; all thirteen component hashes matched; no candidate file was modified; and no ENG-008 implementation path was present;
- `npm ci --ignore-scripts`, typecheck, lint, root/foundation tests, build, smoke, dependency listing, and `git diff --check`: PASS;
- ENG-002 suite: PASS (`37/37`); ENG-003 persistence suite: PASS (`31/31`);
- fresh local-only D1 migration: PASS (`24` commands); repeated migration: PASS (no pending migration);
- valid Context, Progress, and Knowledge real-D1 paths: PASS; invalid ownership, predecessor, branch, and lineage paths: rejected;
- FakeD1 staging, rollback, receipt, and idempotency behavior: PASS;
- the complete historical `ENG-003-F001` regression family: CLOSED;
- port neutrality, D1 containment, Human Control isolation, provider/model/retrieval isolation, and unauthorized-infrastructure scans: PASS.

## Final persistence-boundary closure

The final accepted boundary establishes:

```text
accepted runtime commit
= exact-own canonical envelope
= own-index canonical writes
= exact-own canonical write wrappers
= fully owned nested semantic graph
= own-index semantic arrays
= fingerprinted canonical graph
= graph consumed by persistence
= durable receipt operation
```

The semantic-array inventory is exactly commit `writes`, Context `facts`, and Knowledge `supersessionChain`; all use own-index canonicalization. The closed historical defect subclasses are obsolete correction `prior`; runtime wider `prior`; unknown top-level and nested fields; retained nested caller references; inherited optional semantic fields; Context-facts iterator leakage; Knowledge-lineage iterator leakage; inherited numeric nested-array elements; `commit.writes` iterator leakage; inherited numeric `commit.writes` elements; and receipt/persistence semantic mismatch.

## Independent targeted review

Exact disposition: `ENG-003 TARGETED REVIEW: GREEN`

The independent persistence/data-boundary reviewer answered **NO** to whether caller-controlled semantic data can still enter a successful persistence operation or durable receipt without belonging to the exact canonical operation that persistence applies or validates. The review confirmed bounded scope; successor-based correction aligned to ENG-002; exact-own commit envelope; own-index commit writes; owned nested semantic objects; own-property optional semantics; own-index Context facts and Knowledge lineage; a fully owned canonical graph; fingerprint and persistence truthfulness; receipt ordering; committed/already-committed/conflict semantics; multi-write false-success boundary; application-port neutrality; D1 containment; Human Control separation; provider/retrieval/memory-layer separation; no ENG-008 contamination; and no Product, Architecture, or Human Reserved issue.

`ENG-003-F001-R1` is **CLOSED** for `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`.

`ENG-003-F001` is **CLOSED** for `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`.

## Manifestation recovery — 2026-08-13

The canonical dispatch worktree was found to contain the rejected initial thirteen-file manifestation `450730fa653a4781797a0b6ac54cd4a7d91e9e9d0c78c888ffb4404595267036`, while this Delivery Record has always identified `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` as the accepted candidate. This was a manifestation discrepancy, not a new candidate or an ENG-003 reconstruction.

The accepted source was recovered from Git commit `4bfc836f67dd73f5bf2db30dce168f7c578c16a8`, preserved under local ref `recovery/eng-003-accepted`, and restored by exact path-scoped Git recovery only. All thirteen component hashes and aggregate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` reproduced before and after fresh integrated verification. The ENG-002 manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f` and ENG-008 manifest `5fb3343b2a531782ef83d7c874ec95ae221676a700f4c92b3d77591de39c1696` also reproduced unchanged.

Fresh integrated evidence on the intended dispatch base passed clean install, typecheck, lint, root tests, ENG-002 (`37/37`), ENG-003 persistence (`31/31`), build, smoke, dependency listing, and local-only D1 migration (`24` commands) followed by no-pending-migration reapplication. The existing targeted review remained valid for the exact revision-1 candidate at that lifecycle point: its bytes and then-reviewed semantic scope did not change, and no integration defect was found. ENG-003 was `DONE` before the later F003 reopening recorded above.

## Repair and recheck history

Completion was not a first-pass success. The following candidate sequence is retained as historical delivery provenance; only the final candidate above is accepted.

1. Initial aggregate `450730fa653a4781797a0b6ac54cd4a7d91e9e9d0c78c888ffb4404595267036` exposed conflicting same-ID Project intended outcomes, conflicting Action ownership/content, inadequate FakeD1 partial-result/receipt atomic-publication modeling, and ENG-008 contamination in the shared environment.
2. Repair `31b181c791a5325bb4921bb9541222e6415eb89cf557705d229e3792e9b676ac` still permitted direct `UPDATE` paths to bypass Project intended outcome, Action project/content, Progress ownership, and Knowledge origin invariants; FakeD1 also failed to stage all accepted-state families.
3. Repair `de60ed16cd6f2a87b1723f596a68cf2bfcdc515131355f06df158a48235a1fda` still accepted malformed valid JSON for Knowledge `supersession_chain` when it was not an array.
4. Candidate `10b51d5ca1cb82e7f2d111df04919a7d9ab942982885f76d6fc32091a0c3fbf8` passed fresh deterministic verification, then independent review raised blocking `ENG-003-F001`: the canonical correction command fingerprinted `prior`, but persistence ignored it.
5. Candidate `2d4358096f6b36bd1ceac001c43d0ae5e3eb6ee7155e71bc37fb73bd09c3ebaf` removed `prior` from the TypeScript correction contract, but fresh verification found structurally wider runtime objects could still carry `prior`; raw-object fingerprinting admitted and receipted that ignored field.
6. Candidate `bc24aadd28c22d288346917fe51ad4658e43ec4320ffe36f468139def66a6b39` added exact top-level runtime-shape canonicalization, but fresh verification found nested semantic payloads retained by reference, allowing nested unknown fields into fingerprints while SQL ignored them.
7. Candidate `74e7715d07567a527b1b11f889643b716ec7cb4b407b963e336b992baa567385` added finite nested semantic canonicalization and owned arrays, but optional semantic properties still used prototype-resolving lookup, allowing inherited `actionId` or `supersedesId` to become semantic data.
8. Candidate `27f431fd08f4e910bb51da7edea4840e06e1d1ef7ff8c51d58fc8ab225c04c43` fixed own-property semantics for optional fields, but semantic arrays were still consumed through caller-controlled iteration, allowing inherited `Symbol.iterator` to replace own Context facts or Knowledge lineage.
9. Candidate `7c88107c71b058cd9a14d156ad9e9dcfd60a9df941e4df0b12f51358e31636fa` fixed own-index canonicalization for Context facts and Knowledge lineage and passed fresh deterministic verification. Targeted review then raised `ENG-003-F001-R1`: `commit.writes` was still consumed by caller-controlled `for...of`.
10. Final candidate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6` applied the descriptor-based own-index policy to `commit.writes`; fresh verification passed and targeted review was GREEN, closing both findings.

Every correction remained within the authorized persistence boundary. No repair changed the authorized objective or introduced a Human Reserved product, architecture, security-authority, provider-activation, paid-use, production, or scope-expansion decision.

## Non-blocking observation

Verification used Node `20.5.0`; transitive `undici` declares Node `>=20.18.1`. No execution consequence was demonstrated for this exact candidate. This is a non-blocking environment/maintenance observation and does not alter the final disposition.

## Human Reserved disposition

No Human Reserved intervention was required for closure. No Product authority change, Runtime Architecture authority change, security-authority decision, paid usage/billing, production action, new infrastructure/control plane, credential/secret operation, destructive external action, unresolved authority conflict, or scope expansion occurred.

## Completion evidence and Controller disposition

All applicable Delivery Contract and Task Packet Definition of Done conditions are satisfied: authorized scope is complete; no unauthorized scope expansion is present; deterministic verification passed; durable evidence is bound to the exact candidate; independent review is GREEN; all blocking findings and required rechecks passed; the reviewed candidate is identifiable; no Human Reserved approval was required; write/integration conflicts are resolved; and the result is reconstructible without transient conversation history.

**Historical revision-1 Controller disposition:** `ENG-003 → DONE` under Delivery Contract revision 1. The current lifecycle is the reopened revision-2 `READY` state recorded at the top of this Delivery Record.

This closure does not modify the accepted candidate, dispatch a downstream Builder, create a downstream task ID, implement downstream functionality, merge a branch, modify Runtime Architecture, deploy, provision infrastructure, or activate any external, paid, production, or control-plane action.

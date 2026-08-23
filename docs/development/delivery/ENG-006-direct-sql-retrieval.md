# ENG-006 — Direct-SQL Retrieval and Accepted-Context Resumption Delivery Record

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task ID:** `ENG-006`

**Task Packet:** [ENG-006 — Direct-SQL Retrieval and Accepted-Context Resumption](../tasks/ENG-006-direct-sql-retrieval.md)

**Current lifecycle state:** `DONE` — Repair Rev1 accepted

**Authorization:** `GOV-018`

**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1

**Recorded:** 2026-08-23

## Controller closure

Controller Final Closure approved the exact Repair Rev1 implementation after independent deterministic verification `PASS` and independent semantic review `GREEN`.

`ENG-006 REPAIR REV1: ACCEPTED`

`ENG-006: DONE`

| Identity | Value |
| --- | --- |
| Accepted implementation commit | `a94d2cd2714849e7be59fd464f85330f98d127b4` |
| Accepted implementation tree | `6d4a20cb745b811724a8837e495ab3a19c32285b` |
| Accepted parent | `f2ccb1c7c93d74124bba900065f4d08b781e7e8a` |
| Accepted aggregate SHA-256 | `5427769010520ef1c992d201e42b341204c621a3d4ed7f84ce60eae71adcccda` |

The accepted aggregate is the SHA-256 of the newline-delimited, repository-path-sorted SHA-256 listing below.

| SHA-256 | Accepted implementation path |
| --- | --- |
| `6540d68e2ff5b734d0ab88866b152503143a458831ea3ce27380cf57fd794aa2` | `src/application/services/retrieval/index.ts` |
| `a6a97acf6ca7656c82e262b6fb935bc72a89edd03b55997cfb7b7cd5529a74b5` | `src/application/services/retrieval/retrievalService.ts` |
| `6604763b6bde4c089b36c6e91ee823ce3a23fd80f1b48a3f41089e9621b06bb3` | `src/application/services/retrieval/retrievalTypes.ts` |
| `be6be3a7eefca24ce803ada07afe5af28d736cad83fd7097d0401c13bfef61c6` | `tests/application/services/retrieval/fakeRetrievalD1.ts` |
| `fc104bdc01e7aaad71531c84f675c35edbf2a2da8d705ec6c96738fd6a34f258` | `tests/application/services/retrieval/node-runtime.d.ts` |
| `0c3a28a6439f65fb875ff21f57904a99935ae4932bff8a3e307a3a93ed4897f1` | `tests/application/services/retrieval/retrievalForbiddenScan.test.ts` |
| `d2f0b6b0af01a04050cd4570bc4ab242ec5878be25174118a54485d7f72f4a1d` | `tests/application/services/retrieval/retrievalService.test.ts` |
| `8e0e79cd0a68f57ba34102c77adc1b9f90973c4c133b505f95a8e826efba1730` | `tests/application/services/retrieval/vitest.config.ts` |
| `d327bfd4ae9200b1aaa21666dcea95e7e2054ec40c9b025ee92c0b77fa43e92d` | `tests/integration/d1/retrieval/localD1.ts` |
| `1a3df751ce2fd06d795069f1bdd580f5de91df4d4ba5a7711bed11208d416c8f` | `tests/integration/d1/retrieval/node-runtime.d.ts` |
| `5ec4dacd8f45785075783f5ab1b0213d45c56f42a3baedec948f2d10377bdf04` | `tests/integration/d1/retrieval/retrievalD1Integration.test.ts` |
| `4fa4480c3b6f36a1a7fca3f738974b625658c4caefac09b60dae9822faee47e1` | `tests/integration/d1/retrieval/vitest.config.ts` |

The migration remained byte-identical at `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

## Execution outcome and verification evidence

The accepted implementation is confined to the Task Packet's 12-path retrieval source and test scope. It exposes the nine-method public surface and exact result envelope, uses only prepared `SELECT` SQL, uses the accepted upstream D1 collection-read abstraction, introduces no parallel D1/provider abstraction, and adds no migration, vector, cache, search, or ORM infrastructure.

Independent deterministic verification returned `ENG-006 REPAIR VERIFICATION: PASS` on the exact accepted candidate. Evidence included application retrieval `64/64 PASS`, integration retrieval `3/3 PASS`, 23 test files, 241 tests, 10 configurations, and passing typecheck, lint, build, and smoke gates.

Independent semantic review returned `ENG-006 REPAIR REVIEW: GREEN` with zero blocking findings. Controller Final Closure returned `APPROVE`.

## Finding disposition

- `ENG-006-R001`: `CLOSED`.
- `ENG-006-R002`: `CLOSED`.
- `ENG-006-R003`: `CLOSED`.
- `ENG-006-R004`: `CLOSED AT UPSTREAM ENG-003 LEVEL`.
- `ENG-006-R005`: `DEFERRED TO ENG-010`.

The R005 deferral does not make `ENG-010` ready, dispatched, or done and creates no ENG-010 execution authority.

## Historical failed candidate

Initial candidate `7b7db0d98660f6562f8e9738445be725fc65988c`, tree `18b97d99aa95cc37801e8db63fb7940f1945d11b`, remains `FROZEN / UNACCEPTED / HISTORICAL EVIDENCE ONLY`. It was not repaired, rewritten, merged, cherry-picked, or used as the parent of the accepted implementation or this governance closure.

## Completion authority and boundary

The Controller's final closure established `ENG-006 Repair Rev1: ACCEPTED` and `ENG-006: DONE` under Delivery Contract revision 1. Current Builder is `NONE`; all ENG-006 Builder, repair Builder, reconstruction Builder, and implementation execution authority is consumed and non-operative. No Human Reserved decision was required.

Canonical integration is `NOT YET PERFORMED`. The canonical branch remains at `f2ccb1c7c93d74124bba900065f4d08b781e7e8a`; this record does not merge, update that branch, push, dispatch `ENG-009`, or dispatch or advance `ENG-010`.

# ENG-003 — D1 Authority Foundation

**Artifact class:** OPERATIONAL / TASK PACKET
**Lifecycle status:** READY — NOT DISPATCHED
**Task Packet revision:** 3
**Task-level DoR:** PASS
**Builder authorization:** ONE BOUNDED BUILDER AUTHORIZED FOR DISPATCH AFTER GOVERNANCE PROMOTION COMMIT
**Current Builder:** NONE (NOT YET DISPATCHED)
**Implementation status:** NOT STARTED
**Human Reserved:** NOT REQUIRED
**Reopen Trigger:** `ENG-006-R004` (Upstream D1 Collection-Read Capability Gap)
**Historical Baseline:** Revision 2 accepted on aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`; revision 1 accepted on candidate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`
**Authorization:** `GOV-018`
**Governing contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1
**Controller Review:** [`docs/development/analysis/ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md`](../analysis/ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md)
**Date:** 2026-08-15

---

> [!NOTE]
> **GOVERNANCE NOTICE: REVISION 3 TARGETED REOPEN (READY — NOT DISPATCHED)**
>
> This Task Packet is promoted to **Revision 3** following Final Targeted Controller Review approval ([`ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md`](../analysis/ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md)) in response to root blocker `ENG-006-R004`.
>
> - **Task-level Definition of Ready: PASS.**
> - **BUILDER AUTHORIZATION: ONE BOUNDED BUILDER AUTHORIZED FOR DISPATCH AFTER GOVERNANCE PROMOTION COMMIT.**
> - **CURRENT BUILDER: NONE (NOT YET DISPATCHED).**
> - **IMPLEMENTATION STATUS: NOT STARTED.**
> - **BUILDER BASE COMMIT: NOT YET ASSIGNED (Will be assigned to the governance promotion commit created after this operation; commit `24b6b2c27f4cce33e5d3d38501e53a569e85d199` is historical governance ancestry only).**
>
> Downstream task `ENG-006` remains **BLOCKED** on upstream `ENG-003` Revision 3 acceptance.

---

## 1. Task ID

`ENG-003`

---

## 2. Objective

Expose solely the minimal accepted collection-read capability required by `ENG-006-R004` through the repository-local D1 prepared-statement abstraction (`src/infrastructure/d1/d1Types.ts`), eliminating downstream workarounds and unsafe type casts without modifying write persistence, migrations, or domain logic.

### Revision History
- **Revision 1:** Established initial authoritative persistence port and D1 adapter (`DONE`, candidate `e8f3792925ad45905a72938c6602f860df3ff6173325944e77f9ff2c8642caf6`).
- **Revision 2:** Reopened for lifecycle-transition state checks and fabricated-snapshot defenses (`DONE`, aggregate `183d97eeb8f1f1d9a718d40ceba03071c79432132ae9febeb851ed163301a685`).
- **Revision 3:** Targeted reopen for D1 collection-read capability (`all<T>()` and `D1ReadAllResult<T>`) triggered by `ENG-006-R004` (`READY / NOT DISPATCHED`).

---

## 3. Normative Authority

- `GOV-018` and `ARC-001`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md), [Domain Model](../../../product/DOMAIN_MODEL.md), and [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md), revision 1.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- Controller Finding Disposition [`ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md`](../analysis/ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md).
- Final Targeted Controller Review [`ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md`](../analysis/ENG-003_REV3_FINAL_TARGETED_CONTROLLER_REVIEW_2026-08-15.md).

---

## 4. Dependencies and Readiness

- `ENG-001`, `ENG-002`, `ENG-003` revision 2, `ENG-004`, `ENG-005`, and `ENG-008` are `DONE` on their accepted baselines.
- Installed provider package `@cloudflare/workers-types` (`4.20250828.0`) defines `all<T>(): Promise<D1Result<T>>` with non-optional `results: T[]`.
- Formal Definition of Ready: `PASS`.
- Human Reserved Decision: `NOT REQUIRED`.

---

## 5. Strict Two-File Write Lock

The future Revision 3 Builder receives exclusive write ownership of **ONLY**:

1. `src/infrastructure/d1/d1Types.ts`
2. `tests/infrastructure/d1/fakeD1.ts`

### Strictly Protected Read-Only Paths (Modification Prohibited)
- `src/infrastructure/d1/d1AcceptedStatePersistence.ts`
- `src/application/ports/persistence/**`
- `migrations/**`
- `src/domain/**`
- `src/application/services/**`
- `tests/application/**`
- `tests/foundation/**`
- `package.json`, `package-lock.json`, `wrangler.toml`
- `docs/architecture/**`, `docs/product/**`
- All other files across the repository.

---

## 6. Required Production Changes & Interface Contract

Update `src/infrastructure/d1/d1Types.ts` to expose `D1ReadAllResult<T>` and `all<T>()`:

```ts
export interface D1RunResult {
  readonly success: boolean;
  readonly meta?: {
    readonly changes?: number;
  };
}

export interface D1ReadAllResult<T = Record<string, unknown>> {
  readonly results: readonly T[];
}

export interface D1PreparedStatement {
  bind(...values: readonly unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
  batch(statements: readonly D1PreparedStatement[]): Promise<readonly D1RunResult[]>;
}
```

---

## 7. Forbidden Scope & Non-Goals

- Do NOT add or authorize mutation/administrative methods: `run`, `raw`, `exec`, `dump`, `withSession`.
- Do NOT modify `D1DatabaseLike.batch`.
- Do NOT redesign historical Miniflare casts in persistence tests.
- Do NOT modify `d1AcceptedStatePersistence.ts` or write persistence semantics.
- Do NOT modify `migrations/**` or SQLite trigger definitions.
- Do NOT implement application-level `ENG-006` repair logic (`R001`, `R002`, `R003`).
- Do NOT modify domain entities, application services, or application ports.
- Do NOT introduce `@cloudflare/workers-types` imports into domain or application layers.

---

## 8. Definition of Done (Revision 3)

1. `src/infrastructure/d1/d1Types.ts` exports `D1ReadAllResult<T>` with mandatory `readonly results: readonly T[];`.
2. `D1PreparedStatement` in `src/infrastructure/d1/d1Types.ts` includes `all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>>;`.
3. `FakeStatement` in `tests/infrastructure/d1/fakeD1.ts` implements `all()` conforming to `D1PreparedStatement`.
4. Bounded compile-time type compatibility assertions in `fakeD1.ts` prove that `@cloudflare/workers-types` D1 instances satisfy `D1DatabaseLike` and `D1PreparedStatement`.
5. All 37 existing persistence tests pass without modification to production write logic.
6. All repository verification gates (`typecheck`, `lint`, `build`, `test`, `test:persistence`, `smoke`, `git diff --check`) pass GREEN.
7. Exact candidate diff touches ONLY the authorized two files.
8. Independent semantic review verifies zero scope creep, zero provider leakage, and zero application repair bleed-in.

---

## 9. Verification Contract

| Check | Requirement / Target |
|---|---|
| **Base Authority** | Assigned to the new governance promotion commit |
| **File Scope** | Diff must touch **only** `src/infrastructure/d1/d1Types.ts` and `tests/infrastructure/d1/fakeD1.ts` |
| **Pre-Repair `d1Types.ts` SHA-256** | `811978f5272fc55232fbaf0e76693310984769979d4810939c793024663feb78` |
| **Migration Integrity** | `migrations/0001_authoritative_state.sql` remains byte-identical (`adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`) |
| **Other Files** | All other accepted files byte-identical |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** |
| `npm test` | **PASS** |
| `npm run test:persistence` | **PASS** (37/37 tests pass) |
| `npm run smoke` | **PASS** |
| `git diff --check` | **PASS** |

---

## 10. Independent Semantic Review Contract

Independent semantic review must verify:
- [ ] Collection-read capability only (`all<T>()` and `D1ReadAllResult<T>`) added to `d1Types.ts`.
- [ ] `results` array is non-optional.
- [ ] No mutation or administrative methods (`run`, `exec`, `dump`, `withSession`, `raw`) exposed.
- [ ] `FakeStatement` update is conformance-only.
- [ ] Zero product semantic change.
- [ ] Zero domain semantic or invariant change.
- [ ] Zero runtime architecture or topology change.
- [ ] Zero schema or migration change.
- [ ] Zero persistence-write change.
- [ ] Zero provider SDK leakage into `src/domain/**` or `src/application/**`.
- [ ] No `ENG-006` repair slipped in.

---

## 11. Risk Classification

**MODERATE — bounded interface addition with low blast radius.**
The change is strictly additive on the repository-local typing abstraction and constrained to two files. Full test suite execution and independent semantic review ensure zero regression on write persistence and zero architectural leakage.

---

## 12. Assignment & Execution Roles

- **Planner / Controller:** Authority, review adjudication, locks, and governance promotion.
- **Builder:** One Standard Delivery writer with TypeScript/D1 capability (authorized for dispatch after governance promotion commit exists).
- **Verifier:** Deterministic Execution, read-only.
- **Reviewer:** Independent Strong Semantic Reviewer.
- **Write Lock:** Strictly `src/infrastructure/d1/d1Types.ts` and `tests/infrastructure/d1/fakeD1.ts`.

---

## 13. Definition of Ready Evaluation — Revision 3

| Delivery Contract Condition | Evaluation Evidence | Result |
|---|---|---|
| Objective, authority, invariants, DoD, verification, review contract, and context explicit | Defined in Sections 1–10 of this packet | **PASS** |
| Existing owner and prior accepted baseline identifiable | ENG-003 Delivery Record (Revision 2 baseline aggregate `183d97ee...`) | **PASS** |
| Exact write ownership sufficient and collision-controlled | Strictly two files; all other paths protected | **PASS** |
| Human Reserved decision required | Evaluated in Section 4; no human reserved boundary crossed | **PASS (NOT REQUIRED)** |

**Task-level Definition of Ready:** `PASS`. One bounded Builder is eligible for authorization upon creation of the governance promotion commit.

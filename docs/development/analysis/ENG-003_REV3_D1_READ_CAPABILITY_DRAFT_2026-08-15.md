# ENG-003 Revision 3 — D1 Read Capability Task Packet Draft

**Artifact class:** OPERATIONAL / TASK PACKET DRAFT
**Lifecycle status:** DRAFT / CONTROLLER REVIEW REQUIRED
**Date:** 2026-08-15
**Task ID:** `ENG-003` Revision 3 (Targeted Upstream Reopen)
**Reopen Trigger:** `ENG-006-R004` (Upstream D1 Collection-Read Capability Gap)
**Governing Delivery Contract:** [PRJ226 Generation 2 Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1
**Historical Baseline:** [ENG-003 Delivery Record (Revision 2)](../delivery/ENG-003-d1-authority-foundation.md)
**Authorization:** Derived from `GOV-018` and Controller Disposition [`ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md`](ENG-006_CONTROLLER_FINDING_DISPOSITION_2026-08-15.md)
**Human Reserved:** NOT REQUIRED

---

## 1. Context and Objective

During independent semantic review of the initial `ENG-006` (Direct-SQL Retrieval) candidate, finding `ENG-006-R004` identified that `src/infrastructure/d1/d1Types.ts` lacks a collection-read method on the accepted `D1PreparedStatement` interface.

Currently, `D1PreparedStatement` in `d1Types.ts` exposes only:
```ts
export interface D1PreparedStatement {
  bind(...values: readonly unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
```

Because direct-SQL retrieval across projects, actions, context facts, progress, and knowledge items requires multi-row collection queries, downstream work was forced to invent a task-local parallel database contract (`RetrievalDatabaseLike`) and rely on unsafe type casting (`as unknown as RetrievalDatabaseLike`) in test harnesses.

**Objective:**
Execute a bounded, non-broadening reopen of `ENG-003` (Revision 3) to expose the minimal collection-read capability (`all<T>()`) already supported by the installed Cloudflare D1 provider through the repository-local D1 prepared-statement abstraction (`src/infrastructure/d1/d1Types.ts`).

---

## 2. Strict Reopen Boundary & Write Lock

This reopen is strictly limited to exposing collection-read typing on the existing infrastructure abstraction. It does NOT authorize changes to write persistence, schema migrations, domain logic, or application ports.

### Proposed Exact Two-File Write Lock
- `src/infrastructure/d1/d1Types.ts`
- `tests/infrastructure/d1/fakeD1.ts` (satisfying `FakeStatement implements D1PreparedStatement` and housing compile-time structural type proof)

### Strict READ-ONLY Protections (Explicitly Prohibited from Mutation)
- `src/infrastructure/d1/d1AcceptedStatePersistence.ts`
- `src/application/ports/persistence/**`
- `migrations/**`
- `src/domain/**`
- `src/application/services/**`
- `tests/application/**`
- `tests/foundation/**`
- `package.json`, `package-lock.json`, `wrangler.toml`
- `docs/architecture/**`, `docs/product/**`

---

## 3. Installed Provider Compatibility Evidence

Investigation of the installed provider declarations in `@cloudflare/workers-types` (version `4.20250828.0`, declared in `package.json` and consumed via `tsconfig.json`) reveals the exact installed D1 interface declarations:

```ts
// From node_modules/@cloudflare/workers-types/index.d.ts (Lines 7178-7238)

interface D1Response {
  success: true;
  meta: D1Meta & Record<string, unknown>;
  error?: never;
}

type D1Result<T = unknown> = D1Response & {
  results: T[];
};

declare abstract class D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName: string): Promise<T | null>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(options: { columnNames: true }): Promise<[string[], ...T[]]>;
  raw<T = unknown[]>(options?: { columnNames?: false }): Promise<T[]>;
}
```

### Key Provider Observations
1. **Guaranteed Collection Shape:** The provider contract defines `results: T[]` as a mandatory (non-optional) property on `D1Result<T>`. It is never `undefined` on successful query resolution.
2. **Read vs Mutation Separation:** The provider exposes `all<T>()` for collection reads and `run<T>()` for standalone mutations.
3. **Minimal Exposure:** The repository abstraction only needs to expose `all<T>()`. It must NOT expose unneeded mutation or administrative methods such as `run`, `exec`, `dump`, `withSession`, or `raw`.

---

## 4. Minimal Repository-Local Type Representation

To maintain architectural isolation, prevent provider SDK leakage into application layers, and guarantee structural compatibility, `src/infrastructure/d1/d1Types.ts` shall be updated to:

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

### Structural Compatibility Analysis
- **Return Type Compatibility:** In TypeScript, `D1Result<T>` from `@cloudflare/workers-types` has `{ success: true, meta: D1Meta, results: T[] }`. The mutable array `T[]` is structurally assignable to `readonly T[]`, and the presence of `results` satisfies `D1ReadAllResult<T>`.
- **Method Assignability:** `all<T = Record<string, unknown>>(): Promise<D1Result<T>>` is structurally assignable to `all<T = Record<string, unknown>>(): Promise<D1ReadAllResult<T>>`.
- **Elimination of Unsafe Casts:** Cloudflare Workers runtime bindings (`env.LIAM_DB`) and Miniflare test instances (`await miniflare.getD1Database("LIAM_DB")`) satisfy `D1DatabaseLike` directly without requiring `as unknown as ...` escape hatches.
- **Write Path Isolation:** Existing write persistence in `d1AcceptedStatePersistence.ts` continues to use `batch(...)` and `first(...)` with zero change to its runtime behavior.

---

## 5. R003 Chronology Authority Analysis

Before downstream `ENG-006` repair execution is authorized, the ordering semantics of Knowledge supersession chains were verified against canonical repository authority:

- **Domain Model:** `src/domain/knowledge.ts` (L194–201) constructs successor items with:
  ```ts
  supersessionChain: [...prior.supersessionChain, prior.id]
  ```
- **Application Provenance Service:** `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts` (L175) maintains this array directly:
  ```ts
  supersessionChain: [...transition.value.correction.supersessionChain]
  ```
- **Authoritative Database Schema & Triggers:** `migrations/0001_authoritative_state.sql` (L173 & L191) strictly enforces that initial knowledge has `supersession_chain = '[]'` and corrections append via SQLite JSON trigger:
  ```sql
  json(NEW.supersession_chain) = json_insert(supersession_chain, '$[#]', id)
  ```
- **Accepted Test Suite Evidence:** `tests/application/services/knowledgeProvenance/knowledgeProvenanceService.test.ts` (L207–212) explicitly verifies that K1 corrected by K2 corrected by K3 produces K3 with:
  ```json
  "supersessionChain": ["k1", "k2"]
  ```

**Authority Result:**
`CHRONOLOGICAL ORDER GUARANTEED BY ACCEPTED SEMANTICS`

When assembling historical lineage in `ENG-006`, the retrieved `supersessionChain` is already strictly ordered from oldest to newest predecessor.

---

## 6. R005 Downstream Integration Constraint

Finding `ENG-006-R005` (empty collection vs missing parent project) is formally preserved as a deferred downstream integration constraint for `ENG-010`:

- **Constraint:** In direct-SQL retrieval, `getActionsForProject`, `getAcceptedContextFacts`, `getCurrentProgress`, and `getCurrentKnowledgeForProject` return `{ kind: "found", value: [] }` when no matching child rows exist. A returned empty collection does **not** prove that the parent Project exists.
- **ENG-010 Integration Requirement:** When parent Project existence must be verified (e.g., distinguishing an empty project from a non-existent project during conversational resumption), `ENG-010` must explicitly call `getProject(projectId)` before interpreting child collection results.

---

## 7. Upstream Verification Contract

The future candidate for `ENG-003` Revision 3 must satisfy the following deterministic verification requirements:

1. **Base Commit:** `NOT YET ASSIGNED` (Will be assigned to the governance promotion commit created after this operation; commit `24b6b2c27f4cce33e5d3d38501e53a569e85d199` is historical governance ancestry only).
2. **File Scope:** Diff must touch **only** `src/infrastructure/d1/d1Types.ts` and `tests/infrastructure/d1/fakeD1.ts`.
3. **Pre-Repair SHA-256:**
   `src/infrastructure/d1/d1Types.ts`: `811978f5272fc55232fbaf0e76693310984769979d4810939c793024663feb78`
4. **All Other Files Byte-Identical:** Verified via git diff and SHA comparison.
5. **Deterministic Command Gates:**
   - `npm run typecheck` -> **PASS**
   - `npm run lint` -> **PASS**
   - `npm run build` -> **PASS**
   - `npm test` -> **PASS**
   - `npm run test:persistence` -> **PASS**
   - `npm run smoke` -> **PASS**
6. **Schema Integrity:** `migrations/0001_authoritative_state.sql` remains byte-identical (`adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`).
7. **Write Persistence Unchanged:** All existing 37 persistence tests pass without modification to production write logic.

---

## 8. Upstream Semantic Review Contract

Independent semantic review for `ENG-003` Revision 3 must verify the following:

- [ ] **Read Capability Only:** Only collection-read method `all<T>()` and result interface `D1ReadAllResult<T>` are added to `d1Types.ts`.
- [ ] **No Mutation Capability:** No unapproved mutation or administrative methods (`run`, `exec`, `dump`, `withSession`, `raw`) are exposed.
- [ ] **No Product Semantic Change:** Product requirements and external behaviors are unaffected.
- [ ] **No Domain Semantic Change:** Domain types, invariants, and aggregate rules remain completely untouched.
- [ ] **No Architecture Change:** Hexagonal boundaries and runtime architecture topologies remain unchanged.
- [ ] **No Schema / Migration Change:** Zero changes to SQLite migrations or trigger definitions.
- [ ] **No Persistence-Write Change:** `d1AcceptedStatePersistence.ts` is untouched and write semantics are identical.
- [ ] **Zero Provider Leakage:** No `@cloudflare/workers-types` imports leak into `src/domain/**` or `src/application/**`.
- [ ] **Truthful Collection Result:** `results` array in `D1ReadAllResult<T>` is non-optional, matching provider guarantees.

---

## 9. Human Reserved Assessment

In accordance with repository governance:
- **Product Semantics:** Unchanged.
- **Domain Invariants:** Unchanged.
- **Runtime Architecture:** Unchanged.
- **Persistence Technology:** Unchanged (Cloudflare D1 / SQLite).
- **Security & Authorization Authority:** Unchanged.
- **Service Topology:** Unchanged.
- **Paid-Resource Authority:** Unchanged.

**Status:** `HUMAN RESERVED: NOT REQUIRED`

---

## 10. Summary & Current State

- **ENG-003 Revision 3 Status:** `TASK PACKET DRAFT / CONTROLLER REVIEW REQUIRED`
- **ENG-006 Status:** `REPAIR BLOCKED ON R004 UPSTREAM BASELINE`
- **Failed Candidate:** `7b7db0d98660f6562f8e9738445be725fc65988c` (`FROZEN`)
- **Builder Authorization:** `NO BUILDER DISPATCHED`

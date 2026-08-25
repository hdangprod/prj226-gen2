# ENG-010 Deterministic Verification Finding Disposition

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Record role:** DETERMINISTIC FINDING DISPOSITION AND REPAIR 1 DISPATCH

**Date:** 2026-08-26

**Controller role:** ENG-010 CONTROLLER — DETERMINISTIC FINDING DISPOSITION & REPAIR 1 DISPATCH

**Failed candidate:** `100f730556af7cea0f0a623809627aa3cf49d5a9`

**Candidate tree:** `95e63ff461e1c9c5df35baa40ce82716b8c941a0`

**Candidate direct parent:** `d86b3fb37afc152654849cfc728714d9dadf4129`

**Candidate canonical ancestry:** NOT AN ANCESTOR OF CANONICAL HEAD

**Deterministic verification:** FINDING — ENG-010-DV-R001 BLOCKING

**Candidate disposition:** FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY

**Semantic review:** NOT AUTHORIZED FOR THIS CANDIDATE

**Human Reserved:** NOT REQUIRED

---

## 1. Candidate 1 Identity

| Property | Value |
|---|---|
| Candidate commit | `100f730556af7cea0f0a623809627aa3cf49d5a9` |
| Candidate tree | `95e63ff461e1c9c5df35baa40ce82716b8c941a0` |
| Sole parent | `d86b3fb37afc152654849cfc728714d9dadf4129` |
| Distance from parent | 1 |
| Canonical ancestry | NOT AN ANCESTOR OF CANONICAL HEAD |
| Disposition | **FROZEN / UNACCEPTED / HISTORICAL PROVENANCE ONLY** |

---

## 2. Deterministic Verification Finding

### ENG-010-DV-R001

| Property | Value |
|---|---|
| Finding ID | `ENG-010-DV-R001` |
| Severity | **BLOCKING** |
| Classification | `MODEL_RESULT_CONTRACT / TYPE_LAUNDERING` |
| Affected file | `src/application/services/interaction/interactionOrchestrator.ts` |
| Disposition | **ACCEPTED / BLOCKING** |

**Invariant violated:**

A `ModelCapabilityResult` kind must preserve its real semantic payload. A `proposal` payload must not be retyped as advisory text. An `advisory` payload must not be retyped as `ProposedOperation[]`. No `as unknown as` may hide an incompatible caller-visible semantic payload merely to satisfy a generic return type.

**Defect 1 — `handleAdvisory`, `proposal` case:**

```typescript
case "proposal":
  return {
    kind: "proposed",
    proposal: modelResult.operations as unknown as NonEmptyText,
  };
```

`modelResult.operations` is `readonly ProposedOperation[]`. The code launders it to `NonEmptyText` via `as unknown as`. The caller receives a `PortionOutcome<NonEmptyText>` whose `proposal` field is not actually `NonEmptyText` — it is a `ProposedOperation[]` hidden behind a type assertion.

**Defect 2 — `handleProposal`, `advisory` case:**

```typescript
case "advisory":
  return {
    kind: "advisory",
    value: modelResult.content as unknown as readonly ProposedOperation[],
  };
```

`modelResult.content` is `NonEmptyText`. The code launders it to `readonly ProposedOperation[]` via `as unknown as`. The caller receives a `PortionOutcome<readonly ProposedOperation[]>` whose `value` field is not actually `ProposedOperation[]` — it is advisory `NonEmptyText` hidden behind a type assertion.

**Source verification:** Both defects confirmed by direct inspection of candidate `100f730556af7cea0f0a623809627aa3cf49d5a9` source file `src/application/services/interaction/interactionOrchestrator.ts`.

---

## 3. Builder Evidence Aggregate Discrepancy

| Property | Value |
|---|---|
| Builder-reported aggregate | `edb1cd6e9b8f61df9da1ce2a22223ab3644fdbbcf12f3030ae83c4fd01630751` |
| Builder report algorithm | `<path>:<digest>\n` |
| Independent verifier algorithm | `<SHA256><two spaces><path><LF>`, sorted `LC_ALL=C` |
| Authoritative candidate-1 aggregate | `645b3cf637013e0491a1247ccae3cff52e2c4fb6918cf378cf4ba8bc50a6bef1` |
| 11 exact Git-object hashes | **INDEPENDENTLY MATCHED** |
| Classification | **BUILDER_REPORT_EVIDENCE_MISMATCH_ONLY** |

This is NOT:

- a candidate identity defect;
- an implementation mutation;
- an additional Repair-1 technical requirement.

The mismatch is solely due to the Builder using a different report algorithm than the canonical manifest format.

---

## 4. Candidate 1 Test and Toolchain Status

| Check | Result |
|---|---|
| Candidate topology | PASS |
| 11-path lock | PASS |
| Migration | PASS |
| `git diff --check` | PASS |
| TC-01 through TC-27 | Tests exist; verifier reported PASS for current assertions |
| Discovered Vitest configs | 16 |
| Tests | 452 / 452 PASS |
| Typecheck | PASS |
| Lint | PASS |
| Build | PASS |
| Smoke | PASS |
| **Deterministic implementation acceptance** | **FAILS** — ENG-010-DV-R001 is BLOCKING |

Passing tests do not override the source-level semantic contract defect. The type laundering passes TypeScript compilation because `as unknown as` explicitly bypasses the type system, but the runtime payload is semantically incompatible with the declared return type.

---

## 5. Repair 1 Authorization

| Property | Value |
|---|---|
| Repair | REPAIR 1 AUTHORIZED |
| Blocking objective | Close ENG-010-DV-R001 without semantic drift |
| Ancestry rule | Candidate 1 must NOT be Repair 1 parent or ancestor |
| Implementation base | Fresh dispatch commit on canonical `foundation/product-foundation` |
| Write lock | Same exact 11-path lock (full candidate recreation required) |
| Human Reserved | NOT REQUIRED |

**Repair 1 technical objective:**

Ensure every `ModelCapabilityResult` kind is mapped to a caller-visible `PortionOutcome` with a truthfully typed payload:

- No `ProposedOperation[]` → `NonEmptyText` laundering
- No `NonEmptyText` → `ProposedOperation[]` laundering
- No `as unknown as` workaround for model-result payload compatibility
- No collapse of advisory/proposal distinction
- No model result becomes authoritative
- Uncertain/unable/failure behavior remains bounded and truthful

**Regression requirement:**

- TC-01 through TC-27 preserved
- New deterministic assertions for DV-R001 (A through F per dispatch)

**Migration:** Immutable — `migrations/0001_authoritative_state.sql`, blob `5a50e2b216f824ff02ebf09e803a6c25a43bcfe0`, SHA-256 `adfeee87fcc5d56d70bb000c4e1c81f4a49fa1f1b73c7313a117f1bedee33a99`.

---

## 6. Repair 1 Builder Identity

| Property | Value |
|---|---|
| Branch | `eng-010-builder-repair-1` |
| Worktree | `/private/tmp/prj226-eng010-builder-repair-1` |
| Base | Repair 1 dispatch commit (to be created) |
| Current Builder | `ENG-010 REPAIR 1 BUILDER` |
| Implementation | NOT YET STARTED |

The failed candidate 1 Builder identity (`eng-010-builder` / `/private/tmp/prj226-eng010-builder`) is NOT reused. Candidate 1 may be inspected as read-only historical implementation reference only.

---

## 7. ENG-010 Status After Disposition

| Property | Value |
|---|---|
| ENG-010 | NOT DONE |
| Formal DoR | PASS (Revision 1) |
| READY | YES |
| Candidate 1 | `100f730556af7cea0f0a623809627aa3cf49d5a9` — FROZEN / UNACCEPTED / HISTORICAL |
| ENG-010-DV-R001 | BLOCKING / ACCEPTED |
| Repair | REPAIR 1 AUTHORIZED / DURABLY DISPATCHED |
| Current Builder | ENG-010 REPAIR 1 BUILDER |
| Implementation | NOT YET STARTED |
| Human Reserved | NOT REQUIRED |
| Semantic review | NOT YET AUTHORIZED |
| Next required role | ENG-010 REPAIR 1 BUILDER |

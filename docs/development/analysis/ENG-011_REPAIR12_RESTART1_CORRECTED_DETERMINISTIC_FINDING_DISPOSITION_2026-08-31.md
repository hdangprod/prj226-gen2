# ENG-011 Repair-12 Restart-1 Corrected Deterministic Finding Disposition and Repair-13 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-08-31

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Controller role:** `REPAIR-12 RESTART-1 CORRECTED DETERMINISTIC CANDIDATE-DEFECT ADJUDICATION / REPAIR-13 AUTHORITY DECISION`

**Rejected candidate:** `2d2ae269f158baf17393e84b5cf3fc9438910f41`

**Rejected tree:** `edb427e6e030b72a5b913214cd2f0fd474def970`

**Corrected Restart-1 dispatch:** `2fa782cccbe19d58516c1458bb526413571682a2`

**Candidate topology:** sole parent `2fa782cccbe19d58516c1458bb526413571682a2`; distance from dispatch `1`

**Deterministic verification:** `VALID / FAIL / CANDIDATE-SPECIFIC FINDING`

**Candidate disposition:** `IMMUTABLE / REJECTED / UNACCEPTED / HISTORICAL / NON-CANONICAL`

**Controller outcome:** `REPAIR 13 AUTHORIZED UNDER UNCHANGED 20-PATH WRITE LOCK`

**Task Packet / Formal DoR:** `REVISION 5 / OPERATIVE / PASS`

**Human Reserved:** `NOT REQUIRED`

**Migration:** `NO MIGRATION`

## 1. Adjudication

### `ENG-011-R12-R1C-DV-002` — CONFIRMED / BLOCKING / BOUND TO REPAIR 13

**Classification:** `IMPLEMENTATION_DEFECT / MISSING_TC21_REAL_BYTE_ARCHITECTURE_GUARD`

The authoritative Revision-5 Task Packet requires `ENG-011-TC-21` to prove by static scan that prohibited vendor, OpenTelemetry, Sentry, queue, cache, analytics, network, telemetry-persistence, secret/content, and new-runtime-service constructs do not enter the write lock. Its carried-forward `R3-TC-13` additionally requires that scan to be path-complete and robust for prohibited vendor/network/persistence/service/content/architecture tokens. These are substantive candidate-resident executable obligations, not Builder-report assertions or verifier-only accounting.

The fresh deterministic verification is environment-capable: all six local-D1 configurations and all 18 dynamically discovered Vitest configurations passed, with 544 independently invoked tests. Its missing TC-21 proof is therefore a candidate-content defect, not the earlier Local-D1 process-spawn environment condition.

The rejected candidate contains no executable real-byte scanner over the ten Revision-5 production paths and no synthetic positive-control suite proving detection of known violating bytes. It therefore cannot establish either `ENG-011-TC-21` or `R3-TC-13`.

## 2. Required Repair-13 evidence

Repair 13 must implement executable guard logic inside the existing authorized path `tests/application/services/interaction/interactionObservability.test.ts`. The guard must read actual source bytes for exactly these production paths:

1. `src/application/ports/observability/operationalEvidence.ts`
2. `src/application/ports/observability/index.ts`
3. `src/application/services/interaction/interactionTypes.ts`
4. `src/application/services/interaction/interactionOrchestrator.ts`
5. `src/application/services/interaction/index.ts`
6. `src/infrastructure/observability/cloudflareOperationalEvidence.ts`
7. `src/infrastructure/observability/index.ts`
8. `src/application/contracts/operations.ts`
9. `src/application/services/projectActionContext/projectActionContextService.ts`
10. `src/application/services/knowledgeProvenance/knowledgeProvenanceService.ts`

It must detect the operative TC-21 pattern families: external telemetry/vendor imports including OpenTelemetry and Sentry; queues; scheduled/background work and `ctx.waitUntil`; automatic authoritative-mutation or deletion retry; provider fallback; telemetry persistence through D1/KV/R2; raw `Error.message`, raw `Error.stack`, and `JSON.stringify(error)` extraction; and arbitrary writer bags `attributes`, `metadata`, `payload`, and `details`. Positive controls must supply synthetic violating bytes for every required class/group and prove detection. The same test run must prove the ten actual production files are clean.

Builder evidence must name the guard test path and test names, enumerate the ten paths, report the actual positive-control count, and show execution results. Prose-only TC-21 credit is invalid. The next Deterministic Verifier must independently locate and execute this guard, its ten-path scan, and its positive controls, in addition to the full Revision-5 toolchain (including dynamic Vitest, local D1, migration identity, and whitespace checks).

## 3. Scope, topology, and clean-room conditions

The existing exact twenty-path lock is sufficient: the required scanner and tests fit entirely in already authorized `interactionObservability.test.ts`; no twenty-first path is authorized. Repair 13 must preserve all existing Revision-5 behavior and `TC-01` through `TC-20`, `R3-TC-01` through `R3-TC-12`, and `R3-TC-14` through `R3-TC-18`.

No Product, Domain, Human Control, provider architecture, recovery authority, telemetry infrastructure, schema, package, configuration, deployment, or migration change is authorized. S/O/S is not authorized until a fresh Repair-13 candidate receives deterministic `PASS`. Push remains `NOT PERFORMED`.

The governance-only commit containing this record is the sole Repair-13 dispatch authority. It must be one commit from the prior canonical governance head, have one parent, and be a `PRESENT_NOT_ANCESTOR` descendant of all thirteen failed implementation candidates. Repair 13 must use a fresh clean-room Builder; it must not inspect, reuse, copy, diff, restore, cherry-pick, or otherwise read implementation bytes from the rejected candidate or any prior failed candidate. Failed SHAs are permitted only for ancestry verification.

The failed implementation-candidate set is now thirteen:

`8baa7808fa3dcd6e0475d9176e124973959d52d7`, `dc558777b9efeb9e9e29ef0c42f2f448f308e1e2`, `49990f306ee67b62ae017f0d63fa556bde06d23a`, `d949e713e2ba1fbbf526eafded0a40de6b7beb2c`, `5f3d0d22a2cb54850ef9c3fe99137237a4e905e3`, `3adbe1ad5ef539b01f1af0c95603f02542000665`, `dce0f5babc9156383620ba8511f074197995b6a6`, `dd1a16ee3a638c20bc7aff9019d052e50ae23000`, `e5acfcc54e35e2fcd6912aa9eb1a64ac6baf821a`, `8f06d2833fcea3150bb4652fc8766c6ea7a8b37a`, `c7d6b1cf239da0be8dc2a71a55d41e2eb896dc39`, `ae3cb305d3635263aee52143b3903d140576e5dd`, and `2d2ae269f158baf17393e84b5cf3fc9438910f41`.

## 4. Repair-13 Builder assignment

- **Builder:** `ENG-011 REPAIR 13 BUILDER`
- **Branch:** `eng-011-builder-repair-13`
- **Worktree:** `/private/tmp/prj226-eng011-builder-repair-13`
- **Startup:** verify the exact dispatch commit/tree, correct branch, clean tracked/index/untracked state, and all 13 failed candidates `PRESENT_NOT_ANCESTOR` before source access.
- **Next role after a frozen candidate:** fresh Independent Deterministic Verifier; S/O/S only after deterministic `PASS`.

# ENG-011 Repair-14 Candidate-Evidence Adjudication and Repair-15 Dispatch

**Artifact class:** OPERATIONAL / CONTROLLER RECORD

**Lifecycle status:** ACTIVE

**Date:** 2026-09-01

**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`

**Task Packet / Formal DoR:** `REVISION 6 / OPERATIVE / PASS`

## Disposition

**ENG-011 CONTROLLER REPAIR-14 CANDIDATE-EVIDENCE ADJUDICATION: CONFIRMED**

| Field | Value |
| --- | --- |
| Candidate | `7cd33607acabe24fbf321d48ff53392c227f2b96` |
| Candidate tree | `da55a351ca81920192556bd879e4b7f523ffa317` |
| Parent | `3aed718d3688c8a4e771922c53933413a5f6e05e` |
| Candidate completeness | `FAIL` |
| Candidate status | `IMMUTABLE / REJECTED / UNACCEPTED / HISTORICAL / NON-CANONICAL` |
| Implementation defect | `YES` |
| Failed-candidate disposition | `ADD AS FAILED IMPLEMENTATION CANDIDATE 14` |
| Failed-candidate count | `14` |
| Push | `NOT PERFORMED` |

### Finding A — TC-08 / R3-TC-07

**MISSING REQUIRED NON-ACCEPTED TERMINAL EVIDENCE — CONFIRMED**

The candidate emits request evidence but returns from applicable non-accepted mutation exits before emitting a closed terminal. This violates `ENG-011-TC-08` and `R3-TC-07`: pre-persistence rejection must map to its actual stage and retain exact retry truth. Revision 6 binds the full closed terminal mapping in the operative Task Packet. It does not authorize an actual Human Control denial; existing Human Control unresolved remains distinct, and `authorization-denied` is only evidence of an already-existing separately normalized rejection.

### Finding B — TC-21 / R3-TC-13

**INCOMPLETE PROHIBITED-PATTERN FAMILY COVERAGE — CONFIRMED**

The candidate-resident guard correctly reads the ten real production paths and uses the same scanner for synthetic controls, but it omits required cache, analytics, network, evidence-content/secret, and new-runtime-service construct families. Revision 6 binds the complete bounded construct list and requires a same-scanner synthetic positive control for each family. Generic English-word matching is expressly insufficient.

## Repair strategy and topology

**NEXT REPAIR STRATEGY: FULL CLEAN-ROOM ENG-011 RECONSTRUCTION.**

Formal carry-forward authority does not exist. Repair-14 is a failed implementation candidate, and no accepted implementation base contains its reconstructed bytes. A narrow patch would contradict the continuing clean-room non-reuse rule.

| Field | Value |
| --- | --- |
| Repair identifier | `REPAIR-15` |
| Authorized clean base | `3aed718d3688c8a4e771922c53933413a5f6e05e` |
| Dispatch | The governance-only commit containing this record |
| Expected dispatch parent | `3aed718d3688c8a4e771922c53933413a5f6e05e` |
| Expected candidate sole parent | This dispatch commit |
| Expected candidate parent count | `1` |
| Expected candidate distance | `1` |
| Builder branch | `eng-011-builder-repair-15` |
| Builder worktree | `/private/tmp/prj226-eng011-builder-repair-15` |
| Write lock | `UNCHANGED / 20 EXACT PATHS` |

The authorized clean base is the prior Repair-14 governance-only dispatch. It contains no Repair-14 implementation bytes. Repair-15 must not inspect, copy, diff, cherry-pick, format-patch, apply, restore, stage from, or otherwise reuse implementation bytes, diffs, or worktrees from any of the fourteen failed candidates or Repair-13 incomplete topology candidate. Historical commit identities may be used only for ancestry verification.

## Boundaries and next roles

Product, Domain, Human Control, provider architecture, deployment, and migration: **NO CHANGE**. The exact twenty-path lock remains sufficient: the terminal implementation and its real-flow tests reside in the locked interaction paths; the scanner and its controls reside in the locked interaction-observability test path.

Repair-15 must preserve all otherwise successful reconstruction obligations: closed runtime admission and exact-object provenance, Cloudflare-native projection, fail-open sinks, provider/advisory separation, retrieval, persistence disposition, Knowledge, deletion/export, retry separation, mixed outcomes, trusted ingress, DATA-001, local-D1, migration identity, complete toolchain, and the candidate-resident TC-21 guard.

**DV:** `NOT AUTHORIZED UNTIL A NEW COMPLETE CANDIDATE`
**S/O/S:** `NOT AUTHORIZED`
**PUSH:** `NOT PERFORMED`

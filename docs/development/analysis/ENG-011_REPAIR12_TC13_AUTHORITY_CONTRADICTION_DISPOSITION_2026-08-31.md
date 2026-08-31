# ENG-011 Repair 12 TC-13 Authority Contradiction Disposition

**Artifact class:** OPERATIONAL / CONTROLLER RECORD
**Lifecycle status:** ACTIVE
**Date:** 2026-08-31
**Task:** `ENG-011 — Observability and Failure/Recovery Hardening`
**Controller role:** `REPAIR 12 RESTART 1 CORRECTED / TC-13 AUTHORITY CONTRADICTION DISPOSITION`

## Disposition

**Decision:** `B — OVER-SPECIFIED / ARCHITECTURALLY IMPOSSIBLE UNDER CURRENT AUTHORITY`

**Task Packet consequence:** Revision 5 is operative. TC-13's substantive acceptance semantics changed, so a Task Packet revision—not an informal Builder instruction—is required.

**Formal DoR consequence:** Revision 5 was rerun and is `PASS`. Revision 4 remains historical only for execution.

**Write-lock consequence:** Unchanged: exactly twenty paths. No runtime path, architecture boundary, provider route, migration, or test path is added.

**Builder consequence:** `ENG-011 REPAIR 12 RESTART 1 CORRECTED BUILDER` may continue in `/private/tmp/prj226-eng011-builder-repair-12-restart-1-corrected`. Its current authorized unstaged bytes are preserved; no candidate exists and no candidate creation is authorized by this record.

**Historical candidates:** 12 / unchanged. This authority stop produced no candidate.

## Builder finding and former requirement

The Builder correctly identified that Revision-4 `ENG-011-TC-13` required “Model success followed by failed authoritative mutation never emits or returns accepted-state success.” Read as a real single interaction attempt, this requires provider/model execution, authoritative mutation, and persistence durability failure in one production flow.

## Durable architecture and production-path evidence

`ARC-003` states that model results are advisory, inferred, generated, or proposed until separately accepted through application-owned semantics; a provider response cannot directly mutate accepted state, and provider success and accepted-state mutation must remain distinguishable. `ARC-004` requires observability to distinguish provider invocation outcome, attempted mutation, authoritative persistence result, and user-visible result. Product Foundation `PF-CTL-001` and Domain Model invariant 14 keep inference/proposal non-state-changing and require explicit direction for ordinary state changes.

The canonical orchestration realizes that separation. `InteractionOrchestrator.handleAdvisory()` and `.handleProposal()` are the only calls to `modelCapabilityPort.execute()`. Both return advisory/proposed, clarification, unresolved, prohibited, or failed model outcomes; neither invokes Human Control authorization, an authoritative mutation service, or persistence. Authoritative methods such as `.establishProject()`, `.createAction()`, `.captureKnowledge()`, and `.confirmDeletion()` instead consume `TrustedInteractionEvidence`, authorize through Human Control, and invoke application/persistence services; none invokes the model capability. Repository-wide source inspection finds only those two model-capability executions.

Accordingly, **no authorized provider→authoritative-mutation single production flow exists**. Adding one would change the interaction architecture and risk the approved Product/Human Control boundary. ENG-011 and `GOV-018` cannot authorize that expansion.

## Corrected operative TC-13 semantics

The revised acceptance requirement is deliberately two-flow and must be proved through production orchestration paths:

1. A real successful advisory or proposal flow invokes the model capability and emits truthful provider success plus an advisory/proposed user-visible terminal result. It emits neither authorization success, persistence success, nor accepted-state success.
2. A real authoritative mutation flow that reaches a persistence durability failure emits failed persistence and a non-accepted user-visible terminal result. It emits neither provider success nor accepted-state success.
3. The test inspects evidence emitted by those real flows. It may not manually emit provider success, splice evidence/correlation from separate requests into a synthetic provider→mutation chain, invoke automatic retry, or serialize DATA-001-prohibited material.

This preserves the original ENG-011 intent: stage-local truth, accepted-state truthfulness, and no conversion of an independent successful stage into terminal accepted-state success after another stage fails. It does not claim that the two flows are one attempt.

## Authority boundary

This is not Decision A: no existing combined flow was missed. It is not Decision C: the approved Product and Architecture do not intentionally require provider-assisted authoritative mutation. Were such a behavior desired, it would require a human Product/Domain and Runtime Architecture decision before any implementation: define when a model proposal may be used to initiate a mutation, its explicit-direction/confirmation relationship, the resulting orchestration boundary, and its persistence and observability contract. No such decision is required for the Revision-5 correction.

## Continuation and next role

The verified Project, Action, context, progress, retrieval, persistence four-way, and TC-15 work remains in scope and must be preserved. The Builder's next work remains the bounded Revision-5 matrix, including Knowledge, deletion/export, authorization rejection/unresolved, TC-18 through TC-21, full recalibration, and the contracted toolchain. Push remains `NOT PERFORMED`.

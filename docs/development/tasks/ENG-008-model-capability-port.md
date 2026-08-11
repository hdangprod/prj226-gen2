# ENG-008 — Model Capability Port and Deterministic Double

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 1

**Current task state:** `DONE` in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

## Task ID

`ENG-008`

## Objective

Define the Liam-owned provider-neutral Model Capability Port and a deterministic model double for bounded interaction context, generated/advisory responses, structured proposals, explicit uncertainty/inability, and normalized provider failure. Model output remains non-authoritative and receives no trusted Human Control ingress authority.

## Normative authority

- `GOV-018` and `ARC-003`, `ARC-005`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md), [Domain Model](../../../product/DOMAIN_MODEL.md), and [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md), revision 1.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) and [Engineering Plan](../ENGINEERING_PLAN.md), revision 1.
- The exact completed [`ENG-002` Delivery Record](../delivery/ENG-002-domain-application-kernel.md) and its Task Packet revision 1.

## Dependencies and readiness

- `ENG-002` is `DONE`; verification is PASS and independent review is GREEN on manifest `a0c4613503812ece55e20c2da616b21df165ee5d2ec77b6f8ed5b8381d68319f`.
- Provider-neutral operation and Human Control contracts exist as the authoritative boundary.
- No provider access, policy decision, paid service, external resource, or Human Reserved decision is needed for the deterministic port/double.
- Ownership below is disjoint from `ENG-003`; no task is `RUNNING`.

All Delivery Contract Definition of Ready conditions were satisfied before dispatch. Final deterministic verification is PASS, final independent boundary/security review is GREEN, and the completed evidence is recorded in the [ENG-008 Delivery Record](../delivery/ENG-008-model-capability-port.md). This packet is closed as `DONE`; it does not dispatch downstream work.

## Relevant context

The port accepts only interaction-necessary context and yields non-authoritative generated/advisory content, proposals/tool intent, uncertainty/inability, optional non-semantic diagnostics, or normalized failure. Provider IDs, message/thread structures, tool-call objects, hosted state, streaming, and provider errors stay downstream in adapters. Complete histories and authentication material are excluded.

## Allowed scope

One Builder receives exclusive ownership of:

- `src/application/ports/model/**` for the Liam-owned provider-neutral capability boundary;
- `src/testing/model/**` for deterministic doubles/fixtures; and
- `tests/application/ports/model/**` and `tests/testing/model/**` for contracts, minimization, exclusion, no-write, uncertainty, and failure evidence.

Use the locked ENG-001 toolchain and existing dependencies; root configuration and lockfile are protected.

## Forbidden scope

- Changes to `src/domain/**`, `src/application/contracts/**`, their ENG-002 tests, persistence/D1/migrations, or ENG-003-owned paths.
- Workers AI bindings, provider adapters, provider/model network calls, prompts tied to a provider, live qualification, provider policy acceptance, model selection changes, hosted memory, persistence, retrieval, interaction orchestration, or trusted Human Control ingress.
- Passing credentials/authentication material or automatically passing complete Project, Knowledge, or conversation history.
- Any accepted-state mutation or representation of provider success as authorization, persistence success, or accepted success.
- Production, paid-service, deployment/provisioning, secret operations, or control-plane work.

## Constraints and invariants

- Direction remains `provider/model → proposal/advisory → application interpretation → Human Control → possible authorization`; the port cannot reverse or bypass it.
- Model outputs and diagnostics are non-authoritative and provider-replaceable.
- Context is explicitly bounded to the applicable capability and excludes authentication material by construction and fixtures.
- Failure, refusal, malformed result, inability, and material uncertainty are normalized without provider-specific types or false success.
- The deterministic double is controllable, side-effect-free, network-free, and cannot manufacture trusted ingress evidence or capabilities.

## Definition of Done

1. The provider-neutral port represents bounded requests and the approved result categories without provider representations.
2. Deterministic doubles cover generated/advisory, proposal, uncertainty/inability, and normalized failure paths.
3. Tests prove context minimization, authentication-material exclusion, proposal/provider-output no-write behavior, and separation from Human Control authority.
4. Static scans prove no provider SDK/API/binding, hosted-state, D1/persistence, network, or provider-specific type enters the allowed paths.
5. Clean repository checks and exact-candidate evidence pass.
6. An independent boundary/security review is GREEN and every blocking finding/recheck is resolved.

## Verification contract

Bind packet revision, ENG-002 manifest, candidate manifest/commit, lockfile, commands, tool versions, and assumptions. Run clean install; typecheck; lint; unit/foundation/build/smoke; port/double contract tests; context-minimization and authentication-material exclusion fixtures; advisory/proposal/provider-success no-write tests; uncertainty/inability/failure matrix; provider-free import/API, network, persistence, hosted-state, and trusted-ingress scans; dependency listing; and `git diff --check`. Unavailable evidence is explicit and not PASS.

## Risk classification

**HIGH — architecture, data-minimization, Human Control, and provider-boundary risk.** Require disjoint ownership, deterministic no-network evidence, secret-exclusion fixtures, exact-candidate binding, and an independent boundary/security review. Material authority/security scope change requires fresh full review.

## Assignment

- **Planner / Controller:** dependency/readiness, exact base/candidate, locks, findings, and state.
- **Builder:** one Standard Delivery writer with provider-neutral contract capability.
- **Verifier:** Deterministic Execution, read-only.
- **Reviewer:** independent of Builder, Strong Semantic Reasoning for architecture/data/security boundaries.
- **Locks:** only allowed paths above; no root, ENG-002, ENG-003, provider-adapter, or runtime ownership.

## Human Reserved boundaries

Stop for Product/Architecture/Human Control/security-boundary change, provider activation or terms/data-policy disposition, paid use, production action, new service/infrastructure, credential/secret operation, unresolved authority conflict, or scope expansion. Provider-neutral TypeScript shapes and deterministic-fixture design are Engineering-owned within approved semantics.

## Prior findings

None.

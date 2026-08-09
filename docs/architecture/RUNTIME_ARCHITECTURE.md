# Liam v1 Runtime Architecture Baseline

**Artifact class:** CANONICAL

**Lifecycle status:** APPROVED

**Revision:** 1

**Decision owner:** `github:hdangprod`

**Authorization:** `GOV-016`

**Approval decision:** `GOV-017`

**Approved by:** `github:hdangprod`

**Approved on:** 2026-08-09

**Normative dependencies:** `product/PRODUCT_FOUNDATION.md` revision 1; `development/DELIVERY_CONTRACT.md` revision 1; `ARC-001` through `ARC-006`, revision 1.

## Purpose and approval boundary

This approved baseline defines the minimum runtime architecture for Liam v1. It derives from the approved Product Foundation and six human-approved architecture decisions through human architecture disposition `GOV-017`. It authorizes no engineering implementation, deployment, schema, migration, credential, or infrastructure provisioning.

## Architecture drivers and invariants

Liam is one-user, conversational, bilingual, and reliability-weighted. It needs useful continuity, intentional knowledge capture/retrieval, provenance, supersession, deletion/export, qualified uncertainty, recoverable failure, and explicit user control. Preservation, correctness, and recoverability outrank responsiveness.

The following invariants are binding:

1. Only the Liam domain/application boundary may accept a domain-state transition.
2. Required authoritative persistence succeeds before accepted-state success is reported.
3. Model output, inference, recommendation, retrieval, provider state, caches, and derived views are non-authoritative.
4. Authoritative accepted memory is the source of truth; materialized retrieval state is rebuildable/correctable from it.
5. Superseded knowledge is distinguishable and is not returned as current unqualified knowledge.
6. Confirmed deletion propagates to derived representations or leaves detectable, recoverable staleness; deleted material is not intentionally usable as current knowledge.
7. Provider response success and accepted-state success are separate outcomes.
8. Operational evidence is data-minimized and excludes authentication material.

## Runtime topology and responsibility boundaries

Liam uses one application deployable. Internal logical boundaries do not imply separate services.

```text
User text interaction
        |
        v
Interaction / orchestration boundary
        |
        +--> DOMAIN / APPLICATION AUTHORITY ------------------------+
        |       human-control, target clarity, lifecycle,            |
        |       accepted transition, export/deletion semantics       |
        |                    |                                      |
        |                    v                                      |
        |       PERSISTENCE PORT --> D1 ADAPTER --> Cloudflare D1    |
        |                    |                                      |
        |                    v                                      |
        |       retrieval projection / direct queries (derived)      |
        |                                                           |
        +--> MODEL CAPABILITY PORT --> provider adapter --> Workers AI
                                                     initial candidate:
                                                     @cf/zai-org/glm-4.7-flash
```

The domain/application authority owns product semantics. D1, Workers AI, logs/traces, and all adapters are infrastructure or integration concerns, not product-semantic authorities. Additional deployables require later demonstrated reliability, isolation, scale, security, or operational need.

## Liam-owned Model Capability Contract

The conceptual, provider-neutral contract is:

```text
APPLICATION / DOMAIN -> MODEL CAPABILITY PORT -> PROVIDER ADAPTER -> MODEL / PROVIDER
```

The Liam-owned side receives an interaction request, only the minimum context needed for that interaction, accepted Project/Action/Knowledge context required for it, applicable user constraints, and the requested model capability. It yields a generated/advisory response, a structured proposal or proposed action/tool intent where applicable, explicit uncertainty or inability when materially relevant, optional usage/diagnostic metadata that does not define product semantics, or a normalized provider-failure outcome.

This is a conceptual architecture contract, not source types, a JSON schema, an executable API, or an implementation protocol. Provider-specific response IDs, conversation/thread IDs, proprietary message structures, function/tool-call objects, hosted memory, structured-output representations, streaming semantics, and error objects remain inside the provider adapter. The Liam application may expose its own normalized semantics, but provider-specific representations do not become domain/application contracts.

Provider-hosted conversation state, caching, history, and retention are non-authoritative. Liam does not depend on them as canonical Project, Action, Knowledge, provenance, lifecycle, correction, or required conversation memory. Information the Product Foundation requires Liam to preserve is stored in Liam-owned authoritative persistence; provider replacement must not require reconstruction of canonical state from provider history.

Only interaction data reasonably required for the applicable model capability may cross this boundary. Complete Project history, complete Knowledge history, and complete conversation history are not automatically required context. Context assembly remains bounded by interaction need and selects no token-selection algorithm. Credentials, authentication secrets, API tokens, private keys, and equivalent authentication material must not be intentionally included in model context or captured as product Knowledge. Provider credentials are operational configuration, not Liam product memory.

Before a model/provider is accepted for runtime use, and again before a provider change, applicable current terms must be reviewed for data use, retention, provider-hosted state, caching/storage behavior, training/improvement use, applicable model/license terms, and other conditions materially affecting approved Liam data control. These changing external facts are supporting evidence, not permanent product semantics. Technical adapter compatibility is insufficient when a provider's current behavior cannot satisfy Liam's approved data-control boundary.

## Accepted memory and retrieval

Authoritative durable memory contains accepted Projects, Actions, accepted progress/context required for resumption, Knowledge Items, origin provenance, lifecycle, correction/supersession, deletion effect, and other approved accepted product state. It is application-controlled and persisted through the persistence port.

Retrieval is a subordinate logical capability. For v1 it uses the simplest sufficient direct SQL querying of authoritative persistence; no separately materialized index, vector database, semantic-search system, graph store, cache, or retrieval service is selected. If materialized retrieval is introduced later, it remains derived, provenance-preserving, currentness-aware, deletion-aware, and rebuildable from authority.

Conversation/session context is transient. Model history, summaries, relevance rankings, inferred current context, recommendations, and retrieved items do not become accepted memory merely by being available. Resumption-required content must be in authoritative memory.

## State-changing interaction flow

```text
request -> application interpretation/proposal -> target/authority check
        -> domain validation -> authoritative persistence attempt
        -> accepted or failed durable outcome -> derived-state work (if any)
        -> user-visible result
```

Ambiguity affecting an accepted change is clarified. Ordinary accepted changes require explicit direction; deletion additionally requires clear scope and separate confirmation. A model may assist interpretation or propose structured actions, but domain validation and human-control semantics decide whether any mutation is accepted. Mixed requests return separate outcomes.

For advisory retrieval and recommendation, the conceptual flow is:

```text
current interaction -> authoritative context selection -> minimal relevant retrieval
-> provenance/currentness qualification -> Model Capability Port -> advisory/generated result
-> uncertainty exposure -> user-visible response
```

## Integration and technology baseline

| Concern | Proposed selection and boundary |
| --- | --- |
| Application language/runtime | TypeScript on Cloudflare Workers; one Liam deployable. |
| Authoritative persistence | Cloudflare D1 through `DOMAIN/APPLICATION → PERSISTENCE PORT → D1 ADAPTER`. D1-specific APIs/extensions do not enter domain semantics where practical. |
| Retrieval | Application-managed direct SQL queries; no separate retrieval technology for v1. |
| Model capability | `DOMAIN/APPLICATION → MODEL CAPABILITY PORT → PROVIDER ADAPTER → MODEL`. Initial free-profile platform-capable validation candidate: Cloudflare Workers AI `@cf/zai-org/glm-4.7-flash`. It is replaceable configuration, not architecture authority or proof of Liam semantic suitability. |
| Operations evidence | Cloudflare-native structured, data-minimized logs and traces; no separate observability vendor. |
| Explicitly absent | Vector/search/cache/queue services; external productivity/knowledge integrations; provider-hosted memory; additional Liam services; named UI/API framework, ORM, schema, or migration mechanism. |

The initial profile aims for approximately zero incremental infrastructure/API cost while within free-tier allocations. Limits are operational constraints: exhaustion produces visible operational failure or an upgrade decision, never a change in product truth or a required architecture redesign.

Premium providers such as OpenAI Responses API remain future compatible options through the model capability port. Their adoption is not required for, and cannot alter, Liam’s domain, persistence, memory, or human-control semantics.

## Verification and observability architecture

Later engineering must provide deterministic evidence for accepted-state durability/truthfulness, explicit human-control and confirmation behavior, retry/recovery safety, resumption after transient-context loss, retrieval provenance/currentness/uncertainty, supersession, deletion/export, derived-state reconstruction, and provider failure isolation.

Runtime signals must distinguish, where applicable:

```text
request -> interpretation/proposal -> authorization -> persistence result
        -> derived-state outcome -> provider outcome -> user-visible outcome
```

Signals use correlation and operation/entity identifiers, status, transition category, timing, and error classification where practical. They do not indiscriminately retain conversation or Knowledge content. No latency, availability, retention, logging-volume, or uptime SLO is implied.

## Initial model-candidate verification

Cloudflare documents `@cf/zai-org/glm-4.7-flash` as a Cloudflare-hosted multilingual text model for 100+ languages with function calling and multi-turn tool calling. This establishes it as a platform-capable validation candidate for bilingual conversational and tool-mediated interaction. It does not establish Liam product sufficiency. Before an implementation may claim the model is sufficient, it must pass the approved semantic/scenario evidence, including bilingual interaction, qualified inference, advisory recommendation, and application-owned state-change behavior.

## Traceability

| Architecture concern | Governing authority |
| --- | --- |
| Single deployable, logical boundaries | `ARC-002` revision 1 |
| Accepted-state ownership, durability, derived-state subordination | `ARC-001` revision 1 |
| Minimal model integration and provider portability | `ARC-003` revision 1 |
| Verification, observability, data-minimization requirements | `ARC-004` revision 1 |
| Layered canonical memory, direct-query retrieval | `ARC-005` revision 1 |
| TypeScript, Workers, D1, Workers AI candidate, free-profile constraint | `ARC-006` revision 1 |
| Product scope, control, data, quality, and scenario semantics | `product/PRODUCT_FOUNDATION.md` revision 1 |

## Review boundary

Independent architecture review returned `NEEDS FIX` with `AR-F001` and `AR-F002`. Both targeted repairs were independently rechecked as `ARCHITECTURE TARGETED RECHECK: PASS`; neither reopened an `ARC-*` decision or introduced a material unrelated architecture change. The human owner approved this exact architecture revision through `GOV-017`. Engineering remains unauthorized.

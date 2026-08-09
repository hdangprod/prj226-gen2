# PRJ226 Generation 2 Runtime Architecture Phase

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Phase authorization:** `GOV-016` (APPROVED)

**Decision owner:** `github:hdangprod`

**Last updated:** 2026-08-09

**Phase state:** COMPLETE

**Canonical inputs:** [Product Foundation](../../product/PRODUCT_FOUNDATION.md) revision 1; [Delivery Contract](../../development/DELIVERY_CONTRACT.md) revision 1; [Decision Register](../foundation/DECISIONS.md); [Current Project State](../development/CURRENT.md).

## Purpose and boundary

This is the bounded, durable Architecture Phase dossier authorized by `GOV-016`. It records phase readiness, derived drivers, decision dependencies, and the minimum Decision Packet needed to obtain Human Reserved Architecture decisions. It is not an architecture baseline and does not itself resolve an `ARC-*` decision.

The Foundation Program remains complete and unchanged. Architecture approval and each `ARC-001` through `ARC-006` disposition remain Human Reserved Authority. Engineering implementation remains unauthorized.

## Current architecture-candidate state

`ARC-001` through `ARC-006` are all human-approved at revision 1. [Liam v1 Runtime Architecture Baseline](RUNTIME_ARCHITECTURE.md) revision 1 is `CANONICAL / APPROVED` through `GOV-017`. Independent architecture review returned `NEEDS FIX` with `AR-F001` and `AR-F002`; both targeted repairs passed independent targeted recheck and the human owner approved the architecture. The Runtime Architecture Phase is COMPLETE. Engineering remains unauthorized.

## Architecture-phase Definition of Ready

| Delivery Contract requirement | Evidence and status |
| --- | --- |
| Objective and authority | `GOV-016` explicitly authorizes a post-Foundation Runtime Architecture Phase and names its allowed and prohibited scope. **Ready.** |
| Dependencies | `GOV-015`, Product Foundation revision 1, and Delivery Contract revision 1 are approved and named in `GOV-016`. **Ready.** |
| Bounded scope and invariants | The authorization permits architecture analysis and proposed artifacts only; it excludes implementation, schemas, migrations, deployment, credentials, and engineering Task Packets. **Ready.** |
| Definition of Done | A minimum proposed architecture baseline is traceable, every `ARC-*` decision is explicitly human-resolved or recorded as deferred by the human, deterministic documentation verification passes, and no engineering implementation exists. **Ready for analysis; not yet satisfied.** |
| Verification and review | Documentation/traceability checks and scope checks will be recorded; independent architecture review is required before any architecture approval candidate can be human-disposed. **Defined.** |
| Assigned responsibility | Strategic Architecture Planner may derive and prepare alternatives; Human Reserved Authority decides `ARC-*` records and architecture approval. **Ready.** |
| Human decisions necessary to begin | None: analysis and a Decision Packet are authorized. The decisions necessary to close the phase remain reserved and are identified below. **Ready.** |
| Conflict and durable-context control | The Decision Register owns decision state, this dossier owns current phase context, and a material authority conflict must escalate to the human owner. **Ready.** |

## Derived architecture drivers

| Driver | Approved basis | Architectural consequence |
| --- | --- | --- |
| Narrow one-user founder validation | `PF-BND-001`, `PF-QLT-001` | Prefer one simple deployable and proportionate operations; do not introduce collaboration or hypothetical scale machinery. |
| Conversational Vietnamese/English assistance | `PF-INT-001`, `PF-CAP-001` | A conversational/model capability is needed, but its output cannot own accepted domain state. |
| Canonical domain and lifecycle semantics | `PF-MOD-001`, `PF-LIFE-001` | One clear authoritative ownership boundary must preserve Projects, Actions, Knowledge Items, accepted context/progress, lifecycle, provenance, and supersession. |
| Explicit human control | `PF-CTX-001`, `PF-REC-001`, `PF-CTL-001` | State-changing requests require deterministic application-owned acceptance rules; ambiguous targets clarify; inference and recommendation remain advisory. |
| Data control | `PF-DATA-001` | Accepted data needs predictable retention, export, deletion propagation, non-repurposing boundaries, and exclusion of authentication material from intended capture. |
| Reliability over speed | `PF-QLT-001`; `SCN-004`, `SCN-010` | Accepted changes need truthful outcomes, recoverability, and observable failure; derived representations cannot be the sole product authority. |
| Useful continuity and retrieval | `PF-USE-001`, `PF-KNW-001`; `SCN-003`, `SCN-005`, `SCN-009` | Separate canonical accepted memory from ephemeral conversation, inference, and rebuildable retrieval aids; preserve provenance and supersession. |
| Qualified recommendation and retrieval | `PF-CTX-001`, `PF-REC-001`, `PF-KNW-001` | Retrieval and model results need uncertainty/correctability and may not silently write accepted state. |

## Architecture decision dependency graph

```text
approved product + delivery authority
              |
              v
     ARC-001 <----> ARC-002
     APPROVED          APPROVED
              |             |
              +------v------+
                     ARC-005
                    APPROVED
                     |
              +------+------+
              v             v
         ARC-003         ARC-004
         APPROVED         APPROVED
              \             /
               +-----v-----+
                    ARC-006
             technology selection
```

`ARC-001` and `ARC-002` established ownership and one deployable; `ARC-005` established the memory layers; `ARC-003` established the minimum provider-neutral integration boundary; `ARC-004` established evidence obligations; and `ARC-006` selected the initial technology profile. All six are human-approved at revision 1. The completed sequence is: approved `ARC-001`–`ARC-006` → proposed Runtime Architecture Baseline → independent review `NEEDS FIX` → targeted repair → targeted independent recheck `PASS` → human architecture disposition `APPROVED`.

## ARC-006 technology requirements and candidate research (historical decision context)

| Requirement | Source | Architecture significance | Selection boundary |
| --- | --- | --- | --- |
| One application deployable with explicit logical boundaries | `ARC-002` | Yes | Application runtime/deployment environment only; no separate Liam services. |
| Authoritative durable accepted-state persistence with truthful write outcome, export, and deletion | `ARC-001`, `ARC-005`, `ARC-004` | Yes | Persistence technology and its application-controlled access path. |
| Minimal Project/Knowledge retrieval grounded in authoritative data | `ARC-005` | Yes, but only as an application/persistence capability | No separate search, vector, graph, cache, queue, or retrieval service unless demonstrated need arises. |
| Replaceable conversational/model capability | `ARC-003` | Yes | Model/provider choice and application-owned adapter boundary. |
| Invariant/failure testing and data-minimized correlated operational evidence | `ARC-004` | Yes | Test tooling and minimal diagnostics/observability capability. |
| Collaboration, external productivity/knowledge systems, multiple channels, web search, browser automation | `ARC-003` | No | Not selected for v1. |
| Embeddings, vector database, graph database, separate retrieval service, queue, cache | `ARC-005` | No | Not selected for v1; each needs later demonstrated architecture need. |

Technology candidates are evaluated only after this requirements table. `ARC-006` will distinguish named selections from implementation details such as ORM, schema, API shape, source-tree layout, queue/retry mechanism, metric thresholds, and production operations, which it does not decide.

## ARC-006 candidate research

Research was performed on 2026-08-09 for the then-pending Human Reserved Decision Packet; it is historical decision evidence, not a current technology-selection action.

| Candidate area | Current primary evidence | Fit and material trade-off |
| --- | --- | --- |
| Cloudflare Workers + D1 | [Workers overview](https://developers.cloudflare.com/workers/); [D1 overview](https://developers.cloudflare.com/d1/); [transaction batches](https://developers.cloudflare.com/d1/worker-api/d1-database/); [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/); [D1 export](https://developers.cloudflare.com/d1/best-practices/import-export-data/) | One managed application runtime plus SQLite-compatible serverless SQL. D1 batches roll back as a unit on a failed statement; D1 supports SQL export and time-travel recovery. It is the smallest coherent fit, but binds runtime and persistence to Cloudflare; the persistence adapter and application-level export remain required. |
| Cloudflare Workers + Neon Postgres | [Neon serverless Postgres](https://neon.com/use-cases/serverless-apps); [Neon pricing](https://neon.com/pricing) | More portable PostgreSQL semantics and extensions, but adds a second infrastructure provider, connection boundary, and operational/billing surface without a current v1 requirement. |
| Independently hosted application + managed Postgres | Approved requirements; no product need for always-on server or multi-provider topology | Viable later, but adds deployment and database operations with no approved reliability, scale, or integration benefit for one user. |
| OpenAI Responses API + GPT-5.6 Terra | [current models](https://developers.openai.com/api/docs/models); [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra); [data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint) | The current model supports text, multilingual interaction, streaming, function calling, and structured outputs. Terra is positioned for an intelligence/cost balance and is currently priced at $2.50 input / $15 output per million tokens. This is a provider choice, not a source of truth, and must be called through the approved adapter. Default Responses application-state retention and abuse-monitoring behavior require explicit data-control configuration and review. |
| Other managed model providers | [Anthropic pricing](https://docs.anthropic.com/en/docs/about-claude/pricing); [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) | Viable substitutes behind the approved boundary. They offer different capability, pricing, and data-policy trade-offs, but no approved v1 requirement favors them over the simpler selected-candidate path. |
| Cloudflare Workers Logs and Traces | [Workers observability](https://developers.cloudflare.com/workers/observability/); [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/); [Workers Traces](https://developers.cloudflare.com/workers/observability/traces/) | Provides native structured logs, request/handler/binding traces, custom spans, and export capability. It can meet ARC-004 without adding an observability vendor, provided application events remain data-minimized. |

## Final Human Reserved Architecture Decision Packet (historical decision context)

### ARC-006 — Technology selection

- **Exact question:** Which smallest coherent named technology set realizes the approved one-deployable, authoritative-memory, provider-neutral, and evidence-driven Liam v1 architecture?
- **Architecture drivers:** one-user simplicity; truthful durable acceptance; export/deletion/recovery; retrieval without mandatory materialized search; provider-replaceable conversational capability; data minimization; deterministic and diagnosable failure behavior; proportionate cost and operations.
- **Viable alternatives:**
  1. **Recommended coherent stack:** TypeScript on Cloudflare Workers as the single Liam application deployable; Cloudflare D1 as authoritative SQLite-compatible SQL persistence behind the approved persistence boundary; application-managed direct SQL retrieval for v1 with no vector/search/cache/queue service; Cloudflare Workers Logs and Traces for data-minimized operational evidence; OpenAI Responses API using `gpt-5.6-terra` as the initial model, always through the approved provider adapter.
  2. Cloudflare Workers plus Neon Postgres, with a separate provider’s diagnostics and the same provider-neutral model boundary.
  3. An independently hosted TypeScript application plus managed Postgres and separate observability provider, with an alternate managed model provider.
- **Recommendation:** Select TypeScript, Cloudflare Workers, Cloudflare D1, and Cloudflare-native observability as the smallest coherent platform set. Do not select OpenAI as a mandatory dependency. Use the approved provider-portable model boundary and Cloudflare Workers AI `@cf/zai-org/glm-4.7-flash` as the initial free-plan validation candidate, subject to Liam scenario/semantic evidence. No UI/API framework, ORM, schema, migration, queue, cache, vector store, embedding model, search engine, separate retrieval store, third-party telemetry vendor, external tool integration, or provider-owned memory is selected.
- **Cost and portability conditions:** Target approximately zero incremental infrastructure/API cost while founder-only usage remains inside current free-tier limits. Free-tier exhaustion is an operating constraint that can trigger an upgrade, not product semantics or architecture redesign. Preserve `DOMAIN/APPLICATION → MODEL CAPABILITY PORT → PROVIDER ADAPTER → MODEL` and `DOMAIN/APPLICATION → PERSISTENCE PORT → D1 ADAPTER`; provider/D1-specific types, hosted memory, identifiers, tool formats, and persistence semantics remain outside the domain/application core.
- **Advantages:** One application deployable and one managed persistence provider; transaction semantics align with accepted-state truthfulness; SQL export/recovery supports portability and recovery; no unnecessary vector/search/queue/cache complexity; native observability supports ARC-004; the model is powerful enough for the conversational capability while the application retains product truth.
- **Disadvantages:** Cloudflare runtime/D1 coupling; Workers AI model capability and free allocations can change; D1 SQL differs from PostgreSQL; the initial model requires Liam-specific acceptance validation before it can be treated as sufficient.
- **Failure and recovery implications:** D1 transaction failure must remain a non-accepted outcome; D1 export is a recovery/portability capability and not a substitute for user-visible export behavior; model timeout/refusal/malformed output and free-tier exhaustion remain isolated through the adapter; platform logs/traces must omit full conversation content unless a bounded diagnostic need is authorized. The product must not rely on provider conversation state or built-in tools such as web search, file search, or hosted memory.
- **Complexity impact:** Low relative to alternatives: no separate services, Postgres provider, vector database, retrieval store, cache, queue, or telemetry vendor.
- **Future flexibility impact:** Moderate. The persistence and model adapters preserve replacement paths, and SQL export supports migration, but Cloudflare-specific runtime/D1 APIs remain a conscious platform trade-off. Any additional infrastructure requires later demonstrated need and authorization.
- **Confidence:** High for the platform/persistence/observability fit; medium for the initial model candidate until it passes Liam's approved semantic/scenario evidence.
- **Consequence of deferral:** The Architecture Phase cannot form a complete proposed baseline or give later engineering a concrete, reviewable target. Implementation remains unauthorized regardless of approval.

## ARC-006 approved disposition

**Human disposition:** `ARC-006` revision 1 was approved by `github:hdangprod` on 2026-08-09 with the cost-first, provider-portable amendment. This completes the six Human Reserved Architecture decisions; it does not approve the proposed architecture baseline or authorize engineering implementation.

## Approved first architecture decisions

### ARC-002 — Runtime architecture boundaries

- **Exact question:** What is the minimum runtime responsibility and deployable boundary set that preserves v1 semantics?
- **Drivers:** narrow one-user validation; explicit human-controlled accepted state; truthful failure/recovery; conversational assistance; intentional capture, export, deletion, provenance, and supersession.
- **Viable alternatives:**
  1. **One deployable with explicit internal boundaries**: interaction/orchestration, domain application core, persistence adapter, retrieval/index projection, and external model-provider adapter.
  2. Two deployables: a conversational orchestration service and a state/memory service.
  3. Multiple distributed services partitioned by domain or integration.
- **Recommendation:** Alternative 1. Keep logical boundaries explicit but use one deployable for v1; no service boundary is justified by the approved one-user scope.
- **Advantages:** Lowest coordination and operational complexity; one accepted-state transaction boundary; preserves future replacement of integrations and derived retrieval; directly supports truthful acceptance reporting.
- **Disadvantages:** Requires disciplined internal interfaces; independent scaling/isolation is deferred.
- **Failure modes:** Without an explicit state boundary, model output or an index can be mistaken for accepted state; with distributed services, partial calls and coordination failures can produce false success or difficult recovery.
- **Complexity impact:** Low operational complexity; moderate module/interface discipline.
- **Future flexibility impact:** Internal boundaries permit later extraction only when evidence justifies it; no premature distributed contract is committed.
- **Confidence:** High, because current authority rejects multi-user and market-scale requirements and prioritizes correctness/recovery.
- **Consequence of deferral:** `ARC-001`, `ARC-005`, and all technology evaluation lack a stable responsibility boundary.

### ARC-001 — Persistence ownership

- **Exact question:** Within the runtime boundaries, which responsibility owns authoritative accepted state and what is non-authoritative?
- **Drivers:** Projects, Actions, Knowledge Items, accepted context/progress, lifecycle, provenance, supersession, deletion/export, no silent accepted-state loss, and retryable visible failure.
- **Viable alternatives:**
  1. **Domain application core owns authoritative accepted state** through a persistence abstraction; the persistent store holds the durable representation but has no separate product-semantic authority. Retrieval indexes, caches, model context, and provider copies are derived/external.
  2. A separate state/memory service owns all accepted state.
  3. Model conversation/provider state or retrieval index is treated as the primary memory authority.
- **Recommendation:** Alternative 1, paired with ARC-002 Alternative 1. The domain application core is the sole product-semantic owner; its accepted-state persistence is durable and transactional where a single accepted change needs all-or-nothing truthfulness. Derived indexes are rebuildable and must receive deletion/supersession propagation.
- **Advantages:** Clear source of truth; prevents provider/model/index authority drift; keeps export/deletion and recovery coherent; supports future technology replacement.
- **Disadvantages:** Requires an explicit projection/rebuild contract and failure handling for derived state; does not independently isolate storage operations.
- **Failure modes:** Treating an index or provider transcript as authority can surface deleted or superseded knowledge and falsely report acceptance. A failed durable write must produce no accepted success and preserve retry context.
- **Complexity impact:** Low-to-moderate: one authoritative persistence path plus explicit non-authoritative projections, rather than distributed ownership.
- **Future flexibility impact:** Storage and retrieval technologies may change behind the boundary; extraction to a service remains possible if later evidence requires it.
- **Confidence:** High for ownership separation; medium for exact transactional/retention mechanisms, which properly belong to later architecture and technology decisions.
- **Consequence of deferral:** Project-memory design cannot distinguish canonical history from retrieval aids, and verification signals cannot be assigned reliably.

**Human disposition:** `ARC-002` and `ARC-001` revision 1 were approved by `github:hdangprod` on 2026-08-09 with the semantic-authority, external-dependency, and architecture-invariant clarifications recorded in the Decision Register.

## Effect on ARC-005 — Runtime project-memory architecture

The two approved decisions materially constrain and simplify `ARC-005`:

- Canonical project memory must be the authoritative durable accepted-state representation controlled by the Liam domain/application boundary; it cannot be a provider conversation, vector index, cache, or inferred context.
- Project memory may remain within the one Liam deployable as explicit internal responsibilities; no separate memory service is required for v1.
- Retrieval, embeddings if ever adopted, caches, and generated summaries are necessarily derived aids. They need rebuild/correction semantics, must respect deletion and supersession, and cannot override canonical state.
- Conversational context is ephemeral working context, distinct from accepted Project Context and Accepted Progress. A model may assist interpretation, retrieval, or recommendation, but only the domain/application boundary can accept a change.

This removes alternatives that make a model transcript, index, or external provider the primary memory. It does not itself select the retrieval method, indexing technique, or persistence technology.

**Human disposition:** `ARC-005` revision 1 was approved by `github:hdangprod` on 2026-08-09 with the four-layer memory model, retrieval-neutrality, minimal-v1, and retrieval-correctness clarifications recorded in the Decision Register.

## Consequences for remaining decisions

### ARC-004 — technical verification and observability

`ARC-005` adds architecture-level evidence requirements beyond generic state-change tests. Engineering must be able to demonstrate and observe: authoritative acceptance before success; accepted-memory preservation across transient-context loss; projection/retrieval grounding, provenance, current-versus-superseded standing, and uncertainty; deletion/export correctness; derived-view staleness or reconstruction; and isolation of derived-state failures from accepted state. These are evidence requirements, not an observability vendor, metric threshold, schema, or implementation design.

### ARC-003 — integration strategy and provider choices

No approved product authority requires v1 integrations for collaboration, identity sharing, external project systems, calendars, email, storage, or multiple conversation surfaces. The only architecture-level capability that may require an external integration is the minimum conversational/model capability used to assist text interaction, interpretation, retrieval assembly, and advisory recommendation. Its output is non-authoritative under `ARC-001` and `ARC-005`; it needs an explicit application-owned authority, data-minimization, failure, and portability boundary. A named provider is not yet required to decide that boundary and remains downstream technology selection.

## Approved ARC-003 and ARC-004 decision-packet context

### ARC-003 — Integration strategy and provider choices

- **Exact question:** Which external runtime integrations are actually required for Liam v1, and what architecture boundary governs any conversational/model provider?
- **Drivers:** text conversational experience (`PF-INT-001`); useful interpretation, retrieval, and recommendation (`PF-CAP-001`, `PF-REC-001`); accepted-state authority (`ARC-001`); layered memory (`ARC-005`); non-repurposing, authentication-material exclusion, and reliability-weighted quality (`PF-DATA-001`, `PF-QLT-001`).
- **Viable alternatives:**
  1. **Minimum capability integration:** no v1 external product integrations except a replaceable conversational/model capability if needed; all model/provider calls pass through an explicit application-owned adapter and are advisory.
  2. Add external productivity, calendar, email, storage, collaboration, identity-sharing, or multi-surface integrations in v1.
  3. Make a selected model/provider's conversation state, tools, or memory Liam's primary integration and product-state mechanism.
- **Recommendation:** Alternative 1. Do not add external product integrations without an approved product need. Establish one external integration boundary for a conversational/model capability, which may be locally or externally supplied after `ARC-006`. The Liam application controls when it calls that capability, supplies only data necessary for the interaction, treats its result as advisory, visibly handles timeout/error/unavailability without false accepted-state success, and retains portability through a provider-replaceable boundary. Select no named provider yet.
- **Advantages:** Supports the required conversational experience without expanding scope; prevents provider state from becoming product truth; minimizes data exposure, operations, and lock-in; keeps technology selection evidence-based.
- **Disadvantages:** Defers optional ecosystem convenience; a provider-neutral abstraction has a small design cost.
- **Failure modes:** Model unavailability, timeout, malformed output, or provider data retention must not create false state success or data repurposing; provider-specific memory/tools can create lock-in or authority leakage if allowed to bypass the application boundary.
- **Complexity impact:** Low: one bounded integration category and no speculative integrations.
- **Future flexibility impact:** Additional integrations remain possible through later approved product and architecture decisions; model/provider substitution stays feasible.
- **Confidence:** High that no other external integration is justified; medium that an externally hosted model is necessary, because this decision preserves locally supplied capability as an option.
- **Consequence of deferral:** `ARC-006` cannot evaluate model/provider candidates or data/portability trade-offs against a defined role.

### ARC-004 — Technical testing and observability strategy

- **Exact question:** What architecture-level verification and observability obligations must later engineering satisfy to prove Liam preserves the approved reliability, memory, deletion, and uncertainty semantics?
- **Drivers:** `PF-QLT-001`, `PF-CTL-001`, `PF-DATA-001`, and scenarios `SCN-003` through `SCN-011`; approved invariants in `ARC-001` and `ARC-005`.
- **Viable alternatives:**
  1. **Evidence-first, boundary-aligned strategy:** deterministic tests and traceable runtime signals prove state-transition truthfulness, recovery, memory/retrieval correctness, data-control outcomes, and external-provider failure isolation; independent semantic acceptance tests cover scenario behavior.
  2. Predominantly end-to-end conversational testing with limited boundary-level checks/signals.
  3. Monitoring provider availability/latency only, without domain-operation evidence.
- **Recommendation:** Alternative 1. Require later engineering to verify and observe, at minimum: (a) explicit target/authority and durable accepted-state outcome for every state-changing operation; (b) failed-write truthfulness and preserved recoverable user intent where applicable; (c) no inferred/model/retrieved result becomes accepted state absent an explicit accepted transition; (d) authoritative-memory retention and resumption after transient-context loss; (e) retrieval provenance, qualification, current/superseded standing, and uncertainty; (f) export completeness and deletion acceptance/failure, including projection propagation or detectable/recoverable staleness; (g) derived-projection rebuild/correction and isolation from accepted-memory corruption; and (h) model/provider invocation outcome and failure class without treating provider success as state acceptance. Use correlation across the user operation, authoritative transition, derived-state work, and provider call where applicable. No vendor, metric threshold, log format, test framework, or operational platform is selected.
- **Advantages:** Directly tests the actual product quality claims; creates diagnosable recovery evidence; covers failure modes that conversational tests alone can hide; fits one deployable without distributed tracing assumptions.
- **Disadvantages:** Requires deliberate operation/evidence design and test fixtures; some external-provider failures require controlled simulation.
- **Failure modes:** Without this strategy, a UI or provider success could mask durable-write failure, stale retrieval could surface deleted/superseded knowledge, and missing evidence could prevent safe recovery or correction.
- **Complexity impact:** Moderate but proportionate: explicit evidence at each authority boundary rather than broad production-observability infrastructure.
- **Future flexibility impact:** Technology-neutral signal obligations allow later vendor selection and support future extraction only with evidence.
- **Confidence:** High, because every required obligation maps to approved quality, scenario, or architecture invariants.
- **Consequence of deferral:** `ARC-006` cannot fairly assess candidate technology testability, recovery characteristics, or operational complexity.

## Approved disposition

**Human disposition:** `ARC-003` and `ARC-004` revision 1 were approved by `github:hdangprod` on 2026-08-09 with the provider-neutrality, failure-isolation, semantic-invariant, logical-observability, data-minimization, and no-invented-SLO clarifications recorded in the Decision Register. At that historical point, `ARC-006` was the next decision; it is now approved at revision 1.

## Explicit non-implementation confirmation

No runtime source, service/module implementation, database schema or migration, executable API, deployment, infrastructure, provider account, production credential, engineering Task Packet, or control-plane implementation has been created in this phase.

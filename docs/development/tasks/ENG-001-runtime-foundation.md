# ENG-001 — Runtime and Tooling Foundation

**Artifact class:** OPERATIONAL

**Lifecycle status:** ACTIVE

**Task Packet revision:** 1

**Current task state:** `DONE` in [Engineering Plan revision 1](../ENGINEERING_PLAN.md)

**Delivery Record:** [ENG-001 Runtime Foundation Delivery Record](../delivery/ENG-001-runtime-foundation.md)

**Authorization:** `GOV-018`

**Canonical Task Packet contract:** [Delivery Contract revision 1, Task Packet](../../../development/DELIVERY_CONTRACT.md#task-packet)

This artifact populates the canonical Task Packet for `ENG-001`; it does not redefine the Task Packet schema. Mutable execution, evidence, finding, and completion state belongs in the Engineering Plan and the post-dispatch Delivery Record.

## Task ID

`ENG-001`

## Objective

Establish the smallest reproducible TypeScript and Cloudflare Workers implementation foundation needed by later Engineering tasks: one deployable Worker entry seam, a locked dependency toolchain, local/test-only configuration, a deterministic test harness, and stable repository commands for typecheck, lint, unit tests, build, and a non-mutating local integration smoke test.

This task creates executable structure only. It implements no Liam product command, accepted-state behavior, database schema, persistence or model adapter, retrieval, or live external call.

## Normative authority

- `GOV-018`, Engineering Phase authorization, revision 1.
- [Runtime Architecture](../../architecture/RUNTIME_ARCHITECTURE.md) revision 1, especially the single deployable, logical-boundary, TypeScript/Workers, verification, cost, and absent-service requirements.
- `ARC-002`, `ARC-004`, and `ARC-006`, revision 1, in the [Decision Register](../../foundation/DECISIONS.md).
- [Product Foundation](../../../product/PRODUCT_FOUNDATION.md) revision 1 for scope, data, and non-goal boundaries only.
- [Delivery Contract](../../../development/DELIVERY_CONTRACT.md) revision 1.

## Dependencies

- `GOV-018` is `APPROVED` and recorded durably.
- [Engineering Plan revision 1](../ENGINEERING_PLAN.md) records Engineering DoR `PASS` and this task as `READY`.
- Repository base before Engineering implementation: Git commit `7365d60c260956fa1bc16a647db724f3bd1c3440` plus the verified Engineering planning candidate.
- No predecessor Engineering task.
- No Human Reserved decision is required to begin.

## Relevant context

- The repository is documentation-only at packet creation: no `package.json`, dependency lockfile, runtime source, test configuration, schema, or migration exists.
- One TypeScript Cloudflare Workers deployable is approved. Logical modules do not imply extra services.
- Native Worker `fetch` routing is the default. Exact free, locally installable test/lint packages and versions are ordinary Engineering choices and must be lockfile-bound.
- Later tasks need stable commands and source/test conventions; this task must not pre-implement their behavior.

## Allowed scope

The assigned Builder has exclusive write ownership, for this task only, over:

- `package.json` and `package-lock.json`;
- `tsconfig.json` and generated Worker type declarations required by the selected local toolchain;
- `wrangler.toml` containing local/test-safe, non-secret, non-production configuration only;
- the minimum lint and test configuration files selected by the Builder, such as `eslint.config.*` and `vitest.config.*`;
- `.gitignore`, limited to generated dependency, build, coverage, local-emulator, and tool-output entries;
- `src/index.ts` and `src/runtime/**`, limited to the single Worker entry seam and non-domain runtime wiring needed for build/smoke evidence; and
- `tests/foundation/**`, limited to toolchain and non-mutating runtime smoke evidence.

Package-registry installation of free development/runtime dependencies needed for the locked local toolchain is permitted. The Planner / Controller, not the Builder, owns task-state changes and the Delivery Record unless a separate writing assignment says otherwise.

## Forbidden scope

- Project, Action, Knowledge Item, accepted context/progress, recommendation, human-control, deletion, export, or other product behavior.
- `src/domain/**`, application command or port implementations, database schema, `migrations/**`, D1 queries/adapters, retrieval logic, Model Capability Port, Workers AI adapter, prompt content, or live provider calls.
- Cloudflare account identifiers, production routes, production bindings, credentials, tokens, keys, secrets, or real sensitive user data.
- Remote resource creation, provisioning, deployment, paid-service activation, billing action, or any destructive external operation.
- A second deployable, separate service, vector/search/cache/queue dependency, provider-hosted memory, external productivity integration, or speculative framework stack.
- Scheduler, agent runner, automatic task router, orchestration database, `.dev-control`, or other development control-plane implementation.
- Changes to approved governance, Product Foundation, Domain Model, Scenario Corpus, or Runtime Architecture artifacts.

## Constraints and invariants

- Produce exactly one Liam Worker deployable; internal source seams are logical only.
- Use TypeScript and Cloudflare Workers-compatible APIs. Do not leak future D1 or provider types into domain/application placeholders.
- Keep the shell non-authoritative and non-mutating. A smoke response must not imply Liam product readiness or accepted state.
- Prefer the smallest sufficient dependency set and native Worker routing. Any framework dependency requires a recorded task-local need and must not create a new architecture boundary.
- Lock exact dependency versions and make verification reproducible through repository-owned commands.
- Configuration must be safe for local/test use and must contain no credential, production resource identifier, production route, or billing activation.
- No check may require a live model, D1 production instance, remote Cloudflare mutation, or paid service.
- No later task is automatically authorized or dispatched by completion of this task.

## Definition of Done

1. A clean dependency install is reproducible from `package.json` and `package-lock.json`.
2. Repository commands for typecheck, lint, unit test, build, and local integration smoke test exist, execute non-interactively, and pass.
3. The TypeScript Worker entry seam builds as one Cloudflare Workers deployable and the smoke test proves only non-mutating runtime reachability or handler behavior.
4. Local/test configuration contains no production binding, account identifier, route, credential, secret, paid-service activation, or remote provisioning action.
5. The candidate contains no product/domain behavior, schema, migration, persistence or model integration, extra service, or development control plane.
6. Dependency and source boundaries remain compatible with later domain, persistence, and model tasks without choosing their semantics.
7. Verification evidence is durably recorded against the exact candidate and every contracted check passes.
8. An Independent Reviewer returns `REVIEW GREEN` for architecture/configuration scope, or all blocking findings are repaired and required rechecks pass.

## Verification contract

The Deterministic Verifier must bind all results to the exact candidate commit/tree or reproducible file-hash manifest and record relevant runtime/tool versions and environment assumptions.

Required checks and pass criteria:

1. clean install using `npm ci` succeeds from the lockfile without changing it;
2. `npm run typecheck` succeeds;
3. `npm run lint` succeeds;
4. `npm test` succeeds;
5. `npm run build` succeeds without remote deployment;
6. the repository-defined local integration smoke command succeeds without a remote call or state mutation;
7. path and dependency inventory confirms one Worker entry, no second deployable/service, no database/schema/migration or product module, and no vector/search/cache/queue/control-plane dependency;
8. deterministic configuration/secret scan finds no credential-like value, production account/resource identifier, production route, or live provider invocation; and
9. `git diff --check` succeeds.

Any unavailable command or environment assumption is recorded as inability, not PASS, and returns the task to the Planner / Controller for failure classification. The Independent Reviewer evaluates the exact candidate, this packet, the Runtime Architecture, dependency inventory, and deterministic evidence. Review must not rely on Builder self-report.

## Risk classification

**MODERATE — foundational architecture, dependency, configuration, and broad future-dependency impact.**

Supplemental controls:

- one active Builder with exclusive ownership of the allowed paths;
- locked dependencies and reproducible clean-install evidence;
- explicit forbidden-service and secret/configuration scans;
- no remote or production action;
- exact-candidate independent architecture/configuration review; and
- fresh full review if the task adds an extra deployable, a material framework boundary, a security boundary, or broader write scope.

## Assignment

- **Delivery Planner / Controller:** owns dispatch, readiness re-evaluation, path-conflict control, Delivery Record creation, failure routing, and task-state changes.
- **Builder:** one Standard Delivery worker; exclusive writer for the allowed paths; cannot review its own candidate.
- **Deterministic Verifier:** Deterministic Execution profile; read-only except for separately authorized ephemeral/generated test output; records exact-candidate results.
- **Independent Reviewer:** a different actor from the Builder with Strong Semantic Reasoning appropriate to architecture/configuration conformance; read-only.
- **Write isolation:** no concurrent task may edit the allowed root configuration, `src/index.ts`, `src/runtime/**`, or `tests/foundation/**` paths.

## Human Reserved boundaries

Stop and prepare a Decision Packet if completion would require a Product Foundation or Runtime Architecture change, a new deployable/service or security boundary, paid use or billing, production provisioning/deployment/credentials, an irreversible external action, an unresolved authority conflict, or implementation of the development control plane. Ordinary package, lint, test, source-layout, and native Worker-routing choices inside this packet do not require human approval.

## Prior findings

None.

# AUTHEO.dev
## Business Case for Budget & Resource Approval

**Prepared by:** Autheo Product Team (draft prepared with AI assistance)  
**Date:** August 20, 2026  
**Status:** Draft — for product, technical, legal, and budget-owner review

> **Use of this document.** This is a planning business case, not a forecast, legal opinion, security assessment, or commitment to launch. Every quantitative data point is tagged as **Verified**, **Estimated**, or **Assumption to validate**. “Verified” in this document means verified against the canonical `FINAL DOCS/` architecture set or the cited external source; it does not mean that the underlying feature is already implemented.

## 1. Executive Summary

AUTHEO.dev is the proposed developer-facing product surface for deploying, operating, and observing workloads on the Autheo ecosystem. It would provide documentation, a CLI and SDK entry point, deployment manifests, a marketplace browser, workload status, logs, settlement visibility, and identity-management workflows. It is a consumption and orchestration layer over the Autheo Marketplace, Mesh, and L1; it is not a new settlement system or a separate trust domain. [Verified — `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`, §§ Overview, 2–5, 10]

The requested approval is to fund a staged MVP/beta effort that validates whether developers can safely deploy a basic container workload, understand where it runs, observe its status, and see the resulting settlement state without needing to operate the lower-level mesh and L1 directly. The proposed scope deliberately excludes hosted-wallet custody, fiat conversion, token exchange, and any new payment-routing function. [Assumption to validate — proposed product scope]

## 2. Problem & Opportunity

### Problem / Opportunity statement

Decentralized infrastructure is difficult to consume when developers must understand peer discovery, workload isolation, provider selection, settlement, and blockchain interaction before they can deploy a service. Autheo’s documented architecture has these functions across separate L1, marketplace, mesh, and control-plane layers. Without a coherent developer surface, those layers are difficult to use safely and consistently. [Verified — `FINAL DOCS/AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md`, §§ 3–4; `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`, §§ Overview, 1]

### Who has this problem or benefits from this opportunity

- Developers and small teams deploying containerized services, APIs, builds, or AI inference workloads. [Verified — `FINAL DOCS/MESH-COMPUTE.md`, §4]
- Enterprises seeking to use their own hardware while accessing external capacity. [Verified — `FINAL DOCS/COMMODITY-MARKETPLACE.md`, §11]
- Independent compute, GPU, storage, and edge-node providers that need discoverable demand and operational visibility. [Verified — `FINAL DOCS/COMMODITY-MARKETPLACE.md`, §§ 1–2]

### Size of impacted group

- Initial external-developer target: 100 active developer accounts during public testnet/beta. [Assumption to validate — the canonical roadmap uses this as a Phase 2 success criterion, not a measured market size; `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, line 122]
- Initial production target: 1,000 active developer accounts and 200 active node providers. [Assumption to validate — canonical Phase 3 success criteria; `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, lines 149–153]
- No validated current user, conversion, retention, or willingness-to-pay dataset is included in `FINAL DOCS/`. [Verified — documentation gap identified from the canonical set]

### Current alternative or workaround

Today, users would need to interact through lower-level APIs, command-line tooling, node software, or direct L1/marketplace mechanisms as they become available. This increases implementation burden and can obscure important distinctions between workload execution, marketplace coordination, and L1 settlement. [Estimated — based on the documented layer separation and planned CLI/SDK]

Closest alternatives include centralized clouds (AWS, Azure, and Google Cloud); decentralized-compute products identified in Autheo’s own strategic comparison (Akash and Render); and direct self-operated infrastructure. Autheo.dev’s intended differentiation is a developer-oriented interface to a peer-to-peer compute marketplace with transparent provider capacity, workload isolation, and L1-anchored settlement—not a claim of feature parity with those providers. [Verified — `FINAL DOCS/AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md`, §6]

### Evidence and sources

- Canonical Autheo architecture and roadmap: `FINAL DOCS/AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md`; `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`; `FINAL DOCS/COMMODITY-MARKETPLACE.md`; `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`. [Verified]
- Customer research required before beta: at least 15 structured interviews across developers, prospective providers, and enterprises. [Assumption to validate]
- Instrumented beta evidence required: activation, successful deployment, workload completion, provider selection, support-contact rate, and retention events. [Assumption to validate]

## 3. Proposed Solution

Build AUTHEO.dev as the developer-facing orchestration and visibility layer for the existing Autheo architecture:

1. A documentation and onboarding site explaining deployment, identity, marketplace, wallet connection, workload status, and settlement concepts.
2. A self-custodial CLI/SDK workflow for signing and submitting user-authorized L1 transactions through a compatible user wallet. The product must not generate, retain, recover, or control customer private keys. [Recommended architectural guardrail]
3. A deployment-manifest workflow that declares workload runtime, resource requirements, locality, budget ceilings, and scaling limits.
4. A marketplace browser and scheduler interface that surfaces eligible provider capacity, price, reputation, locality, and attestation conditions.
5. Workload, log, and settlement-status views that clearly distinguish pending execution, completed execution, pending settlement, and finalized settlement.
6. An auditable integration layer that reads on-chain state and mesh/marketplace status, but does not replace L1 settlement logic.

High-level architecture:

```text
Developer / Enterprise
        |
        v
AUTHEO.dev (docs, portal, CLI, SDK, manifest validation, observability)
        |                 \
        v                  v
Autheo Marketplace       Autheo L1
(admission, matching,    (user-authorized transactions,
metering, scheduling)     settlement, identity, reputation)
        |
        v
Autheo Mesh
(provider discovery, isolated workload execution, result delivery)
```

This architecture follows the documented boundary: Agentic OS consumes the marketplace and mesh APIs; deployments execute on the mesh and settle on L1. [Verified — `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`, §§ 1, 10]

## 4. Strategic Fit

AUTHEO.dev supports Autheo’s stated thesis that compute should operate as an open commodity market while remaining usable through cloud-like developer workflows. It supplies the developer-facing control plane needed to translate declared workload intent into marketplace queries, scheduling, execution, and settlement visibility without collapsing the distinct responsibilities of L1, marketplace, and mesh. [Verified — `FINAL DOCS/AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md`, §§ 2–5; `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`, §1]

## 5. Value Proposition

Developers can deploy and operate a workload on eligible distributed compute capacity with clear control over placement, budget, execution status, and self-authorized settlement. [Assumption to validate — customer outcome to test in beta]

## 6. Goals & Success Metrics

| Goal | Metric | Target | Timeframe | Leading / Lagging |
|---|---|---:|---|---|
| Validate onboarding | Interviewed prospective users | 15 participants (Assumption to validate) | Before beta | Leading |
| Validate activation | Accounts completing wallet connection and first valid manifest | 50 accounts (Assumption to validate) | Beta | Leading |
| Validate core workflow | Successful container deployments | 100 deployments (Assumption to validate) | Beta | Leading |
| Validate reliability | Deployment-to-workload-completion rate | ≥80% (Assumption to validate) | Beta | Leading |
| Validate usability | Median time from account creation to first successful deployment | ≤30 minutes (Assumption to validate) | Beta | Leading |
| Validate marketplace utility | External providers with a completed beta workload | 20 providers (Assumption to validate) | Beta | Leading |
| Establish launch readiness | Active developer accounts | 100 accounts (Assumption to validate) | Public testnet/beta | Lagging |
| Establish production traction | Active developer accounts | 1,000 accounts (Assumption to validate) | Post-mainnet | Lagging |

The last two targets are derived from roadmap success criteria and must be reconciled with validated demand before they are used as budget commitments. [Verified — `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, lines 119–123, 149–153]

## 7. Market & Competitive Evidence

| Data point | Value | Source | Confidence |
|---|---:|---|---|
| Public-testnet active developer objective | 100 accounts | `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, line 122 | Assumption to validate |
| Mainnet active developer objective | 1,000 accounts | `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, line 152 | Assumption to validate |
| Mainnet active-provider objective | 200 providers | `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`, line 151 | Assumption to validate |
| Addressable-market revenue estimate | Not yet quantified | No validated TAM/SAM/SOM research in canonical docs | Verified documentation gap |
| Expected paid conversion | Not yet quantified | Requires beta pricing and cohort evidence | Assumption to validate |

### Closest competitors

| Competitor / alternative | Relevant comparison | AUTHEO.dev differentiation to test |
|---|---|---|
| AWS, Azure, Google Cloud | Centralized cloud deployment and managed infrastructure | Open provider network and user-selectable marketplace capacity; no claim of parity. [Verified — Autheo comparison, White Paper §6] |
| Akash | Decentralized compute | Developer workflow, workload isolation, provider/reputation visibility, and L1-anchored settlement. [Assumption to validate — comparison requires hands-on competitive research] |
| Render | Developer-oriented deployment platform | Distributed provider marketplace and direct connection to Autheo L1/Mesh architecture. [Assumption to validate — comparison requires hands-on competitive research] |
| Self-hosted infrastructure | Full operational control, but owner bears setup and capacity-management burden | Discovery, matching, metering, and execution coordination. [Estimated] |

## 8. The Ask

### Target cost, outcome, and benefits

Approve a capped MVP/beta budget of **$180,000 (Assumption to validate)** for product design, engineering, security review, infrastructure, documentation, and contingency. The decision gate is evidence of a usable, self-custodial deployment experience and validated beta demand—not token-sale revenue or a forecast of value-transfer fees.

Potential outcomes:

- Establish a testable developer acquisition and activation funnel. [Assumption to validate]
- Reduce the need for developers to directly operate low-level mesh and L1 components. [Estimated]
- Produce an auditable implementation of the intended self-custodial UX and settlement-status model. [Assumption to validate]
- Revenue, subscription pricing, marketplace take rate, and provider revenue-sharing assumptions are intentionally excluded until product, legal, and token-economics decisions are finalized. [Verified — no mechanics are specified in canonical docs]

### Budget

| Category | Amount | Notes |
|---|---:|---|
| Engineering | $105,000 (Assumption to validate) | MVP portal, CLI/SDK integration, manifest workflow, observability, test coverage |
| Product design and research | $18,000 (Assumption to validate) | User interviews, workflow design, usability testing |
| Infrastructure | $12,000 (Assumption to validate) | Test environments, logging, monitoring, staging, documentation hosting |
| Security and smart-contract review | $25,000 (Assumption to validate) | Scope depends on the integration and whether any settlement-contract changes are proposed |
| Documentation and developer relations | $8,000 (Assumption to validate) | Reference docs, tutorials, beta onboarding |
| Contingency | $12,000 (Assumption to validate) | Technical and integration unknowns |
| **Total** | **$180,000 (Assumption to validate)** | Not a vendor quote; replace with staffing plan and vendor proposals before approval |

### Headcount

| Role | FTE | Duration |
|---|---:|---|
| Product manager / product lead | 0.5 FTE (Assumption to validate) | 6 months (Assumption to validate) |
| Full-stack / platform engineer | 2.0 FTE (Assumption to validate) | 6 months (Assumption to validate) |
| Developer-experience engineer | 1.0 FTE (Assumption to validate) | 6 months (Assumption to validate) |
| Product designer / researcher | 0.5 FTE (Assumption to validate) | 4 months (Assumption to validate) |
| Security / protocol reviewer | 0.25 FTE (Assumption to validate) | 6 months (Assumption to validate) |
| Legal and compliance counsel | External, scoped (Assumption to validate) | As needed before public beta and any live-value launch |

## 9. Delivery Plan

| Phase | Target timeframe | Key milestone | Deliverable |
|---|---|---|---|
| Discovery / architecture gate | Q3 2026 (Assumption to validate) | User interviews; canonical architecture review; wallet/key and settlement-control decision; legal review of product flows | Product requirements, UX flows, event taxonomy, explicit non-custodial constraints |
| MVP / internal alpha | Q4 2026 (Assumption to validate) | Documentation site; wallet-connect prototype; manifest validation; testnet container deployment; status/log views | Internal AUTHEO.dev portal, CLI/SDK alpha, testnet demo |
| Public beta | Q1 2027 (Assumption to validate) | External developer onboarding; provider discovery; workload tracking; settlement-status display; security testing | Gated public testnet beta |
| General availability decision | Q2 2027 (Assumption to validate) | Beta metrics reviewed; production readiness, security, legal, and support gates approved | Go/no-go decision and, if approved, production launch plan |

## 10. Dependencies & Prerequisites

| Dependency | Type | Status | Owner |
|---|---|---|---|
| Autheo L1 testnet, accounts, transaction interfaces, and explorer | Technical | Not started / roadmap dependency (Verified) | L1 / protocol team |
| Mesh multi-node test environment and basic container execution | Technical | Not started / roadmap dependency (Verified) | Mesh team |
| Marketplace provider registration, matching, and simulated settlement | Technical | Not started / roadmap dependency (Verified) | Marketplace team |
| Written wallet/key-custody model and transaction-authority model | Technical / legal | Not defined (Verified documentation gap) | Product, protocol, security, counsel |
| Settlement and escrow contract specification, including upgrade and dispute authority | Technical / legal | Not defined (Verified documentation gap) | Protocol, marketplace, counsel |
| FinCEN/MSB and state-law analysis for the released workflow | Regulatory | In progress / not finalized (Verified) | Outside counsel |
| Privacy, terms, support, incident-response, and sanctions-screening design | Organizational / regulatory | Not started (Assumption to validate) | Legal, compliance, operations |

## 11. Risks

| Risk | Category | Likelihood (1–5) | Impact (1–5) | Mitigation |
|---|---|---:|---:|---|
| Marketplace/L1 settlement flow creates custody or money-transmission exposure | Regulatory | 3 (Assumption to validate) | 5 (Assumption to validate) | Require counsel review; retain exclusive user key control; prohibit hosted wallets, fiat conversion, omnibus balances, and company-controlled escrow unless separately approved. |
| Escrow, dispute, upgrade, or emergency controls allow practical redirection of user value | Technical / regulatory | 3 (Assumption to validate) | 5 (Assumption to validate) | Publish control matrix; minimize privileged roles; subject contract design and governance controls to independent review; clearly disclose actual authority. |
| L1, mesh, and marketplace dependencies are not ready on the planned schedule | Technical | 4 (Assumption to validate) | 4 (Assumption to validate) | Gate AUTHEO.dev milestones on testnet interfaces; use simulated settlement only where clearly labeled; do not represent planned services as live. |
| Developers cannot understand the decentralized operating model | Market / usability | 3 (Assumption to validate) | 4 (Assumption to validate) | Interview users, test onboarding, expose clear status states, and publish practical tutorials. |
| Security weakness in portal, SDK, wallet integration, or supply chain | Security | 3 (Assumption to validate) | 5 (Assumption to validate) | Threat model, code review, dependency controls, testnet-first rollout, no platform custody of private keys, and independent security assessment. |
| Competitors provide sufficient developer convenience before Autheo ecosystem readiness | Market / competition | 3 (Assumption to validate) | 3 (Assumption to validate) | Focus on the validated workflow and differentiated provider-marketplace integration; avoid unsupported parity claims. |

## 12. Alternatives Considered

| Alternative | Why not chosen |
|---|---|
| Do nothing | Leaves users to interact with lower-level components and does not test whether the documented marketplace can be consumed by developers. [Estimated] |
| Build only protocol and defer developer surface | Preserves short-term engineering focus but delays customer learning, beta validation, and feedback on the marketplace workflow. [Estimated] |
| Use a third-party hosted deployment portal | May accelerate an interface but can create incompatible identity, custody, security, data, and settlement assumptions. [Assumption to validate] |
| Build a hosted wallet or fiat-payment layer first | Not chosen for this business case because it materially expands custody, payment, and regulatory scope. [Recommended architectural constraint] |
| Apply budget solely to additional mesh capacity | May increase supply but does not solve discovery, workload onboarding, developer workflow, or demand validation. [Estimated] |

## 13. Decision Requested

**Approval requested:** **$180,000 (Assumption to validate)** | **4.25 internal FTE-equivalents plus scoped external counsel (Assumption to validate)** | **six-month MVP/beta program (Assumption to validate)**.

**If approved:** The product lead will complete the discovery and architecture gate, including a signed wallet/key/settlement-control matrix, user research plan, MVP requirements, and counsel-reviewed non-custodial product constraints before any public-beta release.

**If declined:** Continue protocol and mesh development without an AUTHEO.dev launch commitment; revisit after L1/marketplace readiness, validated customer research, and a defined settlement-control model are available.

## Source Notes

1. `FINAL DOCS/AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md` (Version 1.0, July 2026).
2. `FINAL DOCS/AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md`.
3. `FINAL DOCS/COMMODITY-MARKETPLACE.md`.
4. `FINAL DOCS/MESH-COMPUTE.md`.
5. `FINAL DOCS/L1-ARCHITECTURE.md`.
6. `FINAL DOCS/IMPLEMENTATION-ROADMAP.md`.
7. `FINAL DOCS/SECURITY-ARCHITECTURE-DEEP-DIVE.md`.

Before budget approval, replace material assumptions with vendor quotes, a staffing-cost model, customer-research results, testnet performance evidence, and legal/security sign-off.

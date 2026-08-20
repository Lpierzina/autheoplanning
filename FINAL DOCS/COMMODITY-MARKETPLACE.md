# Autheo Commodity Marketplace — Architecture Reference

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [L1 Architecture](./L1-ARCHITECTURE.md) · [Mesh Compute](./MESH-COMPUTE.md)

---

## Overview

The Autheo Marketplace is the coordination layer between compute buyers and infrastructure providers. It does not own hardware. It matches supply and demand, schedules workloads, enforces service-level policies, handles pricing, manages billing, and writes payment instructions to the L1 for settlement.

The marketplace is the operational bridge between the L1 (which sets economic rules) and the mesh (which executes workloads). It reads from both, writes to both, and runs as a decentralized service rather than a centralized SaaS product.

### Scope and System Boundary

This document covers commercial coordination: admission policy, matching, metering, billing, reputation, payment instructions, and service-level enforcement. It does not replace the routing or execution references. Once a workload is placed, the mesh owns data-plane behavior and the L1 owns final settlement.

### Marketplace Control Surface

| Function | Primary responsibility | Downstream dependency |
|---|---|---|
| Admission | Validate budget, identity, policy, and workload requirements | L1 identity and policy state |
| Matching | Select eligible providers and regions | Mesh capacity and routing state |
| Metering | Collect trustworthy usage and completion evidence | Mesh execution telemetry |
| Settlement instruction | Submit claims, escrows, releases, or penalties | L1 transaction execution |
| Reputation | Update provider standing from verifiable outcomes | L1-anchored history and marketplace evidence |

---

## 1. Market Model

Compute in the Autheo ecosystem functions as a commodity. Providers list resources. Buyers submit workload requirements with price constraints. The marketplace matches them.

This is meaningfully different from cloud computing, where prices are set unilaterally by the provider and capacity is available only in standardized forms from a small number of vendors.

The Autheo market is:

**Open.** Any qualifying node operator can list capacity. Any buyer can request compute.

**Competitive.** Providers compete on price, location, hardware specification, and reputation. Buyers benefit from this competition.

**Verified.** Provider reputation is built from on-chain execution records. Claims about hardware can be attested. Reputation scores are transparent and not held in a mutable database controlled by the marketplace operator.

**Settled on-chain.** Payments for completed workloads are settled on the L1 using $THEO. The marketplace does not hold funds in a custodial float between buyer and provider.

---

## 2. Participants

### Buyers

Buyers are developers, enterprises, or automated systems that need compute capacity. They interact with the marketplace through the CLI, SDK, or API, submit workload specifications, and are billed based on actual resource consumption.

### Providers

Providers are node operators who register their infrastructure with the marketplace, advertise capacity, and accept workloads in exchange for $THEO payments.

### The Marketplace Operator (Protocol Layer)

The marketplace coordination protocol is the system itself. In the decentralized model, multiple marketplace operators can coexist, competing on matching efficiency, UI quality, and service-level offerings. The L1 enforces the economic rules that apply regardless of which marketplace coordinates a given transaction.

---

## 3. Resource Taxonomy

Providers advertise resources in structured units:

| Resource | Unit | Example |
|---|---|---|
| CPU | vCPU cores | 4 vCPU |
| Memory | GiB | 8 GiB RAM |
| Storage | GiB, IOPS | 100 GiB NVMe |
| GPU | Model + VRAM | RTX 4090 / 24 GB |
| Network | Mbps, region | 1 Gbps / US-East |
| Bandwidth | GB/month | 10 TB |

Workload requests specify minimums and optionally preferences (e.g., "prefer nodes with NVMe storage" or "require GPU with at least 16 GB VRAM").

---

## 4. Workload Scheduling

The scheduler's job is to place workloads on nodes that meet the workload's requirements at a price acceptable to the buyer.

The scheduling pipeline:

```
Buyer submits workload spec
          ↓
Marketplace validates spec
          ↓
Query available capacity (from mesh node registry)
          ↓
Filter by requirements (CPU, GPU, region, etc.)
          ↓
Rank by price + reputation + locality
          ↓
Select node(s)
          ↓
Dispatch workload to selected node(s)
          ↓
Monitor execution
          ↓
Collect completion record
          ↓
Submit payment claim to L1
```

For long-running workloads, the marketplace monitors node health and can reschedule to a new node if the selected node fails or becomes unresponsive.

---

## 5. Pricing Model

### Provider Pricing

Providers publish prices per resource unit per time period. A provider might list:

```
CPU:     0.002 $THEO / vCPU / hour
Memory:  0.0005 $THEO / GiB / hour
Storage: 0.0001 $THEO / GiB / month
GPU:     0.05 $THEO / GPU-hour (RTX 4090)
```

These prices are published to the mesh registry and discoverable by the marketplace.

### Buyer Billing

Buyers are billed for actual consumption — not pre-allocated capacity. A workload that runs for 3.7 hours pays for 3.7 hours. Billing is metered at the node and reported to the marketplace for settlement.

### Market Dynamics

Multiple providers can bid for the same workload. Buyers can set maximum price limits. The marketplace optimizer selects the lowest-cost provider that meets all requirements and acceptable reputation thresholds.

This creates price competition among providers. Commoditized capacity (standard VMs) will approach marginal cost over time. Specialized capacity (high-end GPUs, specific geographic locations, attested hardware) can command premiums.

---

## 6. Economics: Why Mesh Pricing Undercuts Cloud

The cloud cost model includes:

```
Real estate + power + cooling
+ Data center construction and maintenance
+ Hardware purchase and depreciation
+ Operations staff
+ Networking infrastructure
+ Profit margin
```

Mesh providers have fundamentally different economics. A provider contributing an already-purchased GPU workstation to the mesh has:

```
Hardware already paid for
Power already connected
No additional real estate cost
Near-zero marginal cost per hour of contribution
```

The result is that mesh compute can be priced significantly below cloud equivalents while still being profitable for providers. A provider selling idle GPU time at $0.05/GPU-hour earns revenue from capacity they would otherwise not monetize at all.

For buyers, this translates directly to lower infrastructure costs — particularly for GPU-heavy AI workloads where cloud pricing is most aggressive.

---

## 7. Reputation System

Provider reputation is the mechanism that enables trust in an open market where buyers cannot physically inspect the hardware they're using.

Reputation is built from verified execution records anchored to the L1:

- **Task completion rate:** What percentage of accepted workloads complete successfully?
- **Uptime:** How reliably is the node available when advertised?
- **Latency performance:** Do workloads complete within declared SLO bounds?
- **Attestation status:** Has the node's hardware been attested? Is the attestation current?
- **Slashing history:** Has the node ever been penalized for malicious behavior?

These signals are combined into a composite reputation score. Buyers can filter by minimum reputation threshold. Providers with higher reputation can charge modest premiums for the same hardware class.

New providers start with limited reputation and must earn trust through consistent performance before competing for premium workloads.

---

## 8. Slashing and Penalty Conditions

Providers that accept a workload and fail to execute it honestly are subject to slashing — a reduction in their staked $THEO balance.

Slash conditions include:
- Accepting a workload, collecting payment, and not executing it
- Providing false hardware attestations
- Colluding with buyers to falsify execution records
- Sustained downtime after accepting a workload

Slashing amounts and conditions are defined by L1 governance and applied on-chain. This makes the penalty transparent and not subject to discretionary decisions by the marketplace operator.

---

## 9. Payment Settlement

The payment flow:

```
Provider reports workload completion
          ↓
Marketplace validates completion record
          ↓
Marketplace submits payment claim to L1
          ↓
L1 executes $THEO transfer (buyer → provider)
          ↓
Reputation record updated on-chain
```

The marketplace does not hold funds between buyer and provider. Funds are either held in an on-chain escrow or transferred immediately upon settlement, depending on the payment model implemented by the marketplace contract.

---

## 10. Service Tiers and SLOs

The marketplace supports tiered service levels:

**Best effort:** Workload is scheduled on any available capacity that meets minimum requirements. Price is lowest. No uptime guarantee. Suitable for batch jobs, fault-tolerant services, and development workloads.

**Standard:** Workload is scheduled on nodes with a minimum reputation threshold. Basic uptime guarantee. Price is moderate.

**Premium:** Workload is scheduled on nodes with high reputation, hardware attestation, and committed availability. Price includes a premium for reliability. Suitable for production services.

**Private:** Workload runs exclusively on buyer-specified nodes (e.g., enterprise hardware the buyer owns and has registered). No external capacity used.

---

## 11. Enterprise Use Case

The marketplace enables a model that cloud providers do not offer: organizations can register their own hardware as marketplace nodes, use it for internal workloads, and allow the marketplace to schedule external buyers' workloads on it during periods of low internal demand.

This transforms owned infrastructure from a fixed cost into a dynamic asset. An enterprise GPU cluster that runs at 40% average utilization for AI workloads can earn $THEO on the remaining 60% when made available to the marketplace.

---

## 12. Market Opportunity

The addressable market for commodity compute includes:

- **Gaming server hosting:** Estimated $5–$30/month per server instance. Mesh nodes can undercut managed hosting providers significantly.
- **AI inference:** GPU compute is priced at $2–$8/hour on major clouds. Mesh GPU nodes can compete at $0.03–$0.10/GPU-hour from idle hardware.
- **Enterprise edge compute:** Large organizations with branch locations need local compute. The mesh provides a software-defined edge deployment model.
- **Developer workloads:** Hobby projects, small teams, and startups are highly price-sensitive. Low-cost mesh compute captures this segment.

---

## 13. Operational Guidance

### Scheduling Discipline

A production marketplace should rank candidate supply using at least five classes of input: hardware fit, locality, current path quality, provider reputation, and commercial fit. Price matters, but the cheapest node is not the correct node if it violates latency, residency, or integrity requirements.

### Metering and Evidence Collection

Usage records should be treated as settlement evidence, not best-effort analytics. CPU time, GPU occupancy, storage consumption, egress, and completion status should be signed or otherwise attributable to a provider identity and correlated with marketplace dispatch records before settlement instructions are issued.

### Service Tier Enforcement

Premium tiers are only credible if the marketplace can actively enforce them. That means reserve capacity policies, drain-and-migrate procedures, faster health-check intervals, and stricter attestation or stake thresholds for providers serving high-assurance workloads.

---

## 14. Failure Modes and Market Safeguards

### Provider Disappearance

If a provider disappears after accepting work, the marketplace should freeze payment release, preserve execution evidence, and trigger retry or migration based on workload policy. Reputation impact and potential slashing should be driven by provable behavior rather than operator discretion.

### Inaccurate Metering

Metering disputes are inevitable in an open market. The platform should assume disagreements will occur and maintain durable dispatch records, signed usage reports, and clearly defined buyer/provider dispute windows. The L1 should settle only against evidence that survives audit.

### Capacity Shock

Supply can tighten rapidly during regional outages or GPU demand spikes. The marketplace should degrade by tightening admission, widening placement radius, and raising reserve thresholds instead of silently overcommitting providers.

### Control-Plane Outage

A marketplace outage should stop new placements before it compromises pricing, policy, or billing correctness. In-flight workloads should continue on the mesh, and post-recovery reconciliation should rebuild state from dispatch logs, provider telemetry, and L1 settlement history.

---

## Source Files

This document consolidates:
- `docs/marketplace/01-overview.md`, `02-exchange.md`, `03-reputation.md`
- `docs/marketplace/compute-marketplace.md`
- `docs/market.md`
- `docs/why-autheo.md`
- `docs/enterprise/enterprise-hyperscalers.md`

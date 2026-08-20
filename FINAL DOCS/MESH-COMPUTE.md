# Autheo Mesh — Distributed Compute Reference

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [L1 Architecture](./L1-ARCHITECTURE.md) · [Security](./SECURITY-AND-QUANTUM-RESILIENCE.md) · [Marketplace](./COMMODITY-MARKETPLACE.md)

---

## Overview

The Autheo Mesh is the execution layer of the ecosystem. It is a peer-to-peer network of independently operated compute nodes that can accept workloads, execute them in hardware-isolated environments, and report results back to the marketplace and L1.

The mesh spans data centers, edge locations, GPU clusters, home servers, and cloud VMs. Any machine capable of running the node software and providing the required isolation primitives can participate. The network discovers and coordinates these resources without a central registry or cluster controller.

Three technologies define the mesh's character:
- **Iroh/QUIC** for direct, encrypted peer-to-peer connectivity
- **Firecracker microVMs** for hardware-isolated workload execution
- **CRDTs** for distributed state synchronization without a central database

---

## 1. What the Mesh Is Not

The mesh is not a blockchain. Workloads do not execute as smart contracts. Consensus is not required to run an application. The mesh is a distributed compute fabric — closer in concept to a self-organizing container cluster than to a chain.

The L1 provides trust and settlement. The mesh provides execution. These are distinct responsibilities.

---

## 2. Peer Architecture

The fundamental unit of the mesh is the **peer** — a node running the Autheo daemon that has registered with the network, published its capabilities, and is ready to accept workloads.

A peer carries:
- A cryptographic identity (public/private keypair)
- A capability advertisement (CPU, memory, GPU, storage, network)
- A reputation score (anchored to L1)
- An active connection to neighboring peers
- One or more running microVM execution environments

Peers form a loosely connected graph. No peer needs to know the complete topology of the network — they discover neighbors dynamically through the DHT and maintain connections to a managed set of peers.

```
                    MESH TOPOLOGY (partial view)

    Peer A ──── Peer B ──── Peer E
      │           │           │
    Peer C ──── Peer D     Peer F
      │
    Edge Node
```

---

## 3. Connectivity Stack

Mesh connectivity operates in layers. Each peer selects the most efficient available path to reach a counterpart.

```
┌─────────────────────────────────┐
│          APPLICATIONS           │
│   APIs · Functions · Storage    │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│         MESH PROTOCOLS          │
│  CRDTs · RPC · Streaming        │
│  Identity · Sync · Messaging    │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│       SECURE CONNECTIVITY       │
│  TLS 1.3 + ML-KEM (PQC)        │
│  Endpoint authentication        │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│          IROH / P2P             │
│  Endpoint IDs · QUIC            │
│  NAT traversal · Multipath      │
└──────┬──────────────────┬───────┘
       │                  │
┌──────▼──────┐  ┌────────▼──────┐
│ LOCAL MESH  │  │  INTERNET P2P │
│ mDNS · LAN  │  │  QUIC/NAT     │
│ Bluetooth   │  │  Hole punch   │
└─────────────┘  └───────┬───────┘
                         │
                  ┌──────▼──────┐
                  │  FALLBACK   │
                  │ Iroh Relay  │
                  └─────────────┘
```

**Local discovery** uses mDNS and Bluetooth for nodes on the same network segment. This is the lowest-latency path and avoids the public internet entirely for intra-site workloads.

**Direct QUIC** is preferred for internet connectivity. QUIC provides multiplexed streams, built-in TLS 1.3, and connection migration (useful for mobile and intermittently connected nodes).

**NAT traversal** handles the common case where nodes sit behind home or enterprise routers. Iroh implements hole punching and address exchange to establish direct connections even when both peers are behind NAT.

**Relay fallback** is used only when direct connectivity cannot be established. Relay traffic remains end-to-end encrypted; the relay sees ciphertext only.

### Decentralized Address Discovery

Peers publish their addresses using Pkarr — a system that stores signed DNS records through the BitTorrent Mainline DHT. This means peer addresses can be discovered without a centralized DNS server or registry. Address records are signed with the peer's private key, so a tampered record is immediately detectable.

---

## 4. Workload Execution

### Isolation Model

Every tenant workload runs inside a Firecracker microVM. Firecracker is a VMM (Virtual Machine Monitor) built by AWS for multi-tenant serverless workloads. It uses Linux KVM for hardware virtualization, provides each workload with a separate guest kernel, and exposes minimal virtual hardware surface.

The isolation hierarchy:

```
┌────────────────────────────────┐
│     APPLICATION / WORKLOAD     │
└───────────────┬────────────────┘
                ↓
┌────────────────────────────────┐
│    FIRECRACKER MICROVM         │
│  Guest kernel · vCPU · Memory  │
└───────────────┬────────────────┘
                ↓
┌────────────────────────────────┐
│     LINUX HOST · KVM           │
│  cgroups · namespaces          │
└───────────────┬────────────────┘
                ↓
┌────────────────────────────────┐
│       PHYSICAL HARDWARE        │
│    CPU · RAM · NVMe · NIC      │
└────────────────────────────────┘
```

A workload cannot observe or affect co-tenant workloads on the same physical host. The isolation is hardware-enforced, not software-enforced.

### Fluid Compute — Warm Execution Pools

Cold starts are the dominant cost in traditional serverless platforms. Each new invocation potentially requires: allocating resources, starting a VM, loading a runtime, loading application code, and loading dependencies — before the workload's actual code begins executing.

Autheo addresses this through **Fluid Compute**: each node maintains a pool of pre-warmed microVMs ready to accept workloads immediately. When a workload request arrives:

```
Request arrives
      ↓
Is a warm VM available for this workload type?
      ├── YES → Dispatch immediately
      └── NO  → Start VM (cold start path)
```

Warm VMs are reused across invocations. The runtime and application state from a prior execution remain loaded. Subsequent executions of the same workload skip initialization entirely.

The scheduler on each node manages pool size dynamically based on demand patterns, available memory, and node resource constraints.

### Supported Workload Types

Nodes can advertise support for:
- Containerized services (long-running, stateful or stateless)
- Serverless functions (ephemeral, event-triggered)
- AI inference (GPU-resident models)
- Build execution (CI/CD pipelines)
- Storage volumes
- Edge API deployments
- Batch compute

The workload type determines scheduling constraints (e.g., GPU requirement, storage I/O requirements, network bandwidth) that the marketplace uses when matching workloads to nodes.

---

## 5. Distributed State — CRDTs

The mesh needs to synchronize state across nodes without a central database: workload status, resource availability, routing tables, and configuration. This is done using CRDTs — Conflict-free Replicated Data Types.

CRDTs are data structures that can be updated independently on multiple nodes and merged deterministically without requiring coordination. A node can update its own state while offline or partitioned, and when it reconnects, its state merges correctly with the rest of the network.

This is the key property that allows the mesh to operate across intermittently connected nodes, edge locations, and geographically distributed infrastructure without a central coordination server.

---

## 6. Mesh Hive — Compute Fabric Model

The execution model is inspired by Vercel's Hive build infrastructure but rebuilt for a peer-to-peer network.

| Hive Concept | Mesh Equivalent |
|---|---|
| Hive cluster | Mesh locality / compute fabric |
| Box (compute host) | Peer node |
| Cell (isolated workload) | Firecracker microVM |
| Control plane | Distributed coordination (CRDT + marketplace) |
| Build cache | Distributed content-addressed cache |
| Autoscaling | Capacity discovery across peers |

The five-layer model:

```
┌─────────────────────────────────────────────┐
│              APPLICATION LAYER              │
│  Functions · Containers · AI · Services     │
└─────────────────────┬───────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│              EXECUTION LAYER                │
│       Cells · Firecracker · VMs             │
└─────────────────────┬───────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│               PEER LAYER                   │
│   Peer Daemon · Resource Manager · Cache   │
└─────────────────────┬───────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│               MESH LAYER                   │
│  P2P Discovery · QUIC · DHT · NAT          │
└─────────────────────┬───────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            HARDWARE / NETWORK               │
│  Servers · GPUs · Edge · Bare Metal         │
└─────────────────────────────────────────────┘
```

---

## 7. Node Types

**Data center node:** High-core-count servers with substantial RAM and NVMe storage. Suitable for demanding workloads, high-concurrency services, and database hosting.

**Edge node:** Lower-power machines deployed at network edges — office gateways, factory endpoints, retail sites. Optimized for low-latency local execution.

**GPU node:** Machines with dedicated GPU capacity. Required for AI inference, training, and GPU-accelerated compute workloads.

**Home/prosumer node:** Desktop machines, NAS servers, or small servers contributing spare capacity. Limited in performance but large in aggregate and geographically distributed.

**Cloud-hosted node:** Cloud VMs operated by providers or individuals contributing capacity to the mesh. These are standard nodes from the mesh's perspective.

---

## 8. Relationship to Marketplace and L1

The mesh executes workloads scheduled by the marketplace. It does not make economic decisions — it does not set prices, select tenants, or control payment. Those are marketplace responsibilities.

The mesh reports execution results back to the marketplace, which settles payments on the L1. Node reputation is anchored to the L1 based on these execution records.

From the L1's perspective, the mesh is a set of registered nodes with on-chain identity, reputation, and staking relationship. From the marketplace's perspective, the mesh is a set of capacity providers with real-time availability data.

---

## Source Files

This document consolidates:
- `docs/mesh/01-overview.md` through `07-crdt.md`
- `docs/mesh/secure-mesh-stack.md`
- `docs/hive-mesh.md`
- `docs/fluid-compute.md`
- `docs/vm/firecracker-microvms.md`
- `docs/vm/hypervisors.md`
- `docs/connectivity-paradigm.md`
- `docs/pkarr.md`
- `tools/mesh/mesh0.1.md`
- `tools/iroh.md`
- `docs/begin-here/autheo.dev-isnt-blockchain.md`
- `docs/begin-here/compute.md`

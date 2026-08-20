# Autheo Routing and Discovery Architecture

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [Mesh Compute](./MESH-COMPUTE.md) · [Security Deep Dive](./SECURITY-ARCHITECTURE-DEEP-DIVE.md) · [L1 Architecture](./L1-ARCHITECTURE.md)

---

## Table of Contents

1. [Overview and Design Principles](#1-overview-and-design-principles)
2. [Node Discovery Mechanisms](#2-node-discovery-mechanisms)
3. [Peer Selection and Trust Scoring](#3-peer-selection-and-trust-scoring)
4. [Routing Layers and Path Selection](#4-routing-layers-and-path-selection)
5. [Service Discovery for Compute and Storage](#5-service-discovery-for-compute-and-storage)
6. [Failure Handling and Resilience](#6-failure-handling-and-resilience)
7. [Anti-Eclipse, Anti-Sybil, and Route-Poisoning Protections](#7-anti-eclipse-anti-sybil-and-route-poisoning-protections)
8. [Latency, Cost, and Security Tradeoff Guidance](#8-latency-cost-and-security-tradeoff-guidance)
9. [How L1, Mesh, and Marketplace Interact End-to-End](#9-how-l1-mesh-and-marketplace-interact-end-to-end)
10. [Operational Considerations](#10-operational-considerations)

---

## 1. Overview and Design Principles

### What This Document Covers

This document describes how nodes in the Autheo ecosystem find each other, how traffic is routed between them, and how compute and storage services are discovered and selected by buyers. It covers the full stack from initial node bootstrapping through to workload delivery and result retrieval.

### Discovery vs. Routing

These are distinct operations that use overlapping but separate systems:

**Discovery** answers: "What peers and services exist in the network, and where are they reachable?"

**Routing** answers: "Given a known destination, what is the best path to send traffic there right now?"

Discovery populates a local peer table. Routing uses that peer table (plus real-time path quality measurements) to select the path a given connection or data transfer will take.

### Design Principles

**No single point of failure.** Every discovery and routing mechanism has a fallback. No single registry, relay, or DNS server can take down the network's ability to route.

**Cryptographic verification for all path information.** Routing advertisements, peer address records, and service announcements are signed by the originating node's identity key. Unsigned or unverifiable information is discarded before it influences routing decisions.

**Location-awareness without centralization.** The routing layer is aware of geographic and latency topology, enabling low-latency path selection, without requiring a central traffic manager or region controller.

**Decentralized but not unstructured.** The DHT (Distributed Hash Table) provides efficient key-value lookup across the peer set without requiring every peer to store a complete routing table. The L1 provides a trusted fallback for bootstrapping and peer verification.

---

## 2. Node Discovery Mechanisms

### 2.1 Discovery Stack Overview

Node discovery operates at three layers, each with different scope and latency characteristics:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: L1-Anchored Discovery                         │
│  Source of truth for staked, registered nodes           │
│  Latency: seconds (blockchain query)                    │
│  Coverage: all registered participants                  │
└─────────────────────────┬───────────────────────────────┘
                          │ fallback / authoritative
┌─────────────────────────▼───────────────────────────────┐
│  LAYER 2: Pkarr / BitTorrent Mainline DHT               │
│  Decentralized address resolution by Endpoint ID        │
│  Latency: 100ms–2s (DHT lookup)                         │
│  Coverage: any node that has published to DHT           │
└─────────────────────────┬───────────────────────────────┘
                          │ primary / fast path
┌─────────────────────────▼───────────────────────────────┐
│  LAYER 1: Local Network Discovery                        │
│  mDNS (LAN), Bluetooth (personal area network)          │
│  Latency: < 50ms (local broadcast)                      │
│  Coverage: same network segment only                    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Local Network Discovery (mDNS and Bluetooth)

**mDNS (Multicast DNS):**
On startup, a node broadcasts a mDNS service announcement on the local network segment:

```
Service type: _autheo-node._udp.local
Records:
  - TXT: endpoint_id=<base32-pubkey>
  - TXT: capabilities=compute,storage,gpu
  - TXT: version=<daemon-version>
  - SRV: <hostname>:<port>
  - A/AAAA: <ip-address>
```

Any other Autheo node on the same LAN receives this broadcast and adds the peer to its local discovery table. This requires no external infrastructure and completes before the node has established any internet connectivity.

**Use cases for local discovery:**
- Data center deployments: many provider nodes on the same network segment discover each other without DHT round-trips.
- Edge compute clusters: intra-cluster routing uses local discovery, avoiding internet latency entirely.
- Development and testing: developer workstations running local nodes discover each other automatically.

**Security note for local discovery:** mDNS announcements are not authenticated at the transport layer. Any host on the LAN can broadcast a fake mDNS record. Before using a locally discovered peer for workload execution, standard authentication applies: the QUIC/TLS handshake verifies the peer's Endpoint ID matches the public key, and the public key must match a registered, reputable identity (optionally verified against L1). A local network position does not grant trust.

**Bluetooth discovery:**
For personal edge nodes and mobile participants, Bluetooth Low Energy (BLE) advertisement is used similarly to mDNS. Advertising nodes broadcast their Endpoint ID over BLE. Nearby Autheo-capable devices can discover and connect. BLE discovery is optional and is disabled by default on infrastructure nodes.

### 2.3 DHT-Based Discovery — Pkarr and BitTorrent Mainline DHT

**Pkarr (Public Key Addressable Resource Records):**

Pkarr is the primary decentralized address resolution system. It allows any node to be found by its Endpoint ID (public key) without a central DNS server.

How it works:
1. A node's Endpoint ID is a base32-encoded Ed25519 public key.
2. The node creates a signed DNS-like resource record:

```
Record structure:
  key: SHA256(endpoint_id) → maps to a position in the BitTorrent DHT key space
  value: {
    "id": "<endpoint-id>",
    "addrs": [
      "192.0.2.1:4321",           // IPv4 direct
      "[2001:db8::1]:4321",       // IPv6 direct
      "relay.example.com:3478"    // relay hint
    ],
    "capabilities": ["compute", "gpu"],
    "relay": "<relay-endpoint-id>",
    "seq": 42,                    // monotonic sequence number
    "sig": "<Ed25519 signature of all above fields>"
  }
```

3. The signed record is published to the BitTorrent Mainline DHT (a global, existing, decentralized key-value store with millions of participants and 20+ years of operational history).

4. Any peer wishing to connect to the node with a known Endpoint ID queries the DHT for that key, retrieves the record, verifies the signature, and obtains the current addresses.

**Key properties:**
- **Self-sovereign:** no authority issues or revokes Endpoint IDs. The keypair owner controls the record.
- **Tamper-evident:** a signed record with a forged address fails verification. Attackers cannot redirect traffic by publishing false records.
- **Monotonic sequence numbers:** a higher `seq` number supersedes a lower one. Stale or replayed records are rejected.
- **Update propagation:** address updates (e.g., new IP after DHCP renewal) propagate across the DHT within minutes. Time-sensitive scenarios should tolerate brief connection interruptions during propagation.
- **Leverages existing infrastructure:** the BitTorrent DHT is operated by millions of clients globally. Autheo does not need to operate its own DHT infrastructure to have global coverage.

**DHT lookup performance:**
- Typical lookup: 3–5 DHT hops, 200–800ms end-to-end.
- Cached lookups: under 50ms (addresses are cached locally for TTL duration).
- Worst case (cold lookup, network congestion): 2–5 seconds.
- For latency-sensitive workloads: pre-resolve addresses before the job is dispatched.

### 2.4 L1-Anchored Discovery — Registered Node Registry

The Autheo L1 maintains a registry of nodes that have registered on-chain:

```
L1 Registry Entry (per node):
{
  "endpoint_id": "<base32-pubkey>",
  "pubkey_fingerprint": "<SHA256 of pubkey>",
  "stake": 10000,              // $THEO staked
  "capabilities": ["compute", "storage"],
  "attestation_hash": "<SHA256 of latest attestation>",
  "reputation_score": 9240,
  "registered_at": <block-height>,
  "last_seen_block": <block-height>,
  "status": "active"           // active | suspended | revoked
}
```

**When to use L1-anchored discovery:**
- Bootstrapping a brand-new node with no existing peer connections.
- Verifying that a peer discovered through DHT or mDNS is a registered, staked participant.
- Eclipse recovery: if a node believes it may be eclipsed, it can query the L1 for a fresh peer list independent of its current DHT connections.
- High-stakes workloads: buyers may require that providers are L1-registered with minimum stake and reputation.

**L1 query latency:** Reading from an Autheo L1 full node is fast (sub-100ms for a local node, 200–500ms for a remote RPC node). Writing to the L1 (e.g., updating a registration) takes one block finality (~6 seconds).

**L1 as fallback authority:** The L1 cannot be Sybil-attacked without significant stake expenditure. If the DHT layer is under attack, L1 discovery provides a trusted fallback. This separation of layers means an attacker who compromises the DHT layer does not automatically compromise peer discovery.

### 2.5 Bootstrap Process

When a new node starts with no existing peers:

```
1. Start mDNS listener — discover any local peers
   (usually finds nothing for a brand-new deployment)

2. Query L1 bootstrap registry:
   - Read: L1.GetBootstrapPeers(min_stake=1000, min_reputation=5000, limit=20)
   - Returns a set of well-known, long-running, high-reputation nodes

3. Connect to 3–5 bootstrap peers:
   - QUIC/TLS handshake (mutual authentication)
   - Verify peer identity against L1 registry
   - Obtain DHT routing table introduction from bootstrap peer

4. Join BitTorrent Mainline DHT:
   - Bootstrap into DHT via bootstrap peers' DHT node list
   - Publish own Pkarr address record

5. Actively discover additional peers:
   - DHT random walk to populate local peer table
   - Target: 20–50 active peer connections from diverse key ranges

6. L1 registration (if not already registered):
   - Stake $THEO, submit registration transaction
   - Publish capabilities to on-chain registry
```

**Bootstrap security:** Bootstrap peers are verified against the L1 before any further trust is extended. A bootstrap peer that cannot be verified against the L1 is used only for initial DHT routing table introduction, not for workload execution or protocol messages requiring authorization.

---

## 3. Peer Selection and Trust Scoring

### 3.1 Why Peer Selection Matters

In a fully connected mesh, a node could theoretically route traffic to any destination through any intermediate peer. In practice, peer selection determines:
- **Latency:** a poorly selected path adds unnecessary hops.
- **Reliability:** a path through low-quality or misbehaving peers has worse delivery guarantees.
- **Security:** a path through compromised peers creates opportunities for traffic analysis or routing attacks.
- **Economic cost:** routing through relays or high-latency paths has higher effective cost.

Peer selection is not a one-time choice. Peers are continuously evaluated, and paths are updated as conditions change.

### 3.2 Peer Quality Dimensions

Each peer maintained in the local peer table is scored across multiple dimensions:

| Dimension | Signal | Weight |
|---|---|---|
| **Latency** | Round-trip time (measured continuously) | High |
| **Reliability** | Connection uptime over last 24h | High |
| **Reputation** | L1 on-chain reputation score | High |
| **Stake** | $THEO staked (for providers) | Medium |
| **Attestation** | Valid, recent hardware attestation | Medium (required for confidential jobs) |
| **Bandwidth** | Measured throughput on established connections | Medium |
| **Geographic diversity** | Different AS/region than existing connections | Medium (diversity requirement) |
| **Key space diversity** | Different DHT key range than existing connections | High (anti-eclipse) |
| **Version compatibility** | Running compatible protocol version | Required (binary gate) |

### 3.3 Composite Peer Score

Each peer in the table is assigned a composite score used for routing and workload dispatch decisions:

```
PeerScore = 
  (1 - normalized_latency) × W_latency
  + reliability × W_reliability
  + normalized_reputation × W_reputation
  + normalized_stake × W_stake
  + attestation_bonus × W_attestation
  + bandwidth_score × W_bandwidth

Where weights sum to 1.0 and are configurable per deployment profile.

Default weights:
  W_latency:     0.25
  W_reliability: 0.25
  W_reputation:  0.20
  W_stake:       0.10
  W_attestation: 0.10
  W_bandwidth:   0.10
```

**Diversity override:** Even if a high-scoring peer would be selected repeatedly, the peer selection algorithm applies a diversity requirement: the active peer set must contain peers from at least 3 different autonomous systems (BGP AS numbers), at least 2 geographic regions, and cover a spread of DHT key space. This is enforced even if it means selecting a slightly lower-scoring peer.

### 3.4 Reputation Inputs from L1

The L1 reputation system provides the following inputs to peer scoring:

- **Completed jobs:** Number and total value of jobs completed without dispute.
- **Dispute rate:** Percentage of jobs that resulted in a dispute or failed delivery.
- **Slashing history:** Any slashing events permanently lower the reputation score.
- **Stake age:** Older, continuously held stake is weighted more heavily (mitigates stake-and-exit manipulation).
- **Attestation history:** Nodes with a continuous, unbroken attestation record score higher than nodes with gaps.

Reputation scores are updated on-chain with each completed or disputed job settlement. Peers are responsible for querying L1 for updated scores at regular intervals (default: every 100 blocks, approximately every 10 minutes).

### 3.5 Peer Lifecycle Management

The local peer table has a maximum size (default: 500 entries). Peer lifecycle:

```
Discovered → Candidate
      ↓ (authentication success + minimum quality threshold)
Candidate → Active
      ↓ (continuous quality measurement)
Active → Degraded (if quality drops below threshold)
      ↓ (no recovery after grace period)
Degraded → Evicted
      ↓ (reputation below minimum OR revocation detected)
Active/Degraded → Blocked (for safety violations)
```

Blocked peers are refused connections for a cooling-off period (default: 1 hour for minor violations, 24 hours for suspected Sybil/eclipse behavior, permanent block for confirmed malicious activity pending L1 revocation).

---

## 4. Routing Layers and Path Selection

### 4.1 Routing Architecture Overview

Routing in the Autheo mesh does not resemble BGP or OSPF from traditional internet routing. There is no global routing table that every node must synchronize. Instead, routing is opportunistic and local:

```
┌────────────────────────────────────────────────────────────────┐
│  APPLICATION ROUTING LAYER                                      │
│  Service name → Endpoint ID resolution (Section 5)             │
│  Workload dispatch → provider selection                         │
└──────────────────────────────────┬─────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────┐
│  PEER ROUTING LAYER                                             │
│  Endpoint ID → current best path through peer graph            │
│  Local peer table + DHT forwarding for unknown destinations     │
└──────────────────────────────────┬─────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────┐
│  TRANSPORT LAYER                                                │
│  QUIC connections (direct or relay-assisted)                    │
│  Path migration on IP change or path failure                   │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Direct Path Routing

The preferred routing method is a direct QUIC connection between source and destination. This eliminates intermediate hops, minimizes latency, and removes any relay operator from the path.

**Direct path establishment:**

```
Source has destination Endpoint ID (from service discovery or job spec)
       ↓
Check local peer table: is destination a known, active peer?
  → YES: use existing QUIC connection (0-RTT if available)
  → NO: resolve via Pkarr/DHT to get current addresses
       ↓
Attempt direct QUIC connection to each resolved address:
  - Try IPv4 and IPv6 addresses in parallel
  - Include QUIC hole-punching if both peers are behind NAT
       ↓
Mutual TLS 1.3 authentication during QUIC handshake
       ↓
Direct encrypted connection established
```

**NAT traversal:** Most internet-connected nodes (home users, SMB deployments, cloud VMs behind NAT gateways) cannot accept direct inbound connections. Iroh implements coordinated hole punching:

```
Peer A (behind NAT)              Coordination Server / Relay              Peer B (behind NAT)
      │                                      │                                    │
      │── "I want to connect to Peer B" ────→│                                    │
      │                                      │←── "Peer A wants to connect" ──────│
      │←── "Peer B is at <addr>, punch now" ─│                                    │
      │                                      │──── "Punch to <Peer A addr>" ─────→│
      │── UDP to Peer B addr ───────────────────────────────────────────────────→│
      │←────────────────────────────────────────── UDP from Peer B ──────────────│
      │                                      │                                    │
      │ [Direct UDP path open; QUIC/TLS handshake proceeds directly]              │
```

Once the hole-punch succeeds, no further traffic flows through the coordination server.

### 4.3 Multi-Hop Routing Through Peer Graph

For destinations not reachable directly, routing through intermediate peers (multi-hop) is used. The mesh is not a fully connected graph — each node connects to a limited peer set. Messages to unknown destinations use DHT-style forwarding:

```
Source wants to reach Destination (Endpoint ID: D)
Source's peer table does not include D directly
       ↓
Find peer P in local table whose Endpoint ID is numerically
closest to D in the DHT key space
       ↓
Forward routing request to P:
  "Route to D; my address is Source"
       ↓
P checks its own table: closer to D than Source was
  → Found D directly → forward message; report address to Source
  → Not found → repeat: forward to P2, closer to D
       ↓
Message reaches D (or error returned after TTL exhaustion)
       ↓
Source caches the route: D is reachable through path [P, P2, ..., D]
```

Multi-hop routing is used primarily for service discovery and initial contact establishment. Once a direct or relay path is established, subsequent traffic flows on that path without multi-hop overhead.

### 4.4 Relay-Assisted Routing

When direct connectivity cannot be established (both NAT traversal and direct connection fail), the mesh falls back to relay-assisted routing through an Iroh relay.

**Relay selection:**

```
1. Source and Destination both have relay hints in their Pkarr records
   (each node lists preferred relays in their address advertisement)

2. Source queries: which relay has direct connectivity to Destination?
   Strategy: prefer relays geographically close to Destination
   
3. Source establishes QUIC connection to selected relay

4. Source sends: "relay to <Destination Endpoint ID>"
   Relay maintains a table of connected nodes and their QUIC sessions

5. Relay forwards QUIC packets between Source and Destination
   Relay sees only: QUIC UDP packets (encrypted, opaque payload)
   Relay does NOT see: TLS plaintext, application data, workload content

6. Performance: relay adds 10–80ms RTT depending on geographic placement
```

**Relay architecture:**
The Iroh relay network consists of independently operated relay nodes. The Autheo ecosystem operates a set of well-known, geographically distributed relays (in major internet exchange points and cloud regions), supplemented by community-operated relays.

Relay locations (target, launch phase):
- North America East (Virginia/New York)
- North America West (Oregon/California)
- Europe West (Amsterdam/Frankfurt)
- Europe South (London/Paris)
- Asia Pacific (Singapore/Tokyo)
- South America (São Paulo)
- Africa (Johannesburg/Lagos)

Multiple relays in each region provide redundancy. If the primary relay in a region is unavailable, nodes automatically route through the secondary relay or a relay in an adjacent region.

### 4.5 Path Selection Algorithm

For a given destination, the path selection algorithm evaluates all available paths and selects the best one:

```
Path candidates for destination D:
  1. Direct connection (if established or establishable)
  2. Relay-assisted via relay R1 (if both nodes registered to R1)
  3. Relay-assisted via relay R2 (alternative relay)
  4. Multi-hop through peer P1 (if D is in P1's peer table)
  
Evaluation metrics per candidate:
  - Estimated latency (measured RTT for established paths, estimated for new)
  - Reliability score (historical loss rate)
  - Security properties (direct > relay > multi-hop for traffic analysis risk)
  - Cost (relay-assisted paths may have per-byte or per-connection cost)
  - Encryption integrity (all paths are end-to-end encrypted; no differentiation)

Selection:
  score(path) = (1/latency) × w_l + reliability × w_r - cost × w_c + security × w_s
  
  select path with highest score
  
  Tiebreaker: prefer direct > relay > multi-hop
```

**Real-time path switching:**

QUIC's connection migration support allows paths to switch mid-session without connection teardown. If a direct path degrades (high loss rate, increased latency), the connection can migrate to a relay path transparently. This is handled at the QUIC layer — the application layer sees no interruption.

---

## 5. Service Discovery for Compute and Storage

### 5.1 Service Discovery Architecture

Service discovery is a higher-level concern than peer discovery: it answers "which nodes offer the service I need, and which one should I use?" rather than just "how do I reach a node?"

The Autheo ecosystem handles service discovery at two layers:

**Marketplace-level discovery:** For paid workloads, the marketplace smart contract is the authoritative registry of available providers. Buyers query the marketplace API; the matching engine performs provider selection against the buyer's requirements.

**Direct mesh discovery:** For non-marketplace or latency-sensitive use cases, nodes can directly query the DHT for providers offering a specific capability, bypassing the marketplace.

### 5.2 Capability Advertisement

Every node publishes its capabilities as part of its Pkarr address record and L1 registration:

```
Node capability advertisement:
{
  "compute": {
    "vcpu": 32,
    "memory_gb": 128,
    "gpu": [{"model": "H100", "vram_gb": 80, "count": 8}],
    "storage_gb": 2000,
    "confidential_compute": ["amd-sev-snp"],
    "max_workload_duration_hours": 72
  },
  "storage": {
    "capacity_tb": 50,
    "tier": "nvme",
    "redundancy": "3x-replication",
    "max_object_size_gb": 100
  },
  "network": {
    "bandwidth_gbps": 10,
    "regions": ["us-east-1", "us-east-2"],
    "latency_to_relays": {
      "relay-us-east": 8,
      "relay-eu-west": 102
    }
  },
  "pricing": {
    "compute_unit_price": "0.00012",   // $THEO per vCPU-hour
    "storage_unit_price": "0.00003",   // $THEO per GB-month
    "currency": "THEO"
  }
}
```

Capability advertisements are:
- Signed by the node's identity key (integrity-verified before use).
- Published to both Pkarr/DHT and the L1 registry.
- Updated when capabilities change (new hardware, pricing updates).
- Timestamped and sequenced to prevent replay of stale advertisements.

### 5.3 Marketplace Matching and Scheduling

When a buyer submits a job to the marketplace:

```
Buyer's job spec includes:
  - Required capabilities (CPU, GPU model, memory, storage)
  - Required attestation type (optional)
  - Geographic constraints (allowed regions, prohibited regions)
  - Minimum reputation threshold for provider
  - Maximum price per compute unit
  - Workload duration estimate
  - Privacy requirements (confidential compute: yes/no)

Marketplace matching engine:
  1. Filter providers:
     - Has required capabilities
     - Meets minimum reputation threshold
     - Stake ≥ minimum stake requirement
     - In allowed regions
     - Price ≤ buyer's maximum
     - Attestation valid (if required)
  
  2. Score remaining candidates:
     - Reputation score (higher = preferred)
     - Price (lower = preferred, weighted by buyer's preference)
     - Latency to buyer's stated origin (lower = preferred)
     - Availability headroom (providers near capacity are deprioritized)
  
  3. Select top N candidates (default: 3 for redundancy; buyer configures)
  
  4. Dispatch job to selected provider(s)
  
  5. In parallel execution mode: all N providers run the job;
     buyer accepts first valid result (redundancy ensures result delivery)
     
  6. In sequential mode: primary provider runs; fallback providers activated
     only if primary fails within timeout
```

### 5.4 Direct Service Discovery (Bypass Marketplace)

For low-latency or high-frequency operations where marketplace round-trip is too slow:

```
Direct discovery via DHT capability query:

1. Node constructs capability query key:
   query_key = DHT_key(capability_hash("compute", "gpu", "H100"))

2. DHT lookup returns list of nodes advertising this capability

3. Filter by reputation (query L1 for reputation scores of returned nodes)

4. Connect directly to selected node (QUIC/TLS handshake)

5. Negotiate terms directly (off-chain agreement)

6. On-chain settlement happens after job completion
   (even for direct deals, settlement anchors to L1 for finality)
```

Direct discovery is suitable for:
- Operators running their own provider network and connecting consumer-side nodes directly.
- Low-latency service calls where marketplace round-trip (100–300ms) is unacceptable.
- Testing and development environments.

### 5.5 DNS-Like Human-Readable Service Addressing

For developer-facing endpoints, the Agentic OS provides a service naming layer:

```
Human-readable: compute.autheo.dev/gpu/h100
           ↓
Name resolution:
  1. DNS lookup: autheo.dev → HTTPS endpoint for name registry
  2. Registry returns: canonical Endpoint ID for this service
  3. Pkarr lookup: Endpoint ID → current addresses
  4. Direct QUIC connection

OR, if fully decentralized:
  Autheo Name Registry (on-chain):
    L1.ResolveName("compute.gpu.h100") → Endpoint ID
```

Service names are governed by the L1 name registry. Name registration requires $THEO stake. Names cannot be squatted or transferred without the current owner's cryptographic authorization.

---

## 6. Failure Handling and Resilience

### 6.1 Partition Tolerance

The Autheo mesh is designed for asynchronous, eventually consistent operation. Network partitions — where a subset of nodes loses connectivity to the rest — are treated as a normal operational state, not an error.

**During a partition:**
- Nodes on each side of the partition continue to operate normally for jobs that are fully contained within their partition segment.
- Cross-partition jobs that were in-flight at partition time are detected as timed out after the connection deadline expires.
- CRDTs (Conflict-free Replicated Data Types) are used for distributed state synchronization; CRDT updates from each partition side are automatically merged when connectivity is restored, without conflict.
- L1 finality requires 2/3+ validator stake to be connected and responsive. A partition that isolates less than 1/3 of validators does not halt finality; a partition that isolates more than 1/3 will pause finality until connectivity is restored.

**Partition detection:**
Each node monitors its active peer connections with heartbeats (default: 10-second intervals). Loss of contact with more than 50% of active peers triggers a partition detection flag. The node then:
1. Attempts reconnection via relay paths.
2. Queries L1 (via alternate network path) for fresh peer list.
3. If L1 is also unreachable, continues operating in isolated mode for time-limited pending jobs.

### 6.2 Connection Failure and Retry

**Per-connection retry logic:**

```
Connection attempt failed
       ↓
Classify failure type:
  - Transient (timeout, temporary unreachable): retry after backoff
  - Path failure (route gone): resolve new addresses via Pkarr/DHT
  - Authentication failure (invalid cert/key): do NOT retry without
    human review (possible revocation or key rotation in progress)
  - Protocol incompatibility: do NOT retry; log and alert operator

Retry schedule (transient failures):
  Attempt 1: immediate
  Attempt 2: 1 second
  Attempt 3: 5 seconds
  Attempt 4: 30 seconds
  Attempt 5: 5 minutes
  After 5 attempts: mark peer as degraded; try alternate path
```

**In-flight workload protection:**
Jobs that are dispatched to a provider and mid-execution when the connection fails:
- The marketplace escrow holds payment until result is delivered.
- If the provider connection is lost and result is not returned within the job timeout window, escrow is refunded to the buyer.
- The buyer may re-submit the job to a different provider.
- Partial work is not compensated unless the job spec explicitly allows partial results.

### 6.3 Fallback Path Activation

When the primary path to a destination fails, fallback paths are activated in order:

```
Primary path: direct QUIC connection
  ↓ (if fails after retry)
Fallback 1: direct QUIC to alternate addresses for same Endpoint ID
  (peer may have multiple IPs or have obtained a new IP)
  ↓ (if fails)
Fallback 2: relay-assisted connection via preferred relay
  ↓ (if preferred relay unreachable)
Fallback 3: relay-assisted via secondary relay
  ↓ (if all relays fail)
Fallback 4: multi-hop through intermediate peers (DHT routing)
  ↓ (if destination is simply unreachable)
Report to caller: destination unreachable; provide last-known state
```

Path fallback is automatic and transparent at the transport layer. Applications see only a temporary increase in latency during fallback activation — connections are not torn down.

### 6.4 Relay Failure Handling

If a relay node becomes unavailable:
- Nodes currently using that relay detect the failure via connection timeout.
- They automatically probe alternative relays and reconnect through the next available relay.
- The relay selection logic deprioritizes relays with recent failures and routes around them.
- Community relay operators are incentivized to maintain uptime through reputation scores.
- The Autheo core relay network targets 99.95% availability per relay, with total network relay availability higher due to redundancy.

### 6.5 DHT Resilience

The BitTorrent Mainline DHT has a long operational history of partition tolerance. Individual DHT nodes come and go constantly; Pkarr records are replicated to multiple DHT nodes (k=20 by default). A Pkarr address record will remain resolvable as long as at least one of the k replica nodes is reachable.

For additional resilience, critical infrastructure nodes (well-known relays, bootstrap nodes) publish their Pkarr records from multiple independent DHT publishing clients, ensuring their records are more widely distributed.

---

## 7. Anti-Eclipse, Anti-Sybil, and Route-Poisoning Protections

### 7.1 Eclipse Attack Prevention

An eclipse attack surrounds a target node with attacker-controlled peers, cutting it off from legitimate network information.

**Prevention mechanisms:**

**Diverse bootstrapping (defense against initial eclipse):**
- Bootstrap peers are sourced from the L1 registry (requires stake — expensive to Sybil).
- Bootstrap list is diverse: different ASNs, different geographic regions, different DHT key ranges.
- A new node connects to a minimum of 5 bootstrap peers from at least 3 different ASNs before considering itself bootstrapped.

**Outbound connection diversity requirements:**
Each node's active peer set must satisfy:
```
Diversity constraints (enforced continuously):
  - At minimum 3 distinct BGP Autonomous Systems
  - At minimum 2 distinct geographic regions (based on GeoIP of peer addresses)
  - At minimum 4 distinct DHT key prefixes (16-bit prefix diversity)
  - At minimum 20% of peers discovered through independent channels
    (i.e., not all peers introduced by the same bootstrap node)
```

If the current peer set fails diversity constraints, the node actively seeks peers through DHT random walk to satisfy the constraint.

**L1 as independent information channel:**
Even if a node's entire DHT-visible peer set is controlled by an attacker, the node can always query the L1 blockchain (via any L1 RPC node) for a fresh list of registered, staked peers. An attacker who eclipses the DHT layer cannot also eclipse the L1 without controlling > 1/3 of validator stake.

**Periodic random peer probing:**
Every 30 minutes, each node performs a random walk to discover new peers in random regions of the DHT key space. These probes are not routed through existing peers — they use independent DHT lookups. This ensures that the node continuously refreshes its peer view even if existing peers are stale or malicious.

### 7.2 Sybil Attack Mitigation

A Sybil attack creates many fake identities to gain disproportionate influence.

**Identity cost barriers:**
- Creating a node identity is free (generate a keypair). But an identity without L1 registration has no reputation and cannot participate in the marketplace.
- L1 registration requires $THEO stake. Large-scale Sybil attacks require proportional stake — this creates a direct economic cost.
- Attestation-backed identities are bound to specific physical hardware. A hardware-attested Sybil requires a unique physical machine per identity.

**Reputation rate limiting:**
- Reputation is accumulated through completed on-chain work.
- A new identity must earn reputation over time by completing real jobs.
- Reputation accumulation is subject to rate limits: a node cannot accumulate more reputation than can be earned from its declared (and verified) capacity in a given time window.
- Wash-trading (submitting jobs to oneself) is detectable on-chain and results in reputation nullification.

**DHT key space Sybil resistance:**
- Peer selection for routing requires coverage of diverse DHT key ranges (Section 3.3).
- An attacker controlling many identities clustered in the same DHT key range gets fewer routing opportunities than their identity count would suggest, because diversity requirements prevent a single-range cluster from dominating a node's peer table.

**Minimum stake floor for governance influence:**
- Governance votes are stake-weighted. Creating 1000 low-stake Sybil identities and spreading the stake across them provides no more governance power than holding the same total stake in a single identity.

### 7.3 Route Poisoning Prevention

Route poisoning injects false routing information to redirect traffic.

**Signed routing advertisements:**
Every routing advertisement (Pkarr record, capability announcement, service record) is signed by the originating node's identity key. The signature is verified before the advertisement is incorporated into any routing table.

A route poisoning attempt produces an advertisement signed by the attacker's key. This means:
- The advertisement can only contain valid routes for the attacker's own Endpoint IDs.
- An attacker cannot create a convincing-looking advertisement for a victim's Endpoint ID without the victim's private key.
- Even if an attacker publishes a high-quality advertisement for their own Endpoint IDs and tricks other nodes into routing through them, the QUIC/TLS authentication at the destination ensures traffic intended for a legitimate peer fails authentication at the attacker's node.

**Reputation-weighted route selection:**
Route advertisements from low-reputation nodes are assigned lower weight in path selection. A brand-new node (no reputation) cannot immediately influence routing decisions for established infrastructure, even if its advertisements are technically valid.

**Monitoring and detection:**
Nodes track routing advertisement anomalies:
- Unusually high rate of new route advertisements from a peer.
- Advertisement for Endpoint IDs that do not match the advertising peer's registered key.
- Sudden appearance of many new nodes claiming to route to high-value infrastructure endpoints.

These signals trigger increased scrutiny: additional verification against L1 state, and temporary downweighting of the suspicious peer in routing decisions.

---

## 8. Latency, Cost, and Security Tradeoff Guidance

### 8.1 Understanding the Tradeoff Space

Every routing and discovery decision involves tradeoffs across three dimensions:

```
        Security
           ▲
           │
           │    Confidential Compute
           │    + Relay-free path
           │
           │          Direct path
           │          (authenticated, no relay)
           │
           ├──────────────────────────────→ Low Cost
           │
           │    Relay-assisted
           │    (small overhead)
           │
           │         Multi-hop through
           │         low-reputation peers
           ▼
        High Latency
```

No single configuration is optimal for all workloads. The right tradeoff depends on the workload's sensitivity, performance requirements, and budget.

### 8.2 Configuration Profiles

**Profile: Minimum Latency**

Use case: real-time AI inference, interactive compute, streaming applications.

```yaml
routing:
  prefer_direct: true
  allow_relay: true
  relay_preference: nearest
  max_hops: 1
  connection_timeout_ms: 500
  
discovery:
  use_local_mdns: true
  dht_cache_ttl_seconds: 300
  prefetch_addresses: true    # resolve before job dispatch

peer_selection:
  weight_latency: 0.50
  weight_reputation: 0.20
  weight_reliability: 0.20
  weight_stake: 0.05
  weight_attestation: 0.05
  allow_low_reputation: true  # accept lower-rep peers for speed
  
security:
  require_attestation: false
  require_confidential: false
```

**Profile: Maximum Security**

Use case: financial computation, sensitive model serving, healthcare data processing.

```yaml
routing:
  prefer_direct: true
  allow_relay: false          # no relay operators in path
  relay_preference: none
  max_hops: 1                 # no multi-hop (limits traffic analysis)
  
discovery:
  use_l1_anchored_only: true  # only L1-registered, staked nodes
  min_stake_theo: 10000
  require_attestation: true
  
peer_selection:
  weight_latency: 0.10
  weight_reputation: 0.35
  weight_reliability: 0.20
  weight_stake: 0.15
  weight_attestation: 0.20
  min_reputation_score: 8000
  
security:
  require_attestation: true
  require_confidential: true
  attestation_type: [amd-sev-snp, intel-tdx]
  key_exchange: ml-kem-1024   # highest PQ security level
```

**Profile: Cost-Optimized**

Use case: batch processing, non-time-sensitive jobs, development workloads.

```yaml
routing:
  prefer_direct: false
  allow_relay: true
  relay_preference: cheapest
  max_hops: 3
  
discovery:
  use_marketplace: true
  sort_by: price_ascending
  
peer_selection:
  weight_latency: 0.10
  weight_reputation: 0.25
  weight_reliability: 0.25
  weight_stake: 0.15
  weight_price: 0.25          # enabled only in cost-optimized mode
  
security:
  require_attestation: false
  require_confidential: false
  min_reputation_score: 5000  # still require baseline quality
```

### 8.3 Practical Tradeoff Guidance

**For confidential compute workloads:**
- Direct paths only (no relay-assisted routing). Relay operators are outside the trusted execution boundary; even though they cannot read ciphertext, minimizing path actors reduces traffic analysis risk.
- Require attestation before sending any sensitive data.
- Accept 10–30ms additional latency compared to non-confidential paths for the security guarantee.

**For globally distributed workloads:**
- Use relay-assisted paths for distant connections where direct QUIC traversal is unreliable.
- Geographic affinity matching (route workloads to providers in the same region as input data) typically reduces cost and latency simultaneously.
- For cross-regional data movement: prefer high-bandwidth providers even at slightly higher price point; data transfer cost usually dominates in cross-region scenarios.

**For high-frequency small jobs:**
- Cache peer addresses (avoid DHT round-trips per job).
- Use 0-RTT QUIC reconnection to frequently used providers.
- Pre-establish connections to top-N providers before jobs arrive (reduces per-job connection overhead to near zero).

**For large data workloads:**
- Storage locality matters most. Select a provider that already has the input data, or is co-located with the storage node holding it.
- For multi-GB inputs: prefer providers with 10GbE+ connectivity; bandwidth bottleneck dominates computation time for large inputs.

---

## 9. How L1, Mesh, and Marketplace Interact End-to-End

### 9.1 System of Systems Architecture

L1, mesh, and marketplace are distinct systems with clear interface boundaries:

```
┌────────────────────────────────────────────────────────────────────────┐
│  BUYER INTERFACE                                                        │
│  Agentic OS CLI / SDK / Web UI                                          │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │  Submit job (signed capability token)
                                 ↓
┌────────────────────────────────────────────────────────────────────────┐
│  AUTHEO MARKETPLACE (L1 Smart Contract)                                 │
│  Job queue · Matching engine · Escrow · Settlement · Reputation         │
│                                                                         │
│  Discovery path: buyer queries marketplace for available providers      │
│  Economic path: escrow locked at job submission; released at result     │
└──────────────────┬──────────────────────────────────────────┬──────────┘
                   │  Dispatch (signed job token)              │ Settlement
                   ↓                                           ↓
┌──────────────────────────────────┐  ┌─────────────────────────────────┐
│  AUTHEO MESH                     │  │  AUTHEO L1 BLOCKCHAIN           │
│  P2P routing · Discovery         │  │  CometBFT · Cosmos SDK          │
│  QUIC/TLS transport              │  │  Validator set                  │
│  Firecracker microVMs            │  │  $THEO token                    │
│  Workload execution              │  │  Reputation records             │
│                                  │  │  Key registry                   │
│  Provider receives job token     │  │  Governance                     │
│  Executes in isolated microVM    │  │                                 │
│  Returns signed result           │  │                                 │
└──────────────────────────────────┘  └─────────────────────────────────┘
```

### 9.2 Complete Job Lifecycle — End-to-End Flow

```
STEP 1: Service Discovery and Provider Selection
  Buyer queries marketplace for providers matching requirements
  Marketplace returns candidates from L1 registry
  Buyer (or matching engine) selects provider based on composite score
  Pkarr/DHT lookup resolves provider's current network addresses

STEP 2: Job Submission and Escrow
  Buyer constructs job spec:
    - Workload image hash
    - Resource requirements
    - Capability token (scoped to this job)
    - Escrow amount
  Buyer signs job spec with wallet key
  Buyer submits to L1 marketplace contract
  L1 verifies signature, locks escrow, records job ID on-chain

STEP 3: Dispatch Routing
  Marketplace contract emits JobDispatched event
  Scheduler (running at buyer or marketplace layer) constructs dispatch message
  Dispatch message is addressed to provider's Endpoint ID
  Pkarr/DHT lookup → provider current addresses
  QUIC/TLS direct connection established (or relay if needed)
  Mutual authentication during handshake
  Dispatch message delivered: {job_id, workload_hash, capability_token}

STEP 4: Provider Verification
  Provider receives dispatch
  Verifies:
    - Capability token signature is valid
    - Capability covers this job type
    - Job ID is recorded on-chain (anti-replay)
    - Workload image hash matches expected hash
    - Buyer's reputation meets provider's threshold
    - Resource capacity is available
  Provider accepts (or rejects with reason)

STEP 5: Workload Execution
  Scheduler allocates a microVM from warm pool (or cold-starts a new one)
  Loads workload image into microVM (verifies image hash at load time)
  [Optional] Performs attestation: provider signs attestation report
    → Sends to buyer; buyer verifies before providing sensitive data
  Workload executes inside isolated microVM
  microVM has no network access except to:
    - Input endpoint (download workload inputs)
    - Output endpoint (upload results)
    - Authorized external endpoints declared in job spec

STEP 6: Result Return and Verification
  Workload completes and writes output to virtual output channel
  microVM shuts down (ephemeral; no state persists)
  Provider hashes output: result_hash = SHA256(output)
  Provider signs result: result_sig = Ed25519(provider_key, result_hash + job_id)
  Provider sends result package to buyer (QUIC/TLS direct or relay)
  Buyer verifies:
    - Signature valid against provider's known public key
    - Job ID matches submitted job
    - Result hash matches declared hash

STEP 7: Settlement
  Buyer submits result acknowledgment to L1 marketplace contract:
    L1.AcknowledgeResult(job_id, result_hash, buyer_signature)
  L1 contract:
    - Verifies buyer signature
    - Releases escrow to provider ($THEO transfer)
    - Updates provider's completed_jobs counter
    - Updates reputation score
    - Marks job as settled on-chain

STEP 8: Dispute Handling (if buyer rejects result)
  Buyer submits dispute to L1:
    L1.DisputeResult(job_id, dispute_reason, evidence_hash)
  Dispute escrow held for arbitration period
  Governance committee or automated verifier reviews:
    - Run workload in reference environment and compare outputs
    - On confirmed provider failure: escrow refunded to buyer + reputation penalty
    - On confirmed buyer bad faith: escrow released to provider + buyer reputation penalty
```

### 9.3 Cross-System Security Guarantees

**From L1:**
- Payment cannot be claimed without a valid result acknowledgment from the buyer.
- Identities cannot be forged without the corresponding private key.
- Slashing deters validator misbehavior with economic consequences.
- Key revocations propagate across all systems within one block finality.

**From the mesh:**
- No plaintext data crosses the network — all traffic is TLS 1.3 encrypted.
- Provider cannot swap the submitted workload image (hash-verified at every step).
- Provider cannot forge result signatures (requires the workload identity key, held inside the VM).
- Buyer cannot forge job submissions (requires buyer's L1 wallet signature).

**From the marketplace:**
- Escrow guarantees that a provider who delivers a valid result will be paid.
- Escrow guarantees that a buyer who submits a job is financially committed.
- On-chain job records make disputes independently verifiable by the community.

---

## 10. Operational Considerations

### 10.1 Monitoring Recommended Metrics

**For node operators:**

| Metric | Description | Alert Threshold |
|---|---|---|
| `peer_count_active` | Number of active authenticated peer connections | < 10 (isolation risk) |
| `peer_diversity_as` | Count of distinct ASNs in peer table | < 3 (eclipse risk) |
| `routing_success_rate` | % of routing attempts that complete | < 95% |
| `relay_usage_fraction` | % of connections using relay vs direct | > 40% (direct connectivity issue) |
| `auth_failure_rate` | Authentication failures per minute | > 10/min (scanning/attack) |
| `pkarr_publish_lag` | Time since last successful Pkarr record update | > 600 seconds |
| `dht_lookup_latency_p99` | 99th percentile DHT lookup latency | > 5 seconds |
| `workload_queue_depth` | Pending workloads awaiting execution | > 80% of capacity |

**For validators:**

| Metric | Description | Alert Threshold |
|---|---|---|
| `blocks_signed_fraction` | % of blocks signed in last epoch | < 95% (miss rate) |
| `sentry_connections` | Number of active sentry peer connections | < 2 (connectivity risk) |
| `consensus_round_trips` | Vote message round-trip latency | > 2× median |
| `peer_count_validator` | Connections to other validators (via sentries) | < 5 |

### 10.2 Capacity Planning for Routing

**Peer table sizing:**
- The default peer table limit (500 entries) is sufficient for typical nodes.
- High-throughput routing nodes (nodes acting as well-connected hubs) should increase to 2000–5000.
- Memory cost: approximately 2KB per peer table entry. 5000 entries ≈ 10MB RAM.

**DHT participation:**
- Each node stores a fraction of the DHT key space proportional to its participation.
- Estimated DHT storage per node: 50–200MB depending on network size.
- DHT traffic: approximately 10–50Kbps background DHT maintenance traffic.

**Relay bandwidth planning:**
- Relay nodes should provision symmetric bandwidth sufficient for their expected connection load.
- Rule of thumb: 1Gbps per 10,000 concurrently connected nodes at typical mesh traffic volumes.
- Relays should monitor ingress/egress bandwidth and reject new connections above 80% saturation.

### 10.3 Upgrades and Protocol Versioning

**Protocol versioning:**
All protocol messages include a version field. Peers negotiate the highest mutually supported protocol version during handshake. Older clients can continue operating with newer network infrastructure until the minimum supported version is updated through a governance vote.

**Rolling upgrades:**
Node software upgrades can be performed as a rolling restart. Since the mesh is a peer network without a central controller, upgrading individual nodes one at a time maintains overall network availability. A node that is briefly offline for upgrade is simply routed around by the path selection algorithm.

**Breaking protocol changes:**
Breaking changes require an L1 governance vote specifying a migration deadline. A countdown block height is recorded on-chain; after that block, the old protocol version is no longer accepted. Operators must upgrade before the deadline or lose connectivity.

---

*This document provides the complete routing and discovery reference for the Autheo ecosystem. Cross-reference: [SECURITY-ARCHITECTURE-DEEP-DIVE.md](./SECURITY-ARCHITECTURE-DEEP-DIVE.md) for the threat model and security controls that apply to routing infrastructure.*

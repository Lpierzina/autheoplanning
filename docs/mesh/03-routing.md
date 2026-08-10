# Mesh Routing

## Overview

The Mesh Routing layer determines how traffic moves between peers, services, edge nodes, PoPs, compute resources, storage nodes, and Internet-connected infrastructure.

Routing is distinct from discovery.

**Discovery finds possible peers and endpoints.**

**Routing selects the best available path between them.**

The routing system combines:

* Peer-to-peer routing
* Iroh connectivity
* QUIC transport
* Direct connection preference
* Relay fallback
* Mesh path selection
* Geographic routing
* Latency-aware routing
* Capacity-aware routing
* Health-aware routing
* Cost-aware routing
* Service routing
* CDN routing
* GeoDNS
* BGP Anycast
* Regional failover
* Multi-path connectivity

The goal is to create a routing fabric capable of operating across both decentralized mesh nodes and conventional Internet infrastructure.

---

# 1. Routing Architecture

The routing architecture sits between discovery and transport.

```text
┌──────────────────────────────────────┐
│             Application              │
├──────────────────────────────────────┤
│          Service / Peer ID           │
├──────────────────────────────────────┤
│             Discovery               │
│ Bluetooth / mDNS / Pkarr / DHT      │
├──────────────────────────────────────┤
│              Routing                 │
│ Path selection / policies / health  │
├──────────────────────────────────────┤
│              Iroh                    │
│ Direct / Relay / NAT traversal      │
├──────────────────────────────────────┤
│              QUIC                    │
├──────────────────────────────────────┤
│       Internet / LAN / Wireless      │
└──────────────────────────────────────┘
```

For Internet-facing services, routing also integrates with:

```text
DNS
 │
 ▼
GeoDNS
 │
 ▼
BGP Anycast
 │
 ▼
PoP
 │
 ▼
CDN / Edge
 │
 ▼
Mesh
```

---

# 2. Discovery vs Routing

These systems have separate responsibilities.

## Discovery

Discovery answers:

> Where might this peer or service be?

Examples:

```text
Bluetooth
mDNS
Pkarr
BitTorrent DHT
Peer exchange
Service registries
```

## Routing

Routing answers:

> Which available path should I use?

Examples:

```text
Direct connection
Nearby peer
Regional peer
Relay
PoP
Origin
CDN
```

The relationship is:

```text
Discovery
    │
    ▼
Candidate Endpoints
    │
    ▼
Routing Engine
    │
    ▼
Selected Path
    │
    ▼
Iroh
    │
    ▼
Transport
```

---

# 3. Routing Goals

The routing layer should optimize for several objectives.

### Availability

Traffic must have alternate paths when infrastructure fails.

### Performance

Prefer paths with low latency and sufficient bandwidth.

### Reliability

Avoid unstable or unhealthy paths.

### Efficiency

Avoid unnecessary hops.

### Cost

Where appropriate, prefer lower-cost infrastructure.

### Locality

Prefer nearby resources when performance and policy permit.

### Security

Avoid untrusted or unauthorized paths.

### Decentralization

Use distributed infrastructure when appropriate.

### Simplicity

Applications should not manually construct network paths.

---

# 4. Routing Inputs

The routing engine can evaluate multiple sources of information.

```text
                  ROUTING ENGINE
                        │
       ┌────────────────┼────────────────┐
       │                │                │
    Discovery         Health           Metrics
       │                │                │
       ├────────────┬───┼────────────┬───┤
       │            │   │            │   │
    Location      Latency Capacity   Cost Policy
```

Potential inputs include:

* Peer identity
* Endpoint availability
* Geographic location
* Network proximity
* Latency
* Packet loss
* Bandwidth
* Connection stability
* Node capacity
* Service health
* Relay availability
* Cost
* Administrative policy
* Security policy
* BGP path information
* CDN state

---

# 5. Candidate Paths

Discovery may produce multiple possible paths.

For example:

```text
Node A
 │
 ├── Direct → Node B
 │
 ├── Peer C → Node B
 │
 ├── PoP A → Node B
 │
 └── Relay → Node B
```

The routing engine evaluates the candidates.

```text
Candidates
    │
    ▼
Filter invalid paths
    │
    ▼
Apply security policy
    │
    ▼
Measure / estimate quality
    │
    ▼
Rank paths
    │
    ▼
Select path
```

---

# 6. Direct Path Preference

When possible, the system should prefer direct peer connectivity.

```text
Node A ───────────────── Node B
          DIRECT
```

over:

```text
Node A ─── Relay ─── Node B
```

Direct connectivity generally reduces:

* Latency
* Relay bandwidth consumption
* Infrastructure dependency
* Additional network hops

However, direct paths should not be preferred blindly if they are unstable or significantly worse than available alternatives.

---

# 7. Routing Hierarchy

A general routing preference can be:

```text
1. Authorized direct path
2. High-quality local / nearby path
3. Regional mesh path
4. Trusted edge / PoP path
5. Relay path
6. Internet fallback
```

The exact ordering is policy-dependent.

For some services, cost or security may override geographic proximity.

---

# 8. Local Routing

Local connectivity can be extremely efficient.

Possible local paths include:

* Ethernet
* Wi-Fi
* Bluetooth
* Local IPv4
* Local IPv6
* mDNS-discovered endpoints

Example:

```text
Device A
   │
   │ LAN
   ▼
Device B
```

A local path should generally be preferred over sending the same traffic through a remote relay.

---

# 9. Regional Routing

When a direct local path is unavailable, routing can select a nearby regional node.

```text
Device
  │
  ▼
Regional Mesh
  │
  ├── Node A
  ├── Node B
  └── Node C
```

Regional routing can reduce unnecessary long-distance traffic.

---

# 10. Global Routing

For globally distributed services, the routing system can operate across multiple regions.

```text
                   GLOBAL MESH
                       │
       ┌───────────────┼───────────────┐
       │               │               │
    Americas         Europe           Asia
       │               │               │
      PoPs            PoPs            PoPs
       │               │               │
      Nodes           Nodes           Nodes
```

Routing can select the most appropriate region based on:

* Latency
* Availability
* Capacity
* Policy
* Cost
* Network topology

---

# 11. Geographic Routing

Geographic information can help narrow the routing candidates.

```text
Client
  │
  ▼
Region
  │
  ▼
Nearest viable PoP
  │
  ▼
Best service path
```

Geographic proximity should be treated as a routing signal rather than an absolute rule.

---

# 12. Latency-Aware Routing

The routing layer can use measured latency.

Example:

```text
Path A → 18 ms
Path B → 42 ms
Path C → 27 ms
```

If all paths are healthy and equivalent in other respects:

```text
Path A
   ▲
   │
Preferred
```

Latency measurements should be continuously updated because Internet conditions change.

---

# 13. Packet Loss

Latency alone is insufficient.

A path with:

```text
20 ms latency
15% packet loss
```

may be worse than:

```text
35 ms latency
0.1% packet loss
```

Routing should therefore consider:

* RTT
* Packet loss
* Jitter
* Connection resets
* Throughput

---

# 14. Bandwidth-Aware Routing

Large transfers may require different routing decisions than small requests.

For example:

```text
API request
   │
   ▼
Low-latency path
```

while:

```text
100 GB dataset
   │
   ▼
High-bandwidth path
```

The routing engine should consider workload characteristics where available.

---

# 15. Capacity-Aware Routing

A node may be healthy but overloaded.

```text
Node A
CPU: 90%
Bandwidth: 95%

Node B
CPU: 35%
Bandwidth: 40%
```

Routing should generally avoid sending additional traffic toward Node A when Node B provides an acceptable alternative.

---

# 16. Health-Aware Routing

Every route candidate should have a health state.

```text
Path
 │
 ├── Reachable
 ├── Responsive
 ├── Authorized
 ├── Capacity available
 └── Service healthy
```

A failed health check can cause a path to be removed from the candidate set.

---

# 17. Route Scoring

A routing engine can conceptually assign each candidate a score.

For example:

```text
Route Score =
    Latency
  + Packet Loss
  + Congestion
  + Cost
  + Hop Count
  + Reliability
  + Policy Penalties
```

This is not necessarily a literal formula.

The implementation can use weighted metrics.

Conceptually:

```text
Candidate A
  latency       10
  reliability   10
  capacity       8
  cost            7
  security       10
  ----------------
  score          45
```

Higher-quality routes receive higher preference.

---

# 18. Hard Constraints vs Preferences

Routing should distinguish between mandatory requirements and optimization preferences.

### Hard constraints

A route may be rejected if:

* It is unauthorized
* The endpoint is unreachable
* The service is unhealthy
* Security policy prohibits it
* Required encryption is unavailable

### Preferences

Among valid routes, the system can optimize:

* Latency
* Cost
* Geography
* Capacity
* Reliability

```text
Hard Constraints
       │
       ▼
Valid Routes
       │
       ▼
Optimization
       │
       ▼
Best Route
```

---

# 19. Routing Policies

Applications or infrastructure operators may specify routing policies.

Example:

```yaml
routing:
  prefer:
    - latency
    - locality

require:
    encrypted: true

failover:
    enabled: true
```

Another service might prefer:

```yaml
routing:
  prefer:
    - lowest_cost
    - capacity

require:
    region: us

failover:
    enabled: true
```

Routing should therefore be policy-driven rather than hard-coded.

---

# 20. Service Routing

Services should be represented independently from physical nodes.

```text
Service
  │
  ├── Node A
  ├── Node B
  ├── Node C
  └── Node D
```

The routing layer chooses which instance should handle a request.

This allows service identity to remain stable while infrastructure changes underneath it.

---

# 21. Service-Level Routing

A service may have multiple instances:

```text
api.example.com

       │
 ┌─────┼─────┐
 │     │     │
 A     B     C
```

The routing system can distribute traffic according to:

* Health
* Region
* Capacity
* Latency
* Weight
* Cost

---

# 22. Weighted Routing

Traffic can be intentionally distributed.

Example:

```text
Origin A → 70%
Origin B → 20%
Origin C → 10%
```

Useful for:

* Load balancing
* Canary deployments
* Migration
* Capacity management
* Disaster recovery

---

# 23. Canary Routing

A new version can receive a small percentage of traffic.

```text
              Service
                 │
        ┌────────┴────────┐
        │                 │
      v1 95%             v2 5%
```

If v2 performs well:

```text
v1 80%
v2 20%
```

and eventually:

```text
v1 0%
v2 100%
```

Routing can therefore participate in deployment orchestration.

---

# 24. Failover Routing

A service can define primary and backup paths.

```text
Primary
   │
   X
   │
   ▼
Secondary
   │
   X
   │
   ▼
Tertiary
```

Failover can occur at:

* Service level
* PoP level
* Region level
* Origin level
* Peer level
* Transport level

---

# 25. Multi-Path Routing

For some applications, multiple paths may be useful simultaneously.

```text
Node A
 │
 ├──────── Path 1 ────────┐
 │                        │
 └──────── Path 2 ────────┤
                          ▼
                        Node B
```

Multi-path networking can improve:

* Resilience
* Aggregate throughput
* Connection survival

It should be used selectively because it increases complexity.

---

# 26. Connection Migration

Modern transports such as QUIC can support connection continuity when network conditions change.

For example:

```text
Wi-Fi
  │
  X
  │
  ▼
Cellular
```

The application can potentially maintain its logical session while the underlying network changes.

This is especially useful for mobile mesh nodes.

---

# 27. Mobile Routing

A mobile device may continuously change network attachment.

```text
Home Wi-Fi
    │
    ▼
Cellular
    │
    ▼
Public Wi-Fi
```

The routing system should update reachable endpoints without requiring the application's identity to change.

This reinforces the separation:

```text
Identity ≠ Address
```

---

# 28. Identity and Routing

A peer identity should remain stable even if its network location changes.

```text
Peer Identity
      │
      ├── LAN endpoint
      ├── Wi-Fi endpoint
      ├── Cellular endpoint
      ├── Public endpoint
      └── Relay endpoint
```

Discovery updates possible endpoints.

Routing selects among them.

---

# 29. Iroh Routing

Iroh provides the connectivity layer used after the routing system has determined the preferred peer path.

Conceptually:

```text
Routing Engine
      │
      ▼
Preferred Endpoint
      │
      ▼
Iroh
      │
      ├── Direct
      ├── NAT traversal
      └── Relay fallback
```

The routing system should not duplicate Iroh's transport responsibilities.

Instead, it should provide higher-level path selection and policy.

---

# 30. Direct Connectivity

The preferred P2P path is generally:

```text
Peer A
  │
  │ Direct
  ▼
Peer B
```

If direct connectivity succeeds, relay infrastructure may not be required.

---

# 31. NAT Traversal

Many devices exist behind NATs or firewalls.

The routing architecture therefore needs to accommodate:

```text
Private Network
      │
     NAT
      │
      ▼
   Internet
```

Iroh can attempt appropriate connectivity mechanisms.

If direct connectivity fails:

```text
Peer A
  │
  ▼
Relay
  │
  ▼
Peer B
```

---

# 32. Relay Routing

Relays provide a fallback connectivity path.

A relay can be selected based on:

* Geographic proximity
* Latency
* Availability
* Capacity
* Policy
* Cost

Example:

```text
Peer A
 │
 ├── Relay A → 20 ms
 ├── Relay B → 50 ms
 └── Relay C → 90 ms
```

Relay A would generally be preferred if all other factors are equal.

---

# 33. Relay Failover

A peer should be capable of switching relays.

```text
Relay A
   X
   │
   ▼
Relay B
   │
   ▼
Peer
```

Relay infrastructure should therefore be treated as a distributed service rather than a single central dependency.

---

# 34. Mesh Routing Tables

Nodes can maintain routing information describing reachable resources.

Conceptually:

```text
Destination     Next Hop       Metric
------------------------------------------------
Peer A          Direct         1
Peer B          Node C         3
Service X       PoP A          5
Storage Y       Node D         4
```

The exact implementation can vary depending on the mesh protocol.

The important property is that routing state should remain bounded and useful rather than requiring every node to know the complete global topology.

---

# 35. Hierarchical Routing

A large global mesh should avoid requiring every node to maintain complete routing information.

A hierarchical model can be used:

```text
Global
 │
 ├── Region
 │    ├── PoP
 │    │    ├── Node
 │    │    └── Node
 │    └── PoP
 │
 └── Region
      └── PoP
```

Nodes can primarily understand their local topology while higher-level infrastructure handles broader routing.

---

# 36. Regional Aggregation

Regional routing can aggregate information.

Instead of:

```text
Node A knows 10,000 nodes
```

it may know:

```text
Region A
Region B
Region C
```

and obtain more specific information only when required.

This reduces routing-state complexity.

---

# 37. Route Propagation

Routing information can propagate through controlled mechanisms.

```text
Node
 │
 ▼
Local Mesh
 │
 ▼
Regional Gateway
 │
 ▼
Global Routing Layer
```

Only relevant information should be propagated beyond its required scope.

---

# 38. Route Expiration

Routing information becomes stale.

Routes should therefore have:

* Expiration
* Refresh
* Health checks
* Versioning
* Last-seen timestamps

Example:

```text
Route learned
     │
     ▼
Valid
     │
     ▼
Refresh
     │
     ├── Success → Continue
     │
     └── Failure → Expire
```

This prevents dead routes from remaining indefinitely.

---

# 39. Route Validation

Routing information should not automatically be trusted.

A route should be validated against:

* Peer identity
* Cryptographic identity
* Service identity
* Authorization
* Network policy
* Endpoint reachability

Discovery tells the node what exists.

Authentication determines what can be trusted.

Routing determines what path should be used.

---

# 40. Secure Routing

Routing control information should be authenticated wherever possible.

A malicious node should not be able to trivially claim:

```text
"I am the route to every service."
```

Identity-aware routing can prevent unauthorized route injection.

---

# 41. Sybil Resistance

A decentralized routing system must consider large numbers of fake nodes.

Potential mitigations include:

* Cryptographic identities
* Reputation
* Resource requirements
* Authentication
* Admission policies
* Rate limits
* Trust relationships

Routing should not automatically treat every discovered node as equally authoritative.

---

# 42. Route Reputation

Nodes can maintain observations about route quality.

For example:

```text
Peer A
 ├── Reliability: High
 ├── Latency: Low
 ├── Availability: High
 └── Packet loss: Low
```

This information can influence route selection.

Reputation should be treated as a signal rather than an unquestionable truth.

---

# 43. Cost-Aware Routing

Infrastructure providers may have different costs.

```text
Path A → $0.01 / GB
Path B → $0.04 / GB
Path C → $0.00 / GB
```

Where application policy permits, the routing engine can consider cost.

For example:

```text
Latency requirement met?
        │
        ▼
Compare cost
        │
        ▼
Select lower-cost route
```

Cost should never override mandatory security or availability requirements.

---

# 44. Provider Diversity

Routing can intentionally avoid dependence on one provider.

```text
Provider A
Provider B
Provider C
Colocation
Community Node
```

A service can distribute origins and PoPs across multiple providers.

This reduces:

* Vendor lock-in
* Provider outage risk
* Regional concentration
* Infrastructure monoculture

---

# 45. Network Diversity

Provider diversity is not enough.

Multiple providers may still depend on the same:

* Fiber route
* Transit provider
* Power grid
* Data center
* Internet exchange

Routing should therefore consider physical and network diversity where the information is available.

---

# 46. Failure Domains

Routing should understand failure domains.

```text
Global
 │
 ├── Region
 │    ├── Provider
 │    │    ├── PoP
 │    │    └── PoP
 │    └── Provider
 │
 └── Region
```

A resilient deployment should avoid placing every route in the same failure domain.

---

# 47. Congestion-Aware Routing

Network conditions can change rapidly.

```text
Normal
   │
   ▼
Congestion
   │
   ▼
Alternative path
```

If measurements indicate severe congestion, traffic may move toward another path.

This can be especially useful for large data transfers.

---

# 48. Adaptive Routing

The mesh should continuously update routing decisions.

```text
Measure
   │
   ▼
Analyze
   │
   ▼
Update Route Score
   │
   ▼
Select Path
   │
   ▼
Measure Again
```

Routing is therefore a feedback system rather than a static table.

---

# 49. Routing Stability

Constantly switching paths can be harmful.

The routing engine should avoid unnecessary route flapping.

Possible techniques include:

* Hysteresis
* Minimum route lifetime
* Thresholds
* Cooldowns
* Smoothing
* Route preference margins

For example:

```text
Current Path: 20 ms
Alternative: 21 ms
```

There may be no reason to switch.

But:

```text
Current Path: 150 ms
Alternative: 25 ms
```

may justify a route change.

---

# 50. Routing Domains

The mesh can contain different routing domains.

```text
Global Routing
      │
 ┌────┼────┐
 │    │    │
Region A   Region B
 │          │
Local Mesh  Local Mesh
```

This allows local routing policies to remain independent while still participating in global connectivity.

---

# 51. Internet Routing Integration

The mesh does not replace BGP.

Instead:

```text
Mesh Routing
     │
     ▼
PoP
     │
     ▼
BGP
     │
     ▼
Internet
```

BGP handles Internet-wide reachability.

Mesh routing handles application- and peer-level path selection above it.

---

# 52. GeoDNS Routing

GeoDNS provides another routing decision point.

```text
Client
 │
 ▼
DNS
 │
 ▼
GeoDNS
 │
 ├── Region A
 ├── Region B
 └── Region C
```

The selected endpoint can then enter the normal routing hierarchy.

---

# 53. Anycast Routing

Anycast operates below DNS.

```text
DNS
 │
 ▼
Anycast IP
 │
 ▼
Internet BGP
 │
 ├── PoP A
 ├── PoP B
 └── PoP C
```

The Internet selects a suitable PoP based on BGP routing.

The mesh can then take over after the traffic reaches the PoP.

---

# 54. CDN Routing

The CDN introduces another routing decision.

```text
PoP
 │
 ▼
Cache?
 │
 ├── YES → Serve
 │
 └── NO
       │
       ▼
Select Origin
       │
       ▼
Fetch
```

Origin selection can use the same routing metrics:

* Health
* Latency
* Capacity
* Cost
* Geography

---

# 55. Complete Internet Routing Path

```text
                         CLIENT
                            │
                            ▼
                           DNS
                            │
                            ▼
                         GeoDNS
                            │
                            ▼
                        Anycast IP
                            │
                            ▼
                           BGP
                            │
                            ▼
                           PoP
                            │
                    ┌───────┴───────┐
                    │               │
                  Cache             │
                    │               │
                 HIT │             MISS
                    │               │
                    ▼               ▼
                 CLIENT           ROUTING
                                    │
                                    ▼
                                   Iroh
                                    │
                                    ▼
                                   Mesh
                                    │
                              ┌─────┼─────┐
                              │     │     │
                           Origin A B    C
```

---

# 56. Complete P2P Routing Path

```text
                         PEER A
                            │
                            ▼
                        Discovery
                            │
                            ▼
                     Candidate Paths
                            │
                            ▼
                       Route Engine
                            │
                ┌───────────┼───────────┐
                │           │           │
              Direct      Peer Hop     Relay
                │           │           │
                └───────────┼───────────┘
                            │
                            ▼
                           Iroh
                            │
                            ▼
                           QUIC
                            │
                            ▼
                         PEER B
```

---

# 57. Service Routing vs Peer Routing

These should remain conceptually separate.

### Service routing

Optimizes:

```text
User → Service
```

### Peer routing

Optimizes:

```text
Peer → Peer
```

Both use the underlying mesh but have different requirements.

---

# 58. Service Routing Example

A user requests:

```text
api.example.com
```

Routing:

```text
DNS
 ↓
GeoDNS
 ↓
Anycast
 ↓
PoP
 ↓
CDN
 ↓
Healthy Origin
```

---

# 59. Peer Routing Example

A node requests another node:

```text
Peer B
```

Routing:

```text
Peer ID
 ↓
Discovery
 ↓
Candidate endpoints
 ↓
Direct connectivity
 ↓
Iroh
 ↓
QUIC
 ↓
Peer B
```

If direct connectivity fails:

```text
Iroh
 ↓
Relay
 ↓
Peer B
```

---

# 60. Routing for Compute

Compute resources can also be treated as routable services.

```text
Compute Request
      │
      ▼
Routing
      │
      ├── Capacity
      ├── Region
      ├── Cost
      ├── Latency
      └── Requirements
             │
             ▼
        Compute Node
```

This allows workloads to be placed on suitable infrastructure.

---

# 61. Routing for Storage

Storage can be routed similarly.

```text
Storage Request
      │
      ▼
Candidate Nodes
      │
      ├── Availability
      ├── Capacity
      ├── Latency
      ├── Replication
      └── Cost
             │
             ▼
        Storage Node
```

For replicated data:

```text
              Data
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
    Node A   Node B   Node C
```

Routing can choose the best replica for reads.

---

# 62. Read Routing

A replicated object can have multiple locations.

```text
Object X

Replica A → 20 ms
Replica B → 50 ms
Replica C → 25 ms
```

A client can read from Replica A.

---

# 63. Write Routing

Writes may require stronger consistency rules.

The routing layer should therefore distinguish:

```text
READ
```

from:

```text
WRITE
```

A write may need to reach a designated primary or quorum.

Routing should follow the storage system's consistency policy rather than independently deciding replication semantics.

---

# 64. Streaming Routing

Streaming applications have different requirements from ordinary HTTP requests.

They may prioritize:

* Stable throughput
* Low jitter
* Long-lived connections
* Route stability

Therefore:

```text
Streaming
   │
   ▼
Stable Path
   │
   ▼
Continuous Session
```

should be preferred over constantly changing routes.

---

# 65. Large Transfer Routing

For large files or datasets, bandwidth may dominate latency.

The routing engine can select:

```text
High-bandwidth path
```

even if it has slightly greater RTT.

This prevents small-request optimization from being applied blindly to every workload.

---

# 66. Routing and Caching

Caching can eliminate routing entirely for some requests.

```text
Request
  │
  ▼
PoP Cache
  │
  ├── HIT → Response
  │
  └── MISS → Routing
```

The best route is therefore often:

> No upstream route at all.

This is one of the primary benefits of the CDN layer.

---

# 67. Routing and Content Addressing

Content-addressed data can be retrieved from multiple nodes.

```text
Content ID
    │
    ▼
Find replicas
    │
 ┌──┼──┐
 A  B  C
 │  │  │
20 35 80 ms
    │
    ▼
Replica A
```

The routing engine selects an appropriate replica.

---

# 68. Route Cache

Nodes can cache routing information temporarily.

```text
Request
 │
 ▼
Route Cache
 │
 ├── Valid → Use route
 │
 └── Expired → Recalculate
```

This reduces unnecessary route computation.

Cached routing information must have expiration and validation rules.

---

# 69. Routing Updates

Routing changes should propagate efficiently.

Examples:

```text
Node joins
Node leaves
PoP fails
Relay fails
Capacity changes
Service moves
Network degrades
```

The routing system updates only affected paths where possible.

---

# 70. Event-Driven Routing

Infrastructure events can trigger routing changes.

```text
Health Event
     │
     ▼
Routing Controller
     │
     ▼
Recalculate affected paths
     │
     ▼
Publish update
```

This is more efficient than constantly rebuilding the entire routing state.

---

# 71. Routing Control Plane

The routing control plane is responsible for:

* Route calculation
* Policy management
* Health integration
* Capacity information
* Path metrics
* Route distribution
* Route expiration
* Failover
* Service routing
* Peer routing

```text
                CONTROL PLANE
                      │
       ┌──────────────┼──────────────┐
       │              │              │
    Discovery       Health         Policy
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ▼
                Route Engine
                      │
                      ▼
                Route Updates
```

---

# 72. Routing Data Plane

The data plane executes the selected path.

```text
Application
    │
    ▼
Selected Route
    │
    ▼
Iroh / Edge
    │
    ▼
QUIC / HTTP
    │
    ▼
Destination
```

The data plane should remain fast and lightweight.

---

# 73. Control Plane vs Data Plane

The distinction is critical.

| Component             | Responsibility                |
| --------------------- | ----------------------------- |
| Discovery             | Find endpoints                |
| Routing Control Plane | Select paths                  |
| Iroh                  | Establish peer connectivity   |
| QUIC                  | Transport data                |
| CDN                   | Cache and serve content       |
| BGP                   | Internet reachability         |
| DNS                   | Name resolution               |
| GeoDNS                | Geographic endpoint selection |

Each layer should have a clearly defined responsibility.

---

# 74. Failure Handling

Routing should assume that failures are normal.

Potential failures include:

* Node failure
* Network failure
* ISP outage
* PoP failure
* Region failure
* Relay failure
* DNS failure
* Origin failure
* Congestion
* Hardware failure

The routing system should continuously seek viable alternatives.

---

# 75. Failure Recovery

The general recovery loop is:

```text
Path
 │
 ▼
Monitor
 │
 ▼
Failure detected
 │
 ▼
Remove / deprioritize path
 │
 ▼
Select alternative
 │
 ▼
Reconnect
 │
 ▼
Monitor
```

---

# 76. Regional Failover

A regional service can fail over to another region.

```text
US West
   X
   │
   ▼
US Central
   │
   ▼
Service
```

GeoDNS and Anycast can assist at the global edge while mesh routing handles the internal path.

---

# 77. Global Failover

If an entire region becomes unavailable:

```text
              GLOBAL SERVICE
                    │
       ┌────────────┼────────────┐
       │            │            │
    Americas      Europe        Asia
       X            UP            UP
```

Traffic can shift toward healthy regions.

---

# 78. Route Security

Routing should protect against:

* Unauthorized route injection
* Endpoint spoofing
* Identity impersonation
* Malicious peers
* Route hijacking
* Stale routes
* Replay of obsolete routing information

Cryptographic identity and authenticated control-plane communication are fundamental to the design.

---

# 79. Defense in Depth

No single routing mechanism should be considered sufficient.

The architecture uses multiple layers:

```text
DNS
 │
GeoDNS
 │
BGP
 │
PoP
 │
CDN
 │
Mesh
 │
Iroh
 │
QUIC
```

Failure at one layer does not necessarily mean failure of the entire service.

---

# 80. Routing Abstraction

Applications should not need to manually choose:

```text
IP address
port
relay
PoP
origin
```

Instead:

```text
Service ID
```

or:

```text
Peer ID
```

should be enough.

The routing infrastructure handles the underlying path.

---

# 81. Example: Public API

```text
User
 │
 ▼
api.example.com
 │
 ▼
DNS
 │
 ▼
GeoDNS
 │
 ▼
Anycast
 │
 ▼
PoP
 │
 ▼
CDN / Edge
 │
 ▼
Routing Engine
 │
 ▼
Healthy Origin
 │
 ▼
Response
```

---

# 82. Example: P2P File Transfer

```text
Peer A
 │
 ▼
Peer ID
 │
 ▼
Discovery
 │
 ▼
Candidate Peers
 │
 ▼
Routing
 │
 ▼
Best Path
 │
 ▼
Iroh
 │
 ▼
QUIC
 │
 ▼
Peer B
```

---

# 83. Example: CDN Cache Miss

```text
Client
 │
 ▼
Anycast PoP
 │
 ▼
Cache MISS
 │
 ▼
Routing Engine
 │
 ├── Origin A
 ├── Origin B
 └── Origin C
        │
        ▼
    Best Origin
        │
        ▼
      Response
        │
        ▼
       Cache
        │
        ▼
      Client
```

---

# 84. Example: Node Failure

```text
Primary Node
     │
     X
     │
     ▼
Health Controller
     │
     ▼
Routing Update
     │
     ▼
Secondary Node
     │
     ▼
Service Continues
```

---

# 85. Example: Direct Peer Failure

```text
Peer A
 │
 ▼
Direct Peer B
 │
 X
 │
 ▼
Iroh Relay
 │
 ▼
Peer B
```

The application can continue without requiring a new peer identity.

---

# 86. Routing Metrics

The network can expose metrics such as:

### Connectivity

* Connected peers
* Active routes
* Direct connections
* Relay connections

### Performance

* RTT
* Throughput
* Packet loss
* Jitter

### Reliability

* Connection failures
* Route failures
* Failovers
* Recovery time

### Infrastructure

* PoP health
* Node capacity
* Relay utilization
* CDN utilization

### Service

* Request latency
* Origin latency
* Cache hit ratio
* Error rates

---

# 87. Routing Observability

A routing dashboard should allow operators to see:

```text
Service
 │
 ├── Current route
 ├── Alternative routes
 ├── Latency
 ├── Capacity
 ├── Health
 ├── Region
 └── Failover state
```

For a peer:

```text
Peer
 │
 ├── Direct endpoint
 ├── Local endpoint
 ├── Relay
 ├── RTT
 └── Connection state
```

---

# 88. Route Debugging

A useful routing diagnostic should explain why a route was selected.

Example:

```text
Destination:
    peer-123

Selected:
    Direct connection

Reason:
    Authorized
    18 ms RTT
    0.1% loss
    Healthy
```

Or:

```text
Destination:
    api.example.com

Selected:
    US-West PoP

Reason:
    GeoDNS region match
    Healthy
    22 ms RTT
    72% capacity
```

This makes routing behavior understandable to operators.

---

# 89. Route Tracing

The platform should eventually support route tracing.

Example:

```text
Client
  ↓
DNS
  ↓
GeoDNS
  ↓
PoP-A
  ↓
Mesh Node-17
  ↓
Origin-B
```

For P2P:

```text
Peer A
  ↓
Direct
  ↓
Peer B
```

or:

```text
Peer A
  ↓
Relay-C
  ↓
Peer B
```

---

# 90. Routing API

The platform can expose routing information through an internal API.

Conceptually:

```text
GET /routing/service/{service}
GET /routing/peer/{peer}
GET /routing/routes
GET /routing/health
GET /routing/trace/{destination}
```

The API should expose routing state without exposing sensitive infrastructure information unnecessarily.

---

# 91. Routing Configuration

Routing policies should be declarative.

Example:

```yaml
routing:
  mode: adaptive

  preferences:
    latency: high
    locality: high
    capacity: medium
    cost: medium

  failover:
    enabled: true

  direct_peer_connections:
    preferred: true

  relay:
    enabled: true
```

The control plane translates the configuration into routing behavior.

---

# 92. Default Routing Policy

A reasonable default policy is:

```text
1. Validate destination
2. Authenticate identity
3. Gather candidate paths
4. Remove invalid paths
5. Prefer direct connectivity
6. Prefer healthy paths
7. Prefer low-latency paths
8. Prefer adequate-capacity paths
9. Consider locality
10. Consider cost
11. Establish connection
12. Monitor continuously
13. Fail over when necessary
```

---

# 93. Routing Philosophy

The mesh should follow a simple principle:

> **Find many possible paths, select the best viable path, continuously measure it, and be ready to change when conditions change.**

This is fundamentally different from a static network topology.

The network is adaptive.

---

# 94. Relationship to Discovery

The complete relationship between the two systems is:

```text
                  DISCOVERY
                      │
       ┌──────────────┼──────────────┐
       │              │              │
   Bluetooth        mDNS          Pkarr
       │              │              │
       └──────────────┼──────────────┘
                      │
                     DHT
                      │
                      ▼
               Candidate Paths
                      │
                      ▼
                   ROUTING
                      │
       ┌──────────────┼──────────────┐
       │              │              │
    Direct          PoP            Relay
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ▼
                    IROH
                      │
                      ▼
                    QUIC
                      │
                      ▼
                  DESTINATION
```

Discovery and routing therefore form a continuous pipeline.

---

# 95. Relationship to Networking

The three documents can be understood as:

```text
DISCOVERY
"Where is it?"
      │
      ▼
ROUTING
"How should I reach it?"
      │
      ▼
NETWORKING
"How does the entire global networking fabric operate?"
```

This separation keeps the architecture modular.

---

# 96. Complete Mesh Architecture

The broader mesh can now be represented as:

```text
                         APPLICATION
                              │
                              ▼
                         SERVICE ID
                              │
                 ┌────────────┴────────────┐
                 │                         │
              INTERNET                    P2P
                 │                         │
                DNS                     DISCOVERY
                 │                         │
              GeoDNS                   Bluetooth
                 │                      mDNS
              Anycast                  Pkarr
                 │                      DHT
                BGP                       │
                 │                        ▼
                PoP                 Candidate Paths
                 │                        │
                CDN                       │
                 │                        ▼
                 └──────────────►     ROUTING
                                        │
                              ┌─────────┼─────────┐
                              │         │         │
                           Direct      PoP       Relay
                              │         │         │
                              └─────────┼─────────┘
                                        │
                                       Iroh
                                        │
                                       QUIC
                                        │
                                        ▼
                                   MESH NODES
                                        │
                          ┌─────────────┼─────────────┐
                          │             │             │
                       Compute       Storage       Services
                          │             │             │
                          └─────────────┼─────────────┘
                                        │
                                      Origins
```

---

# 97. Summary

The Mesh Routing layer provides the decision-making system that connects discovery to actual network transport.

Its responsibilities include:

* Selecting paths
* Ranking endpoints
* Managing routing policies
* Preferring direct connections
* Selecting relays
* Integrating with PoPs
* Supporting GeoDNS
* Integrating with BGP Anycast
* Selecting CDN origins
* Managing service failover
* Supporting regional routing
* Monitoring route health
* Adapting to changing network conditions
* Supporting cost and capacity awareness
* Maintaining routing state
* Protecting routing decisions
* Providing route observability

The resulting architecture is:

```text
DISCOVERY
   │
   │ Find possible destinations
   ▼
CANDIDATES
   │
   │ Evaluate
   ▼
ROUTING
   │
   │ Select best viable path
   ▼
IROH
   │
   │ Establish connectivity
   ▼
QUIC
   │
   │ Transport
   ▼
DESTINATION
```

For Internet services:

```text
DNS
 │
 ▼
GeoDNS
 │
 ▼
BGP Anycast
 │
 ▼
PoP
 │
 ▼
CDN
 │
 ▼
Mesh Routing
 │
 ▼
Origin
```

For decentralized peers:

```text
Discovery
 │
 ▼
Routing
 │
 ▼
Direct Iroh
 │
 ├── Success ──► Peer
 │
 └── Failure
        │
        ▼
      Relay
        │
        ▼
       Peer
```

The routing layer therefore becomes the **adaptive decision engine of the mesh**: discovery provides the possible destinations, routing determines the best path, Iroh establishes the connection, and QUIC transports the data.

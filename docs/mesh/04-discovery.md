# Mesh Discovery

## Overview

The Autheo Mesh discovery system enables nodes to locate, identify, and establish communication with other nodes across local networks, nearby wireless environments, and the public Internet.

Discovery is designed as a **layered, decentralized system** rather than relying on a single discovery mechanism.

The mesh uses multiple discovery methods according to proximity, network availability, and reachability:

```text
                    MESH DISCOVERY
                          │
          ┌───────────────┼────────────────┐
          │               │                │
       Local           Nearby           Remote
      Network          Devices           Network
          │               │                │
        mDNS          Bluetooth          Pkarr
          │               │                │
          └───────────────┼────────────────┘
                          │
                          ▼
                    Public Discovery
                          │
                    BitTorrent DHT
                          │
                          ▼
                   Global Fallback
```

The system prioritizes the **lowest-cost and most local discovery mechanism available** before progressively falling back to wider discovery mechanisms.

The general principle is:

> **Discover locally first, discover remotely when necessary, and never require a centralized discovery server for the mesh to function.**

---

# 1. Discovery Goals

The discovery subsystem is responsible for answering several different questions.

### Node discovery

> What nodes are available?

### Identity discovery

> Which cryptographic identity belongs to this node?

### Address discovery

> Where can the node be reached?

### Capability discovery

> What can the node provide?

### Service discovery

> Which services are available on the node?

### Connectivity discovery

> Which transport can I use to communicate with it?

### Reachability discovery

> Can I establish a direct connection, or do I need a relay?

These are related but distinct problems.

A node being discovered does **not** necessarily mean that it is directly reachable.

---

# 2. Discovery Architecture

The discovery system is organized into several layers.

```text
┌──────────────────────────────────────────────┐
│              Application Layer               │
│                                              │
│   "Find a compute node"                      │
│   "Find nearby device"                       │
│   "Find peer for file transfer"              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             Discovery Manager                │
│                                              │
│ Candidate collection                         │
│ Identity resolution                           │
│ Capability filtering                          │
│ Address selection                             │
│ Transport selection                           │
└──────────────────────┬───────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
      Local          Nearby         Remote
        │              │              │
       mDNS         Bluetooth        Pkarr
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                Global Discovery
                       │
                 BitTorrent DHT
                       │
                       ▼
                  Peer Records
```

The Discovery Manager abstracts the underlying mechanisms from applications.

Applications should not need to know whether a peer was discovered through:

* Bluetooth
* mDNS
* Pkarr
* BitTorrent DHT
* Another mesh peer
* A cached discovery record

---

# 3. Discovery Priority

Discovery should generally proceed from the most local and inexpensive mechanisms toward broader mechanisms.

The preferred order is:

```text
1. Existing Connections
        ↓
2. Local Cache
        ↓
3. Bluetooth
        ↓
4. mDNS
        ↓
5. Pkarr
        ↓
6. BitTorrent DHT
        ↓
7. Relay-assisted discovery / connectivity
```

This does not mean every node must execute every mechanism sequentially.

Discovery methods can operate concurrently when latency matters.

The Discovery Manager can assign candidates a priority based on:

* Latency
* Proximity
* Transport availability
* Historical reliability
* Identity confidence
* Network cost
* Capability match

---

# 4. Discovery Is Not Connectivity

A critical distinction is:

```text
Discovery ≠ Connectivity
```

Discovery answers:

> "I know this node exists and have information about it."

Connectivity answers:

> "I can communicate with this node."

For example:

```text
Bluetooth Advertisement
        │
        ▼
Peer Discovered
        │
        ▼
Identity Known
        │
        ▼
Network Address Unknown
        │
        ▼
mDNS / Pkarr / DHT
        │
        ▼
Address Discovered
        │
        ▼
Connection Attempt
        │
        ├── Direct
        │
        └── Relay
```

This separation allows discovery to continue functioning even when direct connectivity is temporarily unavailable.

---

# 5. Peer Identity

Every mesh node should have a cryptographically verifiable identity.

Discovery records should associate network information with that identity.

Conceptually:

```text
Peer Identity
     │
     ├── Public Key
     ├── Peer ID
     ├── Addresses
     ├── Transports
     ├── Capabilities
     ├── Services
     └── Metadata
```

The identity is more important than the network address.

IP addresses can change.

Ports can change.

Local networks can change.

Internet connections can change.

The cryptographic identity should remain stable.

Therefore:

```text
Identity = Stable

Address = Dynamic
```

---

# 6. Peer Records

A discovery record should contain enough information to identify and contact a node without exposing unnecessary metadata.

A conceptual record may contain:

```json
{
  "peer_id": "peer-id",
  "public_key": "public-key",
  "addresses": [
    "/ip4/192.168.1.25/tcp/443",
    "/ip6/...."
  ],
  "transports": [
    "bluetooth",
    "quic",
    "tcp"
  ],
  "capabilities": [
    "storage",
    "compute",
    "relay"
  ],
  "services": [
    "mesh",
    "compute"
  ],
  "timestamp": 0,
  "signature": "signature"
}
```

The actual wire representation should be defined separately from this conceptual example.

---

# 7. Bluetooth Discovery

Bluetooth provides a mechanism for discovering physically nearby devices without requiring the devices to already share an IP network.

This is particularly useful for:

* Phones
* Laptops
* ESP32 devices
* Embedded systems
* IoT devices
* Offline environments
* Temporary mesh networks
* Disaster-response environments
* Local device-to-device communication

Conceptually:

```text
Device A
   │
   │ Bluetooth Advertisement
   ▼
Device B
   │
   │ Peer Information
   ▼
Discovery Manager
```

Bluetooth discovery establishes **physical proximity**, not necessarily Internet reachability.

---

# 8. Bluetooth as a Proximity Layer

Bluetooth is especially valuable because it can operate before traditional IP networking has been established.

For example:

```text
No Wi-Fi
No Internet
No DNS
        │
        ▼
   Bluetooth
        │
        ▼
Discover Nearby Peer
        │
        ▼
Exchange Identity
        │
        ▼
Establish Mesh Relationship
```

This enables the mesh to bootstrap communication from the physical environment.

---

# 9. Bluetooth Identity Exchange

A Bluetooth-discovered device should not automatically be trusted.

The preferred flow is:

```text
Bluetooth Discovery
        │
        ▼
Peer Identifier
        │
        ▼
Cryptographic Identity
        │
        ▼
Signature Verification
        │
        ▼
Peer Accepted
```

Bluetooth therefore acts as a **discovery transport**, not the ultimate trust mechanism.

Cryptographic identity should determine whether the discovered peer is authentic.

---

# 10. Bluetooth Limitations

Bluetooth discovery has several limitations:

* Short physical range
* Platform restrictions
* Limited bandwidth
* Battery considerations
* Device permission requirements
* Mobile operating system restrictions
* Potentially unreliable background discovery

Therefore Bluetooth should not be treated as the global discovery mechanism.

Its primary role is **nearby discovery and mesh bootstrapping**.

---

# 11. mDNS

Multicast DNS (mDNS) provides local-network service discovery.

It is useful when nodes are connected to the same local network.

For example:

```text
Laptop
   │
   ├── Wi-Fi
   │
   ▼
Local Network
   │
   ├── ESP32
   ├── Desktop
   ├── Server
   └── Phone
```

mDNS allows nodes to discover services without requiring a centralized DNS server.

---

# 12. Local Service Discovery

A mesh node can advertise a service on the local network.

Conceptually:

```text
_mesh._udp.local
```

A node can announce:

```text
Service
   │
   ├── Peer ID
   ├── Port
   ├── Transport
   └── Service metadata
```

Another node can query the local network and discover available peers.

---

# 13. mDNS Discovery Flow

```text
Node A
  │
  │ mDNS Query
  ▼
Local Network
  │
  ├───────────────┐
  │               │
  ▼               ▼
Node B           Node C
  │               │
  └── Response ───┘
          │
          ▼
    Discovery Manager
          │
          ▼
    Identity Validation
```

mDNS is therefore particularly useful for:

* Home networks
* Office networks
* Local data centers
* Developer environments
* LAN gaming
* Local compute clusters
* IoT environments

---

# 14. mDNS Limitations

mDNS generally operates within a local network boundary.

It is not intended to provide global Internet discovery.

It can also be affected by:

* VLAN segmentation
* Wi-Fi isolation
* Firewall policies
* Multicast filtering
* Router configuration
* Enterprise network policies

When mDNS cannot find the desired peer, the discovery system should escalate to another mechanism.

---

# 15. Pkarr

Pkarr provides a decentralized mechanism for publishing and resolving peer information using a distributed network rather than a conventional centralized discovery service.

Pkarr can be used to associate a stable peer identity with current addressing information.

Conceptually:

```text
Stable Peer Identity
        │
        ▼
Signed Peer Record
        │
        ▼
Pkarr
        │
        ▼
Peer Lookup
        │
        ▼
Current Addresses
```

This is especially useful when peers are not on the same local network.

---

# 16. Why Pkarr Is Important

Traditional local discovery does not work well when:

```text
Peer A
   │
   │ Internet
   │
   ▼
Peer B
```

The devices may be:

* In different cities
* Behind different routers
* On different ISPs
* Using dynamic IP addresses
* Moving between networks

A stable cryptographic identity allows address information to change without changing the identity of the peer.

```text
Peer ID
  │
  ├── Address A
  │
  ├── Address B
  │
  └── Address C
```

---

# 17. Signed Discovery Records

Remote discovery should be authenticated.

A peer should publish a signed record.

Conceptually:

```text
Peer Identity
      │
      ▼
Create Record
      │
      ▼
Sign Record
      │
      ▼
Publish
      │
      ▼
Remote Peer Retrieves Record
      │
      ▼
Verify Signature
      │
      ▼
Accept / Reject
```

This prevents an arbitrary participant from simply claiming:

> "This IP address belongs to Peer X."

The cryptographic signature provides the binding between identity and record.

---

# 18. Pkarr vs mDNS

The two mechanisms serve different environments.

| Property               | mDNS                    | Pkarr                      |
| ---------------------- | ----------------------- | -------------------------- |
| Scope                  | Local network           | Remote/global              |
| Central Server         | No                      | No                         |
| Internet Required      | Usually no              | Generally yes              |
| Local Discovery        | Excellent               | Not primary purpose        |
| Global Discovery       | No                      | Yes                        |
| Dynamic Addresses      | Limited                 | Strong                     |
| Cryptographic Identity | Application-dependent   | Core concept               |
| Primary Role           | Local service discovery | Decentralized peer records |

They should therefore complement one another rather than replace one another.

---

# 19. BitTorrent DHT

The BitTorrent Distributed Hash Table can provide another decentralized discovery mechanism.

A DHT allows peers to locate information without relying on one centralized database.

Conceptually:

```text
              DHT
               │
     ┌─────────┼─────────┐
     │         │         │
   Peer A    Peer B    Peer C
     │         │         │
     └─────────┼─────────┘
               │
           Peer Record
```

The DHT can serve as a **fallback discovery layer** when more direct mechanisms cannot locate a peer.

---

# 20. Why Use DHT as a Fallback?

The discovery stack should not depend entirely on one system.

For example:

```text
Bluetooth
    │
    └── No nearby peer

mDNS
    │
    └── Not on same LAN

Pkarr
    │
    └── Record unavailable / stale

DHT
    │
    ▼
Search distributed peer network
```

This creates resilience.

If one discovery mechanism fails, another can provide an alternative path.

---

# 21. DHT Discovery Model

A node can use a peer identifier or content-derived key to locate records in the DHT.

Conceptually:

```text
Peer Identity
      │
      ▼
Derive Lookup Key
      │
      ▼
DHT Query
      │
      ▼
Distributed Nodes
      │
      ▼
Peer Record
      │
      ▼
Validate
      │
      ▼
Connect
```

The DHT should be treated as an **untrusted discovery source**.

Retrieved records must still be cryptographically validated.

---

# 22. Discovery Hierarchy

The complete discovery architecture is:

```text
                         PEER
                          │
                          ▼
                 ┌────────────────┐
                 │ Discovery      │
                 │ Manager        │
                 └───────┬────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
         Connection     Cache     Local
         Table                    Discovery
                                    │
                             ┌──────┴──────┐
                             │             │
                         Bluetooth       mDNS
                             │             │
                             └──────┬──────┘
                                    │
                                    ▼
                              Remote Discovery
                                    │
                             ┌──────┴──────┐
                             │             │
                           Pkarr          DHT
                             │             │
                             └──────┬──────┘
                                    │
                                    ▼
                              Peer Records
                                    │
                                    ▼
                             Address Selection
                                    │
                                    ▼
                              Connectivity
```

---

# 23. Parallel Discovery

Discovery does not always need to be sequential.

For latency-sensitive applications, several mechanisms can run simultaneously.

```text
                    Discovery Request
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Bluetooth          mDNS             Pkarr
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                     Candidate Set
                           │
                           ▼
                       Validation
```

The system can then select the best candidate.

---

# 24. Candidate Ranking

A discovered peer should not simply be treated as:

```text
FOUND = TRUE
```

Instead, each candidate should receive a score based on characteristics such as:

* Identity validity
* Address validity
* Transport availability
* Latency
* Proximity
* Connection reliability
* Capability match
* Freshness of record
* Network cost

Conceptually:

```text
Candidate
    │
    ├── Identity ─────── Valid
    ├── Address ──────── Valid
    ├── Transport ────── QUIC
    ├── Latency ──────── 12 ms
    ├── Capability ───── Compute
    └── Freshness ────── Recent
             │
             ▼
        Candidate Score
             │
             ▼
       Best Connection
```

---

# 25. Discovery Cache

Nodes should maintain a local discovery cache.

A cache can store:

* Peer ID
* Public key
* Known addresses
* Last successful connection
* Last discovery source
* Transport capabilities
* Services
* Capability metadata
* Record timestamp

Conceptually:

```text
Discovery Cache

Peer A
 ├── Identity
 ├── Address
 ├── Transport
 └── Last Seen

Peer B
 ├── Identity
 ├── Address
 ├── Transport
 └── Last Seen
```

Caching reduces unnecessary discovery traffic.

---

# 26. Cache Expiration

Discovery records are dynamic.

Addresses can change.

Peers can disappear.

Services can stop.

Therefore records require expiration.

```text
Record Created
      │
      ▼
Valid
      │
      ▼
Age Increases
      │
      ▼
Stale
      │
      ▼
Refresh
      │
      ├── Success → Valid
      │
      └── Failure → Remove / Downgrade
```

The exact TTL should depend on the discovery mechanism and record type.

---

# 27. Discovery Through Existing Peers

A connected peer can also help discover additional peers.

This allows the mesh to expand beyond directly observable nodes.

```text
Node A
 │
 │ Connected
 ▼
Node B
 │
 │ Knows
 ├──────────────► Node C
 │
 └──────────────► Node D
```

Node B can provide candidate information for Nodes C and D.

However, forwarded discovery information must remain untrusted until independently verified.

---

# 28. Peer Exchange

Connected nodes can exchange peer candidates.

A peer exchange message can contain:

```text
Peer ID
Public Key
Addresses
Transport Types
Capabilities
Record Timestamp
Signature
```

This can dramatically accelerate discovery in larger mesh networks.

The resulting architecture becomes:

```text
Direct Discovery
       +
Peer Exchange
       +
DHT
       +
Pkarr
       +
Local Discovery
```

---

# 29. Discovery Security

Discovery is an attack surface.

An attacker may attempt to:

* Inject fake peers
* Redirect traffic
* Poison discovery records
* Flood nodes with candidates
* Replay old records
* Impersonate peers
* Exhaust connection resources
* Track node activity

Discovery must therefore be treated as **untrusted input**.

---

# 30. Cryptographic Verification

Every remote peer record should ultimately be tied to a cryptographic identity.

The basic principle is:

```text
Discovery Source
       │
       ▼
Peer Record
       │
       ▼
Signature
       │
       ▼
Public Key
       │
       ▼
Identity Verification
       │
       ├── Valid → Candidate
       │
       └── Invalid → Reject
```

Discovery mechanisms provide information.

Cryptography determines whether that information can be trusted.

---

# 31. Replay Protection

Old discovery records can be replayed by attackers.

For example:

```text
Old Address
    │
    ▼
Attacker Replays Record
    │
    ▼
Node Attempts Connection
```

Records should therefore contain freshness information such as:

* Timestamp
* Sequence number
* Expiration
* Version
* Nonce

The verification process should reject records outside acceptable freshness limits.

---

# 32. Discovery Poisoning

A malicious node could attempt to flood a peer with false records.

For example:

```text
Peer A
  │
  ├── Fake Peer 1
  ├── Fake Peer 2
  ├── Fake Peer 3
  ├── Fake Peer 4
  └── Fake Peer 5
```

Mitigations include:

* Cryptographic identity verification
* Candidate limits
* Rate limiting
* Source reputation
* Duplicate detection
* Record expiration
* Connection backoff
* Resource quotas

---

# 33. Sybil Resistance

Discovery itself should not be assumed to provide Sybil resistance.

An attacker can potentially generate many identities.

Therefore:

```text
Discovery Identity
        ≠
Trusted Identity
```

Higher-level systems may impose additional requirements based on:

* Cryptographic credentials
* Reputation
* Staking
* Authorization
* Resource commitments
* Application-specific trust

For example, a compute marketplace may require a provider to possess a valid network identity and meet additional economic or technical requirements before accepting workloads.

---

# 34. Privacy

Discovery can expose information about node presence and network topology.

Examples include:

* Device existence
* Peer relationships
* IP addresses
* Service types
* Network capabilities
* Availability patterns

Discovery implementations should therefore minimize unnecessary metadata.

Nodes should avoid broadcasting sensitive information unless required.

Where possible:

```text
Public Discovery
       │
       ▼
Minimal Metadata
       │
       ▼
Authenticated Connection
       │
       ▼
Private Capability Exchange
```

---

# 35. Local vs Remote Metadata

A node may expose different information depending on the discovery context.

### Local discovery

May advertise:

* Peer identity
* Local service
* Transport availability
* Local address

### Remote discovery

May expose only:

* Stable peer identity
* Signed addressing information
* Required transport metadata

Detailed capabilities can be exchanged after authentication.

---

# 36. Transport Selection

Discovery should identify available transports but should not permanently bind a peer to one transport.

A node may support:

```text
Bluetooth
Wi-Fi
TCP
QUIC
WebRTC
Relay
```

The Discovery Manager selects the appropriate transport based on:

* Reachability
* Performance
* Security
* Latency
* Availability
* Application requirements

---

# 37. QUIC

For Internet-based peer communication, QUIC can provide a modern encrypted transport with useful connection properties.

The discovery layer can provide the addresses required to establish the connection.

```text
Discovery
   │
   ▼
Peer Address
   │
   ▼
QUIC Connection
   │
   ▼
Encrypted Session
   │
   ▼
Mesh Protocol
```

Discovery and transport remain separate layers.

---

# 38. Direct Connectivity

After discovery, the node should attempt the best available direct path.

```text
Peer Discovered
      │
      ▼
Address Candidate
      │
      ▼
Direct Connection
      │
      ├── Success
      │
      └── Failure
             │
             ▼
          Alternate
          Address
             │
             ▼
           Relay
```

This allows the mesh to prefer direct communication whenever possible.

---

# 39. Relay Fallback

Discovery does not guarantee that two peers can establish a direct connection.

NAT, firewalls, carrier-grade NAT, and restrictive networks can prevent direct connectivity.

The architecture should therefore support relay-assisted connectivity where required.

```text
Peer A
  │
  │ Direct
  ├───────────────► Peer B
  │
  │ Failed
  ▼
Relay
  │
  └───────────────► Peer B
```

The relay should transport encrypted peer traffic without becoming the ultimate trust authority.

---

# 40. Complete Discovery and Connection Flow

The complete process can be represented as:

```text
                    APPLICATION
                         │
                         ▼
                "Find Peer / Service"
                         │
                         ▼
                Discovery Manager
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      Cache         Bluetooth          mDNS
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                   Candidate Set
                         │
                         ▼
                    Pkarr Lookup
                         │
                         ▼
                   DHT Fallback
                         │
                         ▼
                Candidate Validation
                         │
                         ▼
                 Address Selection
                         │
                         ▼
                Direct Connection
                         │
                  ┌──────┴──────┐
                  │             │
                Success        Fail
                  │             │
                  │             ▼
                  │           Relay
                  │             │
                  └──────┬──────┘
                         ▼
                  Secure Session
                         │
                         ▼
                  Capability Exchange
                         │
                         ▼
                  Application Traffic
```

---

# 41. Discovery State Machine

A node can model discovery as a state machine.

```text
UNKNOWN
   │
   ▼
DISCOVERING
   │
   ├───────────────┐
   │               │
   ▼               ▼
FOUND            NOT FOUND
   │               │
   ▼               ▼
VALIDATING       FALLBACK
   │               │
   ▼               │
VALID             │
   │               │
   ▼               │
CONNECTING ◄───────┘
   │
   ├──────────────┐
   │              │
   ▼              ▼
CONNECTED       FAILED
   │              │
   ▼              ▼
ACTIVE         RETRY / EXPIRE
```

This prevents discovery logic from becoming tightly coupled to connection management.

---

# 42. Failure Handling

Discovery must assume that individual mechanisms will fail.

Examples:

```text
Bluetooth unavailable
        ↓
Use mDNS

mDNS unavailable
        ↓
Use Pkarr

Pkarr unavailable
        ↓
Use DHT

Direct connection fails
        ↓
Try alternate address

All direct paths fail
        ↓
Use relay

Peer remains unreachable
        ↓
Cache candidate and retry later
```

The mesh should degrade gracefully rather than treating one discovery failure as a network failure.

---

# 43. Offline Operation

A major advantage of layered discovery is that some mesh functionality can continue without Internet connectivity.

For example:

```text
Internet unavailable
        │
        ▼
Bluetooth
        │
        ▼
Nearby Discovery
        │
        ▼
Local Mesh
        │
        ▼
Peer Communication
```

If a local IP network is available:

```text
Internet unavailable
        │
        ▼
mDNS
        │
        ▼
Local Mesh
```

Remote discovery mechanisms become available again when Internet connectivity returns.

---

# 44. Intermittent Connectivity

Nodes may frequently move between networks.

For example:

```text
Home Wi-Fi
    │
    ▼
Cellular
    │
    ▼
Office Wi-Fi
    │
    ▼
Public Wi-Fi
```

The cryptographic peer identity remains constant while network addresses change.

The discovery system should automatically refresh address records.

```text
Stable Identity
      │
      ├── Address A
      │
      ├── Address B
      │
      └── Address C
```

This is one of the primary advantages of identity-based discovery.

---

# 45. Discovery Manager Responsibilities

The Discovery Manager should be responsible for:

* Starting discovery mechanisms
* Collecting candidates
* Normalizing peer records
* Validating identities
* Checking record freshness
* Maintaining the discovery cache
* Ranking candidates
* Selecting transports
* Requesting peer information
* Handling discovery timeouts
* Triggering fallback mechanisms
* Managing discovery rate limits
* Providing candidates to connection management

It should **not** be responsible for:

* Application business logic
* Blockchain consensus
* Workload scheduling
* Resource accounting
* Application authorization
* Actual application data transfer

---

# 46. Discovery Interface

Applications should interact with a unified discovery interface.

Conceptually:

```text
discover_peer(peer_id)

discover_service(service_type)

discover_nearby()

discover_capability(capability)

resolve_peer(peer_id)

refresh_peer(peer_id)
```

The underlying implementation can select whichever discovery mechanism is appropriate.

For example:

```text
discover_nearby()
        │
        ├── Bluetooth
        └── mDNS

resolve_peer(peer_id)
        │
        ├── Cache
        ├── Pkarr
        └── DHT
```

This keeps applications independent of the discovery implementation.

---

# 47. Discovery Sources

Every candidate should retain information about where it came from.

Example:

```text
Peer A
 ├── Source: Bluetooth
 ├── Source: mDNS
 ├── Source: Pkarr
 └── Source: DHT
```

Multiple independent discovery sources increase confidence that the candidate is genuinely reachable.

However, multiple observations should not override cryptographic identity verification.

---

# 48. Discovery Metrics

Production deployments should monitor:

### Discovery latency

How long does it take to locate a peer?

### Discovery success rate

How often does discovery locate the requested peer?

### Source success rate

Which mechanisms are most effective?

### Cache hit rate

How frequently can peers be resolved without performing new discovery?

### Connection success rate

How often does discovery result in a successful connection?

### Fallback rate

How often does the system require DHT or relay fallback?

### Record freshness

How frequently are stale records encountered?

These metrics help identify problems with both discovery and network topology.

---

# 49. Recommended Discovery Strategy

The default strategy should be:

```text
1. Check existing connections
        ↓
2. Check local discovery cache
        ↓
3. Search Bluetooth when nearby discovery is relevant
        ↓
4. Search mDNS on local networks
        ↓
5. Resolve remote peer through Pkarr
        ↓
6. Query BitTorrent DHT if required
        ↓
7. Validate cryptographic identity
        ↓
8. Rank addresses and transports
        ↓
9. Attempt direct connection
        ↓
10. Attempt alternate paths
        ↓
11. Use relay if direct connectivity fails
        ↓
12. Cache successful peer information
```

This provides a practical balance between:

* Speed
* Locality
* Resilience
* Decentralization
* Privacy
* Network efficiency

---

# 50. Design Principle

The Autheo Mesh discovery architecture follows a simple hierarchy:

```text
                    DISCOVER
                       │
          ┌────────────┼────────────┐
          │            │            │
       Nearby         Local        Remote
          │            │            │
      Bluetooth       mDNS         Pkarr
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                 Global Fallback
                       │
                      DHT
                       │
                       ▼
                  Peer Record
                       │
                       ▼
                 Cryptographic
                   Validation
                       │
                       ▼
                   Connection
                       │
                 ┌─────┴─────┐
                 │           │
               Direct      Relay
```

The goal is not to build a single discovery network.

The goal is to create a **discovery fabric** in which multiple independent mechanisms cooperate.

---

# 51. Summary

Autheo Mesh uses a layered discovery architecture designed to operate across everything from nearby embedded devices to globally distributed Internet nodes.

The primary discovery mechanisms are:

| Mechanism      | Primary Role                     | Scope    |
| -------------- | -------------------------------- | -------- |
| Bluetooth      | Physical proximity discovery     | Nearby   |
| mDNS           | Local service discovery          | LAN      |
| Pkarr          | Identity/address discovery       | Internet |
| BitTorrent DHT | Decentralized fallback discovery | Global   |
| Peer Exchange  | Discovery propagation            | Mesh     |
| Cache          | Fast resolution                  | Local    |
| Relay          | Connectivity fallback            | Global   |

The architecture follows several core principles:

1. **Local discovery should be preferred when possible.**
2. **Remote discovery should not require a centralized authority.**
3. **Cryptographic identity should remain stable even when network addresses change.**
4. **Discovery information must be treated as untrusted until verified.**
5. **Discovery and connectivity are separate concerns.**
6. **Multiple discovery mechanisms should provide resilience.**
7. **Direct connections should be preferred over relays.**
8. **DHT discovery provides a decentralized fallback when direct mechanisms fail.**
9. **Caches reduce latency and network overhead.**
10. **The mesh should continue operating locally even when Internet connectivity is unavailable.**

The resulting architecture allows a device to move through increasingly broad discovery scopes:

```text
Physical Proximity
        ↓
Local Network
        ↓
Known Peer Records
        ↓
Distributed Global Discovery
        ↓
Direct Connectivity
        ↓
Relay Connectivity
```

The mesh therefore does not depend on a single centralized discovery service.

Instead, **Bluetooth, mDNS, Pkarr, DHT, peer exchange, caching, and cryptographic identity form a resilient discovery fabric capable of adapting to local, remote, intermittent, and partially disconnected environments.**

# Autheo Glossary

Canonical definitions for terms used across the Autheo documentation.

---

## $THEO

The native token of the Autheo Layer 1 blockchain. Used for transaction fees, staking, validator security, compute payments, and governance voting. There is one token for the entire ecosystem; no separate governance or utility tokens exist.

---

## Agentic OS

The developer-facing orchestration and toolkit layer of the Autheo platform. Includes the CLI, SDK, deployment manifest format, monitoring dashboard, and runtime agent framework for distributed workflows. See [AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md](./AGENTIC-OS-AND-DEVELOPER-TOOLKIT.md).

---

## Agent

A persistent, addressable process running inside or alongside a workload on the mesh. Agents have cryptographic identities, can communicate with other agents across the network, and can coordinate distributed workflows. Part of the Agentic OS runtime model.

---

## Attestation

A hardware-signed proof that a given workload is running inside a genuine confidential VM on specific hardware. Buyers can verify attestations before sending sensitive data to a node. Attestation records can be anchored to the L1.

---

## Autheo L1 / Layer 1

The Autheo Layer 1 blockchain. Built on the Cosmos SDK and CometBFT consensus engine. Provides trust, settlement, staking, governance, and identity anchoring for the ecosystem. Does not execute application workloads. See [L1-ARCHITECTURE.md](./L1-ARCHITECTURE.md).

---

## Autheo Marketplace

The compute resource exchange layer. Coordinates between buyers and providers: matches supply and demand, schedules workloads, manages pricing and billing, and submits payment claims to the L1. Does not own hardware. See [COMMODITY-MARKETPLACE.md](./COMMODITY-MARKETPLACE.md).

---

## Autheo Mesh

The peer-to-peer distributed compute fabric. A network of independently operated nodes that can accept, isolate, and execute workloads. Uses Iroh/QUIC transport, Firecracker microVMs for isolation, and CRDTs for distributed state. See [MESH-COMPUTE.md](./MESH-COMPUTE.md).

---

## Buyer

A developer, enterprise, or automated system that purchases compute capacity through the marketplace. Buyers pay in $THEO.

---

## Cell

In the Mesh Hive execution model, a cell is an ephemeral microVM executing a single workload or function. Equivalent to a Firecracker microVM instance.

---

## CometBFT

The Byzantine fault-tolerant consensus engine used by the Autheo L1 (formerly Tendermint BFT). Provides deterministic finality — a committed block cannot be reversed.

---

## Control Plane

The decision-making surface of the platform: identity checks, scheduling, policy enforcement, reputation updates, billing, governance, and settlement coordination. In Autheo, control-plane responsibilities are shared across the marketplace, the L1, and per-node coordination services; they do not carry the workload data path itself.

---

## Confidential Compute

Workload execution where the host operator cannot inspect the workload's memory or execution state. Implemented using AMD SEV-SNP or Intel TDX hardware features. Used for AI model protection, financial computation, and sensitive data processing.

---

## Cosmos SDK

The blockchain framework used to build the Autheo L1. Provides modules for accounts, staking, governance, token management, and transaction processing. Supports IBC for cross-chain communication.

---

## CRDT (Conflict-free Replicated Data Type)

A data structure that can be updated independently on multiple nodes and merged deterministically without coordination. Used in the Autheo Mesh for distributed state synchronization — node registries, routing tables, workload status — without requiring a central database.

---

## Delegator

A participant who stakes $THEO to a validator without running validator infrastructure directly. Shares in staking rewards and slashing risk proportional to their delegation.

---

## DHT (Distributed Hash Table)

A decentralized key-value lookup system used for address discovery in the Autheo Mesh. Peers publish their addresses to the DHT (via Pkarr/Mainline DHT) so other peers can find them without a central directory.

---

## Data Plane

The execution and traffic surface of the platform: workload runtime, service traffic, artifact movement, result delivery, and mesh network forwarding. The data plane is where work actually runs; it should continue operating safely even when parts of the control plane are degraded.

---

## Endpoint ID

A node's cryptographic identifier derived from its public key. Used to address peers in the mesh independently of their IP address. Two peers with the same endpoint ID always refer to the same node, even if the node's IP changes.

---

## Escrow

An optional payment model in which buyer funds are reserved on the L1 before a workload begins and released only when completion evidence satisfies marketplace policy. Escrow reduces counterparty risk for providers while preserving on-chain auditability.

---

## Firecracker

A lightweight Virtual Machine Monitor (VMM) developed by AWS. Used in the Autheo Mesh to provide hardware-isolated execution for workloads on shared physical infrastructure. Each workload runs in its own Firecracker microVM with a separate guest kernel. See [MESH-COMPUTE.md](./MESH-COMPUTE.md).

---

## Fluid Compute

Autheo's approach to warm workload execution. Nodes maintain pre-warmed microVMs that can accept workloads without cold-start initialization overhead. Multiple executions can reuse the same warm execution environment across their lifetime.

---

## Governance

The process by which $THEO stakers collectively make protocol decisions. Participants submit proposals, the community deliberates, and stakers vote. Approved proposals change protocol parameters, fee curves, treasury allocations, or trigger upgrades.

---

## IBC (Inter-Blockchain Communication)

The Cosmos SDK protocol for communication between independent blockchains. Enables token transfers and message passing between the Autheo L1 and other IBC-compatible chains.

---

## Iroh

The P2P networking library used for mesh peer connectivity. Provides QUIC-based transport, NAT traversal, hole punching, and relay fallback. Peers are addressed by endpoint ID (derived from public key), not by IP address.

---

## KVM (Kernel-based Virtual Machine)

The Linux kernel hypervisor used as the hardware virtualization layer underneath Firecracker. Provides the hardware isolation guarantees that Firecracker microVMs rely on.

---

## Locality

The placement and routing concept that describes how near a node or service is to a user, data source, or dependent system. Locality is broader than region alone; it can mean same host, same site, same metro, same region, or global placement.

---

## Mesh Hive

The compute execution model for the Autheo Mesh. Inspired by Vercel's Hive build infrastructure, rebuilt for a P2P network. Organizes execution as a five-layer stack: application → execution → peer → mesh → hardware.

---

## MicroVM

A minimal virtual machine optimized for fast startup and high density. In Autheo, microVMs are created using Firecracker on KVM. Each workload gets its own microVM with hardware-level isolation from co-tenant workloads on the same physical host.

---

## ML-KEM (Module Lattice Key Encapsulation Mechanism)

NIST-standardized post-quantum key encapsulation mechanism (formerly Kyber). Used in Autheo's mesh transport layer for key agreement. Provides forward secrecy against both classical and quantum adversaries.

---

## Node

A machine running the Autheo node software that participates in the mesh. Nodes can be data center servers, GPU workstations, edge devices, cloud VMs, or home servers. Nodes advertise capacity to the marketplace and execute assigned workloads.

---

## Node Operator / Provider

An individual or organization that operates one or more Autheo mesh nodes, advertises their capacity to the marketplace, and earns $THEO payments for completed workloads.

---

## Payment Claim

A marketplace-submitted settlement instruction asserting that a workload completed under the required policy and metering rules. The L1 uses the claim, plus any associated escrow or slashing logic, to finalize payment movement in $THEO.

---

## Peer

Synonymous with node in the P2P networking context. A peer is a mesh participant that discovers, connects to, and exchanges workloads with other peers.

---

## Pkarr

A decentralized address publication system. Stores signed DNS records through the BitTorrent Mainline DHT. Used in the Autheo Mesh so peers can publish their connectivity information without relying on a central DNS server. Records are signed with the peer's private key.

---

## Post-Quantum Cryptography (PQC)

Cryptographic algorithms believed to be secure against both classical and quantum computers. Autheo uses ML-KEM for key exchange as the default transport security. Relevant because classical public-key cryptography (RSA, EC-DH) would be vulnerable to a sufficiently powerful quantum computer.

---

## Proof of Stake (PoS)

The consensus security model of the Autheo L1. Validators commit $THEO as stake to participate in consensus. Honest behavior earns rewards. Malicious behavior triggers slashing. Security is proportional to the economic value staked.

---

## QUIC

The transport protocol used for peer-to-peer connections in the Autheo Mesh (via Iroh). QUIC runs over UDP, provides multiplexed streams with built-in TLS 1.3 encryption, and supports connection migration and 0-RTT reconnection.

---

## Region

The user-facing placement term for a geographic execution area exposed through scheduling APIs and deployment manifests. A region may contain multiple localities, sites, or edge clusters.

---

## Relay

A server used as a fallback when direct peer-to-peer connectivity cannot be established. In Iroh, relay traffic is end-to-end encrypted — the relay operator sees ciphertext only. Nodes prefer direct connections and use relays only when necessary.

---

## Reputation

A score assigned to mesh nodes based on their execution history, uptime, and on-chain attestation status. Reputation is anchored to the L1 and is transparent to all marketplace participants. Buyers can filter by minimum reputation. Higher reputation nodes can charge modest premiums.

---

## Scheduler

The component in the marketplace that selects which node(s) execute a given workload. The scheduler filters by workload requirements (CPU, GPU, region, etc.), ranks candidates by price and reputation, and dispatches the workload.

---

## Settlement

The final on-chain transfer or release of $THEO after a workload's payment claim has been accepted under marketplace and L1 rules. Settlement is distinct from metering, dispatch, or escrow creation; it is the moment economic state becomes final on the ledger.

---

## Slashing

A penalty applied to a validator's or provider's staked $THEO for malicious or negligent behavior. Defined by L1 governance. Applied on-chain, making penalties transparent and predictable.

---

## Staking

Committing $THEO to the L1 network to participate in or support consensus. Validators stake directly. Delegators stake to validators. Staking earns rewards and incurs slashing risk.

---

## TLS 1.3

The current version of the Transport Layer Security protocol. Used for all encrypted connections in the Autheo Mesh (over QUIC). Provides forward secrecy, authenticated encryption, and low-latency handshakes.

---

## Validator

An operator that runs L1 node software, participates in CometBFT consensus, and earns staking rewards for honest block production. Validators are the security backbone of the Autheo L1.

---

## Workload

Any computational task submitted to the Autheo Mesh for execution. Can be a containerized service, a serverless function, an AI inference job, a build pipeline, a database instance, or any other compute task that can be packaged for execution in a microVM or container.

---

## Zero-Trust

A security model where no node, network, or connection is granted implicit trust based on location. Every connection is authenticated and authorized regardless of how the peer was discovered or where it is located.

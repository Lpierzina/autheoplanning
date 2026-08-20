# Autheo Security and Quantum Resilience

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [Mesh Compute](./MESH-COMPUTE.md) · [L1 Architecture](./L1-ARCHITECTURE.md)

---

## Overview

Security in Autheo is not a feature layer applied on top of a working system. It is a design constraint that shapes every component from peer identity to workload isolation to economic incentives.

The core principle:

> The mesh operates over an untrusted network. No node, relay, provider, or network segment is inherently trusted. Trust is established through cryptographic verification and continuously enforced through authenticated connections, authorization policies, and on-chain reputation.

This document covers the full security stack: identity, transport encryption, post-quantum key exchange, workload isolation, zero-trust mesh architecture, and the quantum resilience strategy.

---

## 1. Zero-Trust Mesh

The mesh does not grant trust based on network location. A node is not trusted because it:
- Shares a LAN with another node
- Is in the same cloud region
- Was discovered through mDNS
- Is connected through the same relay
- Has an IP address associated with a known provider

Every connection follows the same process regardless of how the peer was discovered:

```
Discovered
    ↓
Authenticate (cryptographic identity verification)
    ↓
Authorize (capability and policy check)
    ↓
Establish encrypted connection
    ↓
Monitor (continuous observability)
```

Discovery establishes awareness. Authentication establishes identity. Authorization grants access. Monitoring maintains accountability.

---

## 2. Cryptographic Identity

Every mesh node has a keypair generated at node initialization. The public key is the node's identity. The node's endpoint ID is derived from this public key.

Properties of this identity model:
- **Self-sovereign.** No central authority issues or revokes node identities.
- **Verifiable.** Any peer can verify a node's identity against its public key without calling an external service.
- **Anchored to L1.** Public key fingerprints and attestations can be written to the Autheo L1, creating an immutable identity record visible to the entire ecosystem.

Key rotation is supported. When a node rotates its key, the new key is published via Pkarr/DHT with a signature from the old key, maintaining continuity of identity across the rotation.

---

## 3. Transport Security — TLS 1.3 and QUIC

All peer-to-peer connections use TLS 1.3 over QUIC. This provides:

- **Forward secrecy.** Session keys are ephemeral. Compromising a long-term private key does not decrypt past sessions.
- **Authenticated encryption.** All data is encrypted and authenticated. Tampering is detectable.
- **Connection migration.** QUIC connections survive IP address changes (relevant for mobile nodes and nodes with dynamic IPs).
- **0-RTT.** Repeat connections to known peers can skip the full handshake, reducing latency for frequently communicating nodes.

---

## 4. Post-Quantum Cryptography

Classical public-key cryptography (RSA, EC-based key exchange) is secure against classical computers but theoretically vulnerable to a cryptanalytically relevant quantum computer (CRQC) running Shor's algorithm.

The timeline for CRQC availability is uncertain. However, "harvest now, decrypt later" attacks are already a concern: an adversary can capture encrypted traffic today and decrypt it retroactively once CRQC is available. For infrastructure with long-lived identities and sensitive workloads, this is a meaningful risk.

Autheo's approach: **post-quantum key exchange is the default**, not an option.

### ML-KEM (Module Lattice-based Key Encapsulation Mechanism)

ML-KEM (formerly Kyber) is NIST's standardized post-quantum key encapsulation mechanism. It is based on the hardness of the Module Learning With Errors (MLWE) problem, which does not have a known efficient quantum algorithm.

ML-KEM is used for key agreement at the transport layer. The hybrid approach (classical + ML-KEM) can also be used during the transition period to provide security against both classical and quantum attackers simultaneously.

Practical impact on the mesh:
- All new connections use ML-KEM-based key exchange
- Session keys are forward-secret against quantum adversaries
- Historical traffic captured before the key exchange is not decryptable even by a future CRQC

### Post-Quantum Signatures

NIST is also standardizing post-quantum signature schemes (ML-DSA, SLH-DSA). As these mature and client/server library support stabilizes, Autheo will adopt them for identity signing and L1 transaction signatures. The L1 governance process will manage the migration timeline.

---

## 5. Workload Isolation

Multi-tenant execution — running workloads from multiple customers on the same physical hardware — requires strong isolation. The isolation model must ensure that a workload cannot:
- Read or modify another tenant's memory
- Observe another tenant's network traffic
- Exhaust shared resources in a way that degrades other tenants
- Escape its execution environment to the host OS

**Firecracker microVMs** provide this isolation using hardware virtualization (Linux KVM). Each workload gets:
- Its own guest kernel
- Its own virtual CPU(s)
- Its own virtual memory space
- Its own virtual network interface
- No access to host filesystem or other VMs

The attack surface of Firecracker is deliberately minimal — it does not emulate unnecessary virtual hardware. Compared to QEMU, Firecracker's VMM is dramatically smaller, reducing the exploitable code surface.

### Defense in Depth

MicroVM isolation is the primary boundary. Additional layers:
- **cgroups:** Resource quotas on CPU, memory, and I/O prevent one workload from starving others.
- **Namespaces:** Process, network, and filesystem namespaces provide OS-level isolation within the host.
- **Seccomp:** System call filtering reduces the host kernel attack surface available to a compromised guest.
- **Network policies:** Each microVM has its own virtual network interface. Intra-host traffic between VMs is filtered by the host networking stack.

---

## 6. Confidential Compute

For workloads handling particularly sensitive data — AI models, financial computations, private user data — hardware-based confidential computing provides an additional guarantee: the **host operator cannot inspect the workload's execution state**.

Supported technologies:
- **AMD SEV-SNP** (Secure Encrypted Virtualization with Secure Nested Paging): Encrypts VM memory with a per-VM key managed in hardware. The hypervisor cannot read the VM's memory.
- **Intel TDX** (Trust Domain Extensions): Similar memory encryption and integrity guarantees at the VM level.

When a workload requests confidential execution, the scheduler selects only nodes with the required hardware capability and verified attestation status.

### Remote Attestation

A buyer can verify that their workload is running inside a genuine confidential VM on legitimate hardware before sending sensitive data to it. The attestation process:

```
Buyer requests attestation
    ↓
Node generates attestation report (hardware-signed)
    ↓
Buyer verifies report against hardware vendor's root of trust
    ↓
Secure channel established with verified VM
    ↓
Buyer sends sensitive data / workload
```

Attestation records can also be anchored to the L1, allowing the marketplace and reputation system to incorporate attestation status into scheduling decisions.

---

## 7. Relay Security

When direct peer-to-peer connectivity fails, nodes use Iroh relays. Relay security properties:
- Traffic through relays is end-to-end encrypted at the QUIC/TLS layer
- The relay operator sees ciphertext only — no plaintext traffic
- Relay connections are authenticated; the relay cannot impersonate a peer
- Nodes prefer direct connections and only use relays as fallback

This means relay operators cannot perform man-in-the-middle attacks even if the relay infrastructure is compromised.

---

## 8. Blockchain Security Posture

On the L1 side:

**Validator key security:** Production validators should use Hardware Security Modules (HSMs) for signing keys. Key compromise allows a validator to be slashed. HSMs ensure the signing key is never exposed in software.

**DDoS protection:** Validators should operate behind sentry nodes — publicly reachable nodes that filter traffic before it reaches the validator. The validator's direct network location is not published.

**Slashing as economic deterrent:** The slashing mechanism makes attacks economically costly. An attacker must acquire stake to participate in consensus and risks losing that stake for malicious behavior.

**CometBFT finality:** Deterministic finality prevents long-range attacks that are possible against Nakamoto-style consensus. A finalized block cannot be reorganized.

---

## 9. Compliance and Auditability

All security-relevant events on the mesh and L1 are logged and auditable:
- Node connections and disconnections
- Workload dispatch and completion records
- Payment settlement
- Reputation updates
- Governance votes
- Slashing events

These records are either anchored to the L1 (immutable) or stored in append-only structured logs at the node level. Third-party auditors can verify the history of any node's behavior from on-chain records.

---

## Source Files

This document consolidates:
- `docs/mesh/06-security.md`
- `docs/mesh/secure-mesh-stack.md`
- `docs/mesh/05-quic.md`
- `docs/connectivity-paradigm.md` (security subsections)
- `docs/vm/firecracker-microvms.md` (isolation model)
- `docs/blockchain/02-consensus.md` (validator security)

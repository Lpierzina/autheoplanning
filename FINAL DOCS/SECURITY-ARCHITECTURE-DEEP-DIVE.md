# Autheo Security Architecture — Deep Dive

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [Mesh Compute](./MESH-COMPUTE.md) · [L1 Architecture](./L1-ARCHITECTURE.md) · [Routing and Discovery](./ROUTING-AND-DISCOVERY.md) · [Security Overview](./SECURITY-AND-QUANTUM-RESILIENCE.md)

---

## Table of Contents

1. [Security Philosophy and Design Principles](#1-security-philosophy-and-design-principles)
2. [Threat Model and Trust Boundaries](#2-threat-model-and-trust-boundaries)
3. [Identity and Authentication Model](#3-identity-and-authentication-model)
4. [Authorization Model and Policy Enforcement](#4-authorization-model-and-policy-enforcement)
5. [Key Management Lifecycle](#5-key-management-lifecycle)
6. [Encryption — In Transit, At Rest, In Use](#6-encryption--in-transit-at-rest-in-use)
7. [Quantum-Resilience Posture and Migration Strategy](#7-quantum-resilience-posture-and-migration-strategy)
8. [Attestation and Workload Integrity Verification](#8-attestation-and-workload-integrity-verification)
9. [Supply Chain Security](#9-supply-chain-security)
10. [Network Security Controls](#10-network-security-controls)
11. [Incident Response Model](#11-incident-response-model)
12. [Security Observability](#12-security-observability)
13. [Compliance and Auditability](#13-compliance-and-auditability)
14. [Security Best Practices by Role](#14-security-best-practices-by-role)

---

## 1. Security Philosophy and Design Principles

Autheo operates across an untrusted, adversarial network. Nodes are independently operated by unknown parties. Workloads are submitted by buyers who do not control the infrastructure executing them. Sellers expose hardware to code they did not write. Tokens and economic value move based on cryptographic claims.

None of this works without a principled, consistent security model. The foundational principles:

**Zero Trust.** No node, operator, agent, or network segment receives implicit trust. Every actor must authenticate, and every action must be authorized. Trust is not inherited from network topology, IP address range, co-location, or organizational affiliation.

**Cryptographic verification as the primary control.** Wherever possible, security properties are enforced by mathematical proof rather than administrative access control, audit trails, or policy documents. A correctly verified signature is a stronger control than a human-reviewed policy.

**Defense in Depth.** No single control is relied upon exclusively. Workload isolation, transport encryption, identity verification, and economic incentive alignment are layered so that the failure of any one control does not compromise the system.

**Least Privilege.** Nodes, agents, and workloads receive only the permissions required for their stated function. A storage node should not have the permission to accept compute workloads. A workload should not have access to the host OS.

**Assume Breach.** The design assumes that some nodes will be compromised at any given time. The goal is to limit blast radius, detect anomalies rapidly, and ensure that a compromised node cannot compromise the broader network state or other tenants' data.

**Economic Alignment as Security Primitive.** Stake, slashing, and reputation create financial incentives that reinforce cryptographic controls. An attacker who compromises a validator or provider node risks losing staked $THEO, making attacks economically costly in addition to technically difficult.

---

## 2. Threat Model and Trust Boundaries

### 2.1 Actors

The ecosystem involves the following principal types:

| Actor | Description | Trust Level |
|---|---|---|
| **Validator** | L1 consensus participant with staked $THEO | Staked trust — slash risk provides economic alignment |
| **Compute Provider** | Node operator offering execution capacity | Verified but not inherently trusted — reputation + staking |
| **Storage Provider** | Node operator offering persistent storage | Same as compute provider |
| **Workload Buyer** | Submitter of compute or storage jobs | Authenticated identity, payment-authorized |
| **End User** | Human interacting via dApps or developer tooling | Authenticated via wallet or agent credential |
| **Relay Operator** | Operator of Iroh relay infrastructure | No trust in plaintext — relays see only ciphertext |
| **Agent** | Automated process operating on behalf of a user | Delegated credentials, scoped capability |
| **L1 Governance Participant** | $THEO holder voting on protocol changes | On-chain identity, proposal-limited influence |

### 2.2 Trust Boundaries

```
╔══════════════════════════════════════════════════════════════════╗
║  L1 TRUST BOUNDARY                                               ║
║  CometBFT consensus · Slashing · Token economics                 ║
║  Validators: economically bound. Finality: deterministic.        ║
║                                                                  ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │  MESH TRUST BOUNDARY                                     │    ║
║  │  Cryptographic identity · Zero-trust transport           │    ║
║  │  Reputation-gated access · Attestation                   │    ║
║  │                                                          │    ║
║  │  ┌──────────────────────────────────────────────────┐   │    ║
║  │  │  WORKLOAD EXECUTION BOUNDARY                     │   │    ║
║  │  │  Firecracker microVM · Hardware isolation        │   │    ║
║  │  │  Confidential compute (SEV-SNP / TDX)            │   │    ║
║  │  │  Workload cannot observe host or co-tenants      │   │    ║
║  │  └──────────────────────────────────────────────────┘   │    ║
║  └─────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════╝
```

**L1 trust boundary:** Governed by economic stake and BFT consensus. Up to 1/3 of stake can be Byzantine without compromising finality. Economic slashing deters rational Byzantine behavior.

**Mesh trust boundary:** Governed by cryptographic identity and authenticated transport. No node inside the mesh boundary is trusted by virtue of being inside it — every connection is individually authenticated and authorized.

**Workload execution boundary:** Hardware-enforced isolation between workloads. The host OS, hypervisor, and other tenants cannot read or modify a workload's execution state. In confidential compute mode, even the provider operator cannot inspect workload memory.

### 2.3 Threat Categories and Mitigations

**Network-level threats:**

| Threat | Description | Mitigation |
|---|---|---|
| Eclipse attack | Attacker surrounds a node with malicious peers, controlling its view of the network | Peer diversity requirements; DHT-validated bootstrapping; multiple independent bootstrap sources |
| Sybil attack | Attacker creates many fake identities to gain disproportionate influence | Identity binding to L1 stake; minimum reputation thresholds; attestation requirements |
| Route poisoning | Attacker injects false routing information to redirect traffic | All routing advertisements are signed; unsigned or low-reputation advertisements are rejected |
| Man-in-the-middle | Attacker intercepts traffic between two legitimate nodes | Mutual authentication on all connections; certificate pinning to known public keys |
| Relay abuse | Attacker operates a relay to observe or filter traffic | End-to-end encryption makes relay traffic opaque; relay operators cannot read plaintext |
| BGP hijacking | Attacker diverts IP-level traffic to their infrastructure | QUIC connection authentication is IP-independent; misdirected traffic fails authentication |
| DDoS against validators | Flooding attack against validator nodes | Sentry node architecture; rate limiting; IP diversity |

**Execution-level threats:**

| Threat | Description | Mitigation |
|---|---|---|
| Workload escape | Malicious workload attempts to break out of microVM isolation | KVM hardware virtualization; Firecracker's minimal attack surface; seccomp filtering |
| Noisy neighbor | Workload consumes excessive resources, degrading co-tenants | cgroup resource quotas; namespace isolation; per-workload scheduling limits |
| Data exfiltration | Workload attempts to read other tenants' data | Hardware memory isolation; separate virtual network interfaces; no shared memory |
| Host OS compromise | Provider node's host OS is compromised | Defense in depth — workload boundary is hardware, not software; confidential compute removes need to trust host |
| Malicious provider | Provider intentionally runs modified code or returns false results | Redundant execution verification; on-chain slashing for provable misbehavior; buyer-side result verification |

**Cryptographic threats:**

| Threat | Description | Mitigation |
|---|---|---|
| Key compromise | Private key for a node identity is stolen | HSM storage for validators; key rotation with L1 continuity record; short-lived session keys |
| Harvest now, decrypt later | Adversary captures ciphertext today to decrypt with future CRQC | ML-KEM post-quantum key exchange for all new connections; session keys are ephemeral |
| Signature forgery | Attacker forges a signed routing record or attestation | Signatures verified against registered public keys; forged records fail verification |
| Replay attack | Attacker replays a legitimate authenticated message | Nonces and timestamps in signed messages; connection-level sequence numbers |

**Economic threats:**

| Threat | Description | Mitigation |
|---|---|---|
| Stake manipulation | Attacker manipulates reputation through wash trades | On-chain settlement; reputation based on verified completed work, not self-reported |
| Validator collusion | Validators collude to censor transactions | 2/3+ stake required for finality; slashing for equivocation; governance over validator set |
| Workload withholding | Provider accepts payment but discards workload | Escrow-based payment; partial results verified before full payment release |

---

## 3. Identity and Authentication Model

### 3.1 Identity Types

The Autheo ecosystem uses four distinct identity types, each with different trust assumptions and lifecycle characteristics:

**Node Identity**

A node identity is the foundational identity for any participant in the mesh. Every daemon instance — compute node, storage node, relay, gateway — has a node identity.

- Generated at node initialization from a cryptographically secure random number generator.
- Ed25519 keypair (NIST-approved elliptic curve). Public key serves as the node's permanent identifier.
- Endpoint ID = base32-encoded public key. This is human-readable and URL-safe.
- Published to Pkarr/DHT with signed address records. Any peer can discover current connection addresses from the endpoint ID alone.
- Private key stored on disk, optionally in an HSM (required for validators, recommended for infrastructure providers).
- Node identity persists across restarts, IP address changes, and geographic moves.

```
Node Initialization:

1. Generate Ed25519 keypair
   Private key: 32 bytes (stored encrypted, optionally in HSM)
   Public key:  32 bytes → base32 → Endpoint ID

2. Create signed address record:
   {
     "id": "<endpoint-id>",
     "addrs": ["<ip>:<port>", ...],
     "capabilities": ["compute", "gpu", "storage"],
     "timestamp": <unix-ts>,
     "sig": Ed25519(private_key, content)
   }

3. Publish to Pkarr/DHT

4. Optionally anchor to L1:
   L1.RegisterNode(pubkey_fingerprint, stake_amount, metadata_hash)
```

**Agent Identity**

An agent is an automated process that acts on behalf of a user. Agents have scoped, delegated credentials derived from a user or node identity.

- Short-lived credential (default TTL: 24 hours, configurable).
- Scope constraints: the agent credential specifies exactly which actions it can perform — e.g., submit workloads to compute market, read storage bucket X, sign messages for user Y.
- Cannot self-escalate. An agent cannot issue a new credential with broader scope than its own.
- Anchored to parent identity: the parent's signature proves delegation. Any peer can verify the delegation chain without contacting the parent.

**Workload Identity**

A workload identity is scoped to a single execution run. It is ephemeral and non-delegatable.

- Created by the scheduler at dispatch time.
- Valid only for the duration of the workload execution.
- Scoped to specific resources: the input data, the output channel, the result submission endpoint.
- Workload cannot access anything outside its stated scope.

**User Identity**

User identity is wallet-based, as is standard in blockchain ecosystems.

- Primary credential: Ed25519 or secp256k1 keypair (wallet).
- On-chain representation: account address derived from public key.
- Off-chain authentication: signed challenge-response proves key ownership without a server-maintained session.
- Interoperability: compatible with CosmJS and standard Cosmos SDK wallet tooling (Keplr, Leap, etc.).

### 3.2 Authentication Flow

All connections between mesh peers use mutual authentication during the TLS 1.3 / QUIC handshake:

```
Peer A                                          Peer B
   │                                               │
   │──── ClientHello (supported ciphers, random) ─→│
   │                                               │
   │←── ServerHello (chosen cipher, PQ key share) ─│
   │←── Certificate (Peer B's public key, sig)  ───│
   │←── CertificateVerify (handshake signature)  ──│
   │                                               │
   │   [Peer A verifies Peer B's identity         ]│
   │   [against known or DHT-resolved public key  ]│
   │                                               │
   │──── Certificate (Peer A's public key, sig) ──→│
   │──── CertificateVerify (handshake signature) ──→│
   │                                               │
   │   [Peer B verifies Peer A's identity         ]│
   │                                               │
   │←──────── Finished (both sides) ──────────────→│
   │                                               │
   │   [Encrypted, authenticated session active   ]│
```

Authentication fails if:
- The presented public key does not match the expected Endpoint ID.
- The signature on the certificate fails verification.
- The peer's public key fingerprint appears on the revocation list published to L1.
- The peer's reputation score is below the local policy threshold for the requested operation.

### 3.3 L1 Identity Anchoring

Node and validator identities can be anchored to the L1. This is required for validators (staking requires an on-chain identity) and strongly recommended for compute/storage providers participating in the marketplace.

L1 anchoring provides:
- **Revocation:** A compromised key fingerprint can be marked invalid on-chain, and all peers that query the L1 will reject that identity globally.
- **Reputation binding:** On-chain reputation and stake are linked to the node's public key fingerprint.
- **Attestation record:** The results of hardware attestation can be written to the L1, giving buyers auditable proof of execution environment integrity.
- **Governance participation:** L1-anchored identities can participate in governance votes proportional to their stake.

---

## 4. Authorization Model and Policy Enforcement

### 4.1 Capability-Based Access Control

Autheo uses capability-based access control rather than access control lists. A capability is a signed token that proves the bearer has been authorized to perform a specific action. Possessing the capability is sufficient proof of authorization — no additional lookup or server call is needed.

Capabilities are structured as:

```json
{
  "issuer": "<endpoint-id of delegator>",
  "subject": "<endpoint-id of bearer>",
  "capabilities": ["compute.submit", "storage.read:bucket-xyz"],
  "constraints": {
    "max_cpu_hours": 100,
    "allowed_regions": ["us-east", "eu-west"],
    "expiry": 1760000000
  },
  "issued_at": 1759990000,
  "sig": "<Ed25519 signature of above content by issuer>"
}
```

The bearer presents this capability when requesting access. The resource owner verifies:
1. The issuer's signature is valid.
2. The capability includes the requested action.
3. The constraints are satisfied (expiry, region, limits).
4. The issuer had authority to grant this capability (via their own capability chain or L1-registered authority).

### 4.2 Policy Enforcement Points

**Enforcement at the transport layer (PEP-1):** The TLS 1.3 / QUIC handshake enforces minimum authentication requirements. Connections from unauthenticated or revoked identities fail before any application data is transmitted.

**Enforcement at the protocol layer (PEP-2):** The mesh protocol layer checks capabilities before processing requests. A compute submission without a valid capability token is rejected before being queued or dispatched.

**Enforcement at the execution layer (PEP-3):** The microVM scheduler enforces resource constraints from the capability token. A workload that attempts to exceed its authorized CPU hours, memory allocation, or network bandwidth is throttled or terminated.

**Enforcement at the L1 settlement layer (PEP-4):** On-chain smart contracts enforce payment and staking rules. A provider cannot claim payment for a workload it didn't execute. A buyer cannot submit to the marketplace without sufficient escrow.

### 4.3 Marketplace Authorization

When a buyer submits a job to the marketplace:

```
Buyer submits job
       ↓
Marketplace contract verifies:
  - Buyer's L1 identity is not revoked
  - Escrow balance covers job cost
  - Job spec is within policy limits (workload type, duration, region)
       ↓
Scheduler matches to providers
       ↓
Provider verifies before accepting:
  - Buyer's capability token is valid and covers this job type
  - Buyer's reputation meets provider's minimum threshold
  - Provider's own capabilities match the job requirements
       ↓
Workload dispatched; capability token attached
       ↓
MicroVM enforces capability constraints at execution
```

---

## 5. Key Management Lifecycle

### 5.1 Key Generation

**For node operators:**

```bash
# Initialization generates the node keypair
autheo node init

# Output:
# Node Endpoint ID: <base32-encoded-pubkey>
# Private key: ~/.autheo/node.key (Ed25519, encrypted at rest)
# Public key: ~/.autheo/node.pub
# Pkarr record: signed and published
```

Key generation requirements:
- Must use OS-level CSPRNG (`/dev/urandom` on Linux; platform RNG on other OS).
- Private key is immediately encrypted with a passphrase or hardware key before being written to disk.
- For validators: private key should be generated inside an HSM and never leave HSM memory.

**For validators specifically:**

Validators are required to use a separate signing key distinct from their node identity key. This is the CometBFT validator signing key, used for vote messages. Best practice:

1. Generate consensus key inside an HSM (YubiHSM, AWS CloudHSM, or equivalent).
2. Configure CometBFT to call out to the HSM signer for consensus votes (using `priv_validator_laddr` pointing to a remote signer).
3. The consensus key is never stored in plaintext on the validator host.

### 5.2 Key Storage

| Actor | Recommended Storage | Minimum Acceptable |
|---|---|---|
| Validator consensus key | HSM (hardware) | Encrypted file, offline backup |
| Validator node identity | HSM or encrypted file | Encrypted file |
| Provider node identity | Encrypted file | Encrypted file |
| Agent credentials | Ephemeral in memory | Short-lived file, delete after use |
| User wallet key | Hardware wallet (Ledger, Trezor) | Encrypted keystore file |

**Encryption at rest for key files:**
- Key files are AES-256-GCM encrypted before writing to disk.
- The encryption key is derived from a passphrase using Argon2id (memory-hard KDF).
- Validators using remote signers: the key file on the remote signer host is encrypted; the remote signer process loads it only at startup.

### 5.3 Key Rotation

Key rotation is necessary when:
- A key's compromise is suspected or confirmed.
- The scheduled rotation interval has elapsed (recommended: annual rotation for node identities, more frequent for high-value validators).
- The key algorithm is deprecated (e.g., migrating from Ed25519 to an ML-DSA post-quantum signature scheme).

**Rotation process:**

```
1. Generate new keypair (same process as initial generation)

2. Publish rotation announcement:
   {
     "old_pubkey": "<fingerprint>",
     "new_pubkey": "<new-pubkey>",
     "effective_at": <timestamp>,
     "sig_old": Ed25519(old_private_key, rotation_record),
     "sig_new": Ed25519(new_private_key, rotation_record)
   }
   
   Publish to: Pkarr/DHT + L1 transaction

3. Begin using new key for all new connections

4. Maintain old key for ongoing sessions until they expire naturally

5. After grace period: decommission old key, remove from Pkarr
```

The dual-signature (old + new key signing the same rotation record) provides a chain of custody: any peer that previously knew the old public key can verify that the new key was legitimately introduced by the same entity.

### 5.4 Key Revocation

Immediate revocation is required when a key compromise is confirmed.

**Revocation process:**

```
1. Submit L1 revocation transaction:
   L1.RevokeKey(compromised_pubkey_fingerprint, reason, timestamp)
   Signed by: operator's governance key (separate from compromised key)
   
   OR, if the governance key is also compromised:
   Submit through the governance multisig / emergency committee process

2. Update Pkarr/DHT record to empty or point to revocation notice

3. All peers that check L1 revocation state will refuse connections
   from the revoked identity within one L1 epoch (~6 seconds finality)

4. On-chain reputation and stake are frozen pending investigation/slashing
```

**Note:** The revocation record on L1 is permanent and immutable. Historical actions by the revoked key are preserved in the audit log.

### 5.5 Key Recovery

The platform does not provide centralized key recovery. Loss of a node identity key means loss of that node's identity.

Operator responsibilities:
- Maintain encrypted offline backups of node keypairs.
- For validators: use multi-location backup with geographic diversity.
- Document the restoration procedure before it is ever needed.

Recovery from a lost key:
- Create a new node identity (new keypair, new Endpoint ID).
- Perform fresh DHT registration.
- Submit a new L1 registration transaction.
- Reputation does not transfer automatically — the new identity starts fresh (this is the correct behavior; identity continuity must be cryptographically proven).

If the node operated for a long time under the lost key, governance may allow an on-chain attestation linking old and new identity, subject to community vote and evidence of legitimate continuity.

---

## 6. Encryption — In Transit, At Rest, In Use

### 6.1 Encryption In Transit

All data moving across the mesh is encrypted. There are no unencrypted communication paths between authenticated nodes.

**Transport protocol:** QUIC + TLS 1.3.

TLS 1.3 improvements over previous versions relevant to the mesh:
- Only forward-secret cipher suites (ECDHE or ML-KEM key exchange). Session keys are ephemeral.
- Removed: RSA key exchange, CBC mode ciphers, SHA-1, MD5. No legacy modes to downgrade to.
- Encrypted handshake from the very first message after the key exchange. Even server certificates are encrypted in transit.
- 0.5 RTT and 0-RTT modes for low-latency reconnection to known peers.

**QUIC advantages for the mesh:**
- Multiplexed streams over a single UDP connection. Head-of-line blocking affects only the affected stream, not all traffic.
- Connection migration: the connection continues working if a node's IP address changes mid-session (relevant for mobile or dynamic-IP edge nodes).
- Built-in TLS 1.3 — transport and security are not separable layers that could be misconfigured to run without encryption.

**Post-quantum key exchange:**
All new connections negotiate ML-KEM-768 (or ML-KEM-1024 for high-security contexts) for key encapsulation, providing quantum-resistant session key establishment. Session keys are never derived from classical key exchange alone.

During the transition period (before ML-DSA signature schemes fully replace Ed25519 for identities), a hybrid approach is used:
- Classical ECDH + ML-KEM key exchange (X25519Kyber768Draft00 or similar)
- Session security requires breaking both the classical and post-quantum scheme simultaneously
- An attacker with a CRQC can break the classical component, but the ML-KEM component remains secure

**Relay traffic:** Traffic routed through Iroh relays is end-to-end encrypted at the QUIC/TLS layer before being handed to the relay. The relay handles QUIC packets, not plaintext. A compromised relay learns only:
- Source and destination Endpoint IDs (not real identities unless correlated externally)
- Packet sizes and timing (potential traffic analysis, mitigated by padding in high-security deployments)
- Nothing about the content

**DNS/address resolution traffic:** Pkarr/DHT address lookups are separate from the data plane. Address records are signed; a tampered record fails signature verification before use.

### 6.2 Encryption At Rest

**Node key material:** Encrypted with AES-256-GCM using an Argon2id-derived key from a passphrase (see Section 5.2).

**Workload data on provider storage:**
- Input data delivered to a workload is encrypted in transit (see above).
- If the buyer requires encryption at rest on the provider's storage, the input payload can be encrypted client-side before submission, with the decryption key delivered separately to the workload inside the microVM at execution time.
- This design ensures the provider's storage system never holds plaintext buyer data.

**Provider-side storage (persistent storage nodes):**
- Storage nodes must offer AES-256 encryption at rest as a minimum.
- Key management options:
  - **Provider-managed keys:** Provider encrypts/decrypts on behalf of buyer. Convenient but provider has access.
  - **Buyer-managed keys:** Buyer holds the encryption key; provides it only at access time via authenticated channel. Provider holds only ciphertext.
  - **Confidential storage (future):** Hardware-based encryption where neither provider nor network can access plaintext without the buyer's key.

**L1 state:** L1 state is a public ledger — all data written to the chain is visible to all validators and replicators. Do not write sensitive data to the L1 directly. Write commitments (hashes), attestations (signed records), and settlement records only.

### 6.3 Encryption In Use — Confidential Compute

Confidential compute addresses the gap that exists in most cloud environments: the host operator can, in principle, read the memory of running virtual machines. This is a fundamental threat to workloads handling sensitive models, keys, proprietary algorithms, or private data.

**AMD SEV-SNP (Secure Encrypted Virtualization with Secure Nested Paging):**

- Each VM's memory is encrypted with a unique key managed in the AMD Secure Processor.
- The hypervisor cannot read guest VM memory even with physical access to the host.
- Secure Nested Paging prevents the hypervisor from remapping guest memory to spy on or modify it.
- Remote attestation allows a buyer to verify that their workload is running inside a genuine SEV-SNP VM with a known software stack before sending sensitive data.

**Intel TDX (Trust Domain Extensions):**

- Conceptually similar to AMD SEV-SNP: hardware-encrypted VM memory, reduced TCB.
- TDX Trust Domains are measured (hashed) and verifiable via remote attestation.
- Attestation report is signed by Intel's attestation service (or a DCAP attestation authority in the buyer's preferred trust root).

**How a buyer uses confidential compute:**

```
1. Buyer specifies in job spec: requires_confidential_compute: true
   hardware_requirements: [amd-sev-snp OR intel-tdx]

2. Marketplace scheduler filters to providers with verified attestation

3. Provider node generates attestation report:
   Hardware → SEV-SNP/TDX firmware → Attestation report
   Report includes:
     - CPU model and firmware version
     - VM measurement (hash of initial memory state including software stack)
     - Hardware-signed nonce from buyer's request

4. Buyer verifies attestation report against hardware vendor CA:
   AMD/Intel certificate chain → Attestation report signature → Valid

5. Buyer establishes secure channel to the verified VM:
   QUIC/TLS to the VM's endpoint (VM generates its own key inside the TEE)

6. Buyer delivers workload, sensitive keys, or private data
   Only the authenticated VM endpoint can decrypt this data

7. Workload executes inside TEE
   Provider operator has no visibility into execution state or data

8. Results returned through the same secure channel or committed to L1
```

**Attestation anchoring to L1:**

Providers can publish their most recent attestation report hashes to the L1. This creates:
- A permanent record of the node's hardware integrity history.
- A signal for the reputation system (nodes with valid, recent attestation scores higher).
- An auditable trail for compliance — buyers can prove that their sensitive workloads ran on attested hardware.

---

## 7. Quantum-Resilience Posture and Migration Strategy

### 7.1 The Threat: Cryptanalytically Relevant Quantum Computers

Classical public-key cryptography security assumptions:
- RSA: hardness of integer factoring → Shor's algorithm breaks this in polynomial time on a large CRQC.
- Elliptic curve (ECDH, ECDSA, Ed25519): hardness of discrete logarithm on elliptic curves → Also broken by Shor's algorithm.
- Symmetric ciphers (AES, ChaCha20): Grover's algorithm provides a quadratic speedup, effectively halving the key length. AES-256 remains secure (equivalent to AES-128 post-Grover).

**Current state (2026):** No CRQC large enough to break 256-bit elliptic curves exists publicly. The most advanced quantum processors have thousands of physical qubits, but breaking 256-bit ECC requires millions of logical (error-corrected) qubits. Timelines range from 10–20+ years for most assessments, though classified programs are unknown.

**The harvest now, decrypt later risk is present today:**

Adversaries with significant resources may be archiving encrypted P2P traffic, TLS sessions, and blockchain transactions now, with the intent to decrypt them once a CRQC is available. For infrastructure operating over a multi-year horizon, this risk applies to any data that would be sensitive a decade from now.

This is why post-quantum migration is a current operational concern, not a future one.

### 7.2 NIST Post-Quantum Cryptography Standards

NIST completed its PQC standardization process in 2024:

| Standard | Former Name | Type | Basis | Security Level |
|---|---|---|---|---|
| ML-KEM (FIPS 203) | CRYSTALS-Kyber | Key Encapsulation | Module-LWE | ML-KEM-512/768/1024 → 128/192/256-bit |
| ML-DSA (FIPS 204) | CRYSTALS-Dilithium | Digital Signatures | Module-LWE | ML-DSA-44/65/87 |
| SLH-DSA (FIPS 205) | SPHINCS+ | Digital Signatures | Hash-based | SLH-DSA-128s/f/192s/f/256s/f |

**Autheo's default selection:**
- Key exchange: **ML-KEM-768** (NIST security level 3, 192-bit classical equivalent). Upgraded to ML-KEM-1024 for high-value contexts.
- Signatures (when migration is complete): **ML-DSA-65** for general signing, **SLH-DSA-128f** for contexts prioritizing signature size over signing speed.

### 7.3 Current State and Migration Timeline

**Phase 1 — Transport security (complete at launch):**
- All new P2P connections use hybrid key exchange: X25519 + ML-KEM-768.
- Breaking a session requires breaking both algorithms simultaneously.
- Classical attackers cannot break ML-KEM; quantum attackers cannot break X25519 (until a CRQC exists).
- Forward secrecy: even if a future CRQC breaks X25519, past sessions are protected by ML-KEM.

**Phase 2 — Identity signature migration (in progress):**
- Current node and wallet signatures use Ed25519 (classical).
- As library support stabilizes and hardware wallet firmware supports ML-DSA, node identities will migrate to ML-DSA-65.
- Migration is managed per the L1 governance process, requiring a protocol upgrade vote.
- Dual-signature period: nodes support both Ed25519 (for compatibility) and ML-DSA (for quantum resistance) simultaneously.

**Phase 3 — L1 transaction signatures (planned):**
- Cosmos SDK transaction signatures migrate to ML-DSA when the CosmWasm/SDK support is production-ready.
- The L1 governance module manages this upgrade; a supermajority vote is required.
- Backward compatibility window: historical transactions retain Ed25519 signatures permanently (immutable ledger).

**Phase 4 — Storage and long-term archive encryption:**
- Buyer-managed keys used for stored data should already use AES-256 (Grover-resistant).
- Key encapsulation for key transport migrates to ML-KEM.
- Existing archives encrypted under classical key exchange should be re-encrypted under post-quantum key exchange as part of normal key rotation cycles.

### 7.4 Operational Guidance for Operators

- **Do not use RSA.** RSA key exchange and RSA signatures are not used anywhere in Autheo. If custom integrations require RSA, consult the security team.
- **Verify library versions.** Ensure the mesh daemon and any custom tooling use cryptographic libraries that implement ML-KEM (e.g., liboqs, Kyber reference implementation, or OpenSSL 3.x with post-quantum provider).
- **Monitor NIST advisories.** If a weakness is discovered in a NIST PQC standard, Autheo's governance process will manage an expedited migration. Monitor the Autheo security advisory channel.
- **Protect long-lived data now.** Any data that must remain confidential beyond 10 years should be treated as at risk from harvest-now attacks and should use post-quantum key encapsulation for storage.

---

## 8. Attestation and Workload Integrity Verification

### 8.1 Node Attestation

Node attestation answers the question: "Is this compute node actually running the software it claims, on legitimate hardware?"

**Software attestation:**
The Autheo node daemon publishes a signed manifest of its running software components:
- Daemon version and build hash
- Operating system kernel version
- Hypervisor (KVM) version
- Firecracker VMM version

This manifest is signed with the node's identity key. Peers and the marketplace can verify that a provider node is running a non-modified, up-to-date software stack.

**Hardware attestation (for confidential compute nodes):**
AMD SEV-SNP and Intel TDX generate hardware-signed attestation reports that include:
- CPU firmware version
- Platform configuration register (PCR) values — hashes of the boot chain
- VM launch measurement — hash of the initial VM memory state
- A user-defined nonce (to prevent replay)

The report is signed by the CPU itself (via a chain rooted in the AMD/Intel hardware CA). This signature cannot be forged in software.

**Attestation verification flow:**

```
Buyer → Provider: "Give me an attestation report"

Provider → CPU: Request attestation (nonce = H(buyer_challenge))
CPU → Provider: Signed attestation report

Provider → Buyer: Attestation report

Buyer:
  1. Verify hardware signature chain (AMD/Intel CA → CPU certificate → report)
  2. Verify PCR values match known-good software stack
  3. Verify launch measurement matches expected workload environment
  4. Verify nonce = H(buyer_challenge) (prevents replay)
  5. All checks pass → establish secure channel to attested VM
```

### 8.2 Workload Integrity

Workload integrity ensures that the code a buyer submitted is the code that actually runs, without modification.

**Input integrity:**
- Workload images (container images, MicroVM root filesystems) are content-addressed (SHA-256 hash).
- The hash is included in the capability token and verified by the scheduler before dispatch.
- A provider cannot substitute a different workload image without the hash check failing.

**Execution integrity:**
- In non-confidential mode: the scheduler verifies the MicroVM launch was given the correct image hash. Attestation after launch is optional.
- In confidential mode: the launch measurement (recorded in the hardware attestation report) is the hash of the initial VM memory, which includes the workload image. Any substitution produces a different measurement, which the buyer's verification step detects.

**Output integrity:**
- Workload results are signed by the workload identity key (created at dispatch, inside the VM).
- The buyer verifies the signature against the workload identity, which was included in the job spec on-chain.
- A provider cannot forge or substitute results without being detected.

### 8.3 Continuous Integrity Monitoring

After initial attestation:
- Nodes publish periodic health attestations (signed timestamps + software hash) at intervals defined by the marketplace policy (default: every 6 hours).
- A node that stops publishing attestations, or whose attestation shows a changed software hash without a corresponding scheduled update, is flagged in the reputation system.
- Buyers with active long-running workloads receive a notification if the node's attestation status changes during their workload's execution.

---

## 9. Supply Chain Security

### 9.1 Tooling and Daemon Security

The Autheo node daemon is a critical piece of infrastructure. Its supply chain security posture includes:

**Reproducible builds:**
- The daemon is built from a pinned, hash-locked dependency tree.
- Build artifacts are reproducible: two independent builds from the same source produce byte-identical binaries.
- Third-party auditors can verify that a published binary matches a given source tree.

**Dependency management:**
- Dependencies are pinned to specific versions and content hashes.
- No transitive dependency has automatic update rights.
- Dependency graph is scanned against CVE databases and the GitHub Advisory Database on every merge.
- Critical dependencies (cryptographic libraries, QUIC stack) are updated promptly on disclosure.

**Binary distribution:**
- Releases are signed with a release signing key (stored in HSM, controlled by the Autheo core team).
- Users and operators should verify the release signature before installation.
- Distribution through package managers includes signature verification in the install process.

### 9.2 Agent and Workload Supply Chain

**Agent images:**
- Agent images (Docker images, MicroVM root filesystems) published to the marketplace must be signed by the agent author.
- The marketplace smart contract records the expected image hash at job submission time.
- Providers verify the signature and hash before execution.

**Dependency scanning:**
- Agent development tooling integrates CVE and license scanning.
- Known-vulnerable dependencies in submitted agent images are flagged.
- High-severity CVEs block marketplace submission until remediated.

**Chain of custody:**
```
Developer writes agent code
       ↓
CI/CD pipeline: build, test, dependency scan, CVE check
       ↓
Developer signs image with their Ed25519/ML-DSA key
       ↓
Image hash + signature published to L1 marketplace registry
       ↓
Buyer selects agent from marketplace (verifies author signature)
       ↓
Scheduler verifies hash at dispatch
       ↓
Provider verifies hash + signature before loading into MicroVM
       ↓
(Optional) MicroVM attestation confirms hash at execution
```

### 9.3 Third-Party Infrastructure

Operators who use third-party infrastructure (cloud VMs, co-located hardware) for their nodes should verify:

- Hypervisor integrity: if running Autheo nodes inside cloud VMs, the cloud provider is in the TCB. For workloads with the highest sensitivity, bare-metal deployment with attestation provides stronger isolation.
- Network path: traffic leaving the node to the mesh traverses cloud provider network infrastructure. This is acceptable because all traffic is end-to-end encrypted and authenticated; the cloud provider sees ciphertext only.
- Hardware firmware: verify that server firmware is from the vendor (UEFI Secure Boot) and is not modified. Modified firmware can compromise the attestation chain.

---

## 10. Network Security Controls

### 10.1 Anti-Sybil Mechanisms

A Sybil attack occurs when an attacker creates many fake identities to gain disproportionate influence over routing, reputation, or governance.

**L1 stake requirement for validators:** Running a validator requires staked $THEO. Creating many validators requires proportional stake. This directly limits Sybil amplification in consensus.

**Reputation anchoring for providers:** Reputation is built through verifiable completed work on-chain. A new Sybil identity starts with zero reputation and must earn it through legitimate job completion. Reputation accumulation is rate-limited by the volume of work a single node can actually perform.

**Identity binding to hardware (attestation-backed providers):** Nodes with hardware attestation are bound to specific hardware. Creating many attested Sybil identities requires access to many distinct physical machines.

**DHT Sybil resistance:** Peer selection for routing and discovery uses a diversity requirement — routes must include peers with varied public key prefixes (to prevent an attacker from controlling a contiguous region of the DHT key space).

### 10.2 Anti-Eclipse Mechanisms

An eclipse attack surrounds a target node with attacker-controlled peers, preventing the target from receiving legitimate information about the network state.

**Countermeasures:**

- **Bootstrap diversity:** Nodes connect to multiple independent bootstrap peers from a distributed bootstrap list. The bootstrap list is maintained in the L1 governance registry, not controlled by any single party.
- **Outbound connection diversity:** Nodes are required to maintain outbound connections to peers with diverse public key ranges (distribution across the DHT key space).
- **Random peer probing:** Nodes periodically probe random sections of the DHT to discover peers independently of their existing connections.
- **L1-anchored peer discovery:** Nodes can always query the L1 (an independent trust root) for a list of registered, staked peers, breaking an eclipse attempt that controls only the DHT layer.

### 10.3 Anti-Route-Poisoning

Routing advertisements are signed by the advertising peer's identity key. A peer cannot inject routes on behalf of another peer without forging the other peer's signature. Verification steps:

1. Every routing advertisement is signed by the originating peer's Ed25519/ML-DSA key.
2. The receiving peer verifies the signature before incorporating the advertisement into its routing table.
3. Routes advertised for an Endpoint ID that does not match the advertiser's identity are discarded.
4. Peers with low reputation scores have their route advertisements weighted down or filtered.

### 10.4 DDoS Mitigation

**Validator DDoS protection:**
- Validators operate behind sentry nodes — publicly reachable relay nodes that proxy traffic to the validator. The validator's actual IP address is not published.
- Sentry nodes rate-limit inbound connections and traffic.
- Multiple sentry nodes in different network locations provide redundancy.

**Provider node DDoS protection:**
- The Autheo daemon enforces connection limits and rate limits per source Endpoint ID.
- Peers with a high rate of invalid or unauthenticated messages are temporarily blocked.
- Proof-of-work challenge (client puzzle) for new connection establishment from previously unseen endpoints (adjustable based on current attack volume).

**Relay DDoS protection:**
- Relays are separately operated infrastructure. The community-operated relay network distributes load.
- An attacker cannot target a specific relay to cut off specific nodes — nodes automatically failover to alternative relays.

### 10.5 Network Segmentation for Validators

For highest-security validator operations:

```
[Public Internet]
       ↓
[Sentry Node 1] [Sentry Node 2] [Sentry Node 3]
  (datacenter A)  (datacenter B)  (datacenter C)
       ↓               ↓               ↓
[Private network — no public internet exposure]
       ↓
[Validator Node]
  - No public IP
  - Firewall allows only sentry node traffic
  - HSM-signed consensus votes
  - Independent backup power + connectivity
```

This architecture means:
- Public attack traffic hits sentry nodes, not the validator.
- A DDoS that takes down one sentry still has two others operational.
- Physical access to the validator host does not expose consensus keys (HSM).

---

## 11. Incident Response Model

### 11.1 Incident Classification

| Severity | Description | Examples | Target Response Time |
|---|---|---|---|
| **P1 — Critical** | Active exploitation affecting network integrity or user funds | Validator key compromise; active MicroVM escape; on-chain exploit | < 1 hour |
| **P2 — High** | Significant security vulnerability or compromise affecting availability | Relay network DDoS; confirmed CVE in active dependency; node cluster compromise | < 4 hours |
| **P3 — Medium** | Security vulnerability not yet exploited; limited impact | CVE in non-critical dependency; unconfirmed compromise reports | < 24 hours |
| **P4 — Low** | Minor security improvement; theoretical vulnerabilities | Hardening recommendations; spec ambiguities | < 7 days |

### 11.2 Response Workflow

**P1/P2 Response:**

```
Detection (automated alerting or report)
       ↓
Incident Commander assigned (24/7 on-call rotation)
       ↓
Assess and classify
       ↓
Contain:
  - P1: Emergency governance transaction (freeze affected node/contract)
  - P2: Isolate affected infrastructure; notify affected parties
       ↓
Eradicate:
  - Revoke compromised keys (L1 transaction)
  - Deploy patched software
  - Rotate affected credentials
       ↓
Recover:
  - Restore service from known-good state
  - Verify integrity of recovered systems via attestation
       ↓
Post-mortem (72-hour deadline):
  - Root cause analysis
  - Timeline of events
  - Preventive measures
  - L1 governance proposal if protocol change needed
```

**Emergency governance mechanism:**
A 2/3 validator supermajority can execute an emergency freeze on a specific contract or node registration within one BFT round (seconds). This allows rapid response to active exploits without waiting for the standard governance voting period.

### 11.3 Key Compromise Response

If a validator consensus key is compromised:

1. **Immediate:** Take the validator offline. A validator signing conflicting votes will be slashed.
2. **Within 1 hour:** Submit L1 revocation transaction for the compromised key.
3. **Simultaneously:** Generate new validator key in a clean HSM environment.
4. **Register new key:** Submit a governance transaction to update the validator's registered key.
5. **Verify:** Confirm the new key is being used for consensus votes before bringing the validator back online.
6. **Notify:** Publish a post-incident report to the validator community.

If a provider node key is compromised:

1. Submit L1 revocation for the compromised identity.
2. Running workloads associated with this node: buyers are notified; affected jobs are rescheduled to healthy providers.
3. Escrow for in-flight jobs is returned to buyers.
4. The provider's reputation score records the incident.

### 11.4 Responsible Disclosure

Security vulnerabilities in Autheo protocols, smart contracts, or the mesh daemon should be reported through the security disclosure process:

- **Email:** security@autheo.dev (PGP-encrypted submissions preferred)
- **Bug bounty program:** Details published on the Autheo governance forum.
- Standard disclosure window: **90 days** from acknowledgment before public disclosure, unless coordinated earlier with the reporter.
- Critical vulnerabilities (P1): 7-day coordinated disclosure, with patch deployed before public disclosure where operationally possible.

---

## 12. Security Observability

### 12.1 Security Event Logging

All security-relevant events are logged. Log categories:

**Authentication and authorization events:**
- New connection established (peer identity, timestamp, authentication result)
- Authentication failures (peer identity if known, failure reason)
- Capability token validation (token ID, operation, result)
- Capability token revocation events

**Key and identity events:**
- Node startup and shutdown with identity fingerprint
- Key rotation events
- Revocation events (L1-anchored)
- Attestation generation and verification results

**Workload lifecycle events:**
- Workload dispatch (job ID, buyer, workload hash, provider)
- Workload start inside MicroVM
- Workload completion/failure (result hash, duration)
- Resource usage vs. authorized limits

**Network anomaly events:**
- Repeated authentication failures from same source
- Routing advertisement rejections (reason: invalid signature, wrong originator)
- Rate limit triggers
- Eclipse/Sybil detection signals

**L1 security events:**
- Slashing proposals and outcomes
- Key revocation transactions
- Emergency governance transactions
- Unusual voting patterns

### 12.2 Log Integrity

Logs at the node level are append-only and signed. Each log entry includes:
- Timestamp (from a monotonic clock, not wall clock, to prevent manipulation)
- Entry content hash (SHA-256)
- Chained hash of the previous entry (log entries form a hash chain)
- Periodic anchor transactions on the L1 to commit the log chain head

This design ensures that log tampering is detectable: any modification to a log entry invalidates the chain hash from that point forward, and the L1 anchor provides an independent reference point.

### 12.3 Alerting and Anomaly Detection

Recommended alerting thresholds for operators:

| Signal | Alert Threshold | Likely Cause |
|---|---|---|
| Authentication failure rate | > 10/min from single source | Brute force / scanning |
| Routing advertisement rejections | > 50/min | Route poisoning attempt |
| Workload escape attempts | Any | Active attack on isolation |
| Attestation drift (hash change without update) | Any | Software tampered |
| Validator miss rate | > 5% of blocks | Performance issue or attack |
| Slashing proposal received | Any | Equivocation detected |
| Key revocation for connected peer | Any | Incident in progress |

Alerts should feed into the operator's existing SIEM infrastructure. Autheo nodes emit structured JSON logs compatible with standard log forwarding pipelines (Datadog, Splunk, Elasticsearch, etc.).

---

## 13. Compliance and Auditability

### 13.1 Audit Trail Architecture

The Autheo ecosystem provides a layered audit trail:

**Layer 1 (L1 blockchain — permanent, immutable):**
- All settlement transactions
- Reputation score updates
- Key registrations and revocations
- Attestation anchors
- Slashing events
- Governance votes

**Layer 2 (node-level append-only logs — operator-held):**
- Detailed event logs for all operations on a node
- Periodically anchored to L1 for integrity

**Layer 3 (marketplace audit records — operator and buyer):**
- Job submission and completion records
- Escrow and payment records
- Dispute resolution evidence

A third-party auditor can reconstruct the full history of any node's behavior from L1 alone, with node-level logs providing supplementary detail.

### 13.2 Privacy Considerations

Not all information should be on-chain. The platform's design separates:

- **On-chain:** cryptographic commitments, economic settlements, identity records, reputation scores.
- **Off-chain (node logs):** operational details, workload metadata, performance telemetry.
- **Confidential (never persisted):** workload code and data, in-use encryption keys.

Buyers submitting sensitive workloads should use confidential compute (Section 6.3) and buyer-managed encryption keys to ensure that workload contents are never accessible to the platform operator or provider.

---

## 14. Security Best Practices by Role

### For Compute Providers

- Use an HSM or encrypted volume for the node private key.
- Enable OS-level full disk encryption (LUKS or equivalent).
- Do not run other software on the same host as the Autheo daemon that could escalate privileges.
- Keep daemon and kernel up to date. Subscribe to the Autheo security advisory mailing list.
- Enable hardware attestation on all hardware that supports AMD SEV-SNP or Intel TDX.
- Configure sentry nodes if operating at scale or accepting high-value workloads.
- Monitor your node's reputation score and attestation status through the dashboard.

### For Validators

- Run consensus keys exclusively from an HSM; use a remote signer architecture.
- Use the sentry node topology — never expose the validator's true IP publicly.
- Maintain geographically diverse sentry nodes (minimum 3, separate datacenters).
- Test key rotation procedures in a testnet environment before performing on mainnet.
- Maintain independent monitoring for validator miss rate and slashing status.
- Participate actively in governance discussions about protocol upgrades and security changes.

### For Workload Buyers

- For sensitive workloads, require confidential compute and verify attestation before sending data.
- Use buyer-managed encryption keys for any data stored on provider nodes.
- Verify that submitted agent images are signed and hashes match expected values.
- Monitor job completion and result integrity (verify output signatures).
- Use short-lived agent credentials scoped to the minimum required capabilities.

### For Developers

- Use the Autheo SDK rather than implementing cryptographic operations directly.
- Never log or store private keys or unencrypted credential material.
- Follow the capability delegation model; do not build systems that require broad undelegated access.
- Verify all cryptographic signatures on data received from the mesh.
- Test against the Autheo testnet before mainnet deployment.

---

*This document consolidates and substantially expands the security architecture originally in `SECURITY-AND-QUANTUM-RESILIENCE.md`, incorporating threat modeling, key lifecycle management, quantum migration strategy, attestation flows, supply chain security, and incident response. Cross-reference: [SECURITY-AND-QUANTUM-RESILIENCE.md](./SECURITY-AND-QUANTUM-RESILIENCE.md) for the concise security reference.*

# Autheo Layer 1 — Architecture Reference

**Cross-references:** [White Paper](./AUTHEO-ECOSYSTEM-WHITE-PAPER-2026.md) · [Marketplace](./COMMODITY-MARKETPLACE.md) · [Security](./SECURITY-AND-QUANTUM-RESILIENCE.md)

---

## Overview

The Autheo Layer 1 is the trust and settlement layer for the entire ecosystem. It is a Cosmos SDK blockchain secured by Proof of Stake, operating a validator network that reaches consensus on a canonical chain state.

The L1 does not execute application workloads. Applications run on the mesh. The L1 handles everything that requires shared, decentralized, tamper-evident state: identity anchoring, economic settlement, staking, governance, and smart contracts that coordinate the ecosystem.

The native token is **$THEO**.

---

## 1. Why a Custom L1

Autheo is not built on Ethereum or an EVM-compatible chain as a primary strategy. It runs its own application-specific blockchain because:

- **Performance.** A custom chain is not competing for block space with unrelated applications.
- **Economics.** Fee structures, token emission, and staking parameters can be tuned for compute marketplace use cases rather than general DeFi.
- **Governance.** Protocol upgrades are governed by the ecosystem's validators and token holders without requiring ecosystem forks to match a third-party chain's upgrade schedule.
- **Interoperability.** Cosmos SDK chains can connect to the broader IBC ecosystem when cross-chain settlement is needed.

---

## 2. Technology Stack

### Cosmos SDK

Autheo is built on the Cosmos SDK — a modular framework for constructing application-specific blockchains. The SDK provides standard modules for accounts, staking, governance, token management, and transaction processing. Autheo adds ecosystem-specific modules on top of this foundation.

### CometBFT Consensus

The consensus engine is CometBFT (formerly Tendermint BFT). It provides Byzantine fault-tolerant consensus with deterministic finality — blocks are final once committed, unlike probabilistic finality in Nakamoto-style consensus.

The practical implication: a compute payment settled on the Autheo L1 is immediately final. There is no confirmation window during which the state could be reorganized.

### Validator Network

Validators are the operators of the consensus network. Each validator runs full node software, participates in block proposals and votes, and is responsible for maintaining uptime and key security.

The network targets a validator set large enough for meaningful decentralization while remaining operationally practical for consensus. Cosmos SDK chains typically operate sets of 50–150+ active validators.

---

## 3. Proof of Stake

Security is provided by economic stake rather than energy expenditure. Validators and delegators commit $THEO to the network. Honest participation earns rewards. Malicious or negligent behavior triggers slashing.

```
Acquire $THEO
     ↓
Stake / Delegate to Validator
     ↓
Validator participates in consensus
     ↓
     ├── Honest → Staking rewards
     └── Malicious / offline → Slashing penalty
```

**Validators** run infrastructure and participate directly in consensus. They are responsible for block signing and must maintain high availability.

**Delegators** stake $THEO to validators without running infrastructure. They share in rewards and in slashing risk proportional to their delegation.

Staking parameters (minimum validator bond, slash percentages, unbonding period, reward rate) are governed by the network and adjustable through governance proposals.

---

## 4. $THEO

$THEO is the single token for the Autheo ecosystem. It is not one token among several — it is the unit of value for all economic activity on the network.

**Security:** Validators and delegators stake $THEO. The total value staked is the economic cost of attacking the network.

**Utility:** Compute buyers pay in $THEO. Providers receive $THEO. Transaction fees on the L1 are paid in $THEO.

**Governance:** $THEO holders submit and vote on governance proposals. Voting power is proportional to stake.

There is no separate governance token, marketplace token, or compute credit. One token, one ledger.

---

## 5. L1 Responsibilities

### Identity Anchoring

Every node in the Autheo Mesh has a cryptographic identity. Public key fingerprints and attestations can be anchored to the L1, making node identity verifiable against a tamper-evident record without requiring a centralized identity provider.

### Economic Settlement

When a compute workload completes, the payment claim is settled on the L1. The marketplace coordinates the accounting; the L1 finalizes the transfer. This means providers are paid against an immutable record, and disputes can be adjudicated against on-chain evidence.

### Reputation Anchoring

Provider behavior — task completion, uptime, attestation results — is recorded on-chain. Reputation is not held in a mutable off-chain database; it is anchored to the L1 where it can be read by any marketplace participant.

### Governance

Protocol parameters, fee curves, node admission policies, treasury allocations, and upgrade decisions are managed through on-chain governance. Proposals are submitted, debated in the community, and voted on by stakers. Approved proposals are enacted by the chain.

### Smart Contracts

The L1 supports smart contracts for ecosystem applications: decentralized marketplace logic, staking derivatives, custom settlement schemes, and third-party protocols built on Autheo primitives.

### Interoperability

The Cosmos SDK IBC protocol enables the L1 to communicate with other IBC-compatible chains. This supports cross-chain token transfers and composability with the broader Cosmos ecosystem when needed.

---

## 6. Block Structure and Finality

Each block contains:
- A header linking it cryptographically to the previous block
- A set of validated transactions
- State change records
- Validator signatures

CometBFT finality means a block is considered final once 2/3+ of the validator voting power has signed it. There is no fork-based reorganization after finality. A transaction confirmed in a finalized block cannot be reversed by a competing chain history.

This property is critical for compute payment settlement: providers can accept proof of payment from the L1 without waiting for additional confirmations.

---

## 7. Transaction Lifecycle

```
Application / User
       ↓
Create and sign transaction
       ↓
Broadcast to network
       ↓
Mempool (pending pool)
       ↓
Validator selects for block proposal
       ↓
Transaction verification
       ↓
Block proposal broadcast
       ↓
Validator consensus votes
       ↓
Block finalized (2/3+ signatures)
       ↓
State updated
```

---

## 8. Relationship to Mesh and Marketplace

The L1 does not need to know what workloads the mesh is running. It needs to know:
- Which nodes have staked (for reputation and slashing eligibility)
- What payments were settled (for economic accounting)
- What governance decisions have been made (for protocol parameters)

The mesh and marketplace communicate with the L1 for settlement and parameter reads. The L1 does not communicate with individual mesh nodes for workload execution.

This boundary keeps the L1 simple, auditable, and fast. It also means the mesh can evolve its execution model without requiring L1 governance changes unless the settlement interface changes.

---

## 9. Node Software Components

A validator node runs:
- L1 node software (Cosmos SDK / CometBFT)
- Key management infrastructure (hardware security module recommended for production)
- Persistent chain state storage
- P2P networking (for block propagation between validators)
- Monitoring and alerting stack
- Sentry nodes (for DDoS protection, recommended)

Validator infrastructure is separate from mesh node infrastructure. A validator operator is not required to also run mesh compute nodes, and a mesh node operator is not required to be a validator.

---

## Source Files

This document consolidates:
- `docs/blockchain/01-overview.md`
- `docs/blockchain/02-consensus.md`
- `tools/blockchain/layers.md`
- Relevant sections of `docs/platform/01-overview.md` and `02-architecture.md`

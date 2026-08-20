# DRAFT — FINCEN / BSA / MSB DETERMINATION MEMORANDUM

## Autheo Non-Custodial Compute, Storage & Application Marketplace

```text

**Prepared for:** Autheo / [Wyoming Marketplace Entity]
**Jurisdiction:** United States
**Primary Corporate Jurisdiction:** Wyoming
**Regulatory Authority:** U.S. Department of the Treasury, Financial Crimes Enforcement Network (FinCEN)
**Regulatory Framework:** Bank Secrecy Act (BSA), 31 C.F.R. Chapter X
**Status:** Draft for legal review — not a legal opinion
**Purpose:** Factual and legal framework for counsel's final FinCEN/MSB determination

---

# 1. Executive Summary

## 1.1 Purpose

This memorandum presents the factual, technical, commercial, and regulatory framework for determining whether **[Autheo Marketplace Entity]** (the "Company" or "Autheo Marketplace") is a Money Services Business ("MSB"), and specifically a **money transmitter**, under the regulations administered by the Financial Crimes Enforcement Network ("FinCEN").

The Company is developing a decentralized infrastructure marketplace through which independent customers and infrastructure providers may transact directly in **$THEO**, the native digital asset of the Autheo network, for computing and related infrastructure resources.

The Company's intended business is **not a cryptocurrency exchange, broker, dealer, custodian, wallet provider, payment processor, or fiat-to-crypto conversion service**.

The Company's intended role is to provide the software, protocol, marketplace, discovery, orchestration, resource verification, pricing, scheduling, reputation, and network coordination necessary to operate a decentralized market for computing resources.

The fundamental commercial transaction is:

```text
Customer
    │
    │  $THEO
    ▼
Provider
    │
    │  CPU / GPU / RAM / Storage / Network /
    │  VM / Application / Hosting Resources
    ▼
Customer Workload
```

Autheo provides the marketplace and orchestration infrastructure surrounding that transaction.

**Autheo does not take possession or custody of the customer's $THEO.**

**Autheo does not take possession or custody of the provider's $THEO.**

**Autheo does not receive, hold, transmit, exchange, or settle fiat currency.**

**Autheo does not operate an omnibus wallet or customer asset account.**

**Autheo does not maintain an internal monetary balance representing customer-owned $THEO.**

**Autheo does not operate a fiat or digital-asset exchange.**

The intended settlement model is direct peer-to-peer settlement using the Autheo network, with customer-controlled and provider-controlled wallets.

---

# 2. Preliminary Regulatory Conclusion for Counsel's Review

Based on the Company's intended architecture, the principal legal question is whether Autheo's marketplace/orchestration activity constitutes:

> acceptance and transmission of "currency, funds, or other value that substitutes for currency" from one person to another under 31 C.F.R. § 1010.100(ff)(5),

or whether the Company instead falls outside money-transmitter status because it provides **software, marketplace, communication, network-access, and compute-market infrastructure while the actual transfer of $THEO occurs directly between the transacting parties without Company custody or control**.

The Company requests counsel's analysis under the following authorities, among others:

1. 31 C.F.R. § 1010.100(ff)(5);
2. FinCEN FIN-2013-G001;
3. FinCEN FIN-2014-R011;
4. FinCEN FIN-2014-R007 / related computer-services ruling;
5. FinCEN FIN-2019-G001;
6. applicable FinCEN administrative rulings concerning direct buyer-to-seller payments, software, communication/network services, decentralized virtual currency, and payment processing.

FinCEN's regulations define money transmission services as acceptance of currency, funds, or other value that substitutes for currency from one person and transmission of such value to another location or person by any means. The regulation further provides that whether a person is a money transmitter is a matter of facts and circumstances and expressly excludes certain activities, including persons that only provide delivery, communication, or network-access services used by a money transmitter.

FinCEN's 2013 virtual-currency guidance similarly distinguishes a **user** who obtains convertible virtual currency to purchase goods or services from an **exchanger** or **administrator**, and states that a user using virtual currency to purchase goods or services is not an MSB solely by virtue of that activity.

However, FinCEN has also determined that a platform facilitating transfers between third parties can be a money transmitter even where it does not maintain a traditional exchange inventory and even where transactions are conditional upon matching. Accordingly, the Company's non-custodial architecture must be evaluated based upon the **actual technical and operational facts**, not merely its contractual labels.

---

# 3. Company and Network Structure

## 3.1 Corporate Structure

The Company is organized as a Wyoming limited liability company.

The Company should be treated as a distinct commercial entity from the Autheo protocol/network organization to the extent applicable.

The intended separation is:

```text
                         AUTHEO PROTOCOL
                              │
                              │
                         $THEO NETWORK
                              │
                 ┌────────────┴────────────┐
                 │                         │
          Protocol Functions        Marketplace Functions
                 │                         │
                 │                  [Wyoming Company]
                 │                         │
                 │                  Compute Marketplace
                 │                         │
                 └────────────┬────────────┘
                              │
                         End Users
```

The legal relationship between the protocol entity and marketplace entity should be documented separately and reviewed by counsel.

---

# 4. Nature of the Marketplace

## 4.1 Marketplace Purpose

The Company's commercial purpose is to create an open market for decentralized infrastructure resources.

Resources may include:

* CPU compute;
* GPU compute;
* memory;
* storage;
* bandwidth;
* containers;
* microVMs;
* serverless functions;
* application execution;
* AI inference;
* developer environments;
* game-server hosting;
* application hosting;
* dedicated compute;
* edge compute;
* other infrastructure resources.

The marketplace treats these resources as measurable digital infrastructure commodities/services.

The customer is purchasing **use of computing infrastructure**, not purchasing $THEO from the Company.

---

# 5. $THEO's Role in the Marketplace

$THEO functions as the native settlement asset of the Autheo network.

For purposes of this memorandum, the intended marketplace model is:

> **Compute/storage/application resources are denominated and settled directly in $THEO.**

Examples include:

| Resource            | Example Unit         |
| ------------------- | -------------------- |
| CPU                 | THEO / vCPU-hour     |
| GPU                 | THEO / GPU-hour      |
| RAM                 | THEO / GB-hour       |
| Storage             | THEO / GB-month      |
| Bandwidth           | THEO / GB            |
| VM                  | THEO / VM-hour       |
| Application hosting | THEO / instance-hour |
| Game server         | THEO / server-hour   |
| AI inference        | THEO / compute unit  |

The Company does not sell $THEO as a financial product.

The Company does not offer $THEO as an investment.

The Company does not promise appreciation.

The Company does not provide redemption of $THEO for fiat.

The Company does not operate a $THEO/USD conversion service.

The Company does not maintain a reserve of $THEO for resale to customers.

---

# 6. Core Non-Custodial Architecture

## 6.1 Fundamental Principle

The Company's architecture is intentionally designed to maximize **customer and provider sovereignty**.

The Company's preferred architecture is:

```text
              CUSTOMER
                  │
          Customer-controlled
               wallet
                  │
                  │ $THEO
                  │
                  ▼
        ┌─────────────────────┐
        │  AUTHEO MARKETPLACE │
        │                     │
        │ Discovery           │
        │ Pricing             │
        │ Scheduling          │
        │ Orchestration       │
        │ Verification        │
        │ Reputation          │
        │ Resource Matching   │
        │ Network Coordination│
        └─────────────────────┘
                  │
                  │
                  ▼
              PROVIDER
                  │
          Provider-controlled
               wallet
```

The marketplace software coordinates the commercial relationship, while the digital-asset transfer occurs directly through the Autheo network between the parties.

---

# 7. Explicit Absence of Custody

The Company does **not**:

1. hold customer private keys;
2. hold provider private keys;
3. generate custodial wallets for customers;
4. generate custodial wallets for providers;
5. possess unilateral authority to move customer $THEO;
6. possess unilateral authority to move provider $THEO;
7. operate omnibus wallets;
8. maintain pooled customer assets;
9. maintain pooled provider assets;
10. maintain an internal customer monetary balance;
11. maintain an internal provider monetary balance;
12. maintain a Company-controlled ledger representing claims to $THEO;
13. take title to customer $THEO;
14. take title to provider $THEO;
15. receive customer $THEO into a Company-controlled account;
16. receive provider $THEO into a Company-controlled account;
17. transfer customer $THEO from one wallet to another on the Company's own authority;
18. transfer provider $THEO from one wallet to another on the Company's own authority;
19. operate escrow accounts;
20. provide custodial staking;
21. provide customer asset recovery;
22. provide token redemption;
23. reverse blockchain transactions;
24. freeze customer $THEO;
25. freeze provider $THEO;
26. convert customer $THEO into fiat;
27. convert provider $THEO into fiat;
28. convert fiat into $THEO;
29. maintain customer fiat balances;
30. maintain provider fiat balances.

These limitations are intended to be **architectural constraints**, not merely contractual statements.

---

# 8. Direct Peer-to-Peer Settlement

The Company's intended settlement architecture is:

```text
Customer Wallet
       │
       │
       │  Direct $THEO transaction
       │
       ▼
Provider Wallet
```

The transaction is validated and recorded by the Autheo protocol/network.

The Company does not take possession of the transferred $THEO.

The Company does not become the recipient of the funds before subsequently transmitting them to the provider.

The Company does not operate an intermediary settlement wallet.

The Company does not net customer balances against provider balances.

The Company does not maintain an internal account system representing the transferred $THEO.

---

# 9. Marketplace Transaction Lifecycle

## Step 1 — Provider Offers Capacity

A provider registers infrastructure capacity with the marketplace.

The provider may advertise:

* CPU;
* GPU;
* RAM;
* storage;
* bandwidth;
* geographic/edge location;
* availability;
* uptime;
* hardware capabilities;
* software capabilities;
* price;
* reputation;
* capacity.

The provider retains control over its infrastructure and wallet.

---

## Step 2 — Customer Requests Compute

The customer specifies:

* resource type;
* capacity;
* duration;
* geographic requirements;
* software requirements;
* performance requirements;
* maximum price;
* workload.

---

## Step 3 — Marketplace Matches Supply and Demand

The marketplace's software identifies compatible providers.

The marketplace may:

* rank providers;
* calculate prices;
* schedule workloads;
* verify capacity;
* monitor performance;
* measure utilization;
* establish reputation;
* enforce marketplace rules;
* coordinate deployment.

The marketplace does not take custody of the payment asset.

---

# 10. Step 4 — Customer Authorizes Payment

The customer uses a customer-controlled wallet to authorize the $THEO transaction.

The customer retains control over the wallet and transaction authorization.

The Company does not possess the customer's private key.

---

# 11. Step 5 — Direct Settlement

The $THEO transaction occurs directly between the relevant parties through the Autheo network.

Conceptually:

```text
Customer
Wallet A
   │
   │ $THEO
   ▼
Provider
Wallet B
```

The marketplace may receive blockchain/network data sufficient to determine that the transaction occurred, but receiving blockchain data is not equivalent to taking custody of the asset.

---

# 12. Step 6 — Compute Execution

Following the marketplace's settlement and authorization rules, the provider makes the contracted compute resources available.

The customer workload executes on provider infrastructure.

Examples:

```text
Customer
   │
   ▼
Container
   │
   ▼
MicroVM
   │
   ▼
Provider Compute
```

The Company provides orchestration and infrastructure software.

---

# 13. Step 7 — Measurement and Reputation

The marketplace records operational information such as:

* compute usage;
* uptime;
* execution time;
* bandwidth;
* resource availability;
* job completion;
* service quality;
* provider reputation;
* customer reputation;
* SLA performance.

These are marketplace/service records rather than custodial asset balances.

---

# 14. Critical Distinction: Marketplace Ledger vs. Asset Ledger

The Company may need operational databases to coordinate the marketplace.

Such databases may contain:

```text
Customer ID
Provider ID
Job ID
Resource quantity
Price quotation
Order status
Execution status
Transaction hash
Provider performance
Customer performance
Reputation
SLA status
```

The Company should **not** maintain:

```text
Customer THEO Balance: 4,500 THEO
Provider THEO Balance: 8,200 THEO
Company Custodial Balance: 15,000 THEO
```

unless counsel specifically approves such architecture.

The distinction is:

> **Operational marketplace data ≠ custodial asset ledger.**

A transaction hash or payment-verification record should identify a blockchain transaction without creating an internal claim against Company-held assets.

---

# 15. No Fiat Activity

The Company does not:

* accept USD deposits;
* maintain USD balances;
* transmit USD;
* exchange USD for $THEO;
* exchange $THEO for USD;
* redeem $THEO;
* issue fiat-denominated stored value;
* operate fiat payment accounts;
* operate a fiat exchange;
* provide fiat settlement between customers and providers.

Any future fiat functionality will constitute a **material business-model change** requiring renewed legal review.

---

# 16. No Cryptocurrency Exchange

The Company does not operate:

* order books for buying/selling $THEO;
* THEO/USD markets;
* THEO/BTC markets;
* THEO/USDC markets;
* crypto-to-crypto exchange;
* fiat-to-crypto conversion;
* crypto brokerage;
* dealer inventory;
* Company-owned token reserves offered for resale.

The marketplace instead allows customers and providers to use $THEO as the settlement asset for actual infrastructure services.

---

# 17. No Company Principal Position

The Company does not act as principal in $THEO transactions.

The Company does not:

* buy $THEO from customers;
* sell $THEO to customers;
* buy $THEO from providers;
* sell $THEO to providers;
* quote a bid/ask for $THEO itself;
* warehouse $THEO;
* maintain token inventory;
* guarantee liquidity;
* guarantee convertibility.

Marketplace pricing concerns **compute resources**, not the purchase or sale of $THEO itself.

---

# 18. FinCEN Regulatory Framework

## 18.1 Money Transmitter Definition

31 C.F.R. § 1010.100(ff)(5) defines a money transmitter to include a person providing money transmission services.

Money transmission services include acceptance of currency, funds, or other value that substitutes for currency from one person and transmission of such value to another location or person by any means.

The regulation states that whether a person is a money transmitter is a matter of facts and circumstances. It also provides several express limitations, including persons that only provide delivery, communication, or network-access services used by a money transmitter.

---

# 19. FinCEN Virtual Currency Framework

FinCEN's 2013 guidance identifies:

### User

A person that obtains virtual currency to purchase goods or services.

### Exchanger

A person engaged as a business in exchanging virtual currency for real currency, funds, or other virtual currency.

### Administrator

A person engaged as a business in issuing virtual currency and having authority to redeem it.

FinCEN states that a user who obtains convertible virtual currency and uses it to purchase goods or services is not an MSB solely because of that activity.

The Company's intended role should therefore be evaluated carefully against the distinction between:

> **providing infrastructure through which users directly purchase services with their own digital assets**

and:

> **accepting and transmitting digital assets between third parties.**

---

# 20. Critical FinCEN Counterprecedent

Counsel should specifically analyze FinCEN's 2014 virtual-currency trading-platform ruling, FIN-2014-R011.

In that ruling, FinCEN concluded that a platform was a money transmitter even though it described itself as a matching platform and argued that customers were counterparties.

FinCEN stated that conditional matching did not eliminate money transmission where the platform accepted value from one person and transmitted value to another when the matching condition was satisfied.

FinCEN also stated that a broker can be subject to the same money-transmission analysis whether it acts from its own reserve or attempts to match offsetting transactions.

**This precedent must be addressed directly in the final opinion.**

The Company's position should therefore not be:

> "We cannot be a money transmitter because we are a marketplace."

The stronger position is:

> "The Company's actual technical architecture does not cause the Company to accept and transmit customer value because the Company never possesses or controls the value; the transacting parties authorize and execute the transfer directly between their own wallets, while the Company provides marketplace software, communication, network-access, orchestration, and infrastructure services."

Counsel should determine whether that distinction is legally sufficient under the current facts.

---

# 21. Direct Buyer-to-Seller Payment Precedent

FinCEN has separately recognized circumstances in which brokerage services involving **direct payment from buyer to seller** fall within the regulatory limitation for delivery, communication, or network-access services.

In FIN-2015-R001, FinCEN stated that where the only brokerage services offered involve the buyer making payment directly to the seller, the company would meet the applicable communication/network-access limitation and would not be treated as a money transmitter on those facts.

This precedent is particularly relevant to the Company's proposed architecture and should be analyzed alongside the contrary virtual-currency trading-platform precedent.

---

# 22. Computer Infrastructure Precedent

FinCEN has also considered companies providing computer-system rental services.

In FIN-2014-R007, FinCEN determined that a company providing rental services for computer systems used for virtual-currency mining was not functioning as a virtual-currency administrator and noted that rental of computer systems was not itself money transmission. The ruling also discussed the regulatory limitation for delivery, communication, and network-access services.

This supports the general proposition that **providing computing infrastructure is not itself money transmission**.

The legal question for Autheo is the additional marketplace function: whether its orchestration and matching layer causes it to accept/transmit value between customers and providers.

---

# 23. Application to Autheo

## 23.1 Factors Supporting Non-Money-Transmitter Treatment

The following facts support the Company's position and should be preserved as deliberate architectural requirements:

### A. No custody

Autheo never takes custody of $THEO.

### B. No private keys

Autheo does not possess customer/provider private keys.

### C. No Company-controlled wallets

Autheo does not maintain wallets holding customer/provider assets.

### D. Direct settlement

Customer and provider transact directly through the protocol.

### E. No omnibus accounts

Customer assets are not pooled.

### F. No internal monetary balances

Autheo does not create an internal representation of deposited THEO.

### G. No redemption

Autheo cannot redeem THEO.

### H. No exchange

Autheo does not exchange THEO for fiat or other digital assets.

### I. No dealer inventory

Autheo does not maintain a token inventory.

### J. Actual service

The transaction purchases a real infrastructure service.

### K. Marketplace software

Autheo's primary function is infrastructure-market orchestration.

### L. Network services

The protocol provides communication, discovery, routing, settlement verification, and network coordination.

### M. Customer sovereignty

The customer independently controls and authorizes the asset transfer.

### N. Provider sovereignty

The provider independently controls and receives the settlement asset.

---

# 24. Factors Requiring Careful Counsel Analysis

The following facts could create additional regulatory exposure if implemented incorrectly:

1. Autheo-controlled escrow;
2. Company-controlled smart-contract keys;
3. Company ability to unilaterally move funds;
4. mandatory Company-controlled wallets;
5. internal THEO balances;
6. prepaid marketplace balances;
7. Company-held provider deposits;
8. Company-held customer deposits;
9. automatic Company-controlled payouts;
10. exchange functionality;
11. token conversion;
12. fiat payment integration;
13. Company-controlled settlement;
14. Company-operated liquidity pools;
15. Company buying/selling THEO;
16. Company guaranteeing token liquidity;
17. Company acting as intermediary in token transfers;
18. Company taking possession of tokens before provider settlement.

Any such feature should trigger legal re-review.

---

# 25. Smart Contracts and Protocol-Controlled Settlement

Counsel should separately analyze the legal significance of smart contracts.

The Company should document:

* who deploys the contract;
* who controls upgrade keys;
* whether the contract is immutable;
* whether the Company can pause it;
* whether the Company can reverse transactions;
* whether the Company can redirect funds;
* whether the Company can seize funds;
* whether funds can become trapped;
* whether settlement requires Company authorization;
* whether settlement occurs automatically according to protocol rules.

The preferred architecture is one where the Company cannot unilaterally take possession of or redirect customer/provider assets.

---

# 26. Autheo's Role as Protocol/Marketplace Operator

Autheo's intended role is analogous to an infrastructure coordination layer.

The Company provides:

### Discovery

Finding available infrastructure.

### Matching

Matching demand with compatible supply.

### Pricing

Publishing or calculating compute prices.

### Scheduling

Scheduling workloads against provider capacity.

### Orchestration

Deploying workloads to suitable nodes.

### Measurement

Measuring resource consumption.

### Verification

Verifying node capability and service performance.

### Reputation

Maintaining provider/customer reputation.

### Rule enforcement

Enforcing marketplace participation requirements.

### Network coordination

Facilitating communication among nodes.

### Settlement verification

Verifying that an on-chain transaction associated with an order occurred.

These functions should be distinguished from:

> accepting, holding, transmitting, exchanging, or redeeming financial assets.

---

# 27. Marketplace Settlement Should Remain Outside Company Control

A critical architecture requirement should be:

> **Autheo can verify a transaction without controlling the transaction.**

For example:

```text
Customer Wallet
      │
      │ signs transaction
      ▼
Autheo Network
      │
      │ validates
      ▼
Provider Wallet
```

Autheo Marketplace may observe:

```text
Transaction Hash
Sender
Recipient
Amount
Timestamp
Block
Order ID
```

but should not possess:

```text
Customer Private Key
Provider Private Key
Custodial THEO
Company Wallet Balance
```

---

# 28. No Internal Settlement Account

The marketplace should avoid an architecture such as:

```text
Customer
   ↓
THEO deposited into Autheo account
   ↓
Internal marketplace balance
   ↓
Provider payout
```

Instead:

```text
Customer Wallet
       ↓
Direct THEO Settlement
       ↓
Provider Wallet
```

This distinction should be technically enforced.

---

# 29. Marketplace Fees

The Company may charge a fee for marketplace services, subject to counsel's analysis.

The preferred architecture is for marketplace fees to be structured as payment for:

* software;
* infrastructure;
* orchestration;
* compute-market services;
* API access;
* provider listing;
* scheduling;
* resource measurement;
* other legitimate marketplace services.

Counsel should determine whether fees are:

* paid directly in THEO;
* paid separately;
* automatically calculated;
* collected by smart contract;
* paid directly to the Company's wallet;
* or otherwise structured.

If fees are denominated in THEO, counsel should separately analyze whether receiving THEO as payment for the Company's own services is materially different from receiving and transmitting THEO belonging to a third party.

The architecture should avoid creating an inference that the Company is receiving customer assets for onward transmission to another party.

---

# 30. Resource Marketplace Rather Than Financial Marketplace

The Company's market is fundamentally organized around scarce physical and digital infrastructure resources.

The commodities/services being exchanged include:

```text
COMPUTE
├── CPU
├── GPU
├── RAM
├── Storage
├── Bandwidth
├── VM Time
├── Containers
├── Serverless Execution
├── AI Inference
├── Application Hosting
└── Game Hosting
```

$THEO is the network settlement asset used to price and transact for those resources.

The Company's commercial product is therefore:

> **decentralized infrastructure capacity**

rather than:

> **financial asset exchange.**

---

# 31. No Investment or Financial-Service Function

The Company does not provide:

* investment advice;
* financial advice;
* portfolio management;
* asset management;
* token investment products;
* interest accounts;
* token lending;
* financial derivatives;
* token redemption;
* fiat exchange;
* crypto exchange;
* money-transfer accounts.

These activities are outside the intended V1 scope.

---

# 32. Customer and Provider Relationship

The intended economic relationship is:

```text
CUSTOMER
   │
   │ purchases compute
   ▼
PROVIDER
   │
   │ supplies compute
   ▼
CUSTOMER WORKLOAD
```

Autheo supplies the marketplace infrastructure enabling the relationship.

Autheo does not become the financial counterparty for the underlying $THEO transaction.

---

# 33. Required Counsel Questions

Counsel should expressly answer each of the following.

## A. Classification

1. Is $THEO "convertible virtual currency" under FinCEN's framework?
2. Is the Company a "user"?
3. Is the Company an "exchanger"?
4. Is the Company an "administrator"?
5. Is the Company otherwise a money transmitter?
6. Does any specific limitation under 31 C.F.R. § 1010.100(ff)(5)(ii) apply?

## B. Direct Settlement

7. Does direct customer-to-provider settlement eliminate acceptance/transmission by the Company?
8. Does merely facilitating the transaction constitute acceptance?
9. Does observing/verifying a blockchain transaction constitute acceptance?
10. Does broadcasting transaction information constitute transmission?
11. Does transaction orchestration constitute transmission?
12. Does marketplace matching constitute transmission where the Company never possesses the asset?

## C. Non-Custody

13. Does the absence of private-key control support non-MSB treatment?
14. Does the absence of company-controlled wallets support non-MSB treatment?
15. Does the absence of internal balances support non-MSB treatment?
16. Does the inability to reverse or redirect transactions materially affect the analysis?

## D. Marketplace

17. Does the Company's provision of compute marketplace services constitute a distinct non-money-transmission service?
18. Is the payment in $THEO integral to that service?
19. Does the direct buyer-to-provider payment model support the applicable limitation?
20. Does the Company's orchestration layer create any separate transmission activity?

## E. Smart Contracts

21. Does deployment of settlement smart contracts create money-transmission activity?
22. Does control over upgrade keys affect the analysis?
23. Does an immutable contract materially change the analysis?
24. Does automated protocol execution differ from Company-controlled settlement?

## F. Fees

25. May the Company receive $THEO as compensation for its own marketplace services without becoming a money transmitter?
26. Does a protocol/marketplace fee collected automatically by smart contract create transmission activity?
27. Should marketplace fees be structurally separated from customer/provider settlement?

## G. Future Features

28. What future features would change the classification?
29. What features should be prohibited without legal re-review?
30. What changes require a new FinCEN opinion?

---

# 34. Negative Controls / Prohibited V1 Functions

To preserve the intended regulatory posture, V1 should prohibit the following unless counsel expressly approves them:

```text
NO CUSTOMER CUSTODY
NO PROVIDER CUSTODY
NO FIAT CUSTODY
NO THEO EXCHANGE
NO THEO REDEMPTION
NO INTERNAL THEO BALANCES
NO OMNIBUS WALLETS
NO CUSTOMER DEPOSITS
NO PROVIDER DEPOSITS
NO COMPANY-CONTROLLED ESCROW
NO TOKEN BUYBACKS
NO TOKEN SALES AS MARKETPLACE LIQUIDITY
NO THEO/USD ORDER BOOK
NO THEO/BTC ORDER BOOK
NO THEO/USDC ORDER BOOK
NO COMPANY-CONTROLLED LIQUIDITY
NO COMPANY-CONTROLLED TOKEN MARKET
```

---

# 35. Technical Enforcement of Legal Assumptions

The legal position should not depend exclusively on employee behavior.

The system should make prohibited behavior technically difficult or impossible.

## Wallet architecture

* Customer controls customer wallet.
* Provider controls provider wallet.
* Marketplace has no private-key access.
* No custodial wallet is created by default.

## Settlement

* Direct wallet-to-wallet settlement.
* Blockchain transaction is independently authorized.
* Marketplace verifies transaction status.

## Database

* Store transaction hashes.
* Do not maintain custodial THEO balances.
* Do not represent Company-held THEO on behalf of users.

## Smart contracts

* Minimize administrative control.
* Document upgrade authorities.
* Document pause authority.
* Document fund-redirection authority.
* Prefer immutable or objectively constrained settlement logic where commercially practical.

---

# 36. Evidence Package for Counsel

The Company should provide counsel with evidence demonstrating that the architecture actually operates as described.

## Corporate

* Articles of Organization
* Operating Agreement
* ownership chart
* entity chart

## Protocol

* protocol architecture
* consensus documentation
* token documentation
* wallet architecture
* smart-contract source code
* smart-contract permissions

## Marketplace

* marketplace architecture
* customer flow
* provider flow
* settlement flow
* pricing model
* fee model
* API documentation

## Security

* wallet key architecture
* access-control matrix
* administrative privileges
* smart-contract permissions
* database schema

## Transaction Evidence

Provide testnet/mainnet examples showing:

```text
Customer Wallet
      ↓
Direct Transaction
      ↓
Provider Wallet
```

and demonstrate that:

```text
Autheo Company Wallet
      X
```

is not part of the settlement path.

---

# 37. Recommended Technical Test

Counsel should be given a reproducible transaction demonstration.

### Test

1. Customer controls Wallet A.
2. Provider controls Wallet B.
3. Customer submits compute order.
4. Marketplace identifies Provider B.
5. Customer independently signs THEO transaction.
6. Transaction is broadcast to Autheo network.
7. Provider receives THEO directly.
8. Marketplace records transaction hash.
9. Provider supplies compute.
10. Marketplace records resource consumption.

Demonstrate that Autheo cannot:

* sign as Customer;
* sign as Provider;
* move Customer funds;
* move Provider funds;
* redirect settlement;
* reverse settlement;
* withdraw Customer funds;
* withdraw Provider funds.

This provides counsel with concrete evidence rather than theoretical architecture.

---

# 38. Regulatory Change Management

The Company should implement a formal legal-review trigger.

Any proposed feature involving:

* custody;
* wallets;
* fiat;
* exchange;
* token conversion;
* escrow;
* internal balances;
* token lending;
* staking custody;
* liquidity;
* payment processing;
* provider payouts;
* financial accounts;
* token redemption;
* smart-contract control;

must be classified as a **Regulatory Change Event**.

The feature should not enter production until counsel determines whether it changes the FinCEN/MSB analysis.

---

# 39. FinCEN Registration — Contingency Analysis

If counsel determines that the Company's activities constitute money transmission and no limitation/exemption applies, the Company should then evaluate the resulting MSB obligations.

These may include:

* FinCEN registration;
* written AML program;
* designated compliance officer;
* risk assessment;
* customer identification/due diligence;
* transaction monitoring;
* suspicious-activity procedures;
* recordkeeping;
* applicable funds-transfer requirements;
* applicable Travel Rule requirements;
* SAR procedures;
* independent testing;
* employee training;
* applicable state licensing.

FinCEN's virtual-currency guidance explains that persons operating as exchangers or administrators and accepting/transmitting convertible virtual currency may be money transmitters unless an applicable limitation or exemption applies.

The Company should not voluntarily characterize itself as an MSB before counsel completes the activity-specific analysis.

---

# 40. State-Law Reservation

This memorandum concerns the federal FinCEN/BSA analysis.

A federal determination does **not** by itself resolve state money-transmission laws.

Separate counsel should analyze:

* Wyoming;
* New Mexico;
* all states in which customers/providers are served;
* nexus created by employees;
* nexus created by infrastructure;
* nexus created by solicitation;
* nexus created by marketplace operations.

The Company should maintain a separate:

**50-State Money Transmission Analysis.**

---

# 41. OFAC Reservation

The Company remains subject to applicable U.S. sanctions requirements regardless of whether it is ultimately classified as an MSB.

OFAC states that sanctions obligations apply to virtual-currency transactions as well as traditional fiat transactions and recommends a tailored, risk-based sanctions compliance program for the virtual-currency industry.

Therefore:

> **Non-MSB does not mean non-compliance.**

The Company should maintain an appropriate sanctions-control framework independently of the final MSB determination.

---

# 42. AML Reservation

Likewise:

> **The legal determination of whether the Company is an MSB should precede construction of a legally required MSB AML program.**

However, the Company may voluntarily implement proportionate risk controls appropriate to a decentralized compute marketplace, including:

* sanctions screening;
* abuse detection;
* prohibited-use enforcement;
* fraud prevention;
* blockchain risk monitoring;
* account controls;
* provider verification;
* transaction monitoring where appropriate.

Counsel should determine which controls are legally mandatory versus voluntary risk-management measures.

---

# 43. Proposed Legal Position

Subject to counsel's final determination, the Company's intended position is:

> **Autheo is a non-custodial decentralized infrastructure marketplace and network-orchestration provider, not a financial intermediary.**

Autheo does not receive, hold, control, exchange, transmit, or redeem customer or provider $THEO.

The actual digital-asset transaction occurs directly between the customer and provider through the Autheo network.

Autheo's role is limited to operating and orchestrating the marketplace and associated infrastructure, including discovery, matching, scheduling, resource measurement, provider verification, reputation, network coordination, workload orchestration, and transaction verification.

Autheo does not operate a cryptocurrency exchange and does not provide fiat conversion, custody, or financial-account services.

The Company's principal commercial service is the facilitation and orchestration of access to decentralized computing resources.

---

# 44. Legal Authorities for Counsel Review

Counsel should review, at minimum:

## Federal Regulations

**31 C.F.R. § 1010.100(ff)(5)** — Money transmitter definition and limitations.

The regulation establishes the facts-and-circumstances test and expressly identifies delivery, communication, and network-access services among the limitations.

## FinCEN FIN-2013-G001

**Application of FinCEN's Regulations to Persons Administering, Exchanging, or Using Virtual Currencies.**

This is the foundational virtual-currency guidance distinguishing users, exchangers, and administrators.

## FinCEN FIN-2014-R011

**Virtual Currency Trading Platform**

Important adverse precedent concerning matching platforms, direct counterparties, and acceptance/transmission.

## FinCEN FIN-2014-R007 / Related Computer Services Ruling

Relevant precedent concerning computer-system rental and infrastructure services.

## FinCEN FIN-2015-R001

Relevant precedent concerning direct buyer-to-seller payment and brokerage/network services.

## FinCEN FIN-2019-G001

**Application of FinCEN's Regulations to Certain Business Models Involving Convertible Virtual Currencies.**

Counsel should review the complete 2019 guidance against the Company's decentralized architecture and any software/protocol functions.

---

# 45. Counsel's Requested Final Opinion

The final legal memorandum should conclude with an explicit opinion addressing:

> **Whether [Wyoming Entity], based on the actual V1 architecture and operations described herein, is a Money Services Business or money transmitter under the Bank Secrecy Act and FinCEN regulations.**

The opinion should separately identify:

1. activities that do not constitute money transmission;
2. activities that could constitute money transmission;
3. applicable limitations or exemptions;
4. factual assumptions necessary to the conclusion;
5. technical controls necessary to preserve those assumptions;
6. prohibited or restricted future features;
7. circumstances requiring re-analysis;
8. any FinCEN registration requirements;
9. any federal AML obligations;
10. any applicable funds-transfer or Travel Rule obligations;
11. state-law issues requiring separate analysis.

---

# 46. Material Assumptions

The draft analysis assumes:

1. The Company is not the issuer of $THEO for purposes of the relevant transaction.
2. The Company does not have unilateral authority to redeem $THEO.
3. The Company does not purchase or sell $THEO.
4. The Company does not maintain a $THEO reserve for customers.
5. The Company does not hold customer $THEO.
6. The Company does not hold provider $THEO.
7. The Company does not control customer private keys.
8. The Company does not control provider private keys.
9. Customer-to-provider settlement occurs directly.
10. The Company does not operate an omnibus wallet.
11. The Company does not maintain custodial balances.
12. The Company does not operate fiat accounts.
13. The Company does not exchange $THEO for fiat.
14. The Company does not exchange $THEO for other digital assets.
15. The Company does not provide token redemption.
16. The Company does not provide financial investment services.
17. The Company's primary commercial service is infrastructure marketplace/orchestration.
18. Customers receive actual computing/storage/application services.
19. Providers independently supply infrastructure.
20. The Company does not guarantee liquidity in $THEO.
21. The Company cannot unilaterally redirect customer/provider settlement.
22. Any smart-contract functionality remains within the authority boundaries disclosed to counsel.
23. Any material change to these assumptions triggers legal re-review.

---

# 47. Recommended V1 Regulatory Architecture

The cleanest V1 structure is:

```text
                    AUTHEO
              MARKETPLACE / PROTOCOL
                       │
          ┌────────────┴────────────┐
          │                         │
       CUSTOMER                  PROVIDER
       WALLET                    WALLET
          │                         ▲
          │                         │
          └─────── $THEO ──────────┘
                    │
                    ▼
              AUTHEO NETWORK
                    │
                    ▼
             COMPUTE SERVICE
```

Autheo sits **around the market**, not **in the middle of the asset transfer**.

That distinction should be a foundational architectural principle.

---

# 48. Final Design Principle

The Company's objective is not to make itself the trusted custodian of the market.

The objective is to make the **protocol itself enforce neutral market rules while preserving sovereignty of the participants**.

Accordingly:

> **Autheo should know enough to coordinate the market, but should not control the assets being exchanged.**

> **Autheo should verify settlement, but should not become the settlement counterparty.**

> **Autheo should coordinate compute, but should not become the financial intermediary for compute payments.**

> **Customers should control their assets.**

> **Providers should control their assets.**

> **The protocol should enforce the rules.**

> **The marketplace should provide the infrastructure.**

This architecture should be treated as a core product requirement rather than merely a legal optimization.

---

# 49. Counsel Review Checklist

Before relying on this memorandum, counsel should confirm:

* [ ] Exact legal entity identified
* [ ] Entity/protocol relationship documented
* [ ] $THEO legal characterization completed
* [ ] Company role as issuer/administrator analyzed
* [ ] Custody architecture verified
* [ ] Wallet architecture verified
* [ ] Smart-contract permissions verified
* [ ] Direct settlement demonstrated
* [ ] Company wallet exclusion verified
* [ ] Internal-balance architecture reviewed
* [ ] Marketplace fee architecture reviewed
* [ ] Customer/provider contract structure reviewed
* [ ] Matching/orchestration analyzed under FIN-2014-R011
* [ ] Direct-payment precedent analyzed under FIN-2015-R001
* [ ] Network-access limitation analyzed
* [ ] Computer-services precedent analyzed
* [ ] 2019 FinCEN CVC guidance reviewed
* [ ] Money-transmitter definition reviewed
* [ ] Payment-processor limitation reviewed
* [ ] Integral-to-services limitation reviewed
* [ ] Future feature restrictions established
* [ ] FinCEN registration conclusion reached
* [ ] AML obligations determined
* [ ] Travel Rule applicability determined
* [ ] State-law analysis separately commissioned
* [ ] OFAC analysis separately commissioned
* [ ] Final written legal opinion issued

---

# 50. Conclusion

This memorandum is intended to give counsel a complete factual and analytical foundation for determining the Company's federal MSB status.

The central question is not whether $THEO is called a "utility token," whether the Company calls itself a "marketplace," or whether the system is decentralized.

The central question is:

> **What does the Company actually do with value belonging to other persons?**

The Company's intended answer is:

> **Nothing involving custody or transmission of customer/provider assets.**

The customer and provider independently control their wallets and directly transact $THEO with one another through the Autheo network. Autheo provides the decentralized infrastructure marketplace, including discovery, matching, pricing, scheduling, orchestration, verification, resource measurement, reputation, and network coordination.

The principal legal issue for counsel is therefore whether those marketplace and orchestration functions, in the absence of Company custody or control of the transferred asset, nevertheless cause the Company to fall within the federal definition of money transmission.

The Company expressly requests that counsel analyze both sides of this question, including the adverse platform precedent in FIN-2014-R011 and the favorable direct-payment/network-service authorities, and provide a fact-specific written conclusion.

The Company further intends to maintain the non-custodial architecture described in this memorandum as a fundamental V1 design constraint.

**This document is a draft factual/legal framework prepared for review by qualified U.S. counsel. It is not intended to constitute a legal opinion or substitute for counsel's independent analysis.**

---

## Primary Regulatory Sources

* FinCEN, **FIN-2013-G001 — Application of FinCEN's Regulations to Persons Administering, Exchanging, or Using Virtual Currencies**.
* FinCEN, **FIN-2014-R011 — Application of FinCEN's Regulations to a Virtual Currency Trading Platform**.
* FinCEN, **FIN-2014-R007 — Application of Money Services Business Regulations to the Rental of Computer Systems for Mining Virtual Currency**.
* FinCEN, **FIN-2015-R001 — Application of FinCEN Regulations to Certain Brokerage/Direct-Payment Activities**.
* FinCEN, **FIN-2019-G001 — Application of FinCEN's Regulations to Certain Business Models Involving Convertible Virtual Currencies**.
* 31 C.F.R. § 1010.100(ff)(5), **Money Transmitter**.
* OFAC, **Sanctions Compliance Guidance for the Virtual Currency Industry** — relevant to the separate sanctions-compliance analysis.

# FinCEN, AML/KYC & OFAC Compliance Preparation Guide

## Compute Marketplace + $THEO Infrastructure Network

**Purpose:** Professional preparation framework for determining and documenting U.S. FinCEN/MSB obligations, establishing an AML/KYC program where required, and implementing an OFAC sanctions compliance framework for a decentralized compute marketplace using $THEO.

**Entity Context:** Wyoming LLC operating a decentralized compute marketplace. The protocol/network and commercial marketplace are intended to remain operationally and legally distinct.

**Status:** Pre-launch compliance preparation
**Jurisdictional focus:** United States, with Wyoming corporate domicile and potential U.S. customer/provider activity.

---

# 1. Executive Objective

The immediate objective is **not** to build a full cryptocurrency exchange.

The objective is to establish whether the Wyoming marketplace company can operate a compute marketplace in which customers use $THEO to purchase computing resources from providers, and, if so, to establish the minimum compliance controls required for that business model.

The intended commercial flow is:

```text
Customer
   │
   │ $THEO
   ▼
Compute Marketplace
   │
   │ compute order
   ▼
Provider
   │
   │ CPU / GPU / RAM / Storage / Network
   ▼
Customer Workload
```

The regulatory question is not determined by the label "compute marketplace" or "utility token."

FinCEN looks at the actual activity being performed.

FinCEN's virtual-currency guidance distinguishes a user who obtains virtual currency to purchase goods or services from an administrator or exchanger that accepts/transmits or buys/sells convertible virtual currency.

Therefore, the first deliverable must document exactly what the marketplace does with $THEO.

---

# 2. The Three Workstreams

## Workstream A — FinCEN/MSB Determination

### Question

> Does the marketplace's actual activity make the Wyoming company a Money Services Business, particularly a money transmitter, under the Bank Secrecy Act?

### Deliverable

A formal attorney-prepared:

**FinCEN / BSA / MSB Legal Classification Memorandum**

This is the most important legal document in the initial package.

---

# 3. What the FinCEN Memo Must Analyze

The lawyer should analyze every material activity separately.

## A. Company structure

Provide:

* legal entity name
* state of formation
* ownership
* subsidiaries
* affiliates
* protocol organization
* relationship between protocol and marketplace
* intellectual-property ownership
* token ownership/control
* employees/contractors
* banking/payment relationships

The attorney needs to know exactly which entity does what.

---

# 4. Token Architecture

Prepare a technical/legal description of $THEO.

Include:

* blockchain
* consensus mechanism
* issuance
* initial distribution
* staking
* validator rewards
* token supply
* token transfers
* token burn/mint mechanics
* governance
* treasury
* foundation/entity control
* ability to freeze tokens
* ability to reverse transactions
* redemption rights
* exchange mechanisms
* whether the company controls token issuance
* whether the company can redeem tokens
* whether tokens can be exchanged for fiat
* whether tokens can be exchanged for other digital assets

This matters because FinCEN's definitions distinguish users, administrators and exchangers. FinCEN describes an administrator as a business engaged in issuing a virtual currency and having authority to redeem it, while an exchanger exchanges virtual currency for real currency, funds, or other virtual currency.

---

# 5. Marketplace Transaction Flow

Create a transaction-flow diagram.

The lawyer needs to see:

### Scenario 1 — Customer already owns THEO

```text
Customer Wallet
      │
      │ THEO
      ▼
Marketplace
      │
      │ compute order
      ▼
Provider
```

### Scenario 2 — Customer buys compute

```text
Customer
   │
   │ THEO
   ▼
Marketplace
   │
   ▼
Compute Provider
```

### Scenario 3 — Provider earns THEO

```text
Provider
   │
   │ compute
   ▼
Marketplace
   │
   │ THEO
   ▼
Provider Wallet
```

### Scenario 4 — Marketplace custody

Document whether:

```text
Customer
   │
   ▼
Marketplace-controlled wallet
   │
   ▼
Provider
```

ever occurs.

This is extremely important.

---

# 6. Questions the Lawyer Must Answer

Give counsel this exact checklist.

### Money transmission

1. Does accepting THEO from a customer and delivering compute constitute money transmission?
2. Does accepting THEO and transmitting THEO to a provider constitute money transmission?
3. Does smart-contract settlement change the analysis?
4. Does temporary custody change the analysis?
5. Does control over private keys change the analysis?
6. Does matching customers and providers create money-transmission activity?
7. Does an escrow contract create money transmission?
8. Does the company ever transmit value on behalf of another person?
9. Does the marketplace ever control funds before settlement?
10. Does provider payout create transmission activity?

FinCEN has specifically stated that accepting and transmitting convertible virtual currency on behalf of another person can constitute money transmission, and has rejected the idea that conditional matching necessarily avoids that characterization.

---

# 7. Exchange Activity

Ask counsel to separately analyze:

* THEO → USD
* USD → THEO
* THEO → BTC
* BTC → THEO
* THEO → USDC
* USDC → THEO
* THEO → another digital asset
* digital asset → THEO

Do not assume that calling the activity "marketplace settlement" changes its legal classification.

FinCEN's guidance treats businesses exchanging convertible virtual currency for real currency, funds, or other convertible virtual currency as potential money transmitters.

---

# 8. Custody Analysis

Document whether the company:

* holds private keys
* generates wallets
* controls wallets
* can freeze assets
* can reverse transactions
* can move customer funds
* operates omnibus wallets
* maintains internal balances
* maintains customer ledgers
* settles transactions from company-controlled wallets
* operates escrow

The preferred V1 architecture should minimize company custody.

A strong technical objective is:

> Customer-controlled wallet → protocol settlement → provider-controlled wallet.

But this must be analyzed by counsel based on the actual implementation.

---

# 9. Goods-and-Services Analysis

This is particularly important for your compute marketplace.

Document that the customer is purchasing an actual service:

* CPU time
* GPU time
* RAM
* storage
* bandwidth
* VM execution
* server hosting
* serverless execution
* AI inference
* application hosting

FinCEN's guidance recognizes that a user obtaining virtual currency and using it to purchase goods or services on the user's own behalf is not an MSB merely because of that activity.

The attorney should determine whether your marketplace's particular settlement architecture fits within an applicable limitation or exemption rather than assuming it does.

---

# 10. Required Lawyer Deliverable

The final memo should contain:

## Executive conclusion

Example structure:

> Based on the facts presented, [Company] is / is not a money transmitter under FinCEN regulations with respect to the following activities...

Then:

### Activity-by-activity table

| Activity                             | Classification | Reason         | Conditions |
| ------------------------------------ | -------------- | -------------- | ---------- |
| Customer purchases compute with THEO | TBD            | Legal analysis | TBD        |
| Provider receives THEO               | TBD            | Legal analysis | TBD        |
| Marketplace custody                  | TBD            | Legal analysis | TBD        |
| THEO/USD exchange                    | TBD            | Legal analysis | TBD        |
| Fiat payment processing              | TBD            | Legal analysis | TBD        |
| Smart-contract settlement            | TBD            | Legal analysis | TBD        |

### Required actions

If MSB:

* FinCEN registration
* AML program
* designated compliance officer
* SAR procedures
* recordkeeping
* transaction monitoring
* applicable Travel Rule procedures
* state licensing analysis
* independent testing

If not MSB:

* document the factual limitations
* establish controls ensuring the business remains within those limitations
* establish triggers requiring re-review

---

# 11. What YOU Should Prepare Before Hiring Counsel

Do not pay a lawyer to reconstruct your architecture from scratch.

Build a **Regulatory Fact Package**.

Create:

```text
/legal
   /corporate
   /token
   /marketplace
   /transactions
   /custody
   /payments
   /compliance
```

Then prepare:

### Corporate

* Articles of Organization
* Operating Agreement
* EIN documentation
* ownership information
* organizational chart
* entity diagram

### Technical

* architecture diagram
* wallet architecture
* smart-contract architecture
* transaction flow
* settlement flow
* node/provider architecture

### Commercial

* customer journey
* provider journey
* marketplace fees
* pricing model
* refund model
* dispute model

### Token

* tokenomics
* issuance
* distribution
* staking
* validator rewards
* treasury
* token utility
* exchange venues
* token custody

### Payment

Document:

* who receives USD
* who receives THEO
* who controls funds
* where funds sit
* how settlement occurs
* when settlement occurs
* whether funds can be reversed
* whether company wallets are used

This package can dramatically reduce legal fees.

---

# 12. AML/KYC Framework

AML means:

**Anti-Money Laundering**

KYC means:

**Know Your Customer**

These are related but not identical.

KYC is primarily an identification/due-diligence process.

AML is the broader compliance system surrounding:

* customer risk
* transaction monitoring
* suspicious activity
* sanctions
* recordkeeping
* investigations
* escalation
* reporting
* training
* governance

If the company is an MSB, federal rules require an effective written AML program reasonably designed around the risks of the business. 31 CFR §1022.210 requires policies/internal controls, a designated compliance person, employee training, and independent review.

---

# 13. AML Program Components

A professional AML program should contain:

## 1. Risk Assessment

Identify:

* customers
* providers
* jurisdictions
* products
* token flows
* transaction sizes
* transaction frequency
* anonymity
* wallet exposure
* third-party payments
* gaming
* AI
* hosting
* high-risk workloads

Then assign risk levels.

---

# 14. Customer Risk Model

Example:

### Low risk

* verified U.S. individual
* low transaction volume
* normal compute usage
* consistent wallet behavior

### Medium risk

* high transaction volume
* multiple wallets
* international activity
* large provider payouts
* unusual transaction patterns

### High risk

* sanctioned exposure
* suspicious wallet
* mixer exposure
* ransomware indicators
* unexplained high-value transfers
* contradictory identity information
* prohibited jurisdiction
* suspicious transaction patterns

The actual scoring methodology should be validated by counsel/compliance professionals.

---

# 15. KYC Program

Your lawyer/compliance consultant should determine what KYC is legally required.

Your system can then support:

### Individual

* legal name
* date of birth
* address
* country
* government ID
* identity verification
* sanctions screening

### Business

* legal name
* formation jurisdiction
* registration number
* business address
* beneficial owners
* controlling person
* authorized representative
* sanctions screening

Do not collect unnecessary personal information.

Build the system around **data minimization** and documented retention periods.

---

# 16. KYC Vendor

You don't need to build identity verification yourself.

Evaluate a professional provider capable of:

* ID verification
* document authentication
* liveness
* address verification
* sanctions screening
* PEP screening
* adverse-media screening where appropriate
* business verification
* beneficial-owner verification

Your lawyer should determine the required KYC level before you select the exact vendor.

---

# 17. AML Transaction Monitoring

Build a transaction-monitoring specification.

Monitor for:

### Structuring

Many transactions designed to avoid thresholds.

### Rapid movement

THEO enters and immediately leaves.

### Circular transactions

```text
A → B → C → A
```

### Unusual velocity

Sudden large increase in activity.

### Geographic anomalies

Account identity and transaction behavior don't make sense.

### Suspicious wallet exposure

Interaction with known illicit addresses.

### Compute mismatch

Customer claims to be a normal developer but suddenly purchases enormous resources inconsistent with the account profile.

The point isn't to automatically label something illegal.

The system should generate:

> **Alert → investigation → disposition**

---

# 18. Case Management

Create a compliance case system.

Each case should contain:

```text
Case ID
Customer
Wallet
Transaction IDs
Risk score
Trigger
Analyst
Investigation
Evidence
Decision
Escalation
SAR decision
Date closed
```

This becomes extremely valuable during an examination.

---

# 19. SAR Process

If the company is subject to MSB SAR requirements, suspicious transactions meeting the applicable criteria must be reported to FinCEN.

FinCEN currently states that covered MSBs must file SARs for qualifying suspicious transactions of $2,000 or more, generally within 30 days after detection. Supporting documentation must be retained for five years, and disclosure of a SAR to the subject is prohibited.

You therefore need:

* SAR escalation policy
* investigation procedure
* SAR decision matrix
* SAR filing authority
* confidentiality procedures
* record retention
* law-enforcement response process

Do not improvise SAR procedures after the first suspicious transaction.

---

# 20. AML Officer

If you become an MSB, formally designate a person responsible for AML compliance.

That person needs authority to:

* investigate accounts
* freeze/restrict activity where legally permitted
* escalate cases
* maintain policies
* conduct training
* coordinate SAR decisions
* coordinate regulatory requests
* maintain records

The regulations specifically contemplate a designated person responsible for day-to-day compliance.

For a small startup this may initially be an executive or qualified compliance professional, but independence and competence matter.

---

# 21. AML Training

Create training covering:

* AML basics
* suspicious activity
* sanctions
* customer verification
* escalation
* prohibited activity
* SAR confidentiality
* recordkeeping
* employee responsibilities

Maintain:

```text
Employee
Training
Date
Version
Completion
```

---

# 22. Independent Testing

A professional AML program needs independent testing.

This does not necessarily mean hiring a giant accounting firm.

For a startup, an appropriately qualified independent compliance professional can conduct the review.

They should test:

* KYC
* transaction monitoring
* alert handling
* SAR process
* recordkeeping
* sanctions
* training
* governance
* policy adherence

Then produce:

**Independent AML Program Review Report**

---

# 23. OFAC/Sanctions Program

OFAC is separate from FinCEN.

OFAC administers and enforces U.S. economic sanctions.

The important point for a crypto infrastructure business is that sanctions obligations apply to virtual-currency transactions as well as traditional fiat transactions. OFAC specifically recommends a risk-based sanctions compliance program for the virtual-currency industry.

---

# 24. OFAC Program Structure

Build five components.

## 1. Management Commitment

Create an approved:

**Sanctions Compliance Policy**

Signed/approved by management.

---

## 2. Risk Assessment

Identify:

* customer exposure
* provider exposure
* geographic exposure
* wallet exposure
* token exposure
* infrastructure exposure
* foreign service providers
* cloud providers
* payment processors
* VPN/proxy abuse
* high-risk jurisdictions

---

# 25. Screening

Screen relevant parties against:

* OFAC SDN List
* applicable OFAC sanctions lists
* restricted jurisdictions/programs
* counterparties
* customers
* providers
* beneficial owners
* relevant wallet addresses

OFAC's virtual-currency guidance specifically discusses screening and sanctions risk in virtual-currency businesses.

Use an established screening provider rather than manually downloading lists and maintaining everything yourself.

---

# 26. Wallet Screening

For a crypto marketplace, this is one of the most important technical controls.

Before allowing a transaction:

```text
Wallet
   ↓
Blockchain screening
   ↓
Risk assessment
   ↓
OFAC screening
   ↓
Policy engine
   ↓
Approve / Hold / Escalate
```

The system should distinguish:

* direct sanctioned address
* indirect exposure
* high-risk exposure
* known illicit service
* mixer exposure
* ransomware exposure
* darknet exposure

Do not automatically treat every indirect exposure as legally equivalent to a blocked-person transaction; establish thresholds with counsel and your screening provider.

---

# 27. Geographic Controls

Implement:

* country restrictions
* IP geolocation
* VPN/proxy detection
* address verification
* account country
* provider location
* payment country
* sanctions restrictions

Do not rely on IP address alone.

---

# 28. OFAC Alert Workflow

```text
Transaction
     ↓
Screen
     ↓
Potential match?
    / \
  No   Yes
  │      │
Approve  Hold
         │
         ▼
     Investigation
         │
      /     \
 False      True
 positive    match
   │           │
Release      Block/Reject
               │
               ▼
          Legal escalation
```

The exact legal response depends on the sanctions program and transaction facts.

---

# 29. OFAC Recordkeeping

Maintain:

* screening result
* timestamp
* list version
* customer
* wallet
* transaction
* match score
* analyst
* decision
* supporting evidence

OFAC recordkeeping obligations vary by program and transaction type, so counsel should establish the precise retention schedule.

---

# 30. What You Can Do Yourself

You can prepare most of the **factual and operational package**.

## You can personally prepare:

### Corporate

* entity diagram
* ownership chart
* organization chart

### Token

* tokenomics
* token utility
* staking documentation
* distribution documentation
* technical architecture

### Marketplace

* customer flow
* provider flow
* pricing
* fees
* settlement
* refund process

### Technical

* wallet architecture
* smart contracts
* custody architecture
* transaction flows
* API flows
* logging
* node architecture

### Compliance

* risk inventory
* prohibited-use list
* transaction types
* customer types
* provider types
* countries served
* countries excluded
* proposed KYC tiers
* proposed monitoring rules

### Documentation

You can draft:

* Terms
* Provider Agreement
* AUP
* Privacy Policy
* Security Policy
* Incident Response
* AML policy draft
* sanctions policy draft
* KYC procedures draft

Then have qualified counsel/compliance professionals review and finalize the legal documents.

---

# 31. What You Should NOT Self-Certify

Do not personally make the final legal determination that:

> "We are not an MSB."

Have counsel make that determination.

Likewise, do not self-certify:

* securities-law classification
* money-transmitter exemptions
* state licensing exemptions
* MSB status
* Travel Rule applicability
* SAR obligations
* custody classification
* legal sufficiency of sanctions controls

These are exactly the areas where professional legal review provides value.

---

# 32. What the Lawyer Should Actually Do

Do not simply ask:

> "Can you help with crypto compliance?"

Give the attorney a specific scope.

Request:

### Deliverable 1

**FinCEN / BSA / MSB Classification Memorandum**

### Deliverable 2

**State Money Transmission Regulatory Analysis**

### Deliverable 3

**AML/KYC Regulatory Requirements Memorandum**

### Deliverable 4

**OFAC Sanctions Compliance Legal Review**

### Deliverable 5

**Marketplace Terms Review**

### Deliverable 6

**Token/Protocol Regulatory Review**

### Deliverable 7

**Transaction Architecture Sign-Off**

That is much more useful than paying someone to generally "look over the company."

---

# 33. Lawyer Information Packet

Give counsel a folder like:

```text
LEGAL-DATA-ROOM/

01-CORPORATE/
   Articles.pdf
   Operating-Agreement.pdf
   Ownership.xlsx
   Entity-Structure.pdf

02-PROTOCOL/
   Protocol-Overview.md
   Tokenomics.md
   Consensus.md
   Staking.md
   Governance.md

03-TOKEN/
   THEO-Utility.md
   Token-Distribution.md
   Token-Supply.md
   Token-Flows.pdf

04-MARKETPLACE/
   Marketplace-Overview.md
   Customer-Flow.pdf
   Provider-Flow.pdf
   Pricing.md
   Fees.md

05-TRANSACTIONS/
   THEO-Payment-Flow.pdf
   Settlement-Flow.pdf
   Wallet-Architecture.pdf
   Custody-Architecture.pdf

06-PAYMENTS/
   Fiat-Flow.pdf
   Payment-Processor.pdf
   Exchange-Architecture.pdf

07-COMPLIANCE/
   Customer-Risk.md
   Provider-Risk.md
   Geographic-Risk.md
   Transaction-Risk.md

08-POLICIES/
   Terms-Draft.md
   Provider-Agreement-Draft.md
   Privacy-Draft.md
   AUP-Draft.md
   AML-Draft.md
   Sanctions-Draft.md
```

This is what makes the legal engagement efficient.

---

# 34. Recommended Policy Library

Eventually your `/compliance` directory should contain:

```text
compliance/

AML-Program.md
AML-Risk-Assessment.md
KYC-Policy.md
Customer-Due-Diligence.md
Enhanced-Due-Diligence.md

OFAC-Policy.md
Sanctions-Risk-Assessment.md
Wallet-Screening-Policy.md
Geographic-Restrictions.md

Transaction-Monitoring.md
Suspicious-Activity-Policy.md
SAR-Procedures.md

Record-Retention.md
Employee-Training.md
Independent-Testing.md

Law-Enforcement-Requests.md
Account-Restriction.md
Incident-Response.md
Compliance-Escalation.md
```

---

# 35. The Compliance Matrix

Create one master matrix.

| Requirement             | Applies?            | Owner       | Evidence      | Status  |
| ----------------------- | ------------------- | ----------- | ------------- | ------- |
| FinCEN registration     | Legal determination | Counsel     | Memo          | Pending |
| AML program             | Legal determination | Compliance  | Policy        | Pending |
| KYC                     | Legal determination | Compliance  | Procedure     | Pending |
| SAR                     | Legal determination | Compliance  | Procedure     | Pending |
| Travel Rule             | Legal determination | Counsel     | Memo          | Pending |
| OFAC                    | Yes/assess          | Compliance  | Policy        | Pending |
| Wallet screening        | Recommended         | Engineering | Integration   | Pending |
| State MTL               | Legal determination | Counsel     | 50-state memo | Pending |
| Terms                   | Yes                 | Legal       | Terms         | Draft   |
| Provider Agreement      | Yes                 | Legal       | Agreement     | Draft   |
| Privacy                 | Yes                 | Legal       | Policy        | Draft   |
| AUP                     | Yes                 | Legal       | Policy        | Draft   |
| Recordkeeping           | Yes                 | Compliance  | Procedure     | Pending |
| Independent AML testing | If MSB              | Compliance  | Test report   | Pending |

This becomes your launch-control document.

---

# 36. The Most Important Principle

Do **not** build the compliance program first and then ask what business you're operating.

Do this in the opposite order:

```text
ACTUAL BUSINESS MODEL
        ↓
ACTUAL TOKEN FLOW
        ↓
ACTUAL CUSTODY MODEL
        ↓
ACTUAL PAYMENT FLOW
        ↓
LEGAL CLASSIFICATION
        ↓
REQUIRED COMPLIANCE
        ↓
TECHNICAL CONTROLS
        ↓
POLICIES
        ↓
LAUNCH
```

This prevents you from spending six months building compliance infrastructure for activities you never actually perform.

---

# 37. Recommended V1 Architecture

For the compute marketplace you have been describing, I would have counsel evaluate this specific model first:

```text
                  AUTHEO PROTOCOL
                        │
                        │
                       THEO
                        │
            ┌───────────┴───────────┐
            │                       │
       CUSTOMER                  PROVIDER
       WALLET                    WALLET
            │                       ▲
            │                       │
            └──────► SETTLEMENT ◄──┘
                        │
                        ▼
                 COMPUTE SERVICE
```

The marketplace provides:

* discovery
* scheduling
* resource measurement
* pricing
* reputation
* orchestration
* compute deployment
* settlement coordination

The customer purchases an actual infrastructure service.

The provider supplies actual infrastructure.

The protocol provides the decentralized settlement mechanism.

This is the architecture your FinCEN lawyer should analyze.

---

# 38. Launch Gates

Do not launch public financial activity until these gates are complete.

## Gate 1 — Legal

* [ ] FinCEN/MSB memo completed
* [ ] State licensing analysis completed
* [ ] Token legal analysis completed
* [ ] Custody analysis completed
* [ ] Transaction architecture approved

## Gate 2 — Compliance

If applicable:

* [ ] AML program
* [ ] KYC program
* [ ] sanctions program
* [ ] transaction monitoring
* [ ] SAR procedures
* [ ] recordkeeping
* [ ] compliance officer
* [ ] training
* [ ] independent review plan

## Gate 3 — Technical

* [ ] Wallet screening
* [ ] sanctions screening
* [ ] transaction monitoring
* [ ] audit logs
* [ ] account controls
* [ ] geographic controls
* [ ] provider verification
* [ ] incident response

## Gate 4 — Commercial

* [ ] Customer Terms
* [ ] Provider Agreement
* [ ] Privacy Policy
* [ ] AUP
* [ ] SLA
* [ ] Refund Policy

---

# 39. What I Would Do First

For your project, the immediate sequence should be:

### Step 1

Freeze the **V1 transaction architecture**.

Do not keep changing how THEO moves while the lawyer is analyzing it.

### Step 2

Build the **Regulatory Fact Package**.

You can do this yourself.

### Step 3

Give that package to a U.S. attorney experienced in:

**FinCEN + money transmission + digital assets + blockchain infrastructure.**

### Step 4

Commission the:

**FinCEN/MSB Classification Memorandum.**

### Step 5

At the same time, commission:

**50-State Money Transmission Analysis.**

### Step 6

Have the same counsel determine the actual:

**AML/KYC requirements.**

### Step 7

Build the OFAC framework in parallel.

OFAC recommends a risk-based sanctions compliance program for virtual-currency businesses, so this should not be treated as an afterthought.

### Step 8

Implement only the controls the legal analysis says are required, plus sensible baseline controls.

### Step 9

Conduct an independent compliance review before public launch.

### Step 10

Maintain a formal **change-control trigger**:

> Any change to token issuance, custody, exchange, fiat payments, provider payouts, wallet architecture, or settlement requires legal re-review.

That last step is extremely important.

---

# 40. Bottom Line

You don't need to personally become a regulatory lawyer.

Your job is to produce an exceptionally precise description of **what the system actually does**.

The lawyer's job is to answer:

> **"Given these exact facts, what laws apply?"**

The compliance team's job is then to turn that answer into:

> **"Here is how the company prevents violations."**

And engineering turns that into:

> **"Here is how the software enforces the controls."**

So the professional chain is:

**You → architecture/facts → attorney → legal classification → compliance professional → policies/procedures → engineering → controls → independent review → launch.**

That is the cleanest way to get the Wyoming compute marketplace moving quickly without unnecessarily building a full regulated financial institution on day one.

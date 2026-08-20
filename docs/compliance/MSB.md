key distinction is that **“MSB” is the broader category**, while **“money transmitter” is one type of MSB**.

For Autheo, the practical question is not really “MSB *or* money transmitter?” It is:

> **Does Autheo's actual activity make it a money transmitter? If yes, Autheo is an MSB and the federal BSA/FinCEN requirements generally follow.**



# FinCEN / BSA Regulatory Classification
## MSB vs. Money Transmitter — Autheo Compute Marketplace

**Status:** Draft for legal review  
**Entity:** [Autheo Wyoming LLC]  
**Business:** Non-Custodial Compute / Storage / Application Marketplace  
**Primary Settlement Asset:** $THEO  
**Purpose:** Explain the distinction between an MSB and money transmitter and identify the compliance obligations associated with each classification.

> This document is an educational/legal-review framework, not a legal opinion. Final classification should be determined by qualified U.S. counsel based on the Company's actual architecture and activities.

---

# 1. Executive Answer

## Is "Money Services Business" different from "Money Transmitter"?

Yes.

The terms operate at two different levels.

### Money Services Business (MSB)

**MSB is the umbrella category.**

Under FinCEN's regulations, an MSB can include several different types of businesses, including:

- money transmitters;
- dealers in foreign exchange;
- check cashers;
- issuers of travelers' checks;
- issuers of money orders;
- sellers of travelers' checks;
- sellers of money orders;
- certain providers of prepaid access.

A business does **not** need to be a money transmitter to be an MSB.

---

# 2. Money Transmitter

A **money transmitter** is one specific category of MSB.

The core federal question is whether the business provides:

> "money transmission services"

under 31 C.F.R. § 1010.100(ff)(5).

Broadly, this involves accepting currency, funds, or other value that substitutes for currency from one person and transmitting it to another person or location.

The exact determination is based on the facts and circumstances of the business.

---

# 3. Relationship Between the Terms

The relationship can be represented as:

```text
                 MONEY SERVICES BUSINESSES
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
        ▼                 ▼                  ▼
Money Transmitter   Currency Dealer    Check Casher
        │
        │
        └── Other MSB categories
````

Therefore:

```text
Money Transmitter
       ↓
      MSB

BUT

MSB
       ≠
Automatically Money Transmitter
```

---

# 4. Why This Matters for Autheo

Autheo's primary regulatory question is:

> **Does Autheo qualify as a money transmitter?**

If the answer is **no**, Autheo may not be an MSB on that basis.

If the answer is **yes**, Autheo becomes a federal MSB because money transmitters are an MSB category.

The distinction is therefore:

```text
Does Autheo perform money transmission?
              │
       ┌──────┴──────┐
       │             │
      NO            YES
       │             │
       ▼             ▼
Potentially       Money
not an MSB        Transmitter
                     │
                     ▼
                    MSB
                     │
                     ▼
              BSA / FinCEN
              obligations
```

---

# 5. Autheo's Intended Business

Autheo is not intended to operate as:

* a cryptocurrency exchange;
* a cryptocurrency broker;
* a fiat exchange;
* a payment processor;
* a custodial wallet;
* an escrow provider;
* a token dealer;
* a token redemption service;
* a financial institution.

The intended business is:

> **A non-custodial marketplace and orchestration layer for decentralized compute, storage, application hosting, and related infrastructure.**

---

# 6. Autheo Transaction Model

The intended transaction is:

```text
                 COMPUTE MARKETPLACE

Customer
   │
   │ requests compute
   ▼
Autheo Marketplace
   │
   │ matches supply/demand
   ▼
Provider
   │
   │ supplies compute
   ▼
Customer Workload
```

Payment is separately structured:

```text
Customer Wallet
       │
       │ $THEO
       ▼
Provider Wallet
```

The Company does not intend to sit between the two wallets.

---

# 7. What Autheo Does NOT Do

Autheo does not intend to:

* hold customer $THEO;
* hold provider $THEO;
* control customer private keys;
* control provider private keys;
* operate customer custodial wallets;
* operate provider custodial wallets;
* operate omnibus wallets;
* maintain customer asset balances;
* maintain provider asset balances;
* operate an internal $THEO ledger;
* operate escrow;
* reverse transactions;
* freeze customer assets;
* redirect customer assets;
* transmit customer assets through Company-controlled wallets;
* exchange $THEO for USD;
* exchange USD for $THEO;
* exchange $THEO for other tokens;
* operate a $THEO order book;
* provide token redemption.

---

# 8. If Autheo Is NOT a Money Transmitter

If counsel determines that Autheo's actual activities do not constitute money transmission, then Autheo would generally **not need to register with FinCEN as an MSB on the basis of those activities**.

That does NOT mean:

> "No regulation applies."

Other legal areas can still apply, including:

* OFAC sanctions;
* federal/state consumer protection;
* privacy;
* cybersecurity;
* tax;
* securities/commodities laws depending on token/activity;
* state money-transmission laws;
* applicable laws governing the marketplace itself.

The absence of federal MSB registration does not create a general regulatory exemption.

---

# 9. If Autheo IS a Money Transmitter

If counsel concludes that Autheo accepts and transmits value as part of its business, Autheo would generally fall within the federal MSB framework as a **money transmitter**.

This creates substantially more compliance obligations.

The company would generally need to evaluate:

```text
Money Transmitter
       │
       ▼
Federal MSB
       │
       ├── FinCEN Registration
       │
       ├── AML Program
       │
       ├── Compliance Officer
       │
       ├── Risk Assessment
       │
       ├── Transaction Monitoring
       │
       ├── SAR Procedures
       │
       ├── Recordkeeping
       │
       ├── OFAC Controls
       │
       ├── Training
       │
       └── Independent Testing
```

State licensing would be a separate analysis.

---

# 10. Federal Registration

## If Autheo is an MSB

A person that is an MSB generally must register with FinCEN unless an applicable exception applies.

Registration is performed using:

**FinCEN Form 107 — Registration of Money Services Business**

The registration is generally renewed every two years.

The registration itself is not the same thing as obtaining a federal "money transmitter license."

FinCEN registration is a federal BSA registration requirement.

---

# 11. Important Distinction: FinCEN Registration vs. State Licensing

These are two different systems.

## Federal

```text
FinCEN
   │
   ▼
MSB Registration
```

## State

```text
Individual States
   │
   ▼
Money Transmitter Licensing
```

A company could therefore have:

> Federal MSB registration

while separately needing:

> State money-transmitter licenses.

The federal registration does not replace state licensing.

---

# 12. Federal Requirements if Classified as an MSB

If Autheo becomes a federally regulated MSB, the major BSA compliance framework generally includes:

## 12.1 FinCEN Registration

Register the MSB with FinCEN.

---

## 12.2 Written AML Program

The MSB must establish and maintain an effective anti-money-laundering program reasonably designed to prevent the MSB from being used to facilitate money laundering or terrorist financing.

The program generally includes:

* internal controls;
* designation of a compliance officer;
* employee training;
* independent review/testing;
* risk-based procedures.

---

# 13. AML Compliance Officer

The Company would designate an individual responsible for coordinating the AML program.

Responsibilities may include:

* AML policy administration;
* regulatory reporting;
* transaction monitoring;
* SAR escalation;
* training;
* compliance testing;
* law-enforcement requests;
* policy updates.

---

# 14. AML Risk Assessment

The Company would document its risk profile.

For Autheo this could include:

### Customer Risk

* anonymous users;
* pseudonymous blockchain addresses;
* geographic location;
* customer type;
* business type;
* account history.

### Provider Risk

* infrastructure location;
* provider identity;
* hardware type;
* service type;
* geographic exposure;
* unusual activity.

### Transaction Risk

* transaction size;
* transaction frequency;
* wallet exposure;
* unusual payment patterns;
* sanctions exposure;
* blockchain risk indicators.

### Product Risk

* decentralized settlement;
* peer-to-peer transactions;
* programmable payments;
* cross-border infrastructure.

---

# 15. Customer Identification / KYC

If legally required, the Company would need procedures for identifying customers consistent with the applicable AML framework.

Depending on counsel's analysis, this could include:

* legal name;
* address;
* date of birth for individuals where required;
* government identification;
* business registration information;
* beneficial ownership information;
* sanctions screening;
* risk classification.

However:

> **Do not automatically build a full KYC system merely because this document discusses it.**

First determine whether Autheo is actually subject to the MSB obligations.

The desired non-custodial architecture may materially affect the analysis.

---

# 16. Suspicious Activity Reporting

MSBs have federal suspicious-activity reporting obligations under applicable circumstances.

The Company would need procedures for:

* identifying suspicious transactions;
* escalating suspicious activity;
* determining SAR filing requirements;
* preserving supporting records;
* maintaining confidentiality of SARs.

---

# 17. Transaction Recordkeeping

An MSB must maintain applicable records concerning covered transactions.

The precise requirements depend on transaction type, amount, customer status, and other factors.

A compliant architecture would therefore need to determine:

* what transaction data is collected;
* how long it is retained;
* who can access it;
* how it is protected;
* when records must be produced to regulators.

---

# 18. Travel Rule

If Autheo is determined to be a money transmitter, counsel should specifically determine whether applicable funds-transfer and Travel Rule requirements apply to its transactions.

This becomes particularly important for:

* cross-border transfers;
* transfers involving other financial institutions;
* transfers involving other virtual-asset service providers;
* transfers meeting applicable regulatory thresholds.

The Travel Rule analysis should be performed based on the actual transaction architecture rather than assumed merely because $THEO is involved.

---

# 19. OFAC

OFAC is separate from FinCEN.

This is important.

```text
                 AUTHEO
                   │
        ┌──────────┴──────────┐
        │                     │
     FinCEN                 OFAC
        │                     │
     BSA/MSB              Sanctions
        │                     │
   Money transmission     Restricted
      analysis             persons/
                           jurisdictions
```

Even if Autheo is **not** an MSB, sanctions obligations can still apply.

OFAC has specifically published guidance concerning sanctions compliance for the virtual-currency industry.

---

# 20. State Money-Transmission Laws

This is another independent issue.

Federal MSB status does not answer:

> "Does Autheo need a money-transmitter license in each state?"

State law can differ substantially.

Counsel should conduct a:

**50-State Money Transmission Analysis**

covering:

* Wyoming;
* states where the company operates;
* states where employees operate;
* states where customers are located;
* states where providers are located;
* states where marketplace solicitation occurs.

---

# 21. Comparison Table

| Issue                            | Not an MSB                            | MSB / Money Transmitter                           |
| -------------------------------- | ------------------------------------- | ------------------------------------------------- |
| FinCEN MSB registration          | Generally no                          | Generally yes                                     |
| Federal AML program              | Generally no MSB-specific requirement | Yes                                               |
| AML compliance officer           | Generally no MSB requirement          | Yes                                               |
| AML training                     | Generally no MSB requirement          | Yes                                               |
| Independent AML testing          | Generally no MSB requirement          | Yes                                               |
| SAR program                      | Generally no MSB requirement          | Yes                                               |
| Applicable BSA recordkeeping     | Generally no MSB requirement          | Yes                                               |
| Travel Rule                      | Generally not as an MSB               | Potentially applicable                            |
| OFAC                             | Potentially applicable                | Applicable                                        |
| State money-transmitter analysis | Still relevant                        | Critical                                          |
| State money-transmitter licenses | Depends on activity/state law         | Potentially required                              |
| KYC                              | Depends on other laws/business model  | Required to extent applicable under BSA framework |
| Blockchain monitoring            | Risk-management decision              | Potentially important compliance control          |
| Compliance officer               | Not necessarily required              | Required for MSB AML program                      |
| Written AML program              | Not necessarily required              | Required                                          |
| FinCEN examination risk          | Lower                                 | Material                                          |
| Regulatory reporting             | Limited/other-law dependent           | Material                                          |
| Compliance cost                  | Lower                                 | Substantially higher                              |

---

# 22. The Key Autheo Question

The key issue can be simplified to:

```text
Does Autheo accept value
from Customer A
and transmit that value
to Provider B?
```

If:

```text
YES
 ↓
Potential money transmitter
 ↓
MSB
 ↓
BSA / FinCEN compliance
```

If:

```text
NO

Customer Wallet
      │
      │ direct transaction
      ▼
Provider Wallet

while Autheo only:
- matches
- orchestrates
- coordinates
- verifies
- measures
- provides infrastructure
```

then counsel can evaluate whether Autheo falls outside the money-transmitter definition and applicable limitations.

---

# 23. Why "Non-Custodial" Helps — But Is Not Automatically Enough

One of the most important points for the lawyers:

> **Non-custodial does not automatically mean non-MSB.**

The analysis is based on what the Company actually does.

A platform could potentially be non-custodial in a traditional sense while still performing regulated transmission activity depending on how it facilitates transactions.

This is why FinCEN's virtual-currency trading-platform precedent needs to be analyzed carefully.

The legal argument should therefore NOT be:

> "We don't custody crypto, therefore we're not regulated."

The stronger argument is:

> "Autheo neither accepts nor transmits customer/provider value because settlement occurs directly between the parties, while Autheo provides marketplace, communication, network-access, orchestration, and infrastructure services."

Counsel should determine whether the facts support that conclusion.

---

# 24. Two Possible Business Models

## Model A — Non-MSB Architecture

```text
CUSTOMER
   │
   │ compute request
   ▼
AUTHEO MARKETPLACE
   │
   │ matching/orchestration
   ▼
PROVIDER

CUSTOMER WALLET
   │
   │ $THEO
   ▼
PROVIDER WALLET
```

Autheo does not touch the payment asset.

---

## Model B — Money-Transmission Architecture

```text
CUSTOMER
   │
   │ $THEO
   ▼
AUTHEO WALLET
   │
   │ $THEO
   ▼
PROVIDER
```

Now the Company has inserted itself into the asset-transfer chain.

This substantially changes the regulatory analysis.

---

# 25. Features That Could Push Autheo Toward MSB Status

Counsel should specifically review any proposal to add:

* custodial wallets;
* customer deposits;
* provider deposits;
* internal balances;
* escrow;
* Company-controlled settlement;
* Company-controlled smart-contract keys;
* token conversion;
* fiat payments;
* exchange functionality;
* token redemption;
* Company-operated liquidity;
* token buy/sell functionality;
* automatic Company-controlled payouts;
* pooled customer assets.

These should be treated as regulatory change events.

---

# 26. Features That Support the Intended Non-Custodial Model

The architecture should instead emphasize:

* user-controlled wallets;
* provider-controlled wallets;
* direct P2P settlement;
* no private-key custody;
* no omnibus wallets;
* no internal monetary balances;
* no token exchange;
* no fiat conversion;
* no redemption;
* no Company-controlled escrow;
* transparent on-chain settlement;
* marketplace service fees;
* compute/service-based commercial activity.

---

# 27. Practical Decision Tree for Autheo

```text
START
  │
  ▼
Does Autheo provide a regulated
financial service?
  │
  ├── NO
  │    │
  │    ▼
  │  Potentially outside MSB framework
  │
  └── YES
       │
       ▼
Does the activity constitute
money transmission?
       │
       ├── NO
       │    │
       │    ▼
       │  Potentially another MSB category
       │
       └── YES
            │
            ▼
       MONEY TRANSMITTER
            │
            ▼
           MSB
            │
       ┌────┴─────┐
       ▼          ▼
    FinCEN      AML/BSA
  Registration  Program
       │
       ▼
 State licensing analysis
```

---

# 28. What Lawyers Need to Produce

For the current V1 architecture, counsel should ideally deliver **three separate documents**.

## Document 1 — FinCEN/MSB Determination

Answer:

> Is Autheo an MSB?

and:

> If so, under what MSB category?

---

## Document 2 — Money Transmitter Opinion

Answer:

> Does Autheo's actual marketplace/orchestration activity constitute money transmission?

This should directly address:

* direct P2P settlement;
* non-custody;
* marketplace matching;
* transaction verification;
* smart contracts;
* fees;
* network services;
* relevant FinCEN rulings.

---

## Document 3 — State Licensing Matrix

Answer:

> Where, if anywhere, must Autheo obtain a state money-transmitter license?

This should be a separate 50-state analysis.

---

# 29. What Autheo Should Do Before Launch

## If Counsel Concludes "Not an MSB"

Document the conclusion.

Maintain:

* legal opinion;
* factual assumptions;
* technical architecture;
* prohibited-feature list;
* compliance controls;
* regulatory-change procedure.

Then launch according to the approved architecture.

---

## If Counsel Concludes "MSB / Money Transmitter"

Before operating the regulated activity:

1. Register with FinCEN.
2. Establish the AML program.
3. Appoint the compliance officer.
4. Conduct AML risk assessment.
5. Establish required recordkeeping.
6. Establish SAR procedures.
7. Determine KYC/CDD requirements.
8. Determine Travel Rule obligations.
9. Implement applicable sanctions controls.
10. Conduct state licensing analysis.
11. Obtain required state licenses before conducting licensed activity.
12. Establish independent compliance testing.
13. Train relevant personnel.
14. Establish regulatory-change controls.

---

# 30. Recommended Autheo Strategy

The preferred strategy is **not** to build a full MSB infrastructure unnecessarily.

Instead:

### Phase 1

Build the marketplace around:

```text
Non-Custodial
+
Direct P2P Settlement
+
Compute Services
+
No Fiat
+
No Exchange
+
No Custody
```

### Phase 2

Have counsel formally determine:

```text
MSB?
   │
   ├── NO → Maintain architecture
   │
   └── YES → Implement MSB compliance
```

### Phase 3

Do not add regulated financial functionality without a new legal review.

---

# 31. Bottom Line

The terminology is simple:

> **MSB = broad regulatory category.**

> **Money transmitter = one type of MSB.**

For Autheo, the important question is:

> **Does the Company's marketplace activity constitute money transmission?**

If **no**, Autheo may be able to operate without federal MSB registration based on this activity, subject to counsel's complete analysis and all other applicable laws.

If **yes**, Autheo would generally be an MSB as a money transmitter and would need to address the federal BSA/FinCEN framework, including registration and an appropriate AML program, along with a separate state licensing analysis.

The Company's non-custodial architecture is therefore strategically important, but it must be supported by the **actual technical implementation**, not merely the language in its contracts.

---

# 32. Recommended Legal Position for Counsel

The position to ask counsel to evaluate is:

> **Autheo is a non-custodial infrastructure marketplace and orchestration provider. It does not accept, hold, control, transmit, exchange, or redeem customer or provider digital assets. Customers and providers independently control their wallets and directly settle $THEO transactions through the Autheo network. Autheo provides marketplace discovery, matching, orchestration, resource verification, performance measurement, network coordination, and compute infrastructure services.**

Counsel should determine whether these facts place Autheo outside the federal definition of a money transmitter and whether any limitation in 31 C.F.R. § 1010.100(ff)(5) applies.

The analysis should expressly address both favorable and unfavorable FinCEN precedent rather than relying solely upon the Company's non-custodial characterization.

---

# 33. Regulatory Hierarchy

The simplest way to remember the structure is:

```text
                         BSA
                          │
                          ▼
                    FINCEN RULES
                          │
                          ▼
                         MSB
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
      Money          Currency        Check
     Transmitter      Dealer         Casher
          │
          ▼
    Federal MSB
    Obligations
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  AML   SARs   Records
          │
          ▼
  Separate State
     Licensing
      Analysis

         AND

         OFAC
          │
          ▼
      Sanctions
      Compliance
```

---

# 34. Final Takeaway

For the Autheo V1 marketplace:

**The goal is not "be an MSB with less paperwork."**

The goal is to determine, based on the actual architecture, whether Autheo **is outside the money-transmitter/MSB category altogether**.

That is why the architecture matters:

```text
       TRADITIONAL FINANCIAL INTERMEDIARY

Customer
   ↓
Company-controlled wallet
   ↓
Company
   ↓
Company-controlled wallet
   ↓
Provider


       AUTHEO INTENDED MODEL

Customer
   ↓
Customer-controlled wallet
   │
   │ $THEO
   ▼
Provider-controlled wallet
   ↑
   │
Autheo marketplace/orchestration
```

The second architecture is the one counsel should analyze and, if legally supportable, preserve as the fundamental V1 design.

```

One important correction to keep in mind: **you don't “register as a money transmitter” with FinCEN in the same sense that you get a state money-transmitter license.** If the lawyers conclude Autheo is an MSB, the federal step is generally **FinCEN MSB registration**, while **state money-transmitter licensing is a separate, state-by-state question**. FinCEN's regulations define the MSB categories and money-transmitter activity; FinCEN's registration requirements then apply to businesses that fall within those categories. 

For your particular architecture, I'd make the lawyers answer **three things in writing**: **(1) Is the Wyoming entity an MSB? (2) Is it specifically a money transmitter? (3) In which states, if any, does the exact P2P/non-custodial marketplace model require licensing?** That gives you a much cleaner go/no-go decision before spending heavily on a nationwide MSB compliance stack.
```

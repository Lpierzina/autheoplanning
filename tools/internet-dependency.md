---

# Diagram 1 — The Internet Dependency Pyramid

This is the highest-level view.

```mermaid
flowchart TD

Apps[Applications & Services]

Platform[Cloud Platforms]

Network[CDNs & Edge Networks]

Routing[Routing & DNS]

Transit[Internet Transit Networks]

Physical[Fiber & Physical Infrastructure]

Apps --> Platform

Platform --> Network

Network --> Routing

Routing --> Transit

Transit --> Physical
```

Every layer depends on the one below it.

A cloud outage is bad.

A routing outage is worse.

A fiber outage can impact entire continents.

---

# Diagram 2 — What The Internet Actually Runs On

Most people never think below AWS.

```mermaid
flowchart TD

subgraph Applications
Netflix
GitHub
Discord
Shopify
OpenAI
Steam
end

subgraph Hyperscalers
AWS
Azure
GCP
Oracle
end

subgraph Edge
Cloudflare
Akamai
Fastly
end

subgraph DNS
Route53
CloudflareDNS
GoogleDNS
Verisign
end

subgraph Routing
BGP
InternetExchanges
end

subgraph Carriers
Lumen
Cogent
NTT
Tata
Zayo
GTT
end

subgraph Physical
SubmarineCables
LongHaulFiber
DataCenters
PowerGrid
end

Netflix --> AWS

GitHub --> Azure

Shopify --> Cloudflare

OpenAI --> Azure

Discord --> Cloudflare

Steam --> Akamai

AWS --> Cloudflare
Azure --> Cloudflare
GCP --> Cloudflare

Cloudflare --> BGP
Akamai --> BGP
Fastly --> BGP

BGP --> InternetExchanges

InternetExchanges --> Lumen
InternetExchanges --> Cogent
InternetExchanges --> NTT
InternetExchanges --> Tata

Lumen --> SubmarineCables
Cogent --> LongHaulFiber
NTT --> LongHaulFiber
Tata --> SubmarineCables

SubmarineCables --> PowerGrid
DataCenters --> PowerGrid
```

This is where developers start realizing how deep the stack goes.

---

# Diagram 3 — Tier 1 Internet Providers

Most developers don't know these companies exist.

Yet they are among the most important companies on Earth.

```mermaid
flowchart LR

Lumen

Cogent

NTT

Tata

GTT

Telia

Arelion

Lumen --- Cogent
Lumen --- NTT

NTT --- Tata

Tata --- GTT

GTT --- Telia

Telia --- Arelion

Arelion --- Lumen
```

These networks form much of the global Internet backbone.

They move traffic between countries, continents, and major exchanges.

Without them:

* AWS fails
* Cloudflare fails
* Google fails
* Microsoft fails

---

# Diagram 4 — Internet Exchange Points (IXPs)

One of the most overlooked parts of the Internet.

```mermaid
flowchart TD

AWS

Google

Cloudflare

Microsoft

Netflix

Meta

AWS --> IXP

Google --> IXP

Cloudflare --> IXP

Microsoft --> IXP

Netflix --> IXP

Meta --> IXP

IXP[Internet Exchange Point]

IXP --> GlobalInternet
```

Examples:

* DE-CIX Frankfurt
* AMS-IX Amsterdam
* LINX London
* Equinix exchanges

These are where giant networks meet and exchange traffic.

Think of them as Internet highways and intersections.

---

# Diagram 5 — Why Outages Cascade

This diagram is extremely valuable.

```mermaid
flowchart TD

FiberCut[Fiber Cut]

FiberCut --> Carrier

Carrier --> Routing

Routing --> Cloudflare

Routing --> AWS

Routing --> Azure

Routing --> Google

AWS --> Applications

Azure --> Applications

Google --> Applications

Cloudflare --> Applications

Applications --> Users
```

A single failure deep in the stack can impact thousands of services.

Examples:

* BGP leaks
* DNS outages
* Carrier failures
* Fiber cuts
* Power failures

This is why Internet outages often appear unrelated at first.

---

# Diagram 6 — DNS Dependency Graph

Many people think DNS is simple.

It is one of the most critical systems on Earth.

```mermaid
flowchart TD

Users

Users --> ISPResolver

ISPResolver --> RootServers

RootServers --> TLD

TLD --> Authoritative

Authoritative --> CloudflareDNS

Authoritative --> Route53

Authoritative --> NS1

CloudflareDNS --> Website

Route53 --> Website

NS1 --> Website
```

If DNS fails:

* websites disappear
* APIs disappear
* cloud services disappear

even though the servers themselves may still be running.

---

# Diagram 7 — The Modern Service Dependency Graph

```mermaid
flowchart TD

subgraph Foundation
Power
Fiber
Submarine
Datacenters
end

subgraph Connectivity
Tier1
IXP
BGP
DNS
end

subgraph Edge
Cloudflare
Akamai
Fastly
end

subgraph Cloud
AWS
Azure
GCP
Oracle
end

subgraph Platforms
GitHub
Vercel
Shopify
OpenAI
Discord
Netflix
Steam
end

Power --> Datacenters

Fiber --> Tier1

Submarine --> Tier1

Datacenters --> AWS
Datacenters --> Azure
Datacenters --> GCP

Tier1 --> BGP

BGP --> Cloudflare
BGP --> Akamai
BGP --> Fastly

DNS --> Cloudflare

Cloudflare --> AWS
Cloudflare --> Azure

AWS --> GitHub
AWS --> Shopify
AWS --> Vercel

Azure --> OpenAI

Cloudflare --> Discord

Akamai --> Steam

AWS --> Netflix
```

---

# Diagram 8 — The "Nobody Thinks About These" Layer

These are the hidden dependencies that quietly keep the Internet running.

```mermaid
flowchart TD

PowerGrid

Cooling

Generators

FuelSupply

FiberConstruction

SubmarineRepair

CertificateAuthorities

TimeSynchronization

PowerGrid --> DataCenters

Cooling --> DataCenters

Generators --> DataCenters

FuelSupply --> Generators

FiberConstruction --> Carriers

SubmarineRepair --> SubmarineCables

CertificateAuthorities --> HTTPS

TimeSynchronization --> DNSSEC

TimeSynchronization --> TLS

HTTPS --> Websites
```

This is where things get fascinating.

Most engineers think the Internet stack ends at AWS.

In reality, some of the most critical dependencies are:

* Electric utilities
* Generator fuel logistics
* Undersea cable repair ships
* Certificate authorities
* GPS/NTP time systems
* Long-haul fiber operators
* Internet exchanges
* Tier 1 transit providers

Those are often the true foundational layers beneath everything else.

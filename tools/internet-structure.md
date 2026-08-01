This is where most infrastructure documentation stops too early.

Diagram #4 should evolve into a **full Internet dependency map**. The biggest realization developers eventually have is:

> AWS is not the Internet.
>
> Cloudflare is not the Internet.
>
> Kubernetes is not the Internet.
>
> They are all layers sitting on top of lower layers.

What you really want is a giant diagram showing **what depends on what**.

---

# The Modern Internet Stack (2026)

This is the first diagram I would add.

```mermaid
flowchart TD

subgraph Physical Layer
Fiber[Fiber Optic Cables]
Subsea[Submarine Cables]
Towers[Cell Towers]
Satellites[Satellite Networks]
Power[Power Grid]
end

subgraph Network Layer
ISP[ISPs]
Mobile[Mobile Carriers]
IXP[Internet Exchanges]
Tier1[Tier 1 Carriers]
end

subgraph Routing Layer
BGP[BGP Routing]
Anycast[Anycast Networks]
GeoDNS[GeoDNS]
end

subgraph Edge Layer
POP[Points of Presence]
CDN[CDN Networks]
WAF[Security & DDoS]
Edge[Edge Compute]
end

subgraph Cloud Layer
AWS[AWS]
Azure[Azure]
GCP[GCP]
OCI[Oracle Cloud]
end

subgraph Platform Layer
K8s[Kubernetes]
Containers[Containers]
Functions[Serverless]
Storage[Object Storage]
end

subgraph Application Layer
Apps[Applications]
AI[AI Systems]
Games[Game Platforms]
APIs[APIs]
end

Fiber --> ISP
Subsea --> Tier1
Towers --> Mobile
Satellites --> ISP
Power --> Fiber

ISP --> IXP
Mobile --> IXP
IXP --> Tier1

Tier1 --> BGP

BGP --> Anycast
BGP --> GeoDNS

Anycast --> POP
GeoDNS --> POP

POP --> CDN
POP --> WAF
POP --> Edge

CDN --> AWS
CDN --> Azure
CDN --> GCP
CDN --> OCI

AWS --> K8s
Azure --> K8s
GCP --> K8s
OCI --> K8s

K8s --> Apps
K8s --> AI
K8s --> Games
K8s --> APIs
```

---

# What Actually Happens When You Open A Website

Most developers think:

```text
Browser
 ↓
Server
```

Reality:

```mermaid
sequenceDiagram

participant User
participant ISP
participant DNS
participant Anycast
participant PoP
participant CDN
participant Edge
participant Cloud
participant DB

User->>ISP: Request Website

ISP->>DNS: Resolve Domain

DNS->>ISP: Best Region

ISP->>Anycast: Route Traffic

Anycast->>PoP: Nearest Edge

PoP->>CDN: Check Cache

alt Cached
    CDN->>User: Return Content
else Not Cached
    CDN->>Edge: Execute Logic
    Edge->>Cloud: Request Backend
    Cloud->>DB: Query Data
    DB->>Cloud: Response
    Cloud->>Edge: Response
    Edge->>User: Response
end
```

This is arguably the most useful diagram for developers.

---

# The Global Cloud Dependency Graph

This is where things get interesting.

Almost every major cloud company depends on the same lower layers.

```mermaid
flowchart TD

Internet[(Global Internet)]

Internet --> Lumen
Internet --> Zayo
Internet --> NTT
Internet --> Tata
Internet --> Cogent

Lumen --> Cloudflare
Lumen --> Akamai
Lumen --> Fastly

Zayo --> Cloudflare
NTT --> Cloudflare
Tata --> Cloudflare

Cloudflare --> AWS
Cloudflare --> Azure
Cloudflare --> GCP

Akamai --> AWS
Akamai --> Azure

Fastly --> AWS
Fastly --> GCP

AWS --> Netflix
AWS --> Twitch
AWS --> ThousandsApps

Azure --> Microsoft365
Azure --> Xbox

GCP --> YouTube
GCP --> Gmail
```

This helps explain:

* why outages cascade
* why routing issues affect many companies
* why the Internet is highly interconnected

---

# The Modern PoP

Most people imagine a PoP as:

```text
Router
```

Reality:

```mermaid
flowchart TD

POP[Global PoP]

POP --> Router
POP --> Switches
POP --> DDoS

POP --> CDN

POP --> EdgeCompute

POP --> KV

POP --> Cache

POP --> AI

POP --> Monitoring

POP --> Peering

KV[Edge Databases]
AI[Inference Nodes]
```

Modern PoPs are becoming mini cloud regions.

---

# How Cloudflare, Vercel, Fly.io and Fastly Fit Together

Many developers struggle with this.

```mermaid
flowchart TD

Users

Users --> Cloudflare

Cloudflare --> Vercel

Cloudflare --> Flyio

Cloudflare --> Fastly

Vercel --> AWS

Flyio --> BareMetal

Fastly --> AWS

AWS --> Applications

BareMetal --> Applications
```

Notice:

* Cloudflare sits at the network edge
* Vercel sits at the deployment layer
* AWS sits at the compute layer

They solve different problems.

---

# The Future Internet Architecture

This is likely where the next decade is headed.

```mermaid
flowchart TD

Users

Users --> LocalPOP

LocalPOP --> Compute

LocalPOP --> Storage

LocalPOP --> AI

LocalPOP --> Security

LocalPOP --> Identity

Compute --> Mesh

Storage --> Mesh

AI --> Mesh

Identity --> Mesh

Mesh[Global Coordination Layer]

Mesh --> GlobalPlatform

GlobalPlatform[(Distributed Internet Computer)]
```

The major shift is:

**Today**

```text
Users
 ↓
Internet
 ↓
Cloud Region
 ↓
Application
```

**Tomorrow**

```text
Users
 ↓
Local PoP
 ↓
Local Compute
 ↓
Global Mesh
 ↓
Distributed Platform
```

---

# The Ultimate Big Picture Diagram

If you're building documentation for a distributed compute platform, this is probably the single most important diagram to create.

```mermaid
flowchart TD

Users

Users --> ISPs

ISPs --> IXPs

IXPs --> Tier1

Tier1 --> BGP

BGP --> GeoDNS

BGP --> Anycast

GeoDNS --> POPs

Anycast --> POPs

POPs --> CDN

POPs --> Edge

POPs --> Security

CDN --> Compute

Edge --> Compute

Security --> Compute

Compute --> Scheduler

Scheduler --> Containers

Scheduler --> Functions

Scheduler --> AI

Scheduler --> Databases

Databases --> Storage

Storage --> Replication

Replication --> GlobalPlatform

GlobalPlatform[(Worldwide Distributed Infrastructure)]
```

This starts to resemble an actual map of the Internet rather than a cloud architecture diagram. It shows how every layer—from undersea cables all the way up to AI services and applications—depends on the layers beneath it. That's the level of abstraction most developers never see, but it's the level where CDNs, PoPs, Anycast, hyperscalers, and distributed compute all fit together coherently.

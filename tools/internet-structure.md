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

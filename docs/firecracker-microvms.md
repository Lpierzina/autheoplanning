# Firecracker MicroVMs

> **Infrastructure component:** Secure, lightweight virtual-machine execution for serverless, container, edge, and distributed compute workloads.

---

## Overview

Firecracker is the **microVM execution layer** used by the platform to provide strong workload isolation while retaining the operational characteristics of containers.

It is a lightweight virtual machine monitor (VMM) developed by AWS and designed specifically for **secure multi-tenant execution of container and function workloads**.

Rather than running every workload directly inside a shared operating-system process space, the platform can place workloads inside isolated Firecracker microVMs.

This creates an execution hierarchy:

```text
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION / WORKLOAD                   │
│                                                             │
│       Function • Container • Agent • Build • Service       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPUTE SCHEDULER                        │
│                                                             │
│   Placement • Resources • Reputation • Pricing • Policy    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIRECRACKER MICROVM                      │
│                                                             │
│     Guest Kernel • RootFS • vCPU • Memory • Network        │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       LINUX HOST                            │
│                                                             │
│          KVM • cgroups • namespaces • networking            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       HARDWARE                              │
│                                                             │
│                  CPU • RAM • SSD • NIC                      │
└─────────────────────────────────────────────────────────────┘
```

Firecracker therefore occupies a different layer from technologies such as CRDTs, P2P networking, schedulers, or storage systems.

Those technologies determine **how workloads communicate, synchronize, discover resources, and move through the network**.

Firecracker determines **where and how a workload executes safely**.

---

# 1. Why Firecracker Exists

Traditional virtualization provides strong isolation but can introduce substantial overhead.

Traditional containers provide excellent density and startup performance but generally share the host kernel.

Firecracker sits between these models.

```text
Traditional VM
│
├── Strong isolation
├── Full virtual hardware
├── Larger memory footprint
├── Slower startup
└── More device/emulation complexity


Container
│
├── Very fast startup
├── High density
├── Low overhead
└── Shared host kernel


Firecracker microVM
│
├── Hardware virtualization
├── Separate guest kernel
├── Minimal virtual hardware
├── Very small overhead
├── Fast startup
└── Designed for multi-tenant serverless workloads
```

The result is a useful primitive for a distributed compute marketplace.

A node can safely accept workloads from different users without requiring a dedicated physical server for every workload.

---

# 2. Core Architecture

Firecracker runs as a userspace VMM and uses Linux KVM for hardware virtualization.

```text
                    COMPUTE NODE
                         │
                         │
              ┌──────────▼──────────┐
              │    Linux Kernel     │
              │                     │
              │       KVM           │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │ Firecracker │ │ Firecracker │ │ Firecracker │
   │   microVM   │ │   microVM   │ │   microVM   │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
          │               │               │
          ▼               ▼               ▼
       Guest OS        Guest OS        Guest OS
       Workload        Workload        Workload
```

Each Firecracker process manages a microVM.

The VMM exposes only the devices and functionality required by the workload.

This minimalist architecture reduces:

* memory overhead
* device-emulation complexity
* startup time
* attack surface
* unnecessary guest functionality

Firecracker's official architecture describes the VMM as using KVM while deliberately excluding unnecessary devices and guest-facing functionality.

---

# 3. Firecracker in the Compute Fabric

Firecracker should be treated as an **execution substrate**, not the complete compute platform.

The platform wraps Firecracker with higher-level services.

```text
                         PLATFORM
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      Marketplace        Scheduler         Identity
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                    Compute Agent
                            │
                            ▼
                   Firecracker Manager
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          microVM        microVM        microVM
             │              │              │
             ▼              ▼              ▼
         Workload       Workload       Workload
```

The **Compute Agent** becomes the local control plane.

It can:

1. receive workload requests
2. verify workload identity
3. evaluate node policy
4. reserve resources
5. create a microVM
6. configure networking
7. attach storage
8. boot the guest
9. monitor execution
10. enforce resource limits
11. collect metrics
12. terminate the workload
13. release resources
14. report execution results

Firecracker itself should remain narrowly focused on virtualization.

---

# 4. MicroVM Lifecycle

A typical workload follows this lifecycle:

```text
REQUEST
   │
   ▼
AUTHENTICATE
   │
   ▼
SCHEDULE
   │
   ▼
RESERVE RESOURCES
   │
   ▼
CREATE MICROVM
   │
   ├── CPU
   ├── Memory
   ├── Kernel
   ├── RootFS
   ├── Network
   └── Storage
   │
   ▼
BOOT
   │
   ▼
EXECUTE
   │
   ├── Monitor CPU
   ├── Monitor RAM
   ├── Monitor Network
   ├── Monitor Storage
   └── Monitor Health
   │
   ▼
COMPLETE
   │
   ▼
DESTROY / SNAPSHOT
   │
   ▼
RELEASE RESOURCES
```

This lifecycle makes Firecracker particularly useful for:

* serverless functions
* build jobs
* CI/CD
* AI agents
* untrusted code
* browser workloads
* developer sandboxes
* containers
* short-lived services
* edge workloads
* marketplace compute

---

# 5. Firecracker vs Containers

Firecracker does not replace containers.

Instead, the two technologies can be combined.

```text
                    MicroVM
                       │
             ┌─────────▼─────────┐
             │    Guest Linux    │
             │                   │
             │    Container      │
             │    Runtime        │
             │                   │
             │ ┌─────┐ ┌─────┐   │
             │ │ App │ │ App │   │
             │ └─────┘ └─────┘   │
             └───────────────────┘
```

A single microVM can provide the isolation boundary while containers provide application packaging and process-level isolation inside the VM.

This gives the platform multiple isolation strategies:

```text
Trusted workload
        │
        ▼
Container


Untrusted workload
        │
        ▼
Container inside Firecracker


Highly sensitive workload
        │
        ▼
Dedicated Firecracker microVM


Confidential workload
        │
        ▼
Firecracker + TEE-capable infrastructure
```

---

# 6. Firecracker vs Litebox

Firecracker and Litebox should be viewed as complementary execution technologies.

| Layer                  | Firecracker              | Litebox                     |
| ---------------------- | ------------------------ | --------------------------- |
| Primary purpose        | Secure microVM execution | Lightweight sandbox/runtime |
| Isolation              | Hardware virtualization  | Runtime / sandbox isolation |
| Guest kernel           | Yes                      | Depends on configuration    |
| KVM                    | Yes                      | Depends on implementation   |
| Startup                | Very fast                | Potentially extremely fast  |
| Strong multi-tenancy   | Excellent                | Workload dependent          |
| Serverless             | Excellent                | Excellent                   |
| Untrusted code         | Strong isolation         | Strong sandboxing           |
| Full Linux environment | Yes                      | More constrained            |
| Edge execution         | Excellent                | Excellent                   |

The platform can choose the execution primitive according to workload requirements.

```text
                    WORKLOAD
                       │
             ┌─────────┴─────────┐
             │                   │
        Lightweight           Isolated
         workload              workload
             │                   │
             ▼                   ▼
          Litebox            Firecracker
             │                   │
             └─────────┬─────────┘
                       ▼
                  Compute Node
```

The important architectural principle is **execution abstraction**.

Applications should not need to know whether their workload runs in Litebox, Firecracker, a container runtime, or another execution engine.

---

# 7. Security Model

Firecracker is specifically designed around multi-tenant isolation.

The security model consists of multiple layers.

```text
┌──────────────────────────────────────────┐
│             Application                  │
├──────────────────────────────────────────┤
│          Guest User Space                │
├──────────────────────────────────────────┤
│             Guest Kernel                 │
├──────────────────────────────────────────┤
│          Firecracker VMM                 │
├──────────────────────────────────────────┤
│                KVM                       │
├──────────────────────────────────────────┤
│         Linux Host Kernel                │
├──────────────────────────────────────────┤
│              Hardware                   │
└──────────────────────────────────────────┘
```

Firecracker additionally provides the **Jailer**, which establishes another host-level isolation boundary around the Firecracker process.

The Jailer can apply:

* namespaces
* cgroups
* chroot
* privilege dropping
* resource limits
* network namespaces
* process isolation

The official documentation describes the Jailer as a security enhancement around the Firecracker process rather than a general-purpose sandbox.

---

# 8. Defense in Depth

The platform should never rely on a single isolation mechanism.

Recommended architecture:

```text
                    SECURITY
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Identity        Network        Runtime
        │              │              │
        ▼              ▼              ▼
    Workload       Namespace       Firecracker
    Identity       Isolation         microVM
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                    Jailer
                       │
                       ▼
                     KVM
                       │
                       ▼
                    Hardware
```

Additional controls should include:

* signed workload images
* immutable root filesystems where appropriate
* least-privilege networking
* resource quotas
* cgroups
* filesystem restrictions
* audit logging
* workload identity
* node identity
* reputation scoring
* encrypted communication
* secure boot/image validation where applicable
* host hardening

Firecracker's own production-host guidance emphasizes that the security of a microVM deployment depends on correctly configuring the Linux host.

---

# 9. Jailer

The Jailer is an important part of production Firecracker deployment.

```text
                Compute Agent
                     │
                     ▼
                  Jailer
                     │
          ┌──────────┴──────────┐
          │                     │
       cgroups              namespaces
          │                     │
          └──────────┬──────────┘
                     ▼
              Firecracker VMM
                     │
                     ▼
                  KVM VM
```

The Jailer can establish:

* a dedicated filesystem root
* dedicated UID/GID
* cgroup resource controls
* PID namespace
* network namespace
* resource limits
* privilege reduction

This allows the platform to enforce host-level policy before a microVM begins execution.

---

# 10. Resource Isolation

The compute marketplace requires deterministic resource accounting.

Firecracker provides mechanisms that can be combined with Linux resource controls.

### CPU

A workload can receive a defined vCPU allocation.

```text
Node CPU
│
├── VM A → 1 vCPU
├── VM B → 2 vCPU
├── VM C → 4 vCPU
└── VM D → 1 vCPU
```

### Memory

```text
Host RAM: 64 GB

VM A → 512 MB
VM B → 1 GB
VM C → 4 GB
VM D → 2 GB
VM E → 8 GB
```

### Storage

Storage can be represented using file-backed block devices.

### Network

Virtio networking and Firecracker's rate limiting mechanisms can be used to control resource consumption.

The production-host guidance also documents using cgroups for CPU, memory, and block-I/O control.

---

# 11. Rate Limiting

A distributed compute marketplace cannot allow one workload to monopolize a node.

Resource controls therefore become part of marketplace economics.

```text
             WORKLOAD
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
      CPU       RAM       I/O
       │         │         │
       ▼         ▼         ▼
    cgroups   cgroups   rate limiter
       │         │         │
       └─────────┼─────────┘
                 ▼
              Firecracker
```

The platform can associate resource limits with:

* workload tier
* account
* reputation
* payment
* SLA
* node capacity
* job priority

---

# 12. Firecracker API

Firecracker exposes a REST-style API through a Unix domain socket.

The API can configure the microVM before startup and manage runtime operations. The current API specification includes endpoints for machine configuration, CPU configuration, drives, network interfaces, VM state, snapshots, vsock, and other resources.

Conceptually:

```text
Compute Agent
     │
     │ HTTP/JSON
     ▼
Unix Domain Socket
     │
     ▼
Firecracker API
     │
     ├── CPU
     ├── Memory
     ├── Drives
     ├── Network
     ├── Vsock
     ├── Entropy
     ├── Logging
     ├── Metrics
     └── VM lifecycle
```

The API should remain behind the Compute Agent.

Users should **never directly access the Firecracker control socket**.

---

# 13. Example VM Configuration Flow

A simplified provisioning flow looks like:

```text
1. Start Firecracker

        │
        ▼

2. Configure machine

        │
        ├── vCPU
        └── memory

        ▼

3. Configure boot source

        │
        ├── kernel
        ├── rootfs
        └── boot arguments

        ▼

4. Configure storage

        │
        └── virtio block devices

        ▼

5. Configure networking

        │
        └── tap interface

        ▼

6. Configure optional devices

        │
        └── vsock / entropy / pmem

        ▼

7. Start instance

        │
        ▼

8. Monitor

        │
        ▼

9. Stop / snapshot / destroy
```

---

# 14. Networking

Firecracker deliberately keeps its networking model minimal.

A typical architecture is:

```text
                 Physical NIC
                      │
                      ▼
                 Linux Host
                      │
                 Bridge / Router
                      │
                    TAP
                      │
                      ▼
                Firecracker
                      │
                 Virtio NIC
                      │
                      ▼
                  Guest OS
                      │
                      ▼
                 Workload
```

The Compute Agent controls the networking layer.

This allows the platform to implement:

* isolated networks
* NAT
* private networks
* public IPs
* overlay networks
* service discovery
* mesh networking
* ingress
* egress controls
* bandwidth accounting

---

# 15. Firecracker + Mesh Networking

This is particularly important for the distributed architecture.

Firecracker provides **compute isolation**.

The mesh provides **network connectivity**.

```text
                 DISTRIBUTED MESH
          ┌──────────┬──────────┬──────────┐
          │          │          │          │
          ▼          ▼          ▼          ▼
       Node A     Node B     Node C     Node D
          │          │          │          │
       ┌──┴──┐    ┌──┴──┐    ┌──┴──┐    ┌──┴──┐
       │ VM  │    │ VM  │    │ VM  │    │ VM  │
       └─────┘    └─────┘    └─────┘    └─────┘
```

The result is a distributed collection of isolated execution environments.

The workload does not need to know where the physical machine is located.

The scheduler can move workloads between:

* local machines
* LAN nodes
* edge nodes
* enterprise clusters
* private cloud
* public cloud
* remote mesh nodes

---

# 16. Firecracker + CRDT

CRDTs and Firecracker solve completely different problems.

```text
CRDT
│
└── State synchronization


Firecracker
│
└── Workload isolation and execution
```

Together:

```text
             Distributed Application
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          CRDT State         Firecracker
             │                   │
             │                Workload
             │                   │
             └─────────┬─────────┘
                       ▼
                   Compute Node
```

A workload can maintain local state through CRDT mechanisms while executing inside an isolated microVM.

This enables a **local-first execution model**.

---

# 17. Local-First Compute

One of the most important uses in the platform is moving computation toward the user.

Instead of:

```text
User
 │
 ▼
Internet
 │
 ▼
Hyperscaler
 │
 ▼
Compute
```

the architecture becomes:

```text
                 USER
                  │
                  ▼
             Local Device
                  │
                  ▼
            Local Compute
                  │
             Firecracker
                  │
        ┌─────────┴─────────┐
        │                   │
     Execute              Cache
        │                   │
        └─────────┬─────────┘
                  │
            If additional
              capacity
                  │
                  ▼
             Mesh Node
                  │
                  ▼
            Regional Edge
                  │
                  ▼
             Cloud Node
```

The scheduler can therefore prefer:

1. local execution
2. nearby LAN execution
3. nearby edge execution
4. regional execution
5. public cloud execution

This minimizes latency and unnecessary data movement.

---

# 18. Edge Compute

Firecracker is especially useful for edge environments because microVMs can provide strong isolation without requiring a heavyweight virtualization stack.

A single edge server could host many isolated workloads:

```text
                 EDGE NODE
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
    Firecracker   Firecracker   Firecracker
       VM A          VM B          VM C
       │             │             │
   IoT Agent      API          AI Worker
```

Potential locations include:

* enterprise offices
* retail stores
* factories
* telecom sites
* data centers
* community nodes
* local servers
* developer machines
* gateways
* remote infrastructure

---

# 19. Serverless Execution

Firecracker maps naturally onto serverless computing.

A function invocation can become:

```text
HTTP Request
     │
     ▼
Scheduler
     │
     ▼
Select Node
     │
     ▼
Select / Create MicroVM
     │
     ▼
Load Function
     │
     ▼
Execute
     │
     ▼
Return Result
     │
     ▼
Destroy / Reuse / Snapshot
```

The platform can support multiple execution strategies.

### Cold execution

```text
Request
  │
  ▼
Create VM
  │
  ▼
Boot
  │
  ▼
Execute
```

### Warm execution

```text
Request
  │
  ▼
Existing VM
  │
  ▼
Execute
```

### Snapshot execution

```text
Request
  │
  ▼
Load Snapshot
  │
  ▼
Resume VM
  │
  ▼
Execute
```

Firecracker supports snapshot creation and restoration, with guest memory and microVM state represented separately; block devices are managed separately from that state.

---

# 20. Startup Performance

Firecracker is explicitly optimized for fast microVM startup.

The project's current specification defines a target for VMM startup and continuously tests its performance characteristics. The official specification currently states an API-socket availability target of up to 8 CPU milliseconds under its specified benchmark conditions, while noting that wall-clock behavior varies by environment.

The Firecracker project also currently describes application/user-space startup in the roughly 125 ms range and microVM creation rates up to approximately 150 microVMs/second/host under its stated conditions.

These numbers should be treated as **reference specifications rather than universal guarantees**.

Actual performance depends on:

* CPU architecture
* host kernel
* guest kernel
* root filesystem
* workload
* storage
* network setup
* snapshot usage
* host contention
* scheduler configuration

---

# 21. MicroVM Density

Firecracker's small memory overhead allows high workload density.

Conceptually:

```text
Traditional VM host

┌──────────────────────────────┐
│ VM 1                         │
│                              │
├──────────────────────────────┤
│ VM 2                         │
│                              │
├──────────────────────────────┤
│ VM 3                         │
│                              │
└──────────────────────────────┘
```

Firecracker:

```text
┌─────────────────────────────────────────┐
│ Linux Host                              │
│                                         │
│ VM1 VM2 VM3 VM4 VM5 VM6 VM7 VM8 VM9... │
│                                         │
└─────────────────────────────────────────┘
```

The Firecracker project currently describes microVM memory overhead as less than 5 MiB under its documented conditions.

The important platform metric is therefore not simply:

> How many VMs can a server run?

It is:

> **How many useful workloads can a node execute per dollar, watt, GB of RAM, and CPU cycle?**

---

# 22. Snapshots

Snapshots can dramatically improve workload startup workflows.

```text
              BUILD PHASE
                  │
                  ▼
             Boot VM
                  │
                  ▼
          Install environment
                  │
                  ▼
             Initialize
                  │
                  ▼
              Snapshot
                  │
                  ▼
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Node A    Node B    Node C
        │         │         │
        ▼         ▼         ▼
     Resume     Resume     Resume
```

This can be useful for:

* serverless runtimes
* AI agents
* developer environments
* preconfigured containers
* CI runners
* edge functions

Snapshot compatibility must be managed carefully because snapshot formats and VM state compatibility are versioned separately from Firecracker releases.

---

# 23. Vsock

Firecracker supports Virtio-vsock for host/guest communication.

```text
Host
 │
 │
 │ vsock
 │
 ▼
Guest
```

This provides a useful control channel for workloads that need to communicate with the host-side Compute Agent without exposing an ordinary network service.

Potential uses include:

* workload lifecycle messages
* metadata
* secrets delivery
* telemetry
* control signals
* agent communication
* service discovery

The Firecracker documentation provides a dedicated vsock device model for this host/guest communication path.

---

# 24. Metadata Service

A metadata service can expose controlled information to a guest.

Conceptually:

```text
MicroVM
   │
   │ metadata request
   ▼
Metadata Service
   │
   ├── Workload identity
   ├── Node identity
   ├── Region
   ├── Resources
   ├── Temporary credentials
   └── Configuration
```

The metadata service should never expose unrestricted host information.

The platform should implement explicit namespaces and access policies.

---

# 25. Storage Architecture

Firecracker can attach file-backed block devices.

```text
                 Host Storage
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       rootfs      volume      cache
          │          │          │
          └──────────┼──────────┘
                     ▼
                Firecracker
                     │
                  Virtio
                     │
                     ▼
                   Guest
```

Storage can be categorized as:

### Ephemeral

Destroyed with the workload.

### Persistent

Stored independently from the VM lifecycle.

### Cached

Reconstructed from a source of truth.

### Distributed

Replicated across mesh nodes.

This separation is important because the compute instance should not necessarily own application state.

---

# 26. Persistent Memory / pmem

Firecracker also supports a `virtio-pmem` device.

This can expose a host-backed memory-mapped file to the guest as persistent-memory-style storage.

Conceptually:

```text
Host
 │
 └── memory-mapped backing file
            │
            ▼
        virtio-pmem
            │
            ▼
          Guest
            │
            ▼
        /dev/pmem*
```

This can be useful for specialized workloads where memory-mapped persistent data access is desirable.

It should be treated as an advanced storage primitive rather than the default application storage model.

---

# 27. Device Model

Firecracker intentionally exposes a minimal set of virtual hardware.

This is a major part of its security model.

Instead of emulating a general-purpose server:

```text
CPU
GPU
NIC
USB
SCSI
IDE
BIOS
PCI
Sound
Serial
...
```

Firecracker focuses on a much smaller device surface.

Typical resources include:

* vCPU
* memory
* virtio block
* virtio network
* vsock
* entropy
* selected advanced devices

The reduced device model decreases unnecessary attack surface.

---

# 28. CPU Templates

CPU templates can be used to control exposed CPU features and improve compatibility across hosts.

This becomes important for a distributed compute network.

```text
Node A
Intel CPU
    │
    ▼
CPU Template
    │
    ▼
Standardized VM


Node B
AMD CPU
    │
    ▼
CPU Template
    │
    ▼
Standardized VM
```

The scheduler can use CPU capability information when determining workload placement.

---

# 29. Distributed Scheduling

Firecracker becomes significantly more powerful when combined with a distributed scheduler.

```text
                    GLOBAL SCHEDULER
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Local Node       Edge Node       Cloud Node
          │                │                │
      Firecracker      Firecracker      Firecracker
          │                │                │
        VM A             VM B             VM C
```

The scheduler can evaluate:

```text
Node:
  CPU
  Memory
  Storage
  Network
  Latency
  Location
  Reputation
  Availability
  Price
  Trust
  Hardware
  Energy
```

This creates a resource market rather than a static cloud.

---

# 30. Veritsa Integration

The platform's **Veritsa reputation/trust system** can be integrated into Firecracker scheduling.

A node can receive a trust score based on:

* uptime
* successful workloads
* resource accuracy
* network behavior
* failed jobs
* malicious behavior
* historical reliability
* operator identity
* hardware attestation
* security posture

Example:

```text
Node A
Veritsa: 98
CPU: 64
RAM: 256 GB
Network: 10 Gbps
Price: Low
Availability: 99.99%

        │
        ▼

HIGH TRUST
        │
        ▼
Eligible for sensitive workloads
```

A low-reputation node could still participate while receiving less sensitive or lower-value workloads.

This creates a separation between:

**compute capacity**

and

**compute trust**.

---

# 31. Marketplace Integration

Firecracker provides the execution mechanism while the marketplace determines economic allocation.

```text
             COMPUTE MARKETPLACE
                     │
       ┌─────────────┼─────────────┐
       │             │             │
     Buyer         Scheduler      Node
       │             │             │
       └─────────────┼─────────────┘
                     │
                     ▼
              Firecracker VM
                     │
                     ▼
                  Workload
```

A workload request could specify:

```yaml
cpu: 2
memory: 4096
storage: 20GB
network: 500Mbps
duration: 30m

region: nearest
trust: high
execution: microvm
persistence: ephemeral
```

The scheduler finds a compatible node.

---

# 32. Workload Placement

A placement algorithm can score nodes using:

```text
placement_score =
    locality
  + capacity
  + availability
  + reputation
  + price
  + hardware compatibility
  + network quality
  + energy efficiency
  - congestion
```

Firecracker then provides the isolated execution environment on the selected node.

---

# 33. Local / Private / Public Cloud

The same execution abstraction can span multiple environments.

```text
                    COMPUTE FABRIC
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
     LOCAL              PRIVATE            PUBLIC
     CLOUD              CLOUD              CLOUD
       │                  │                  │
 Firecracker          Firecracker        Firecracker
       │                  │                  │
       ▼                  ▼                  ▼
     Device             Enterprise         Provider
```

The workload API remains consistent.

Only the scheduler and node provider change.

---

# 34. Edge-to-Cloud Escalation

A workload can dynamically move through the infrastructure hierarchy.

```text
LOCAL
 │
 ├── sufficient capacity?
 │        │
 │       YES
 │        │
 │        ▼
 │     EXECUTE
 │
 NO
 │
 ▼
LAN / EDGE
 │
 ├── sufficient capacity?
 │
 YES
 │
 ▼
EXECUTE
 │
 NO
 │
 ▼
REGIONAL CLOUD
 │
 ▼
EXECUTE
```

This creates a **continuum of compute** rather than a hard boundary between local and cloud computing.

---

# 35. Confidential Computing

Firecracker should also be treated as a potential component of a broader confidential-computing architecture.

```text
Application
    │
    ▼
Firecracker
    │
    ▼
KVM
    │
    ▼
Confidential VM Technology
    │
    ▼
Hardware
```

Depending on hardware and platform support, confidential-computing mechanisms can provide additional protection for guest memory from privileged host software.

Firecracker itself should not be described as automatically providing confidential computing.

Instead:

> Firecracker provides the microVM abstraction; confidential-computing hardware and host configuration can provide additional memory-protection guarantees.

---

# 36. Firecracker + Post-Quantum Security

Firecracker is an execution layer rather than a cryptographic protocol.

The platform's post-quantum architecture therefore belongs around it.

```text
             Identity Layer
                   │
             PQC Authentication
                   │
                   ▼
             Compute Scheduler
                   │
                   ▼
              Firecracker
                   │
                   ▼
                Workload
```

Network communications can use the platform's existing cryptographic architecture, including modern TLS and post-quantum key establishment where supported.

The microVM does not need to implement the platform's identity protocol itself.

---

# 37. Observability

Every microVM should produce telemetry.

```text
                 Firecracker
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Logs         Metrics       Events
        │            │            │
        └────────────┼────────────┘
                     ▼
             Compute Agent
                     │
                     ▼
             Observability
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Billing     Veritsa    Scheduler
```

Metrics should include:

### Compute

* CPU utilization
* CPU time
* vCPU allocation

### Memory

* assigned memory
* consumed memory
* pressure

### Storage

* read operations
* write operations
* bytes transferred

### Network

* ingress
* egress
* packet counts
* bandwidth

### Lifecycle

* boot time
* execution time
* shutdown time
* failure reason

### Security

* policy violations
* sandbox violations
* abnormal behavior
* network policy violations

---

# 38. Billing

Firecracker's resource model maps naturally onto usage-based billing.

A workload can be charged according to:

```text
CPU-seconds
+
GB-seconds
+
GB storage
+
network egress
+
execution duration
+
special hardware
```

Example:

```text
Workload
│
├── 2 vCPU × 60 seconds
├── 4 GB RAM × 60 seconds
├── 10 GB storage
└── 200 MB egress
       │
       ▼
   Usage Meter
       │
       ▼
    Marketplace
       │
       ▼
   Settlement
```

This creates a transparent compute marketplace.

---

# 39. Resource Accounting

The platform should distinguish:

```text
ALLOCATED
    │
    ▼
RESERVED
    │
    ▼
ACTUALLY USED
    │
    ▼
BILLED
```

Firecracker provides the execution boundary.

The Compute Agent provides resource measurement.

The marketplace provides settlement.

---

# 40. MicroVM Images

Workloads should be distributed as reproducible images or image manifests.

Conceptually:

```text
Image Manifest
│
├── Kernel
├── RootFS
├── Configuration
├── Runtime
├── Environment
└── Signature
```

The scheduler can verify:

```text
Image
  │
  ▼
Hash
  │
  ▼
Signature
  │
  ▼
Trusted Registry
  │
  ▼
Execute
```

This helps prevent unauthorized workload modification.

---

# 41. Immutable Execution

A preferred model is:

```text
Signed Image
     │
     ▼
Create VM
     │
     ▼
Execute
     │
     ▼
Destroy
```

Instead of modifying a long-lived server.

This reduces configuration drift.

It also makes workloads easier to:

* reproduce
* migrate
* audit
* cache
* replicate
* restart

---

# 42. Ephemeral Compute

The default serverless model should favor ephemeral workloads.

```text
REQUEST
   │
   ▼
CREATE
   │
   ▼
EXECUTE
   │
   ▼
RETURN
   │
   ▼
DESTROY
```

Persistent state should live elsewhere.

```text
                 Application
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    Firecracker VM         Persistent State
          │                     │
     ephemeral             CRDT / Storage
```

This separation makes workload scheduling much easier.

---

# 43. Stateful Workloads

Stateful workloads can still be supported.

```text
                 Stateful Service
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       Firecracker VM         Persistent Volume
             │                     │
             └──────────┬──────────┘
                        ▼
                    Storage Layer
```

The VM becomes replaceable.

The data does not.

This is an important principle for distributed infrastructure.

---

# 44. Failure Recovery

MicroVMs should be treated as disposable compute resources.

If a node fails:

```text
Node A
 │
 └── VM A
      │
      X
    FAILED
      │
      ▼
Scheduler
      │
      ▼
Node B
      │
      ▼
Restore / Restart
      │
      ▼
VM B
```

For stateless workloads, restart from the image.

For stateful workloads, reconstruct from persistent state.

For snapshot-enabled workloads, restore from snapshot where compatible.

---

# 45. Node Failure

The distributed network should not depend on a particular Firecracker host.

```text
                  Workload
                     │
                     ▼
                  Scheduler
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        Node A     Node B     Node C
        failed       │           │
                     │
                     ▼
                  Execute
```

This makes infrastructure resilient to:

* node shutdown
* hardware failure
* network failure
* operator removal
* resource exhaustion
* maintenance
* regional outages

---

# 46. Security Boundaries

The platform should maintain explicit security boundaries.

```text
Tenant
   │
   ▼
Workload
   │
   ▼
MicroVM
   │
   ▼
Jailer
   │
   ▼
Host
   │
   ▼
Node
   │
   ▼
Mesh
```

Each layer should have separate permissions.

A workload should not automatically receive:

* host filesystem access
* host process access
* host credentials
* host network access
* unrestricted device access

---

# 47. Host Security

Firecracker security ultimately depends on the host as well.

Production nodes should therefore implement:

* minimal Linux installation
* automatic security updates
* locked-down SSH
* secure boot where appropriate
* disk encryption
* firewall policy
* restricted management interfaces
* kernel hardening
* cgroup configuration
* filesystem permissions
* monitoring
* intrusion detection
* workload isolation

Firecracker's production host guidance explicitly treats host configuration as part of the security boundary.

---

# 48. Firecracker Process Architecture

A production node can look like:

```text
                         NODE AGENT
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
        Scheduler         Monitor          Identity
            │                │                │
            └────────────────┼────────────────┘
                             │
                             ▼
                         Jailer
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         Firecracker    Firecracker    Firecracker
             VM A           VM B           VM C
              │              │              │
             KVM            KVM            KVM
```

Each microVM can have independent:

* resources
* filesystem
* networking
* identity
* lifecycle
* telemetry
* policy

---

# 49. Compute Agent

The platform should wrap Firecracker with a dedicated agent.

Example conceptual interface:

```typescript
interface ComputeAgent {
  createWorkload(spec: WorkloadSpec): Promise<Workload>;
  startWorkload(id: string): Promise<void>;
  stopWorkload(id: string): Promise<void>;
  destroyWorkload(id: string): Promise<void>;

  getMetrics(id: string): Promise<Metrics>;
  getLogs(id: string): Promise<Logs>;

  snapshot(id: string): Promise<Snapshot>;
  restore(snapshot: Snapshot): Promise<Workload>;

  getCapacity(): Promise<NodeCapacity>;
}
```

The agent translates these operations into Firecracker API calls.

---

# 50. Workload Abstraction

Applications should interact with a platform-level workload abstraction.

```typescript
interface WorkloadSpec {
  image: string;

  cpu: number;
  memory: number;

  storage?: {
    size: number;
    persistent?: boolean;
  };

  network?: {
    ingress?: boolean;
    egress?: boolean;
    bandwidth?: number;
  };

  environment?: Record<string, string>;

  security?: {
    trustLevel: string;
    isolation: 'sandbox' | 'microvm';
  };
}
```

The scheduler decides how this specification is realized.

---

# 51. Execution Abstraction

The platform should not expose Firecracker directly to application developers.

Instead:

```text
                    Developer API
                         │
                         ▼
                   Workload API
                         │
                         ▼
                     Scheduler
                         │
               ┌─────────┴─────────┐
               │                   │
               ▼                   ▼
             Litebox           Firecracker
               │                   │
               └─────────┬─────────┘
                         ▼
                     Execution
```

This allows the infrastructure to evolve without breaking applications.

---

# 52. Firecracker as the Default Strong Isolation Layer

A useful policy is:

```text
                    WORKLOAD
                       │
                       ▼
                Security Policy
                       │
          ┌────────────┼────────────┐
          │            │            │
       Trusted       Unknown     Sensitive
          │            │            │
          ▼            ▼            ▼
      Container    Firecracker   Firecracker
```

Firecracker becomes the default for workloads where isolation matters.

---

# 53. AI Agent Execution

Firecracker is particularly useful for AI agent workloads.

An agent may need to:

* execute shell commands
* inspect files
* install packages
* run code
* compile software
* access APIs
* create artifacts

Instead of granting an agent direct host access:

```text
AI Agent
   │
   ▼
Firecracker VM
   │
   ├── shell
   ├── filesystem
   ├── compiler
   ├── package manager
   └── application
```

The agent receives an isolated disposable environment.

When the task finishes:

```text
VM
 │
 ▼
Destroy
```

This dramatically reduces the blast radius of agent-generated code.

---

# 54. Developer Environments

The same infrastructure can create temporary development environments.

```text
Developer
    │
    ▼
Create Environment
    │
    ▼
Firecracker
    │
    ├── Node.js
    ├── Python
    ├── Rust
    ├── Go
    └── npm
    │
    ▼
Browser / IDE
```

This is especially compatible with browser-based developer platforms.

The browser becomes the interface while Firecracker provides the isolated remote execution environment.

---

# 55. Browser + Local + Edge Architecture

The overall platform can combine:

```text
                 Browser
                    │
          ┌─────────┴─────────┐
          │                   │
      Local Runtime       Remote Runtime
          │                   │
          ▼                   ▼
       Litebox            Firecracker
                              │
                     ┌────────┼────────┐
                     ▼        ▼        ▼
                   Edge     Private   Cloud
```

This allows the platform to select execution based on:

* security
* latency
* cost
* capacity
* privacy
* workload requirements

---

# 56. Why Firecracker Matters to the Platform

Firecracker provides one of the most important primitives in the infrastructure stack:

> **A standardized, lightweight, isolated unit of compute.**

Instead of treating a server as the smallest unit:

```text
Server
└── Application
```

the platform can treat the microVM as the unit:

```text
Server
├── MicroVM
├── MicroVM
├── MicroVM
├── MicroVM
├── MicroVM
└── MicroVM
```

This makes compute divisible.

---

# 57. Compute as a Network Resource

Once compute is divisible, it can become a network resource.

```text
                 COMPUTE NETWORK
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
    Node A           Node B           Node C
       │               │                │
    ┌──┼──┐         ┌──┼──┐         ┌──┼──┐
    │  │  │         │  │  │         │  │  │
   VM  VM VM        VM VM VM        VM VM VM
```

The scheduler can dynamically allocate those units.

This is the foundation for a decentralized compute marketplace.

---

# 58. Infrastructure Stack

Firecracker fits into the broader architecture as follows:

```text
┌─────────────────────────────────────────────────────────┐
│                    APPLICATIONS                         │
├─────────────────────────────────────────────────────────┤
│ APIs • Agents • Functions • Containers • Services       │
├─────────────────────────────────────────────────────────┤
│                  PLATFORM CONTROL PLANE                 │
├─────────────────────────────────────────────────────────┤
│ Scheduler • Marketplace • Identity • Veritsa • Billing  │
├─────────────────────────────────────────────────────────┤
│                  DISTRIBUTED FABRIC                     │
├─────────────────────────────────────────────────────────┤
│ P2P • Mesh • CRDT • Discovery • Routing • GeoDNS/BGP   │
├─────────────────────────────────────────────────────────┤
│                  EXECUTION LAYER                        │
├─────────────────────────────────────────────────────────┤
│ Litebox • Firecracker • Containers • Web Workers        │
├─────────────────────────────────────────────────────────┤
│                  HOST ISOLATION                          │
├─────────────────────────────────────────────────────────┤
│ Jailer • cgroups • namespaces • Linux security         │
├─────────────────────────────────────────────────────────┤
│                  VIRTUALIZATION                          │
├─────────────────────────────────────────────────────────┤
│ KVM • Hardware Virtualization                           │
├─────────────────────────────────────────────────────────┤
│                    HARDWARE                              │
├─────────────────────────────────────────────────────────┤
│ CPU • RAM • SSD • NIC • GPU • NPU                       │
└─────────────────────────────────────────────────────────┘
```

---

# 59. Firecracker's Role in the Architecture

| Component       | Responsibility                    |
| --------------- | --------------------------------- |
| CRDT            | Distributed state synchronization |
| P2P / Mesh      | Node-to-node communication        |
| Scheduler       | Workload placement                |
| Marketplace     | Resource allocation and economics |
| Veritsa         | Node/workload reputation          |
| Identity        | Authentication and authorization  |
| Compute Agent   | Local node orchestration          |
| Litebox         | Lightweight sandbox execution     |
| **Firecracker** | **Strong microVM isolation**      |
| Jailer          | Host-side Firecracker isolation   |
| KVM             | Hardware virtualization           |
| Linux           | Host operating system             |
| Hardware        | Physical compute                  |

This separation keeps the architecture modular.

---

# 60. Firecracker Is Not the Cloud

Firecracker should not be treated as a complete cloud platform.

It does not independently provide:

* global scheduling
* identity
* billing
* service discovery
* object storage
* distributed databases
* marketplace settlement
* global networking
* DNS
* observability platforms
* user management

Those belong to the surrounding platform.

Firecracker provides:

> **The secure execution primitive.**

---

# 61. Firecracker Is Not a Container Runtime

Similarly, Firecracker is not itself a conventional container runtime.

A container runtime can be placed inside a microVM.

```text
Firecracker
    │
    ▼
Linux Guest
    │
    ▼
Container Runtime
    │
    ├── Container A
    ├── Container B
    └── Container C
```

This allows the platform to combine:

**container portability**

with

**VM-level isolation**.

---

# 62. Recommended Platform Architecture

The recommended architecture is:

```text
                     USER
                      │
                      ▼
                Platform API
                      │
                      ▼
                 Scheduler
                      │
          ┌───────────┼───────────┐
          │           │           │
       Veritsa     Marketplace   Identity
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
                 Compute Agent
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
          Litebox          Firecracker
                               │
                            Jailer
                               │
                             KVM
                               │
                           Linux Host
                               │
                           Hardware
```

---

# 63. Operational Principles

The Firecracker integration should follow several principles.

### Principle 1 — Never expose Firecracker directly

The Firecracker API socket belongs to the local Compute Agent.

### Principle 2 — Treat microVMs as disposable

Persistent state belongs outside the execution environment.

### Principle 3 — Prefer immutable images

Workloads should be reproducible.

### Principle 4 — Enforce resource limits

Every workload receives explicit CPU, memory, storage, and network policies.

### Principle 5 — Verify workload identity

Images and workloads should be authenticated before execution.

### Principle 6 — Measure everything

Resource consumption should feed scheduling, billing, and reputation.

### Principle 7 — Fail closed

Security configuration failures should prevent execution rather than silently downgrade isolation.

### Principle 8 — Separate control plane and data plane

The Compute Agent controls the microVM while the workload performs application work.

### Principle 9 — Keep state outside compute

VM replacement should not destroy application state.

### Principle 10 — Make execution portable

The same workload abstraction should work across local, edge, private, and public infrastructure.

---

# 64. Performance Philosophy

The objective is not simply maximum VM startup speed.

The platform should optimize:

```text
Useful Compute / Total Infrastructure Cost
```

That includes:

* CPU utilization
* memory utilization
* startup latency
* workload density
* network utilization
* storage utilization
* energy consumption
* scheduling efficiency
* failure recovery

Firecracker's small footprint and fast startup characteristics make it well suited to this model.

---

# 65. Future Hardware

The architecture should remain hardware-agnostic.

Potential compute nodes include:

```text
x86_64
├── Intel
└── AMD

ARM64
├── AWS Graviton
├── Ampere
└── Edge ARM systems
```

The platform scheduler should advertise hardware capabilities independently of Firecracker.

```text
Node Capability
│
├── Architecture
├── CPU features
├── RAM
├── Storage
├── Network
├── GPU
├── NPU
├── TEE
└── Availability
```

The Firecracker layer then becomes one implementation of the compatible CPU virtualization substrate.

---

# 66. Advanced Device Support

Firecracker's modern API includes additional capabilities beyond the basic CPU/memory/network/block-device model.

These include:

* vsock
* entropy
* pmem
* memory hotplugging
* device hotplugging in developer-preview contexts
* snapshot management
* metadata configuration
* rate limiting

The exact availability and maturity of advanced features should always be checked against the Firecracker release being deployed.

---

# 67. Version Management

Firecracker should be version-pinned.

```text
Platform Release
      │
      ├── Firecracker version
      ├── Kernel version
      ├── RootFS version
      ├── Jailer version
      └── Agent version
```

A node should report:

```yaml
firecracker:
  version: x.y.z

jailer:
  version: x.y.z

kernel:
  version: x.y.z

architecture:
  x86_64
```

This is particularly important for snapshots and workload reproducibility.

---

# 68. Snapshot Compatibility

Snapshots should not be assumed to be universally portable.

The platform should maintain metadata such as:

```yaml
snapshot:
  architecture: x86_64
  firecracker_version: x.y.z
  snapshot_format: n
  kernel: hash
  rootfs: hash
```

The scheduler can then determine whether a snapshot can safely execute on a target node.

---

# 69. Node Capability Advertisement

A node can advertise:

```yaml
node:
  id: node-123

hardware:
  architecture: x86_64
  cpu: 32
  memory_gb: 128

execution:
  firecracker: true
  litebox: true
  containers: true

security:
  reputation: 97
  attestation: true
  secure_boot: true

network:
  bandwidth_mbps: 10000

storage:
  nvme_gb: 2000
```

The marketplace then becomes capable of matching workloads against infrastructure capabilities.

---

# 70. Example End-to-End Request

A developer submits:

```yaml
workload:
  image: sha256:abc123

  cpu: 2
  memory: 4096

  network:
    egress: true

  execution:
    isolation: microvm

  requirements:
    trust: high
    region: nearest
```

The platform:

```text
API
 │
 ▼
Identity
 │
 ▼
Marketplace
 │
 ▼
Scheduler
 │
 ▼
Veritsa
 │
 ▼
Select Node
 │
 ▼
Compute Agent
 │
 ▼
Jailer
 │
 ▼
Firecracker
 │
 ▼
KVM
 │
 ▼
Linux Guest
 │
 ▼
Workload
```

Telemetry flows in the opposite direction:

```text
Workload
   │
   ▼
Firecracker
   │
   ▼
Compute Agent
   │
   ├── Metrics
   ├── Logs
   ├── Usage
   ├── Health
   └── Security
   │
   ▼
Platform
   │
   ├── Billing
   ├── Veritsa
   ├── Scheduler
   └── Marketplace
```

---

# 71. Failure and Recovery Model

Firecracker workloads should be designed around failure.

```text
                 WORKLOAD
                    │
             ┌──────┴──────┐
             │             │
          Healthy        Failed
             │             │
             ▼             ▼
          Continue       Detect
                           │
                           ▼
                       Scheduler
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                Restart       Restore
                    │             │
                    └──────┬──────┘
                           ▼
                         Execute
```

This makes individual machines replaceable.

That property is fundamental to distributed infrastructure.

---

# 72. Security + Economics

One of the most powerful aspects of combining Firecracker with the marketplace is that security becomes part of resource pricing.

For example:

```text
Basic Compute
  │
  └── Container

Standard Isolation
  │
  └── Firecracker

High Trust
  │
  └── Firecracker + verified image

High Assurance
  │
  └── Firecracker + attested node + additional security controls
```

Users can therefore purchase different execution guarantees.

---

# 73. Strategic Role

Firecracker enables the platform to move from:

> **renting servers**

toward:

> **buying isolated units of computation.**

That is a major architectural distinction.

The physical infrastructure becomes a resource pool.

The microVM becomes the execution unit.

The scheduler becomes the allocator.

The marketplace becomes the economic layer.

Veritsa becomes the trust layer.

The mesh becomes the connectivity layer.

CRDTs become the distributed-state layer.

Together:

```text
                 DISTRIBUTED CLOUD
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
    TRUST           COMPUTE         NETWORK
   Veritsa        Firecracker         Mesh
       │               │                │
       │               ▼                │
       │           MicroVM              │
       │               │                │
       └───────────────┼────────────────┘
                       │
                       ▼
                 APPLICATION
                       │
                       ▼
                    STATE
                    CRDT
```

---

# 74. Summary

Firecracker is the platform's **strong-isolation compute primitive**.

It provides:

* KVM-backed hardware virtualization
* lightweight microVMs
* minimal virtual hardware
* fast startup
* high workload density
* resource controls
* network isolation
* block devices
* snapshots
* vsock
* host-side Jailer isolation
* serverless-oriented execution

The surrounding platform provides everything Firecracker intentionally does not:

* scheduling
* identity
* reputation
* marketplace
* billing
* discovery
* distributed state
* global networking
* storage
* observability
* workload orchestration

The resulting architecture is:

```text
                    DISTRIBUTED COMPUTE FABRIC
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
     Marketplace           Veritsa               Identity
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                           Scheduler
                              │
                         Compute Agent
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 Litebox            Firecracker
                    │                   │
                    │                 Jailer
                    │                   │
                    │                  KVM
                    │                   │
                    └─────────┬─────────┘
                              │
                         Linux Host
                              │
                           Hardware
```

Firecracker therefore becomes the bridge between the **distributed compute marketplace** and the **physical machines that actually execute workloads**.

It gives the network a standardized unit of secure computation that can be created, scheduled, measured, billed, replicated, migrated, destroyed, and—where appropriate—restored from snapshots.

That makes it an ideal execution substrate for a cloud that is not restricted to a single data center or hyperscaler, but instead spans **local devices, enterprise infrastructure, edge nodes, private clouds, public clouds, and distributed compute meshes**.

---

## Official References

* [Firecracker official project](https://firecracker-microvm.github.io/?utm_source=chatgpt.com) — project overview and architecture.
* [Firecracker GitHub repository](https://github.com/firecracker-microvm/firecracker?utm_source=chatgpt.com) — source, issues, releases, and documentation.
* [Firecracker API specification](https://github.com/firecracker-microvm/firecracker/blob/main/src/firecracker/swagger/firecracker.yaml?utm_source=chatgpt.com) — machine configuration and lifecycle API.
* [Firecracker performance specification](https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md?utm_source=chatgpt.com) — performance and stability requirements.
* [Firecracker Jailer documentation](https://github.com/firecracker-microvm/firecracker/blob/main/docs/jailer.md?utm_source=chatgpt.com) — host-side isolation.
* [Production host setup](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md?utm_source=chatgpt.com) — Linux host security and resource isolation.
* [Snapshot documentation](https://github.com/firecracker-microvm/firecracker/tree/main/docs/snapshotting?utm_source=chatgpt.com) — snapshot architecture and compatibility.
* [Firecracker vsock documentation](https://github.com/firecracker-microvm/firecracker/blob/main/docs/vsock.md?utm_source=chatgpt.com) — host/guest communication.
* [Firecracker Go SDK](https://github.com/firecracker-microvm/firecracker-go-sdk?utm_source=chatgpt.com) — Go integration layer for the Firecracker API.

## License

Firecracker is released under the Apache License 2.0.

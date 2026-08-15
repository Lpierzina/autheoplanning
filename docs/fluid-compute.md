# Fluid Compute & Warm MicroVM Execution

## Overview

Traditional serverless computing often treats each function invocation as an independent execution event. A request arrives, infrastructure is provisioned, the runtime starts, application code is initialized, the workload executes, and the instance is eventually discarded or allowed to expire.

This model provides strong abstraction, but repeatedly creating execution environments introduces unnecessary overhead.

Our **Fluid Compute** architecture takes a different approach.

Instead of continuously starting and stopping servers for individual workloads, the platform maintains a pool of **warm, reusable execution environments**. Incoming workloads are dynamically routed to available capacity, allowing multiple executions to share the lifetime of an already-running environment while maintaining the required isolation boundaries.

This approach combines:

* Instance reuse
* Pre-warmed microVMs
* Runtime reuse
* Bytecode and dependency caching
* Concurrent execution
* Dynamic workload placement
* Automatic scaling
* P2P compute discovery
* Locality-aware scheduling
* MicroVM isolation
* Optional confidential/enclave execution

The result is a compute system that behaves less like repeatedly launching servers and more like a **continuously flowing pool of available execution capacity**.

---

# 1. The Traditional Serverless Lifecycle

A simplified conventional model looks like:

```text
                 REQUEST
                    │
                    ▼
             Provision Instance
                    │
                    ▼
              Start Runtime
                    │
                    ▼
             Load Application
                    │
                    ▼
               Execute Code
                    │
                    ▼
              Return Result
                    │
                    ▼
             Instance Expires
```

Every new execution environment potentially requires:

1. Allocating compute resources
2. Starting a VM or container
3. Starting the runtime
4. Loading application code
5. Loading dependencies
6. Initializing libraries
7. Establishing network resources
8. Executing the workload

The compute itself may only take milliseconds or seconds while the surrounding initialization work can represent a significant fraction of the total execution lifecycle.

This is the fundamental problem Fluid Compute attempts to reduce.

---

# 2. Fluid Compute

Fluid Compute separates **compute capacity** from **individual requests**.

Instead of creating a new execution environment for every request:

```text
Request A → VM A
Request B → VM B
Request C → VM C
Request D → VM D
```

the platform maintains reusable capacity:

```text
                         WARM COMPUTE POOL

             ┌─────────────┐
             │  Warm VM A  │
             └──────┬──────┘
                    │
             ┌──────┼──────┐
             │      │      │
          Request  Request Request
             A       C       E


             ┌─────────────┐
             │  Warm VM B  │
             └──────┬──────┘
                    │
             ┌──────┼──────┐
             │      │      │
          Request  Request Request
             B       D       F
```

The execution environment remains available after an invocation finishes.

The next compatible workload can therefore use an environment that has already completed initialization.

---

# 3. Instance Reuse

Instance reuse is one of the most important optimizations.

Rather than creating an instance whenever demand arrives, the scheduler first searches for an existing execution environment capable of handling the workload.

```text
                    REQUEST
                       │
                       ▼
                 ┌──────────┐
                 │ SCHEDULER│
                 └────┬─────┘
                      │
                Existing capacity?
                   /          \
                 YES           NO
                  │             │
                  ▼             ▼
             Reuse VM       Start VM
                  │             │
                  └──────┬──────┘
                         ▼
                      EXECUTE
```

This dramatically reduces the number of environment startups required to process a given amount of work.

### Without reuse

```text
100 requests
      │
      ▼
100 instance startups
```

### With reuse

```text
100 requests
      │
      ▼
Existing warm capacity
      │
      ├── VM A → 30 executions
      ├── VM B → 25 executions
      ├── VM C → 25 executions
      └── VM D → 20 executions
```

The exact reuse ratio depends on workload characteristics, concurrency limits, isolation requirements, memory pressure, and available capacity.

The important principle is:

> **Do not start a new execution environment when existing capacity can safely perform the work.**

---

# 4. Pre-Warmed MicroVMs

Fluid Compute extends instance reuse by maintaining **pre-warmed execution environments** before requests arrive.

A node can maintain a pool such as:

```text
              NODE COMPUTE POOL

        ┌───────────────────────────┐
        │        WARM CAPACITY      │
        │                           │
        │  VM 01   READY            │
        │  VM 02   READY            │
        │  VM 03   READY            │
        │  VM 04   READY            │
        │                           │
        │  VM 05   INITIALIZING     │
        │  VM 06   DRAINING         │
        └───────────────────────────┘
```

When demand arrives:

```text
REQUEST
   │
   ▼
WARM VM AVAILABLE
   │
   ▼
EXECUTE
```

instead of:

```text
REQUEST
   │
   ▼
CREATE VM
   │
   ▼
BOOT
   │
   ▼
INITIALIZE
   │
   ▼
EXECUTE
```

Pre-warming therefore moves expensive initialization work **ahead of the request path**.

---

# 5. Warm State

A warm execution environment may retain useful initialized state such as:

* Operating-system state
* Runtime initialization
* Loaded libraries
* Application dependencies
* Connection pools
* JIT/runtime state
* Compiled artifacts
* Bytecode caches
* Memory-resident application state where appropriate

The goal is to avoid repeatedly reconstructing the same environment.

Conceptually:

```text
                 COLD EXECUTION

             VM starts
                │
                ▼
          Runtime starts
                │
                ▼
         Dependencies load
                │
                ▼
          Application init
                │
                ▼
             EXECUTE
```

versus:

```text
                 WARM EXECUTION

             ┌───────────────┐
             │ Runtime READY │
             │ Dependencies  │
             │ Loaded        │
             │ Cache READY   │
             └───────┬───────┘
                     │
                  REQUEST
                     │
                     ▼
                  EXECUTE
```

The second path eliminates repeated initialization work.

---

# 6. Bytecode and Runtime Caching

Application initialization can involve more than starting a VM.

The runtime may need to parse, compile, or otherwise prepare application code before execution.

Fluid Compute can therefore maintain caches of reusable execution artifacts.

```text
Source Code
     │
     ▼
Compilation / Initialization
     │
     ▼
Compiled Artifact
     │
     ├──────────────► Cache
     │
     ▼
Execution
```

Subsequent executions can use the cached artifact rather than performing the same initialization work again.

For JavaScript-based workloads, this can include runtime-level bytecode or compiled-code caching where supported.

The broader principle is:

> **Cache computation that does not need to be repeated.**

---

# 7. Concurrent Execution

Fluid Compute can also increase utilization by allowing multiple compatible executions to occur within the lifetime of an existing execution environment.

Conceptually:

```text
                         WARM ENVIRONMENT
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
            Execution A     Execution B     Execution C
                │               │               │
                └───────────────┼───────────────┘
                                │
                            Same VM
```

This is different from simply keeping a VM warm.

The platform is also able to **extract more useful work from already-running capacity**.

Concurrency can reduce the amount of infrastructure required to serve bursty workloads.

The scheduler must nevertheless respect:

* CPU limits
* Memory limits
* I/O contention
* Runtime safety
* Tenant isolation
* Execution time
* Resource quotas
* Application concurrency characteristics

Concurrency is therefore a scheduling decision, not simply an instruction to run everything simultaneously.

---

# 8. MicroVM Reuse

The execution environment can be built around lightweight microVMs rather than repeatedly starting conventional virtual machines.

A simplified lifecycle is:

```text
                    CREATE
                      │
                      ▼
                  INITIALIZE
                      │
                      ▼
                     WARM
                      │
            ┌─────────┼─────────┐
            │         │         │
            ▼         ▼         ▼
          EXEC       EXEC      EXEC
            │         │         │
            └─────────┼─────────┘
                      │
                      ▼
                    IDLE
                      │
              ┌───────┴───────┐
              │               │
           REUSE            DRAIN
              │               │
              ▼               ▼
             WARM           DESTROY
```

The important difference is that **destruction is no longer the default outcome of every request**.

A microVM can become part of a continuously managed compute pool.

---

# 9. P2P Fluid Compute

The architecture becomes substantially more powerful when warm execution environments are distributed across a P2P network.

Instead of:

```text
                   CENTRAL CLOUD

                 ┌──────────────┐
                 │   Scheduler  │
                 └───────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
             VM          VM         VM
```

the platform can operate across many independent nodes:

```text
                    P2P COMPUTE FABRIC

             ┌─────────┐       ┌─────────┐
             │ NODE A  │◄─────►│ NODE B  │
             │         │       │         │
             │ Warm VM │       │ Warm VM │
             └────┬────┘       └────┬────┘
                  │                 │
                  │       ┌─────────┘
                  │       │
                  ▼       ▼
             ┌─────────────────┐
             │     NODE C      │
             │                 │
             │    Warm VMs     │
             └─────────────────┘
```

Each node can advertise available compute capacity.

The distributed scheduler can consider:

* CPU
* Memory
* GPU availability
* Runtime
* Warm-state availability
* Geographic locality
* Network latency
* Bandwidth
* Reputation
* Resource price
* Current utilization
* Application requirements

This turns warm execution into a **distributed resource pool**.

---

# 10. Locality-Aware Warm Capacity

One of the major advantages of the P2P model is that execution does not necessarily need to happen in a distant centralized data center.

Suppose a user requests a workload.

The network might discover:

```text
                    USER
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
       Local Node   Edge PoP   Cloud Node
          │          │          │
       2 ms         15 ms      70 ms
          │          │          │
       WARM VM     WARM VM     COLD VM
```

The scheduler can select the appropriate capacity based on workload requirements.

For latency-sensitive work, a nearby warm node may be preferable.

For compute-intensive work, a more powerful remote node may be preferable.

For private workloads, a node satisfying specific security requirements may be selected.

---

# 11. Fluid Compute + Mesh Connectivity

The networking and execution systems work together:

```text
                         WORKLOAD
                             │
                             ▼
                      MESH DISCOVERY
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
          mDNS            Pkarr/DHT         DNS
             │               │                │
             └───────────────┼────────────────┘
                             │
                             ▼
                       IROH / QUIC
                             │
                  ┌──────────┼──────────┐
                  │          │          │
               Direct      Local      Relay
                  │          │          │
                  └──────────┼──────────┘
                             │
                             ▼
                     COMPUTE SCHEDULER
                             │
                             ▼
                     WARM VM SELECTION
                             │
                             ▼
                         EXECUTION
```

The network therefore doesn't simply find **a server**.

It finds **available execution capacity**.

---

# 12. Warm Capacity as a Marketplace Resource

This also integrates naturally with the compute marketplace.

A node can advertise something conceptually like:

```text
NODE
├── CPU: 16 cores
├── RAM: 64 GB
├── GPU: available
├── Network: 1 Gbps
├── Location: region X
├── Runtime: Node.js
├── Runtime: Python
├── Runtime: WASM
├── Warm instances: 8
├── Concurrent capacity: 32
├── Reputation: high
└── Price: $THEO / compute unit
```

The marketplace therefore becomes capable of pricing **ready-to-execute capacity**, not merely raw hardware.

That is a much more useful abstraction.

---

# 13. Scaling the Warm Pool

Warm capacity should not mean keeping unlimited machines running.

The scheduler continuously adjusts the pool.

```text
                  DEMAND
                    │
          ┌─────────┴─────────┐
          │                   │
        LOW                  HIGH
          │                   │
          ▼                   ▼
     Reduce warm pool     Expand warm pool
          │                   │
          ▼                   ▼
       Drain VMs          Start VMs
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                TARGET POOL
```

A node can maintain a target amount of warm capacity based on predicted or observed demand.

For example:

```text
Minimum warm capacity
        +
Expected demand
        +
Burst capacity
        =
Target warm pool
```

The system can gradually drain unused environments when demand falls.

---

# 14. Avoiding Unnecessary Server Startup

The fundamental optimization can be summarized as:

### Conventional approach

```text
REQUEST
  ↓
START SERVER
  ↓
START RUNTIME
  ↓
LOAD APPLICATION
  ↓
EXECUTE
  ↓
STOP SERVER
```

### Fluid Compute

```text
                  WARM CAPACITY
                       │
REQUEST ───────────────┤
                       ▼
                    EXECUTE
                       │
                       ▼
                 RETURN TO POOL
                       │
                       └───────────────┐
                                       │
                                  NEXT REQUEST
```

This changes the fundamental unit of infrastructure utilization.

Instead of thinking:

> One request → one server lifecycle

the system thinks:

> **One running execution environment → many workloads over its useful lifetime.**

---

# 15. Resource Efficiency

The efficiency benefits come from several mechanisms working together.

### Instance reuse

Reduces repeated environment creation.

### Pre-warming

Moves initialization outside the critical request path.

### Bytecode/runtime caching

Reduces repeated compilation and initialization.

### Concurrent execution

Improves utilization of already-running environments.

### MicroVMs

Provide lightweight isolated execution environments.

### Dynamic scheduling

Moves work toward available capacity.

### P2P placement

Allows nearby or otherwise suitable nodes to provide capacity.

### Warm-pool management

Keeps enough capacity available without requiring every possible capacity unit to remain active.

Together:

```text
       LESS PROVISIONING
              │
              ▼
       LESS INITIALIZATION
              │
              ▼
        MORE REUSE
              │
              ▼
      HIGHER UTILIZATION
              │
              ▼
       LESS IDLE CAPACITY
              │
              ▼
      MORE EFFICIENT COMPUTE
```

---

# 16. The P2P Advantage

A centralized cloud has a relatively fixed relationship:

```text
User
 │
 ▼
Cloud Region
 │
 ▼
Server Cluster
 │
 ▼
Function
```

A P2P Fluid Compute fabric can instead dynamically construct the execution path:

```text
                         USER
                           │
                           ▼
                    MESH DISCOVERY
                           │
                           ▼
                    NODE SELECTION
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       DEVICE             EDGE            CLOUD
          │                │                │
       WARM VM          WARM VM          WARM VM
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                       EXECUTION
```

The closest suitable compute resource can potentially become the execution environment.

This enables a model of:

> **Compute where capacity exists, rather than compute only where a centralized provider owns infrastructure.**

---

# 17. Security and Isolation

Fluid execution does not eliminate the need for isolation.

Each execution environment must still enforce appropriate boundaries between workloads and tenants.

The execution stack can therefore be:

```text
                    WORKLOAD
                       │
                       ▼
              ┌─────────────────┐
              │ Policy / Identity│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     Runtime     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     LiteBox     │
              │   or sandbox    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   Firecracker   │
              │     microVM     │
              └────────┬────────┘
                       │
                       ▼
                   HOST NODE
```

For higher-security workloads, optional confidential-computing or enclave-backed execution can provide an additional protection layer.

---

# 18. Fluid Compute Lifecycle

The complete lifecycle becomes:

```text
                    DEPLOY
                      │
                      ▼
               BUILD ARTIFACT
                      │
                      ▼
             CACHE RUNTIME STATE
                      │
                      ▼
                START MICROVM
                      │
                      ▼
                     WARM
                      │
                      ▼
              ADVERTISE CAPACITY
                      │
                      ▼
             RECEIVE WORKLOAD
                      │
                      ▼
                SCHEDULE
                      │
                      ▼
              CONCURRENT EXECUTION
                      │
                      ▼
                  RESPONSE
                      │
                      ▼
                RETURN TO WARM
                      │
              ┌───────┴────────┐
              │                │
           REUSE             DRAIN
              │                │
              ▼                ▼
          NEXT JOB           SHUTDOWN
```

---

# 19. Architecture Principle

The central principle of the system is:

> **Compute should be fluid, not repeatedly provisioned.**

A workload should not need to create an entirely new server simply because another request arrived.

Instead, the platform maintains a continuously changing pool of execution capacity and routes workloads into that pool.

The infrastructure becomes a **living compute fabric**:

```text
          ┌───────────────────────────────────┐
          │          FLUID COMPUTE            │
          │                                   │
          │  Warm instances                   │
          │  Reusable microVMs                │
          │  Concurrent execution             │
          │  Runtime caching                  │
          │  Dynamic scheduling                │
          │  P2P placement                    │
          │  Locality                         │
          │  Automatic scaling                │
          └───────────────────────────────────┘
```

Rather than repeatedly constructing servers around individual requests, the platform maintains **persistent, reusable execution capacity** and continuously moves workloads through it.

That is the foundation of a P2P Fluid Compute architecture.

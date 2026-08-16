# What Is Compute?

Compute is the work performed by a computer to turn an input into a result.

Whenever you open a website, submit a form, run a program, build an application, query a database, process a video, or ask an AI model a question, **compute is happening somewhere**.

At the simplest level:

```text
Input
  │
  ▼
Compute
  │
  ▼
Output
```

A request comes in, a computer performs work, and a result comes back.

For the infrastructure we are building, this simple idea becomes much more important. We are interested in **where compute happens, how it is isolated, how it moves across a network, and how unused computing resources can become part of a shared distributed compute fabric.**

---

## Compute Is More Than a CPU

The word "compute" is often used to mean CPU processing, but a real execution environment consists of several resources working together.

A workload may require:

* **CPU** — executes instructions and performs general-purpose computation.
* **Memory** — temporarily stores the data and program state being actively used.
* **Storage** — holds application code, dependencies, files, models, and other persistent data.
* **Network** — moves requests, data, and results between computers.
* **GPU** — accelerates highly parallel workloads such as AI, graphics, and scientific computing.

A computer combines these resources into an environment capable of executing software.

```text
                    COMPUTE
                       │
       ┌───────────────┼────────────────┐
       │               │                │
      CPU           Memory           Storage
       │               │                │
       └───────────────┼────────────────┘
                       │
                    Network
                       │
                      GPU
```

Not every workload needs every resource equally.

A web server may be primarily CPU and memory bound. An AI workload may require substantial GPU capacity. A database may depend heavily on memory and storage performance.

---

# Where Does Compute Happen?

For an internet application, compute can happen in several places.

At the simplest level there are two participants:

```text
Client
  │
  │ Request
  ▼
Server
  │
  │ Compute
  ▼
Response
```

The **client** is the device making the request. This might be a browser, phone, desktop computer, another server, or an IoT device.

The **server** is a computer that receives the request, executes software, and returns a result. In modern infrastructure, that server is normally part of a larger network of machines and facilities.

The important observation is:

> **Compute does not inherently belong in a data center. It happens wherever a capable computer executes the required work.**

---

# A Simple Web Request

Consider visiting a website.

```text
Browser
   │
   │ HTTP Request
   ▼
Network
   │
   ▼
Compute
   │
   │ Execute application
   ▼
Response
   │
   ▼
Browser
```

The browser sends a request.

A server receives it.

The server executes some code.

The result is returned to the browser.

The browser then turns that response into the interface you see.

This request → computation → response cycle is one of the most fundamental patterns in modern computing.

---

# Compute in a Modern Cloud

The computer performing the work is rarely isolated.

A modern application may involve:

```text
                         INTERNET
                            │
                            ▼
                         Client
                            │
                            ▼
                         Network
                            │
                ┌───────────┴───────────┐
                │                       │
              CDN                    Compute
                │                       │
        Cached Content              Server
                                        │
                                        ▼
                                    Application
                                        │
                                        ▼
                                    Database
```

Some requests can be answered immediately from a cache.

Others require actual application execution.

This creates an important distinction:

### Data delivery

The system already has the answer and delivers it.

### Compute

The system must perform work to produce the answer.

For example, serving an already-generated image from a nearby cache is primarily data delivery. Generating a personalized page, querying a database, or running an AI model requires computation.

---

# What Does a Compute Server Actually Do?

A server is ultimately just a computer executing instructions.

Suppose an application receives:

```text
GET /users/123
```

The application might:

1. Receive the request.
2. Authenticate the user.
3. Query a database.
4. Process the returned data.
5. Generate a response.
6. Send the response back.

The compute is the work performed during those steps.

```text
Request
   │
   ▼
Application Code
   │
   ├── Authentication
   ├── Database Query
   ├── Data Processing
   ├── Rendering
   └── Response Generation
            │
            ▼
         Response
```

Compute therefore isn't a single operation.

It is the **execution of software against available hardware resources**.

---

# Compute vs. Storage

Compute and storage are related, but they are different things.

**Storage** keeps information.

**Compute** does something with that information.

```text
             Storage
                │
           ┌────▼────┐
           │  Data   │
           └────┬────┘
                │
                ▼
             Compute
                │
                ▼
             Result
```

For example:

A database stores user information.

A compute process reads that information and determines what response to return.

This distinction becomes important in distributed infrastructure because we can distribute compute and storage independently.

---

# Compute vs. Networking

Networking moves information.

Compute processes information.

```text
Computer A
   │
   │ Network
   │
   ▼
Computer B
   │
   │ Compute
   ▼
Result
```

A modern application requires both.

A fast computer with a slow network can still feel slow.

A fast network connected to insufficient compute can also perform poorly.

This is why distributed infrastructure considers **compute, storage, and networking together**.

---

# Compute Is a Resource

A useful way to think about compute is as a resource that can be allocated.

A machine may have:

```text
CPU:       32 cores
Memory:    128 GB
Storage:   4 TB
Network:   10 Gbps
GPU:       1
```

Some of that capacity may currently be unused.

For example:

```text
32 CPU cores
│
├── 8 cores → Workload A
├── 12 cores → Workload B
├── 4 cores → Workload C
└── 8 cores → Available
```

The available capacity can potentially execute additional work.

This is one of the fundamental ideas behind cloud computing and, eventually, the distributed compute model we are building.

---

# Traditional Servers

The simplest model is a dedicated server.

```text
             Server
        ┌──────────────┐
        │ CPU          │
        │ Memory       │
        │ Storage      │
        │ Network      │
        └──────────────┘
               │
               ▼
           Application
```

You provision the machine and keep it running.

This provides:

* Predictable resources
* Persistent processes
* Direct control
* Long-running workloads

But it also creates a problem.

If the application only needs 20% of the machine's capacity, the remaining capacity may sit unused.

```text
Server Capacity

████░░░░░░░░░░░░░░░░

Used       20%
Idle       80%
```

You still have to maintain and pay for the machine.

Traditional server infrastructure therefore trades flexibility and control for potentially inefficient resource utilization.

---

# Virtual Machines

Virtualization allows one physical machine to run multiple isolated virtual machines.

```text
             Physical Machine
        ┌──────────────────────┐
        │        Host OS       │
        ├──────────┬───────────┤
        │    VM A  │    VM B   │
        │          │           │
        │   App    │    App    │
        └──────────┴───────────┘
```

Instead of dedicating the entire physical machine to one workload, its resources can be divided between multiple environments.

This creates a new abstraction:

> **Physical hardware becomes a pool of virtual compute.**

---

# Containers

Containers provide another layer of abstraction.

```text
Physical Machine
       │
       ▼
   Operating System
       │
       ▼
   Container Runtime
       │
   ┌───┼────┬────┐
   ▼   ▼    ▼    ▼
  App App  App  App
```

Containers package applications and their dependencies into portable execution environments.

They are lightweight and useful for running many workloads on the same machine.

However, when running potentially hostile multi-tenant workloads, stronger isolation may be desirable.

That is where microVM-based execution becomes particularly useful for our architecture.

---

# MicroVM Compute

A microVM provides a lightweight virtual machine boundary around a workload.

Conceptually:

```text
Physical Machine
       │
       ▼
      KVM
       │
       ▼
   MicroVM
       │
       ▼
   Container
       │
       ▼
   Workload
```

This lets a compute platform create short-lived, isolated execution environments.

The environment can be created when needed and destroyed when the workload finishes.

```text
Request
   │
   ▼
Create Environment
   │
   ▼
Execute Workload
   │
   ▼
Return Result
   │
   ▼
Destroy Environment
```

This idea becomes central to **Mesh Hive**.

---

# Serverless Compute

Serverless changes how developers interact with compute.

Instead of provisioning a server, the developer provides code and the platform manages the underlying execution capacity.

```text
Developer
    │
    ▼
Function
    │
    ▼
Platform
    │
    ▼
Compute
```

The platform can create execution capacity when requests arrive and remove capacity when demand falls.

The important point is that "serverless" does not mean servers disappear.

**The servers still exist.**

The abstraction simply moves infrastructure management away from the application developer.

---

# The Problem With Idle Compute

Imagine a machine with:

```text
16 CPU cores
```

but only one small workload running:

```text
████░░░░░░░░░░░
```

Most of the machine is waiting.

Now imagine thousands of machines with unused capacity.

The physical resources still consume:

* Electricity
* Cooling
* Hardware capacity
* Network capacity
* Capital
* Maintenance

The challenge becomes:

> **How do we make better use of the compute that already exists?**

This question leads directly toward distributed compute.

---

# Compute Can Be Shared

Instead of thinking about a server as belonging to one application, we can think about its resources as a pool.

```text
                  Physical Machine
                         │
              ┌──────────┴──────────┐
              │    Compute Pool     │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Workload A     Workload B     Workload C
```

Isolation mechanisms make it possible for different workloads to safely share the same physical infrastructure.

This is one of the fundamental ideas behind cloud computing.

---

# From One Machine to Many

Now expand the concept.

Instead of one computer:

```text
Computer
   │
   ├── Workload A
   ├── Workload B
   └── Workload C
```

we have many computers:

```text
Computer A ─── Computer B ─── Computer C
     │              │              │
  Workloads      Workloads      Workloads
```

If these machines can communicate and coordinate, they can begin to behave like a larger compute system.

This is the foundation of distributed computing.

---

# Distributed Compute

Distributed compute means that work can be executed across multiple computers rather than being confined to a single machine.

```text
                 Workload
                    │
                    ▼
               Scheduler
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Machine A    Machine B    Machine C
       │            │            │
     Cell         Cell         Cell
       │            │            │
     Work         Work         Work
```

The scheduler determines where work should execute.

The machines execute the work.

The network connects everything together.

---

# Why Location Matters

Not all compute is equally useful.

A machine 10 milliseconds away may be preferable to a machine 150 milliseconds away.

A machine that already contains the required data may be preferable to one that has to download gigabytes first.

A machine with available GPU capacity may be required for an AI workload.

Therefore, distributed compute must consider more than raw CPU capacity.

It must understand:

```text
Compute
  +
Location
  +
Network
  +
Data
  +
Availability
  +
Security
```

This is where the concept of **edge compute** becomes important.

---

# Edge Compute

Edge compute means executing workloads closer to the users, devices, or data producing the workload.

Instead of:

```text
User
 │
 └──────────────► Distant Data Center
                         │
                       Compute
```

we can have:

```text
User
 │
 ▼
Nearby Edge Node
 │
 ▼
Compute
```

The closer the execution environment is to the source of the request or data, the less network distance may be involved.

This can improve latency and reduce unnecessary traffic.

A distributed network of compute nodes makes this model much more practical.

---

# Compute as a Network Resource

This is the key transition into our architecture.

Instead of viewing compute as:

> "A server I rent."

we can view it as:

> **"A resource available somewhere on the network."**

```text
                     COMPUTE NETWORK

          ┌───────────┐
          │   Peer A  │
          │  CPU/RAM  │
          └─────┬─────┘
                │
        ┌───────┼────────┐
        │       │        │
        ▼       ▼        ▼
    ┌──────┐ ┌──────┐ ┌──────┐
    │Peer B│ │Peer C│ │Peer D│
    │ GPU  │ │ CPU  │ │ RAM  │
    └──────┘ └──────┘ └──────┘
```

Each machine contributes some amount of capacity.

The network discovers that capacity.

Workloads can then be matched to available resources.

---

# The Mesh Compute Model

Mesh Hive takes this concept further by combining distributed compute with peer-to-peer networking.

A machine becomes a **peer**.

The peer advertises its available resources.

Other peers can discover it.

A scheduler can select an appropriate peer.

The workload is executed inside an isolated cell.

```text
Workload
   │
   ▼
Mesh
   │
   ▼
Discover Available Peers
   │
   ▼
Select Best Peer
   │
   ▼
Create Cell
   │
   ▼
Execute
   │
   ▼
Return Result
```

The physical location of the compute becomes an implementation detail.

What matters is whether the network can find an appropriate execution environment.

---

# From Cloud Compute to Mesh Compute

The evolution can be understood as a progression:

```text
Dedicated Server
       │
       ▼
Virtual Machine
       │
       ▼
Container
       │
       ▼
Serverless Function
       │
       ▼
MicroVM / Ephemeral Cell
       │
       ▼
Distributed Compute
       │
       ▼
P2P Mesh Compute
```

Each step makes compute more abstract and more flexible.

The final step is not about eliminating servers.

It is about making **the network itself the compute platform**.

---

# What Mesh Hive Adds

Mesh Hive takes the execution model of isolated ephemeral compute and connects it to a peer-to-peer network.

The basic architecture becomes:

```text
                    APPLICATION
                         │
                         ▼
                      WORKLOAD
                         │
                         ▼
                    MESH NETWORK
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Peer A       Peer B       Peer C
             │           │           │
          Cell A       Cell B       Cell C
             │           │           │
        MicroVM       MicroVM       MicroVM
```

Each peer can contribute compute.

Each workload gets an isolated execution environment.

The mesh handles discovery and communication.

The scheduler determines placement.

The workload does not need to know which physical machine ultimately executes it.

---

# Compute Becomes Portable

The most important abstraction is therefore:

```text
Application
     │
     ▼
Workload
     │
     ▼
Execution Environment
     │
     ▼
Any Suitable Peer
```

A workload can potentially execute on different machines without changing the application itself.

That means compute can become:

* Portable
* Discoverable
* Distributed
* Locality-aware
* Elastic
* Ephemeral
* Isolated
* Market-based

---

# The Big Idea

At the beginning, compute seems simple:

> A computer performs work.

But as infrastructure scales, the question changes.

It becomes:

> **Where should that work happen?**

Then:

> **Which computer has the capacity to perform it?**

Then:

> **Which computer is closest to the data or user?**

Then:

> **Can the network automatically find that computer?**

And finally:

> **Can thousands or millions of computers collectively act as a programmable compute fabric?**

That is the problem Mesh Hive is designed to address.

---

# Compute Is the Foundation

Everything built on top of the infrastructure ultimately comes down to executing software.

```text
                 APPLICATIONS
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
     Web           AI / ML        Services
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                   COMPUTE
                      │
                 ┌────┴────┐
                 │  Cells  │
                 └────┬────┘
                      │
                 MicroVMs
                      │
                    Peers
                      │
                 Mesh Network
                      │
                   Hardware
```

Compute is therefore the fundamental resource beneath the rest of the platform.

The goal of the mesh is not simply to connect computers.

It is to make the **computing capacity of those computers discoverable, secure, schedulable, and usable as one distributed fabric**.

> **Compute is the work.
> The cell is where the work executes.
> The peer provides the resources.
> The mesh connects the resources.
> The scheduler decides where the work goes.**

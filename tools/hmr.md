# Hot Module Replacement (HMR)

Hot Module Replacement (HMR) allows an application to exchange, add, or remove modules while the application is running without requiring a full page reload.

For Autheo, HMR is a core developer-experience capability. It allows builders to modify applications, interfaces, services, and styles while preserving the running development environment wherever possible.

Instead of rebuilding and restarting an entire application after every change, HMR identifies what changed and updates only the affected portion of the application.

This makes the development loop substantially faster:

```text
Edit
  │
  ▼
Source Change
  │
  ▼
Dev Server / Bundler
  │
  ▼
HMR Update
  │
  ▼
Browser Runtime
  │
  ▼
Affected Module Replaced
  │
  ▼
Application Continues Running
````

HMR is particularly valuable for the Autheo developer stack because applications may combine:

* Frontend applications
* Backend services
* Smart contracts
* Identity services
* AI agents
* Distributed compute workloads
* Storage services
* Network services
* Local and remote development nodes

The objective is to make the development environment feel like a continuously running system rather than a sequence of full application restarts.

---

# 1. Why HMR Matters

Traditional development often follows this pattern:

```text
Change Code
    ↓
Recompile
    ↓
Restart Application
    ↓
Reload Browser
    ↓
Reinitialize State
    ↓
Continue Testing
```

For large applications, this creates significant friction.

HMR changes the loop:

```text
Change Code
    ↓
Detect Changed Module
    ↓
Compile Changed Module
    ↓
Send Update
    ↓
Apply Update
    ↓
Continue Running
```

Only the affected portion of the application needs to be updated.

This can provide:

* Faster development
* Reduced rebuild time
* Preserved application state
* Faster UI iteration
* Faster CSS updates
* Faster debugging
* Reduced development compute requirements
* More responsive development environments

For distributed development environments, reducing unnecessary rebuild and restart operations also reduces network traffic and compute consumption.

---

# 2. HMR in the Autheo Developer Environment

Autheo treats HMR as part of the developer runtime rather than as an isolated frontend feature.

A typical development environment can look like:

```text
┌──────────────────────────────────────────────┐
│              Autheo DevHub                  │
│                                              │
│  Source Code                                 │
│      │                                       │
│      ▼                                       │
│  Development Runtime                         │
│      │                                       │
│      ├── Vite / Bundler                      │
│      │                                       │
│      ├── HMR Runtime                         │
│      │                                       │
│      └── Service Runtime                     │
│              │                               │
└──────────────┼───────────────────────────────┘
               │
               ▼
        Browser / Client
               │
               ▼
        Updated Modules
```

The development environment remains active while individual modules are replaced.

This is especially useful when an application contains long-lived state such as:

* Authentication sessions
* Development state
* Application navigation
* UI state
* Open network connections
* Agent sessions
* Local data
* Test environments
* Development wallets
* Mock blockchain state

---

# 3. How HMR Works

HMR consists of several cooperating components.

```text
┌──────────────┐
│ Source Files │
└──────┬───────┘
       │
       │ change detected
       ▼
┌──────────────┐
│ Dev Server   │
│ / Compiler   │
└──────┬───────┘
       │
       │ update
       ▼
┌──────────────┐
│ HMR Runtime  │
└──────┬───────┘
       │
       │ apply
       ▼
┌──────────────┐
│ Application  │
└──────────────┘
```

At a high level:

1. A source file changes.
2. The development server detects the change.
3. The affected module is rebuilt.
4. An HMR update is generated.
5. The browser receives the update.
6. The runtime determines how the update should be applied.
7. The affected module is replaced.
8. Application state is preserved where possible.

---

# 4. HMR Lifecycle

The HMR lifecycle can be divided into four major phases.

## Phase 1 — Detect

The development environment monitors the source tree.

```text
src/
├── components/
├── pages/
├── services/
├── styles/
└── main.ts
```

When a file changes:

```text
components/Button.tsx
        │
        ▼
File Change Detected
```

The development server determines which modules are affected.

---

## Phase 2 — Compile

The changed module is processed by the development toolchain.

Only the necessary portion of the module graph is updated.

For example:

```text
Application
    │
    ├── Header
    │
    ├── Dashboard
    │      │
    │      └── Button ← changed
    │
    └── Footer
```

If `Button` changes, the development environment does not necessarily need to rebuild the entire application.

---

## Phase 3 — Transfer

The updated module is delivered to the running application.

A typical development connection looks like:

```text
Development Server
        │
        │ HMR update
        ▼
Browser HMR Client
```

Depending on the development environment, updates may be delivered through mechanisms such as WebSockets.

---

## Phase 4 — Apply

The browser runtime determines how the update should be applied.

A module may:

* Accept the update itself
* Pass the update to a parent module
* Trigger replacement of a larger dependency tree
* Fall back to a full page reload

The objective is to apply the smallest safe update.

---

# 5. Module Graph

HMR depends on the application's module graph.

Consider:

```text
main.ts
  │
  ├── App.tsx
  │     │
  │     ├── Header.tsx
  │     │
  │     └── Dashboard.tsx
  │             │
  │             └── Button.tsx
  │
  └── styles.css
```

If:

```text
Button.tsx
```

changes, the HMR system examines its dependency relationships.

If the module can safely accept the update:

```text
Button.tsx
     │
     ▼
Replace Module
```

If it cannot:

```text
Button.tsx
     │
     ▼
Dashboard.tsx
     │
     ▼
App.tsx
     │
     ▼
Full Reload
```

This behavior allows HMR to remain safe while still providing extremely fast updates.

---

# 6. HMR Runtime

The HMR runtime is the component running inside the application that understands how updates should be received and applied.

Conceptually:

```text
┌──────────────────────────┐
│       Application        │
│                          │
│  ┌────────────────────┐  │
│  │    HMR Runtime     │  │
│  │                    │  │
│  │  check()           │  │
│  │  download update   │  │
│  │  apply()           │  │
│  │  dispose()         │  │
│  │  accept()          │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

The exact API varies by toolchain.

Autheo applications should generally use the HMR facilities provided by the selected development environment rather than implementing a custom HMR protocol.

---

# 7. Update Detection

The development server maintains knowledge about the current module graph.

When a file changes:

```text
Old Module Graph
       │
       │ source change
       ▼
New Module Graph
       │
       ▼
Determine Difference
```

The system determines:

* Which modules changed
* Which chunks changed
* Which dependencies are affected
* Whether the update can be safely applied
* Whether a full reload is required

---

# 8. HMR Updates

An HMR update can conceptually contain:

```text
Update
├── Module identity
├── Updated module code
├── Dependency information
├── Update metadata
└── Removal information
```

Bundlers may implement this differently.

For example, webpack historically uses an update manifest and update chunks to describe changes between builds.

The underlying principle remains the same:

```text
Current Application
        +
Changed Modules
        ↓
New Application State
```

---

# 9. Module Acceptance

HMR is effectively an opt-in capability at the module boundary.

A module can declare that it knows how to handle an update.

Conceptually:

```text
Module A
   │
   ├── accepts update
   │
   └── replace itself
```

If the changed module cannot handle its own update, the update can propagate upward through its dependency tree.

```text
Changed Module
      │
      ▼
Parent Module
      │
      ▼
Parent Module
      │
      ▼
Application Entry
```

If no suitable update boundary exists, the runtime may perform a full reload.

This is an important safety mechanism.

HMR should never preserve state at the expense of application correctness.

---

# 10. State Preservation

One of the primary advantages of HMR is preserving application state.

Without HMR:

```text
Edit
 ↓
Reload
 ↓
Application State Lost
```

With HMR:

```text
Edit
 ↓
Module Update
 ↓
Application Continues
 ↓
State Preserved
```

For example, a developer working on an application could have:

```text
User
 ├── logged in
 ├── selected workspace
 ├── open dashboard
 ├── development configuration
 └── active session
```

Changing a UI component should not necessarily destroy the entire session.

---

# 11. CSS HMR

CSS is one of the simplest and most visible HMR use cases.

A developer changes:

```css
.dashboard {
    padding: 24px;
}
```

The development server can update the stylesheet without rebuilding the entire application.

```text
CSS Change
    ↓
HMR Update
    ↓
Stylesheet Replacement
    ↓
Browser Updates
```

This produces a development experience similar to editing styles directly through browser developer tools while keeping the source code as the source of truth.

---

# 12. JavaScript and TypeScript HMR

JavaScript and TypeScript modules can also be updated dynamically.

For example:

```ts
export function calculateTotal(items: Item[]) {
    return items.reduce(
        (total, item) => total + item.price,
        0
    );
}
```

After changing the implementation, the development runtime can replace the affected module.

The application does not necessarily need to restart.

---

# 13. React and UI Frameworks

Modern UI frameworks frequently build additional behavior on top of HMR.

For example:

```text
HMR
 │
 ▼
Framework Runtime
 │
 ▼
Component Update
 │
 ▼
Preserve Component State
```

This can allow developers to modify:

* Components
* Hooks
* Styles
* Layouts
* UI logic
* Configuration

while maintaining as much runtime state as possible.

Framework-specific behavior should be documented separately from the underlying HMR mechanism.

---

# 14. HMR and Vite

Autheo frontend projects can use Vite as a development server and build tool.

Vite provides a development server with native support for fast module updates.

The general architecture is:

```text
                Autheo DevHub
                     │
                     ▼
                  Vite
                     │
            ┌────────┴────────┐
            │                 │
       Module Graph       HMR Server
            │                 │
            └────────┬────────┘
                     │
                     ▼
                 Browser
                     │
                     ▼
                HMR Client
```

This provides a fast development loop for modern frontend applications.

See the Vite documentation for the current feature set and HMR implementation details.

---

# 15. HMR and Autheo DevHub

DevHub can use HMR as one layer of its development experience.

A developer workspace may contain:

```text
Project
│
├── Frontend
│   └── HMR
│
├── Backend
│   └── Watch / Restart
│
├── Smart Contracts
│   └── Local Chain
│
├── AI Agents
│   └── Agent Runtime
│
├── Identity
│   └── TheoID
│
└── Infrastructure
    └── Local Services
```

HMR handles the parts of the stack where in-place module replacement is safe.

Other services may require:

* Process restart
* Container restart
* MicroVM replacement
* State migration
* Service redeployment

HMR therefore represents one part of a larger incremental development system.

---

# 16. HMR vs Service Restart

Not every workload should use HMR.

A useful distinction is:

| Change                       | Preferred Development Behavior |
| ---------------------------- | ------------------------------ |
| CSS                          | HMR                            |
| UI component                 | HMR                            |
| Frontend module              | HMR                            |
| Static assets                | HMR / reload                   |
| Backend source               | Process restart or hot reload  |
| Smart contract               | Redeploy                       |
| Database schema              | Migration                      |
| MicroVM image                | Rebuild / replace              |
| Kernel                       | Restart VM                     |
| Infrastructure configuration | Redeploy                       |
| Security policy              | Reconfigure / restart          |

The development platform should choose the smallest safe update mechanism.

---

# 17. HMR and Distributed Compute

Autheo's infrastructure can extend the incremental development model beyond the browser.

Consider:

```text
Developer
    │
    ▼
DevHub
    │
    ├── Browser HMR
    │
    ├── Local Service Runtime
    │
    ├── Remote Development Node
    │
    └── Distributed Compute
```

A frontend change may only require:

```text
Browser Module Update
```

A backend change might require:

```text
Service Restart
```

A workload running inside a microVM might require:

```text
New Artifact
      ↓
New MicroVM
      ↓
Traffic Migration
```

The goal is not to force HMR onto every layer.

The goal is to create an **incremental deployment model** where only the smallest affected unit is replaced.

---

# 18. HMR and MicroVM Development

Autheo can combine fast application-level HMR with isolated infrastructure-level execution.

For example:

```text
Developer
    │
    ▼
DevHub
    │
    ▼
Application
    │
    ├── Frontend
    │     └── HMR
    │
    ├── API
    │     └── Service Reload
    │
    └── Compute Worker
          │
          ▼
       MicroVM
          │
          ▼
      Firecracker
```

This creates multiple levels of incremental development.

```text
LEVEL 1
Browser Module
     ↓
HMR

LEVEL 2
Application Service
     ↓
Service Restart

LEVEL 3
Compute Workload
     ↓
MicroVM Replacement

LEVEL 4
Infrastructure
     ↓
Deployment
```

Each layer has its own lifecycle.

---

# 19. HMR and Firecracker

HMR should not be confused with live modification of a Firecracker microVM.

Firecracker provides isolated execution.

HMR operates primarily at the application module layer.

The relationship is:

```text
┌─────────────────────────────┐
│         DevHub              │
│                             │
│   Application Development   │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
     HMR            Service Runtime
       │                │
       └───────┬────────┘
               ▼
        Workload Artifact
               │
               ▼
        Firecracker VM
```

This separation preserves the security boundary of the microVM while allowing developers to iterate rapidly on application code.

---

# 20. HMR in Local-First Development

Autheo's local-first architecture benefits significantly from HMR.

A developer should be able to modify an application while keeping local resources active.

For example:

```text
Local Node
│
├── Application
├── Identity
├── Local Storage
├── Network Services
└── Development Chain
```

Changing a frontend module should not require:

```text
Stop Node
↓
Restart Services
↓
Reconnect Identity
↓
Reinitialize Storage
↓
Restart Chain
```

Instead:

```text
Change UI
   ↓
HMR
   ↓
Continue
```

This dramatically reduces unnecessary development churn.

---

# 21. HMR and Networked Development

In a distributed development environment, the HMR connection may exist between:

```text
Developer Machine
       │
       │ secure development connection
       ▼
Autheo Development Node
       │
       ▼
Application Runtime
       │
       ▼
Browser
```

The underlying transport and security mechanism depends on the deployment architecture.

HMR should never be exposed as an unauthenticated production control channel.

Development endpoints must be isolated from production services.

---

# 22. Security Considerations

HMR is primarily a development capability.

It should therefore be treated as a privileged development interface.

Production deployments should normally disable development HMR endpoints.

Important controls include:

* Network isolation
* Authentication
* Development-only access
* Secure transport
* Origin validation
* Access control
* Process isolation
* Restricted filesystem access
* Separation from production infrastructure

A development HMR server should never become an unintended remote code execution interface into production infrastructure.

---

# 23. HMR and State Boundaries

Not all state can be safely preserved.

Consider:

```text
Application
│
├── UI State
├── Session State
├── Network State
├── Database State
├── Process State
└── VM State
```

HMR generally operates closest to:

```text
UI State
Application Module State
```

It should not be assumed to preserve:

```text
Database State
VM State
Kernel State
Infrastructure State
```

Each layer has a different lifecycle.

---

# 24. Full Reload Fallback

HMR must have a safe fallback.

If an update cannot be applied correctly:

```text
Module Change
     ↓
HMR Attempt
     │
     ├── Success → Continue
     │
     └── Cannot safely apply
                ↓
           Full Reload
```

A full reload is preferable to leaving the application in an inconsistent state.

The development environment should prioritize correctness over maximum HMR coverage.

---

# 25. HMR Failure Modes

Common causes of HMR fallback include:

* Module graph changes
* Unhandled module updates
* Configuration changes
* Dependency changes
* Runtime errors
* Framework limitations
* Invalid module state
* Changes requiring application initialization
* Changes to environment configuration

When HMR cannot safely apply an update, a full reload or restart is expected behavior.

---

# 26. HMR State Model

A conceptual HMR runtime can be represented as:

```text
┌─────────┐
│  IDLE   │
└────┬────┘
     │
     │ check
     ▼
┌─────────┐
│ CHECKING│
└────┬────┘
     │
     │ update found
     ▼
┌────────────┐
│ DOWNLOADING│
└──────┬─────┘
       │
       ▼
┌─────────┐
│  READY  │
└────┬────┘
     │
     │ apply
     ▼
┌─────────┐
│ APPLYING│
└────┬────┘
     │
     ▼
┌─────────┐
│  IDLE   │
└─────────┘
```

If an update cannot be applied safely:

```text
APPLYING
   │
   ▼
FAILURE
   │
   ▼
FULL RELOAD
```

---

# 27. HMR vs Live Reload

HMR and Live Reload are related but different.

## Live Reload

```text
Source Change
     ↓
Reload Browser
     ↓
Application Restarts
```

## HMR

```text
Source Change
     ↓
Update Module
     ↓
Application Continues
```

The key distinction is state preservation.

```text
Live Reload → reload application

HMR → replace affected modules
```

HMR therefore provides a more granular development mechanism.

---

# 28. HMR vs Production Deployment

HMR is a development optimization.

Production deployment should use versioned artifacts and controlled rollout mechanisms.

```text
DEVELOPMENT

Source
  ↓
HMR
  ↓
Running Application
```

versus:

```text
PRODUCTION

Source
  ↓
Build
  ↓
Artifact
  ↓
Validation
  ↓
Deployment
  ↓
Versioned Runtime
```

This distinction is important for security, reproducibility, and operational reliability.

---

# 29. HMR and Versioned Artifacts

A production Autheo deployment should not depend on mutable development modules.

Instead:

```text
Source
  ↓
Build
  ↓
Artifact
  ↓
Hash
  ↓
Registry / Storage
  ↓
Deployment
```

HMR belongs before this boundary.

```text
Developer Loop
       │
       ▼
      HMR
       │
       ▼
Validated Source
       │
       ▼
Production Build
       │
       ▼
Immutable Artifact
```

---

# 30. Developer Experience

The ideal Autheo development loop should feel continuous:

```text
        ┌───────────────┐
        │   Developer   │
        └───────┬───────┘
                │
             edit
                │
                ▼
        ┌───────────────┐
        │      HMR      │
        └───────┬───────┘
                │
             update
                │
                ▼
        ┌───────────────┐
        │  Application  │
        └───────┬───────┘
                │
             observe
                │
                ▼
        ┌───────────────┐
        │   Developer   │
        └───────────────┘
```

The shorter this loop becomes, the faster developers can iterate.

---

# 31. Autheo Incremental Runtime Model

HMR is one component of a broader Autheo principle:

> Replace the smallest unit necessary to safely apply a change.

This can be represented as:

```text
Code Change
    │
    ├── Module Change
    │       └── HMR
    │
    ├── Service Change
    │       └── Service Reload
    │
    ├── Container Change
    │       └── Container Replacement
    │
    ├── Function Change
    │       └── Function Version
    │
    ├── MicroVM Change
    │       └── MicroVM Replacement
    │
    └── Infrastructure Change
            └── Controlled Deployment
```

This creates a consistent lifecycle model across the Autheo stack.

---

# 32. Recommended Architecture

For an Autheo development environment:

```text
                         AUTHEO DEVHUB
                              │
                 ┌────────────┴────────────┐
                 │                         │
           Development Server        Runtime Services
                 │                         │
              Vite/HMR              APIs / Workers
                 │                         │
                 ▼                         ▼
             Browser                 Isolated Runtime
                                           │
                                           ▼
                                      Firecracker
                                           │
                                           ▼
                                      MicroVM Workload
```

The browser-facing development loop remains extremely fast while compute workloads remain isolated.

---

# 33. Design Principles

Autheo HMR implementations should follow several principles.

### 1. Minimize the update

Replace only what changed.

### 2. Preserve state

Maintain application state whenever safe.

### 3. Prefer correctness

Fall back to reload when an update cannot safely be applied.

### 4. Separate development from production

HMR should not become a production deployment mechanism.

### 5. Preserve security boundaries

HMR must not weaken service, container, or microVM isolation.

### 6. Keep runtimes independent

Frontend HMR should not require restarting unrelated infrastructure.

### 7. Support local-first development

Developers should be able to iterate without depending on remote infrastructure for every change.

---

# 34. Example Development Flow

A developer modifies a dashboard component:

```text
Developer
    │
    │ edit Dashboard.tsx
    ▼
DevHub
    │
    ▼
Vite
    │
    │ detect change
    ▼
HMR Runtime
    │
    │ send module update
    ▼
Browser
    │
    │ replace module
    ▼
Dashboard
    │
    ▼
Existing Application State
     preserved
```

No full application restart is required.

If the modification affects a component that cannot safely accept the update:

```text
Dashboard.tsx
      │
      ▼
HMR boundary unavailable
      │
      ▼
Full Reload
```

---

# 35. Relationship to the Autheo Stack

HMR operates primarily at the developer tooling layer.

```text
┌─────────────────────────────────────────────┐
│ Applications                                │
├─────────────────────────────────────────────┤
│ DevHub / SDKs / Tooling                     │
│                                             │
│ HMR ← Developer Iteration                   │
├─────────────────────────────────────────────┤
│ Services / Agents / Functions               │
├─────────────────────────────────────────────┤
│ Compute / MicroVMs                          │
├─────────────────────────────────────────────┤
│ Distributed Storage / Networking             │
├─────────────────────────────────────────────┤
│ Layer-0 Infrastructure                      │
├─────────────────────────────────────────────┤
│ Layer-1 Blockchain                           │
└─────────────────────────────────────────────┘
```

HMR does not replace these layers.

It makes development across them faster.

---

# 36. HMR as Part of the Developer Operating System

Autheo's developer environment is intended to provide more than a collection of independent tools.

HMR contributes to a unified development operating model:

```text
        WRITE
          │
          ▼
        BUILD
          │
          ▼
       UPDATE
          │
          ▼
        TEST
          │
          ▼
       DEPLOY
          │
          ▼
       OBSERVE
          │
          ▼
        ITERATE
          │
          └───────────────┐
                          │
                          ▼
                         WRITE
```

HMR compresses the first part of this cycle.

Instead of rebuilding the world after every change, the developer can make incremental changes and immediately observe their effect.

---

# 37. Summary

Hot Module Replacement allows running applications to receive module-level updates without requiring a complete page reload.

Its fundamental workflow is:

```text
Source Change
     ↓
Detect
     ↓
Compile
     ↓
Transmit
     ↓
Accept
     ↓
Apply
     ↓
Continue
```

Within Autheo, HMR is primarily a **developer-experience primitive**.

It complements:

* Vite
* DevHub
* Full-stack SDKs
* Local-first development
* Service runtimes
* Distributed compute
* Firecracker microVMs
* AI agent runtimes
* Application deployment infrastructure

The broader architectural principle is:

> **Update the smallest safe unit, preserve state where possible, and maintain isolation between runtime layers.**

HMR provides this principle at the application-module level.

Service reloads, container replacement, microVM replacement, and controlled deployments extend the same principle to progressively larger runtime boundaries.

Together, these mechanisms allow Autheo to provide a continuous development-to-deployment environment without treating every code change as a full system restart.

````

### Recommended placement

I’d put this in the docs hierarchy roughly as:

```text
docs/
├── developer/
│   ├── overview.md
│   ├── devhub.md
│   ├── vite.md
│   ├── hmr.md
│   └── debugging.md
│
├── runtime/
│   ├── overview.md
│   ├── containers.md
│   ├── hypervisors.md
│   ├── firecracker.md
│   └── microvms.md
│
└── infrastructure/
    ├── compute.md
    ├── storage.md
    └── networking.md

The important conceptual connection is that **HMR, containers, and Firecracker shouldn't be documented as unrelated technologies**. They are different levels of the same Autheo execution model: **module → service → workload → microVM → node → network**.

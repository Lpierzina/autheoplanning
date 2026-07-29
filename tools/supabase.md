# Supabase Architecture Overview

> Supabase is an open-source Firebase alternative built around enterprise-grade PostgreSQL infrastructure.
>
> The platform combines a hosted Postgres database with authentication, auto-generated APIs, realtime synchronization, file storage, serverless functions, and AI/vector capabilities into a unified developer platform.

---

# Executive Summary

Supabase is not a traditional backend framework.

Instead, it is a collection of specialized open-source services assembled into a single developer platform.

The core philosophy:

> Use existing open-source infrastructure whenever possible. Build missing pieces when necessary. Provide developers with a Firebase-like experience powered by PostgreSQL.

The foundation of Supabase is:

```
              Supabase Platform

                    │

              PostgreSQL

                    │

 ┌──────────┬──────────┬──────────┬──────────┐

 Auth    APIs     Realtime   Storage

                    │

        Functions + AI + Dashboard
```

Every Supabase project begins with a complete PostgreSQL database.

Additional services expose capabilities around that database:

- Authentication
- REST APIs
- GraphQL
- Realtime subscriptions
- File storage
- Edge Functions
- Vector search
- Database management

---

# Core Architecture

```mermaid
flowchart TD

subgraph platform["Supabase Platform"]
    
    node_dashboard["Supabase Dashboard<br/>Project management<br/>SQL editor<br/>Table editor"]

    node_gateway{{"Kong API Gateway<br/>API routing<br/>Authentication boundary"}}

end


subgraph database["Database Layer"]

    node_postgres[("PostgreSQL<br/>Primary database<br/>Tables, SQL, RLS, Extensions")]

    node_pgvector["pgvector<br/>Vector embeddings<br/>Similarity search"]

end


subgraph api["API Layer"]

    node_postgrest["PostgREST<br/>Automatic REST API<br/>SQL → HTTP"]

    node_graphql["pg_graphql<br/>GraphQL API<br/>Postgres extension"]

    node_meta["postgres-meta<br/>Database management API"]

end


subgraph identity["Authentication"]

    node_gotrue["GoTrue<br/>JWT authentication<br/>Users, sessions, OAuth"]

    node_rls["Row Level Security<br/>Database authorization"]

end


subgraph realtime["Realtime System"]

    node_realtime["Realtime Server<br/>Elixir WebSocket service"]

    node_replication["Postgres Replication<br/>Change stream"]

end


subgraph storage["Storage System"]

    node_storage["Storage API<br/>Object management"]

    node_bucket["Object Storage<br/>Files, images, videos"]

end


subgraph functions["Compute"]

    node_edge["Edge Functions<br/>Serverless execution"]

end


subgraph_clients["Client Applications"]

    node_clients["Web / Mobile Apps<br/>supabase-js<br/>supabase-flutter<br/>supabase-swift"]

end


node_clients -->|"SDK requests"| node_gateway

node_gateway --> node_postgrest
node_gateway --> node_gotrue
node_gateway --> node_realtime
node_gateway --> node_storage
node_gateway --> node_edge
node_gateway --> node_graphql

node_postgrest --> node_postgres
node_graphql --> node_postgres
node_meta --> node_postgres

node_gotrue --> node_postgres
node_postgres --> node_rls

node_postgres --> node_replication
node_replication --> node_realtime

node_storage --> node_postgres
node_storage --> node_bucket

node_postgres --> node_pgvector

node_dashboard --> node_gateway
```

---

# Platform Layers

Supabase can be understood as six major layers:

```
                 Applications

                      │

              Client Libraries

                      │

               API Gateway

                      │

 ┌────────────┬────────────┬────────────┐

Database    Auth       Realtime     Storage

                      │

              PostgreSQL Core
```

---

# PostgreSQL Core

PostgreSQL is the foundation of Supabase.

Every project receives:

- A complete relational database
- SQL access
- Extensions
- Transactions
- Indexing
- Constraints
- Functions
- Triggers
- Row Level Security


Unlike traditional backend-as-a-service platforms, Supabase does not hide the database.

The database is the primary application layer.

```
Application

↓

Supabase API

↓

PostgreSQL

↓

Tables + Functions + Policies
```

---

# Database Extensions

Supabase extends PostgreSQL with additional capabilities.

Examples:

| Extension | Purpose |
|-|-|
| pgvector | AI embeddings and similarity search |
| pg_graphql | GraphQL API generation |
| PostGIS | Geographic data |
| Full Text Search | Search indexing |
| pgcrypto | Cryptography utilities |

---

# Authentication Architecture

Authentication is provided through GoTrue.

GoTrue manages:

- User registration
- Login
- Password recovery
- OAuth providers
- JWT sessions
- Refresh tokens


Authentication flow:

```
User

↓

GoTrue

↓

Create Session

↓

JWT Token

↓

Database Request

↓

Row Level Security Check

↓

Authorized Data
```

---

# Row Level Security

Supabase security is database-native.

Instead of only protecting API routes, authorization happens inside PostgreSQL.

Example:

```
Request

↓

JWT

↓

Database Role

↓

RLS Policy

↓

Allowed Rows
```

A user may query the same table as another user while PostgreSQL automatically filters the results.

Example:

```sql
create policy
"Users can view their own data"

on profiles

for select

using (
 auth.uid() = id
);
```

---

# Automatic REST APIs

PostgREST converts PostgreSQL databases directly into APIs.

A table:

```
users
-----
id
name
email
```

automatically becomes:

```
GET /users

POST /users

PATCH /users?id=eq.1

DELETE /users?id=eq.1
```

Architecture:

```
HTTP Request

↓

PostgREST

↓

SQL Query

↓

PostgreSQL

↓

JSON Response
```

Developers do not manually build CRUD endpoints.

---

# GraphQL Layer

pg_graphql exposes PostgreSQL through GraphQL.

Instead of manually defining schemas:

```
Database Tables

↓

GraphQL Schema

↓

Queries
```

Example:

```graphql
query {
  users {
    id
    email
  }
}
```

PostgreSQL becomes the source of truth.

---

# Realtime Architecture

Realtime enables live database subscriptions.

The flow:

```
Database Change

INSERT
UPDATE
DELETE

        │

        ▼

Postgres Replication

        │

        ▼

Realtime Server

        │

        ▼

WebSocket Clients
```

Realtime is built using Elixir because of its ability to maintain thousands of concurrent connections.

---

# Storage Architecture

Supabase Storage provides object storage for:

- Images
- Videos
- Documents
- User files


Architecture:

```
Application

↓

Storage API

↓

Object Storage

↓

PostgreSQL Metadata

↓

RLS Permissions
```

PostgreSQL controls permissions while objects live in storage.

---

# Edge Functions

Edge Functions provide server-side execution.

They are used for:

- API endpoints
- Webhooks
- Background processing
- Integrations
- Custom business logic


Flow:

```
Request

↓

Edge Function

↓

Business Logic

↓

External APIs

↓

Database
```

Functions run close to users through distributed edge infrastructure.

---

# AI + Vector Architecture

Supabase supports AI workloads through PostgreSQL extensions.

Typical architecture:

```
Document

↓

Embedding Model

↓

Vector Embedding

↓

pgvector

↓

Similarity Search

↓

AI Response
```

Applications can store:

- Text embeddings
- Image embeddings
- Metadata
- Search indexes

inside PostgreSQL.

---

# Dashboard Architecture

The Supabase Dashboard provides management interfaces:

- Table Editor
- SQL Editor
- Authentication management
- Storage browser
- Database policies
- Logs
- API settings


The dashboard communicates with internal management APIs:

```
Dashboard

↓

postgres-meta

↓

PostgreSQL

```

---

# Client SDK Architecture

Supabase uses modular client libraries.

The main client bundles specialized modules:

```
supabase-js

      │

 ┌────┼────┬────┬────┐

Auth REST Realtime Storage Functions
```

Supported ecosystems include:

- JavaScript / TypeScript
- Flutter
- Swift
- Python
- Kotlin
- C#
- Go
- Java
- Ruby
- Rust


---

# Application Request Flow

A typical application request:

```
React / Mobile App

        │

        ▼

Supabase Client SDK

        │

        ▼

Kong API Gateway

        │

        ├──────── Auth

        ├──────── REST API

        ├──────── Realtime

        ├──────── Storage

        └──────── Functions

                    │

                    ▼

              PostgreSQL
```

---

# Complete Platform Model

```
                         Users

                           │

                    Client Applications

                           │

                    Supabase SDKs

                           │

                 Kong API Gateway

                           │

 ┌───────────────┬───────────────┬───────────────┐

 Auth          APIs          Realtime        Storage

                           │

                           ▼

                    PostgreSQL Core

                           │

              ┌────────────┴───────────┐

              ▼                        ▼

          Extensions              Vector AI

```

---

# Design Philosophy

Supabase differs from traditional backend platforms because PostgreSQL remains the center.

Instead of:

```
Application

↓

Hidden Backend

↓

Database
```

Supabase provides:

```
Application

↓

Open APIs

↓

PostgreSQL

↓

Developer Control
```

Benefits:

- Portable data
- Open standards
- SQL-first development
- No proprietary database lock-in
- Enterprise reliability

---

# Summary

Supabase is a complete application platform built around PostgreSQL.

The architecture combines proven open-source systems:

- PostgreSQL for data
- GoTrue for authentication
- PostgREST for APIs
- Realtime for synchronization
- Storage API for files
- pg_graphql for GraphQL
- Edge Functions for compute
- pgvector for AI workloads
- Kong for API management

Together these services create a Firebase-like developer experience while preserving the flexibility, transparency, and power of a traditional PostgreSQL backend.

Supabase is best understood as:

> **PostgreSQL transformed into a complete application development platform.**

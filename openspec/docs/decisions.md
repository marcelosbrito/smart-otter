# Smart Otter — Architecture Decision Records (ADR)

This document records important technical decisions made throughout the project.

---

## ADR-001 — Frontend Framework

**Decision**

Use Next.js (App Router).

**Reason**

* Modern React ecosystem
* Excellent developer experience
* Server Components
* Vercel integration
* Portfolio relevance

---

## ADR-002 — Styling

**Decision**

Tailwind CSS + shadcn/ui.

**Reason**

Fast development with a modern, consistent UI component system.

---

## ADR-003 — Authentication

**Initial Decision**

Clerk (subject to validation during implementation).

**Alternatives**

* Auth.js
* Better Auth

---

## ADR-004 — AI Provider Abstraction

**Decision**

All AI providers must implement a common interface.

Examples:

* Gemini
* Groq
* Ollama

**Reason**

Providers can be replaced without affecting the frontend or business logic.

---

## ADR-005 — Cache Strategy

**Decision**

Every successful AI response is normalized and stored.

Future identical searches should be served from cache whenever possible.

**Benefits**

* Lower latency
* Reduced API usage
* Lower operational cost
* Better resilience

---

## ADR-006 — Developer Mode

**Decision**

Expose a lightweight developer panel for demonstration purposes.

The panel may display:

* Active provider
* Cache hit/miss
* Request duration
* Selected inference engine

This feature exists primarily to showcase engineering decisions during technical interviews.

---

## ADR-007 — Project Philosophy

Smart Otter is built as an engineering portfolio project.

Priority order:

1. Code quality
2. Architecture
3. User experience
4. Performance
5. Additional features

New features should only be added if they reinforce one of these priorities.

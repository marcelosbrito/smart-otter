# Smart Otter — Architecture Overview

## High-Level Architecture

```
                 Next.js Application
                         │
                         ▼
                 Search Request
                         │
                         ▼
                  AI Service Layer
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   Knowledge Cache             Provider Manager
          │                             │
      Cache Hit?                        │
          │                             ▼
    Yes ─────────► Return        Selected Provider
          │                             │
          ▼                             ▼
         No                    Gemini / Groq / Ollama
          │                             │
          └──────────────┬──────────────┘
                         ▼
                 Normalize Response
                         ▼
                    Store in Cache
                         ▼
                  Return to Client
```

---

## Main Components

### Frontend

Responsible for:

* Search interface
* Resource visualization
* Authentication
* Favorites
* Developer Mode

---

### AI Service

Acts as the application's orchestration layer.

Responsibilities:

* Receive search requests
* Validate cache
* Invoke AI providers
* Normalize responses
* Store results
* Return standardized JSON

---

### Knowledge Cache

Stores normalized AI responses.

Benefits:

* Faster searches
* Lower operational cost
* Reduced AI usage
* Offline resilience for previously generated professions

---

### Provider Manager

Abstracts every AI provider behind a common interface.

Examples:

* Gemini
* Groq
* Ollama (Local GPU)

The frontend never communicates directly with a provider.

---

### Developer Mode

A lightweight panel intended primarily for portfolio demonstrations.

Possible features:

* Active provider
* Cache status
* Response source
* Provider switching
* Request timing

---

## Architectural Principles

* Separation of concerns
* Provider abstraction
* Cache-first strategy
* Progressive enhancement
* Low operational cost
* Provider independence
* AI as an interchangeable service
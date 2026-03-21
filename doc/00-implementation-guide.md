# 00 — Implementation Guide

## Purpose
This file is the **main entry point for AI coding tools and developers** working on JoinJoy.

Read this file first before implementing anything.

JoinJoy is an **event-based shared expense app** where:
- a host creates an event
- adds members and expense items
- shares the event link
- participants join and claim what they had
- shared items are split among selected people
- service charge and VAT are allocated proportionally
- the host finalizes the event
- participants pay the host

---

## Project Status
This project is currently at **MVP definition and implementation planning stage**.

The documentation set is designed so implementation can begin immediately.

---

## MVP Scope
### Included
- create event
- add members
- add expense items manually
- share event link via share token
- participants join without login
- participants claim items
- participants split items with others
- host resolves unclaimed items
- service charge and VAT allocation by proportional subtotal
- finalize event
- payout info (bank account / QR)
- payment status tracking

### Excluded for now
- login/auth
- payment gateway integration
- OCR receipt scanning
- push notifications
- advanced edit history
- analytics
- group wallets
- enterprise features

Do not expand scope unless explicitly requested.

---

## Product Direction
JoinJoy should feel like an **event experience**, not an accounting tool.

### Framing
- outside = event / outing
- inside = fair expense claiming

### Tone
- friendly
- clear
- lightweight
- trustworthy

Avoid making the product feel like bookkeeping software.

---

## Primary Source of Truth Files

### Product and UX
- `01-product-concept.md`
- `03-end-to-end-flow.md`
- `05-screen-specs.md`

### Technical implementation
- `06-implementation-tech-stack.md`
- `07-database-and-data-model.md`
- `08-implementation-plan.md`
- `10-api-contract.md`
- `11-nextjs-folder-structure.md`

### Database and sample data
- `09-supabase-schema.sql`
- `12-seed-sample-data.sql`

### Financial logic
- `13-calculation-rules.md`

---

## Read Order for AI
If you are an AI coding assistant, read the documentation in this order:

1. `00-implementation-guide.md`
2. `01-product-concept.md`
3. `03-end-to-end-flow.md`
4. `05-screen-specs.md`
5. `06-implementation-tech-stack.md`
6. `10-api-contract.md`
7. `13-calculation-rules.md`
8. `09-supabase-schema.sql`
9. `11-nextjs-folder-structure.md`

This order gives:
- product understanding
- user flow
- screen behavior
- technical direction
- backend contract
- money logic
- schema
- project structure

---

## Core Rules That Must Not Be Violated

### Rule 1 — No login in MVP
Participants join events via share token and identify themselves by name.

### Rule 2 — Server owns final money logic
The server must own:
- split logic
- subtotal calculation
- service charge allocation
- VAT allocation
- finalization
- final totals snapshot

### Rule 3 — Finalized events are locked
After finalization:
- items cannot be edited
- claims cannot be changed
- event financial settings cannot be changed

### Rule 4 — Shared expenses are first-class
The product must handle:
- single-owner items
- shared items
- unresolved items
- host resolution

### Rule 5 — SC/VAT are proportional
Service charge and VAT must be allocated based on:
`participant_subtotal / event_subtotal`

Use `13-calculation-rules.md` as the source of truth.

---

## Recommended Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Postgres
- Supabase Storage
- Vercel

Do not introduce unnecessary frameworks for MVP.

---

## Recommended Build Order
### Step 1
Set up project structure and dependencies.

### Step 2
Run:
- `09-supabase-schema.sql`
- `12-seed-sample-data.sql`

### Step 3
Implement event creation and overview.

### Step 4
Implement member join and item creation.

### Step 5
Implement claim and split flows.

### Step 6
Implement summary and finalization.

### Step 7
Implement payout and payment status.

### Step 8
Polish loading, empty, and error states.

---

## Immediate Build Priorities
If implementation starts now, begin with:

### Backend first
- create event
- get event by share token
- add participants
- add items
- claim item
- split item
- fetch summary
- finalize event

### Then UI
- home
- create event
- event overview
- claim page
- summary page
- payment page

---

## Notes for AI Coding Tools
When generating code:
- prefer simple and readable architecture
- keep money logic outside UI components
- use route handlers or server actions
- use Zod for validation
- keep share token flow simple
- avoid adding auth unless requested
- avoid over-designing state management

When uncertain, follow the documentation instead of inventing new logic.

---

## Final Reminder
This project should optimize for:
- fairness
- speed
- clarity
- ease of group settlement

The product should help people **close a shared expense quickly without confusion**.

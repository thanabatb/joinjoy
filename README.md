# JoinJoy

JoinJoy is an event-based shared expense app where people join an outing, claim what they had, split shared items, and settle the cost fairly.

This repository now includes the first implementation pass:
- Next.js App Router scaffold
- documented route structure from `doc/11-nextjs-folder-structure.md`
- mock-backed API routes for the MVP flow
- server-owned calculation utilities for subtotal, SC, VAT, and finalization
- mobile-first screens for home, create, overview, claim, summary, host, and payment

## Current Status

The project is in the first implementation stage. It is intentionally built on top of an in-memory mock repository so the product flow can be exercised before wiring Supabase.

What works in this pass:
- create an event from the UI
- add participants
- add items
- inspect event overview
- inspect claim, summary, host, and payment screens
- call MVP API routes against mock data
- finalize an event through the host screen

What is not wired yet:
- Supabase persistence
- file upload for payout QR
- authentication
- realtime collaboration
- full claim interaction UI

## Run Locally

1. Install dependencies
2. Start the dev server

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

The seeded mock event is available at:

```text
/event/jazz-night-demo
```

## Suggested Next Steps

1. Install dependencies and verify the app boots cleanly.
2. Replace the mock repository in `lib/repositories/` with Supabase-backed implementations.
3. Copy the SQL in `sql/01-schema.sql` and `sql/02-seed.sql` into Supabase.
4. Add interactive item claim and split actions on the claim screen.
5. Add payout editing and payment confirmation flows.

## Documentation Map

Read in this order:

1. `doc/00-implementation-guide.md`
2. `doc/01-product-concept.md`
3. `doc/03-end-to-end-flow.md`
4. `doc/05-screen-specs.md`
5. `doc/06-implementation-tech-stack.md`
6. `doc/10-api-contract.md`
7. `doc/13-calculation-rules.md`

## Source of Truth by Topic

- Product direction and MVP scope: `doc/01-product-concept.md`
- Flow and interaction model: `doc/03-end-to-end-flow.md`
- Screen behavior and UI requirements: `doc/05-screen-specs.md`
- Tech stack and architecture: `doc/06-implementation-tech-stack.md`
- Database model: `doc/07-database-and-data-model.md`
- Database schema: `doc/09-supabase-schema.sql`
- API design: `doc/10-api-contract.md`
- Project structure: `doc/11-nextjs-folder-structure.md`
- Money logic and calculation behavior: `doc/13-calculation-rules.md`

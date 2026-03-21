# JoinJoy — Next.js Folder Structure

## 1. Goal
This structure is designed for a practical MVP using:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

It is optimized for:
- clear separation of UI and data logic
- easy API implementation
- room for future scaling
- minimal confusion during MVP development

---

## 2. Recommended Folder Structure

```text
joinjoy/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  │
│  ├─ create/
│  │  └─ page.tsx
│  │
│  ├─ event/
│  │  └─ [shareToken]/
│  │     ├─ page.tsx
│  │     ├─ claim/
│  │     │  └─ page.tsx
│  │     ├─ summary/
│  │     │  └─ page.tsx
│  │     ├─ host/
│  │     │  └─ page.tsx
│  │     └─ payment/
│  │        └─ page.tsx
│  │
│  └─ api/
│     ├─ events/
│     │  └─ route.ts
│     ├─ events/
│     │  └─ [shareToken]/
│     │     ├─ route.ts
│     │     ├─ participants/
│     │     │  └─ route.ts
│     │     ├─ items/
│     │     │  └─ route.ts
│     │     ├─ summary/
│     │     │  └─ route.ts
│     │     ├─ finalize/
│     │     │  └─ route.ts
│     │     ├─ payout/
│     │     │  └─ route.ts
│     │     └─ payment-status/
│     │        └─ route.ts
│     └─ items/
│        └─ [itemId]/
│           ├─ route.ts
│           ├─ claims/
│           │  └─ route.ts
│           ├─ split/
│           │  └─ route.ts
│           └─ clear-claims/
│              └─ route.ts
│
├─ components/
│  ├─ common/
│  │  ├─ page-header.tsx
│  │  ├─ empty-state.tsx
│  │  ├─ loading-state.tsx
│  │  └─ status-badge.tsx
│  │
│  ├─ event/
│  │  ├─ event-hero.tsx
│  │  ├─ event-overview.tsx
│  │  ├─ event-progress.tsx
│  │  └─ share-link-card.tsx
│  │
│  ├─ participants/
│  │  ├─ participant-list.tsx
│  │  ├─ participant-picker.tsx
│  │  └─ add-participant-form.tsx
│  │
│  ├─ items/
│  │  ├─ item-list.tsx
│  │  ├─ item-card.tsx
│  │  ├─ add-item-form.tsx
│  │  ├─ split-item-dialog.tsx
│  │  └─ claim-actions.tsx
│  │
│  ├─ summary/
│  │  ├─ summary-card.tsx
│  │  ├─ summary-list.tsx
│  │  └─ totals-breakdown.tsx
│  │
│  └─ payment/
│     ├─ payout-info-card.tsx
│     ├─ payment-status-list.tsx
│     └─ mark-paid-button.tsx
│
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts
│  │  ├─ server.ts
│  │  └─ admin.ts
│  │
│  ├─ repositories/
│  │  ├─ events.ts
│  │  ├─ participants.ts
│  │  ├─ items.ts
│  │  ├─ claims.ts
│  │  ├─ payments.ts
│  │  └─ payout.ts
│  │
│  ├─ calculations/
│  │  ├─ estimate-summary.ts
│  │  ├─ finalize-summary.ts
│  │  ├─ split-item.ts
│  │  └─ rounding.ts
│  │
│  ├─ validations/
│  │  ├─ event.ts
│  │  ├─ participant.ts
│  │  ├─ item.ts
│  │  └─ payout.ts
│  │
│  ├─ utils/
│  │  ├─ token.ts
│  │  ├─ currency.ts
│  │  ├─ dates.ts
│  │  └─ statuses.ts
│  │
│  └─ guards/
│     ├─ ensure-event-editable.ts
│     ├─ ensure-item-editable.ts
│     └─ ensure-finalizable.ts
│
├─ types/
│  ├─ event.ts
│  ├─ participant.ts
│  ├─ item.ts
│  ├─ claim.ts
│  ├─ payment.ts
│  └─ api.ts
│
├─ hooks/
│  ├─ use-event.ts
│  ├─ use-items.ts
│  ├─ use-summary.ts
│  └─ use-payment-status.ts
│
├─ public/
│  └─ images/
│
├─ sql/
│  ├─ 01-schema.sql
│  └─ 02-seed.sql
│
├─ .env.local
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 3. Folder Responsibilities

## app/
Contains route-level UI and API routes.

### Example pages
- `app/page.tsx` → home
- `app/create/page.tsx` → create event
- `app/event/[shareToken]/page.tsx` → overview
- `app/event/[shareToken]/claim/page.tsx` → claim flow
- `app/event/[shareToken]/host/page.tsx` → host dashboard
- `app/event/[shareToken]/summary/page.tsx` → final summary
- `app/event/[shareToken]/payment/page.tsx` → payment view

### Why this works
Keeps route-based UX easy to reason about.

---

## components/
Reusable UI pieces grouped by feature.

### Why this works
- keeps pages smaller
- easier iteration
- avoids giant page components

---

## lib/repositories/
Database access functions.

### Example
- `events.ts` → create/get/update event
- `items.ts` → add/edit/delete items
- `claims.ts` → claim, split, clear claims

### Why this matters
Avoid putting raw DB queries inside route handlers or page files.

---

## lib/calculations/
All financial logic.

### This is critical
Keep all split and summary logic in dedicated calculation files.
Do not scatter money logic across UI.

### Recommended functions
- estimate participant summary
- split item equally
- compute proportional SC/VAT
- round amounts safely

---

## lib/validations/
Zod schemas for:
- event create/update
- participant add
- item add/edit
- payout update

---

## lib/guards/
Protect business rules.
Examples:
- do not edit finalized event
- do not claim item after finalize
- do not finalize if unresolved items remain

---

## types/
Shared TypeScript types for app-wide consistency.

---

## sql/
Keep SQL files versioned in project.
Useful for:
- documentation
- reset scripts
- local onboarding

---

## 4. Suggested Data Flow Pattern

### UI layer
Collect user input and display state.

### Validation layer
Validate payloads with Zod.

### Repository layer
Read/write from Supabase.

### Calculation layer
Compute summary / split / finalization.

### API layer
Glue everything together.

This separation will save you from chaos later.

---

## 5. Recommended Implementation Order by Folder
### Start with
- `types/`
- `lib/validations/`
- `lib/repositories/`
- `lib/calculations/`
- `app/api/`
- `app/`
- `components/`

This order helps backend logic stay stable before polishing UI.

---

## 6. Minimal Route Set for MVP
You do not need to build everything at once.

### Build first
- home
- create event
- event overview
- join/add participant
- add items
- claim items
- summary
- finalize
- payment info

### Add later
- host dashboard refinements
- payment confirmations
- QR upload polish

---

## 7. Final Advice
For MVP:
- keep logic centralized
- do not over-engineer state management
- do not introduce too many abstractions early
- separate money logic from rendering logic

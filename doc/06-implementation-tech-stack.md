# JoinJoy — Implementation and Tech Stack

## 1. Recommended MVP Architecture
For JoinJoy MVP, use a simple web architecture:

- **Frontend:** Next.js
- **Backend/API:** Next.js Route Handlers or Server Actions
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage
- **Realtime (optional later):** Supabase Realtime
- **Hosting:** Vercel
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Form Handling:** React Hook Form + Zod
- **State Management:** local state first, Zustand only if needed
- **Auth:** none for MVP
- **Analytics:** PostHog or simple event logging later

This stack is practical for fast MVP delivery and easy iteration.

---

## 2. Why this stack fits JoinJoy
### Next.js
Good for:
- fast product iteration
- page + API in one project
- shareable routes like `/event/[token]`
- server rendering where useful
- easy Vercel deployment

### Supabase
Good for:
- relational data structure
- fast setup
- file storage for payout QR
- optional realtime support later
- easy SQL control for shared-expense logic

### Tailwind + shadcn/ui
Good for:
- fast mobile-first UI
- clean component structure
- easy consistency across screens

---

## 3. Do we need a database?
## Yes — JoinJoy should use a database.

Even for MVP, a database is strongly recommended.

### Why database is needed
JoinJoy is not just a calculator.
It has persistent multi-user collaborative state:
- event details
- members
- items
- claims
- payout info
- payment status
- finalization status

Without a database, the product becomes fragile because:
- shared links would not persist reliably
- multiple participants could not join and update the same event safely
- claim states would be hard to synchronize
- host could not track progress
- settlement status would not be saved

### When could you avoid a DB?
Only for a fake prototype or one-device demo.
For an actual usable MVP, use a DB.

---

## 4. MVP technical recommendation
### Best practical choice
- Next.js app
- Supabase Postgres
- Supabase Storage for QR image
- No login
- Event access via share token

This gives you:
- persistent events
- multi-user flows
- easy deployment
- simple backend structure

---

## 5. Recommended stack by layer

## Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- date-fns

## Backend / Data Access
Option A:
- Next.js Route Handlers
- direct Supabase calls
- SQL or typed queries

Option B:
- Supabase JS client in server actions

For MVP, either is fine.
If you want cleaner control, use server-side data functions plus Route Handlers.

## Database
- Supabase Postgres

## Storage
- Supabase Storage
Used for:
- payout QR image
- optional future receipt upload

## Hosting
- Vercel for frontend/server
- Supabase managed backend

---

## 6. Suggested app structure
```text
app/
  page.tsx
  create/page.tsx
  event/[token]/page.tsx
  event/[token]/claim/page.tsx
  event/[token]/summary/page.tsx
  event/[token]/host/page.tsx
  api/
    events/
    claims/
    finalize/
    payments/

components/
  event/
  items/
  summary/
  payment/
  shared/

lib/
  db/
  calculations/
  validations/
  utils/

types/
  event.ts
  item.ts
  participant.ts
  claim.ts
  payment.ts
```

---

## 7. Core technical concerns
### 7.1 Share-token access
Since there is no login in MVP, each event should have a unique share token.
This token is used in the event URL.

Example:
`/event/abC123xyZ`

### 7.2 Identity without login
Participants can:
- choose an existing name
- add a new name

For MVP, identity can be lightweight.
You may also store a temporary browser ID in localStorage to remember who they are inside one event.

### 7.3 Concurrent edits
Because multiple people may claim items at similar times:
- item claim operations should be validated server-side
- last-write logic must be handled carefully
- finalization should lock editing

### 7.4 Calculation consistency
All final financial calculations should run on the server, not only in client UI.

### 7.5 Estimated vs Final totals
Before finalization:
- show estimated values
After finalization:
- lock and save final totals

---

## 8. API capability list
You will likely need endpoints or server actions for:

- create event
- update event settings
- add member
- add item
- update item
- claim item
- split item
- resolve unclaimed item
- upload payout QR
- finalize event
- mark payment status
- fetch event summary

---

## 9. Nice-to-have later
Not needed for MVP, but future-friendly:
- Supabase Realtime for live updates
- Authentication
- Receipt OCR
- Push reminders
- Payment slip upload
- Role permissions
- Event archive and history

---

## 10. Final recommendation
### If you want speed
Use:
- Next.js
- Supabase
- Tailwind
- shadcn/ui

### If you want control and long-term scalability
Still start with the same stack.
It is enough for MVP and can scale reasonably before needing a bigger backend split.

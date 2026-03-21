# JoinJoy — Implementation Plan

## 1. Recommended MVP Build Order
Build JoinJoy in this sequence to reduce risk and keep momentum.

### Phase 1 — Static UI foundation
Build these screens first:
- Home
- Create Event
- Add Members
- Add Items
- Event Overview
- Join Event
- Claim Items
- My Summary

Goal:
- validate flow
- validate naming and structure
- test interaction model without backend complexity

---

## 2. Phase 2 — Database and CRUD
Set up:
- Supabase project
- database schema
- file storage bucket for QR images

Implement:
- create event
- add members
- add items
- fetch event by share token
- update event settings

Goal:
- persistent event flow works end to end

---

## 3. Phase 3 — Claim logic
Implement:
- participant join
- claim mine
- split with others
- item status updates
- estimated summary calculation

Goal:
- collaborative core loop works

---

## 4. Phase 4 — Host operations
Implement:
- host dashboard
- unresolved item resolution
- finalize event
- final totals snapshot

Goal:
- host can close the event confidently

---

## 5. Phase 5 — Payment flow
Implement:
- payout method setup
- QR upload
- payment status tracking
- mark as paid

Goal:
- event goes from calculation to settlement

---

## 6. Phase 6 — Polish
Add:
- loading states
- empty states
- duplicate name warnings
- undo patterns
- mobile-friendly spacing
- copy/share helpers

Goal:
- make MVP feel smooth and usable

---

## 7. MVP priorities
## Must-have
- event creation
- item entry
- participant join
- item claim
- proportional allocation
- finalize
- payment info

## Should-have
- payment status
- duplicate handling
- better host review

## Later
- realtime
- auth
- OCR
- reminders
- activity history

---

## 8. Engineering notes
### Calculation ownership
All final calculations should live on the server.

### Token access
Every event should be retrievable by share token.

### Locking
After finalization:
- item edits should be blocked
- claim actions should be blocked
- payout totals should be stable

### Storage
QR images should be stored in Supabase Storage, not directly inside database blobs.

---

## 9. MVP success criteria
The MVP is successful if a real group can:
1. create an event
2. add items
3. share link
4. claim items
5. finalize
6. pay the host
without needing external spreadsheets or chat calculations

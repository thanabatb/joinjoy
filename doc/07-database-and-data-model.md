# JoinJoy — Database and Data Model

## 1. Database Recommendation
Use **PostgreSQL via Supabase**.

This is the right fit because JoinJoy has relational data:
- one event has many members
- one event has many items
- one item can belong to many members
- one member can claim many items
- one event has payout and settlement state

A relational database is much better than trying to store this in flat documents.

---

## 2. Core Database Entities
### events
Stores the shared outing / event.

### participants
Stores people inside an event.

### items
Stores expense items within an event.

### item_claims
Stores which participant is responsible for which item.

### payment_statuses
Stores who has paid.

### payout_methods
Stores host transfer info.

---

## 3. Recommended Tables

## events
Purpose: event-level settings and state.

Suggested fields:
- id (uuid, primary key)
- share_token (text, unique)
- title (text, required)
- venue_name (text, nullable)
- currency (text, default THB)
- service_charge_type (text)
- service_charge_rate (numeric)
- vat_type (text)
- vat_rate (numeric)
- status (text) — draft / claiming / finalized / settled
- host_name (text)
- created_at
- updated_at
- finalized_at (nullable)

---

## participants
Purpose: people in a given event.

Suggested fields:
- id (uuid, primary key)
- event_id (uuid, foreign key)
- display_name (text, required)
- joined_at (nullable)
- is_host (boolean)
- status (text) — invited / joined / claimed / paid
- browser_fingerprint (text, nullable)
- created_at
- updated_at

---

## items
Purpose: expense items.

Suggested fields:
- id (uuid, primary key)
- event_id (uuid, foreign key)
- name (text, required)
- price (numeric, required)
- quantity (integer, default 1)
- total_price (numeric, required)
- assignment_mode (text)
- status (text) — unclaimed / partial / claimed / resolved
- sort_order (integer)
- created_at
- updated_at

### Notes
`total_price` can be calculated as price × quantity, but storing it explicitly can simplify reads.

---

## item_claims
Purpose: connect items to participants.

Suggested fields:
- id (uuid, primary key)
- event_id (uuid, foreign key)
- item_id (uuid, foreign key)
- participant_id (uuid, foreign key)
- split_amount (numeric, required)
- split_ratio (numeric, nullable)
- created_by_type (text) — participant / host / system
- created_at
- updated_at

### Why this table matters
This is the heart of JoinJoy.
Because one item may be:
- owned by one person
- split by several people
- resolved by host
- shared by active members

This many-to-many relationship needs its own table.

---

## payout_methods
Purpose: where members send money.

Suggested fields:
- id (uuid, primary key)
- event_id (uuid, foreign key, unique)
- payout_type (text) — bank_account / promptpay_qr / mixed
- recipient_name (text)
- bank_name (text, nullable)
- account_number (text, nullable)
- qr_image_path (text, nullable)
- created_at
- updated_at

---

## payment_statuses
Purpose: settlement tracking per participant.

Suggested fields:
- id (uuid, primary key)
- event_id (uuid, foreign key)
- participant_id (uuid, foreign key)
- final_subtotal (numeric, default 0)
- final_service_charge (numeric, default 0)
- final_vat (numeric, default 0)
- final_total (numeric, default 0)
- payment_status (text) — unpaid / marked_paid / confirmed
- paid_at (nullable)
- created_at
- updated_at

---

## 4. Relationship Overview
- one event -> many participants
- one event -> many items
- one item -> many item_claims
- one participant -> many item_claims
- one event -> one payout_method
- one event -> many payment_statuses

---

## 5. Why DB is required
JoinJoy needs to persist:
- event links
- participant join state
- item claim state
- host resolution decisions
- payout info
- final totals

These are shared states across users and sessions.
A DB is required for a proper MVP.

---

## 6. Suggested data flow
### During setup
- create event
- insert participants
- insert items

### During claim
- participants join
- item_claims are inserted or updated
- items status changes

### During finalization
- server calculates totals
- payment_statuses are written
- event status becomes finalized

### During settlement
- payment_statuses are updated
- event may become settled when everyone is paid

---

## 7. Calculation model
### Participant subtotal
Sum of all `split_amount` values across that participant's claimed items.

### Event subtotal
Sum of all item totals.

### Service charge
Calculated from event subtotal.

### VAT
Calculated from event subtotal or subtotal + SC depending on your chosen rule.
For MVP, choose one rule and document it clearly.

### Allocation
Each participant receives a proportional share based on:
`participant_subtotal / event_subtotal`

---

## 8. Finalization strategy
When host finalizes:
- lock item editing
- compute final subtotals
- compute final SC/VAT shares
- write all final totals to `payment_statuses`
- mark event as finalized

Do not rely only on client-side calculation.

---

## 9. Should we store derived values?
## Yes, selectively.

Store these final derived values:
- final_subtotal
- final_service_charge
- final_vat
- final_total

Reason:
- avoids recalculating during settlement screens
- preserves historical accuracy after finalize
- easier for sharing and payment tracking

For draft state, it is okay to calculate on the fly.

---

## 10. MVP conclusion
### Required
- events
- participants
- items
- item_claims
- payout_methods
- payment_statuses

### Optional later
- reminders
- activity_logs
- attachments
- receipts
- user_accounts

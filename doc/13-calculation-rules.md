# JoinJoy — Calculation Rules

## 1. Purpose
This document defines the money logic for JoinJoy MVP.

It exists to prevent:
- inconsistent frontend/backend behavior
- confusion around fairness
- mismatched final totals
- bugs caused by vague tax/service charge rules

This file should be treated as the source of truth for calculation behavior.

---

## 2. Core Principle
JoinJoy uses this rule:

**Users claim what they had.  
Shared items are split among selected people.  
Service charge and VAT are allocated proportionally based on each participant’s subtotal.**

---

## 3. Definitions

## Item total
The total amount of a single expense item.

Formula:
`item_total = price × quantity`

Example:
- price = 45
- quantity = 3
- item total = 135

---

## Participant subtotal
The sum of all split amounts assigned to a participant before service charge and VAT.

Formula:
`participant_subtotal = sum(all claim split_amount values for that participant)`

---

## Event subtotal
The sum of all item totals in the event before service charge and VAT.

Formula:
`event_subtotal = sum(all item total_price values)`

---

## Service charge total
The event-level service charge calculated from event subtotal.

### Percentage mode
`service_charge_total = event_subtotal × service_charge_rate / 100`

### Custom amount mode
`service_charge_total = provided fixed amount`

### None mode
`service_charge_total = 0`

---

## VAT total
The event-level VAT calculated from event subtotal.

### MVP default rule
For MVP, VAT is calculated from **event subtotal only**, not from subtotal + service charge.

Formula in percentage mode:
`vat_total = event_subtotal × vat_rate / 100`

### Note
Some real-world bills calculate VAT differently.
For MVP, pick one rule and keep it consistent everywhere.
The schema and current function use the simpler rule above.

---

## 4. Item Claim Rules

## Rule A — Claim mine
If an item is claimed by exactly one participant:
- that participant gets the full item total

Example:
- Steak = 280
- claimed by First
- First subtotal += 280

---

## Rule B — Split with selected people
If an item is split among selected participants:
- divide item total equally
- store claim rows for each selected participant

Example:
- Fries = 180
- split between 3 people
- each gets 60

### Rounding note
When equal division creates decimals:
- round to 2 decimal places
- assign the remainder to the last participant or use a deterministic balancing rule

Example:
- Water = 40
- 3 people
- 13.33 + 13.33 + 13.34 = 40.00

This ensures the total always matches exactly.

---

## Rule C — Shared by all selected active members
If host chooses “shared by all active members”:
- selected active members receive equal split shares
- not every named participant must be included automatically

This matters when:
- someone left early
- someone did not consume shared items
- some invited members never joined

---

## 5. Proportional Allocation of SC/VAT

## Step 1
Calculate participant subtotals.

## Step 2
Calculate event subtotal.

## Step 3
Calculate total service charge and total VAT.

## Step 4
Allocate service charge proportionally:

`participant_service_charge = service_charge_total × participant_subtotal / event_subtotal`

## Step 5
Allocate VAT proportionally:

`participant_vat = vat_total × participant_subtotal / event_subtotal`

## Step 6
Calculate final participant total:

`final_total = participant_subtotal + participant_service_charge + participant_vat`

---

## 6. Example

### Item claims
- First subtotal = 300
- Frame subtotal = 200
- Aom subtotal = 100

### Event subtotal
`300 + 200 + 100 = 600`

### SC
10% of 600 = 60

### VAT
7% of 600 = 42

### Allocation
#### First
- SC = 60 × 300 / 600 = 30
- VAT = 42 × 300 / 600 = 21
- Final = 300 + 30 + 21 = 351

#### Frame
- SC = 60 × 200 / 600 = 20
- VAT = 42 × 200 / 600 = 14
- Final = 200 + 20 + 14 = 234

#### Aom
- SC = 60 × 100 / 600 = 10
- VAT = 42 × 100 / 600 = 7
- Final = 100 + 10 + 7 = 117

---

## 7. Rounding Rules

## Rule A — Currency precision
All displayed monetary values should be rounded to 2 decimal places.

## Rule B — Split balancing
When splitting an item:
- compute equal share
- round each share to 2 decimals
- adjust one participant’s amount so the total matches exactly

## Rule C — Allocation balancing
When allocating service charge or VAT proportionally:
- compute each amount
- round to 2 decimals
- if rounding causes a mismatch against total SC/VAT,
  assign the difference to one deterministic participant

### Suggested deterministic choice
Use one of these:
- participant with largest subtotal
- last participant in sorted order by id
- host

For consistency, choose one and document it in code.
Recommended:
**assign rounding remainder to the participant with the largest subtotal**

---

## 8. Estimated vs Final Totals

## Estimated totals
Before finalization:
- may change as more items are claimed
- should be labeled clearly as estimated

## Final totals
After finalization:
- no more item or claim edits allowed
- final totals are saved to `payment_statuses`

---

## 9. Finalization Preconditions
An event should only be finalized if:
- every item is fully resolved
- no item remains unclaimed or partially unresolved
- host explicitly confirms closure

If unresolved items remain, finalization should be blocked.

---

## 10. Invalid States to Prevent
### Prevent over-claimed item totals
The total of all `split_amount` rows for one item should not exceed item total.

### Prevent negative values
No negative price, quantity, split amount, SC, or VAT.

### Prevent edits after finalization
Items, claims, and event financial settings should be locked.

---

## 11. Recommended Server Ownership
### Server should own
- item split logic
- subtotal calculation
- SC/VAT allocation
- finalization
- final totals snapshot

### Client may show
- previews
- estimated totals
- instant feedback

But server remains the source of truth.

---

## 12. MVP Rule Summary
For MVP, use these exact rules:
- item total = price × quantity
- participant subtotal = sum of assigned split amounts
- SC calculated from event subtotal
- VAT calculated from event subtotal
- SC/VAT allocated proportionally by participant subtotal
- round to 2 decimals
- use deterministic remainder balancing
- finalized totals are stored and locked

---

## 13. Future Rules You May Add Later
Not needed in MVP, but possible later:
- VAT on subtotal + service charge
- custom rounding by currency
- equal split mode for whole event
- exclude some participants from tax/service fee
- minimum payment threshold
- discount items or coupon support

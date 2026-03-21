# JoinJoy — Screen Specifications

## Screen 1 — Home
### Purpose
Entry point for create or join flow.

### Key content
- product name
- tagline
- create event CTA
- join event CTA

### Primary actions
- Create event
- Join event

---

## Screen 2 — Create Event
### Purpose
Create a new shared expense event.

### Fields
- event name (required)
- place (optional)
- date/time (default now)
- currency
- service charge selector
- VAT selector

### States
- empty
- valid
- invalid required fields

### Primary action
- Continue

---

## Screen 3 — Add Members
### Purpose
Add initial member list.

### Fields / controls
- member input
- add button
- member list
- remove member action

### Primary action
- Next

### Secondary action
- Skip for now

---

## Screen 4 — Add Items
### Purpose
Enter expense items.

### Fields per item
- item name
- price
- quantity (optional)
- assignment mode

### List behavior
- add item
- edit item
- delete item

### Primary action
- Review event

### Secondary action
- Share now

---

## Screen 5 — Event Overview
### Purpose
Summarize the event before and after sharing.

### Key content
- event hero
- total amount
- member count
- item count
- joined count
- unresolved count
- SC/VAT note
- payout info preview

### Actions
- Copy link
- Share
- Edit event
- Add payout info

---

## Screen 6 — Join Event / Identify Yourself
### Purpose
Let participant identify themselves without login.

### Content
- event summary
- existing names
- add my name

### Actions
- Continue

### Validation
- prevent blank name
- warn on duplicate names

---

## Screen 7 — Claim Items
### Purpose
Main participant claiming interface.

### Sections
- unclaimed items
- shared items
- my claimed items

### Item card content
- name
- amount
- claim status
- action buttons

### Actions
- Claim mine
- Split with others
- Not mine

### Notes
- show badge if estimated
- allow undo where possible

---

## Screen 8 — Split Item
### Purpose
Select people who share an item.

### Content
- item name
- item amount
- participant checklist
- split preview

### Actions
- Confirm split
- Cancel

---

## Screen 9 — My Summary
### Purpose
Show participant current or final total.

### Content
- items subtotal
- SC amount
- VAT amount
- total due
- final/estimated label

### Actions
- Back to items
- Mark as paid (if finalized and payout info exists)

---

## Screen 10 — Host Dashboard
### Purpose
Operational overview for host.

### Content
- progress metrics
- joined members
- claimed item count
- unresolved item count
- current totals by member

### Actions
- edit item
- resolve unclaimed
- remind members
- finalize event

---

## Screen 11 — Resolve Unclaimed Items
### Purpose
Clear remaining unresolved expense items.

### Content
- list of unresolved items
- action sheet per item

### Actions
- assign to one
- split selected members
- split all active members
- delete item

---

## Screen 12 — Final Summary
### Purpose
Show final result for the whole event.

### Content
- finalized status
- breakdown by member
- subtotal / SC / VAT / total
- settlement status

### Actions
- copy summary
- share summary
- go to payment

---

## Screen 13 — Payment Info
### Purpose
Help members transfer money to host.

### Content
- recipient name
- bank / account number or QR
- total due

### Actions
- copy account number
- open QR image
- mark as paid

---

## Screen 14 — Payment Status
### Purpose
Track who has paid.

### Content
- paid members
- unpaid members
- outstanding amount per person

### Actions
- host marks payment received
- member marks as paid

---

## Shared Components
### Event hero
- title
- place
- date
- participant count
- total amount
- status badge

### Item card
- item name
- amount
- claim status
- actions

### Summary row
- label
- value

### Member chip
- name
- state

## Status Labels
### Event
- Draft
- Claiming
- Needs review
- Finalized
- Settled

### Item
- Unclaimed
- Claimed
- Shared
- Resolved

### Payment
- Unpaid
- Marked paid
- Confirmed

# JoinJoy — End-to-End Flow

## 1. Core Flow Summary
1. Host creates an event
2. Host adds members and expense items
3. Host shares event link
4. Members join and claim what they had
5. Shared items are split among selected members
6. Host reviews unclaimed items
7. Host finalizes the event
8. Members view final total
9. Members pay the host
10. Host marks settlement status

## 2. Flow Detail

## Flow A — Entry
### Goal
Let users either create or join an event quickly.

### Steps
- User lands on home
- User sees two main actions:
  - Create event
  - Join event

### UX notes
- keep it minimal
- avoid long explanation blocks
- primary CTA should be obvious

---

## Flow B — Create Event
### Goal
Let host define the outing and default cost rules.

### Inputs
- event name
- venue or place (optional)
- date/time
- currency
- service charge setting
- VAT setting

### Output
A new event draft is created.

### Decision points
- SC enabled or not
- VAT enabled or not
- custom rate or preset

---

## Flow C — Add Members
### Goal
Create an initial member list.

### Options
- host types names manually
- host shares link and others add themselves later

### UX notes
- do not require full member list before moving on
- allow editing names later

---

## Flow D — Add Expense Items
### Goal
Build an itemized event expense list.

### Inputs per item
- name
- price
- quantity (optional)
- assignment type

### Assignment types
- unclaimed
- shared by all selected members
- assigned now by host
- claim later by members

### UX notes
- default should be unclaimed
- host should be able to add items quickly
- no need for OCR in MVP

---

## Flow E — Review and Share
### Goal
Let host verify setup and invite others.

### Review content
- event summary
- member count
- item count
- unclaimed item count
- SC/VAT settings
- payout info

### Share actions
- copy event link
- share to chat apps
- show QR code for join

### Optional payout info
- account number
- account name
- bank
- QR image

---

## Flow F — Join Event
### Goal
Let a participant identify themselves without login.

### Steps
- open event link
- select existing name or add own name
- continue into claim flow

### UX notes
- no account creation
- identity only applies within the event

---

## Flow G — Claim Items
### Goal
Let participants claim items quickly.

### Sections
- unclaimed items
- shared items
- already claimed items

### Actions on each item
- claim mine
- split with others
- not mine

### Example
- Steak 280 → Claim mine
- Fries 180 → Split with others
- Water 40 → shared by all selected members

### UX notes
- actions should feel conversational
- avoid spreadsheet-like UI

---

## Flow H — Split Shared Item
### Goal
Let participant choose who shares a given item.

### Steps
- tap Split with others
- select people
- confirm

### Output
Item is allocated equally across selected people.

---

## Flow I — View My Summary
### Goal
Show participant current responsibility.

### Summary content
- claimed items subtotal
- estimated SC allocation
- estimated VAT allocation
- current total

### Important note
If event is not finalized:
- show “Estimated total”
- explain that totals may change until all items are resolved

---

## Flow J — Host Review Progress
### Goal
Help host monitor completion status.

### Dashboard content
- total members
- joined members
- item claim progress
- partially claimed items
- unclaimed items
- current estimated amount per person

### Host actions
- remind participants
- resolve item manually
- edit item
- finalize event

---

## Flow K — Resolve Unclaimed Items
### Goal
Prevent event from being stuck.

### For each unresolved item
Host can:
- assign to one person
- split among selected members
- split across active members
- delete item

### UX note
Collaborative claim should not prevent closure.

---

## Flow L — Finalize Event
### Goal
Lock the allocation and produce final totals.

### Preconditions
- all items resolved
- or host confirms manual override

### Result
- final subtotals per person
- final SC allocation
- final VAT allocation
- final total due per person

---

## Flow M — Settlement
### Goal
Let members pay and let host track status.

### Member sees
- final amount
- payout QR/account info
- mark as paid

### Host sees
- who paid
- who has not paid
- outstanding balances

---

## 3. Core Decision Logic
### Item claim state
- unclaimed
- claimed by one
- claimed by many
- shared by all selected members
- resolved by host

### Event state
- draft
- open for claiming
- needs review
- finalized
- settled

### Participant state
- invited
- joined
- claimed
- paid

## 4. Important Edge Cases
### Same person joins twice
- allow rename
- show possible duplicates

### Item claimed incorrectly
- host can edit or reassign

### Nobody claims an item
- host resolves it

### A participant joins late
- totals remain estimated until finalization

### Some people left earlier
- shared-by-all should apply only to selected active members, not all names automatically

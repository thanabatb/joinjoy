# JoinJoy — Wireframe and UX Notes

## 1. Overall Structure
JoinJoy should feel like an event page with expense actions inside it.

### Design framing
- outside: social event
- inside: fair expense claiming

### Top-level layout pattern
1. Header / event identity
2. Event overview / stats
3. Primary action
4. Expense sections
5. Summary / payout area

---

## 2. Screen Wireframes

## Screen A — Home
### Structure
- logo / wordmark
- headline
- primary CTA: Create event
- secondary CTA: Join event

### Notes
- keep messaging short
- explain product in one line only

---

## Screen B — Create Event
### Structure
- page title: Create event
- field: Event name
- field: Place (optional)
- field: Date
- section: Cost rules
  - service charge selector
  - VAT selector
- CTA: Continue

### Notes
- use chips, toggles, and segmented controls
- avoid heavy forms

---

## Screen C — Add Members
### Structure
- title
- member list
- add member input
- invite later hint
- CTA: Next

### Notes
- allow lightweight setup
- do not force complete attendance list

---

## Screen D — Add Items
### Structure
- title
- item list
- add item module
  - item name
  - price
  - optional quantity
  - assignment mode
- quick actions:
  - add another
  - review
  - share now

### Notes
- optimize for repeated entry
- use bottom sheet or inline add pattern on mobile

---

## Screen E — Event Overview / Share
### Structure
- event hero
  - event name
  - place
  - date
  - total amount
  - member count
- progress cards
  - x items added
  - x unclaimed
  - x people joined
- payout info section
- share link CTA

### Notes
- this is the social entry point
- should feel inviting, not administrative

---

## Screen F — Join Event
### Structure
- event hero summary
- choose your name
- add name option
- CTA: Continue

### Notes
- identity should be temporary and fast
- no email/password

---

## Screen G — Claim Items
### Structure
- event summary compact header
- segmented tabs or sections:
  - Unclaimed
  - Shared
  - Claimed
- item cards
  - name
  - price
  - current status
  - actions

### Item card actions
- Claim mine
- Split with others
- Not mine

### Notes
- cards should be easy to scan
- status and action must be obvious at a glance

---

## Screen H — Split With Others
### Structure
- item title
- item amount
- people selection list
- summary preview
- confirm CTA

### Notes
- show resulting per-person split before confirm

---

## Screen I — My Summary
### Structure
- your claimed items list
- subtotal
- estimated SC
- estimated VAT
- current total
- note about finalization status

### Notes
- clarity is more important than visual complexity
- users should trust this screen immediately

---

## Screen J — Host Dashboard
### Structure
- event overview
- progress metrics
- unresolved items section
- participant status list
- action buttons

### Host actions
- edit item
- resolve item
- finalize event

### Notes
- this is the operational control center for the host
- show what still blocks finalization

---

## Screen K — Resolve Unclaimed
### Structure
- unresolved item list
- each item opens detail action sheet
  - assign to one
  - split among selected people
  - split among all active members
  - delete

### Notes
- keep this flow efficient
- host should be able to finish in under a minute

---

## Screen L — Final Summary
### Structure
- finalized event status
- per-person summary cards
- exact total
- optional rounded total
- copy amount button
- pay now section

### Notes
- must be screenshot-friendly
- should work well in narrow mobile screens

---

## Screen M — Payment Info
### Structure
- recipient name
- bank/account number or QR
- amount due
- mark as paid button

### Notes
- keep transfer flow frictionless
- copying data should be easy

---

## 3. UX Writing Guidance
### Tone
- friendly
- clear
- lightweight
- no finance jargon unless needed

### Good examples
- Claim what you had
- Split this with others
- Estimated total for now
- Ready to finalize
- Pay the host

### Avoid
- allocate responsibility
- cost apportionment
- tax liability
- unresolved assignment discrepancy

---

## 4. UX Principles by Interaction
### Onboarding
Minimize steps. User should understand the concept in seconds.

### Item claim
Make every action explicit and reversible.

### Shared items
Always preview split result.

### Estimation
Never hide uncertainty.

### Finalization
Make the moment of lock-in very clear.

### Payment
Reduce friction. Support copy and QR.

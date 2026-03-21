# JoinJoy — Product Concept

## 1. Product Overview
JoinJoy is an event-based shared expense app designed for groups who spend together but do not pay equally.

Instead of framing the experience as “bill splitting,” JoinJoy frames it as a shared event:
- Jazz Night at Jazz Bar
- Office Lunch
- BBQ Friday
- Birthday Dinner
- Weekend Trip

Users join an event, claim what they had, split shared items, and let the system distribute service charge and VAT proportionally based on each person’s subtotal.

## 2. Why this product exists
Most bill-splitting apps fail in one or more of these ways:
- too form-heavy
- too accounting-like
- optimized for equal split, not uneven spend
- puts too much work on the host
- confusing when shared dishes are involved
- unclear tax/service charge calculation
- poor mobile collaboration

JoinJoy solves this by shifting the burden from one payer to the whole group.

## 3. Core Problem
A group shares a meal or outing.
One person pays first.
But:
- everyone consumes different things
- some dishes are shared
- some people leave early
- service charge and VAT should be split fairly
- the host should not need to remember everything

## 4. Core Product Idea
**Event outside, smart expense claiming inside.**

Users should feel like they are joining an outing, not filling in an accounting form.

### Core principle
- Host creates the event and adds expense items
- Members join the event and claim their own items
- Shared items can be split among selected members
- Service charge and VAT are distributed proportionally to subtotal
- Host can resolve unclaimed items and finalize the event
- Members see what they owe and pay the host

## 5. Value Proposition
### For the host
- no need to manually assign every item
- no need to remember who ate what
- can close the bill faster
- can collect money with less awkwardness

### For participants
- can claim their own share directly
- can see how totals are calculated
- feel the split is fair
- can pay quickly using bank account or QR

## 6. Positioning
### What JoinJoy is
- a collaborative shared expense tool
- an event-based split app
- a friendly settlement experience for outings and meals

### What JoinJoy is not
- a bookkeeping app
- an expense tracker for accountants
- a finance-heavy corporate reimbursement tool
- only an equal-split calculator

## 7. Product Personality
- friendly
- social
- lightweight
- clear
- fair
- modern
- not overly playful, but definitely not dry

## 8. Product Principles
### 8.1 Let people answer only one question
Users should mostly answer:
**“What did I have?”**

### 8.2 Do not make users do math
The system calculates:
- item split
- subtotal per person
- proportional service charge
- proportional VAT
- total due

### 8.3 Host should not carry the whole burden
The host sets things up, but the group participates.

### 8.4 Shared dishes must be easy
Shared food is common. The product must make this a first-class use case.

### 8.5 Uncertainty must be visible
If the bill is not finalized, users should see that totals are estimates.

### 8.6 Final summary must be screenshot-friendly
Groups often settle in chat apps. A summary should be easy to share.

## 9. Default Calculation Rule
### Item subtotal
Each person gets subtotal based on claimed items and shared items.

### Service charge and VAT
Service charge and VAT are calculated from the full bill total, then distributed back to each participant in proportion to their subtotal.

#### Example
- First subtotal: 300
- Frame subtotal: 200
- Total subtotal: 500
- Service charge + VAT total: 85

Allocation:
- First pays 60% of 85 = 51
- Frame pays 40% of 85 = 34

This is the default fairness logic for JoinJoy.

## 10. MVP Scope
### Include
- create event
- add members
- add items manually
- share event link
- members claim items
- split items among selected people
- proportional SC/VAT allocation
- finalize split
- show final amount per person
- add payout info (bank account / QR)
- mark as paid

### Exclude for now
- login
- payment gateway
- slip upload
- receipt OCR
- push notifications
- advanced edit history
- expense analytics
- group wallets

## 11. Main Use Cases
- dinner with friends
- bar / nightlife group tab
- office lunch
- birthday meal
- shared snacks / coffee run
- mini trips and outings

## 12. Brand Direction
### Name
**JoinJoy**

### Meaning
- Join = come together
- Joy = keep the experience light, social, and enjoyable

### Suggested tagline
- Claim what you had. Split with joy.
- Shared moments, fair payments.
- Join the moment. Settle with ease.

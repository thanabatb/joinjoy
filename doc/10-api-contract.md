# JoinJoy — API Contract

## 1. API Style
Recommended for MVP:
- Next.js Route Handlers or Server Actions
- JSON request/response
- token-based event access
- server performs final calculations

Base path example:
`/api`

---

## 2. Core Concepts
### Event access
Events are accessed by `share_token`, not login.

### Identity
Participants identify themselves by selecting or adding a name inside the event.

### Finalization
Before finalization:
- totals are estimated

After finalization:
- totals are locked into `payment_statuses`

---

## 3. Endpoints

## POST /api/events
### Purpose
Create a new event.

### Request
```json
{
  "title": "Jazz Night at Jazz Bar",
  "venueName": "Jazz Bar",
  "currency": "THB",
  "serviceChargeType": "percentage",
  "serviceChargeRate": 10,
  "vatType": "percentage",
  "vatRate": 7,
  "hostName": "First"
}
```

### Response
```json
{
  "id": "event_uuid",
  "shareToken": "abc123xyz",
  "status": "draft"
}
```

---

## GET /api/events/:shareToken
### Purpose
Fetch event overview by share token.

### Response
```json
{
  "id": "event_uuid",
  "shareToken": "abc123xyz",
  "title": "Jazz Night at Jazz Bar",
  "venueName": "Jazz Bar",
  "currency": "THB",
  "status": "claiming",
  "serviceChargeType": "percentage",
  "serviceChargeRate": 10,
  "vatType": "percentage",
  "vatRate": 7,
  "hostName": "First",
  "participantCount": 8,
  "itemCount": 14,
  "joinedCount": 5,
  "unresolvedCount": 3
}
```

---

## PATCH /api/events/:shareToken
### Purpose
Update event-level settings.

### Request
```json
{
  "title": "Jazz Night at Jazz Bar",
  "venueName": "Blue Note",
  "status": "claiming"
}
```

### Response
```json
{
  "success": true
}
```

---

## POST /api/events/:shareToken/participants
### Purpose
Add participant to event.

### Request
```json
{
  "displayName": "Frame",
  "isHost": false
}
```

### Response
```json
{
  "id": "participant_uuid",
  "displayName": "Frame",
  "status": "joined"
}
```

---

## GET /api/events/:shareToken/participants
### Purpose
Fetch participant list.

### Response
```json
[
  {
    "id": "participant_uuid",
    "displayName": "First",
    "isHost": true,
    "status": "claimed"
  },
  {
    "id": "participant_uuid_2",
    "displayName": "Frame",
    "isHost": false,
    "status": "joined"
  }
]
```

---

## POST /api/events/:shareToken/items
### Purpose
Create a new expense item.

### Request
```json
{
  "name": "Truffle Fries",
  "price": 180,
  "quantity": 1,
  "assignmentMode": "unclaimed"
}
```

### Response
```json
{
  "id": "item_uuid",
  "name": "Truffle Fries",
  "price": 180,
  "quantity": 1,
  "totalPrice": 180,
  "status": "unclaimed"
}
```

---

## GET /api/events/:shareToken/items
### Purpose
Fetch event items.

### Response
```json
[
  {
    "id": "item_uuid",
    "name": "Steak",
    "price": 280,
    "quantity": 1,
    "totalPrice": 280,
    "status": "claimed",
    "assignmentMode": "claim_later"
  },
  {
    "id": "item_uuid_2",
    "name": "Water",
    "price": 40,
    "quantity": 1,
    "totalPrice": 40,
    "status": "partial",
    "assignmentMode": "shared_selected"
  }
]
```

---

## PATCH /api/items/:itemId
### Purpose
Edit an item.

### Request
```json
{
  "name": "Water",
  "price": 50,
  "quantity": 1
}
```

### Response
```json
{
  "success": true
}
```

---

## DELETE /api/items/:itemId
### Purpose
Delete an item.

### Response
```json
{
  "success": true
}
```

---

## POST /api/items/:itemId/claims
### Purpose
Claim an item for one participant.

### Request
```json
{
  "participantId": "participant_uuid"
}
```

### Server behavior
- remove existing claim rows for this item if using “claim mine”
- create one claim row with full item total
- refresh item status

### Response
```json
{
  "success": true
}
```

---

## POST /api/items/:itemId/split
### Purpose
Split an item across selected participants.

### Request
```json
{
  "participantIds": [
    "participant_uuid_1",
    "participant_uuid_2",
    "participant_uuid_3"
  ]
}
```

### Server behavior
- remove existing claim rows for this item
- divide item total equally among selected participants
- insert claim rows
- refresh item status

### Response
```json
{
  "success": true
}
```

---

## POST /api/items/:itemId/clear-claims
### Purpose
Remove all claims from an item.

### Response
```json
{
  "success": true
}
```

---

## GET /api/events/:shareToken/summary
### Purpose
Fetch current event summary.

### Response (before finalization)
```json
{
  "isFinal": false,
  "eventSubtotal": 9478,
  "participants": [
    {
      "participantId": "p1",
      "displayName": "First",
      "subtotal": 300,
      "estimatedServiceCharge": 30,
      "estimatedVat": 21,
      "estimatedTotal": 351
    }
  ]
}
```

### Response (after finalization)
```json
{
  "isFinal": true,
  "eventSubtotal": 9478,
  "participants": [
    {
      "participantId": "p1",
      "displayName": "First",
      "finalSubtotal": 300,
      "finalServiceCharge": 30,
      "finalVat": 21,
      "finalTotal": 351,
      "paymentStatus": "unpaid"
    }
  ]
}
```

---

## POST /api/events/:shareToken/finalize
### Purpose
Finalize the event.

### Server behavior
- ensure unresolved items are handled
- call DB finalization logic
- freeze final totals

### Response
```json
{
  "success": true,
  "status": "finalized"
}
```

---

## PUT /api/events/:shareToken/payout
### Purpose
Create or update payout info.

### Request
```json
{
  "payoutType": "bank_account",
  "recipientName": "Thanabat",
  "bankName": "KBank",
  "accountNumber": "123-4-56789-0"
}
```

### Response
```json
{
  "success": true
}
```

---

## POST /api/events/:shareToken/payout/qr-upload
### Purpose
Upload payout QR image.

### Request
Multipart form-data:
- file

### Response
```json
{
  "success": true,
  "qrImagePath": "payout-qr/event_uuid/qr.png"
}
```

---

## GET /api/events/:shareToken/payout
### Purpose
Fetch payout info.

### Response
```json
{
  "payoutType": "mixed",
  "recipientName": "Thanabat",
  "bankName": "KBank",
  "accountNumber": "123-4-56789-0",
  "qrImagePath": "payout-qr/event_uuid/qr.png"
}
```

---

## POST /api/events/:shareToken/payments/:participantId/mark-paid
### Purpose
Participant marks themselves as paid.

### Response
```json
{
  "success": true,
  "paymentStatus": "marked_paid"
}
```

---

## POST /api/events/:shareToken/payments/:participantId/confirm
### Purpose
Host confirms payment received.

### Response
```json
{
  "success": true,
  "paymentStatus": "confirmed"
}
```

---

## GET /api/events/:shareToken/payment-status
### Purpose
Fetch payment status list.

### Response
```json
[
  {
    "participantId": "p1",
    "displayName": "First",
    "finalTotal": 351,
    "paymentStatus": "confirmed"
  },
  {
    "participantId": "p2",
    "displayName": "Frame",
    "finalTotal": 234,
    "paymentStatus": "unpaid"
  }
]
```

---

## 4. Error Shape
Recommended standard error response:
```json
{
  "error": {
    "code": "ITEM_ALREADY_FINALIZED",
    "message": "This event has already been finalized."
  }
}
```

---

## 5. Validation Rules
### Event
- title required
- currency required

### Participant
- displayName required
- prevent blank names
- duplicate names in same event should be handled gracefully

### Item
- name required
- price >= 0
- quantity > 0

### Split
- at least one participant required
- total split must match item total

### Finalize
- all items must be resolved before finalization

---

## 6. Implementation Notes
### Current totals
Before finalization, UI may show estimated totals.
Server should still be source of truth.

### Final totals
After finalization, read from `payment_statuses`.

### Locking
After finalization:
- item edit endpoints should reject changes
- claim endpoints should reject changes

### Security note
Because there is no login in MVP, do not treat this as secure financial infrastructure.
This is a collaborative event tool with token-based access.

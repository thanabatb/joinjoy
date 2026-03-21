import type { ItemClaim } from "@/types/claim";
import type { Event, PayoutMethod } from "@/types/event";
import type { Item } from "@/types/item";
import type { Participant } from "@/types/participant";
import type { PaymentStatus } from "@/types/payment";

interface MockStore {
  events: Event[];
  participants: Participant[];
  items: Item[];
  itemClaims: ItemClaim[];
  payoutMethods: PayoutMethod[];
  paymentStatuses: PaymentStatus[];
}

declare global {
  var __joinjoyMockStore: MockStore | undefined;
}

function createInitialStore(): MockStore {
  const now = new Date().toISOString();
  const eventId = "11111111-1111-1111-1111-111111111111";

  return {
    events: [
      {
        id: eventId,
        shareToken: "jazz-night-demo",
        title: "Jazz Night at Jazz Bar",
        venueName: "Blue Note Bar",
        occurredAt: "2026-03-21T19:30:00.000Z",
        currency: "THB",
        serviceChargeType: "percentage",
        serviceChargeRate: 10,
        vatType: "percentage",
        vatRate: 7,
        status: "claiming",
        hostName: "First",
        calculationNote: "SC and VAT are distributed proportionally based on claimed subtotal.",
        finalizedAt: null,
        createdAt: now,
        updatedAt: now
      }
    ],
    participants: [
      {
        id: "22222222-2222-2222-2222-222222222221",
        eventId,
        displayName: "First",
        joinedAt: now,
        isHost: true,
        status: "claimed",
        browserFingerprint: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        eventId,
        displayName: "Frame",
        joinedAt: now,
        isHost: false,
        status: "joined",
        browserFingerprint: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "22222222-2222-2222-2222-222222222223",
        eventId,
        displayName: "Aom",
        joinedAt: now,
        isHost: false,
        status: "joined",
        browserFingerprint: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "22222222-2222-2222-2222-222222222224",
        eventId,
        displayName: "Bank",
        joinedAt: null,
        isHost: false,
        status: "invited",
        browserFingerprint: null,
        createdAt: now,
        updatedAt: now
      }
    ],
    items: [
      {
        id: "33333333-3333-3333-3333-333333333331",
        eventId,
        name: "Steak",
        price: 280,
        quantity: 1,
        totalPrice: 280,
        assignmentMode: "claim_later",
        status: "claimed",
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "33333333-3333-3333-3333-333333333332",
        eventId,
        name: "Truffle Fries",
        price: 180,
        quantity: 1,
        totalPrice: 180,
        assignmentMode: "claim_later",
        status: "claimed",
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        eventId,
        name: "Water",
        price: 40,
        quantity: 1,
        totalPrice: 40,
        assignmentMode: "shared_selected",
        status: "claimed",
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "33333333-3333-3333-3333-333333333334",
        eventId,
        name: "Cocktail",
        price: 320,
        quantity: 1,
        totalPrice: 320,
        assignmentMode: "claim_later",
        status: "claimed",
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "33333333-3333-3333-3333-333333333335",
        eventId,
        name: "Nachos",
        price: 220,
        quantity: 1,
        totalPrice: 220,
        assignmentMode: "claim_later",
        status: "claimed",
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "33333333-3333-3333-3333-333333333336",
        eventId,
        name: "Service Water Bottle",
        price: 30,
        quantity: 1,
        totalPrice: 30,
        assignmentMode: "unclaimed",
        status: "unclaimed",
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      }
    ],
    itemClaims: [
      {
        id: "44444444-4444-4444-4444-444444444441",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333331",
        participantId: "22222222-2222-2222-2222-222222222221",
        splitAmount: 280,
        splitRatio: 1,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444442",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333332",
        participantId: "22222222-2222-2222-2222-222222222221",
        splitAmount: 60,
        splitRatio: 0.333333,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444443",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333332",
        participantId: "22222222-2222-2222-2222-222222222222",
        splitAmount: 60,
        splitRatio: 0.333333,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444444",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333332",
        participantId: "22222222-2222-2222-2222-222222222223",
        splitAmount: 60,
        splitRatio: 0.333333,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444445",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333333",
        participantId: "22222222-2222-2222-2222-222222222221",
        splitAmount: 13.33,
        splitRatio: 0.333333,
        createdByType: "system",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444446",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333333",
        participantId: "22222222-2222-2222-2222-222222222222",
        splitAmount: 13.33,
        splitRatio: 0.333333,
        createdByType: "system",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444447",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333333",
        participantId: "22222222-2222-2222-2222-222222222223",
        splitAmount: 13.34,
        splitRatio: 0.333334,
        createdByType: "system",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444448",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333334",
        participantId: "22222222-2222-2222-2222-222222222222",
        splitAmount: 320,
        splitRatio: 1,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444449",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333335",
        participantId: "22222222-2222-2222-2222-222222222221",
        splitAmount: 110,
        splitRatio: 0.5,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "44444444-4444-4444-4444-444444444450",
        eventId,
        itemId: "33333333-3333-3333-3333-333333333335",
        participantId: "22222222-2222-2222-2222-222222222223",
        splitAmount: 110,
        splitRatio: 0.5,
        createdByType: "participant",
        createdAt: now,
        updatedAt: now
      }
    ],
    payoutMethods: [
      {
        id: "55555555-5555-5555-5555-555555555551",
        eventId,
        payoutType: "mixed",
        recipientName: "Thanabat",
        bankName: "KBank",
        accountNumber: "123-4-56789-0",
        qrImagePath: "/images/promptpay-placeholder.svg",
        createdAt: now,
        updatedAt: now
      }
    ],
    paymentStatuses: []
  };
}

export function getStore(): MockStore {
  if (!globalThis.__joinjoyMockStore) {
    globalThis.__joinjoyMockStore = createInitialStore();
  }

  return globalThis.__joinjoyMockStore;
}

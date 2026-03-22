import type { ItemClaim } from "@/types/claim";
import type { Event, PayoutMethod } from "@/types/event";
import type { Item } from "@/types/item";
import type { Participant } from "@/types/participant";
import type { PaymentStatus } from "@/types/payment";

function toNumber(value: number | string | null | undefined) {
  return value === null || value === undefined ? 0 : Number(value);
}

export function mapEventRow(row: Record<string, unknown>): Event {
  return {
    id: String(row.id),
    shareToken: String(row.share_token),
    title: String(row.title),
    venueName: row.venue_name ? String(row.venue_name) : null,
    occurredAt: row.occurred_at ? String(row.occurred_at) : String(row.created_at),
    currency: String(row.currency),
    serviceChargeType: EventChargeType(String(row.service_charge_type)),
    serviceChargeRate: toNumber(row.service_charge_rate as number | string),
    vatType: EventChargeType(String(row.vat_type)),
    vatRate: toNumber(row.vat_rate as number | string),
    status: EventStatusValue(String(row.status)),
    hostName: row.host_name ? String(row.host_name) : "",
    calculationNote: row.calculation_note ? String(row.calculation_note) : null,
    finalizedAt: row.finalized_at ? String(row.finalized_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function mapParticipantRow(row: Record<string, unknown>): Participant {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    displayName: String(row.display_name),
    joinedAt: row.joined_at ? String(row.joined_at) : null,
    isHost: Boolean(row.is_host),
    status: ParticipantStatusValue(String(row.status)),
    browserFingerprint: row.browser_fingerprint ? String(row.browser_fingerprint) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function mapItemRow(row: Record<string, unknown>): Item {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    name: String(row.name),
    price: toNumber(row.price as number | string),
    quantity: Number(row.quantity),
    totalPrice: toNumber(row.total_price as number | string),
    assignmentMode: AssignmentModeValue(String(row.assignment_mode)),
    status: ItemStatusValue(String(row.status)),
    sortOrder: Number(row.sort_order),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function mapClaimRow(row: Record<string, unknown>): ItemClaim {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    itemId: String(row.item_id),
    participantId: String(row.participant_id),
    splitAmount: toNumber(row.split_amount as number | string),
    splitRatio:
      row.split_ratio === null || row.split_ratio === undefined
        ? null
        : Number(row.split_ratio),
    createdByType: ClaimCreatorTypeValue(String(row.created_by_type)),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function mapPaymentStatusRow(row: Record<string, unknown>): PaymentStatus {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    participantId: String(row.participant_id),
    finalSubtotal: toNumber(row.final_subtotal as number | string),
    finalServiceCharge: toNumber(row.final_service_charge as number | string),
    finalVat: toNumber(row.final_vat as number | string),
    finalTotal: toNumber(row.final_total as number | string),
    paymentStatus: PaymentStateValue(String(row.payment_status)),
    paidAt: row.paid_at ? String(row.paid_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function mapPayoutRow(row: Record<string, unknown>): PayoutMethod {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    payoutType: PayoutTypeValue(String(row.payout_type)),
    recipientName: row.recipient_name ? String(row.recipient_name) : "",
    bankName: row.bank_name ? String(row.bank_name) : null,
    accountNumber: row.account_number ? String(row.account_number) : null,
    qrImagePath: row.qr_image_path ? String(row.qr_image_path) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function EventChargeType(value: string): Event["serviceChargeType"] {
  return value as Event["serviceChargeType"];
}

function EventStatusValue(value: string): Event["status"] {
  return value as Event["status"];
}

function ParticipantStatusValue(value: string): Participant["status"] {
  return value as Participant["status"];
}

function AssignmentModeValue(value: string): Item["assignmentMode"] {
  return value as Item["assignmentMode"];
}

function ItemStatusValue(value: string): Item["status"] {
  return value as Item["status"];
}

function ClaimCreatorTypeValue(value: string): ItemClaim["createdByType"] {
  return value as ItemClaim["createdByType"];
}

function PaymentStateValue(value: string): PaymentStatus["paymentStatus"] {
  return value as PaymentStatus["paymentStatus"];
}

function PayoutTypeValue(value: string): PayoutMethod["payoutType"] {
  return value as PayoutMethod["payoutType"];
}

export type AssignmentMode =
  | "unclaimed"
  | "host_assigned"
  | "claim_later"
  | "shared_selected";

export type ItemStatus = "unclaimed" | "partial" | "claimed" | "resolved";

export interface Item {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  assignmentMode: AssignmentMode;
  status: ItemStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

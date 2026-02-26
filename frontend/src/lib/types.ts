export type Status = "pending" | "in_transit" | "delivered" | "cancelled";

export interface Shipment {
  id: number;
  tracking_number: string;
  carrier: string;
  origin: string;
  destination: string;
  status: Status;
  eta: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentInput {
  tracking_number: string;
  carrier: string;
  origin: string;
  destination: string;
  status: Status;
  eta: string | null;
  notes: string | null;
}

export interface Stats {
  total: number;
  pending: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
}

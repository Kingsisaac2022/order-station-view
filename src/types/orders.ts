
export type OrderStatus = 'pending' | 'active' | 'in-transit' | 'completed' | 'flagged';

export interface LocationUpdate {
  id: string;
  purchase_order_id: string;
  location: [number, number];
  timestamp: string;
}

export interface JourneyInfo {
  id: string;
  purchase_order_id: string;
  type: string; // 'traffic', 'weather', 'stop', 'info', etc.
  message: string;
  timestamp: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  date: string;
  depot_manager: string;
  depot_location: string;
  product_type: string;
  quantity: string;
  price_per_litre: string;
  total_amount: string;
  loading_location: string;
  destination: string;
  expected_loading_date: string;
  truck_plate_number?: string;
  transport_company?: string;
  payment_reference: string;
  bank_name: string;
  payment_date: string;
  amount_paid: string;
  payment_type: string;
  authorized_by: string;
  authorized_position: string;
  authorized_company: string;
  status: OrderStatus;
  driver_id?: string;
  assigned_truck_id?: string;
  origin?: [number, number]; // GPS coordinates for loading location
  destination_coords?: [number, number]; // GPS coordinates for destination
  current_location?: [number, number]; // Current GPS coordinates during transit
  location_updates?: LocationUpdate[]; // History of location updates
  journey_info?: JourneyInfo[]; // Info about the journey (traffic, weather, stops)
  volume_at_loading?: string;
  volume_at_delivery?: string;
  delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

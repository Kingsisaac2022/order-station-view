
export type OrderStatus = 'pending' | 'active' | 'in-transit' | 'completed' | 'flagged';

export interface LocationUpdate {
  location: [number, number];
  timestamp: string;
}

export interface JourneyInfo {
  type: string; // 'traffic', 'weather', 'stop', 'info', etc.
  message: string;
  timestamp: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  depotManager: string;
  depotLocation: string;
  productType: string;
  quantity: string;
  pricePerLitre: string;
  totalAmount: string;
  loadingLocation: string;
  destination: string;
  expectedLoadingDate: string;
  truckPlateNumber?: string;
  transportCompany?: string;
  paymentReference: string;
  bankName: string;
  paymentDate: string;
  amountPaid: string;
  paymentType: string;
  authorizedBy: string;
  authorizedPosition: string;
  authorizedCompany: string;
  status: OrderStatus;
  driverId?: string;
  assignedTruckId?: string;
  origin?: [number, number]; // GPS coordinates for loading location
  destinationCoords?: [number, number]; // GPS coordinates for destination
  currentLocation?: [number, number]; // Current GPS coordinates during transit
  locationUpdates?: LocationUpdate[]; // History of location updates
  journeyInfo?: JourneyInfo[]; // Info about the journey (traffic, weather, stops)
  volumeAtLoading?: string;
  volumeAtDelivery?: string;
  deliveryDate?: string;
  notes?: string;
}

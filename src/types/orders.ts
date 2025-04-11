
export type OrderStatus = 'pending' | 'active' | 'in-transit' | 'completed' | 'flagged';

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
  volumeAtLoading?: string;
  volumeAtDelivery?: string;
  deliveryDate?: string;
  notes?: string;
}

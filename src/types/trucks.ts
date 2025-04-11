
export interface Truck {
  id: string;
  plateNo: string;
  model: string;
  capacity: string;
  fuelCapacity: string;
  assignedDriverId?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  gpsEnabled: boolean;
  gpsId?: string;
  currentLocation?: [number, number];
  notes?: string;
  createdAt: string;
}

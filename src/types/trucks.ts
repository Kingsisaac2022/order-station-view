
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
  fuelLevel?: number; // percentage of fuel remaining
  lastMaintenance?: string; // date of last maintenance
  notes?: string;
  createdAt: string;
}

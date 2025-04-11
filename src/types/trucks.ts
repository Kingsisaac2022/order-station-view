
export interface Truck {
  id: string;
  plate_no: string;
  model: string;
  capacity: string;
  fuel_capacity: string;
  assigned_driver_id?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  gps_enabled: boolean;
  gps_id?: string;
  current_location?: [number, number];
  fuel_level?: number; // percentage of fuel remaining
  last_maintenance?: string; // date of last maintenance
  notes?: string;
  created_at: string;
  updated_at: string;
}

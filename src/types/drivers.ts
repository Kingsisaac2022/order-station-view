
export interface Driver {
  id: string;
  name: string;
  license_no: string;
  phone_number: string;
  email: string;
  assigned_truck_id?: string;
  status: 'available' | 'on-duty' | 'off-duty' | 'pending-approval' | 'approved';
  last_trip?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

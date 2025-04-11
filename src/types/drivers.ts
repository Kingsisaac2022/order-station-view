
export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  phoneNumber: string;
  email: string;
  assignedTruckId?: string;
  status: 'available' | 'on-duty' | 'off-duty' | 'pending-approval' | 'approved';
  lastTrip?: string;
  notes?: string;
  createdAt: string;
}

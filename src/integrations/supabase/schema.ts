
import { Database } from './types';

// Define the database schema types to ensure consistency
export type Tables = Database['public']['Tables'];

export type DriversTable = Tables['drivers']['Row'];
export type TrucksTable = Tables['trucks']['Row'];
export type PurchaseOrdersTable = Tables['purchase_orders']['Row'];
export type LocationUpdatesTable = Tables['location_updates']['Row'];
export type JourneyInfoTable = Tables['journey_info']['Row'];

// Schema definition for tables
export const TABLES = {
  DRIVERS: 'drivers',
  TRUCKS: 'trucks',
  PURCHASE_ORDERS: 'purchase_orders',
  LOCATION_UPDATES: 'location_updates',
  JOURNEY_INFO: 'journey_info',
};


import { PurchaseOrder, OrderStatus, LocationUpdate, JourneyInfo } from './orders';

export interface OrderState {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
}

export interface OrderContextType {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
  loadOrders: () => Promise<void>;
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<PurchaseOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setActiveOrder: (order: PurchaseOrder | null) => void;
  updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => Promise<void>;
  assignDriver: (id: string, driverId: string, truckId: string) => Promise<void>;
  updateLocation: (id: string, location: [number, number]) => Promise<void>;
  updateJourneyInfo: (id: string, type: string, message: string) => Promise<void>;
  completeDelivery: (id: string, volumeDelivered: string) => Promise<void>;
}

export type OrderAction = 
  | { type: 'SET_ORDERS'; payload: PurchaseOrder[] }
  | { type: 'ADD_ORDER'; payload: PurchaseOrder }
  | { type: 'UPDATE_ORDER'; payload: PurchaseOrder }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ACTIVE_ORDER'; payload: PurchaseOrder | null }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus; notes?: string } }
  | { type: 'ASSIGN_DRIVER'; payload: { id: string; driverId: string; truckId: string } }
  | { type: 'UPDATE_LOCATION'; payload: { id: string; location: [number, number]; timestamp: string } }
  | { type: 'UPDATE_JOURNEY_INFO'; payload: { id: string; info: { type: string; message: string; timestamp: string } } }
  | { type: 'COMPLETE_DELIVERY'; payload: { id: string; volumeDelivered: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

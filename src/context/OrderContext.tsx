
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PurchaseOrder, OrderStatus } from '@/types/orders';
import { toast } from 'sonner';

// Initial sample order to demonstrate functionality
const sampleOrder: PurchaseOrder = {
  id: '1',
  poNumber: 'FS/NNPC/PO/12345',
  date: '2025-04-11',
  depotManager: 'John Doe',
  depotLocation: 'NNPC Depot – Apapa, Lagos',
  productType: 'PMS (Petrol)',
  quantity: '33,000',
  pricePerLitre: '₦195.00',
  totalAmount: '₦6,435,000.00',
  loadingLocation: 'NNPC Depot, Apapa, Lagos',
  destination: 'ABC Filling Station, 123 Main St, Lagos',
  expectedLoadingDate: '2025-04-15',
  paymentReference: 'REF123456',
  bankName: 'First Bank',
  paymentDate: '2025-04-11',
  amountPaid: '₦6,435,000.00',
  paymentType: 'Full Payment',
  authorizedBy: 'Jane Smith',
  authorizedPosition: 'Station Manager',
  authorizedCompany: 'ABC Filling Station',
  status: 'pending',
  origin: [3.3792, 6.4550], // Apapa coordinates
  destinationCoords: [3.3886, 6.4281], // Sample destination in Lagos
};

interface OrderState {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
}

const initialState: OrderState = {
  orders: [sampleOrder],
  activeOrder: null,
};

type OrderAction = 
  | { type: 'ADD_ORDER'; payload: PurchaseOrder }
  | { type: 'UPDATE_ORDER'; payload: PurchaseOrder }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ACTIVE_ORDER'; payload: PurchaseOrder | null }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus; notes?: string } }
  | { type: 'ASSIGN_DRIVER'; payload: { id: string; driverId: string; truckId: string } }
  | { type: 'UPDATE_LOCATION'; payload: { id: string; location: [number, number] } }
  | { type: 'COMPLETE_DELIVERY'; payload: { id: string; volumeDelivered: string } };

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
      };
    case 'SET_ACTIVE_ORDER':
      return {
        ...state,
        activeOrder: action.payload,
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { ...order, status: action.payload.status, notes: action.payload.notes || order.notes } 
            : order
        ),
      };
    case 'ASSIGN_DRIVER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { ...order, driverId: action.payload.driverId, assignedTruckId: action.payload.truckId } 
            : order
        ),
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { ...order, currentLocation: action.payload.location } 
            : order
        ),
      };
    case 'COMPLETE_DELIVERY':
      const order = state.orders.find(o => o.id === action.payload.id);
      if (!order) return state;
      
      const volumeAtLoading = parseFloat(order.quantity.replace(/,/g, ''));
      const volumeAtDelivery = parseFloat(action.payload.volumeDelivered.replace(/,/g, ''));
      const difference = (volumeAtLoading - volumeAtDelivery) / volumeAtLoading * 100;
      
      const newStatus: OrderStatus = difference >= 3 ? 'flagged' : 'completed';
      const notes = difference >= 3 
        ? `Flagged: Volume difference of ${difference.toFixed(2)}% detected` 
        : `Completed: Delivered volume matches expected (${difference.toFixed(2)}% difference)`;

      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                status: newStatus, 
                volumeAtDelivery: action.payload.volumeDelivered,
                volumeAtLoading: order.quantity,
                deliveryDate: new Date().toISOString().split('T')[0],
                notes 
              } 
            : order
        ),
      };
    default:
      return state;
  }
};

interface OrderContextType {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
  addOrder: (order: PurchaseOrder) => void;
  updateOrder: (order: PurchaseOrder) => void;
  deleteOrder: (id: string) => void;
  setActiveOrder: (order: PurchaseOrder | null) => void;
  updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => void;
  assignDriver: (id: string, driverId: string, truckId: string) => void;
  updateLocation: (id: string, location: [number, number]) => void;
  completeDelivery: (id: string, volumeDelivered: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Function to get status notification message
  const getStatusNotification = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Order created and pending payment verification';
      case 'active':
        return 'Payment verified, order is now active';
      case 'in-transit':
        return 'Order is in transit to destination';
      case 'completed':
        return 'Order has been successfully delivered';
      case 'flagged':
        return 'Order has been flagged due to volume discrepancy';
      default:
        return `Order status updated to ${status}`;
    }
  };

  // Notify on order status changes
  useEffect(() => {
    const handleStatusChanges = () => {
      const activeOrder = state.activeOrder;
      if (!activeOrder) return;

      // Show different notifications based on status
      switch (activeOrder.status) {
        case 'pending':
          toast.info(getStatusNotification('pending'));
          break;
        case 'active':
          toast.success(getStatusNotification('active'));
          break;
        case 'in-transit':
          toast.info(getStatusNotification('in-transit'));
          break;
        case 'completed':
          toast.success(getStatusNotification('completed'));
          break;
        case 'flagged':
          toast.error(getStatusNotification('flagged'));
          break;
      }
    };

    handleStatusChanges();
  }, [state.activeOrder?.status]);

  // Context values
  const value = {
    orders: state.orders,
    activeOrder: state.activeOrder,
    addOrder: (order: PurchaseOrder) => {
      dispatch({ type: 'ADD_ORDER', payload: order });
    },
    updateOrder: (order: PurchaseOrder) => {
      dispatch({ type: 'UPDATE_ORDER', payload: order });
    },
    deleteOrder: (id: string) => {
      dispatch({ type: 'DELETE_ORDER', payload: id });
    },
    setActiveOrder: (order: PurchaseOrder | null) => {
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: order });
    },
    updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status, notes } });
    },
    assignDriver: (id: string, driverId: string, truckId: string) => {
      dispatch({ type: 'ASSIGN_DRIVER', payload: { id, driverId, truckId } });
    },
    updateLocation: (id: string, location: [number, number]) => {
      dispatch({ type: 'UPDATE_LOCATION', payload: { id, location } });
    },
    completeDelivery: (id: string, volumeDelivered: string) => {
      dispatch({ type: 'COMPLETE_DELIVERY', payload: { id, volumeDelivered } });
    }
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

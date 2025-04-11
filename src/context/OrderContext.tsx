
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PurchaseOrder, OrderStatus } from '@/types/orders';
import { toast } from 'sonner';

interface OrderState {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
}

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
};

type OrderAction = 
  | { type: 'ADD_ORDER'; payload: PurchaseOrder }
  | { type: 'UPDATE_ORDER'; payload: PurchaseOrder }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ACTIVE_ORDER'; payload: PurchaseOrder | null }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: OrderStatus; notes?: string } }
  | { type: 'ASSIGN_DRIVER'; payload: { id: string; driverId: string; truckId: string } }
  | { type: 'UPDATE_LOCATION'; payload: { id: string; location: [number, number]; timestamp: string } }
  | { type: 'UPDATE_JOURNEY_INFO'; payload: { id: string; info: { type: string; message: string; timestamp: string } } }
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
            ? { 
                ...order, 
                driverId: action.payload.driverId, 
                assignedTruckId: action.payload.truckId,
                journeyInfo: [
                  { 
                    type: 'assignment', 
                    message: `Driver and truck assigned for delivery`, 
                    timestamp: new Date().toISOString() 
                  }
                ]
              } 
            : order
        ),
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                currentLocation: action.payload.location,
                locationUpdates: [
                  ...(order.locationUpdates || []),
                  { 
                    location: action.payload.location,
                    timestamp: action.payload.timestamp
                  }
                ] 
              } 
            : order
        ),
      };
    case 'UPDATE_JOURNEY_INFO':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                journeyInfo: [
                  ...(order.journeyInfo || []),
                  action.payload.info
                ] 
              } 
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
                notes,
                journeyInfo: [
                  ...(order.journeyInfo || []),
                  { 
                    type: newStatus, 
                    message: `Delivery ${newStatus}. ${notes}`, 
                    timestamp: new Date().toISOString() 
                  }
                ]
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
  updateJourneyInfo: (id: string, type: string, message: string) => void;
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

  // Update truck locations for in-transit orders
  useEffect(() => {
    const inTransitOrders = state.orders.filter(order => order.status === 'in-transit');
    if (inTransitOrders.length === 0) return;

    // Set up interval for location updates
    const interval = setInterval(() => {
      inTransitOrders.forEach(order => {
        if (!order.origin || !order.destinationCoords || !order.currentLocation) return;

        // Calculate new position along the route
        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destinationCoords;
        
        // Get current position
        let [currentLng, currentLat] = order.currentLocation;
        
        // Calculate direction and distance to move
        const totalDistLng = endLng - startLng;
        const totalDistLat = endLat - startLat;
        
        // Move a small step toward destination (5% of remaining distance)
        const remainingDistLng = endLng - currentLng;
        const remainingDistLat = endLat - currentLat;
        
        const moveLng = remainingDistLng * 0.05;
        const moveLat = remainingDistLat * 0.05;
        
        // Update position if not very close to destination
        if (Math.abs(remainingDistLng) > 0.001 || Math.abs(remainingDistLat) > 0.001) {
          const newLng = currentLng + moveLng;
          const newLat = currentLat + moveLat;
          
          // Update location
          dispatch({ 
            type: 'UPDATE_LOCATION', 
            payload: { 
              id: order.id, 
              location: [newLng, newLat],
              timestamp: new Date().toISOString()
            } 
          });
          
          // Add journey updates occasionally
          if (Math.random() > 0.85) {
            const updates = [
              { type: 'traffic', message: 'Light traffic conditions on route' },
              { type: 'weather', message: 'Weather conditions: Clear skies' },
              { type: 'info', message: 'Passing through Ikeja, Lagos' },
              { type: 'traffic', message: 'Traffic congestion ahead, may cause delays' },
              { type: 'stop', message: 'Brief stop for driver rest break' },
              { type: 'weather', message: 'Weather conditions: Light showers' },
              { type: 'traffic', message: 'Road work ahead, using alternate route' },
              { type: 'info', message: 'Entering Epe road' }
            ];
            
            const update = updates[Math.floor(Math.random() * updates.length)];
            
            dispatch({
              type: 'UPDATE_JOURNEY_INFO',
              payload: {
                id: order.id,
                info: {
                  type: update.type,
                  message: update.message,
                  timestamp: new Date().toISOString()
                }
              }
            });
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [state.orders]);

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
      dispatch({ 
        type: 'UPDATE_LOCATION', 
        payload: { 
          id, 
          location,
          timestamp: new Date().toISOString()
        } 
      });
    },
    updateJourneyInfo: (id: string, type: string, message: string) => {
      dispatch({ 
        type: 'UPDATE_JOURNEY_INFO', 
        payload: { 
          id, 
          info: {
            type,
            message,
            timestamp: new Date().toISOString()
          }
        } 
      });
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

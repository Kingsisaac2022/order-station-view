import { OrderState, OrderAction } from '../types/order-context';
import { OrderStatus } from '../types/orders';

export const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };
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
        activeOrder: state.activeOrder?.id === action.payload.id 
          ? action.payload 
          : state.activeOrder
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
        activeOrder: state.activeOrder?.id === action.payload ? null : state.activeOrder
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
            ? { 
                ...order, 
                status: action.payload.status, 
                notes: action.payload.notes || order.notes 
              } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload.id
          ? { 
              ...state.activeOrder, 
              status: action.payload.status, 
              notes: action.payload.notes || state.activeOrder.notes 
            }
          : state.activeOrder
      };
    case 'ASSIGN_DRIVER':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                driver_id: action.payload.driverId, 
                assigned_truck_id: action.payload.truckId
              } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload.id
          ? { 
              ...state.activeOrder, 
              driver_id: action.payload.driverId, 
              assigned_truck_id: action.payload.truckId 
            }
          : state.activeOrder
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                current_location: action.payload.location,
                location_updates: [
                  ...(order.location_updates || []),
                  { 
                    id: `temp-${Date.now()}`,
                    purchase_order_id: order.id,
                    location: action.payload.location,
                    timestamp: action.payload.timestamp
                  }
                ] 
              } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload.id
          ? { 
              ...state.activeOrder,
              current_location: action.payload.location,
              location_updates: [
                ...(state.activeOrder.location_updates || []),
                { 
                  id: `temp-${Date.now()}`,
                  purchase_order_id: state.activeOrder.id,
                  location: action.payload.location,
                  timestamp: action.payload.timestamp
                }
              ]
            }
          : state.activeOrder
      };
    case 'UPDATE_JOURNEY_INFO':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { 
                ...order, 
                journey_info: [
                  ...(order.journey_info || []),
                  { 
                    id: `temp-${Date.now()}`,
                    purchase_order_id: order.id,
                    ...action.payload.info 
                  }
                ] 
              } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload.id
          ? { 
              ...state.activeOrder,
              journey_info: [
                ...(state.activeOrder.journey_info || []),
                { 
                  id: `temp-${Date.now()}`,
                  purchase_order_id: state.activeOrder.id,
                  ...action.payload.info 
                }
              ]
            }
          : state.activeOrder
      };
    case 'COMPLETE_DELIVERY':
      {
        const order = state.orders.find(o => o.id === action.payload.id);
        if (!order) return state;
        
        const volumeAtLoading = parseFloat(order.quantity.replace(/,/g, ''));
        const volumeAtDelivery = parseFloat(action.payload.volumeDelivered.replace(/,/g, ''));
        const difference = (volumeAtLoading - volumeAtDelivery) / volumeAtLoading * 100;
        
        const newStatus: OrderStatus = difference >= 3 ? 'flagged' : 'completed';
        const notes = difference >= 3 
          ? `Flagged: Volume difference of ${difference.toFixed(2)}% detected` 
          : `Completed: Delivered volume matches expected (${difference.toFixed(2)}% difference)`;

        const updatedOrder = { 
          ...order, 
          status: newStatus, 
          volume_at_delivery: action.payload.volumeDelivered,
          volume_at_loading: order.quantity,
          delivery_date: new Date().toISOString().split('T')[0],
          notes
        };

        return {
          ...state,
          orders: state.orders.map(o => o.id === action.payload.id ? updatedOrder : o),
          activeOrder: state.activeOrder?.id === action.payload.id ? updatedOrder : state.activeOrder
        };
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'START_DELIVERY':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload 
            ? { ...order, status: 'in-transit' as OrderStatus } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload
          ? { ...state.activeOrder, status: 'in-transit' as OrderStatus }
          : state.activeOrder
      };
    default:
      return state;
  }
};

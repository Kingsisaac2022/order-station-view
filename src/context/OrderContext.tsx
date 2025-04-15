import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PurchaseOrder, OrderStatus, LocationUpdate, JourneyInfo } from '@/types/orders';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OrderState {
  orders: PurchaseOrder[];
  activeOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
  isLoading: true,
  error: null
};

type OrderAction = 
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

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
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
            ? { ...order, status: action.payload.status, notes: action.payload.notes || order.notes } 
            : order
        ),
        activeOrder: state.activeOrder?.id === action.payload.id
          ? { ...state.activeOrder, status: action.payload.status, notes: action.payload.notes || state.activeOrder.notes }
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
    default:
      return state;
  }
};

interface OrderContextType {
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

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

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

  useEffect(() => {
    const handleStatusChanges = () => {
      const activeOrder = state.activeOrder;
      if (!activeOrder) return;

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

  const loadOrders = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('purchase_orders')
        .select('*');
      
      if (ordersError) throw ordersError;

      const { data: locationUpdates, error: locError } = await supabase
        .from('location_updates')
        .select('*');
      
      if (locError) throw locError;

      const { data: journeyInfo, error: journeyError } = await supabase
        .from('journey_info')
        .select('*');
      
      if (journeyError) throw journeyError;

      const formattedOrders = orders.map((order: any) => {
        const origin = order.origin ? 
          [
            parseFloat(((order.origin as any)?.x || 0)), 
            parseFloat(((order.origin as any)?.y || 0))
          ] as [number, number] : 
          undefined;
        
        const destination_coords = order.destination_coords ? 
          [
            parseFloat(((order.destination_coords as any)?.x || 0)), 
            parseFloat(((order.destination_coords as any)?.y || 0))
          ] as [number, number] : 
          undefined;
        
        const current_location = order.current_location ? 
          [
            parseFloat(((order.current_location as any)?.x || 0)), 
            parseFloat(((order.current_location as any)?.y || 0))
          ] as [number, number] : 
          undefined;

        const formattedOrder: PurchaseOrder = {
          ...order,
          status: order.status as OrderStatus,
          origin,
          destination_coords,
          current_location
        };
        
        const orderLocationUpdates = locationUpdates
          .filter((update: any) => update.purchase_order_id === order.id)
          .map((update: any) => ({
            ...update,
            location: update.location 
              ? [
                  parseFloat(((update.location as any)?.x || 0)), 
                  parseFloat(((update.location as any)?.y || 0))
                ] as [number, number]
              : [0, 0]
          }));
          
        formattedOrder.location_updates = orderLocationUpdates;
        
        formattedOrder.journey_info = journeyInfo.filter((info: any) => 
          info.purchase_order_id === order.id
        );
        
        return formattedOrder;
      });
      
      dispatch({ type: 'SET_ORDERS', payload: formattedOrders });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Error loading orders:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load orders' });
      toast.error('Failed to load orders');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const inTransitOrders = state.orders.filter(order => order.status === 'in-transit');
    if (inTransitOrders.length === 0) return;

    const interval = setInterval(() => {
      inTransitOrders.forEach(order => {
        if (!order.origin || !order.destination_coords || !order.current_location) return;

        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destination_coords;
        
        let [currentLng, currentLat] = order.current_location;
        
        const totalDistLng = endLng - startLng;
        const totalDistLat = endLat - startLat;
        
        const remainingDistLng = endLng - currentLng;
        const remainingDistLat = endLat - currentLat;
        
        const moveLng = remainingDistLng * 0.05;
        const moveLat = remainingDistLat * 0.05;
        
        if (Math.abs(remainingDistLng) > 0.001 || Math.abs(remainingDistLat) > 0.001) {
          const newLng = currentLng + moveLng;
          const newLat = currentLat + moveLat;
          
          value.updateLocation(order.id, [newLng, newLat]);
          
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
            value.updateJourneyInfo(order.id, update.type, update.message);
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [state.orders]);

  const value: OrderContextType = {
    orders: state.orders,
    activeOrder: state.activeOrder,
    isLoading: state.isLoading,
    error: state.error,
    loadOrders,
    
    addOrder: async (order: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const dbOrder: any = { ...order };
        if (order.origin) {
          dbOrder.origin = `(${order.origin[0]},${order.origin[1]})`;
        }
        if (order.destination_coords) {
          dbOrder.destination_coords = `(${order.destination_coords[0]},${order.destination_coords[1]})`;
        }
        if (order.current_location) {
          dbOrder.current_location = `(${order.current_location[0]},${order.current_location[1]})`;
        }
        
        delete dbOrder.location_updates;
        delete dbOrder.journey_info;
        
        const { data, error } = await supabase
          .from('purchase_orders')
          .insert([dbOrder])
          .select()
          .single();
          
        if (error) throw error;
        
        const formattedOrder: PurchaseOrder = {
          ...data!,
          status: data!.status as OrderStatus,
          origin: data?.origin 
            ? [parseFloat(data.origin.x), parseFloat(data.origin.y)] as [number, number]
            : undefined,
          destination_coords: data?.destination_coords 
            ? [parseFloat(data.destination_coords.x), parseFloat(data.destination_coords.y)] as [number, number]
            : undefined,
          current_location: data?.current_location 
            ? [parseFloat(data.current_location.x), parseFloat(data.current_location.y)] as [number, number]
            : undefined,
          location_updates: [],
          journey_info: []
        };
        
        dispatch({ type: 'ADD_ORDER', payload: formattedOrder });
        toast.success('Order created successfully');
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Failed to create order');
        throw error;
      }
    },
    
    updateOrder: async (id: string, order: Partial<PurchaseOrder>) => {
      try {
        const dbOrder: any = { ...order };
        if (order.origin) {
          dbOrder.origin = `(${order.origin[0]},${order.origin[1]})`;
        }
        if (order.destination_coords) {
          dbOrder.destination_coords = `(${order.destination_coords[0]},${order.destination_coords[1]})`;
        }
        if (order.current_location) {
          dbOrder.current_location = `(${order.current_location[0]},${order.current_location[1]})`;
        }
        
        delete dbOrder.location_updates;
        delete dbOrder.journey_info;
        
        const { error } = await supabase
          .from('purchase_orders')
          .update(dbOrder)
          .eq('id', id);
          
        if (error) throw error;
        
        await loadOrders();
        
        toast.success('Order updated successfully');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update order');
      }
    },
    
    deleteOrder: async (id: string) => {
      try {
        const { error } = await supabase
          .from('purchase_orders')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        dispatch({ type: 'DELETE_ORDER', payload: id });
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    },
    
    setActiveOrder: (order: PurchaseOrder | null) => {
      dispatch({ type: 'SET_ACTIVE_ORDER', payload: order });
    },
    
    updateOrderStatus: async (id: string, status: OrderStatus, notes?: string) => {
      try {
        const updates = { 
          status,
          ...(notes && { notes })
        };
        
        const { data, error } = await supabase
          .from('purchase_orders')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        
        dispatch({ 
          type: 'UPDATE_ORDER_STATUS', 
          payload: { id, status, notes } 
        });
        
        toast.success(`Order status updated to ${status}`);
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
      }
    },
    
    assignDriver: async (id: string, driverId: string, truckId: string) => {
      try {
        const { data: updatedOrder, error: orderError } = await supabase
          .from('purchase_orders')
          .update({ 
            driver_id: driverId, 
            assigned_truck_id: truckId,
            status: 'active'
          })
          .eq('id', id)
          .select()
          .single();
          
        if (orderError) throw orderError;
        
        const { error: journeyError } = await supabase
          .from('journey_info')
          .insert([{
            purchase_order_id: id,
            type: 'assignment',
            message: 'Driver and truck assigned for delivery',
            timestamp: new Date().toISOString()
          }]);
          
        if (journeyError) throw journeyError;
        
        await supabase
          .from('drivers')
          .update({ 
            status: 'on-duty',
            assigned_truck_id: truckId
          })
          .eq('id', driverId);
          
        await supabase
          .from('trucks')
          .update({ 
            status: 'in-use',
            assigned_driver_id: driverId
          })
          .eq('id', truckId);
        
        dispatch({ 
          type: 'ASSIGN_DRIVER', 
          payload: { id, driverId, truckId } 
        });
        
        await loadOrders();
        
        toast.success('Driver and truck assigned to order');
      } catch (error) {
        console.error('Error assigning driver:', error);
        toast.error('Failed to assign driver');
      }
    },
    
    updateLocation: async (id: string, location: [number, number]) => {
      try {
        const point = `(${location[0]},${location[1]})`;
        
        const { error: orderError } = await supabase
          .from('purchase_orders')
          .update({ current_location: point })
          .eq('id', id);
          
        if (orderError) throw orderError;
        
        const timestamp = new Date().toISOString();
        
        const { error: locationError } = await supabase
          .from('location_updates')
          .insert([{
            purchase_order_id: id,
            location: point,
            timestamp
          }]);
          
        if (locationError) throw locationError;
        
        dispatch({ 
          type: 'UPDATE_LOCATION', 
          payload: { id, location, timestamp } 
        });
      } catch (error) {
        console.error('Error updating location:', error);
      }
    },
    
    updateJourneyInfo: async (id: string, type: string, message: string) => {
      try {
        const timestamp = new Date().toISOString();
        
        const { error } = await supabase
          .from('journey_info')
          .insert([{
            purchase_order_id: id,
            type,
            message,
            timestamp
          }]);
          
        if (error) throw error;
        
        dispatch({ 
          type: 'UPDATE_JOURNEY_INFO', 
          payload: { 
            id, 
            info: { type, message, timestamp } 
          } 
        });
      } catch (error) {
        console.error('Error updating journey info:', error);
      }
    },
    
    completeDelivery: async (id: string, volumeDelivered: string) => {
      try {
        const currentOrder = state.orders.find(o => o.id === id);
        if (!currentOrder) {
          throw new Error('Order not found');
        }
        
        const volumeAtLoading = parseFloat(currentOrder.quantity.replace(/,/g, ''));
        const volumeAtDelivery = parseFloat(volumeDelivered.replace(/,/g, ''));
        const difference = (volumeAtLoading - volumeAtDelivery) / volumeAtLoading * 100;
        
        const newStatus: OrderStatus = difference >= 3 ? 'flagged' : 'completed';
        const notes = difference >= 3 
          ? `Flagged: Volume difference of ${difference.toFixed(2)}% detected` 
          : `Completed: Delivered volume matches expected (${difference.toFixed(2)}% difference)`;
        
        const { error: orderError } = await supabase
          .from('purchase_orders')
          .update({
            status: newStatus,
            volume_at_delivery: volumeDelivered,
            volume_at_loading: currentOrder.quantity,
            delivery_date: new Date().toISOString().split('T')[0],
            notes
          })
          .eq('id', id);
          
        if (orderError) throw orderError;
        
        const { error: journeyError } = await supabase
          .from('journey_info')
          .insert([{
            purchase_order_id: id,
            type: newStatus,
            message: `Delivery ${newStatus}. ${notes}`,
            timestamp: new Date().toISOString()
          }]);
          
        if (journeyError) throw journeyError;
        
        if (currentOrder.driver_id) {
          await supabase
            .from('drivers')
            .update({ 
              status: 'available',
              assigned_truck_id: null,
              last_trip: new Date().toISOString().split('T')[0]
            })
            .eq('id', currentOrder.driver_id);
        }
        
        if (currentOrder.assigned_truck_id) {
          await supabase
            .from('trucks')
            .update({ 
              status: 'available',
              assigned_driver_id: null
            })
            .eq('id', currentOrder.assigned_truck_id);
        }
        
        dispatch({ 
          type: 'COMPLETE_DELIVERY', 
          payload: { id, volumeDelivered } 
        });
        
        await loadOrders();
        
        toast.success(`Delivery ${newStatus}`);
      } catch (error) {
        console.error('Error completing delivery:', error);
        toast.error('Failed to complete delivery');
      }
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

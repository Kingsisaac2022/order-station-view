import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, startDelivery } from '@/integrations/supabase/client';
import { OrderContextType, OrderState } from '../types/order-context';
import { orderReducer } from '../reducers/orderReducer';
import { useOrderStatusNotifications } from '../hooks/useOrderStatusNotifications';
import { safeParseCoordinate } from '../utils/coordinate-utils';
import { PurchaseOrder, OrderStatus } from '../types/orders';

const initialState: OrderState = {
  orders: [],
  activeOrder: null,
  isLoading: true,
  error: null
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Use the custom hook for status notifications
  useOrderStatusNotifications(state.activeOrder);

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
        const origin = safeParseCoordinate(order.origin);
        const destination_coords = safeParseCoordinate(order.destination_coords);
        const current_location = safeParseCoordinate(order.current_location);

        const formattedOrder: PurchaseOrder = {
          ...order,
          origin,
          destination_coords,
          current_location,
          status: order.status as OrderStatus // Explicitly cast the status to OrderStatus
        };
        
        const orderLocationUpdates = locationUpdates
          .filter((update: any) => update.purchase_order_id === order.id)
          .map((update: any) => ({
            ...update,
            location: safeParseCoordinate(update.location) || [0, 0]
          }));
          
        formattedOrder.location_updates = orderLocationUpdates;
        formattedOrder.journey_info = journeyInfo.filter((info: any) => 
          info.purchase_order_id === order.id
        );
        
        return formattedOrder;
      });
      
      dispatch({ type: 'SET_ORDERS', payload: formattedOrders });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Error loading orders:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load orders' });
      toast.error('Failed to load orders');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Handle in-transit orders simulation
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
        const remainingDistLat = endEnd - currentLat;
        
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
        const dbOrder: any = { 
          ...order,
          status: order.status as OrderStatus // Ensure status is treated as OrderStatus
        };
        
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
          
        if (error) {
          console.error('Supabase error when creating order:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('No data returned from insert operation');
        }
        
        const formattedOrder: PurchaseOrder = {
          ...data,
          origin: data.origin 
            ? safeParseCoordinate(data.origin)
            : undefined,
          destination_coords: data.destination_coords 
            ? safeParseCoordinate(data.destination_coords)
            : undefined,
          current_location: data.current_location 
            ? safeParseCoordinate(data.current_location)
            : undefined,
          location_updates: [],
          journey_info: [],
          status: data.status as OrderStatus // Explicitly cast the status
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
        
        const { error } = await supabase
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
        const { error: orderError } = await supabase
          .from('purchase_orders')
          .update({ 
            driver_id: driverId, 
            assigned_truck_id: truckId,
            status: 'active' as OrderStatus  // Explicitly cast as OrderStatus
          })
          .eq('id', id);
          
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
    startDelivery: async (id: string) => {
      try {
        const currentOrder = state.orders.find(o => o.id === id);
        if (!currentOrder) {
          throw new Error('Order not found');
        }
        
        // Define origin coordinates (depot location)
        // For this example, we're using coordinates for Lagos, Nigeria
        const originCoords: [number, number] = [3.3792, 6.5244];
        
        // Define destination coordinates (customer location)
        // This is just an example - in a real app, you'd get this from geocoding the destination address
        const destCoords: [number, number] = [3.9470, 7.3775]; // Some distance away
        
        // Start the delivery using our helper function
        await startDelivery(id, originCoords, destCoords);
        
        // Update the journey info
        await supabase
          .from("journey_info")
          .insert([{
            purchase_order_id: id,
            type: 'info',
            message: 'Truck has departed from depot',
            timestamp: new Date().toISOString()
          }]);
          
        // Add this to update the driver's status to 'on-duty'
        if (currentOrder.driver_id) {
          await supabase
            .from("drivers")
            .update({ status: 'on-duty' })
            .eq('id', currentOrder.driver_id);
        }
        
        // Add this to update the truck's status to 'in-transit'
        if (currentOrder.assigned_truck_id) {
          await supabase
            .from("trucks")
            .update({ status: 'in-transit' })
            .eq('id', currentOrder.assigned_truck_id);
        }
        
        await loadOrders(); // Reload orders to get the updated data
        toast.success('Delivery started successfully');
      } catch (error) {
        console.error('Error starting delivery:', error);
        toast.error('Failed to start delivery');
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

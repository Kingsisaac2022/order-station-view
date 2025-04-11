
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Driver } from '@/types/drivers';
import { Truck } from '@/types/trucks';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FleetState {
  drivers: Driver[];
  trucks: Truck[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  drivers: [],
  trucks: [],
  isLoading: true,
  error: null
};

type FleetAction = 
  | { type: 'SET_DRIVERS'; payload: Driver[] }
  | { type: 'SET_TRUCKS'; payload: Truck[] }
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: Driver }
  | { type: 'DELETE_DRIVER'; payload: string }
  | { type: 'ADD_TRUCK'; payload: Truck }
  | { type: 'UPDATE_TRUCK'; payload: Truck }
  | { type: 'UPDATE_TRUCK_LOCATION'; payload: { id: string; location: [number, number] } }
  | { type: 'DELETE_TRUCK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const fleetReducer = (state: FleetState, action: FleetAction): FleetState => {
  switch (action.type) {
    case 'SET_DRIVERS':
      return {
        ...state,
        drivers: action.payload
      };
    case 'SET_TRUCKS':
      return {
        ...state,
        trucks: action.payload
      };
    case 'ADD_DRIVER':
      return {
        ...state,
        drivers: [...state.drivers, action.payload]
      };
    case 'UPDATE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.map(driver => 
          driver.id === action.payload.id ? action.payload : driver
        )
      };
    case 'DELETE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.filter(driver => driver.id !== action.payload)
      };
    case 'ADD_TRUCK':
      return {
        ...state,
        trucks: [...state.trucks, action.payload]
      };
    case 'UPDATE_TRUCK':
      return {
        ...state,
        trucks: state.trucks.map(truck => 
          truck.id === action.payload.id ? action.payload : truck
        )
      };
    case 'UPDATE_TRUCK_LOCATION':
      return {
        ...state,
        trucks: state.trucks.map(truck => 
          truck.id === action.payload.id 
            ? { ...truck, current_location: action.payload.location } 
            : truck
        )
      };
    case 'DELETE_TRUCK':
      return {
        ...state,
        trucks: state.trucks.filter(truck => truck.id !== action.payload)
      };
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

interface FleetContextType {
  drivers: Driver[];
  trucks: Truck[];
  isLoading: boolean;
  error: string | null;
  loadFleetData: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  addTruck: (truck: Omit<Truck, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTruck: (id: string, truck: Partial<Truck>) => Promise<void>;
  updateTruckLocation: (id: string, location: [number, number]) => Promise<void>;
  deleteTruck: (id: string) => Promise<void>;
  getAvailableDrivers: () => Driver[];
  getAvailableTrucks: () => Truck[];
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(fleetReducer, initialState);

  // Notify on actions
  const notifyAction = (action: string, entityType: 'driver' | 'truck', success: boolean = true) => {
    if (success) {
      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${action} successfully`);
    } else {
      toast.error(`Failed to ${action} ${entityType}`);
    }
  };

  // Load data from Supabase
  const loadFleetData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Load drivers
      const { data: drivers, error: driversError } = await supabase
        .from('drivers')
        .select('*');

      if (driversError) throw driversError;
      
      // Load trucks
      const { data: trucks, error: trucksError } = await supabase
        .from('trucks')
        .select('*');

      if (trucksError) throw trucksError;
      
      // Convert point objects to arrays for locations
      const formattedTrucks = trucks.map(truck => ({
        ...truck,
        current_location: truck.current_location 
          ? [truck.current_location.x, truck.current_location.y] as [number, number] 
          : undefined
      }));

      dispatch({ type: 'SET_DRIVERS', payload: drivers });
      dispatch({ type: 'SET_TRUCKS', payload: formattedTrucks });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Error loading fleet data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load fleet data' });
      toast.error('Failed to load fleet data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Initial data load
  useEffect(() => {
    loadFleetData();
  }, []);

  // Context values
  const value = {
    drivers: state.drivers,
    trucks: state.trucks,
    isLoading: state.isLoading,
    error: state.error,
    loadFleetData,
    
    addDriver: async (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .insert([driver])
          .select()
          .single();
          
        if (error) throw error;
        
        dispatch({ type: 'ADD_DRIVER', payload: data });
        notifyAction('added', 'driver');
      } catch (error) {
        console.error('Error adding driver:', error);
        notifyAction('add', 'driver', false);
      }
    },
    
    updateDriver: async (id: string, driver: Partial<Driver>) => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .update(driver)
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        
        dispatch({ type: 'UPDATE_DRIVER', payload: data });
        notifyAction('updated', 'driver');
      } catch (error) {
        console.error('Error updating driver:', error);
        notifyAction('update', 'driver', false);
      }
    },
    
    deleteDriver: async (id: string) => {
      try {
        const { error } = await supabase
          .from('drivers')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        dispatch({ type: 'DELETE_DRIVER', payload: id });
        notifyAction('deleted', 'driver');
      } catch (error) {
        console.error('Error deleting driver:', error);
        notifyAction('delete', 'driver', false);
      }
    },
    
    addTruck: async (truck: Omit<Truck, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        // Convert location array to point if it exists
        const dbTruck = { ...truck };
        if (truck.current_location) {
          dbTruck.current_location = `(${truck.current_location[0]},${truck.current_location[1]})`;
        }
        
        const { data, error } = await supabase
          .from('trucks')
          .insert([dbTruck])
          .select()
          .single();
          
        if (error) throw error;
        
        // Convert point to array for frontend
        const formattedTruck = {
          ...data,
          current_location: data.current_location 
            ? [data.current_location.x, data.current_location.y] as [number, number]
            : undefined
        };
        
        dispatch({ type: 'ADD_TRUCK', payload: formattedTruck });
        notifyAction('added', 'truck');
      } catch (error) {
        console.error('Error adding truck:', error);
        notifyAction('add', 'truck', false);
      }
    },
    
    updateTruck: async (id: string, truck: Partial<Truck>) => {
      try {
        // Convert location array to point if it exists
        const dbTruck = { ...truck };
        if (truck.current_location) {
          dbTruck.current_location = `(${truck.current_location[0]},${truck.current_location[1]})`;
        }
        
        const { data, error } = await supabase
          .from('trucks')
          .update(dbTruck)
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        
        // Convert point to array for frontend
        const formattedTruck = {
          ...data,
          current_location: data.current_location 
            ? [data.current_location.x, data.current_location.y] as [number, number]
            : undefined
        };
        
        dispatch({ type: 'UPDATE_TRUCK', payload: formattedTruck });
        notifyAction('updated', 'truck');
      } catch (error) {
        console.error('Error updating truck:', error);
        notifyAction('update', 'truck', false);
      }
    },
    
    updateTruckLocation: async (id: string, location: [number, number]) => {
      try {
        // Convert location array to point
        const point = `(${location[0]},${location[1]})`;
        
        const { data, error } = await supabase
          .from('trucks')
          .update({ current_location: point })
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        
        dispatch({ type: 'UPDATE_TRUCK_LOCATION', payload: { id, location } });
      } catch (error) {
        console.error('Error updating truck location:', error);
      }
    },
    
    deleteTruck: async (id: string) => {
      try {
        const { error } = await supabase
          .from('trucks')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        dispatch({ type: 'DELETE_TRUCK', payload: id });
        notifyAction('deleted', 'truck');
      } catch (error) {
        console.error('Error deleting truck:', error);
        notifyAction('delete', 'truck', false);
      }
    },
    
    getAvailableDrivers: () => {
      return state.drivers.filter(driver => 
        driver.status === 'approved' && !driver.assigned_truck_id
      );
    },
    
    getAvailableTrucks: () => {
      return state.trucks.filter(truck => 
        truck.status === 'available' && !truck.assigned_driver_id
      );
    }
  };

  return (
    <FleetContext.Provider value={value}>
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (context === undefined) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};

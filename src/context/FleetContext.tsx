import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Driver } from '@/types/drivers';
import { Truck } from '@/types/trucks';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TABLES } from '@/integrations/supabase/schema';

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

  const notifyAction = (action: string, entityType: 'driver' | 'truck', success: boolean = true) => {
    if (success) {
      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${action} successfully`);
    } else {
      toast.error(`Failed to ${action} ${entityType}`);
    }
  };

  const loadFleetData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: driversData, error: driversError } = await supabase
        .from(TABLES.DRIVERS)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (driversError) throw driversError;
      
      const { data: trucksData, error: trucksError } = await supabase
        .from(TABLES.TRUCKS)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (trucksError) throw trucksError;
      
      dispatch({ type: 'SET_DRIVERS', payload: driversData as Driver[] });
      dispatch({ type: 'SET_TRUCKS', payload: trucksData as Truck[] });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Error loading fleet data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load fleet data' });
      toast.error('Failed to load fleet data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadFleetData();
  }, []);

  const value = {
    drivers: state.drivers,
    trucks: state.trucks,
    isLoading: state.isLoading,
    error: state.error,
    loadFleetData,
    
    addDriver: async (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from(TABLES.DRIVERS)
          .insert(driver)
          .select()
          .single();
          
        if (error) throw error;
        
        dispatch({ type: 'ADD_DRIVER', payload: data as Driver });
        notifyAction('added', 'driver');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error adding driver:', error);
        notifyAction('add', 'driver', false);
        return Promise.reject(error);
      }
    },
    
    updateDriver: async (id: string, driver: Partial<Driver>) => {
      try {
        const { data, error } = await supabase
          .from(TABLES.DRIVERS)
          .update({ ...driver, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        dispatch({ type: 'UPDATE_DRIVER', payload: data as Driver });
        notifyAction('updated', 'driver');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating driver:', error);
        notifyAction('update', 'driver', false);
        return Promise.reject(error);
      }
    },
    
    deleteDriver: async (id: string) => {
      try {
        const { error } = await supabase
          .from(TABLES.DRIVERS)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        dispatch({ type: 'DELETE_DRIVER', payload: id });
        notifyAction('deleted', 'driver');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error deleting driver:', error);
        notifyAction('delete', 'driver', false);
        return Promise.reject(error);
      }
    },
    
    addTruck: async (truck: Omit<Truck, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from(TABLES.TRUCKS)
          .insert(truck)
          .select()
          .single();
        
        if (error) throw error;
        
        dispatch({ type: 'ADD_TRUCK', payload: data as Truck });
        notifyAction('added', 'truck');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error adding truck:', error);
        notifyAction('add', 'truck', false);
        return Promise.reject(error);
      }
    },
    
    updateTruck: async (id: string, truck: Partial<Truck>) => {
      try {
        const { data, error } = await supabase
          .from(TABLES.TRUCKS)
          .update({ ...truck, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        dispatch({ type: 'UPDATE_TRUCK', payload: data as Truck });
        notifyAction('updated', 'truck');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating truck:', error);
        notifyAction('update', 'truck', false);
        return Promise.reject(error);
      }
    },
    
    updateTruckLocation: async (id: string, location: [number, number]) => {
      try {
        const { data, error } = await supabase
          .from(TABLES.TRUCKS)
          .update({
            current_location: `(${location[0]},${location[1]})`,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        dispatch({ type: 'UPDATE_TRUCK_LOCATION', payload: { id, location } });
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating truck location:', error);
        return Promise.reject(error);
      }
    },
    
    deleteTruck: async (id: string) => {
      try {
        const { error } = await supabase
          .from(TABLES.TRUCKS)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        dispatch({ type: 'DELETE_TRUCK', payload: id });
        notifyAction('deleted', 'truck');
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error deleting truck:', error);
        notifyAction('delete', 'truck', false);
        return Promise.reject(error);
      }
    },
    
    getAvailableDrivers: () => {
      return state.drivers.filter(driver => 
        (driver.status === 'approved' || driver.status === 'available') && !driver.assigned_truck_id
      );
    },
    
    getAvailableTrucks: () => {
      return state.trucks.filter(truck => 
        truck.status === 'available' && truck.gps_enabled && !truck.assigned_driver_id
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

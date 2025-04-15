
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
      // Tables need to be created in Supabase first
      // We're simulating the database interaction for now
      
      // Mock data
      const mockDrivers: Driver[] = [
        {
          id: 'driver-1',
          name: 'John Doe',
          license_no: 'DL12345',
          phone_number: '+2349012345678',
          email: 'john@example.com',
          status: 'available',
          created_at: '2023-04-01',
          updated_at: '2023-04-01'
        },
        {
          id: 'driver-2',
          name: 'Jane Smith',
          license_no: 'DL67890',
          phone_number: '+2349087654321',
          email: 'jane@example.com',
          status: 'on-duty',
          assigned_truck_id: 'truck-1',
          created_at: '2023-04-02',
          updated_at: '2023-04-02'
        }
      ];
      
      const mockTrucks: Truck[] = [
        {
          id: 'truck-1',
          plate_no: 'ABC-123-XYZ',
          model: 'Volvo FH16',
          capacity: '33,000 litres',
          fuel_capacity: '200 litres',
          assigned_driver_id: 'driver-2',
          status: 'in-use',
          gps_enabled: true,
          gps_id: 'GPS-123456',
          current_location: [3.3792, 6.5244], // Lagos coordinates
          fuel_level: 85,
          created_at: '2023-04-01',
          updated_at: '2023-04-01'
        },
        {
          id: 'truck-2',
          plate_no: 'DEF-456-UVW',
          model: 'Mercedes-Benz Actros',
          capacity: '40,000 litres',
          fuel_capacity: '250 litres',
          status: 'available',
          gps_enabled: true,
          gps_id: 'GPS-654321',
          current_location: [7.3986, 9.0765], // Abuja coordinates
          fuel_level: 95,
          created_at: '2023-04-02',
          updated_at: '2023-04-02'
        }
      ];

      dispatch({ type: 'SET_DRIVERS', payload: mockDrivers });
      dispatch({ type: 'SET_TRUCKS', payload: mockTrucks });
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
        // Simulate API call
        const newDriver: Driver = {
          id: `driver-${Date.now()}`,
          ...driver,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_DRIVER', payload: newDriver });
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
        // Find existing driver
        const existingDriver = state.drivers.find(d => d.id === id);
        if (!existingDriver) {
          throw new Error('Driver not found');
        }
        
        // Update driver
        const updatedDriver: Driver = {
          ...existingDriver,
          ...driver,
          updated_at: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_DRIVER', payload: updatedDriver });
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
        // Delete driver
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
        // Simulate API call
        const newTruck: Truck = {
          id: `truck-${Date.now()}`,
          ...truck,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_TRUCK', payload: newTruck });
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
        // Find existing truck
        const existingTruck = state.trucks.find(t => t.id === id);
        if (!existingTruck) {
          throw new Error('Truck not found');
        }
        
        // Update truck
        const updatedTruck: Truck = {
          ...existingTruck,
          ...truck,
          updated_at: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_TRUCK', payload: updatedTruck });
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
        // Find existing truck
        const existingTruck = state.trucks.find(t => t.id === id);
        if (!existingTruck) {
          throw new Error('Truck not found');
        }
        
        // Update location
        dispatch({ type: 'UPDATE_TRUCK_LOCATION', payload: { id, location } });
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating truck location:', error);
        return Promise.reject(error);
      }
    },
    
    deleteTruck: async (id: string) => {
      try {
        // Delete truck
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

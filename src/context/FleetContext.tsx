
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Driver } from '@/types/drivers';
import { Truck } from '@/types/trucks';
import { toast } from 'sonner';

interface FleetState {
  drivers: Driver[];
  trucks: Truck[];
}

const initialState: FleetState = {
  drivers: [],
  trucks: []
};

type FleetAction = 
  | { type: 'ADD_DRIVER'; payload: Driver }
  | { type: 'UPDATE_DRIVER'; payload: Driver }
  | { type: 'DELETE_DRIVER'; payload: string }
  | { type: 'ADD_TRUCK'; payload: Truck }
  | { type: 'UPDATE_TRUCK'; payload: Truck }
  | { type: 'UPDATE_TRUCK_LOCATION'; payload: { id: string; location: [number, number] } }
  | { type: 'DELETE_TRUCK'; payload: string };

const fleetReducer = (state: FleetState, action: FleetAction): FleetState => {
  switch (action.type) {
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
            ? { ...truck, currentLocation: action.payload.location } 
            : truck
        )
      };
    case 'DELETE_TRUCK':
      return {
        ...state,
        trucks: state.trucks.filter(truck => truck.id !== action.payload)
      };
    default:
      return state;
  }
};

interface FleetContextType {
  drivers: Driver[];
  trucks: Truck[];
  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (id: string) => void;
  addTruck: (truck: Truck) => void;
  updateTruck: (truck: Truck) => void;
  updateTruckLocation: (id: string, location: [number, number]) => void;
  deleteTruck: (id: string) => void;
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

  // Context values
  const value = {
    drivers: state.drivers,
    trucks: state.trucks,
    addDriver: (driver: Driver) => {
      dispatch({ type: 'ADD_DRIVER', payload: driver });
      notifyAction('added', 'driver');
    },
    updateDriver: (driver: Driver) => {
      dispatch({ type: 'UPDATE_DRIVER', payload: driver });
      notifyAction('updated', 'driver');
    },
    deleteDriver: (id: string) => {
      dispatch({ type: 'DELETE_DRIVER', payload: id });
      notifyAction('deleted', 'driver');
    },
    addTruck: (truck: Truck) => {
      dispatch({ type: 'ADD_TRUCK', payload: truck });
      notifyAction('added', 'truck');
    },
    updateTruck: (truck: Truck) => {
      dispatch({ type: 'UPDATE_TRUCK', payload: truck });
      notifyAction('updated', 'truck');
    },
    updateTruckLocation: (id: string, location: [number, number]) => {
      dispatch({ type: 'UPDATE_TRUCK_LOCATION', payload: { id, location } });
    },
    deleteTruck: (id: string) => {
      dispatch({ type: 'DELETE_TRUCK', payload: id });
      notifyAction('deleted', 'truck');
    },
    getAvailableDrivers: () => {
      return state.drivers.filter(driver => 
        driver.status === 'approved' && !driver.assignedTruckId
      );
    },
    getAvailableTrucks: () => {
      return state.trucks.filter(truck => 
        truck.status === 'available' && !truck.assignedDriverId
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

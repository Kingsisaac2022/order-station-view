
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { MapPin, Truck, Route, AlertCircle } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const GPSTracking: React.FC = () => {
  const { orders } = useOrders();
  const { trucks } = useFleet();
  
  // Filter orders that are in transit
  const inTransitOrders = orders.filter(order => order.status === 'in-transit');
  
  // Get GPS-enabled trucks
  const gpsEnabledTrucks = trucks.filter(truck => truck.gpsEnabled);
  
  // Trucks that are assigned to orders in transit
  const assignedTrucks = inTransitOrders
    .map(order => ({
      orderId: order.id,
      poNumber: order.poNumber,
      truckId: order.assignedTruckId,
      origin: order.origin,
      destination: order.destinationCoords,
      currentLocation: order.currentLocation
    }))
    .filter(item => item.truckId)
    .map(item => {
      const truck = trucks.find(t => t.id === item.truckId);
      return {
        ...item,
        plateNo: truck?.plateNo || 'Unknown',
        model: truck?.model || 'Unknown',
      };
    });
  
  // Unassigned GPS trucks (available for tracking but not on any order)
  const unassignedGpsTrucks = gpsEnabledTrucks.filter(
    truck => !assignedTrucks.some(assigned => assigned.truckId === truck.id)
  );
  
  const handleViewOrder = (id: string) => {
    window.location.href = `/order/${id}`;
  };
  
  return (
    <DashboardPanel title="GPS Tracking" icon={<MapPin size={16} />}>
      <div className="space-y-4">
        <div className="h-64 bg-dark-lighter rounded-md border border-border/20 flex flex-col items-center justify-center p-4">
          {(assignedTrucks.length > 0 || unassignedGpsTrucks.length > 0) ? (
            <div className="relative w-full h-full">
              {/* Map placeholder - in a real app this would be an actual map */}
              <div className="absolute inset-0 bg-[#1A2033] rounded-md overflow-hidden">
                {/* Map visualization would go here */}
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <Route size={32} className="mb-2 text-yellow-400" />
                  <p className="text-sm text-muted-foreground">
                    Map visualization showing {assignedTrucks.length} active delivery truck{assignedTrucks.length !== 1 ? 's' : ''} and {unassignedGpsTrucks.length} idle truck{unassignedGpsTrucks.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* For each assigned truck, show a truck icon */}
                {assignedTrucks.map((truck, index) => (
                  <div 
                    key={truck.truckId}
                    className="absolute flex flex-col items-center animate-pulse cursor-pointer"
                    style={{ 
                      left: `${30 + (index * 15)}%`, 
                      top: `${40 + (index * 10)}%`
                    }}
                    onClick={() => handleViewOrder(truck.orderId)}
                  >
                    <div className="bg-yellow-500 rounded-full p-2">
                      <Truck size={16} className="text-black" />
                    </div>
                    <div className="mt-1 px-2 py-1 bg-dark rounded text-xs">
                      {truck.poNumber.split('/').pop()} - {truck.plateNo}
                    </div>
                  </div>
                ))}
                
                {/* For each unassigned truck, show a stationary icon */}
                {unassignedGpsTrucks.map((truck, index) => (
                  <div 
                    key={truck.id}
                    className="absolute flex flex-col items-center"
                    style={{ 
                      left: `${10 + (index * 10)}%`, 
                      top: `${70}%`
                    }}
                  >
                    <div className="bg-gray-500 rounded-full p-2">
                      <Truck size={16} className="text-white" />
                    </div>
                    <div className="mt-1 px-2 py-1 bg-dark rounded text-xs">
                      {truck.plateNo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              <MapPin size={24} className="mx-auto mb-2" />
              <div className="text-sm">Map view placeholder</div>
              <div className="text-xs mt-2">No GPS-enabled trucks found</div>
              <Button 
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                size="sm"
                onClick={() => window.location.href = '#trucks'} // This would ideally navigate to the trucks tab
              >
                Add GPS Trucks
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-medium flex items-center">
              <Truck size={14} className="mr-1" /> Active Delivery Trucks
            </div>
            {assignedTrucks.length > 0 ? (
              <div className="space-y-2">
                {assignedTrucks.map(truck => (
                  <div key={truck.truckId} className="border border-yellow-500/20 bg-yellow-500/5 rounded-md p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{truck.plateNo}</div>
                      <div className="text-xs text-muted-foreground">
                        Order: {truck.poNumber}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewOrder(truck.orderId)}
                      className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                    >
                      Track
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-border/20 rounded-md p-3 text-sm text-muted-foreground">
                No active delivery trucks
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-medium flex items-center">
              <Truck size={14} className="mr-1" /> Available GPS Trucks
            </div>
            {unassignedGpsTrucks.length > 0 ? (
              <div className="space-y-2">
                {unassignedGpsTrucks.map(truck => (
                  <div key={truck.id} className="border border-border/20 rounded-md p-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{truck.plateNo}</div>
                      <div className="text-xs text-muted-foreground">
                        {truck.model} - {truck.capacity}
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                      Available
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-border/20 rounded-md p-3 text-sm text-muted-foreground flex items-center">
                <AlertCircle size={16} className="mr-2 text-yellow-500" />
                No available GPS-enabled trucks
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default GPSTracking;

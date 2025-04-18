
import React, { useState } from 'react';
import DashboardPanel from '../DashboardPanel';
import { MapPin, Route, Truck } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import LinearTrackingView from '../tracking/LinearTrackingView';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

const GPSTracking: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { trucks } = useFleet();
  const [activeTab, setActiveTab] = useState("linear");
  
  // Filter orders that are in transit
  const inTransitOrders = orders.filter(order => order.status === 'in-transit');
  
  // Get GPS-enabled trucks
  const gpsEnabledTrucks = trucks.filter(truck => truck.gps_enabled);
  
  // Get unassigned GPS trucks (GPS-enabled but not on delivery)
  const unassignedGpsTrucks = gpsEnabledTrucks.filter(
    truck => !inTransitOrders.some(order => order.assigned_truck_id === truck.id)
  );
  
  // Trucks that are assigned to orders in transit with progress calculation
  const assignedTrucks = inTransitOrders
    .map(order => {
      const truck = trucks.find(t => t.id === order.assigned_truck_id);
      if (!truck) return null;

      // Calculate progress
      let progress = 0;
      if (order.origin && order.destination_coords && order.current_location) {
        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destination_coords;
        const [currentLng, currentLat] = order.current_location;
        
        const totalDistLng = endLng - startLng;
        const totalDistLat = endLat - startLat;
        const totalDist = Math.sqrt(totalDistLng * totalDistLng + totalDistLat * totalDistLat);
        
        const progressLng = currentLng - startLng;
        const progressLat = currentLat - startLat;
        const progressDist = Math.sqrt(progressLng * progressLng + progressLat * progressLat);
        
        progress = (progressDist / totalDist) * 100;
        progress = Math.max(0, Math.min(100, progress));
      }

      return {
        id: truck.id,
        orderId: order.id,
        plateNo: truck.plate_no,
        model: truck.model,
        progress,
        journeyInfo: order.journey_info || []
      };
    })
    .filter((truck): truck is NonNullable<typeof truck> => truck !== null);
    
  // Handle view order function
  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <DashboardPanel title="GPS Tracking" icon={<MapPin size={16} />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Active Deliveries: {assignedTrucks.length}</h3>
            <p className="text-sm text-muted-foreground">
              {assignedTrucks.length ? 'Real-time tracking of deliveries in progress' : 'No trucks currently on delivery'}
            </p>
          </div>
          
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            {gpsEnabledTrucks.length} GPS Trucks Available
          </Badge>
        </div>
      
        <Tabs defaultValue="linear" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="linear">Linear View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="linear" className="animate-fade-in">
            <div className="border border-border/20 rounded-md p-4 bg-dark-lighter">
              {assignedTrucks.length > 0 ? (
                <LinearTrackingView trucks={assignedTrucks} />
              ) : (
                <div className="text-center py-8">
                  <Route size={32} className="mx-auto mb-2 text-yellow-400" />
                  <p className="text-muted-foreground">No trucks currently on delivery</p>
                  {gpsEnabledTrucks.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {gpsEnabledTrucks.length} GPS-enabled truck{gpsEnabledTrucks.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="animate-fade-in">
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
                        key={truck.id}
                        className="absolute flex flex-col items-center cursor-pointer"
                        style={{ 
                          left: `${30 + (index * 15)}%`, 
                          top: `${40 + (index * 10)}%`
                        }}
                        onClick={() => handleViewOrder(truck.orderId)}
                      >
                        <div className="bg-yellow-500 rounded-full p-2 animate-pulse">
                          <Truck size={16} className="text-black" />
                        </div>
                        <div className="mt-1 px-2 py-1 bg-dark rounded text-xs">
                          {truck.orderId.split('/').pop()} - {truck.plateNo}
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
                          {truck.plate_no}
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
                    onClick={() => navigate('/trucks')}
                  >
                    Add GPS Trucks
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* View all trucks button */}
        {assignedTrucks.length > 0 && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/trucks')}
              className="text-xs"
            >
              View All Trucks
            </Button>
          </div>
        )}
      </div>
    </DashboardPanel>
  );
};

export default GPSTracking;

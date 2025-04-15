
import React, { useState } from 'react';
import DashboardPanel from '../DashboardPanel';
import { MapPin, Truck, Route, AlertCircle, Clock, CloudRain, Info } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const GPSTracking: React.FC = () => {
  const { orders } = useOrders();
  const { trucks } = useFleet();
  const [activeTab, setActiveTab] = useState("map");
  
  // Filter orders that are in transit
  const inTransitOrders = orders.filter(order => order.status === 'in-transit');
  
  // Get GPS-enabled trucks
  const gpsEnabledTrucks = trucks.filter(truck => truck.gps_enabled);
  
  // Trucks that are assigned to orders in transit
  const assignedTrucks = inTransitOrders
    .map(order => ({
      orderId: order.id,
      poNumber: order.po_number,
      truckId: order.assigned_truck_id,
      origin: order.origin,
      destination: order.destination_coords,
      currentLocation: order.current_location,
      journeyInfo: order.journey_info || [],
      locationUpdates: order.location_updates || []
    }))
    .filter(item => item.truckId)
    .map(item => {
      const truck = trucks.find(t => t.id === item.truckId);
      return {
        ...item,
        plateNo: truck?.plate_no || 'Unknown',
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
  
  const getJourneyInfoIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <Truck size={16} className="mr-2 text-orange-500" />;
      case 'weather':
        return <CloudRain size={16} className="mr-2 text-blue-500" />;
      case 'stop':
        return <Clock size={16} className="mr-2 text-red-500" />;
      case 'assignment':
        return <Truck size={16} className="mr-2 text-green-500" />;
      case 'completed':
        return <Truck size={16} className="mr-2 text-green-500" />;
      case 'flagged':
        return <AlertCircle size={16} className="mr-2 text-red-500" />;
      default:
        return <Info size={16} className="mr-2 text-yellow-500" />;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Calculate progress along route for a truck
  const calculateProgress = (order: any) => {
    if (!order.origin || !order.destination || !order.currentLocation) return 0;
    
    const [startLng, startLat] = order.origin;
    const [endLng, endLat] = order.destination;
    const [currentLng, currentLat] = order.currentLocation;
    
    // Calculate total distance of route
    const totalDistLng = endLng - startLng;
    const totalDistLat = endLat - startLat;
    const totalDist = Math.sqrt(totalDistLng * totalDistLng + totalDistLat * totalDistLat);
    
    // Calculate current progress
    const progressLng = currentLng - startLng;
    const progressLat = currentLat - startLat;
    const progressDist = Math.sqrt(progressLng * progressLng + progressLat * progressLat);
    
    // Calculate ratio
    let progress = progressDist / totalDist;
    
    // Ensure the value is between 0 and 1
    progress = Math.max(0, Math.min(1, progress));
    
    return progress * 100; // Return as percentage
  };
  
  return (
    <DashboardPanel title="GPS Tracking" icon={<MapPin size={16} />}>
      <div className="space-y-4">
        <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map">
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
                    onClick={() => window.location.href = '#trucks'} // This would ideally navigate to the trucks tab
                  >
                    Add GPS Trucks
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="grid gap-4">
              {assignedTrucks.length > 0 ? (
                assignedTrucks.map(truck => (
                  <div 
                    key={truck.truckId}
                    className="border border-border/20 rounded-md overflow-hidden bg-dark-lighter"
                  >
                    <div className="p-4 border-b border-border/20 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium flex items-center">
                          <Truck size={16} className="mr-2" />
                          {truck.plateNo} - {truck.model}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          Order: {truck.poNumber}
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewOrder(truck.orderId)}
                        className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                      >
                        View Details
                      </Button>
                    </div>
                    
                    {/* Journey tracker */}
                    <div className="p-4">
                      <div className="mb-2 text-sm font-medium">Journey Progress</div>
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-yellow-500 h-full rounded-full" 
                          style={{ width: `${calculateProgress(truck)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Departure</span>
                        <span>Arrival</span>
                      </div>
                    </div>
                    
                    {/* Journey updates */}
                    <div className="px-4 pb-4">
                      <div className="mb-2 text-sm font-medium">Journey Updates</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {truck.journeyInfo && truck.journeyInfo.length > 0 ? (
                          [...truck.journeyInfo]
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .slice(0, 5)
                            .map((info, idx) => (
                              <div key={idx} className="flex text-sm py-1 border-b border-border/10 last:border-0">
                                {getJourneyInfoIcon(info.type)}
                                <div className="flex-1">
                                  <div className="text-xs">{info.message}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(info.timestamp)} - {formatDate(info.timestamp)}
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-sm text-muted-foreground py-2">
                            No journey updates available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-border/20 rounded-md p-4 text-center">
                  <AlertCircle size={24} className="mx-auto mb-2 text-yellow-500" />
                  <p className="text-muted-foreground">No trucks currently on delivery</p>
                </div>
              )}
              
              {unassignedGpsTrucks.length > 0 && (
                <div className="border border-border/20 rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-2">Available GPS-Enabled Trucks</h3>
                  <div className="space-y-2">
                    {unassignedGpsTrucks.map(truck => (
                      <div key={truck.id} className="flex justify-between items-center border-b border-border/10 last:border-0 py-2">
                        <div className="flex items-center">
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/50 mr-2">
                            Available
                          </Badge>
                          {truck.plate_no} - {truck.model}
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                          GPS-enabled
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPanel>
  );
};

export default GPSTracking;

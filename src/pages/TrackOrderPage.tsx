
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Truck, Route, MapPin, Clock, CloudRain, AlertCircle, Info } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const TrackOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, setActiveOrder } = useOrders();
  const { trucks, drivers } = useFleet();
  const [progress, setProgress] = useState(0);
  
  // Find the current order
  const order = orders.find(o => o.id === id);
  
  // Get assigned driver and truck details
  const assignedDriver = order?.driverId ? drivers.find(d => d.id === order.driverId) : undefined;
  const assignedTruck = order?.assignedTruckId ? trucks.find(t => t.id === order.assignedTruckId) : undefined;
  
  // Set active order and calculate progress
  useEffect(() => {
    if (order) {
      setActiveOrder(order);
      
      if (order.status === 'in-transit' && order.origin && order.destinationCoords && order.currentLocation) {
        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destinationCoords;
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
        const calculatedProgress = progressDist / totalDist;
        
        // Ensure the value is between 0 and 1
        setProgress(Math.max(0, Math.min(1, calculatedProgress)) * 100);
      }
    }
    
    // Cleanup when leaving the page
    return () => {
      setActiveOrder(null);
    };
  }, [order, setActiveOrder]);
  
  // Navigate back if order not found or not in transit
  if (!order) {
    useEffect(() => {
      toast.error('Order not found');
      navigate('/');
    }, [navigate]);
    return null;
  }
  
  if (order.status !== 'in-transit') {
    useEffect(() => {
      toast.warning('This order is not currently in transit');
      navigate(`/order/${id}`);
    }, [navigate, id]);
    return null;
  }
  
  // Format journey info
  const getJourneyInfoIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <Truck size={18} className="mr-2 text-orange-500" />;
      case 'weather':
        return <CloudRain size={18} className="mr-2 text-blue-500" />;
      case 'stop':
        return <Clock size={18} className="mr-2 text-red-500" />;
      default:
        return <Info size={18} className="mr-2 text-yellow-500" />;
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
  
  // Estimate arrival time
  const estimateArrivalTime = () => {
    if (!order.origin || !order.destinationCoords || !order.currentLocation) {
      return 'Unknown';
    }
    
    // Use progress to calculate estimated time
    const remainingPercentage = 100 - progress;
    
    // Assume average speed and estimate remaining time
    // For this example, let's say it takes about 2 hours for a full journey
    const totalJourneyMinutes = 120;
    const remainingMinutes = (remainingPercentage / 100) * totalJourneyMinutes;
    
    // Create estimated arrival time
    const now = new Date();
    now.setMinutes(now.getMinutes() + remainingMinutes);
    
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="min-h-screen bg-dark text-foreground py-10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/order/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Track Order: {order.poNumber}</h1>
              <div className="flex items-center mt-1">
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
                  In Transit
                </Badge>
              </div>
            </div>
          </div>
          
          <Link to="/">
            <Button variant="outline">
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Map and route visualization */}
            <Card className="bg-dark-lighter border-border/20 overflow-hidden">
              <div className="p-4 bg-[#1A2033] h-[300px] relative">
                {/* This would be a real map in production */}
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <Route size={48} className="mb-2 text-yellow-400" />
                  <p className="text-sm text-muted-foreground">
                    Live map tracking would be displayed here
                  </p>
                </div>
                
                {/* Truck icon showing current position */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-yellow-500 rounded-full p-2 animate-pulse">
                    <Truck size={24} className="text-black" />
                  </div>
                </div>
                
                {/* Origin marker */}
                <div className="absolute left-[20%] bottom-[30%] flex flex-col items-center">
                  <MapPin size={20} className="text-green-500" />
                  <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
                    Origin
                  </div>
                </div>
                
                {/* Destination marker */}
                <div className="absolute right-[20%] bottom-[30%] flex flex-col items-center">
                  <MapPin size={20} className="text-red-500" />
                  <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
                    Destination
                  </div>
                </div>
                
                {/* Route line */}
                <div className="absolute left-[20%] right-[20%] bottom-[30%] h-[3px] bg-gradient-to-r from-green-500 to-red-500"></div>
              </div>
              
              {/* Progress bar */}
              <div className="p-4 border-t border-border/20">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Journey Progress</div>
                  <div className="text-sm">{progress.toFixed(0)}%</div>
                </div>
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <div>
                    <span className="text-green-500 mr-1">●</span>
                    {order.loadingLocation}
                  </div>
                  <div>
                    <span className="text-red-500 mr-1">●</span>
                    {order.destination}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Journey info */}
            <Card className="bg-dark-lighter border-border/20">
              <div className="p-4 border-b border-border/20">
                <h2 className="text-lg font-medium">Journey Details</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Estimated Time to Destination</div>
                      <div className="text-lg font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        {estimateArrivalTime()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Current Speed</div>
                      <div className="text-lg font-medium">~45-60 km/h</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Distance Covered</div>
                      <div className="text-lg font-medium">{progress.toFixed(0)}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-lg font-medium flex items-center">
                        <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
                          In Transit
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Route Information</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure</span>
                        <span>{order.loadingLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination</span>
                        <span>{order.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Loading Date</span>
                        <span>{order.expectedLoadingDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Journey updates feed */}
            <Card className="bg-dark-lighter border-border/20">
              <div className="p-4 border-b border-border/20">
                <h2 className="text-lg font-medium">Journey Updates</h2>
              </div>
              <div className="p-4">
                {order.journeyInfo && order.journeyInfo.length > 0 ? (
                  <div className="space-y-4">
                    {[...order.journeyInfo]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((info, idx) => (
                        <div 
                          key={idx}
                          className="flex border-b border-border/10 last:border-0 pb-3 last:pb-0"
                        >
                          <div className="mr-3 mt-1">{getJourneyInfoIcon(info.type)}</div>
                          <div className="flex-1">
                            <div className="font-medium">{info.message}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(info.timestamp)} - {formatDate(info.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info size={24} className="mx-auto mb-2" />
                    <p>No journey updates available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Driver & truck info */}
            <Card className="bg-dark-lighter border-border/20">
              <div className="p-4 border-b border-border/20">
                <h2 className="text-lg font-medium">Transport Details</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {assignedDriver && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Driver</div>
                      <div className="font-medium">{assignedDriver.name}</div>
                      <div className="text-sm">License: {assignedDriver.licenseNo}</div>
                      <div className="text-sm">Contact: {assignedDriver.phoneNumber}</div>
                    </div>
                  )}
                  
                  {assignedTruck && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Vehicle</div>
                        <div className="font-medium flex items-center">
                          <Truck size={16} className="mr-2" />
                          {assignedTruck.plateNo}
                        </div>
                        <div className="text-sm">Model: {assignedTruck.model}</div>
                        <div className="text-sm">Capacity: {assignedTruck.capacity}</div>
                        <div className="text-sm flex items-center mt-1">
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/50 mr-2">
                            GPS Enabled
                          </Badge>
                          ID: {assignedTruck.gpsId}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Product details */}
            <Card className="bg-dark-lighter border-border/20">
              <div className="p-4 border-b border-border/20">
                <h2 className="text-lg font-medium">Delivery Details</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Product Type</div>
                    <div className="font-medium">{order.productType}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium">{order.quantity} litres</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Quick Actions</div>
                    <div className="grid gap-2">
                      <Button 
                        onClick={() => navigate(`/order/${id}`)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black flex items-center"
                      >
                        <Truck size={16} className="mr-2" />
                        View Order Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;

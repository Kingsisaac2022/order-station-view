
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { toast } from 'sonner';
import TrackingMap from '@/components/tracking/TrackingMap';
import ProgressBar from '@/components/tracking/ProgressBar';
import JourneyDetails from '@/components/tracking/JourneyDetails';
import JourneyUpdates from '@/components/tracking/JourneyUpdates';
import TransportDetails from '@/components/tracking/TransportDetails';
import DeliveryDetails from '@/components/tracking/DeliveryDetails';
import { CloudRain, Truck, Clock, Info } from 'lucide-react';

const TrackOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, setActiveOrder } = useOrders();
  const { trucks, drivers } = useFleet();
  const [progress, setProgress] = useState(0);
  
  // Find the current order
  const order = orders.find(o => o.id === id);
  
  // Get assigned driver and truck details
  const assignedDriver = order?.driver_id ? drivers.find(d => d.id === order.driver_id) : undefined;
  const assignedTruck = order?.assigned_truck_id ? trucks.find(t => t.id === order.assigned_truck_id) : undefined;
  
  // Set active order and calculate progress
  useEffect(() => {
    if (order) {
      setActiveOrder(order);
      
      if (order.status === 'in-transit' && order.origin && order.destination_coords && order.current_location) {
        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destination_coords;
        const [currentLng, currentLat] = order.current_location;
        
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
    if (!order.origin || !order.destination_coords || !order.current_location) {
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
              <h1 className="text-2xl font-bold">Track Order: {order.po_number}</h1>
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
            <TrackingMap order={order} />
            
            <div className="bg-dark-lighter border-border/20">
              <ProgressBar 
                progress={progress}
                origin={order.loading_location}
                destination={order.destination}
              />
            </div>
            
            <JourneyDetails
              estimatedArrival={estimateArrivalTime()}
              progress={progress}
              loadingLocation={order.loading_location}
              destination={order.destination}
              expectedLoadingDate={order.expected_loading_date}
            />
            
            <JourneyUpdates
              journeyInfo={order.journey_info || []}
              getJourneyInfoIcon={getJourneyInfoIcon}
              formatTime={formatTime}
              formatDate={formatDate}
            />
          </div>
          
          <div className="space-y-6">
            <TransportDetails
              driver={assignedDriver}
              truck={assignedTruck}
            />
            
            <DeliveryDetails
              id={order.id}
              productType={order.product_type}
              quantity={order.quantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;

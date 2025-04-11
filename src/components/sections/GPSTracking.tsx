
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { MapPin, Truck, Route } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Button } from '../ui/button';

const GPSTracking: React.FC = () => {
  const { orders } = useOrders();
  
  // Filter orders that are in transit
  const inTransitOrders = orders.filter(order => order.status === 'in-transit');
  
  const handleViewOrder = (id: string) => {
    window.location.href = `/order/${id}`;
  };
  
  return (
    <DashboardPanel title="GPS Tracking" icon={<MapPin size={16} />}>
      <div className="space-y-4">
        <div className="h-64 bg-dark-lighter rounded-md border border-border/20 flex flex-col items-center justify-center p-4">
          {inTransitOrders.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Map placeholder - in a real app this would be an actual map */}
              <div className="absolute inset-0 bg-[#1A2033] rounded-md overflow-hidden">
                {/* Map visualization would go here */}
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <Route size={32} className="mb-2 text-blue-400" />
                  <p className="text-sm text-muted-foreground">
                    Map visualization showing {inTransitOrders.length} truck{inTransitOrders.length > 1 ? 's' : ''} in transit
                  </p>
                </div>
                
                {/* For each in-transit order, show a truck icon */}
                {inTransitOrders.map((order, index) => (
                  <div 
                    key={order.id}
                    className="absolute flex flex-col items-center animate-pulse"
                    style={{ 
                      left: `${30 + (index * 15)}%`, 
                      top: `${40 + (index * 10)}%`
                    }}
                  >
                    <div className="bg-blue-500 rounded-full p-2">
                      <Truck size={16} className="text-white" />
                    </div>
                    <div className="mt-1 px-2 py-1 bg-dark rounded text-xs">
                      {order.poNumber.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              <MapPin size={24} className="mx-auto mb-2" />
              <div className="text-sm">Map view placeholder</div>
              <div className="text-xs mt-2">GPS tracking data will be displayed here</div>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium">Active Trucks</div>
          {inTransitOrders.length > 0 ? (
            <div className="space-y-2">
              {inTransitOrders.map(order => (
                <div key={order.id} className="border border-border/20 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{order.poNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.loadingLocation} → {order.destination}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border/20 rounded-md p-3 text-sm text-muted-foreground">
              No active trucks to track
            </div>
          )}
        </div>
      </div>
    </DashboardPanel>
  );
};

export default GPSTracking;

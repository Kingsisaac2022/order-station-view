
import React from 'react';
import { Route, Truck, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TrackingMapProps {
  order: {
    origin?: [number, number];
    destination_coords?: [number, number];
    current_location?: [number, number];
  };
}

const TrackingMap: React.FC<TrackingMapProps> = ({ order }) => {
  // Calculate the percentage of journey completed
  const calculateProgress = (): number => {
    if (!order.origin || !order.destination_coords || !order.current_location) {
      return 0;
    }
    
    const [startLng, startLat] = order.origin;
    const [endLng, endLat] = order.destination_coords;
    const [currentLng, currentLat] = order.current_location;
    
    // Calculate total distance of route (simple straight line)
    const totalDistLng = endLng - startLng;
    const totalDistLat = endLat - startLat;
    const totalDist = Math.sqrt(totalDistLng * totalDistLng + totalDistLat * totalDistLat);
    
    // Calculate current progress
    const progressLng = currentLng - startLng;
    const progressLat = currentLat - startLat;
    const progressDist = Math.sqrt(progressLng * progressLng + progressLat * progressLat);
    
    // Calculate ratio and ensure it's between 0 and 1
    const progress = progressDist / totalDist;
    return Math.max(0, Math.min(1, progress));
  };

  const progress = calculateProgress();
  
  // Calculate current truck position along the line
  const getTruckPosition = (): { left: string, top: string } => {
    if (!order.origin || !order.destination_coords) {
      return { left: '50%', top: '50%' };
    }
    
    // Simple linear interpolation along the straight line
    return { 
      left: `${20 + progress * 60}%`, 
      top: '50%'
    };
  };
  
  const truckPosition = getTruckPosition();

  return (
    <Card className="bg-dark-lighter border-border/20 overflow-hidden">
      <div className="p-4 bg-[#1A2033] h-[300px] relative">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Route size={48} className="mb-2 text-yellow-400" />
          <p className="text-sm text-muted-foreground">
            Live map tracking would be displayed here
          </p>
        </div>
        
        {/* Truck position along route */}
        {order.origin && order.destination_coords && order.current_location && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2" 
            style={{ 
              left: truckPosition.left, 
              top: truckPosition.top, 
            }}
          >
            <div className="bg-yellow-500 rounded-full p-2 animate-pulse">
              <Truck size={24} className="text-black" />
            </div>
          </div>
        )}
        
        {/* Origin point */}
        {order.origin && (
          <div className="absolute left-[20%] top-[50%] flex flex-col items-center transform -translate-y-1/2">
            <MapPin size={20} className="text-green-500" />
            <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
              Origin
            </div>
          </div>
        )}
        
        {/* Destination point */}
        {order.destination_coords && (
          <div className="absolute right-[20%] top-[50%] flex flex-col items-center transform -translate-y-1/2">
            <MapPin size={20} className="text-red-500" />
            <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
              Destination
            </div>
          </div>
        )}
        
        {/* Route line */}
        {order.origin && order.destination_coords && (
          <div className="absolute left-[20%] right-[20%] top-[50%] h-[3px] bg-gradient-to-r from-green-500 to-red-500 transform -translate-y-1/2"></div>
        )}
        
        {/* Progress indicator */}
        {order.origin && order.destination_coords && order.current_location && (
          <div className="absolute left-[20%] top-[50%] h-[3px] bg-yellow-500 transform -translate-y-1/2" 
            style={{ width: `${progress * 60}%` }}>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrackingMap;

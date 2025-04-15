
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
  return (
    <Card className="bg-dark-lighter border-border/20 overflow-hidden">
      <div className="p-4 bg-[#1A2033] h-[300px] relative">
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Route size={48} className="mb-2 text-yellow-400" />
          <p className="text-sm text-muted-foreground">
            Live map tracking would be displayed here
          </p>
        </div>
        
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-yellow-500 rounded-full p-2 animate-pulse">
            <Truck size={24} className="text-black" />
          </div>
        </div>
        
        <div className="absolute left-[20%] bottom-[30%] flex flex-col items-center">
          <MapPin size={20} className="text-green-500" />
          <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
            Origin
          </div>
        </div>
        
        <div className="absolute right-[20%] bottom-[30%] flex flex-col items-center">
          <MapPin size={20} className="text-red-500" />
          <div className="text-xs bg-dark bg-opacity-75 px-2 py-1 rounded mt-1">
            Destination
          </div>
        </div>
        
        <div className="absolute left-[20%] right-[20%] bottom-[30%] h-[3px] bg-gradient-to-r from-green-500 to-red-500"></div>
      </div>
    </Card>
  );
};

export default TrackingMap;

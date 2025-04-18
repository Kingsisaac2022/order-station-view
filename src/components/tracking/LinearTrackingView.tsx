
import React from 'react';
import { Truck, MapPin, Info, CloudRain, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Point {
  icon: React.ReactNode;
  label: string;
  description?: string;
  type: 'start' | 'end' | 'milestone' | 'truck';
}

interface LinearTrackingViewProps {
  trucks: Array<{
    id: string;
    plateNo: string;
    model: string;
    progress: number;
    journeyInfo: Array<{
      type: string;
      message: string;
      timestamp: string;
    }>;
  }>;
}

const LinearTrackingView: React.FC<LinearTrackingViewProps> = ({ trucks }) => {
  const getJourneyInfoIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'weather':
        return <CloudRain size={16} className="text-blue-500" />;
      case 'stop':
        return <Clock size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {trucks.map((truck) => (
        <div key={truck.id} className="relative">
          {/* Track line */}
          <div className="absolute left-[20px] top-8 w-[calc(100%-40px)] h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-yellow-500 rounded transition-all duration-1000" 
              style={{ width: `${truck.progress}%` }}
            />
          </div>

          {/* Points */}
          <div className="flex justify-between relative">
            {/* Depot */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs mt-2">Depot</span>
            </div>

            {/* Truck Position */}
            <div 
              className="absolute flex flex-col items-center z-20"
              style={{ left: `${truck.progress}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                <Truck className="w-5 h-5 text-black" />
              </div>
              <div className="text-xs mt-2 whitespace-nowrap bg-dark p-1 rounded">
                {truck.plateNo}
              </div>
            </div>

            {/* Station */}
            <div className="flex flex-col items-center z-10">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs mt-2">Station</span>
            </div>
          </div>

          {/* Journey Updates */}
          <div className="mt-8 space-y-2">
            {truck.journeyInfo.slice(0, 3).map((info, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 text-sm bg-dark-lighter p-2 rounded"
              >
                {getJourneyInfoIcon(info.type)}
                <span>{info.message}</span>
                <Badge variant="outline" className="ml-auto">
                  {new Date(info.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinearTrackingView;

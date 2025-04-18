
import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Info, CloudRain, Clock, AlertCircle, Building } from 'lucide-react';
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
  const [animatedTrucks, setAnimatedTrucks] = useState(trucks.map(truck => ({ ...truck, animatedProgress: 0 })));
  
  useEffect(() => {
    // Animate truck progress over time
    const interval = setInterval(() => {
      setAnimatedTrucks(current => 
        current.map(truck => {
          const matchingTruck = trucks.find(t => t.id === truck.id);
          if (!matchingTruck) return truck;
          
          const targetProgress = matchingTruck.progress;
          let newProgress = truck.animatedProgress;
          
          // Gradually move toward target progress
          if (newProgress < targetProgress) {
            newProgress = Math.min(newProgress + 0.5, targetProgress);
          }
          
          return { ...truck, animatedProgress: newProgress };
        })
      );
    }, 100);
    
    return () => clearInterval(interval);
  }, [trucks]);

  // City/milestone points between depot and station
  const milestones = [
    { position: 25, label: 'Checkpoint', icon: <Building size={14} className="text-blue-400" /> },
    { position: 50, label: 'City Center', icon: <Building size={14} className="text-purple-400" /> },
    { position: 75, label: 'Toll Gate', icon: <Building size={14} className="text-amber-400" /> }
  ];

  const getJourneyInfoIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'weather':
        return <CloudRain size={16} className="text-blue-500" />;
      case 'stop':
        return <Clock size={16} className="text-red-500" />;
      case 'assignment':
        return <Info size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-yellow-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {animatedTrucks.map((truck) => (
        <div key={truck.id} className="relative mb-10">
          {/* Track line */}
          <div className="absolute left-[20px] top-8 w-[calc(100%-40px)] h-1 bg-gray-200 rounded">
            <div 
              className="h-full bg-yellow-500 rounded transition-all duration-300" 
              style={{ width: `${truck.animatedProgress}%` }}
            />
          </div>

          {/* Milestone points */}
          {milestones.map((milestone, index) => (
            <div 
              key={index}
              className="absolute flex flex-col items-center z-10"
              style={{ left: `${milestone.position}%`, top: '8px', transform: 'translateX(-50%)' }}
            >
              <div className="w-6 h-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                {milestone.icon}
              </div>
              <span className="text-xs mt-1">{milestone.label}</span>
            </div>
          ))}

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
              style={{ 
                left: `${truck.animatedProgress}%`, 
                transform: 'translateX(-50%)',
                transition: 'left 0.3s ease-out'
              }}
            >
              <div className={`w-10 h-10 rounded-full ${truck.animatedProgress > 0 ? 'bg-yellow-500' : 'bg-blue-500'} flex items-center justify-center animate-pulse`}>
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

          {/* Real-time updates with timing based on progress */}
          <div className="mt-12 space-y-2">
            {truck.journeyInfo.slice(0, 3).map((info, index) => {
              // Calculate whether this update should be shown based on progress
              const showThreshold = ((index + 1) / 4) * 100; // Display progressively
              const shouldShow = truck.animatedProgress >= showThreshold || truck.animatedProgress <= 5;
              
              return (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 text-sm bg-dark-lighter p-2 rounded transition-opacity duration-500 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinearTrackingView;

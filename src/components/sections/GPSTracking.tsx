
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { MapPin } from 'lucide-react';

const GPSTracking: React.FC = () => {
  return (
    <DashboardPanel title="GPS Tracking" icon={<MapPin size={16} />}>
      <div className="space-y-4">
        <div className="h-64 bg-dark-lighter rounded-md border border-border/20 flex flex-col items-center justify-center p-4">
          <div className="text-muted-foreground text-center">
            <MapPin size={24} className="mx-auto mb-2" />
            <div className="text-sm">Map view placeholder</div>
            <div className="text-xs mt-2">GPS tracking data will be displayed here</div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium">Active Trucks</div>
          <div className="border border-border/20 rounded-md p-3 text-sm text-muted-foreground">
            No active trucks to track
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default GPSTracking;

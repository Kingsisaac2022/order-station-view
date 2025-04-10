
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Users } from 'lucide-react';

const Shifts: React.FC = () => {
  return (
    <DashboardPanel title="Shifts" icon={<Users size={16} />}>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <div>Current shift</div>
          <div>No active shift</div>
        </div>
        
        <div className="h-40 bg-dark-lighter rounded-md border border-border/20 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">No active shifts</div>
        </div>
        
        <div className="mt-4 text-xs font-medium">Upcoming Shifts</div>
        <div className="border border-border/20 rounded-md p-3 text-sm text-muted-foreground">
          No scheduled shifts
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Shifts;

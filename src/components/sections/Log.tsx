
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { List } from 'lucide-react';

const Log: React.FC = () => {
  return (
    <DashboardPanel title="System Log" icon={<List size={16} />}>
      <div className="text-xs space-y-3">
        <div className="flex justify-between text-muted-foreground">
          <div>Event</div>
          <div>Time</div>
        </div>
        
        <div className="h-40 border border-border/20 rounded-md p-2 bg-dark-lighter overflow-y-auto font-mono">
          <div className="text-muted-foreground text-center py-4">
            No log entries
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-muted-foreground">Total entries: 0</div>
          <button className="text-primary">Clear logs</button>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Log;

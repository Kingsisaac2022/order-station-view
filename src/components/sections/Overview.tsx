
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { BarChart2, TrendingUp, Clock, Activity } from 'lucide-react';

const Overview: React.FC = () => {
  return (
    <DashboardPanel title="Overview" icon={<BarChart2 size={16} />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">Total Revenue</h4>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div className="text-xl font-semibold">₦0.00</div>
          <div className="text-xs text-muted-foreground mt-1">No data available</div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">System Uptime</h4>
            <Clock size={14} className="text-primary" />
          </div>
          <div className="text-xl font-semibold">0h 0m</div>
          <div className="text-xs text-muted-foreground mt-1">No data available</div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">Station Status</h4>
            <Activity size={14} className="text-primary" />
          </div>
          <div className="text-xl font-semibold">N/A</div>
          <div className="text-xs text-muted-foreground mt-1">No data available</div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">Today's Transactions</h4>
            <BarChart2 size={14} className="text-primary" />
          </div>
          <div className="text-xl font-semibold">0</div>
          <div className="text-xs text-muted-foreground mt-1">No data available</div>
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-md bg-dark-lighter border border-border/20 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Operational metrics chart placeholder</div>
      </div>
    </DashboardPanel>
  );
};

export default Overview;

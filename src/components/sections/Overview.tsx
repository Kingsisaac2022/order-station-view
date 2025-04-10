
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { BarChart2, TrendingUp, Clock, Activity, Truck, Fuel, DollarSign, Users, Database } from 'lucide-react';

const Overview: React.FC = () => {
  return (
    <>
      <DashboardPanel title="System Overview" icon={<BarChart2 size={16} />}>
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
            <div className="text-xl font-semibold">Offline</div>
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
      </DashboardPanel>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <DashboardPanel title="Fleet Status" icon={<Truck size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Active Trucks</h4>
              <div className="text-lg font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Drivers on Shift</h4>
              <div className="text-lg font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Fuel Inventory" icon={<Database size={16} />}>
          <div className="grid grid-cols-3 gap-2">
            {['PMS', 'AGO', 'DPK'].map((type, index) => (
              <div key={index} className="stat-card p-2">
                <h4 className="text-xs font-medium text-muted-foreground">{type}</h4>
                <div className="text-sm font-semibold mt-1">0L</div>
                <div className="h-1 bg-dark rounded-full mt-1">
                  <div className="h-1 bg-primary rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Sales Summary" icon={<DollarSign size={16} />}>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Today</span>
              <span className="text-sm font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">This Week</span>
              <span className="text-sm font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">This Month</span>
              <span className="text-sm font-medium">₦0.00</span>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Dispensers" icon={<Fuel size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Active</h4>
              <div className="text-lg font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Total Volume</h4>
              <div className="text-lg font-semibold">0L</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Staff" icon={<Users size={16} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">On Shift</h4>
              <div className="text-lg font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Off Duty</h4>
              <div className="text-lg font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Alert Summary" icon={<AlertCircle size={16} />}>
          <div className="grid grid-cols-3 gap-2">
            <div className="stat-card p-2">
              <h4 className="text-xs font-medium text-muted-foreground">Critical</h4>
              <div className="text-sm font-semibold mt-1 text-red-500">0</div>
            </div>
            <div className="stat-card p-2">
              <h4 className="text-xs font-medium text-muted-foreground">Warning</h4>
              <div className="text-sm font-semibold mt-1 text-amber-500">0</div>
            </div>
            <div className="stat-card p-2">
              <h4 className="text-xs font-medium text-muted-foreground">Info</h4>
              <div className="text-sm font-semibold mt-1 text-primary">0</div>
            </div>
          </div>
        </DashboardPanel>
      </div>
      
      <div className="mt-4 p-4 rounded-md bg-dark-lighter border border-border/20 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Daily performance chart placeholder</div>
      </div>
    </>
  );
};

export default Overview;

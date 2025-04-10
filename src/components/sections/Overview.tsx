
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { BarChart2, TrendingUp, Clock, Activity, Truck, Fuel, DollarSign, Users, Database, AlertCircle } from 'lucide-react';

const Overview: React.FC = () => {
  return (
    <>
      <DashboardPanel title="System Overview" icon={<BarChart2 size={16} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Total Revenue</h4>
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">₦0.00</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">System Uptime</h4>
              <Clock size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">0h 0m</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Station Status</h4>
              <Activity size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">Offline</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Today's Transactions</h4>
              <BarChart2 size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">0</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
        </div>
      </DashboardPanel>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DashboardPanel title="Fleet Status" icon={<Truck size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Trucks</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Drivers on Shift</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Fuel Inventory" icon={<Database size={16} />}>
          <div className="grid grid-cols-3 gap-3">
            {['PMS', 'AGO', 'DPK'].map((type, index) => (
              <div key={index} className="stat-card p-3">
                <h4 className="text-sm font-medium text-muted-foreground">{type}</h4>
                <div className="text-base font-semibold mt-2">0L</div>
                <div className="h-2 bg-dark rounded-full mt-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Sales Summary" icon={<DollarSign size={16} />}>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Dispensers" icon={<Fuel size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Active</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Volume</h4>
              <div className="text-xl font-semibold">0L</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Staff" icon={<Users size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">On Shift</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Off Duty</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Alert Summary" icon={<AlertCircle size={16} />}>
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Critical</h4>
              <div className="text-base font-semibold mt-2 text-red-500">0</div>
            </div>
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Warning</h4>
              <div className="text-base font-semibold mt-2 text-amber-500">0</div>
            </div>
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Info</h4>
              <div className="text-base font-semibold mt-2 text-primary">0</div>
            </div>
          </div>
        </DashboardPanel>
      </div>
      
      <div className="mt-6 p-6 rounded-md bg-dark-lighter border border-border/20 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Daily performance chart placeholder</div>
      </div>
    </>
  );
};

export default Overview;


import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { DollarSign } from 'lucide-react';

const Sales: React.FC = () => {
  return (
    <DashboardPanel title="Sales" icon={<DollarSign size={16} />}>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Today's Sales</div>
            <div className="text-lg font-semibold">₦0.00</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">This Month</div>
            <div className="text-lg font-semibold">₦0.00</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">This Year</div>
            <div className="text-lg font-semibold">₦0.00</div>
          </div>
        </div>
        
        <div className="h-48 bg-dark-lighter rounded-md border border-border/20 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Sales trend chart placeholder</div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Sales;

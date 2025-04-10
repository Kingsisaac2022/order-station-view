
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { TrendingDown } from 'lucide-react';

const Expenses: React.FC = () => {
  return (
    <DashboardPanel title="Expenses" icon={<TrendingDown size={16} />}>
      <div className="grid grid-cols-1 gap-4">
        <div className="stat-card">
          <div className="text-xs text-muted-foreground mb-1">Total Expenses</div>
          <div className="text-lg font-semibold">₦0.00</div>
        </div>
        
        <div className="h-32 bg-dark-lighter rounded-md border border-border/20 flex flex-col items-center justify-center p-4">
          <div className="text-muted-foreground text-sm">Expense breakdown placeholder</div>
          <div className="text-xs text-muted-foreground mt-2">No data available</div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Expenses;

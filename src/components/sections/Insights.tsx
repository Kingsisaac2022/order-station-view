
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Lightbulb } from 'lucide-react';

const Insights: React.FC = () => {
  return (
    <DashboardPanel title="Insights" icon={<Lightbulb size={16} />}>
      <div className="space-y-3">
        <div className="text-xs font-medium">Business Intelligence</div>
        
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index} 
            className="p-3 rounded-md bg-dark-lighter border border-border/20"
          >
            <div className="flex items-center mb-1">
              <Lightbulb size={12} className="text-primary mr-2" />
              <div className="text-xs font-medium">Insight {index + 1}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              No insights available. The system will analyze your data and provide business intelligence here.
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default Insights;

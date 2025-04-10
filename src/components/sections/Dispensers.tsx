
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Fuel } from 'lucide-react';

const Dispensers: React.FC = () => {
  return (
    <DashboardPanel title="Dispensers" icon={<Fuel size={16} />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((id) => (
          <div 
            key={id}
            className="bg-dark-lighter rounded-md border border-border/20 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Dispenser {id}</div>
              <div className="text-xs px-2 py-1 rounded bg-secondary/30 text-primary">Inactive</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Fuel Type:</span>
                <span>PMS</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Volume Today:</span>
                <span>0 Litres</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Status:</span>
                <span>Offline</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default Dispensers;

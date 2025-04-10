
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Database } from 'lucide-react';

const Tanks: React.FC = () => {
  return (
    <DashboardPanel title="Tanks" icon={<Database size={16} />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['PMS', 'AGO', 'DPK'].map((fuelType, index) => (
          <div 
            key={index}
            className="bg-dark-lighter rounded-md border border-border/20 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">Tank {index + 1} - {fuelType}</div>
              <div className="text-xs px-2 py-1 rounded bg-secondary/30 text-primary">Normal</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Capacity:</span>
                <span>0 Litres</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Current Level:</span>
                <span>0 Litres (0%)</span>
              </div>
              
              <div className="h-2 bg-dark rounded-full mt-2">
                <div className="h-2 bg-primary rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default Tanks;

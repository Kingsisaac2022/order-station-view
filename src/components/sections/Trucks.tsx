
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Truck } from 'lucide-react';

const Trucks: React.FC = () => {
  return (
    <DashboardPanel title="Trucks" icon={<Truck size={16} />}>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/20">
                <th className="text-left pb-2 font-medium">Truck ID</th>
                <th className="text-left pb-2 font-medium">Plate No.</th>
                <th className="text-left pb-2 font-medium">Assigned Driver</th>
                <th className="text-left pb-2 font-medium">Fuel Capacity</th>
                <th className="text-right pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-16">
                <td colSpan={5} className="placeholder-text">
                  No trucks registered
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Trucks;

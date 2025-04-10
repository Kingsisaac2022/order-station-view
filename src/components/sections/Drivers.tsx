
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { UsersRound } from 'lucide-react';

const Drivers: React.FC = () => {
  return (
    <DashboardPanel title="Drivers" icon={<UsersRound size={16} />}>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border/20">
                <th className="text-left pb-2 font-medium">Name</th>
                <th className="text-left pb-2 font-medium">License No.</th>
                <th className="text-left pb-2 font-medium">Assigned Truck</th>
                <th className="text-right pb-2 font-medium">Status</th>
                <th className="text-right pb-2 font-medium">Last Trip</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-16">
                <td colSpan={5} className="placeholder-text">
                  No drivers registered
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Drivers;

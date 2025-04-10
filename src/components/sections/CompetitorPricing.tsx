
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { Tag } from 'lucide-react';

const CompetitorPricing: React.FC = () => {
  return (
    <DashboardPanel title="Competitor Pricing" icon={<Tag size={16} />}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border/20">
              <th className="text-left pb-2 font-medium">Competitor</th>
              <th className="text-right pb-2 font-medium">PMS</th>
              <th className="text-right pb-2 font-medium">AGO</th>
              <th className="text-right pb-2 font-medium">DPK</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-16">
              <td colSpan={4} className="placeholder-text">
                No competitor pricing data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
};

export default CompetitorPricing;

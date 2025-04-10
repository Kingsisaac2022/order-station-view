
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { AlertCircle } from 'lucide-react';

const Alerts: React.FC = () => {
  return (
    <DashboardPanel title="Alerts" icon={<AlertCircle size={16} />}>
      <div className="h-40 rounded-md flex items-center justify-center bg-dark-lighter border border-border/20">
        <div className="text-center">
          <AlertCircle size={24} className="text-muted-foreground mx-auto mb-2" />
          <div className="text-muted-foreground">No recent alerts</div>
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Alerts;

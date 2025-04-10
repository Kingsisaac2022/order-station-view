
import React from 'react';
import Overview from './sections/Overview';
import Orders from './sections/Orders';
import Sales from './sections/Sales';
import Expenses from './sections/Expenses';
import CompetitorPricing from './sections/CompetitorPricing';
import Shifts from './sections/Shifts';
import Alerts from './sections/Alerts';
import Insights from './sections/Insights';
import Drivers from './sections/Drivers';
import Trucks from './sections/Trucks';
import GPSTracking from './sections/GPSTracking';
import Tanks from './sections/Tanks';
import Dispensers from './sections/Dispensers';
import { cn } from '@/lib/utils';

interface DashboardProps {
  activeSection: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection }) => {
  // Define which components should be rendered based on the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'orders':
        return <Orders />;
      case 'sales':
        return <Sales />;
      case 'expenses':
        return <Expenses />;
      case 'competitor-pricing':
        return <CompetitorPricing />;
      case 'shifts':
        return <Shifts />;
      case 'drivers':
        return <Drivers />;
      case 'trucks':
        return <Trucks />;
      case 'gps-tracking':
        return <GPSTracking />;
      case 'tanks':
        return <Tanks />;
      case 'dispensers':
        return <Dispensers />;
      case 'alerts':
        return <Alerts />;
      case 'insights':
        return <Insights />;
      default:
        return <Overview />;
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      {renderSection()}
    </div>
  );
};

export default Dashboard;

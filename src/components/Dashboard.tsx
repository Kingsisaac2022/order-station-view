
import React, { useState } from 'react';
import Overview from './sections/Overview';
import Orders from './sections/Orders';
import Sales from './sections/Sales';
import Expenses from './sections/Expenses';
import CompetitorPricing from './sections/CompetitorPricing';
import Shifts from './sections/Shifts';
import Documents from './sections/Documents';
import Alerts from './sections/Alerts';
import Insights from './sections/Insights';
import Log from './sections/Log';
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
      case 'documents':
        return <Documents />;
      case 'alerts':
        return <Alerts />;
      case 'insights':
        return <Insights />;
      case 'log':
        return <Log />;
      default:
        return <Overview />;
    }
  };
  
  // Mobile shows only the active section
  // Desktop/tablet shows a grid layout with active section expanded
  return (
    <div className="container mx-auto p-4">
      {/* Mobile View - Single Column */}
      <div className="block sm:hidden space-y-4">
        {renderSection()}
      </div>
      
      {/* Tablet/Desktop View - Grid Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4">
        <div className={cn(
          "space-y-4",
          activeSection === 'overview' ? "sm:col-span-2" : ""
        )}>
          <Overview />
          <Orders />
          <Sales />
          <Expenses />
          <CompetitorPricing />
        </div>
        <div className="space-y-4">
          <Shifts />
          <Documents />
          <Alerts />
          <Insights />
          <Log />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

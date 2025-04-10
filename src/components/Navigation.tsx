
import React from 'react';
import { 
  BarChart2, ShoppingCart, DollarSign, TrendingDown, Tag, 
  Users, Truck, MapPin, Database, Fuel, AlertCircle, Lightbulb, UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'sales', label: 'Sales', icon: DollarSign },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown },
  { id: 'competitor-pricing', label: 'Competitor Pricing', icon: Tag },
  { id: 'shifts', label: 'Shifts', icon: Users },
  { id: 'drivers', label: 'Drivers', icon: UsersRound },
  { id: 'trucks', label: 'Trucks', icon: Truck },
  { id: 'gps-tracking', label: 'GPS Tracking', icon: MapPin },
  { id: 'tanks', label: 'Tanks', icon: Database },
  { id: 'dispensers', label: 'Dispensers', icon: Fuel },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'insights', label: 'Insights', icon: Lightbulb }
];

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="tab-container overflow-x-auto scrollbar-none">
      <nav className="tab-navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "tab-button",
                isActive ? "active" : ""
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;

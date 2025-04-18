
import React, { useState } from 'react';
import { 
  BarChart2, ShoppingCart, DollarSign, TrendingDown, Tag, 
  Users, Truck, MapPin, Database, Fuel, AlertCircle, Lightbulb, UsersRound,
  ChevronLeft, ChevronRight
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
  { id: 'drivers', label: 'Drivers', icon: UsersRound },
  { id: 'trucks', label: 'Trucks', icon: Truck },
  { id: 'gps-tracking', label: 'GPS Tracking', icon: MapPin },
  { id: 'tanks', label: 'Tanks', icon: Database },
  { id: 'dispensers', label: 'Dispensers', icon: Fuel },
  { id: 'shifts', label: 'Shifts', icon: Users },
  { id: 'competitor-pricing', label: 'Competitor Pricing', icon: Tag },
  { id: 'sales', label: 'Sales', icon: DollarSign },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'insights', label: 'Insights', icon: Lightbulb }
];

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const MAX_SCROLL = navItems.length - 5; // Assuming we want to show 5 items at a time

  const handleNext = () => {
    setScrollPosition(Math.min(scrollPosition + 1, MAX_SCROLL));
  };

  const handlePrevious = () => {
    setScrollPosition(Math.max(scrollPosition - 1, 0));
  };

  return (
    <div className="px-4 py-6 relative">
      <div className="max-w-4xl mx-auto bg-dark-lighter rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-none flex items-center">
          {scrollPosition > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 z-10 bg-dark-lighter p-2 hover:bg-dark-card transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <nav 
            className="flex transition-transform duration-300" 
            style={{ transform: `translateX(-${scrollPosition * 100}px)` }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "whitespace-nowrap flex items-center px-6 py-3 transition-colors shrink-0",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-foreground hover:bg-dark-card"
                  )}
                  style={{
                    borderTopLeftRadius: isActive ? "0.5rem" : 0,
                    borderTopRightRadius: isActive ? "0.5rem" : 0,
                  }}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {scrollPosition < MAX_SCROLL && (
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 bg-dark-lighter p-2 hover:bg-dark-card transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;

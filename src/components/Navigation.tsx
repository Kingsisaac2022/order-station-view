
import React, { useState } from 'react';
import { 
  BarChart2, ShoppingCart, DollarSign, TrendingDown, Tag, 
  Users, FileText, AlertCircle, Lightbulb, List, Menu, X
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
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'log', label: 'Log', icon: List }
];

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="sticky top-16 z-40 sm:hidden bg-dark py-2 border-b border-border/50">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={toggleDrawer}
            className="p-2 rounded-md hover:bg-dark-lighter"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm font-medium">
            {navItems.find(item => item.id === activeSection)?.label}
          </div>
          <div className="w-9"></div> {/* Spacer to balance layout */}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300",
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className={cn(
            "fixed inset-y-0 left-0 w-3/4 max-w-xs bg-dark shadow-lg transform transition-transform duration-300 ease-in-out",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="font-medium">Menu</div>
            <button 
              onClick={toggleDrawer}
              className="p-1 rounded-full hover:bg-dark-lighter"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "drawer-menu-button w-full text-left",
                  activeSection === item.id ? "active" : ""
                )}
                onClick={() => handleSectionClick(item.id)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Navigation */}
      <nav className="hidden sm:block sticky top-16 z-40 bg-dark border-b border-border/50">
        <div className="container mx-auto py-2 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "icon-nav-button",
                  activeSection === item.id ? "active" : ""
                )}
                onClick={() => handleSectionClick(item.id)}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;

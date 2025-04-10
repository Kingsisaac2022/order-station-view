
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardPanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  title,
  icon,
  children,
  className,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn(
      "bg-dark-card rounded-md overflow-hidden neon-border-subtle", 
      className
    )}>
      <div 
        className="panel-header cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <span className="mr-2 text-primary">{icon}</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <button className="p-1 hover:bg-dark-lighter rounded">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="panel-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardPanel;

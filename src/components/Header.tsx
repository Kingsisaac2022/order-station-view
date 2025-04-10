
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const Header: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark border-b border-border/50 p-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-primary font-bold text-xl">NIPCO</div>
          <div className="hidden sm:block ml-2 text-xs text-muted-foreground">Station Monitoring</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium">{formatDate(currentDateTime)}</div>
          <div className="text-xs text-muted-foreground">{formatTime(currentDateTime)}</div>
        </div>
        
        <div className="relative">
          <button className="p-1.5 rounded-full hover:bg-dark-lighter transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

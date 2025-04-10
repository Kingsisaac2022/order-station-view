
import React from 'react';
import { Fuel } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center">
        <Fuel className="h-6 w-6 mr-2 text-foreground" />
        <h1 className="text-3xl font-bold text-foreground">NIPCO</h1>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Smart Filling Station Management System</p>
    </div>
  );
};

export default Logo;


import React from 'react';

interface ProgressBarProps {
  progress: number;
  origin: string;
  destination: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, origin, destination }) => {
  return (
    <div className="p-4 border-t border-border/20">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium">Journey Progress</div>
        <div className="text-sm">{progress.toFixed(0)}%</div>
      </div>
      <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
        <div 
          className="bg-yellow-500 h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <div>
          <span className="text-green-500 mr-1">●</span>
          {origin}
        </div>
        <div>
          <span className="text-red-500 mr-1">●</span>
          {destination}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

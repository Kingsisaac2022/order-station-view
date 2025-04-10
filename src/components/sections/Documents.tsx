
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { FileText, FilePlus } from 'lucide-react';

const Documents: React.FC = () => {
  return (
    <DashboardPanel title="Documents" icon={<FileText size={16} />}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium">Recent Documents</div>
          <button className="flex items-center text-xs text-primary">
            <FilePlus size={12} className="mr-1" />
            Upload
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="aspect-square flex flex-col items-center justify-center p-3 rounded-md bg-dark-lighter border border-border/20"
            >
              <FileText size={24} className="text-muted-foreground mb-2" />
              <div className="text-xs text-muted-foreground">placeholder.pdf</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
};

export default Documents;

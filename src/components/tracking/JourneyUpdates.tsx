
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JourneyInfo } from '@/types/orders';

interface JourneyUpdatesProps {
  journeyInfo: JourneyInfo[];
  getJourneyInfoIcon: (type: string) => JSX.Element;
  formatTime: (timestamp: string) => string;
  formatDate: (timestamp: string) => string;
}

const JourneyUpdates: React.FC<JourneyUpdatesProps> = ({
  journeyInfo,
  getJourneyInfoIcon,
  formatTime,
  formatDate
}) => {
  return (
    <Card className="bg-dark-lighter border-border/20">
      <CardHeader className="border-b border-border/20">
        <CardTitle>Journey Updates</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {journeyInfo && journeyInfo.length > 0 ? (
          <div className="space-y-4">
            {[...journeyInfo]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((info, idx) => (
                <div 
                  key={idx}
                  className="flex border-b border-border/10 last:border-0 pb-3 last:pb-0"
                >
                  <div className="mr-3 mt-1">{getJourneyInfoIcon(info.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{info.message}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(info.timestamp)} - {formatDate(info.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Info size={24} className="mx-auto mb-2" />
            <p>No journey updates available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneyUpdates;

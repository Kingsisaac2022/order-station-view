
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface JourneyDetailsProps {
  estimatedArrival: string;
  progress: number;
  loadingLocation: string;
  destination: string;
  expectedLoadingDate: string;
}

const JourneyDetails: React.FC<JourneyDetailsProps> = ({
  estimatedArrival,
  progress,
  loadingLocation,
  destination,
  expectedLoadingDate,
}) => {
  return (
    <Card className="bg-dark-lighter border-border/20">
      <CardHeader className="border-b border-border/20">
        <CardTitle>Journey Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Estimated Time to Destination</div>
              <div className="text-lg font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                {estimatedArrival}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Current Speed</div>
              <div className="text-lg font-medium">~45-60 km/h</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Distance Covered</div>
              <div className="text-lg font-medium">{progress.toFixed(0)}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-lg font-medium flex items-center">
                <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
                  In Transit
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Route Information</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure</span>
                <span>{loadingLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span>{destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Loading Date</span>
                <span>{expectedLoadingDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyDetails;

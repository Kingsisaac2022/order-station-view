
import React from 'react';
import { Truck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Driver } from '@/types/drivers';
import { Truck as TruckType } from '@/types/trucks';

interface TransportDetailsProps {
  driver?: Driver;
  truck?: TruckType;
}

const TransportDetails: React.FC<TransportDetailsProps> = ({ driver, truck }) => {
  return (
    <Card className="bg-dark-lighter border-border/20">
      <CardHeader className="border-b border-border/20">
        <CardTitle>Transport Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {driver && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Driver</div>
              <div className="font-medium">{driver.name}</div>
              <div className="text-sm">License: {driver.license_no}</div>
              <div className="text-sm">Contact: {driver.phone_number}</div>
            </div>
          )}
          
          {truck && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Vehicle</div>
                <div className="font-medium flex items-center">
                  <Truck size={16} className="mr-2" />
                  {truck.plate_no}
                </div>
                <div className="text-sm">Model: {truck.model}</div>
                <div className="text-sm">Capacity: {truck.capacity}</div>
                <div className="text-sm flex items-center mt-1">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50 mr-2">
                    GPS Enabled
                  </Badge>
                  ID: {truck.gps_id}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportDetails;

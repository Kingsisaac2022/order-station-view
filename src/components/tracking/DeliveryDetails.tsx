
import React from 'react';
import { Truck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface DeliveryDetailsProps {
  id: string;
  productType: string;
  quantity: string;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({ id, productType, quantity }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-dark-lighter border-border/20">
      <CardHeader className="border-b border-border/20">
        <CardTitle>Delivery Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Product Type</div>
            <div className="font-medium">{productType}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Quantity</div>
            <div className="font-medium">{quantity} litres</div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Actions</div>
            <div className="grid gap-2">
              <Button 
                onClick={() => navigate(`/order/${id}`)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black flex items-center"
              >
                <Truck size={16} className="mr-2" />
                View Order Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDetails;

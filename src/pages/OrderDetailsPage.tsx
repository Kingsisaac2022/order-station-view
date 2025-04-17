import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { toast } from 'sonner';
import { ArrowLeft, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatus } from '@/types/orders';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, assignDriver, startDelivery } = useOrders();
  const { drivers, trucks } = useFleet();
  
  // Find the current order
  const order = orders.find(o => o.id === id);
  
  // Handle start delivery action
  const handleStartDelivery = async () => {
    if (!order) return;
    
    try {
      await startDelivery(order.id);
      navigate(`/track/${order.id}`); // Navigate to tracking page after starting delivery
    } catch (error) {
      console.error('Failed to start delivery:', error);
      toast.error('Failed to start delivery');
    }
  };
  
  if (!order) {
    return (
      <div className="min-h-screen bg-dark text-foreground py-12">
        <div className="container max-w-3xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
              <CardDescription>
                The requested order could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>
                Go back to dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderActionButtons = () => {
    if (!order) return null;
    
    return (
      <div className="flex flex-wrap gap-3 mt-6">
        {/* Add Start Delivery button when the order is active and has a driver assigned */}
        {order.status === 'active' && order.driver_id && order.assigned_truck_id && (
          <Button 
            onClick={handleStartDelivery}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Truck className="mr-2 h-4 w-4" />
            Start Delivery
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-dark text-foreground py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              View and manage details for order {order.po_number}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Order ID</Label>
                <Input type="text" value={order.po_number} readOnly />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="text" value={order.date} readOnly />
              </div>
            </div>
            
            <div>
              <Label>Product Type</Label>
              <Input type="text" value={order.product_type} readOnly />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input type="text" value={order.quantity} readOnly />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input type="text" value={order.total_amount} readOnly />
              </div>
            </div>
            
            <div>
              <Label>Loading Location</Label>
              <Input type="text" value={order.loading_location} readOnly />
            </div>
            
            <div>
              <Label>Destination</Label>
              <Input type="text" value={order.destination} readOnly />
            </div>
            
            <div>
              <Label>Status</Label>
              <Badge className={`
                ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : ''}
                ${order.status === 'active' ? 'bg-purple-500/20 text-purple-500 border-purple-500/50' : ''}
                ${order.status === 'in-transit' ? 'bg-blue-500/20 text-blue-500 border-blue-500/50' : ''}
                ${order.status === 'completed' ? 'bg-green-500/20 text-green-500 border-green-500/50' : ''}
                ${order.status === 'flagged' ? 'bg-red-500/20 text-red-500 border-red-500/50' : ''}
              `}>
                {order.status}
              </Badge>
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea value={order.notes || ''} readOnly />
            </div>
          </CardContent>
          <CardFooter>
            {renderActionButtons()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

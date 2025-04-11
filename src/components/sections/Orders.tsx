
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { ShoppingCart, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useOrders } from '@/context/OrderContext';

const Orders: React.FC = () => {
  // We'll replace direct navigation with a function that uses window.location
  // This avoids the Router context requirement
  const handleCreateOrder = () => {
    window.location.href = '/create-purchase-order';
    // Show toast notification when navigating
    toast.success('Navigating to Create Purchase Order page');
  };
  
  const { orders } = useOrders();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'active':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'in-transit':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'flagged':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };
  
  const handleViewOrder = (id: string) => {
    window.location.href = `/order/${id}`;
  };
  
  return (
    <DashboardPanel title="Orders" icon={<ShoppingCart size={16} />}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <Button 
          onClick={handleCreateOrder}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          Create Purchase Order
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border/20">
              <th className="text-left pb-2 font-medium">Order ID</th>
              <th className="text-left pb-2 font-medium">Date</th>
              <th className="text-left pb-2 font-medium">Product</th>
              <th className="text-right pb-2 font-medium">Amount</th>
              <th className="text-center pb-2 font-medium">Status</th>
              <th className="text-right pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="h-16">
                <td colSpan={6} className="text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border/10 h-14">
                  <td className="py-4">{order.poNumber}</td>
                  <td>{order.date}</td>
                  <td>{order.productType}</td>
                  <td className="text-right">{order.totalAmount}</td>
                  <td className="text-center">
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewOrder(order.id)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink size={16} />
                      <span className="sr-only">View Order</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
};

export default Orders;

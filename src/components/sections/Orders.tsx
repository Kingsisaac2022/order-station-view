
import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { ShoppingCart, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Orders: React.FC = () => {
  // We'll replace direct navigation with a function that uses window.location
  // This avoids the Router context requirement
  const handleCreateOrder = () => {
    window.location.href = '/create-purchase-order';
    // Show toast notification when navigating
    toast.success('Navigating to Create Purchase Order page');
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
              <th className="text-left pb-2 font-medium">Customer</th>
              <th className="text-left pb-2 font-medium">Product</th>
              <th className="text-right pb-2 font-medium">Amount</th>
              <th className="text-right pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-16">
              <td colSpan={5} className="text-center text-muted-foreground">
                No orders yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
};

export default Orders;


import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { ShoppingCart } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <DashboardPanel title="Orders" icon={<ShoppingCart size={16} />}>
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
              <td colSpan={5} className="placeholder-text">
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

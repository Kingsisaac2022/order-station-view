
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PurchaseOrder } from '../types/orders';

export const useOrderStatusNotifications = (activeOrder: PurchaseOrder | null) => {
  useEffect(() => {
    if (!activeOrder) return;

    const getStatusNotification = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Order created and pending payment verification';
        case 'active':
          return 'Payment verified, order is now active';
        case 'in-transit':
          return 'Order is in transit to destination';
        case 'completed':
          return 'Order has been successfully delivered';
        case 'flagged':
          return 'Order has been flagged due to volume discrepancy';
        default:
          return `Order status updated to ${status}`;
      }
    };

    const handleStatusChanges = () => {
      switch (activeOrder.status) {
        case 'pending':
          toast.info(getStatusNotification('pending'));
          break;
        case 'active':
          toast.success(getStatusNotification('active'));
          break;
        case 'in-transit':
          toast.info(getStatusNotification('in-transit'));
          break;
        case 'completed':
          toast.success(getStatusNotification('completed'));
          break;
        case 'flagged':
          toast.error(getStatusNotification('flagged'));
          break;
      }
    };

    handleStatusChanges();
  }, [activeOrder?.status]);
};

import React, { useState, useEffect } from 'react';
import DashboardPanel from '../DashboardPanel';
import { ShoppingCart, FileText, ExternalLink, RefreshCcw, AlertCircle, CreditCard, User, Check, Truck as TruckIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useOrders } from '@/context/OrderContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatus } from '@/types/orders';
import { Driver } from '@/types/drivers';
import { Truck as TruckType } from '@/types/trucks';
import { supabase, getApprovedDrivers, getGpsEnabledTrucks } from '@/integrations/supabase/client';
import { TABLES } from '@/integrations/supabase/schema';

const Orders: React.FC = () => {
  const handleCreateOrder = () => {
    window.location.href = '/create-purchase-order';
    toast.success('Navigating to Create Purchase Order page');
  };
  
  const { orders, isLoading, error, loadOrders, updateOrderStatus, assignDriver } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedTruck, setSelectedTruck] = useState<string>('');
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  
  useEffect(() => {
    loadDriversAndTrucks();
  }, []);
  
  useEffect(() => {
    if (isDriverDialogOpen) {
      loadDriversAndTrucks();
    }
  }, [isDriverDialogOpen]);
  
  const loadDriversAndTrucks = async () => {
    setIsLoading2(true);
    try {
      const driversData = await getApprovedDrivers();
      const trucksData = await getGpsEnabledTrucks();
      
      setDrivers(driversData as Driver[]);
      setTrucks(trucksData as TruckType[]);
      
      console.log('Retrieved drivers:', driversData);
      console.log('Retrieved trucks:', trucksData);
      
      if (driversData.length === 0) {
        toast.warning('No approved drivers available');
      }
      
      if (trucksData.length === 0) {
        toast.warning('No GPS-enabled trucks available');
      }
    } catch (err) {
      console.error('Error loading drivers and trucks:', err);
      toast.error('Failed to load drivers and trucks');
    } finally {
      setIsLoading2(false);
    }
  };
  
  const handleRefresh = async () => {
    await loadOrders();
    await loadDriversAndTrucks();
    toast.success('Data refreshed');
  };
  
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
  
  const handleMarkAsPaid = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderStatus(selectedOrder, 'active' as OrderStatus);
      setIsPaymentDialogOpen(false);
      toast.success('Order marked as active');
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Failed to update order status');
    }
  };
  
  const handleAssignDriver = async () => {
    if (!selectedOrder || !selectedDriver || !selectedTruck) {
      toast.error('Please select a driver and truck');
      return;
    }
    
    try {
      await assignDriver(selectedOrder, selectedDriver, selectedTruck);
      setIsDriverDialogOpen(false);
      setSelectedDriver('');
      setSelectedTruck('');
      toast.success('Driver and truck assigned successfully');
      
      await loadOrders();
    } catch (err) {
      console.error('Error assigning driver:', err);
      toast.error('Failed to assign driver and truck');
    }
  };
  
  const openPaymentDialog = (id: string) => {
    setSelectedOrder(id);
    setIsPaymentDialogOpen(true);
  };
  
  const openAssignDialog = (id: string) => {
    setSelectedOrder(id);
    setSelectedDriver('');
    setSelectedTruck('');
    loadDriversAndTrucks();
    setIsDriverDialogOpen(true);
  };
  
  if (error) {
    return (
      <DashboardPanel title="Orders" icon={<ShoppingCart size={16} />}>
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-500">Error loading orders: {error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCcw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </DashboardPanel>
    );
  }
  
  return (
    <>
      <DashboardPanel title="Orders" icon={<ShoppingCart size={16} />}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Order Management</h2>
          <div className="flex gap-2">
            {isLoading ? (
              <Skeleton className="h-10 w-10" />
            ) : (
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                className="h-10 w-10"
              >
                <RefreshCcw size={16} />
                <span className="sr-only">Refresh orders</span>
              </Button>
            )}
            <Button 
              onClick={handleCreateOrder}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Create Purchase Order
            </Button>
          </div>
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
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-border/10 h-14">
                    <td><Skeleton className="h-4 w-24" /></td>
                    <td><Skeleton className="h-4 w-24" /></td>
                    <td><Skeleton className="h-4 w-32" /></td>
                    <td className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                    <td className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
                    <td className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr className="h-16">
                  <td colSpan={6} className="text-center text-muted-foreground">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/10 h-14">
                    <td className="py-4">{order.po_number}</td>
                    <td>{order.date}</td>
                    <td>{order.product_type}</td>
                    <td className="text-right">{order.total_amount}</td>
                    <td className="text-center">
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-right flex justify-end items-center gap-2">
                      {order.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openPaymentDialog(order.id)}
                          className="h-8 px-2 py-0 text-green-500 hover:text-green-600"
                        >
                          <CreditCard size={14} className="mr-1" />
                          <span>Mark Paid</span>
                        </Button>
                      )}
                      
                      {order.status === 'active' && !order.driver_id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openAssignDialog(order.id)}
                          className="h-8 px-2 py-0 text-blue-500 hover:text-blue-600"
                        >
                          <User size={14} className="mr-1" />
                          <span>Assign</span>
                        </Button>
                      )}
                      
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
      
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order as Paid</DialogTitle>
            <DialogDescription>
              This will update the order status to "active" and allow driver assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 border rounded-md bg-green-500/10 border-green-500/20">
            <p className="text-green-500 flex items-center">
              <Check className="mr-2" size={16} />
              Payment verification completed
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkAsPaid}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Driver & Truck</DialogTitle>
            <DialogDescription>
              Select an approved driver and GPS-enabled truck for this delivery.
            </DialogDescription>
          </DialogHeader>
          
          {isLoading2 ? (
            <div className="space-y-4 my-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="driver">Select Approved Driver</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.length === 0 ? (
                      <SelectItem value="none" disabled>No approved drivers</SelectItem>
                    ) : (
                      drivers.map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} ({driver.license_no})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {selectedDriver && (
                  <Card className="mt-2 bg-muted/50">
                    <CardContent className="p-3 text-xs">
                      <p><strong>Driver:</strong> {drivers.find(d => d.id === selectedDriver)?.name}</p>
                      <p><strong>License:</strong> {drivers.find(d => d.id === selectedDriver)?.license_no}</p>
                      <p><strong>Contact:</strong> {drivers.find(d => d.id === selectedDriver)?.phone_number}</p>
                      <p><strong>Status:</strong> {drivers.find(d => d.id === selectedDriver)?.status}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="truck">Select GPS-Enabled Truck</Label>
                <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                  <SelectTrigger id="truck">
                    <SelectValue placeholder="Select truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.length === 0 ? (
                      <SelectItem value="none" disabled>No GPS-enabled trucks</SelectItem>
                    ) : (
                      trucks.map(truck => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.plate_no} ({truck.model}) {truck.gps_enabled ? '- GPS Enabled' : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {selectedTruck && (
                  <Card className="mt-2 bg-muted/50">
                    <CardContent className="p-3 text-xs">
                      <p><strong>Plate:</strong> {trucks.find(t => t.id === selectedTruck)?.plate_no}</p>
                      <p><strong>Model:</strong> {trucks.find(t => t.id === selectedTruck)?.model}</p>
                      <p><strong>Capacity:</strong> {trucks.find(t => t.id === selectedTruck)?.capacity}</p>
                      <p><strong>GPS:</strong> {trucks.find(t => t.id === selectedTruck)?.gps_enabled ? 'Enabled' : 'Disabled'}</p>
                      <p><strong>GPS ID:</strong> {trucks.find(t => t.id === selectedTruck)?.gps_id || 'Not available'}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAssignDriver}
              disabled={!selectedDriver || !selectedTruck || isLoading2}
              className="flex items-center"
            >
              <TruckIcon className="mr-2" size={14} />
              Assign for Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders;

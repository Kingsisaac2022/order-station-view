import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, AlertTriangle, Truck, MapPin } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useFleet } from '@/context/FleetContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, assignDriver, completeDelivery, setActiveOrder } = useOrders();
  const { drivers, trucks } = useFleet();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');
  const [deliveredVolume, setDeliveredVolume] = useState('');
  
  // Find the current order
  const order = orders.find(o => o.id === id);

  // Get available drivers and trucks
  const availableDrivers = drivers.filter(driver => driver.status === 'approved' && !driver.assigned_truck_id);
  const availableTrucks = trucks.filter(truck => truck.status === 'available' && !truck.assigned_driver_id && truck.gps_enabled);

  // Set active order when component mounts
  useEffect(() => {
    if (order) {
      setActiveOrder(order);
    }
    
    // Cleanup when leaving the page
    return () => {
      setActiveOrder(null);
    };
  }, [order, setActiveOrder]);

  // Navigate back if order not found
  if (!order) {
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

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

  // Order actions based on current status
  const renderActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-500/10 p-4 rounded-md border border-yellow-500/20">
              <div className="flex items-center mb-2">
                <AlertTriangle size={18} className="text-yellow-500 mr-2" />
                <h3 className="font-medium">Pending Payment Verification</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This order is waiting for payment verification before proceeding.
              </p>
              <Button 
                onClick={() => updateOrderStatus(order.id, 'active', 'Payment verified successfully')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <CheckCircle size={16} className="mr-2" />
                Verify Payment
              </Button>
            </div>
          </div>
        );
      case 'active':
        return (
          <div className="space-y-4">
            <div className="bg-purple-500/10 p-4 rounded-md border border-purple-500/20">
              <div className="flex items-center mb-2">
                <CheckCircle size={18} className="text-purple-500 mr-2" />
                <h3 className="font-medium">Payment Verified</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Payment has been verified. Assign a GPS-enabled truck and approved driver to start delivery.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Truck size={16} className="mr-2" />
                    Assign Driver & Truck
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Driver & Truck</DialogTitle>
                    <DialogDescription>
                      Select from available approved drivers and GPS-enabled trucks to handle this delivery.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver">Select Driver</Label>
                      <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Driver --" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDrivers.length > 0 ? (
                            availableDrivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} - License: {driver.licenseNo}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>No approved drivers available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {availableDrivers.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                          No approved drivers available. Please add and approve drivers from the Drivers page.
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="truck">Select GPS-Enabled Truck</Label>
                      <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Truck --" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrucks.length > 0 ? (
                            availableTrucks.map(truck => (
                              <SelectItem key={truck.id} value={truck.id}>
                                {truck.plateNo} - {truck.capacity} - GPS Enabled
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>No available GPS-enabled trucks</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {availableTrucks.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">
                          No GPS-enabled trucks available. Please add trucks with GPS from the Trucks page.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setSelectedDriver('');
                      setSelectedTruck('');
                    }}>Cancel</Button>
                    <Button 
                      disabled={!selectedDriver || !selectedTruck}
                      onClick={() => {
                        assignDriver(order.id, selectedDriver, selectedTruck);
                        updateOrderStatus(order.id, 'in-transit', `Assigned to driver ID: ${selectedDriver} with truck ID: ${selectedTruck}`);
                        navigate('/');
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Confirm Assignment & Start Transit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        );
      case 'in-transit':
        return (
          <div className="space-y-4">
            <div className="bg-blue-500/10 p-4 rounded-md border border-blue-500/20">
              <div className="flex items-center mb-2">
                <Truck size={18} className="text-blue-500 mr-2" />
                <h3 className="font-medium">In Transit</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Order is currently in transit. You can track the detailed journey on the tracking page.
              </p>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate(`/track/${order.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <MapPin size={16} className="mr-2" />
                  Live Tracking
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                      <CheckCircle size={16} className="mr-2" />
                      Complete Delivery
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Delivery</DialogTitle>
                      <DialogDescription>
                        Please enter the final volume measured at delivery.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="initialVolume">Volume at Loading</Label>
                          <span className="text-sm text-muted-foreground">{order.quantity} litres</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deliveredVolume">Volume at Delivery</Label>
                          <Input
                            id="deliveredVolume"
                            value={deliveredVolume}
                            onChange={(e) => setDeliveredVolume(e.target.value)}
                            placeholder="Enter measured volume in litres"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        disabled={!deliveredVolume}
                        onClick={() => {
                          completeDelivery(order.id, deliveredVolume);
                          navigate('/');
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        Confirm Delivery
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="bg-green-500/10 p-4 rounded-md border border-green-500/20">
            <div className="flex items-center mb-2">
              <CheckCircle size={18} className="text-green-500 mr-2" />
              <h3 className="font-medium">Delivery Completed</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This order has been successfully delivered and completed.
            </p>
            {order.notes && (
              <div className="mt-4 text-sm">
                <span className="font-medium">Notes:</span> {order.notes}
              </div>
            )}
          </div>
        );
      case 'flagged':
        return (
          <div className="bg-red-500/10 p-4 rounded-md border border-red-500/20">
            <div className="flex items-center mb-2">
              <AlertTriangle size={18} className="text-red-500 mr-2" />
              <h3 className="font-medium">Order Flagged</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This order has been flagged due to volume discrepancy.
            </p>
            {order.notes && (
              <div className="mt-4 text-sm">
                <span className="font-medium">Notes:</span> {order.notes}
              </div>
            )}
            <Button variant="destructive" className="mt-4">
              Initiate Investigation
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  // Get assigned driver and truck details
  const assignedDriver = drivers.find(d => d.id === order?.driver_id);
  const assignedTruck = trucks.find(t => t.id === order?.assigned_truck_id);

  return (
    <div className="min-h-screen bg-dark text-foreground py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center">
              Purchase Order: {order?.po_number}
            </h1>
            <div className="flex items-center mt-1">
              <Badge className={`${order ? getStatusColor(order.status) : ''}`}>
                {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
              </Badge>
              <span className="mx-2 text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Created: {order?.date}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-dark-lighter border-border/20">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Product Information</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Product Type:</span>
                          <span>{order.productType}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span>{order.quantity} litres</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Price Per Litre:</span>
                          <span>{order.pricePerLitre}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">{order.totalAmount}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Delivery Information</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Loading Location:</span>
                          <span>{order.loadingLocation}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Destination:</span>
                          <span>{order.destination}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Expected Loading Date:</span>
                          <span>{order.expectedLoadingDate}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Payment Information</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Payment Reference:</span>
                          <span>{order.paymentReference}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Bank Name:</span>
                          <span>{order.bankName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Payment Date:</span>
                          <span>{order.paymentDate}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Amount Paid:</span>
                          <span>{order.amountPaid}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Payment Type:</span>
                          <span>{order.paymentType}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Authorization</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Authorized By:</span>
                          <span>{order.authorizedBy}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Position:</span>
                          <span>{order.authorizedPosition}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span>{order.authorizedCompany}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {(assignedDriver || assignedTruck) && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-4">Transport Details</h3>
                        <ul className="space-y-2">
                          {assignedDriver && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Assigned Driver:</span>
                              <span>
                                {assignedDriver.name} ({assignedDriver.license_no})
                              </span>
                            </li>
                          )}
                          {assignedTruck && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Assigned Truck:</span>
                              <span>
                                {assignedTruck.plate_no} - {assignedTruck.capacity}
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {(order.volumeAtDelivery || order.deliveryDate) && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-4">Delivery Results</h3>
                        <ul className="space-y-2">
                          {order.volumeAtLoading && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Volume at Loading:</span>
                              <span>{order.volumeAtLoading} litres</span>
                            </li>
                          )}
                          {order.volumeAtDelivery && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Volume at Delivery:</span>
                              <span>{order.volumeAtDelivery} litres</span>
                            </li>
                          )}
                          {order.deliveryDate && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Delivery Date:</span>
                              <span>{order.deliveryDate}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-dark-lighter border-border/20">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>
                  Current status and available actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderActions()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

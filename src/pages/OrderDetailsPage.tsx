
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, AlertTriangle, Truck, MapPin } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, assignDriver, completeDelivery, setActiveOrder } = useOrders();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');
  const [deliveredVolume, setDeliveredVolume] = useState('');
  
  // Sample data for demo
  const drivers = [
    { id: 'd1', name: 'Emmanuel Okafor', licenseNo: 'L123456', status: 'available' },
    { id: 'd2', name: 'Funmi Adebayo', licenseNo: 'L789012', status: 'available' },
  ];
  
  const trucks = [
    { id: 't1', plateNo: 'LAG-123-XY', capacity: '33,000L', status: 'available' },
    { id: 't2', plateNo: 'ABJ-456-ZA', capacity: '45,000L', status: 'available' },
  ];

  // Find the current order
  const order = orders.find(o => o.id === id);

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
              <Button onClick={() => updateOrderStatus(order.id, 'active', 'Payment verified successfully')}>
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
                Payment has been verified. Assign a driver and truck to start delivery.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Truck size={16} className="mr-2" />
                    Assign Driver & Truck
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Driver & Truck</DialogTitle>
                    <DialogDescription>
                      Select from available drivers and trucks to handle this delivery.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver">Select Driver</Label>
                      <select 
                        id="driver"
                        className="w-full px-3 py-2 bg-dark border border-border rounded-md"
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                      >
                        <option value="">-- Select Driver --</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} - License: {driver.licenseNo}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="truck">Select Truck</Label>
                      <select 
                        id="truck"
                        className="w-full px-3 py-2 bg-dark border border-border rounded-md"
                        value={selectedTruck}
                        onChange={(e) => setSelectedTruck(e.target.value)}
                      >
                        <option value="">-- Select Truck --</option>
                        {trucks.map(truck => (
                          <option key={truck.id} value={truck.id}>
                            {truck.plateNo} - Capacity: {truck.capacity}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      disabled={!selectedDriver || !selectedTruck}
                      onClick={() => {
                        assignDriver(order.id, selectedDriver, selectedTruck);
                        updateOrderStatus(order.id, 'in-transit', `Assigned to driver ID: ${selectedDriver} with truck ID: ${selectedTruck}`);
                        navigate(`/`); // Redirect to GPS tracking
                      }}
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
                Order is currently in transit. You can track the location on the GPS Tracking page.
              </p>
              
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <MapPin size={16} className="mr-2" />
                  View on GPS Tracking
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
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
              Purchase Order: {order.poNumber}
            </h1>
            <div className="flex items-center mt-1">
              <Badge className={`${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="mx-2 text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Created: {order.date}</span>
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
                  
                  {(order.driverId || order.assignedTruckId) && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-4">Transport Details</h3>
                        <ul className="space-y-2">
                          {order.driverId && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Assigned Driver:</span>
                              <span>
                                {drivers.find(d => d.id === order.driverId)?.name || 'Unknown Driver'}
                              </span>
                            </li>
                          )}
                          {order.assignedTruckId && (
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Assigned Truck:</span>
                              <span>
                                {trucks.find(t => t.id === order.assignedTruckId)?.plateNo || 'Unknown Truck'}
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

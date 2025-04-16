import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useOrders } from '@/context/OrderContext';
import { PurchaseOrder, OrderStatus } from '@/types/orders';

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, { message: "PO Number is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  depotManager: z.string().min(1, { message: "Depot Manager is required" }),
  depotLocation: z.string().min(1, { message: "Depot Location is required" }),
  productType: z.string().min(1, { message: "Product Type is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  pricePerLitre: z.string().min(1, { message: "Price Per Litre is required" }),
  totalAmount: z.string().min(1, { message: "Total Amount is required" }),
  loadingLocation: z.string().min(1, { message: "Loading Location is required" }),
  destination: z.string().min(1, { message: "Destination is required" }),
  expectedLoadingDate: z.string().min(1, { message: "Expected Loading Date is required" }),
  truckPlateNumber: z.string().optional(),
  transportCompany: z.string().optional(),
  paymentReference: z.string().min(1, { message: "Payment Reference is required" }),
  bankName: z.string().min(1, { message: "Bank Name is required" }),
  paymentDate: z.string().min(1, { message: "Payment Date is required" }),
  amountPaid: z.string().min(1, { message: "Amount Paid is required" }),
  paymentType: z.string().min(1, { message: "Payment Type is required" }),
  authorizedBy: z.string().min(1, { message: "Authorized By is required" }),
  authorizedPosition: z.string().min(1, { message: "Position is required" }),
  authorizedCompany: z.string().min(1, { message: "Company Name is required" }),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

const CreatePurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder, setActiveOrder } = useOrders();
  
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: `FS/NNPC/PO/${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      depotManager: 'Depot Manager',
      depotLocation: 'NNPC Depot – Apapa, Lagos',
      productType: 'PMS (Petrol)',
      quantity: '33,000',
      pricePerLitre: '',
      totalAmount: '',
      loadingLocation: 'NNPC Depot, Apapa, Lagos',
      destination: '',
      expectedLoadingDate: new Date().toISOString().split('T')[0],
      paymentType: 'Full Payment',
    },
  });

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    try {
      const newOrder: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'> = {
        po_number: data.poNumber,
        date: data.date,
        depot_manager: data.depotManager,
        depot_location: data.depotLocation,
        product_type: data.productType,
        quantity: data.quantity,
        price_per_litre: data.pricePerLitre,
        total_amount: data.totalAmount,
        loading_location: data.loadingLocation,
        destination: data.destination,
        expected_loading_date: data.expectedLoadingDate,
        truck_plate_number: data.truckPlateNumber,
        transport_company: data.transportCompany,
        payment_reference: data.paymentReference,
        bank_name: data.bankName,
        payment_date: data.paymentDate,
        amount_paid: data.amountPaid,
        payment_type: data.paymentType,
        authorized_by: data.authorizedBy,
        authorized_position: data.authorizedPosition,
        authorized_company: data.authorizedCompany,
        status: 'pending' as OrderStatus,
        origin: [3.3792, 6.4550],
        destination_coords: [3.3886, 6.4281],
      };
      
      await addOrder(newOrder);
      toast.success('Purchase order created successfully!', {
        description: 'Order is now pending payment verification.',
      });
      
      // Find the newly created order from the orders list
      // and set it as active before navigating
      navigate('/');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to create order', {
        description: 'Please try again or contact support if the issue persists.',
      });
    }
  };

  const calculateTotal = () => {
    const quantity = parseFloat(form.getValues('quantity').replace(/,/g, '')) || 0;
    const price = parseFloat(form.getValues('pricePerLitre').replace(/,/g, '').replace('₦', '')) || 0;
    const total = quantity * price;
    
    if (!isNaN(total)) {
      form.setValue('totalAmount', `₦${total.toLocaleString()}`);
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
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Create Purchase Order
          </h1>
        </div>

        <Card className="bg-dark-lighter border-border/20">
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PO Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="depotManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depot Manager</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="depotLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depot Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 bg-dark border border-border/10 rounded-md">
                  <h3 className="font-medium mb-4">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FormField
                      control={form.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity (Litres)</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              setTimeout(calculateTotal, 100);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerLitre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Litre (₦)</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              setTimeout(calculateTotal, 100);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Amount (₦)</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 bg-dark border border-border/10 rounded-md">
                  <h3 className="font-medium mb-4">Delivery Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="loadingLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loading Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expectedLoadingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Loading Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="truckPlateNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Truck Plate Number (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transportCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transport Company (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 bg-dark border border-border/10 rounded-md">
                  <h3 className="font-medium mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Reference Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Payment</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amountPaid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Paid</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 bg-dark border border-border/10 rounded-md">
                  <h3 className="font-medium mb-4">Authorization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="authorizedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorized By</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorizedCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Purchase Order
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Note:</p>
              <p>All loading is subject to depot availability, confirmation of payment, and compliance with all NNPC regulations.</p>
              <p className="mt-4 font-semibold">Compliance Note:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>DPR regulations (Petroleum storage and sale licenses)</li>
                <li>PPPRA or NMDPRA pricing guides (if applicable)</li>
                <li>NNPC downstream product allocation schedules</li>
                <li>Customs clearance & PEF (Petroleum Equalisation Fund) procedures for inter-state haulage</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;

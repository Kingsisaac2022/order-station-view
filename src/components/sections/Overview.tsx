import React from 'react';
import DashboardPanel from '../DashboardPanel';
import { BarChart2, TrendingUp, Clock, Activity, Truck, Fuel, DollarSign, Users, Database, AlertCircle, Package, CheckCircle, Clock4, MapPin } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { OrderStatus } from '@/types/orders';
import { useFleet } from '@/context/FleetContext';
import LinearTrackingView from '../tracking/LinearTrackingView';
import { useNavigate } from 'react-router-dom';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { trucks } = useFleet();
  
  // Calculate order statistics
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const activeOrders = orders.filter(order => order.status === 'active').length;
  const inTransitOrders = orders.filter(order => order.status === 'in-transit').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const flaggedOrders = orders.filter(order => order.status === 'flagged').length;
  
  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => {
      const amount = parseFloat(order.total_amount.replace(/[^\d.-]/g, '')) || 0;
      return sum + amount;
    }, 0);
  
  // Get trucks in transit with calculated progress
  const trucksInTransit = orders
    .filter(order => order.status === 'in-transit')
    .map(order => {
      const truck = trucks.find(t => t.id === order.assigned_truck_id);
      if (!truck) return null;

      // Calculate progress
      let progress = 0;
      if (order.origin && order.destination_coords && order.current_location) {
        const [startLng, startLat] = order.origin;
        const [endLng, endLat] = order.destination_coords;
        const [currentLng, currentLat] = order.current_location;
        
        const totalDistLng = endLng - startLng;
        const totalDistLat = endLat - startLat;
        const totalDist = Math.sqrt(totalDistLng * totalDistLng + totalDistLat * totalDistLat);
        
        const progressLng = currentLng - startLng;
        const progressLat = currentLat - startLat;
        const progressDist = Math.sqrt(progressLng * progressLng + progressLat * progressLat);
        
        progress = (progressDist / totalDist) * 100;
        progress = Math.max(0, Math.min(100, progress));
      }

      return {
        id: truck.id,
        orderId: order.id,
        plateNo: truck.plate_no,
        model: truck.model,
        progress,
        journeyInfo: order.journey_info || []
      };
    })
    .filter((truck): truck is NonNullable<typeof truck> => truck !== null);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <>
      <DashboardPanel title="System Overview" icon={<BarChart2 size={16} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Total Revenue</h4>
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {completedOrders} completed orders
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">System Uptime</h4>
              <Clock size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">0h 0m</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Station Status</h4>
              <Activity size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">Offline</div>
            <div className="text-xs text-muted-foreground mt-2">No data available</div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Today's Transactions</h4>
              <BarChart2 size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-semibold">{orders.length}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {orders.length > 0 ? `${activeOrders} active` : 'No orders available'}
            </div>
          </div>
        </div>
      </DashboardPanel>
      
      <DashboardPanel title="Order Status" icon={<Package size={16} />} className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="stat-card bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-yellow-500">Pending</h4>
              <Clock4 size={16} className="text-yellow-500" />
            </div>
            <div className="text-2xl font-semibold text-yellow-500">{pendingOrders}</div>
            <div className="text-xs text-yellow-500/70 mt-2">Awaiting payment</div>
          </div>
          
          <div className="stat-card bg-purple-500/10 border border-purple-500/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-purple-500">Active</h4>
              <Activity size={16} className="text-purple-500" />
            </div>
            <div className="text-2xl font-semibold text-purple-500">{activeOrders}</div>
            <div className="text-xs text-purple-500/70 mt-2">Ready for delivery</div>
          </div>
          
          <div className="stat-card bg-blue-500/10 border border-blue-500/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-blue-500">In Transit</h4>
              <Truck size={16} className="text-blue-500" />
            </div>
            <div className="text-2xl font-semibold text-blue-500">{inTransitOrders}</div>
            <div className="text-xs text-blue-500/70 mt-2">En route to destination</div>
          </div>
          
          <div className="stat-card bg-green-500/10 border border-green-500/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-green-500">Completed</h4>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <div className="text-2xl font-semibold text-green-500">{completedOrders}</div>
            <div className="text-xs text-green-500/70 mt-2">Successfully delivered</div>
          </div>
          
          <div className="stat-card bg-red-500/10 border border-red-500/20">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-red-500">Flagged</h4>
              <AlertCircle size={16} className="text-red-500" />
            </div>
            <div className="text-2xl font-semibold text-red-500">{flaggedOrders}</div>
            <div className="text-xs text-red-500/70 mt-2">Requires attention</div>
          </div>
        </div>
      </DashboardPanel>
      
      {trucksInTransit.length > 0 && (
        <DashboardPanel title="Active Deliveries" icon={<Truck size={16} />} className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {trucksInTransit.length} truck{trucksInTransit.length !== 1 ? 's' : ''} currently en route
                </p>
              </div>
              <button 
                onClick={() => navigate('/')} 
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <MapPin size={12} />
                <span>View GPS Tracking</span>
              </button>
            </div>
            
            <div className="border border-border/20 rounded-md p-4 bg-dark-lighter">
              <LinearTrackingView trucks={trucksInTransit} />
            </div>
          </div>
        </DashboardPanel>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DashboardPanel title="Fleet Status" icon={<Truck size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Trucks</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Drivers on Shift</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Fuel Inventory" icon={<Database size={16} />}>
          <div className="grid grid-cols-3 gap-3">
            {['PMS', 'AGO', 'DPK'].map((type, index) => (
              <div key={index} className="stat-card p-3">
                <h4 className="text-sm font-medium text-muted-foreground">{type}</h4>
                <div className="text-base font-semibold mt-2">0L</div>
                <div className="h-2 bg-dark rounded-full mt-2">
                  <div className="h-2 bg-primary rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Sales Summary" icon={<DollarSign size={16} />}>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-base font-medium">₦0.00</span>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Dispensers" icon={<Fuel size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Active</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Volume</h4>
              <div className="text-xl font-semibold">0L</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Staff" icon={<Users size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">On Shift</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
            <div className="stat-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Off Duty</h4>
              <div className="text-xl font-semibold">0</div>
            </div>
          </div>
        </DashboardPanel>
        
        <DashboardPanel title="Alert Summary" icon={<AlertCircle size={16} />}>
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Critical</h4>
              <div className="text-base font-semibold mt-2 text-red-500">0</div>
            </div>
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Warning</h4>
              <div className="text-base font-semibold mt-2 text-amber-500">0</div>
            </div>
            <div className="stat-card p-3">
              <h4 className="text-sm font-medium text-muted-foreground">Info</h4>
              <div className="text-base font-semibold mt-2 text-primary">0</div>
            </div>
          </div>
        </DashboardPanel>
      </div>
      
      <div className="mt-6 p-6 rounded-md bg-dark-lighter border border-border/20 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Daily performance chart placeholder</div>
      </div>
    </>
  );
};

export default Overview;

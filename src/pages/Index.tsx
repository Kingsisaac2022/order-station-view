
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import Logo from '../components/Logo';
import { useOrders } from '@/context/OrderContext';

const Index = () => {
  // Set initial activeSection to gps-tracking to show active deliveries first
  const [activeSection, setActiveSection] = useState('gps-tracking');
  const { orders } = useOrders();

  // Set focus to GPS tracking when there are active or in-transit orders
  useEffect(() => {
    const hasActiveDeliveries = orders.some(order => 
      order.status === 'active' || order.status === 'in-transit'
    );
    
    if (hasActiveDeliveries && activeSection !== 'gps-tracking') {
      setActiveSection('gps-tracking');
    }
  }, [orders]);

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <main className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <Logo />
        </div>
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <div className="mt-6">
          <Dashboard activeSection={activeSection} />
        </div>
      </main>
    </div>
  );
};

export default Index;

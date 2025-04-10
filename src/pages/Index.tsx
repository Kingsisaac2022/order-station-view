
import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen flex flex-col bg-dark text-foreground">
      <Header />
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <main className="flex-grow py-6">
        <Dashboard activeSection={activeSection} />
      </main>
    </div>
  );
};

export default Index;

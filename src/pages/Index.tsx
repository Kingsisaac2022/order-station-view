
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import Logo from '../components/Logo';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-dark text-foreground">
      <main className="container mx-auto px-4 py-10">
        <Logo />
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

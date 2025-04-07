
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center py-12 bg-background">
        <Outlet />
      </div>
      
      {/* Right side - Branded background */}
      <div 
        className="hidden md:block md:w-1/2 relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-brand-blue/30 backdrop-blur-sm" />
        <div className="relative z-10 max-w-md text-white p-12 h-full flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
              <span className="text-brand-blue font-semibold text-2xl">P</span>
            </div>
            <span className="font-medium text-3xl">Pulse</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Monitor your brand's social presence
          </h2>
          
          <p className="text-lg text-white/90">
            Track mentions, analyze sentiment, and gain valuable insights with our AI-powered social media listening platform.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-white/80">Customer satisfaction</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Continuous monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

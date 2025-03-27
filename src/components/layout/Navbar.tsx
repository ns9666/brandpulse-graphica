
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Bell, Home, List, MessageSquare, Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Mentions', path: '/mentions', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 border-b smooth-transition backdrop-blur-md',
      isScrolled ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-800/50' 
                 : 'bg-transparent border-transparent'
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <span className="text-white font-semibold text-lg">P</span>
            </div>
            <span className="font-medium text-xl hidden sm:inline-block">Pulse</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link 
                key={link.name}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-md flex items-center gap-2 smooth-transition',
                  isActive 
                    ? 'bg-brand-blue text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <List size={20} />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 animate-fade-in">
          <div className="container pt-4">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">P</span>
                </div>
                <span className="font-medium text-xl">Pulse</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link 
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-md flex items-center gap-3 smooth-transition text-lg',
                      isActive 
                        ? 'bg-brand-blue text-white' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <Icon size={22} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-md flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 smooth-transition text-lg mt-4"
              >
                <Settings size={22} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

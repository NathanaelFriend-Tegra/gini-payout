import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { RotateCcw } from 'lucide-react';

// Routes that show the bottom nav
const NAV_ROUTES = ['/home', '/withdraw', '/spend', '/support', '/txns', '/settings'];

// Routes that don't show header back button
const NO_BACK_ROUTES = ['/home', '/c/', '/'];

export const AppShell: React.FC = () => {
  const location = useLocation();
  
  const showBottomNav = NAV_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );
  
  const showBackButton = !NO_BACK_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith('/c/')
  );

  return (
    <>
      {/* Landscape blocker overlay */}
      <div className="landscape-blocker hidden fixed inset-0 z-[9999] bg-primary flex-col items-center justify-center text-primary-foreground p-8 text-center">
        <RotateCcw className="w-16 h-16 mb-4 animate-spin" style={{ animationDuration: '3s' }} />
        <h2 className="text-xl font-bold mb-2">Please rotate your device</h2>
        <p className="text-primary-foreground/80">GiniPayout works best in portrait mode</p>
      </div>

      {/* Main app content */}
      <div className="app-content min-h-screen bg-background flex flex-col">
        <Header showBack={showBackButton} />
        
        <main className={`flex-1 ${showBottomNav ? 'pb-nav' : 'pb-6'}`}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
        
        {showBottomNav && <BottomNav />}
      </div>
    </>
  );
};

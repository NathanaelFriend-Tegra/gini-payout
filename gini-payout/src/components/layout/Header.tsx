import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, X, HelpCircle, Settings, LogOut, ChevronRight } from 'lucide-react';
import logo from '@/assets/logo.jpeg';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

// Route to title mapping
const routeTitles: Record<string, string> = {
  '/home': 'GiniPayout',
  '/withdraw': 'Withdraw',
  '/withdraw/eft': 'EFT Withdraw',
  '/withdraw/cash': 'Cash at ATM',
  '/spend': 'Spend',
  '/spend/airtime': 'Airtime',
  '/spend/data': 'Data',
  '/spend/bills': 'Bill Payments',
  '/spend/voucher': 'Voucher Payment',
  '/spend/qrpay': 'Pay by QR',
  '/spend/electricity': 'Electricity',
  '/txns': 'Transactions',
  '/support': 'Support',
  '/support/chat': 'Support Chat',
  '/support/faqs': 'FAQs',
  '/settings': 'Settings',
  '/onboard': 'Your Details',
  '/otp': 'Verify',
};

export const Header: React.FC<HeaderProps> = ({ showBack = true, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayTitle = title || routeTitles[location.pathname] || 'GiniPayout';
  const isClaimRoute = location.pathname.startsWith('/c/');
  const isHome = location.pathname === '/home';
  const finalTitle = isClaimRoute ? 'Claim Payout' : displayTitle;

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    toast.success('Logged out successfully');
    signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-header px-4">
          {/* Left: back button + logo + title */}
          <div className="flex items-center gap-3">
            {showBack && !isHome && !isClaimRoute && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <img src={logo} alt="Gini Payout" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-semibold text-foreground">
                {isHome || isClaimRoute ? 'Gini Payout' : finalTitle}
              </span>
            </div>
          </div>

          {/* Right: burger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          <div>
            <p className="font-semibold text-foreground">{user?.displayName || 'My Account'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.mobileNumber || ''}</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Drawer items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          <button
            onClick={() => handleNavigate('/support')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-blue-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">Support</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">Settings</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Logout at bottom */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <span className="text-sm font-medium text-destructive">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};
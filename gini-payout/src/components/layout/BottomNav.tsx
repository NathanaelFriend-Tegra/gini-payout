import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowDownToLine, ShoppingBag, MessageCircle } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  matchPaths?: string[];
}

const navItems: NavItem[] = [
  { 
    path: '/home', 
    label: 'Home', 
    icon: <Home className="w-5 h-5" />,
  },
  { 
    path: '/spend', 
    label: 'Spend', 
    icon: <ShoppingBag className="w-5 h-5" />,
    matchPaths: ['/spend'],
  },
  { 
    path: '/withdraw', 
    label: 'Withdraw', 
    icon: <ArrowDownToLine className="w-5 h-5" />,
    matchPaths: ['/withdraw'],
  },
  { 
    path: '/support', 
    label: 'Support', 
    icon: <MessageCircle className="w-5 h-5" />,
    matchPaths: ['/support'],
  },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    if (item.matchPaths) {
      return item.matchPaths.some(p => location.pathname.startsWith(p));
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-nav max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

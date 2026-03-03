import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDownToLine, 
  ShoppingBag, 
  Receipt, 
  MessageCircle,
  Smartphone,
  Wifi,
  FileText,
  Ticket,
  QrCode,
  Zap
} from 'lucide-react';

interface ActionItem {
  label: string;
  to: string;
  icon: string;
  description?: string;
}

interface ActionGridProps {
  items: ActionItem[];
  columns?: 2 | 3 | 4;
}

const iconMap: Record<string, React.ReactNode> = {
  cash: <ArrowDownToLine className="w-6 h-6" />,
  shopping: <ShoppingBag className="w-6 h-6" />,
  list: <Receipt className="w-6 h-6" />,
  chat: <MessageCircle className="w-6 h-6" />,
  phone: <Smartphone className="w-6 h-6" />,
  wifi: <Wifi className="w-6 h-6" />,
  bill: <FileText className="w-6 h-6" />,
  voucher: <Ticket className="w-6 h-6" />,
  qr: <QrCode className="w-6 h-6" />,
  electricity: <Zap className="w-6 h-6" />,
};

export const ActionGrid: React.FC<ActionGridProps> = ({ items, columns = 4 }) => {
  const navigate = useNavigate();

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {items.map((item) => (
        <button
          key={item.to}
          onClick={() => navigate(item.to)}
          className="action-item"
        >
          <div className="text-primary">
            {iconMap[item.icon] || <ShoppingBag className="w-6 h-6" />}
          </div>
          <span className="text-sm font-medium text-foreground">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

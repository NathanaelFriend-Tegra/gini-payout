import React from 'react';
import { Building2, Banknote, QrCode, ShoppingBag } from 'lucide-react';

interface FeatureItem {
  icon: 'bank' | 'cash' | 'qr' | 'spend';
  title: string;
  description: string;
}

interface FeatureListProps {
  title: string;
  items: FeatureItem[];
}

const iconMap = {
  bank: Building2,
  cash: Banknote,
  qr: QrCode,
  spend: ShoppingBag,
};

export const FeatureList: React.FC<FeatureListProps> = ({ title, items }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      
      <div className="grid gap-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border shadow-sm"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

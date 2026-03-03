import React from 'react';

interface InfoItem {
  label: string;
  value: string | React.ReactNode;
  optional?: boolean;
}

interface InfoCardProps {
  title?: string;
  items: InfoItem[];
  variant?: 'default' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
};

export const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  items,
  variant = 'default'
}) => {
  const filteredItems = items.filter(item => !item.optional || item.value);

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]}`}>
      {title && (
        <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      )}
      <div className="space-y-2">
        {filteredItems.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-4">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

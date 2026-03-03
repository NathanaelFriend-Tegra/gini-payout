import React from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  variant?: 'inline' | 'banner' | 'compact';
  message?: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  variant = 'inline',
  message,
  className,
}) => {
  if (variant === 'banner') {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/20 rounded-lg",
        className
      )}>
        <Shield className="w-4 h-4 text-success shrink-0" />
        <p className="text-xs text-success font-medium">
          {message || 'Your funds are protected by bank-grade encryption'}
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-1.5 text-muted-foreground",
        className
      )}>
        <Lock className="w-3 h-3" />
        <span className="text-xs">{message || 'Secure & encrypted'}</span>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border",
      className
    )}>
      <div className="flex items-center gap-1.5">
        <Shield className="w-4 h-4 text-success" />
        <span className="text-xs font-medium text-foreground">Verified & Secure</span>
      </div>
      <div className="h-3 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">256-bit SSL</span>
      </div>
    </div>
  );
};

export const SecurityNotice: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    "flex items-start gap-2.5 p-3 bg-primary/5 border border-primary/10 rounded-lg",
    className
  )}>
    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
    <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

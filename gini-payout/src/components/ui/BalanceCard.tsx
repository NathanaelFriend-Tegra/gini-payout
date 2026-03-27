import React from 'react';
import { Banknote } from 'lucide-react';

interface BalanceCardProps {
  cashBalance: string;
  walletRef?: string;
  loading?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  cashBalance,
  walletRef,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-primary rounded-2xl p-6 shadow-lg shadow-primary/25">
        <div className="h-4 w-24 bg-white/30 rounded animate-pulse mb-4" />
        <div className="h-10 w-36 bg-white/30 rounded-lg animate-pulse" />
        <div className="h-3 w-20 bg-white/20 rounded mt-2 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.01] active:scale-[0.99]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Banknote className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium opacity-90">Cash Balance</span>
        </div>

        <p className="text-4xl font-bold tracking-tight">{cashBalance}</p>
        <p className="text-xs opacity-70 mt-1">Available to withdraw</p>
      </div>

      {walletRef && (
        <p className="text-xs text-muted-foreground text-center pt-1">{walletRef}</p>
      )}
    </div>
  );
};
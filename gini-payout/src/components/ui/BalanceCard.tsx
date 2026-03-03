import React from 'react';
import { Banknote, CreditCard, ChevronRight, Store } from 'lucide-react';
import { StoreCreditBalance } from '@/lib/mockData';

interface BalanceCardProps {
  cashBalance: string;
  storeCredits: StoreCreditBalance[];
  totalStoreCredit: string;
  walletRef?: string;
  loading?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  cashBalance,
  storeCredits,
  totalStoreCredit,
  walletRef,
  loading = false 
}) => {
  const [expanded, setExpanded] = React.useState(false);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary rounded-2xl p-5 shadow-lg">
            <div className="h-4 w-20 bg-white/30 rounded animate-pulse mb-3" />
            <div className="h-9 w-28 bg-white/30 rounded-lg animate-pulse" />
          </div>
          <div className="bg-accent rounded-2xl p-5 shadow-lg">
            <div className="h-4 w-20 bg-white/30 rounded animate-pulse mb-3" />
            <div className="h-9 w-28 bg-white/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        {/* Cash Refund - Solid Blue */}
        <div className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98] flex flex-col">
          <div className="flex items-center gap-2 mb-auto">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium opacity-90">Cash Refund</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight">{cashBalance}</p>
            <p className="text-xs opacity-70 mt-1">Available to withdraw</p>
          </div>
        </div>

        {/* Store Credit - Expandable */}
        <button
          onClick={() => storeCredits.length > 1 && setExpanded(!expanded)}
          className="bg-accent rounded-2xl p-5 text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02] active:scale-[0.98] text-left w-full flex flex-col"
        >
          <div className="flex items-center gap-2 mb-auto">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium opacity-90 flex-1">Store Credit</span>
            {storeCredits.length > 1 && (
              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight">{totalStoreCredit}</p>
            <p className="text-xs opacity-70 mt-1">
              {storeCredits.length === 1 
                ? storeCredits[0].issuerName 
                : `${storeCredits.length} stores`}
            </p>
          </div>
        </button>
      </div>

      {/* Expanded Store Credit List */}
      {expanded && storeCredits.length > 1 && (
        <div className="bg-muted/50 rounded-xl p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-medium text-muted-foreground px-1">Store Credit Breakdown</p>
          {storeCredits.map((credit) => (
            <div 
              key={credit.issuerId}
              className="flex items-center justify-between bg-background rounded-lg px-3 py-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Store className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium">{credit.issuerName}</span>
              </div>
              <span className="text-sm font-semibold">{credit.balanceFormatted}</span>
            </div>
          ))}
        </div>
      )}
      
      {walletRef && (
        <p className="text-xs text-muted-foreground text-center pt-1">{walletRef}</p>
      )}
    </div>
  );
};

import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Smartphone, 
  Wifi, 
  Zap, 
  CreditCard,
  Ticket,
  QrCode,
  FileText,
  RotateCcw,
  Coins
} from 'lucide-react';
import { Transaction, transactionTypeLabels } from '@/lib/mockData';
import { formatRelativeTime } from '@/lib/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const typeIcons: Record<Transaction['type'], React.ReactNode> = {
  payout_credit: <ArrowDownLeft className="w-5 h-5" />,
  eft: <CreditCard className="w-5 h-5" />,
  cash: <Coins className="w-5 h-5" />,
  airtime: <Smartphone className="w-5 h-5" />,
  data: <Wifi className="w-5 h-5" />,
  billpay: <FileText className="w-5 h-5" />,
  voucher: <Ticket className="w-5 h-5" />,
  qrpay: <QrCode className="w-5 h-5" />,
  electricity: <Zap className="w-5 h-5" />,
  fee: <ArrowUpRight className="w-5 h-5" />,
  reversal: <RotateCcw className="w-5 h-5" />,
};

const statusColors: Record<Transaction['status'], string> = {
  pending: 'text-warning',
  success: 'text-foreground',
  failed: 'text-destructive',
  reversed: 'text-muted-foreground',
};

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="txn-item animate-pulse">
            <div className="w-10 h-10 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-secondary rounded" />
              <div className="h-3 w-20 bg-secondary rounded" />
            </div>
            <div className="h-5 w-16 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {transactions.map((txn) => (
        <div key={txn.id} className="txn-item">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            txn.direction === 'credit' 
              ? 'bg-success/10 text-success' 
              : 'bg-secondary text-muted-foreground'
          }`}>
            {typeIcons[txn.type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {transactionTypeLabels[txn.type]}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatRelativeTime(txn.createdAt)}
              {txn.status === 'pending' && (
                <span className="ml-2 text-warning">• Pending</span>
              )}
            </p>
          </div>
          
          <p className={`font-semibold money-display ${
            txn.direction === 'credit' ? 'text-success' : statusColors[txn.status]
          }`}>
            {txn.direction === 'credit' ? '+' : '-'}{txn.amountFormatted}
          </p>
        </div>
      ))}
    </div>
  );
};

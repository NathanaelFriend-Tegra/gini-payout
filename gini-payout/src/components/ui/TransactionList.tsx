import React, { useState } from 'react';
import { OmneaTxn } from '@/lib/api';
import { ChevronDown, ChevronUp, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

interface Props {
  transactions: OmneaTxn[];
  loading?: boolean;
}

const statusStyles: Record<string, string> = {
  COMPLETED:  'bg-emerald-100 text-emerald-700',
  PENDING:    'bg-amber-100  text-amber-700',
  CANCELLED:  'bg-red-100    text-red-600',
  FAILED:     'bg-red-100    text-red-600',
  PROCESSING: 'bg-blue-100   text-blue-700',
};

const typeIcon = (type?: string) => {
  if (!type) return <RefreshCw className="h-4 w-4" />;
  const t = type.toUpperCase();
  if (t.includes('CREDIT') || t.includes('DEPOSIT') || t.includes('RECEIVE'))
    return <ArrowDownLeft className="h-4 w-4 text-emerald-600" />;
  if (t.includes('DEBIT') || t.includes('WITHDRAWAL') || t.includes('SEND'))
    return <ArrowUpRight className="h-4 w-4 text-rose-500" />;
  return <RefreshCw className="h-4 w-4 text-muted-foreground" />;
};

const fmt = (n?: number) =>
  n == null ? '—' : new Intl.NumberFormat('en-ZA', { minimumFractionDigits: 2 }).format(n);

const fmtDate = (d?: string) => {
  if (!d) return '—';
  const date = new Date(d);
  return new Intl.DateTimeFormat('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
};

const Row = ({ label, value }: { label: string; value?: string | number | null }) =>
  value != null && value !== '' && value !== 'string' ? (
    <div className="flex justify-between gap-4 py-1 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-right font-medium break-all">{String(value)}</span>
    </div>
  ) : null;

const TransactionCard: React.FC<{ txn: OmneaTxn }> = ({ txn }) => {
  const [open, setOpen] = useState(false);
  const status = txn.transactionStatus ?? 'UNKNOWN';
  const statusClass = statusStyles[status] ?? 'bg-muted text-muted-foreground';
  const isCredit = txn.movementAmount != null && txn.movementAmount > 0;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Summary row — always visible */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          {typeIcon(txn.transactionType)}
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {txn.siteName || txn.transactionType || 'Transaction'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {txn.description || txn.message || txn.serviceCode || fmtDate(txn.created)}
          </p>
        </div>

        {/* Amount + status */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-sm font-semibold ${isCredit ? 'text-emerald-600' : 'text-foreground'}`}>
            {isCredit ? '+' : ''}{fmt(txn.movementAmount ?? txn.amount)}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusClass}`}>
            {status}
          </span>
        </div>

        {/* Expand chevron */}
        <div className="ml-1 text-muted-foreground">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded detail panel */}
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-1 bg-muted/20 border-t border-border/50">
          <Row label="Date"            value={fmtDate(txn.created)} />
          <Row label="Transaction type" value={txn.transactionType} />
          <Row label="Status"           value={txn.transactionStatus} />
          <Row label="Amount"           value={fmt(txn.amount)} />
          <Row label="Movement amount"  value={fmt(txn.movementAmount)} />
          <Row label="Gratuity"         value={txn.gratuityAmount ? fmt(txn.gratuityAmount) : null} />

          {txn.fees && txn.fees.totalAmount > 0 && (
            <>
              <Row label="Fee (external)"  value={fmt(txn.fees.externalAmount)} />
              <Row label="Fee (internal)"  value={fmt(txn.fees.internalAmount)} />
              <Row label="VAT"             value={fmt(txn.fees.vatAmount)} />
              <Row label="Total fees"      value={fmt(txn.fees.totalAmount)} />
            </>
          )}

          <Row label="Description"    value={txn.description} />
          <Row label="Message"        value={txn.message} />
          <Row label="Site"           value={txn.siteName} />
          <Row label="Service code"   value={txn.serviceCode} />
          <Row label="Provider code"  value={txn.providerCode} />
          <Row label="Facility type"  value={txn.facilityType} />
          <Row label="Category"       value={[txn.category1, txn.category2, txn.category3].filter(Boolean).join(' › ')} />
          <Row label="Reference"      value={txn.txRefInfo || txn.systemRefInfo} />
          <Row label="Request ID"     value={txn.requestId} />
          <Row label="Transfer UUID"  value={txn.transferUuid} />
          <Row label="Last modified"  value={fmtDate(txn.lastModified)} />
        </div>
      )}
    </div>
  );
};

export const TransactionList: React.FC<Props> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No transactions to display
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((txn) => (
        <TransactionCard key={txn.uuid} txn={txn} />
      ))}
    </div>
  );
};
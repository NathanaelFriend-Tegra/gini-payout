import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionList } from '@/components/ui/TransactionList';
import { toast } from 'sonner';
import { Search, X, Calendar, ArrowUpDown } from 'lucide-react';

import { getTransactionHistory, getCurrentUser, OmneaTxn } from '@/lib/api';

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<OmneaTxn[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortDesc, setSortDesc] = useState(true); // default: newest first

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        const accountUuid = user?.accountUuid;

        if (!accountUuid) {
          navigate('/login');
          return;
        }

        const txnResponse = await getTransactionHistory(accountUuid);
        const raw: OmneaTxn[] = (txnResponse as any).values ?? txnResponse.transactions ?? [];
        setTransactions(raw);
      } catch (error) {
        console.error('❌ Failed to load transactions:', error);
        toast.error('Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((txn) => {
      const raw = txn as any;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        raw.description?.toLowerCase().includes(q) ||
        raw.amount?.toString().includes(q) ||
        raw.transactionType?.toLowerCase().includes(q) ||
        raw.siteName?.toLowerCase().includes(q) ||
        raw.message?.toLowerCase().includes(q) ||
        raw.serviceCode?.toLowerCase().includes(q);

      const txnDate = txn.created ? new Date(txn.created) : null;
      const matchesFrom = !dateFrom || (txnDate && txnDate >= new Date(dateFrom));
      const matchesTo =
        !dateTo ||
        (txnDate && txnDate <= new Date(new Date(dateTo).setHours(23, 59, 59, 999)));

      return matchesSearch && matchesFrom && matchesTo;
    });

    // Sort by `created` date
    return filtered.sort((a, b) => {
      const dateA = a.created ? new Date(a.created).getTime() : 0;
      const dateB = b.created ? new Date(b.created).getTime() : 0;
      return sortDesc ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, searchQuery, dateFrom, dateTo, sortDesc]);

  const hasActiveFilters = searchQuery || dateFrom || dateTo;

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <h2 className="text-base font-semibold">Transaction History</h2>
        <div className="w-12" />
      </div>

      {/* Search + controls row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortDesc((prev) => !prev)}
          title={sortDesc ? 'Showing newest first' : 'Showing oldest first'}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-input bg-background text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">{sortDesc ? 'Newest' : 'Oldest'}</span>
        </button>

        {/* Date filter toggle */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${dateFrom || dateTo
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input bg-background text-muted-foreground hover:text-foreground'
            }`}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Date</span>
        </button>
      </div>

      {/* Date filters (collapsible) */}
      {/* Date filters (collapsible) */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg bg-muted/50 border border-border">
          {[
            { label: 'From', value: dateFrom, set: setDateFrom },
            { label: 'To', value: dateTo, set: setDateTo },
          ].map(({ label, value, set }) => {
            const [y, m, d] = value ? value.split('-') : ['', '', ''];
            const update = (newY: string, newM: string, newD: string) => {
              if (newY && newM && newD) set(`${newY}-${newM}-${newD}`);
              else set('');
            };
            return (
              <div key={label} className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground font-medium">{label}</label>
                <div className="flex gap-1">
                  <input
                    type="number" placeholder="DD" min={1} max={31}
                    value={d || ''}
                    onChange={(e) => update(y, m, e.target.value.padStart(2, '0'))}
                    className="w-14 px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-center"
                  />
                  <input
                    type="number" placeholder="MM" min={1} max={12}
                    value={m || ''}
                    onChange={(e) => update(y, e.target.value.padStart(2, '0'), d)}
                    className="w-14 px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-center"
                  />
                  <input
                    type="number" placeholder="YYYY" min={2000} max={2100}
                    value={y || ''}
                    onChange={(e) => update(e.target.value, m, d)}
                    className="w-20 px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-center"
                  />
                </div>
              </div>
            );
          })}
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="self-end text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 pb-1.5"
            >
              Clear dates
            </button>
          )}
        </div>
      )}

      {/* Results summary + clear all */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {loading
            ? ''
            : filteredTransactions.length === 0
              ? hasActiveFilters
                ? 'No transactions match your filters'
                : 'No transactions yet'
              : `${filteredTransactions.length} of ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <TransactionList transactions={filteredTransactions} loading={loading} />
    </div>
  );
};

export default TransactionsPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionList } from '@/components/ui/TransactionList';
import { Transaction } from '@/lib/mockData';
import { toast } from 'sonner';

import { getTransactionHistory, getCurrentUser } from '@/lib/api';
import { mapApiTxnToUi } from '@/lib/txnMapper';

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.log('✅ Full transaction response:', txnResponse);

        // API returns `values`, not `transactions`
        const raw = (txnResponse as any).values ?? txnResponse.transactions ?? [];
        setTransactions(raw.map(mapApiTxnToUi));

      } catch (error) {
        console.error('❌ Failed to load transactions:', error);
        toast.error('Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <h2 className="text-base font-semibold">Transaction History</h2>
        <div className="w-12" /> {/* spacer to centre the title */}
      </div>

      <p className="text-xs text-muted-foreground">
        {transactions.length > 0
          ? `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`
          : loading ? '' : 'No transactions yet'}
      </p>

      <TransactionList transactions={transactions} loading={loading} />
    </div>
  );
};

export default TransactionsPage;
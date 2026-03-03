import React, { useEffect, useState } from 'react';
import { TransactionList } from '@/components/ui/TransactionList';
import { mockTransactions, Transaction } from '@/lib/mockData';
import { toast } from 'sonner';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setTransactions(mockTransactions);
      } catch (error) {
        toast.error('Could not load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="px-4 py-6">
      <TransactionList transactions={transactions} loading={loading} />
    </div>
  );
};

export default TransactionsPage;

import React, { useEffect, useState } from 'react';
import { CreditCard, Banknote, AlertCircle, Wallet } from 'lucide-react';
import { ListItem } from '@/components/ui/ListItem';
import { TrustBadge, SecurityNotice } from '@/components/ui/TrustBadge';
import { mockWalletSummary, WalletSummary } from '@/lib/mockData';
import { useNavigate } from "react-router-dom";
import { BalanceCard } from "@/components/ui/BalanceCard";
import { ActionGrid } from "@/components/ui/ActionGrid";
import { InfoCard } from "@/components/ui/InfoCard";
import { GiniButton } from "@/components/ui/GiniButton";
import { TransactionList } from "@/components/ui/TransactionList";
import { Transaction } from "@/lib/mockData"; // only keeping the type
import { toast } from "sonner";

import { getTransactionHistory, getAccountDetails, getCurrentUser } from "@/lib/api";
import { mapApiTxnToUi } from "@/lib/txnMapper";


const WithdrawPage: React.FC = () => {
 const navigate = useNavigate();
  const [balance, setBalance] = useState<string>("R0.00");
  const [walletRef, setWalletRef] = useState<string | undefined>(undefined);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        const accountUuid = user?.accountUuid;
        console.log('🏠 HomePage: current user:', user);

        if (!accountUuid) {
          console.warn('⚠️ No accountUuid found, redirecting to login');
          navigate('/login');
          return;
        }

        const [accountDetails, txnResponse] = await Promise.all([
          getAccountDetails(accountUuid),
          getTransactionHistory(accountUuid),
        ]);

        console.log('✅ Account details:', accountDetails);
        console.log('✅ Transactions raw response:', txnResponse);

        const available = accountDetails.availableBalanceAmount ?? 0;
        setBalance(
          new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(
            accountDetails.availableBalanceAmount ?? 0
          )
        );
        setWalletRef(accountDetails.uuid);

        const uiTxns = (txnResponse.transactions ?? []).map(mapApiTxnToUi);
        setAllTransactions(uiTxns);

      } catch (error) {
        console.error('❌ Failed to fetch home data:', error);
        toast.error("Could not load account data. Please retry.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="px-4 py-6 space-y-4">
      {/* Available Cash Balance */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
            <p className="text-2xl font-bold text-primary">{balance}</p>
          </div>
          <Banknote className="w-8 h-8 text-primary opacity-60" />
        </div>
      </div>

      {/* Store Credit Notice */}
      <div className="flex items-start gap-3 bg-muted rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Only your <strong>Cash Refund</strong> balance can be withdrawn. Store Credit can only be used for in-store purchases.
        </p>
      </div>

      <SecurityNotice>
        All withdrawals are verified and protected. You'll receive an SMS confirmation for every transaction.
      </SecurityNotice>

      <p className="text-muted-foreground">
        Choose how you'd like to withdraw your funds.
      </p>

      <div className="space-y-3">
        <ListItem
          title="EFT to bank account"
          subtitle="Send to your SA bank account (1-2 days)"
          to={balance ? "/withdraw/eft" : undefined}
          onClick={!balance ? () => {} : undefined}
          icon={<CreditCard className="w-5 h-5" />}
          disabled={!balance}
        />
        
        <ListItem
          title="Cash at ATM"
          subtitle="Withdraw at ABSA or Nedbank ATM"
          to={balance ? "/withdraw/cash" : undefined}
          onClick={!balance ? () => {} : undefined}
          icon={<Banknote className="w-5 h-5" />}
          disabled={!balance}
        />

        <ListItem
          title="Transfer to another iAccount"
          subtitle="Make Payments to another iAccount"
          to={balance ? "/iAccountTransfer" : undefined}
          onClick={!balance ? () => {} : undefined}
          icon={<Wallet className="w-5 h-5" />}
          disabled={!balance}
        />
      </div>

      {!balance && (
        <p className="text-sm text-destructive text-center">
          No cash balance available to withdraw
        </p>
      )}

      <TrustBadge variant="compact" className="justify-center" />
    </div>
  );
};

export default WithdrawPage;

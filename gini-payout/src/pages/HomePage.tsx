import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BalanceCard } from "@/components/ui/BalanceCard";
import { ActionGrid } from "@/components/ui/ActionGrid";
import { InfoCard } from "@/components/ui/InfoCard";
import { GiniButton } from "@/components/ui/GiniButton";
import { TransactionList } from "@/components/ui/TransactionList";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Transaction } from "@/lib/mockData"; // only keeping the type
import { toast } from "sonner";

import { getTransactionHistory, getAccountDetails, getCurrentUser } from "@/lib/api";
import { mapApiTxnToUi } from "@/lib/txnMapper";

const HomePage: React.FC = () => {
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

  const transactionsToShow = useMemo(() => {
    if (showAll) return allTransactions;
    return allTransactions.slice(0, 3);
  }, [allTransactions, showAll]);

  const actionItems = [
    { label: "Withdraw", to: "/withdraw", icon: "cash" },
    { label: "Deposit", to: "/deposit", icon: "deposit" },
    { label: "Spend", to: "/spend", icon: "shopping" },
    { label: "History", to: "/txns", icon: "list" },
    { label: "Support", to: "/support", icon: "chat" },
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      <TrustBadge />

      <BalanceCard
        cashBalance={balance}
        storeCredits={[]}
        totalStoreCredit={"R0.00"}
        walletRef={walletRef}
        loading={loading}
      />

      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Quick Actions
        </h3>
        <ActionGrid items={actionItems} columns={4} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium text-muted-foreground hover:underline"
            aria-expanded={showAll}
          >
            Recent Activity {showAll ? "(show less)" : "(show all)"}
          </button>

          <button
            onClick={() => navigate("/txns")}
            className="text-sm text-primary font-medium hover:underline"
          >
            View all
          </button>
        </div>

        <TransactionList transactions={transactionsToShow} loading={loading} />
      </section>

      <section>
        <InfoCard
          title="Want more features?"
          items={[
            { label: "Gini App", value: "Full wallet features" },
            { label: "Gini Chips", value: "Lite money tools" },
          ]}
        />
        <div className="mt-3">
          <GiniButton variant="secondary" onClick={() => navigate("/settings")}>
            Upgrade options
          </GiniButton>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
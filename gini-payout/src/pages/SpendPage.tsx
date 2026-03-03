import React, { useEffect, useState } from 'react';
import { Smartphone, Wifi, FileText, QrCode, Zap, Store } from 'lucide-react';
import { ListItem } from '@/components/ui/ListItem';
import { mockWalletSummary, WalletSummary } from '@/lib/mockData';
import { useNavigate } from "react-router-dom";

const SpendPage: React.FC = () => {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setSummary(mockWalletSummary), 300);
  }, []);

  const hasStoreCredits = summary && summary.storeCredits.length > 0;
  const hasCash = summary && summary.cashBalance > 0;

  return (
    <div className="px-4 py-6 space-y-6">
      <p className="text-muted-foreground">
        Choose how you'd like to spend your funds.
      </p>

      {/* QR Payment Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Quick Payment
        </h3>

        <div className="space-y-2">
          {hasStoreCredits && (
            <ListItem
              title="Pay with Store Credit"
              subtitle={`${summary?.totalStoreCreditFormatted} available`}
              to="/spend/store-credit"
              icon={<Store className="w-5 h-5" />}
            />
          )}

          {hasCash && (
            <div onClick={() => navigate("/QRPay")} className="w-full cursor-pointer">
              <ListItem
                title="Scan QR to Pay"
                subtitle="Scan a QR code to pay"
                to="/QRPay"
                icon={<QrCode className="w-5 h-5" />}
              />
            </div>
          )}
        </div>
      </section>

      {/* Universal Spend Options */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          More ways to spend
        </h3>

        <div className="space-y-2">
          <ListItem
            title="Airtime"
            subtitle="Top up any SA mobile number"
            to="/spend/airtime"
            icon={<Smartphone className="w-5 h-5" />}
          />

          <ListItem
            title="Data"
            subtitle="Buy data bundles"
            to="/spend/data"
            icon={<Wifi className="w-5 h-5" />}
          />

          <ListItem
            title="Electricity"
            subtitle="Prepaid electricity token"
            to="/spend/electricity"
            icon={<Zap className="w-5 h-5" />}
          />

          <ListItem
            title="Bill payments"
            subtitle="Pay supported billers"
            to="/spend/bills"
            icon={<FileText className="w-5 h-5" />}
          />
        </div>
      </section>
    </div>
  );
};

export default SpendPage;
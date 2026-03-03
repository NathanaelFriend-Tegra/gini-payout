import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { GiniButton } from '@/components/ui/GiniButton';
import { InfoCard } from '@/components/ui/InfoCard';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import {
  sendATMCash,
  getAccountDetails,
  getCurrentUser,
  ATMCashSendRequest,
} from '@/lib/api';

interface CashResult {
  cash_token: string;
  expires_at: string;
  instructions: string;
  mobileNumber: string;
  amount: string;
  provider: string;
}

const WithdrawCashPage: React.FC = () => {
  const navigate = useNavigate();

  // Account state
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [cashBalanceFormatted, setCashBalanceFormatted] = useState<string>('R0.00');
  const [accountUuid, setAccountUuid] = useState<string>('');
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Form state
  const [provider, setProvider] = useState<'ABSA' | 'NEDBANK'>('ABSA');
  const [amount, setAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('+27');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CashResult | null>(null);

  // Fetch real balance + accountUuid on mount
  useEffect(() => {
    const fetchBalance = async () => {
      setLoadingBalance(true);
      try {
        const user = getCurrentUser();
        const uuid = user?.accountUuid;

        if (!uuid) {
          navigate('/login');
          return;
        }

        const accountDetails = await getAccountDetails(uuid);
        const available = accountDetails.availableBalanceAmount ?? 0;

        setAccountUuid(uuid);
        setCashBalance(available);
        setCashBalanceFormatted(
          new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
          }).format(available)
        );
      } catch (error) {
        console.error('❌ Failed to fetch balance:', error);
        toast.error('Could not load balance. Please try again.');
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, []);

  const enteredAmount = parseFloat(amount) || 0;
  const exceedsBalance = enteredAmount > cashBalance;
  const hasNoBalance = cashBalance <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !mobileNumber || submitting || exceedsBalance || hasNoBalance) return;

    // Validate SA mobile number
    if (!mobileNumber.startsWith('+27') || mobileNumber.length < 12) {
      toast.error('Please enter a valid South African mobile number (+27XXXXXXXXX)');
      return;
    }

    setSubmitting(true);
    try {
      const payload: ATMCashSendRequest = {
        requestId: uuidv4(),
        payerRefInfo: `atm-cashsend-${Date.now()}`,
        payerAccountUuid: accountUuid,
        mobileNumber,
        amount: enteredAmount,
        provider,
      };

      console.log('📤 ATM CashSend payload:', payload);

      const response = await sendATMCash(payload);

      console.log('✅ ATM CashSend response:', response);

      setResult({
        cash_token:
          response.referenceNumber ||
          response.transactionId ||
          'ATM' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        expires_at: response.expiresAt || '24 hours',
        instructions: `Visit any ${provider} ATM, select "Cardless withdrawal", and enter your reference number${
          response.pin ? ` and PIN: ${response.pin}` : ''
        } to collect your cash.`,
        mobileNumber,
        amount,
        provider,
      });

      toast.success('Cash withdrawal code generated!');
    } catch (error) {
      console.error('❌ ATM CashSend error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not generate cash withdrawal. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Cash Withdrawal Ready</h2>
        </div>

        <InfoCard
          variant="success"
          items={[
            { label: 'Reference', value: result.cash_token },
            { label: 'Mobile Number', value: result.mobileNumber },
            { label: 'Amount', value: `R${result.amount}` },
            { label: 'ATM Network', value: result.provider },
            { label: 'Expires in', value: result.expires_at },
          ]}
        />

        <div className="bg-secondary rounded-xl p-4">
          <p className="text-sm text-foreground">{result.instructions}</p>
        </div>

        <div className="space-y-3">
          <GiniButton onClick={() => setResult(null)}>Send Another</GiniButton>
          <GiniButton variant="secondary" onClick={() => navigate('/home')}>
            Back to Home
          </GiniButton>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6">
      {/* Balance card */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
            <p className="text-2xl font-bold text-primary">
              {loadingBalance ? '...' : cashBalanceFormatted}
            </p>
          </div>
          <Banknote className="w-8 h-8 text-primary opacity-60" />
        </div>
      </div>

      {!loadingBalance && hasNoBalance && (
        <p className="text-sm text-destructive text-center mb-4">
          No cash balance available to withdraw.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-muted-foreground">
          Generate a code to withdraw cash at a participating ATM.
        </p>

        <FormInput
          label="Mobile Number"
          type="tel"
          value={mobileNumber}
          onChange={e => setMobileNumber(e.target.value)}
          placeholder="+27781234567"
          required
          disabled={hasNoBalance}
        />

        <FormSelect
          label="ATM Network"
          value={provider}
          onChange={e => setProvider(e.target.value as 'ABSA' | 'NEDBANK')}
          options={[
            { label: 'ABSA', value: 'ABSA' },
            { label: 'Nedbank', value: 'NEDBANK' },
          ]}
          disabled={hasNoBalance}
        />

        <FormInput
          label="Amount (R)"
          type="number"
          step="10"
          min="20"
          max={cashBalance}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          error={exceedsBalance ? `Maximum available: ${cashBalanceFormatted}` : undefined}
          required
          disabled={hasNoBalance}
        />

        <p className="text-sm text-muted-foreground">
          Note: ATM withdrawals have a minimum of R20.
        </p>

        <div className="pt-4">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={
              hasNoBalance ||
              !amount ||
              !mobileNumber ||
              enteredAmount <= 0 ||
              exceedsBalance ||
              loadingBalance
            }
          >
            Generate Cash Withdrawal
          </GiniButton>
        </div>
      </form>
    </div>
  );
};

export default WithdrawCashPage;
// src/pages/SendFundsPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, SendHorizonal, User, FileText, MessageSquare, CircleDollarSign, CheckCircle2 } from 'lucide-react';
import { GiniButton } from '@/components/ui/GiniButton';
import { useAuth } from '@/contexts/AuthContext';
import { sendFunds, getCurrentUser } from '@/lib/api';
import type { SendFundsRequest } from '@/lib/api';

// ==============================================
// TYPES
// ==============================================

type Step = 'details' | 'confirm' | 'success';

// ==============================================
// HELPERS
// ==============================================

const formatAmount = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toFixed(2);
};

const displayAmount = (rands: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(rands);

// ==============================================
// COMPONENT
// ==============================================

const SendFundsPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser(); // { accountUuid, displayName, mobileNumber, ... }

  // Step
  const [step, setStep] = useState<Step>('details');

  // Form fields — user input
  const [payeeAccountUuid, setPayeeAccountUuid] = useState('');
  const [payerRefInfo, setPayerRefInfo] = useState('');
  const [payeeMessage, setPayeeMessage] = useState('');
  const [amountRaw, setAmountRaw] = useState(''); // stored as cent string e.g. "5000" = R50.00

  // Loading / result
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<{ transactionId?: string; uuid?: string } | null>(null);

  // ==============================================
  // DERIVED
  // ==============================================

  const amountRands = amountRaw ? parseInt(amountRaw.replace(/\D/g, ''), 10) / 100 : 0;

  // ==============================================
  // HANDLERS
  // ==============================================

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits; value represents cents
    const digits = e.target.value.replace(/\D/g, '');
    setAmountRaw(digits);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeAccountUuid.trim()) {
      toast.error('Please enter the recipient account UUID');
      return;
    }
    if (amountRands <= 0) {
      toast.error('Please enter an amount greater than R0.00');
      return;
    }
    if (!payerRefInfo.trim()) {
      toast.error('Please enter a payment reference');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user?.accountUuid) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const payload: SendFundsRequest = {
        payerAccountUuid: user.accountUuid,
        payerRefInfo: payerRefInfo.trim(),
        payeeAccountUuid: payeeAccountUuid.trim(),
        payeeRefInfo: payerRefInfo.trim(),     // mirror payer ref as payee ref
        payeeMessage: payeeMessage.trim() || undefined,
        amount: amountRands,
        gratuityAmount: 0,
      };

      const result = await sendFunds(payload);
      setTxResult({ transactionId: result.transactionId, uuid: result.uuid });
      setStep('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'details') navigate(-1);
    else if (step === 'confirm') setStep('details');
  };

  // ==============================================
  // RENDER — Success
  // ==============================================

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Payment Sent!</h1>
              <p className="text-muted-foreground">
                {displayAmount(amountRands)} has been sent successfully.
              </p>
              {txResult?.transactionId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Transaction ID: <span className="font-mono">{txResult.transactionId}</span>
                </p>
              )}
              {txResult?.uuid && !txResult?.transactionId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reference: <span className="font-mono">{txResult.uuid}</span>
                </p>
              )}
            </div>
            <div className="space-y-3">
              <GiniButton
                className="w-full"
                onClick={() => {
                  setStep('details');
                  setPayeeAccountUuid('');
                  setPayerRefInfo('');
                  setPayeeMessage('');
                  setAmountRaw('');
                  setTxResult(null);
                }}
              >
                Send Another Payment
              </GiniButton>
              <button
                onClick={() => navigate('/home')}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // RENDER — Details & Confirm
  // ==============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">

      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md space-y-8">

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {['details', 'confirm'].map((s, i) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  (step === 'details' && i === 0) || step === 'confirm'
                    ? 'bg-primary w-8'
                    : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>

          {/* Icon / Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <SendHorizonal className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {step === 'details' ? 'Send Funds' : 'Confirm Payment'}
            </h1>
            <p className="text-muted-foreground">
              {step === 'details'
                ? 'Send money directly to another GiniPayout user'
                : 'Please review your payment before confirming'}
            </p>
          </div>

          {/* ── Step 1: Details form ── */}
          {step === 'details' && (
            <form onSubmit={handleContinue} className="space-y-5">

              {/* Recipient account UUID */}
              <div className="space-y-2">
                <label htmlFor="payee" className="text-sm font-medium text-foreground">
                  Recipient Account UUID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="payee"
                    type="text"
                    value={payeeAccountUuid}
                    onChange={(e) => setPayeeAccountUuid(e.target.value.trim())}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    required
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-foreground">
                  Amount
                </label>
                <div className="relative">
                  <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    value={amountRaw ? `R ${formatAmount(amountRaw)}` : ''}
                    onChange={handleAmountChange}
                    placeholder="R 0.00"
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Payment reference */}
              <div className="space-y-2">
                <label htmlFor="ref" className="text-sm font-medium text-foreground">
                  Payment Reference
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="ref"
                    type="text"
                    value={payerRefInfo}
                    onChange={(e) => setPayerRefInfo(e.target.value)}
                    placeholder="e.g. Rent June, Invoice #123"
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              {/* Optional message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <textarea
                    id="message"
                    value={payeeMessage}
                    onChange={(e) => setPayeeMessage(e.target.value)}
                    placeholder="Add a note for the recipient..."
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    maxLength={100}
                  />
                </div>
              </div>

              <GiniButton
                type="submit"
                disabled={!payeeAccountUuid || amountRands <= 0 || !payerRefInfo}
                className="w-full"
              >
                Continue
              </GiniButton>
            </form>
          )}

          {/* ── Step 2: Confirmation summary ── */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-5 space-y-4 border border-border">

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">You are sending</p>
                  <p className="text-4xl font-bold text-foreground mt-1">
                    {displayAmount(amountRands)}
                  </p>
                </div>

                <div className="border-t border-border" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">To</span>
                    <span className="font-mono text-foreground text-right break-all">
                      {payeeAccountUuid}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">From</span>
                    <span className="font-mono text-foreground text-right break-all">
                      {user?.accountUuid}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">Reference</span>
                    <span className="text-foreground text-right">{payerRefInfo}</span>
                  </div>
                  {payeeMessage && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground shrink-0">Message</span>
                      <span className="text-foreground text-right">{payeeMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              <GiniButton
                onClick={handleConfirm}
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : `Confirm & Send ${displayAmount(amountRands)}`}
              </GiniButton>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Edit Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-muted-foreground">
        <p>© 2026 GiniPayout. All rights reserved.</p>
        <p className="mt-1">
          <Link to="/terms" className="hover:underline">Terms</Link>
          {' · '}
          <Link to="/privacy" className="hover:underline">Privacy</Link>
        </p>
      </div>
    </div>
  );
};

export default SendFundsPage;
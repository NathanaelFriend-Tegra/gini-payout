import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/ui/FormInput';
import { GiniButton } from '@/components/ui/GiniButton';
import { InfoCard } from '@/components/ui/InfoCard';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Quote {
  amountFormatted: string;
  feesFormatted: string;
  units?: string;
}

interface Result {
  token: string;
  receipt_ref: string;
  units?: string;
}

const SpendElectricityPage: React.FC = () => {
  const navigate = useNavigate();
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGetQuote = async () => {
    if (!meterNumber || !amount) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setQuote({
        amountFormatted: `R${parseFloat(amount).toFixed(2)}`,
        feesFormatted: 'R0.00',
        units: `~${(parseFloat(amount) * 0.8).toFixed(1)} kWh`,
      });
    } catch (error) {
      toast.error('Could not get quote.');
    }
  };

  const handleBuy = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        token: Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join(''),
        receipt_ref: 'ELEC' + Date.now(),
        units: quote?.units,
      });
    } catch (error) {
      toast.error('Electricity purchase failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Electricity Token</h2>
        </div>

        <div className="bg-primary/5 rounded-xl p-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">Your token</p>
          <p className="text-2xl font-mono font-bold text-primary tracking-wider break-all">
            {result.token.match(/.{1,4}/g)?.join(' ')}
          </p>
        </div>

        <InfoCard
          variant="success"
          items={[
            { label: 'Receipt', value: result.receipt_ref },
            { label: 'Units', value: result.units || '-', optional: true },
          ]}
        />

        <GiniButton variant="secondary" onClick={() => navigate('/home')}>
          Back to Home
        </GiniButton>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-5">
        <FormInput
          label="Meter number"
          value={meterNumber}
          onChange={e => setMeterNumber(e.target.value)}
          placeholder="Enter your meter number"
          required
        />

        <FormInput
          label="Provider (optional)"
          value={provider}
          onChange={e => setProvider(e.target.value)}
          placeholder="e.g. Eskom, City Power"
        />

        <FormInput
          label="Amount (R)"
          type="number"
          min="10"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Minimum R10"
          required
        />

        <GiniButton
          type="button"
          variant="secondary"
          onClick={handleGetQuote}
          disabled={!meterNumber || !amount}
        >
          Get Quote
        </GiniButton>

        {quote && (
          <InfoCard
            title="Quote"
            items={[
              { label: 'Amount', value: quote.amountFormatted },
              { label: 'Fees', value: quote.feesFormatted },
              { label: 'Est. units', value: quote.units || '-', optional: true },
            ]}
          />
        )}

        <div className="pt-2">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={!meterNumber || !amount || parseFloat(amount) < 10}
          >
            Buy Electricity
          </GiniButton>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to purchase R{amount} of prepaid electricity for meter {meterNumber}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBuy}>
              Buy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpendElectricityPage;

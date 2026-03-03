import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Smartphone, CheckCircle } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { GiniButton } from '@/components/ui/GiniButton';
import { mockWalletSummary, WalletSummary } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
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

const WithdrawGiniPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Mock: In production, this would check if the user has an iAccount
  const [hasIAccount] = useState(true);

  useEffect(() => {
    setSummary(mockWalletSummary);
  }, []);

  const cashBalance = summary?.cashBalance || 0;
  const cashBalanceFormatted = summary?.cashBalanceFormatted || 'R0.00';

  const enteredAmount = parseFloat(amount) || 0;
  const exceedsBalance = enteredAmount > cashBalance;
  const isValid = amount.trim() !== '' && enteredAmount > 0 && !exceedsBalance;

  const handleConfirm = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Transfer to iAccount successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasIAccount) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Get a Gini iAccount</h2>
          <p className="text-muted-foreground mb-6">
            Download InstaPay Gini or InstaPay Chips to open your iAccount and earn up to 6% interest on your balance.
          </p>
          <GiniButton onClick={() => navigate('/upgrade')}>
            Get InstaPay App
          </GiniButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Available Cash Balance */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
            <p className="text-2xl font-bold text-primary">{cashBalanceFormatted}</p>
          </div>
          <Wallet className="w-8 h-8 text-primary opacity-60" />
        </div>
      </div>

      {/* Interest Benefit */}
      <div className="bg-accent/20 border border-accent/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-accent-foreground mt-0.5" />
          <div>
            <p className="font-medium text-accent-foreground">Earn up to 6% interest</p>
            <p className="text-sm text-muted-foreground">
              Money in your iAccount earns daily interest, paid monthly.
            </p>
          </div>
        </div>
      </div>

      {/* iAccount Info */}
      <div className="bg-muted rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Your iAccount</p>
          </div>
        </div>
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} 
        className="space-y-5"
      >
        <p className="text-muted-foreground">
          Enter the amount to transfer to your Gini iAccount.
        </p>

        <FormInput
          label="Amount (R)"
          type="number"
          step="0.01"
          min="1"
          max={cashBalance}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          error={exceedsBalance ? `Maximum available: ${cashBalanceFormatted}` : undefined}
          required
        />

        <div className="pt-4">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={!isValid}
          >
            Transfer to iAccount
          </GiniButton>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Transfer R{amount} to your Gini iAccount ({})?
              Your money will start earning interest immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Yes, transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawGiniPage;
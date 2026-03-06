import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { GiniButton } from '@/components/ui/GiniButton';
import { mockWalletSummary, WalletSummary } from '@/lib/mockData';
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

// Bank code mapping
const BANK_CODES: { [key: string]: string } = {
  'FNB': 'FNB',
  'Standard Bank': 'SBSA',
  'ABSA': 'ABSA',
  'Nedbank': 'NEDBANK',
  'Capitec': 'CAPITEC',
  'POSTBANK': 'POSTBANK',
  'Discovery Bank': 'DISCOVERY',
  'TymeBank': 'TYMEBANK',
  'Bank Zero': 'BANKZERO',
  'African Bank': 'AFRICAN_BANK',
};

const WithdrawEFTPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [form, setForm] = useState({
    bankName: 'FNB',
    accountType: 'CHEQUE',
    accountNumber: '',
    branchCode: '',
    amount: '',
    reference: '',
    accountHolderName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setSummary(mockWalletSummary);
  }, []);

  const cashBalance = summary?.cashBalance || 0;
  const cashBalanceFormatted = summary?.cashBalanceFormatted || 'R0.00';

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const enteredAmount = parseFloat(form.amount) || 0;
  const exceedsBalance = enteredAmount > cashBalance;

  const isValid =
    form.bankName.trim() !== '' &&
    form.accountNumber.trim() !== '' &&
    form.branchCode.trim() !== '' &&
    form.accountHolderName.trim() !== '' &&
    form.amount.trim() !== '' &&
    enteredAmount > 0 &&
    !exceedsBalance;



  return (
    <div className="px-4 py-6">
      {/* Available Cash Balance */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
            <p className="text-2xl font-bold text-primary">{cashBalanceFormatted}</p>
          </div>
          <Banknote className="w-8 h-8 text-primary opacity-60" />
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }}
        className="space-y-5"
      >
        <p className="text-muted-foreground">
          Enter your bank account details to receive your withdrawal.
        </p>

        <FormInput
          label="Account Holder Name"
          value={form.accountHolderName}
          onChange={e => updateForm('accountHolderName', e.target.value)}
          placeholder="Full name as per bank account"
          required
        />

        <FormSelect
          label="Bank name"
          value={form.bankName}
          onChange={e => updateForm('bankName', e.target.value)}
          options={[
            { label: 'FNB', value: 'FNB' },
            { label: 'Standard Bank', value: 'Standard Bank' },
            { label: 'ABSA', value: 'ABSA' },
            { label: 'Nedbank', value: 'Nedbank' },
            { label: 'Capitec', value: 'Capitec' },
            { label: 'POSTBANK', value: 'POSTBANK' },
            { label: 'Discovery Bank', value: 'Discovery Bank' },
            { label: 'TymeBank', value: 'TymeBank' },
            { label: 'Bank Zero', value: 'Bank Zero' },
            { label: 'African Bank', value: 'African Bank' },
          ]}
        />

        <FormSelect
          label="Account type"
          value={form.accountType}
          onChange={e => updateForm('accountType', e.target.value)}
          options={[
            { label: 'Cheque/Current', value: 'CHEQUE' },
            { label: 'Savings', value: 'SAVINGS' },
            { label: 'Transmission', value: 'TRANSMISSION' },
          ]}
        />

        <FormInput
          label="Account number"
          value={form.accountNumber}
          onChange={e => updateForm('accountNumber', e.target.value)}
          placeholder="Your account number"
          inputMode="numeric"
          required
        />

        <FormInput
          label="Branch code"
          value={form.branchCode}
          onChange={e => updateForm('branchCode', e.target.value)}
          placeholder="6 digits"
          maxLength={6}
          inputMode="numeric"
          required
        />

        <FormInput
          label="Amount (R)"
          type="number"
          step="0.01"
          min="1"
          max={cashBalance}
          value={form.amount}
          onChange={e => updateForm('amount', e.target.value)}
          placeholder="0.00"
          error={exceedsBalance ? `Maximum available: ${cashBalanceFormatted}` : undefined}
          required
        />

        <FormInput
          label="Reference (optional)"
          value={form.reference}
          onChange={e => updateForm('reference', e.target.value)}
          placeholder="Payment reference"
          maxLength={50}
        />

        <p className="text-sm text-muted-foreground">
          Standard EFT withdrawals take 1-2 business days to process.
        </p>

        <div className="pt-4">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={!isValid}
          >
            Confirm EFT
          </GiniButton>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm EFT Withdrawal</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to transfer R{form.amount} to {form.accountHolderName}'s {form.accountType.toLowerCase()} account ****{form.accountNumber.slice(-4)} at {form.bankName}.
              This action cannot be undone and will take 1-2 business days to process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setShowConfirm(false);
                setSubmitting(true);
                try {
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  toast.success('Withdrawal submitted successfully');
                  navigate(-1);
                } catch (error) {
                  toast.error('Withdrawal failed. Please try again.');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawEFTPage;
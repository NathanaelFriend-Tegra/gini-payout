import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/ui/FormInput';
import { GiniButton } from '@/components/ui/GiniButton';
import { toast } from 'sonner';

const SpendAirtimePage: React.FC = () => {
  const navigate = useNavigate();
  const [msisdn, setMsisdn] = useState('');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msisdn || !amount || submitting) return;

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Airtime purchased successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Airtime purchase failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickAmounts = [10, 20, 50, 100, 200];

  return (
    <div className="px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Mobile number"
          type="tel"
          value={msisdn}
          onChange={e => setMsisdn(e.target.value)}
          placeholder="082 123 4567"
          required
        />

        <FormInput
          label="Network (optional)"
          value={network}
          onChange={e => setNetwork(e.target.value)}
          placeholder="Auto-detect or enter manually"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quick amounts
          </label>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(String(amt))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  amount === String(amt)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                R{amt}
              </button>
            ))}
          </div>
        </div>

        <FormInput
          label="Amount (R)"
          type="number"
          min="5"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <div className="pt-4">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={!msisdn || !amount || parseFloat(amount) <= 0}
          >
            Buy Airtime
          </GiniButton>
        </div>
      </form>
    </div>
  );
};

export default SpendAirtimePage;

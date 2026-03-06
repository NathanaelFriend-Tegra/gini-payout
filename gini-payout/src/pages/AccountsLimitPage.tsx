import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { GiniButton } from '../components/ui/GiniButton';
import { FormInput } from '../components/ui/FormInput';
import { InfoCard } from '../components/ui/InfoCard';
import { toast } from 'sonner';
import {
  getAccountDetails,
  getCurrentUser,
  updateAccountLimits,
  AccountDetailsResponse,
  JsonPatchOperation,
} from '../lib/api';

const formatZAR = (value: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

interface LimitField {
  key: keyof AccountDetailsResponse;
  label: string;
  patchPath: string;
}

const EDITABLE_FIELDS: LimitField[] = [
  { key: 'autoLimitAmount',      label: 'Auto Limit (R)',      patchPath: '/autoLimitAmount'      },
  { key: 'availableLimitAmount', label: 'Available Limit (R)', patchPath: '/availableLimitAmount' },
  { key: 'approveLimitAmount',   label: 'Approve Limit (R)',   patchPath: '/approveLimitAmount'   },
];

const AccountLimitsPage: React.FC = () => {
  const navigate = useNavigate();

  const [account, setAccount] = useState<AccountDetailsResponse | null>(null);
  const [accountUuid, setAccountUuid] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [autoLimit, setAutoLimit] = useState('');
  const [availableLimit, setAvailableLimit] = useState('');
  const [approveLimit, setApproveLimit] = useState('');

  const getValue = (key: keyof AccountDetailsResponse) => {
    if (key === 'autoLimitAmount') return autoLimit;
    if (key === 'availableLimitAmount') return availableLimit;
    if (key === 'approveLimitAmount') return approveLimit;
    return '';
  };

  const setValue = (key: keyof AccountDetailsResponse, val: string) => {
    setSuccess(false);
    if (key === 'autoLimitAmount') setAutoLimit(val);
    if (key === 'availableLimitAmount') setAvailableLimit(val);
    if (key === 'approveLimitAmount') setApproveLimit(val);
  };

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const user = getCurrentUser();
        const uuid = user?.accountUuid;
        if (!uuid) { navigate('/login'); return; }

        const details = await getAccountDetails(uuid);
        setAccount(details);
        setAccountUuid(uuid);
        setAutoLimit(String(details.autoLimitAmount ?? 0));
        setAvailableLimit(String(details.availableLimitAmount ?? 0));
        setApproveLimit(String(details.approveLimitAmount ?? 0));
      } catch (err) {
        console.error('❌ Failed to load account:', err);
        toast.error('Could not load account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !accountUuid || submitting) return;

    const patches: JsonPatchOperation[] = [];

    EDITABLE_FIELDS.forEach(({ key, patchPath }) => {
      const newVal = parseFloat(getValue(key));
      const oldVal = account[key] as number;
      if (isNaN(newVal)) return;
      if (newVal < 0) { toast.error('Limits cannot be negative.'); return; }
      if (newVal !== oldVal) {
        patches.push({ op: 'replace', path: patchPath, value: newVal });
      }
    });

    if (patches.length === 0) {
      toast.info('No changes to save.');
      return;
    }

    console.log('📤 Patching account:', patches);
    setSubmitting(true);

    try {
      await updateAccountLimits(accountUuid, patches);
      toast.success('Account limits updated successfully.');
      setSuccess(true);

      // Refresh with confirmed server values
      const updated = await getAccountDetails(accountUuid);
      setAccount(updated);
      setAutoLimit(String(updated.autoLimitAmount ?? 0));
      setAvailableLimit(String(updated.availableLimitAmount ?? 0));
      setApproveLimit(String(updated.approveLimitAmount ?? 0));
    } catch (err) {
      console.error('❌ Limit update error:', err);
      toast.error(err instanceof Error ? err.message : 'Could not update limits. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Account Limits</h1>
          <p className="text-sm text-muted-foreground">View details and adjust your limits</p>
        </div>
      </div>

      {/* Read-only account info */}
      {account && (
        <InfoCard
          variant="default"
          items={[
            { label: 'Account UUID',       value: account.uuid },
            { label: 'Member Type',        value: account.memberType },
            { label: 'Verification',       value: `${account.verificationType} (Level ${account.verificationLevel})` },
            { label: 'Available Balance',  value: formatZAR(account.availableBalanceAmount ?? 0) },
            { label: 'Last Modified',      value: new Date(account.lastModified).toLocaleString('en-ZA') },
          ]}
        />
      )}

      {/* Notice */}
      <div className="flex items-start gap-3 bg-muted rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Only limit fields can be modified. Balance and account identifiers are read-only.
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>
            ✓ Limits updated successfully.
          </p>
        </div>
      )}

      {/* Editable limit fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Adjustable Limits
        </p>

        {EDITABLE_FIELDS.map(({ key, label }) => (
          <FormInput
            key={key}
            label={label}
            type="number"
            min="0"
            step="50"
            value={getValue(key)}
            onChange={e => setValue(key, e.target.value)}
            placeholder="0"
            required
          />
        ))}

        <div className="pt-2 space-y-3">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={submitting || loading}
          >
            Save Changes
          </GiniButton>
          <GiniButton variant="secondary" onClick={() => navigate('/home')}>
            Back to Home
          </GiniButton>
        </div>
      </form>

    </div>
  );
};

export default AccountLimitsPage;
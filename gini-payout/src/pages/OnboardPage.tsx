import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { GiniButton } from '@/components/ui/GiniButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const OnboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { claimToken, setLoginContact } = useAuth();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idMode: 'id',
    idNumber: '',
    passportNumber: '',
    mobile: '',
    email: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!claimToken) {
      navigate('/c/INVALID');
    }
  }, [claimToken, navigate]);

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isValid = 
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.mobile.trim() !== '' &&
    form.consent &&
    ((form.idMode === 'id' && form.idNumber.trim() !== '') ||
     (form.idMode === 'passport' && form.passportNumber.trim() !== ''));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoginContact(form.mobile);
      toast.success('OTP sent to your phone');
      navigate('/otp');
    } catch (error) {
      toast.error('Could not start claim. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-semibold text-foreground">Enter your details</h2>
          <p className="text-sm text-muted-foreground">
            We need this information to verify your identity and secure your payout.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="First name"
            value={form.firstName}
            onChange={e => updateForm('firstName', e.target.value)}
            placeholder="John"
            required
          />
          <FormInput
            label="Last name"
            value={form.lastName}
            onChange={e => updateForm('lastName', e.target.value)}
            placeholder="Doe"
            required
          />
        </div>

        <FormSelect
          label="Document type"
          value={form.idMode}
          onChange={e => updateForm('idMode', e.target.value)}
          options={[
            { label: 'SA ID Number', value: 'id' },
            { label: 'Passport', value: 'passport' },
          ]}
        />

        {form.idMode === 'id' ? (
          <FormInput
            label="ID number"
            value={form.idNumber}
            onChange={e => updateForm('idNumber', e.target.value)}
            placeholder="13 digits"
            maxLength={13}
            pattern="\d*"
            inputMode="numeric"
            required
          />
        ) : (
          <FormInput
            label="Passport number"
            value={form.passportNumber}
            onChange={e => updateForm('passportNumber', e.target.value)}
            placeholder="Passport number"
            required
          />
        )}

        <FormInput
          label="Mobile number"
          type="tel"
          value={form.mobile}
          onChange={e => updateForm('mobile', e.target.value)}
          placeholder="082 123 4567"
          required
        />

        <FormInput
          label="Email (optional)"
          type="email"
          value={form.email}
          onChange={e => updateForm('email', e.target.value)}
          placeholder="john@example.com"
        />

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={e => updateForm('consent', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{' '}
            <a href="#" className="text-primary underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary underline">Privacy Policy</a>
          </span>
        </label>

        <div className="pt-4">
          <GiniButton
            type="submit"
            loading={submitting}
            disabled={!isValid}
          >
            Continue
          </GiniButton>
        </div>
      </form>
    </div>
  );
};

export default OnboardPage;

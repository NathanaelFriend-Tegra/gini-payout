// src/pages/ForgotPinPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Phone, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { GiniButton } from '@/components/ui/GiniButton';
import { sendPinOtp, setPin } from '@/lib/api';

// ==============================================
// TYPES
// ==============================================

type Step = 'mobile' | 'otp' | 'new-pin';

// ==============================================
// COMPONENT
// ==============================================

const ForgotPinPage = () => {
  const navigate = useNavigate();

  // Step tracking
  const [step, setStep] = useState<Step>('mobile');

  // Field values
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // ==============================================
  // HANDLERS
  // ==============================================

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) value = '27' + value.substring(1);
    if (value.startsWith('27')) value = value.substring(0, 11);
    setMobileNumber(value ? '+' + value : '');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, '').substring(0, 6));
  };

  const handlePinChange = (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value.replace(/\D/g, '').substring(0, 4));
    };

  // Step 1 — request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 12) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setIsLoading(true);
    try {
      await sendPinOtp({ mobileNumber });
      toast.success('OTP sent to your mobile number');
      setStep('otp');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 — verify OTP (the OTP itself is submitted as part of the setPin call in step 3)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter the full OTP');
      return;
    }
    setStep('new-pin');
  };

  // Step 3 — set new PIN
  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }
    setIsLoading(true);
    try {
      await setPin({ mobileNumber, otp, pin: newPin });
      toast.success('PIN updated successfully! Please login.');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set PIN';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Back navigation per step
  const handleBack = () => {
    if (step === 'mobile') navigate('/login');
    else if (step === 'otp') setStep('mobile');
    else if (step === 'new-pin') setStep('otp');
  };

  // ==============================================
  // STEP METADATA
  // ==============================================

  const stepMeta = {
    mobile: {
      icon: <Phone className="w-8 h-8 text-primary-foreground" />,
      title: 'Forgot PIN',
      subtitle: "Enter your mobile number and we'll send you a reset OTP",
      progress: 1,
    },
    otp: {
      icon: <ShieldCheck className="w-8 h-8 text-primary-foreground" />,
      title: 'Verify OTP',
      subtitle: `Enter the OTP sent to ${mobileNumber}`,
      progress: 2,
    },
    'new-pin': {
      icon: <KeyRound className="w-8 h-8 text-primary-foreground" />,
      title: 'Set New PIN',
      subtitle: 'Choose a new 4-digit PIN for your account',
      progress: 3,
    },
  };

  const meta = stepMeta[step];

  // ==============================================
  // RENDER
  // ==============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md space-y-8">

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-2 rounded-full transition-all duration-300 ${
                  n <= meta.progress
                    ? 'bg-primary w-8'
                    : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>

          {/* Icon / Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              {meta.icon}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{meta.title}</h1>
            <p className="text-muted-foreground">{meta.subtitle}</p>
          </div>

          {/* ── Step 1: Mobile number ── */}
          {step === 'mobile' && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-medium text-foreground">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="+27 81 234 5678"
                    className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <GiniButton
                type="submit"
                loading={isLoading}
                disabled={isLoading || mobileNumber.length < 12}
                className="w-full"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </GiniButton>
            </form>
          )}

          {/* ── Step 2: OTP verification ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-foreground">
                  One-Time Password
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Didn't receive it?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={async () => {
                      try {
                        await sendPinOtp({ mobileNumber });
                        toast.success('OTP resent');
                      } catch {
                        toast.error('Could not resend OTP');
                      }
                    }}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              <GiniButton
                type="submit"
                disabled={otp.length < 4}
                className="w-full"
              >
                Verify OTP
              </GiniButton>
            </form>
          )}

          {/* ── Step 3: New PIN ── */}
          {step === 'new-pin' && (
            <form onSubmit={handleSetPin} className="space-y-6">
              {/* New PIN */}
              <div className="space-y-2">
                <label htmlFor="new-pin" className="text-sm font-medium text-foreground">
                  New PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="new-pin"
                    type={showNewPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={handlePinChange(setNewPin)}
                    placeholder="4-digit PIN"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full pl-10 pr-12 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm PIN */}
              <div className="space-y-2">
                <label htmlFor="confirm-pin" className="text-sm font-medium text-foreground">
                  Confirm PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirm-pin"
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={handlePinChange(setConfirmPin)}
                    placeholder="Confirm PIN"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full pl-10 pr-12 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Live match indicator */}
                {confirmPin.length > 0 && (
                  <p className={`text-xs ${newPin === confirmPin ? 'text-green-500' : 'text-destructive'}`}>
                    {newPin === confirmPin ? '✓ PINs match' : 'PINs do not match'}
                  </p>
                )}
              </div>

              <GiniButton
                type="submit"
                loading={isLoading}
                disabled={isLoading || newPin.length !== 4 || newPin !== confirmPin}
                className="w-full"
              >
                {isLoading ? 'Setting PIN...' : 'Set New PIN'}
              </GiniButton>
            </form>
          )}

          {/* Back to login */}
          <div className="text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Login
            </Link>
          </div>
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

export default ForgotPinPage;
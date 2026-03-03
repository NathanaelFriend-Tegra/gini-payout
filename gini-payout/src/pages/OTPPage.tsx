import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OTPInput } from '@/components/ui/OTPInput';
import { GiniButton } from '@/components/ui/GiniButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPhoneNumber } from '@/lib/formatters';

const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginContact, setAuth } = useAuth();
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);

  useEffect(() => {
    if (!loginContact) {
      navigate('/support');
    }
  }, [loginContact, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6 || verifying) return;

    setVerifying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // For demo, accept any 6-digit code
      setAuth('demo-token-' + Date.now());
      toast.success('Verification successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Incorrect or expired code. Try again.');
      setOtp('');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    toast.success('New code sent to your phone');
    setResendCooldown(45);
    setOtp('');
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Verify your phone</h2>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        {loginContact && (
          <p className="font-medium text-foreground">
            {formatPhoneNumber(loginContact)}
          </p>
        )}
      </div>

      <div className="py-6">
        <OTPInput
          value={otp}
          onChange={setOtp}
          disabled={verifying}
        />
      </div>

      <div className="space-y-3">
        <GiniButton
          onClick={handleVerify}
          loading={verifying}
          disabled={otp.length !== 6}
        >
          Verify
        </GiniButton>

        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-primary font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        <GiniButton variant="ghost" onClick={() => navigate('/support')}>
          Need help?
        </GiniButton>
      </div>
    </div>
  );
};

export default OTPPage;

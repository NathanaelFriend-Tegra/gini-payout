// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Phone, ArrowLeft } from 'lucide-react';
import { GiniButton } from '@/components/ui/GiniButton';
import { FormInput } from '@/components/ui/FormInput';
import { useAuth } from '@/contexts/AuthContext';
import { login, checkRegistrationStatus } from '../lib/api';
// TODO: Import these API functions from api.ts
// import { login, checkRegistrationStatus } from '@/lib/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth(); 
  // Form state
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingNumber, setIsCheckingNumber] = useState(false);

  // ==============================================
  // HANDLERS
  // ==============================================

  /**
   * Handle mobile number input change
   * Auto-formats to South African format
   */
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Auto-add +27 prefix for SA numbers
    if (value.startsWith('0')) {
      value = '27' + value.substring(1);
    }
    
    // Limit to 11 digits (27 + 9 digits)
    if (value.startsWith('27')) {
      value = value.substring(0, 11);
    }
    
    setMobileNumber(value ? '+' + value : '');
  };

  /**
   * Handle PIN input change
   * Limit to 4 digits
   */
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    setPin(value.substring(0, 4)); // Max 4 digits
  };

  /**
   * Check if mobile number is registered
   * Called when user moves to PIN field
   */
  const handleCheckRegistration = async () => {
  if (mobileNumber.length < 12) {
    toast.error('Please enter a valid mobile number');
    return;
  }

  setIsCheckingNumber(true);

  try {
    const status = await checkRegistrationStatus(mobileNumber); // ← real API call

    if (!status.registered) {
      toast.error('Mobile number not registered. Please sign up first.');
    } else {
      toast.success('Number verified! Please enter your PIN.');
    }
  } catch (error) {
    console.error('Registration check failed:', error);
    toast.error('Could not verify number. Please try again.');
  } finally {
    setIsCheckingNumber(false);
  }
};

  /**
   * Handle form submission - Login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (mobileNumber.length < 12) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    if (pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    setIsLoading(true);

    try {
      
      console.log('Login attempt:', { mobileNumber, pin });
      const response = await login(mobileNumber, pin);
      console.log('Login successful:', response);
      refreshAuth();
      toast.success('Welcome back!');
      navigate('/home');

    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle "Forgot PIN" click
   */
  const handleForgotPin = () => {
    toast.info('PIN reset feature coming soon!');
    // TODO: Navigate to PIN reset flow
    // navigate('/reset-pin');
  };

  // ==============================================
  // RENDER
  // ==============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Login to access your GiniPayout account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile Number Input */}
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
                  onBlur={handleCheckRegistration}
                  placeholder="+27 81 234 5678"
                  className="w-full pl-10 pr-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
              {isCheckingNumber && (
                <p className="text-xs text-muted-foreground">Verifying number...</p>
              )}
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="pin" className="text-sm font-medium text-foreground">
                  PIN
                </label>
                <button
                  type="button"
                  onClick={handleForgotPin}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot PIN?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="Enter 4-digit PIN"
                  className="w-full pl-10 pr-12 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your 4-digit security PIN
              </p>
            </div>

            {/* Submit Button */}
            <GiniButton
              type="submit"
              loading={isLoading}
              disabled={isLoading || mobileNumber.length < 12 || pin.length !== 4}
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </GiniButton>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>

          {/* Help Link */}
          <div className="text-center pt-4">
            <Link
              to="/support"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Need help? Contact Support
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

export default LoginPage;
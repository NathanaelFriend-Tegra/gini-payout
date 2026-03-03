import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GiniButton } from '@/components/ui/GiniButton';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Claim your money',
    description: 'Confirm your mobile number and verify with an OTP.',
  },
  {
    number: '2',
    title: 'Choose what to do',
    description: 'Withdraw to bank, collect cash, or spend instantly.',
  },
  {
    number: '3',
    title: 'Money is yours',
    description: 'Once claimed, the money is fully under your control.',
  },
];

const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">How GiniPayout works</h1>
          <p className="text-muted-foreground">Simple steps to claim and use your money.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-[2.25rem] top-14 w-0.5 h-4 bg-border" />
              )}
            </div>
          ))}
        </div>

        <GiniButton
          onClick={() => navigate('/c/demo')}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Claim money now
          <ArrowRight className="w-4 h-4 ml-2" />
        </GiniButton>

        <button
          onClick={() => navigate('/')}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default HowItWorksPage;

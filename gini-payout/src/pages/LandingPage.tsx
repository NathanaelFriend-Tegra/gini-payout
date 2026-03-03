import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroCard } from '@/components/ui/HeroCard';
import { FeatureList } from '@/components/ui/FeatureList';
import { ExpandableSection, SafetyList } from '@/components/ui/ExpandableSection';
import { GiniButton } from '@/components/ui/GiniButton';
import { Download } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'bank' as const,
      title: 'Withdraw to your bank',
      description: 'Send the money to your bank account via EFT.',
    },
    {
      icon: 'cash' as const,
      title: 'Withdraw cash',
      description: 'Collect cash at selected ATMs.',
    },
    {
      icon: 'qr' as const,
      title: 'Pay by QR',
      description: 'Pay the merchant who sent the money or any other iAccount user.',
    },
    {
      icon: 'spend' as const,
      title: 'Spend instantly',
      description: 'Buy airtime, data, electricity, vouchers, or pay bills.',
    },
  ];

  const safetyItems = [
    'Your money is held securely until you claim it',
    'Only you can access it using your mobile number and OTP',
    'You decide how to withdraw or spend it',
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6 pb-8">
        <HeroCard
          title="You've received money"
          subtitle="Claim, withdraw, or spend your money securely."
          primaryCtaText="Claim money"
          primaryCtaTo="/c/demo"
          secondaryCtaText="How it works"
          secondaryCtaTo="/how-it-works"
        />

        <FeatureList
          title="What you can do with your money"
          items={features}
        />

        <div className="space-y-3">
          <ExpandableSection title="Is this safe?">
            <SafetyList items={safetyItems} />
          </ExpandableSection>

          <ExpandableSection title="Want more features?">
            <p className="text-sm text-muted-foreground">
              Install InstaPay Gini or InstaPay Chips for a full wallet experience with balances, history, and more control.
            </p>
          </ExpandableSection>
        </div>

        <GiniButton
          onClick={() => navigate('/upgrade')}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Get InstaPay Gini or Chips
        </GiniButton>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gift, Clock, User, FileText } from 'lucide-react';
import { GiniButton } from '@/components/ui/GiniButton';
import { InfoCard } from '@/components/ui/InfoCard';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { mockPayout, PayoutToken } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ClaimPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setClaimToken } = useAuth();
  const [payout, setPayout] = useState<PayoutToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPayout = async () => {
      setLoading(true);
      try {
        // Mock: use demo token or show error
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (token === 'demo-token-123' || token === 'demo') {
          setPayout(mockPayout);
        } else {
          // For demo purposes, still show mock data
          setPayout(mockPayout);
        }
      } catch (error) {
        toast.error('This payout link is invalid, expired, or already used.');
        setPayout(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPayout();
  }, [token]);

  const handleClaim = () => {
    if (token) {
      setClaimToken(token);
      navigate('/onboard');
    }
  };

  const canClaim = payout && ['issued', 'claimed', 'partially_used'].includes(payout.status);

  return (
    <div className="px-4 py-6 space-y-6">
      {loading ? (
        <div className="space-y-6">
          <div className="flex justify-center py-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse" />
          </div>
          <div className="h-40 bg-card rounded-xl animate-pulse" />
          <div className="h-12 bg-secondary rounded-xl animate-pulse" />
        </div>
      ) : payout ? (
        <>
          {/* Hero Icon */}
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Payout Available</h2>
            <p className="text-muted-foreground mt-1">
              You've received money from {payout.issuerDisplayName}
            </p>
          </div>

          {/* Amount Display */}
          <div className="text-center py-4">
            <p className="text-balance text-primary money-display">
              {payout.amountFormatted}
            </p>
          </div>

          {/* Details Card */}
          <InfoCard
            items={[
              { label: 'From', value: payout.issuerDisplayName },
              { label: 'Expires', value: payout.expiresAtFormatted },
              { label: 'Note', value: payout.note || '-', optional: !payout.note },
            ]}
          />

          {/* Trust Banner */}
          <TrustBadge 
            variant="banner" 
            message="This is a verified payout from a trusted sender"
          />

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {canClaim ? (
              <GiniButton onClick={handleClaim}>
                Claim Payout
              </GiniButton>
            ) : (
              <div className="text-center p-4 bg-destructive/10 rounded-xl">
                <p className="text-destructive font-medium">
                  This payout has already been {payout.status}
                </p>
              </div>
            )}
            
            <GiniButton variant="ghost" onClick={() => navigate('/support')}>
              Need help?
            </GiniButton>
          </div>
        </>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Invalid Link</h2>
          <p className="text-muted-foreground">
            This payout link is invalid, expired, or has already been used.
          </p>
          <GiniButton variant="secondary" onClick={() => navigate('/support')}>
            Contact Support
          </GiniButton>
        </div>
      )}
    </div>
  );
};

export default ClaimPage;

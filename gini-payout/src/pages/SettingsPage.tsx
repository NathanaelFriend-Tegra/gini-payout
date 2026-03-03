import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Smartphone, Download } from 'lucide-react';
import { InfoCard } from '@/components/ui/InfoCard';
import { GiniButton } from '@/components/ui/GiniButton';
import { ListItem } from '@/components/ui/ListItem';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
  };

  const handleUpgrade = (app: 'gini' | 'chips') => {
    // In production, these would be real app store URLs
    const urls = {
      gini: 'https://play.google.com/store/apps/details?id=com.gini.app',
      chips: 'https://play.google.com/store/apps/details?id=com.gini.chips',
    };
    window.open(urls[app], '_blank');
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Upgrade Section */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Upgrade to full wallet</h3>
        
        <InfoCard
          items={[
            { label: 'Gini', value: 'Full wallet features, send money, cards' },
            { label: 'Gini Chips', value: 'Lite version, essential money tools' },
          ]}
        />
        
        <div className="mt-4 space-y-3">
          <GiniButton onClick={() => handleUpgrade('gini')}>
            <Download className="w-5 h-5" />
            Get Gini App
          </GiniButton>
          
          <GiniButton variant="secondary" onClick={() => handleUpgrade('chips')}>
            <Download className="w-5 h-5" />
            Get Gini Chips
          </GiniButton>
        </div>
      </section>

      {/* Account Section */}
      <section className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Account</h3>
        
        <div className="space-y-3">
          <ListItem
            title="Terms of Service"
            subtitle="View our terms"
            onClick={() => {}}
            icon={<ExternalLink className="w-5 h-5" />}
          />
          
          <ListItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            onClick={() => {}}
            icon={<ExternalLink className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Logout */}
      <section className="border-t border-border pt-6">
        <GiniButton variant="ghost" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          Log out
        </GiniButton>
      </section>

      {/* App Version */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">GiniPayout v1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsPage;

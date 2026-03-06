import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Smartphone, Download, Sun, Moon } from 'lucide-react';
import { InfoCard } from '@/components/ui/InfoCard';
import { GiniButton } from '@/components/ui/GiniButton';
import { ListItem } from '@/components/ui/ListItem';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isDark, toggle } = useTheme();

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
  };

  const handleUpgrade = (app: 'gini' | 'chips') => {
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

      {/* Preferences Section */}
      <section className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Preferences</h3>

        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">{isDark ? 'Currently dark' : 'Currently light'}</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-primary' : 'bg-muted'
              }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </section>

      {/* Account Section */}
      <section className="border-t border-border pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Account</h3>

        <div className="space-y-3">
          <ListItem
            title="Terms of Service"
            subtitle="View our terms"
            onClick={() => { }}
            icon={<ExternalLink className="w-5 h-5" />}
          />

          <ListItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            onClick={() => { }}
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
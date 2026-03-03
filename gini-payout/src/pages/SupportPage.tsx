import React from 'react';
import { HelpCircle, Mail, Phone, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground mt-1">How can we help you?</p>
      </div>

      {/* Main actions */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => navigate('/support/faqs')}
          className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:bg-accent/50 transition-colors active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">FAQs</p>
            <p className="text-sm text-muted-foreground">Common questions answered</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Divider */}
      <div className="px-4 mt-8 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact us</p>
      </div>

      {/* Contact options */}
      <div className="px-4 space-y-3">
        <button
          onClick={() => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yy = String(today.getFullYear()).slice(-2);
            const subject = `Support Ticket ${dd}/${mm}/${yy} [Phone number]`;
            const body = [
              `Hi GiniPayOut Support Team,`,
              ``,
              `I am having a problem with:`,
              `[Please describe your issue here]`,
              ``,
              `Steps I took before the issue occurred:`,
              `[e.g. I tapped on "Withdraw", entered my bank details, and...]`,
              ``,
              `What I expected to happen:`,
              `[e.g. My withdrawal was processed successfully]`,
              ``,
              `What actually happened:`,
              `[e.g. I received an error message / nothing happened]`,
              ``,
              `---`,
              `App version: `,
              `Device: [Type of phone, (samsung/iphone/Xiaomi)] `,
              ``,
              `Thank you,`,
              `[Your name]`,
            ].join('\n');
            window.open(
              `mailto:support@ginipay.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
            );
          }}
          className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:bg-accent/50 transition-colors active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Email</p>
            <p className="text-sm text-muted-foreground">support@ginipay.co.za</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => window.open('tel:08001234567')}
          className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:bg-accent/50 transition-colors active:scale-[0.99]"
        >
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Phone</p>
            <p className="text-sm text-muted-foreground">0800 123 4567</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Footer note */}
      <div className="px-4 mt-8">
        <p className="text-xs text-muted-foreground text-center">
          Available Monday – Friday, 8am – 5pm SAST
        </p>
      </div>
    </div>
  );
};

export default SupportPage;
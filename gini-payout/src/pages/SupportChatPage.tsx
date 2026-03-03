import React, { useState, useEffect } from 'react';
import { ChatThread } from '@/components/ui/ChatThread';
import { FormInput } from '@/components/ui/FormInput';
import { GiniButton } from '@/components/ui/GiniButton';
import { mockSupportMessages, SupportMessage } from '@/lib/mockData';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const SupportChatPage: React.FC = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessages(mockSupportMessages);
      } catch (error) {
        toast.error('Could not open support chat.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, []);

  const handleSend = async () => {
    if (!messageText.trim() || sending) return;

    setSending(true);
    const text = messageText.trim();
    setMessageText('');

    // Add user message immediately
    const userMessage: SupportMessage = {
      id: Date.now().toString(),
      senderType: 'user',
      message: text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate support response
      const supportMessage: SupportMessage = {
        id: (Date.now() + 1).toString(),
        senderType: 'support',
        message: "Thanks for your message! A support agent will respond shortly. Our typical response time is under 2 hours during business hours.",
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, supportMessage]);
    } catch (error) {
      toast.error('Message failed to send.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--nav-height))]">
      <ChatThread messages={messages} loading={loading} />
      
      {!loading && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="input-gini flex-1"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!messageText.trim() || sending}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatPage;

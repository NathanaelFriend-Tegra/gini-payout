import React, { useRef, useEffect } from 'react';
import { SupportMessage } from '@/lib/mockData';
import { formatRelativeTime } from '@/lib/formatters';

interface ChatThreadProps {
  messages: SupportMessage[];
  loading?: boolean;
}

export const ChatThread: React.FC<ChatThreadProps> = ({ messages, loading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        <div className="w-3/4 h-16 bg-secondary rounded-2xl animate-pulse" />
        <div className="w-2/3 h-12 bg-secondary rounded-2xl ml-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={msg.senderType === 'user' ? 'chat-bubble-user' : 'chat-bubble-support'}>
            <p className="text-sm">{msg.message}</p>
            <p className={`text-xs mt-1 ${
              msg.senderType === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {formatRelativeTime(msg.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

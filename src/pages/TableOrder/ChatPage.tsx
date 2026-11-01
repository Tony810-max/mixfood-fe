import { useLanguage, useUiText } from '@/contexts/LanguageContext';
import { Bot, MessageCircle, Send, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTableSession } from '@/contexts/TableSessionContext';
import { getChatbotReply } from '@/services/table-session.service';
import { cn } from '@/lib/utils';
import { useTableOrder } from './TableOrderContext';

type BotMessage = { id: number; sender: 'USER' | 'BOT'; message: string };

export default function ChatPage() {
  const ui = useUiText();
  const { lang } = useLanguage();
  const { sessionToken } = useTableSession();
  const { messages, chatBottomRef, sendChat } = useTableOrder();
  const [mode, setMode] = useState<'BOT' | 'STAFF'>('BOT');
  const [input, setInput] = useState('');
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [pending, setPending] = useState(false);
  const send = async (event: FormEvent) => {
    event.preventDefault(); const message = input.trim(); if (!message) return; setInput('');
    if (mode === 'STAFF') { await sendChat(message); return; }
    setBotMessages((current) => [...current, { id: Date.now(), sender: 'USER', message }]); setPending(true);
    try { const reply = await getChatbotReply(sessionToken!, message, lang); setBotMessages((current) => [...current, { id: Date.now() + 1, sender: 'BOT', message: reply.message }]); } finally { setPending(false); }
  };
  const visible = mode === 'BOT' ? botMessages : messages.map((message) => ({ id: message.id, sender: message.senderType === 'CUSTOMER' ? 'USER' as const : 'BOT' as const, message: message.message }));
  const placeholder = mode === 'BOT' ? ui("Nhập câu hỏi cho bot...") : ui("Nhập tin nhắn cho nhân viên...");
  const modes = [
    { id: 'BOT' as const, label: ui("Chat với bot"), icon: Bot },
    { id: 'STAFF' as const, label: ui("Chat với nhân viên"), icon: UserRound },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <div role="group" aria-label={ui("Switch chat mode")} className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              mode === id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
      <p className="my-3 text-xs text-muted-foreground">{mode === 'BOT' ? ui("Cuộc trò chuyện với bot không được lưu lại.") : ui("Tin nhắn sẽ được gửi đến nhân viên hỗ trợ.")}</p>
      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto" role="log" aria-live="polite" aria-label={mode === 'BOT' ? ui("Chat với bot") : ui("Chat với nhân viên")}>
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-brass-strong opacity-70" aria-hidden="true" />
            {mode === 'BOT' ? ui("Xin chào! Tôi có thể hỗ trợ bạn.") : ui("Hãy gửi tin nhắn cho nhân viên.")}
          </div>
        )}
        {visible.map((message) => (
          <div key={message.id} className={cn('flex', message.sender === 'USER' ? 'justify-end' : 'justify-start')}>
            <p className={cn(
              'max-w-[80%] break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
              message.sender === 'USER'
                ? 'rounded-br-md bg-primary text-primary-foreground'
                : 'rounded-bl-md border border-border/80 bg-card text-foreground',
            )}>{message.message}</p>
          </div>
        ))}
        {mode === 'BOT' && pending && (
          <div className="flex justify-start" role="status">
            <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/80 bg-card px-4 py-3">
              <span className="sr-only">{ui("Typing")}</span>
              {[0, 150, 300].map((delay) => (
                <i key={delay} aria-hidden="true" className="typing-wave-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>
      <form className="mt-3 flex gap-2 border-t border-border/70 pt-3" onSubmit={send}>
        <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="min-w-0" />
        <Button type="submit" size="icon" className="shrink-0" disabled={!input.trim() || pending} aria-label={ui("Send message")}><Send /></Button>
      </form>
    </div>
  );
}

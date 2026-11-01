
import { useUiText } from '@/contexts/LanguageContext';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

type ChatMessage = { id: number | string; sender: 'USER' | 'BOT'; text: string; localized?: boolean };
type TypingEvent = { senderType: 'VISITOR' | 'STAFF'; isTyping: boolean };

const chatbotDataset = [
  { keywords: ['thực đơn', 'menu', 'món ăn', 'giá món', 'đồ ăn'], reply: 'Bạn có thể xem toàn bộ thực đơn, giá và món đặc sắc tại mục Thực đơn ở thanh điều hướng.' },
  { keywords: ['giờ mở cửa', 'mở cửa', 'đóng cửa', 'mấy giờ', 'thời gian'], reply: 'Mix Food phục vụ hằng ngày từ 09:00 đến 21:50.' },
  { keywords: ['đặt bàn', 'đặt chỗ', 'giữ bàn', 'reservation', 'book', 'booking'], reply: 'Bạn có thể đặt bàn tại nút Đặt bàn trên đầu trang. Vui lòng chọn ngày, giờ và số lượng khách.' },
  { keywords: ['địa chỉ', 'ở đâu', 'vị trí', 'đường đi', 'location', 'address', 'where'], reply: 'Mix Food ở K49 Nguyễn Văn Thoại, Hòa Thuận Tây, Hải Châu, Đà Nẵng.' },
  { keywords: ['điện thoại', 'số điện thoại', 'liên hệ', 'gọi'], reply: 'Bạn có thể liên hệ Mix Food qua số 0905 473 728.' },
  { keywords: ['dị ứng', 'ăn chay', 'không cay', 'allergy', 'vegetarian', 'spicy'], reply: 'Vui lòng ghi chú yêu cầu ăn chay, dị ứng hoặc mức độ cay khi đặt món. Nhà hàng sẽ hỗ trợ xác nhận lại.' },
];

function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi-VN'); }
function getReply(message: string) {
  const normalizedMessage = normalize(message);
  const matched = chatbotDataset.find((item) => item.keywords.some((keyword) => normalizedMessage.includes(normalize(keyword))));
  return matched?.reply ?? 'Tôi chưa hiểu rõ câu hỏi. Bạn có thể hỏi về thực đơn, giờ mở cửa, đặt bàn, địa chỉ hoặc liên hệ nhà hàng.';
}

function TypingIndicator({ staff }: { staff: boolean }) {
  const ui = useUiText();
  return <div className="flex justify-start" role="status"><span className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-xs text-muted-foreground"><span>{staff ? ui("Nhân viên đang nhập") : ui("Đang nhập")}</span><span className="flex items-center gap-1" aria-hidden="true"><i className="typing-wave-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} /><i className="typing-wave-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} /><i className="typing-wave-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} /></span></span></div>;
}

export default function SupportChatbot() {
  const ui = useUiText();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'BOT' | 'STAFF'>('BOT');
  const [botTyping, setBotTyping] = useState(false);
  const [staffTyping, setStaffTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, sender: 'BOT', text: ui("Xin chào! Bạn cần Mix Food hỗ trợ thông tin gì?") }]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const { pathname } = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Focus management: into the panel when it opens, back to the launcher when it closes.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpenRef.current) launcherRef.current?.focus();
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    const visitorId = localStorage.getItem('mixfood.website-chat-visitor') ?? crypto.randomUUID();
    localStorage.setItem('mixfood.website-chat-visitor', visitorId);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    fetch(`${baseUrl}/website-chat/${visitorId}/messages`).then((response) => response.ok ? response.json() : []).then((rows) => { if (rows.length) setMessages(rows.map((row: { id: string; senderType: 'VISITOR' | 'STAFF'; message: string }) => ({ id: row.id, sender: row.senderType === 'STAFF' ? 'BOT' : 'USER', text: row.message }))); }).catch(() => undefined);
    const socket = io(import.meta.env.VITE_WS_URL || baseUrl, {
      auth: { websiteVisitorId: visitorId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;
    socket.on('WEBSITE_CHAT_MESSAGE', (message: { id: string; message: string }) => { setStaffTyping(false); setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, { id: message.id, sender: 'BOT', text: message.message }]); });
    socket.on('WEBSITE_CHAT_TYPING', (event: TypingEvent) => { if (event.senderType === 'STAFF') setStaffTyping(event.isTyping); });
    return () => { socket.emit('WEBSITE_CHAT_TYPING', { isTyping: false }); socket.disconnect(); socketRef.current = null; };
  }, []);

  const replyTo = (text: string) => {
    setMessages((current) => [...current, { id: Date.now(), sender: 'USER', text }]);
    setBotTyping(true);
    window.setTimeout(() => { setMessages((current) => [...current, { id: Date.now(), sender: 'BOT', localized: true, text: getReply(text) }]); setBotTyping(false); }, 700);
  };
  const emitStaffTyping = (value: string) => {
    socketRef.current?.emit('WEBSITE_CHAT_TYPING', { isTyping: Boolean(value.trim()) });
  };
  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (mode === 'BOT') replyTo(text);
    else {
      const visitorId = localStorage.getItem('mixfood.website-chat-visitor') ?? crypto.randomUUID();
      localStorage.setItem('mixfood.website-chat-visitor', visitorId);
      emitStaffTyping('');
      setMessages((current) => [...current, { id: Date.now(), sender: 'USER', text }]);
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/website-chat/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId, message: text }) }).catch(() => undefined);
    }
    setInput('');
  };

  // QR table-ordering screens have an in-flow bottom stack (cart bar, quick actions, tab bar,
  // plus a message form on the chat tab). Lift the launcher/panel above it so it never covers those controls.
  const inTableOrder = pathname.startsWith('/q/');
  const positionClass = inTableOrder
    ? (pathname.endsWith('/chat') ? 'bottom-[calc(env(safe-area-inset-bottom)+17.5rem)]' : 'bottom-[calc(env(safe-area-inset-bottom)+13rem)]')
    : 'bottom-24';

  // Keep the launcher clear of the footer's legal/navigation row on short screens.
  const sideClass = inTableOrder ? 'left-4 sm:left-6' : 'right-4 sm:right-6';
  return <div className={`fixed ${positionClass} ${sideClass} z-50`}>
    {open && <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="support-chat-title"
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
      className={`mb-3 flex ${inTableOrder ? "h-[min(24rem,calc(100dvh-24rem))] min-h-48" : "h-[min(28rem,calc(100dvh-9rem))]"} w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-layered-hover animate-in fade-in-0 slide-in-from-bottom-2 duration-200`}
    >
      <header className="flex items-center justify-between border-b border-border/70 bg-secondary/40 px-4 py-2.5"><h2 id="support-chat-title" className="flex items-center gap-2 font-serif text-base font-semibold text-foreground"><Bot className="size-5 text-primary" aria-hidden="true" />{mode === 'BOT' ? ui("Trợ lý Mix Food") : lang === 'vn' ? 'Nhân viên hỗ trợ' : 'Staff support'}</h2><button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={ui("Đóng")}><X className="size-4" aria-hidden="true" /></button></header>
      <div className="flex-1 space-y-2 overflow-y-auto p-3" role="log" aria-live="polite" aria-label={mode === 'BOT' ? ui("Trợ lý Mix Food") : lang === 'vn' ? 'Nhân viên hỗ trợ' : 'Staff support'}>{messages.map((message) => <div key={message.id} className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${message.sender === 'USER' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border border-border/70 bg-background text-foreground'}`}>{message.localized ? ui(message.text) : message.text}</p></div>)}{botTyping && <TypingIndicator staff={false} />}{staffTyping && <TypingIndicator staff />}</div>
      <nav className="border-t border-border/70 px-3 py-2 text-xs" aria-label={ui("Chuyển chế độ chat")}><button type="button" className="min-h-11 w-full rounded-xl border border-primary/30 px-2 py-1.5 font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setMode(mode === 'BOT' ? 'STAFF' : 'BOT')}>{mode === 'BOT' ? (lang === 'vn' ? 'Chat nhân viên' : ui("Chat with staff")) : (lang === 'vn' ? ui("Chat với bot") : ui("Chat with bot"))}</button></nav>
      <form className="flex items-center gap-2 border-t border-border/70 p-3" onSubmit={send}><input ref={inputRef} className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm" value={input} aria-label={mode === 'BOT' ? ui("Ask the bot a question...") : ui("Message our staff...")} onChange={(event) => { setInput(event.target.value); if (mode === 'STAFF') emitStaffTyping(event.target.value); }} placeholder={mode === 'BOT' ? (lang === 'vn' ? 'Nhập câu hỏi của bạn...' : 'Ask a question...') : (lang === 'vn' ? 'Nhắn cho nhân viên...' : 'Message staff...')} /><button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-[transform,opacity] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50" disabled={!input.trim() || botTyping} aria-label={ui("Gửi tin nhắn")}><Send className="size-4" aria-hidden="true" /></button></form>
    </section>}
    {!open && <button type="button" ref={launcherRef} onClick={() => setOpen(true)} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-layered-hover ring-1 ring-brass/60 ring-offset-2 ring-offset-background transition-transform hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={ui("Mở trợ lý hỗ trợ")} aria-expanded={false} aria-haspopup="dialog"><MessageCircle aria-hidden="true" /></button>}
  </div>;
}

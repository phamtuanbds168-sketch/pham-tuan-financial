import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Bookmark, Send, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Asset, Debt } from '../types';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
  time: string;
}

interface Props {
  onSaveNote: (title: string, content: string) => void;
  transactions: Transaction[];
  assets: Asset[];
  debts: Debt[];
  geminiKey: string;
  deepseekKey: string;
  aiProvider: 'gemini' | 'deepseek';
  systemInstruction: string;
}

export const AIScreen = ({ 
  onSaveNote, transactions, assets, debts, geminiKey, deepseekKey, aiProvider, systemInstruction 
}: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Chào buổi sáng, thưa Quý khách. Tôi đã cập nhật báo cáo tài chính mới nhất của bạn. Hôm nay tôi có thể hỗ trợ gì?', time: '09:41' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const totalAssetsValue = assets.reduce((acc, curr) => acc + curr.value, 0);
    const totalDebtsValue = debts.filter(d => d.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const dataSummary = `Dữ liệu: Tài sản ${totalAssetsValue.toLocaleString()}, Nợ ${totalDebtsValue.toLocaleString()}.`;

    try {
      let text = '';
      if (aiProvider === 'gemini') {
        const activeAi = new GoogleGenerativeAI(geminiKey);
        const model = activeAi.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
        const result = await model.generateContent(`${dataSummary}\n\nCâu hỏi: ${input}`);
        text = (await result.response).text();
      } else {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${deepseekKey}` },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemInstruction }, { role: "user", content: `${dataSummary}\n\n${input}` }] })
        });
        const data = await response.json();
        text = data.choices[0].message.content;
      }
      setMessages(prev => [...prev, { role: 'ai', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Có lỗi xảy ra, vui lòng thử lại.', time: '00:00' }]);
    } finally { setIsTyping(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-[calc(100vh-180px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]"
    >
      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 py-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === 'ai' ? "self-start" : "self-end")}>
            <div className={cn("px-4 py-3 rounded-2xl text-sm shadow-sm", msg.role === 'ai' ? "bg-white border border-gold-100" : "bg-premium-black text-white")}>
              <Markdown>{msg.content}</Markdown>
            </div>
            <span className="text-[8px] text-stone-400 mt-1 uppercase">{msg.role === 'ai' ? 'Pham Tuan Advisor' : 'Quý khách'} • {msg.time}</span>
          </div>
        ))}
        {isTyping && <Loader2 className="animate-spin text-gold-500" />}
      </div>

      {/* Input - Được đẩy lên để tránh bị che */}
      <div className="mt-auto px-1 pb-safe-bottom">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="glass-card rounded-2xl p-1.5 flex items-center shadow-xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm px-2 py-2" 
            placeholder="Hỏi Pham Tuan Advisor..." 
          />
          <button type="submit" className="w-10 h-10 rounded-xl flex items-center justify-center metallic-gold">
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
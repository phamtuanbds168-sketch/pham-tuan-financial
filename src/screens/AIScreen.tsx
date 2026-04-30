import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Bookmark, Send, Loader2, Save } from 'lucide-react';
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
  const [isSavingNote, setIsSavingNote] = useState<string | null>(null); // Track which message is being saved
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
    // Only count debts that are not paid
    const totalDebtsValue = debts.filter(d => d.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const dataSummary = `Dữ liệu: Tài sản ${totalAssetsValue.toLocaleString()}, Nợ chưa thanh toán ${totalDebtsValue.toLocaleString()}.`;

    try {
      let text = '';
      if (aiProvider === 'gemini') {
        // Ensure geminiKey is available before using it
        if (!geminiKey) {
          throw new Error('Gemini API key chưa được cấu hình. Vui lòng vào phần cài đặt để thêm API key.');
        }
        
        const activeAi = new GoogleGenerativeAI(geminiKey);
        const model = activeAi.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
        const result = await model.generateContent(`${dataSummary}\n\nCâu hỏi: ${input}`);
        text = (await result.response).text();
      } else {
        // Ensure deepseekKey is available before using it
        if (!deepseekKey) {
          throw new Error('DeepSeek API key chưa được cấu hình. Vui lòng vào phần cài đặt để thêm API key.');
        }
        
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${deepseekKey}` },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemInstruction }, { role: "user", content: `${dataSummary}\n\n${input}` }] })
        });
        const data = await response.json();
        text = data.choices[0].message.content;
      }
      setMessages(prev => [...prev, { role: 'ai', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'ai', content: e.message || 'Có lỗi xảy ra, vui lòng thử lại.', time: '00:00' }]);
    } finally { 
      setIsTyping(false); 
    }
  };

  const handleSaveNote = (content: string) => {
    const title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    onSaveNote(title, content);
  };

  const saveMessageAsNote = (messageContent: string, index: number) => {
    setIsSavingNote(`${index}`);
    setTimeout(() => {
      handleSaveNote(messageContent);
      setIsSavingNote(null);
    }, 300); // Small delay to show feedback
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-[calc(100vh-180px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]"
    >
      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 py-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={`${i}-${msg.time}`} className={cn("flex flex-col max-w-[85%]", msg.role === 'ai' ? "self-start" : "self-end")}>
            <div className={cn("px-4 py-3 rounded-2xl text-sm shadow-sm relative", msg.role === 'ai' ? "bg-white border border-gold-100" : "bg-premium-black text-white")}>
              <Markdown>{msg.content}</Markdown>
              
              {msg.role === 'ai' && (
                <button 
                  onClick={() => saveMessageAsNote(msg.content, i)}
                  disabled={isSavingNote === `${i}`}
                  className="absolute -top-6 right-0 flex items-center gap-1 text-[10px] text-stone-500 hover:text-gold-600 transition-colors"
                >
                  {isSavingNote === `${i}` ? (
                    <>
                      <Loader2 className="animate-spin w-3 h-3" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Bookmark size={12} />
                      Lưu ghi chú
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="text-[10px] text-stone-500 ml-2 mt-1">{msg.time}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex flex-col max-w-[85%] self-start">
            <div className="px-4 py-3 rounded-2xl text-sm shadow-sm bg-white border border-gold-100">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-gold-500 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gold-500 rounded-full animate-bounce delay-75"></div>
                <div className="h-2 w-2 bg-gold-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="sticky bottom-0 pt-4 pb-6 bg-gradient-to-t from-[#faf9fe] to-transparent">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi về tài chính của bạn..."
            className="flex-1 h-12 bg-white border border-gold-100 rounded-xl px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${input.trim() && !isTyping ? 'bg-gold-500 text-white' : 'bg-stone-200 text-stone-500'} shadow-sm`}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-stone-500 mt-2">
          {aiProvider === 'gemini' 
            ? "Powered by Google Gemini" 
            : "Powered by DeepSeek R1"}
        </p>
      </form>
    </motion.div>
  );
};
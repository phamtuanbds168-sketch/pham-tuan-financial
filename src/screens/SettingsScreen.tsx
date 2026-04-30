import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Diamond, Globe, Fingerprint, Moon, Sun, ChevronRight, LogOut, Layers } from 'lucide-react';
import { User } from 'firebase/auth';
import { cn } from '../lib/utils';

interface Props {
  onLogout: () => void;
  user: User | null;
  geminiKey: string;
  deepseekKey: string;
  aiProvider: 'gemini' | 'deepseek';
  onUpdateGeminiKey: (key: string) => void;
  onUpdateDeepseekKey: (key: string) => void;
  onUpdateProvider: (provider: 'gemini' | 'deepseek') => void;
  onEditAccount: () => void;
}

export const SettingsScreen = ({ 
  onLogout, user, geminiKey, deepseekKey, aiProvider, onUpdateGeminiKey, onUpdateDeepseekKey, onUpdateProvider, onEditAccount
}: Props) => {
  const [geminiInput, setGeminiInput] = useState(geminiKey);
  const [deepseekInput, setDeepseekInput] = useState(deepseekKey);
  const [showKey, setShowKey] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-24">
      <section className="bg-white border border-gold-100/20 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full metallic-gold p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-white border-2 border-white overflow-hidden">
              <img alt="Profile" className="w-full h-full object-cover" src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAjAYg6Wvr5Fe6lsReCfN3OPQucDz9guQjuhcvqvCcUVA6YJ_VcNbbmygVzkawRMAKj2s9EK2U4yNQ8zyPY1WhJXAA9MsWQgk7-Qkxp27HmERaPY9IefgpxzTEaNUx2h8y0krQNfx__tiaqvTFNxRZ93oi_J924kwLZsHXSUbXW31FpIHbAi5Bs8y3-0O7loL5YqB7kiR19UNKcwMzU48E7f01OkpsYSZApc6NDiG6yi2mxYWD4aOp0KYYOlMOFHM9WXgvIwE1lYA"} />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-gold-600 p-1 rounded-full border-2 border-white"><ShieldCheck className="w-4 h-4 text-white" /></div>
        </div>
        <h2 className="font-serif text-2xl text-stone-900 mb-1">{user?.displayName || "Quý khách"}</h2>
        <div className="inline-flex items-center px-4 py-1.5 bg-gold-100 text-gold-800 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
          <Diamond size={12} className="mr-2" /> Diamond Member
        </div>
        <button onClick={onEditAccount} className="px-6 py-2 border border-gold-200 text-gold-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Chỉnh sửa tài khoản</button>
      </section>

      {/* AI Config Section (Sử dụng code cũ đã có) */}
      
      <button onClick={onLogout} className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 border border-red-200 text-red-500 rounded-full font-bold text-xs uppercase tracking-widest mt-4">
        <LogOut size={16} /> Đăng xuất
      </button>
    </motion.div>
  );
};
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Diamond, Globe, Fingerprint, Moon, Sun, ChevronRight, LogOut, Layers, Eye, EyeOff, DatabaseBackup } from 'lucide-react';
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

  const handleSaveKeys = () => {
    onUpdateGeminiKey(geminiInput);
    onUpdateDeepseekKey(deepseekInput);
    localStorage.setItem('gemini_api_key', geminiInput);
    localStorage.setItem('deepseek_api_key', deepseekInput);
    localStorage.setItem('ai_provider', aiProvider);
  };

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

      {/* AI Config Section */}
      <section className="bg-white border border-gold-100/20 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gold-600" /> Cấu hình Trí tuệ Nhân tạo
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nhà cung cấp AI</span>
            <div className="flex items-center bg-stone-50 rounded-full p-1">
              <button 
                onClick={() => onUpdateProvider('gemini')}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${aiProvider === 'gemini' ? 'bg-gold-500 text-white' : 'text-stone-500'}`}
              >
                Gemini
              </button>
              <button 
                onClick={() => onUpdateProvider('deepseek')}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${aiProvider === 'deepseek' ? 'bg-gold-500 text-white' : 'text-stone-500'}`}
              >
                DeepSeek
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 block">Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={geminiInput}
                onChange={(e) => setGeminiInput(e.target.value)}
                className="w-full h-10 bg-stone-50 rounded-xl px-4 text-xs font-mono"
                placeholder="Nhập API key của bạn..."
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 block">DeepSeek API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={deepseekInput}
                onChange={(e) => setDeepseekInput(e.target.value)}
                className="w-full h-10 bg-stone-50 rounded-xl px-4 text-xs font-mono"
                placeholder="Nhập API key của bạn..."
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleSaveKeys}
            className="w-full h-12 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest"
          >
            Lưu thiết lập
          </button>
        </div>
      </section>

      {/* Data Backup Section */}
      <section className="bg-white border border-gold-100/20 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <DatabaseBackup className="w-5 h-5 text-gold-600" /> Sao lưu dữ liệu
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Quản lý sao lưu và khôi phục dữ liệu tài chính của bạn
        </p>
        <button 
          onClick={() => {
            // Navigate to backup screen
            window.location.hash = '#backup';
          }}
          className="w-full h-12 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <DatabaseBackup size={16} />
          Quản lý dữ liệu
        </button>
      </section>
      
      {/* Security Notice */}
      <section className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-red-800 mb-2">Lưu ý bảo mật</h3>
        <p className="text-xs text-red-600">
          API Keys được lưu trữ cục bộ trên thiết bị của bạn. Không chia sẻ khóa này với bất kỳ ai.
        </p>
      </section>

      <button 
        onClick={onLogout}
        className="w-full h-14 bg-stone-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Đăng xuất
      </button>
    </motion.div>
  );
};
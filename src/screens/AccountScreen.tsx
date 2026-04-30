import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { User } from 'firebase/auth';

interface Props {
  user: User | null;
  onBack: () => void;
}

export const AccountScreen = ({ user, onBack }: Props) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    address: '',
    goal: 'Tăng trưởng tài sản bền vững'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-6 pb-12"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
          <X size={20} />
        </button>
        <h2 className="font-serif text-2xl font-bold text-stone-800">Thông tin tài khoản</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gold-100/20 shadow-sm space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Họ và tên</label>
          <input 
            value={formData.displayName}
            onChange={e => setFormData({...formData, displayName: e.target.value})}
            className="w-full h-12 bg-stone-50 rounded-xl border-none px-4 text-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Email</label>
          <input 
            value={user?.email || ''} 
            disabled
            className="w-full h-12 bg-stone-100 rounded-xl border-none px-4 text-sm text-stone-400 cursor-not-allowed" 
          />
        </div>
      </div>

      <div className="bg-premium-black rounded-3xl p-6 text-white space-y-4">
        <h3 className="font-serif text-lg text-gold-400">Vị thế & Mục tiêu</h3>
        <textarea 
          rows={3}
          value={formData.goal}
          onChange={e => setFormData({...formData, goal: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-gold-500"
        />
        <button className="w-full h-12 metallic-gold rounded-xl text-stone-900 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">
          Cập nhật thông tin
        </button>
      </div>
    </motion.div>
  );
};
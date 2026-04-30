import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Transaction } from '../types';
import { cn } from '../lib/utils';

interface Props {
  transactions: Transaction[];
  onAdd: (tx: any) => void;
  onDelete: (id: string) => void;
  onUpdate: (tx: any) => void;
}

export const FinanceScreen = ({ transactions, onAdd, onDelete }: Props) => {
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    onAdd({
      name: formData.name,
      amount: formData.type === 'income' ? Math.abs(Number(formData.amount)) : -Math.abs(Number(formData.amount)),
      type: formData.type,
      category: formData.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
      date: formData.date
    });
    setFormData({ name: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-24">
      <h2 className="font-serif text-2xl font-bold text-gold-metallic">Quản lý Giao dịch</h2>
      <section className="bg-stone-50 p-6 rounded-3xl border border-gold-100/20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['income', 'expense'].map(t => (
              <button key={t} type="button" onClick={() => setFormData({...formData, type: t as any})} 
                className={cn("flex-1 py-2 rounded-xl text-[10px] font-bold uppercase", formData.type === t ? "bg-premium-black text-white" : "bg-white text-stone-400")}>
                {t === 'income' ? 'Thu nhập' : 'Chi tiêu'}
              </button>
            ))}
          </div>
          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 bg-white rounded-xl px-4 text-xs" placeholder="Tên giao dịch" />
          <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full h-12 bg-white rounded-xl px-4 text-sm" placeholder="Số tiền" />
          <button type="submit" className="w-full h-14 metallic-gold rounded-2xl font-bold text-xs uppercase tracking-widest">Xác nhận Lưu</button>
        </form>
      </section>
      <div className="space-y-4">
        {transactions.map(tx => (
          <div key={tx.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone-50">
            <div>
              <h4 className="font-bold text-xs">{tx.name}</h4>
              <p className="text-[10px] text-stone-400">{tx.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("font-serif font-bold text-xs", (Number(tx.amount)||0) > 0 ? "text-gold-600" : "text-red-500")}>{(Number(tx.amount)||0).toLocaleString()}</span>
              <button onClick={() => onDelete(tx.id)} className="text-stone-300"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
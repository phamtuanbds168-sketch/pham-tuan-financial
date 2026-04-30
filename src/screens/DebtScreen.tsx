import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, TrendingDown, Trash2, Loader2 } from 'lucide-react';
import { Debt } from '../types';
import { cn } from '../lib/utils';

interface Props {
  debts: Debt[];
  onAdd: (d: Omit<Debt, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (d: Debt) => void;
}

export const DebtScreen = ({ debts, onAdd, onDelete, onUpdate }: Props) => {
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'Khoản vay', dueDate: new Date().toISOString().split('T')[0], interestRate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd({
        name: formData.name,
        amount: Number(formData.amount),
        type: formData.type as any,
        dueDate: formData.dueDate,
        interestRate: Number(formData.interestRate),
        status: 'pending'
      });
      setFormData({ name: '', amount: '', type: 'Khoản vay', dueDate: new Date().toISOString().split('T')[0], interestRate: '' });
    } finally { setIsSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-24">
      <h2 className="font-serif text-2xl font-bold text-red-600 mb-1">Quản lý Công nợ</h2>
      <section className="bg-white p-6 rounded-3xl border border-red-100/30 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 bg-stone-50 rounded-xl px-4 text-xs" placeholder="Tên khoản nợ" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="h-12 bg-stone-50 rounded-xl px-4 text-sm font-serif font-bold text-red-600" placeholder="Số tiền" />
            <input type="number" value={formData.interestRate} onChange={e => setFormData({ ...formData, interestRate: e.target.value })} className="h-12 bg-stone-50 rounded-xl px-4 text-sm" placeholder="Lãi suất %" />
          </div>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="w-full h-12 bg-stone-50 rounded-xl px-4 text-sm" />
          <button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-red-600 text-white font-bold text-xs uppercase tracking-widest">
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Lưu khoản nợ'}
          </button>
        </form>
      </section>
      <div className="space-y-4">
        {debts.map(debt => (
          <div key={debt.id} className={cn("flex justify-between items-center p-4 rounded-2xl border bg-white shadow-sm", debt.status === 'paid' && "opacity-60")}>
            <div className="flex items-center gap-4">
              <button onClick={() => onUpdate({ ...debt, status: debt.status === 'paid' ? 'pending' : 'paid' })} className={cn("w-10 h-10 rounded-xl flex items-center justify-center", debt.status === 'paid' ? "bg-green-100 text-green-600" : "bg-red-50 text-red-600")}>
                {debt.status === 'paid' ? <Check size={20} /> : <TrendingDown size={20} />}
              </button>
              <div>
                <h4 className="font-bold text-xs">{debt.name}</h4>
                <p className="text-[10px] text-stone-400">{debt.dueDate} • {debt.interestRate}% lãi</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn("font-serif font-bold text-xs", debt.status === 'paid' ? "line-through text-stone-400" : "text-red-600")}>-{(Number(debt.amount) || 0).toLocaleString()}</p>
              <button onClick={() => onDelete(debt.id)} className="text-stone-300 ml-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
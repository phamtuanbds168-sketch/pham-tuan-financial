import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Banknote, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Transaction, Asset, Debt } from '../types';
import { cn } from '../lib/utils';

interface Props {
  transactions: Transaction[];
  assets: Asset[];
  debts: Debt[];
  onAdd: () => void;
}

export const DashboardScreen = ({ transactions, assets, debts, onAdd }: Props) => {
  const totalAssetsValue = assets.reduce((acc, curr) => acc + curr.value, 0);
  const totalDebtsValue = debts
    .filter(d => d.status !== 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netTransactionBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalAssetsValue - totalDebtsValue + netTransactionBalance;

  const categoryTotals = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'Khác';
    acc[cat] = (acc[cat] || 0) + Math.abs(tx.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const allocationData = Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value: totalSpent > 0 ? Math.round((value / totalSpent) * 100) : 0,
    color: ['#D4AF37', '#9CA3AF', '#78350F', '#F59E0B', '#111827'][index % 5]
  })).slice(0, 3);

  const displayAllocation = allocationData.length > 0 ? allocationData : [
    { name: 'Chưa có', value: 100, color: '#E5E7EB' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <section className="relative overflow-hidden rounded-2xl p-6 bg-premium-black text-white shadow-xl">
        <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none">
          <Wallet className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="font-sans text-[10px] text-stone-400 mb-1 uppercase tracking-[0.2em]">Tổng tài sản sở hữu</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="font-serif text-3xl font-bold text-gold-metallic">{totalBalance.toLocaleString()}</h2>
            <span className="text-xs font-serif text-gold-200/70">VND</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-semibold text-green-400">Dữ liệu cập nhật thời gian thực</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-gold-100/10 shadow-sm">
          <div className="flex items-center border-l-4 border-gold-500 pl-3 mb-6">
            <h3 className="font-serif font-semibold text-base text-stone-700">Phân bổ tài chính</h3>
          </div>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayAllocation}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {displayAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[8px] font-sans text-stone-400 uppercase">TỔNG QUAN</p>
                <p className="font-serif font-bold text-2xl text-stone-800">
                  {displayAllocation[0]?.value || 0}%
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <button onClick={onAdd} className="gold-gradient text-stone-900 w-full h-14 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gold-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
        <Plus size={18} />
        THÊM GIAO DỊCH
      </button>
    </motion.div>
  );
};
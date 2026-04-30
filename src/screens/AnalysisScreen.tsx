import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { cn } from '../lib/utils';

interface Props {
  transactions: Transaction[];
}

export const AnalysisScreen = ({ transactions }: Props) => {
  const [viewType, setViewType] = useState<'day' | 'month' | 'year'>('month');

  const generateChartData = () => {
    // (Logic tính toán dữ liệu biểu đồ chi tiết)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, i) => {
      const monthTxs = transactions.filter(t => new Date(t.date).getMonth() === i);
      const income = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
      return { name: month, income, expense };
    });
  };

  const currentData = generateChartData();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-24">
      <section>
        <h2 className="font-serif text-2xl font-bold text-gold-metallic mb-1">Báo cáo Sức khỏe Tài chính</h2>
        <p className="text-stone-500 text-xs">Cố vấn phân tích dựa trên dòng tiền thực tế.</p>
      </section>

      <div className="flex bg-white/60 p-1 rounded-xl border border-gold-200/30">
        {['day', 'month', 'year'].map((type) => (
          <button key={type} onClick={() => setViewType(type as any)} className={cn("flex-1 py-2 rounded-lg font-bold text-[10px] uppercase transition-all", viewType === type ? "bg-gold-500 text-white shadow-sm" : "text-stone-400")}>
            {type === 'day' ? 'Ngày' : (type === 'month' ? 'Tháng' : 'Năm')}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-3xl p-6 border border-gold-200/30 shadow-sm">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(197,160,89,0.05)" />
              <XAxis dataKey="name" fontSize={8} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: any) => value.toLocaleString()} />
              <Bar dataKey="income" fill="#C5A059" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </motion.div>
  );
};
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Banknote, Trash2, Bolt, Filter } from 'lucide-react';
// 修正导入路径：从 ../../types 导入 Debt 类型
import { Debt } from '../../types'; // 确保路径正确
// 修正导入路径：从 ../../lib/utils 导入 cn 函数
import { cn } from '../../lib/utils'; // 确保路径正确

interface Props {
  debts: Debt[];
  onAdd: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onUpdate: (debt: Debt) => void;
}

export const DebtScreen = ({ debts, onAdd, onDelete, onUpdate }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('pending');

  // 过滤债务数据
  const filteredDebts = debts.filter(debt => {
    if (activeTab === 'pending') return debt.status !== 'paid';
    if (activeTab === 'paid') return debt.status === 'paid';
    return true;
  });

  const handlePayOffDebt = async (debtId: string) => {
    setIsSaving(true);
    try {
      const debtToPay = debts.find(d => d.id === debtId);
      if (!debtToPay) return;

      // 更新债务状态为 'paid'
      const updatedDebt = { ...debtToPay, status: 'paid' };
      onUpdate(updatedDebt);
    } catch (error) {
      console.error('Error paying off debt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-[calc(100vh-180px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]"
    >
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        <div className="flex items-center justify-between">
          {/* Tab controls */}
          <div className="flex space-x-2 mb-4 w-full">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium',
                activeTab === 'pending'
                  ? 'bg-gold-500 text-white'
                  : 'bg-stone-100 text-stone-600'
              )}
            >
              Đang nợ
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium',
                activeTab === 'paid'
                  ? 'bg-gold-500 text-white'
                  : 'bg-stone-100 text-stone-600'
              )}
            >
              Đã trả
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium',
                activeTab === 'all'
                  ? 'bg-gold-500 text-white'
                  : 'bg-stone-100 text-stone-600'
              )}
            >
              Tất cả
            </button>
          </div>
        </div>

        {filteredDebts.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            {activeTab === 'pending'
              ? 'Không có khoản nợ đang chờ'
              : activeTab === 'paid'
                ? 'Không có khoản nợ đã thanh toán'
                : 'Không có khoản nợ nào'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDebts.map((debt) => (
              <div
                key={debt.id}
                className={cn(
                  "flex items-center justify-between bg-white rounded-2xl border border-gold-100/20 shadow-sm p-3",
                  debt.status === 'paid' && 'opacity-60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Bolt size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{debt.name}</p>
                    <p className="text-xs text-stone-500">
                      {new Date(debt.dueDate).toLocaleDateString('vi-VN')} • {debt.interestRate}% lãi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-600 font-bold text-sm">{debt.amount.toLocaleString()}</span>
                  {debt.status === 'paid' ? (
                    <span className="text-green-600 text-xs font-bold uppercase">Đã trả</span>
                  ) : (
                    <button
                      onClick={() => handlePayOffDebt(debt.id)}
                      disabled={isSaving}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {isSaving ? (
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
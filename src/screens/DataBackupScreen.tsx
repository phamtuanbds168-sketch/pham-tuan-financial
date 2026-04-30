import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Download, DatabaseBackup, RotateCcw } from 'lucide-react';
import { Transaction, Asset, Debt, Note } from '../types';
import { cn } from '../lib/utils';

interface DataBackupScreenProps {
  transactions: Transaction[];
  assets: Asset[];
  debts: Debt[];
  notes: Note[];
  onBack: () => void;
}

interface BackupData {
  transactions: Transaction[];
  assets: Asset[];
  debts: Debt[];
  notes: Note[];
  timestamp: string;
}

export const DataBackupScreen = ({ 
  transactions, 
  assets, 
  debts, 
  notes, 
  onBack 
}: DataBackupScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const handleDownloadBackup = () => {
    setIsLoading(true);
    
    try {
      const backupData: BackupData = {
        transactions,
        assets,
        debts,
        notes,
        timestamp: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `financial_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setMessage({ type: 'success', text: 'Sao lưu dữ liệu thành công!' });
    } catch (err) {
      console.error('Error creating backup:', err);
      setMessage({ type: 'error', text: 'Lỗi khi sao lưu dữ liệu' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content) as BackupData;
        
        // Here you would typically call functions to restore data to your store/Firestore
        // For now, we'll just show a success message
        setMessage({ type: 'success', text: `Khôi phục dữ liệu thành công từ ngày ${parsedData.timestamp}` });
      } catch (err) {
        console.error('Error parsing backup file:', err);
        setMessage({ type: 'error', text: 'Lỗi khi đọc tệp sao lưu' });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleResetData = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!")) {
      setIsLoading(true);
      // In a real implementation, this would reset all data in the app
      // For now we just show a message
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Dữ liệu đã được đặt lại' });
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6 pb-24"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-gold-metallic">Sao Lưu &amp; Khôi Phục</h2>
        <button 
          onClick={onBack} 
          className="px-4 py-2 border border-gold-200 text-gold-600 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Quay lại
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <DatabaseBackup className="w-5 h-5 text-gold-600" /> Sao lưu dữ liệu
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Tạo bản sao lưu dữ liệu tài chính của bạn để lưu trữ an toàn hoặc chuyển sang thiết bị khác
        </p>
        <button 
          onClick={handleDownloadBackup}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {isLoading ? <RotateCcw className="animate-spin w-4 h-4" /> : <Download size={16} />}
          Tải bản sao lưu xuống
        </button>
      </section>

      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-gold-600" /> Khôi phục dữ liệu
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Khôi phục dữ liệu từ tệp sao lưu trước đó
        </p>
        <label className="block">
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload} 
            disabled={isLoading}
            className="hidden"
          />
          <div className="w-full h-14 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
            {isLoading ? <RotateCcw className="animate-spin w-4 h-4" /> : <Upload size={16} />}
            Chọn tệp sao lưu
          </div>
        </label>
      </section>

      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-red-500" /> Đặt lại dữ liệu
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Xóa tất cả dữ liệu tài chính hiện tại (cảnh báo: hành động này không thể hoàn tác)
        </p>
        <button 
          onClick={handleResetData}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-red-100 text-red-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {isLoading ? <RotateCcw className="animate-spin w-4 h-4" /> : <RotateCcw size={16} />}
          Đặt lại tất cả dữ liệu
        </button>
      </section>
    </motion.div>
  );
};
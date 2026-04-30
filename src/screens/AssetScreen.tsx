import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Trash2 } from 'lucide-react';
import { Asset } from '../types';
import { cn } from '../lib/utils';

interface Props {
  assets: Asset[];
  onAdd: (a: Omit<Asset, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (a: Asset) => void;
}

export const AssetScreen = ({ assets, onAdd, onDelete }: Props) => {
  const [formData, setFormData] = useState({ name: '', value: '', type: 'Bất động sản' as Asset['type'] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return;
    onAdd({ 
      name: formData.name, 
      value: Number(formData.value), 
      type: formData.type, 
      purchaseDate: new Date().toISOString().split('T')[0] 
    });
    setFormData({ name: '', value: '', type: 'Bất động sản' });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-24">
      <h2 className="font-serif text-2xl font-bold text-gold-metallic">Tài sản Sở hữu</h2>
      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["Bất động sản", "Chứng khoán", "Siêu xe", "Đồng hồ", "Khác"].map((t) => (
              <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t as any })} 
                className={cn("py-2 rounded-xl text-[9px] font-bold uppercase transition-all",
                  formData.type === t ? "bg-premium-black text-white" : "bg-stone-50 text-stone-400")}>
                {t}
              </button>
            ))}
          </div>
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 bg-stone-50 rounded-xl px-4 text-xs" placeholder="Tên tài sản" />
          <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="w-full h-12 bg-stone-50 rounded-xl px-4 text-sm font-serif font-bold text-gold-metallic" placeholder="Giá trị (VND)" />
          <button type="submit" className="w-full h-14 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest">Xác nhận Lưu</button>
        </form>
      </section>
      <div className="space-y-4">
        {assets.map(asset => (
          <div key={asset.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone-50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                {asset.type === 'Bất động sản' ? <Home size={20} /> : <Layers size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-xs">{asset.name}</h4>
                <p className="text-[10px] text-stone-400">{asset.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xs text-gold-600">{(Number(asset.value) || 0).toLocaleString()}</span>
              <button onClick={() => onDelete(asset.id)} className="p-2 text-stone-300"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
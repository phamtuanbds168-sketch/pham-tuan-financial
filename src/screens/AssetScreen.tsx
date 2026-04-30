import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Home, Car, TrendingUp, Diamond, Edit3, Trash2, Loader2 } from 'lucide-react';
import { Asset } from '../types';
import { cn } from '../lib/utils';

interface Props {
  assets: Asset[];
  onAdd: (a: Omit<Asset, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (a: Asset) => void;
}

const formatCurrencyInput = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';
  return Number(numericValue).toLocaleString('en-US');
};

export const AssetScreen = ({ assets, onAdd, onDelete, onUpdate }: Props) => {
  const [formData, setFormData] = useState({ name: '', value: '', type: 'Bất động sản' as Asset['type'], purchaseDate: new Date().toISOString().split('T')[0] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await onUpdate({ id: editingId, name: formData.name, value: Number(formData.value), type: formData.type, purchaseDate: formData.purchaseDate });
        setEditingId(null);
      } else {
        await onAdd({ name: formData.name, value: Number(formData.value), type: formData.type, purchaseDate: formData.purchaseDate });
      }
      setFormData({ name: '', value: '', type: 'Bất động sản', purchaseDate: new Date().toISOString().split('T')[0] });
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  const assetTypes: Asset['type'][] = ["Bất động sản", "Chứng khoán", "Siêu xe", "Đồng hồ", "Khác"];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-24">
      <section>
        <h2 className="font-serif text-2xl font-bold text-gold-metallic mb-1">Tài sản Sở hữu</h2>
      </section>

      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {assetTypes.map((t) => (
              <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t })}
                className={cn("py-2 rounded-xl text-[9px] font-bold uppercase transition-all", formData.type === t ? "bg-premium-black text-white" : "bg-stone-50 text-stone-400")}>
                {t}
              </button>
            ))}
          </div>
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 bg-stone-50 rounded-xl px-4 text-xs" placeholder="Tên tài sản" />
          <div className="flex gap-2">
            <input type="text" value={formatCurrencyInput(formData.value)} onChange={e => setFormData({ ...formData, value: e.target.value.replace(/\D/g, '') })} className="flex-grow h-12 bg-stone-50 rounded-xl px-4 text-sm font-serif font-bold text-gold-metallic" placeholder="Giá trị (VND)" />
            <input type="date" value={formData.purchaseDate} onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })} className="w-32 h-12 bg-stone-50 rounded-xl px-2 text-[10px]" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingId ? 'Cập nhật' : 'Xác nhận Lưu')}
          </button>
        </form>
      </section>

      <div className="space-y-4">
        {assets.map(asset => (
          <div key={asset.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-stone-50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
                {asset.type === 'Bất động sản' && <Home size={20} />}
                {asset.type === 'Siêu xe' && <Car size={20} />}
                {asset.type === 'Chứng khoán' && <TrendingUp size={20} />}
                {asset.type === 'Đồng hồ' && <Diamond size={20} />}
                {asset.type === 'Khác' && <Layers size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-xs">{asset.name}</h4>
                <p className="text-[10px] text-stone-400">{asset.type} • {asset.purchaseDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xs text-gold-600">{asset.value.toLocaleString()}</span>
              <button onClick={() => { setFormData({ name: asset.name, value: asset.value.toString(), type: asset.type, purchaseDate: asset.purchaseDate }); setEditingId(asset.id); window.scrollTo(0,0); }} className="p-2 text-stone-300"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(asset.id)} className="p-2 text-stone-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
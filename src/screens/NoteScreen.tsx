import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Trash2, Calendar } from 'lucide-react';
import { Note } from '../types';

interface Props {
  notes: Note[];
  onAdd: (n: Omit<Note, 'id'>) => void;
  onDelete: (id: string) => void;
}

export const NoteScreen = ({ notes, onAdd, onDelete }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onAdd({
      title,
      content,
      date: new Date().toLocaleDateString('vi-VN'),
      userId: '' 
    });
    setTitle('');
    setContent('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-24">
      <h2 className="font-serif text-2xl font-bold text-gold-metallic">Nhật ký Tài chính</h2>

      <section className="bg-white p-6 rounded-3xl border border-gold-100/20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full h-12 bg-stone-50 rounded-xl px-4 text-xs font-bold" 
            placeholder="Tiêu đề ghi chú..." 
          />
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            className="w-full min-h-[100px] bg-stone-50 rounded-xl p-4 text-xs resize-none" 
            placeholder="Nội dung chi tiết..." 
          />
          <button type="submit" className="w-full h-14 rounded-2xl metallic-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <Plus size={16} /> Lưu ghi chú
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {notes.map(note => (
          <div key={note.id} className="p-5 bg-white rounded-3xl border border-stone-100 shadow-sm group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-gold-600">
                <StickyNote size={16} />
                <h4 className="font-bold text-sm">{note.title}</h4>
              </div>
              <button onClick={() => onDelete(note.id)} className="text-stone-300">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">{note.content}</p>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium italic">
              <Calendar size={10} />
              {note.date}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wallet, MessageSquare, Bell, Banknote, 
  Briefcase, LogOut, Loader2, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where, orderBy, doc as firestoreDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

import { DashboardScreen } from './screens/DashboardScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { AssetScreen } from './screens/AssetScreen';
import { DebtScreen } from './screens/DebtScreen';
import { AIScreen } from './screens/AIScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AccountScreen } from './screens/AccountScreen';
import { NoteScreen } from './screens/NoteScreen';
import { DataBackupScreen } from './screens/DataBackupScreen'; // Import new screen

import { Transaction, Asset, Debt, Tab, Note } from './types';
import { cn } from './lib/utils';

const firebaseConfig = {
  projectId: "gen-lang-client-0139414297",
  appId: "1:617718726203:web:5e1e92445603e9d4e0e61e",
  apiKey: "AIzaSyDWBTEBgQlpiYhBHQN_iHjDaXi4M4LsN-o",
  authDomain: "gen-lang-client-0139414297.firebaseapp.com",
  storageBucket: "gen-lang-client-0139414297.firebasestorage.app",
  messagingSenderId: "617718726203"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-7aa768a4-a685-4be3-8fcb-ffde36ebdf52");
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const LUXE_SYSTEM_INSTRUCTION = 'Bạn là Pham Tuan Advisor, chuyên gia tư vấn tài chính cao cấp.';

export default function App() {
  const [currentTab, setTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const [geminiKey, setGeminiKey] = useState<string>(() => {
    // Try to get from localStorage first, fallback to env (only in dev mode)
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) return storedKey;
    
    // Note: VITE_GEMINI_API_KEY will only work in dev mode due to Vite's client-side env handling
    // For production builds, users must set their own key in localStorage
    return typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
  });
  const [deepseekKey, setDeepseekKey] = useState<string>(() => {
    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey) return storedKey;
    // Default key is now handled in SettingsScreen
    return '';
  });
  const [aiProvider, setAiProvider] = useState<'gemini' | 'deepseek'>(
    (localStorage.getItem('ai_provider') as 'gemini' | 'deepseek') || 'deepseek'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthenticated(!!u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubTx = onSnapshot(query(collection(db, 'transactions'), where('userId', '==', user.uid)), 
      (s) => setTransactions(s.docs.map(d => ({ id: d.id, ...d.data() } as any))));
    const unsubAssets = onSnapshot(query(collection(db, 'assets'), where('userId', '==', user.uid)), 
      (s) => setAssets(s.docs.map(d => ({ id: d.id, ...d.data() } as any))));
    const unsubDebts = onSnapshot(query(collection(db, 'debts'), where('userId', '==', user.uid)), 
      (s) => setDebts(s.docs.map(d => ({ id: d.id, ...d.data() } as any))));
    const unsubNotes = onSnapshot(query(collection(db, 'notes'), where('userId', '==', user.uid)),
      (s) => setNotes(s.docs.map(d => ({ id: d.id, ...d.data() } as any))));

    return () => { unsubTx(); unsubAssets(); unsubDebts(); unsubNotes(); };
  }, [user]);

  if (isAuthenticated === null) return <div className='min-h-screen flex items-center justify-center'><Loader2 className='animate-spin text-gold-500' /></div>;
  if (!isAuthenticated) return (
    <div className='min-h-screen bg-premium-black flex flex-col items-center justify-center p-6'>
      <h1 className='text-4xl font-serif text-gold-metallic font-bold mb-8'>LUXE FINANCE</h1>
      <button onClick={() => signInWithPopup(auth, googleProvider)} className='w-full max-w-xs h-14 metallic-gold rounded-2xl font-bold uppercase tracking-widest text-stone-900 shadow-xl'>Đăng nhập với Google</button>
    </div>
  );

  // Function to save note from AI
  const saveNoteFromAI = (title: string, content: string) => {
    if (!user) return;
    
    const newNote = {
      title,
      content,
      date: new Date().toLocaleDateString('vi-VN'),
      userId: user.uid
    };
    
    setDoc(doc(collection(db, 'notes')), {...newNote});
  };

  return (
    <div className='min-h-screen bg-[#faf9fe] font-sans'>
      <header className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-[0.5px] border-gold-200/20 shadow-sm safe-top'>
        <div className='flex justify-between items-center w-full px-4 h-16 max-w-lg mx-auto'>
          <button onClick={() => setTab('account')} className='w-10 h-10 rounded-full border border-gold-500/30 overflow-hidden'>
            <img alt='User' className='w-full h-full object-cover' src={user?.photoURL || ''} />
          </button>
          <h1 className='text-sm font-serif font-bold tracking-[0.1em] text-gold-500 uppercase'>Pham Tuan Financial</h1>
          <Bell className='w-6 h-6 text-gold-600' />
        </div>
      </header>

      <main className='pt-20 px-4 max-w-lg mx-auto w-full'>
        <AnimatePresence mode='wait'>
          {currentTab === 'dashboard' && <DashboardScreen transactions={transactions} assets={assets} debts={debts} onAdd={() => setTab('finance')} />}
          {currentTab === 'ai' && <AIScreen transactions={transactions} assets={assets} debts={debts} geminiKey={geminiKey} deepseekKey={deepseekKey} aiProvider={aiProvider} onSaveNote={saveNoteFromAI} systemInstruction={LUXE_SYSTEM_INSTRUCTION} />}
          {currentTab === 'finance' && <FinanceScreen transactions={transactions} onAdd={(t:any) => setDoc(doc(collection(db, 'transactions')), {...t, userId: user!.uid})} onDelete={(id:string) => deleteDoc(firestoreDoc(db, 'transactions', id))} onUpdate={(t:any) => updateDoc(firestoreDoc(db, 'transactions', t.id), t)} />}
          {currentTab === 'assets' && <AssetScreen assets={assets} onAdd={(a:any) => setDoc(doc(collection(db, 'assets')), {...a, userId: user!.uid})} onDelete={(id:string) => deleteDoc(firestoreDoc(db, 'assets', id))} onUpdate={(a:any) => updateDoc(firestoreDoc(db, 'assets', a.id), a)} />}
          {currentTab === 'debts' && <DebtScreen debts={debts} onAdd={(d:any) => setDoc(doc(collection(db, 'debts')), {...d, userId: user!.uid})} onDelete={(id:string) => deleteDoc(firestoreDoc(db, 'debts', id))} onUpdate={(d:any) => updateDoc(firestoreDoc(db, 'debts', d.id), d)} />}
          {currentTab === 'notes' && <NoteScreen notes={notes} onAdd={(n:any) => setDoc(doc(collection(db, 'notes')), {...n, userId: user!.uid})} onDelete={(id:string) => deleteDoc(firestoreDoc(db, 'notes', id))} />}
          {currentTab === 'settings' && <SettingsScreen user={user} onLogout={() => signOut(auth)} geminiKey={geminiKey} deepseekKey={deepseekKey} aiProvider={aiProvider} onUpdateGeminiKey={setGeminiKey} onUpdateDeepseekKey={setDeepseekKey} onUpdateProvider={setAiProvider} onEditAccount={() => setTab('account')} />}
          {currentTab === 'account' && <AccountScreen user={user} onBack={() => setTab('settings')} />}
          {currentTab === 'backup' && <DataBackupScreen 
            transactions={transactions} 
            assets={assets} 
            debts={debts} 
            notes={notes} 
            onBack={() => setTab('settings')} 
          />}
        </AnimatePresence>
      </main>

      <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gold-100/20 bottom-nav-container'>
        <div className='flex justify-around items-center h-16 max-w-lg mx-auto'>
          {[ 
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'assets', icon: Briefcase, label: 'Tài sản' },
            { id: 'debts', icon: Banknote, label: 'Công nợ' },
            { id: 'finance', icon: Wallet, label: 'Thu chi' },
            { id: 'notes', icon: MessageSquare, label: 'Ghi chú' },
            { id: 'ai', icon: Bell, label: 'Trợ lý' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setTab(tab.id as Tab)} className={cn('flex flex-col items-center justify-center flex-1 h-full', currentTab === tab.id ? 'text-gold-600' : 'text-stone-400')}>
              <tab.icon size={20} className={currentTab === tab.id ? 'fill-current' : ''} />
              <span className='text-[8px] font-bold uppercase tracking-tighter mt-1'>{tab.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setTab('settings')} 
            className={cn('flex flex-col items-center justify-center flex-1 h-full', currentTab === 'settings' ? 'text-gold-600' : 'text-stone-400')}
          >
            <Settings size={20} className={currentTab === 'settings' ? 'fill-current' : ''} />
            <span className='text-[8px] font-bold uppercase tracking-tighter mt-1'>Cài đặt</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
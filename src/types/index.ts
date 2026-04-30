import { User } from 'firebase/auth';

export type Tab = 'dashboard' | 'finance' | 'notes' | 'assets' | 'debts' | 'ai' | 'settings' | 'account' | 'backup';

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' | 'debt';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: "Bất động sản" | "Chứng khoán" | "Siêu xe" | "Đồng hồ" | "Khác";
  purchaseDate: string;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  interestRate: number;
  status: 'pending' | 'paid' | 'overdue';
  type: 'Khoản vay' | 'Thẻ tín dụng' | 'Trả góp' | 'Khác';
}
import { useCallback, useState } from 'react';

const API_URL = process.env.EXPO_PUBLIC_BASE_API_URL;

export interface Transactions {
  userId: number;
  id: string;
  title: string;
  completed: boolean;
  amount: number;
  category: string;
  created_at: string;
}

export interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [summary, setSummary] = useState<Summary>({ balance: 0, income: 0, expenses: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('🚫 Error fetching transactions:', error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('🚫 Error fetching summary:', error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error('🚫 Error loading data:', error);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id: string) => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete transaction');
      await loadData();
    } catch (error) {
      console.error('🚫 Error deleting transaction:', error);
    }
  };

  return { transactions, summary, loading, loadData, deleteTransaction, setLoading };
};

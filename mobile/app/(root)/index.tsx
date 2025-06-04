import { useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { useTransactions } from '@/hooks/useTransactions';
import { useEffect } from 'react';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';

import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';

export default function Page() {
  const { user } = useUser();

  const { loadData, loading, deleteTransaction, transactions, summary } = useTransactions(
    user?.id!
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header user={user} />

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
    </View>
  );
}

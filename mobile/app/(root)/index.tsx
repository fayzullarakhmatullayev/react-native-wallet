import { useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { useTransactions } from '@/hooks/useTransactions';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import { useFocusEffect } from '@react-navigation/native';

import Header from '@/components/Header';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import { useCallback, useEffect } from 'react';

export default function Page() {
  const { user } = useUser();

  const { loadData, loading, deleteTransaction, transactions, summary, setLoading } =
    useTransactions(user?.id!);

  useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  useFocusEffect(
    useCallback(() => {
      loadData().finally(() => setLoading(false));
    }, [loadData, setLoading])
  );

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
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        loadData={loadData}
      />
    </View>
  );
}

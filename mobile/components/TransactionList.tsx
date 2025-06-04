import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import React from 'react';
import { Transactions } from '@/hooks/useTransactions';
import { styles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const CATEGORY_ICONS = {
  'Food & Drinks': 'fast-food',
  Shopping: 'cart',
  Transportation: 'car',
  Entertaiment: 'film',
  Income: 'cash',
  Other: 'ellipsis-horizontal'
} as const;

type PropsType = {
  transactions: Transactions[];
  onDelete: (id: string) => Promise<void>;
  loadData: (id: string) => Promise<void>;
};

const TransactionList = ({ transactions, onDelete, loadData }: PropsType) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();

  const handleDelete = (id: string) => {
    try {
      Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setRefreshing(true);
            await onDelete(id).finally(() => {
              setRefreshing(false);
            });
          }
        }
      ]);
    } catch (error) {
      console.error('🚫 Error deleting transaction:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(user?.id!).finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <FlatList
      style={styles.transactionsList}
      contentContainerStyle={styles.transactionsListContent}
      data={transactions}
      renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
      ListEmptyComponent={<NoTransactionsFound />}
      showsHorizontalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    />
  );
};

type PropsItemType = {
  item: Transactions;
  onDelete: (id: string) => void;
};

const TransactionItem = ({ item, onDelete }: PropsItemType) => {
  const isIncome = Number(item.amount) > 0;
  const iconName =
    CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS] || 'pricetag-outline';

  return (
    <View style={styles.transactionCard}>
      <TouchableOpacity style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}
          >
            {isIncome ? '+' : '-'}${Math.abs(Number(item.amount)).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

const NoTransactionsFound = () => {
  const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No transactions found</Text>
      <Text style={styles.emptyStateText}>Create a new transaction to get started</Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push('/create')}>
        <Ionicons name="add-circle" size={18} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionList;

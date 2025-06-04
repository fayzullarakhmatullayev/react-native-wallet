import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useTransactions } from '@/hooks/useTransactions';
import { styles } from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: 'fast-food' },
  { id: 'shopping', name: 'Shopping', icon: 'cart' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'bills', name: 'Bills', icon: 'receipt' },
  { id: 'income', name: 'Income', icon: 'cash' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal' }
] as const;

const Create = () => {
  const router = useRouter();
  const { user } = useUser();
  const { createTransaction } = useTransactions(user?.id!);

  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [isExpense, setIsExpense] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Please enter a title');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return Alert.alert('Error', 'Please enter an amount');
    if (!category) return Alert.alert('Error', 'Please select a category');
    setLoading(true);
    try {
      const formattedAmount = isExpense ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

      await createTransaction({
        user_id: user?.id!,
        title,
        amount: formattedAmount,
        category
      });

      Alert.alert('Success', 'Transaction created successfully');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButtonContainer, loading && styles.saveButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.saveButton}>{loading ? 'Saving...' : 'Save'}</Text>
          {!loading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Select type */}
        <View style={styles.typeSelector}>
          {/* Expense */}
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>

          {/* Income */}
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
        {/* Amount container */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        {/* Input container */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        {/* Title */}
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />
          <Text style={styles.sectionTitle}>Category</Text>
        </View>
        {/* Category */}

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.categoryButton, category === item.name && styles.categoryButtonActive]}
              onPress={() => setCategory(item.name)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={category === item.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  category === item.name && styles.categoryButtonTextActive
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default Create;

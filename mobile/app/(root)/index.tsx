import { SignedIn, useUser } from '@clerk/clerk-expo';
import { Text, View } from 'react-native';
import { SignOutButton } from '@/components/SignOutButton';
import { useTransactions } from '@/hooks/useTransactions';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();
  const { loadData, loading, deleteTransaction, transactions, summary } = useTransactions(
    user?.id!
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>{JSON.stringify(transactions, null, 2)}</Text>
          <Text>{JSON.stringify(summary, null, 2)}</Text>
        </>
      )}
    </View>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import { SignOutButton } from './SignOutButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type PropsType = {
  user: any;
};

const Header = ({ user }: PropsType) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      {/* Left */}
      <View style={styles.headerLeft}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.headerLogo}
          contentFit="contain"
        ></Image>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>
            {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
          </Text>
        </View>
      </View>
      {/* Right */}
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        <SignOutButton />
      </View>
    </View>
  );
};

export default Header;

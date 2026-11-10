import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || loading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!user && !inAuthGroup) {
      // User is not signed in and we are not on the login screen
      router.replace('/(auth)/login' as any);
    } else if (user && inAuthGroup) {
      // User is signed in and we are on the login screen
      router.replace('/(tabs)' as any);
    }
  }, [user, segments, navigationState, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return null; // The logic above handles navigation
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

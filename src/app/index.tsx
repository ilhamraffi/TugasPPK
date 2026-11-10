import React, { useCallback, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  View, 
  TouchableOpacity, 
  Alert,
  Text 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import LoginScreen from '@/components/LoginScreen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'students'), orderBy('nim', 'asc'));
      const querySnapshot = await getDocs(q);
      const data: Student[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              console.log('User confirmed logout');
              await signOut();
            } catch (err: any) {
              console.error('Logout error:', err);
            }
          }
        },
      ]
    );
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  // If user is not logged in, show Login Screen immediately
  if (!user) {
    return <LoginScreen />;
  }

  const renderStudent = ({ item }: { item: Student }) => (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold" style={styles.studentName}>{item.nama}</ThemedText>
      <ThemedText type="small">NIM: {item.nim}</ThemedText>
      <ThemedText type="small">Email: {item.email}</ThemedText>
      <ThemedText type="small">Program Studi: {item.programStudi}</ThemedText>
      <ThemedText type="small">Angkatan: {item.angkatan}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <ThemedText type="subtitle">Welcome,</ThemedText>
            <ThemedText type="smallBold">{user?.displayName || user?.email}</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>Data Mahasiswa</ThemedText>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#208AEF" style={styles.loader} />
        ) : error ? (
          <View style={styles.center}>
            <ThemedText style={{ color: 'red' }}>{error}</ThemedText>
            <TouchableOpacity onPress={fetchStudents} style={styles.retryButton}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderStudent}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <ThemedText>No data available</ThemedText>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    elevation: 4,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  titleRow: {
    marginVertical: Spacing.four,
  },
  title: {
    fontSize: 28,
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: 4,
  },
  studentName: {
    fontSize: 18,
    color: '#208AEF',
  },
  loader: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#208AEF',
    borderRadius: 8,
  },
});

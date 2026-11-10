import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentsData = [
  {
    nim: '24060124120001',
    nama: 'Andi Pratama',
    email: 'andi@university.ac.id',
    programStudi: 'Informatika',
    angkatan: 2024,
  },
  {
    nim: '24060124120002',
    nama: 'Budi Santoso',
    email: 'budi@university.ac.id',
    programStudi: 'Informatika',
    angkatan: 2024,
  },
  {
    nim: '24060124120003',
    nama: 'Citra Lestari',
    email: 'citra@university.ac.id',
    programStudi: 'Informatika',
    angkatan: 2024,
  },
];

async function initializeStudents() {
  try {
    console.log('Checking existing data...');
    const q = query(collection(db, 'students'), orderBy('nim', 'asc'));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log(`Collection 'students' already has ${snapshot.size} documents. Skipping seed.`);
      return;
    }

    console.log('Seeding student data...');
    const collectionRef = collection(db, 'students');
    
    for (const student of studentsData) {
      const docRef = await addDoc(collectionRef, student);
      console.log(`✓ Added: ${student.nama} (ID: ${docRef.id})`);
    }
    
    console.log('\n✓ All students added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

initializeStudents();

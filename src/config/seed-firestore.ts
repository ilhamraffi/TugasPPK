import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

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

export async function seedStudents(): Promise<void> {
  try {
    const collectionRef = collection(db, 'students');
    const snapshot = await getDocs(collectionRef);

    if (!snapshot.empty) {
      console.log('Students collection already has data. Skipping seed.');
      return;
    }

    for (const student of studentsData) {
      await addDoc(collectionRef, student);
      console.log(`Added: ${student.nama}`);
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

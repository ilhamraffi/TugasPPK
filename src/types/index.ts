export interface Student {
  id: string;
  nim: string;
  nama: string;
  email: string;
  programStudi: string;
  angkatan: number;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDnu7JXByuVxj5qPhk6RkDVvJIZe-b1rFo',
  authDomain: 'bellaver-68080.firebaseapp.com',
  projectId: 'bellaver-68080',
  storageBucket: 'bellaver-68080.firebasestorage.app',
  messagingSenderId: '400636009709',
  appId: '1:400636009709:web:672add7809187ff4a3c0e4',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
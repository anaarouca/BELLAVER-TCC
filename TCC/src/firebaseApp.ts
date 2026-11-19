import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDnu7JXByuVxj5qPhk6RkDVvJIZe-b1rFo',
  authDomain: 'bellaver-68080.firebaseapp.com',
  projectId: 'bellaver-68080',
  messagingSenderId: '400636009709',
  appId: '1:400636009709:web:672add7809187ff4a3c0e4',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

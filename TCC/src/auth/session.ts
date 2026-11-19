import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const ADMIN_EMAIL = 'adminbellaver@gmail.com';
export const USER_ROLE_KEY = '@bellaver:user-role';

export type UserRole = 'admin' | 'customer';

export async function saveUserRole(role: UserRole) {
  await AsyncStorage.setItem(USER_ROLE_KEY, role);
}

export async function getUserRole(): Promise<UserRole | null> {
  const role = await AsyncStorage.getItem(USER_ROLE_KEY);

  if (role === 'admin' || role === 'customer') {
    return role;
  }

  return null;
}

export async function clearUserRole() {
  await AsyncStorage.removeItem(USER_ROLE_KEY);
}

export async function encerrarSessao() {
  await signOut(auth);
  await clearUserRole();
}

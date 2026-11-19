
import { getAuth } from 'firebase/auth';
import { app, db } from './firebaseApp';

export const auth = getAuth(app);
export { db };

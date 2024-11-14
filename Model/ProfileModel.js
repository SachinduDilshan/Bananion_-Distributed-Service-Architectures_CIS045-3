// ProfileModel.js
import { getDatabase, ref, update } from 'firebase/database';

export const updateUserData = async (userId, updates) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    await update(userRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);
    return false;
  }
};

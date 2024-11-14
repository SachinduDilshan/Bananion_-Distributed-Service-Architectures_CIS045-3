// ProfileController.js
import { getDatabase, ref, get } from 'firebase/database';
import { updateUserData } from '../Model/ProfileModel.js';

export const fetchUserData = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);
  try {
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const saveUserData = async (userId, newName, newAge) => {
  const updates = { name: newName, age: newAge };
  return await updateUserData(userId, updates);
};

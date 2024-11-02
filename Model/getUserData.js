import admin from 'firebase-admin';

const getUserData = async (userId) => {
  try {
    const dbRef = admin.database().ref(`users/${userId}`);
    const snapshot = await dbRef.once('value');
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error("Error in getUserData:", error.message);
    throw error;
  }
};

export default getUserData;

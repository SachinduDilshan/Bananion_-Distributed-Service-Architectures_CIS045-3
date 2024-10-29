import admin from 'firebase-admin';

// Import the service account JSON file dynamically
import admin from './firebaseadmin';

const db = admin.firestore();

const UserModel = {
  // Register a new user with email and password and save additional info in Firestore
  async registerUser({ name, email, age, password }) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      // Save user details in Firestore under 'users' collection
      await db.collection('users').doc(userRecord.uid).set({
        name,
        email,
        age,
        password,
      });

      return { uid: userRecord.uid, message: 'User registered successfully' };
    } catch (error) {
      console.error("Registration Error:", error);
      throw new Error('Failed to register user');
    }
  },

  // Get user data from database
  async getUserData(uid) {
    try {
      const userSnapshot = await admin.database().ref(`users/${uid}`).once('value');
      if (userSnapshot.exists()) {
        return userSnapshot.val(); // Return user data
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error; // Rethrow to handle in controller
    }
  },

  // Log in user by retrieving user info using email
  async loginUser({ email }) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      return { uid: user.uid, email: user.email, message: 'Login successful' };
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error('Login failed: User not found');
    }
  }
};

export default UserModel; // Use export default for ES module syntax

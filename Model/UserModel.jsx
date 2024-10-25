const admin = require('firebase-admin');

// Initialize Firebase Admin SDK in your main server file (server.js)
if (!admin.apps.length) {
  const serviceAccount = require('../path/to/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com",
  });
}

const db = admin.firestore();

const UserModel = {
  async registerUser({ name, age, password }) {
    try {
      const userRecord = await admin.auth().createUser({
        email: name,
        password,
      });

      await db.collection('users').doc(userRecord.uid).set({
        name,
        age,
      });

      return { uid: userRecord.uid, message: 'User registered successfully' };
    } catch (error) {
      throw new Error('Failed to register user');
    }
  },

  async loginUser({ name }) {
    try {
      const user = await admin.auth().getUserByEmail(name);
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
};

module.exports = UserModel;

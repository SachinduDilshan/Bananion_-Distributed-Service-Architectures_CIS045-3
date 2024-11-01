import admin from 'firebase-admin';
import serviceAccount from '../dsagame-2425049-firebase-adminsdk-g3jmo-c3f1c6ba87.json' assert { type: 'json' }; // Update the path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dsagame-2425049-default-rtdb.firebaseio.com", // Update with your Realtime Database URL
  });
}

export default admin;

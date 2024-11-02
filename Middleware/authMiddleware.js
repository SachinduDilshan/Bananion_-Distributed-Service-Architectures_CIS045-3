import admin from 'firebase-admin';
import serviceAccount from '../dsagame-2425049-firebase-adminsdk-g3jmo-c3f1c6ba87.json'  assert { type: "json" };;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dsagame-2425049-default-rtdb.firebaseio.com"
  });
}

const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next(); 
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authenticateUser;

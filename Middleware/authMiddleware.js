// Middleware to verify Firebase ID token
import admin from 'firebase-admin'; // Make sure Firebase Admin SDK is initialized

const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add decoded token data to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authenticateUser;

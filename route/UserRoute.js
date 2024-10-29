import express from 'express';
import UserController from '../Controller/UserController.js'; // Adjust the path if necessary
import authenticateUser from '../Middleware/authMiddleware.js'; // Adjust path as necessary

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/register/home', authenticateUser, UserController.home);

export default router; // Use export default for ES module syntax

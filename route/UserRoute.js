import express from 'express';
import UserController from '../Controller/UserController.js'; 
import authenticateUser from '../Middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/register/home', authenticateUser, UserController.home);

export default router; 

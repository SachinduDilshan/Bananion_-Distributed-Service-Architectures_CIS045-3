const express = require('express');
const UserController = require('../Controller/UserController.cjs');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/home',UserController.home);


module.exports = router;

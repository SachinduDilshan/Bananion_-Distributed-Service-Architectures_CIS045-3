const UserModel = require('../models/UserModel');

const UserController = {
  // Registration endpoint
  async register(req, res) {
    try {
      const { name, email, age, password } = req.body;
      const userData = await UserModel.registerUser({ name, email, age, password });
      res.status(201).json(userData);
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  },

  // Login endpoint
  async login(req, res) {
    try {
      const { email } = req.body;
      const user = await UserModel.loginUser({ email });

      if (user) {
        res.status(200).json({ message: 'Login successful', uid: user.uid });
      } else {
        res.status(401).json({ error: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = UserController;

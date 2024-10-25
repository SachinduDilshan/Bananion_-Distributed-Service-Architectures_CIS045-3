const UserModel = require('../models/UserModel');

const UserController = {
  async register(req, res) {
    try {
      const { name, age, password } = req.body;
      const userData = await UserModel.registerUser({ name, age, password });
      res.status(201).json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { name } = req.body;
      const user = await UserModel.loginUser({ name });

      if (user) {
        res.status(200).json({ message: 'Login successful', uid: user.uid });
      } else {
        res.status(401).json({ error: 'Invalid login credentials' });
      }
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = UserController;

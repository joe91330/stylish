const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

class UserController {
  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      
      const emailExists = await UserModel.checkIfEmailExists(email);
      if (emailExists) {
        return res.status(409).json({ error: "Email Already Exists" });
      }

      const userId = await UserModel.createUser(name, email, password);
      
      const tokenPayload = { email, name };
      const access_token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({
        data: {
          access_token,
          access_expired: 3600,
          user: {
            id: userId,
            provider: "native",
            name,
            email,
            picture: null,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async signin(req, res) {
    try {
      const { provider, email, password } = req.body;
      
      if (provider !== "native") {
        return res.status(400).json({ error: "Invalid provider" });
      }

      const userExists = await UserModel.checkIfEmailExists(email);
      if (!userExists) {
        return res.status(409).json({ error: "Email not found" });
      }

      const passwordMatch = await UserModel.verifyPassword(email, password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      const userData = await UserModel.getUserByEmail(email);
      const access_token = jwt.sign(
        { email, provider: "native" },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        data: {
          access_token,
          access_expired: 3600,
          user: {
            id: userData.id,
            provider: "native",
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const userData = await UserModel.getUserByEmail(req.user.email);
      res.status(200).json({
        data: {
          provider: "native",
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController; 
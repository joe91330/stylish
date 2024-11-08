const db = require('../config/database');
const bcrypt = require("bcryptjs");
const saltRounds = 10;

class UserModel {
  static async checkIfEmailExists(email) {
    const [result] = await db.query(
      "SELECT COUNT(*) AS count FROM User WHERE email = ?",
      [email]
    );
    return result[0].count > 0;
  }

  static async createUser(name, email, password) {
    const hashpassword = await bcrypt.hash(password, saltRounds);
    const [result] = await db.query(
      "INSERT INTO User (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashpassword]
    );
    return result.insertId;
  }

  static async verifyPassword(email, password) {
    const [result] = await db.query(
      "SELECT password FROM User WHERE email = ?",
      [email]
    );
    const hashedPassword = result[0].password;
    return bcrypt.compare(password, hashedPassword);
  }

  static async getUserByEmail(email) {
    const [result] = await db.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );
    return result[0];
  }

  static async getUserById(id) {
    const [result] = await db.query(
      "SELECT * FROM User WHERE id = ?",
      [id]
    );
    return result[0];
  }
}

module.exports = UserModel; 
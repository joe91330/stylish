const db = require('../config/database');

class OrderModel {
  static async checkStock(productID, color_code, size, qty) {
    const [result] = await db.query(
      `SELECT * FROM Variant WHERE product_id = ? AND color_code = ? AND size = ?`,
      [productID, color_code, size]
    );
    return result[0].stock >= qty;
  }

  static async updateStock(productID, color_code, size, qty) {
    await db.query(
      "UPDATE Variant SET stock = stock - ? WHERE product_id = ? AND color_code = ? AND size = ?",
      [qty, productID, color_code, size]
    );
  }

  static async createOrder(orderData) {
    const [result] = await db.query(
      "INSERT INTO Orders (user_id, total, status) VALUES (?, ?, ?)",
      [orderData.user_id, orderData.total, 'paid']
    );
    return result.insertId;
  }
}

module.exports = OrderModel; 
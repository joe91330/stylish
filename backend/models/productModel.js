const db = require('../config/database');

class ProductModel {
  static async getByCategory(category, paging = 1) {
    const pageSize = 6;
    const offset = (paging - 1) * pageSize;
    
    try {
      const [products] = await db.query(
        `SELECT * FROM Product WHERE category = ? LIMIT ?, ?`,
        [category, offset, pageSize]
      );

      const result = [];
      for (const product of products) {
        const [colors] = await db.query(
          `SELECT * FROM Color WHERE product_id = ?`,
          [product.id]
        );
        const [variants] = await db.query(
          `SELECT * FROM Variant WHERE product_id = ?`,
          [product.id]
        );
        result.push({ ...product, colors, variants });
      }

      // 檢查是否有下一頁
      const [nextPage] = await db.query(
        `SELECT * FROM Product WHERE category = ? LIMIT ?, ?`,
        [category, paging * pageSize, pageSize]
      );

      return {
        data: result,
        next_paging: nextPage.length > 0 ? parseInt(paging) + 1 : null
      };
    } catch (error) {
      throw new Error('數據庫查詢錯誤');
    }
  }

  // 其他模型方法...
}

module.exports = ProductModel; 
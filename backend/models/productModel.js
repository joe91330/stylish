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

  static async getByTitle(titleKeyword, paging = 1) {
    const pageSize = 6;
    const offset = (paging - 1) * pageSize;
    
    try {
      const [products] = await db.query(
        `SELECT * FROM Product WHERE title LIKE ? LIMIT ?, ?`,
        [`%${titleKeyword}%`, offset, pageSize]
      );

      if (products.length === 0) {
        return null;
      }

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

      const [nextPage] = await db.query(
        `SELECT * FROM Product WHERE title LIKE ? LIMIT ?, ?`,
        [`%${titleKeyword}%`, paging * pageSize, pageSize]
      );

      return {
        data: result,
        next_paging: nextPage.length > 0 ? parseInt(paging) + 1 : null
      };
    } catch (error) {
      throw new Error('數據庫查詢錯誤');
    }
  }

  static async getDetails(productId) {
    try {
      const [product] = await db.query(
        "SELECT * FROM Product WHERE id = ?",
        [productId]
      );

      if (product.length === 0) {
        return null;
      }

      const detailedProduct = product[0];

      const [colors] = await db.query(
        `SELECT * FROM Color WHERE product_id = ?`,
        [productId]
      );

      const [variants] = await db.query(
        `SELECT * FROM Variant WHERE product_id = ?`,
        [productId]
      );

      detailedProduct.colors = colors;
      detailedProduct.variants = variants;

      return detailedProduct;
    } catch (error) {
      throw new Error('數據庫查詢錯誤');
    }
  }

  static async createProduct(productData, mainImage, imagePaths) {
    try {
      const {
        category,
        title,
        description,
        price,
        texture,
        wash,
        place,
        note,
        story,
        sizes,
        colors,
        variants
      } = productData;

      const [productResult] = await db.query(
        `INSERT INTO Product (category, title, description, price, texture, wash, place, note, story, sizes, main_image, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [category, title, description, price, texture, wash, place, note, story, sizes, mainImage, JSON.stringify(imagePaths)]
      );

      const productId = productResult.insertId;

      // Insert colors
      for (const color of JSON.parse(colors)) {
        await db.query(
          `INSERT INTO Color (product_id, name, code) VALUES (?, ?, ?)`,
          [productId, color.name, color.code]
        );
      }

      // Insert variants
      for (const variant of JSON.parse(variants)) {
        await db.query(
          `INSERT INTO Variant (product_id, color_code, size, stock) VALUES (?, ?, ?, ?)`,
          [productId, variant.color_code, variant.size, variant.stock]
        );
      }

      return productId;
    } catch (error) {
      throw new Error('創建產品失敗');
    }
  }
}

module.exports = ProductModel; 
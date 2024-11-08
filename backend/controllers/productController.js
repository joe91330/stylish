const ProductModel = require('../models/productModel');
const s3 = require('../config/s3Config');

class ProductController {
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { paging } = req.query;
      const result = await ProductModel.getByCategory(category, paging);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 其他控制器方法...
}

module.exports = ProductController; 
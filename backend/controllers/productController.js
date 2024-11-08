const ProductModel = require('../models/productModel');
const s3 = require('../config/s3Config');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

class ProductController {
  static async getProductsByCategory(req, res) {
    try {
      const category = req.params.category || req.path.split('/')[1]; // 從路徑獲取類別
      const { paging } = req.query;
      const result = await ProductModel.getByCategory(category, paging);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchProducts(req, res) {
    try {
      const { keyword, paging } = req.query;
      const result = await ProductModel.getByTitle(keyword, paging);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductDetails(req, res) {
    try {
      const { id } = req.query;
      const productDetails = await ProductModel.getDetails(id);

      if (!productDetails) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ data: productDetails });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const mainImage = req.files["main_image"] ? req.files["main_image"][0].buffer : null;
      const imagePaths = req.files["images"]?.map(file => file.buffer);

      // 上傳主圖片到 S3
      let mainImageURL;
      if (mainImage) {
        const mainImageKey = `products/${Date.now()}/main_image`;
        await s3.send(new PutObjectCommand({
          Bucket: "joe-product-images",
          Key: mainImageKey,
          Body: req.files["main_image"][0].buffer,
          ContentType: req.files["main_image"][0].mimetype,
        }));
        mainImageURL = `https://joe-product-images.s3.amazonaws.com/${mainImageKey}`;
      }

      // 上傳其他圖片到 S3
      const imageUrls = [];
      for (const image of imagePaths || []) {
        const imageKey = `products/${Date.now()}/images/${image}`;
        await new Upload({
          client: s3,
          params: {
            Bucket: "joe-product-images",
            Key: imageKey,
            Body: image,
            ACL: "public-read",
          },
        }).done();
        imageUrls.push(`https://joe-product-images.s3.amazonaws.com/${imageKey}`);
      }

      const productId = await ProductModel.createProduct(req.body, mainImage, imagePaths);

      res.status(200).json({
        data: {
          product: {
            id: productId,
            ...req.body,
            main_image: mainImageURL,
            images: imageUrls,
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController; 
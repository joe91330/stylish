const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/all', ProductController.getProductsByCategory);
router.get('/men', ProductController.getProductsByCategory);
router.get('/women', ProductController.getProductsByCategory);
router.get('/accessories', ProductController.getProductsByCategory);
router.get('/search', ProductController.searchProducts);
router.get('/details', ProductController.getProductDetails);
router.post('/', upload.fields([
  { name: "main_image", maxCount: 1 },
  { name: "images", maxCount: 5 }
]), ProductController.createProduct);

module.exports = router; 
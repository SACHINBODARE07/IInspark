const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../controllers/authMiddleware');

router.get('/products', authMiddleware, productController.getProducts);
router.post('/buyProduct', authMiddleware, productController.buyProduct);

module.exports = router;

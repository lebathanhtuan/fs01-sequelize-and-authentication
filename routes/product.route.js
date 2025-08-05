const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller')
const { verifyToken, checkAdmin } = require('../middleware/auth')

// Products
router.get('/', productController.getProductList)
router.get('/:id', productController.getProductById)
router.post('/', verifyToken, checkAdmin, productController.createProduct)
router.patch('/:id', verifyToken, checkAdmin, productController.updateProduct)
router.delete('/:id', verifyToken, checkAdmin, productController.deleteProduct)

module.exports = router

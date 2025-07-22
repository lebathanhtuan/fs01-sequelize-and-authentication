const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller')

// Products
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)
router.post('/', productController.createProduct)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router

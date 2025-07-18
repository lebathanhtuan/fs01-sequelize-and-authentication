const express = require('express')
const router = express.Router()

let productList = [
  {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    name: 'iPhone 16 Pro',
    price: 30000000,
    brandId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  },
]

// Products
router.get('/', (req, res) => {
  res.status(200).json(productList)
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  const product = productList.find((item) => item.id === id)
  if (product) {
    res.status(200).json(product)
  } else {
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
  }
})

router.post('/', (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
  }
  productList.unshift(newProduct)
  res.status(201).json(newProduct) // Chuẩn RESTFull API
})

router.patch('/:id', (req, res) => {
  const { id } = req.params
  const newProduct = {
    id: id,
    ...req.body,
  }
  const currentIndex = productList.findIndex((item) => item.id === id)
  if (currentIndex !== -1) {
    productList.splice(currentIndex, 1, newProduct)
    res.status(200).json(newProduct) // Chuẩn RESTFull API
  } else {
    res.status(400).json({ message: 'Id không tồn tại' })
  }
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const currentIndex = productList.findIndex((item) => item.id === id)
  if (currentIndex !== -1) {
    productList.splice(currentIndex, 1)
    res.status(200).json({ message: 'Đã xóa sản phẩm' })
  } else {
    res.status(400).json({ message: 'Id không tồn tại' })
  }
})

module.exports = router

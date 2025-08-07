const path = require('path')
const { Op } = require('sequelize')
const asyncHandler = require('express-async-handler')

const { NotFoundError } = require('../utils/ApiError')

const { products, categories } = require('../models')

const getProductList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'id', order = 'asc', q } = req.query
  const categoryIds = req.query['categoryIds[]']
  const offset = (page - 1) * limit

  let whereClause = {}
  if (categoryIds) {
    whereClause.category_id = {
      [Op.in]: Array.isArray(categoryIds) ? categoryIds : [categoryIds],
    }
  }

  if (q) {
    whereClause.name = { [Op.like]: `%${q}%` }
  }

  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
  const sortColumn = ['id', 'name', 'price'].includes(sort) ? sort : 'id'

  const result = await products.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: categories,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
    // [['name', 'asc'], ['price', 'desc']] // Example of multiple sorting
    order: [[sortColumn, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  })

  const totalPages = Math.ceil(result.count / limit)

  res.json({
    data: result.rows,
    meta: {
      total: result.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
    },
  })
})

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await products.findByPk(id, {
    include: [
      {
        model: categories,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
  })
  if (!result) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }
  res.json(result)
})

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, categoryId } = req.body
  // Kiểm tra dữ liệu đầu vào
  const newProduct = await products.create({
    name,
    price,
    category_id: categoryId,
  })

  res.status(201).json(newProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, price, categoryId } = req.body

  const product = await products.findByPk(id)
  if (!product) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }

  product.name = name
  product.price = price
  product.category_id = categoryId
  await product.save()
  res.json(product)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params

  const product = await products.findByPk(id)
  if (!product) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }

  await product.destroy()
  res.json({ message: 'Xóa sản phẩm thành công' })
})

module.exports = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

const path = require('path')
const { Op } = require('sequelize')

const { products, categories } = require('../models')

const getProductList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'id',
      order = 'asc',
      categoryId,
      q,
    } = req.query
    const offset = (page - 1) * limit

    let whereClause = {}
    if (categoryId) {
      console.log('🚀 ~ getProductList ~ categoryId:', categoryId)
      whereClause.category_id = categoryId
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
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

const getProductById = async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(result)
  } catch (error) {
    // ... xử lý lỗi
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body
    // Kiểm tra dữ liệu đầu vào
    const newProduct = await products.create({
      name,
      price,
      category_id: categoryId,
    })

    res.status(201).json(newProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, categoryId } = req.body

    const product = await products.findByPk(id)
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy sản phẩm để cập nhật' })
    }

    product.name = name
    product.price = price
    product.category_id = categoryId
    await product.save()
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await products.findByPk(id)
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' })
    }

    await product.destroy()
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

module.exports = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

const path = require('path')
const db = require('../config/db')

const getAllProducts = async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM products')
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id])

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(result[0])
  } catch (error) {
    // ... xử lý lỗi
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body

    const sql =
      'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)'
    const [result] = await db.query(sql, [name, price, categoryId])

    res.status(201).json({
      id: result.insertId,
      ...req.body,
    })
  } catch (error) {
    // ... xử lý lỗi
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, categoryId } = req.body

    const sql =
      'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?'
    const [result] = await db.query(sql, [name, price, categoryId, id])

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy sản phẩm để cập nhật' })
    }
    res.json({
      id: id,
      ...req.body,
    })
  } catch (error) {
    // ... xử lý lỗi
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const sql = 'DELETE FROM products WHERE id = ?'
    const [result] = await db.query(sql, [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' })
    }
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    // ... xử lý lỗi
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

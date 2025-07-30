const path = require('path')
const db = require('../config/db')

const getAllCategories = async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM categories')
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await db.query('SELECT * FROM categories WHERE id = ?', [
      id,
    ])

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }
    res.json(result[0])
  } catch (error) {
    // ... xử lý lỗi
  }
}

const createCategory = async (req, res) => {
  try {
    const { name } = req.body

    const sql = 'INSERT INTO categories (name) VALUES (?)'
    const [result] = await db.query(sql, [name])

    res.status(201).json({
      id: result.insertId,
      ...req.body,
    })
  } catch (error) {
    // ... xử lý lỗi
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const sql = 'UPDATE categories SET name = ? WHERE id = ?'
    const [result] = await db.query(sql, [name, id])

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

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const sql = 'DELETE FROM categories WHERE id = ?'
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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}

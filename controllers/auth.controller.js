const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { users } = require('../models')

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await users.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await users.findOne({ where: { email: email } })
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Email hoặc mật khẩu không đúng!' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Email hoặc mật khẩu không đúng!' })
    }
    const token = jwt.sign({ id: user.id, email: user.email }, 'TUAN', {
      expiresIn: '1h',
    })

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token: token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
}

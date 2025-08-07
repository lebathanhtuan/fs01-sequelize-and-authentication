const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const { users } = require('../models')

const { UnauthorizedError, ForbiddenError } = require('../utils/ApiError')

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await users.create({
    username,
    email,
    password: hashedPassword,
  })

  res.status(201).json(newUser)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await users.findOne({ where: { email: email } })
  if (!user) {
    return res.status(404).json({ message: 'Email hoặc mật khẩu không đúng!' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' })
  }
  const tokenPayload = { id: user.id, email: user.email, role: user.role }
  const accessToken = jwt.sign(tokenPayload, 'TUAN', { expiresIn: '1h' })
  const refreshToken = jwt.sign(tokenPayload, 'TUAN', { expiresIn: '30d' })

  await user.update({ refresh_token: refreshToken })

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  })
})

const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const user = await users.findByPk(userId, {
    attributes: { exclude: ['password'] }, // Exclude password from response
  })
  res.status(200).json(user)
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) {
    throw new UnauthorizedError()
  }

  try {
    const user = await users.findOne({ where: { refresh_token: token } })
    if (!user) {
      throw new ForbiddenError()
    }

    jwt.verify(token, 'TUAN', (err, decoded) => {
      if (err || decoded.id !== user.id) {
        throw new ForbiddenError()
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        'TUAN',
        { expiresIn: '1h' }
      )

      res.status(200).json({ accessToken: newAccessToken })
    })
  } catch (error) {
    throw new ForbiddenError()
  }
})

module.exports = {
  register,
  login,
  getMyProfile,
  refreshAccessToken,
}

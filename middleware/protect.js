const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  // authorization: Bearer <token>
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, 'TUAN')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

module.exports = { protect }

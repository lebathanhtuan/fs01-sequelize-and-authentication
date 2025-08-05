const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  // Authorization: Bearer <token> -> ['Bearer', '<token>']
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // { id, email }
    const decoded = jwt.verify(token, 'TUAN')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

const checkAdmin = (req, res, next) => {
  const userRole = req.user.role

  if (userRole === 'admin') {
    next()
  } else {
    return res.status(403).json({ message: 'Forbidden' })
  }
}

module.exports = { verifyToken, checkAdmin }

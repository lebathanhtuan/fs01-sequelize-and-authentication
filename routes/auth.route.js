const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { protect } = require('../middleware/protect')

// Auth
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/my-profile', protect, authController.getMyProfile)

module.exports = router

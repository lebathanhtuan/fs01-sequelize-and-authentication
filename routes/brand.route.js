const express = require('express')
const router = express.Router()

let brandList = [
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    name: 'Apple',
  },
]

// Brand
router.get('/', (req, res) => {
  res.status(200).json(brandList)
})

module.exports = router

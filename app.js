const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const productRoutes = require('./routes/product.route')
const brandRoutes = require('./routes/brand.route')

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api/products', productRoutes)
app.use('/api/brands', brandRoutes)

app.listen(3000, () => {
  console.log('Đã chạy ok')
})

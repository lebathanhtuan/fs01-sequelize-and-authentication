const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const authRoutes = require('./routes/auth.route')
const productRoutes = require('./routes/product.route')
const categoryRoutes = require('./routes/category.route')

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

app.listen(3000, () => {
  console.log('Đã chạy ok')
})

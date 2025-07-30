// const mysql = require('mysql2')

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Aa@12345',
//   database: 'ecommerce_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// })

// module.exports = pool.promise()

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('ecommerce_db', 'root', 'Aa@12345', {
  host: 'localhost',
  dialect: 'mysql',
})

const checkConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Kết nối đến cơ sở dữ liệu thành công.')
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error)
  }
}

checkConnection()

module.exports = sequelize

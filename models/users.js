const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'username',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'email',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'username',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'username' }],
        },
        {
          name: 'email',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'email' }],
        },
      ],
    }
  )
}

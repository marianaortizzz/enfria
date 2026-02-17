const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Catalogo_Productos', timestamps: false });

module.exports = Producto;
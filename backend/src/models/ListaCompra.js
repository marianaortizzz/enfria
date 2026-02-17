const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ListaCompra = sequelize.define('ListaCompra', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  precio_estimado: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Lista_Compras', timestamps: false });

module.exports = ListaCompra;
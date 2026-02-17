const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventario = sequelize.define('Inventario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad_disponible: { type: DataTypes.INTEGER, defaultValue: 0 },
  fecha_ingreso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Inventario_Usuario', timestamps: false });

module.exports = Inventario;
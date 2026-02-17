const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleReceta = sequelize.define('DetalleReceta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Detalle_Receta_Productos', timestamps: false });

module.exports = DetalleReceta;
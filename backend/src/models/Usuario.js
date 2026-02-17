const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true }, // Calidad: correos únicos
  contraseña: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'Usuarios', timestamps: false });

module.exports = Usuario;
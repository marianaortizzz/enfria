const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Receta = sequelize.define('Receta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  pasos: { type: DataTypes.TEXT }, // TEXT para pasos largos
  de_la_semana: { type: DataTypes.BOOLEAN, defaultValue: false },
  tiempo_aproximado: { type: DataTypes.INTEGER }, // En minutos
  id_usuario: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Recetas', timestamps: false });

module.exports = Receta;
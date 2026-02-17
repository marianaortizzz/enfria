const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
require('dotenv').config();

require('./src/models/index'); 

const usuarioRoutes = require('./src/routes/authRoutes');
const inventarioRoutes = require('./src/routes/inventarioRoutes');
const listaRoutes = require('./src/routes/supermercadoRoutes');
const recetaRoutes = require('./src/routes/recetaRoutes');
const productoRoutes = require('./src/routes/productoRouter')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', usuarioRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/lista', listaRoutes);
app.use('/api/recetas', recetaRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada (SQLite)');
    app.listen(PORT, () => {
      console.log(`Servidor listo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la BD:', err);
  });
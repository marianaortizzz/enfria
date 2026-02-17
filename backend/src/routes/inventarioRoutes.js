const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventarioController');

// Definición de endpoints según tu planeación
router.post('/agregarInventario', invController.agregarInventario);
router.get('/mostrarInventario', invController.cargarInventario);
router.put('/modificarCantidadProducto', invController.modificarCantidadProducto);

module.exports = router;
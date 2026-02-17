const express = require('express');
const router = express.Router();
const recetaController = require('../controllers/recetaController');
router.post('/agregarReceta', recetaController.agregarReceta);
router.get('/mostrarRecetas', recetaController.mostrarRecetas);
router.put('/recetaSemanal', recetaController.recetaSemanal);
router.delete('/eliminarReceta/:id_receta', recetaController.eliminarReceta);
module.exports = router;
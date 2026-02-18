const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaCompracontroller');

router.post('/agregarSupermercado', listaController.agregarSupermercado);
router.get('/mostrarSupermercado', listaController.mostrarSupermercado);
router.delete('/eliminarSupermercado/:id_lista', listaController.eliminarSupermercado);
router.put('/modificarSupermercado/:id_lista', listaController.editarSupermercado);

module.exports = router;
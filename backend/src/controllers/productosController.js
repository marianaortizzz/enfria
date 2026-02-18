const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
    try {
        const { id_usuario } = req.query;

        // En Sequelize, el orden se pasa dentro del objeto de configuración
        const productos = await Producto.findAll({ 
            where: { id_usuario: id_usuario }
        });
        
        res.status(200).json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

module.exports = { obtenerProductos };
const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        const productos = await Producto.find({ usuario: usuarioId })
            .sort({ createdAt: -1 });
        
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
module.exports= { obtenerProductos };
const { Inventario, Producto } = require('../models');

const agregarInventario = async (req, res) => {
    try {
        const { nombre, cantidad_disponible, id_usuario, id_producto } = req.body;
        let finalProductoId = id_producto;

        if (nombre) {
            const [producto, creado] = await Producto.findOrCreate({
                where: { 
                    nombre: nombre.trim(), 
                    id_usuario: id_usuario 
                }
            });
            finalProductoId = producto.id;
            console.log(creado ? "Nuevo producto creado en catálogo" : "Producto existente usado");
        }

        if (!finalProductoId) {
            return res.status(400).json({ 
                error: "Debe proporcionar el nombre del producto o un ID válido." 
            });
        }

        const nuevoItem = await Inventario.create({
            id_producto: finalProductoId,
            id_usuario: id_usuario,
            cantidad_disponible: cantidad_disponible || 0,
            fecha_ingreso: new Date()
        });

        res.status(201).json(nuevoItem);
    } catch (error) {
        console.error("Error al agregar inventario:", error);
        res.status(500).json({ error: "Error interno al procesar el inventario." });
    }
};

const cargarInventario = async (req, res) => {
    try {
        const { id_usuario } = req.query;

        if (!id_usuario) {
            return res.status(400).json({ error: "Falta el ID de usuario." });
        }

        const inventario = await Inventario.findAll({
            where: { id_usuario },
            include: [{
                model: Producto,
                attributes: ['nombre']
            }],
            order: [['fecha_ingreso', 'DESC']] 
        });

        res.json(inventario);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar la lista de inventario." });
    }
};

const modificarCantidadProducto = async (req, res) => {
    try {
        const { id_inventario, cantidad } = req.body;

        const registro = await Inventario.findByPk(id_inventario);
        
        if (!registro) {
            return res.status(404).json({ error: "El registro no existe en el inventario." });
        }

        registro.cantidad_disponible = cantidad;
        await registro.save();

        res.json({ 
            mensaje: "Cantidad actualizada con éxito", 
            nuevoStock: registro.cantidad_disponible 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad." });
    }
};

module.exports = {
    agregarInventario,
    cargarInventario,
    modificarCantidadProducto
};
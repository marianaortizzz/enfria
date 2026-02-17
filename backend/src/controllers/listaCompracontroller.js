const { ListaCompra, Producto, Inventario } = require('../models');


const agregarSupermercado = async (req, res) => {
    try {
        const { nombre, precio_estimado, cantidad, id_usuario, id_producto } = req.body;
        let finalProductoId = id_producto;
        if (nombre) {
            const [producto] = await Producto.findOrCreate({
                where: { nombre: nombre.trim(), id_usuario: id_usuario }
            });
            finalProductoId = producto.id;
        }
        if (!finalProductoId) {
            return res.status(400).json({ error: "Se requiere nombre o ID de producto válido." });
        }
        const itemLista = await ListaCompra.create({
            id_producto: finalProductoId,
            id_usuario: id_usuario,
            precio_estimado: precio_estimado || 0,
            cantidad: cantidad || 1
        });
        res.status(201).json(itemLista);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar a la lista de compras." });
    }
};

const mostrarSupermercado = async (req, res) => {
    try {
        const { id_usuario } = req.query;

        const lista = await ListaCompra.findAll({
            where: { id_usuario },
            include: [{ model: Producto, attributes: ['nombre'] }]
        });
        const totalEstimado = lista.reduce((acc, item) => acc + (item.precio_estimado * item.cantidad), 0);
        res.json({
            productos: lista,
            total_estimado: totalEstimado.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista de compras." });
    }
};

const eliminarSupermercado = async (req, res) => {
    try {
        const { id_lista } = req.params;

        const eliminado = await ListaCompra.destroy({
            where: { id: id_lista }
        });

        if (!eliminado) {
            return res.status(404).json({ error: "El producto no existe en la lista." });
        }

        res.json({ mensaje: "Producto eliminado de la lista correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
};

const verificarStockParaLista = async (id_usuario, id_producto) => {
    try {
        const itemInventario = await Inventario.findOne({
            where: { id_usuario, id_producto }
        });

        if (itemInventario && itemInventario.cantidad_disponible === 1) {
            const existeEnLista = await ListaCompra.findOne({ where: { id_usuario, id_producto } });
            
            if (!existeEnLista) {
                await ListaCompra.create({
                    id_usuario,
                    id_producto,
                    cantidad: 1,
                    precio_estimado: 0
                });
                console.log("Sistema: Producto agregado automáticamente a la lista por bajo stock.");
            }
        }
    } catch (error) {
        console.error("Error en automatización de lista:", error);
    }
};

module.exports = {
    agregarSupermercado,
    mostrarSupermercado,
    eliminarSupermercado,
    verificarStockParaLista
};
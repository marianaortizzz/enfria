const { Receta, Producto, DetalleReceta } = require('../models');

const agregarReceta = async (req, res) => {
    try {
        const { nombre, pasos, de_la_semana, tiempo_aproximado, id_usuario, ingredientes } = req.body;

        const nuevaReceta = await Receta.create({
            nombre,
            pasos: JSON.stringify(pasos), 
            de_la_semana: de_la_semana || false,
            tiempo_aproximado,
            id_usuario
        });
        if (ingredientes && ingredientes.length > 0) {
            const detalles = ingredientes.map(ing => ({
                id_receta: nuevaReceta.id,
                id_producto: ing.id_producto,
                cantidad: ing.cantidad
            }));
            await DetalleReceta.bulkCreate(detalles);
        }
        res.status(201).json(nuevaReceta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la receta" });
    }
};

const mostrarRecetas = async (req, res) => {
    try {
        const { id_usuario } = req.query;
        const recetas = await Receta.findAll({
            where: { id_usuario },
            include: [{ model: Producto }] 
        });
        const recetasFormateadas = recetas.map(r => {
            const receta = r.toJSON();
            try {
                receta.pasos = JSON.parse(receta.pasos);
            } catch (e) {
                receta.pasos = [];
            }
            return receta;
        });

        res.json(recetasFormateadas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener recetas" });
    }
};

const recetaSemanal = async (req, res) => {
    try {
        const { id_receta } = req.body;
        const receta = await Receta.findByPk(id_receta);

        if (!receta) {
            return res.status(404).json({ error: "Receta no encontrada" });
        }
        receta.de_la_semana = !receta.de_la_semana;
        await receta.save();

        res.json({ mensaje: "Estado de receta semanal actualizado", de_la_semana: receta.de_la_semana });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar receta semanal" });
    }
};
const eliminarReceta = async (req, res) => {
    try {
        const { id_receta } = req.params;

        const borrada = await Receta.destroy({ where: { id: id_receta } });

        if (!borrada) {
            return res.status(404).json({ error: "La receta no existe" });
        }

        res.json({ mensaje: "Receta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar receta"+error.message });
    }
};

module.exports = {
    agregarReceta,
    mostrarRecetas,
    recetaSemanal,
    eliminarReceta
};
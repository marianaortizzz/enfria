import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '../api/api';

export const useDashboardData = (user) => {
    const [productos, setProductos] = useState([]);
    const [listaCompras, setListaCompras] = useState([]); // <-- Faltaba este
    const [recetas, setRecetas] = useState([]);           // <-- Faltaba este
    const [modalConfig, setModalConfig] = useState({ abierto: false, tipo: null, datos: null });
    const [catalogo, setCatalogo] = useState([]);
    const [esNuevoProducto, setEsNuevoProducto] = useState(false);
    const [ingredientesReceta, setIngredientesReceta] = useState([]);
    // CARGA DE DATOS AL INICIAR
    useEffect(() => {
        if (user) {
            cargarDatos();
        }
    }, [user]);

    const cargarDatos = async () => {
        try {
            const [resInv, resCompras, resRecetas, resCatalogo] = await Promise.all([
                apiCall(`/inventario/mostrarInventario?id_usuario=${user.id}`),
                apiCall(`/lista/mostrarSupermercado?id_usuario=${user.id}`), 
                apiCall(`/recetas/mostrarRecetas?id_usuario=${user.id}`),
                apiCall('/obtenerProductos?id_usuario=' + user.id) // Para el catálogo del modal verde
            ]);

            setProductos(resInv);
            setListaCompras(resCompras.productos || []); 
            console.log("Lista de compras recibida:", resCompras.productos);
            setCatalogo(resCatalogo.data);
            setRecetas(resRecetas);
        } catch (err) {
            console.error("Error al cargar dashboard:", err);
        }
    };

    // FUNCIONES DE MODAL
    const abrirModal = (tipo, datos = null) => {
        setModalConfig({ abierto: true, tipo, datos });
    };

    const cerrarModal = () => {
        setModalConfig({ abierto: false, tipo: null, datos: null });
        setEsNuevoProducto(false); // Resetear el checkbox
        cargarDatos();
    };

    const handleModificarCantidad = async (id_inventario, nuevaCantidad) => {
    // Regla de negocio: No permitir cantidades negativas
        if (nuevaCantidad < 0) return;

        try {
            // Llamada a tu endpoint del backend
            await apiCall('/inventario/modificarCantidadProducto', 'PUT', {
                id_inventario,
                cantidad: nuevaCantidad
            });

            // Actualización optimista: Actualizamos el estado local para que sea instantáneo
            setProductos(prevProductos => 
                prevProductos.map(item => 
                    item.id === id_inventario 
                    ? { ...item, cantidad_disponible: nuevaCantidad } 
                    : item
                )
            );
        } catch (err) {
            alert("No se pudo actualizar la cantidad: " + err.message);
            // Si falla, recargamos los datos originales de la DB
            cargarDatos();
        }
    };

    const handleEliminarCompra = async (id_compra) => {
        if (!window.confirm("¿Eliminar este producto de la lista?")) return;
        
        try {
            await apiCall(`/lista/eliminarSupermercado/${id_compra}`, 'DELETE');
            // Filtramos el estado local para borrarlo visualmente
            setListaCompras(prev => prev.filter(item => item.id !== id_compra));
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    // Función para editar (Abre el Modal Amarillo)
    const handleEditarCompra = (item) => {
        abrirModal('naranja', item); // Pasamos los datos del ítem al modal
    };

    const handleToggleSemana = async (id_receta, estadoActual) => {
        try {
            // Invertimos el estado actual: si es true pasa a false, y viceversa.
            const nuevoEstado = !estadoActual;

            // Llamada a la API (Asumiendo que tu backend tiene un endpoint PUT para esto)
            await apiCall(`/recetas/recetaSemanal`, 'PUT', {
                id_receta,
                es_semanal: nuevoEstado
            });

            // Actualización optimista del estado local para que la estrella cambie al instante
            setRecetas(prevRecetas => 
                prevRecetas.map(receta => 
                    receta.id === id_receta 
                    ? { ...receta, es_semanal: nuevoEstado } 
                    : receta
                )
            );

        } catch (err) {
            console.error("Error al actualizar receta de la semana:", err);
            alert("No se pudo actualizar la receta. Revisa la conexión con el servidor.");
        }
    };

    const handleVerDetalles = (receta) => {
        // Esto abriría el modal naranja que definimos antes
        abrirModal('azul', receta);
    };
    const handleEliminarReceta = async (id_receta) => {
        if (!window.confirm("¿Eliminar esta receta?")) return;
        try {
            await apiCall(`/recetas/eliminarReceta/${id_receta}`, 'DELETE');
            setRecetas(prev => prev.filter(r => r.id !== id_receta));
        } catch (err) {
            alert("Error al eliminar la receta");
        }
    };

    // Retornamos todo lo que el Dashboard necesita para pintar las tablas y modales
    return { 
        productos, listaCompras, recetas, catalogo, 
        modalConfig, abrirModal, cerrarModal,
        handleEditarCompra, handleModificarCantidad, handleEliminarCompra, handleToggleSemana, handleVerDetalles, cargarDatos, handleEliminarReceta
    };
};

export default useDashboardData;
import React, { useState, useEffect } from 'react';
import { apiCall } from '../api/api';
import { useUser } from '../context/UserContext';
// Importamos los nuevos componentes que creamos
import ItemRefrigerador from '../components/ItemRefrigerador';
import ItemCompra from '../components/ItemCompra';
import RecetaCard from '../components/RecetaCard';
// Iconos
import { 
    Plus, Edit3, Eye, ShoppingCart, 
    UtensilsCrossed, Package, X, Utensils, Clock, Users, ListChecks, BookOpen, DollarSign, Edit2
} from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useUser();
    
    // ESTADOS
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

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Enfria - Mi Cocina Inteligente</h1>
                <p>Bienvenido, {user?.nombre}</p>
            </header>

            <main className="dashboard-grid">
                
                {/* 1. MI REFRIGERADOR */}
                <section className="card card-refrigerador">
                    <div className="card-header">
                        <h2><Package /> Mi Refrigerador</h2>
                        <div className="actions">
                            <button className="btn-icon btn-green" onClick={() => abrirModal('verde')} title="Agregar Producto">
                                <Plus size={18}/>
                            </button>
                        </div>
                    </div>
                    <div className="card-content scrollable">
                        {productos.map(item => (
                            <ItemRefrigerador 
                                key={item.id} 
                                item={item} 
                                onModificar={handleModificarCantidad} 
                            />
                        ))}
                    </div>
                </section>

                {/* 2. LISTA DE COMPRAS */}
                <section className="card card-compras">
                    <div className="card-header">
                        <h2><ShoppingCart /> Lista de Compras</h2>
                        <button className="btn-icon btn-yellow" onClick={() => abrirModal('amarillo')} title="Agregar Producto">
                                <Plus size={18}/>
                        </button>
                    </div>
                    <div className="card-content">
                        {Array.isArray(listaCompras) ? (
                            listaCompras.map(item => (
                                <ItemCompra 
                                    key={item.id} 
                                    item={item} 
                                    onEditar={handleEditarCompra} 
                                    onEliminar={handleEliminarCompra}
                                />
                            ))
                        ) : (
                            <p>No hay productos en la lista de compras.</p>
                        )}
                    </div>
                </section>

                {/* 3. RECETAS DE LA SEMANA */}
                <section className="card card-recetas">
                    <div className="card-header">
                        <h2><UtensilsCrossed /> Recetas de la Semana</h2>
                        <button className="btn-icon btn-red" onClick={() => abrirModal('rojo')} title="Agregar Producto">
                                <Plus size={18}/>
                        </button>
                        {/* Botones de acción general... */}
                    </div>
                    <div className="card-content">
                        {recetas.map(receta => (
                            <RecetaCard 
                                key={receta.id} 
                                receta={receta} 
                                onVerDetalles={handleVerDetalles}
                                onToggleSemana={handleToggleSemana}
                            />
                        ))}
                    </div>
                    {/* Footer con el botón rosa... */}
                </section>
            </main>

            {/* --- COMPONENTE MODAL --- */}
            {modalConfig.abierto && (
                            <div className="modal-overlay">
                                <div className={`modal-content border-${modalConfig.tipo}`}>
                                    <button className="close-btn" onClick={cerrarModal}><X /></button>
                                    
                                    {/* Contenido condicional según el color */}
                                    {modalConfig.tipo === 'verde' && (
                        <div className="form-container">
                            <h3><Plus className="icon-green" /> Agregar al Refrigerador</h3>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                
                                const payload = {
                                    id_usuario: user.id,
                                    cantidad: formData.get('cantidad'),
                                    nombre: esNuevoProducto ? formData.get('nombre_nuevo') : null
                                };

                                try {
                                    await apiCall('/inventario/agregarInventario', 'POST', payload);
                                    alert("¡Producto guardado!");
                                    cerrarModal();
                                } catch (err) {
                                    alert("Error: " + err.message);
                                }
                            }}>
                                
                                <div className="toggle-container">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={esNuevoProducto}
                                            onChange={(e) => setEsNuevoProducto(e.target.checked)} 
                                        />
                                        El producto no está en la lista (crear nuevo)
                                    </label>
                                </div>

                                {esNuevoProducto ? (
                                    <div className="form-group">
                                        <label>Nombre del Nuevo Producto</label>
                                        <input 
                                            name="nombre_nuevo" 
                                            placeholder="Ej. Cilantro fresco" 
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Seleccionar del Catálogo</label>
                                        <select name="id_catalogo" required className="form-input">
                                            <option value="">-- Elige un producto --</option>
                                            {catalogo.map(prod => (
                                                <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Cantidad</label>
                                    <input name="cantidad" type="number" min="1" defaultValue="1" required className="form-input" />
                                </div>

                                <div className="modal-footer-btns">
                                    <button type="button" className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                    <button type="submit" className="btn-save btn-green-full">Confirmar</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {modalConfig.tipo === 'amarillo' && (
                        <div className="form-container">
                            <h3><ShoppingCart className="icon-yellow" /> Agregar a Lista de Compras</h3>
                            <p>Anota lo que necesitas comprar para tu próxima visita al súper.</p>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                
                                const payload = {
                                    nombre: esNuevoProducto 
                                        ? formData.get('nombre_nuevo') 
                                        : catalogo.find(p => p.id == formData.get('id_catalogo'))?.nombre,
                                    
                                    precio_estimado: parseFloat(formData.get('precio')), 
                                    cantidad: parseInt(formData.get('cantidad')),      
                                    id_usuario: user.id
                                };

                                try {
                                    await apiCall('/lista/agregarSupermercado', 'POST', payload);
                                    alert("¡Añadido a la lista!");
                                    cerrarModal();
                                } catch (err) {
                                    alert("Error al guardar: " + err.message);
                                }
                            }}>
                                
                                {/* Reutilizamos el switch de 'esNuevoProducto' que definimos antes */}
                                <div className="toggle-container toggle-yellow">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={esNuevoProducto}
                                            onChange={(e) => setEsNuevoProducto(e.target.checked)} 
                                        />
                                        Es un producto nuevo (no está en el catálogo)
                                    </label>
                                </div>

                                {esNuevoProducto ? (
                                    <div className="form-group">
                                        <label>¿Qué necesitas comprar?</label>
                                        <input 
                                            name="nombre_nuevo" 
                                            placeholder="Ej. Jabón para trastes" 
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Seleccionar Producto</label>
                                        <select name="id_catalogo" required className="form-input">
                                            <option value="">-- Buscar en catálogo --</option>
                                            {catalogo.map(prod => (
                                                <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Cantidad</label>
                                        <input 
                                            name="cantidad" 
                                            type="number" 
                                            min="1" 
                                            defaultValue="1" 
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Precio Estimado ($)</label>
                                        <input 
                                            name="precio" 
                                            type="number" 
                                            step="0.01" 
                                            placeholder="0.00" 
                                            className="form-input" 
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer-btns">
                                    <button type="button" className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                    <button type="submit" className="btn-save btn-yellow-full">Añadir a la lista</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {modalConfig.tipo === 'naranja' && modalConfig.datos && (
                        <div className="form-container">
                            <h3><Edit3 className="icon-yellow" /> Editar Producto de la Lista</h3>
                            <p>Actualiza la cantidad o el precio estimado de <strong>{modalConfig.datos.Catalogo_Producto?.nombre || modalConfig.datos.nombre}</strong>.</p>
                            
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                
                                const payload = {
                                    id_lista_compras: modalConfig.datos.id, 
                                    cantidad: parseInt(formData.get('cantidad')),
                                    precio_estimado: parseFloat(formData.get('precio')),
                                    id_usuario: user.id
                                };

                                try {
                                    await apiCall('/lista-compras/actualizar', 'PUT', payload);
                                    alert("Producto actualizado correctamente");
                                    cerrarModal(); // Refresca el dashboard
                                } catch (err) {
                                    alert("Error al actualizar: " + err.message);
                                }
                            }}>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Cantidad</label>
                                        <input 
                                            name="cantidad" 
                                            type="number" 
                                            min="1" 
                                            defaultValue={modalConfig.datos.cantidad_a_comprar || modalConfig.datos.cantidad} 
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Precio Estimado ($)</label>
                                        <input 
                                            name="precio" 
                                            type="number" 
                                            step="0.01" 
                                            defaultValue={modalConfig.datos.precio_aproximado || modalConfig.datos.precio_estimado} 
                                            className="form-input" 
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer-btns">
                                    <button type="button" className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                                    <button type="submit" className="btn-save btn-yellow-full">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    )}

                        {modalConfig.tipo === 'azul' && modalConfig.datos && (
                            <div className="recipe-detail-container">
                                <header className="recipe-modal-header">
                                    <div className="recipe-title-group">
                                        <Utensils className="icon-blue" size={28} />
                                        <div>
                                            <h3>{modalConfig.datos.nombre}</h3>
                                            <span className="recipe-category">Receta de la semana</span>
                                        </div>
                                    </div>
                                    <div className="recipe-stats">
                                        <div className="stat">
                                            <Clock size={16} />
                                            <span>{modalConfig.datos.tiempo_estimado} min</span>
                                        </div>
                                    </div>
                                </header>

                                <section className="recipe-section">
                                    <h4><ListChecks size={18} /> Ingredientes necesarios</h4>
                                    <ul className="ingredients-list">
                                        {/* Asumiendo que tu API trae los ingredientes relacionados */}
                                        {modalConfig.datos.Productos?.map((ing, index) => (
                                            <li key={index} className="ingredient-item">
                                                <input type="checkbox" id={`ing-${index}`} />
                                                <label htmlFor={`ing-${index}`}>
                                                    {ing.DetalleReceta.cantidad} {ing.nombre}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="recipe-section">
                                    <h4><BookOpen size={18} /> Instrucciones</h4>
                                    <p className="recipe-instructions">
                                        {modalConfig.datos.pasos || "No hay instrucciones detalladas para esta receta."}
                                    </p>
                                </section>

                                <div className="modal-footer-btns">
                                    <button className="btn-secondary" onClick={cerrarModal}>Cerrar</button>
                                </div>
                            </div>
                        )}

                        {modalConfig.tipo === 'rojo' && (
                            <div className="form-container recipe-creator">
                                <h3><UtensilsCrossed className="icon-red" /> Crear Nueva Receta</h3>
                                
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    
                                    const payload = {
                                        id_usuario: user.id,
                                        nombre: formData.get('nombre'),
                                        tiempo_estimado: formData.get('tiempo'),
                                        instrucciones: formData.get('instrucciones'),
                                        ingredientes: ingredientesReceta // Enviamos el array de objetos
                                    };

                                    try {
                                        await apiCall('/recetas/crear', 'POST', payload);
                                        alert("¡Receta creada con éxito!");
                                        setIngredientesReceta([]); // Limpiamos ingredientes
                                        cerrarModal();
                                    } catch (err) {
                                        alert("Error al guardar la receta: " + err.message);
                                    }
                                }}>
                                    {/* Datos Generales */}
                                    <div className="form-group">
                                        <label>Nombre de la Receta</label>
                                        <input name="nombre" placeholder="Ej. Tacos de Pollo" required className="form-input" />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tiempo (min)</label>
                                            <input name="tiempo" type="number" defaultValue="30" className="form-input" />
                                        </div>
                                    </div>

                                    {/* Selector de Ingredientes */}
                                    <div className="ingredients-selector-box">
                                        <h4>Añadir Ingredientes</h4>
                                        <div className="add-ingredient-inline">
                                            <select id="select-ingrediente" className="form-input">
                                                <option value="">Selecciona producto...</option>
                                                {catalogo.map(p => <option key={p.id} value={p.id} data-nombre={p.nombre}>{p.nombre}</option>)}
                                            </select>
                                            <input id="cant-ingrediente" type="text" placeholder="Cant. (ej: 500g)" className="form-input qty-small" />
                                            <button 
                                                type="button" 
                                                className="btn-add-circle"
                                                onClick={() => {
                                                    const sel = document.getElementById('select-ingrediente');
                                                    const cant = document.getElementById('cant-ingrediente');
                                                    if(!sel.value || !cant.value) return;

                                                    const nuevoIng = {
                                                        id_catalogo: sel.value,
                                                        nombre: sel.options[sel.selectedIndex].text,
                                                        cantidad: cant.value
                                                    };
                                                    setIngredientesReceta([...ingredientesReceta, nuevoIng]);
                                                    cant.value = ""; // Limpiar input
                                                }}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        {/* Lista de Ingredientes Agregados */}
                                        <div className="added-ingredients-list">
                                            {ingredientesReceta.map((ing, idx) => (
                                                <div key={idx} className="ing-tag">
                                                    <span>{ing.nombre} ({ing.cantidad})</span>
                                                    <X size={14} onClick={() => setIngredientesReceta(ingredientesReceta.filter((_, i) => i !== idx))} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Instrucciones de preparación</label>
                                        <textarea name="instrucciones" rows="4" className="form-input text-area" placeholder="Paso 1: Picar el pollo..."></textarea>
                                    </div>

                                    <div className="modal-footer-btns">
                                        <button type="button" className="btn-secondary" onClick={() => {cerrarModal(); setIngredientesReceta([]);}}>Cancelar</button>
                                        <button type="submit" className="btn-save btn-red-full">Guardar Receta</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={cerrarModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
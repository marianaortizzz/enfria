import React from 'react';
import { useUser } from '../context/UserContext';
import useDashboardData from './hooks';
import ModalManager from './modals/ModalManager';
// Componentes de UI
import ItemRefrigerador from '../components/ItemRefrigerador';
import ItemCompra from '../components/ItemCompra';
import RecetaCard from '../components/RecetaCard';
import { Plus, ShoppingCart, Package, UtensilsCrossed } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useUser();
    const { 
        productos, listaCompras, recetas, catalogo, 
        modalConfig, abrirModal, cerrarModal,
        handleEditarCompra, handleModificarCantidad, handleEliminarCompra, handleToggleSemana, handleVerDetalles, cargarDatos, handleEliminarReceta
    } = useDashboardData(user);

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Enfria - Mi Cocina Inteligente</h1>
                <h2>Hola {user?.nombre}</h2>
            </header>

            <main className="dashboard-grid">
                <section className="card">
                    <div className="card-header">
                        <h2><Package /> Mi Refrigerador</h2>
                        <button className="btn-green" onClick={() => abrirModal('verde')}><Plus size={18}/></button>
                    </div>
                    <div className="card-content scrollable">
                        {productos.map(item => <ItemRefrigerador key={item.id} item={item} onModificar={handleModificarCantidad} />)}
                    </div>
                </section>

                <section className="card">
                    <div className="card-header">
                        <h2><ShoppingCart /> Lista de Compras</h2>
                        <button className="btn-yellow" onClick={() => abrirModal('amarillo')}><Plus size={18}/></button>
                    </div>
                    <div className="card-content">
                        {listaCompras.map(item => <ItemCompra key={item.id} item={item} onEditar={() => abrirModal('naranja', item)} onEliminar={handleEliminarCompra} />)}
                    </div>
                </section>

                <section className="card">
                    <div className="card-header">
                        <h2><UtensilsCrossed /> Recetas</h2>
                        <button className="btn-red" onClick={() => abrirModal('rojo')}><Plus size={18}/></button>
                    </div>
                    <div className="card-content">
                        {recetas.map(receta => <RecetaCard key={receta.id} receta={receta} onVerDetalles={() => abrirModal('azul', receta)} onToggleSemana={handleToggleSemana} onEliminarReceta={handleEliminarReceta} />)}
                    </div>
                </section>
            </main>

            <ModalManager 
                config={modalConfig} 
                onClose={cerrarModal} 
                catalogo={catalogo}
                userId={user?.id}
            />
        </div>
    );
};

export default Dashboard;
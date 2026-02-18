import React, { useState } from 'react';
import { apiCall } from '../api/api';
import { useUser } from '../context/UserContext';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle entre Login y Registro
    const [formData, setFormData] = useState({ nombre: '', correo: '', contraseña: '' });
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/registro';
        
        try {
            const data = await apiCall(endpoint, 'POST', formData);
            // Si el backend responde con el objeto usuario (que incluye el id)
            setUser(data.usuario || data); 
            alert(`¡Bienvenido, ${data.usuario?.nombre || 'Usuario'}!`);
            navigate('/dashboard');
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input 
                        type="text" placeholder="Nombre" 
                        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                )}
                <input 
                    type="email" placeholder="Correo" required
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                />
                <input 
                    type="password" placeholder="Contraseña" required
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                    onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} 
                    {isLogin ? ' Entrar' : ' Crear Cuenta'}
                </button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', cursor: 'pointer', color: 'blue', marginTop: '15px' }}>
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
            </p>
        </div>
    );
};

export default Login;
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Intentamos cargar el usuario desde localStorage para que no se borre al refrescar
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('usuario_enfria');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Cada vez que el usuario cambie, lo guardamos en el navegador
    useEffect(() => {
        if (user) {
            localStorage.setItem('usuario_enfria', JSON.stringify(user));
        } else {
            localStorage.removeItem('usuario_enfria');
        }
    }, [user]);

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto más fácil
export const useUser = () => useContext(UserContext);
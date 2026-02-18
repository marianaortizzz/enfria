import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Login from './views/Login';
import Inventario from './views/Dashboard';
const ProtectedRoute = ({ children }) => {
    const { user } = useUser();
    return user ? children : <Navigate to="/" />;
};

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Inventario />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
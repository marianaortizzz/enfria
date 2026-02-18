const API_BASE_URL = 'http://localhost:3000/api';

export const apiCall = async (endpoint, method = 'GET', body = null) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
    });
    if (!response.ok) throw new Error('Error en la comunicación con el servidor');
    return response.json();
};
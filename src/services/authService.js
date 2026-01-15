import api from './api';

const authService = {
    // Iniciar sesión
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Registrar usuario
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Obtener usuario actual
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Obtener token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Refrescar información del usuario
    refreshUser: async () => {
        const response = await api.get('/user');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    // Cambiar contraseña
    changePassword: async (data) => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },
};

export default authService;

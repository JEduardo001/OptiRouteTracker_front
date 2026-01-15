import api from './api';

const categoryService = {
    // Obtener todas las categorías
    getAll: async (params = {}) => {
        const response = await api.get('/category?page=' + params.page + "&" + "size=" + params.size);
        return response.data.data;
    },

    // Obtener categoría por ID
    getById: async (id) => {
        const response = await api.get(`/category/${id}`);
        return response.data.data;
    },

    // Crear categoría
    create: async (data) => {
        const response = await api.post('/category', data);
        return response.data.data;
    },

    // Actualizar categoría
    update: async (data) => {
        const response = await api.put(`/category`, data);
        return response.data.data;
    },

    // Eliminar categoría
    delete: async (id) => {
        const response = await api.delete(`/category/${id}`);
        return response.data.data;
    },

    // Obtener solo categorías activas
    getActive: async () => {
        const response = await api.get('/category/active');
        return response.data.data;
    },

    // Activar/desactivar categoría
    toggleActive: async (id) => {
        const response = await api.patch(`/category/${id}/toggle-active`);
        return response.data.data;
    },
};

export default categoryService;

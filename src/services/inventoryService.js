import api from './api';

const inventoryService = {
    // Obtener todos los inventarios
    getAll: async (params = {}) => {
        const response = await api.get('/inventory?page=' + params.page + "&" + "size=" + params.size );
        return response.data.data;
    },

    // Obtener inventario por ID
    getById: async (id) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data.data.data;
    },

    // Crear inventario
    create: async (data) => {
        const response = await api.post('/inventory', data);
        return response.data.data.data;
    },

    // Actualizar inventario
    update: async (data) => {
        const response = await api.put(`/inventory`, data);
        return response.data.data.data;
    },

    // Eliminar inventario
    delete: async (id) => {
        const response = await api.delete(`/inventory/${id}`);
        return response.data.data.data;
    },

    // Buscar inventarios
    search: async (query) => {
        const response = await api.get('/inventory/search', { params: { q: query } });
        return response.data.data.data;
    },

    // Obtener estadísticas del inventario
    getStats: async (id) => {
        const response = await api.get(`/inventory/${id}/stats`);
        return response.data.data.data;
    },

    // Obtener productos de un inventario
    getProducts: async (id) => {
        const response = await api.get(`/inventory/${id}/products`);
        return response.data.data.data;
    },
};

export default inventoryService;

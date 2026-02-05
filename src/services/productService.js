import api from './api';

const productService = {
    // Obtener todos los productos
    getAll: async (params = {}) => {
        const response = await api.get('/product?page=' + params.page + "&" + "size=" + params.size);
        return response.data.data;
    },

    // Obtener producto por ID
    getById: async (id) => {
        const response = await api.get(`/product/${id}`);
        return response.data.data;
    },

    // Crear producto
    create: async (data) => {
        const response = await api.post('/product', data);
        return response.data.data;
    },

    // Actualizar producto
    update: async (data) => {
        const response = await api.put(`/product`, data);
        return response.data.data;
    },

    // Eliminar producto
    delete: async (id) => {
        const response = await api.delete(`/product/${id}`);
        return response.data.data;
    },

    // Buscar productos
    search: async (query) => {
        const response = await api.get('/product/search', { params: { q: query } });
        return response.data.data;
    },

    // Obtener productos por inventario
    getByInventory: async (inventoryId) => {
        const response = await api.get(`/product/inventory/${inventoryId}`);
        return response.data.data;
    },

    // Obtener productos por categoría
    getByCategory: async (categoryId) => {
        const response = await api.get(`/product/category/${categoryId}`);
        return response.data.data;
    },

    // Activar/desactivar producto
    toggleActive: async (id) => {
        const response = await api.patch(`/product/${id}/toggle-active`);
        return response.data.data;
    },
};

export default productService;

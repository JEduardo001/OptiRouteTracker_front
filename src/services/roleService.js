import api from './api';

const roleService = {
    // Obtener todos los roles
    getAll: async (params = {}) => {
        const response = await api.get('/role?page=' + params.page + "&" + "size=" + params.size);
        return response.data.data;
    },
};

export default roleService;

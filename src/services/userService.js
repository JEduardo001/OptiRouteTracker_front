import api from './api';

const userService = {
    // Obtener todos los usuarios
    getAll: async (params = {}) => {
        const response = await api.get('/user?page=' + params.page + "&" + "size=" + params.size);
        return response.data.data;
    },

    // Obtener usuario por ID
    getById: async (id) => {
        const response = await api.get(`/user/${id}`);
        return response.data.data;
    },

    // Crear usuario
    create: async (data) => {
        console.log("cccc : ", data)
        const response = await api.post('/user', data);
        return response.data.data;
    },

    // Actualizar usuario
    update: async (data) => {
        console.log("datos a enviar", data)
        const response = await api.put(`/user`, data);
        console.log("rspuesta: ",response )
        return response.data.data;
    },

    // Eliminar usuario
    delete: async (id) => {
        const response = await api.delete(`/user/${id}`);
        return response.data.data;
    },

    // Actualizar perfil propio
    updateProfile: async (data) => {
        const response = await api.put('/user/profile', data);
        return response.data.data;
    },

    // Obtener perfil
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data.data;
    },

    // Activar/desactivar usuario
    toggleActive: async (id) => {
        const response = await api.patch(`/user/${id}/toggle-active`);
        return response.data.data;
    },

    // Obtener roles disponibles
    getRoles: async () => {
        const response = await api.get('/roles');
        return response.data.data;
    },

    // Asignar roles a usuario
    assignRoles: async (userId, roleIds) => {
        const response = await api.put(`/user/${userId}/roles`, { roleIds });
        return response.data.data;
    },
};

export default userService;

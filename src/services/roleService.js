import api from './api';

const roleService = {
    // Obtener todos los roles
    getAll: async (params = {}) => {
        console.log("mmdamsdm")
        const response = await api.get('/role?page=' + params.page + "&" + "size=" + params.size);
        console.log("ccc: ", response)
        return response.data.data;
    },
};

export default roleService;

import api from './api';

const BoyeroService = {
    getAll: async () => {
        const response = await api.get('/boyeros/');
        return response.data;
    },

    toggle: async (id, isOn) => {
        const response = await api.patch(`/boyeros/${id}/estado`, { is_on: isOn });
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/boyeros/${id}`, data);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/boyeros/', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/boyeros/${id}`);
        return response.data;
    }
};

export default BoyeroService;

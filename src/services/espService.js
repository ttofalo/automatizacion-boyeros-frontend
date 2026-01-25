import api from './api';

const EspService = {
    getAll: async () => {
        const response = await api.get('/esp');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/esp', data);
        return response.data;
    }
};

export default EspService;

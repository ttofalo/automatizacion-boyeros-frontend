import axios from 'axios';

const getBaseUrl = () => {
    const { hostname } = window.location;
    return `http://${hostname}:8000`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

export const getBoyeros = () => api.get('/boyeros/');
export const toggleBoyero = (id, isOn) => api.patch(`/boyeros/${id}/estado`, { is_on: isOn });

export default api;

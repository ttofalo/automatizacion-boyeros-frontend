import axios from 'axios';

const getBaseUrl = () => {
    return 'http://93.92.112.215:8000';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;

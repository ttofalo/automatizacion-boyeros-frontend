import api from './api';

const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes
const TOKEN_KEY = 'auth_token';
const EXPIRY_KEY = 'auth_expiry';

const AuthService = {
    login: async (pin) => {
        const response = await api.post('/auth/login', { pin });
        const { access_token, token_type } = response.data;

        // Store token and expiry time
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(EXPIRY_KEY, Date.now() + SESSION_DURATION);

        return { access_token, token_type };
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiry = localStorage.getItem(EXPIRY_KEY);

        if (!token || !expiry) return false;

        // Check if token has expired
        if (Date.now() > parseInt(expiry)) {
            AuthService.logout();
            return false;
        }

        return true;
    },

    getExpiryTime: () => {
        return localStorage.getItem(EXPIRY_KEY);
    },

    renewSession: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            localStorage.setItem(EXPIRY_KEY, Date.now() + SESSION_DURATION);
        }
    }
};

export default AuthService;

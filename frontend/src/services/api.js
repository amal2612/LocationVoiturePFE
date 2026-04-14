import axios from 'axios';

const api = axios.create({
    baseURL: 'https://locationvoitureamal.alwaysdata.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajoute le token JWT automatiquement à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Gère les erreurs de réponse globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si token expiré ou invalide → déconnexion automatique
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
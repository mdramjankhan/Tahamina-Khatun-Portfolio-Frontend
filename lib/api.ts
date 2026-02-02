import axios from 'axios';

const API = axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL:process.env.NEXT_PUBLIC_API_URL
});

// Add a request interceptor to attach the Token if it exists
API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default API;

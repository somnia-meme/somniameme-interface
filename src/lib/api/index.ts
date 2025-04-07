import axios from "axios";
import { baseUrl } from "@/lib/config";

const api = axios.create({
    baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        localStorage.removeItem("token");
    }
    return Promise.reject(error);
});

export default api;

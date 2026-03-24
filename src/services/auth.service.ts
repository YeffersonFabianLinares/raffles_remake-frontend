import api from "../plugin/api";

export interface LoginData {
    email: string;
    password: string;
}

export const login = async (data: LoginData) => {
    const response = await api.post('sellers/login', data);
    return response.data;
};

export const getToken = (): string | null => localStorage.getItem('token');

export const saveSession = (token: string, user: object) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getStoredUser = () => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
};

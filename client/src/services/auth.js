import axios from 'axios';

export const signIn = async (credentials) => {
    try {
        const res = await axios.post('/auth/signin', credentials);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createUser = async (body, tokenConfig) => {
    try {
        const res = await axios.post('/auth/register', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const verifyUser = async (tokenConfig) => {
    try {
        const res = await axios.get('/auth/verify', tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response };
    }
}

export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        const tokenConfig = { headers: { 'Authorization': `Bearer ${token}` } };
        return tokenConfig;
    } else {
        return false;
    }
}
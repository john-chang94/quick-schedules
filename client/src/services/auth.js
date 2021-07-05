import axios from 'axios';

export const signIn = async (credentials) => {
    try {
        const res = await axios.post('http://localhost:5000/auth/signin', credentials);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const verifyUser = async (tokenConfig) => {
    try {
        const res = await axios.get('http://localhost:5000/auth/verify', tokenConfig);
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
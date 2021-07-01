import axios from 'axios';

export const signIn = async (credentials) => {
    try {
        const res = await axios.post('http://localhost:5000/auth/signin', credentials);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const verifyUser = async (token) => {
    try {
        const res = await axios.get('http://localhost:5000/auth/verify', token);
        return res.data;
    } catch (err) {
        return { error: err.response };
    }
}
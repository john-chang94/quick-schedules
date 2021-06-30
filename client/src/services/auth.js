import axios from 'axios';

export const signIn = async (credentials) => {
    try {
        const res = await axios.post('http://localhost:5000/auth/signin', credentials);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
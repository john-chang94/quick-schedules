import axios from 'axios';

const token = sessionStorage.getItem('token');
const tokenConfig = { headers: { 'token': token } };

export const getAllUsers = async () => {
    try {
        const res = await axios.get('http://localhost:5000/users', tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
import axios from 'axios';

const token = sessionStorage.getItem('token');
    // if (token) {
        const tokenConfig = { 'token': token }
        axios.defaults.headers = tokenConfig
    // }

export const fetchAllUsers = async () => {
    try {
        const res = await axios.get('http://localhost:5000/users');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchUser = async (u_id) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/${u_id}`)
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
import axios from 'axios';

export const fetchRoles = async (tokenConfig) => {
    try {
        const res = await axios.get('http://localhost:5000/roles', tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
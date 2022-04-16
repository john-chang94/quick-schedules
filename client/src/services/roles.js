import axios from 'axios';

export const getRoles = async () => {
    try {
        const res = await axios.get('/roles');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
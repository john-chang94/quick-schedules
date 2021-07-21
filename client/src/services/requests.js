import axios from 'axios';

export const fetchAllRequests = async () => {
    try {
        const res = await axios.get('http://localhost:5000/requests');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
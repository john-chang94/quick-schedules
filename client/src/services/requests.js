import axios from 'axios';

export const fetchAllRequests = async () => {
    try {
        const res = await axios.get('http://localhost:5000/requests');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllRequestByStatus = async (status) => {
    try {
        const res = await axios.get(`http://localhost:5000/requests/${status}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateRequestStatus = async (r_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/requests/${r_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
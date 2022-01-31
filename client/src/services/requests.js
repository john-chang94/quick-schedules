import axios from 'axios';

export const fetchAllRequests = async () => {
    try {
        const res = await axios.get('http://localhost:5000/requests');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchRequestsByUser = async (u_id) => {
    try {
        const res = await axios.get(`/requests/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllRequestsByStatus = async (status) => {
    try {
        const res = await axios.get(`http://localhost:5000/requests/status/${status}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllRequestsByStatusAndDate = async (status, weekStart, weekEnd) => {
    try {
        const res = await axios.get(`/requests/status/${status}/${weekStart}/${weekEnd}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateRequestStatus = async (r_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/requests/${r_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createRequest = async (body, tokenConfig) => {
    try {
        const res = await axios.post('/requests', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteRequest = async (r_id, tokenConfig) => {
    try {
        const res = await axios.delete(`/requests/${r_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
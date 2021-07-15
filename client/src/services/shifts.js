import axios from 'axios';

export const createShift = async (body, tokenConfig) => {
    try {
        const res = await axios.post('http://localhost:5000/shifts', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchShiftsByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`http://localhost:5000/shifts/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllUsersSchedulesByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`http://localhost:5000/shifts/all/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateShift = async (s_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/shifts/${s_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteShift = async (s_id, tokenConfig) => {
    try {
        const res = await axios.delete(`http://localhost:5000/shifts/${s_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
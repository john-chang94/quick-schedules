import axios from 'axios';

export const createShift = async (body, tokenConfig) => {
    try {
        const res = await axios.post('http://localhost:5000/shifts', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchShiftsByDates = async (start_date, end_date, tokenConfig) => {
    try {
        const res = await axios.get(`http://localhost:5000/shifts/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
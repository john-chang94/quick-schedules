import axios from 'axios';

export const createShift = async (body, tokenConfig) => {
    try {
        const res = await axios.post('/shifts', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createCopyOfWeeklySchedule = async (body) => {
    try {
        const res = await axios.post('/shifts/copy', body);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const clearWeeklySchedule = async (weekStart, weekEnd, tokenConfig) => {
    try {
        const res = await axios.delete(`/shifts/clear/${weekStart}/${weekEnd}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

// Unused for now
export const fetchShiftsByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`/shifts/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllUsersSchedulesByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`/shifts/all/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllUsersSchedulesByDateMobile = async (start_date, end_date) => {
    try {
        const res = await axios.get(`/shifts/all/mobile/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateShift = async (s_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/shifts/${s_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteShift = async (s_id, tokenConfig) => {
    try {
        const res = await axios.delete(`/shifts/${s_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
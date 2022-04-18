import axios from 'axios';
import * as HTTP from "../constants/http";

export const createShift = async (body, tokenConfig) => {
    try {
        const res = await axios.post(HTTP.SHIFTS, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createCopyOfWeeklySchedule = async (body) => {
    try {
        const res = await axios.post(`${HTTP.SHIFTS}/copy`, body);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const clearWeeklySchedule = async (weekStart, weekEnd, tokenConfig) => {
    try {
        const res = await axios.delete(`${HTTP.SHIFTS}/clear/${weekStart}/${weekEnd}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

// Unused for now
export const fetchShiftsByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`${HTTP.SHIFTS}/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUsersSchedulesByDate = async (start_date, end_date) => {
    try {
        const res = await axios.get(`${HTTP.SHIFTS}/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUsersSchedulesByDateMobile = async (start_date, end_date) => {
    try {
        const res = await axios.get(`${HTTP.SHIFTS}/mobile/${start_date}/${end_date}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateShift = async (s_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.SHIFTS}/${s_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteShift = async (s_id, tokenConfig) => {
    try {
        const res = await axios.delete(`${HTTP.SHIFTS}/${s_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
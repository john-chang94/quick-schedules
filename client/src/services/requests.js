import axios from 'axios';
import * as HTTP from "../constants/http";

export const getRequests = async () => {
    try {
        const res = await axios.get(HTTP.REQUESTS);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getRequestsByUserUser = async (u_id) => {
    try {
        const res = await axios.get(`${HTTP.REQUESTS}/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getRequestsByStatus = async (status) => {
    try {
        const res = await axios.get(`${HTTP.REQUESTS}/status/${status}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getRequestsByStatusAndDate = async (status, weekStart, weekEnd) => {
    try {
        const res = await axios.get(`${HTTP.REQUESTS}/status/${status}/${weekStart}/${weekEnd}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateRequestStatus = async (r_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.REQUESTS}/${r_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createRequest = async (body, tokenConfig) => {
    try {
        const res = await axios.post(HTTP.REQUESTS, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteRequest = async (r_id, tokenConfig) => {
    try {
        const res = await axios.delete(`${HTTP.REQUESTS}/${r_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
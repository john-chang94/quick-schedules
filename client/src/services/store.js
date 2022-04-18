import axios from 'axios';
import * as HTTP from "../constants/http";

export const getStoreHours = async () => {
    try {
        const res = await axios.get(HTTP.STORE);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const setStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.post(HTTP.STORE, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.put(HTTP.STORE, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getTimes = async () => {
    try {
        const res = await axios.get(`${HTTP.STORE}/times`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
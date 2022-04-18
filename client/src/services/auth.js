import axios from 'axios';
import * as HTTP from "../constants/http";

export const signIn = async (credentials) => {
    try {
        const res = await axios.post(`${HTTP.AUTH}/signin`, credentials);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const register = async (body, tokenConfig) => {
    try {
        const res = await axios.post(`${HTTP.AUTH}/register`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const verifyUser = async (tokenConfig) => {
    try {
        const res = await axios.get(`${HTTP.AUTH}/verify`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response };
    }
}

export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
        const tokenConfig = { headers: { 'Authorization': `Bearer ${token}` } };
        return tokenConfig;
    } else {
        return false;
    }
}
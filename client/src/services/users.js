import axios from 'axios';
import * as HTTP from "../constants/http";

export const getUsers = async () => {
    try {
        const res = await axios.get(HTTP.USERS);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUser = async (u_id) => {
    try {
        const res = await axios.get(`${HTTP.USERS}/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editPassword = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.USERS}/reset-pw/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserGeneral = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.USERS}/general/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserInfo = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.USERS}/info/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUserAvailability = async (u_id) => {
    try {
        const res = await axios.get(`${HTTP.USERS}/availability/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUsersAvailabilities = async () => {
    try {
        const res = await axios.get(`${HTTP.USERS}/availability/all`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserAvailability = async (a_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`${HTTP.USERS}/availability/${a_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteUser = async (u_id, tokenConfig) => {
    try {
        const res = await axios.delete(`${HTTP.USERS}/${u_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
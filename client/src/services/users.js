import axios from 'axios';

export const getUsers = async () => {
    try {
        const res = await axios.get('/users');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUser = async (u_id) => {
    try {
        const res = await axios.get(`/users/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editPassword = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/users/reset-pw/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserGeneral = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/users/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserInfo = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/users/system/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUserAvailability = async (u_id) => {
    try {
        const res = await axios.get(`/users/availability/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getUsersAvailabilities = async () => {
    try {
        const res = await axios.get('/users/availability/all');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserAvailability = async (a_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`/users/availability/${a_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deleteUser = async (u_id, tokenConfig) => {
    try {
        const res = await axios.delete(`/users/${u_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
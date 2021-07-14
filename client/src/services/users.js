import axios from 'axios';

export const fetchAllUsers = async (tokenConfig) => {
    try {
        const res = await axios.get('http://localhost:5000/users', tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchUser = async (u_id, tokenConfig) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/${u_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editPassword = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/users/reset-pw/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserGeneral = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/users/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserInfo = async (u_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/users/system/${u_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllUsersAvailabilities = async (tokenConfig) => {
    try {
        const res = await axios.get('http://localhost:5000/users/availability/all', tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
import axios from 'axios';

export const fetchAllUsers = async () => {
    try {
        const res = await axios.get('http://localhost:5000/users');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchUser = async (u_id) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/${u_id}`);
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

export const fetchUserAvailability = async (u_id) => {
    try {
        const res = await axios.get(`http://localhost:5000/users/availability/${u_id}`);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchAllUsersAvailabilities = async () => {
    try {
        const res = await axios.get('http://localhost:5000/users/availability/all');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const editUserAvailability = async (a_id, body, tokenConfig) => {
    try {
        const res = await axios.put(`http://localhost:5000/users/availability/${a_id}`, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
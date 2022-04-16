import axios from 'axios';

export const getStoreHours = async () => {
    try {
        const res = await axios.get('/store');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const setStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.post('/store', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.put('/store', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
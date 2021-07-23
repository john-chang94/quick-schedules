import axios from 'axios';

export const fetchStoreHours = async () => {
    try {
        const res = await axios.get('http://localhost:5000/store');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const setStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.post('http://localhost:5000/store', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const updateStoreHours = async (body, tokenConfig) => {
    try {
        const res = await axios.put('http://localhost:5000/store', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
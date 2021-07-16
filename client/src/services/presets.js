import axios from 'axios';

export const fetchTimes = async () => {
    try {
        const res = await axios.get('http://localhost:5000/presets/times');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const createPreset = async (body, tokenConfig) => {
    try {
        const res = await axios.post('http://localhost:5000/presets', body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const fetchPresets = async () => {
    try {
        const res = await axios.get('http://localhost:5000/presets');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
import axios from 'axios';

export const fetchTimes = async () => {
    try {
        const res = await axios.get('http://localhost:5000/presets/times');
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
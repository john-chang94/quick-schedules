import axios from 'axios';
import * as HTTP from "../constants/http";

export const createPreset = async (body, tokenConfig) => {
    try {
        const res = await axios.post(HTTP.PRESETS, body, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const getPresets = async () => {
    try {
        const res = await axios.get(HTTP.PRESETS);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}

export const deletePreset = async (p_id, tokenConfig) => {
    try {
        const res = await axios.delete(`${HTTP.PRESETS}/${p_id}`, tokenConfig);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
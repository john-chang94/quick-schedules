import axios from 'axios';
import * as HTTP from "../constants/http";

export const getRoles = async () => {
    try {
        const res = await axios.get(HTTP.ROLES);
        return res.data;
    } catch (err) {
        return { error: err.response.data };
    }
}
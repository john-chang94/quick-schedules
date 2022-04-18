// Add localhost to url if in development mode because
// proxy won't run smoothly (refer to setupProxy.js)
let url = "";
if (process.env.NODE_ENV === "development") {
    url = "http://localhost:5000";
}

export const AUTH = `${url}/auth`;
export const USERS = `${url}/users`;
export const PRESETS = `${url}/presets`;
export const REQUESTS = `${url}/requests`;
export const ROLES = `${url}/roles`;
export const SHIFTS = `${url}/shifts`;
export const STORE = `${url}/store`;
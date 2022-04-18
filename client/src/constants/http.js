// Add localhost to url in development mode because
// proxy won't run smoothly (refer to setupProxy.js)

let url;
if (process.env.NODE_ENV === "development") {
    url = "http://localhost:5000";
}

export const AUTH = `${url}/api/auth`;
export const USERS = `${url}/api/users`;
export const PRESETS = `${url}/api/presets`;
export const REQUESTS = `${url}/api/requests`;
export const ROLES = `${url}/api/roles`;
export const SHIFTS = `${url}/api/shifts`;
export const STORE = `${url}/api/store`;
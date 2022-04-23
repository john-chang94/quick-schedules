// Set domain to local network IP and match server port
// during development to prevent CORS issues
let url = "";
if (process.env.NODE_ENV === "development") {
    url = process.env.REACT_APP_LOCAL_NETWORK_ADDRESS;
}

export const AUTH = `${url}/api/auth`;
export const USERS = `${url}/api/users`;
export const PRESETS = `${url}/api/presets`;
export const REQUESTS = `${url}/api/requests`;
export const ROLES = `${url}/api/roles`;
export const SHIFTS = `${url}/api/shifts`;
export const STORE = `${url}/api/store`;
// Add localhost to url in development mode because
// proxy won't run smoothly (refer to setupProxy.js)

// let url = "https://0f4f-2603-8001-3140-784c-9f5-3a55-73f-e168.ngrok.io";
// let url = "https://quicksand.loca.lt";
// let url = "http://localhost:5000";
// let url = process.env.LOCAL_NETWORK_ADDRESS;

let url = "";
if (process.env.NODE_ENV === "development") {
    url = process.env.LOCAL_NETWORK_ADDRESS;
    console.log(process.env.LOCAL_NETWORK_ADDRESS)
}

export const AUTH = `${url}/api/auth`;
export const USERS = `${url}/api/users`;
export const PRESETS = `${url}/api/presets`;
export const REQUESTS = `${url}/api/requests`;
export const ROLES = `${url}/api/roles`;
export const SHIFTS = `${url}/api/shifts`;
export const STORE = `${url}/api/store`;
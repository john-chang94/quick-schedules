// Set up proxy in production mode only
// API calls will not run smoothly in development
// Also this will cause an error if placed in src folder
if (process.env.NODE_ENV === "production") {
const { createProxyMiddleware } = require("http-proxy-middleware");
    module.exports = function (app) {
        app.use(
            ["/auth", "/users", "/shifts", "/presets", "/requests", "/roles", "/store"],
            createProxyMiddleware({
                target: "http://localhost:5000",
            })
        );
    };
}
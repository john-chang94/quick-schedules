const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        ["/auth", "/users", "/shifts", "/presets", "/requests", "/roles", "/store"],
        createProxyMiddleware({
            target: "http://localhost:5000",
        })
    );
};
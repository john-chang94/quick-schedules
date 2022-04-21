if (process.env.NODE_ENV === "development") {
    // Set proxy to backend address in local network in development
    // so testing can be done with other devices
    // [ip:port]
    const { createProxyMiddleware } = require("http-proxy-middleware");
        module.exports = function (app) {
            app.use(
                ["/api"],
                createProxyMiddleware({
                    target: process.env.REACT_APP_LOCAL_NETWORK_ADDRESS,
                })
            );
        };
}

const base64 = require('base-64')
var Rollbar = require('rollbar');

const rollbarConfig = {
    accessToken: base64.decode("MTFiNGU0MDY3M2M0NDk4MjkzMmFkODI3ODc3ZTNjYWQ="),
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "development"
    }
};

module.exports = rollbar = new Rollbar(rollbarConfig);
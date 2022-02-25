module.exports = [{
    "name": "ms-authapp-api",
    "script": "./app.js",
    "instances": "1",
    "wait_ready": true,
    "exp_backoff_restart_delay": 100,
    "env_production": {
        NODE_ENV: "production",
    }
}]
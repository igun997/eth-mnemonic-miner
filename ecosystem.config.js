module.exports = {
    apps : [{
        name      : 'Mining Wallet',
        script    : 'index.js',
        instances : 1,
        autorestart : true,
        watch       : false,
        max_memory_restart : '1G',
        env: {
            NODE_ENV: 'development',
            WSS_ENDPOINT: null
        },
        env_production : {
            NODE_ENV: 'production',
            WSS_ENDPOINT: null
        }
    }]
};

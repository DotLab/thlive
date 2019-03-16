module.exports = {
  apps : [{
    name: 'thlive-server',
    script: 'bin/www',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '6005'
    },
  }],
};

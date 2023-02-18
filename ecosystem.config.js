module.exports = {
  apps: [
    {
      name: 'Supabase-demo',
      exec_mode: 'cluster',
      instances: '1',
      env: {
        NITRO_PORT: 8090,
        NITRO_HOST: 'localhost',
        NODE_ENV: 'production',
      },
      script: './.output/server/index.mjs',
    },
  ],
}

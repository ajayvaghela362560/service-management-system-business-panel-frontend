const pm2Config = {
    apps: [
        {
            name: "Business-Panel-Frontend",
            script: "npm",
            args: "run start",
            instances: "max",
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
            },
            post_update: ["npm install", "npm run build"],
        },
    ],
};

export default pm2Config;

module.exports = {
	apps: [
		{
			name: "backend_prod",
			script: "app.js",
			instances: process.env.WEB_CONCURRENCY || 2,
			exec_mode: "cluster",
			autorestart: true,
			watch: false,
		},
	],
};

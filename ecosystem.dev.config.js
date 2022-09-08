module.exports = {
	apps: [
		{
			name: "backend_dev",
			script: "app.js",
			instances: 1,
			instances: process.env.WEB_CONCURRENCY || 1,
			autorestart: true,
		},
	],
};

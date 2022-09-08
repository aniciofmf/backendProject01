// Global Dir
global.__basedir = __dirname;
require("custom-env").env(true);

// Bootstrap
const _ = require("lodash");
const path = require("path");
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const colors = require("colors");
const errorHandler = require("./utils/errorHandler");
const { APP_PORT, APP_HOSTNAME, APP_DB_HOST, APP_DB_DATABASE } = require("./config/config");
const { recursiveLoading } = require("./utils/helpers/initHelpers");

// Setting some configurations settings
const app = express();

// Set settings
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.static(__basedir + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(
	cors({
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	})
);
app.use(helmet({ contentSecurityPolicy: false }));

/* Launch App */
app
	.listen(APP_PORT, APP_HOSTNAME, function () {
		routeFiles = recursiveLoading("routes");

		_.forEach(routeFiles, (file) => {
			if (file.slice(-3) === ".js") {
				require(__dirname + "/" + file)(app);
			}
		});

		app.use(errorHandler);

		app.all("/api/*", (_, res) => {
			res.status(400).send({
				message: "No route",
			});
		});

		app.all("/*", function (req, res) {
			res.sendFile(path.join(__basedir, "public", "index.html"));
		});

		console.log(colors.underline.cyan.bold(`Backend Corriendo`));
		console.log(colors.black.bold(`URL: http://${APP_HOSTNAME}:${APP_PORT}`));
		console.log(colors.black.bold(`Base de datos, IP: ${APP_DB_HOST} - DB: ${APP_DB_DATABASE}`));
	})
	.on("error", (error) => {});

/* Catch termination */
process.on("SIGINT", (error) => {
	process.exit(1);
});

process.on("unhandledRejection", (error) => {
	process.exit(1);
});

module.exports = app;

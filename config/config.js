const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const { ERROR_PVTKEY_MSG, ERROR_PBLKEY_MSG } = require("./errors");

let publicKey = null;
let privateKey = null;

dotenv.config();

// privateKey
if (fs.existsSync(path.join("config", "jwtkeys", "private.key"))) {
	privateKey = fs.readFileSync(path.join("config", "jwtkeys", "private.key"), "utf8");
} else {
	console.log(colors.inverse.bold(ERROR_PVTKEY_MSG));
	process.exit();
}

// publicKey
if (fs.existsSync(path.join("config", "jwtkeys", "public.key"))) {
	publicKey = fs.readFileSync(path.join("config", "jwtkeys", "public.key"), "utf8");
} else {
	console.log(colors.inverse.bold(ERROR_PBLKEY_MSG));
	process.exit();
}

// Constants
module.exports = {
	JWT_PRIVATE_KEY: process.env.privateKey || privateKey,
	JWT_PUBLIC_KEY: process.env.publicKey || publicKey,
	APP_BCRYPT_SALT_ROUNDS: 8,
	APP_PORT: process.env.APP_PORT || 3000,
	APP_HOSTNAME: process.env.APP_HOSTNAME || "localhost",
	APP_DB_HOST: process.env.APP_DB_HOST || "dbhost",
	APP_DB_USER: process.env.APP_DB_USER || "usuarioddb",
	APP_DB_PASSWD: process.env.APP_DB_PASSWD || "passwddb",
	APP_DB_DATABASE: process.env.APP_DB_DATABASE || "dbname",
	APP_DB_DIALECT: "mysql",
	APP_DB_CONNETION_TIMEOUT: process.env.APP_DB_CONNETION_TIMEOUT || "2000",
	APP_DB_POOL_MAX: 5,
	APP_DB_POOL_MIN: 1,
	APP_DB_POOL_ACQUIRE: 5000,
	APP_DB_POOL_IDLE: 5000,
	APP_DB_MAX_RETRIES: 3,
	APP_DB_LOGGER: process.env.APP_DB_LOGGER || false,
};

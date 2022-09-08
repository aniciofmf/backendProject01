const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const {
	APP_DB_HOST,
	APP_DB_USER,
	APP_DB_PASSWD,
	APP_DB_DATABASE,
	APP_DB_CONNETION_TIMEOUT,
	APP_DB_DIALECT,
	APP_DB_POOL_MAX,
	APP_DB_POOL_MIN,
	APP_DB_POOL_ACQUIRE,
	APP_DB_POOL_IDLE,
	APP_DB_LOGGER,
	APP_DB_MAX_RETRIES,
} = require(`${__basedir}/config/config`);
const { ERROR_DB_MSG } = require(`${__basedir}/config/errors`);

// getSequelizeDBHandler
getSequelizeDBHandler = () => {
	return new Sequelize(APP_DB_DATABASE, APP_DB_USER, APP_DB_PASSWD, {
		host: APP_DB_HOST,
		dialect: APP_DB_DIALECT,
		dialectOptions: {
			connectTimeout: APP_DB_CONNETION_TIMEOUT,
		},
		retry: {
			max: APP_DB_MAX_RETRIES,
		},
		logging: APP_DB_LOGGER,
		pool: {
			max: APP_DB_POOL_MAX,
			min: APP_DB_POOL_MIN,
			acquire: APP_DB_POOL_ACQUIRE,
			idle: APP_DB_POOL_IDLE,
		},
	});
};

// checkDBConnection
checkDBConnection = async (dbHandler) => {
	try {
		await dbHandler.authenticate();
	} catch (error) {
		console.error(ERROR_DB_MSG);
	}
};

// recursiveLoading
const recursiveLoading = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach((file) => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory() ? recursiveLoading(path.join(dir, file), filelist) : filelist.concat(path.join(dir, file));
	});
	return filelist;
};

module.exports = {
	getSequelizeDBHandler,
	checkDBConnection,
	recursiveLoading,
};

const Sequelize = require("sequelize");
const _ = require("lodash");
const { getSequelizeDBHandler, checkDBConnection, recursiveLoading } = require(`${__basedir}/utils/helpers/initHelpers`);
recursiveLoading;
const db = {};

const sequelize = getSequelizeDBHandler();

checkDBConnection(sequelize);

modelFiles = recursiveLoading(__dirname);
_.forEach(modelFiles, (file) => {
	if (!file.includes("index.js") && file.slice(-3) === ".js") {
		const model = sequelize["import"](file);
		db[model.name] = model;
	}
});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.addHook("beforeCount", function (options) {
	if (this._scope.include && this._scope.include.length > 0) {
		options.distinct = true;
		options.col = this._scope.col || options.col || `"${this.options.name.singular}".id` || `"${this.options.name.singular}".codigo`;
	}

	if (options.include && options.include.length > 0) {
		options.include = null;
	}
});

module.exports = db;

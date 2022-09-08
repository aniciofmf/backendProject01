const _ = require("lodash");
const { version: uuidVersion, validate: uuidValidate } = require("uuid");

// removeFieldsFromData
const removeFieldsFromData = (data, fields = []) => {
	if (_.isObject(data) && !_.isArray(data)) {
		return _.omit(data, fields);
	}

	throw new Error("Function data is not an object");
};

// fillFieldsWithData
const fillFieldsWithData = (obj, fields = [], data = []) => {
	if (_.isObject(obj) && !_.isArray(obj) && _.isArray(data)) {
		let objData = {};

		_.each(fields, (val, key) => {
			if (_.isString(data[key])) {
				objData = {
					...objData,
					[val]: data[key].toString().replace(",", " "),
				};
			} else {
				objData = {
					...objData,
					[val]: data[key],
				};
			}
		});

		let newObjectdata = _.merge({}, obj, objData);

		return newObjectdata;
	}

	throw new Error("Function data is not an object");
};

// validUuid
const validUuid = (identificador) => {
	if (!uuidValidate(identificador)) {
		return false;
	} else {
		if (uuidVersion(identificador) !== 4) {
			return false;
		}
	}

	return true;
};

module.exports = {
	removeFieldsFromData,
	fillFieldsWithData,
	validUuid,
};

const _ = require("lodash");

// Global Permissions Constants

const permissionsList = {
	ADMIN: false,
	USUARIO: false,
	ABM_PRODUCTO: false,
	ABM_UBICACION: false,
	ABM_RUBRO: false,
	ABM_USUARIO: false,
	ABM_RELEVAMIENTO: false,
};

// Constructor Object
function systemPermissions() {
	this.permissions = permissionsList;
}

// getPermissions
systemPermissions.prototype.getPermissions = function () {
	return this.permissions;
};

// hasPermission
systemPermissions.prototype.hasPermission = function (permission = null) {
	if (permission !== null) {
		return this.permissions[permission] === true;
	}

	return false;
};

// resetPermissions
systemPermissions.prototype.resetPermissions = function () {
	_.map(this.permissions, function (value, key) {
		permissionsList[key] = false;
	});
};

// Initializer
function permissions() {
	return new systemPermissions();
}

module.exports = permissions();

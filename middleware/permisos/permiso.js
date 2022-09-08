const _ = require("lodash");
const permissions = require(`${__basedir}/config/permissions`);

global.systemPermissions = permissions;

module.exports = (permiso = []) => {
	if (_.isArray(permiso)) {
		return (req, res, next) => {
			try {
				const { roles } = req.decoded;

				permissions.resetPermissions();

				const userTablePermissions = permissions.getPermissions();

				_.each(roles, (perm) => {
					if (permiso.includes(perm)) {
						userTablePermissions[perm.toUpperCase()] = true;
					}
				});

				next();
			} catch (error) {
				return next(error);
			}
		};
	}

	throw new Error("Invalid permission datatype");
};

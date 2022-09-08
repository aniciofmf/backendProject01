module.exports = (sequelize, DataTypes) => {
	const Ubicacion = sequelize.define(
		"Ubicacion",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			ubicacion: {
				type: DataTypes.STRING(80),
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: "La ubicación es obligatoria",
					},
					notEmpty: {
						args: true,
						msg: "La ubicación no puede estar vacía",
					},
				},
			},
		},
		{
			freezeTableName: true,
			tableName: "ubicacion",
			timestamps: false,
		}
	);

	// FKs
	Ubicacion.associate = function (models) {
		Ubicacion.hasMany(models.relevamientoRelacion, {
			foreignKey: "id_ubicacion",
			targetKey: "id",
			as: "relRelevamientoUbicacion",
		});
	};

	// Methods

	// getUbicacionByName
	Ubicacion.getUbicacionByName = async function (usuario) {
		return await this.findOne({
			where: {
				usuario: usuario,
				activo: true,
			},
		});
	};

	// getUbicacionById
	Ubicacion.getUbicacionById = async function (id) {
		return await this.findOne({
			where: {
				id: id,
			},
		});
	};

	// Add
	Ubicacion.add = async function (data = {}) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.create({ ...data });
		}

		return null;
	};

	// Edit
	Ubicacion.edit = async function (data, ubicacion) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update({ ...data }, { where: { id: ubicacion.id } });
		}

		return null;
	};

	// Get
	Ubicacion.get = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findOne({
				attributes: ["id", "ubicacion"],
				where: {
					id: id,
				},
			});
		}

		return null;
	};

	// List
	Ubicacion.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				attributes: ["id", "ubicacion"],
				offset: offset,
				limit: limit,
				order: [[orderBy, order]],
			});
		}

		return null;
	};

	// Remove
	Ubicacion.remove = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.destroy({
				where: {
					id: id,
				},
			});
		}

		return null;
	};

	return Ubicacion;
};

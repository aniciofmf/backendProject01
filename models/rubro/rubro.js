module.exports = (sequelize, DataTypes) => {
	const Rubro = sequelize.define(
		"Rubro",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			rubro: {
				type: DataTypes.STRING(80),
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: "El Rubro es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El rubro no puede estar vacío",
					},
				},
			},
		},
		{
			freezeTableName: true,
			tableName: "rubro",
			timestamps: false,
		}
	);

	// FKs
	Rubro.associate = function (models) {
		Rubro.hasMany(models.Producto, {
			foreignKey: "id",
			targetKey: "id",
			as: "relRubro",
		});
	};

	// Methods

	// getRubroByName
	Rubro.getRubroByName = async function (usuario) {
		return await this.findOne({
			where: {
				usuario: usuario,
				activo: true,
			},
		});
	};

	// getRubroById
	Rubro.getRubroById = async function (id) {
		return await this.findOne({
			where: {
				id: id,
			},
		});
	};

	// Add
	Rubro.add = async function (data = {}) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.create({ ...data });
		}

		return null;
	};

	// Edit
	Rubro.edit = async function (data, rubro) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update({ ...data }, { where: { id: rubro.id } });
		}

		return null;
	};

	// Get
	Rubro.get = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findOne({
				attributes: ["id", "rubro"],
				where: {
					id: id,
				},
			});
		}

		return null;
	};

	// List
	Rubro.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				attributes: ["id", "rubro"],
				offset: offset,
				limit: limit,
				order: [[orderBy, order]],
			});
		}

		return null;
	};

	// Remove
	Rubro.remove = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.destroy({
				where: {
					id: id,
				},
			});
		}

		return null;
	};

	return Rubro;
};

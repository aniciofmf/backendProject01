module.exports = (sequelize, DataTypes) => {
	const Producto = sequelize.define(
		"Producto",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			nombre: {
				type: DataTypes.STRING(150),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El Producto es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El Producto no puede estar vacío",
					},
				},
			},
			nombre_unidad: {
				type: DataTypes.STRING(20),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El nombre de la unidad es obligatoria",
					},
					notEmpty: {
						args: true,
						msg: "El nombre de la unidad no puede estar vacía",
					},
				},
			},
			cantidad_unidad: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				validate: {
					notNull: {
						msg: "La cantidad es obligatoria",
					},
					notEmpty: {
						args: true,
						msg: "La cantidad no puede estar vacía",
					},
				},
			},
			rubro: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El Rubro es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El Rubro no puede estar vacío",
					},
				},
			},
			activo: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			freezeTableName: true,
			tableName: "producto",
			timestamps: false,
		}
	);

	// FKs
	Producto.associate = function (models) {
		Producto.belongsTo(models.Rubro, {
			foreignKey: "rubro",
			targetKey: "id",
			as: "relRubro",
		});

		Producto.hasMany(models.relevamientoRelacion, {
			foreignKey: "id_producto",
			targetKey: "id",
			as: "relRelevamientoProducto",
		});
	};

	// Methods

	// getProductoByName
	Producto.getProductoByName = async function (usuario) {
		return await this.findOne({
			where: {
				usuario: usuario,
				activo: true,
			},
		});
	};

	// getRubroById
	Producto.getProductoById = async function (id) {
		return await this.findOne({
			where: {
				id: id,
			},
		});
	};

	// getRubroByRubro
	Producto.getProductoByRubro = async function (rubro) {
		return await this.findOne({
			where: {
				rubro: rubro,
			},
		});
	};

	// Add
	Producto.add = async function (data = {}) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.create({ ...data });
		}

		return null;
	};

	// Edit
	Producto.edit = async function (data, producto) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update({ ...data }, { where: { id: producto.id } });
		}

		return null;
	};

	// Get
	Producto.get = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findOne({
				attributes: ["id", "nombre", "nombre_unidad", "cantidad_unidad"],
				include: [{ ...this.getRubroSentence() }],
				where: {
					id: id,
					activo: true,
				},
			});
		}

		return null;
	};

	// List
	Producto.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				attributes: ["id", "nombre", "nombre_unidad", "cantidad_unidad"],
				include: [{ ...this.getRubroSentence() }],
				where: {
					activo: true,
				},
				offset: offset,
				limit: limit,
				order: [[orderBy, order]],
			});
		}

		return null;
	};

	// Remove
	Producto.remove = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update(
				{ activo: 0 },
				{
					where: {
						id: id,
						activo: true,
					},
				}
			);
		}

		return null;
	};

	// Helper
	Producto.getRubroSentence = function () {
		let { Rubro } = this.sequelize.models;
		return {
			attributes: ["rubro"],
			model: Rubro,
			as: "relRubro",
			required: false,
		};
	};

	return Producto;
};

const _ = require("lodash");

module.exports = (sequelize, DataTypes) => {
	const Relevamiento = sequelize.define(
		"Relevamiento",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			nombre: {
				type: DataTypes.STRING(200),
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: "El Nombre es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El Nombre no puede estar vacío",
					},
				},
			},
			identificador: {
				type: DataTypes.STRING(36),
				allowNull: true,
			},
			codigo: {
				type: DataTypes.STRING(200),
				allowNull: true,
			},
			usuario_creador: {
				type: DataTypes.STRING(30),
				allowNull: true,
			},
			relevamientos: {
				type: DataTypes.INTEGER(11),
				allowNull: true,
				defaultValue: 0,
			},
			fecha: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW,
			},
			token: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			activo: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			freezeTableName: true,
			tableName: "relevamiento",
			timestamps: false,
		}
	);

	// FKs
	Relevamiento.associate = function (models) {
		Relevamiento.hasMany(models.relevamientoRelacion, {
			foreignKey: "id_relevamiento",
			targetKey: "id",
			as: "items",
		});
	};

	// Methods

	// getRelevamientoyId
	Relevamiento.getRelevamientoById = async function (id) {
		return await this.findOne({
			where: {
				id: id,
				activo: true,
			},
		});
	};

	// getRelevamientoByIdentificador
	Relevamiento.getRelevamientoByIdentificador = async function (id) {
		return await this.findOne({
			attributes: ["id", "nombre", ["identificador", "relevamiento"]],
			where: {
				identificador: id,
				activo: true,
			},
		});
	};

	// getRelevamientoTokenByIdentificador
	Relevamiento.getRelevamientoTokenByIdentificador = async function (data) {
		return await this.findOne({
			attributes: ["token"],
			where: {
				identificador: data.identificador,
				codigo: data.codigo,
				activo: true,
			},
		});
	};

	// Add
	Relevamiento.add = async function (data, items) {
		let { relevamientoRelacion } = this.sequelize.models;
		let relevamiento = null;

		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			delete data.data;

			relevamiento = await this.create({ ...data });

			_.map(items, (item) => {
				item.id_relevamiento = relevamiento.id;
			});

			await relevamientoRelacion.createItems(items);

			return relevamiento;
		}

		return relevamiento;
	};

	// Edit
	Relevamiento.edit = async function (id, data, items) {
		let { relevamientoRelacion } = this.sequelize.models;
		let relevamiento = null;

		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			delete data.data;

			relevamiento = await this.update({ ...data }, { where: { id: id } });

			if (_.size(items) > 0) {
				_.map(items, (item) => {
					item.id_relevamiento = id;
				});
			}

			await relevamientoRelacion.createItems(items);

			return relevamiento;
		}

		return relevamiento;
	};

	// Get
	Relevamiento.get = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findOne({
				attributes: ["id", "nombre", "identificador", "codigo", "relevamientos"],
				include: [{ ...this.getItemsSentence() }],
				where: {
					id: id,
					activo: true,
				},
			});
		}

		return null;
	};

	// List
	Relevamiento.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				attributes: ["id", "nombre", "identificador", "codigo", "relevamientos"],
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

	// Helper
	Relevamiento.getItemsSentence = function () {
		let { relevamientoRelacion, Producto, Ubicacion, Rubro } = this.sequelize.models;
		return {
			attributes: ["id", "id_relevamiento"],
			model: relevamientoRelacion,
			as: "items",
			where: {
				activo: true,
			},
			required: false,
			include: [
				{
					attributes: [["id", "id_producto"], "nombre"],
					model: Producto,
					as: "relRelevamientoProducto",
					required: false,
					include: [
						{
							attributes: [["id", "id_rubro"], "rubro"],
							model: Rubro,
							as: "relRubro",
							required: false,
						},
					],
				},
				{
					attributes: [["id", "id_ubicacion"], "ubicacion"],
					model: Ubicacion,
					as: "relRelevamientoUbicacion",
					required: false,
				},
			],
		};
	};

	return Relevamiento;
};

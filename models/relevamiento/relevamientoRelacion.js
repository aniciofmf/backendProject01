module.exports = (sequelize, DataTypes) => {
	const relevamientoRelacion = sequelize.define(
		"relevamientoRelacion",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			id_relevamiento: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
			},
			id_producto: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
			},
			id_ubicacion: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
			},
			activo: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			freezeTableName: true,
			tableName: "relevamiento_relacion",
			timestamps: false,
		}
	);

	// FKs
	relevamientoRelacion.associate = function (models) {
		relevamientoRelacion.belongsTo(models.Relevamiento, {
			foreignKey: "id_relevamiento",
			targetKey: "id",
			as: "items",
		});

		relevamientoRelacion.belongsTo(models.Producto, {
			foreignKey: "id_producto",
			targetKey: "id",
			as: "relRelevamientoProducto",
		});

		relevamientoRelacion.belongsTo(models.Ubicacion, {
			foreignKey: "id_ubicacion",
			targetKey: "id",
			as: "relRelevamientoUbicacion",
		});

		relevamientoRelacion.hasMany(models.relevamientoResultado, {
			foreignKey: "id_relevamiento_relacion",
			targetKey: "id",
			as: "relRelevamientoResultado",
		});
	};

	// Methods

	// createItems
	relevamientoRelacion.createItems = async function (items) {
		return await this.bulkCreate(items);
	};

	// removeItem
	relevamientoRelacion.removeItem = async function (idRelevamiento, idItem) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update({ activo: 0 }, { where: { id: idItem, id_relevamiento: idRelevamiento } });
		}
	};

	// getDataRelevamientoRelacionById
	relevamientoRelacion.getDataRelevamientoRelacionById = async function (id, orderBy = "id", order = "ASC") {
		let { Producto, Ubicacion } = this.sequelize.models;

		return await this.findAndCountAll({
			attributes: ["id"],
			include: [
				{
					attributes: [["id", "id_producto"], "nombre"],
					model: Producto,
					as: "relRelevamientoProducto",
					required: false,
				},
				{
					attributes: [["id", "id_ubicacion"], "ubicacion"],
					model: Ubicacion,
					as: "relRelevamientoUbicacion",
					required: false,
				},
			],
			where: {
				id_relevamiento: id,
				activo: true,
			},
			order: [[orderBy, order]],
		});
	};

	return relevamientoRelacion;
};

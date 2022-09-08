module.exports = (sequelize, DataTypes) => {
	const relevamientoResultado = sequelize.define(
		"relevamientoResultado",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			id_relevamiento_relacion: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
			},
			precio_maximo: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
				validate: {
					isDecimal: true,
				},
			},
			precio_minimo: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
			},
			precio_maximo_op: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
			},
			precio_minimo_op: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
			},
			disponible: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
			fecha: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			freezeTableName: true,
			tableName: "relevamiento_resultado",
			timestamps: false,
		}
	);

	// FKs
	relevamientoResultado.associate = function (models) {
		relevamientoResultado.belongsTo(models.relevamientoRelacion, {
			foreignKey: "id_relevamiento_relacion",
			targetKey: "id",
			as: "relRelevamientoResultado",
		});
	};

	// Add
	relevamientoResultado.add = async function (items) {
		let resultado = null;

		resultado = await this.bulkCreate(items);

		return resultado;
	};

	// List
	relevamientoResultado.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		let resultado = null;

		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				offset: offset,
				limit: limit,
				order: [[orderBy, order]],
			});
		}

		return resultado;
	};

	return relevamientoResultado;
};

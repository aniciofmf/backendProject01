module.exports = (sequelize, DataTypes) => {
	const usuarioRol = sequelize.define(
		"usuarioRol",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
			},
			id_rol: {
				type: DataTypes.INTEGER(11),
				allowNull: true,
			},
			id_usuario: {
				type: DataTypes.INTEGER(11),
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
			tableName: "usuario_rol",
			timestamps: false,
		}
	);

	// FKs
	usuarioRol.associate = function (models) {
		usuarioRol.belongsTo(models.Usuario, {
			foreignKey: "id_usuario",
			targetKey: "id",
			as: "relUsuario",
		});

		usuarioRol.belongsTo(models.Rol, {
			foreignKey: "id_rol",
			targetKey: "id",
			as: "relRol",
		});
	};

	return usuarioRol;
};

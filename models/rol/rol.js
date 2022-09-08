module.exports = (sequelize, DataTypes) => {
	const Rol = sequelize.define(
		"Rol",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			nombre: {
				type: DataTypes.STRING(30),
				allowNull: false,
				unique: true,
			},
			superusuario: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			abm_producto: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			abm_ubicacion: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			abm_rubro: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			abm_usuario: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
		},
		{
			freezeTableName: true,
			tableName: "rol",
			timestamps: false,
		}
	);

	// FKs
	Rol.associate = function (models) {
		Rol.hasMany(models.usuarioRol, {
			foreignKey: "id_rol",
			targetKey: "id",
			as: "relRol",
		});
	};

	return Rol;
};

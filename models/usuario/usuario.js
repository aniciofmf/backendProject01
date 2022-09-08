const _ = require("lodash");
const bcrypt = require("bcrypt");
const { APP_BCRYPT_SALT_ROUNDS } = require(`${__basedir}/config/config`);

module.exports = (sequelize, DataTypes) => {
	const Usuario = sequelize.define(
		"Usuario",
		{
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			usuario: {
				type: DataTypes.STRING(30),
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: "El usuario es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El usuario no puede estar vacío",
					},
					isAlpha: {
						args: true,
						msg: "Sólo son permitidas letras para el usuario",
					},
					isLowercase: {
						args: true,
						msg: "El usuario debe ser en minúsculas",
					},
				},
			},
			password: {
				type: DataTypes.STRING(72),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El password es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El password no puede estar vacío",
					},
					isAlphanumeric: {
						args: true,
						msg: "El password debe contener letras y números",
					},
					len: {
						args: [8, 12],
						msg: "El password debe tener como mínimo 8 caracteres y como máximo 12",
					},
					is: {
						args: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/i,
						msg: "El password debe tener como mínimo 8 caracteres y como máximo 12 , y debe contener al menos 1 letra minúscula, 1 mayúscula y 1 número",
					},
				},
			},
			nombre: {
				type: DataTypes.STRING(30),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El nombre es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El nombre no puede estar vacío",
					},
					isAlpha: {
						args: true,
						msg: "Sólo son permitidas letras para el nombre",
					},
				},
			},
			apellido: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El apellido es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El apellido no puede estar vacío",
					},
					isAlpha: {
						args: true,
						msg: "Sólo son permitidas letras para el apellido",
					},
				},
			},
			email: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					notNull: {
						msg: "El email es obligatorio",
					},
					notEmpty: {
						args: true,
						msg: "El email no puede estar vacío",
					},
					isEmail: {
						args: true,
						msg: "El formato del email es inválido",
					},
				},
			},
			telefono: {
				type: DataTypes.STRING(50),
				allowNull: true,
			},
			token: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			activo: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: 1,
			},
		},
		{
			freezeTableName: true,
			tableName: "usuario",
			timestamps: false,
		}
	);

	// FKs
	Usuario.associate = function (models) {
		Usuario.hasMany(models.usuarioRol, {
			foreignKey: "id_usuario",
			targetKey: "id",
			as: "relUsuario",
		});
	};

	// Hooks
	Usuario.afterValidate(async (usuario, options) => {
		if (options.type === undefined) {
			const salt = bcrypt.genSaltSync(APP_BCRYPT_SALT_ROUNDS);
			const hash = bcrypt.hashSync(usuario.password, salt);
			usuario.password = hash;
		}
	});

	// Methods

	// getUsuarioByName
	Usuario.getUsuarioByName = async function (usuario) {
		return await this.findOne({
			where: {
				usuario: usuario,
				activo: true,
			},
		});
	};

	// getUsuarioById
	Usuario.getUsuarioById = async function (id) {
		return await this.findOne({
			where: {
				id: id,
				activo: true,
			},
		});
	};

	// Add
	Usuario.add = async function (data = {}) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.create({ ...data });
		}

		return null;
	};

	// Edit
	Usuario.edit = async function (data, usuario) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.update({ ...data }, { where: { id: usuario.id } });
		}

		return null;
	};

	// Get
	Usuario.get = async function (id) {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findOne({
				attributes: ["id", "usuario", "nombre", "apellido", "email", "telefono"],
				include: [{ ...this.getRolSentence() }],
				where: {
					id: id,
					activo: true,
				},
			});
		}

		return null;
	};

	// List
	Usuario.list = async function (offset, limit, order = "DESC", orderBy = "id") {
		if (systemPermissions.hasPermission("SUPERUSUARIO")) {
			return await this.findAndCountAll({
				attributes: ["id", "usuario", "nombre", "apellido", "email", "telefono"],
				include: [{ ...this.getRolSentence() }],
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
	Usuario.remove = async function (id) {
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
	Usuario.getRolSentence = function () {
		let { usuarioRol, Rol } = this.sequelize.models;
		return {
			attributes: ["id"],
			model: usuarioRol,
			as: "relUsuario",
			where: {
				activo: true,
			},
			required: false,
			include: [
				{
					attributes: ["nombre"],
					model: Rol,
					as: "relRol",
					required: false,
				},
			],
		};
	};

	return Usuario;
};

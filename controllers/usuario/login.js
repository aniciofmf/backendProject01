const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Usuario = require(`${__basedir}/models/`).Usuario;
const usuarioRol = require(`${__basedir}/models/`).usuarioRol;
const { generateJwtToken } = require(`${__basedir}/utils/jwtToken`);

// Login
exports.login = asyncHandler(async (req, res, next) => {
	try {
		const data = req.body;
		let token = null;

		if (data.usuario === undefined || data.password === undefined) {
			return res.status(401).send({
				message: "Credenciales inválidas",
				success: false,
			});
		} else {
			if (data.usuario.length === 0 || data.password.length === 0) {
				return res.status(401).send({
					message: "Credenciales inválidas",
					success: false,
				});
			}
		}

		const usuario = await Usuario.getUsuarioByName(data.usuario);

		if (usuario === null) {
			return res.status(401).send({
				message: "Credenciales inválidas",
				success: false,
			});
		}

		const validPassword = await bcrypt.compare(data.password, usuario.password);

		if (!validPassword) {
			return res.status(401).send({
				message: "Credenciales inválidas",
				success: false,
			});
		}

		let roles = await getRolesPermisos(usuario.id);

		if (!usuario.token) {
			token = await getToken(usuario, roles);
		} else {
			token = usuario.token;
		}

		usuario.token = token;

		await usuario.save();

		res.status(200).send({
			display: `${usuario.nombre} ${usuario.apellido}`,
			roles: roles,
			token: token,
		});
	} catch (error) {
		next(error);
	}
});

// Logout
exports.logout = asyncHandler(async (req, res, next) => {
	try {
		const { id, usuario } = req.decoded;

		const usuarioActivo = await Usuario.findOne({
			where: {
				id: id,
				usuario: usuario,
				activo: true,
			},
		});

		if (usuarioActivo === null) {
			return res.status(401).send({
				message: "Credenciales inválidas",
			});
		}

		usuarioActivo.token = null;

		await usuarioActivo.save();

		res.status(200).send({
			success: true,
		});
	} catch (error) {
		next(error);
	}
});

//Permisos
getRolesPermisos = async (id) => {
	const usuarioRolesPermisos = [];

	const permisos = await usuarioRol.findAll({
		where: {
			id_usuario: id,
			activo: true,
		},
		include: ["relRol"],
	});

	_.forEach(permisos, (permisoLista) => {
		const permiso = permisoLista.dataValues["relRol"].dataValues;

		_.map(permiso, function (value, key) {
			if (value && key !== "id" && key !== "nombre") {
				usuarioRolesPermisos.push(key);
			}
		});
	});

	return _.uniq(usuarioRolesPermisos);
};

// getToken
getToken = async (usuario, roles) => {
	let jwtToken = null;

	jwtToken = generateJwtToken({
		id: usuario.id,
		usuario: usuario.usuario,
		roles: roles,
	});

	return jwtToken;
};

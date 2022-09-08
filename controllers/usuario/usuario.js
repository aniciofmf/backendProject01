const _ = require("lodash");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Usuario = require(`${__basedir}/models/`).Usuario;
const { removeFieldsFromData } = require(`${__basedir}/utils/helpers/requestHelpers`);

// Add Usuario
exports.add = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;

		data = removeFieldsFromData(data, ["id", "activo"]);

		let usuario = await Usuario.add(data);

		if (usuario !== null) {
			return res.status(200).send({
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		next(error);
	}
});

// Edit Usuario
exports.edit = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;
		const id = parseInt(req.params.id) || null;

		data = removeFieldsFromData(data, ["id", "token"]);

		let usuario = await Usuario.getUsuarioById(id);

		if (usuario !== null) {
			await Usuario.edit(data, usuario);
			return res.status(200).send({
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		next(error);
	}
});

// Get Usuario
exports.get = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let usuario = await Usuario.get(id);

		if (usuario !== null) {
			return res.status(200).send({
				usuario,
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		next(error);
	}
});

// List Usuarios
exports.list = asyncHandler(async (req, res, next) => {
	try {
		let limit = 10;
		let offset = 0;
		let usuarios = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let usuariosList = await Usuario.list(offset, limit);

		if (usuariosList !== null) {
			_.map(usuariosList.rows, (usuario) => {
				usuarios.push(usuario);
			});

			return res.status(200).send({
				usuarios,
				total: usuariosList.count,
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		next(error);
	}
});

// Remove Usuario
exports.remove = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;

		let usuario = await Usuario.remove(id);

		if (usuario !== null) {
			return res.status(200).send({
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		next(error);
	}
});

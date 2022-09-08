const _ = require("lodash");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Ubicacion = require(`${__basedir}/models/`).Ubicacion;
const { removeFieldsFromData } = require(`${__basedir}/utils/helpers/requestHelpers`);

// Add Ubicacion
exports.add = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;

		data = removeFieldsFromData(data, ["id"]);

		let ubicacion = await Ubicacion.add(data);

		if (ubicacion !== null) {
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

// Edit Ubicacion
exports.edit = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;
		const id = parseInt(req.params.id) || null;

		data = removeFieldsFromData(data, ["id"]);

		let ubicacion = await Ubicacion.getUbicacionById(id);

		if (ubicacion !== null) {
			await Ubicacion.edit(data, ubicacion);
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

// Get Ubicacion
exports.get = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let ubicacion = await Ubicacion.get(id);

		if (ubicacion !== null) {
			return res.status(200).send({
				ubicacion,
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

// List Ubicaciones
exports.list = asyncHandler(async (req, res, next) => {
	try {
		let limit = 10;
		let offset = 0;
		let ubicaciones = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let ubicacionList = await Ubicacion.list(offset, limit);

		if (ubicacionList !== null) {
			_.map(ubicacionList.rows, (ubicacion) => {
				ubicaciones.push(ubicacion);
			});

			return res.status(200).send({
				ubicaciones,
				total: ubicacionList.count,
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

// Remove Ubicacion
exports.remove = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let ubicacion = await Ubicacion.remove(id);

		if (ubicacion !== null) {
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

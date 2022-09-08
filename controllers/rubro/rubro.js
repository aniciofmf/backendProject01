const _ = require("lodash");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Rubro = require(`${__basedir}/models/`).Rubro;
const { removeFieldsFromData } = require(`${__basedir}/utils/helpers/requestHelpers`);

// Add Ubicacion
exports.add = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;

		data = removeFieldsFromData(data, ["id"]);

		let rubro = await Rubro.add(data);

		if (rubro !== null) {
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

		let rubro = await Rubro.getRubroById(id);

		if (rubro !== null) {
			await Rubro.edit(data, rubro);
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
		let rubro = await Rubro.get(id);

		if (rubro !== null) {
			return res.status(200).send({
				rubro,
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
		let rubros = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let rubroList = await Rubro.list(offset, limit);

		if (rubroList !== null) {
			_.map(rubroList.rows, (rubro) => {
				rubros.push(rubro);
			});

			return res.status(200).send({
				rubros,
				total: rubroList.count,
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
		let rubro = await Rubro.remove(id);

		if (rubro !== null) {
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

const _ = require("lodash");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Producto = require(`${__basedir}/models/`).Producto;
const { removeFieldsFromData } = require(`${__basedir}/utils/helpers/requestHelpers`);

// Add Producto
exports.add = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;

		data = removeFieldsFromData(data, ["id", "activo"]);

		let producto = await Producto.add(data);

		if (producto !== null) {
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

// Edit Producto
exports.edit = asyncHandler(async (req, res, next) => {
	try {
		let data = req.body;
		const id = parseInt(req.params.id) || null;

		data = removeFieldsFromData(data, ["id", "activo"]);

		let producto = await Producto.getProductoById(id);

		if (producto !== null) {
			await Producto.edit(data, producto);
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

// Get Producto
exports.get = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let producto = await Producto.get(id);

		if (producto !== null) {
			return res.status(200).send({
				producto,
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

// List Productos
exports.list = asyncHandler(async (req, res, next) => {
	try {
		let limit = 10;
		let offset = 0;
		let productos = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let productosList = await Producto.list(offset, limit);

		if (productosList !== null) {
			_.map(productosList.rows, (producto) => {
				productos.push(producto);
			});

			return res.status(200).send({
				productos,
				total: productosList.count,
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

// Remove Producto
exports.remove = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let producto = await Producto.remove(id);

		if (producto !== null) {
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

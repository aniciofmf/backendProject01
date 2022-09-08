const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const randomatic = require("randomatic");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const Relevamiento = require(`${__basedir}/models/`).Relevamiento;
const relevamientoRelacion = require(`${__basedir}/models/`).relevamientoRelacion;
const { removeFieldsFromData, fillFieldsWithData, validUuid } = require(`${__basedir}/utils/helpers/requestHelpers`);
const { generateJwtToken } = require(`${__basedir}/utils/jwtToken`);

// getToken
exports.getToken = asyncHandler(async (req, res, next) => {
	try {
		const data = req.body;
		const codigo = parseInt(data.codigo) || null;
		const identificador = data.identificador || null;

		if (!validUuid(identificador)) {
			return res.status(422).send({
				message: "Identificador inválido",
				success: false,
			});
		}

		if (codigo === null || (codigo.toString().length > 0 && codigo.toString().length > 6)) {
			return res.status(422).send({
				message: "Código inválido",
				success: false,
			});
		}

		let relevamientoToken = await Relevamiento.getRelevamientoTokenByIdentificador(data);
		let token = relevamientoToken.token;

		if (relevamientoToken !== null) {
			return res.status(200).send({
				token,
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// Add Relevamiento
exports.add = asyncHandler(async (req, res, next) => {
	try {
		const { usuario } = req.decoded;

		let data = req.body;

		data = removeFieldsFromData(data, ["id", "activo", "relevamientos", "token"]);
		data = fillFieldsWithData(data, ["identificador", "codigo", "usuario_creador"], [uuidv4(), randomatic("0", 6), usuario]);

		if (!_.isObject(data.items) || _.size(data.items) === 0) {
			return res.status(422).send({
				message: "No hay datos para el relevamiento",
				success: false,
			});
		} else {
			_.map(data.items, (elementoRelevamiento) => {
				if (!_.has(elementoRelevamiento, "id_producto") || !_.has(elementoRelevamiento, "id_ubicacion")) {
					return res.status(422).send({
						message: "Elemento inválido en el relevamiento",
						success: false,
					});
				}
			});

			data.items = _.uniqWith(data.items, _.isEqual);
		}

		data.token = generateJwtToken({ id: data.identificador, rdid: randomatic("Aa10!", 12) });

		let relevamiento = await Relevamiento.add(data, data.items);

		if (relevamiento !== null) {
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

// Edit Relevamiento
exports.edit = asyncHandler(async (req, res, next) => {
	try {
		const idRelevamiento = req.params.id;
		let data = req.body;

		data = removeFieldsFromData(data, ["id", "link", "codigo", "usuario_creador", "relevamientos", "token", "activo"]);

		if (_.isObject(data.items) || _.size(data.items) > 0) {
			_.map(data.items, (elementoRelevamiento) => {
				if (!_.has(elementoRelevamiento, "id_producto") || !_.has(elementoRelevamiento, "id_ubicacion")) {
					return res.status(422).send({
						message: "Elemento inválido en el relevamiento",
						success: false,
					});
				}
			});

			data.items = _.uniqWith(data.items, _.isEqual);
		} else {
			data.items = {};
		}

		let relevamiento = await Relevamiento.edit(idRelevamiento, data, data.items);

		if (relevamiento !== null) {
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

// Get Relevamiento
exports.get = asyncHandler(async (req, res, next) => {
	try {
		const id = parseInt(req.params.id) || null;
		let relevamiento = await Relevamiento.get(id);
		let items = [];

		if (relevamiento !== null) {
			_.map(relevamiento.items, (item) => {
				let itemRelevamiento = {
					id: item.id,
					id_relevamiento: item.id_relevamiento,
					id_producto: item.relRelevamientoProducto.dataValues.id_producto,
					producto: item.relRelevamientoProducto.dataValues.nombre,
					id_rubro: item.relRelevamientoProducto.relRubro.dataValues.id_rubro,
					rubro: item.relRelevamientoProducto.relRubro.dataValues.rubro,
					id_ubicacion: item.relRelevamientoUbicacion.dataValues.id_ubicacion,
					ubicacion: item.relRelevamientoUbicacion.dataValues.ubicacion,
				};

				items.push(itemRelevamiento);
			});

			delete relevamiento.dataValues.items;

			return res.status(200).send({
				relevamiento,
				items,
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

// List Relevamientos
exports.list = asyncHandler(async (req, res, next) => {
	try {
		let limit = 10;
		let offset = 0;
		let relevamientos = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let relevamientoList = await Relevamiento.list(offset, limit);

		if (relevamientoList !== null) {
			_.map(relevamientoList.rows, (relevamiento) => {
				relevamientos.push(relevamiento);
			});

			return res.status(200).send({
				relevamientos,
				total: relevamientoList.count,
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

// getRelevamiento
exports.getRelevamiento = asyncHandler(async (req, res, next) => {
	try {
		const identificador = req.params.identificador;

		if (!validUuid(identificador)) {
			return res.status(422).send({
				message: "Identificador inválido",
				success: false,
			});
		}

		let relevamiento = await Relevamiento.getRelevamientoByIdentificador(identificador);

		if (relevamiento !== null) {
			delete relevamiento.dataValues.id;

			return res.status(200).send({
				relevamiento,
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

// listRelevamientoProductos
exports.listRelevamientoProductos = asyncHandler(async (req, res, next) => {
	try {
		const identificador = req.params.identificador;
		let items = [];

		if (!validUuid(identificador)) {
			return res.status(422).send({
				message: "Identificador inválido",
				success: false,
			});
		}

		let relevamiento = await Relevamiento.getRelevamientoByIdentificador(identificador);

		if (relevamiento !== null) {
			let relevamientoItems = await relevamientoRelacion.getDataRelevamientoRelacionById(relevamiento.id);
			_.map(relevamientoItems.rows, (relevamientoItem) => {
				let item = {};
				item = {
					id: relevamientoItem.id,
					producto: relevamientoItem.relRelevamientoProducto.dataValues.nombre,
					ubicacion: relevamientoItem.relRelevamientoUbicacion.dataValues.ubicacion,
				};

				items.push(item);
			});

			return res.status(200).send({
				items,
				success: true,
			});
		}

		return res.status(401).send({
			success: false,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// removeItem
exports.removeItem = asyncHandler(async (req, res, next) => {
	try {
		const idRelevamiento = req.params.idRelevamiento;
		const idItem = req.params.idItem;

		let itemRemoved = await relevamientoRelacion.removeItem(idRelevamiento, idItem);

		if (itemRemoved !== null) {
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

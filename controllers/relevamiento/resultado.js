const _ = require("lodash");
const asyncHandler = require(`${__basedir}/utils/asyncHandler`);
const relevamientoResultado = require(`${__basedir}/models/`).relevamientoResultado;
const { validUuid } = require(`${__basedir}/utils/helpers/requestHelpers`);

// Add Relevamiento Resultado (Encuesta)
exports.add = asyncHandler(async (req, res, next) => {
	try {
		let identificadorUri = req.params.identificador;
		let data = req.body;
		let identificador = data.identificador || null;

		if (!validUuid(identificador) || identificadorUri != identificador) {
			return res.status(422).send({
				message: "Identificador inválido",
				success: false,
			});
		}

		if (!_.isObject(data.items) || _.size(data.items) === 0) {
			return res.status(422).send({
				message: "No hay datos para procesar la encuesta",
				success: false,
			});
		}

		let resultado = await relevamientoResultado.add(data.items);

		// Chequear si los id_relevamiento_relacion pertenecen al id_relevamiento del identificador

		if (resultado !== null) {
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

// List Resultados
exports.list = asyncHandler(async (req, res, next) => {
	try {
		let limit = 10;
		let offset = 0;
		let relevamientosResultados = [];

		if (req.params.page === undefined || req.params.page == 0) {
			offset = 0;
		} else {
			offset = req.params.page * limit;
		}

		let relevamientoResultadoList = await relevamientoResultado.list(offset, limit);

		if (relevamientoResultadoList !== null) {
			_.map(relevamientoResultadoList.rows, (relevamiento) => {
				relevamientosResultados.push(relevamiento);
			});

			return res.status(200).send({
				relevamientosResultados,
				total: relevamientoResultadoList.count,
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

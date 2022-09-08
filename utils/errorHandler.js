const errorHandler = async (err, req, res, next) => {
	let error = { ...err };

	switch (error.name) {
		case "SequelizeForeignKeyConstraintError":
			error.message = "Error de Constraint FK";
			break;
		case "SequelizeUniqueConstraintError":
			error.message = `Error de duplicación el valor ${error.errors[0].path} debe ser único, se detectaron duplicados`;
			return res.status(406).json({
				messsage: error.message,
				success: false,
			});
		case "SequelizeValidationError":
			let errMessage = error.errors[0].message;
			error.message = `${errMessage}`;
			return res.status(422).json({
				messsage: error.message,
				success: false,
			});
		case "ER_BAD_FIELD_ERROR":
			error.message = "Error de Campo";
			break;
		case "ER_NO_REFERENCED_ROW_2":
			error.message = "Error de Referencia FK";
			break;
		default:
			error.message = "Hubo un error en el sistema";
			break;
	}

	return res.status(error.statusCode || 500).json({
		messsage: error.message || "Server Error",
		error: true,
		success: false,
	});
};

module.exports = errorHandler;

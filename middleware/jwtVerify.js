const jwt = require("jsonwebtoken");
const { JWT_PUBLIC_KEY } = require(`${__basedir}/config/config`);
const Usuario = require(`${__basedir}/models/`).Usuario;

module.exports = (req, res, next) => {
	let header = req.headers["authorization"];

	try {
		if (typeof header !== "undefined") {
			let token = header.split(" ")[1];

			if (header.split(" ")[0] !== "Bearer") {
				return res.status(403).send({ message: "Token inválido", success: false });
			}

			jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ["RS256"], ignoreExpiration: true }, async (err, _) => {
				if (err) return res.status(403).send({ message: "Token inválido", success: false });

				req.decoded = jwt.decode(token);
				userValid = await Usuario.findOne({
					where: {
						id: req.decoded.id,
						token: token,
					},
				});

				if (userValid === null) {
					return res.status(403).send({ message: "Token inválido", success: false });
				}

				return next();
			});
		} else {
			return res.status(403).send({ message: "El token es obligatorio", success: false });
		}
	} catch (e) {
		const error = new Error(e);
		error.httpStatusCode = 500;
		return next(error);
	}
};

const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require(`${__basedir}/config/config`);

exports.generateJwtToken = (data) => {
	const payload = {
		...data,
	};

	let token = jwt.sign(payload, JWT_PRIVATE_KEY, {
		algorithm: "RS256",
	});

	return token;
};

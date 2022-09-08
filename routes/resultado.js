const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkJwtEncuestadorToken = require(`${__basedir}/middleware/jwtVerifyEncuestador`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { add, list } = require(`${__basedir}/controllers/relevamiento/resultado`);

module.exports = (app) => {
	// Add Registro Encuesta (Relevamiento)
	app.post("/api/relevamiento/proceso/:identificador", [checkJwtEncuestadorToken], add);

	// List Resultados
	app.get("/api/relevamiento/resultados/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);
};

const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkJwtEncuestadorToken = require(`${__basedir}/middleware/jwtVerifyEncuestador`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { add, edit, get, list, listRelevamientoProductos, getRelevamiento, removeItem, getToken } = require(`${__basedir}/controllers/relevamiento/relevamiento`);

module.exports = (app) => {
	// getToken
	app.post("/api/relevamiento/token", [], getToken);

	// Add
	app.post("/api/relevamiento/add", [checkJwtToken, checkPermissions(["superusuario"])], add);

	// Edit
	app.post("/api/relevamiento/edit/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], edit);

	// Get
	app.get("/api/relevamiento/get/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], get);

	// List
	app.get("/api/relevamiento/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);

	// Remove Item Relevamiento
	app.delete("/api/relevamiento/item/:idRelevamiento(\\d+)/:idItem(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], removeItem);

	// List Productos Relevamiento Encuesta
	app.get("/api/relevamiento/productos/:identificador", [checkJwtEncuestadorToken], listRelevamientoProductos);

	// Get Relevamiento Encuesta
	app.get("/api/relevamiento/:identificador", [checkJwtEncuestadorToken], getRelevamiento);
};

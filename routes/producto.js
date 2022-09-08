const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { add, edit, remove, get, list } = require(`${__basedir}/controllers/producto/producto`);

module.exports = (app) => {
	// Add
	app.post("/api/producto/add", [checkJwtToken, checkPermissions(["superusuario"])], add);

	// Edit
	app.post("/api/producto/edit/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], edit);

	// Get
	app.get("/api/producto/get/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], get);

	// List
	app.get("/api/producto/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);

	// Remove
	app.delete("/api/producto/remove/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], remove);
};

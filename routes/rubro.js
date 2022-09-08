const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { add, edit, remove, get, list } = require(`${__basedir}/controllers/rubro/rubro`);

module.exports = (app) => {
	// Add
	app.post("/api/rubro/add", [checkJwtToken, checkPermissions(["superusuario"])], add);

	// Edit
	app.post("/api/rubro/edit/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], edit);

	// Get
	app.get("/api/rubro/get/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], get);

	// List
	app.get("/api/rubro/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);

	// Remove
	app.delete("/api/rubro/remove/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], remove);
};

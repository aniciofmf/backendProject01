const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { add, edit, remove, get, list } = require(`${__basedir}/controllers/ubicacion/ubicacion`);

module.exports = (app) => {
	// Add
	app.post("/api/ubicacion/add", [checkJwtToken, checkPermissions(["superusuario"])], add);

	// Edit
	app.post("/api/ubicacion/edit/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], edit);

	// Get
	app.get("/api/ubicacion/get/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], get);

	// List
	app.get("/api/ubicacion/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);

	// Remove
	app.delete("/api/ubicacion/remove/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], remove);
};

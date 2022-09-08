const checkJwtToken = require(`${__basedir}/middleware/jwtVerify`);
const checkPermissions = require(`${__basedir}/middleware/permisos/permiso`);
const { login, logout } = require(`${__basedir}/controllers/usuario/login`);
const { add, edit, remove, get, list } = require(`${__basedir}/controllers/usuario/usuario`);

module.exports = (app) => {
	// Login
	app.post("/api/usuario/login", [], login);

	// Logout
	app.post("/api/usuario/logout", [checkJwtToken], logout);

	// Add
	app.post("/api/usuario/add", [checkJwtToken, checkPermissions(["superusuario"])], add);

	// Edit
	app.post("/api/usuario/edit/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], edit);

	// Get
	app.get("/api/usuario/get/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], get);

	// List
	app.get("/api/usuario/list/:page(\\d+)?", [checkJwtToken, checkPermissions(["superusuario"])], list);

	// Remove
	app.delete("/api/usuario/remove/:id(\\d+)", [checkJwtToken, checkPermissions(["superusuario"])], remove);
};

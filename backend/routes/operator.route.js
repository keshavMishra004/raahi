import { login, signup } from "../controllers/operator.controller.js";

function operatorRoutes(app) {
    app.post('/cms/signup', signup);
    app.post('/cms/login', login);
}

export default operatorRoutes;
import { login, signup } from "../controllers/user.controller.js";

function userRoutes(app) {
    app.post("/user/signup", signup);
    app.post("/user/login", login);
}

export default userRoutes;
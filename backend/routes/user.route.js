import { login, signup, getMyProfile, updateMyProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

function userRoutes(app) {
  app.post("/user/signup", signup);
  app.post("/user/login", login);

  /* ===== PROFILE ROUTES ===== */
  app.get("/user/me", authMiddleware, getMyProfile);
  app.put("/user/me", authMiddleware, updateMyProfile);
}

export default userRoutes;

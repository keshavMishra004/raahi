import { addAircraft, getAircrafts, updateAircraft, deleteAircraft } from "../controllers/aircraft.controller.js";

// import { cmsAuth } from "../middlewares/cmsAuth.js";

// For development, remove cmsAuth to avoid 401/403 errors
function aircraftRoutes(app) {
    app.post("/cms/aircraft", addAircraft); // remove cmsAuth for now
    app.get("/cms/aircrafts", getAircrafts);
    app.put("/cms/aircraft/:id", updateAircraft);
    app.delete("/cms/aircraft/:id", deleteAircraft);
}

export default aircraftRoutes;
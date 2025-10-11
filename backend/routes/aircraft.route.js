import { addAircraft, getAircrafts, updateAircraft, deleteAircraft } from "../controllers/aircraft.controller.js";
import multer from "multer";

// Configure multer (memory storage for now)
const upload = multer();

// Accept dgcaCertificate (single file) and photos (multiple files)
const aircraftUpload = upload.fields([
  { name: "dgcaCertificate", maxCount: 1 },
  { name: "photos", maxCount: 10 },
]);

function aircraftRoutes(app) {
    app.post("/cms/aircraft", aircraftUpload, addAircraft);
    app.get("/cms/aircrafts", getAircrafts);
    app.put("/cms/aircraft/:id", updateAircraft);
    app.delete("/cms/aircraft/:id", deleteAircraft);
}

export default aircraftRoutes;
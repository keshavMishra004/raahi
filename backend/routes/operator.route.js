import { login, signup, getOperatorProfile, saveOperatorProfile, uploadOperatorDocuments, deleteOperatorDocument, testCloudinary } from "../controllers/operator.controller.js";
import { cmsAuth } from "../middlewares/cmsAuth.js";

function operatorRoutes(app) {
    app.post('/cms/signup', signup);
    app.post('/cms/login', login);
    app.get('/operator', cmsAuth, getOperatorProfile);
    app.post('/operator', cmsAuth, saveOperatorProfile);

    // File upload / delete endpoints
    app.post('/operator/upload', cmsAuth, uploadOperatorDocuments);
    app.delete('/operator/document', cmsAuth, deleteOperatorDocument);

    // Cloudinary test (no auth) - call to validate CLOUDINARY_* env vars and connectivity
    // app.get('/operator/cloudinary/test', testCloudinary);
}

export default operatorRoutes;
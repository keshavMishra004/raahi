import { createOrUpdatePolicy, getAllPolicies, getPolicy } from "../controllers/policy.controller.js";
import { cmsAuth } from "../middlewares/cmsAuth.js";

function policyRoute(app) {
    app.get("/cms/getPolicy", cmsAuth, getAllPolicies);
    app.get("/cms/getPolicyByService", cmsAuth, getPolicy); // expects ?service=...
    app.post("/cms/createOrUpdatePolicy", cmsAuth, createOrUpdatePolicy);
}

export default policyRoute;
import { createOrUpdateFaq, getAllFaqs, getFaq } from "../controllers/faq.controller.js";
import { cmsAuth } from "../middlewares/cmsAuth.js";

export default function faqRoutes(app) {
    app.put("/cms/createOrUpdateFaq", cmsAuth, createOrUpdateFaq);
    app.get("/cms/getAllFaqs", cmsAuth, getAllFaqs);
    app.get("/cms/getFaq", cmsAuth, getFaq);
}
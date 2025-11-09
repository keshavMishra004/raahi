import { getMonthlyData, bulkUpdateData } from "../controllers/pricingCalendarController.js";
import { cmsAuth } from "../middlewares/cmsAuth.js";

function pricingCalendarRoutes(app) {
	app.get("/api/pricing/calendar/month", cmsAuth, getMonthlyData);
	app.post("/api/pricing/calendar/bulk", cmsAuth, bulkUpdateData);
}

export { pricingCalendarRoutes }; // named export
export default pricingCalendarRoutes; // default export

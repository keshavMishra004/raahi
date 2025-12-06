import { getMonthlyData, bulkUpdateData, getDayData, bulkUpdateTimeSlots } from "../controllers/pricingCalendarController.js";
import { cmsAuth } from "../middlewares/cmsAuth.js";

function pricingCalendarRoutes(app) {
	app.get("/api/pricing/calendar/month", cmsAuth, getMonthlyData);
	app.post("/api/pricing/calendar/bulk", cmsAuth, bulkUpdateData);
	app.get("/api/pricing/calendar/day", cmsAuth, getDayData);
	app.post("/api/pricing/calendar/timeslots/bulk", cmsAuth, bulkUpdateTimeSlots);
}

export { pricingCalendarRoutes };
export default pricingCalendarRoutes;

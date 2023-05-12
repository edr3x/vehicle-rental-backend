import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";
import { bookingSchema } from "../schemas/booking.schema";

import * as BookingController from "../controllers/booking.controller";

const router = Router();

router.post(
    "/vehicle",
    verifyInput(bookingSchema),
    BookingController.bookVehicleController,
);

// here id is bookingID
router.get("/cancel/:id", BookingController.cancelBookingController);

router.get("/list", BookingController.getMyBookingsController);

router.get("/request", BookingController.myBookingRequestController);

export default router;

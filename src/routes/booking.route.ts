import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";
import { bookingSchema } from "../schemas/booking.schema";

import * as BookingController from "../controllers/booking.controller";

const router = Router();

router.post(
    "/",
    verifyInput(bookingSchema),
    BookingController.bookVehicleController,
);

export default router;

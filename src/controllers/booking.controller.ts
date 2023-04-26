import { Request, Response, NextFunction } from "express";

import { bookingService } from "../services/booking.service";
import { BookingSchema } from "../schemas/booking.schema";

export async function bookVehicleController(
    req: Request<{}, {}, BookingSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await bookingService(res.locals.user, req.body);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

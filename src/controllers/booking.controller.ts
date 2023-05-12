import { Request, Response, NextFunction } from "express";

import {
    bookingRequestHandlerService,
    bookingService,
    cancelBookingService,
    getBookingDetailsService,
    myBookingRequestService,
    myBookingsService,
} from "../services/booking.service";
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

export async function cancelBookingController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const bookingid = req.params.id;
        const response = await cancelBookingService(bookingid, res.locals.user);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getBookingDetailsService(req.params.id);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getMyBookingsController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await myBookingsService(res.locals.user);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function myBookingRequestController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await myBookingRequestService(res.locals.user);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function bookingRequestController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await bookingRequestHandlerService(
            req.params.id,
            res.locals.user,
        );

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

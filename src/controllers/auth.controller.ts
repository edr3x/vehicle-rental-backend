import { NextFunction, Request, Response } from "express";

import {
    updateUserService,
    sendOTP,
    verifyOTP,
} from "../services/auth.service";
import {
    CreateUserSchema,
    SendOTPSchema,
    VerifyOTPSchema,
} from "../schemas/auth.schema";

export async function sendOTPController(
    req: Request<{}, {}, SendOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await sendOTP(req.body.phone);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyOTPController(
    req: Request<{}, {}, VerifyOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone, code } = req.body;

        const response = await verifyOTP(phone, code);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateUserController(
    req: Request<{}, {}, CreateUserSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateUserService(req.body, res.locals.user);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

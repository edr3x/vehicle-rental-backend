import { NextFunction, Request, Response } from "express";

import {
    sendOTP,
    verifyEmailService,
    verifyOTP,
} from "../services/auth.service";
import { SendOTPSchema, VerifyOTPSchema } from "../schemas/auth.schema";

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

export async function verifyEmailController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const code = req.query.code as string;
        const email = req.query.email as string;

        const response = await verifyEmailService(code, email);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyDriverOTP(
    req: Request<{}, {}, VerifyOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone, code } = req.body;

        const response = await verifyOTP(phone, code, "driver");

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

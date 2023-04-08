import { NextFunction, Request, Response } from "express";

import {
    createUserService,
    sendOTP,
    verifyOTP,
} from "../services/auth.service";
import {
    CreateUserSchema,
    SendOTPSchema,
    VerifyOTPSchema,
} from "../schemas/auth.schema";

export async function sendOTPController(
    req: Request<SendOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone } = req.params;

        const response = await sendOTP(parseInt(phone, 10));

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyOTPController(
    req: Request<VerifyOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone, code } = req.params;

        const response = await verifyOTP(
            parseInt(phone, 10),
            parseInt(code, 10),
        );

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function createUserController(
    req: Request<{}, {}, CreateUserSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await createUserService(req.body);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

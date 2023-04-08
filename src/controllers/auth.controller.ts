import { NextFunction, Request, Response } from "express";

import { sendVerificationCode } from "../services/auth.service";

export async function verifyPhoneController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const number = parseInt(req.params.number, 10);

        const phone = await sendVerificationCode(number);

        return res.status(200).json({ success: true, data: phone });
    } catch (e: any) {
        next(e);
    }
}

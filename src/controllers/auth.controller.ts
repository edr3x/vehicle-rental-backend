import { Request, Response } from "express";

import { failureResponse, successResponse } from "../utils/response";
import { sendVerification } from "../utils/sms";

export async function verifyPhoneController(req: Request, res: Response) {
    try {
        const number = parseInt(req.params.number, 10);

        const message: string = "message for testing purpose";
        const send_code = await sendVerification(number, message);
        return res.status(200).json(successResponse(send_code.data.valid[0]));
    } catch (e: any) {
        return res.status(500).json(failureResponse(e.message));
    }
}

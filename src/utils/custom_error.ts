import { Response } from "express";
import { logger } from "./logger";

export class CustomError extends Error {
    statusCode = 500;
    message = "Internal Server Error";
    constructor(statusCode: number, message: any) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleError = (err: CustomError, res: Response) => {
    const { statusCode, message } = err;
    logger.error(message);
    res.status(statusCode).json({ success: false, message });
};

import { NextFunction, Request, Response } from "express";

import * as VehicleService from "../services/vehicle.service";
import { AddCategorySchema } from "../schemas/vehicle.schema";

export async function addCategoryController(
    req: Request<{}, {}, AddCategorySchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await VehicleService.addCategory(req.body);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

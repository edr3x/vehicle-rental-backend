import { NextFunction, Request, Response } from "express";

import { UpdateUserSchema, UpdateAddressSchema } from "../schemas/user.schema";

import {
    getAllUserService,
    getUserService,
    updateAddressService,
    updateUserService,
    uploadImageService,
} from "../services/user.service";

export async function getUserController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getUserService(res.locals.user);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getAllUsersController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getAllUserService();

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateUserController(
    req: Request<{}, {}, UpdateUserSchema>,
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

export async function uploadImageController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await uploadImageService(req, res.locals.user);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateAddressController(
    req: Request<{}, {}, UpdateAddressSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateAddressService(req.body, res.locals.user);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

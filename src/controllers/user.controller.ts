import { NextFunction, Request, Response } from "express";

import {
    UpdateUserSchema,
    UpdateAddressSchema,
    LicenseDetailsSchema,
    UpdateLicenseSchema,
    PostCitizenshipSchema,
    UpdateCitizenshipSchema,
} from "../schemas/user.schema";

import {
    createLicenseDetailsService,
    deleteUserService,
    getAllUserService,
    getKycDetailsService,
    getSimilarUserService,
    getUserDetailsService,
    getUserService,
    postCitizenshipService,
    updateAddressService,
    updateCitizenshipService,
    updateLicenseDetailsService,
    updateUserService,
    userData,
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

export async function getUserDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getUserDetailsService(req.params.id);

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

        return res.status(200).json({ success: true, data: response });
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

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function postLicenseDetailsController(
    req: Request<{}, {}, LicenseDetailsSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await createLicenseDetailsService(
            req.body,
            res.locals.user,
        );

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateLicenseDetailsController(
    req: Request<{}, {}, UpdateLicenseSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateLicenseDetailsService(
            req.body,
            res.locals.user,
        );

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await deleteUserService(req.params.id);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function necessaryUserData(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await userData();

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getKycDetailsController(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getKycDetailsService(res.locals.user.id);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function postCitizenshipController(
    req: Request<{}, {}, PostCitizenshipSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await postCitizenshipService(
            res.locals.user.id,
            req.body,
        );

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateCitizenshipController(
    req: Request<{}, {}, UpdateCitizenshipSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateCitizenshipService(
            res.locals.user.id,
            req.body,
        );

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getSimilarUsersController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getSimilarUserService(req.params.id);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

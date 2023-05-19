import { Request, Response, NextFunction } from "express";
import {
    updateBrandLogo,
    updateLicensePic,
    updateProfilePic as updateProfilePicService,
    updateVehicleThumbnail,
    uploadService,
} from "../services/upload.service";

interface MulterFile extends Express.Multer.File {}

export async function uploadController(
    req: Request<{}, {}, { images: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let images = req.files as MulterFile[] | undefined;

        const imageArr = images?.map((file: MulterFile) => file.filename);

        const response = await uploadService(imageArr, res.locals.user);

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function uploadSingleController(
    req: Request<{}, {}, { image: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let image = req.file as MulterFile | undefined;

        return res.status(201).json({ success: true, data: image?.filename });
    } catch (e: any) {
        next(e);
    }
}

export async function updateProfilePicController(
    req: Request<{}, {}, { image: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let image = req.file as MulterFile | undefined;

        const response = await updateProfilePicService(
            image?.filename,
            res.locals.user,
        );

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateLicensePicController(
    req: Request<{}, {}, { image: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let image = req.file as MulterFile | undefined;

        const response = await updateLicensePic(
            image?.filename,
            res.locals.user,
        );

        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateBrandLogoController(
    req: Request<{ id: string }, {}, { image: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let image = req.file as MulterFile | undefined;

        const response = await updateBrandLogo(image?.filename, req.params.id);

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateVehicleThumbnailController(
    req: Request<{ id: string }, {}, { image: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let image = req.file as MulterFile | undefined;

        const response = await updateVehicleThumbnail(
            image?.filename,
            req.params.id,
            res.locals.user,
        );

        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

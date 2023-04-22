import { Request, Response, NextFunction } from "express";
import {
    updateLicensePic,
    updateProfilePic as updateProfilePicService,
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

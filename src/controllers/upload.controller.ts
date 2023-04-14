import { Request, Response, NextFunction } from "express";
import { uploadService } from "../services/upload.service";

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

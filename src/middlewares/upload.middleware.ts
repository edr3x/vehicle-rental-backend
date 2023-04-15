import { Request } from "express";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

import { CustomError } from "../utils/custom_error";

const myStorage = multer.diskStorage({
    destination: (_req: Request, _file: any, cb: any) => {
        const uploadpath = join(__dirname, "..", "Storage");

        cb(null, uploadpath);
    },
    filename: (_req: Request, file: any, cb: any) => {
        const filename = uuidv4() + "." + file.originalname.split(".").pop();

        cb(null, filename);
    },
});

export const uploader = multer({
    storage: myStorage,
    fileFilter: (_req: Request, file: any, cb: any) => {
        const ext_parts = file.originalname.split(".");
        const ext = ext_parts.pop();

        try {
            const allowed = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "svg",
                "pdf",
            ];

            if (allowed.includes(ext.toLowerCase())) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        } catch (error: any) {
            throw new CustomError(500, `Image upload error ${error}`);
        }
    },
});

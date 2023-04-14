import { Request } from "express";

import multer from "multer";

import { join } from "path";
import { CustomError } from "../utils/custom_error";

const myStorage = multer.diskStorage({
    destination: (_req: Request, _file: any, cb: any) => {
        let uploadpath = join(__dirname, "..", "Storage");
        cb(null, uploadpath);
    },
    filename: (_req: Request, file: any, cb: any) => {
        let filename = Date.now() + "." + file.originalname.split(".").pop();
        cb(null, filename);
    },
});

export const uploader = multer({
    storage: myStorage,
    fileFilter: (_req: Request, file: any, cb: any) => {
        let ext_parts = file.originalname.split(".");
        let ext = ext_parts.pop();

        try {
            let allowed = [
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
        } catch (error) {
            throw new CustomError(500, "Internal Server Error");
        }
    },
});

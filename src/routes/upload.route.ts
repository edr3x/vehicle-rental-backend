import { Router } from "express";
import {
    updateBrandLogoController,
    updateLicensePicController,
    updateProfilePicController,
    uploadController,
    uploadSingleController,
} from "../controllers/upload.controller";

import { uploader } from "../middlewares/upload.middleware";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/image", uploader.array("images"), uploadController);

router.post("/", uploader.single("image"), uploadSingleController);

router.patch("/profile", uploader.single("image"), updateProfilePicController);

router.patch(
    "/vehicle/brand/logo/:id",
    isAdmin,
    uploader.single("image"),
    updateBrandLogoController,
);

router.patch("/license", uploader.single("image"), updateLicensePicController);

router.patch(
    "/vehicle/thumbnail/:id",
    uploader.single("image"),
    updateBrandLogoController,
);

export default router;

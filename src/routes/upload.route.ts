import { Router } from "express";
import {
    updateBrandLogoController,
    updateLicensePicController,
    updateProfilePicController,
    uploadController,
} from "../controllers/upload.controller";

import { uploader } from "../middlewares/upload.middleware";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/image", uploader.array("images"), uploadController);

router.patch("/profile", uploader.single("image"), updateProfilePicController);

router.patch(
    "/vehicle/brand/logo/:id",
    isAdmin,
    uploader.single("image"),
    updateBrandLogoController,
);

router.patch("/license", uploader.single("image"), updateLicensePicController);

export default router;

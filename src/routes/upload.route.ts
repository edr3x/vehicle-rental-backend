import { Router } from "express";
import {
    updateProfilePicController,
    uploadController,
} from "../controllers/upload.controller";

import { uploader } from "../middlewares/upload.middleware";

const router = Router();

router.post("/image", uploader.array("images"), uploadController);

router.patch("/profile", uploader.single("image"), updateProfilePicController);

export default router;

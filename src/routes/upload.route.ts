import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";

import { uploader } from "../middlewares/upload.middleware";

const router = Router();

router.post("/image", uploader.array("images"), uploadController);

export default router;

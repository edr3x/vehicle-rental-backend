import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import * as VehicleController from "../controllers/vehicle.controller";
import { addCategorySchema } from "../schemas/vehicle.schema";

const router = Router();

router.post(
    "/category",
    verifyInput(addCategorySchema),
    VehicleController.addCategoryController,
);

export default router;

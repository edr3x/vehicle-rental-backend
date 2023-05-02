import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import * as VehicleController from "../controllers/vehicle.controller";
import {
    addBrandSchema,
    addSubCategorySchema,
    addVehicleSchema,
    updateBrandSchema,
    updateSubCategorySchema,
} from "../schemas/vehicle.schema";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/subcategory", VehicleController.listAllSubCategoryController);
router.post(
    "/subcategory",
    isAdmin,
    verifyInput(addSubCategorySchema),
    VehicleController.addSubCategoryController,
);
router.patch(
    "/subcategory/:id",
    isAdmin,
    verifyInput(updateSubCategorySchema),
    VehicleController.updateSubCategoryController,
);
router.delete(
    "/subcategory/:id",
    isAdmin,
    VehicleController.deleteSubCategoryController,
);

router.get("/brand", VehicleController.listAllBrandController);
router.post(
    "/brand",
    isAdmin,
    verifyInput(addBrandSchema),
    VehicleController.addBrandController,
);
router.patch(
    "/brand/:id",
    isAdmin,
    verifyInput(updateBrandSchema),
    VehicleController.updateBrandController,
);
router.delete("/brand/:id", isAdmin, VehicleController.deleteBrandController);

router.get("/", VehicleController.listAllVehicleController);
router.post(
    "/",
    verifyInput(addVehicleSchema),
    VehicleController.addVehicleController,
);
router.get("/nearme", VehicleController.getVehiclesNearMeController);

export default router;

import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import * as VehicleController from "../controllers/vehicle.controller";
import {
    addBrandSchema,
    addCategorySchema,
    addSubCategorySchema,
    addVehicleSchema,
    updateBrandSchema,
    updateCategorySchema,
    updateSubCategorySchema,
} from "../schemas/vehicle.schema";

const router = Router();

router.get("/category", VehicleController.listAllCategoryController);
router.post(
    "/category",
    verifyInput(addCategorySchema),
    VehicleController.addCategoryController,
);
router.patch(
    "/category/:id",
    verifyInput(updateCategorySchema),
    VehicleController.updateCategoryController,
);
router.delete("/category/:id", VehicleController.deleteCategoryController);

router.get("/subcategory", VehicleController.listAllSubCategoryController);
router.post(
    "/subcategory",
    verifyInput(addSubCategorySchema),
    VehicleController.addSubCategoryController,
);
router.patch(
    "/subcategory/:id",
    verifyInput(updateSubCategorySchema),
    VehicleController.updateSubCategoryController,
);
router.delete(
    "/subcategory/:id",
    VehicleController.deleteSubCategoryController,
);

router.get("/brand", VehicleController.listAllBrandController);
router.post(
    "/brand",
    verifyInput(addBrandSchema),
    VehicleController.addBrandController,
);
router.patch(
    "/brand/:id",
    verifyInput(updateBrandSchema),
    VehicleController.updateBrandController,
);
router.delete("/brand/:id", VehicleController.deleteBrandController);

router.get("/", VehicleController.listAllVehicleController);
router.post(
    "/",
    verifyInput(addVehicleSchema),
    VehicleController.addVehicleController,
);
router.get("/nearme", VehicleController.getVehiclesNearMeController);

export default router;

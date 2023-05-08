import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import {
    licenseDetailsSchema,
    updateAddressSchema,
    updateUserSchema,
} from "../schemas/user.schema";

import * as UserController from "../controllers/user.controller";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/verifymail", UserController.verifyEmailController);

router.get("/profile", UserController.getUserController);

router.get("/all", isAdmin, UserController.getAllUsersController);

router.patch(
    "/profile",
    verifyInput(updateUserSchema),
    UserController.updateUserController,
);

router.post(
    "/address",
    verifyInput(licenseDetailsSchema),
    UserController.postLicenseDetailsController,
);

router.patch(
    "/address",
    verifyInput(updateAddressSchema),
    UserController.updateAddressController,
);

router.delete("/:id", isAdmin, UserController.deleteUser);

export default router;

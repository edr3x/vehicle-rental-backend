import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import {
    licenseDetailsSchema,
    postCitizenshipSchema,
    updateAddressSchema,
    updateCitizenshipSchema,
    updateUserSchema,
} from "../schemas/user.schema";

import * as UserController from "../controllers/user.controller";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", UserController.getUserController);

router.get("/all", isAdmin, UserController.getAllUsersController);

router.get("/userdata", UserController.necessaryUserData);

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

router.post(
    "/kyc",
    verifyInput(postCitizenshipSchema),
    UserController.postCitizenshipController,
);
router.patch(
    "/kyc",
    verifyInput(updateCitizenshipSchema),
    UserController.updateCitizenshipController,
);

export default router;

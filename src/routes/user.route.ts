import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import { updateAddressSchema, updateUserSchema } from "../schemas/user.schema";

import * as UserController from "../controllers/user.controller";
import { isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile", UserController.getUserController);

router.get("/all", isAdmin, UserController.getAllUsersController);

router.patch(
    "/profile",
    verifyInput(updateUserSchema),
    UserController.updateUserController,
);

router.post("/image", UserController.uploadImageController);

router.patch(
    "/address",
    verifyInput(updateAddressSchema),
    UserController.updateAddressController,
);

export default router;

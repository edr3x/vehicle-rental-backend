import { Router } from "express";

import { verifyInput } from "../middlewares/verifyinput.middleware";

import { updateUserSchema } from "../schemas/user.schema";

import * as UserController from "../controllers/user.controller";

const router = Router();

router.patch(
    "/profile",
    verifyInput(updateUserSchema),
    UserController.updateUserController,
);

export default router;

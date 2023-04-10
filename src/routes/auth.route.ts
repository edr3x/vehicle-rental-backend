import { Router } from "express";

import * as AuthController from "../controllers/auth.controller";
import { verifyInput } from "../middlewares/verifyinput.middleware";
import {
    createUserSchema,
    sendOTPSchema,
    verifyOTPSchema,
} from "../schemas/auth.schema";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post(
    "/sendotp",
    verifyInput(sendOTPSchema),
    AuthController.sendOTPController,
);

router.post(
    "/verifyotp",
    verifyInput(verifyOTPSchema),
    AuthController.verifyOTPController,
);

router.post(
    "/register",
    isLoggedIn,
    verifyInput(createUserSchema),
    AuthController.updateUserController,
);

export default router;

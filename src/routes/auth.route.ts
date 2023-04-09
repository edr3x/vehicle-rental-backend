import { Router } from "express";

import * as AuthController from "../controllers/auth.controller";
import { verifyInput } from "../middlewares/verifyinput.middleware";
import {
    createUserSchema,
    sendOTPSchema,
    verifyOTPSchema,
} from "../schemas/auth.schema";

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
    verifyInput(createUserSchema),
    AuthController.createUserController,
);

router.get("/", (_req, res) => {
    res.send("Hello World!");
});

export default router;

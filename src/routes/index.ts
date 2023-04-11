import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.middleware";

import authRoute from "./auth.route";
import userRoute from "./user.route";

export const router = Router();

router.use("/auth", authRoute);
router.use("/user", isLoggedIn, userRoute);

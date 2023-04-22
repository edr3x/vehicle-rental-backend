import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.middleware";

import authRoute from "./auth.route";
import userRoute from "./user.route";
import vehicleRoute from "./vehicle.route";
import uploadRoute from "./upload.route";

export const router = Router();

router.use("/auth", authRoute);
router.use("/user", isLoggedIn, userRoute);
router.use("/vehicle", isLoggedIn, vehicleRoute);
router.use("/upload", isLoggedIn, uploadRoute);

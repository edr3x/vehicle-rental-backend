import { Router } from "express";

import authRoute from "./auth.route";

export const router = Router();

router.use("/auth", authRoute);

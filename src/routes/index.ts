import { Router } from "express";

import healthCheck from "./healthcheck.route";

import authRoute from "./auth.route";

export const router = Router();

router.use("/healthcheck", healthCheck);
router.use("/auth", authRoute);

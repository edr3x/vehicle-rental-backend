import { Router } from "express";

import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.get("/verifyphone/:number", AuthController.verifyPhoneController);

export default router;
